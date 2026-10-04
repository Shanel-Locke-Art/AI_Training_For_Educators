/* s2-accessibility-state.js — S2 accessibility production owner. */

function pcCreateS2AccessState() {
  return {
    view: 'explore', resource: 'page', opened: new Set(), diagnosis: '',
    request: PC_S2_HEADING_REQUEST, draft: '', source: '', explanation: '', pasted: '',
    editorMode: 'visual', editorHeading: '', checked: new Set(), notice: '', busy: false, applied: ''
  };
}
let pcS2AccessState = pcCreateS2AccessState();
let pcS2AccessEpoch = 0;

function pcS2AccessChecksComplete() {
  return PC_S2_REPAIR_CHECKS.every(check => pcS2AccessState.checked.has(check.id));
}
function pcSaveS2AccessRepair() {
  const state = pcS2AccessState;
  try {
    localStorage.setItem(PC_S2_ACCESS_STORAGE, JSON.stringify({ html: state.applied, request: state.request, source: state.source }));
    return true;
  } catch (_error) { return false; }
}
function pcResetS2AccessPractice() {
  if (scenarioIndex !== SCENARIO_INDEX.ACCESSIBILITY) return false;
  try { localStorage.removeItem(PC_S2_ACCESS_STORAGE); }
  catch (_error) { return pcS2AccessNotice('This browser could not clear the saved practice.'); }
  pcS2AccessEpoch += 1;
  pcS2AccessState = pcCreateS2AccessState();
  return pcActivateScenario(SCENARIO_INDEX.ACCESSIBILITY);
}

function pcRenderS2Accessibility() {
  pcS2AccessEpoch += 1;
  pcS2AccessState.busy = false;
  pcS2AccessState.notice = '';
  pcS2AccessState.view = pcS2AccessState.applied ? 'complete' : 'explore';
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
