/* ======================================================
   PROMPTCRAFT APP.JS
   Clean pass: labeled sections, no duplicate top-level functions.
   Each function defined exactly once — the final winning version.

   Sections (Ctrl+F to jump):
     STATE
     SCREEN READER UTILITY
     NAME MODAL
     SURVEY CONFIGURATION
     MOCK CLAUDE
     BEHAVIORAL DATA TRACKING
     GROWTH SCORING
     SESSION PAYLOAD
     AUDIO
     SCENARIOS
     PIXEL HUD
     PIXEL INLINE CHAT         ← flagged for dialogue.js next pass
     SCENARIO NAVIGATION
     SCENARIO UNLOCK
     S2 OPENING + S3–S8 CLEAN DEVELOPMENT SHELLS
     AUTOSAVE
     VN ENGINE                 ← flagged for dialogue.js next pass
     SCENE IMAGE LOADER
     INIT
     SCENARIO SWITCH + LOAD
     S1 WORKBENCH              ← final owner (from legacy patch block 1)
     OSCQR
     CHAT MESSAGES
     SCAFFOLDED INPUT
     SEND + PREDICTION GATE    ← final owner (from legacy patch block 3/4)
     SCORING + FEEDBACK
     HELPERS
     COMPLETION
     REFLECTION ROOM
     DEV FUNCTIONS
     CLEAN SCENARIO SHELLS    ← S3–S8 placeholders

   NOTE: Functions marked [→ dialogue.js] should move there
   once dialogue.js is reviewed. Kept here so game stays functional.
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
const PC_MENU_PREVIEW_ALL_SCENARIOS = true;

// ── SCREEN READER UTILITY ─────────────────────────────
(function() {
  const s = document.createElement('style');
  s.textContent = '.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}';
  document.head.appendChild(s);
})();

// ── NAME MODAL ────────────────────────────────────────
function showNameModal() {
  const overlay = document.getElementById('nameModalOverlay');

  if (!overlay) {
    console.warn('[PromptCraft] Name modal missing; continuing with the default player name.');
    pcNameConfirmed = true;
    showAudioSetup({ onboarding: true });
    return;
  }

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
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden', 'true');
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

  overlay.classList.remove('visible');
  overlay.setAttribute('aria-hidden', 'true');
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
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbylnSseQkSsPNKSjqoU2ui6yFa62YslQEq-nRyeC8MZFVnlmv-XYoi2EUJPZGvnKU1z/exec';
const QUALTRICS_URL = 'YOUR_QUALTRICS_SURVEY_URL_HERE';
const PC_APP_SCHEMA_VERSION = 'V121';
const PC_APP_BUILD_LABEL = 'IMAGE_PATH_FIX_V140';
console.log('[PromptCraft] Loaded app.js build:', PC_APP_BUILD_LABEL, 'schema:', PC_APP_SCHEMA_VERSION);

// ══════════════════════════════════════════════════════
//  ASSET PATHS
//  Resolve every runtime asset from the project root, not from whichever URL
//  the browser happens to treat as the current document. This keeps images
//  working in nested hosting folders, Live Server, and copied project builds.
// ══════════════════════════════════════════════════════
const PC_APP_SCRIPT_URL = (() => {
  const script = [...document.scripts].find(item => /(?:^|\/)functions\/app\.js(?:[?#]|$)/.test(item.src));
  return script?.src || new URL('functions/app.js', document.baseURI).href;
})();

const PC_PROJECT_ROOT_URL = new URL('../', PC_APP_SCRIPT_URL);

function pcProjectUrl(path = '') {
  const cleanPath = String(path).replace(/^\.\//, '').replace(/^\//, '');
  return new URL(cleanPath, PC_PROJECT_ROOT_URL).href;
}

function pcUseImageFallback(img, fallback = '') {
  if (!img || img.dataset.pcFallbackApplied === 'true') return;
  const fallbackPath = fallback || img.dataset.pcFallback || '';
  if (!fallbackPath) return;
  img.dataset.pcFallbackApplied = 'true';
  img.src = /^([a-z]+:|data:|blob:)/i.test(fallbackPath)
    ? fallbackPath
    : pcProjectUrl(fallbackPath);
}

function pcSetImageSource(img, primary, fallback = '') {
  if (!img || !primary) return;
  img.dataset.pcFallback = fallback || '';
  img.dataset.pcFallbackApplied = 'false';
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

window.pcProjectUrl = pcProjectUrl;
window.pcUseImageFallback = pcUseImageFallback;
window.pcSetImageSource = pcSetImageSource;

const ASSETS = Object.freeze({
  images: Object.freeze({
    backgrounds: Object.freeze({
      app: pcProjectUrl('assets/images/backgrounds/app-background.png'),
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
document.documentElement.style.setProperty('--pc-app-background-legacy', `url("${pcProjectUrl(LEGACY_ASSETS.images.backgrounds.app)}")`);


// Robust Google Sheets poster.
// Uses text/plain so browser no-cors requests are not silently mangled by preflight/CORS rules.
// Apps Script still receives the JSON string in e.postData.contents.
const PC_SHEETS_DEBUG = true;

async function postToSheets(payload, label = 'PromptCraft data') {
  if (SURVEY_MODE !== 'sheets' || !SHEETS_URL || SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    console.warn('[PromptCraft] Sheets URL is not configured. Skipping:', label);
    return false;
  }

  const body = JSON.stringify(payload || {});

  try {
    if (PC_SHEETS_DEBUG) console.log(`[PromptCraft] Sending ${label} to Sheets:`, payload);

    await fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body
    });

    if (PC_SHEETS_DEBUG) console.log(`[PromptCraft] Sheets request dispatched: ${label}`);
    return true;
  } catch (err) {
    console.warn(`[PromptCraft] fetch failed for ${label}:`, err);
  }

  // Fallback for some browser/security contexts.
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
      const ok = navigator.sendBeacon(SHEETS_URL, blob);
      console.log(`[PromptCraft] sendBeacon fallback ${ok ? 'queued' : 'failed'}: ${label}`);
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
const MOCK_CLAUDE_FOR_LOCAL = true;
const FORCE_MOCK_CLAUDE = new URLSearchParams(window.location.search).get('mockClaude') === '1';
const IS_LOCAL_TEST = ['localhost', '127.0.0.1', ''].includes(window.location.hostname) || window.location.protocol === 'file:';
const USE_MOCK_CLAUDE = FORCE_MOCK_CLAUDE || (MOCK_CLAUDE_FOR_LOCAL && IS_LOCAL_TEST);

// NOTE: Mock Claude text is dialogue/content-heavy. Move to dialogue.js in a later pass if desired.
function mockClaudeText(payload, context = 'main') {
  const system = payload.system || '';
  const lastUser = payload.messages?.slice().reverse().find(message => message.role === 'user')?.content || '';

  if (context === 'pixel' || system.includes('You are Professor Pixel')) {
    return `You gave Claude enough direction to produce a usable response, especially where your prompt named the actual teaching problem. The next improvement is to make the success criteria more visible so Claude knows what a strong student outcome should look like.\n\n*What would you want students to do, say, or produce that would prove the activity worked?*`;
  }

  if (context === 'growth' || system.includes('personalized growth summary')) {
    return `Scenario 1 shows how learner context, constraints, and explicit interaction moves can turn a vague AI request into a more useful instructional design draft. Additional growth reporting will be added as the remaining scenarios are rebuilt.`;
  }

  if (scenarioIndex !== SCENARIO_INDEX.ENGAGEMENT) {
    return `This scenario is currently a clean development shell and does not send prompts to Claude.`;
  }

  return `**Revised Discussion Prompt: From Reaction to Conversation**\n\nChoose one idea from this week's reading that you think is useful, questionable, or difficult to apply. In your initial post, explain your choice, connect it to a specific detail from the reading, and describe how it might show up in a real classroom, workplace, or community situation.\n\nThen reply to two classmates using a different move for each reply:\n1. **Build:** Add an example, resource, or connection that extends their point.\n2. **Probe:** Ask a genuine follow-up question that would help the conversation go deeper.\n\nA strong reply should do more than agree. It should explain reasoning, refer to a specific idea, and help the other person continue thinking.\n\n**Why this addresses the original issue**\nThe original prompt asked students what they thought, but it did not give them a reason to return to the conversation. This version gives students clear interaction moves, defines what quality looks like, and turns peer replies into part of the learning task instead of a checkbox.\n\n**Course Quality Check**\nClear Objectives: addressed\nStudent Interaction: addressed\nReal-World Context: addressed\nInclusive Design: addressed\nMeasurable Outcomes: addressed`;
}


function mockClaudeResponse(payload, context = 'main') {
  console.info(`[PromptCraft] Using mock Claude response for ${context}.`);
  return Promise.resolve({
    content: [{ text: mockClaudeText(payload, context) }],
    mock: true
  });
}

const CLAUDE_REQUEST_TIMEOUT_MS = 15000;

async function callClaude(payload, context = 'main') {
  if (USE_MOCK_CLAUDE) return mockClaudeResponse(payload, context);

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
    return mockClaudeResponse(payload, context);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function showMockClaudeNotice() {
  if (!USE_MOCK_CLAUDE) return;
  const bar = document.getElementById('devBar');
  if (!bar || document.getElementById('mockClaudeNotice')) return;
  const tag = document.createElement('span');
  tag.id = 'mockClaudeNotice';
  tag.textContent = 'MOCK CLAUDE';
  tag.style.color = '#f6c177';
  tag.style.border = '1px solid #f6c177';
  tag.style.borderRadius = '4px';
  tag.style.padding = '1px 6px';
  tag.style.marginLeft = '4px';
  bar.insertBefore(tag, bar.children[1] || null);
}

document.addEventListener('DOMContentLoaded', showMockClaudeNotice);

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

    console.log(`[PromptCraft] Incremental save S${scenarioIdx + 1}:`, payload);
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

// Backward-compatible name retained for any old inline references.
function toggleMusic() {
  return showAudioSetup({ onboarding: false });
}


// ══════════════════════════════════════════════════════
//  SCENARIOS
// ══════════════════════════════════════════════════════
const scenarios = [
  {
    desc: "Mission: Fix a dead discussion board by helping Claude understand what is failing and what meaningful peer interaction should look like.",
    testPrompt: "My online learners in a first-year general education course are submitting one-line discussion posts that don't build on each other. I need a weekly discussion prompt that encourages deeper thinking and at least two substantive peer replies. The course is fully asynchronous, 8 weeks long.",
    oscqr: [
      { id:"obj", label:"Clear Objectives" },
      { id:"int", label:"Student Interaction" },
      { id:"rwc", label:"Real-World Context" },
      { id:"inc", label:"Inclusive Design" },
      { id:"out", label:"Measurable Outcomes" },
    ],
    system: `You are a supportive instructional design coach helping an online higher education faculty member improve student engagement in asynchronous discussions.
When the instructor writes a prompt, respond with a practical, course-ready discussion activity. Be warm and specific.
After your main response, add a short section called "Course Quality Check" noting which are addressed: Clear Objectives, Student Interaction, Real-World Context, Inclusive Design, Measurable Outcomes.
Coaching: vague prompts get generic outputs with gentle guidance. Specific prompts with learner context, course level, and format constraints get excellent, usable outputs with explicit praise.`
  },
  { desc: "Mission: Listen to Jordan, diagnose the missing learning process, and distinguish metacognitive evidence from generic reflection.", oscqr: [], system: "" },
  { desc: "Scenario 3 is being rebuilt from a clean development shell.", oscqr: [], system: "" },
  { desc: "Scenario 4 is being rebuilt from a clean development shell.", oscqr: [], system: "" },
  { desc: "Scenario 5 is being rebuilt from a clean development shell.", oscqr: [], system: "" },
  { desc: "Scenario 6 is being rebuilt from a clean development shell.", oscqr: [], system: "" },
  { desc: "Scenario 7 is being rebuilt from a clean development shell.", oscqr: [], system: "" },
  { desc: "Scenario 8 is being rebuilt from a clean development shell.", oscqr: [], system: "" }
];

// ══════════════════════════════════════════════════════
//  SCENARIO UI CONFIGURATION
//  Scenario 1 is the shared structural template: every scenario gets the
//  same mission briefing anatomy, VN introduction orchestration, reset path,
//  and explicit input ownership. Scenario-specific activities stay separate.
// ══════════════════════════════════════════════════════
const SCENARIO_UI = [
  {
    key: 'engagement',
    dataLabel: 'S1: Engagement',
    tabLabel: 'S1: Engagement',
    missionTitle: 'Fix the dead discussion board.',
    missionCopy: 'Students are participating, but the conversation dies after one exchange. Diagnose the problem and use Claude to redesign the discussion so students extend, challenge, and build on ideas.',
    boardText: null,
    inputMode: 'scenario-1',
    inputVisible: true,
    supportsPrompt: true,
    implemented: true,
    developmentStatus: 'Playable'
  },
  {
    key: 'metacognition',
    dataLabel: 'S2: Metacognition',
    tabLabel: 'S2: Metacognition',
    missionTitle: 'Find the metacognitive thinker.',
    missionCopy: 'Listen to a student, identify the missing thinking move, audit Claude\'s reflection activity, repair it, and hear how the student\'s thinking changes.',
    boardText: 'Jordan is completing the work, but he cannot explain what helped, what failed, or what he should try next.',
    inputMode: 'scenario-2', inputVisible: true, supportsPrompt: false,
    implemented: true, developmentStatus: 'Opening playable',
    plannedLoop: ['Listen to the student', 'Identify the missing thinking move', 'Audit Claude\'s activity', 'Repair one weak element', 'Hear the changed student response']
  },
  {
    key: 'assessment', dataLabel: 'S3: Authentic Assessment', tabLabel: 'S3: Assessment',
    missionTitle: 'Replace recall with authentic practice.',
    missionCopy: 'This scenario will be redesigned around comparing weak and authentic assessment choices, then transforming one into applied professional practice.',
    boardText: 'Scenario 3 is in redesign.', inputMode: 'placeholder', inputVisible: false, supportsPrompt: false,
    implemented: false, developmentStatus: 'Planned', plannedLoop: ['Compare', 'Choose', 'Transform', 'Evaluate the consequence']
  },
  {
    key: 'sync-bias', dataLabel: 'S4: Sync Bias', tabLabel: 'S4: Sync Bias',
    missionTitle: 'Who is this actually for?',
    missionCopy: 'This scenario will be rebuilt around auditing access assumptions and adapting an AI plan for fully asynchronous learners.',
    boardText: 'Scenario 4 is in redesign.', inputMode: 'placeholder', inputVisible: false, supportsPrompt: false,
    implemented: false, developmentStatus: 'Planned', plannedLoop: ['Audit assumptions', 'Hear learner impact', 'Adapt the plan']
  },
  {
    key: 'hallucination', dataLabel: 'S5: Hallucination Hunt', tabLabel: 'S5: Hallucination Hunt',
    missionTitle: 'Verify before you trust.',
    missionCopy: 'This scenario will be rebuilt as an evidence investigation in which polished claims must be checked before use.',
    boardText: 'Scenario 5 is in redesign.', inputMode: 'placeholder', inputVisible: false, supportsPrompt: false,
    implemented: false, developmentStatus: 'Planned', plannedLoop: ['Investigate', 'Verify', 'Decide what is safe']
  },
  {
    key: 'prediction', dataLabel: 'S6: Predict the Output', tabLabel: 'S6: Predict the Output',
    missionTitle: 'Predict what a vague prompt produces.',
    missionCopy: 'This scenario will be rebuilt around forecasting AI behavior, testing the prediction, and revising the request.',
    boardText: 'Scenario 6 is in redesign.', inputMode: 'placeholder', inputVisible: false, supportsPrompt: false,
    implemented: false, developmentStatus: 'Planned', plannedLoop: ['Forecast', 'Test', 'Compare', 'Revise']
  },
  {
    key: 'overreliance', dataLabel: 'S7: Overreliance', tabLabel: 'S7: Overreliance',
    missionTitle: 'Decide where human judgment belongs.',
    missionCopy: 'This scenario will be rebuilt around classifying AI output and defending where instructor judgment is irreplaceable.',
    boardText: 'Scenario 7 is in redesign.', inputMode: 'placeholder', inputVisible: false, supportsPrompt: false,
    implemented: false, developmentStatus: 'Planned', plannedLoop: ['Classify', 'Justify', 'Revise the boundary']
  },
  {
    key: 'reflect-revise', dataLabel: 'S8: Reflect & Revise', tabLabel: 'S8: Reflect and Revise',
    missionTitle: 'Build, reflect, and revise.',
    missionCopy: 'The final scenario will synthesize the game by asking learners to examine their own choices and improve a prompt deliberately.',
    boardText: 'Scenario 8 is in redesign.', inputMode: 'placeholder', inputVisible: false, supportsPrompt: false,
    implemented: false, developmentStatus: 'Planned', plannedLoop: ['Build', 'Explain your choice', 'Evaluate the output', 'Revise']
  }
];

const SCENARIO_SETUP_HANDLERS = Object.freeze({});

if (scenarios.length !== SCENARIO_COUNT || SCENARIO_UI.length !== SCENARIO_COUNT || scenarioData.length !== SCENARIO_COUNT) {
  throw new Error('[PromptCraft] Scenario configuration, content, and tracking data are out of sync.');
}

const PC_SCENARIO_LABELS = SCENARIO_UI.map(ui => ui.dataLabel || ui.tabLabel);

window.SCENARIO_INDEX = SCENARIO_INDEX;
window.scenarios = scenarios;
window.SCENARIO_UI = SCENARIO_UI;

// ══════════════════════════════════════════════════════
//  MAIN MENU
//  The scenario cards are generated from SCENARIO_UI, so titles, descriptions,
//  and navigation remain aligned with the same registry that owns the game.
// ══════════════════════════════════════════════════════
function getMainMenuOverlay() {
  return document.getElementById('mainMenuOverlay');
}

function getMainMenuPanel(panelName) {
  return document.querySelector(`[data-menu-panel="${panelName}"]`);
}

function getScenarioMenuStatus(index) {
  const ui = getScenarioUI(index);
  if (!ui.implemented) return ui.developmentStatus || 'In redesign';
  if (scenarioCompleted[index]) return 'Completed';
  if (pcScenarioHasLaunched && scenarioIndex === index) return 'Current scenario';
  return 'Available';
}


function isScenarioAvailableFromMenu(index) {
  return Number.isInteger(Number(index)) && !!SCENARIO_UI[Number(index)];
}


function renderScenarioMenu() {
  const grid = document.getElementById('mainMenuScenarioGrid');
  if (!grid) return;

  grid.innerHTML = SCENARIO_UI.map((ui, index) => {
    const status = getScenarioMenuStatus(index);
    const stateClass = scenarioCompleted[index]
      ? ' is-complete'
      : (pcScenarioHasLaunched && scenarioIndex === index ? ' is-current' : '');
    const shellClass = ui.implemented ? '' : ' is-development-shell';

    return `
      <button class="pc-menu-scenario-card${stateClass}${shellClass}"
              type="button"
              onclick="launchScenarioFromMenu(${index})"
              aria-label="Open ${esc(ui.tabLabel)}. ${esc(status)}">
        <span class="pc-menu-scenario-number">${String(index + 1).padStart(2, '0')}</span>
        <span class="pc-menu-scenario-content">
          <span class="pc-menu-scenario-title">${esc(ui.tabLabel.replace(/^S\d+:\s*/, ''))}</span>
          <span class="pc-menu-scenario-mission">${esc(ui.missionTitle)}</span>
          <span class="pc-menu-scenario-copy">${esc(ui.missionCopy)}</span>
        </span>
        <span class="pc-menu-scenario-status">${esc(status)}</span>
      </button>`;
  }).join('');
}


function updateMainMenuHome() {
  const continueButton = document.getElementById('menuContinueBtn');
  const status = document.getElementById('mainMenuStatus');
  const closeButton = document.getElementById('mainMenuCloseBtn');

  if (continueButton) {
    continueButton.textContent = pcScenarioHasLaunched
      ? `Continue ${getScenarioUI(scenarioIndex).tabLabel}`
      : 'Start Scenario 1';
  }

  if (status) {
    status.textContent = pcScenarioHasLaunched
      ? `${getScenarioUI(scenarioIndex).tabLabel} is currently open.`
      : 'Choose Start or open Scenario Select.';
  }

  if (closeButton) {
    closeButton.hidden = !pcScenarioHasLaunched;
  }
}

function renderMainMenu() {
  updateMainMenuHome();
  renderScenarioMenu();
}

function showMainMenuPanel(panelName = 'home') {
  const requested = getMainMenuPanel(panelName) || getMainMenuPanel('home');
  document.querySelectorAll('[data-menu-panel]').forEach(panel => {
    panel.hidden = panel !== requested;
  });

  if (panelName === 'scenarios') renderScenarioMenu();
  if (panelName === 'home') updateMainMenuHome();

  const focusTarget = requested.querySelector('button:not([disabled]), a[href], input, textarea, [tabindex]:not([tabindex="-1"])');
  setTimeout(() => focusTarget?.focus(), 20);
}

function openMainMenu(panelName = 'home', options = {}) {
  const overlay = getMainMenuOverlay();
  if (!overlay) return false;

  pcMainMenuLastFocused = document.activeElement;
  pcMainMenuInitialOpen = options.initial === true || !pcScenarioHasLaunched;

  renderMainMenu();
  overlay.hidden = false;
  overlay.setAttribute('aria-hidden', 'false');
  const vnOverlay = document.getElementById('vnOverlay');
  if (vnOverlay?.classList.contains('active')) vnOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.add('pc-main-menu-open');
  overlay.classList.add('visible');
  showMainMenuPanel(panelName);
  return false;
}

function closeMainMenu(options = {}) {
  const overlay = getMainMenuOverlay();
  if (!overlay) return false;

  // The first menu is the game entry point. It cannot be dismissed into an
  // unstarted S1 shell, but every later menu can close normally.
  if (!pcScenarioHasLaunched && options.force !== true) {
    showMainMenuPanel('home');
    return false;
  }

  overlay.classList.remove('visible');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('pc-main-menu-open');
  pcMainMenuInitialOpen = false;

  const vnOverlay = document.getElementById('vnOverlay');
  if (vnOverlay?.classList.contains('active')) vnOverlay.setAttribute('aria-hidden', 'false');

  setTimeout(() => {
    overlay.hidden = true;
    const canRestoreFocus = pcMainMenuLastFocused
      && typeof pcMainMenuLastFocused.focus === 'function'
      && !pcMainMenuLastFocused.closest?.('[hidden]')
      && pcMainMenuLastFocused.getClientRects?.().length;

    if (canRestoreFocus) pcMainMenuLastFocused.focus();
    else document.getElementById('mainMenuToggle')?.focus();
  }, 180);
  return false;
}

function pcUnlockScenarioForMenuPreview(index) {
  const tab = document.querySelectorAll('.tab-btn')[index] || null;
  if (tab) {
    tab.disabled = false;
    tab.classList.remove('locked');
    tab.removeAttribute('aria-disabled');
  }
  return tab;
}


function launchScenarioFromMenu(index, options = {}) {
  index = Number(index);
  if (!Number.isInteger(index) || !scenarios[index] || !isScenarioAvailableFromMenu(index)) return false;

  // The main menu is the first screen. Ask for the learner's name only after
  // they choose Start or select a scenario.
  if (!pcNameConfirmed && options.skipNameGate !== true) {
    pcPendingScenarioIndex = index;
    closeMainMenu({ force: true });
    showNameModal();
    return false;
  }

  if (!pcAudioPreferenceConfirmed && options.skipAudioGate !== true) {
    pcPendingScenarioIndex = index;
    closeMainMenu({ force: true });
    showAudioSetup({ onboarding: true });
    return false;
  }

  const firstLaunch = !pcScenarioHasLaunched;
  pcScenarioHasLaunched = true;
  pcMainMenuInitialOpen = false;

  const tab = pcUnlockScenarioForMenuPreview(index) || document.querySelectorAll('.tab-btn')[index] || null;
  closeMainMenu({ force: true });

  // switchScenario owns all scene cleanup, input rendering, and introduction
  // behavior. The menu merely routes into that established path.
  switchScenario(index, tab);

  // Preserve S1's existing opening sequence: its scenario introduction is
  // followed by Professor Pixel's welcome the first time the game begins.
  if (firstLaunch && index === SCENARIO_INDEX.ENGAGEMENT) {
    setTimeout(() => playPixelSequence('welcome', null), 500);
  }

  window.scenarioIntroEnabled = true;
  return false;
}

function continueFromMainMenu() {
  if (!pcScenarioHasLaunched) return launchScenarioFromMenu(SCENARIO_INDEX.ENGAGEMENT);
  return closeMainMenu({ force: true });
}

window.addEventListener('keydown', event => {
  const overlay = getMainMenuOverlay();
  if (!overlay || overlay.hidden || !overlay.classList.contains('visible')) return;

  if (event.key === 'Escape' && pcScenarioHasLaunched) {
    event.preventDefault();
    closeMainMenu({ force: true });
    return;
  }

  if (event.key !== 'Tab') return;
  const focusable = [...overlay.querySelectorAll('button:not([disabled]):not([hidden]), a[href], input, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => !el.closest('[hidden]'));
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

window.openMainMenu = openMainMenu;
window.closeMainMenu = closeMainMenu;
window.showMainMenuPanel = showMainMenuPanel;
window.continueFromMainMenu = continueFromMainMenu;
window.launchScenarioFromMenu = launchScenarioFromMenu;

// ══════════════════════════════════════════════════════
//  PROFESSOR PIXEL — INLINE CHAT DIALOGUE SYSTEM
// ══════════════════════════════════════════════════════

const PIXEL_EXPR = ASSETS.images.professorPixel;

let lastScore = -1;
let coachDismissTimer = null;

// ── BADGE (keeps the persistent corner presence) ──────
function pixelBadgeSetExpr(expr) {
  const src = PIXEL_EXPR[expr] || PIXEL_EXPR.neutral;
  const img = document.getElementById('pixelBadgeImg');
  const coachImg = document.getElementById('pixelCoachImg');
  const fallback = LEGACY_ASSETS.images.professorPixel[expr] || LEGACY_ASSETS.images.professorPixel.neutral;
  pcSetImageSource(img, src, fallback);
  if (coachImg) pcSetImageSource(coachImg, src, fallback);
  img.classList.remove('reacting');
  void img.offsetWidth;
  img.classList.add('reacting');
  setTimeout(() => img.classList.remove('reacting'), 600);
}

function pixelBadgeClick() {
  const card = document.getElementById('pixelCoachCard');
  if (card.classList.contains('visible')) {
    pixelCoachDismiss();
  } else if (document.getElementById('pixelCoachMsg').textContent) {
    card.classList.add('visible');
    clearTimeout(coachDismissTimer);
    coachDismissTimer = setTimeout(pixelCoachDismiss, 6000);
  }
}

function pixelCoachDismiss() {
  document.getElementById('pixelCoachCard').classList.remove('visible');
}

// ── AI BUBBLE AVATAR ──────────────────────────────────
function pixelAvatarHTML(expr) {
  const src = PIXEL_EXPR[expr] || PIXEL_EXPR.neutral;
  return `
    <img class="pixel-chat-avatar"
         src="${src}"
         alt="Professor Pixel"
         onerror="this.outerHTML='<div class=\\'pixel-chat-avatar-fallback\\'>🧑‍🏫</div>'" />`;
}

// ── SHARED SCENARIO STRUCTURE ─────────────────────────
// Scenario 1 established the clean mission-briefing pattern. The remaining
// scenarios now use the same anatomy rather than each inventing another card.
function getScenarioUI(index = scenarioIndex) {
  return SCENARIO_UI[index] || SCENARIO_UI[SCENARIO_INDEX.ENGAGEMENT];
}

function scenarioSupportsPrompt(index = scenarioIndex) {
  return getScenarioUI(index).supportsPrompt === true;
}

function buildScenarioMissionHTML(index, options = {}) {
  const ui = getScenarioUI(index);
  const eyebrow = options.eyebrow || 'Mission Briefing';
  const title = options.title || ui.missionTitle;
  const copy = options.copy || ui.missionCopy;
  const extraClass = options.className ? ` ${options.className}` : '';
  const extraHTML = options.extraHTML || '';

  return `
    <section class="scenario-mission${extraClass}" role="region" aria-label="${esc(eyebrow)}">
      <div class="mission-eyebrow">${esc(eyebrow)}</div>
      <div class="mission-title">${esc(title)}</div>
      <div class="mission-copy">${esc(copy)}</div>
      ${extraHTML}
    </section>`;
}

function appendScenarioMission(index, options = {}) {
  const area = options.container || document.getElementById('chat');
  if (!area) return null;

  const wrapper = document.createElement('div');
  wrapper.className = 'scenario-entry';
  wrapper.innerHTML = buildScenarioMissionHTML(index, options);
  area.appendChild(wrapper);
  return wrapper;
}

function appendScenarioArtifact({ sender, html, expression = 'neutral', className = 'ai' }) {
  const area = document.getElementById('chat');
  if (!area) return null;

  const message = document.createElement('div');
  message.className = `message ${className}`;
  message.innerHTML = `
    ${pixelAvatarHTML(expression)}
    <div class="bubble-wrap">
      <div class="bubble-sender">${esc(sender)}</div>
      <div class="bubble">${html}</div>
    </div>`;
  area.appendChild(message);
  area.scrollTop = area.scrollHeight;
  return message;
}

function setScenarioInputVisible(visible, { focus = false } = {}) {
  const container = document.getElementById('inputContainer');
  if (!container) return;
  container.style.display = visible ? '' : 'none';
  if (visible && focus) {
    setTimeout(() => document.getElementById('promptInput')?.focus(), 100);
  }
}

function renderScenarioPlaceholder(index) {
  const ui = getScenarioUI(index);
  const area = document.getElementById('chat');
  const container = document.getElementById('inputContainer');
  if (!area) return;

  if (container) {
    container.innerHTML = '';
    container.style.display = 'none';
  }

  const plannedSteps = Array.isArray(ui.plannedLoop) && ui.plannedLoop.length
    ? `<ol class="pc-shell-loop">${ui.plannedLoop.map(step => `<li>${esc(step)}</li>`).join('')}</ol>`
    : '';

  area.innerHTML = `
    <section class="pc-scenario-shell" role="region" aria-labelledby="pcShellTitle">
      <div class="pc-shell-status">Clean development shell</div>
      <h2 id="pcShellTitle">${esc(ui.tabLabel)} is being rebuilt</h2>
      <p class="pc-shell-copy">${esc(ui.missionCopy)}</p>
      ${plannedSteps ? `<div class="pc-shell-plan"><h3>Planned game loop</h3>${plannedSteps}</div>` : ''}
      <p class="pc-shell-note">The previous implementation is preserved in <code>archive/legacy-scenarios-v133/</code>, but it is no longer loaded by the game.</p>
      <div class="pc-shell-actions">
        <button type="button" class="pc-shell-primary" onclick="openMainMenu('scenarios')">Return to Scenario Select</button>
        <button type="button" class="pc-shell-secondary" onclick="launchScenarioFromMenu(0,{skipNameGate:true})">Play Scenario 1</button>
      </div>
    </section>`;
  area.scrollTop = 0;
}


// ══════════════════════════════════════════════════════
//  SCENARIO 2 — METACOGNITION DETECTIVE OPENING
//  Vertical slice: Jordan VN introduction, diagnosis, and evidence sorting.
// ══════════════════════════════════════════════════════
const S2_DIAGNOSIS_OPTIONS = [
  { id: 'motivation', label: 'Jordan needs stronger motivation to complete assignments.' },
  { id: 'content', label: 'Jordan needs a clearer explanation of the course content.' },
  { id: 'identify_strategy', label: 'Jordan needs to identify which learning strategy he used.' },
  { id: 'evaluate_strategy', label: 'Jordan needs to evaluate whether that strategy actually helped.' },
  { id: 'grading', label: 'Jordan needs more detailed information about the grading criteria.' },
  { id: 'comparison', label: 'Jordan needs to compare his performance with classmates.' },
  { id: 'transfer', label: 'Jordan needs to decide when an effective strategy should be used again.' },
  { id: 'encouragement', label: 'Jordan needs more encouragement from the instructor.' },
  { id: 'time', label: 'Jordan needs additional time to complete the assignment.' },
  { id: 'difficulty', label: 'Jordan needs a more difficult assignment.' },
];

const S2_EVIDENCE_RESPONSES = [
  { id: 'a', tag: 'A', title: 'Emotional reaction', text: 'The assignment was frustrating, but I was relieved when I finished.' },
  { id: 'b', tag: 'B', title: 'Performance awareness', text: 'I earned a higher score than I did on the previous assignment.' },
  { id: 'c', tag: 'C', title: 'Strategy identification', text: 'I made a comparison chart before answering the questions.' },
  { id: 'd', tag: 'D', title: 'Monitoring', text: 'Halfway through, I noticed I could define each concept but still could not explain the difference between them.' },
  { id: 'e', tag: 'E', title: 'Evaluation and adjustment', text: 'Rereading was not helping me compare the concepts, so I switched to creating examples and checking whether each example fit.' },
  { id: 'f', tag: 'F', title: 'Transfer', text: 'The examples helped me notice the differences, so I will use that strategy before the next quiz.' },
];

function getS2Data() {
  const data = scenarioData[SCENARIO_INDEX.METACOGNITION];
  if (!Array.isArray(data.diagnosisAttempts)) data.diagnosisAttempts = [];
  if (!Array.isArray(data.evidenceAttempts)) data.evidenceAttempts = [];
  if (!Array.isArray(data.diagnosisFinal)) data.diagnosisFinal = [];
  if (!Array.isArray(data.evidenceFinal)) data.evidenceFinal = [];
  return data;
}

function buildS2JordanEvidenceHTML() {
  return `
    <aside class="s2-jordan-card" aria-label="Evidence from Jordan">
      <img src="${ASSETS.images.students.jordan.uncertain}" alt="Jordan, an adult online learner, looking uncertain" />
      <div class="s2-jordan-card-copy">
        <div class="s2-kicker">Student evidence</div>
        <h3>What Jordan told us</h3>
        <blockquote>“I reread the chapter a few times. Some parts finally made more sense, but I couldn’t tell you what actually helped.”</blockquote>
        <p>He completed the assignment and earned a better grade, but he cannot explain the learning process that produced it.</p>
      </div>
    </aside>`;
}

function renderS2Standby(container) {
  if (!container) container = document.getElementById('inputContainer');
  if (!container) return;
  container.className = 's2-workbench';
  container.style.display = 'flex';
  container.innerHTML = `
    <div class="s2-stage">
      ${buildScenarioMissionHTML(SCENARIO_INDEX.METACOGNITION)}
      <section class="s2-standby-card" aria-live="polite">
        <div class="s2-kicker">Case file loading</div>
        <h2>Listen before you diagnose.</h2>
        <p>Pixel and Jordan will introduce the case. The first decision appears when their conversation ends.</p>
      </section>
    </div>`;
}

function renderS2DiagnosisActivity() {
  const container = document.getElementById('inputContainer');
  if (!container || scenarioIndex !== SCENARIO_INDEX.METACOGNITION) return;
  container.className = 's2-workbench';
  container.style.display = 'flex';
  const options = S2_DIAGNOSIS_OPTIONS.map((option, index) => `
    <label class="s2-choice-card" for="s2-diagnosis-${option.id}">
      <input type="checkbox" id="s2-diagnosis-${option.id}" name="s2-diagnosis" value="${option.id}" />
      <span class="s2-choice-number">${String(index + 1).padStart(2, '0')}</span>
      <span class="s2-choice-copy">${esc(option.label)}</span>
    </label>`).join('');

  container.innerHTML = `
    <div class="s2-stage">
      ${buildScenarioMissionHTML(SCENARIO_INDEX.METACOGNITION, {
        extraHTML: '<div class="s2-progress" aria-label="Scenario 2 progress"><span class="active">1 Diagnose</span><span>2 Examine evidence</span><span>3 Choose a thinking move</span></div>'
      })}
      <div class="s2-case-grid">
        ${buildS2JordanEvidenceHTML()}
        <section class="s2-task-card" aria-labelledby="s2DiagnosisTitle">
          <div class="s2-kicker">Decision 1 · Diagnose the learning problem</div>
          <h2 id="s2DiagnosisTitle">Which two instructional needs are most clearly supported by Jordan’s comments?</h2>
          <p class="s2-task-instruction">Select exactly two. Several options sound educationally useful, but only two are the strongest diagnosis of this evidence.</p>
          <div class="s2-choice-grid" id="s2DiagnosisChoices">${options}</div>
          <div class="s2-selection-bar">
            <span id="s2DiagnosisStatus" role="status" aria-live="polite">0 of 2 selected</span>
            <button class="s2-primary-btn" id="s2DiagnosisSubmit" type="button" disabled>Submit diagnosis</button>
          </div>
          <div id="s2DiagnosisFeedback" aria-live="polite"></div>
        </section>
      </div>
    </div>`;

  wireS2ExactSelection({
    rootId: 's2DiagnosisChoices',
    inputName: 's2-diagnosis',
    limit: 2,
    statusId: 's2DiagnosisStatus',
    submitId: 's2DiagnosisSubmit',
    onSubmit: submitS2Diagnosis,
  });
  container.scrollTop = 0;
  setTimeout(() => container.querySelector('input[name="s2-diagnosis"]')?.focus(), 80);
}

function wireS2ExactSelection({ rootId, inputName, limit, statusId, submitId, onSubmit }) {
  const root = document.getElementById(rootId);
  const status = document.getElementById(statusId);
  const submit = document.getElementById(submitId);
  if (!root || !status || !submit) return;
  const inputs = [...root.querySelectorAll(`input[name="${inputName}"]`)];

  const update = changed => {
    let selected = inputs.filter(input => input.checked);
    if (selected.length > limit && changed) {
      changed.checked = false;
      selected = inputs.filter(input => input.checked);
      status.textContent = `Choose only ${limit}. ${selected.length} of ${limit} selected.`;
    } else {
      status.textContent = `${selected.length} of ${limit} selected`;
    }
    submit.disabled = selected.length !== limit;
    inputs.forEach(input => input.closest('.s2-choice-card')?.classList.toggle('selected', input.checked));
  };

  inputs.forEach(input => input.addEventListener('change', () => update(input)));
  submit.addEventListener('click', onSubmit);
  update(null);
}

function getS2CheckedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
}

function classifyS2Diagnosis(selection) {
  const selected = new Set(selection);
  const correct = selected.has('identify_strategy') && selected.has('evaluate_strategy');
  const correctCount = ['identify_strategy', 'evaluate_strategy'].filter(id => selected.has(id)).length;
  if (correct) return { key: 's2_diagnosis_correct', level: 'strong', correctCount };
  if (selected.has('transfer') && correctCount) return { key: 's2_diagnosis_transfer', level: 'partial', correctCount };
  if (selected.has('motivation') || selected.has('encouragement')) return { key: 's2_diagnosis_motivation', level: 'reconsider', correctCount };
  if (selected.has('grading') || selected.has('comparison')) return { key: 's2_diagnosis_grade', level: 'reconsider', correctCount };
  return { key: 's2_diagnosis_evidence', level: correctCount ? 'partial' : 'reconsider', correctCount };
}

function submitS2Diagnosis() {
  const selection = getS2CheckedValues('s2-diagnosis');
  if (selection.length !== 2) return;
  const result = classifyS2Diagnosis(selection);
  const data = getS2Data();
  const labels = selection.map(id => S2_DIAGNOSIS_OPTIONS.find(option => option.id === id)?.label || id);
  data.attempts += 1;
  data.diagnosisAttempts.push({ selection: [...selection], result: result.level, timestamp: new Date().toISOString() });
  data.prompts.push(`S2 diagnosis: ${labels.join(' | ')}`);
  data.finalResponse = pixelDialogue[result.key]?.[0]?.text || '';

  document.querySelectorAll('input[name="s2-diagnosis"]').forEach(input => { input.disabled = true; });
  const submit = document.getElementById('s2DiagnosisSubmit');
  if (submit) submit.disabled = true;

  playPixelSequence(result.key, () => renderS2DiagnosisFeedback(selection, result));
}

function renderS2DiagnosisFeedback(selection, result) {
  const panel = document.getElementById('s2DiagnosisFeedback');
  if (!panel) return;
  const exact = result.key === 's2_diagnosis_correct';
  const text = pixelDialogue[result.key]?.[0]?.text || '';
  panel.innerHTML = `
    <div class="s2-feedback-card ${exact ? 'is-strong' : 'is-developing'}">
      <div class="s2-feedback-heading">${exact ? 'Diagnosis supported by the evidence' : 'A useful diagnosis needs one more pass'}</div>
      <p>${esc(text)}</p>
      <div class="s2-feedback-actions">
        ${exact ? '' : '<button class="s2-secondary-btn" type="button" id="s2RetryDiagnosis">Revise diagnosis</button>'}
        <button class="s2-primary-btn" type="button" id="s2ContinueEvidence">Examine student responses →</button>
      </div>
    </div>`;
  document.getElementById('s2RetryDiagnosis')?.addEventListener('click', renderS2DiagnosisActivity);
  document.getElementById('s2ContinueEvidence')?.addEventListener('click', () => {
    const data = getS2Data();
    data.diagnosisFinal = [...selection];
    renderS2EvidenceActivity();
  });
  panel.querySelector('button')?.focus();
}

function renderS2EvidenceActivity() {
  const container = document.getElementById('inputContainer');
  if (!container) return;
  const responses = S2_EVIDENCE_RESPONSES.map(response => `
    <label class="s2-response-card" for="s2-evidence-${response.id}">
      <input type="checkbox" id="s2-evidence-${response.id}" name="s2-evidence" value="${response.id}" />
      <span class="s2-response-tag">${response.tag}</span>
      <span class="s2-response-body">
        <strong>${esc(response.title)}</strong>
        <span>“${esc(response.text)}”</span>
      </span>
    </label>`).join('');

  container.innerHTML = `
    <div class="s2-stage">
      ${buildScenarioMissionHTML(SCENARIO_INDEX.METACOGNITION, {
        extraHTML: '<div class="s2-progress" aria-label="Scenario 2 progress"><span>1 Diagnose</span><span class="active">2 Examine evidence</span><span>3 Choose a thinking move</span></div>'
      })}
      <section class="s2-evidence-shell" aria-labelledby="s2EvidenceTitle">
        <div class="s2-kicker">Decision 2 · Find the metacognitive thinker</div>
        <h2 id="s2EvidenceTitle">Which two responses show the strongest metacognitive thinking?</h2>
        <p class="s2-task-instruction">Select exactly two. One response is deliberately close because noticing a problem is meaningful, but it is not the entire learning cycle.</p>
        <div class="s2-response-grid" id="s2EvidenceChoices">${responses}</div>
        <div class="s2-selection-bar">
          <span id="s2EvidenceStatus" role="status" aria-live="polite">0 of 2 selected</span>
          <button class="s2-primary-btn" id="s2EvidenceSubmit" type="button" disabled>Submit evidence</button>
        </div>
        <div id="s2EvidenceFeedback" aria-live="polite"></div>
      </section>
    </div>`;

  wireS2ExactSelection({
    rootId: 's2EvidenceChoices',
    inputName: 's2-evidence',
    limit: 2,
    statusId: 's2EvidenceStatus',
    submitId: 's2EvidenceSubmit',
    onSubmit: submitS2Evidence,
  });
  container.scrollTop = 0;
  setTimeout(() => container.querySelector('input[name="s2-evidence"]')?.focus(), 80);
}

function submitS2Evidence() {
  const selection = getS2CheckedValues('s2-evidence');
  if (selection.length !== 2) return;
  const selected = new Set(selection);
  const exact = selected.has('e') && selected.has('f');
  const includesMonitoring = selected.has('d');
  const strongestCount = ['e', 'f'].filter(id => selected.has(id)).length;
  const data = getS2Data();
  const labels = selection.map(id => S2_EVIDENCE_RESPONSES.find(response => response.id === id)?.title || id);
  data.attempts += 1;
  data.evidenceAttempts.push({ selection: [...selection], exact, timestamp: new Date().toISOString() });
  data.prompts.push(`S2 evidence: ${labels.join(' | ')}`);

  document.querySelectorAll('input[name="s2-evidence"]').forEach(input => { input.disabled = true; });
  const submit = document.getElementById('s2EvidenceSubmit');
  if (submit) submit.disabled = true;

  let heading = 'Keep distinguishing awareness from action.';
  let copy = 'Some responses describe feelings, grades, or a strategy without evaluating what happened. Metacognition becomes stronger when the learner judges the strategy and makes a future decision.';
  if (exact) {
    heading = 'You found the strongest evidence.';
    copy = 'Response E evaluates a strategy and changes course. Response F transfers the successful approach to a future task. Together they show a learner using evidence about learning to make a decision.';
  } else if (includesMonitoring && strongestCount) {
    heading = 'Monitoring is meaningful, but it is not the full cycle.';
    copy = 'Response D shows Jordan noticing where understanding broke down. Responses E and F go further by evaluating a strategy, adjusting it, and deciding when to use the successful approach again.';
  }
  data.finalResponse = copy;

  const panel = document.getElementById('s2EvidenceFeedback');
  if (!panel) return;
  panel.innerHTML = `
    <div class="s2-feedback-card ${exact ? 'is-strong' : 'is-developing'}">
      <div class="s2-feedback-heading">${esc(heading)}</div>
      <p>${esc(copy)}</p>
      <div class="s2-feedback-actions">
        ${exact ? '' : '<button class="s2-secondary-btn" type="button" id="s2RetryEvidence">Review the responses</button>'}
        <button class="s2-primary-btn" type="button" id="s2OpeningCheckpoint">Continue →</button>
      </div>
    </div>`;
  document.getElementById('s2RetryEvidence')?.addEventListener('click', renderS2EvidenceActivity);
  document.getElementById('s2OpeningCheckpoint')?.addEventListener('click', () => {
    data.evidenceFinal = [...selection];
    data.openingCheckpointReached = true;
    renderS2OpeningCheckpoint();
  });
  panel.querySelector('button')?.focus();
}

function renderS2OpeningCheckpoint() {
  const container = document.getElementById('inputContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="s2-stage">
      ${buildScenarioMissionHTML(SCENARIO_INDEX.METACOGNITION, {
        extraHTML: '<div class="s2-progress" aria-label="Scenario 2 progress"><span>1 Diagnose</span><span>2 Examine evidence</span><span class="active">3 Choose a thinking move</span></div>'
      })}
      <section class="s2-checkpoint-card" aria-labelledby="s2CheckpointTitle">
        <img src="${ASSETS.images.students.jordan.confident}" alt="Jordan looking more confident" />
        <div>
          <div class="s2-kicker">Opening vertical slice complete</div>
          <h2 id="s2CheckpointTitle">The case is diagnosed.</h2>
          <p>You identified the gap between completing work and understanding how learning happened. The next build will let the player choose whether Jordan needs to plan, monitor, evaluate, or transfer a strategy before Claude designs the activity.</p>
          <div class="s2-feedback-actions">
            <button class="s2-secondary-btn" type="button" onclick="switchScenario(1,document.querySelectorAll('.tab-btn')[1])">Replay S2 opening</button>
            <button class="s2-primary-btn" type="button" onclick="openMainMenu('scenarios')">Return to Scenario Select</button>
          </div>
        </div>
      </section>
    </div>`;
  container.querySelector('button')?.focus();
}


// ══════════════════════════════════════════════════════
//  HALLUCINATION HUNT CRITICAL-THINKING HELPERS
// ══════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════
//  SCENARIO NAVIGATION
//  A "Move to next scenario" card appears in the chat
//  once the player hits a score of 3+ on any attempt.
//  They can keep practicing or move forward.
// ══════════════════════════════════════════════════════

// Track whether nav card has been shown for current scenario
let navCardShown = Array(SCENARIO_COUNT).fill(false);

const SCORE_THRESHOLD = 3; // score out of 5 needed to show nav card

function appendScenarioNavCard({
  targetIndex,
  title = 'Ready to move on?',
  subtitle = '',
  stayLabel = 'Keep practicing this one first',
  stayAriaLabel = 'Keep practicing this scenario',
  container = document.getElementById('chat'),
} = {}) {
  const target = Number(targetIndex);
  const targetUI = getScenarioUI(target);
  if (!container || !Number.isInteger(target) || !scenarios[target]) return null;

  const wrapper = document.createElement('div');
  wrapper.className = 'scenario-nav-wrap';
  const resolvedSubtitle = subtitle || `Your work here is complete. ${targetUI.tabLabel} is waiting.`;
  wrapper.innerHTML = `
    <div class="scenario-nav-card">
      <div class="scenario-nav-text">
        <div class="scenario-nav-title">${esc(title)}</div>
        <div class="scenario-nav-sub">${esc(resolvedSubtitle)}</div>
      </div>
      <button class="scenario-nav-btn"
              type="button"
              onclick="navigateToNext(${target})"
              aria-label="Move to ${esc(targetUI.tabLabel)}">
        Next scenario →
      </button>
    </div>
    <button class="scenario-keep-link"
            type="button"
            onclick="this.closest('.scenario-nav-wrap').remove()"
            aria-label="${esc(stayAriaLabel)}">
      ${esc(stayLabel)}
    </button>`;

  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;
  return wrapper;
}

function maybeShowNavCard(score) {
  if (scenarioIndex !== SCENARIO_INDEX.ENGAGEMENT || navCardShown[scenarioIndex] || score < SCORE_THRESHOLD) return;
  navCardShown[scenarioIndex] = true;
  appendScenarioNavCard({
    targetIndex: SCENARIO_INDEX.METACOGNITION,
    title: 'Scenario 1 is ready.',
    subtitle: 'Scenario 2 now has a playable opening case with Jordan. You can begin the metacognition diagnosis or keep refining Scenario 1.',
    stayLabel: 'Keep practicing Scenario 1'
  });
}








// Later-scenario implementations are archived outside the active runtime.

async function autoSaveSession(label) {
  if (!SHEETS_URL || SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') return;
  if (SURVEY_MODE !== 'sheets') return;
  try {
    const payload = buildSessionPayload(null);
    payload.type = 'autosave';
    payload.autosave_trigger = label;
    await postToSheets(payload, 'Sheets payload');
  } catch(e) {
    // silent fail — reflection form send is the primary
  }
}
const EXPRESSIONS = PIXEL_EXPR;

// Queue of dialogue sequences waiting to play
let vnQueue = [];
let claudeTerminalCloseCallback = null;
let vnTyping = false;
let vnTypeTimer = null;
let vnCurrentText = '';
let vnFullText = '';
let vnOnComplete = null;


// ── CLAUDE SHELF STATE SYSTEM ────────────────────────

function setVNClaudeMode(enabled = false) {
  const overlay = document.getElementById('vnOverlay');
  if (!overlay) return;
  overlay.classList.toggle('claude-consult', !!enabled);
}

function setVNClaudeTerminalMode(enabled = false) {
  const overlay = document.getElementById('vnOverlay');
  if (!overlay) return;
  overlay.classList.toggle('claude-terminal-consult', !!enabled);
}

function setClaudeTerminalTextMode(enabled = false) {
  const terminal = document.getElementById('claudeTerminalScene');
  const overlay = document.getElementById('vnOverlay');
  if (terminal) terminal.classList.toggle('textmode', !!enabled);
  if (overlay) overlay.classList.toggle('claude-terminal-textmode', !!enabled);
}

function terminalizeClaudeText(text) {
  return String(text || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\*\*/g, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function setClaudeTerminalState(state = 'idle', title = 'CLAUDE TERMINAL', output = 'IDLE') {
  const terminal = document.getElementById('claudeTerminalScene');
  const titleEl = document.getElementById('claudeTerminalTitle');
  const outputEl = document.getElementById('claudeTerminalOutput');
  if (terminal) {
    terminal.classList.remove('idle', 'thinking', 'responding');
    terminal.classList.add(state);
  }
  if (titleEl) titleEl.textContent = title;
  if (outputEl) {
    outputEl.classList.remove('claude-analysis-layout', 'pc-analyzing-output');
    outputEl.innerHTML = `${output}<span class="claude-terminal-cursor"></span>`;
  }
}


function renderClaudeAnalyzingReadout(partLabel = 'Scenario diagnosis') {
  const outputEl = document.getElementById('claudeTerminalOutput');
  if (!outputEl) return;

  const sectionLabel = terminalizeClaudeText(partLabel || 'Scenario diagnosis').toUpperCase() || 'SCENARIO DIAGNOSIS';
  outputEl.classList.remove('claude-analysis-layout');
  outputEl.classList.add('pc-analyzing-output');

  outputEl.innerHTML = `
    <div class="pc-analyzing-readout" aria-label="Claude terminal analyzing">
      <div class="pc-terminal-line pc-terminal-title-line">CLAUDE TERMINAL</div>
      <div class="pc-terminal-gap" aria-hidden="true"></div>
      <div class="pc-terminal-line">&gt; SECTION</div>
      <div class="pc-terminal-line pc-terminal-indent">${esc(sectionLabel)}</div>
      <div class="pc-terminal-gap" aria-hidden="true"></div>
      <div class="pc-terminal-line">&gt; STATUS</div>
      <div class="pc-terminal-line pc-terminal-indent pc-analyzing-status">ANALYZING<span class="claude-terminal-cursor" aria-hidden="true"></span></div>
    </div>
  `;
}


const PC_ANALYSIS_LAYOUT_CLASSES_V122 = [
  'pc-analysis-green-panel',
  'pc-analysis-computer-mode',
  'pc-analysis-report-active-v119',
  'pc-analysis-green-panel-v119',
  'pc-analysis-computer-mode-v119',
  'pc-analysis-terminal-panel-v120',
  'pc-analysis-report-active-v122',
  'pc-analysis-terminal-v122',
  'pc-analysis-mobile-v122'
];

function pcAnalysisViewportWidthV122() {
  const values = [
    window.innerWidth,
    document.documentElement ? document.documentElement.clientWidth : null,
    window.visualViewport ? window.visualViewport.width : null
  ].filter((value) => Number.isFinite(value) && value > 0);

  return values.length ? Math.min(...values) : 9999;
}

function pcGetAnalysisLayoutV122() {
  const width = pcAnalysisViewportWidthV122();
  if (width <= 760) return 'mobile';
  if (width <= 1510) return 'terminal';
  return 'computer';
}

function pcClearLegacyAnalysisInlineStylesV122() {
  const overlay = document.getElementById('vnOverlay');
  const terminal = document.getElementById('claudeTerminalScene');
  const photo = terminal ? terminal.querySelector('.claude-terminal-photo') : null;
  const screen = terminal ? terminal.querySelector('.claude-terminal-screen') : null;
  const dialogue = overlay ? overlay.querySelector('.vn-dialogue') : null;
  const scene = overlay ? overlay.querySelector('.vn-scene') : null;

  const clearProperties = (element, properties) => {
    if (!element) return;
    properties.forEach((property) => element.style.removeProperty(property));
  };

  clearProperties(terminal, [
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'max-width', 'max-height', 'min-height', 'aspect-ratio', 'transform',
    'margin', 'padding', 'display', 'opacity', 'visibility', 'z-index'
  ]);
  clearProperties(photo, [
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'max-width', 'max-height', 'aspect-ratio', 'border-radius', 'padding',
    'margin', 'background', 'background-image', 'border', 'box-shadow', 'display'
  ]);
  clearProperties(screen, [
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'border-radius', 'padding', 'box-sizing', 'overflow', 'overflow-y', 'z-index'
  ]);
  clearProperties(dialogue, [
    'height', 'min-height', 'padding', 'overflow', 'background', 'border'
  ]);
  clearProperties(scene, ['flex', 'height', 'min-height']);
}

function pcIsAnalysisReportActiveV122() {
  const overlay = document.getElementById('vnOverlay');
  const output = document.getElementById('claudeTerminalOutput');

  return Boolean(
    overlay &&
    overlay.classList.contains('active') &&
    overlay.classList.contains('claude-terminal-textmode') &&
    output &&
    output.classList.contains('claude-analysis-layout')
  );
}

function pcApplyAnalysisLayoutV122() {
  const overlay = document.getElementById('vnOverlay');
  const terminal = document.getElementById('claudeTerminalScene');
  const output = document.getElementById('claudeTerminalOutput');
  const targets = [overlay, terminal, output].filter(Boolean);
  const isActive = pcIsAnalysisReportActiveV122();
  const layout = isActive ? pcGetAnalysisLayoutV122() : null;

  pcClearLegacyAnalysisInlineStylesV122();

  targets.forEach((element) => {
    element.classList.remove(...PC_ANALYSIS_LAYOUT_CLASSES_V122);

    if (!isActive) return;
    element.classList.add('pc-analysis-report-active-v122');

    if (layout === 'terminal') {
      element.classList.add('pc-analysis-terminal-v122');
    } else if (layout === 'mobile') {
      element.classList.add('pc-analysis-mobile-v122');
    }
  });
}

function pcClearAnalysisLayoutV122() {
  const overlay = document.getElementById('vnOverlay');
  const terminal = document.getElementById('claudeTerminalScene');
  const output = document.getElementById('claudeTerminalOutput');

  [overlay, terminal, output].filter(Boolean).forEach((element) => {
    element.classList.remove(...PC_ANALYSIS_LAYOUT_CLASSES_V122);
  });

  pcClearLegacyAnalysisInlineStylesV122();
}

if (!window.pcAnalysisLayoutV122Installed) {
  window.pcAnalysisLayoutV122Installed = true;
  window.addEventListener('resize', pcApplyAnalysisLayoutV122, { passive: true });
  window.addEventListener('orientationchange', pcApplyAnalysisLayoutV122, { passive: true });
  window.visualViewport?.addEventListener('resize', pcApplyAnalysisLayoutV122, { passive: true });
}

function showClaudeConsultOverlay(partLabel) {
  // This is an interaction moment: Pixel consults Claude through the terminal close-up.
  vnQueue = [];
  clearTimeout(vnTypeTimer);
  vnTyping = true;
  vnOnComplete = null;
  vnFullText = '';
  vnCurrentText = '';

const overlay = document.getElementById('vnOverlay');

pcClearAnalysisLayoutV122();

overlay.classList.remove(
  'claude-prediction',
  'pc-clean-prediction',
  'pc-prediction-question',
  'claude-terminal-consult',
  'claude-terminal-textmode',
  'pc-clean-output',
  'pc-clean-final',
  'analysis-complete'
);

overlay.classList.add('active', 'claude-terminal-consult');

setVNClaudeMode(false);
setVNClaudeTerminalMode(true);
setClaudeTerminalTextMode(false);

musicStartVN();

setClaudeShelfState('idle', 'idle');

setClaudeTerminalState(
  'thinking',
  'CLAUDE TERMINAL',
  `SECTION:\n${esc(partLabel).toUpperCase()}\n\nANALYZING...`
);

renderClaudeAnalyzingReadout(partLabel);

  const speaker = document.getElementById('vnSpeaker');
  if (speaker) speaker.textContent = 'Professor Pixel';

  const vnText = document.getElementById('vnText');
  if (vnText) {
    vnText.innerHTML = `<div><strong>Let's ask Claude what it notices.</strong></div><div style="margin-top:8px;">Claude is analyzing the teaching problem now.</div><div class="vn-prediction-note">Terminal active...</div>`;
  }

  const hint = document.getElementById('vnAdvanceHint');
  if (hint) hint.classList.remove('show');

  setTimeout(() => {
    document.getElementById('vnDialogue')?.focus();
  }, 100);
}

function parseClaudeDiagnosticSections(text) {
  const clean = terminalizeClaudeText(text);
  const lines = clean
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean);

  const result = {
    status: '',
    issue: '',
    repair: '',
    confidence: '',
    impact: ''
  };

  let current = '';

  for (const line of lines) {
    const upper = line.toUpperCase().replace(/:$/, '');

    if (/^(MOCK )?ANALYSIS COMPLETE$/.test(upper) || upper === 'SCENARIO DIAGNOSTIC') continue;

    if (upper === 'STATUS') { current = 'status'; continue; }
    if (upper === 'ISSUE DETECTED') { current = 'issue'; continue; }
    if (upper === 'RECOMMENDED REPAIR') { current = 'repair'; continue; }
    if (upper === 'EXPECTED IMPACT') { current = 'impact'; continue; }
    if (upper === 'CONFIDENCE') { current = 'confidence'; continue; }

    if (current && result[current]) result[current] += ' ' + line;
    else if (current) result[current] = line;
  }

  const fallbackIssue = clean
    .replace(/^(MOCK )?ANALYSIS COMPLETE\s*/i, '')
    .replace(/^SCENARIO DIAGNOSTIC\s*/i, '')
    .trim();

  return {
    status: result.status || 'High-confidence repair',
    issue: result.issue || fallbackIssue || 'The prompt has a discussion design problem that may limit student interaction.',
    repair: result.repair || 'Add a clear reason for students to extend, challenge, compare, or build on a peer’s idea using evidence or reasoning.',
    impact: result.impact || 'Students will be more likely to extend conversations, challenge ideas, compare perspectives, and engage in deeper discussion.',
    confidence: result.confidence || 'High'
  };
}

function buildClaudeAnalysisHTML(feedback, mock = false) {
  const d = parseClaudeDiagnosticSections(feedback);
  const badge = mock ? 'MOCK ANALYSIS COMPLETE' : 'ANALYSIS COMPLETE';

  return `
    <div class="analysis-report" role="document" aria-label="Claude scenario diagnostic report">
      <header class="analysis-header">
        <div class="analysis-badge">${esc(badge)}</div>
        <h2 class="analysis-title">Scenario Diagnostic</h2>
        <p class="analysis-summary">
          Claude found the discussion design problem and suggested a repair that gives students a clearer reason to keep the conversation going.
        </p>
      </header>

      <div class="analysis-grid" aria-label="Diagnostic findings">
        <section class="analysis-card analysis-status-card compact">
          <span class="analysis-label">Status</span>
          <div class="analysis-value big">✓ ${esc(d.status)}</div>
        </section>

        <section class="analysis-card analysis-confidence-card compact">
          <span class="analysis-label">Confidence</span>
          <div class="analysis-value big">${esc(d.confidence)}</div>
          <div class="analysis-note">Strong evidence pattern detected.</div>
        </section>

        <section class="analysis-card analysis-issue-card">
          <span class="analysis-label">Issue Detected</span>
          <div class="analysis-value">${esc(d.issue)}</div>
        </section>

        <section class="analysis-card analysis-repair-card">
          <span class="analysis-label">Recommended Repair</span>
          <div class="analysis-value">${esc(d.repair)}</div>
        </section>

        <section class="analysis-card analysis-impact-card wide">
          <span class="analysis-label">Expected Impact</span>
          <div class="analysis-value">${esc(d.impact)}</div>
        </section>
      </div>
    </div>
  `;
}


function showClaudeConsultResult(feedback, mock = false, onClose = null) {
  claudeTerminalCloseCallback = typeof onClose === 'function' ? onClose : null;
  const label = mock ? 'MOCK ANALYSIS COMPLETE' : 'ANALYSIS COMPLETE';
  const terminalText = `${label}\n\n${terminalizeClaudeText(feedback)}`;

  setClaudeTerminalTextMode(true);

  setClaudeTerminalState(
    'responding',
    mock ? 'MOCK CLAUDE TERMINAL' : 'CLAUDE TERMINAL',
    esc(terminalText)
  );

  const output = document.getElementById('claudeTerminalOutput');

  if (output) {
    output.classList.add('claude-analysis-layout');
    output.innerHTML = buildClaudeAnalysisHTML(terminalText, mock);
  }

  pcApplyAnalysisLayoutV122();

  requestAnimationFrame(() => {
    pcApplyAnalysisLayoutV122();
    const screen = output?.closest('.claude-terminal-screen');
    if (screen) screen.scrollTop = 0;
    if (output) output.scrollTop = 0;
  });

  const speaker = document.getElementById('vnSpeaker');
  if (speaker) speaker.textContent = 'Professor Pixel';

  const vnText = document.getElementById('vnText');
  if (vnText) {
    vnText.innerHTML = `
      <button id="claudeTTSBtn" class="claude-tts-btn" type="button" onclick="event.stopPropagation();toggleClaudeTTS()">🔊 Read Analysis</button>
      <button class="vn-return-btn terminal-return" type="button" onclick="event.stopPropagation();closeClaudeConsultOverlay()">Continue</button>
    `;
    setTimeout(() => vnText.querySelector('.vn-return-btn')?.focus(), 100);
  }

  const hint = document.getElementById('vnAdvanceHint');
  if (hint) hint.classList.remove('show');
}


// NOTE: Terminal diagnosis copy is still inline. Candidate for dialogue.js or scenario-data.js.
function showClaudeFinalResponseInTerminal(responseText, mock = false, onClose = null, scoreTotal = null) {
  // S2: wrap onClose to render the result card after terminal closes
  let effectiveClose = onClose;
  if (scenarioIndex === 1) {
    effectiveClose = function() {
      addS2ClaudeResultCard(responseText);
      if (typeof onClose === 'function') onClose();
    };
  }
  // If the thinking screen is already open, keep it and swap to the result quickly.
  const overlay = document.getElementById('vnOverlay');
  if (!overlay || !overlay.classList.contains('active')) {
    showClaudeConsultOverlay('Scenario diagnosis');
  }
  // Keep the Claude processing screen visible long enough to read/screenshot.
  // This is the screen between "Continue to Claude" and the Claude Output.
  // Increase or decrease this number if needed. 2200 = 2.2 seconds.
  const CLAUDE_PROCESSING_MIN_MS = 4200;

  setTimeout(() => {
    const terminalOutput = scenarioIndex === 0 && typeof scoreTotal === 'number'
      ? buildS1TerminalDiagnosis(scoreTotal, responseText)
      : responseText;
    showClaudeConsultResult(terminalOutput, mock, effectiveClose);
  }, CLAUDE_PROCESSING_MIN_MS);
}

// NOTE: Pixel score-reflection dialogue is still inline. Candidate for dialogue.js pass 2.
function closeClaudeConsultOverlay() {
  const cb = claudeTerminalCloseCallback;
  claudeTerminalCloseCallback = null;
  const overlay = document.getElementById('vnOverlay');
  pcClearAnalysisLayoutV122();
  if (overlay) overlay.classList.remove('active', 'claude-consult', 'claude-terminal-consult', 'claude-terminal-textmode', 'claude-prediction');
  document.getElementById('vnCharacter')?.classList.remove('visible', 'is-active', 'is-inactive');
  document.getElementById('vnStudentCharacter')?.classList.remove('visible', 'is-active', 'is-inactive');
  overlay?.classList.remove('s2-dual-character');
  setClaudeShelfState('idle', 'idle');
  setClaudeTerminalTextMode(false);
  setClaudeTerminalState('idle', 'CLAUDE TERMINAL', 'IDLE');
  musicEndVN();
  if (cb) {
    setTimeout(cb, 250);
  } else {
    document.getElementById('promptInput')?.focus();
  }
  function stopClaudeTTS() {
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
    }
    const btn = document.getElementById('claudeTTSBtn');
    if (btn) btn.textContent = '🔊 Read Analysis';
  }
}

function setClaudeShelfState(state = 'idle', label = '') {
  const shelf = document.getElementById('claudeShelf');
  const status = document.getElementById('claudeShelfStatus');
  if (!shelf) return;
  shelf.classList.remove('idle', 'thinking', 'responding');
  shelf.classList.add(state);
  if (status) status.textContent = label || state;
}

function vnShow(expression, text, onComplete, meta = {}) {
  // Add to queue. Meta keeps the shared VN system backward compatible while
  // allowing S2 lines to identify Jordan as the speaker.
  vnQueue.push({ expression, text, onComplete, ...meta });
  if (!vnTyping) vnPlayNext();
}

function vnPlayNext() {
  if (vnQueue.length === 0) {
    setTimeout(() => {
      const overlay = document.getElementById('vnOverlay');
      overlay.classList.remove('active', 'claude-consult', 'claude-terminal-consult');
      document.getElementById('vnCharacter').classList.remove('visible', 'is-active', 'is-inactive');
      document.getElementById('vnStudentCharacter')?.classList.remove('visible', 'is-active', 'is-inactive');
      const pixelCharacter = document.getElementById('vnCharacter');
      const studentCharacter = document.getElementById('vnStudentCharacter');
      if (pixelCharacter) pixelCharacter.style.removeProperty('display');
      if (studentCharacter) studentCharacter.style.removeProperty('display');
      overlay.classList.remove('s2-dual-character');
      document.getElementById('promptInput')?.focus();
      // Fade music down when VN closes
      musicEndVN();
      setClaudeShelfState('idle', 'idle');
    }, 300);
    vnTyping = false;
    return;
  }

  const { expression, text, onComplete, speaker = 'Professor Pixel', character = 'pixel' } = vnQueue.shift();
  vnOnComplete = onComplete || null;
  vnTyping = true;

  const overlay = document.getElementById('vnOverlay');
  overlay.classList.add('active');

  // Reset Claude modes, then configure the active VN speaker. S2 keeps Jordan
  // opposite Pixel on wide screens and shows only the active speaker on small screens.
  setVNClaudeMode(false);
  setVNClaudeTerminalMode(false);
  setClaudeTerminalTextMode(false);

  // Fade music up when VN opens
  musicStartVN();
  setClaudeShelfState('idle', 'idle');

  vnSetDialogueCharacter(character, expression, speaker);

  setTimeout(() => {
    document.getElementById('vnDialogue').focus();
  }, 100);

  document.getElementById('vnAdvanceHint').classList.remove('show');

  vnFullText = text;
  vnCurrentText = '';
  document.getElementById('vnText').innerHTML = '';
  vnTypeWriter(text);
}

function vnSetExpression(expr) {
  const img = document.getElementById('vnPortrait');
  const badge = document.getElementById('vnExprBadge');
  const src = EXPRESSIONS[expr] || EXPRESSIONS.neutral;

  badge.textContent = expr;

  // Briefly fade out, swap, fade in
  if (img.style.display !== 'none') {
    img.style.opacity = '0';
    setTimeout(() => {
      pcSetImageSource(img, src, LEGACY_ASSETS.images.professorPixel[expr] || LEGACY_ASSETS.images.professorPixel.neutral);
      img.style.opacity = '1';
    }, 150);
  } else {
    pcSetImageSource(img, src, LEGACY_ASSETS.images.professorPixel[expr] || LEGACY_ASSETS.images.professorPixel.neutral);
  }
}


function vnSetStudentExpression(expr) {
  const img = document.getElementById('vnStudentPortrait');
  const badge = document.getElementById('vnStudentExprBadge');
  const expressions = ASSETS.images.students.jordan;
  const src = expressions[expr] || expressions.neutral;
  if (badge) badge.textContent = expr;
  if (!img) return;
  img.style.opacity = '0';
  setTimeout(() => {
    pcSetImageSource(img, src, LEGACY_ASSETS.images.students.jordan[expr] || LEGACY_ASSETS.images.students.jordan.neutral);
    img.style.opacity = '1';
  }, 120);
}

function vnSetDialogueCharacter(character = 'pixel', expression = 'neutral', speakerName = 'Professor Pixel') {
  const overlay = document.getElementById('vnOverlay');
  const pixel = document.getElementById('vnCharacter');
  const student = document.getElementById('vnStudentCharacter');
  const speaker = document.getElementById('vnSpeaker');
  const dialogue = document.getElementById('vnDialogue');
  const isJordan = character === 'jordan';
  const useS2Cast = scenarioIndex === SCENARIO_INDEX.METACOGNITION && (isJordan || character === 'pixel');

  if (speaker) speaker.textContent = speakerName || (isJordan ? 'Jordan' : 'Professor Pixel');
  if (dialogue) dialogue.setAttribute('aria-label', `${speaker?.textContent || speakerName} is speaking. Press Space or Enter to continue.`);
  overlay?.classList.toggle('s2-dual-character', useS2Cast);

  if (useS2Cast) {
    pixel?.classList.add('visible');
    student?.classList.add('visible');
    pixel?.classList.toggle('is-active', !isJordan);
    pixel?.classList.toggle('is-inactive', isJordan);
    student?.classList.toggle('is-active', isJordan);
    student?.classList.toggle('is-inactive', !isJordan);
  } else {
    pixel?.classList.add('visible', 'is-active');
    pixel?.classList.remove('is-inactive');
    student?.classList.remove('visible', 'is-active', 'is-inactive');
  }

  pcApplyS2CastResponsive();
  if (isJordan) vnSetStudentExpression(expression);
  else vnSetExpression(expression);
}

function pcApplyS2CastResponsive() {
  const overlay = document.getElementById('vnOverlay');
  const pixel = document.getElementById('vnCharacter');
  const student = document.getElementById('vnStudentCharacter');
  const compact = window.matchMedia?.('(max-width: 620px), (max-height: 650px)').matches;
  if (!overlay?.classList.contains('s2-dual-character')) {
    if (pixel) pixel.style.display = '';
    if (student) student.style.display = '';
    return;
  }
  if (pixel) {
    if (compact && pixel.classList.contains('is-inactive')) pixel.style.setProperty('display', 'none', 'important');
    else pixel.style.removeProperty('display');
  }
  if (student) {
    if (compact && student.classList.contains('is-inactive')) student.style.setProperty('display', 'none', 'important');
    else student.style.removeProperty('display');
  }
}

if (!window.pcS2CastResponsiveInstalled) {
  window.pcS2CastResponsiveInstalled = true;
  window.addEventListener('resize', pcApplyS2CastResponsive, { passive: true });
  window.visualViewport?.addEventListener('resize', pcApplyS2CastResponsive, { passive: true });
}

function vnTypeWriter(text) {
  const el = document.getElementById('vnText');
  let i = 0;
  const speed = 28; // ms per character

  function type() {
    if (i < text.length) {
      vnCurrentText += text[i];
      el.innerHTML = vnCurrentText + '<span class="vn-cursor"></span>';
      i++;
      vnTypeTimer = setTimeout(type, speed);
    } else {
      // Typing done
      el.innerHTML = vnCurrentText;
      document.getElementById('vnAdvanceHint').classList.add('show');
      playSound(null); // audio hook — add sound key if desired
    }
  }
  type();
}

function vnSkipType() {
  // Instantly complete current line
  clearTimeout(vnTypeTimer);
  const el = document.getElementById('vnText');
  el.innerHTML = vnFullText;
  document.getElementById('vnAdvanceHint').classList.add('show');
}

function vnAdvance() {
  const overlay = document.getElementById('vnOverlay');

  // HARD STOP: during Claude terminal/thinking screens, clicks on the black
  // dialogue panel must NOT advance or clear the VN text. Only the explicit
  // Continue button on the finished analysis screen should close it.
  const terminal = document.getElementById('claudeTerminalScene');
  const terminalIsThinking = terminal?.classList.contains('thinking');
  const terminalReturnVisible = !!document.querySelector('.terminal-return, #pcContinueToClaudeBtn');
  if (
    overlay &&
    overlay.classList.contains('active') &&
    (overlay.classList.contains('claude-terminal-consult') || overlay.classList.contains('claude-terminal-textmode')) &&
    !terminalReturnVisible &&
    (terminalIsThinking || !overlay.classList.contains('claude-terminal-textmode'))
  ) {
    return;
  }

  // HARD STOP: once the prediction has been logged, the black VN box must
  // not advance the scene. Only the actual "Continue to Claude" button should
  // move the user into the Claude processing screen. Otherwise a stray click
  // jumps the state machine into the weird empty terminal screen. Charming.
  if (
    window.pcWaitingForClaudeContinue ||
    document.getElementById('pcContinueToClaudeBtn')
  ) {
    return;
  }

  // Do not auto-advance while prediction choices are visible.
  if (
    overlay &&
    (
      overlay.classList.contains('claude-prediction') ||
      overlay.classList.contains('pc-clean-prediction')
    ) &&
    (
      document.querySelector('.vn-prediction-options') ||
      document.getElementById('vnPredictionChoicePanel') ||
      document.getElementById('predictionGate') ||
      document.querySelector('.pc-choice-panel-final')
    )
  ) {
    return;
  }

  // If still typing, skip to end first
  if (document.getElementById('vnAdvanceHint').classList.contains('show') === false) {
    vnSkipType();
    return;
  }
  // Otherwise advance to next line or close
  if (vnOnComplete) {
    const cb = vnOnComplete;
    vnOnComplete = null;
    cb();
  }
  vnTyping = false;
  vnPlayNext();
}

// ── PROFESSOR PIXEL DIALOGUE SEQUENCES ───────────────
/* pixelDialogue moved to dialogue.js */


function getScenarioStartDialogueKey(index) {
  const ui = SCENARIO_UI?.[index];
  return ui?.key ? `scenarioStart_${ui.key}` : `scenarioStart_${index}`;
}

function getScenarioIndexFromDialogueKey(key) {
  if (!key.startsWith('scenarioStart_')) return -1;

  const suffix = key.slice('scenarioStart_'.length);
  const legacyIndex = Number(suffix);
  if (Number.isInteger(legacyIndex) && scenarios[legacyIndex]) return legacyIndex;

  return SCENARIO_UI.findIndex(ui => ui.key === suffix);
}

function playPixelSequence(key, onDone) {
  const lines = pixelDialogue[key];
  if (!lines) return;

  // Update board text and play intro audio on scenario starts
  if (key.startsWith('scenarioStart_')) {
    const i = getScenarioIndexFromDialogueKey(key);
    if (i >= 0 && scenarios[i]) {
      const boardText = document.getElementById('vnBoardText');
      if (boardText) boardText.textContent = scenarios[i].desc;
      // Play scenario intro — suppressed during initial load to avoid double audio
      if (window.scenarioIntroEnabled) playSound(`scenarioIntro${i}`);
    }
  }

  // Welcome narration on game start
  if (key === 'welcome') playSound('welcome');

  // Queue all lines
  lines.forEach((line, idx) => {
    const isLast = idx === lines.length - 1;
    vnShow(line.expr, line.text, isLast && onDone ? onDone : null, { speaker: line.speaker || 'Professor Pixel', character: line.character || 'pixel', id: line.id || '' });
  });
}

// ══════════════════════════════════════════════════════
//  SCENE ILLUSTRATION LOADER
//  Scene paths live in ASSETS.images.scenes. Add each new scenario image to
//  its named folder and update the manifest once rather than scattering paths.
// ══════════════════════════════════════════════════════
function loadSceneImage(src, fallback = '') {
  const img = document.getElementById('vnBoardImg');
  const loading = document.getElementById('vnBoardLoading');
  if (!img) return;

  if (loading) loading.style.display = 'none';
  img.classList.remove('loaded');

  if (!src) {
    img.removeAttribute('src');
    img.alt = '';
    return;
  }

  const test = new Image();
  test.onload = () => {
    img.src = src;
    img.alt = 'Scene illustration';
    img.classList.add('loaded');
  };
  test.onerror = () => {
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

  // Safety check: if S1 content is still empty after load, render it again.
  setTimeout(() => {
    const scenarioText = document.getElementById('scenarioText');
    const inputContainer = document.getElementById('inputContainer');

    if ((!scenarioText || !scenarioText.textContent.trim()) ||
        (!inputContainer || !inputContainer.textContent.trim())) {
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
//  SCENARIO NAV
// ══════════════════════════════════════════════════════
function resetScenarioRunState(index) {
  scenarioIndex = index;
  attempts = 0;
  lastPromptText = '';
  history = [];
  const attemptCount = document.getElementById('attNum');
  if (attemptCount) attemptCount.textContent = '0';
  if (Array.isArray(navCardShown)) navCardShown[index] = false;
}


function selectScenarioTab(index, explicitButton = null) {
  const tabs = [...document.querySelectorAll('.tab-btn')];
  tabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });

  const target = explicitButton || tabs[index];
  if (target) {
    target.classList.add('active');
    target.setAttribute('aria-selected', 'true');
  }
}

function playScenarioIntroduction(index) {
  const ui = getScenarioUI(index);
  if (!ui.implemented) return;

  const overlay = document.getElementById('vnOverlay') || document.querySelector('.vn-overlay');
  overlay?.classList.add('scenario-intro-active');
  const onDone = () => {
    overlay?.classList.remove('scenario-intro-active');
    if (index === SCENARIO_INDEX.METACOGNITION) renderS2DiagnosisActivity();
  };

  if (window.scenarioIntroTimer) clearTimeout(window.scenarioIntroTimer);
  window.scenarioIntroTimer = setTimeout(() => {
    playPixelSequence(getScenarioStartDialogueKey(index), onDone);
  }, 300);
}


function switchScenario(i, btn) {
  const index = Number(i);
  if (!Number.isInteger(index) || !scenarios[index]) return false;

  pcClearVNStateForScenarioSwitch();
  resetScenarioRunState(index);
  selectScenarioTab(index, btn);
  window.scenarioIntroEnabled = true;
  loadScenario(index);

  if (getScenarioUI(index).implemented) playScenarioIntroduction(index);
  return false;
}


function pcClearVNStateForScenarioSwitch() {
  const overlay = document.getElementById('vnOverlay') || document.querySelector('.vn-overlay');
  if (overlay) {
    overlay.classList.remove(
      'active',
      'claude-prediction',
      'pc-clean-prediction',
      'claude-terminal-consult',
      'claude-terminal-textmode',
      'claude-analysis',
      'claude-consult',
      'pc-clean-output',
      'scenario-intro-active'
    );
  }

  document.getElementById('vnDialogue')?.classList.remove('has-choices');
  document.getElementById('vnCharacter')?.classList.remove('visible', 'is-active', 'is-inactive');
  document.getElementById('vnStudentCharacter')?.classList.remove('visible', 'is-active', 'is-inactive');
  const pixelCharacter = document.getElementById('vnCharacter');
  const studentCharacter = document.getElementById('vnStudentCharacter');
  if (pixelCharacter) pixelCharacter.style.removeProperty('display');
  if (studentCharacter) studentCharacter.style.removeProperty('display');
  overlay?.classList.remove('s2-dual-character');
  document.querySelectorAll('#vnPredictionChoicePanel,#predictionGate,.pc-choice-panel-final,.pc-clean-choice-grid,.vn-choice-list').forEach(el => el.remove());

  window.pendingPromptForPrediction = '';
  window.pendingPromptAfterPrediction = '';
  window.pcWaitingForClaudeContinue = false;

  try { predictionGateActive = false; } catch(e) {}
  try { vnQueue = []; } catch(e) {}
  try { vnTyping = false; } catch(e) {}
  try { vnOnComplete = null; } catch(e) {}
  try { clearTimeout(vnTypeTimer); } catch(e) {}
  try { setClaudeShelfState('idle', 'idle'); } catch(e) {}
  try { setClaudeTerminalTextMode(false); } catch(e) {}
  try { setClaudeTerminalState('idle', 'CLAUDE TERMINAL', 'AWAITING INPUT...'); } catch(e) {}
  try { musicEndVN(); } catch(e) {}
}

function pcFillS1DevFields() {
  const values = {
    'g-learners': 'online first-year general education students in an 8-week fully asynchronous course',
    'g-issue': 'students are posting one-sentence reactions, replying only because it is required, and the conversation dies after one exchange',
    'g-interaction': 'compare two possible interpretations of the reading, support their claim with one specific example, and ask a follow-up question that invites a peer to extend or challenge the idea',
    'g-constraints': "no extra tools, one initial post, two substantive peer replies, and strong replies must explain reasoning, use evidence or examples, and build on a classmate's idea"
  };

  const tryFill = (attempts = 0) => {
    const fields = Object.keys(values).map(id => document.getElementById(id));
    if (fields.every(Boolean)) {
      Object.entries(values).forEach(([id, val]) => {
        const el = document.getElementById(id);
        el.value = val;
        if (typeof autoGrow === 'function') autoGrow(el);
      });
      if (typeof onGuidedInput === 'function') onGuidedInput(document.getElementById('g-learners'));
      document.getElementById('g-learners')?.focus();
      return;
    }
    if (attempts < 30) setTimeout(() => tryFill(attempts + 1), 100);
  };

  tryFill();
}

function resetS1Dev() {
    scenarioIndex = 0;
    attempts = 0;
    lastPromptText = '';
    history = [];

    if (window.scenarioIntroTimer) {
      clearTimeout(window.scenarioIntroTimer);
      window.scenarioIntroTimer = null;
    }

    pcClearVNStateForScenarioSwitch();

    try { localStorage.removeItem('promptcraft_s1_clean_draft'); } catch(e) {}

    if (window.playerHistory && window.playerHistory.s1) {
      window.playerHistory.s1 = {
        learners: '',
        issue: '',
        goal: '',
        interaction: '',
        constraints: '',
        assembled: ''
      };
    }

    if (typeof playerHistory !== 'undefined' && playerHistory.s1) {
      playerHistory.s1 = {
        learners: '',
        issue: '',
        goal: '',
        interaction: '',
        constraints: '',
        assembled: ''
      };
    }

    document.body.classList.remove('s1-result-active');
    document.body.classList.add('s1-active');

    document.querySelectorAll('.tab-btn').forEach((b, idx) => {
      b.classList.toggle('active', idx === 0);
      b.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    });

    const attNum = document.getElementById('attNum');
    if (attNum) attNum.textContent = '0';

    window.scenarioIntroEnabled = true;
    if (Array.isArray(navCardShown)) navCardShown[SCENARIO_INDEX.ENGAGEMENT] = false;

    loadScenario(SCENARIO_INDEX.ENGAGEMENT);

    setTimeout(() => {
      pcFillS1DevFields();
    }, 120);
  }

window.pcClearVNStateForScenarioSwitch = pcClearVNStateForScenarioSwitch;
window.pcFillS1DevFields = pcFillS1DevFields;
window.resetS1Dev = resetS1Dev;
try { resetS1Dev = window.resetS1Dev; } catch(e) {}

function prepareScenarioShell(index) {
  const scenario = scenarios[index];
  const ui = getScenarioUI(index);

  document.body.classList.remove('s1-active', 's1-result-active', 's2-active', 's2-submitted');
  document.body.classList.toggle('s1-active', index === SCENARIO_INDEX.ENGAGEMENT && ui.implemented);
  document.body.classList.toggle('s2-active', index === SCENARIO_INDEX.METACOGNITION && ui.implemented);

  const scenarioText = document.getElementById('scenarioText');
  const boardText = document.getElementById('vnBoardText');
  const chat = document.getElementById('chat');
  const boardLoading = document.getElementById('vnBoardLoading');
  const boardImage = document.getElementById('vnBoardImg');

  if (scenarioText) scenarioText.textContent = scenario.desc;
  if (boardText) boardText.textContent = ui.boardText || scenario.desc;
  if (chat) chat.innerHTML = '';
  if (boardLoading) boardLoading.style.display = 'none';

  renderOSCQR(scenario.oscqr || [], []);

  if (ui.implemented) {
    loadSceneImage(ASSETS.images.scenes[index], LEGACY_ASSETS.images.scenes[index]);
  } else if (boardImage) {
    boardImage.src = '';
    boardImage.classList.remove('loaded');
  }

  const sceneBackground = document.getElementById('vnSceneBg');
  if (sceneBackground) pcSetImageSource(sceneBackground, ASSETS.images.backgrounds.classroom, LEGACY_ASSETS.images.backgrounds.classroom);
}


function renderScenarioInput(index) {
  const ui = getScenarioUI(index);
  const container = document.getElementById('inputContainer');
  if (!container) return;

  if (!ui.implemented) {
    renderScenarioPlaceholder(index);
    return;
  }

  renderInputMode(index);
  setScenarioInputVisible(ui.inputVisible);
}


function runScenarioSetup(index) {
  // Scenario-specific setup functions will be added back one scenario at a time.
  return getScenarioUI(index).implemented;
}


function loadScenario(i) {
  const index = Number(i);
  if (!Number.isInteger(index) || !scenarios[index]) return;
  prepareScenarioShell(index);
  renderScenarioInput(index);
  if (getScenarioUI(index).implemented) runScenarioSetup(index);
}


// ══════════════════════════════════════════════════════
//  OSCQR
// ══════════════════════════════════════════════════════
function renderOSCQR(indicators, active) {
  document.getElementById('oscqrChips').innerHTML = indicators.map(ind =>
    `<span class="oscqr-chip ${active.includes(ind.id) ? 'active' : ''}">${ind.label}</span>`
  ).join('');
}

function detectOSCQR(text, indicators) {
  return indicators.filter(ind =>
    text.toLowerCase().includes(ind.label.toLowerCase().split(' ')[0]) ||
    text.toLowerCase().includes(ind.label.toLowerCase())
  ).map(i => i.id);
}

// ══════════════════════════════════════════════════════
//  CHAT MESSAGES
// ══════════════════════════════════════════════════════
function addMsg(role, html, pixelExpr) {
  const area = document.getElementById('chat');
  const wrap = document.createElement('div');
  wrap.className = `message ${role}`;
  const isUser = role === 'user';
  const isClaude = role === 'claude';

  const initials = getInitials(playerName);
  const hasName = playerName !== 'You';
  const avatarHTML = isUser
    ? `<div class="avatar user-av${hasName ? ' has-name' : ''}" aria-hidden="true">${initials}</div>`
    : isClaude
      ? `<div class="claude-avatar" aria-hidden="true">⌘</div>`
      : pixelAvatarHTML(pixelExpr || 'neutral');

  const senderLabel = isUser ? playerName : isClaude ? 'Claude' : 'Professor Pixel';

  wrap.innerHTML = `
    ${avatarHTML}
    <div class="bubble-wrap">
      <div class="bubble-sender">${senderLabel}</div>
      <div class="bubble">${html}</div>
    </div>`;
  area.appendChild(wrap);
  // Only scroll to bottom for user messages -- AI/Claude messages handled by caller
  if (isUser) area.scrollTop = area.scrollHeight;
  return wrap;
}

function addTyping() {
  const area = document.getElementById('chat');
  const wrap = document.createElement('div');
  wrap.className = 'message ai';
  wrap.id = 'typing';
  const src = PIXEL_EXPR.thinking;
  wrap.innerHTML = `
    <img class="pixel-chat-avatar" src="${src}" alt="Professor Pixel thinking"
         onerror="this.outerHTML='<div class=\\'pixel-chat-avatar-fallback\\'>🧑‍🏫</div>'" />
    <div class="bubble-wrap">
      <div class="bubble-sender">Professor Pixel</div>
      <div class="bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>
    </div>`;
  area.appendChild(wrap);
  area.scrollTop = area.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

// ══════════════════════════════════════════════════════
//  SCAFFOLDED INPUT SYSTEM
// ══════════════════════════════════════════════════════

// Tracks what the player wrote across scenarios for memory hints
const playerHistory = {
  s1: { learners: '', goal: '', constraints: '', assembled: '' }
};

// Hint chip definitions for Scenario 2

// Render the correct input mode for the current scenario
function renderInputMode(idx) {
  const container = document.getElementById('inputContainer');
  if (!container) return;
  container.classList.remove('s1-workbench');

  if (idx === SCENARIO_INDEX.ENGAGEMENT) {
    renderGuidedBuilder(container);
    return;
  }

  if (idx === SCENARIO_INDEX.METACOGNITION) {
    renderS2Standby(container);
    return;
  }

  renderScenarioPlaceholder(idx);
}




// ── MODE 3: OPEN WITH MEMORY HINT (Scenario 3) ───────


// ── MODE 4: PLAIN OPEN (Scenario 4 + skip target) ────

// ── UNIFIED SEND ENTRY POINT ──────────────────────────
// Guard state keeps the VN prediction prompt from reopening or re-submitting
// while Claude is already processing. Without this, the VN click handler can
// turn one prompt into a tiny haunted carousel.
let predictionGateActive = false;
let isSubmittingToClaude = false;

// ══════════════════════════════════════════════════════
//  SEND
// ══════════════════════════════════════════════════════
async function send() {
  if (scenarioIndex === SCENARIO_INDEX.ENGAGEMENT && typeof sendGuided === 'function') {
    return sendGuided();
  }
  return false;
}


async function sendMain(text) {
  if (!text || isSubmittingToClaude) return;
  if (scenarioIndex !== SCENARIO_INDEX.ENGAGEMENT || !getScenarioUI(scenarioIndex).implemented) return;

  isSubmittingToClaude = true;
  attempts++;
  lastPromptText = text;
  const attEl = document.getElementById('attNum');
  if (attEl) attEl.textContent = attempts;

  history.push({ role: 'user', content: text });
  const btn = document.getElementById('sendBtn');
  if (btn) btn.disabled = true;
  addTyping();

  try {
    const data = await callClaude({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: scenarios[SCENARIO_INDEX.ENGAGEMENT].system,
      messages: history
    }, 'main');
    removeTyping();

    if (data.error) {
      addMsg('ai', `<span style="color:var(--red)">Error: ${esc(data.error.message || 'Claude request failed.')}</span>`);
      return;
    }

    const reply = data.content?.[0]?.text || '';
    history.push({ role: 'assistant', content: reply });

    const score = scorePrompt(text);
    const active = detectOSCQR(reply, scenarios[SCENARIO_INDEX.ENGAGEMENT].oscqr);
    renderOSCQR(scenarios[SCENARIO_INDEX.ENGAGEMENT].oscqr, active);
    trackPrompt(SCENARIO_INDEX.ENGAGEMENT, text, score.total, reply, active.map(id => {
      const indicator = scenarios[SCENARIO_INDEX.ENGAGEMENT].oscqr.find(item => item.id === id);
      return indicator ? indicator.label : id;
    }));

    gainXP(score.total * 6);
    lastScore = score.total;
    showClaudeFinalResponseInTerminal(reply, !!data.mock, () => {
      addS1ClaudeResultCard(reply);
      showS1PostAnalysisReflection(score.total);
    }, score.total);
  } catch (error) {
    removeTyping();
    addMsg('ai', `<span style="color:var(--red)">Something went wrong. Please try again.</span>`);
  } finally {
    isSubmittingToClaude = false;
    predictionGateActive = false;
    const btn = document.getElementById('sendBtn');
    if (btn) btn.disabled = false;
  }
}

// ══════════════════════════════════════════════════════
function scorePrompt(text) {
  const value = String(text || '');
  const t = value.toLowerCase();
  const hasLearners = /\b(student|learner|online|class|course|first-year|gen ed|general education|college|higher ed|adult|cohort|asynchronous)\b/.test(t);
  const hasGoal = /\b(one.sentence|surface|shallow|dead|generic|conversation dies|do not build|not build|weak|low.quality|low quality|reply|replies|engagement problem)\b/.test(t);
  const hasContext = /\b(compare|contrast|respond|reply|peer|build|question|evidence|example|explain|reason|connect|agree|disagree|extend|substantive|follow.up|follow-up)\b/.test(t);
  const hasConstraint = /\b(asynchronous|online|week|weekly|reply|replies|peer|two|2|word|minute|lms|canvas|no extra|low.tech|format|deadline|by)\b/.test(t) || /\d+/.test(t);
  const isDetailed = /\b(success|criteria|strong response|strong post|substantive|meaningful|evidence|example|explain|reasoning|rubric|quality|must include|should include)\b/.test(t) || value.length > 220;
  return { hasLearners, hasGoal, hasContext, hasConstraint, isDetailed,
    total: [hasLearners, hasGoal, hasContext, hasConstraint, isDetailed].filter(Boolean).length };
}


function buildFeedback(score) {
  const items = [
    { key:'hasLearners', label:'Learner/course context' },
    { key:'hasGoal', label:'Names the failure' },
    { key:'hasContext', label:'Interaction plan' },
    { key:'hasConstraint', label:'Constraints' },
    { key:'isDetailed', label:'Success criteria' }
  ];
  const chips = items.map(item =>
    `<span class="score-chip ${score[item.key] ? 'good' : 'needs'}">${score[item.key] ? '✓' : '+'} ${item.label}</span>`
  ).join('');
  const tips = [];
  if (!score.hasLearners) tips.push('Name the learners and course setting so Claude knows who the discussion is for');
  if (!score.hasGoal) tips.push('Tell Claude what is wrong with the original prompt');
  if (!score.hasContext) tips.push('Specify the interaction move students should use');
  if (!score.hasConstraint) tips.push('Add asynchronous, reply, time, word-count, or LMS constraints');
  if (!score.isDetailed) tips.push('Define what a stronger student reply should include');
  const result = tips.length
    ? `<ul class="fp-tips">${tips.map(tip => `<li>${tip}</li>`).join('')}</ul>`
    : `<p class="fp-success">Strong repair prompt. It connects the AI request to the actual discussion-board failure.</p>`;
  return `<div class="feedback-panel"><div class="fp-header">Discussion Repair Analysis</div><div class="fp-body"><div class="score-chips">${chips}</div>${result}</div></div>`;
}


// ══════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════
function cleanS1ClaudeDraft(text) {
  return String(text || '')
    .replace(/^#{1,3}\s*Revised Discussion Prompt\s*/i, '')
    .replace(/^Revised Discussion Prompt\s*/i, '')
    .replace(/^Here's your redesigned discussion prompt:\s*/i, '')
    .replace(/^\s*---+\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function esc(t) {
  return String(t ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Minimal markdown formatter used by result cards and legacy chat bubbles.
// Claude's cleanup removed this helper, which made Consult Claude crash after the mock response returned.
function fmt(text) {
  return esc(String(text ?? ''))
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

function autoGrow(el) {
  if (!el) return;
  el.style.height = 'auto';

  const cap = el.id && el.id.startsWith('g-') ? 190 : 130;
  el.style.height = Math.min(el.scrollHeight, cap) + 'px';
}

function gainXP(amount) {
  xp = Math.min(100, xp + amount);
  document.getElementById('xpFill').style.width = xp + '%';
  document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', Math.round(xp));
  if (xp >= 40) document.getElementById('levelTag').textContent = 'lead educator · developing';
  if (xp >= 75) document.getElementById('levelTag').textContent = 'master prompter · proficient';
}

// ══════════════════════════════════════════════════════
//  COMPLETION
// ══════════════════════════════════════════════════════
function markScenarioComplete() {
  if (!getScenarioUI(scenarioIndex).implemented) return;
  scenarioCompleted[scenarioIndex] = true;
  saveIncrementalData(scenarioIndex);

  const area = document.getElementById('chat');
  if (!area) return;
  if (document.querySelector('.s1-scenario-complete-note')) return;

  playSound('scenarioComplete');
  pixelBadgeSetExpr('encouraging');
  const div = document.createElement('div');
  div.className = 's1-scenario-complete-note';
  div.innerHTML = `<p>Scenario 1 complete. The remaining scenarios are being rebuilt one at a time from clean development shells.</p>`;
  area.appendChild(div);
}


// ══════════════════════════════════════════════════════
//  REFLECTION ROOM
// ══════════════════════════════════════════════════════
function openReflection() {
  autoSaveSession('reflection_room_opened');
  playSound('reflectionOpen');
  document.getElementById('reflectionOverlay').classList.add('visible');
}

function closeReflection() {
  document.getElementById('reflectionOverlay').classList.remove('visible');
}

async function handleReflectionSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('refSubmitBtn');
  btn.disabled = true;
  btn.textContent = 'Submitting...';

  const formData = new FormData(e.target);

  // ── QUALTRICS MODE ─────────────────────────────────
  if (SURVEY_MODE === 'qualtrics') {
    window.open(QUALTRICS_URL, '_blank', 'noopener');
    document.getElementById('refForm').style.display = 'none';
    document.getElementById('refSuccess').style.display = 'block';
    return;
  }

  // ── GOOGLE SHEETS MODE ─────────────────────────────
  if (SURVEY_MODE === 'sheets') {
    if (!SHEETS_URL || SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      alert('Google Sheets URL is not configured yet. Check SHEETS_URL in the script.');
      btn.disabled = false;
      btn.textContent = 'Submit Reflection';
      return;
    }
    try {
      const payload = buildSessionPayload(formData);
      console.log('[PromptCraft] Submitting full session payload:', payload);

      await postToSheets(payload, 'full session payload');
      console.log('[PromptCraft] Sheets submission sent');
    } catch(err) {
      console.warn('[PromptCraft] Sheets submission error:', err);
    }

    // Always also submit to Netlify Forms as a backup
    // This ensures data is never lost even if Sheets fails silently
    try {
      const netlifyData = new URLSearchParams();
      netlifyData.append('form-name', 'promptcraft-reflection');
      formData.forEach((v, k) => netlifyData.append(k, v));
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: netlifyData.toString()
      });
      console.log('[PromptCraft] Netlify fallback sent');
    } catch(err) {
      // Netlify fallback is best-effort -- Sheets is the primary
    }

    // Show success + trigger growth report generation
    document.getElementById('refForm').style.display = 'none';
    document.getElementById('refSuccess').style.display = 'block';

    // Generate AI growth narrative asynchronously
    const reflAnswers = {
      q1: formData.get('q1_surprise') || '',
      q2: formData.get('q2_change')   || '',
      q3: formData.get('q3_practice') || '',
      q4: formData.get('q4_other')    || '',
    };
    generateGrowthReport(reflAnswers).then(narrative => {
      const el = document.getElementById('growthNarrative');
      if (el && narrative) el.innerHTML = narrative.replace(/\n/g, '<br>');
      const g = buildGrowthScores();
      const tableEl = document.getElementById('growthTable');
      if (tableEl) tableEl.innerHTML = buildGrowthTableHTML(g);
      // Append growth data to payload and re-submit (best-effort)
      if (narrative) {
        const growthPayload = Object.assign(buildSessionPayload(formData), {
          ai_narrative: narrative,
          growth_json: JSON.stringify({
            trajectory: g.trajectory,
            avg: (g.trajectory.reduce((a,b)=>a+b,0)/8).toFixed(2),
            delta: g.delta,
            threshold_met: g.threshold_met,
            s5_caught: g.s5_caught,
            s6_predicted: g.s6_predicted,
            s7_correct: g.s7_correct,
          }),
        });
        postToSheets(growthPayload, 'growth follow-up payload').catch(() => {});
      }
    });
    return;
  }

  // ── NETLIFY FORMS MODE (fallback) ──────────────────
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    });
    if (res.ok) {
      document.getElementById('refForm').style.display = 'none';
      document.getElementById('refSuccess').style.display = 'block';
      // Generate growth report even in netlify mode
      const rfAnswers = { q1: formData.get('q1_surprise')||'', q2: formData.get('q2_change')||'', q3: formData.get('q3_practice')||'', q4: formData.get('q4_other')||'' };
      generateGrowthReport(rfAnswers).then(narrative => {
        const el = document.getElementById('growthNarrative');
        if (el && narrative) el.innerHTML = narrative.replace(/\n/g, '<br>');
        const g = buildGrowthScores();
        const tableEl = document.getElementById('growthTable');
        if (tableEl) tableEl.innerHTML = buildGrowthTableHTML(g);
      });
    } else {
      btn.disabled = false;
      btn.textContent = 'Submit Reflection';
      alert('Something went wrong. Please try again.');
    }
  } catch(err) {
    btn.disabled = false;
    btn.textContent = 'Submit Reflection';
    alert('Could not submit. Check your connection and try again.');
  }
}


// ══════════════════════════════════════════════════════
//  S1 WORKBENCH — final owner
//  renderGuidedBuilder, onGuidedInput, sendGuided,
//  addS1ClaudeResultCard, showS1ResultControls, reviseS1,
//  and all S1 guided builder helpers.
//  These supersede the earlier definitions above.
// ══════════════════════════════════════════════════════
const S1_STORAGE_KEY = 'promptcraft_s1_clean_draft';

function getS1GuidedValues(){
  return {
    learners: (document.getElementById('g-learners')?.value || '').trim(),
    issue: (document.getElementById('g-issue')?.value || '').trim(),
    interaction: (document.getElementById('g-interaction')?.value || '').trim(),
    constraints: (document.getElementById('g-constraints')?.value || '').trim()
  };
};

function saveS1Draft(values){
  window.playerHistory = window.playerHistory || {};
  window.playerHistory.s1 = Object.assign({}, values || getS1GuidedValues());
  try { localStorage.setItem(S1_STORAGE_KEY, JSON.stringify(window.playerHistory.s1)); } catch(e) {}
};

function restoreS1DraftToFields(){
  [['g-learners','learners'],['g-issue','issue'],['g-interaction','interaction'],['g-constraints','constraints']].forEach(([id,key]) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = '';
      if (typeof autoGrow === 'function') autoGrow(el);
    }
  });

  if (typeof onGuidedInput === 'function') {
    onGuidedInput(document.getElementById('g-learners'));
  }
};

function analyzeS1Guided(values){
  const allText = `${values.learners} ${values.issue} ${values.interaction} ${values.constraints}`.toLowerCase();
  return {
    audience: values.learners.length > 12 || /student|learner|class|course|online|first-year|adult|faculty|cohort|gen ed|general education|asynchronous/.test(allText),
    issue: values.issue.length > 12 || /one.sentence|one sentence|surface|shallow|dead|not build|do not build|generic|reply|replies|conversation|dies|stops|weak|required/.test(allText),
    interaction: values.interaction.length > 12 || /compare|contrast|respond|reply|peer|build|question|evidence|example|explain|reason|connect|disagree|agree|extend|challenge|follow/.test(allText),
    constraints: values.constraints.length > 8 || /minute|week|reply|peer|two|2|asynchronous|format|word|time|low tech|no extra|lms|canvas|deadline/.test(allText),
    success: /substantive|meaningful|evidence|example|build|criteria|reason|explain|success|quality|rubric|strong|specific|follow.up|follow-up|extend|challenge/.test(allText)
  };
};

function buildS1MissionHTML(){
  return buildScenarioMissionHTML(SCENARIO_INDEX.ENGAGEMENT, { className: 's1-clean-mission' });
}

function buildS1LeftHTML(){
  return `
    <div class="s1-clean-left">
      <section class="s1-clean-card" aria-label="Faculty submission">
        <div class="s1-clean-eyebrow">Faculty Submission</div>
        <div class="s1-clean-title">Current Discussion Prompt</div>
        <div class="s1-clean-prompt">
          What did you think about this week's reading?<br><br>
          Reply to at least two classmates.
        </div>
        <div class="s1-clean-title" style="font-size:0.98rem;margin-bottom:7px;">Observed Problems</div>
        <div class="s1-clean-observed">
          <div><strong>Post quality:</strong> Mostly one-sentence reactions.</div>
          <div><strong>Peer replies:</strong> Feel required, not conversational.</div>
          <div><strong>Conversation:</strong> Rarely continues beyond one exchange.</div>
        </div>
        <div class="s1-clean-ingredients" aria-label="Prompt ingredients checklist">
          <div class="ingredient-heading">Prompt Ingredients</div>
          <div class="ingredient-row">
            <span class="ingredient-chip" id="ing-audience">Audience</span>
            <span class="ingredient-chip" id="ing-goal">Problem</span>
            <span class="ingredient-chip" id="ing-context">Interaction Move</span>
            <span class="ingredient-chip" id="ing-constraints">Constraints</span>
            <span class="ingredient-chip" id="ing-success">Success Criteria</span>
          </div>
        </div>
      </section>
    </div>`;
}

function buildS1RightHTML(){
  return `
    <div class="s1-clean-right">
      <section class="s1-clean-builder" aria-label="Repair workspace">
        <div class="s1-clean-builder-head">
          <div>
            <div class="s1-clean-builder-title">Repair Workspace</div>
            <div class="s1-clean-builder-sub">Give Claude the information it needs to repair the actual teaching problem, not just make a prettier prompt.</div>
          </div>
        </div>
        <div class="s1-clean-fields">
          <div class="s1-clean-field">
            <label class="s1-clean-label" for="g-learners"><span class="s1-clean-num">1</span>Learners + course</label>
            <textarea class="s1-clean-textarea" id="g-learners" rows="3" placeholder="Who are these students? What kind of course is this?" oninput="onGuidedInput(this)" aria-label="Describe learners and course"></textarea>
          </div>
          <div class="s1-clean-field">
            <label class="s1-clean-label" for="g-issue"><span class="s1-clean-num">2</span>What is failing?</label>
            <textarea class="s1-clean-textarea" id="g-issue" rows="3" placeholder="What exactly is going wrong in the discussion?" oninput="onGuidedInput(this)" aria-label="Describe the discussion problem"></textarea>
          </div>
          <div class="s1-clean-field">
            <label class="s1-clean-label" for="g-interaction"><span class="s1-clean-num">3</span>Interaction move</label>
            <textarea class="s1-clean-textarea" id="g-interaction" rows="3" placeholder="How should students build on, challenge, compare, or extend peer ideas?" oninput="onGuidedInput(this)" aria-label="Describe the interaction move"></textarea>
          </div>
          <div class="s1-clean-field">
            <label class="s1-clean-label" for="g-constraints"><span class="s1-clean-num">4</span>Constraints + success criteria</label>
            <textarea class="s1-clean-textarea" id="g-constraints" rows="3" placeholder="What limits matter? What should a strong reply include?" oninput="onGuidedInput(this)" aria-label="Describe constraints and success criteria"></textarea>
          </div>
        </div>
        <div class="s1-clean-actions">
          <div class="s1-clean-nudge" id="s1BuilderNudge"></div>
          <button class="s1-clean-submit" id="sendBtn" type="button" onclick="sendGuided()">Consult Claude →</button>
        </div>
      </section>
    </div>`;
}

function renderGuidedBuilder(container){
  if (!container) container = document.getElementById('inputContainer');
  if (!container) return;
  document.body.classList.add('s1-active');
  document.body.classList.remove('s1-result-active');
  container.className = 's1-clean-workbench';
  container.style.display = 'flex';
  container.innerHTML = `
    <div class="s1-clean-stage">
      ${buildS1MissionHTML()}
      <div class="s1-clean-grid">
        ${buildS1LeftHTML()}
        ${buildS1RightHTML()}
      </div>
    </div>`;
  restoreS1DraftToFields();
  setTimeout(() => document.getElementById('g-learners')?.focus(), 60);
};

function onGuidedInput(el){
  if (el && typeof autoGrow === 'function') autoGrow(el);
  const values = getS1GuidedValues();
  saveS1Draft(values);
  const checks = analyzeS1Guided(values);
  const ingredientChecks = {
    audience: checks.audience,
    goal: checks.issue,
    context: checks.interaction,
    constraints: checks.constraints,
    success: checks.success
  };
  Object.entries(ingredientChecks).forEach(([key, covered]) => {
    const chip = document.getElementById(`ing-${key}`);
    if (!chip) return;
    chip.classList.toggle('covered', !!covered);
    chip.setAttribute('aria-label', `${chip.textContent} — ${covered ? 'covered' : 'not yet covered'}`);
  });
  const missing = [];
  if (!checks.issue) missing.push('name the specific failure');
  if (!checks.interaction) missing.push('define how students should respond to one another');
  if (!checks.success) missing.push('say what a stronger reply should include');
  const nudge = document.getElementById('s1BuilderNudge');
  if (nudge) {
    if (missing.length >= 2) {
      nudge.style.display = 'block';
      nudge.innerHTML = `<strong>Pixel's nudge:</strong> ${missing.join('; ')}.`;
    } else {
      nudge.style.display = 'none';
      nudge.innerHTML = '';
    }
  }
};

function buildS1AssembledPrompt(values){
  const parts = [
    `I need help fixing this weak asynchronous discussion prompt: "What did you think about this week's reading? Reply to at least two classmates."`
  ];
  if (values.learners) parts.push(`Learners and course context: ${values.learners}.`);
  if (values.issue) parts.push(`The current problem is: ${values.issue}.`);
  if (values.interaction) parts.push(`Redesign the discussion so students: ${values.interaction}.`);
  if (values.constraints) parts.push(`Constraints and success criteria: ${values.constraints}.`);
  parts.push('Create a revised student-facing discussion prompt. Keep it practical for an asynchronous online course. Briefly explain how the revision addresses the original problem of surface-level replies.');
  return parts.join(' ');
};

function sendGuided(){
  const values = getS1GuidedValues();
  saveS1Draft(values);
  const checks = analyzeS1Guided(values);
  const missing = [];
  if (!checks.audience) missing.push('audience/course');
  if (!checks.issue) missing.push('problem diagnosis');
  if (!checks.interaction) missing.push('interaction move');
  if (!checks.constraints) missing.push('constraints');
  if (!checks.success) missing.push('success criteria');
  if (missing.length >= 3) {
    const nudge = document.getElementById('s1BuilderNudge');
    if (nudge) {
      nudge.style.display = 'block';
      nudge.innerHTML = `<strong>Before we ask Claude:</strong> Add more detail for ${missing.join(', ')}.`;
    }
    const focusMap = { 'audience/course':'g-learners', 'problem diagnosis':'g-issue', 'interaction move':'g-interaction', 'constraints':'g-constraints', 'success criteria':'g-constraints' };
    document.getElementById(focusMap[missing[0]])?.focus();
    return;
  }
  sendText(buildS1AssembledPrompt(values));
};

function buildS1TerminalDiagnosis(score, responseText){
  const values = getS1GuidedValues();
  const checks = analyzeS1Guided(values);
  const level = score <= 2 ? 'NEEDS MORE CONTEXT' : score <= 3 ? 'PARTIAL REPAIR DETECTED' : score <= 4 ? 'STRONG REPAIR DETECTED' : 'HIGH-CONFIDENCE REPAIR';
  const missing = [];
  if (!checks.audience) missing.push('learner context');
  if (!checks.issue) missing.push('problem diagnosis');
  if (!checks.interaction) missing.push('interaction strategy');
  if (!checks.constraints) missing.push('constraints');
  if (!checks.success) missing.push('success criteria');
  const issue = 'Students are replying because the prompt requires replies, but the prompt does not create a reason to continue the conversation.';
  const repair = missing.length
    ? `Strengthen: ${missing.join(', ')}.`
    : 'Require students to extend, challenge, compare, or build on a peer\'s idea using evidence or reasoning.';
  const confidence = score <= 2 ? 'LOW' : score <= 3 ? 'MODERATE' : 'HIGH';
  return `STATUS\n${level}\n\nISSUE DETECTED\n${issue}\n\nRECOMMENDED REPAIR\n${repair}\n\nCONFIDENCE\n${confidence}`;
};

function addS1ClaudeResultCard(responseText){
  document.body.classList.add('s1-result-active');
  const area = document.getElementById('chat');
  if (!area) return null;
  area.innerHTML = '';
  const values = (window.playerHistory && window.playerHistory.s1) || getS1GuidedValues();
  const card = document.createElement('div');
  card.className = 's1-result-card s1-result-card-focused';
  card.innerHTML = `
    <div class="s1-result-eyebrow">Claude Draft</div>
    <div class="s1-result-title">Revised Discussion Prompt</div>
    <div class="s1-result-content-box">
      <div class="s1-result-body">${fmt(cleanS1ClaudeDraft(responseText))}</div>
      <div class="s1-clean-reference">
        <div class="s1-clean-reference-title">Your Repair Notes</div>
        <div><strong>Learners:</strong> ${esc(values.learners || 'Not provided')}</div>
        <div><strong>Problem:</strong> ${esc(values.issue || 'Not provided')}</div>
        <div><strong>Interaction:</strong> ${esc(values.interaction || 'Not provided')}</div>
        <div><strong>Constraints:</strong> ${esc(values.constraints || 'Not provided')}</div>
      </div>
    </div>`;
  area.appendChild(card);
  try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch(e) { window.scrollTo(0, 0); }
  area.scrollTop = 0;
  requestAnimationFrame(() => {
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch(e) { window.scrollTo(0, 0); }
    try { area.scrollTop = 0; } catch(e) {}
  });
  return card;
};

function showS1ResultControls(scoreTotal, mode = 'postReflection'){
  const container = document.getElementById('inputContainer');
  if (!container) return;
  const thresholdMet = scoreTotal >= SCORE_THRESHOLD;
  const reviewMode = mode === 'review';
  container.className = '';
  container.style.display = 'block';
  container.innerHTML = `
    <div class="s1-result-controls" role="region" aria-label="Scenario 1 result options">
      <div>
        <div class="s1-result-controls-title">Scenario 1 result</div>
        <div class="s1-result-controls-sub">${reviewMode ? `Claude's draft is shown above. Review the analysis before Pixel explains what changed.` : `Pixel's explanation is complete. Choose the next step.`}</div>
      </div>
      <div class="s1-result-controls-actions">
        <button class="s1-secondary-btn" type="button" onclick="reviseS1()">Revise S1</button>
        ${reviewMode
          ? `<button class="continue-btn" type="button" onclick="showS1PostAnalysisReflection(${Number(scoreTotal) || 0})">Continue with Pixel →</button>`
          : (thresholdMet ? `<button class="continue-btn" type="button" onclick="navigateToNext(1)">Next scenario →</button>` : `<button class="continue-btn" type="button" onclick="reviseS1()">Strengthen and try again</button>`)}
      </div>
    </div>`;
};

function showS1PostAnalysisReflection(scoreTotal){
  // Robust S1 handoff: Claude terminal/result page -> Professor Pixel VN review.
  // This deliberately clears every prediction/Claude wait flag so vnAdvance is not blocked.
  try {
    window.pcWaitingForClaudeContinue = false;
    window.predictionGateActive = false;
    window.isSubmittingToClaude = false;
    document.getElementById('pcContinueToClaudeBtn')?.remove();
    stopClaudeTTS?.();
  } catch(e) {}

  const overlay = document.getElementById('vnOverlay');
  const dialogue = document.getElementById('vnDialogue');
  const speaker = document.getElementById('vnSpeaker');
  const text = document.getElementById('vnText');
  const hint = document.getElementById('vnAdvanceHint');
  const character = document.getElementById('vnCharacter');

  if (overlay) {
    overlay.classList.remove(
      'claude-consult',
      'claude-terminal-consult',
      'claude-terminal-textmode',
      'claude-analysis',
      'claude-prediction',
      'pc-clean-prediction',
      'pc-clean-output',
      'pc-prediction-result'
    );
    overlay.classList.add('active');
    overlay.removeAttribute('aria-hidden');
  }

  if (dialogue) {
    dialogue.classList.remove('has-choices');
    dialogue.style.display = '';
  }
  if (speaker) speaker.textContent = 'Professor Pixel';
  if (text) text.innerHTML = '';
  if (hint) hint.classList.remove('show');
  if (character) character.classList.add('visible');

  try { setVNClaudeMode(false); } catch(e) {}
  try { setVNClaudeTerminalMode(false); } catch(e) {}
  try { setClaudeTerminalTextMode(false); } catch(e) {}
  try { setClaudeShelfState('idle', 'idle'); } catch(e) {}

  try { clearTimeout(vnTypeTimer); } catch(e) {}
  try { vnQueue = []; } catch(e) {}
  vnOnComplete = null;
  vnTyping = false;
  vnFullText = '';
  vnCurrentText = '';

  // Use a short, explicit S1 review instead of relying only on the generic score
  // reflection. This is the missing bridge between Claude's diagnostic and the
  // final result controls.
  const lines = [
    {
      expr: 'encouraging',
      text: "Now we have something useful. Claude found that the original prompt was not broken because students ignored it. It was broken because students were doing exactly what it asked."
    },
    {
      expr: 'thinking',
      text: "That is the design problem: compliance is not the same thing as interaction. A reply requirement can create activity without creating a reason to continue the conversation."
    },
    {
      expr: scoreTotal >= SCORE_THRESHOLD ? 'proud' : 'encouraging',
      text: scoreTotal >= SCORE_THRESHOLD
        ? "Your revision gives students a clearer interaction move, a purpose for replying, and criteria for what a stronger response should include. That is a real repair, not just prettier wording."
        : "Your revision is moving in the right direction. Before moving on, strengthen the prompt so students know how to extend, challenge, compare, or build on a peer's idea."
    }
  ];

  lines.forEach((line, idx) => {
    const isLast = idx === lines.length - 1;
    vnShow(line.expr, line.text, isLast ? () => {
      if (scoreTotal >= SCORE_THRESHOLD) markScenarioComplete();
      showS1ResultControls(scoreTotal, 'postReflection');
    } : null);
  });
}
window.showS1PostAnalysisReflection = showS1PostAnalysisReflection;

window.reviseS1 = reviseS1 = function reviseS1(){
  const saved = Object.assign(
    {},
    JSON.parse((() => { try { return localStorage.getItem('promptcraft_s1_clean_draft') || '{}'; } catch(e) { return '{}'; } })()),
    window.playerHistory?.s1 || {}
  );

  const area = document.getElementById('chat');
  if (area) area.innerHTML = '';

  document.body.classList.remove('s1-result-active');
  document.body.classList.add('s1-active');

  renderGuidedBuilder(document.getElementById('inputContainer'));

  setTimeout(() => {
    [
      ['g-learners', 'learners'],
      ['g-issue', 'issue'],
      ['g-interaction', 'interaction'],
      ['g-constraints', 'constraints']
    ].forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) {
        el.value = saved[key] || '';
        if (typeof autoGrow === 'function') autoGrow(el);
      }
    });

    if (typeof onGuidedInput === 'function') {
      onGuidedInput(document.getElementById('g-learners'));
    }

    document.getElementById('g-learners')?.focus();
  }, 100);
};

function showPixelScoreReflection(totalScore, onDone = null) {
  const dialogue = document.getElementById('vnDialogue');
  if (dialogue) dialogue.classList.remove('has-choices');
  const speaker = document.getElementById('vnSpeaker');
  if (speaker) speaker.textContent = 'Professor Pixel';
  const overlay = document.getElementById('vnOverlay');
  if (overlay) {
    overlay.classList.remove('claude-consult','claude-terminal-consult','claude-terminal-textmode','claude-prediction','pc-clean-prediction','pc-clean-output','pc-prediction-result');
    overlay.classList.add('active');
  }
  const d = window.pixelDialogue;
  const lines = totalScore <= 1 ? d.scoreReflection_0_1
    : totalScore <= 2 ? d.scoreReflection_2
    : totalScore <= 3 ? d.scoreReflection_3
    : totalScore <= 4 ? d.scoreReflection_4
    : d.scoreReflection_5;
  (lines || []).forEach((line, idx) => vnShow(line.expr, line.text, idx === lines.length - 1 ? onDone : null));
}


// ══════════════════════════════════════════════════════
//  SEND + PREDICTION GATE — final owner
//  Authoritative, non-recursive implementation.
// ══════════════════════════════════════════════════════

const PC_PREDICTION_LABELS = {
  targeted: 'It will give a targeted response.',
  generic: 'It might still be generic.',
  ignores_constraints: 'It may ignore some constraints.',
  not_sure: 'I am not sure yet.'
};

const PC_PREDICTION_REACTIONS = {
  targeted: 'Good prediction. Now we will see whether Claude actually had enough context to stay specific.',
  generic: 'That is a reasonable suspicion. Generic input often produces generic output, because apparently machines also enjoy vague assignments.',
  ignores_constraints: 'Exactly the kind of risk worth watching for. Constraints only help when the model actually uses them.',
  not_sure: 'Fair. The whole point is to build that prediction muscle before trusting the output.'
};

function pcStopVN(){
  try { vnQueue = []; } catch(e) {}
  try { clearTimeout(vnTypeTimer); } catch(e) {}
  try { vnTyping = false; vnOnComplete = null; vnFullText = ''; vnCurrentText = ''; } catch(e) {}
}

function pcClearPredictionUI(){
  document.getElementById('predictionGate')?.remove();
  document.getElementById('vnPredictionChoicePanel')?.remove();
  document.querySelectorAll('.vn-choice-list,.vn-prediction-options,.pc-clean-choice-grid,.pc-choice-panel-final').forEach(el => el.remove());
}

function pcPredictionIsOpen(){
  const overlay = document.getElementById('vnOverlay');
  const text = (document.getElementById('vnText')?.textContent || '').toLowerCase();
  return !!(overlay && overlay.classList.contains('active') &&
    (overlay.classList.contains('claude-prediction') || overlay.classList.contains('pc-clean-prediction') || text.includes('what do you predict claude will do')));
}

function pcEnsurePredictionButtons(){
  if (!pcPredictionIsOpen()) return;
  if (window.pcWaitingForClaudeContinue) return;
  const prompt = window.pendingPromptForPrediction || window.pendingPromptAfterPrediction;
  if (!prompt) return;

  let panel = document.getElementById('vnPredictionChoicePanel');
  if (!panel) {
    const dialogue = document.getElementById('vnDialogue') || document.getElementById('vnText');
    if (!dialogue) return;
    panel = document.createElement('div');
    panel.id = 'vnPredictionChoicePanel';
    panel.className = 'pc-choice-panel-final';
    panel.setAttribute('role','group');
    panel.setAttribute('aria-label','Prediction choices');
    panel.innerHTML = Object.entries(PC_PREDICTION_LABELS).map(([choice,label]) =>
      `<button class="pc-clean-choice-btn" type="button" data-choice="${choice}">${label}</button>`
    ).join('');
    dialogue.appendChild(panel);
  }

  panel.querySelectorAll('button[data-choice]').forEach(btn => {
    if (btn.dataset.pcBound === '1') return;
    btn.dataset.pcBound = '1';
    btn.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      pcChoosePrediction(btn.dataset.choice);
    });
  });
}

function pcShowPredictionGate(text){
  if (!text) return false;

  window.pendingPromptForPrediction = text;
  window.pendingPromptAfterPrediction = '';
  window.pcWaitingForClaudeContinue = false;
  window.predictionGateActive = true;
  try { predictionGateActive = true; } catch(e) {}

  pcClearPredictionUI();
  pcStopVN();

  const overlay = document.getElementById('vnOverlay');
  if (overlay) {
    overlay.classList.remove('claude-consult','claude-terminal-consult','claude-terminal-textmode','claude-analysis','pc-clean-output','pc-prediction-result');
    overlay.classList.add('active','claude-prediction','pc-clean-prediction','pc-prediction-question');
  }

  const dialogue = document.getElementById('vnDialogue');
  if (dialogue) {
    dialogue.classList.add('has-choices','prediction-question');
    dialogue.classList.remove('prediction-result');
  }

  try { setVNClaudeMode(false); } catch(e) {}
  try { setVNClaudeTerminalMode(false); } catch(e) {}
  try { setClaudeTerminalTextMode(false); } catch(e) {}
  try { setClaudeShelfState('idle', 'awaiting prediction'); } catch(e) {}
  try { setClaudeTerminalState('idle', 'CLAUDE TERMINAL', 'AWAITING PREDICTION'); } catch(e) {}
  try { vnSetExpression('thinking'); } catch(e) {}
  try { musicStartVN(); } catch(e) {}

  const speaker = document.getElementById('vnSpeaker');
  if (speaker) speaker.textContent = 'Professor Pixel';

  const character = document.getElementById('vnCharacter');
  if (character) character.classList.add('visible');

  const hint = document.getElementById('vnAdvanceHint');
  if (hint) hint.classList.remove('show');

  const vnText = document.getElementById('vnText');
  if (vnText) {
    vnText.innerHTML = `
      <div class="pc-feedback-copy">
        <div><strong>Before we consult Claude...</strong></div>
        <div>Based on the context you gave, what do you predict Claude will do?</div>
      </div>`;
  }

  setTimeout(pcEnsurePredictionButtons, 0);
  setTimeout(pcEnsurePredictionButtons, 100);
  setTimeout(pcEnsurePredictionButtons, 350);
  setTimeout(() => dialogue?.focus(), 80);
  return false;
}

function pcChoosePrediction(choice){
  const text = window.pendingPromptForPrediction;
  if (!text || window.pcWaitingForClaudeContinue || window.isSubmittingToClaude || (typeof isSubmittingToClaude !== 'undefined' && isSubmittingToClaude)) return;

  window.pendingPromptAfterPrediction = text;
  window.pendingPromptForPrediction = '';
  window.pcWaitingForClaudeContinue = true;
  window.predictionGateActive = false;
  try { predictionGateActive = false; } catch(e) {}

  const s = scenarioData && scenarioData[scenarioIndex];
  if (s) {
    if (!s.predictions) s.predictions = [];
    const predictionRecord = { choice, label: pcFormatPredictionChoice(choice), prompt:text, attempt:(s.attempts || 0) + 1, timestamp:new Date().toISOString() };
    s.predictions.push(predictionRecord);
    s.prediction = choice;
    s.selfReportPrediction = pcFormatPredictionsForSave(s, scenarioIndex);
  }

  pcClearPredictionUI();

  const overlay = document.getElementById('vnOverlay');
  if (overlay) {
    overlay.classList.remove('pc-prediction-question');
    overlay.classList.add('pc-prediction-result');
  }

  const dialogue = document.getElementById('vnDialogue');
  if (dialogue) {
    dialogue.classList.remove('has-choices','prediction-question');
    dialogue.classList.add('prediction-result');
  }

  const reaction = (window.predictionReactions && window.predictionReactions[choice]) || PC_PREDICTION_REACTIONS[choice] || PC_PREDICTION_REACTIONS.not_sure;
  const vnText = document.getElementById('vnText');
  if (vnText) {
    vnText.innerHTML = `
      <div class="pc-feedback-copy">
        <div><strong>Your prediction is logged.</strong></div>
        <div>${reaction}</div>
        <button id="pcContinueToClaudeBtn" class="prediction-continue-btn" type="button">Continue to Claude →</button>
      </div>`;
    document.getElementById('pcContinueToClaudeBtn')?.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      pcContinueToClaudeAnalysis();
    });
  }
}

function pcContinueToClaudeAnalysis(){
  const text = window.pendingPromptAfterPrediction;
  if (!text || window.isSubmittingToClaude || (typeof isSubmittingToClaude !== 'undefined' && isSubmittingToClaude)) return false;

  window.pendingPromptAfterPrediction = '';
  window.pcWaitingForClaudeContinue = false;

  // IMPORTANT: show Claude's thinking screen immediately BEFORE the network/API call.
  // Previously this overlay did not appear until after Claude returned, which made the
  // game look frozen for 20-30 seconds. Tiny little UX crime scene.
  const overlay = document.getElementById('vnOverlay');
  if (overlay) {
    overlay.classList.remove(
      'claude-prediction',
      'pc-clean-prediction',
      'pc-prediction-question',
      'pc-prediction-result',
      'claude-terminal-textmode',
      'has-choices'
    );
    overlay.classList.add('active','claude-terminal-consult');
  }
  const dialogue = document.getElementById('vnDialogue');
  if (dialogue) dialogue.classList.remove('has-choices','prediction-question','prediction-result');
  document.getElementById('vnCharacter')?.classList.remove('visible');
  pcClearPredictionUI();

  const vnText = document.getElementById('vnText');
  if (vnText) vnText.innerHTML = '';

  try { showClaudeConsultOverlay('Scenario diagnosis'); } catch(e) {
    try {
      setVNClaudeMode(false);
      setVNClaudeTerminalMode(true);
      setClaudeTerminalTextMode(false);
      setClaudeShelfState('thinking','analyzing');
      setClaudeTerminalState('thinking','CLAUDE TERMINAL','ANALYZING...');
      renderClaudeAnalyzingReadout('Scenario diagnosis');
      musicStartVN();
    } catch(_) {}
  }

  sendMain(text);
  return false;
}

function sendText(text){
  if (!text || window.isSubmittingToClaude || (typeof isSubmittingToClaude !== 'undefined' && isSubmittingToClaude) || window.pcWaitingForClaudeContinue) return false;
  const btn = document.getElementById('sendBtn');
  if (btn) btn.disabled = true;
  return pcShowPredictionGate(text);
}

// Legacy names used by inline handlers and older patches. Keep all roads pointed
// at the non-recursive implementation above. Yes, this is ridiculous. It is also JavaScript.
var showPredictionGate = pcShowPredictionGate;
var choosePrediction = pcChoosePrediction;
var finalChoosePrediction = pcChoosePrediction;
var finalContinueToClaude = pcContinueToClaudeAnalysis;
var hardShowPredictionGate = pcShowPredictionGate;
var hardChoosePrediction = pcChoosePrediction;
var hardContinueToClaude = pcContinueToClaudeAnalysis;
var hardSendText = sendText;

window.pcShowPredictionGate = pcShowPredictionGate;
window.showPredictionGate = pcShowPredictionGate;
window.choosePrediction = pcChoosePrediction;
window.finalChoosePrediction = pcChoosePrediction;
window.pcContinueToClaudeAnalysis = pcContinueToClaudeAnalysis;
window.finalContinueToClaude = pcContinueToClaudeAnalysis;
window.hardShowPredictionGate = pcShowPredictionGate;
window.hardChoosePrediction = pcChoosePrediction;
window.hardContinueToClaude = pcContinueToClaudeAnalysis;
window.hardSendText = sendText;
window.sendText = sendText;
window.ensurePredictionButtons = pcEnsurePredictionButtons;

if (!window.__pcPredictionWatchdogBound) {
  window.__pcPredictionWatchdogBound = true;
  document.addEventListener('click', () => setTimeout(pcEnsurePredictionButtons, 50), true);
  setInterval(pcEnsurePredictionButtons, 600);
}

// ══════════════════════════════════════════════════════
//  NAVIGATION — final owner
//  navigateToNext, devGoScenario, devFillScenario,
//  devNextScenario, devTestScenario.
//  clearVN() calls pcClearVNStateForScenarioSwitch
//  (defined in S1 workbench above).
// ══════════════════════════════════════════════════════
function clearVN(){
  if (typeof window.pcClearVNStateForScenarioSwitch === 'function') {
    window.pcClearVNStateForScenarioSwitch();
    return;
  }
  const overlay = document.getElementById('vnOverlay') || document.querySelector('.vn-overlay');
  if (overlay) overlay.classList.remove('active','claude-prediction','pc-clean-prediction','claude-consult','claude-terminal-consult','claude-terminal-textmode','claude-analysis','pc-clean-output','scenario-intro-active');
  document.getElementById('vnDialogue')?.classList.remove('has-choices');
  document.getElementById('vnCharacter')?.classList.remove('visible');
  document.querySelectorAll('#vnPredictionChoicePanel,#predictionGate,.pc-choice-panel-final,.pc-clean-choice-grid,.vn-choice-list').forEach(el => el.remove());
}




// ══════════════════════════════════════════════════════
//  DEVELOPMENT TOOLS — CLEAN SHELL
// ══════════════════════════════════════════════════════
(function exposePromptCraftDevToolsV3(){
  function assign(name, fn) {
    window[name] = fn;
    try { globalThis[name] = fn; } catch (error) {}
  }

  function unlockTab(index) {
    const tab = document.querySelectorAll('.tab-btn')[index] || null;
    if (tab) {
      tab.disabled = false;
      tab.classList.remove('locked');
      tab.removeAttribute('aria-disabled');
    }
    return tab;
  }

  function devGoScenario(index) {
    const target = Math.max(0, Math.min(SCENARIO_COUNT - 1, Number(index) || 0));
    const tab = unlockTab(target);
    pcScenarioHasLaunched = true;
    switchScenario(target, tab);
    return false;
  }

  function devFillScenario(index) {
    const target = Number(index) || 0;
    if (target === SCENARIO_INDEX.ENGAGEMENT && typeof window.resetS1Dev === 'function') {
      return window.resetS1Dev();
    }
    return devGoScenario(target);
  }

  function devNextScenario() {
    return devGoScenario(Math.min(scenarioIndex + 1, SCENARIO_COUNT - 1));
  }

  assign('devGoScenario', devGoScenario);
  assign('devFillScenario', devFillScenario);
  assign('devTestScenario', devFillScenario);
  assign('navigateToNext', devGoScenario);
  assign('devNextScenario', devNextScenario);
  assign('devStatus', () => ({
    activeScenario: scenarioIndex + 1,
    implemented: SCENARIO_UI.map(item => item.implemented),
    build: PC_APP_BUILD_LABEL
  }));
})();

// Claude Speech Synthesis voice
let claudeSpeechUtterance = null;

  function cleanClaudeSpeechText(text) {
    return String(text || '')
      .replace(/\*\*/g, '')
      .replace(/#/g, '')
      .replace(/[-]{3,}/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

function toggleClaudeTTS() {
    const btn = document.getElementById('claudeTTSBtn');

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      if (btn) btn.textContent = '🔊 Read Analysis';
      return;
    }

    const output = document.getElementById('claudeTerminalOutput');
    const text = cleanClaudeSpeechText(output?.textContent || '');

    if (!text) return;

    claudeSpeechUtterance = new SpeechSynthesisUtterance(text);
    claudeSpeechUtterance.rate = 0.9;
    claudeSpeechUtterance.pitch = 0.85;

    claudeSpeechUtterance.onend = () => {
      if (btn) btn.textContent = '🔊 Read Analysis';
    };

    claudeSpeechUtterance.onerror = () => {
      if (btn) btn.textContent = '🔊 Read Analysis';
    };

    if (btn) btn.textContent = '⏹ Stop Reading';
    window.speechSynthesis.speak(claudeSpeechUtterance);
  }


