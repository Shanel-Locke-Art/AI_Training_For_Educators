// ══════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════
//  DEVELOPMENT TOOLS — CLEAN SHELL
// ══════════════════════════════════════════════════════
(function exposePromptCraftDevTools(){
  function devGoScenario(index) {
    const target = pcNormalizeScenarioIndex(index, SCENARIO_INDEX.ENGAGEMENT);
    const tab = pcUnlockScenarioTab(target);
    pcScenarioHasLaunched = true;
    return switchScenario(target, tab);
  }

  function devFillScenario(index) {
    const target = pcNormalizeScenarioIndex(index, SCENARIO_INDEX.ENGAGEMENT);
    if (target === SCENARIO_INDEX.ENGAGEMENT) return resetS1Dev();
    if (target === SCENARIO_INDEX.METACOGNITION) return resetS2Dev();
    return devGoScenario(target);
  }

  function devNextScenario() {
    return devGoScenario(Math.min(scenarioIndex + 1, SCENARIO_COUNT - 1));
  }

  pcExposeGlobals({
    devGoScenario,
    devFillScenario,
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
