/* S2 controller: learner actions and transitions. No S1 guide or legacy research writes. */
function pcS2AccessNotice(message) {
  pcS2AccessState.notice = message;
  const el = document.getElementById('pcS2AccessNotice');
  if (el) el.textContent = message;
}
function pcShowS2AccessView(view) {
  pcS2AccessState.view = view;
  pcS2AccessState.notice = '';
  return pcRenderS2AccessScreen();
}
function pcOpenS2AccessPage() {
  pcS2AccessState.resource = 'page';
  pcS2AccessState.opened.add('page');
  return pcShowS2AccessView('resource');
}
function pcIdentifyS2AccessBarrier() {
  if (!pcS2AccessState.opened.has('page')) return false;
  return pcShowS2AccessView('diagnosis');
}
function pcSelectS2AccessDiagnosis(id) {
  if (!PC_S2_DIAGNOSIS_CHOICES.some(choice => choice.id === id)) return false;
  pcS2AccessState.diagnosis = id;
  pcRenderS2AccessScreen({ focusTitle: false });
  const selected = document.querySelector(`[data-pc-choice="${id}"]`);
  pcFocusWithoutScroll(selected);
  return true;
}
function pcUpdateS2AccessButton(action, ready) {
  const button = document.querySelector(`[data-pc-action="${action}"]`);
  if (!button) return;
  button.disabled = !ready;
  if (ready) button.removeAttribute('aria-disabled');
  else button.setAttribute('aria-disabled', 'true');
}
async function pcS2AccessCopy(id) {
  const field = document.getElementById(id);
  if (!field) return;
  try { await navigator.clipboard.writeText(field.value); pcS2AccessNotice('Copied. Paste this code into the HTML editor.'); }
  catch (_error) { field.focus(); field.select(); pcS2AccessNotice('The code is selected. Use your device’s Copy command, then paste it into the HTML editor.'); }
}
function pcS2AccessUseDraft(html, source, explanation) {
  const valid = pcValidateS2HeadingRepair(html);
  if (!valid.ok) { pcS2AccessState.view = 'editor'; pcS2AccessState.notice = valid.message; pcRenderS2AccessScreen(); return false; }
  Object.assign(pcS2AccessState, { draft: valid.html, source, explanation, pasted: '', checked: new Set(), view: 'review', notice: '' });
  return pcRenderS2AccessScreen();
}
function pcPreviewS2AccessRepair() {
  const check = pcValidateS2HeadingRepair(pcS2AccessState.pasted);
  if (!check.ok) return pcS2AccessNotice(check.message);
  return pcShowS2AccessView('verify');
}
function pcCheckS2AccessRepair(target) {
  const id = target.dataset.pcCheck;
  if (!PC_S2_REPAIR_CHECKS.some(check => check.id === id)) return false;
  if (target.checked) pcS2AccessState.checked.add(id);
  else pcS2AccessState.checked.delete(id);
  pcUpdateS2AccessButton('s2-access-apply', pcS2AccessChecksComplete());
  const progress = document.querySelector('.pc-s1-learning-task-status');
  if (progress) progress.textContent = pcS2AccessProgressText();
}
function pcS2AccessApply() {
  const state = pcS2AccessState, result = pcValidateS2HeadingRepair(state.pasted);
  if (!result.ok || !pcS2AccessChecksComplete()) return pcS2AccessNotice(result.message || 'Complete the three source checks before applying the repair.');
  state.applied = result.html;
  state.view = 'complete';
  state.notice = pcSaveS2AccessRepair() ? '' : 'The repair is applied for this session, but this browser could not save it for your next visit.';
  // This is a section preview. Completion/XP/research and the S1 guide remain separate.
  return pcRenderS2AccessScreen();
}
pcRegisterUIActions({
  's2-editor-toggle-html': () => pcToggleS2EditorHTML(),
  's2-editor-select-heading': target => pcSelectS2EditorHeading(target.dataset.pcHeading),
  's2-editor-heading-style': target => pcChangeS2EditorHeadingStyle(target.value),
  's2-reader-close': () => pcCloseS2ReaderView(),
  's2-reader-play': () => pcToggleS2ReaderPlayback(),
  's2-reader-rate': target => pcChangeS2ReaderRate(target.value),
  's2-reader-size': target => { if ([20,24,30,36].includes(Number(target.value))) pcS2ReaderPreferences.size = Number(target.value); pcApplyS2ReaderPreferences(); },
  's2-reader-spacing': target => { pcS2ReaderPreferences.spacing = target.checked; pcApplyS2ReaderPreferences(); },
  's2-reader-focus': target => { pcS2ReaderPreferences.focus = target.checked; pcApplyS2ReaderPreferences(); },
  's2-reader-toggle': target => pcToggleS2ReaderDemo(target),
  's2-reader-before': () => pcPlayS2ReaderDemo('before'),
  's2-reader-after': () => pcPlayS2ReaderDemo('after'),
  's2-reader-read': () => pcPlayS2ReaderDemo('read'),
  's2-reader-stop': () => pcStopS2ReaderDemo(),
  's2-access-noop': (_target, event) => event?.preventDefault(),
  's2-access-explore': () => pcShowS2AccessView('explore'),
  's2-access-open-resource': target => target.dataset.pcResource === 'page' && pcOpenS2AccessPage(),
  's2-access-open-page': () => pcOpenS2AccessPage(),
  's2-access-identify': () => pcIdentifyS2AccessBarrier(),
  's2-access-diagnose': target => pcSelectS2AccessDiagnosis(target.dataset.pcChoice),
  's2-access-open-editor': () => { if (!pcS2AccessState.pasted) pcS2AccessState.pasted = PC_S2_PAGE_HTML; return pcShowS2AccessView('paste'); },
  's2-access-start-repair': () => pcS2AccessState.diagnosis === 'headings' && pcShowS2AccessView('editor'),
  's2-access-copy-source': () => pcS2AccessCopy('pcS2SourceHtml'),
  's2-access-copy-draft': () => pcS2AccessCopy('pcS2DraftHtml'),
  's2-access-request': target => { pcS2AccessState.request = target.value; pcUpdateS2AccessButton('s2-access-generate', !pcS2AccessState.busy && !!target.value.trim()); },
  's2-access-generate': () => pcS2AccessGenerate(),
  's2-access-example': () => pcS2AccessUseDraft(pcS2HeadingExample(), 'example', 'This is a built-in example, not a live AI response. The heading tags change while all wording and links stay the same.'),
  's2-access-revise': () => pcShowS2AccessView('editor'),
  's2-access-paste': target => { pcS2AccessState.pasted = target.value; pcS2AccessState.checked.clear(); pcUpdateS2AccessButton('s2-access-preview-repair', !!target.value.trim()); },
  's2-access-insert': () => { pcS2AccessState.pasted = pcS2AccessState.draft; pcS2AccessState.editorMode = 'html'; pcS2AccessState.checked.clear(); pcRenderS2AccessScreen(); },
  's2-access-preview-repair': () => pcPreviewS2AccessRepair(),
  's2-access-check': target => pcCheckS2AccessRepair(target),
  's2-access-apply': () => pcS2AccessApply(),
  's2-access-back-editor': () => pcShowS2AccessView('paste'),
  's2-access-review-draft': () => pcShowS2AccessView('review'),
  's2-access-revisit': () => { pcS2AccessState.draft = pcS2AccessState.applied; pcS2AccessState.pasted = pcS2AccessState.applied; pcS2AccessState.checked.clear(); pcShowS2AccessView('verify'); },
  's2-access-reset': () => pcResetS2AccessPractice()
});
