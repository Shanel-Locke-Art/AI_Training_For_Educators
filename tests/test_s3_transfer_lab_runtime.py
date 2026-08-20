#!/usr/bin/env python3
from __future__ import annotations
import os, shutil, sys
from pathlib import Path
from urllib.parse import urlparse

ROOT=Path(__file__).resolve().parents[1]
CONTENT_TYPES={'.css':'text/css','.html':'text/html','.ico':'image/x-icon','.js':'application/javascript','.json':'application/json','.mp3':'audio/mpeg','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'}

def main():
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print('ERROR: Playwright required', file=sys.stderr); return 2
    chromium=os.environ.get('PROMPTCRAFT_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
    if not chromium:
        print('ERROR: Chromium not found', file=sys.stderr); return 2
    html=(ROOT/'index.html').read_text(encoding='utf-8').replace('<head>','<head><base href="https://promptcraft.test/">',1)
    failures=[]
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True, executable_path=chromium, args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1440,'height':1000})
        errors=[]; page.on('pageerror', lambda e: errors.append(str(e)))
        def handle(route, request):
            parsed=urlparse(request.url)
            if parsed.hostname=='script.google.com':
                route.fulfill(status=200, body='{}', content_type='text/plain'); return
            if parsed.hostname!='promptcraft.test':
                route.abort(); return
            if request.method!='GET':
                route.fulfill(status=200, body='{}', content_type='application/json'); return
            rel=parsed.path.lstrip('/') or 'index.html'; path=ROOT/rel
            if rel=='index.html': route.fulfill(status=200, body=html, content_type='text/html'); return
            if path.is_file(): route.fulfill(status=200, body=path.read_bytes(), content_type=CONTENT_TYPES.get(path.suffix,'application/octet-stream')); return
            route.fulfill(status=404, body='missing', content_type='text/plain')
        page.route('**/*', handle)
        page.set_content(html, wait_until='domcontentloaded'); page.set_default_timeout(3000)
        page.evaluate("""() => {
          closeMainMenu(); pcScenarioHasLaunched=true;
          pcActivateScenario(SCENARIO_INDEX.ASSESSMENT,{playIntroduction:false});
          const d=getS3Data(); d.initialScore=4; d.revisedScore=5; d.currentScore=5; d.bestScore=5;
          d.blueprintInitial={context:'county_brief',performance:'recommend_response',evidence:'decision_record',reasoning:'justify_tradeoff',criteria:'performance_criteria'};
          d.blueprintFinal={...d.blueprintInitial}; d.evidenceStatement='Evidence statement'; d.repairText='Change a meaningful constraint';
          d.babbageEvidenceAnalysis={...S3_LOCAL_BABBAGE_ANALYSIS};
          completeS3CaseAndStartTransfer();
        }""")
        page.wait_for_timeout(80)
        if page.locator('#s3TransferAssessment').count()!=1: failures.append('Normal S3 ending did not enter the Transfer Lab input.')
        skip=page.locator('[data-pc-action="s3-transfer-back-result"]')
        if skip.count()!=1 or 'Skip Transfer Lab' not in skip.inner_text(): failures.append('Transfer Lab skip-to-result action is missing or unclear.')
        page.fill('#s3TransferContext','Introductory psychology course')
        page.fill('#s3TransferOutcome','Apply developmental theory to a realistic adolescent case and justify an interpretation using evidence.')
        raw='Write a three-page paper defining five developmental theories and explain the major features of each theory.'
        page.fill('#s3TransferAssessment',raw)
        page.fill('#s3TransferCriteria','Accurate definitions, organization, and use of terminology.')
        page.evaluate('submitS3TransferInput()'); page.wait_for_timeout(60)
        if page.locator('input[name="s3TransferEvidence"]').count()!=4: failures.append('Human diagnosis evidence choices missing.')
        page.evaluate("""() => { document.querySelector('input[name=\"s3TransferEvidence\"][value=\"know\"]').checked=true; document.querySelector('input[name=\"s3TransferEvidence\"][value=\"explain\"]').checked=true; document.querySelector('input[name=\"s3TransferGap\"][value=\"performance\"]').checked=true; }""")
        page.evaluate('window.PC_BABBAGE_MIN_VISIBLE_ANALYSIS_MS=0')
        page.evaluate('submitS3TransferDiagnosis()'); page.wait_for_timeout(500)
        if page.locator('#babbageTerminalOutput .analysis-report').count()!=1: failures.append('Transfer Babbage report did not render.')
        if page.locator('.vn-return-btn.terminal-return').count():
            page.evaluate("document.querySelector('.vn-return-btn.terminal-return')?.click()"); page.wait_for_timeout(120)
        if page.locator('#s3TransferSituation').count()!=1: failures.append('Transfer revision workbench did not render after Babbage.')
        # Fallback suggestions should prefill all five fields.
        vals=page.evaluate("""() => ['s3TransferSituation','s3TransferPerformance','s3TransferEvidence','s3TransferReasoning','s3TransferCriteria'].map(id=>document.getElementById(id)?.value||'')""")
        if not all(len(v)>=8 for v in vals): failures.append(f'Revision dimensions were not prefilled: {vals}')
        page.evaluate('submitS3TransferRevision()'); page.wait_for_timeout(80)
        comp=page.locator('.pc-transfer-comparison').inner_text() if page.locator('.pc-transfer-comparison').count() else ''
        if 'ORIGINAL ASSESSMENT' not in comp or 'REVISED ASSESSMENT DESIGN' not in comp: failures.append('Comparison screen missing original/revised structure.')
        page.evaluate('renderS3TransferShare()'); page.wait_for_timeout(60)
        share=page.locator('#s3TransferIdeaSummary').input_value() if page.locator('#s3TransferIdeaSummary').count() else ''
        if not share or len(share)<120: failures.append('Ideas Wall summary was not generated.')
        if raw in share: failures.append('Raw original assessment leaked into Ideas Wall summary.')
        if 'Needs Review' not in page.locator('.pc-transfer-share-preview').inner_text(): failures.append('Moderation status is not explained.')
        page.evaluate('submitS3TransferIdea()'); page.wait_for_timeout(150)
        feedback=page.locator('#s3TransferShareFeedback').inner_text()
        if 'Submitted for moderation' not in feedback: failures.append(f'Ideas Wall submission feedback incorrect: {feedback}')
        meta=page.evaluate('() => getS3Data().transferLabMetadata')
        if not meta or not meta.get('ideaSubmitted'): failures.append(f'Transfer research metadata missing share state: {meta}')
        if any(k in str(meta).lower() for k in ['three-page paper','developmental theories']): failures.append('Raw assessment leaked into research metadata.')
        if errors: failures.append(f'Browser errors: {errors}')
        browser.close()
    if failures:
        print('PromptCraft S3 Transfer Lab runtime test FAILED:')
        for f in failures: print('- '+f)
        return 1
    print('PromptCraft S3 Transfer Lab runtime test passed.')
    return 0

if __name__=='__main__': raise SystemExit(main())
