// Retired at V429 patch 489. See README.md in this folder for context.
// Extracted verbatim from src/js/scenarios/shared-components.js.

function pcShowS1AfterReflection(index, onDone = null, initialResponse = '') {
  const normalized = Math.max(0, Math.min(PC_S1_PREVIEW_CASES.length - 1, Number(index) || 0));
  const item = PC_S1_PREVIEW_CASES[normalized];
  if (!item?.reflection || scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) return false;
  return pcRouteS1ReflectionToCasePage(normalized, initialResponse, onDone);
}

function pcSubmitS1AfterReflection() {
  const state = pcS1AIWorkspaceState;
  const textarea = document.getElementById('pcS1CaseReflectionText') || document.getElementById('pcS1AfterReflectionText');
  if (!state || !textarea || pcCountS1ReflectionWords(textarea.value) < 12) return false;
  state.response = textarea.value.trim();
  pcS1PreviewChecks[state.caseIndex].reflection = state.response;
  pcClearS1AfterReflectionUI();
  return pcShowS1ReflectionLoading();
}

function pcShowS1DialogueDiagnosis(index = pcS1PreviewCaseIndex, onDone = null) {
  const normalized = Math.max(0, Math.min(PC_S1_PREVIEW_CASES.length - 1, Number(index) || 0));
  return pcRouteS1ReflectionToCasePage(normalized, '', onDone, { revealAfter: false });
}

function pcChooseS1DialogueDiagnosis(choiceId) {
  const pending = pcS1DialogueDiagnosis;
  if (!pending || scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) return false;
  const { caseIndex, onDone } = pending;
  void choiceId;
  return pcRouteS1ReflectionToCasePage(caseIndex, '', onDone, { revealAfter: false });
}

// Removed from the pcRegisterUIActions({...}) block in shared-components.js:
//   's1-dialogue-choose-diagnosis': target => pcChooseS1DialogueDiagnosis(target.dataset.pcChoice),
//   's1-submit-after-reflection': () => pcSubmitS1AfterReflection(),
