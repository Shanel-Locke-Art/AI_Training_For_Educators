#!/usr/bin/env python3
"""Regression test for S3's shared drag/drop authentic-assessment loop."""
from __future__ import annotations
import os, shutil, sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
CONTENT_TYPES = {
    '.css':'text/css', '.html':'text/html', '.ico':'image/x-icon', '.js':'application/javascript',
    '.json':'application/json', '.mp3':'audio/mpeg', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
    '.svg':'image/svg+xml'
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

    def place(page, root_id: str, card_id: str, zone_id: str) -> None:
        page.evaluate("""([rootId, cardId, zoneId]) => {
          const root=document.getElementById(rootId);
          const card=[...root.querySelectorAll('[data-pc-drag-card]')].find(el=>el.dataset.pcDragCard===cardId);
          const zone=[...root.querySelectorAll('[data-pc-drop-zone]')].find(el=>el.dataset.pcDropZone===zoneId);
          if (!card || !zone) throw new Error(`Missing drag target ${cardId} -> ${zoneId}`);
          card.click(); zone.click();
        }""", [root_id, card_id, zone_id])

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=chromium, args=['--no-sandbox'])
        for width, height, label in [(1440, 1000, 'desktop'), (390, 844, 'phone')]:
            page = browser.new_page(viewport={'width':width,'height':height})
            page_errors=[]
            missing=set()
            page.on('pageerror', lambda error, errs=page_errors: errs.append(str(error)))

            def handle(route, request):
                parsed=urlparse(request.url)
                if parsed.hostname!='promptcraft.test':
                    route.abort(); return
                if request.method!='GET':
                    route.fulfill(status=200, body='{}', content_type='application/json'); return
                relative=parsed.path.lstrip('/') or 'index.html'
                path=ROOT/relative
                if not path.is_file():
                    missing.add(relative); route.fulfill(status=404, body='missing', content_type='text/plain'); return
                route.fulfill(status=200, body=path.read_bytes(), content_type=CONTENT_TYPES.get(path.suffix.lower(),'application/octet-stream'))

            page.route('**/*',handle)
            page.set_content(html, wait_until='domcontentloaded')
            page.wait_for_timeout(650)

            dialogue_state = page.evaluate("""() => ({
              hasS3Opening: Array.isArray(window.pixelDialogue?.scenarioStart_assessment)
                && window.pixelDialogue.scenarioStart_assessment.some(line => line.character === 'maya'),
              missingFallback: (() => {
                let completed = false;
                const originalWarn = console.warn;
                console.warn = () => {};
                try {
                  const result = playPixelSequence('__promptcraft_missing_dialogue_test__', () => { completed = true; });
                  return { completed, result };
                } finally {
                  console.warn = originalWarn;
                }
              })()
            })""")
            if not dialogue_state['hasS3Opening']:
                failures.append(f'{label}: S3 opening dialogue is missing from the standalone dialogue data.')
            if not dialogue_state['missingFallback']['completed'] or dialogue_state['missingFallback']['result'] is not False:
                failures.append(f'{label}: missing dialogue sequence can still strand a scenario: {dialogue_state}')

            page.evaluate("""() => {
              closeMainMenu();
              pcScenarioHasLaunched = true;
              pcActivateScenario(SCENARIO_INDEX.ASSESSMENT, { playIntroduction:true });
            }""")
            page.wait_for_timeout(120)
            page.evaluate("() => vnSkipType()")
            intro_state = page.evaluate("""() => ({
              active: document.getElementById('vnOverlay')?.classList.contains('active') || false,
              speaker: document.getElementById('vnSpeaker')?.textContent || '',
              text: document.getElementById('vnText')?.textContent || ''
            })""")
            if not intro_state['active'] or intro_state['speaker'].strip() != 'Professor Pixel' or 'Maya brought us a strange case' not in intro_state['text']:
                failures.append(f'{label}: S3 introduction did not start from the normal scenario activation path: {intro_state}')

            page.evaluate("""() => {
              pcActivateScenario(SCENARIO_INDEX.ASSESSMENT, { playIntroduction:false });
              renderS3DiagnosisActivity();
            }""")
            page.wait_for_timeout(80)

            evidence=page.evaluate("""() => ({
              panels: document.querySelectorAll('.pc-student-evidence').length,
              portrait: document.querySelector('.pc-student-evidence-portrait img')?.getAttribute('src') || '',
              quote: document.querySelector('.pc-student-evidence-quote-copy')?.textContent || '',
              score: document.querySelector('.pc-student-evidence-result strong')?.textContent || ''
            })""")
            if evidence['panels']!=1:
                failures.append(f'{label}: Maya student-evidence panel did not render exactly once: {evidence}')
            if 'maya/uncertain.png' not in evidence['portrait']:
                failures.append(f'{label}: Maya uncertain portrait is missing from the diagnosis evidence panel: {evidence}')
            if 'real planning problem tomorrow' not in evidence['quote']:
                failures.append(f'{label}: Maya opening quote is missing from the diagnosis evidence panel: {evidence}')
            if evidence['score'].strip()!='96%':
                failures.append(f'{label}: Maya 96% result is missing from the diagnosis evidence panel: {evidence}')

            if page.locator('#s3DiagnosisBoard [data-pc-drag-card]').count()!=6:
                failures.append(f'{label}: diagnosis board did not render six evidence cards.')
            if page.locator('#s3DiagnosisBoard [data-pc-drop-zone]:not([data-pc-is-tray="true"])').count()!=4:
                failures.append(f'{label}: diagnosis board did not render four evidence zones.')

            diagnosis={
              'define_zoning':'know','name_cycle':'know','match_terms':'know',
              'explain_stakeholders':'explain','summarize_example':'explain','choose_example':'apply'
            }
            for card,zone in diagnosis.items(): place(page,'s3DiagnosisBoard',card,zone)
            if page.locator('#s3DiagnosisSubmit').is_disabled(): failures.append(f'{label}: diagnosis submit did not enable.')
            page.evaluate("document.getElementById('s3DiagnosisSubmit').click()"); page.wait_for_timeout(40)
            state=page.evaluate("""() => ({
              locked: document.getElementById('s3DiagnosisBoard')?.dataset.pcDragLocked,
              correct: document.querySelectorAll('#s3DiagnosisBoard .pc-drag-card.is-correct').length,
              feedback: document.getElementById('s3DiagnosisFeedback')?.innerText || ''
            })""")
            if state['locked']!='true' or state['correct']!=6: failures.append(f'{label}: diagnosis review/lock failed: {state}')
            if '6 of 6' not in state['feedback']: failures.append(f'{label}: diagnosis feedback missing perfect alignment.')

            page.evaluate('renderS3BlueprintActivity()'); page.wait_for_timeout(40)
            blueprint={
              'county_brief':'context','recommend_response':'performance','decision_record':'evidence',
              'justify_tradeoff':'reasoning','performance_criteria':'criteria'
            }
            for card,zone in blueprint.items(): place(page,'s3BlueprintWorkbench',card,zone)
            page.evaluate("document.getElementById('s3BlueprintSubmit').click()"); page.wait_for_timeout(50)
            bstate=page.evaluate("""() => ({
              score:getS3Data().initialScore,
              locked:document.getElementById('s3BlueprintWorkbench')?.dataset.pcDragLocked,
              feedback:document.getElementById('s3BlueprintFeedback')?.innerText || ''
            })""")
            if bstate['score']!=5 or bstate['locked']!='true': failures.append(f'{label}: strong blueprint did not score/lock correctly: {bstate}')

            page.evaluate('renderS3StressTestActivity()'); page.wait_for_timeout(40)
            stress={
              'correct_choice':'helps','uses_evidence':'proves','rejects_alternative':'proves',
              'uses_terms':'helps','polished':'doesnt','adapts':'proves'
            }
            for card,zone in stress.items(): place(page,'s3StressBoard',card,zone)
            page.evaluate("document.getElementById('s3StressSubmit').click()"); page.wait_for_timeout(40)
            sstate=page.evaluate("""() => ({
              locked:document.getElementById('s3StressBoard')?.dataset.pcDragLocked,
              correct:getS3Data().evidenceAttempts.at(-1)?.correctCount || 0
            })""")
            if sstate['locked']!='true' or sstate['correct']!=6: failures.append(f'{label}: stress test did not evaluate all evidence correctly: {sstate}')

            page.evaluate("""() => {
              const d=getS3Data();
              d.babbageEvidenceAnalysis={...S3_LOCAL_BABBAGE_ANALYSIS,evidence_used:[...S3_LOCAL_BABBAGE_ANALYSIS.evidence_used]};
              renderS3AuditActivity();
            }"""); page.wait_for_timeout(40)
            audit={'evidence_link':'supported','polish_claim':'not_supported','transfer_claim':'needs_more'}
            for card,zone in audit.items(): place(page,'s3AuditBoard',card,zone)
            page.evaluate("document.getElementById('s3AuditSubmit').click()"); page.wait_for_timeout(40)
            astate=page.evaluate("""() => ({
              locked:document.getElementById('s3AuditBoard')?.dataset.pcDragLocked,
              correct:getS3Data().auditAttempts.at(-1)?.correctCount || 0
            })""")
            if astate['locked']!='true' or astate['correct']!=3: failures.append(f'{label}: Babbage claim audit failed: {astate}')

            page.evaluate('renderS3RepairActivity()'); page.wait_for_timeout(40)
            place(page,'s3RepairWorkbench','changed_constraint','repair')
            page.evaluate("document.getElementById('s3RepairSubmit').click()"); page.wait_for_timeout(50)
            rstate=page.evaluate("""() => ({
              repair:getS3Data().repairText,
              revised:getS3Data().revisedScore,
              locked:document.getElementById('s3RepairWorkbench')?.dataset.pcDragLocked,
              overflow:document.body.scrollWidth > window.innerWidth + 1,
              sharedS3Css:[...document.styleSheets].length >= 1
            })""")
            if rstate['repair']!='Change a meaningful constraint' or rstate['revised']!=5 or rstate['locked']!='true':
                failures.append(f'{label}: final repair did not complete correctly: {rstate}')
            if rstate['overflow']: failures.append(f'{label}: S3 drag/drop workspace has horizontal overflow.')

            page.evaluate('renderS3FinalResult()'); page.wait_for_timeout(50)
            final_text=page.locator('#inputContainer').inner_text() if page.locator('#inputContainer').count() else ''
            chat_text=page.locator('#chat').inner_text() if page.locator('#chat').count() else ''
            if 'Assessment Evidence Profile' not in (final_text+chat_text): failures.append(f'{label}: shared final evidence profile did not render.')
            if page_errors: failures.append(f'{label}: browser errors: {page_errors}')
            # The current S3 intentionally uses the shared classroom scene, not the retired S3 implementation visual.
            if 'assets/images/scenes/scenario-03-authentic-assessment/scene.png' in page.evaluate('() => ASSETS.images.scenes[2]'):
                failures.append(f'{label}: retired S3 scene asset is still active.')
            page.close()
        browser.close()

    source_css='\n'.join(p.read_text(encoding='utf-8') for p in (ROOT/'src/css').rglob('*.css'))
    if '.pc-s3-' in source_css or '.s3-' in source_css:
        failures.append('S3-specific presentation selectors were introduced instead of shared drag/workbench styling.')

    if failures:
        print('PromptCraft S3 drag/drop regression FAILED:')
        for failure in failures: print(f'- {failure}')
        return 1
    print('PromptCraft S3 drag/drop regression passed on desktop and phone.')
    return 0

if __name__=='__main__':
    raise SystemExit(main())
