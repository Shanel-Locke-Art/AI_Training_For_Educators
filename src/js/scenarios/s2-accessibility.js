/* S2 accessibility: first playable section. No legacy metacognition data or S1 guide writes. */
const PC_S2_ACCESS_STORAGE = 'promptcraft_s2_heading_repair_v1';
const PC_S2_HEADING_REQUEST = 'Make these section titles real HTML headings beneath the existing Canvas page title. Keep every word, link, and requirement unchanged. Keep the main sections in order, with Before you submit as a subsection of Your task. Return repaired HTML and a short explanation. I do not know HTML, so explain the change in plain language.';
const PC_S2_PAGE_HTML = `<p style="font-size:24px"><strong>What you will learn</strong></p>
<p>Interpret a community survey and explain a conclusion supported by evidence.</p>
<p style="font-size:24px"><strong>Read the evidence</strong></p>
<p>A survey asked 80 residents how they travel to campus. Forty chose driving, 24 chose the bus, and 16 chose walking.</p>
<p>Read the <a href="https://www.gfcmsu.edu/">Great Falls College website</a> for college information.</p>
<p style="font-size:24px"><strong>Your task</strong></p>
<p>Write one paragraph explaining which travel option was most common. Support your conclusion with two numbers from the survey.</p>
<p style="font-size:20px"><strong>Before you submit</strong></p>
<p>Check that your paragraph includes a conclusion and two pieces of evidence. Submit your paragraph in Canvas.</p>`;
const PC_S2_EXPECTED_HEADINGS = Object.freeze([
  { level: 2, text: 'What you will learn' }, { level: 2, text: 'Read the evidence' },
  { level: 2, text: 'Your task' }, { level: 3, text: 'Before you submit' }
]);
function pcS2HeadingExample() {
  let html = PC_S2_PAGE_HTML;
  PC_S2_EXPECTED_HEADINGS.forEach(item => {
    html = html.replace(new RegExp(`<p style="font-size:[0-9]+px"><strong>${item.text}</strong></p>`), `<h${item.level}>${item.text}</h${item.level}>`);
  });
  return html;
}
let pcS2AccessState = { view: 'intro', resource: 'page', opened: new Set(), request: PC_S2_HEADING_REQUEST, draft: '', source: '', pasted: '', checked: new Set(), notice: '', busy: false, applied: '' };
let pcS2AccessEpoch = 0;

// AI markup is never rendered directly. Reject unsafe markup, changed content,
// changed destinations, and an incorrect outline before rebuilding allowed DOM.
function pcValidateS2HeadingRepair(html) {
  if (typeof html !== 'string' || html.length > 20000) return { ok: false, message: 'The repair is missing or too long. Ask Babbage to repair only this page.' };
  const source = new DOMParser().parseFromString(PC_S2_PAGE_HTML, 'text/html');
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const allowed = new Set(['P', 'H2', 'H3', 'STRONG', 'EM', 'A', 'UL', 'OL', 'LI', 'BR']);
  const nodes = [...doc.body.querySelectorAll('*')];
  if (doc.head.children.length || nodes.some(node => !allowed.has(node.tagName) || [...node.attributes].some(attr => !(node.tagName === 'A' && attr.name === 'href')))) {
    return { ok: false, message: 'This repair includes extra formatting or unsupported code. Ask for heading tags and ordinary paragraphs only, keeping the original links.' };
  }
  const text = root => [...root.children].map(node => node.textContent.replace(/\s+/g, ' ').trim()).join('\n');
  if (text(source.body) !== text(doc.body)) return { ok: false, message: 'Some information or wording changed. Ask Babbage to restore every word and requirement from the original page.' };
  const links = root => [...root.querySelectorAll('a')].map(a => [a.textContent, a.getAttribute('href')]);
  if (JSON.stringify(links(source.body)) !== JSON.stringify(links(doc.body))) return { ok: false, message: 'A link changed. Ask Babbage to keep each original link label and destination.' };
  const headings = [...doc.body.querySelectorAll('h2,h3')].map(h => ({ level: Number(h.tagName.slice(1)), text: h.textContent.trim() }));
  if (JSON.stringify(headings) !== JSON.stringify(PC_S2_EXPECTED_HEADINGS)) return { ok: false, message: 'The section structure still needs a repair. Ask for three main headings and Before you submit as a subsection under Your task.' };
  const clean = document.createElement('div');
  function copy(node, parent) {
    if (node.nodeType === 3) { parent.appendChild(document.createTextNode(node.textContent)); return; }
    if (node.nodeType !== 1) return;
    const el = document.createElement(node.tagName.toLowerCase());
    if (node.tagName === 'A') el.setAttribute('href', node.getAttribute('href'));
    [...node.childNodes].forEach(child => copy(child, el)); parent.appendChild(el);
  }
  [...doc.body.childNodes].forEach(node => copy(node, clean));
  return { ok: true, html: clean.innerHTML, headings };
}

function pcRenderS2Accessibility() {
  pcS2AccessEpoch += 1;
  pcS2AccessState.busy = false;
  pcS2AccessState.notice = '';
  pcS2AccessState.view = pcS2AccessState.applied ? 'complete' : 'intro';
  if (!pcS2AccessState.applied) {
    try {
      const saved = JSON.parse(localStorage.getItem(PC_S2_ACCESS_STORAGE) || 'null');
      const checked = pcValidateS2HeadingRepair(saved?.html);
      if (checked.ok) { pcS2AccessState.applied = checked.html; pcS2AccessState.source = saved.source === 'live' ? 'live' : 'example'; pcS2AccessState.request = String(saved.request || PC_S2_HEADING_REQUEST); pcS2AccessState.view = 'complete'; }
    } catch (_error) {}
  }
  const input = document.getElementById('inputContainer');
  if (input) { input.innerHTML = ''; input.style.display = 'none'; }
  return pcRenderS2AccessScreen();
}

function pcS2AccessCanvas(content, context = 'Modules') {
  return pcRenderCanvasShell(content, { context, courseTitle: 'Community Survey', preventAction: 's2-access-noop', moduleAction: 's2-access-explore', moAsset: PC_S1_MO_ASSET });
}
function pcS2AccessButton(action, label, disabled = false, secondary = false) {
  return `<button type="button" class="${secondary ? 'pc-shell-secondary' : 'pc-shell-primary'}" data-pc-action="${action}" ${disabled ? 'disabled' : ''}>${label}</button>`;
}
function pcS2AccessLena(quote) {
  // Use the existing concept sheet as a labeled reference, without inventing final portraits.
  return `<aside class="pc-s2-access-student" aria-labelledby="pcS2LenaName"><h2 id="pcS2LenaName">Lena</h2><p class="pc-s2-access-student-note">Dual-enrollment student</p><blockquote>${esc(quote)}</blockquote><details><summary>Meet Lena</summary><img src="${pcProjectUrl('assets/images/characters/students/lena/references/lena_ref_01_concept_sheet.png')}" alt="Lena character concept: a student wearing a purple hoodie and carrying books." /><p>Character reference artwork</p></details></aside>`;
}
function pcS2AccessOutline(html) {
  const result = pcValidateS2HeadingRepair(html);
  return result.ok ? `<ol class="pc-s2-access-outline"><li><strong>Page title:</strong> Interpret a community survey<ul>${result.headings.map(h => `<li${h.level === 3 ? ' class="is-subsection"' : ''}>${h.level === 3 ? 'Subsection: ' : 'Section: '}${esc(h.text)}</li>`).join('')}</ul></li></ol>` : '<p>This page has no real section headings. Its section titles are ordinary paragraphs made bold and larger.</p>';
}
function pcRenderS2AccessScreen() {
  if (scenarioIndex !== SCENARIO_INDEX.ACCESSIBILITY) return false;
  document.body.classList.remove('pc-s1-guide-open');
  ['nameModalOverlay', 'audioSetupOverlay'].forEach(id => {
    const modal = document.getElementById(id);
    if (modal?.hidden) { modal.inert = true; modal.style.pointerEvents = 'none'; }
  });
  const overlay = document.getElementById('vnOverlay');
  if (overlay && !overlay.classList.contains('active')) {
    overlay.inert = false;
    overlay.removeAttribute('aria-hidden');
    overlay.style.removeProperty('pointer-events');
  }
  const state = pcS2AccessState;
  const area = document.getElementById('chat');
  if (!area) return false;
  let title = 'Meet Lena', content = '', quote = 'I read the page again, but I keep losing track of which part explains the idea and which part tells me what to do.';
  if (state.view === 'intro') {
    content = `<section class="pc-s2-access-card"><div class="pc-s2-access-kicker">Professor Pixel</div><h2>She found the materials. Using them is harder.</h2><p>Lena is trying to follow an organized Canvas module. She rereads the material but cannot explain why she keeps losing her place.</p><p>Inspect the materials, then use Babbage to repair the page without changing what it teaches. You do not need to write HTML.</p><p><strong>Your first repair:</strong> turn titles that only look like headings into real section headings.</p>${pcS2AccessButton('s2-access-explore', 'Open Lena’s module')}</section>`;
  } else if (state.view === 'explore') {
    title = 'Inspect the learning materials';
    const inspected = state.opened.size;
    content = pcS2AccessCanvas(`<h1>Module 4: Interpret a community survey</h1><p>Open each resource to see what Lena receives.</p><ul class="pc-s2-access-resources">${[['page','Learning page'],['handout','Survey handout'],['diagram','Survey diagram']].map(([id,label]) => `<li><button type="button" data-pc-action="s2-access-open-resource" data-pc-resource="${id}">${label}</button><span>${state.opened.has(id) ? 'Inspected' : 'Not yet inspected'}</span></li>`).join('')}</ul><p role="status">${inspected} of 3 materials inspected</p>${pcS2AccessButton('s2-access-start-repair','Repair the learning page', inspected < 3)}`);
  } else if (state.view === 'resource') {
    title = 'See what Lena receives';
    let body;
    if (state.resource === 'page') body = `<h1>Interpret a community survey</h1><article class="pc-s2-access-preview">${PC_S2_PAGE_HTML}</article><details><summary>Inspect the page structure</summary>${pcS2AccessOutline('')}</details>`;
    else if (state.resource === 'handout') { quote = 'The handout looks like text, but I cannot select a sentence or use my reading tools on it.'; body = `<h1>Survey handout</h1><div class="pc-s2-access-paper" role="img" aria-label="Example image-only handout. The same information is available in the text version below."><strong>COMMUNITY SURVEY</strong><p>80 residents answered.</p><p>Driving: 40 · Bus: 24 · Walking: 16</p><p>Which travel option was most common?</p></div><details><summary>Read the text version</summary><p>80 residents answered: 40 chose driving, 24 chose the bus, and 16 chose walking. Which travel option was most common?</p></details><p>This handout repair will be a later activity. Today, start with the learning page.</p>`; }
    else { quote = 'The picture shows the survey results, but there is no explanation connecting the numbers to the conclusion.'; body = `<h1>Survey diagram</h1><figure class="pc-s2-access-chart"><figcaption>Travel choices: 80 residents</figcaption><p>Driving <span style="width:100%">40</span></p><p>Bus <span style="width:60%">24</span></p><p>Walking <span style="width:40%">16</span></p></figure><p>The labels and numbers are available here so you can inspect this example. A future activity will add a useful explanation of the relationship.</p>`; }
    content = pcS2AccessCanvas(`${body}<div class="pc-s2-access-actions">${pcS2AccessButton('s2-access-explore','Back to Modules',false,true)}</div>`, state.resource === 'page' ? 'Learning page' : 'Learning resource');
  } else if (state.view === 'editor') {
    title = 'Let AI handle the HTML';
    content = pcS2AccessCanvas(`<h1>Interpret a community survey</h1><div class="pc-s2-access-editor-tabs"><span>HTML editor</span>${pcS2AccessButton('s2-access-page-preview','View page',false,true)}</div><p>The bold, enlarged titles below look like headings, but their structure says “paragraph.” Copy the code as it is. Babbage can repair it.</p><label for="pcS2SourceHtml">Existing page HTML</label><textarea id="pcS2SourceHtml" class="pc-s2-access-code" rows="12" readonly>${esc(PC_S2_PAGE_HTML)}</textarea><div class="pc-s2-access-actions">${pcS2AccessButton('s2-access-copy-source','Copy page HTML',false,true)}</div><label for="pcS2Request">Your request to Babbage</label><textarea id="pcS2Request" rows="5" data-pc-input-action="s2-access-request">${esc(state.request)}</textarea><p>Only this example page and your request go to Babbage. You can edit the request without writing code.</p><div class="pc-s2-access-actions">${pcS2AccessButton('s2-access-generate','Ask Babbage to repair the headings',state.busy || !state.request.trim())}${pcS2AccessButton('s2-access-example','Try a built-in example',state.busy,true)}</div>`, 'Edit page');
  } else if (state.view === 'review') {
    title = 'Check the repair, then paste it into Canvas';
    const result = pcValidateS2HeadingRepair(state.draft);
    content = `<section class="pc-s2-access-card"><div class="pc-s2-access-kicker">${state.source === 'live' ? 'Live Babbage repair' : 'Built-in example repair'}</div><h2>The information stays. The structure changes.</h2><p>${esc(state.explanation || 'The main sections now use real headings. Before you submit is a subsection of Your task. The words, link, and requirements stay the same.')}</p><div class="pc-s2-access-compare"><section><h3>Original page structure</h3>${pcS2AccessOutline('')}<details><summary>Compare original wording</summary><article class="pc-s2-access-preview">${PC_S2_PAGE_HTML}</article></details></section><section><h3>Repaired heading outline</h3>${pcS2AccessOutline(state.draft)}</section></div><label for="pcS2DraftHtml">Babbage’s repaired HTML</label><textarea id="pcS2DraftHtml" class="pc-s2-access-code" rows="10" readonly>${esc(state.draft)}</textarea><div class="pc-s2-access-actions">${pcS2AccessButton('s2-access-copy-draft','Copy repaired HTML',false,true)}${pcS2AccessButton('s2-access-revise','Change my request',false,true)}</div></section>`;
    content += pcS2AccessCanvas(`<h1>Interpret a community survey</h1><div class="pc-s2-access-editor-tabs"><span>HTML editor</span></div><label for="pcS2PastedHtml">Replace the old page code with the repaired HTML</label><textarea id="pcS2PastedHtml" class="pc-s2-access-code" rows="10" data-pc-input-action="s2-access-paste">${esc(state.pasted)}</textarea><div class="pc-s2-access-actions">${pcS2AccessButton('s2-access-insert','Insert repaired HTML',false,true)}${pcS2AccessButton('s2-access-preview-repair','Preview this page',!state.pasted.trim(),true)}</div><p>You can paste the copied code, or use Insert repaired HTML in this practice editor.</p>`, 'Edit page');
    if (!result.ok) state.notice = result.message;
  } else if (state.view === 'verify') {
    title = 'Verify the page before applying it';
    const result = pcValidateS2HeadingRepair(state.pasted);
    content = pcS2AccessCanvas(`<h1>Interpret a community survey</h1><article class="pc-s2-access-preview">${result.ok ? result.html : ''}</article><section class="pc-s2-access-checks"><h2>Quick checks</h2>${[['words','The wording and requirements match the original.'],['outline','The headings describe the sections and the subsection belongs under Your task.'],['links','The original link label and destination are unchanged.']].map(([id,label]) => `<label><input type="checkbox" data-pc-change-action="s2-access-check" data-pc-check="${id}" ${state.checked.has(id) ? 'checked' : ''}> ${label}</label>`).join('')}<details><summary>Compare original page</summary><article class="pc-s2-access-preview">${PC_S2_PAGE_HTML}</article></details><details><summary>Review heading outline</summary>${pcS2AccessOutline(state.pasted)}</details><div class="pc-s2-access-actions">${pcS2AccessButton('s2-access-apply','Apply verified repair',state.checked.size !== 3)}${pcS2AccessButton('s2-access-back-editor','Back to HTML editor',false,true)}</div></section>`, 'Page preview');
  } else {
    title = 'First accessibility repair complete';
    quote = 'Now the page has sections I can move between. I can return to the evidence and then find exactly what I need to submit.';
    content = `<section class="pc-s2-access-card"><h2>You preserved the lesson and repaired its structure.</h2><p>You used ${state.source === 'live' ? 'Babbage' : 'a clearly labeled built-in example'} to replace visual headings with real headings, then checked the content before applying the HTML.</p><p><strong>Try it in your course:</strong> open a small Canvas page’s HTML editor, copy its code, ask AI for a heading repair, paste back the checked version, and preview it. Run the available accessibility checker as an additional check.</p><label for="pcS2ReusablePrompt">Reusable request</label><textarea id="pcS2ReusablePrompt" rows="5" readonly>${esc(state.request)}</textarea><p><strong>Course-design connections:</strong> OSCQR 21; WCAG 2.1 1.3.1 and 2.4.6. This repair addresses heading structure, not every accessibility requirement.</p><p>Your practice repair is saved on this device separately from your S1 guide. Handout, diagram, and My Course guide-building activities will follow in later updates.</p><div class="pc-s2-access-actions">${pcS2AccessButton('s2-access-revisit','Revisit the repaired page',false,true)}${pcS2AccessButton('s2-access-reset','Practice again',false,true)}${pcS2AccessButton('open-main-menu','Return to Main Menu')}</div></section>`;
  }
  area.innerHTML = `<section class="pc-s2-access" aria-labelledby="pcS2AccessTitle"><header class="pc-s2-access-header"><div><span>Scenario 2 · Access Is Part of the Design</span><h1 id="pcS2AccessTitle">${title}</h1><p>Inspect → Ask AI → Preview → Verify → Apply</p></div><span class="pc-s2-access-preview-badge">First section preview</span></header><div class="pc-s2-access-layout"><div class="pc-s2-access-main">${content}<p id="pcS2AccessNotice" role="status">${esc(state.notice)}</p></div>${pcS2AccessLena(quote)}</div></section>`;
  resetSectionScroll(area);
  pcScheduleScenarioTask(() => pcFocusWithoutScroll(document.getElementById('pcS2AccessTitle')), 80, SCENARIO_INDEX.ACCESSIBILITY);
  document.getElementById('pcS2AccessTitle')?.setAttribute('tabindex','-1');
  return true;
}

function pcS2AccessNotice(message) {
  pcS2AccessState.notice = message;
  const el = document.getElementById('pcS2AccessNotice'); if (el) el.textContent = message;
}
async function pcS2AccessCopy(id) {
  const field = document.getElementById(id); if (!field) return;
  try { await navigator.clipboard.writeText(field.value); pcS2AccessNotice('Copied. Paste this code into the HTML editor.'); }
  catch (_error) { field.focus(); field.select(); pcS2AccessNotice('The code is selected. Use your device’s Copy command, then paste it into the HTML editor.'); }
}
function pcS2AccessUseDraft(html, source, explanation) {
  const valid = pcValidateS2HeadingRepair(html);
  if (!valid.ok) { pcS2AccessState.view = 'editor'; pcS2AccessState.notice = valid.message; pcRenderS2AccessScreen(); return false; }
  Object.assign(pcS2AccessState, { draft: valid.html, source, explanation, pasted: '', checked: new Set(), view: 'review', notice: '' });
  return pcRenderS2AccessScreen();
}
async function pcS2AccessGenerate() {
  const state = pcS2AccessState;
  if (state.busy || !state.request.trim() || scenarioIndex !== SCENARIO_INDEX.ACCESSIBILITY) return;
  const epoch = pcS2AccessEpoch, run = pcCaptureScenarioRun(SCENARIO_INDEX.ACCESSIBILITY);
  state.busy = true; state.notice = ''; pcRenderS2AccessScreen();
  showBabbageConsultOverlay('Heading repair', { speakerName:'Professor Pixel', heading:'Babbage is repairing the page structure.', body:'It receives the example HTML and your request. The information and links must stay unchanged.' });
  let response;
  try {
    response = await requestBabbageAnalysis({ analysis_type:'s2_accessibility_heading_repair', max_output_tokens:2200,
      system:'Repair only the headings in the supplied Canvas HTML. Preserve every visible word in the original order and every original link label and href. The existing Canvas page title is outside the supplied fragment. Convert What you will learn, Read the evidence, and Your task to h2; convert Before you submit to h3. Use only p,h2,h3,strong,em,a,ul,ol,li,br tags, with no attributes except original href on a. No styles, scripts, wrappers, markdown fences, or added content. Explain the change plainly. Never claim full WCAG conformance.',
      messages:[{role:'user',content:`Request: ${state.request}\n\nOriginal HTML:\n${PC_S2_PAGE_HTML}`}]
    }, 's2-accessibility-heading');
  } catch (_error) { response = {mock:true}; }
  if (epoch !== pcS2AccessEpoch || !pcIsScenarioRunCurrent(run)) return;
  state.busy = false;
  const isExample = response?.mock || response?.provider === 'local-fallback';
  const html = isExample ? pcS2HeadingExample() : response?.analysis?.repaired_html;
  const valid = pcValidateS2HeadingRepair(html);
  if (!valid.ok) {
    return showBabbageTerminalReport({reportHTML:`<article class="pc-s2-access-report"><h2>A correction is needed</h2><p>${esc(valid.message)}</p></article>`, terminalStateText:'REPAIR NEEDS A CHECK', speakerName:'Professor Pixel', readLabel:'', printLabel:'', continueLabel:'Revise my request', closeHandoff:'app', onClose:()=>{if(epoch === pcS2AccessEpoch && pcIsScenarioRunCurrent(run)){state.notice=valid.message;pcRenderS2AccessScreen();}}});
  }
  const explanation = isExample ? 'Live Babbage was unavailable or example mode was selected. This built-in repair demonstrates the same steps: real headings, original wording, original link.' : response.analysis.explanation;
  showBabbageTerminalReport({reportHTML:`<article class="pc-s2-access-report"><span>${isExample ? 'BUILT-IN EXAMPLE REPAIR' : 'LIVE BABBAGE REPAIR'}</span><h2>Real headings. Same information.</h2><p>${esc(explanation)}</p><h3>What to check next</h3><p>Compare the information and heading outline before pasting the repaired HTML into the practice editor.</p></article>`, terminalStateText:'HEADING REPAIR READY', engineLabel:isExample?'BABBAGE EXAMPLE':'BABBAGE ENGINE', speakerName:'Professor Pixel', readLabel:'', printLabel:'', continueLabel:'Review repaired HTML', closeHandoff:'app', onClose:()=>{if(epoch===pcS2AccessEpoch && pcIsScenarioRunCurrent(run))pcS2AccessUseDraft(valid.html,isExample?'example':'live',explanation);}});
}
function pcS2AccessApply() {
  const state=pcS2AccessState, result=pcValidateS2HeadingRepair(state.pasted);
  if (!result.ok || state.checked.size !== 3) return pcS2AccessNotice(result.message || 'Complete the three source checks before applying the repair.');
  state.applied=result.html; state.view='complete'; state.notice='';
  try {localStorage.setItem(PC_S2_ACCESS_STORAGE,JSON.stringify({html:result.html,request:state.request,source:state.source}));}
  catch (_error) {state.notice='The repair is applied for this session, but this browser could not save it for your next visit.';}
  // This preview deliberately does not emit legacy metacognition research events,
  // complete S2, award full-scenario XP, or change the S1 Course Guide.
  pcRenderS2AccessScreen();
}
pcRegisterUIActions({
  's2-access-noop': (_target,event) => event?.preventDefault(),
  's2-access-explore': () => {pcS2AccessState.view='explore';pcS2AccessState.notice='';pcRenderS2AccessScreen();},
  's2-access-open-resource': target => {const id=target.dataset.pcResource;if(!['page','handout','diagram'].includes(id))return;pcS2AccessState.resource=id;pcS2AccessState.opened.add(id);pcS2AccessState.view='resource';pcRenderS2AccessScreen();},
  's2-access-start-repair': () => {if(pcS2AccessState.opened.size<3)return;pcS2AccessState.view='editor';pcRenderS2AccessScreen();},
  's2-access-page-preview': () => {pcS2AccessState.resource='page';pcS2AccessState.view='resource';pcRenderS2AccessScreen();},
  's2-access-copy-source': () => pcS2AccessCopy('pcS2SourceHtml'),
  's2-access-copy-draft': () => pcS2AccessCopy('pcS2DraftHtml'),
  's2-access-request': target => {pcS2AccessState.request=target.value;const button=document.querySelector('[data-pc-action="s2-access-generate"]');if(button)button.disabled=pcS2AccessState.busy || !target.value.trim();},
  's2-access-generate': () => pcS2AccessGenerate(),
  's2-access-example': () => pcS2AccessUseDraft(pcS2HeadingExample(),'example','This is a built-in example, not a live AI response. The heading tags change while all wording and links stay the same.'),
  's2-access-revise': () => {pcS2AccessState.view='editor';pcRenderS2AccessScreen();},
  's2-access-paste': target => {pcS2AccessState.pasted=target.value;pcS2AccessState.checked.clear();const button=document.querySelector('[data-pc-action="s2-access-preview-repair"]');if(button)button.disabled=!target.value.trim();},
  's2-access-insert': () => {pcS2AccessState.pasted=pcS2AccessState.draft;pcS2AccessState.checked.clear();pcRenderS2AccessScreen();},
  's2-access-preview-repair': () => {const check=pcValidateS2HeadingRepair(pcS2AccessState.pasted);if(!check.ok)return pcS2AccessNotice(check.message);pcS2AccessState.view='verify';pcS2AccessState.notice='';pcRenderS2AccessScreen();},
  's2-access-check': target => {if(target.checked)pcS2AccessState.checked.add(target.dataset.pcCheck);else pcS2AccessState.checked.delete(target.dataset.pcCheck);const button=document.querySelector('[data-pc-action="s2-access-apply"]');if(button)button.disabled=pcS2AccessState.checked.size!==3;},
  's2-access-apply': () => pcS2AccessApply(),
  's2-access-back-editor': () => {pcS2AccessState.view='review';pcRenderS2AccessScreen();},
  's2-access-revisit': () => {pcS2AccessState.draft=pcS2AccessState.applied;pcS2AccessState.pasted=pcS2AccessState.applied;pcS2AccessState.checked.clear();pcS2AccessState.view='verify';pcRenderS2AccessScreen();},
  's2-access-reset': () => {pcS2AccessEpoch+=1;try{localStorage.removeItem(PC_S2_ACCESS_STORAGE);}catch(_error){return pcS2AccessNotice('This browser could not clear the saved practice.');}pcS2AccessState={view:'intro',resource:'page',opened:new Set(),request:PC_S2_HEADING_REQUEST,draft:'',source:'',pasted:'',checked:new Set(),notice:'',busy:false,applied:''};pcRenderS2AccessScreen();}
});
