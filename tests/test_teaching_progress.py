from pathlib import Path
import shutil
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / 'index.html').read_text(encoding='utf-8').replace(
    '<head>', '<head><base href="https://promptcraft.test/">', 1
)
CONTENT_TYPES = {
    '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.webp': 'image/webp', '.mp3': 'audio/mpeg',
    '.json': 'application/json'
}

def main():
    chromium = shutil.which('chromium') or shutil.which('google-chrome')
    assert chromium, 'Chromium is required for progress regression test.'
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=chromium, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1280, 'height': 800})

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
        page.set_content(HTML, wait_until='domcontentloaded')
        page.wait_for_timeout(600)
        page.evaluate("""() => {
          const menu = document.getElementById('mainMenuOverlay');
          if (menu) { menu.classList.remove('visible'); menu.setAttribute('aria-hidden', 'true'); }
        }""")

        assert page.locator('#levelTag').inner_text() == 'Teaching Explorer'
        assert page.locator('#xpLabel').inner_text() == '0 / 100 XP'
        assert page.locator('#progressHeaderLevel').inner_text() == 'LEVEL 1'
        assert page.locator('.pc-progress-engine-mini').count() == 0
        hud_styles = page.evaluate("""() => {
          const q = (selector) => getComputedStyle(document.querySelector(selector));
          return {
            kickerFamily: q('.pc-progress-summary-kicker').fontFamily,
            levelFamily: q('#levelTag').fontFamily,
            xpFamily: q('#xpLabel').fontFamily,
            viewFamily: q('.pc-progress-view-label').fontFamily,
            logoWidth: parseFloat(q('.pc-app-header .logo-icon').width),
            trackHeight: parseFloat(q('.pc-progress-menu .xp-track').height)
          };
        }""")
        assert 'Nunito' in hud_styles['kickerFamily']
        assert hud_styles['kickerFamily'] == hud_styles['levelFamily'] == hud_styles['xpFamily'] == hud_styles['viewFamily']
        assert hud_styles['logoWidth'] >= 44
        assert hud_styles['trackHeight'] >= 12
        assert page.evaluate('() => awardScenarioScoreXP(0, 4, 5)') == 40
        assert page.locator('#xpLabel').inner_text() == '40 / 100 XP'
        assert page.evaluate("() => document.getElementById('xpFill').style.width") == '40%'
        assert page.evaluate('() => awardScenarioCompletionXP(0)') == 60
        assert page.locator('#levelTag').inner_text() == 'Engagement Facilitator'
        assert page.locator('#progressHeaderLevel').inner_text() == 'LEVEL 2'
        assert page.locator('#xpLabel').inner_text() == '0 / 100 XP'
        assert page.evaluate('() => awardScenarioScoreXP(0, 4, 5)') == 0
        assert page.evaluate('() => awardScenarioCompletionXP(0)') == 0
        assert page.evaluate('() => awardScenarioScoreXP(0, 5, 5)') == 10
        assert page.locator('#xpLabel').inner_text() == '10 / 100 XP'

        page.evaluate("document.getElementById('pcProgressMenu').open = true")
        page.wait_for_timeout(80)
        assert page.locator('.pc-progress-engine-figure img').get_attribute('src') == 'assets/images/ui/babbage-engine.webp'
        assert page.locator('#progressScenarioText').inner_text() == '1 of 8 scenarios completed'
        assert page.evaluate('() => document.documentElement.scrollWidth <= document.documentElement.clientWidth')
        browser.close()
    print('Teaching progress regression passed.')

if __name__ == '__main__':
    main()
