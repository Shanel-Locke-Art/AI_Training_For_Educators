#!/usr/bin/env python3
"""Regression test for S2's learner-visible Babbage draft construction flow."""
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
        print('ERROR: Python Playwright is required.', file=sys.stderr)
        return 2
    chromium = os.environ.get('PROMPTCRAFT_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
    if not chromium:
        print('ERROR: Chromium was not found.', file=sys.stderr)
        return 2

    html = (ROOT/'index.html').read_text(encoding='utf-8').replace('<head>', '<head><base href="https://promptcraft.test/">', 1)
    failures: list[str] = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=chromium, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width':1280,'height':800})

        def handle(route, request):
            parsed = urlparse(request.url)
            if parsed.hostname != 'promptcraft.test':
                route.abort(); return
            if request.method != 'GET':
                route.fulfill(status=200, body='ok', content_type='text/plain'); return
            relative = parsed.path.lstrip('/') or 'index.html'
            path = ROOT / relative
            if not path.is_file():
                route.fulfill(status=404, body='missing', content_type='text/plain'); return
            route.fulfill(status=200, body=path.read_bytes(), content_type=CONTENT_TYPES.get(path.suffix.lower(), 'application/octet-stream'))

        page.route('**/*', handle)
        page.set_content(html, wait_until='domcontentloaded')
        page.wait_for_timeout(700)

        state = page.evaluate("""() => {
          pcScenarioHasLaunched = true;
          pcActivateScenario(SCENARIO_INDEX.METACOGNITION, { playIntroduction:false });
          const data = getS2Data();
          data.diagnosisFinal = ['evidence'];
          data.evidenceFinal = ['grade_compare'];
          data.thinkingMove = 'evaluate';
          data.aiProvider = 'test-live';
          const draft = {
            activity_title:'Strategy Check',
            activity_prompt:'After your grade, say whether your strategy worked and what you will do next.',
            design_rationale:'The activity asks Jordan to evaluate his study strategy after the assignment.',
            deliberate_weakness:'no_evidence',
            likely_student_response:'My grade went up, so rereading worked and I will reread next time.',
            why_the_weakness_matters:'Jordan can judge from the grade without evidence from learning.'
          };
          data.babbageDraft = draft;
          showClaudeConsultOverlay('Reflection design', { heading:'Your choices are going to Babbage.', body:'Shared draft flow test.' });
          showS2DraftAnalysisInTerminal(data, draft);
          const output = document.getElementById('claudeTerminalOutput');
          return {
            analyzingImmediately: Boolean(output?.querySelector('.pc-analyzing-progress')),
            reportImmediately: Boolean(output?.querySelector('.analysis-report')),
            auditBeforeClose: Boolean(document.getElementById('s2AuditTitle')),
            requestText: pcS2BuildDraftRequestText(pcS2GetDraftIngredients(data))
          };
        }""")

        if not state['analyzingImmediately']:
            failures.append('S2 skipped the shared Babbage analyzing/loading presentation.')
        if state['reportImmediately']:
            failures.append('S2 replaced the loading presentation with the report before the response handoff could be seen.')
        if state['auditBeforeClose']:
            failures.append('Decision 4 appeared before the terminal construction report was closed.')

        page.wait_for_timeout(600)
        report_state = page.evaluate("""() => {
          const output = document.getElementById('claudeTerminalOutput');
          const cards = [...(output?.querySelectorAll('.analysis-card') || [])];
          const overflowCards = cards.filter(card => card.scrollHeight > card.clientHeight + 3).map(card => card.className);
          const rects = cards.map(card => ({ cls: card.className, rect: card.getBoundingClientRect() }));
          const overlaps = [];
          for (let i = 0; i < rects.length; i += 1) {
            for (let j = i + 1; j < rects.length; j += 1) {
              const a = rects[i].rect, b = rects[j].rect;
              const ix = Math.max(0, Math.min(a.right,b.right) - Math.max(a.left,b.left));
              const iy = Math.max(0, Math.min(a.bottom,b.bottom) - Math.max(a.top,b.top));
              if (ix > 2 && iy > 2) overlaps.push([rects[i].cls, rects[j].cls]);
            }
          }
          return {
            text: output?.innerText || '',
            report: Boolean(output?.querySelector('.analysis-report')),
            cardCount: cards.length,
            overflowCards,
            overlaps
          };
        }""")

        required = [
            'Evidence of what the strategy actually did', 'Compare the new grade',
            'I got an 84 instead of a 76', 'Evaluate a strategy', 'Strategy Check',
            'My grade went up', 'Does Jordan\'s likely response actually show'
        ]
        if not report_state['report']:
            failures.append('S2 did not reuse the shared S1 analysis-report terminal component.')
        if report_state['cardCount'] != 6:
            failures.append(f'S2 report should use S1\'s six semantic analysis slots; found {report_state["cardCount"]}.')
        for expected in required:
            if expected not in report_state['text']:
                failures.append(f'Terminal report missing: {expected}')
        for expected in required[:4]:
            if expected not in state['requestText']:
                failures.append(f'Babbage request does not use visible ingredient: {expected}')
        if report_state['overlaps']:
            failures.append(f'Analysis cards overlap: {report_state["overlaps"]}')
        if report_state['overflowCards']:
            failures.append(f'Analysis card content overflows its card: {report_state["overflowCards"]}')

        page.evaluate('closeClaudeConsultOverlay()')
        page.wait_for_timeout(520)
        if page.locator('#s2AuditTitle').count() != 1:
            failures.append('Closing the terminal report did not hand off to Decision 4.')
        browser.close()

    if failures:
        print('PromptCraft S2 draft-flow test FAILED:')
        for failure in failures: print(f'- {failure}')
        return 1
    print('PromptCraft S2 draft-flow test passed.')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
