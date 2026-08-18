#!/usr/bin/env python3
"""Regression checks for S2 full-width audit feedback and S1-style final result reuse."""
from __future__ import annotations
import os, shutil, sys
from pathlib import Path
from urllib.parse import urlparse

ROOT=Path(__file__).resolve().parents[1]
CONTENT_TYPES={
    '.css':'text/css','.html':'text/html','.ico':'image/x-icon','.js':'application/javascript',
    '.json':'application/json','.mp3':'audio/mpeg','.png':'image/png','.jpg':'image/jpeg',
    '.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp'
}

def main()->int:
    try:
        from playwright.sync_api import sync_playwright
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
        page.evaluate("""() => { const menu=document.getElementById('mainMenuOverlay'); if(menu) menu.style.display='none'; }""")

        # Audit feedback belongs to the full-width step shell, not the right-hand card.
        page.evaluate("""() => {
          pcScenarioHasLaunched=true;
          pcActivateScenario(SCENARIO_INDEX.METACOGNITION,{playIntroduction:false});
          const d=getS2Data(); d.babbageDraft={...S2_LOCAL_DRAFT_FALLBACK};
          renderS2AuditActivity();
          const i=document.querySelector('input[name="s2-audit"][value="no_evidence"]');
          i.checked=true; i.dispatchEvent(new Event('change',{bubbles:true})); submitS2Audit();
        }""")
        page.wait_for_timeout(80)
        audit=page.evaluate("""() => {
          const layout=document.querySelector('.pc-s2-audit-layout').getBoundingClientRect();
          const feedback=document.getElementById('s2AuditFeedback').getBoundingClientRect();
          const task=document.querySelector('.pc-s2-audit-layout .pc-activity-task').getBoundingClientRect();
          return {
            layoutWidth:layout.width, feedbackWidth:feedback.width,
            leftDelta:Math.abs(layout.left-feedback.left), rightDelta:Math.abs(layout.right-feedback.right),
            feedbackTop:feedback.top, layoutBottom:layout.bottom, taskWidth:task.width,
            parent:document.getElementById('s2AuditFeedback').parentElement.className
          };
        }""")
        if audit['feedbackWidth'] < audit['layoutWidth']-4 or audit['leftDelta']>2 or audit['rightDelta']>2:
            failures.append(f'Audit feedback does not span the full two-column workspace: {audit}')
        if audit['feedbackTop'] <= audit['layoutBottom'] or 'pc-scenario-stage' not in audit['parent']:
            failures.append(f'Audit feedback is still trapped inside the two-column activity instead of below it: {audit}')
        if audit['feedbackWidth'] <= audit['taskWidth']*1.4:
            failures.append(f'Audit feedback is not materially wider than the right task column: {audit}')

        # S2 completion must literally consume the S1 result-page visual owner classes.
        page.evaluate("""() => {
          const d=getS2Data();
          d.babbageDraft={...S2_LOCAL_DRAFT_FALLBACK};
          d.babbageReview={...S2_LOCAL_REVIEW_FALLBACK};
          renderS2FinalComparison();
        }""")
        page.wait_for_timeout(80)
        final=page.evaluate("""() => ({
          resultMode:document.body.classList.contains('s1-result-active'),
          sharedMode:document.body.classList.contains('pc-shared-result-active'),
          activityMode:document.body.classList.contains('pc-scenario-activity-active'),
          cardClass:document.querySelector('.pc-shared-result-card')?.className || '',
          controlsClass:document.querySelector('#inputContainer .s1-result-controls')?.className || '',
          title:document.querySelector('.pc-shared-result-card .s1-result-title')?.textContent?.trim() || '',
          review:!!document.querySelector('.pc-shared-result-card .s1-babbage-revision-review'),
          reference:!!document.querySelector('.pc-shared-result-card .s1-clean-reference'),
          oldComparison:!!document.querySelector('.pc-s2-before-after'),
          nextButton:document.querySelector('[data-pc-action="navigate-next"][data-pc-scenario-index="2"]')?.textContent?.trim() || ''
        })""")
        if not final['resultMode'] or not final['sharedMode'] or final['activityMode']:
            failures.append(f'S2 final did not enter the shared S1 result-page mode: {final}')
        if 's1-result-card' not in final['cardClass'] or 's1-result-card-focused' not in final['cardClass']:
            failures.append(f'S2 final is not using the S1 result card visual owner: {final}')
        if not final['controlsClass'] or not final['review'] or not final['reference']:
            failures.append(f'S2 final is missing S1 result-page components: {final}')
        if final['oldComparison']:
            failures.append('Old bespoke S2 before/after completion grid is still rendering.')
        if final['title']!='Repaired Reflection Activity' or not final['nextButton'].startswith('Next scenario'):
            failures.append(f'S2 result content/actions are incomplete: {final}')

        page.close(); browser.close()

    if failures:
        print('PromptCraft S2 final reuse regression FAILED:')
        for item in failures: print('- '+item)
        return 1
    print('PromptCraft S2 final reuse regression passed: full-width audit feedback and S1-owned completion layout.')
    return 0

if __name__=='__main__': raise SystemExit(main())
