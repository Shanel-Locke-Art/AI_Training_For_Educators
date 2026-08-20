#!/usr/bin/env python3
"""End-to-end browser regression for S3 Authentic Assessment.

Runs the full S3 Evidence Lab path using the local labeled Babbage fallback so the
flow stays deterministic and does not depend on network/API availability.
"""
from __future__ import annotations

import json
import os
import shutil
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
CONTENT_TYPES = {
    '.css': 'text/css', '.html': 'text/html', '.ico': 'image/x-icon',
    '.js': 'application/javascript', '.json': 'application/json',
    '.mp3': 'audio/mpeg', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp'
}


def choose(page, selector: str, value: str) -> None:
    page.evaluate("""([selector, value]) => {
      const input = [...document.querySelectorAll(selector)].find(el => el.value === value);
      if (!input) throw new Error(`Missing choice ${selector}=${value}`);
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }""", [selector, value])


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

    html = (ROOT / 'index.html').read_text(encoding='utf-8').replace(
        '<head>', '<head><base href="https://promptcraft.test/">', 1
    )
    failures: list[str] = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=chromium, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        page_errors: list[str] = []
        page.on('pageerror', lambda exc: page_errors.append(str(exc)))

        def handle(route, request):
            parsed = urlparse(request.url)
            if parsed.hostname != 'promptcraft.test':
                route.abort()
                return
            if request.method != 'GET':
                # Deliberately force the labeled local Babbage fallback. This also
                # keeps incremental research writes from leaving the test page.
                route.fulfill(status=503, body='offline browser regression', content_type='text/plain')
                return
            rel = parsed.path.lstrip('/') or 'index.html'
            path = ROOT / rel
            if not path.is_file():
                route.fulfill(status=404, body='missing', content_type='text/plain')
                return
            route.fulfill(
                status=200,
                body=path.read_bytes(),
                content_type=CONTENT_TYPES.get(path.suffix.lower(), 'application/octet-stream')
            )

        page.route('**/*', handle)
        page.set_content(html, wait_until='domcontentloaded')
        page.wait_for_timeout(500)
        page.evaluate("""() => {
          window.PC_BABBAGE_MIN_VISIBLE_ANALYSIS_MS = 0;
          window.PC_BABBAGE_PROCESSING_HOLD_MS = 0;
          for (const id of ['mainMenuOverlay', 'nameModalOverlay', 'audioSetupOverlay']) {
            const el = document.getElementById(id);
            if (el) {
              el.hidden = true;
              el.style.display = 'none';
              el.classList.remove('visible', 'open');
            }
          }
          pcActivateScenario(SCENARIO_INDEX.ASSESSMENT, { playIntroduction: false });
          renderS3DiagnosisActivity();
          const menu = document.getElementById('mainMenuOverlay');
          if (menu) menu.hidden = true;
        }""")

        choose(page, 'input[name="s3-diagnosis"]', 'recall_only')
        page.locator('#s3DiagnosisSubmit').click()
        page.locator('[data-pc-action="s3-continue-blueprint"]').click()

        blueprint = {
            'performance': 'troubleshoot',
            'context': 'workorder',
            'evidence': 'diagnostic_record',
            'reasoning': 'justify_tradeoff',
            'criteria': 'performance_criteria',
        }
        for dimension, value in blueprint.items():
            choose(page, f'input[data-pc-evidence-dimension="{dimension}"]', value)
        page.locator('#s3BlueprintSubmit').click()

        choose(page, 'input[name="s3-prediction"]', 'criteria')
        page.locator('#s3PredictionSubmit').click()

        evidence = {'recall': 'insufficient', 'checklist': 'partial', 'diagnosis': 'sufficient'}
        for case_id, judgment in evidence.items():
            choose(page, f'input[data-pc-evidence-dimension="{case_id}"]', judgment)
        page.locator('#s3EvidenceTestSubmit').click()
        page.locator('[data-pc-action="s3-run-babbage"]').click()

        page.wait_for_function(
            "document.getElementById('babbageTerminalOutput')?.innerText.toLowerCase().includes('evidence sufficiency analysis')",
            timeout=8000,
        )
        page.get_by_role('button', name='Audit this inference').click()
        page.wait_for_selector('#s3AuditSubmit')
        choose(page, 'input[name="s3-audit"]', 'equates_completion')
        page.locator('#s3AuditSubmit').click()
        page.locator('[data-pc-action="s3-continue-revise"]').click()
        page.wait_for_selector('#s3RevisionSubmit')
        page.locator('#s3RevisionSubmit').click()
        page.wait_for_timeout(250)

        state = page.evaluate("""() => ({
          activeScenario: window.devStatus().activeScenario,
          resultText: document.getElementById('inputContainer')?.innerText || '',
          initialScore: scenarioData[SCENARIO_INDEX.ASSESSMENT].initialScore,
          revisedScore: scenarioData[SCENARIO_INDEX.ASSESSMENT].revisedScore,
          bestScore: scenarioData[SCENARIO_INDEX.ASSESSMENT].bestScore,
          evidenceFinal: scenarioData[SCENARIO_INDEX.ASSESSMENT].evidenceFinal,
          auditAttempts: scenarioData[SCENARIO_INDEX.ASSESSMENT].auditAttempts,
          analysisSource: scenarioData[SCENARIO_INDEX.ASSESSMENT].s3AnalysisSource,
          completed: scenarioCompleted[SCENARIO_INDEX.ASSESSMENT],
          bodyWidth: document.body.scrollWidth,
          viewportWidth: innerWidth
        })""")

        if state['activeScenario'] != 3:
            failures.append(f"active scenario reported {state['activeScenario']} instead of 3")
        if 'Scenario 3 result' not in state['resultText']:
            failures.append('shared S3 result panel was not reached')
        if state['initialScore'] != 5 or state['revisedScore'] != 5 or state['bestScore'] != 5:
            failures.append(f"unexpected score state: {state['initialScore']}/{state['revisedScore']}/{state['bestScore']}")
        if not state['completed']:
            failures.append('S3 did not mark completion')
        if state['analysisSource'] != 'fallback':
            failures.append(f"expected labeled fallback analysis, got {state['analysisSource']!r}")
        if [item.get('correct') for item in state['evidenceFinal']] != [True, True, True]:
            failures.append('student-evidence judgments were not retained as correct')
        if not state['auditAttempts'] or not state['auditAttempts'][-1].get('correct'):
            failures.append('Babbage audit was not retained as correct')
        if state['bodyWidth'] > state['viewportWidth'] + 1:
            failures.append(f"horizontal overflow detected: {state['bodyWidth']} > {state['viewportWidth']}")
        failures.extend(f'page error: {error}' for error in page_errors)

        page.close()
        browser.close()

    if failures:
        print('PromptCraft S3 runtime-flow test FAILED:')
        for failure in failures:
            print('- ' + failure)
        return 1

    print('PromptCraft S3 Authentic Assessment end-to-end fallback flow passed.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
