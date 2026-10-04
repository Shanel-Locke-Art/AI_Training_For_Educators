// Local browser regression. All external requests are blocked; AI responses are fixtures.
const {chromium}=require('playwright');
const http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');
(async()=>{
const server=http.createServer((req,res)=>{const p=path.join(__dirname,'..',new URL(req.url,'http://localhost').pathname);res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'})[path.extname(p)]||'application/octet-stream');fs.readFile(p,(err,data)=>{res.statusCode=err?404:200;res.end(err?'missing':data);});});await new Promise(r=>server.listen(8765,'127.0.0.1',r));
for(const [name,w,h] of [['desktop',1909,984],['tablet',820,1180],['phone',390,844]]) {
 const browser=await chromium.launch({executablePath:process.env.PC_CHROME_EXECUTABLE || undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage',...(process.env.PC_SINGLE_PROCESS ? ['--single-process'] : [])]});
 const page=await browser.newPage({viewport:{width:w,height:h}});
 await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await page.goto('http://127.0.0.1:8765/index.html?mockBabbage=1');await page.waitForTimeout(1000);
 const metrics=()=>page.evaluate(()=>{const css=(selector,properties)=>{const el=document.querySelector(selector),style=getComputedStyle(el);return Object.fromEntries(properties.map(p=>[p,style[p]]));};return {
 stage:css('.pc-s1-learning',['padding','width','backgroundSize','backgroundRepeat']),
 title:css('.pc-s1-learning-taskbar h1',['fontFamily','fontSize','lineHeight','textTransform','color','margin']),
 header:css('.pc-s1-learning-taskbar',['padding','borderRadius','backgroundColor','gap']),
 workspace:css('.pc-s1-learning-workspace',['height','display','gridTemplateColumns','padding']),
 frame:css('.pc-s1-canvas-frame',['height','minHeight','overflow','borderRadius']),
 quote:css('.pc-s1-maya-quote',['padding','fontFamily','backgroundColor','position']),
 portrait:css('.pc-s1-maya-art-wrap',['height','maxHeight']),
 module:css('.pc-s1-canvas-module-head',['padding','backgroundColor','fontFamily']),
 };});
 const captures=[];
 for(const i of [0,1]) {
 await page.evaluate(i=>{pcNameConfirmed=true;pcAudioPreferenceConfirmed=true;pcScenarioHasLaunched=true;closeMainMenu({force:true});pcActivateScenario(i,{playIntroduction:false});},i);
 await page.waitForTimeout(200);captures.push(await metrics());
 assert(await page.locator('.pc-s1-maya-art').isVisible());
 const bounds=await page.locator('.pc-s1-maya-art').boundingBox();assert(bounds.y<h && bounds.height>50,'Portrait must remain visible');
 if(process.env.PC_SCREENSHOTS){fs.mkdirSync(process.env.PC_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.PC_SCREENSHOTS,`s${i+1}-module-${name}.png`)});}
 }
 assert.deepStrictEqual(captures[1],captures[0]);
 const contentMetrics=kind=>page.evaluate(kind=>{
   const selectors=kind==='page'?['.pc-s1-canvas-item-header','.pc-s1-canvas-item-header h1','.pc-s1-canvas-content-page','.pc-s1-canvas-richtext']:['.pc-s1-diagnosis-card','.pc-s1-diagnosis-purpose','.pc-s1-diagnosis-choice','.pc-s1-diagnosis-radio'];
   return Object.fromEntries(selectors.map(selector=>{const style=getComputedStyle(document.querySelector(selector));return [selector,Object.fromEntries(['padding','borderRadius','backgroundColor','color','fontFamily','fontSize','lineHeight','display'].filter(p=>!(selector==='.pc-s1-diagnosis-card' && ['padding','display'].includes(p))).map(p=>[p,style[p]]))];}));
 },kind);
 for(const kind of ['page','diagnosis']) {
   const values=[];
   for(const i of [0,1]) {
     await page.evaluate(({i,kind})=>{pcActivateScenario(i,{playIntroduction:false});if(i===0){if(kind==='page')pcOpenS1LearningItem(0);else pcRenderS1Diagnosis();}else{pcOpenS2AccessPage();if(kind==='diagnosis')pcIdentifyS2AccessBarrier();}},{i,kind});
     await page.waitForTimeout(150);values.push(await contentMetrics(kind));
     if(process.env.PC_SCREENSHOTS)await page.screenshot({path:path.join(process.env.PC_SCREENSHOTS,`s${i+1}-${kind}-${name}.png`)});
   }
   assert.deepStrictEqual(values[1],values[0],`${name}/${kind}: shared presentation styles differ`);
 }
 console.log(name,'PASS: S1/S2 stage, title, header, workspace, Canvas frame, quote, portrait, module, page and shared diagnosis controls match; S2 card flow allows its lesson and sticky footer.');await browser.close();
}
server.close();})().catch(e=>{console.error(e);process.exit(1)});
