#!/usr/bin/env python3
"""Regression test for S2's shared guided repair workspace."""
from __future__ import annotations
import os, shutil, sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
CONTENT_TYPES = {
    '.css':'text/css', '.html':'text/html', '.ico':'image/x-icon', '.js':'application/javascript',
    '.json':'application/json', '.mp3':'audio/mpeg', '.png':'image/png'
}

FIELDS = [
    ('s2RepairEvidence', 'Describe the concept difference Jordan could explain without notes.'),
    ('s2RepairEvaluation', 'Compare that evidence with what rereading helped and failed to help.'),
    ('s2RepairNextMove', 'Choose one strategy to try next and explain why the evidence supports it.'),
    ('s2RepairSuccess', 'Include specific learning evidence, a judgment about the strategy, and a justified next step.')
]

def main() -> int:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print('ERROR: Python Playwright is required.', file=sys.stderr); return 2
    chromium = os.environ.get('PROMPTCRAFT_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
    if not chromium:
        print('ERROR: Chromium was not found.', file=sys.stderr); return 2

    html=(ROOT/'index.html').read_text(encoding='utf-8').replace('<head>','<head><base href="https://promptcraft.test/">',1)
    failures=[]
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True, executable_path=chromium, args=['--no-sandbox'])
        for width,height,label in [(1600,1000,'desktop'),(853,1280,'foldable'),(540,720,'duo'),(390,844,'phone')]:
            page=browser.new_page(viewport={'width':width,'height':height})
            def handle(route, request):
                parsed=urlparse(request.url)
                if parsed.hostname!='promptcraft.test': route.abort(); return
                if request.method!='GET': route.fulfill(status=200, body='ok', content_type='text/plain'); return
                rel=parsed.path.lstrip('/') or 'index.html'; path=ROOT/rel
                if not path.is_file(): route.fulfill(status=404, body='missing', content_type='text/plain'); return
                route.fulfill(status=200, body=path.read_bytes(), content_type=CONTENT_TYPES.get(path.suffix.lower(),'application/octet-stream'))
            page.route('**/*',handle)
            page.set_content(html, wait_until='domcontentloaded'); page.wait_for_timeout(500)
            page.evaluate("""() => {
              pcScenarioHasLaunched = true;
              pcActivateScenario(SCENARIO_INDEX.METACOGNITION, { playIntroduction:false });
              const data=getS2Data();
              data.babbageDraft={
                activity_title:'What Worked This Time?',
                activity_prompt:'After you receive your grade, describe whether you think your study strategy worked. Explain how you feel about your result and what you might do next time.',
                design_rationale:'Reflection after the assignment.',
                deliberate_weakness:'no_evidence',
                likely_student_response:'I think rereading worked because my grade was better.',
                why_the_weakness_matters:'Jordan can answer without testing what he actually learned.'
              };
              renderS2RepairActivity();
            }""")
            page.wait_for_timeout(180)

            if page.locator('#s2RepairText').count(): failures.append(f'{label}: retired giant repair textarea still exists.')
            if page.locator('.pc-guided-repair-textarea').count()!=4: failures.append(f'{label}: expected four guided repair fields.')
            if page.locator('#s2RepairSubmit').is_enabled(): failures.append(f'{label}: submit enabled before all ingredients were ready.')

            for fid,value in FIELDS:
                page.locator('#'+fid).fill(value)
            page.wait_for_timeout(80)
            state=page.evaluate("""() => ({
              preview: document.getElementById('s2RepairPreview')?.innerText || '',
              status: document.getElementById('s2RepairStatus')?.innerText || '',
              enabled: !document.getElementById('s2RepairSubmit')?.disabled,
              covered: document.querySelectorAll('.pc-guided-repair-chip.covered').length,
              fieldCols: getComputedStyle(document.querySelector('.pc-guided-repair-fields')).gridTemplateColumns,
              layoutCols: getComputedStyle(document.querySelector('.pc-guided-repair-layout')).gridTemplateColumns,
              prompt: pcS2BuildRepairedReflectionPrompt(pcS2RepairPartsFromValues(getGuidedRepairValues(pcS2RepairFieldConfig().map(f=>f.id))))
            })""")
            for expected in ['Evidence —','Evaluation —','Next move —','A strong response should']:
                if expected not in state['preview']: failures.append(f'{label}: preview missing {expected}')
            if state['status']!='4 of 4 ingredients ready': failures.append(f'{label}: bad ingredient status: {state["status"]}')
            if not state['enabled']: failures.append(f'{label}: submit did not enable after four complete ingredients.')
            if state['covered']!=4: failures.append(f'{label}: not all ingredient chips marked covered.')
            if state['preview']!=state['prompt']: failures.append(f'{label}: visible preview differs from actual assembled repair prompt.')
            if width>900 and len(state['fieldCols'].split())<2: failures.append(f'{label}: wide workspace did not retain two-column guided fields.')
            if width<=900 and len(state['fieldCols'].split())!=1: failures.append(f'{label}: narrow workspace did not stack guided fields.')
            page.close()
        browser.close()

    if failures:
        print('PromptCraft S2 guided-repair test FAILED:')
        for f in failures: print('- '+f)
        return 1
    print('PromptCraft S2 guided-repair test passed across desktop, foldable, Surface Duo, and phone.')
    return 0

if __name__=='__main__': raise SystemExit(main())
