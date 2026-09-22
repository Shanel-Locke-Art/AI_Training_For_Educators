#!/usr/bin/env python3
"""Browser regression for S1 explore -> rename flow (P548)."""
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CONTENT_TYPES = {'.css':'text/css','.html':'text/html','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.mp3':'audio/mpeg','.webp':'image/webp'}
HTML = (ROOT/'index.html').read_text(encoding='utf-8').replace('<head>','<head><base href="https://promptcraft.test/">',1)

def page_for(browser, width, height):
    page = browser.new_page(viewport={'width': width, 'height': height})
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    def serve(route):
        request = route.request
        url = urlparse(request.url)
        if url.hostname != 'promptcraft.test': return route.abort()
        target = ROOT / (url.path.lstrip('/') or 'index.html')
        if request.method != 'GET' or not target.exists():
            return route.fulfill(status=404, body='missing', content_type='text/plain')
        return route.fulfill(status=200, body=target.read_bytes(), content_type=CONTENT_TYPES.get(target.suffix.lower(),'application/octet-stream'))
    page.route('**/*', serve)
    page.set_content(HTML, wait_until='domcontentloaded')
    page.wait_for_timeout(400)
    page.evaluate("""() => {
      for (const id of ['mainMenuOverlay','nameModalOverlay','audioSetupOverlay']) {
        const el = document.getElementById(id);
        if (el) { el.hidden = true; el.style.display = 'none'; el.classList.remove('visible','open'); }
      }
      pcActivateScenario(SCENARIO_INDEX.CONTENT_AVALANCHE, { playIntroduction:false });
    }""")
    page.wait_for_selector('.pc-s1-learning')
    return page, errors

def no_horizontal_overflow(page):
    size = page.evaluate('() => ({scroll:document.documentElement.scrollWidth, width:innerWidth})')
    assert size['scroll'] <= size['width'] + 1, size

def complete_explore(page):
    page.get_by_role('button', name='Food_Access_Reading').click()
    for _ in range(4):
        page.locator('.pc-s1-canvas-prev-next [data-pc-action="s1-learning-next-item"]').click()
    assert page.get_by_role('button', name='Continue to rename ›').count() == 1
    page.get_by_role('button', name='Continue to rename ›').click()
    page.wait_for_selector('.pc-s1-rename-editor')

def main():
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page, errors = page_for(browser, 1440, 960)
        assert page.locator('.pc-s1-canvas-module-row').count() == 5
        complete_explore(page)
        assert page.get_by_role('heading', name='Make the module easier to navigate').count() == 1
        assert page.locator('#pcS1RenameInput').is_visible()
        titles = ['Food Access Reading','Food Deserts Video','Module 3 Key Terms','Food Access Discussion','Module 3 Knowledge Quiz']
        for title in titles:
            page.locator('#pcS1RenameInput').fill(title)
            page.get_by_role('button', name='Save title').click()
        assert page.get_by_role('heading', name='The module names are clearer').count() == 1
        assert page.locator('.pc-s1-rename-summary li').count() == 5
        no_horizontal_overflow(page)
        assert errors == [], errors
        page.close()

        page, errors = page_for(browser, 390, 844)
        complete_explore(page)
        assert page.locator('#pcS1RenameInput').is_visible()
        no_horizontal_overflow(page)
        assert errors == [], errors
        page.close()

        page, errors = page_for(browser, 1280, 900)
        page.evaluate("() => { document.documentElement.style.fontSize='200%'; }")
        page.wait_for_timeout(100)
        no_horizontal_overflow(page)
        assert errors == [], errors
        page.close()
        browser.close()
    print('S1 Start With the Learning explore-to-rename browser contract passed.')

if __name__ == '__main__': main()
