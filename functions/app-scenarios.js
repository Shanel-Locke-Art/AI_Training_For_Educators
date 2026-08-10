/* PROMPTCRAFT SCENARIOS, MENU, AND INLINE COACHING
   Extracted from app.js in Version 270. Load after the preceding PromptCraft scripts. */

//  SCENARIOS
// ══════════════════════════════════════════════════════
const scenarios = [
  {
    desc: "Mission: Fix a dead discussion board by giving Babbage enough evidence to diagnose what is failing and what meaningful peer interaction should look like.",
    testPrompt: "My online learners in a first-year general education course are submitting one-line discussion posts that don't build on each other. I need a weekly discussion prompt that encourages deeper thinking and at least two substantive peer replies. The course is fully asynchronous, 8 weeks long.",
    oscqr: [
      { id:"obj", label:"Clear Objectives" },
      { id:"int", label:"Student Interaction" },
      { id:"rwc", label:"Real-World Context" },
      { id:"inc", label:"Inclusive Design" },
      { id:"out", label:"Measurable Outcomes" },
    ],
    system: `You are Babbage, the live instructional-design analysis engine inside PromptCraft Scenario 1. The faculty member is repairing a weak asynchronous discussion design.

Evaluate the faculty member's ACTUAL choices. Refer to concrete details they supplied about learners/course, the failure they diagnosed, the interaction move, constraints, and success criteria. If they invent an unexpected repair, evaluate it on its own instructional merits. Never pretend they supplied information they did not.

Be a demanding but useful evaluator. Explicitly identify vague, irrelevant, contradictory, demeaning, unserious, or instructionally unusable input. A field does not earn credit merely because it contains course-related words. If an answer is ridiculous, hostile, or unrelated, say what is wrong with it professionally and explain what usable instructional information is missing. Do not quietly sanitize bad input into a polished activity and then praise the input.

Produce a course-ready revised discussion prompt only after diagnosing the input. Follow faculty choices when they are instructionally sound. When you replace or reinterpret a weak choice, explain why.

The revised prompt itself must also be evaluated. Identify its strongest improvement, one remaining limitation or tradeoff even when the revision is strong, and explain why the specific changes were made. The final feedback should teach the faculty member something about design decisions, not simply deliver a finished artifact.

Be specific enough that materially different faculty input produces materially different feedback. Avoid generic praise and stock advice.`
  },
  { desc: "Mission: Listen to Jordan, diagnose the missing learning process, and distinguish metacognitive evidence from generic reflection.", oscqr: [], system: "" },
  { desc: "Mission: Convert a recall-heavy assessment into authentic practice, audit Babbage\'s redesign, and make the evidence of learning defensible.", oscqr: [], system: "" },
  { desc: "Mission: Separate the learning value of live interaction from the assumption that everyone must be present at the same time.", oscqr: [], system: "" },
  { desc: "Mission: Verify a polished AI research brief against a controlled evidence packet before deciding what is safe to use.", oscqr: [], system: "" },
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
    missionCopy: 'Students are participating, but the conversation dies after one exchange. Diagnose the problem and use Babbage to redesign the discussion so students extend, challenge, and build on ideas.',
    boardText: null,
    rendererKey: 'guided-builder',
    workspaceMode: 'guided',
    introLayout: 'standard',
    introCast: 'single',
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
    missionCopy: 'Listen to a student, identify the missing thinking move, audit Babbage\'s reflection activity, repair it, and hear how the student\'s thinking changes.',
    boardText: 'Jordan is completing the work, but he cannot explain what helped, what failed, or what he should try next.',
    rendererKey: 'metacognition-opening',
    workspaceMode: 'activity',
    introLayout: 'special',
    introCast: 'dual',
    afterIntroAction: 's2-diagnosis',
    inputMode: 'scenario-2', inputVisible: true, supportsPrompt: false,
    implemented: true, developmentStatus: 'Playable',
    plannedLoop: ['Listen to the student', 'Identify the missing thinking move', 'Audit Babbage\'s activity', 'Repair one weak element', 'Hear the changed student response']
  },
  {
    key: 'assessment',
    dataLabel: 'S3: Authentic Assessment',
    tabLabel: 'S3: Assessment',
    missionTitle: 'Replace recall with authentic practice.',
    missionCopy: 'Students can pass the quiz but struggle to use the same knowledge in practice. Diagnose what the current assessment really measures, build a more authentic task with Babbage, audit the redesign, and defend the evidence of learning.',
    boardText: 'The quiz scores look fine. Performance outside the quiz does not.',
    rendererKey: 'authentic-assessment',
    workspaceMode: 'activity',
    introLayout: 'special',
    introCast: 'single',
    afterIntroAction: 's3-diagnosis',
    inputMode: 'scenario-3',
    inputVisible: true,
    supportsPrompt: false,
    implemented: true,
    developmentStatus: 'Playable',
    plannedLoop: ['Diagnose the mismatch', 'Choose authentic evidence', 'Build with Babbage', 'Audit the design', 'Repair and defend the evidence']
  },
  {
    key: 'sync-bias',
    dataLabel: 'S4: Sync Bias',
    tabLabel: 'S4: Sync Bias',
    missionTitle: 'Separate live interaction from synchronous attendance.',
    missionCopy: 'A required live session seems engaging, but several students cannot participate on equal terms. Diagnose the bias, identify the learning function that actually matters, audit Babbage’s participation plan, and create an equivalent path.',
    boardText: 'The goal is interaction. The requirement is attendance. Those are not the same thing.',
    rendererKey: 'sync-bias',
    workspaceMode: 'activity',
    introLayout: 'special',
    introCast: 'single',
    afterIntroAction: 's4-diagnosis',
    inputMode: 'scenario-4',
    inputVisible: true,
    supportsPrompt: false,
    implemented: true,
    developmentStatus: 'Playable',
    plannedLoop: ['Diagnose the bias', 'Name the learning function', 'Build with Babbage', 'Audit equivalence', 'Repair the participation plan']
  },
  {
    key: 'hallucination',
    dataLabel: 'S5: Hallucination Hunt',
    tabLabel: 'S5: Hallucination Hunt',
    missionTitle: 'Verify before you trust.',
    missionCopy: 'Babbage produces a polished research brief from a controlled evidence packet. One claim is unsafe. Inspect the sources, find the failure, correct it, and decide what can actually be used.',
    boardText: 'Polished language is not evidence. Trace the claim.',
    rendererKey: 'hallucination-hunt',
    workspaceMode: 'activity',
    introLayout: 'special',
    introCast: 'single',
    afterIntroAction: 's5-evidence',
    inputMode: 'scenario-5',
    inputVisible: true,
    supportsPrompt: false,
    implemented: true,
    developmentStatus: 'Playable',
    plannedLoop: ['Inspect the evidence', 'Choose a verification habit', 'Audit Babbage', 'Correct the unsafe claim', 'Decide what is safe']
  },
  {
    key: 'prediction', dataLabel: 'S6: Predict the Output', tabLabel: 'S6: Predict the Output',
    missionTitle: 'Predict what a vague prompt produces.',
    missionCopy: 'This scenario will be rebuilt around forecasting AI behavior, testing the prediction, and revising the request.',
    boardText: 'Scenario 6 is in redesign.', rendererKey: 'development-shell', workspaceMode: 'development', introLayout: 'none', introCast: 'single',
    inputMode: 'placeholder', inputVisible: false, supportsPrompt: false,
    implemented: false, developmentStatus: 'Planned', plannedLoop: ['Forecast', 'Test', 'Compare', 'Revise']
  },
  {
    key: 'overreliance', dataLabel: 'S7: Overreliance', tabLabel: 'S7: Overreliance',
    missionTitle: 'Decide where human judgment belongs.',
    missionCopy: 'This scenario will be rebuilt around classifying AI output and defending where instructor judgment is irreplaceable.',
    boardText: 'Scenario 7 is in redesign.', rendererKey: 'development-shell', workspaceMode: 'development', introLayout: 'none', introCast: 'single',
    inputMode: 'placeholder', inputVisible: false, supportsPrompt: false,
    implemented: false, developmentStatus: 'Planned', plannedLoop: ['Classify', 'Justify', 'Revise the boundary']
  },
  {
    key: 'reflect-revise', dataLabel: 'S8: Reflect & Revise', tabLabel: 'S8: Reflect and Revise',
    missionTitle: 'Build, reflect, and revise.',
    missionCopy: 'The final scenario will synthesize the game by asking learners to examine their own choices and improve a prompt deliberately.',
    boardText: 'Scenario 8 is in redesign.', rendererKey: 'development-shell', workspaceMode: 'development', introLayout: 'none', introCast: 'single',
    inputMode: 'placeholder', inputVisible: false, supportsPrompt: false,
    implemented: false, developmentStatus: 'Planned', plannedLoop: ['Build', 'Explain your choice', 'Evaluate the output', 'Revise']
  }
];

if (scenarios.length !== SCENARIO_COUNT || SCENARIO_UI.length !== SCENARIO_COUNT || scenarioData.length !== SCENARIO_COUNT) {
  throw new Error('[PromptCraft] Scenario configuration, content, and tracking data are out of sync.');
}

const PC_SCENARIO_LABELS = SCENARIO_UI.map(ui => ui.dataLabel || ui.tabLabel);

pcExposeGlobals({
  SCENARIO_INDEX,
  scenarios,
  SCENARIO_UI
});

function pcNormalizeScenarioIndex(value, fallback = null) {
  const index = Number(value);
  return Number.isInteger(index) && index >= 0 && index < SCENARIO_COUNT && scenarios[index]
    ? index
    : fallback;
}

function pcGetScenarioTab(index) {
  const normalized = pcNormalizeScenarioIndex(index);
  return normalized === null ? null : document.querySelectorAll('.tab-btn')[normalized] || null;
}

function pcUnlockScenarioTab(index) {
  const tab = pcGetScenarioTab(index);
  if (tab) {
    tab.disabled = false;
    tab.classList.remove('locked');
    tab.removeAttribute('aria-disabled');
  }
  return tab;
}

const PC_SCENARIO_RENDERERS = Object.freeze({
  'guided-builder': ({ container }) => renderGuidedBuilder(container),
  'metacognition-opening': ({ container }) => renderS2Standby(container),
  'development-shell': ({ index }) => renderScenarioPlaceholder(index)
});

const PC_SCENARIO_AFTER_INTRO_ACTIONS = Object.freeze({
  's2-diagnosis': () => renderS2DiagnosisActivity(),
  's3-diagnosis': () => renderS3DiagnosisActivity(),
  's4-diagnosis': () => renderS4DiagnosisActivity(),
  's5-evidence': () => renderS5EvidenceActivity()
});

function pcRenderScenarioWorkspace(index, container) {
  const ui = getScenarioUI(index);
  const renderer = PC_SCENARIO_RENDERERS[ui.rendererKey] || PC_SCENARIO_RENDERERS['development-shell'];
  return renderer({ index, container, ui });
}

function pcRunScenarioAfterIntroAction(actionKey) {
  const action = PC_SCENARIO_AFTER_INTRO_ACTIONS[actionKey];
  if (typeof action === 'function') action();
}

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
  const normalized = pcNormalizeScenarioIndex(index);
  return normalized !== null && Boolean(SCENARIO_UI[normalized]);
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
              data-pc-action="launch-scenario"
              data-pc-scenario-index="${index}"
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



// The compact mobile menu is another view of the same scenario registry. Keep
// it synchronized here instead of maintaining a second inline script in HTML.
function syncCompactScenarioMenu() {
  const tabs = Array.from(document.querySelectorAll('.scenario-tabs .tab-btn'));
  const activeIndex = Math.max(0, tabs.findIndex(tab =>
    tab.classList.contains('active') || tab.getAttribute('aria-selected') === 'true'
  ));
  const activeTab = tabs[activeIndex];
  const current = document.querySelector('.mobile-scenario-current');
  if (current && activeTab) current.textContent = activeTab.textContent.trim();

  document.querySelectorAll('.mobile-scenario-menu .mobile-dropdown-option').forEach(option => {
    const isActive = Number(option.dataset.sourceIndex) === activeIndex;
    option.classList.toggle('is-active', isActive);
    if (isActive) option.setAttribute('aria-current', 'page');
    else option.removeAttribute('aria-current');
  });
}

function initializeCompactScenarioSync() {
  const tabs = document.querySelector('.scenario-tabs');
  if (tabs) {
    new MutationObserver(syncCompactScenarioMenu).observe(tabs, {
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'aria-selected']
    });
  }
  syncCompactScenarioMenu();
}

document.addEventListener('DOMContentLoaded', initializeCompactScenarioSync, { once: true });

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
  overlay.inert = false;
  overlay.hidden = false;
  overlay.setAttribute('aria-hidden', 'false');
  const vnOverlay = document.getElementById('vnOverlay');
  if (vnOverlay?.classList.contains('active')) {
    pcReleaseFocusBeforeHide(vnOverlay);
    vnOverlay.setAttribute('aria-hidden', 'true');
    vnOverlay.inert = true;
  }
  document.body.classList.add('pc-main-menu-open');
  requestAnimationFrame(pcApplyIpadLayoutV200);
  window.setTimeout(pcApplyIpadLayoutV200, 80);
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

  pcReleaseFocusBeforeHide(overlay);
  overlay.classList.remove('visible');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.inert = true;
  document.body.classList.remove('pc-main-menu-open');
  requestAnimationFrame(pcApplyIpadLayoutV200);
  pcMainMenuInitialOpen = false;

  const vnOverlay = document.getElementById('vnOverlay');
  if (vnOverlay?.classList.contains('active')) {
    vnOverlay.inert = false;
    vnOverlay.setAttribute('aria-hidden', 'false');
  }

  setTimeout(() => {
    overlay.hidden = true;

    // v218: Do not return focus to the header while a scenario introduction is
    // arming or already visible. That delayed focus used to scroll the hidden
    // workbench roughly 180 ms after launch, producing the brief downward jump
    // immediately before Professor Pixel appeared.
    const activeVN = document.getElementById('vnOverlay');
    if (window.pcScenarioIntroPending || activeVN?.classList.contains('active')) return;

    const canRestoreFocus = pcMainMenuLastFocused
      && typeof pcMainMenuLastFocused.focus === 'function'
      && !pcMainMenuLastFocused.closest?.('[hidden]')
      && pcMainMenuLastFocused.getClientRects?.().length;

    if (canRestoreFocus) pcFocusWithoutScroll(pcMainMenuLastFocused);
    else pcFocusWithoutScroll(document.getElementById('mainMenuToggle'));
  }, 180);
  return false;
}

function pcUnlockScenarioForMenuPreview(index) {
  return pcUnlockScenarioTab(index);
}


function launchScenarioFromMenu(index, options = {}) {
  index = pcNormalizeScenarioIndex(index);
  if (index === null || !isScenarioAvailableFromMenu(index)) return false;

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

  const tab = pcUnlockScenarioForMenuPreview(index);
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

pcExposeGlobals({
  openMainMenu,
  closeMainMenu,
  showMainMenuPanel,
  continueFromMainMenu,
  launchScenarioFromMenu
});

pcRegisterUIActions({
  'open-main-menu': target => openMainMenu(target.dataset.pcPanel || 'home'),
  'close-main-menu': () => closeMainMenu(),
  'show-main-menu-panel': target => showMainMenuPanel(target.dataset.pcPanel || 'home'),
  'continue-main-menu': () => continueFromMainMenu(),
  'launch-scenario': target => launchScenarioFromMenu(
    target.dataset.pcScenarioIndex,
    { skipNameGate: target.dataset.pcSkipNameGate === 'true' }
  )
});

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

pcRegisterUIActions({
  'pixel-badge-click': () => pixelBadgeClick(),
  'pixel-coach-dismiss': () => pixelCoachDismiss()
});

// ── AI BUBBLE AVATAR ──────────────────────────────────
function pixelAvatarHTML(expr) {
  const src = PIXEL_EXPR[expr] || PIXEL_EXPR.neutral;
  return `
    <img class="pixel-chat-avatar"
         src="${src}"
         alt="Professor Pixel"
         onerror="this.outerHTML='<div class=\\'pixel-chat-avatar-fallback\\'>🧑‍🏫</div>'" />`;
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

// Navigation rendering is owned by the active completion flow in app-workbench.js.
// Later-scenario implementations are archived outside the active runtime.

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

function setClaudeTerminalState(state = 'idle', title = 'BABBAGE ENGINE', output = 'IDLE') {
  if (state !== 'thinking' && typeof pcClearMobileAnalyzingStageV202 === 'function') {
    pcClearMobileAnalyzingStageV202();
  }
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
    const outputText = String(output ?? '');
    if (!outputText.includes('\n') && !outputText.includes('<')) {
      const statusLine = document.createElement('span');
      statusLine.className = 'claude-terminal-status-line';

      const statusText = document.createElement('span');
      statusText.className = 'claude-terminal-status-text';
      statusText.textContent = outputText;

      const cursor = document.createElement('span');
      cursor.className = 'claude-terminal-cursor';
      cursor.setAttribute('aria-hidden', 'true');

      statusLine.append(statusText, cursor);
      outputEl.replaceChildren(statusLine);
    } else {
      outputEl.innerHTML = `${output}<span class="claude-terminal-cursor" aria-hidden="true"></span>`;
    }
  }
}



// ══════════════════════════════════════════════════════
