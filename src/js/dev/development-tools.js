// ══════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════
//  DEVELOPMENT TOOLS — CLEAN SHELL
// ══════════════════════════════════════════════════════
(function exposePromptCraftDevTools(){
  function devGoScenario(index) {
    const target = pcNormalizeScenarioIndex(index, SCENARIO_INDEX.CONTENT_AVALANCHE);
    const tab = pcUnlockScenarioTab(target);
    pcScenarioHasLaunched = true;
    return switchScenario(target, tab);
  }

  function devFillScenario(index) {
    const target = pcNormalizeScenarioIndex(index, SCENARIO_INDEX.CONTENT_AVALANCHE);
    if (target === SCENARIO_INDEX.CONTENT_AVALANCHE) {
      // Preserve the active case. resetS1Dev() rebuilds the preview at case 1,
      // so it is only appropriate when S1 is not already open.
      const activeS1Case = scenarioIndex === SCENARIO_INDEX.CONTENT_AVALANCHE
        && document.getElementById('pcS1CaseReflectionText');
      return activeS1Case ? pcFillS1DevFields() : resetS1Dev();
    }
    if (target === SCENARIO_INDEX.METACOGNITION) return resetS2Dev();
    return devGoScenario(target);
  }

  function devNextScenario() {
    return devGoScenario(Math.min(scenarioIndex + 1, SCENARIO_COUNT - 1));
  }

  function devFillS1TransferTask() {
    if (scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) {
      devGoScenario(SCENARIO_INDEX.CONTENT_AVALANCHE);
      return pcScheduleScenarioTask(
        () => window.pcFillS1TransferDevTask?.(),
        150,
        SCENARIO_INDEX.CONTENT_AVALANCHE
      );
    }
    return window.pcFillS1TransferDevTask?.();
  }

  function devResetProgress() {
    return resetS1Dev();
  }

  pcExposeGlobals({
    devGoScenario,
    devFillScenario,
    devFillS1TransferTask,
    devResetProgress,
    devTestScenario: devFillScenario,
    navigateToNext: devGoScenario,
    devNextScenario,
    devStatus: () => ({
      activeScenario: scenarioIndex + 1,
      implemented: SCENARIO_UI.map(item => item.implemented),
      version: PC_APP_VERSION,
      build: PC_APP_BUILD_LABEL,
      schema: PC_APP_SCHEMA_VERSION
    })
  });
})();;

pcRegisterUIActions({
  'dev-go-scenario': target => window.devGoScenario?.(target.dataset.pcScenarioIndex),
  'dev-fill-scenario': target => window.devFillScenario?.(target.dataset.pcScenarioIndex),
  'dev-fill-s1-transfer': () => window.devFillS1TransferTask?.(),
  'dev-reset-progress': () => window.devResetProgress?.(),
  'dev-next-scenario': () => window.devNextScenario?.()
});
