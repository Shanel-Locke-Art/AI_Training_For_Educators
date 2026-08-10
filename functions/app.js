/* ======================================================
   PROMPTCRAFT APPLICATION CORE
   Version 320 modular JavaScript entry point.

   Load order:
     1. dialogue.js          Dialogue content
     2. app.js               State, configuration, data, and audio
     3. app-scenarios.js     Scenario data, menu, and inline coaching
     4. app-vn.js            Visual novel and responsive layout engine
     5. app-workbench.js     Workbench, scoring, completion, and dev tools

   These are classic scripts loaded synchronously in index.html. Their order is
   intentional because they share the same global lexical environment.
====================================================== */

// ══════════════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════════════
const SCENARIO_INDEX = Object.freeze({
  ENGAGEMENT: 0,
  METACOGNITION: 1,
  ASSESSMENT: 2,
  SYNC_BIAS: 3,
  HALLUCINATION: 4,
  PREDICTION: 5,
  OVERRELIANCE: 6,
  REFLECT_REVISE: 7,
});
const SCENARIO_COUNT = Object.keys(SCENARIO_INDEX).length;

let xp = 0;
let attempts = 0;
let lastPromptText = ''; // tracks last prompt for pre-filling on next attempt
let scenarioIndex = 0;
let history = [];
let scenarioCompleted = Array(SCENARIO_COUNT).fill(false);
let playerName = 'You'; // updated by name entry modal

// Audio begins in a fully silent state. The learner explicitly chooses a mode
// after the optional name step. These flags control automatic narration and
// background music; visible dialogue remains available in every mode.
const audioPreferences = { voicesEnabled: false, musicEnabled: false };
let pcAudioMode = 'silent';
let pcAudioPreferenceConfirmed = false;
let pcAudioSetupIsOnboarding = true;
let pcAudioSetupLastFocused = null;

// Main-menu state. Scenario content stays loaded behind the menu so opening and
// closing it never rebuilds Scenario 1 or disturbs the active activity.
let pcScenarioHasLaunched = false;
let pcMainMenuInitialOpen = true;
let pcMainMenuLastFocused = null;
let pcNameConfirmed = false;
let pcPendingScenarioIndex = null;

const PC_RUNTIME_DEBUG = new URLSearchParams(window.location.search).get('debug') === '1';

function pcDebug(...args) {
  if (PC_RUNTIME_DEBUG) console.debug(...args);
}

// ── SCREEN READER UTILITY ─────────────────────────────
(function() {
  const s = document.createElement('style');
  s.textContent = '.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}';
  document.head.appendChild(s);
})();

// Release focus before a modal or overlay becomes hidden. This prevents
// aria-hidden from concealing the element that still owns keyboard focus.
function pcReleaseFocusBeforeHide(container) {
  const active = document.activeElement;
  if (container && active && container.contains(active)) {
    active.blur?.();
  }
}

// v216: Focus changes during the opening sequence must not scroll the
// workbench underneath the fixed VN overlay. Browsers are surprisingly eager
// to "help" by moving the page to whichever control receives focus next.
function pcFocusWithoutScroll(element) {
  if (!element || typeof element.focus !== 'function') return false;
  try {
    element.focus({ preventScroll: true });
  } catch (error) {
    element.focus();
  }
  return true;
}

// Shared global exposure keeps legacy inline integrations and development tools
// available without scattering one-off window assignments across every module.
function pcExposeGlobals(entries = {}) {
  Object.entries(entries).forEach(([name, value]) => {
    window[name] = value;
    try { globalThis[name] = value; } catch (error) {}
  });
}

// PromptCraft renders many controls dynamically. A single delegated action
// registry prevents every render pass from attaching another collection of
// short-lived click listeners.
const PC_UI_ACTIONS = new Map();

function pcRegisterUIActions(actions = {}) {
  Object.entries(actions).forEach(([name, handler]) => {
    if (typeof handler !== 'function') {
      throw new TypeError(`[PromptCraft] UI action "${name}" must be a function.`);
    }
    PC_UI_ACTIONS.set(name, handler);
  });
}

const PC_UI_EVENT_CONFIG = Object.freeze({
  click:  { attribute: 'data-pc-action',        datasetKey: 'pcAction',       preventDefault: true },
  submit: { attribute: 'data-pc-submit-action', datasetKey: 'pcSubmitAction', preventDefault: true },
  change: { attribute: 'data-pc-change-action', datasetKey: 'pcChangeAction', preventDefault: false },
  keydown:{ attribute: 'data-pc-key-action',    datasetKey: 'pcKeyAction',    preventDefault: true },
  toggle: { attribute: 'data-pc-toggle-action', datasetKey: 'pcToggleAction', preventDefault: false }
});

function pcKeyboardActionMatches(target, event) {
  if (event.type !== 'keydown') return true;
  const allowed = String(target.dataset.pcKeys || '')
    .split(/[\s,]+/)
    .filter(Boolean);
  if (!allowed.length) return false;
  const key = event.key === ' ' ? 'Space' : event.key;
  return allowed.includes(key);
}

function pcDispatchUIAction(event) {
  const config = PC_UI_EVENT_CONFIG[event.type];
  if (!config || !(event.target instanceof Element)) return;

  const target = event.target.closest(`[${config.attribute}]`);
  if (!target || !pcKeyboardActionMatches(target, event)) return;

  const actionName = target.dataset[config.datasetKey] || '';
  const handler = PC_UI_ACTIONS.get(actionName);
  if (!handler) return;

  const shouldPreventDefault = target.dataset.pcPreventDefault === 'false'
    ? false
    : config.preventDefault;
  if (shouldPreventDefault) event.preventDefault();
  if (target.dataset.pcStopPropagation === 'true') event.stopPropagation();
  if (target.dataset.pcCloseDetails === 'true') {
    target.closest('details')?.removeAttribute('open');
  }

  try {
    const result = handler(target, event);
    if (result && typeof result.catch === 'function') {
      result.catch(error => console.error(`[PromptCraft] UI action "${actionName}" failed:`, error));
    }
  } catch (error) {
    console.error(`[PromptCraft] UI action "${actionName}" failed:`, error);
  }
}

Object.keys(PC_UI_EVENT_CONFIG).forEach(eventName => {
  document.addEventListener(eventName, pcDispatchUIAction, true);
});

pcRegisterUIActions({
  'close-details': target => target.closest('details')?.removeAttribute('open'),
  'close-other-details': target => {
    if (!target.open) return;
    document.querySelectorAll('.pc-brand-menu[open], .pc-compact-nav details[open]').forEach(menu => {
      if (menu !== target) menu.removeAttribute('open');
    });
  }
});

function pcScenarioInputMayReceiveFocusV216() {
  const vnOverlay = document.getElementById('vnOverlay');
  const mainMenu = document.getElementById('mainMenuOverlay');
  const nameModal = document.getElementById('nameModalOverlay');
  const audioSetup = document.getElementById('audioSetupOverlay');
  const isVisible = (element) => Boolean(
    element &&
    !element.hidden &&
    element.getAttribute('aria-hidden') !== 'true'
  );

  return Boolean(
    pcScenarioHasLaunched &&
    !window.pcScenarioIntroPending &&
    !vnOverlay?.classList.contains('active') &&
    !isVisible(mainMenu) &&
    !isVisible(nameModal) &&
    !isVisible(audioSetup)
  );
}

// ── NAME MODAL ────────────────────────────────────────
function showNameModal() {
  const overlay = document.getElementById('nameModalOverlay');

  if (!overlay) {
    console.warn('[PromptCraft] Name modal missing; continuing with the default player name.');
    pcNameConfirmed = true;
    showAudioSetup({ onboarding: true });
    return;
  }

  overlay.inert = false;
  overlay.hidden = false;
  overlay.setAttribute('aria-hidden', 'false');
  overlay.style.display = '';
  overlay.style.opacity = '';
  overlay.style.pointerEvents = '';
  overlay.classList.add('visible');

  // Focus the input after transition, but do not let a missing input break startup.
  setTimeout(() => {
    const input = document.getElementById('nameInput');
    if (input) input.focus();

    const style = window.getComputedStyle(overlay);
    const rect = overlay.getBoundingClientRect();
    const modalFailedVisible =
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      (rect.width === 0 && rect.height === 0);

    if (modalFailedVisible) {
      console.warn('[PromptCraft] Name modal failed to render; continuing with the default player name.');
      pcNameConfirmed = true;
      showAudioSetup({ onboarding: true });
    }
  }, 450);
}

function submitName(skip = false) {
  const input = document.getElementById('nameInput');
  const raw = skip ? '' : (input ? input.value.trim() : '');

  // Sanitise -- letters, spaces, hyphens, apostrophes, max 24 chars.
  const clean = raw.replace(/[^a-zA-Z\s'\-\.]/g, '').trim().substring(0, 24);
  playerName = clean || 'You';
  pcNameConfirmed = true;

  const overlay = document.getElementById('nameModalOverlay');
  if (overlay) {
    pcReleaseFocusBeforeHide(overlay);
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.inert = true;
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.hidden = true;
    }, 400);
  }

  updatePixelWelcomeForName();

  // Audio is always the next onboarding step. Keep the pending scenario in
  // place until the learner explicitly chooses full audio, voices, or silence.
  setTimeout(() => showAudioSetup({ onboarding: true }), 420);
}

function getAudioSetupPrompt() {
  return playerName === 'You'
    ? 'Ready? Choose what you’d like to hear in the Prompt Lab.'
    : `Ready, ${playerName}? Choose what you’d like to hear in the Prompt Lab.`;
}

function getAudioModeLabel(mode = pcAudioMode) {
  if (mode === 'full') return 'Full audio';
  if (mode === 'voices') return 'Voices only';
  return 'Keep it quiet';
}

function showAudioSetup(options = {}) {
  const overlay = document.getElementById('audioSetupOverlay');
  pcAudioSetupIsOnboarding = options.onboarding !== false && !pcAudioPreferenceConfirmed;
  pcAudioSetupLastFocused = document.activeElement;

  if (!overlay) {
    console.warn('[PromptCraft] Audio setup modal missing; continuing silently.');
    applyAudioMode('silent');
    pcAudioPreferenceConfirmed = true;
    const pendingIndex = pcPendingScenarioIndex;
    pcPendingScenarioIndex = null;
    if (Number.isInteger(pendingIndex)) {
      launchScenarioFromMenu(pendingIndex, { skipNameGate: true, skipAudioGate: true });
    }
    return false;
  }

  const title = document.getElementById('audioSetupTitle');
  const continueBtn = document.getElementById('audioSetupContinueBtn');
  const cancelBtn = document.getElementById('audioSetupCancelBtn');
  const radios = [...overlay.querySelectorAll('input[name="audioMode"]')];

  if (title) title.textContent = getAudioSetupPrompt();
  if (continueBtn) {
    continueBtn.textContent = pcAudioSetupIsOnboarding ? 'Begin the Prompt Lab' : 'Save audio settings';
    continueBtn.disabled = pcAudioSetupIsOnboarding;
  }
  if (cancelBtn) cancelBtn.hidden = pcAudioSetupIsOnboarding;

  radios.forEach(radio => {
    radio.checked = !pcAudioSetupIsOnboarding && radio.value === pcAudioMode;
  });

  overlay.inert = false;
  overlay.hidden = false;
  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('visible');
  document.body.classList.add('pc-audio-setup-open');

  setTimeout(() => {
    const selected = overlay.querySelector('input[name="audioMode"]:checked');
    (selected || radios[0] || continueBtn)?.focus();
  }, 80);
  return false;
}

function selectAudioPreference(mode) {
  const valid = ['full', 'voices', 'silent'];
  const continueBtn = document.getElementById('audioSetupContinueBtn');
  if (continueBtn) continueBtn.disabled = !valid.includes(mode);
}

function hideAudioSetup() {
  const overlay = document.getElementById('audioSetupOverlay');
  if (!overlay) return;

  pcReleaseFocusBeforeHide(overlay);
  overlay.classList.remove('visible');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.inert = true;
  document.body.classList.remove('pc-audio-setup-open');
  setTimeout(() => { overlay.hidden = true; }, 220);
}

function closeAudioSetup() {
  if (pcAudioSetupIsOnboarding) return false;
  hideAudioSetup();
  setTimeout(() => pcAudioSetupLastFocused?.focus?.(), 240);
  return false;
}

function submitAudioPreference(event) {
  event?.preventDefault?.();
  const selected = document.querySelector('input[name="audioMode"]:checked');
  if (!selected) return false;

  applyAudioMode(selected.value);
  pcAudioPreferenceConfirmed = true;
  const wasOnboarding = pcAudioSetupIsOnboarding;
  hideAudioSetup();

  if (wasOnboarding) {
    const pendingIndex = pcPendingScenarioIndex;
    pcPendingScenarioIndex = null;
    if (Number.isInteger(pendingIndex)) {
      setTimeout(() => launchScenarioFromMenu(pendingIndex, {
        skipNameGate: true,
        skipAudioGate: true
      }), 240);
    }
  } else {
    setTimeout(() => pcAudioSetupLastFocused?.focus?.(), 240);
  }
  return false;
}

window.addEventListener('keydown', event => {
  const overlay = document.getElementById('audioSetupOverlay');
  if (!overlay || overlay.hidden || !overlay.classList.contains('visible')) return;

  if (event.key === 'Escape' && !pcAudioSetupIsOnboarding) {
    event.preventDefault();
    closeAudioSetup();
  }
});

pcRegisterUIActions({
  'submit-name': target => submitName(target.dataset.pcSkip === 'true'),
  'select-audio-preference': target => selectAudioPreference(target.value),
  'submit-audio-preference': (_target, event) => submitAudioPreference(event),
  'close-audio-setup': () => closeAudioSetup(),
  'show-audio-settings': () => showAudioSetup({ onboarding: false })
});

function updatePixelWelcomeForName() {
  if (playerName !== 'You') {
    // Personalise the welcome dialogue
    pixelDialogue.welcome[0].text =
      `Welcome to the Prompt Lab, ${playerName}! I am Professor Pixel, your AI coaching companion.`;
  }
}

function getInitials(name) {
  if (name === 'You') return 'YOU';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 3).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function startGame() {
  if (window.pcGameStarted) return;
  window.pcGameStarted = true;
  pcSyncAppVersionLabels();

  // S1 remains rendered behind the menu as the safe default, but its VN intro
  // does not begin until the learner actually chooses a scenario.
  window.scenarioIntroEnabled = false;

  try {
    loadScenario(SCENARIO_INDEX.ENGAGEMENT);
    window.pcInitialScenarioRendered = true;
  } catch (err) {
    console.error('[PromptCraft] Initial scenario render failed:', err);
  }

  renderMainMenu();
  openMainMenu('home', { initial: true });
}

// ══════════════════════════════════════════════════════
//  SURVEY CONFIGURATION
//  Change SURVEY_MODE to 'sheets' or 'qualtrics' when ready
//  Paste your Google Apps Script Web App URL into SHEETS_URL
// ══════════════════════════════════════════════════════
const SURVEY_MODE   = 'sheets';
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzgR2zSd3nP_qmWPlqgWa67bONHuUbbgxPovqYL7cxSJocD8ama16XGpCoAJV9N3U0/exec';
const QUALTRICS_URL = 'YOUR_QUALTRICS_SURVEY_URL_HERE';

// ══════════════════════════════════════════════════════
//  BUILD + DATA SCHEMA VERSIONING
//  The app version is read from the active bundle's cache-busting query in index.html.
//  Update functions/app.bundle.js?v=### once and the console build label and main-menu
//  version will stay synchronized automatically. Change the schema only when
//  the saved research-data structure changes.
// ══════════════════════════════════════════════════════
const PC_APP_SCRIPT_URL = (() => {
  const script = [...document.scripts].find(item =>
    /(?:^|\/)functions\/(?:app\.bundle|app)\.js(?:[?#]|$)/.test(item.src)
  );
  return script?.src || new URL('functions/app.bundle.js', document.baseURI).href;
})();
const PC_APP_VERSION = new URL(PC_APP_SCRIPT_URL).searchParams.get('v') || 'DEV';
const PC_APP_SCHEMA_VERSION = 'V121';
const PC_APP_BUILD_LABEL = `PROMPTCRAFT_V${PC_APP_VERSION}`;

function pcSyncAppVersionLabels() {
  const versionText = `Version ${PC_APP_VERSION}`;
  document.querySelectorAll('[data-pc-app-version], #mainMenuVersion').forEach((element) => {
    element.textContent = versionText;
  });
}

pcDebug('[PromptCraft] Loaded app.js build:', PC_APP_BUILD_LABEL, 'schema:', PC_APP_SCHEMA_VERSION);

// ══════════════════════════════════════════════════════
//  ASSET PATHS
//  Resolve every runtime asset from the project root, not from whichever URL
//  the browser happens to treat as the current document. This keeps images
//  working in nested hosting folders, Live Server, and copied project builds.
// ══════════════════════════════════════════════════════
const PC_PROJECT_ROOT_URL = new URL('../', PC_APP_SCRIPT_URL);

function pcProjectUrl(path = '') {
  const cleanPath = String(path).replace(/^\.\//, '').replace(/^\//, '');
  return new URL(cleanPath, PC_PROJECT_ROOT_URL).href;
}

function pcSetImageFallbackVisibility(img, showFallback) {
  if (!img) return;
  const fallbackId = img.dataset.pcFallbackElement || '';
  const fallbackElement = fallbackId ? document.getElementById(fallbackId) : null;
  const loadedDisplay = img.dataset.pcLoadedDisplay || '';

  img.style.display = showFallback ? 'none' : loadedDisplay;
  if (fallbackElement) fallbackElement.style.display = showFallback ? (fallbackElement.dataset.pcFallbackDisplay || 'flex') : 'none';
}

function pcUseImageFallback(img, fallback = '') {
  if (!img) return;
  const fallbackPath = fallback || img.dataset.pcFallback || '';
  if (!fallbackPath || img.dataset.pcFallbackApplied === 'true') {
    pcSetImageFallbackVisibility(img, true);
    return;
  }
  img.dataset.pcFallbackApplied = 'true';
  img.src = /^([a-z]+:|data:|blob:)/i.test(fallbackPath)
    ? fallbackPath
    : pcProjectUrl(fallbackPath);
}

function pcSetImageSource(img, primary, fallback = '') {
  if (!img || !primary) return;
  img.dataset.pcFallback = fallback || '';
  img.dataset.pcFallbackApplied = 'false';
  img.onload = () => pcSetImageFallbackVisibility(img, false);
  img.onerror = () => pcUseImageFallback(img, fallback);
  img.src = /^([a-z]+:|data:|blob:)/i.test(primary)
    ? primary
    : pcProjectUrl(primary);
}

function pcHydrateStaticImages() {
  document.querySelectorAll('img[data-pc-image]').forEach(img => {
    pcSetImageSource(img, img.dataset.pcImage, img.dataset.pcFallback || '');
  });
}

pcExposeGlobals({
  pcProjectUrl,
  pcUseImageFallback,
  pcSetImageSource
});

const ASSETS = Object.freeze({
  images: Object.freeze({
    backgrounds: Object.freeze({
      app: pcProjectUrl('assets/images/backgrounds/app-background.png?v=2'),
      classroom: pcProjectUrl('assets/images/backgrounds/classroom.png')
    }),
    professorPixel: Object.freeze({
      neutral: pcProjectUrl('assets/images/characters/professor-pixel/neutral.png'),
      thinking: pcProjectUrl('assets/images/characters/professor-pixel/thinking.png'),
      excited: pcProjectUrl('assets/images/characters/professor-pixel/excited.png'),
      encouraging: pcProjectUrl('assets/images/characters/professor-pixel/encouraging.png'),
      skeptical: pcProjectUrl('assets/images/characters/professor-pixel/skeptical.png'),
      proud: pcProjectUrl('assets/images/characters/professor-pixel/proud.png')
    }),
    students: Object.freeze({
      jordan: Object.freeze({
        neutral: pcProjectUrl('assets/images/characters/students/jordan/neutral.png'),
        uncertain: pcProjectUrl('assets/images/characters/students/jordan/uncertain.png'),
        frustrated: pcProjectUrl('assets/images/characters/students/jordan/frustrated.png'),
        thinking: pcProjectUrl('assets/images/characters/students/jordan/thinking.png'),
        confident: pcProjectUrl('assets/images/characters/students/jordan/confident.png')
      })
    }),
    scenes: Object.freeze({
      0: pcProjectUrl('assets/images/scenes/scenario-01-engagement/scene.png'),
      1: pcProjectUrl('assets/images/scenes/scenario-02-metacognition/scene.png'),
      2: pcProjectUrl('assets/images/scenes/scenario-03-authentic-assessment/scene.png'),
      3: pcProjectUrl('assets/images/scenes/scenario-04-sync-bias/scene.png'),
      4: pcProjectUrl('assets/images/scenes/scenario-05-hallucination-hunt/scene.png'),
      5: pcProjectUrl('assets/images/scenes/scenario-06-predict-output/scene.png'),
      complete: pcProjectUrl('assets/images/scenes/completion/all-scenarios-complete.png')
    })
  }),
  audio: Object.freeze({
    music: Object.freeze({
      background: pcProjectUrl('assets/audio/music/background.mp3')
    }),
    professorPixel: Object.freeze({
      welcome: pcProjectUrl('assets/audio/voice/professor-pixel/system/welcome.mp3'),
      vague: pcProjectUrl('assets/audio/voice/professor-pixel/feedback/vague.mp3'),
      decent: pcProjectUrl('assets/audio/voice/professor-pixel/feedback/decent.mp3'),
      strong: pcProjectUrl('assets/audio/voice/professor-pixel/feedback/strong.mp3'),
      scenarioComplete: pcProjectUrl('assets/audio/voice/professor-pixel/completion/scenario-complete.mp3'),
      allComplete: pcProjectUrl('assets/audio/voice/professor-pixel/completion/all-complete.mp3'),
      scenarioIntro0: pcProjectUrl('assets/audio/voice/professor-pixel/scenario-01/intro.mp3'),
      reflectionOpen: pcProjectUrl('assets/audio/voice/professor-pixel/reflection/open.mp3')
    })
  })
});

const LEGACY_ASSETS = Object.freeze({
  images: Object.freeze({
    backgrounds: Object.freeze({
      app: 'images/background.png',
      classroom: 'images/classroom-bg.png'
    }),
    professorPixel: Object.freeze({
      neutral: 'images/pixel-neutral.png',
      thinking: 'images/pixel-thinking.png',
      excited: 'images/pixel-excited.png',
      encouraging: 'images/pixel-encouraging.png',
      skeptical: 'images/pixel-skeptical.png',
      proud: 'images/pixel-proud.png'
    }),
    students: Object.freeze({
      jordan: Object.freeze({
        neutral: 'images/characters/students/jordan/neutral.png',
        uncertain: 'images/characters/students/jordan/uncertain.png',
        frustrated: 'images/characters/students/jordan/frustrated.png',
        thinking: 'images/characters/students/jordan/thinking.png',
        confident: 'images/characters/students/jordan/confident.png'
      })
    }),
    scenes: Object.freeze({
      0: 'images/scene-s1.png',
      1: 'images/scene-s2.png',
      2: 'images/scene-s3.png',
      3: 'images/scene-s4.png',
      4: 'images/scene-s5.png',
      5: 'images/scene-s6.png',
      complete: 'images/scene-complete.png'
    })
  })
});

// Make CSS background paths use the same project-root resolution as JavaScript.
document.documentElement.style.setProperty('--pc-app-background', `url("${ASSETS.images.backgrounds.app}")`);
document.documentElement.style.setProperty('--pc-app-background-legacy', 'none');


// Robust Google Sheets poster.
// Uses text/plain so browser no-cors requests are not silently mangled by preflight/CORS rules.
// Apps Script still receives the JSON string in e.postData.contents.
const PC_SHEETS_DEBUG = PC_RUNTIME_DEBUG;

async function postToSheets(payload, label = 'PromptCraft data') {
  if (SURVEY_MODE !== 'sheets' || !SHEETS_URL || SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    console.warn('[PromptCraft] Sheets URL is not configured. Skipping:', label);
    return false;
  }

  const body = JSON.stringify(payload || {});

  try {
    if (PC_SHEETS_DEBUG) pcDebug(`[PromptCraft] Sending ${label} to Sheets:`, payload);

    await fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body
    });

    if (PC_SHEETS_DEBUG) pcDebug(`[PromptCraft] Sheets request dispatched: ${label}`);
    return true;
  } catch (err) {
    console.warn(`[PromptCraft] fetch failed for ${label}:`, err);
  }

  // Fallback for some browser/security contexts.
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
      const ok = navigator.sendBeacon(SHEETS_URL, blob);
      pcDebug(`[PromptCraft] sendBeacon fallback ${ok ? 'queued' : 'failed'}: ${label}`);
      return ok;
    }
  } catch (err) {
    console.warn(`[PromptCraft] sendBeacon failed for ${label}:`, err);
  }

  return false;
}

// Run from DevTools console: testSheetsPing()
window.testSheetsPing = function testSheetsPing() {
  return postToSheets({
    type: 'incremental',
    schema_version: PC_APP_SCHEMA_VERSION,
    app_build: PC_APP_BUILD_LABEL,
    timestamp: new Date().toISOString(),
    participant_id: 'browser-test',
    scenario_index: 'TEST',
    scenario_label: 'Browser ping',
    session_duration_min: 0,
    attempts: 0,
    current_score: '',
    best_score: '',
    score_delta: '',
    prompt_text: 'Browser-to-Apps-Script test ping',
    claude_response: 'If this row appears, the deployed site can write to Sheets.',
    quality_indicators_lit: '',
    self_report_prediction: '',
    time_since_last_attempt_sec: '',
    screen_width: window.innerWidth || window.screen.width,
    event_type: 'browser_test_ping',
    session_id: pcSessionId,
    notes_coding_memo: location.href
  }, 'browser test ping');
};


// ══════════════════════════════════════════════════════
//  LOCAL TESTING / MOCK CLAUDE FALLBACK
//  Lets VS Code Live Server progress through scenarios without Netlify.
//  Add ?mockClaude=1 to force mock mode anywhere.
// ══════════════════════════════════════════════════════
const MOCK_CLAUDE_FOR_LOCAL = false;
const FORCE_MOCK_CLAUDE = new URLSearchParams(window.location.search).get('mockClaude') === '1';
const IS_LOCAL_TEST = ['localhost', '127.0.0.1', ''].includes(window.location.hostname) || window.location.protocol === 'file:';
const USE_MOCK_CLAUDE = FORCE_MOCK_CLAUDE || (MOCK_CLAUDE_FOR_LOCAL && IS_LOCAL_TEST);

// NOTE: Mock Claude text is dialogue/content-heavy. Move to dialogue.js in a later pass if desired.
function mockClaudeText(payload, context = 'main') {
  const system = payload.system || '';

  if (context === 'pixel' || system.includes('You are Professor Pixel')) {
    return `You gave Claude enough direction to produce a usable response, especially where your prompt named the actual teaching problem. The next improvement is to make the success criteria more visible so Claude knows what a strong student outcome should look like.\n\n*What would you want students to do, say, or produce that would prove the activity worked?*`;
  }

  if (context === 'growth' || system.includes('personalized growth summary')) {
    return `Scenario 1 shows how learner context, constraints, and explicit interaction moves can turn a vague AI request into a more useful instructional design draft. Additional growth reporting will be added as the remaining scenarios are rebuilt.`;
  }

  if (scenarioIndex !== SCENARIO_INDEX.ENGAGEMENT) {
    return `This scenario is currently a clean development shell and does not send prompts to Claude.`;
  }

  const values = (window.playerHistory && window.playerHistory.s1) || (typeof getS1GuidedValues === 'function' ? getS1GuidedValues() : {});
  const checks = typeof analyzeS1Guided === 'function' ? analyzeS1Guided(values) : {};
  const problems = [];
  if (checks.demeaning) problems.push('the learner description uses demeaning language instead of usable learner characteristics');
  if (!checks.audience) problems.push('the learner/course context is not specific enough to guide a redesign');
  if (!checks.issue) problems.push('the problem statement is too vague to diagnose the instructional failure');
  if (!checks.interaction) problems.push('the requested interaction does not define an observable peer-to-peer thinking move');
  if (!checks.constraints) problems.push('the constraints are too thin to shape a realistic activity');
  if (!checks.success) problems.push('there is no clear criterion for what a successful contribution should demonstrate');

  if (problems.length) {
    const summary = problems.slice(0, 3).join('; ') + '.';
    const worked = [
      checks.issue ? `You did identify a discussion problem: ${values.issue}` : '',
      checks.constraints ? `You supplied at least one practical boundary: ${values.constraints}` : ''
    ].filter(Boolean).join(' ') || 'There is not yet enough instructionally useful detail to treat this as a strong repair.';
    return `STATUS\nNEEDS REVISION BEFORE REDESIGN\n\nCONFIDENCE\nHIGH\n\nFEEDBACK SUMMARY\nThis input should not be treated as a strong repair. ${summary}\n\nWHAT WORKED\n${worked}\n\nISSUE DETECTED\n${problems[0]}. The current notes would force Claude to invent important instructional decisions rather than respond to your actual design.\n\nRECOMMENDED REPAIR\nReplace vague or judgmental wording with observable information: who the learners are, what students are currently doing, what intellectual move peers should make with one another, and what evidence would show the discussion worked.\n\nEXPECTED IMPACT\nA more concrete and respectful description gives Claude evidence it can actually reason from, which should produce a redesign that matches the course instead of a generic discussion template.\n\nREVISED DISCUSSION PROMPT\nChoose one claim or interpretation from this week's reading. Explain it in your initial post and support it with a specific passage, example, or piece of evidence. Respond to two classmates by engaging directly with their reasoning: extend, challenge, compare, or question an idea and explain why. At least one reply should give your classmate a clear reason to respond again.\n\nCOURSE QUALITY CHECK\nClear Objectives: partially addressed. Student Interaction: needs clearer direction. Real-World Context: not established from the notes. Inclusive Design: insufficient information. Measurable Outcomes: needs explicit success criteria.`;
  }

  return `STATUS\nSTRONG REPAIR WITH A CLEAR INTERACTION PURPOSE\n\nCONFIDENCE\nHIGH\n\nFEEDBACK SUMMARY\nYour notes identify the learner context, the observed discussion problem, a specific peer-interaction move, and practical constraints. The redesign can therefore respond to your actual course rather than inventing the missing pieces.\n\nWHAT WORKED\nLearners: ${values.learners}\nProblem: ${values.issue}\nInteraction: ${values.interaction}\nConstraints: ${values.constraints}\nThese details give the redesign concrete instructional boundaries.\n\nISSUE DETECTED\nThe strongest remaining refinement is to make the two required peer replies serve visibly different purposes so students cannot satisfy both with the same generic move.\n\nRECOMMENDED REPAIR\nGive one reply an extend/challenge/compare purpose and the other a genuine follow-up-question or contrasting-example purpose.\n\nEXPECTED IMPACT\nDistinct reply moves reduce repetition and create more than one pathway for a conversation to continue.\n\nREVISED DISCUSSION PROMPT\nChoose one interpretation of this week's reading that you find convincing, questionable, or difficult to apply. Explain your interpretation and support it with one specific example or piece of evidence. Then respond substantively to two classmates. In one reply, extend, challenge, or compare a classmate's interpretation using evidence or a concrete example. In the other, ask a genuine follow-up question or introduce a contrasting example that invites further discussion.\n\nCOURSE QUALITY CHECK\nClear Objectives: addressed. Student Interaction: strongly addressed. Real-World Context: use when relevant to the reading. Inclusive Design: multiple response moves support participation. Measurable Outcomes: the initial evidence and two substantive replies are observable.`;
}


function mockClaudeResponse(payload, context = 'main', reason = 'forced') {
  pcDebug(`[PromptCraft] Using mock Claude response for ${context} (${reason}).`);
  return Promise.resolve({
    content: [{ text: mockClaudeText(payload, context) }],
    mock: true,
    mockReason: reason
  });
}

const CLAUDE_REQUEST_TIMEOUT_MS = 25000;

async function callClaude(payload, context = 'main') {
  if (USE_MOCK_CLAUDE) return mockClaudeResponse(payload, context, FORCE_MOCK_CLAUDE ? 'query-parameter' : 'local-test');

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), CLAUDE_REQUEST_TIMEOUT_MS)
    : null;

  try {
    const res = await fetch('/.netlify/functions/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    });

    if (!res.ok) throw new Error(`Claude function returned ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error?.message || 'Claude returned an error');
    return data;
  } catch (err) {
    /*
      Live-site protection:
      If the Netlify function stalls, fails, or returns HTML instead of JSON,
      keep the game moving with the local mock response instead of leaving
      Professor Pixel stranded in terminal purgatory.
    */
    console.warn('[PromptCraft] Claude unavailable or timed out; using mock response:', err && err.message ? err.message : err);
    return mockClaudeResponse(payload, context, 'backend-unavailable');
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

// ══════════════════════════════════════════════════════
//  BEHAVIORAL DATA TRACKING
//  Records rich session data for dissertation analysis
// ══════════════════════════════════════════════════════
const sessionStart = Date.now();
const pcSessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Per-scenario tracking. Special fields are assigned by named scenario index
// so rearranging presentation order cannot silently corrupt research data.
const scenarioData = Array.from({ length: SCENARIO_COUNT }, (_, index) => {
  const base = {
    attempts: 0,
    prompts: [],
    bestScore: 0,
    finalResponse: '',
    oscqrLit: '',
  };

  if (index === SCENARIO_INDEX.METACOGNITION) {
    return {
      ...base,
      diagnosisAttempts: [],
      diagnosisFinal: [],
      evidenceAttempts: [],
      evidenceFinal: [],
      openingCheckpointReached: false,
    };
  }
  if (index === SCENARIO_INDEX.HALLUCINATION) {
    return { ...base, selfReport: '' };
  }
  if (index === SCENARIO_INDEX.PREDICTION) {
    return { ...base, prediction: '', predictionCorrect: false };
  }
  if (index === SCENARIO_INDEX.OVERRELIANCE) {
    return { ...base, overrelianceDecisions: {} };
  }
  if (index === SCENARIO_INDEX.REFLECT_REVISE) {
    return {
      ...base,
      initialPrompt: '',
      revisedPrompt: '',
      initialScore: 0,
      revisedScore: 0,
      scoreDelta: 0,
      reflection1: '',
      reflection2: '',
      reflection3: '',
    };
  }
  return base;
});

const pcLastIncrementalSaveAt = {};

function pcFormatPredictionChoice(choice) {
  if (!choice) return '';
  const labels = (typeof PC_PREDICTION_LABELS !== 'undefined' && PC_PREDICTION_LABELS) ? PC_PREDICTION_LABELS : {};
  return labels[choice] || String(choice).replace(/_/g, ' ');
}

function pcFormatPredictionsForSave(s, scenarioIdx) {
  if (!s) return '';

  if (s.selfReport) return s.selfReport;

  const predictions = Array.isArray(s.predictions) ? s.predictions : [];
  if (predictions.length) {
    return predictions.map((p, i) => {
      if (!p || typeof p !== 'object') return String(p || '');
      const attempt = p.attempt || (i + 1);
      const choice = p.choice || p.prediction || '';
      const label = pcFormatPredictionChoice(choice);
      return `Attempt ${attempt}: ${label || choice}`;
    }).filter(Boolean).join(' | ');
  }

  if (s.prediction) return pcFormatPredictionChoice(s.prediction);
  return '';
}

function pcFormatAllPresubmitPredictions() {
  return scenarioData.map((s, i) => {
    const text = pcFormatPredictionsForSave(s, i);
    return text ? `S${i + 1}: ${text}` : `S${i + 1}: none recorded`;
  }).join(' || ');
}

function pcGetLatestPredictionChoice(s) {
  if (!s) return '';
  const predictions = Array.isArray(s.predictions) ? s.predictions : [];
  const latest = predictions.length ? predictions[predictions.length - 1] : null;
  return (latest && latest.choice) || s.prediction || '';
}


function getPromptCraftScenarioLabel(scenarioIdx) {
  return PC_SCENARIO_LABELS[scenarioIdx] || `S${scenarioIdx + 1}`;
}

function getPromptCraftViewportWidth() {
  return window.innerWidth || document.documentElement.clientWidth || window.screen.width || '';
}


function trackPrompt(scenarioIdx, promptText, score, aiResponse, oscqrActive) {
  const s = scenarioData[scenarioIdx];
  if (!s) return;

  const now = Date.now();
  const previousAttemptAt = typeof s.lastAttemptAt === 'number' ? s.lastAttemptAt : null;
  const previousScore = typeof s.currentScore === 'number' ? s.currentScore : null;

  s.timeSincePreviousAttemptSec = previousAttemptAt ? Math.round((now - previousAttemptAt) / 1000) : 0;
  s.lastAttemptAt = now;

  s.currentScore = Number(score || 0);
  s.scoreDelta = previousScore === null ? 0 : Number((s.currentScore - previousScore).toFixed(2));

  s.attempts++;
  s.prompts.push(promptText);
  if (s.currentScore > s.bestScore) s.bestScore = s.currentScore;
  s.finalResponse = String(aiResponse || '').replace(/<[^>]+>/g, '').substring(0, 1200);
  s.oscqrLit = Array.isArray(oscqrActive) ? oscqrActive.join(', ') : String(oscqrActive || '');
}


// ══════════════════════════════════════════════════════
//  GROWTH SCORING — normalize all 8 scenarios to 0–5
// ══════════════════════════════════════════════════════
function buildGrowthScores() {
  const scores = scenarioData.map((item, index) => getScenarioUI(index).implemented ? (item.bestScore || 0) : 0);
  return {
    s1: scores[0], s2: scores[1], s3: scores[2], s4: scores[3],
    s5: scores[4], s6: scores[5], s7: scores[6], s8: scores[7],
    delta: 0,
    trajectory: scores,
    implementedCount: SCENARIO_UI.filter(item => item.implemented).length,
    threshold_met: scores.filter((score, index) => getScenarioUI(index).implemented && score >= 3).length
  };
}


async function generateGrowthReport(reflectionAnswers) {
  const score = scenarioData[SCENARIO_INDEX.ENGAGEMENT].bestScore || 0;
  return `Scenario 1 score: ${score}/5. Additional growth reporting will be added as Scenarios 2–8 are rebuilt and their research measures are finalized.`;
}


function buildGrowthTableHTML(g) {
  return `<div class="growth-shell-note"><strong>Scenario 1:</strong> ${g.s1}/5. Additional scenario rows will appear as each clean shell is implemented.</div>`;
}


function buildSessionPayload(formData) {
  const durationMin = ((Date.now() - sessionStart) / 60000).toFixed(1);
  const totalAttempts = scenarioData.reduce((sum, s) => sum + (s.attempts || 0), 0);

  // Build S7 decisions object from scenarioData
  const d7 = scenarioData[SCENARIO_INDEX.OVERRELIANCE]?.overrelianceDecisions || {};

  return {
    type: 'full_response',
    schema_version: PC_APP_SCHEMA_VERSION,
    app_build: PC_APP_BUILD_LABEL,

    // Session
    timestamp:            new Date().toISOString(),
    participant_id:       (formData ? formData.get('participant_id') : null) || (playerName !== 'You' ? playerName : 'anonymous'),
    session_id:           pcSessionId,
    session_duration_min: parseFloat(durationMin),
    scenarios_completed:  scenarioCompleted.filter(Boolean).length,
    total_xp:             Math.round(xp),
    total_attempts:       totalAttempts,
    presubmit_predictions: pcFormatAllPresubmitPredictions(),

    // S1
    s1_attempts:          scenarioData[SCENARIO_INDEX.ENGAGEMENT].attempts,
    s1_best_score:        scenarioData[SCENARIO_INDEX.ENGAGEMENT].bestScore,
    s1_prompts:           scenarioData[SCENARIO_INDEX.ENGAGEMENT].prompts.join(' | '),
    s1_final_response:    scenarioData[SCENARIO_INDEX.ENGAGEMENT].finalResponse,
    s1_oscqr:             scenarioData[SCENARIO_INDEX.ENGAGEMENT].oscqrLit,
    s1_section_reviews:   JSON.stringify(scenarioData[SCENARIO_INDEX.ENGAGEMENT].sectionReviews || []),

    // S2
    s2_attempts:          scenarioData[SCENARIO_INDEX.METACOGNITION].attempts,
    s2_best_score:        scenarioData[SCENARIO_INDEX.METACOGNITION].bestScore,
    s2_prompts:           scenarioData[SCENARIO_INDEX.METACOGNITION].prompts.join(' | '),
    s2_final_response:    scenarioData[SCENARIO_INDEX.METACOGNITION].finalResponse,
    s2_oscqr:             scenarioData[SCENARIO_INDEX.METACOGNITION].oscqrLit,

    // S3
    s3_attempts:          scenarioData[SCENARIO_INDEX.ASSESSMENT].attempts,
    s3_best_score:        scenarioData[SCENARIO_INDEX.ASSESSMENT].bestScore,
    s3_prompts:           scenarioData[SCENARIO_INDEX.ASSESSMENT].prompts.join(' | '),
    s3_final_response:    scenarioData[SCENARIO_INDEX.ASSESSMENT].finalResponse,
    s3_oscqr:             scenarioData[SCENARIO_INDEX.ASSESSMENT].oscqrLit,

    // S4 — synchronous assumption bias
    s4_attempts:          scenarioData[SCENARIO_INDEX.SYNC_BIAS].attempts,
    s4_best_score:        scenarioData[SCENARIO_INDEX.SYNC_BIAS].bestScore,
    s4_prompts:           scenarioData[SCENARIO_INDEX.SYNC_BIAS].prompts.join(' | '),
    s4_final_response:    scenarioData[SCENARIO_INDEX.SYNC_BIAS].finalResponse,
    s4_oscqr:             scenarioData[SCENARIO_INDEX.SYNC_BIAS].oscqrLit,

    // S5 — hallucination hunt
    s5_attempts:          scenarioData[SCENARIO_INDEX.HALLUCINATION].attempts,
    s5_best_score:        scenarioData[SCENARIO_INDEX.HALLUCINATION].bestScore || 0,
    s5_self_report:       scenarioData[SCENARIO_INDEX.HALLUCINATION].selfReport || '',
    s5_prompts:           scenarioData[SCENARIO_INDEX.HALLUCINATION].prompts.join(' | '),
    s5_final_response:    scenarioData[SCENARIO_INDEX.HALLUCINATION].finalResponse || '',

    // S6 — predict the output
    s6_attempts:          scenarioData[SCENARIO_INDEX.PREDICTION].attempts,
    s6_prediction:        scenarioData[SCENARIO_INDEX.PREDICTION].prediction || '',
    s6_prediction_correct: scenarioData[SCENARIO_INDEX.PREDICTION].predictionCorrect ? 'yes' : 'no',
    s6_prompts:           scenarioData[SCENARIO_INDEX.PREDICTION].prompts.join(' | '),

    // S7 — overreliance decisions
    s7_decisions: {
      policy:     d7.policy     || '',
      cases:      d7.cases      || '',
      pledge:     d7.pledge     || '',
      scenarios:  d7.scenarios  || '',
      objectives: d7.objectives || '',
    },
    s7_best_score:        scenarioData[SCENARIO_INDEX.OVERRELIANCE].bestScore || 0,

    // S8 — reflect & revise
    s8_initial_prompt:    scenarioData[SCENARIO_INDEX.REFLECT_REVISE].initialPrompt  || '',
    s8_initial_score:     scenarioData[SCENARIO_INDEX.REFLECT_REVISE].initialScore   || 0,
    s8_revised_prompt:    scenarioData[SCENARIO_INDEX.REFLECT_REVISE].revisedPrompt  || '',
    s8_revised_score:     scenarioData[SCENARIO_INDEX.REFLECT_REVISE].revisedScore   || 0,
    s8_score_delta:       scenarioData[SCENARIO_INDEX.REFLECT_REVISE].scoreDelta     || 0,
    s8_reflection_1:      scenarioData[SCENARIO_INDEX.REFLECT_REVISE].reflection1    || '',
    ai_narrative:         '',  // populated after async generation
    growth_json:          '',  // populated after async generation
    s8_reflection_2:      scenarioData[SCENARIO_INDEX.REFLECT_REVISE].reflection2    || '',
    s8_reflection_3:      scenarioData[SCENARIO_INDEX.REFLECT_REVISE].reflection3    || '',

    // Reflection Room
    q1_surprise:    formData ? (formData.get('q1_surprise')  || '') : '',
    q2_unexpected:  formData ? (formData.get('q2_change')    || '') : '',
    q3_transfer:    formData ? (formData.get('q3_practice')  || '') : '',
    q4_other:       formData ? (formData.get('q4_other')     || '') : '',

    // Metadata
    screen_width: getPromptCraftViewportWidth(),
    referrer:     document.referrer || 'direct'
  };
}

async function saveIncrementalData(scenarioIdx) {
  // Don't save if no attempts were made — avoids phantom rows from dev navigation.
  if ((scenarioData[scenarioIdx]?.attempts || 0) === 0 && scenarioIdx !== 3 && scenarioIdx !== 6) return;
  if (SURVEY_MODE !== 'sheets' || !SHEETS_URL || SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') return;

  try {
    const s = scenarioData[scenarioIdx] || {};
    const participantId = document.querySelector('input[name="participant_id"]')?.value?.trim()
      || (playerName !== 'You' ? playerName : 'anonymous');

    const now = Date.now();
    const lastSaveAt = pcLastIncrementalSaveAt[scenarioIdx] || null;
    const timeSinceLastAttemptSec = (typeof s.timeSincePreviousAttemptSec === 'number') ? s.timeSincePreviousAttemptSec : (lastSaveAt ? Math.round((now - lastSaveAt) / 1000) : 0);
    pcLastIncrementalSaveAt[scenarioIdx] = now;

    const prompts = Array.isArray(s.prompts) ? s.prompts : [];
    const lastPrompt = prompts.length ? prompts[prompts.length - 1] : '';
    const bestScore = Number(s.bestScore || s.revisedScore || s.initialScore || 0);
    const currentScore = (typeof s.currentScore === 'number') ? s.currentScore : bestScore;
    const scoreDelta = (typeof s.scoreDelta === 'number') ? s.scoreDelta : 0;
    const selfReportPrediction = pcFormatPredictionsForSave(s, scenarioIdx);
    const latestPredictionChoice = pcGetLatestPredictionChoice(s);

    const payload = {
      type: 'incremental',
      schema_version: PC_APP_SCHEMA_VERSION,
      app_build: PC_APP_BUILD_LABEL,
      payload_shape: 'named_current_incremental_v121',
      timestamp: new Date().toISOString(),
      participant_id: participantId,
      session_id: pcSessionId,
      scenario_index: scenarioIdx + 1,
      scenario_label: getPromptCraftScenarioLabel(scenarioIdx),
      session_duration_min: parseFloat(((Date.now() - sessionStart) / 60000).toFixed(1)),
      scenarios_completed: scenarioCompleted.filter(Boolean).length,
      total_xp: Math.round(xp),
      total_attempts: scenarioData.reduce((sum, item) => sum + (item.attempts || 0), 0),
      attempts: s.attempts || 0,
      current_score: currentScore,
      best_score: bestScore,
      score_delta: scoreDelta,
      prompt_text: lastPrompt || prompts.join(' | '),
      prompts: prompts.join(' | '),
      claude_response: s.finalResponse || '',
      final_response: s.finalResponse || '',
      quality_indicators_lit: s.oscqrLit || '',
      oscqr_lit: s.oscqrLit || '',
      self_report_prediction: selfReportPrediction,
      self_report: s.selfReport || '',
      prediction: latestPredictionChoice,
      time_since_last_attempt_sec: timeSinceLastAttemptSec,
      screen_width: getPromptCraftViewportWidth(),
      event_type: 'scenario_complete',
      notes_coding_memo: `${location.pathname} :: ${getPromptCraftScenarioLabel(scenarioIdx)} :: session ${pcSessionId} :: ${PC_APP_BUILD_LABEL}`
    };

    pcDebug(`[PromptCraft] Incremental save S${scenarioIdx + 1}:`, payload);
    await postToSheets(payload, `incremental S${scenarioIdx + 1}`);
  } catch(e) {
    console.warn('[PromptCraft] Incremental save failed:', e.message);
  }
}


// ══════════════════════════════════════════════════════
//  AUDIO
//  Runtime voice and music files are organized under assets/audio/
// ══════════════════════════════════════════════════════
const audioReady = typeof Howl !== 'undefined';
const sounds = audioReady ? {
  welcome:           new Howl({ src: [ASSETS.audio.professorPixel.welcome],          volume: 0.9 }),
  vague:             new Howl({ src: [ASSETS.audio.professorPixel.vague],            volume: 0.9 }),
  decent:            new Howl({ src: [ASSETS.audio.professorPixel.decent],           volume: 0.9 }),
  strong:            new Howl({ src: [ASSETS.audio.professorPixel.strong],           volume: 0.9 }),
  scenarioComplete:  new Howl({ src: [ASSETS.audio.professorPixel.scenarioComplete], volume: 0.9 }),
  allComplete:       new Howl({ src: [ASSETS.audio.professorPixel.allComplete],      volume: 0.9 }),
  scenarioIntro0:    new Howl({ src: [ASSETS.audio.professorPixel.scenarioIntro0],   volume: 0.9 }),
  reflectionOpen:    new Howl({ src: [ASSETS.audio.professorPixel.reflectionOpen],   volume: 0.9 })
} : {};

// Narration sounds should not overlap one another.
const NARRATION_KEYS = new Set(['welcome','vague','decent','strong','scenarioComplete','allComplete','scenarioIntro0','reflectionOpen']);
let _currentNarration = null;

function playSound(name) {
  if (!audioPreferences.voicesEnabled || !audioReady || !sounds[name]) return;
  if (NARRATION_KEYS.has(name)) {
    if (_currentNarration && _currentNarration !== sounds[name]) _currentNarration.stop();
    _currentNarration = sounds[name];
  }
  sounds[name].play();
}

// ── BACKGROUND MUSIC SYSTEM ───────────────────────────
const MUSIC_VOL_VN   = 0.35;
const MUSIC_VOL_GAME = 0.08;
const MUSIC_FADE_MS  = 2000;

let bgMusic = null;
let musicPlaybackStarted = false;
let musicReady = false;

function initMusic() {
  if (bgMusic || !audioPreferences.musicEnabled || typeof Howl === 'undefined') return;
  bgMusic = new Howl({
    src: [ASSETS.audio.music.background],
    loop: true,
    volume: 0,
    html5: true,
    onload: () => { musicReady = true; },
    onloaderror: () => { bgMusic = null; }
  });
}

function musicFadeTo(targetVol, durationMs) {
  if (!audioPreferences.musicEnabled || !bgMusic) return;
  bgMusic.fade(bgMusic.volume(), targetVol, durationMs);
}

function musicStartVN() {
  if (!audioPreferences.musicEnabled) return;
  initMusic();
  if (!bgMusic) return;

  if (!musicPlaybackStarted) {
    musicPlaybackStarted = true;
    bgMusic.play();
    bgMusic.volume(0);
  }
  musicFadeTo(MUSIC_VOL_VN, MUSIC_FADE_MS);
}

function musicEndVN() {
  if (!audioPreferences.musicEnabled) return;
  musicFadeTo(MUSIC_VOL_GAME, MUSIC_FADE_MS);
}

function stopAutomaticNarration() {
  if (_currentNarration) {
    try { _currentNarration.stop(); } catch (error) {}
    _currentNarration = null;
  }
  Object.values(sounds).forEach(sound => {
    try { sound.stop(); } catch (error) {}
  });
}

function stopBackgroundMusic() {
  if (!bgMusic) return;
  try {
    bgMusic.fade(bgMusic.volume(), 0, 350);
    setTimeout(() => {
      try { bgMusic.pause(); } catch (error) {}
      musicPlaybackStarted = false;
    }, 380);
  } catch (error) {
    try { bgMusic.pause(); } catch (_) {}
    musicPlaybackStarted = false;
  }
}

function updateAudioSettingsButton() {
  const btn = document.getElementById('musicToggle');
  if (!btn) return;

  const icon = pcAudioMode === 'full' ? '🔊' : pcAudioMode === 'voices' ? '🗣️' : '🔇';
  const label = getAudioModeLabel();
  btn.textContent = icon;
  btn.classList.toggle('muted', pcAudioMode === 'silent');
  btn.classList.toggle('voices-only', pcAudioMode === 'voices');
  btn.classList.toggle('full-audio', pcAudioMode === 'full');
  btn.setAttribute('aria-label', `Open audio settings. Current setting: ${label}`);
  btn.title = `Audio settings: ${label}`;
}

function applyAudioMode(mode) {
  const validMode = ['full', 'voices', 'silent'].includes(mode) ? mode : 'silent';
  pcAudioMode = validMode;
  audioPreferences.voicesEnabled = validMode === 'full' || validMode === 'voices';
  audioPreferences.musicEnabled = validMode === 'full';

  if (!audioPreferences.voicesEnabled) stopAutomaticNarration();

  if (!audioPreferences.musicEnabled) {
    stopBackgroundMusic();
  } else {
    initMusic();

    // Begin the music stream at zero volume during the learner's explicit
    // selection click. This satisfies browser audio-unlock rules without
    // making noise before the scenario opens.
    if (bgMusic && !musicPlaybackStarted) {
      musicPlaybackStarted = true;
      bgMusic.play();
      bgMusic.volume(0);
    }

    if (pcScenarioHasLaunched) {
      const vnIsOpen = document.getElementById('vnOverlay')?.classList.contains('active');
      if (vnIsOpen) musicStartVN();
      else musicFadeTo(MUSIC_VOL_GAME, 600);
    }
  }

  updateAudioSettingsButton();
}


// ══════════════════════════════════════════════════════
