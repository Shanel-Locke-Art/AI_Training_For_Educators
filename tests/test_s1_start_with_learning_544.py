#!/usr/bin/env python3
"""Browser regression for S1 Start With the Learning exploration slice."""
from pathlib import Path
from urllib.parse import urlparse
import re
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CONTENT_TYPES = {'.css':'text/css','.html':'text/html','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.mp3':'audio/mpeg'}
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
    page.wait_for_timeout(500)
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

def main():
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page, errors = page_for(browser, 1440, 960)
        assert page.get_by_role('heading', name="Explore Maya's module").count() == 1
        assert page.locator('.pc-s1-canvas-module-row').count() == 5
        assert '/maya/neutral.png' in page.locator('.pc-s1-maya-art').get_attribute('src')
        assert page.get_by_role('button', name='Continue', exact=True).is_disabled()
        page.get_by_role('button', name=re.compile('Food_Access_Reading')).click()
        for phrase in ['reading explains','short video','mostly vocabulary','discussion asks','quiz checks']:
            assert re.search(phrase, page.locator('.pc-s1-maya-quote').inner_text(), re.I)
            if phrase != 'quiz checks': page.get_by_role('button', name='Next', exact=True).click()
        page.get_by_role('button', name='Modules', exact=True).first.click()
        assert page.locator('.pc-s1-canvas-module-row.is-viewed').count() == 5
        assert not page.get_by_role('button', name='Continue', exact=True).is_disabled()
        page.get_by_role('button', name='Continue', exact=True).click()
        assert page.get_by_role('heading', name='Exploration complete').count() == 1
        page.get_by_role('button', name="Review Maya's module", exact=True).click()
        assert page.locator('.pc-s1-canvas-module-row.is-viewed').count() == 5
        page.locator('details.pc-brand-menu > summary').first.click()
        assert page.locator('details.pc-brand-menu').first.get_attribute('open') is not None
        page.locator('#pcProgressMenu > summary').click()
        assert page.locator('#pcProgressMenu').get_attribute('open') is not None
        no_horizontal_overflow(page)
        assert errors == [], errors
        page.close()

        page, errors = page_for(browser, 390, 844)
        page.get_by_role('button', name=re.compile('Food_Access_Reading')).click()
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
    print('S1 Start With the Learning exploration browser contract passed.')

if __name__ == '__main__': main()
