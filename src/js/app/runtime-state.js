/* ======================================================
   PROMPTCRAFT APPLICATION CORE
   V429 application runtime state and shared UI infrastructure.

   Load order:
   Source owners are concatenated in tools/build.py into one classic browser bundle.
   Their order is intentional because they share one global lexical environment.
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
const PC_PROGRESS_STORAGE_KEY = 'promptcraft_teaching_progress_v1';
const PC_MAX_XP = SCENARIO_COUNT * 110;
const PC_SCORE_XP_PER_POINT = 10;
const PC_COMPLETION_XP = 60;
const PC_EDUCATOR_LEVELS = Object.freeze([
  Object.freeze({ threshold: 0, title: 'Teaching Explorer', description: 'Explores how AI can support teaching without replacing professional judgment.' }),
  Object.freeze({ threshold: 100, title: 'Engagement Facilitator', description: 'Designs participation so learners respond to ideas, evidence, and one another.' }),
  Object.freeze({ threshold: 200, title: 'Reflective Practitioner', description: 'Connects learning strategies to evidence, self-evaluation, and purposeful next steps.' }),
  Object.freeze({ threshold: 300, title: 'Assessment Designer', description: 'Builds assessment around authentic evidence of learning rather than convenient proxies.' }),
  Object.freeze({ threshold: 400, title: 'Equitable Learning Designer', description: 'Notices where tools, formats, and assumptions create uneven access or participation.' }),
  Object.freeze({ threshold: 500, title: 'Evidence Evaluator', description: 'Checks AI claims against sources, context, and disciplinary evidence before trusting them.' }),
  Object.freeze({ threshold: 600, title: 'Intentional Prompt Designer', description: 'Anticipates what AI may assume and makes audience, purpose, evidence, and constraints visible.' }),
  Object.freeze({ threshold: 700, title: 'Learning Architect', description: 'Uses AI selectively while protecting learner agency, voice, and instructional purpose.' }),
  Object.freeze({ threshold: 800, title: 'Reflective Leader', description: 'Uses evidence and reflection to revise teaching practice and guide responsible AI use.' })
]);
let pcProgressState = {
  xp: 0,
  bestScores: Array(SCENARIO_COUNT).fill(0),
  completedAwards: Array(SCENARIO_COUNT).fill(false)
};
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

// Shared scenario-run lifecycle. Any delayed work scheduled for an older
// scenario becomes inert as soon as the learner switches scenarios. This keeps
// VN callbacks, delayed focus, audio starts, and result handoffs from leaking
// into the newly selected scenario.
let pcScenarioRunEpoch = 0;
const pcScenarioScheduledTasks = new Set();

function pcCaptureScenarioRun(index = scenarioIndex) {
  return { epoch: pcScenarioRunEpoch, index: Number(index) };
}

function pcIsScenarioRunCurrent(token) {
  return Boolean(
    token &&
    token.epoch === pcScenarioRunEpoch &&
    Number(token.index) === Number(scenarioIndex)
  );
}

function pcCancelScenarioTasks() {
  pcScenarioScheduledTasks.forEach(taskId => clearTimeout(taskId));
  pcScenarioScheduledTasks.clear();
}

function pcBeginScenarioRun() {
  pcCancelScenarioTasks();
  pcScenarioRunEpoch += 1;
  window.pcScenarioRunEpoch = pcScenarioRunEpoch;
  return pcScenarioRunEpoch;
}

function pcScheduleScenarioTask(callback, delay = 0, index = scenarioIndex) {
  if (typeof callback !== 'function') return 0;
  const token = pcCaptureScenarioRun(index);
  const taskId = window.setTimeout(() => {
    pcScenarioScheduledTasks.delete(taskId);
    if (!pcIsScenarioRunCurrent(token)) return;
    callback();
  }, Math.max(0, Number(delay) || 0));
  pcScenarioScheduledTasks.add(taskId);
  return taskId;
}

pcExposeGlobals?.({
  pcCaptureScenarioRun,
  pcIsScenarioRunCurrent,
  pcScheduleScenarioTask
});

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

function pcScenarioInputMayReceiveFocus() {
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
      `Welcome to the Prompt Lab, ${playerName}! I'm Professor Pixel. I'll guide you through each teaching challenge.`;
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
