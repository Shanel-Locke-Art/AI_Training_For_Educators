#!/usr/bin/env python3
"""Browser regression for S1 revised-module overview, XP milestone, and diagnosis handoff."""
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CONTENT_TYPES = {'.css':'text/css','.html':'text/html','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.ico':'image/x-icon','.mp3':'audio/mpeg'}
HTML = (ROOT/'index.html').read_text(encoding='utf-8').replace('<head>','<head><base href="https://promptcraft.test/">',1)

def make_page(browser, width=1440, height=960):
    page = browser.new_page(viewport={'width':width,'height':height})
    errors=[]
    page.on('pageerror', lambda e: errors.append(str(e)))
    def serve(route):
        req=route.request; url=urlparse(req.url)
        if url.hostname!='promptcraft.test': return route.abort()
        target=ROOT/(url.path.lstrip('/') or 'index.html')
        if req.method!='GET' or not target.exists(): return route.fulfill(status=404,body='missing',content_type='text/plain')
        return route.fulfill(status=200,body=target.read_bytes(),content_type=CONTENT_TYPES.get(target.suffix.lower(),'application/octet-stream'))
    page.route('**/*', serve)
    page.set_content(HTML, wait_until='domcontentloaded')
    page.wait_for_timeout(450)
    page.evaluate("""() => { for (const id of ['mainMenuOverlay','nameModalOverlay','audioSetupOverlay']) { const el=document.getElementById(id); if(el){el.hidden=true;el.style.display='none';el.classList.remove('visible','open');}} pcResetTeachingProgress(); pcActivateScenario(SCENARIO_INDEX.CONTENT_AVALANCHE,{playIntroduction:false}); }""")
    page.wait_for_timeout(800)
    page.evaluate("""() => { pcS1LearningState.renamedTitles=[...PC_S1_DEV_RENAMES]; pcS1LearningState.organization={'food-access-reading':'prepare','food-access-video':'prepare','module-terms':'prepare','discussion-3':'practice','quiz-3':'evidence'}; pcRenderS1RevisedModuleOverview(); }""")
    page.wait_for_timeout(100)
    return page, errors

def assert_no_overflow(page):
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')

def main():
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page, errors=make_page(browser)
        assert page.get_by_role('heading', name='See the module you rebuilt').count()==1
        assert page.locator('.pc-s1-final-module-section').count()==3
        assert page.locator('#xpLabel').inner_text().startswith('9 / 100 XP')
        bubble=page.locator('.pc-s1-maya-quote').bounding_box(); maya=page.locator('.pc-s1-maya-art').bounding_box()
        assert bubble and maya and bubble['y'] < maya['y'] and maya['y'] - (bubble['y'] + bubble['height']) < 40
        page.get_by_role('button', name='Continue to Diagnosis 1').click()
        page.get_by_role('button', name='The module gives Maya useful preparation, but it does not provide evidence that she can perform the intended learning.').click()
        page.get_by_role('button', name='Use this diagnosis').click()
        assert page.get_by_role('heading', name='Diagnosis recorded').count()==1
        assert page.locator('#xpLabel').inner_text().startswith('18 / 100 XP')
        page.get_by_role('button', name='Continue', exact=True).click()
        assert page.get_by_role('heading', name='Example course complete').count()==1
        assert_no_overflow(page); assert errors==[], errors
        page.close()

        page, errors=make_page(browser,390,844)
        assert page.get_by_role('heading', name='See the module you rebuilt').count()==1
        assert_no_overflow(page); assert errors==[], errors
        page.close()

        page, errors=make_page(browser,1280,900)
        page.evaluate("document.documentElement.style.fontSize='200%'")
        page.wait_for_timeout(100)
        assert_no_overflow(page); assert errors==[], errors
        page.close(); browser.close()
    print('S1 revised-module overview/diagnosis browser contract passed.')

if __name__=='__main__': main()
