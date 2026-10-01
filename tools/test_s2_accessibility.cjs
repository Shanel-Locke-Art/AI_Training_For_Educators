// Local browser regression. All external requests are blocked; AI responses are fixtures.
const {chromium}=require('playwright');
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');
(async()=>{
const server=http.createServer((req,res)=>{const p=path.join(__dirname,'..',new URL(req.url,'http://localhost').pathname);res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'})[path.extname(p)]||'application/octet-stream');fs.readFile(p,(err,data)=>{res.statusCode=err?404:200;res.end(err?'missing':data);});});await new Promise(r=>server.listen(8765,'127.0.0.1',r));
for(const [name,w,h] of [['desktop',1440,1000],['tablet',820,1180],['phone',390,844]]){
const browser=await chromium.launch({executablePath:process.env.PC_CHROME_EXECUTABLE || undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage',...(process.env.PC_SINGLE_PROCESS ? ['--single-process'] : [])]});
const context=await browser.newContext({viewport:{width:w,height:h}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await page.goto('http://127.0.0.1:8765/index.html?mockBabbage=1');await page.waitForTimeout(1000);
await page.evaluate(()=>{pcNameConfirmed=true;pcAudioPreferenceConfirmed=true;pcScenarioHasLaunched=true;localStorage.setItem(PC_S1_GUIDE_STORAGE_KEY,JSON.stringify({step1:{added:true,personalizedNote:'Keep this S1 guide'}}));openMainMenu('scenarios');});
await page.click('[data-pc-action="launch-scenario"][data-pc-scenario-index="1"]');await page.waitForTimeout(350);assert(await page.locator('#pcS2AccessTitle').isVisible());
const guideBefore=await page.evaluate(()=>localStorage.getItem(PC_S1_GUIDE_STORAGE_KEY));
const click=async action=>{await page.locator(`[data-pc-action="${action}"]`).last().click();await page.waitForTimeout(120);};
await click('s2-access-explore');assert(await page.locator('[data-pc-action="s2-access-start-repair"]').isDisabled());
for(const id of ['page','handout','diagram']){await page.click(`[data-pc-resource="${id}"]`);assert((await page.locator('#chat').innerText()).includes(id==='page'?'Interpret a community survey':id==='handout'?'Survey handout':'Survey diagram'));await click('s2-access-explore');}
await click('s2-access-start-repair');
await page.locator('#pcS2Request').fill('');assert(await page.locator('[data-pc-action="s2-access-generate"]').isDisabled());await page.locator('#pcS2Request').fill('Repair the heading tags. Preserve every word and link.');
await click('s2-access-example');assert((await page.locator('#chat').innerText()).toLowerCase().includes('built-in example'));
await page.fill('#pcS2PastedHtml','<h2>Changed information</h2>');await click('s2-access-preview-repair');assert((await page.locator('#pcS2AccessNotice').innerText()).includes('information'));
await click('s2-access-insert');await click('s2-access-preview-repair');assert(await page.locator('[data-pc-action="s2-access-apply"]').isDisabled());
for(const id of ['words','outline','links'])await page.locator(`[data-pc-check="${id}"]`).check();assert(await page.locator('[data-pc-action="s2-access-apply"]').isEnabled());

assert((await page.locator('.pc-s1-canvas-main').boundingBox()).width >= Math.min(500,w-160), 'Canvas content is too narrow');
const overflow=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,viewport:innerWidth,chat:document.getElementById('chat').scrollWidth,client:document.getElementById('chat').clientWidth}));assert(overflow.doc<=w+1,JSON.stringify(overflow));assert(overflow.chat<=overflow.client+1,JSON.stringify(overflow));
await click('s2-access-apply');assert((await page.locator('#pcS2AccessTitle').innerText()).includes('complete'));assert.strictEqual(await page.evaluate(()=>localStorage.getItem(PC_S1_GUIDE_STORAGE_KEY)),guideBefore);assert.strictEqual(await page.evaluate(()=>scenarioCompleted[1]),false);
await page.reload();await page.waitForTimeout(1000);await page.evaluate(()=>{pcNameConfirmed=true;pcAudioPreferenceConfirmed=true;launchScenarioFromMenu(1,{skipNameGate:true,skipAudioGate:true});});await page.waitForTimeout(250);assert((await page.locator('#pcS2AccessTitle').innerText()).includes('complete'));
await click('s2-access-revisit');await click('s2-access-back-editor');assert((await page.locator('#pcS2PastedHtml').inputValue()).includes('<h2>'));
const safety=await page.evaluate(()=>{const good=pcS2HeadingExample();return {good:pcValidateS2HeadingRepair(good).ok,compact:pcValidateS2HeadingRepair(good.replace(/\n/g,'')).ok,script:pcValidateS2HeadingRepair(good+'<script>alert(1)</script>').ok,word:pcValidateS2HeadingRepair(good.replace('80','90')).ok,href:pcValidateS2HeadingRepair(good.replace('https://www.gfcmsu.edu/','https://evil.example/')).ok,attr:pcValidateS2HeadingRepair(good.replace('<h2>','<h2 onclick="alert(1)">')).ok,level:pcValidateS2HeadingRepair(good.replace('<h3>','<h2>').replace('</h3>','</h2>')).ok};});assert.deepStrictEqual(safety,{good:true,compact:true,script:false,word:false,href:false,attr:false,level:false});
await page.evaluate(()=>pcOpenSavedS1Guide());assert(await page.evaluate(()=>document.body.classList.contains('pc-s1-guide-open')));await page.evaluate(()=>{openMainMenu();continueFromMainMenu();});assert(await page.locator('#pcS2AccessTitle').isVisible());assert.strictEqual(await page.evaluate(()=>localStorage.getItem(PC_S1_GUIDE_STORAGE_KEY)),guideBefore);
await page.evaluate(()=>{pcActivateScenario(0,{playIntroduction:false});});await page.waitForTimeout(150);assert(await page.locator('.pc-s1-canvas-app').isVisible());await page.click('[data-pc-action="s1-learning-open-item"][data-pc-item-index="0"]');assert(await page.locator('#pcS1CanvasItemTitle').isVisible());await page.click('[data-pc-action="s1-learning-next-item"]');await page.click('[data-pc-action="s1-learning-prev-item"]');assert.strictEqual(await page.evaluate(()=>pcS1LearningState.activeIndex),0);
assert.deepStrictEqual(errors,[]);console.log(name,'PASS: full example repair, checks, invalid output, persistence, S1 isolation, S1 item navigation, no overflow.',JSON.stringify(overflow));await browser.close();
}
server.close();})().catch(e=>{console.error(e);process.exit(1)});
