// Responsive story framing and palette regression. External services are blocked.
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const server=http.createServer((req,res)=>{const p=path.join(root,new URL(req.url,'http://localhost').pathname);res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'})[path.extname(p)]||'application/octet-stream');fs.readFile(p,(e,b)=>{res.statusCode=e?404:200;res.end(e?'missing':b);});});
 await new Promise(r=>server.listen(8769,'127.0.0.1',r));
 try {for(const [name,width,height] of [['desktop',1440,1000],['short-desktop',1424,736],['tablet',820,1180],['phone',390,844]]){
  const browser=await chromium.launch({executablePath:process.env.PC_CHROME_EXECUTABLE,headless:true,args:['--no-sandbox','--disable-dev-shm-usage',...(process.env.PC_SINGLE_PROCESS?['--single-process']:[])]});
  try {
   const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
   await page.goto('http://127.0.0.1:8769/index.html');await page.waitForTimeout(1000);
   const capture=async label=>{if(process.env.PC_SCREENSHOTS){fs.mkdirSync(process.env.PC_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.PC_SCREENSHOTS,`${name}-${label}.png`)});}};
   await page.evaluate(()=>openMainMenu('scenarios'));await page.click('[data-pc-action="launch-scenario"][data-pc-scenario-index="0"]');
   await page.waitForTimeout(450);await capture('name-setup');await page.locator('[data-pc-action="submit-name"][data-pc-skip="true"]').click();
   await page.waitForSelector('#audioSetupOverlay.visible');await page.waitForTimeout(400);await capture('audio-setup');
   await page.locator('input[name="audioMode"][value="silent"]').check();await page.click('#audioSetupContinueBtn');
   for(const scenario of [0,1]){
    if(scenario)await page.evaluate(()=>pcActivateScenario(1));
    await page.waitForSelector('#vnOverlay.active');await page.waitForTimeout(450);
    for(const mood of ['neutral','thinking','encouraging','proud','excited','skeptical']){
     await page.evaluate(({mood,scenario})=>{vnSetDialogueCharacter('pixel',mood,'Professor Pixel',[{character:'pixel',expression:mood},{character:scenario===0?'maya':'lena',expression:'neutral'}]);clearTimeout(vnTypeTimer);vnTyping=false;document.getElementById('vnText').textContent=vnFullText;},{mood,scenario});
     await page.waitForFunction(()=>document.getElementById('vnPortrait').complete&&document.getElementById('vnPortrait').naturalWidth>0);await page.waitForTimeout(400);
     const geometry=await page.evaluate(()=>{
      const pixel=document.getElementById('vnPortrait'),style=getComputedStyle(pixel),shifted=pixel.getBoundingClientRect();
      const prior=pixel.style.getPropertyValue('transform'),priority=pixel.style.getPropertyPriority('transform');pixel.style.setProperty('transform','none','important');const original=pixel.getBoundingClientRect();pixel.style.setProperty('transform',prior,priority);
      const dialogue=document.getElementById('vnDialogue'),d=dialogue.getBoundingClientRect(),s=getComputedStyle(dialogue),text=document.getElementById('vnText'),t=text.getBoundingClientRect();
      return {offset:shifted.top-original.top,width:shifted.width,originalWidth:original.width,background:s.backgroundColor,bracket:getComputedStyle(dialogue,'::before').borderTopColor,dialogue:{top:d.top,bottom:d.bottom},text:{top:t.top,bottom:t.bottom},overflow:document.documentElement.scrollWidth>innerWidth+1,transform:style.transform};
     });
     assert(geometry.offset>=10&&geometry.offset<=26,`${name}/S${scenario+1}/${mood}: Pixel offset ${JSON.stringify(geometry)}`);
     assert.strictEqual(geometry.width,geometry.originalWidth,'Lowering Pixel must preserve her size');assert(!geometry.overflow);
     assert.strictEqual(geometry.background,'rgba(8, 26, 54, 0.96)',`${name}: dialogue background`);
     assert.strictEqual(geometry.bracket,'rgba(89, 183, 227, 0.62)',`${name}: dialogue accent`);
     assert(geometry.dialogue.bottom<=height+1&&geometry.text.top>=geometry.dialogue.top&&geometry.text.bottom<=geometry.dialogue.bottom,`${name}: dialogue text fit`);
     if(['neutral','excited','skeptical'].includes(mood))await capture(`s${scenario+1}-${mood}`);
    }
   }
   await page.evaluate(()=>openMainMenu('about'));await page.waitForTimeout(400);
   const close=page.locator('.pc-main-menu-close');assert(await close.isVisible());assert.strictEqual(await close.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(18, 53, 91)');
   await close.focus();await page.keyboard.press('Enter');assert.strictEqual(await page.locator('#mainMenuOverlay.visible').count(),0);
   assert.deepStrictEqual(errors,[]);console.log(name,'PASS: onboarding, all six Pixel expressions in both stories, downward framing without resizing, dialogue text fit, blue palette, menu close keyboard interaction, no overflow/errors.');
  } finally {await browser.close();}
 }} finally {server.close();}
})().catch(e=>{console.error(e);process.exit(1)});
