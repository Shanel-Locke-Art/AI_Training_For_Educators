// Local browser regression. All external requests are blocked; AI responses are fixtures.
const {chromium}=require('playwright');
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');
async function finishS2Intro(page, captureName = '') {
  await page.locator('#vnOverlay.active').waitFor({state:'visible'});
  for (const [index,speaker] of ['Professor Pixel','Lena','Professor Pixel','Professor Pixel'].entries()) {
    assert.strictEqual(await page.locator('#vnSpeaker').textContent(),speaker);
    if(page.viewportSize().width<=700) assert(await page.locator(speaker==='Lena'?'#vnStudentPortrait':'#vnPortrait').isVisible());
    else {assert(await page.locator('#vnPortrait').isVisible());assert(await page.locator('#vnStudentPortrait').isVisible());}
    assert((await page.locator('#vnStudentPortrait').getAttribute('src')).includes('lena_'));
    await page.evaluate(()=>{if(vnTyping)vnAdvance();});
    if(index===1 && process.env.PC_SCREENSHOTS){fs.mkdirSync(process.env.PC_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.PC_SCREENSHOTS,`s2-intro-${captureName}.png`)});}
    await page.locator('#vnDialogue').focus();await page.keyboard.press('Enter');await page.waitForTimeout(100);
  }
  await page.waitForFunction(()=>!document.getElementById('vnOverlay').classList.contains('active'));
  await page.waitForFunction(()=>Number(getComputedStyle(document.getElementById('vnOverlay')).opacity)===0);
  assert(await page.locator('#pcS2AccessTitle').isVisible());
}

(async()=>{
const server=http.createServer((req,res)=>{const p=path.join(__dirname,'..',new URL(req.url,'http://localhost').pathname);res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'})[path.extname(p)]||'application/octet-stream');fs.readFile(p,(err,data)=>{res.statusCode=err?404:200;res.end(err?'missing':data);});});await new Promise(r=>server.listen(8765,'127.0.0.1',r));

const browser=await chromium.launch({executablePath:process.env.PC_CHROME_EXECUTABLE || undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage',...(process.env.PC_SINGLE_PROCESS ? ['--single-process'] : [])]});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],requests=[];let bad=false;page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',async r=>{const url=new URL(r.request().url());if(url.pathname.endsWith('/.netlify/functions/babbage')){requests.push(r.request().postDataJSON());const html=await page.evaluate(()=>pcS2HeadingExample());return r.fulfill({contentType:'application/json',body:JSON.stringify({analysis:{repaired_html:bad?html.replace('80','90'):html,explanation:'The section titles now have real heading structure.'},provider:'test-provider',model:'test-model'})});}return url.hostname==='127.0.0.1'?r.continue():r.abort();});
await page.goto('http://127.0.0.1:8765/index.html');await page.waitForTimeout(1000);await page.evaluate(()=>openMainMenu('scenarios'));await page.click('[data-pc-action="launch-scenario"][data-pc-scenario-index="1"]');await page.locator('[data-pc-action="submit-name"][data-pc-skip="true"]').click();await page.locator('input[name="audioMode"][value="silent"]').check();await page.click('#audioSetupContinueBtn');await page.waitForTimeout(600);await finishS2Intro(page,'onboarding');
const click=async a=>{await page.locator(`[data-pc-action="${a}"]`).last().click();await page.waitForTimeout(150);};await page.click('[data-pc-resource="page"]');await click('s2-access-identify');await page.click('[data-pc-choice="headings"]');await click('s2-access-start-repair');await page.locator('summary').filter({hasText:'See the attached page HTML'}).click();await click('s2-access-copy-source');assert((await page.locator('#pcS2AccessNotice').innerText()).length>0);
await click('s2-access-generate');await page.locator('[data-pc-action="close-babbage-consult"]').waitFor({state:'visible'});await click('close-babbage-consult');assert((await page.locator('#chat').innerText()).includes('BABBAGE REPAIR'));assert.strictEqual(requests[0].analysis_type,'s2_accessibility_heading_repair');assert(requests[0].messages[0].content.includes('Original HTML:'));
await click('s2-access-revise');bad=true;await page.fill('#pcS2Request','Restore all original words and fix only headings.');await click('s2-access-generate');await page.getByRole('button',{name:'Revise my request',exact:true}).waitFor({state:'visible'});await click('close-babbage-consult');assert((await page.locator('#pcS2AccessNotice').innerText()).includes('information'));assert.strictEqual(await page.locator('#pcS2Request').inputValue(),'Restore all original words and fix only headings.');
// No late response may overwrite another scenario.
await page.evaluate(()=>{window.requestBabbageAnalysis=()=>new Promise(resolve=>window.pcResolveTest=resolve);pcS2AccessGenerate();});await page.evaluate(()=>pcActivateScenario(0,{playIntroduction:false}));await page.evaluate(()=>window.pcResolveTest({analysis:{repaired_html:pcS2HeadingExample(),explanation:'Late result'},provider:'test-provider'}));await page.waitForTimeout(150);assert.strictEqual(await page.evaluate(()=>scenarioIndex),0);assert(await page.locator('.pc-s1-canvas-app').isVisible());assert.deepStrictEqual(errors,[]);
await page.evaluate(()=>{pcActivateScenario(1,{playIntroduction:false});pcS2AccessState.applied=pcS2HeadingExample();pcS2AccessState.view='complete';pcRenderS2AccessScreen();});await click('s2-access-reset');await finishS2Intro(page,'replay');assert.strictEqual(await page.evaluate(()=>localStorage.getItem(PC_S2_ACCESS_STORAGE)),null);assert.strictEqual(await page.evaluate(()=>pcS2AccessState.view),'explore');assert.deepStrictEqual(errors,[]);
console.log('PASS: narrative replay,  real name/audio onboarding into S2, simulated live request/report handoff, copy feedback, invalid response retry, preserved request, late-response cancellation.');await browser.close();server.close();})().catch(e=>{console.error(e);process.exit(1)});
