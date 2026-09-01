/* PROMPTCRAFT APPLICATION ACTION ROUTING
   Scenario switching and forward navigation shared by the application shell.
   Scenario gameplay and development controls stay with their own owners. */

pcRegisterUIActions({
  'switch-scenario': target => {
    const index = pcNormalizeScenarioIndex(target.dataset.pcScenarioIndex);
    return index === null ? false : switchScenario(index, target);
  },
  'navigate-next': target => window.navigateToNext?.(target.dataset.pcScenarioIndex)
});
