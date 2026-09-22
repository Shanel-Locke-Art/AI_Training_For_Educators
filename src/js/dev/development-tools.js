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
      if (scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) {
        devGoScenario(SCENARIO_INDEX.CONTENT_AVALANCHE);
        return pcScheduleScenarioTask(
          () => window.pcFillS1StartLearningDev?.(),
          180,
          SCENARIO_INDEX.CONTENT_AVALANCHE
        );
      }
      if (window.pcFillS1StartLearningDev) return window.pcFillS1StartLearningDev();
      return devGoScenario(SCENARIO_INDEX.CONTENT_AVALANCHE);
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
        () => window.pcFillS1StartLearningDev?.(),
        150,
        SCENARIO_INDEX.CONTENT_AVALANCHE
      );
    }
    return window.pcFillS1StartLearningDev?.();
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

// P569 — keep test controls available without occupying the learning screen.
window.addEventListener('keydown', event => {
  const target = event.target;
  if (target instanceof HTMLElement && (target.matches('input, textarea, select') || target.isContentEditable)) return;

  if (event.ctrlKey && event.shiftKey && event.code === 'KeyD') {
    event.preventDefault();
    document.body.classList.toggle('pc-dev-tools-visible');
    return;
  }

  const match = event.code.match(/^Digit([1-8])$/);
  if (!match) return;
  const scenario = Number(match[1]) - 1;
  if (event.ctrlKey && event.shiftKey && !event.altKey) {
    event.preventDefault();
    window.devGoScenario?.(scenario);
  } else if (event.ctrlKey && event.altKey && !event.shiftKey) {
    event.preventDefault();
    window.devFillScenario?.(scenario);
  }
});
