#!/usr/bin/env python3
"""Focused browser regression for S1 revised overview -> diagnosis -> My Course phase."""
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CONTENT_TYPES = {
    '.css':'text/css','.html':'text/html','.js':'application/javascript','.json':'application/json',
    '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp',
    '.ico':'image/x-icon','.mp3':'audio/mpeg'
}
HTML = (ROOT/'index.html').read_text(encoding='utf-8').replace('<head>','<head><base href="https://promptcraft.test/">',1)

def page_for(browser, width=1440, height=960):
    page = browser.new_page(viewport={'width': width, 'height': height})
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
    page.wait_for_timeout(700)
    return page, errors

def no_overflow(page):
    size = page.evaluate('() => ({scroll:document.documentElement.scrollWidth, width:innerWidth})')
    assert size['scroll'] <= size['width'] + 1, size

def main():
    source = (ROOT/'src/js/scenarios/s1-start-with-learning.js').read_text(encoding='utf-8')
    my_course_slice = source[source.index('function pcPlayS1MyCourseTransition'):source.index('function pcUseS1Diagnosis')]
    assert 'saveIncrementalData' not in my_course_slice
    assert 'V121 research tracking' in my_course_slice

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page, errors = page_for(browser)

        page.evaluate('pcRenderS1Diagnosis()')
        page.wait_for_selector('.pc-s1-diagnosis')
        assert page.locator('.pc-s1-diagnosis-context').count() == 2
        assert page.get_by_text('Current evidence', exact=True).count() == 1
        no_overflow(page)

        page.evaluate("pcRenderS1MyCourseStep('focus')")
        page.fill('#pcS1MyCourseTitle', 'Week 4: Informative Speech')
        page.locator('form[data-pc-submit-action="s1-my-course-save-focus"] button[type="submit"]').click()
        page.wait_for_timeout(200)
        page.fill('#pcS1MyCourseIntent', 'Students will deliver an organized informative speech using credible evidence for a specific audience.')
        page.locator('form[data-pc-submit-action="s1-my-course-save-intent"] button[type="submit"]').click()
        page.wait_for_timeout(200)
        for index, value in enumerate([
            'Watch informative speech example',
            'Read chapter on audience analysis',
            'Post speech outline',
            'Complete knowledge check'
        ]):
            page.fill(f'#pcS1MyCourseActivity{index}', value)
        page.locator('form[data-pc-submit-action="s1-my-course-review"] button[type="submit"]').click()
        page.wait_for_selector('.pc-s1-my-course-report', timeout=15000)
        assert page.get_by_text('My Course overview', exact=True).count() >= 1
        assert page.get_by_text('NEXT CHECK', exact=False).count() >= 1
        page.get_by_role('button', name='Return to My Course').click()
        page.wait_for_selector('#pcS1MyCourseFeedbackTitle')
        assert page.get_by_role('heading', name='Your module overview is ready').count() == 1
        no_overflow(page)
        assert errors == [], errors
        page.close()

        mobile, mobile_errors = page_for(browser, 390, 844)
        mobile.evaluate("pcRenderS1MyCourseStep('focus')")
        mobile.wait_for_selector('.pc-s1-my-course')
        no_overflow(mobile)
        assert mobile_errors == [], mobile_errors
        mobile.close()
        browser.close()
    print('S1 My Course P554 browser contract passed.')

if __name__ == '__main__':
    main()
