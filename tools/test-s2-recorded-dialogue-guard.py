#!/usr/bin/env python3
"""Regression check: S2 Recorded Dialogue only advances through its Continue button."""
from __future__ import annotations
import os, shutil, sys
from pathlib import Path
from urllib.parse import urlparse
ROOT=Path(__file__).resolve().parents[1]
CONTENT_TYPES={'.css':'text/css','.html':'text/html','.ico':'image/x-icon','.js':'application/javascript','.json':'application/json','.mp3':'audio/mpeg','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'}

def main()->int:
    try: from playwright.sync_api import sync_playwright
    except ImportError:
        print('ERROR: Python Playwright is required.',file=sys.stderr); return 2
    chromium=os.environ.get('PROMPTCRAFT_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
    if not chromium:
        print('ERROR: Chromium was not found.',file=sys.stderr); return 2
    html=(ROOT/'index.html').read_text(encoding='utf-8').replace('<head>','<head><base href="https://promptcraft.test/">',1)
    failures=[]
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=chromium,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1600,'height':1000})
        def handle(route,request):
            parsed=urlparse(request.url)
            if parsed.hostname!='promptcraft.test': route.abort(); return
            if request.method!='GET': route.fulfill(status=200,body='ok',content_type='text/plain'); return
            rel=parsed.path.lstrip('/') or 'index.html'; path=ROOT/rel
            if not path.is_file(): route.fulfill(status=404,body='missing',content_type='text/plain'); return
            route.fulfill(status=200,body=path.read_bytes(),content_type=CONTENT_TYPES.get(path.suffix.lower(),'application/octet-stream'))
        page.route('**/*',handle)
        page.set_content(html,wait_until='domcontentloaded'); page.wait_for_timeout(450)
        page.evaluate("""() => {
          const menu=document.getElementById('mainMenuOverlay'); if(menu) menu.style.display='none';
          pcScenarioHasLaunched=true;
          pcActivateScenario(SCENARIO_INDEX.METACOGNITION,{playIntroduction:false});
          const d=getS2Data(); d.lastEvidenceFeedback={heading:'Evidence created.',copy:'Jordan now has something observable to inspect.',tone:'strong'};
          pcShowS2JordanRecordedDialogue('evidence_check',{heading:'Evidence created.',copy:'test',tone:'strong'});
        }""")
        page.wait_for_timeout(120)
        before=page.evaluate("""() => ({
          explicit:document.getElementById('vnDialogue').dataset.pcExplicitAction,
          role:document.getElementById('vnDialogue').getAttribute('role'),
          text:document.getElementById('vnText').textContent.trim(),
          button:!!document.querySelector('.prediction-continue-btn'),
          overlay:document.getElementById('vnOverlay').classList.contains('active')
        })""")
        page.locator('#vnDialogue .pc-feedback-message').click(position={'x':20,'y':20})
        page.wait_for_timeout(120)
        after_click=page.evaluate("""() => ({
          explicit:document.getElementById('vnDialogue').dataset.pcExplicitAction,
          text:document.getElementById('vnText').textContent.trim(),
          button:!!document.querySelector('.prediction-continue-btn'),
          overlay:document.getElementById('vnOverlay').classList.contains('active')
        })""")
        if before['explicit']!='true' or before['role']!='group' or not before['button']:
            failures.append(f'Recorded Dialogue did not enter explicit-action mode: {before}')
        if after_click['text']!=before['text'] or not after_click['button'] or not after_click['overlay']:
            failures.append(f'Clicking the dialogue surface consumed the scene: before={before}, after={after_click}')
        page.locator('.prediction-continue-btn').click()
        page.wait_for_timeout(150)
        after_button=page.evaluate("""() => ({
          explicit:document.getElementById('vnDialogue').dataset.pcExplicitAction || '',
          role:document.getElementById('vnDialogue').getAttribute('role'),
          speaker:document.getElementById('vnSpeaker').textContent.trim(),
          overlay:document.getElementById('vnOverlay').classList.contains('active')
        })""")
        if after_button['explicit'] or after_button['role']!='button' or after_button['speaker']!='Professor Pixel':
            failures.append(f'Continue did not restore normal VN interaction before the next beat: {after_button}')
        page.close(); browser.close()
    if failures:
        print('PromptCraft S2 recorded-dialogue guard FAILED:')
        for f in failures: print('- '+f)
        return 1
    print('PromptCraft S2 recorded-dialogue guard passed: dialogue surface is inert and Continue owns the transition.')
    return 0
if __name__=='__main__': raise SystemExit(main())
