#!/usr/bin/env python3
"""Browser regression for S1 organization-only Babbage review and Diagnosis 1 handoff."""
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CONTENT_TYPES = {
    '.css':'text/css','.html':'text/html','.js':'application/javascript','.json':'application/json',
    '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml',
    '.webp':'image/webp','.ico':'image/x-icon','.mp3':'audio/mpeg'
}
HTML = (ROOT/'index.html').read_text(encoding='utf-8').replace(
    '<head>', '<head><base href="https://promptcraft.test/">', 1
)

def main():
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))

        def serve(route):
            request = route.request
            url = urlparse(request.url)
            if url.hostname != 'promptcraft.test':
                return route.abort()
            target = ROOT / (url.path.lstrip('/') or 'index.html')
            if request.method != 'GET' or not target.exists():
                return route.fulfill(status=404, body='missing', content_type='text/plain')
            return route.fulfill(
                status=200,
                body=target.read_bytes(),
                content_type=CONTENT_TYPES.get(target.suffix.lower(), 'application/octet-stream')
            )

        page.route('**/*', serve)
        page.set_content(HTML, wait_until='domcontentloaded')
        page.wait_for_timeout(500)
        page.evaluate("""() => {
          for (const id of ['mainMenuOverlay','nameModalOverlay','audioSetupOverlay']) {
            const el = document.getElementById(id);
            if (el) { el.hidden = true; el.style.display = 'none'; el.classList.remove('visible','open'); }
          }
          pcActivateScenario(SCENARIO_INDEX.CONTENT_AVALANCHE, { playIntroduction:false });
        }""")
        page.wait_for_timeout(350)
        page.evaluate("""() => {
          pcS1LearningState.renamedTitles = [...PC_S1_DEV_RENAMES];
          pcS1LearningState.organization = {
            'food-access-reading':'prepare',
            'food-access-video':'prepare',
            'module-terms':'prepare',
            'discussion-3':'practice',
            'quiz-3':'evidence'
          };
        }""")

        page.evaluate("async () => await pcRunS1BabbageAnalysis()")
        page.wait_for_selector('.pc-s1-babbage-report')
        report = page.locator('.pc-s1-babbage-report').inner_text()
        assert 'Module-organization review' in report
        assert 'Titles you created' in report
        assert 'How you organized the learning path' in report
        assert 'What the structure communicates' in report
        assert 'Evidence gap' not in report
        assert 'Your diagnosis' not in report
        assert 'What the instructor says Maya should be able to do' not in report
        assert page.get_by_role('button', name='Continue to Diagnosis 1', exact=True).count() == 1

        page.get_by_role('button', name='Continue to Diagnosis 1', exact=True).click()
        page.wait_for_selector('.pc-s1-diagnosis-card')
        page.wait_for_timeout(600)
        assert page.get_by_role('heading', name='Diagnosis 1').count() == 1
        assert page.get_by_role('heading', name='What is the main alignment problem?').count() == 1
        assert errors == [], errors
        browser.close()
    print('S1 organization Babbage review -> Diagnosis 1 browser contract passed.')

if __name__ == '__main__':
    main()
