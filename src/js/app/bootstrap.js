// ══════════════════════════════════════════════════════
//  SCENE ILLUSTRATION LOADER
//  Scene paths live in ASSETS.images.scenes. Add each new scenario image to
//  its named folder and update the manifest once rather than scattering paths.
// ══════════════════════════════════════════════════════
function loadSceneImage(src, fallback = '') {
  const img = document.getElementById('vnBoardImg');
  const loading = document.getElementById('vnBoardLoading');
  if (!img) return;
  const runToken = pcCaptureScenarioRun(scenarioIndex);

  if (loading) loading.style.display = 'none';
  img.classList.remove('loaded');

  if (!src) {
    img.removeAttribute('src');
    img.alt = '';
    return;
  }

  const test = new Image();
  test.onload = () => {
    if (!pcIsScenarioRunCurrent(runToken)) return;
    img.src = src;
    img.alt = 'Scene illustration';
    img.classList.add('loaded');
  };
  test.onerror = () => {
    if (!pcIsScenarioRunCurrent(runToken)) return;
    if (fallback && test.src !== pcProjectUrl(fallback)) {
      test.src = pcProjectUrl(fallback);
      return;
    }
    // A future scenario may not have final art yet. Fail silently and retain
    // the text-based smartboard rather than displaying a broken image icon.
    img.removeAttribute('src');
    img.alt = '';
    img.classList.remove('loaded');
  };
  test.src = src;
}

// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  pcHydrateStaticImages();
  // The main menu is the true application entry point. Scenario 1 is rendered
  // quietly behind it as a safe fallback, but no dialogue begins until the
  // learner chooses Start or selects a scenario.
  updateAudioSettingsButton();
  startGame();

  // V443: external PromptCraft pages (such as Ideas Wall) can return to a
  // specific shared menu destination without duplicating app UI on the page.
  // The query is intentionally presentation-only; scenario state and research
  // tracking are untouched.
  const externalOpenTarget = new URLSearchParams(window.location.search).get('open');
  if (externalOpenTarget === 'babbage') {
    openMainMenu('babbage', { initial: true });
  } else if (externalOpenTarget === 'audio') {
    window.setTimeout(() => showAudioSetup({ onboarding: false }), 80);
  }

  // Safety check: if S1 content is still empty after load, render it again.
  setTimeout(() => {
    const inputContainer = document.getElementById('inputContainer');

    if (!inputContainer || !inputContainer.textContent.trim()) {
      console.warn('[PromptCraft] Startup watchdog repaired empty initial scenario render.');
      try {
        window.scenarioIntroEnabled = false;
        loadScenario(SCENARIO_INDEX.ENGAGEMENT);
        window.pcInitialScenarioRendered = true;
      } catch (err) {
        console.error('[PromptCraft] Startup watchdog could not render S1:', err);
      }
    }
  }, 900);
});

// ══════════════════════════════════════════════════════
