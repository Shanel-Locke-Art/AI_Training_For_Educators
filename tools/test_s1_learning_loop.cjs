// S1 production flow regression. External services are blocked; AI is a local fixture.
// PC_BASELINE_DIR captures/compares DOM and computed styles against the pre-refactor run.
const {chromium}=require('playwright');
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');
async function finishDialogue(page) {
  await page.waitForSelector("#vnOverlay.active");
  for(let i=0;i<20 && await page.locator('#vnOverlay.active').count();i++) {
    await page.evaluate(()=>{clearTimeout(vnTypeTimer);vnTyping=false;vnCurrentText=vnFullText;document.getElementById('vnText').textContent=vnFullText;});
    await page.locator('#vnDialogue').focus();await page.keyboard.press('Enter');await page.waitForTimeout(70);
  }
  assert.strictEqual(await page.locator('#vnOverlay.active').count(),0,'Dialogue must hand off to gameplay');
}
(async()=>{
const server=http.createServer((req,res)=>{const p=path.join(__dirname,'..',new URL(req.url,'http://localhost').pathname);res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'})[path.extname(p)]||'application/octet-stream');fs.readFile(p,(e,d)=>{res.statusCode=e?404:200;res.end(e?'missing':d);});});
await new Promise(r=>server.listen(8765,'127.0.0.1',r));
try {for(const [device,width,height] of [['desktop',1440,1000],['tablet',820,1180],['phone',390,844]]) {
const browser=await chromium.launch({executablePath:process.env.PC_CHROME_EXECUTABLE||undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage',...(process.env.PC_SINGLE_PROCESS?['--single-process']:[])]});
try {
const page=await browser.newPage({viewport:{width,height}}),errors=[];page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
await page.goto('http://127.0.0.1:8765/index.html?mockBabbage=1');await page.waitForTimeout(1000);
await page.evaluate(()=>{requestBabbageAnalysis=async()=>({mock:true,mockReason:'regression-fixture'});openMainMenu('scenarios');});
await page.click('[data-pc-action="launch-scenario"][data-pc-scenario-index="0"]');await page.locator('[data-pc-action="submit-name"][data-pc-skip="true"]').click();await page.waitForSelector('#audioSetupOverlay.visible');await page.waitForTimeout(350);await page.locator('input[name="audioMode"][value="silent"]').check();await page.click('#audioSetupContinueBtn');await page.waitForTimeout(200);await finishDialogue(page);
const click=async action=>{await page.locator(`[data-pc-action="${action}"]`).last().click();await page.waitForTimeout(100);};
const capture=async name=>{
 await page.waitForTimeout(100);
 const actual=await page.evaluate(()=>{
  const root=document.querySelector('#chat > section');
  function canonical(node){if(node.nodeType===3)return node.textContent.replace(/\s+/g,' ').trim();if(node.nodeType!==1)return null;return {tag:node.tagName,attrs:[...node.attributes].map(a=>[a.name,a.value]).sort(),children:[...node.childNodes].map(canonical).filter(x=>x!==null&&x!=='')};}
  const css={};for(const selector of ['.pc-s1-learning','.pc-s1-learning-taskbar','.pc-s1-learning-workspace','.pc-s1-canvas-frame','.pc-s1-maya-panel','.pc-s1-maya-art-wrap','.pc-s1-guide-paper']){const el=root?.querySelector(selector)||(root?.matches(selector)?root:null);if(!el)continue;const style=getComputedStyle(el);css[selector]=Object.fromEntries(['display','padding','height','minHeight','overflow','gridTemplateColumns','fontFamily','fontSize','color','backgroundColor'].map(p=>[p,style[p]]));}
  return {dom:canonical(root),css};
 });
 if(process.env.PC_BASELINE_DIR){const target=path.join(process.env.PC_BASELINE_DIR,`${device}-${name}.json`);fs.mkdirSync(path.dirname(target),{recursive:true});if(process.env.PC_RECORD_BASELINE)fs.writeFileSync(target,JSON.stringify(actual,null,2));else assert.deepStrictEqual(actual,JSON.parse(fs.readFileSync(target)),`${device}/${name}: pre-refactor DOM/styles changed`);}
 const overflow=await page.evaluate(()=>({width:innerWidth,doc:document.documentElement.scrollWidth,chat:document.getElementById('chat').scrollWidth,client:document.getElementById('chat').clientWidth}));assert(overflow.doc<=overflow.width+1&&overflow.chat<=overflow.client+1,`${name}: ${JSON.stringify(overflow)}`);
 if(process.env.PC_SCREENSHOTS){fs.mkdirSync(process.env.PC_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.PC_SCREENSHOTS,`${device}-${name}.png`)});}
};
await capture('module');assert(await page.locator('[data-pc-action="s1-learning-complete-explore"]').isDisabled());
for(let i=0;i<5;i++){await page.click(`[data-pc-action="s1-learning-open-item"][data-pc-item-index="${i}"]`);await capture(`item-${i}`);await click('s1-learning-show-module');}
await click('s1-learning-complete-explore');await capture('rename');
await page.fill('#pcS1RenameInput','Food_Access_Reading');await page.locator('#chat form').locator('button[type="submit"]').click();assert((await page.locator('#pcS1RenameNotice').innerText()).includes('more information'));
for(const title of ['Read about food access','Watch community barriers','Review key terms','Discuss one barrier','Check your vocabulary']){await page.fill('#pcS1RenameInput',title);await page.locator('#chat form').locator('button[type="submit"]').click();}
await capture('renamed');await click('s1-learning-start-organize');await capture('organize');await page.locator('#pcS1OrganizeContinue').click();assert.strictEqual(await page.evaluate(()=>pcS1LearningState.view),'organize');assert((await page.locator('#pcS1OrganizeStatus').innerText()).includes('5 cards'));
for(const [id,zone] of [['food-access-reading','prepare'],['food-access-video','prepare'],['module-terms','prepare'],['discussion-3','practice'],['quiz-3','evidence']]){await page.locator(`[data-pc-drag-card="${id}"]`).focus();await page.keyboard.press('Enter');await page.locator(`[data-pc-drop-zone="${zone}"]`).focus();await page.keyboard.press('Enter');}
await page.locator('#pcS1OrganizeContinue').click();await capture('revised');
await click('s1-learning-build-guide-step1');await page.waitForSelector('.pc-s1-guide-paper');await capture('guide-step1');
await click('s1-learning-save-guide-step1-continue');await finishDialogue(page);await capture('diagnosis');
await page.click('[data-pc-diagnosis-id="evidence-gap"]');assert(await page.locator('.pc-s1-diagnosis-submit').isDisabled());await page.fill('#pcS1DiagnosisRationale','The quiz checks recall rather than a recommendation using evidence.');await page.locator('.pc-s1-diagnosis-submit').click();await capture('diagnosis-result');
await click('s1-learning-start-my-course');await finishDialogue(page);await capture('my-course-focus');
await page.fill('#pcS1MyCourseTitle','Community survey');await page.locator('#chat form button[type="submit"]').click();await capture('my-course-intent');
await page.fill('#pcS1MyCourseIntent','Use survey evidence to support a recommendation.');await page.locator('#chat form button[type="submit"]').click();await capture('my-course-activities');
await page.fill('#pcS1MyCourseActivity0','Read the survey');await page.fill('#pcS1MyCourseActivity1','Write an evidence-based recommendation');await page.locator('#chat form button[type="submit"]').click();await page.waitForSelector('#pcS1TransferReflection');await capture('my-course-feedback');
assert(await page.locator('#chat form button[type="submit"]').isDisabled());await page.fill('#pcS1TransferReflection','Check that the recommendation demonstrates the intended learning.');await page.locator('#chat form button[type="submit"]').click();await capture('full-guide');await page.evaluate(()=>{window.pcPrintCount=0;window.print=()=>window.pcPrintCount++;});await click('s1-learning-print-guide');assert.strictEqual(await page.evaluate(()=>window.pcPrintCount),1);
const saved=await page.evaluate(()=>localStorage.getItem(PC_S1_GUIDE_STORAGE_KEY));assert(JSON.parse(saved).myCourseReview.added);assert.strictEqual(await page.evaluate(()=>scenarioCompleted[0]),false);
const xpBeforeClose=await page.evaluate(()=>xp);
await click('s1-learning-close-with-pixel');await finishDialogue(page);assert.strictEqual(await page.evaluate(()=>scenarioCompleted[0]),true);assert(await page.locator('#mainMenuOverlay').isVisible());assert.strictEqual(await page.evaluate(()=>getScenarioMenuStatus(0)),'Completed');assert.strictEqual(await page.evaluate(()=>xp),xpBeforeClose+await page.evaluate(()=>PC_COMPLETION_XP));
const xpAfterClose=await page.evaluate(()=>xp);await page.evaluate(()=>markScenarioComplete());assert.strictEqual(await page.evaluate(()=>xp),xpAfterClose,'Completion must not award XP twice');
await page.reload();await page.waitForTimeout(1000);assert.strictEqual(await page.evaluate(()=>scenarioCompleted[0]),true,'Completed menu status must survive reload');assert.strictEqual(await page.evaluate(()=>getScenarioMenuStatus(0)),'Completed');assert.strictEqual(await page.evaluate(()=>xp),xpAfterClose);
await page.evaluate(()=>pcOpenSavedS1Guide());assert(await page.locator('.pc-s1-guide-paper').isVisible());assert.strictEqual(await page.evaluate(()=>localStorage.getItem(PC_S1_GUIDE_STORAGE_KEY)),saved);
await page.evaluate(()=>pcActivateScenario(1,{playIntroduction:false}));assert(await page.locator('#pcS2AccessTitle').isVisible());assert.strictEqual(await page.evaluate(()=>localStorage.getItem(PC_S1_GUIDE_STORAGE_KEY)),saved);await page.evaluate(()=>markScenarioComplete());assert.strictEqual(await page.evaluate(()=>scenarioCompleted[1]),false,'S2 preview must not complete');
// A late S1 AI response must not replace the newly opened S2 workspace.
if(!process.env.PC_RECORD_BASELINE) {
await page.evaluate(()=>{pcActivateScenario(0,{playIntroduction:false});requestBabbageAnalysis=()=>new Promise(resolve=>window.pcResolveLateS1=resolve);pcGenerateS1GuideStep1();pcActivateScenario(1,{playIntroduction:false});window.pcResolveLateS1({mock:true});});await page.waitForTimeout(120);assert(await page.locator('#pcS2AccessTitle').isVisible());
}
await page.evaluate(()=>{pcActivateScenario(0,{playIntroduction:false});window.confirm=()=>false;pcConfirmClearS1Guide();});assert.strictEqual(await page.evaluate(()=>scenarioCompleted[0]),false,'Starting a new practice run resets completion');assert.strictEqual(await page.evaluate(()=>localStorage.getItem(PC_S1_GUIDE_STORAGE_KEY)),saved);
await page.evaluate(()=>{window.confirm=()=>true;pcConfirmClearS1Guide();});assert.strictEqual(await page.evaluate(()=>localStorage.getItem(PC_S1_GUIDE_STORAGE_KEY)),null);assert(await page.locator('#pcCourseGuideOverviewTitle').isVisible());
assert.deepStrictEqual(errors,[]);console.log(device,process.env.PC_RECORD_BASELINE?'PASS: screens captured and full loop verified.':'PASS: full S1 loop, keyboard organization, gates, guide/print/clear, completion/reload/duplicate XP/replay, S2 preview guard, stale AI guard, no page errors/overflow.');
} finally {await browser.close();}
}} finally {server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
