#!/usr/bin/env python3
"""Regression checks for S2 radio parity, balanced audit panels, DEV autofill, and AI provenance."""
from __future__ import annotations
import os, shutil, sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
CONTENT_TYPES = {
    '.css':'text/css', '.html':'text/html', '.ico':'image/x-icon', '.js':'application/javascript',
    '.json':'application/json', '.mp3':'audio/mpeg', '.png':'image/png'
}

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
        page=browser.new_page(viewport={'width':1600,'height':1000})
        def handle(route, request):
            parsed=urlparse(request.url)
            if parsed.hostname!='promptcraft.test': route.abort(); return
            if request.method!='GET': route.fulfill(status=200, body='ok', content_type='text/plain'); return
            rel=parsed.path.lstrip('/') or 'index.html'; path=ROOT/rel
            if not path.is_file(): route.fulfill(status=404, body='missing', content_type='text/plain'); return
            route.fulfill(status=200, body=path.read_bytes(), content_type=CONTENT_TYPES.get(path.suffix.lower(),'application/octet-stream'))
        page.route('**/*',handle)
        page.set_content(html, wait_until='domcontentloaded'); page.wait_for_timeout(500)

        # Decision 1 keeps the established 28px outer radio while the selected
        # green center is deliberately more visible (12px).
        page.evaluate("""() => {
          pcScenarioHasLaunched = true;
          pcActivateScenario(SCENARIO_INDEX.METACOGNITION, { playIntroduction:false });
          renderS2DiagnosisActivity();
          const input=document.querySelector('input[name="s2-diagnosis"]');
          input.checked=true;
          input.dispatchEvent(new Event('change',{bubbles:true}));
        }""")
        page.wait_for_timeout(100)
        marker=page.evaluate("""() => {
          const el=document.querySelector('.s2-loop-puzzle .pc-choice-marker');
          const cs=getComputedStyle(el);
          const after=getComputedStyle(el,'::after');
          return {w:parseFloat(cs.width),h:parseFloat(cs.height),innerW:parseFloat(after.width),innerH:parseFloat(after.height),innerBg:after.backgroundColor};
        }""")
        if abs(marker['w']-28) > 1 or abs(marker['h']-28) > 1:
            failures.append(f'Decision 1 outer marker changed size: {marker}')
        if marker['innerW'] < 11 or marker['innerH'] < 11 or marker['innerBg'] in ('rgba(0, 0, 0, 0)','transparent'):
            failures.append(f'Decision 1 selected center is not prominent enough: {marker}')

        # Decision 4 should use an equal two-column split on desktop.
        page.evaluate("""() => {
          const data=getS2Data();
          data.babbageDraft={...S2_LOCAL_DRAFT_FALLBACK};
          renderS2AuditActivity();
        }""")
        page.wait_for_timeout(100)
        cols=page.evaluate("""() => {
          const layout=document.querySelector('.pc-s2-audit-layout');
          const kids=[...layout.children].map(el=>el.getBoundingClientRect().width);
          return {grid:getComputedStyle(layout).gridTemplateColumns,widths:kids};
        }""")
        if len(cols['widths']) != 2 or abs(cols['widths'][0]-cols['widths'][1]) > 4:
            failures.append(f'Audit columns are not balanced: {cols}')
        heights=page.evaluate("""() => {
          const left=document.querySelector('.pc-s2-audit-layout .pc-s2-babbage-draft')?.getBoundingClientRect();
          const right=document.querySelector('.pc-s2-audit-layout > .pc-activity-task')?.getBoundingClientRect();
          return {left:left?.height||0,right:right?.height||0};
        }""")
        if min(heights['left'],heights['right']) <= 0 or abs(heights['left']-heights['right']) > 4:
            failures.append(f'Audit panels do not share the same desktop height: {heights}')

        audit_marker=page.evaluate("""() => {
          const input=document.querySelector('input[name="s2-audit"]');
          input.checked=true; input.dispatchEvent(new Event('change',{bubbles:true}));
          const el=input.closest('.pc-choice-card').querySelector('.pc-choice-marker');
          const cs=getComputedStyle(el); const after=getComputedStyle(el,'::after');
          return {text:el.textContent.trim(), w:parseFloat(cs.width), h:parseFloat(cs.height), innerW:parseFloat(after.width), innerBg:after.backgroundColor};
        }""")
        if audit_marker['text'] or abs(audit_marker['w']-marker['w']) > 1 or abs(audit_marker['h']-marker['h']) > 1:
            failures.append(f'Audit choice marker does not match Decision 1 radio treatment: {audit_marker} vs {marker}')
        if audit_marker['innerW'] < 11 or audit_marker['innerBg'] in ('rgba(0, 0, 0, 0)','transparent'):
            failures.append(f'Audit selected radio center is not visible: {audit_marker}')

        # S2 DEV fill should land on Decision 5 with all four fields populated.
        page.evaluate("() => window.devFillScenario(1)")
        page.wait_for_timeout(350)
        dev=page.evaluate("""() => ({
          active: scenarioIndex,
          repair: !!document.getElementById('s2RepairTitle'),
          fields: ['s2RepairEvidence','s2RepairEvaluation','s2RepairNextMove','s2RepairSuccess'].map(id=>document.getElementById(id)?.value || ''),
          enabled: !document.getElementById('s2RepairSubmit')?.disabled,
          audit: getS2Data().auditAttempts?.at(-1)?.selection || ''
        })""")
        if dev['active'] != 1 or not dev['repair']:
            failures.append(f'S2 DEV fill did not land on the guided repair workspace: {dev}')
        if any(len(v) < 12 for v in dev['fields']):
            failures.append('S2 DEV fill did not populate all four guided repair fields.')
        if not dev['enabled']:
            failures.append('S2 DEV fill left the review button disabled.')
        if dev['audit'] != 'no_evidence':
            failures.append(f'S2 DEV fill did not create a coherent audit state: {dev["audit"]}')
        if page.locator('[data-pc-action="dev-fill-scenario"][data-pc-scenario-index="1"]').count() < 2:
            failures.append('S2 fill shortcut is missing from desktop or mobile DEV controls.')

        # Fallback review must preserve the learner's assembled repair and label
        # itself honestly; live review must identify itself as live.
        provenance=page.evaluate("""() => {
          const d=getS2Data();
          d.repairParts={evidence:'e',evaluation:'v',nextMove:'n',success:'s'};
          const repair='CUSTOM LEARNER REPAIR THAT MUST SURVIVE FALLBACK';
          const fallback=pcS2BuildLocalReviewFallback(d,repair);
          d.babbageReview=fallback; d.s2ReviewSource='fallback'; d.aiProvider='local-fallback'; d.aiModel='promptcraft-local-fallback';
          renderS2FinalComparison();
          const fallbackEyebrow=document.querySelector('.pc-shared-result-card .s1-result-eyebrow')?.textContent?.trim() || document.querySelector('.pc-shared-result-card')?.textContent || '';
          const fallbackBody=document.querySelector('.pc-shared-result-card .s1-result-response')?.textContent || document.querySelector('.pc-shared-result-card')?.textContent || '';
          d.babbageReview={...fallback,revised_activity:'LIVE REPAIRED ACTIVITY'}; d.s2ReviewSource='live'; d.aiProvider='openai'; d.aiModel='test-model';
          renderS2FinalComparison();
          const liveText=document.querySelector('.pc-shared-result-card')?.textContent || '';
          return {fallbackRevised:fallback.revised_activity,fallbackEyebrow,fallbackBody,liveText};
        }""")
        if provenance['fallbackRevised'] != 'CUSTOM LEARNER REPAIR THAT MUST SURVIVE FALLBACK':
            failures.append(f'Fallback review replaced the learner repair: {provenance}')
        if 'Demonstration fallback review' not in provenance['fallbackEyebrow'] or 'CUSTOM LEARNER REPAIR' not in provenance['fallbackBody']:
            failures.append(f'Fallback provenance is not visible on the final screen: {provenance}')
        if 'Live Babbage review' not in provenance['liveText'] or 'test-model' not in provenance['liveText']:
            failures.append(f'Live review provenance is not visible on the final screen: {provenance}')

        page.close(); browser.close()

    if failures:
        print('PromptCraft S2 menu/dev regression FAILED:')
        for f in failures: print('- '+f)
        return 1
    print('PromptCraft S2 menu/dev regression passed: shared radio parity, equal-height audit panels, S2 DEV autofill, and explicit AI/fallback provenance.')
    return 0

if __name__=='__main__': raise SystemExit(main())
