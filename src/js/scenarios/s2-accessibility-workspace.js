/* S2 screens composed with the production S1 task, Canvas, choice and student components. */
function pcS2AccessCanvas(content, context = 'Modules') {
  return pcRenderCanvasShell(content, { context, courseTitle: 'Community Survey', preventAction: 's2-access-noop', moduleAction: 's2-access-explore' });
}
function pcS2AccessButton(action, label, disabled = false, secondary = false) {
  return `<button type="button" class="${secondary ? 'pc-shell-secondary' : 'pc-shell-primary'}" data-pc-action="${esc(action)}" ${disabled ? 'disabled aria-disabled="true"' : ''}>${esc(label)}</button>`;
}
function pcS2AccessLena(quote) {
  const expression = pcS2AccessState.view === 'complete' ? 'confident' : ['resource', 'diagnosis', 'editor'].includes(pcS2AccessState.view) ? 'thinking' : 'neutral';
  return pcRenderCanvasStudentPanel({ name: 'Lena', portraitSrc: ASSETS.images.students.lena[expression], quote, idPrefix: 'pcS2Lena' });
}
function pcS2AccessOutline(html) {
  const result = pcValidateS2HeadingRepair(html);
  return result.ok
    ? `<ol class="pc-s2-access-outline"><li><strong>Page title:</strong> Interpret a community survey<ul>${result.headings.map(h => `<li${h.level === 3 ? ' class="is-subsection"' : ''}>${h.level === 3 ? 'Subsection: ' : 'Section: '}${esc(h.text)}</li>`).join('')}</ul></li></ol>`
    : '<p>This page has no real section headings. Its section titles are ordinary paragraphs made bold and larger.</p>';
}
function pcS2AccessProgressText() {
  const state = pcS2AccessState;
  if (['explore', 'resource'].includes(state.view)) return `${state.opened.size} of 1 page opened`;
  if (state.view === 'diagnosis') return state.diagnosis === 'headings' ? 'Repair identified' : 'Choose a repair';
  if (state.view === 'verify') return `${state.checked.size} of 3 checks complete`;
  return ({ editor: 'Prepare your request', review: 'Repair ready to review', paste: 'Practice HTML editor', complete: 'Repair saved' })[state.view] || '';
}
function pcS2AccessPage(contentHTML, navigationHTML = '') {
  return pcRenderCanvasPage({ titleId: 'pcS2CanvasPageTitle', title: 'Interpret a community survey', contentHTML, navigationHTML });
}
function pcRenderS2AccessModule() {
  const opened = pcS2AccessState.opened.has('page');
  return {
    title: 'Explore Lena’s learning page', help: 'Open the page and inspect the material Lena is trying to use.', context: 'Modules',
    quote: 'I found the page, but I keep losing track of which part explains the idea and which part tells me what to do.',
    content: `<div class="pc-s1-canvas-module-toolbar"><button type="button" data-pc-action="s2-access-noop">Collapse All</button></div>
      <div class="pc-s1-canvas-jump"><span aria-hidden="true">▸</span><strong>Jump to Module</strong></div>
      <section class="pc-s1-canvas-module" aria-labelledby="pcS2CanvasModuleTitle">
        <div class="pc-s1-canvas-module-head"><span aria-hidden="true">⌄</span><h2 id="pcS2CanvasModuleTitle">Module 4: Community Survey</h2><span class="pc-s1-canvas-module-requirement">Complete all items</span></div>
        <ul class="pc-s1-canvas-module-list"><li class="pc-s1-canvas-module-row${opened ? ' is-viewed' : ''}">
          <span class="pc-s1-canvas-row-indent" aria-hidden="true"></span><span class="pc-s1-canvas-doc-icon" aria-hidden="true"></span>
          <button type="button" class="pc-s1-canvas-item-link" data-pc-action="s2-access-open-resource" data-pc-resource="page"><span class="pc-s1-canvas-item-title">Interpret a community survey</span></button>
          <span class="pc-s1-canvas-item-type">Page</span><span class="pc-s1-canvas-status" aria-label="${opened ? 'Viewed' : 'Not yet viewed'}">${opened ? '✓' : ''}</span>
        </li></ul>
      </section>
      <div class="pc-s1-explore-footer"><div class="pc-s1-explore-progress" aria-live="polite"><strong>${esc(pcS2AccessProgressText())}</strong><span>${opened ? 'You have inspected Lena’s learning page.' : 'Open the page before choosing a repair.'}</span></div>${pcS2AccessButton('s2-access-identify', 'Continue', !opened)}</div>`
  };
}
function pcRenderS2AccessResource() {
  return {
    title: 'Inspect the page Lena sees', help: 'Read the page, then check whether its section titles work as headings.', context: 'Learning page',
    quote: 'The titles look different from the paragraphs, but my reading tool cannot jump between them.',
    content: pcS2AccessPage(`${PC_S2_PAGE_HTML}${pcRenderS2HeadingLesson()}${pcRenderS2ReaderDemo()}<details><summary>Check the headings</summary>${pcS2AccessOutline('')}<p>A reading tool cannot use these titles to move between sections.</p></details>`,
      `<nav class="pc-s1-canvas-prev-next" aria-label="Canvas item navigation">${pcS2AccessButton('s2-access-explore', 'Back to Modules', false, true)}${pcS2AccessButton('s2-access-identify', 'Continue')}</nav>`)
  };
}
function pcRenderS2AccessDiagnosis() {
  const selected = pcS2AccessState.diagnosis;
  return {
    title: 'Identify the accessibility barrier', help: 'Choose a repair that helps Lena navigate without changing the lesson.', canvas: false, className: 'pc-s1-diagnosis',
    quote: 'I need a way to move between the sections. I still need the evidence and directions to complete the work.',
    content: `<section class="pc-s1-diagnosis-card" aria-labelledby="pcS2DiagnosisQuestion">
      ${pcRenderS2HeadingLesson(true)}${pcRenderS2ReaderDemo()}
      <div class="pc-s1-diagnosis-question-block"><span class="pc-s1-result-eyebrow">Your decision</span><h2 id="pcS2DiagnosisQuestion">What would help Lena navigate this page?</h2><p class="pc-s1-diagnosis-help">Keep the information she needs to complete the learning task.</p></div>
      <div class="pc-s1-diagnosis-choices">${pcRenderLearningDiagnosisChoices({ choices: PC_S2_DIAGNOSIS_CHOICES, selected, action: 's2-access-diagnose', choiceAttribute: 'data-pc-choice' })}</div>
      <p id="pcS2DiagnosisFeedback" role="status">${selected === 'headings' ? 'Yes. Keep the information and make its structure usable by reading tools.' : selected ? 'That changes how the page looks or removes useful information. Look for a way to make the existing sections easier to navigate.' : ''}</p>
      <div class="pc-s2-access-actions pc-s2-diagnosis-footer">${pcS2AccessButton('s2-access-open-page', 'Review page', false, true)}${pcS2AccessButton('s2-access-start-repair', 'Continue', selected !== 'headings')}</div>
    </section>`
  };
}
function pcRenderS2AccessRequest() {
  const state = pcS2AccessState;
  return {
    title: 'Ask AI to repair the headings', help: 'Review the request. Babbage will handle the code.', context: 'Edit page', className: 'pc-s1-renaming',
    quote: 'Please keep the information and directions. I need the sections to work as headings.',
    content: `<div class="pc-s1-rename-instructions"><h1>Repair the learning page</h1><p>The page HTML is attached. You can describe the repair in ordinary language.</p></div>
      <section class="pc-s1-rename-editor pc-s2-access-editor" aria-labelledby="pcS2RequestLabel">
        <div class="pc-s1-rename-editor-heading"><span>Page to repair</span><strong>Interpret a community survey</strong></div>
        <label id="pcS2RequestLabel" for="pcS2Request">Your request to Babbage</label><textarea id="pcS2Request" rows="5" data-pc-input-action="s2-access-request">${esc(state.request)}</textarea>
        <details><summary>See the attached page HTML</summary><textarea id="pcS2SourceHtml" class="pc-s2-access-code" rows="8" readonly aria-label="Original page HTML">${esc(PC_S2_PAGE_HTML)}</textarea>${pcS2AccessButton('s2-access-copy-source', 'Copy page HTML', false, true)}</details>
        <div class="pc-s2-access-actions">${pcS2AccessButton('s2-access-generate', 'Ask Babbage', state.busy || !state.request.trim())}${pcS2AccessButton('s2-access-identify', 'Review decision', false, true)}</div>
        <details><summary>Practice without a live AI response</summary><p>Use a prepared example to try the same repair steps.</p>${pcS2AccessButton('s2-access-example', 'Use example repair', state.busy, true)}</details>
      </section>`
  };
}
function pcRenderS2AccessReview() {
  const state = pcS2AccessState;
  return {
    title: 'Review what changed', help: 'Compare the original structure with the repaired structure.', canvas: false, className: 'pc-s1-diagnosis-result',
    quote: 'Real headings should help me move through the page. I still need you to check that all the information is there.',
    content: `<section class="pc-s1-checkpoint-card pc-s1-diagnosis-result-card">
      <span class="pc-s1-result-eyebrow">${state.source === 'live' ? 'Babbage repair' : 'Built-in example repair'}</span><h2>Same information. Clearer structure.</h2><p>${esc(state.explanation || 'The section titles now use real headings. Before you submit belongs under Your task.')}</p>
      ${pcRenderS2ReaderDemo()}<div class="pc-s2-access-compare"><section><h3>Before</h3>${pcS2AccessOutline('')}</section><section><h3>After</h3>${pcS2AccessOutline(state.draft)}</section></div>
      <details><summary>See the repaired HTML</summary><textarea id="pcS2DraftHtml" class="pc-s2-access-code" rows="8" readonly aria-label="Repaired page HTML">${esc(state.draft)}</textarea>${pcS2AccessButton('s2-access-copy-draft', 'Copy repaired HTML', false, true)}</details>
      <div class="pc-s1-diagnosis-result-actions">${pcS2AccessButton('s2-access-revise', 'Revise request', false, true)}${pcS2AccessButton('s2-access-open-editor', 'Continue')}</div>
    </section>`
  };
}
function pcRenderS2AccessEditor() {
  return {
    title: 'Put the repair into Canvas', help: 'Replace the original code in the practice HTML editor.', context: 'Edit page', className: 'pc-s1-renaming',
    quote: 'Keep my learning page intact while you put the repaired structure in place.',
    content: `<div class="pc-s1-rename-instructions"><h1>Edit Interpret a community survey</h1><p>Use the &lt;/&gt; button below the editor to open the HTML view. Insert or paste Babbage’s repair, then return to the visual view and check the page.</p></div>${pcRenderS2CanvasEditor()}`
  };
}
function pcRenderS2AccessVerify() {
  const state = pcS2AccessState, result = pcValidateS2HeadingRepair(state.pasted);
  return {
    title: 'Check the page before saving', help: 'AI makes the repair. You check the result.', context: 'Page preview',
    quote: 'Check that I can find the sections and still have the same evidence, directions, and link.',
    content: pcS2AccessPage(result.ok ? result.html : '') + `<section class="pc-s2-access-checks"><h2>Check your repair</h2>
      <details><summary>Compare with the original</summary><article class="pc-s1-canvas-richtext">${PC_S2_PAGE_HTML}</article></details>
      <details><summary>Check the heading outline</summary>${pcS2AccessOutline(state.pasted)}</details>${pcRenderS2ReaderDemo()}
      ${PC_S2_REPAIR_CHECKS.map(({ id, label }) => `<label><input type="checkbox" data-pc-change-action="s2-access-check" data-pc-check="${id}" ${state.checked.has(id) ? 'checked' : ''}> ${esc(label)}</label>`).join('')}
      <div class="pc-s2-access-actions">${pcS2AccessButton('s2-access-back-editor', 'Back to editor', false, true)}${pcS2AccessButton('s2-access-apply', 'Save checked page', !pcS2AccessChecksComplete())}</div></section>`
  };
}
function pcRenderS2AccessComplete() {
  return {
    title: 'Heading repair complete', help: 'You kept the learning and removed a navigation barrier.', canvas: false, className: 'pc-s1-diagnosis-result',
    quote: 'I can move between the sections now. It is easier to find the evidence and return to what I need to submit.',
    content: `<section class="pc-s1-checkpoint-card pc-s1-diagnosis-result-card"><span class="pc-s1-result-eyebrow">Your checked repair</span><h2>A small repair makes a difference</h2><p>You used ${pcS2AccessState.source === 'live' ? 'Babbage' : 'a built-in example'} to turn visual titles into real headings, then checked the result before saving.</p>
      <h3>Try this in your own course</h3><p>Open a Canvas page’s HTML editor, copy its HTML into an AI request, and ask for a heading repair. Paste the checked result back, preview the page, and run your available accessibility checker.</p>
      <details><summary>Keep this request</summary><textarea id="pcS2ReusablePrompt" rows="5" readonly aria-label="Reusable AI request">${esc(pcS2AccessState.request)}</textarea></details>
      <details><summary>Course-design connection</summary><p>OSCQR 21 and WCAG 2.1 1.3.1 and 2.4.6 connect this repair to readable, meaningful page structure. This is one accessibility improvement, not a full accessibility review.</p></details>
      <div class="pc-s1-diagnosis-result-actions">${pcS2AccessButton('s2-access-revisit', 'Review repair', false, true)}${pcS2AccessButton('s2-access-reset', 'Practice again', false, true)}${pcS2AccessButton('open-main-menu', 'Return to Main Menu')}</div>
    </section>`
  };
}
function pcRenderS2AccessScreen({ focusTitle = true } = {}) {
  if (scenarioIndex !== SCENARIO_INDEX.ACCESSIBILITY) return false;
  const area = document.getElementById('chat');
  if (!area) return false;
  document.body.classList.remove('pc-s1-guide-open');
  ['nameModalOverlay', 'audioSetupOverlay'].forEach(id => {
    const modal = document.getElementById(id);
    if (modal?.hidden) { modal.inert = true; modal.style.pointerEvents = 'none'; }
  });
  const overlay = document.getElementById('vnOverlay');
  if (overlay && !overlay.classList.contains('active')) { overlay.inert = false; overlay.removeAttribute('aria-hidden'); overlay.style.removeProperty('pointer-events'); }
  pcCloseS2ReaderView(false);
  const renderers = { explore: pcRenderS2AccessModule, resource: pcRenderS2AccessResource, diagnosis: pcRenderS2AccessDiagnosis, editor: pcRenderS2AccessRequest, review: pcRenderS2AccessReview, paste: pcRenderS2AccessEditor, verify: pcRenderS2AccessVerify, complete: pcRenderS2AccessComplete };
  if (!renderers[pcS2AccessState.view]) pcS2AccessState.view = 'explore';
  const screen = renderers[pcS2AccessState.view]();
  const notice = `<p id="pcS2AccessNotice" role="status">${esc(pcS2AccessState.notice)}</p>`;
  area.innerHTML = pcRenderLearningStage({
    className: `pc-s2-access${screen.className ? ` ${screen.className}` : ''}`, titleId: 'pcS2AccessTitle', background: pcGetScenarioBackgroundAsset(SCENARIO_INDEX.ACCESSIBILITY),
    taskbarHTML: pcRenderLearningTaskbar({ label: 'Scenario 2 · Access Is Part of the Design', titleId: 'pcS2AccessTitle', title: screen.title, instruction: screen.help, status: pcS2AccessProgressText() }),
    bodyHTML: pcRenderLearningWorkspace({ mainHTML: screen.canvas === false ? screen.content.replace(/<\/section>$/, `${notice}</section>`) : `<section class="pc-s1-canvas-frame" aria-label="Lena’s Canvas course">${notice}${pcS2AccessCanvas(screen.content, screen.context)}</section>`, studentHTML: pcS2AccessLena(screen.quote) })
  });
  resetSectionScroll(area);
  document.getElementById('pcS2AccessTitle')?.setAttribute('tabindex', '-1');
  if (focusTitle) pcScheduleScenarioTask(() => { if (!document.getElementById('vnOverlay')?.classList.contains('active')) pcFocusWithoutScroll(document.getElementById('pcS2AccessTitle')); }, 80, SCENARIO_INDEX.ACCESSIBILITY);
  return true;
}
