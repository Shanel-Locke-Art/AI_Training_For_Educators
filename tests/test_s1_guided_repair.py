#!/usr/bin/env python3
"""Regression guard for S1's shared full-width assembled repair brief."""
from __future__ import annotations
import os, shutil, sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
CONTENT_TYPES = {
    '.css':'text/css', '.html':'text/html', '.ico':'image/x-icon', '.js':'application/javascript',
    '.json':'application/json', '.mp3':'audio/mpeg', '.png':'image/png', '.jpg':'image/jpeg',
    '.jpeg':'image/jpeg', '.svg':'image/svg+xml'
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
    values = {
        'g-learners':'online first-year general education students in an 8-week asynchronous course',
        'g-issue':'students post one-sentence reactions and the discussion stops after one exchange',
        'g-interaction':'compare interpretations, use evidence, and ask a follow-up question that extends or challenges a peer',
        'g-constraints':'one initial post, two substantive replies, and replies must explain reasoning and use evidence'
    }

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=chromium, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width':1600,'height':1000})
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
        page.wait_for_timeout(600)
        state = page.evaluate("""(vals) => {
          renderGuidedBuilder(document.getElementById('inputContainer'));
          Object.entries(vals).forEach(([id,value]) => document.getElementById(id).value = value);
          onGuidedInput(document.getElementById('g-learners'));
          const grid = document.querySelector('.s1-clean-grid');
          const footer = document.querySelector('.s1-clean-repair-footer');
          const right = document.querySelector('.s1-clean-right');
          const rect = el => { const r=el.getBoundingClientRect(); return {left:r.left,right:r.right,width:r.width}; };
          return {
            grid: rect(grid), footer: rect(footer),
            previewInRight: Boolean(right.querySelector('#s1AssembledPrompt')),
            status: document.getElementById('s1BuilderStatus')?.textContent || '',
            disabled: document.getElementById('sendBtn')?.disabled,
            label: document.querySelector('.s1-clean-repair-footer .pc-guided-repair-preview-label')?.textContent || '',
            preview: document.getElementById('s1AssembledPrompt')?.textContent || ''
          };
        }""", values)
        if abs(state['footer']['left'] - state['grid']['left']) > 1 or abs(state['footer']['right'] - state['grid']['right']) > 1:
            failures.append('S1 assembled repair footer does not span both workbench columns.')
        if state['previewInRight']:
            failures.append('S1 assembled preview is still nested in the right-hand column.')
        if state['status'] != '4 of 4 ingredients ready':
            failures.append(f"Unexpected S1 readiness text: {state['status']}")
        if state['disabled']:
            failures.append('S1 Babbage review button stayed disabled after all four ingredients were ready.')
        if state['label'] != 'Your assembled repair brief':
            failures.append('S1 assembled preview label is not the new repair-brief treatment.')
        if '1. Learners + course' not in state['preview'] or '4. Constraints + success criteria' not in state['preview']:
            failures.append('S1 assembled repair brief is missing its numbered ingredient summary.')
        browser.close()

    if failures:
        print('PromptCraft S1 guided-repair test FAILED:')
        for failure in failures: print(f'- {failure}')
        return 1
    print('PromptCraft S1 guided-repair full-width preview test passed.')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
