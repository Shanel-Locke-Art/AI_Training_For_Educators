// Menu presentation and navigation regression; external services are blocked.
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');
(async()=>{
const root=path.resolve(__dirname,'..'),server=http.createServer((req,res)=>{const p=path.join(root,new URL(req.url,'http://localhost').pathname);res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'})[path.extname(p)]||'application/octet-stream');fs.readFile(p,(e,b)=>{res.statusCode=e?404:200;res.end(e?'missing':b);});});await new Promise(r=>server.listen(8768,'127.0.0.1',r));
try{for(const [name,w,h] of [['desktop',1440,1000],['tablet',820,1180],['phone',390,844]]){
const browser=await chromium.launch({executablePath:process.env.PC_CHROME_EXECUTABLE,headless:true,args:['--no-sandbox','--disable-dev-shm-usage',...(process.env.PC_SINGLE_PROCESS?['--single-process']:[])]});
try{const page=await browser.newPage({viewport:{width:w,height:h}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await page.goto('http://127.0.0.1:8768/index.html');await page.waitForTimeout(1500);await page.evaluate(()=>openMainMenu('home'));await page.waitForTimeout(250);
for(const key of ['home','scenarios','how-to-play','about','babbage','research']){
 const nav=page.locator(`.pc-menu-navigation [data-pc-panel="${key}"]`);await nav.focus();await page.keyboard.press('Enter');await page.waitForTimeout(250);
 assert.strictEqual(await nav.getAttribute('aria-current'),'page');assert.strictEqual(await page.locator('[data-menu-panel]:visible').count(),1,`${name}/${key}: visible panel`);
 const panel=page.locator(`[data-menu-panel="${key}"]`);
 const metrics=await panel.evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,top:el.scrollTop}));assert(metrics.scroll<=metrics.width+1,`${name}/${key}: panel overflow`);assert.strictEqual(metrics.top,0);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 const footer=await page.locator('.pc-main-menu-footer').boundingBox();assert(footer.y+footer.height<=h+1,`${name}/${key}: footer ${JSON.stringify(footer)}`);
 if(key==='about'){const photo=page.locator('.pc-menu-developer-photo');await page.waitForFunction(()=>document.querySelector('.pc-menu-developer-photo').naturalWidth>0);const b=await photo.boundingBox();assert(b.width>=230);assert(b.height>b.width);}
 if(key==='scenarios'){assert((await panel.locator('button:disabled').count())>=2);assert.strictEqual(await panel.locator('button[data-pc-action="launch-scenario"]:enabled').count(),2);}
 if(process.env.PC_SCREENSHOTS){fs.mkdirSync(process.env.PC_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.PC_SCREENSHOTS,`${name}-${key}.png`)});}
 await panel.evaluate(el=>el.scrollTop=el.scrollHeight);const last=panel.locator('a[href],button:not(:disabled)').last();if(await last.count()){await last.scrollIntoViewIfNeeded();await last.focus();assert(await last.evaluate(el=>document.activeElement===el));}
}
await page.locator('.pc-menu-navigation [data-pc-panel="home"]').click();assert(await page.locator('#menuContinueBtn').isVisible());assert(await page.locator('#menuCourseGuideBtn').isEnabled());assert.deepStrictEqual(errors,[]);console.log(name,'PASS: six panels, keyboard navigation, active state, scrolling, portrait, scenario locks, viewport fit.');
}finally{await browser.close();}
}}finally{server.close();}
})().catch(e=>{console.error(e);process.exit(1)});
