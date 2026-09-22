#!/usr/bin/env python3
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CT={'.css':'text/css','.html':'text/html','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.ico':'image/x-icon','.mp3':'audio/mpeg'}
HTML=(ROOT/'index.html').read_text(encoding='utf-8').replace('<head>','<head><base href="https://promptcraft.test/">',1)

def serve(route):
    req=route.request; u=urlparse(req.url)
    if u.hostname!='promptcraft.test': return route.abort()
    target=ROOT/(u.path.lstrip('/') or 'index.html')
    if req.method!='GET' or not target.exists(): return route.fulfill(status=404,body='missing',content_type='text/plain')
    return route.fulfill(status=200,body=target.read_bytes(),content_type=CT.get(target.suffix.lower(),'application/octet-stream'))

def main():
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1440,'height':960})
        errors=[]; page.on('pageerror',lambda e: errors.append(str(e)))
        page.route('**/*',serve)
        page.set_content(HTML,wait_until='domcontentloaded'); page.wait_for_timeout(400)
        page.evaluate("""() => {
          for (const id of ['mainMenuOverlay','nameModalOverlay','audioSetupOverlay']) { const el=document.getElementById(id); if(el){el.hidden=true;el.style.display='none';el.classList.remove('visible','open');}}
          pcActivateScenario(SCENARIO_INDEX.CONTENT_AVALANCHE,{playIntroduction:false});
        }""")
        page.wait_for_timeout(800)
        page.evaluate("""() => {
          pcS1LearningState.renamedTitles=['Food Access Reading','Food Access Video','Food Access Terms','Community Barrier Discussion','Food Access Quiz'];
          pcS1LearningState.organization={'food-access-reading':'practice','food-access-video':'evidence','module-terms':'evidence','discussion-3':'practice','quiz-3':'prepare'};
          pcS1LearningState.guide={step1:{added:false,personalizedInsight:null,generatedAt:''}};
          pcRenderS1RevisedModuleOverview();
        }""")
        page.wait_for_selector('.pc-s1-revised-overview', state='attached', timeout=5000)
        assert page.get_by_text('Reconsider', exact=True).count() >= 3
        maya=page.locator('.pc-s1-maya-quote p').inner_text()
        assert 'mixed up' in maya or 'pause' in maya
        page.evaluate('pcRenderS1GuideStep1()')
        page.wait_for_selector('.pc-s1-guide-paper')
        assert page.get_by_role('button',name='Add to My Guide').count()==1
        page.get_by_role('button',name='Add to My Guide').click()
        page.wait_for_timeout(250)
        assert page.get_by_text('Added to My Guide', exact=True).count()>=1
        assert page.get_by_role('button',name='View saved guide').count()==1
        assert page.get_by_role('button',name='Continue with Maya').count()==1
        page.get_by_role('button',name='View saved guide').click(); page.wait_for_timeout(150)
        assert page.locator('.pc-s1-guide-paper').count()==1
        page.get_by_role('button',name='Continue with Maya').click(); page.wait_for_timeout(250)
        assert page.locator('#vnOverlay.active').count()==1
        assert page.locator('.pc-challenge-card').count()>=1
        size=page.evaluate('() => ({scroll:document.documentElement.scrollWidth,width:innerWidth})')
        assert size['scroll'] <= size['width'] + 1, size
        page.evaluate("document.documentElement.style.fontSize='200%'")
        page.wait_for_timeout(120)
        size=page.evaluate('() => ({scroll:document.documentElement.scrollWidth,width:innerWidth})')
        assert size['scroll'] <= size['width'] + 1, size
        assert errors==[], errors
        browser.close()
    print('S1 Guide P557 browser contract passed.')

if __name__=='__main__': main()
