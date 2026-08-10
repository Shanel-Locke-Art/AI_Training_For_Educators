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

// ── SHARED SCENARIO STRUCTURE ─────────────────────────
// Scenario 1 established the clean mission-briefing pattern. The remaining
// scenarios now use the same anatomy rather than each inventing another card.
function getScenarioUI(index = scenarioIndex) {
  return SCENARIO_UI[index] || SCENARIO_UI[SCENARIO_INDEX.ENGAGEMENT];
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
    container.className = 'pc-scenario-placeholder-host';
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
        <button type="button" class="pc-shell-primary" data-pc-action="open-main-menu" data-pc-panel="scenarios">Return to Scenario Select</button>
        <button type="button" class="pc-shell-secondary" data-pc-action="launch-scenario" data-pc-scenario-index="0" data-pc-skip-name-gate="true">Play Scenario 1</button>
      </div>
    </section>`;
  area.scrollTop = 0;
}


// ══════════════════════════════════════════════════════
//  SHARED SCENARIO ACTIVITY COMPONENTS
//  These builders are scenario-neutral. S2 is the first user, and S3–S8 can
//  reuse the same mission, progress, evidence, choice, feedback, and action
//  anatomy without cloning another screen system.
// ══════════════════════════════════════════════════════
function buildScenarioProgressHTML({ steps = [], activeIndex = 0, ariaLabel = 'Scenario progress' } = {}) {
  if (!steps.length) return '';
  return `
    <div class="pc-scenario-progress" aria-label="${esc(ariaLabel)}">
      ${steps.map((step, index) => `<span${index === activeIndex ? ' class="active" aria-current="step"' : ''}>${esc(step)}</span>`).join('')}
    </div>`;
}

function buildScenarioChoiceCardsHTML({
  items = [],
  inputName,
  idPrefix,
  variant = 'compact',
  marker = (_, index) => String(index + 1).padStart(2, '0')
} = {}) {
  return items.map((item, index) => {
    const inputId = `${idPrefix}-${item.id}`;
    const markerText = typeof marker === 'function' ? marker(item, index) : item[marker] || '';
    const body = variant === 'detail'
      ? `<span class="pc-choice-body"><strong>${esc(item.title)}</strong><span>“${esc(item.text)}”</span></span>`
      : `<span class="pc-choice-copy">${esc(item.label)}</span>`;
    return `
      <label class="pc-choice-card pc-choice-card--${esc(variant)}" for="${esc(inputId)}">
        <input type="checkbox" id="${esc(inputId)}" name="${esc(inputName)}" value="${esc(item.id)}" />
        <span class="pc-choice-marker">${esc(markerText)}</span>
        ${body}
      </label>`;
  }).join('');
}

function buildScenarioTaskCardHTML({
  titleId,
  kicker,
  title,
  instruction,
  choiceGridId,
  choicesHTML,
  statusId,
  submitId,
  submitLabel,
  feedbackId,
  gridClass = ''
} = {}) {
  return `
    <section class="pc-activity-card pc-activity-task" aria-labelledby="${esc(titleId)}">
      <div class="pc-activity-kicker">${esc(kicker)}</div>
      <h2 id="${esc(titleId)}">${esc(title)}</h2>
      <p class="pc-activity-instruction">${esc(instruction)}</p>
      <div class="pc-choice-grid${gridClass ? ` ${esc(gridClass)}` : ''}" id="${esc(choiceGridId)}">${choicesHTML}</div>
      <div class="pc-selection-bar">
        <span id="${esc(statusId)}" role="status" aria-live="polite">0 selected</span>
        <button class="pc-button pc-button--primary" id="${esc(submitId)}" type="button" disabled>${esc(submitLabel)}</button>
      </div>
      <div id="${esc(feedbackId)}" aria-live="polite"></div>
    </section>`;
}

function mountScenarioActivity({
  container = document.getElementById('inputContainer'),
  scenarioIndex: index = scenarioIndex,
  progressHTML = '',
  contentHTML = '',
  focusSelector = ''
} = {}) {
  if (!container) return false;
  container.className = 'pc-scenario-workbench';
  container.style.display = 'flex';
  container.innerHTML = `
    <div class="pc-scenario-stage">
      ${buildScenarioMissionHTML(index, { extraHTML: progressHTML })}
      ${contentHTML}
    </div>`;
  container.scrollTop = 0;
  if (focusSelector) setTimeout(() => container.querySelector(focusSelector)?.focus(), 80);
  return true;
}

function wireExactSelection({ rootId, inputName, limit, statusId, submitId, onSubmit }) {
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
    inputs.forEach(input => input.closest('.pc-choice-card')?.classList.toggle('selected', input.checked));
  };

  root.addEventListener('change', event => {
    const input = event.target.closest?.(`input[name="${inputName}"]`);
    if (input) update(input);
  });
  submit.addEventListener('click', onSubmit, { once: true });
  update(null);
}

function getCheckedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
}

function disableScenarioChoices(name, submitId) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(input => { input.disabled = true; });
  const submit = document.getElementById(submitId);
  if (submit) submit.disabled = true;
}

function renderScenarioFeedback({ panelId, tone = 'developing', heading, text, actionsHTML = '' } = {}) {
  const panel = document.getElementById(panelId);
  if (!panel) return null;
  panel.innerHTML = `
    <div class="pc-feedback-card is-${esc(tone)}">
      <div class="pc-feedback-heading">${esc(heading)}</div>
      <p>${esc(text)}</p>
      <div class="pc-feedback-actions">${actionsHTML}</div>
    </div>`;
  panel.querySelector('button')?.focus();
  return panel;
}

// ══════════════════════════════════════════════════════
//  SCENARIO 2 — METACOGNITION DETECTIVE OPENING
//  Vertical slice implemented with the shared activity component system.
// ══════════════════════════════════════════════════════
const S2_PROGRESS_STEPS = ['1 Diagnose', '2 Examine evidence', '3 Choose a thinking move', '4 Audit Babbage', '5 Repair & compare'];

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


const S2_THINKING_MOVES = [
  { id: 'plan', tag: 'PLAN', title: 'Plan a strategy', text: 'Choose a learning approach before beginning and explain why it fits the task.' },
  { id: 'monitor', tag: 'MONITOR', title: 'Monitor understanding', text: 'Notice during the task where understanding is strong, weak, or breaking down.' },
  { id: 'evaluate', tag: 'EVALUATE', title: 'Evaluate a strategy', text: 'Judge whether a learning strategy actually helped and use evidence to explain why.' },
  { id: 'transfer', tag: 'TRANSFER', title: 'Transfer a strategy', text: 'Decide when and where a successful learning strategy should be used again.' }
];

const S2_AUDIT_OPTIONS = [
  { id: 'too_vague', label: 'The reflection is too vague to reveal what Jordan actually did or learned.' },
  { id: 'no_evidence', label: 'The reflection asks for an opinion but does not require evidence about what helped or failed.' },
  { id: 'no_transfer', label: 'The reflection never asks Jordan to decide what he should try next or reuse later.' },
  { id: 'grade_focus', label: 'The reflection centers performance or grades instead of the learning process.' }
];

const S2_LOCAL_DRAFT_FALLBACK = {
  activity_title: 'What Worked This Time?',
  activity_prompt: 'After you receive your grade, describe whether you think your study strategy worked. Explain how you feel about your result and what you might do next time.',
  design_rationale: 'This prompt asks Jordan to reflect after completing the assignment and gives him an opportunity to think about his strategy.',
  deliberate_weakness: 'no_evidence',
  likely_student_response: 'I think rereading worked because my grade was better. I felt relieved, so I will probably reread again.',
  why_the_weakness_matters: 'Jordan can answer this without identifying evidence from his learning process, so the reflection may reinforce the same guesswork the activity is supposed to interrupt.'
};

const S2_LOCAL_REVIEW_FALLBACK = {
  status: 'PROMISING REPAIR',
  confidence: 'MODERATE',
  feedback_summary: 'The repair makes the reflection more useful by asking Jordan to connect a strategy to evidence from his learning process.',
  what_improved: ['The prompt asks Jordan to identify what he actually did.', 'The repair makes the judgment about effectiveness more explicit.'],
  remaining_issue: 'The next refinement would be to make the future decision equally explicit so Jordan names when he will reuse, modify, or abandon the strategy.',
  revised_activity: 'Name the strategy you used while learning this material. Identify one specific sign that it helped or failed to help your understanding. Based on that evidence, explain what you will keep, change, or try differently on the next assignment.',
  student_response_after: 'Rereading helped me recognize the terms, but I still could not compare them. Making my own examples was the point where I could finally explain the difference. Next time I will test myself with examples before I reread everything.',
  why_student_thinking_changed: 'The revised prompt requires Jordan to connect a strategy to evidence and then turn that evaluation into a future decision.'
};
const S2_ACTIVITY_CONFIG = Object.freeze({
  diagnosis: Object.freeze({
    items: S2_DIAGNOSIS_OPTIONS,
    inputName: 's2-diagnosis',
    idPrefix: 's2-diagnosis',
    titleId: 's2DiagnosisTitle',
    kicker: 'Decision 1 · Diagnose the learning problem',
    title: 'Which two instructional needs are most clearly supported by Jordan’s comments?',
    instruction: 'Select exactly two. Several options sound educationally useful, but only two are the strongest diagnosis of this evidence.',
    choiceGridId: 's2DiagnosisChoices',
    statusId: 's2DiagnosisStatus',
    submitId: 's2DiagnosisSubmit',
    submitLabel: 'Submit diagnosis',
    feedbackId: 's2DiagnosisFeedback',
    activeIndex: 0,
    focusSelector: 'input[name="s2-diagnosis"]',
    onSubmit: submitS2Diagnosis,
    wrapContent: taskHTML => `<div class="pc-activity-layout">${buildS2JordanEvidenceHTML()}${taskHTML}</div>`
  }),
  evidence: Object.freeze({
    items: S2_EVIDENCE_RESPONSES,
    inputName: 's2-evidence',
    idPrefix: 's2-evidence',
    variant: 'detail',
    marker: item => item.tag,
    titleId: 's2EvidenceTitle',
    kicker: 'Decision 2 · Find the metacognitive thinker',
    title: 'Which two responses show the strongest metacognitive thinking?',
    instruction: 'Select exactly two. One response is deliberately close because noticing a problem is meaningful, but it is not the entire learning cycle.',
    choiceGridId: 's2EvidenceChoices',
    statusId: 's2EvidenceStatus',
    submitId: 's2EvidenceSubmit',
    submitLabel: 'Submit evidence',
    feedbackId: 's2EvidenceFeedback',
    activeIndex: 1,
    focusSelector: 'input[name="s2-evidence"]',
    onSubmit: submitS2Evidence
  })
});

function getS2Data() {
  const data = scenarioData[SCENARIO_INDEX.METACOGNITION];
  if (!Array.isArray(data.diagnosisAttempts)) data.diagnosisAttempts = [];
  if (!Array.isArray(data.evidenceAttempts)) data.evidenceAttempts = [];
  if (!Array.isArray(data.diagnosisFinal)) data.diagnosisFinal = [];
  if (!Array.isArray(data.evidenceFinal)) data.evidenceFinal = [];
  if (!Array.isArray(data.thinkingMoveAttempts)) data.thinkingMoveAttempts = [];
  if (!Array.isArray(data.auditAttempts)) data.auditAttempts = [];
  if (!Array.isArray(data.repairAttempts)) data.repairAttempts = [];
  if (!data.babbageDraft || typeof data.babbageDraft !== 'object') data.babbageDraft = null;
  if (!data.babbageReview || typeof data.babbageReview !== 'object') data.babbageReview = null;
  return data;
}

function buildS2JordanEvidenceHTML() {
  return `
    <aside class="pc-evidence-card" aria-label="Evidence from Jordan">
      <img src="${ASSETS.images.students.jordan.uncertain}" alt="Jordan, an adult online learner, looking uncertain" />
      <div class="pc-evidence-card-copy">
        <div class="pc-activity-kicker">Student evidence</div>
        <h3>What Jordan told us</h3>
        <blockquote>“I reread the chapter a few times. Some parts finally made more sense, but I couldn’t tell you what actually helped.”</blockquote>
        <p>He completed the assignment and earned a better grade, but he cannot explain the learning process that produced it.</p>
      </div>
    </aside>`;
}

function renderS2Standby(container) {
  mountScenarioActivity({
    container,
    scenarioIndex: SCENARIO_INDEX.METACOGNITION,
    contentHTML: `
      <section class="pc-activity-card pc-activity-standby" aria-live="polite">
        <div class="pc-activity-kicker">Case file loading</div>
        <h2>Listen before you diagnose.</h2>
        <p>Pixel and Jordan will introduce the case. The first decision appears when their conversation ends.</p>
      </section>`
  });
}

function renderS2SelectionActivity(config) {
  const container = document.getElementById('inputContainer');
  if (!container || scenarioIndex !== SCENARIO_INDEX.METACOGNITION) return false;

  const choicesHTML = buildScenarioChoiceCardsHTML({
    items: config.items,
    inputName: config.inputName,
    idPrefix: config.idPrefix,
    variant: config.variant,
    marker: config.marker
  });
  const taskHTML = buildScenarioTaskCardHTML({
    titleId: config.titleId,
    kicker: config.kicker,
    title: config.title,
    instruction: config.instruction,
    choiceGridId: config.choiceGridId,
    choicesHTML,
    statusId: config.statusId,
    submitId: config.submitId,
    submitLabel: config.submitLabel,
    feedbackId: config.feedbackId
  });
  const contentHTML = typeof config.wrapContent === 'function'
    ? config.wrapContent(taskHTML)
    : taskHTML;

  mountScenarioActivity({
    container,
    scenarioIndex: SCENARIO_INDEX.METACOGNITION,
    progressHTML: buildScenarioProgressHTML({
      steps: S2_PROGRESS_STEPS,
      activeIndex: config.activeIndex,
      ariaLabel: 'Scenario 2 progress'
    }),
    contentHTML,
    focusSelector: config.focusSelector
  });

  wireExactSelection({
    rootId: config.choiceGridId,
    inputName: config.inputName,
    limit: 2,
    statusId: config.statusId,
    submitId: config.submitId,
    onSubmit: config.onSubmit
  });
  return true;
}

function renderS2DiagnosisActivity() {
  return renderS2SelectionActivity(S2_ACTIVITY_CONFIG.diagnosis);
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
  const selection = getCheckedValues('s2-diagnosis');
  if (selection.length !== 2) return;
  const result = classifyS2Diagnosis(selection);
  const data = getS2Data();
  const labels = selection.map(id => S2_DIAGNOSIS_OPTIONS.find(option => option.id === id)?.label || id);
  data.attempts += 1;
  data.diagnosisAttempts.push({ selection: [...selection], result: result.level, timestamp: new Date().toISOString() });
  data.prompts.push(`S2 diagnosis: ${labels.join(' | ')}`);
  data.finalResponse = pixelDialogue[result.key]?.[0]?.text || '';

  disableScenarioChoices('s2-diagnosis', 's2DiagnosisSubmit');
  playPixelSequence(result.key, () => renderS2DiagnosisFeedback(selection, result));
}

function renderS2DiagnosisFeedback(selection, result) {
  const exact = result.key === 's2_diagnosis_correct';
  const text = pixelDialogue[result.key]?.[0]?.text || '';
  renderScenarioFeedback({
    panelId: 's2DiagnosisFeedback',
    tone: exact ? 'strong' : 'developing',
    heading: exact ? 'Diagnosis supported by the evidence' : 'A useful diagnosis needs one more pass',
    text,
    actionsHTML: `
      ${exact ? '' : '<button class="pc-button pc-button--secondary" type="button" id="s2RetryDiagnosis" data-pc-action="s2-retry-diagnosis">Revise diagnosis</button>'}
      <button class="pc-button pc-button--primary" type="button" id="s2ContinueEvidence" data-pc-action="s2-continue-evidence">Examine student responses →</button>`
  });
}

function renderS2EvidenceActivity() {
  return renderS2SelectionActivity(S2_ACTIVITY_CONFIG.evidence);
}

function submitS2Evidence() {
  const selection = getCheckedValues('s2-evidence');
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

  disableScenarioChoices('s2-evidence', 's2EvidenceSubmit');

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

  renderScenarioFeedback({
    panelId: 's2EvidenceFeedback',
    tone: exact ? 'strong' : 'developing',
    heading,
    text: copy,
    actionsHTML: `
      ${exact ? '' : '<button class="pc-button pc-button--secondary" type="button" id="s2RetryEvidence" data-pc-action="s2-retry-evidence">Review the responses</button>'}
      <button class="pc-button pc-button--primary" type="button" id="s2OpeningCheckpoint" data-pc-action="s2-opening-checkpoint">Continue →</button>`
  });
}


function renderS2ThinkingMoveActivity() {
  const choicesHTML = buildScenarioChoiceCardsHTML({
    items: S2_THINKING_MOVES,
    inputName: 's2-thinking-move',
    idPrefix: 's2-thinking',
    variant: 'detail',
    marker: item => item.tag
  });

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.METACOGNITION,
    progressHTML: buildScenarioProgressHTML({ steps: S2_PROGRESS_STEPS, activeIndex: 2, ariaLabel: 'Scenario 2 progress' }),
    contentHTML: buildScenarioTaskCardHTML({
      titleId: 's2ThinkingTitle',
      kicker: 'Decision 3 · Choose the thinking move',
      title: 'What should Jordan practice first?',
      instruction: 'Choose the move that most directly addresses the problem you diagnosed. Strong metacognition eventually uses all four, but this case needs a useful starting point.',
      choiceGridId: 's2ThinkingChoices',
      choicesHTML,
      statusId: 's2ThinkingStatus',
      submitId: 's2ThinkingSubmit',
      submitLabel: 'Build the activity',
      feedbackId: 's2ThinkingFeedback'
    }),
    focusSelector: 'input[name="s2-thinking-move"]'
  });

  wireExactSelection({
    rootId: 's2ThinkingChoices',
    inputName: 's2-thinking-move',
    limit: 1,
    statusId: 's2ThinkingStatus',
    submitId: 's2ThinkingSubmit',
    onSubmit: submitS2ThinkingMove
  });
}

function pcS2BuildDraftSystemPrompt(move) {
  return `You are Babbage, PromptCraft's instructional-design analysis engine.

SCENARIO 2: METACOGNITION
Jordan completes assignments and sometimes earns better grades, but he cannot identify which learning strategy helped, evaluate why it helped, or decide what to do next.

The participant selected this metacognitive move as the starting point: ${move}.

Create one short reflection activity for Jordan. The activity should be plausible enough that an instructor might accept it, but deliberately include exactly ONE subtle weakness so the participant can audit the AI-generated design.

Choose exactly one weakness from:
- too_vague: the prompt is so broad that Jordan can answer without naming a strategy or learning evidence.
- no_evidence: Jordan is asked to judge a strategy but not cite evidence from his learning process.
- no_transfer: Jordan evaluates learning but is not asked to make a future decision.
- grade_focus: the activity centers grades/performance rather than how learning happened.

Do not announce the weakness inside the activity prompt. Keep the activity concise and realistic.`;
}

async function submitS2ThinkingMove() {
  const selection = getCheckedValues('s2-thinking-move');
  if (selection.length !== 1) return;

  const move = selection[0];
  const data = getS2Data();
  data.attempts += 1;
  data.thinkingMoveAttempts.push({ selection: move, timestamp: new Date().toISOString() });
  data.thinkingMove = move;
  data.prompts.push(`S2 thinking move: ${move}`);

  disableScenarioChoices('s2-thinking-move', 's2ThinkingSubmit');

  renderScenarioFeedback({
    panelId: 's2ThinkingFeedback',
    tone: move === 'evaluate' ? 'strong' : 'developing',
    heading: move === 'evaluate' ? 'That is the strongest starting move.' : 'That move belongs in the cycle, but Jordan needs evaluation first.',
    text: move === 'evaluate'
      ? 'Jordan already tried a strategy. His immediate gap is judging what actually helped and why. Once he can evaluate the strategy, planning and transfer become more evidence-based.'
      : 'Jordan eventually needs planning, monitoring, evaluation, and transfer. In this case, he already has a strategy to examine, so evaluating what helped is the most direct starting point.',
    actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s2-generate-draft">Ask Babbage to draft the reflection →</button>'
  });
}

function renderS2BabbageLoading(message = 'Babbage is building a reflection activity from the case evidence...') {
  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.METACOGNITION,
    progressHTML: buildScenarioProgressHTML({ steps: S2_PROGRESS_STEPS, activeIndex: 3, ariaLabel: 'Scenario 2 progress' }),
    contentHTML: `
      <section class="pc-activity-card pc-s2-babbage-loading" aria-live="polite">
        <div class="pc-activity-kicker">Babbage Engine</div>
        <h2>Designing a reflection activity</h2>
        <p>${esc(message)}</p>
        <div class="pc-s2-engine-progress" role="progressbar" aria-label="Babbage activity generation in progress">
          <span></span>
        </div>
        <p class="pc-s2-engine-note">The draft will be intentionally imperfect. Your job is to notice what the machine missed.</p>
      </section>`
  });
}

async function generateS2BabbageDraft() {
  renderS2BabbageLoading();
  const data = getS2Data();
  const move = data.thinkingMove || 'evaluate';

  let result;
  try {
    const response = await requestBabbageAnalysis({
      analysis_type: 's2_draft',
      max_output_tokens: 2200,
      system: pcS2BuildDraftSystemPrompt(move),
      messages: [{
        role: 'user',
        content: `Case evidence: Jordan says rereading sometimes made the material feel clearer, but he cannot tell what actually helped. He plans to repeat the same strategy next time and hope it works. Build the draft now.`
      }]
    }, 's2-draft');

    result = response?.analysis || null;
    if (!result || !result.activity_prompt || !result.deliberate_weakness) throw new Error('Incomplete structured draft.');
    data.aiProvider = response.provider || '';
    data.aiModel = response.model || '';
    data.aiRequestId = response.request_id || '';
    data.aiElapsedMs = response.elapsed_ms ?? '';
    data.aiUsage = response.usage || null;
  } catch (error) {
    console.warn('[PromptCraft] S2 Babbage draft unavailable; using local fallback.', error);
    result = { ...S2_LOCAL_DRAFT_FALLBACK };
    data.aiProvider = 'local-fallback';
    data.aiModel = 'promptcraft-local-fallback';
  }

  data.babbageDraft = result;
  data.structuredAnalysis = { s2_draft: result };
  data.finalResponse = result.activity_prompt;
  renderS2AuditActivity();
}

function renderS2AuditActivity() {
  const data = getS2Data();
  const draft = data.babbageDraft || S2_LOCAL_DRAFT_FALLBACK;
  const choicesHTML = buildScenarioChoiceCardsHTML({
    items: S2_AUDIT_OPTIONS,
    inputName: 's2-audit',
    idPrefix: 's2-audit'
  });

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.METACOGNITION,
    progressHTML: buildScenarioProgressHTML({ steps: S2_PROGRESS_STEPS, activeIndex: 3, ariaLabel: 'Scenario 2 progress' }),
    contentHTML: `
      <div class="pc-s2-audit-layout">
        <aside class="pc-s2-babbage-draft" aria-label="Babbage reflection activity draft">
          <div class="pc-activity-kicker">Babbage draft</div>
          <h2>${esc(draft.activity_title)}</h2>
          <div class="pc-s2-draft-prompt">${esc(draft.activity_prompt)}</div>
          <p><strong>Babbage's rationale:</strong> ${esc(draft.design_rationale)}</p>
          <details>
            <summary>Likely Jordan response</summary>
            <p>${esc(draft.likely_student_response)}</p>
          </details>
        </aside>
        ${buildScenarioTaskCardHTML({
          titleId: 's2AuditTitle',
          kicker: 'Decision 4 · Audit the machine',
          title: 'What is the most important weakness in Babbage’s draft?',
          instruction: 'Choose one. The draft is intentionally plausible, so focus on what Jordan could still avoid thinking about.',
          choiceGridId: 's2AuditChoices',
          choicesHTML,
          statusId: 's2AuditStatus',
          submitId: 's2AuditSubmit',
          submitLabel: 'Audit the draft',
          feedbackId: 's2AuditFeedback'
        })}
      </div>`,
    focusSelector: 'input[name="s2-audit"]'
  });

  wireExactSelection({
    rootId: 's2AuditChoices',
    inputName: 's2-audit',
    limit: 1,
    statusId: 's2AuditStatus',
    submitId: 's2AuditSubmit',
    onSubmit: submitS2Audit
  });
}

function submitS2Audit() {
  const selection = getCheckedValues('s2-audit');
  if (selection.length !== 1) return;

  const selected = selection[0];
  const data = getS2Data();
  const draft = data.babbageDraft || S2_LOCAL_DRAFT_FALLBACK;
  const exact = selected === draft.deliberate_weakness;
  data.attempts += 1;
  data.auditAttempts.push({ selection: selected, exact, weakness: draft.deliberate_weakness, timestamp: new Date().toISOString() });
  data.prompts.push(`S2 audit: ${selected}`);

  disableScenarioChoices('s2-audit', 's2AuditSubmit');

  const feedback = exact
    ? `You found the weakness Babbage built into the activity. ${draft.why_the_weakness_matters}`
    : `That concern is reasonable, but the most consequential weakness in this draft is: ${S2_AUDIT_OPTIONS.find(item => item.id === draft.deliberate_weakness)?.label || draft.deliberate_weakness} ${draft.why_the_weakness_matters}`;

  renderScenarioFeedback({
    panelId: 's2AuditFeedback',
    tone: exact ? 'strong' : 'developing',
    heading: exact ? 'You caught the machine’s weak spot.' : 'Good instinct. Look one layer deeper.',
    text: feedback,
    actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s2-repair-draft">Repair the activity →</button>'
  });
}

function renderS2RepairActivity() {
  const data = getS2Data();
  const draft = data.babbageDraft || S2_LOCAL_DRAFT_FALLBACK;

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.METACOGNITION,
    progressHTML: buildScenarioProgressHTML({ steps: S2_PROGRESS_STEPS, activeIndex: 4, ariaLabel: 'Scenario 2 progress' }),
    contentHTML: `
      <div class="pc-s2-repair-layout">
        <aside class="pc-s2-original-draft">
          <div class="pc-activity-kicker">Original Babbage draft</div>
          <h3>${esc(draft.activity_title)}</h3>
          <p>${esc(draft.activity_prompt)}</p>
        </aside>
        <section class="pc-activity-card" aria-labelledby="s2RepairTitle">
          <div class="pc-activity-kicker">Decision 5 · Repair the design</div>
          <h2 id="s2RepairTitle">Rewrite the reflection so Jordan has to reveal his thinking.</h2>
          <p class="pc-activity-instruction">You do not need to rewrite everything. Fix the weakness you noticed by making the learning evidence, evaluation, or future decision more explicit.</p>
          <label class="pc-s2-repair-label" for="s2RepairText">Your repaired reflection prompt</label>
          <textarea id="s2RepairText" class="pc-s2-repair-textarea" rows="8" maxlength="1800" placeholder="Write the repaired reflection prompt here..."></textarea>
          <div class="pc-selection-bar">
            <span id="s2RepairStatus" role="status" aria-live="polite">0 characters</span>
            <button class="pc-button pc-button--primary" id="s2RepairSubmit" type="button" disabled>Ask Babbage to review the repair</button>
          </div>
          <div id="s2RepairFeedback" aria-live="polite"></div>
        </section>
      </div>`,
    focusSelector: '#s2RepairText'
  });

  const text = document.getElementById('s2RepairText');
  const status = document.getElementById('s2RepairStatus');
  const submit = document.getElementById('s2RepairSubmit');
  const update = () => {
    const value = text.value.trim();
    status.textContent = `${value.length} characters`;
    submit.disabled = value.length < 35;
  };
  text.addEventListener('input', update);
  submit.addEventListener('click', submitS2Repair, { once: true });
  update();
}

function pcS2BuildReviewSystemPrompt(data, repair) {
  const draft = data.babbageDraft || S2_LOCAL_DRAFT_FALLBACK;
  return `You are Babbage, PromptCraft's instructional-design analysis engine.

Review a faculty member's repair to a metacognitive reflection activity for Jordan.

Jordan's problem:
He completes work but cannot identify what learning strategy helped, evaluate why it helped, or decide what he should try next.

Original Babbage draft:
${draft.activity_prompt}

Known weakness in the original draft:
${draft.deliberate_weakness} — ${draft.why_the_weakness_matters}

Faculty repair:
${repair}

Evaluate the repair specifically. Do not praise it merely for existing. If it is vague, irrelevant, contradictory, demeaning, or fails to require evidence about learning, say so plainly.

Then produce:
- a concise status and confidence,
- a specific feedback summary,
- concrete improvements,
- the most important remaining issue,
- a polished revised activity that preserves good participant ideas,
- a realistic first-person response Jordan might give AFTER completing the improved reflection,
- an explanation of how Jordan's thinking changed.

The Jordan response should demonstrate metacognition, not merely a better grade or positive feeling.`;
}

async function submitS2Repair() {
  const text = document.getElementById('s2RepairText');
  const repair = text?.value.trim() || '';
  if (repair.length < 35) return;

  const data = getS2Data();
  data.attempts += 1;
  data.repairAttempts.push({ text: repair, timestamp: new Date().toISOString() });
  data.prompts.push(`S2 repair: ${repair}`);
  data.repairText = repair;

  const submit = document.getElementById('s2RepairSubmit');
  if (submit) submit.disabled = true;

  renderScenarioFeedback({
    panelId: 's2RepairFeedback',
    tone: 'developing',
    heading: 'Babbage is reviewing your repair.',
    text: 'The review compares your wording with Jordan’s actual metacognitive gap instead of scoring the prompt by length or polish.'
  });

  let review;
  try {
    const response = await requestBabbageAnalysis({
      analysis_type: 's2_review',
      max_output_tokens: 3000,
      system: pcS2BuildReviewSystemPrompt(data, repair),
      messages: [{ role: 'user', content: 'Review the faculty repair now.' }]
    }, 's2-review');

    review = response?.analysis || null;
    if (!review || !review.revised_activity || !review.student_response_after) throw new Error('Incomplete structured review.');
    data.aiProvider = response.provider || data.aiProvider || '';
    data.aiModel = response.model || data.aiModel || '';
    data.aiRequestId = response.request_id || data.aiRequestId || '';
    data.aiElapsedMs = response.elapsed_ms ?? data.aiElapsedMs;
    data.aiUsage = response.usage || data.aiUsage || null;
  } catch (error) {
    console.warn('[PromptCraft] S2 Babbage review unavailable; using local fallback.', error);
    review = { ...S2_LOCAL_REVIEW_FALLBACK };
    data.aiProvider = 'local-fallback';
    data.aiModel = 'promptcraft-local-fallback';
  }

  data.babbageReview = review;
  data.structuredAnalysis = { s2_draft: data.babbageDraft, s2_review: review };
  data.finalResponse = [
    review.feedback_summary,
    `Revised activity: ${review.revised_activity}`,
    `Jordan after: ${review.student_response_after}`
  ].join('\n\n');
  data.bestScore = Math.max(data.bestScore || 0, 5);
  data.currentScore = 5;
  data.oscqrLit = 'Metacognitive reflection; learner self-evaluation; future strategy transfer';

  renderS2FinalComparison();
}

function renderS2FinalComparison() {
  const data = getS2Data();
  const draft = data.babbageDraft || S2_LOCAL_DRAFT_FALLBACK;
  const review = data.babbageReview || S2_LOCAL_REVIEW_FALLBACK;
  const improvedItems = Array.isArray(review.what_improved) ? review.what_improved : [String(review.what_improved || '')];

  markScenarioComplete();
  saveIncrementalData(SCENARIO_INDEX.METACOGNITION);

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.METACOGNITION,
    progressHTML: buildScenarioProgressHTML({ steps: S2_PROGRESS_STEPS, activeIndex: 4, ariaLabel: 'Scenario 2 progress' }),
    contentHTML: `
      <section class="pc-s2-final" aria-labelledby="s2FinalTitle">
        <div class="pc-s2-final-header">
          <div class="pc-activity-kicker">Scenario 2 complete · Babbage review</div>
          <h2 id="s2FinalTitle">${esc(review.status)}</h2>
          <p>${esc(review.feedback_summary)}</p>
        </div>

        <div class="pc-s2-before-after">
          <article class="pc-s2-comparison-card">
            <span>BEFORE</span>
            <h3>Babbage's first draft</h3>
            <p>${esc(draft.activity_prompt)}</p>
            <blockquote>${esc(draft.likely_student_response)}</blockquote>
          </article>
          <article class="pc-s2-comparison-card is-after">
            <span>AFTER</span>
            <h3>Repaired activity</h3>
            <p>${esc(review.revised_activity)}</p>
            <blockquote>${esc(review.student_response_after)}</blockquote>
          </article>
        </div>

        <div class="pc-s2-review-grid">
          <article>
            <h3>What improved</h3>
            <ul>${improvedItems.filter(Boolean).map(item => `<li>${esc(item)}</li>`).join('')}</ul>
          </article>
          <article>
            <h3>Remaining limitation</h3>
            <p>${esc(review.remaining_issue)}</p>
          </article>
          <article>
            <h3>Why Jordan's thinking changed</h3>
            <p>${esc(review.why_student_thinking_changed)}</p>
          </article>
        </div>

        <div class="pc-feedback-actions pc-s2-final-actions">
          <button class="pc-button pc-button--secondary" type="button" data-pc-action="replay-scenario" data-pc-scenario-index="1">Replay Scenario 2</button>
          <button class="pc-button pc-button--primary" type="button" data-pc-action="open-main-menu" data-pc-panel="scenarios">Return to Scenario Select</button>
        </div>
      </section>`
  });
  document.querySelector('#inputContainer button')?.focus();
}

function pcGetLatestS2Selection(attemptKey) {
  const attempts = getS2Data()[attemptKey];
  const latest = Array.isArray(attempts) ? attempts[attempts.length - 1] : null;
  return Array.isArray(latest?.selection) ? [...latest.selection] : [];
}

pcRegisterUIActions({
  's2-retry-diagnosis': () => renderS2DiagnosisActivity(),
  's2-continue-evidence': () => {
    getS2Data().diagnosisFinal = pcGetLatestS2Selection('diagnosisAttempts');
    renderS2EvidenceActivity();
  },
  's2-retry-evidence': () => renderS2EvidenceActivity(),
  's2-opening-checkpoint': () => {
    const data = getS2Data();
    data.evidenceFinal = pcGetLatestS2Selection('evidenceAttempts');
    data.openingCheckpointReached = true;
    renderS2ThinkingMoveActivity();
  },
  's2-generate-draft': () => generateS2BabbageDraft(),
  's2-repair-draft': () => renderS2RepairActivity(),
  's3-diagnosis': () => renderS3DiagnosisActivity(),
  's3-choose-evidence': () => renderS3EvidenceActivity(),
  's3-build-babbage': () => generateS3BabbageDraft(),
  's3-repair-assessment': () => renderS3RepairActivity(),
  's4-diagnosis': () => renderS4DiagnosisActivity(),
  's4-name-function': () => renderS4FunctionActivity(),
  's4-build-babbage': () => generateS4BabbageDraft(),
  's4-repair-plan': () => renderS4RepairActivity(),
  's5-evidence': () => renderS5EvidenceActivity(),
  's5-choose-check': () => renderS5CheckActivity(),
  's5-build-brief': () => generateS5BabbageBrief(),
  's5-correct-claim': () => renderS5CorrectionActivity(),
  'replay-scenario': target => {
    const index = pcNormalizeScenarioIndex(target.dataset.pcScenarioIndex);
    return index === null ? false : switchScenario(index, pcGetScenarioTab(index));
  }
});



// ══════════════════════════════════════════════════════
//  SCENARIO 3 — AUTHENTIC ASSESSMENT
// ══════════════════════════════════════════════════════

const S3_PROGRESS_STEPS = [
  '1 Diagnose',
  '2 Choose evidence',
  '3 Build with Babbage',
  '4 Audit authenticity',
  '5 Repair & defend'
];

const S3_DIAGNOSIS_OPTIONS = [
  { id: 'content_gap', label: 'Students do not know the content well enough.' },
  { id: 'memory_only', label: 'The assessment mainly measures recognition and recall rather than use of the knowledge.' },
  { id: 'motivation', label: 'Students are not motivated to perform outside the quiz.' },
  { id: 'grading', label: 'The grading scale is too generous.' },
  { id: 'transfer_gap', label: 'The assessment does not require students to transfer knowledge into a realistic decision or performance.' },
  { id: 'time_pressure', label: 'Students simply need more time on the quiz.' }
];

const S3_EVIDENCE_OPTIONS = [
  { id: 'explain_terms', tag: 'RECALL', title: 'Explain the terminology', text: 'Students define the key concepts accurately in their own words.' },
  { id: 'select_action', tag: 'DECIDE', title: 'Choose and justify an action', text: 'Students make a decision in a realistic situation and justify it with course knowledge.' },
  { id: 'produce_artifact', tag: 'CREATE', title: 'Produce a usable artifact', text: 'Students create something a real audience could use, then explain the choices behind it.' },
  { id: 'more_questions', tag: 'QUIZ', title: 'Add more quiz questions', text: 'Students answer a larger number of recall and recognition questions.' },
  { id: 'critique_example', tag: 'CRITIQUE', title: 'Critique a realistic example', text: 'Students identify strengths and risks in a realistic case and recommend improvements.' },
  { id: 'self_report', tag: 'REPORT', title: 'Rate their confidence', text: 'Students report how confident they feel about the content after the unit.' }
];

const S3_AUDIT_OPTIONS = [
  { id: 'fake_audience', label: 'The audience is decorative. Students never actually have to adapt the work for that audience.' },
  { id: 'thin_decision', label: 'The task looks realistic, but students can complete it without making a meaningful disciplinary decision.' },
  { id: 'unclear_evidence', label: 'The task is authentic-looking, but it is unclear what observable evidence would demonstrate the intended learning.' },
  { id: 'over_scaffolded', label: 'The task scripts so many decisions that students have little authentic judgment left to exercise.' }
];

const S3_LOCAL_DRAFT_FALLBACK = {
  assessment_title: 'Client Communication Recommendation',
  student_role: 'Entry-level professional advising a client',
  audience: 'A client who needs a clear recommendation',
  task: 'Review a short workplace communication problem and recommend an appropriate response using the course concepts.',
  deliverable: 'A one-page recommendation memo',
  constraints: ['Use at least three course terms', 'Keep the memo under 500 words', 'Address the client directly'],
  success_evidence: ['Accurate use of course concepts', 'A recommendation connected to the scenario', 'A clear explanation of the reasoning'],
  deliberate_weakness: 'fake_audience',
  why_it_is_more_authentic: 'Students must apply the content to a realistic situation and produce a professional artifact rather than only recognize correct answers.',
  likely_student_behavior: 'Students may still write a generic school-style answer because the client audience does not actually shape the choices they make.'
};

const S3_LOCAL_REVIEW_FALLBACK = {
  status: 'AUTHENTICITY IMPROVED',
  confidence: 'MODERATE',
  feedback_summary: 'The repair increases the amount of student judgment and makes the evidence of learning more observable.',
  what_improved: [
    'Students must make and defend a decision rather than only repeat course language.',
    'The audience or constraints now influence the product instead of serving as decoration.'
  ],
  remaining_issue: 'The strongest next refinement would be to make the evaluation criteria explicitly distinguish disciplinary reasoning from surface polish.',
  final_assessment: 'Review the client scenario, choose a course of action, and produce a concise recommendation for the named client. Your recommendation must address the client’s constraints, use course concepts to justify the decision, and include a short rationale explaining one alternative you rejected and why.',
  alignment_rationale: 'The task makes the intended learning visible through an applied decision, justification, and consideration of alternatives. Those performances provide stronger evidence than a recall quiz alone.',
  student_evidence_of_learning: 'A student demonstrates learning by selecting a defensible action, adapting it to the client context, accurately using course concepts, and explaining why competing options were weaker.'
};

function getS3Data() {
  const data = scenarioData[SCENARIO_INDEX.ASSESSMENT];
  if (!Array.isArray(data.diagnosisAttempts)) data.diagnosisAttempts = [];
  if (!Array.isArray(data.evidenceAttempts)) data.evidenceAttempts = [];
  if (!Array.isArray(data.auditAttempts)) data.auditAttempts = [];
  if (!Array.isArray(data.repairAttempts)) data.repairAttempts = [];
  if (!data.babbageDraft || typeof data.babbageDraft !== 'object') data.babbageDraft = null;
  if (!data.babbageReview || typeof data.babbageReview !== 'object') data.babbageReview = null;
  return data;
}

function renderS3DiagnosisActivity() {
  const choicesHTML = buildScenarioChoiceCardsHTML({
    items: S3_DIAGNOSIS_OPTIONS,
    inputName: 's3-diagnosis',
    idPrefix: 's3-diagnosis'
  });

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.ASSESSMENT,
    progressHTML: buildScenarioProgressHTML({ steps: S3_PROGRESS_STEPS, activeIndex: 0, ariaLabel: 'Scenario 3 progress' }),
    contentHTML: `
      <div class="pc-s3-case-grid">
        <aside class="pc-s3-case-card">
          <div class="pc-activity-kicker">The evidence</div>
          <h2>Quiz scores are fine. Applied performance is not.</h2>
          <div class="pc-s3-evidence-list">
            <p><strong>Unit quiz average:</strong> 86%</p>
            <p><strong>Case activity one week later:</strong> Students can name the concepts but struggle to choose an appropriate response.</p>
            <p><strong>Instructor observation:</strong> “They know the vocabulary. They freeze when I ask what they would actually do.”</p>
          </div>
        </aside>
        ${buildScenarioTaskCardHTML({
          titleId: 's3DiagnosisTitle',
          kicker: 'Decision 1 · Diagnose the mismatch',
          title: 'What is the assessment problem?',
          instruction: 'Choose the two explanations that best account for the gap between quiz performance and applied performance.',
          choiceGridId: 's3DiagnosisChoices',
          choicesHTML,
          statusId: 's3DiagnosisStatus',
          submitId: 's3DiagnosisSubmit',
          submitLabel: 'Submit diagnosis',
          feedbackId: 's3DiagnosisFeedback'
        })}
      </div>`,
    focusSelector: 'input[name="s3-diagnosis"]'
  });

  wireExactSelection({
    rootId: 's3DiagnosisChoices',
    inputName: 's3-diagnosis',
    limit: 2,
    statusId: 's3DiagnosisStatus',
    submitId: 's3DiagnosisSubmit',
    onSubmit: submitS3Diagnosis
  });
}

function submitS3Diagnosis() {
  const selection = getCheckedValues('s3-diagnosis');
  if (selection.length !== 2) return;

  const data = getS3Data();
  const exact = selection.includes('memory_only') && selection.includes('transfer_gap');
  data.attempts += 1;
  data.diagnosisAttempts.push({ selection: [...selection], exact, timestamp: new Date().toISOString() });
  data.diagnosisFinal = [...selection];
  data.prompts.push(`S3 diagnosis: ${selection.join(', ')}`);

  disableScenarioChoices('s3-diagnosis', 's3DiagnosisSubmit');

  renderScenarioFeedback({
    panelId: 's3DiagnosisFeedback',
    tone: exact ? 'strong' : 'developing',
    heading: exact ? 'You found the assessment mismatch.' : 'You found part of the problem.',
    text: exact
      ? 'The quiz shows that students can recognize or recall the content, but it does not require transfer. The applied task exposes the missing performance: choosing what to do and justifying that decision in context.'
      : 'The strongest evidence points to two connected issues: the assessment mostly rewards memory, and students are not being asked to transfer the knowledge into a realistic decision.',
    actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s3-choose-evidence">Choose better evidence →</button>'
  });
}

function renderS3EvidenceActivity() {
  const choicesHTML = buildScenarioChoiceCardsHTML({
    items: S3_EVIDENCE_OPTIONS,
    inputName: 's3-evidence',
    idPrefix: 's3-evidence',
    variant: 'detail',
    marker: item => item.tag
  });

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.ASSESSMENT,
    progressHTML: buildScenarioProgressHTML({ steps: S3_PROGRESS_STEPS, activeIndex: 1, ariaLabel: 'Scenario 3 progress' }),
    contentHTML: buildScenarioTaskCardHTML({
      titleId: 's3EvidenceTitle',
      kicker: 'Decision 2 · Choose authentic evidence',
      title: 'What would convince you that students can actually use the learning?',
      instruction: 'Choose three forms of evidence that require application, judgment, or creation rather than simply more recall.',
      choiceGridId: 's3EvidenceChoices',
      choicesHTML,
      statusId: 's3EvidenceStatus',
      submitId: 's3EvidenceSubmit',
      submitLabel: 'Lock in the evidence',
      feedbackId: 's3EvidenceFeedback',
      gridClass: 'pc-choice-grid--three'
    }),
    focusSelector: 'input[name="s3-evidence"]'
  });

  wireExactSelection({
    rootId: 's3EvidenceChoices',
    inputName: 's3-evidence',
    limit: 3,
    statusId: 's3EvidenceStatus',
    submitId: 's3EvidenceSubmit',
    onSubmit: submitS3Evidence
  });
}

function submitS3Evidence() {
  const selection = getCheckedValues('s3-evidence');
  if (selection.length !== 3) return;

  const strongIds = ['select_action', 'produce_artifact', 'critique_example'];
  const exact = strongIds.every(id => selection.includes(id));
  const data = getS3Data();
  data.attempts += 1;
  data.evidenceAttempts.push({ selection: [...selection], exact, timestamp: new Date().toISOString() });
  data.evidenceFinal = [...selection];
  data.prompts.push(`S3 evidence: ${selection.join(', ')}`);

  disableScenarioChoices('s3-evidence', 's3EvidenceSubmit');

  renderScenarioFeedback({
    panelId: 's3EvidenceFeedback',
    tone: exact ? 'strong' : 'developing',
    heading: exact ? 'Those choices make the learning visible.' : 'Some of that evidence is stronger than the rest.',
    text: exact
      ? 'A decision, a usable artifact, and a critique all force students to do something with the knowledge. That gives you observable evidence of transfer rather than another proxy for memory.'
      : 'Authentic evidence should reveal how students decide, create, adapt, or critique in context. Confidence ratings and additional recall questions may be useful elsewhere, but they do not solve this assessment mismatch.',
    actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s3-build-babbage">Ask Babbage to redesign the assessment →</button>'
  });
}

function pcS3DraftSystemPrompt(data) {
  const selected = (data.evidenceFinal || []).map(id => {
    const item = S3_EVIDENCE_OPTIONS.find(option => option.id === id);
    return item ? item.title : id;
  }).join(', ');

  return `You are Babbage, PromptCraft's instructional-design analysis engine.

SCENARIO 3: AUTHENTIC ASSESSMENT

Problem:
Students average 86% on a recall-heavy unit quiz but struggle one week later to use the same concepts in a realistic case. The instructor says: "They know the vocabulary. They freeze when I ask what they would actually do."

The participant selected these desired forms of evidence:
${selected || 'applied decision-making and a usable product'}

Create a concise authentic-assessment redesign. It should require a realistic role, audience, applied decision, and observable evidence of learning.

However, deliberately include exactly ONE subtle authenticity weakness for the participant to audit:
- fake_audience: name a realistic audience, but the audience does not actually affect the student's choices or product.
- thin_decision: the task looks realistic but the student can complete it without a meaningful disciplinary decision.
- unclear_evidence: the activity looks authentic, but the evidence that would demonstrate the intended learning is vague.
- over_scaffolded: the task scripts the process so tightly that the student has little meaningful judgment left.

Do not announce the weakness in the task itself. Make the design plausible enough that an instructor might initially accept it.`;
}

function renderS3BabbageLoading() {
  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.ASSESSMENT,
    progressHTML: buildScenarioProgressHTML({ steps: S3_PROGRESS_STEPS, activeIndex: 2, ariaLabel: 'Scenario 3 progress' }),
    contentHTML: `
      <section class="pc-activity-card pc-s3-engine-card" aria-live="polite">
        <div class="pc-activity-kicker">Babbage Engine</div>
        <h2>Transforming the assessment</h2>
        <p>Babbage is building an applied task from the evidence you selected.</p>
        <div class="pc-s2-engine-progress" role="progressbar" aria-label="Babbage assessment generation in progress">
          <span></span>
        </div>
        <p class="pc-s2-engine-note">The redesign will contain one subtle flaw. Authentic-looking is not automatically authentic.</p>
      </section>`
  });
}

async function generateS3BabbageDraft() {
  const data = getS3Data();
  renderS3BabbageLoading();

  let draft;
  try {
    const response = await requestBabbageAnalysis({
      analysis_type: 's3_draft',
      max_output_tokens: 2600,
      system: pcS3DraftSystemPrompt(data),
      messages: [{ role: 'user', content: 'Generate the authentic-assessment draft now.' }]
    }, 's3-draft');

    draft = response?.analysis || null;
    if (!draft || !draft.task || !draft.deliberate_weakness) throw new Error('Incomplete Scenario 3 draft.');
    data.aiProvider = response.provider || '';
    data.aiModel = response.model || '';
    data.aiRequestId = response.request_id || '';
    data.aiElapsedMs = response.elapsed_ms ?? '';
    data.aiUsage = response.usage || null;
  } catch (error) {
    console.warn('[PromptCraft] S3 Babbage draft unavailable; using local fallback.', error);
    draft = { ...S3_LOCAL_DRAFT_FALLBACK };
    data.aiProvider = 'local-fallback';
    data.aiModel = 'promptcraft-local-fallback';
  }

  data.babbageDraft = draft;
  data.structuredAnalysis = { s3_draft: draft };
  data.finalResponse = draft.task;
  renderS3AuditActivity();
}

function renderS3AuditActivity() {
  const data = getS3Data();
  const draft = data.babbageDraft || S3_LOCAL_DRAFT_FALLBACK;
  const choicesHTML = buildScenarioChoiceCardsHTML({
    items: S3_AUDIT_OPTIONS,
    inputName: 's3-audit',
    idPrefix: 's3-audit'
  });

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.ASSESSMENT,
    progressHTML: buildScenarioProgressHTML({ steps: S3_PROGRESS_STEPS, activeIndex: 3, ariaLabel: 'Scenario 3 progress' }),
    contentHTML: `
      <div class="pc-s3-audit-layout">
        <aside class="pc-s3-assessment-draft" aria-label="Babbage authentic assessment draft">
          <div class="pc-activity-kicker">Babbage draft</div>
          <h2>${esc(draft.assessment_title)}</h2>
          <dl class="pc-s3-draft-details">
            <div><dt>Student role</dt><dd>${esc(draft.student_role)}</dd></div>
            <div><dt>Audience</dt><dd>${esc(draft.audience)}</dd></div>
            <div><dt>Task</dt><dd>${esc(draft.task)}</dd></div>
            <div><dt>Deliverable</dt><dd>${esc(draft.deliverable)}</dd></div>
          </dl>
          <h3>Constraints</h3>
          <ul>${(draft.constraints || []).map(item => `<li>${esc(item)}</li>`).join('')}</ul>
          <h3>Evidence Babbage expects</h3>
          <ul>${(draft.success_evidence || []).map(item => `<li>${esc(item)}</li>`).join('')}</ul>
        </aside>
        ${buildScenarioTaskCardHTML({
          titleId: 's3AuditTitle',
          kicker: 'Decision 4 · Audit authenticity',
          title: 'What is the most important weakness in this redesign?',
          instruction: 'Choose the flaw that most limits whether this task really measures applied learning.',
          choiceGridId: 's3AuditChoices',
          choicesHTML,
          statusId: 's3AuditStatus',
          submitId: 's3AuditSubmit',
          submitLabel: 'Audit the redesign',
          feedbackId: 's3AuditFeedback'
        })}
      </div>`,
    focusSelector: 'input[name="s3-audit"]'
  });

  wireExactSelection({
    rootId: 's3AuditChoices',
    inputName: 's3-audit',
    limit: 1,
    statusId: 's3AuditStatus',
    submitId: 's3AuditSubmit',
    onSubmit: submitS3Audit
  });
}

function submitS3Audit() {
  const selection = getCheckedValues('s3-audit');
  if (selection.length !== 1) return;

  const selected = selection[0];
  const data = getS3Data();
  const draft = data.babbageDraft || S3_LOCAL_DRAFT_FALLBACK;
  const exact = selected === draft.deliberate_weakness;

  data.attempts += 1;
  data.auditAttempts.push({ selection: selected, exact, weakness: draft.deliberate_weakness, timestamp: new Date().toISOString() });
  data.prompts.push(`S3 audit: ${selected}`);

  disableScenarioChoices('s3-audit', 's3AuditSubmit');

  const correctLabel = S3_AUDIT_OPTIONS.find(item => item.id === draft.deliberate_weakness)?.label || draft.deliberate_weakness;
  renderScenarioFeedback({
    panelId: 's3AuditFeedback',
    tone: exact ? 'strong' : 'developing',
    heading: exact ? 'You found the authenticity leak.' : 'That concern matters, but one weakness is more structural.',
    text: exact
      ? `You identified the flaw Babbage intentionally built into the redesign. ${draft.likely_student_behavior}`
      : `The most consequential weakness in this draft is: ${correctLabel} ${draft.likely_student_behavior}`,
    actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s3-repair-assessment">Repair the assessment →</button>'
  });
}

function renderS3RepairActivity() {
  const data = getS3Data();
  const draft = data.babbageDraft || S3_LOCAL_DRAFT_FALLBACK;

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.ASSESSMENT,
    progressHTML: buildScenarioProgressHTML({ steps: S3_PROGRESS_STEPS, activeIndex: 4, ariaLabel: 'Scenario 3 progress' }),
    contentHTML: `
      <div class="pc-s3-repair-layout">
        <aside class="pc-s3-assessment-draft is-compact">
          <div class="pc-activity-kicker">Current redesign</div>
          <h3>${esc(draft.assessment_title)}</h3>
          <p><strong>Task:</strong> ${esc(draft.task)}</p>
          <p><strong>Audience:</strong> ${esc(draft.audience)}</p>
          <p><strong>Deliverable:</strong> ${esc(draft.deliverable)}</p>
        </aside>

        <section class="pc-activity-card" aria-labelledby="s3RepairTitle">
          <div class="pc-activity-kicker">Decision 5 · Repair & defend</div>
          <h2 id="s3RepairTitle">Fix the weakness without turning the task back into a quiz.</h2>
          <p class="pc-activity-instruction">Rewrite or add the part that will make the intended learning genuinely observable. Your repair can change the audience, decision, constraints, deliverable, or evidence criteria.</p>

          <label class="pc-s3-repair-label" for="s3RepairText">Your repair</label>
          <textarea id="s3RepairText" class="pc-s3-repair-textarea" rows="7" maxlength="2200" placeholder="Describe the repair you would make..."></textarea>

          <label class="pc-s3-repair-label" for="s3EvidenceText">What evidence would prove the student learned the intended skill?</label>
          <textarea id="s3EvidenceText" class="pc-s3-repair-textarea is-short" rows="4" maxlength="1200" placeholder="Name the observable evidence you would evaluate..."></textarea>

          <div class="pc-selection-bar">
            <span id="s3RepairStatus" role="status" aria-live="polite">Add both the repair and the evidence.</span>
            <button class="pc-button pc-button--primary" id="s3RepairSubmit" type="button" disabled>Ask Babbage to review the assessment</button>
          </div>
          <div id="s3RepairFeedback" aria-live="polite"></div>
        </section>
      </div>`,
    focusSelector: '#s3RepairText'
  });

  const repair = document.getElementById('s3RepairText');
  const evidence = document.getElementById('s3EvidenceText');
  const status = document.getElementById('s3RepairStatus');
  const submit = document.getElementById('s3RepairSubmit');

  const update = () => {
    const r = repair.value.trim();
    const e = evidence.value.trim();
    const ready = r.length >= 35 && e.length >= 25;
    status.textContent = ready ? 'Repair ready for Babbage review.' : `${r.length} repair characters · ${e.length} evidence characters`;
    submit.disabled = !ready;
  };

  repair.addEventListener('input', update);
  evidence.addEventListener('input', update);
  submit.addEventListener('click', submitS3Repair, { once: true });
  update();
}

function pcS3ReviewSystemPrompt(data, repairText, evidenceText) {
  const draft = data.babbageDraft || S3_LOCAL_DRAFT_FALLBACK;

  return `You are Babbage, PromptCraft's instructional-design analysis engine.

SCENARIO 3: AUTHENTIC ASSESSMENT

Learning problem:
Students score well on recall questions but struggle to use the same concepts in a realistic case.

Original Babbage redesign:
Title: ${draft.assessment_title}
Role: ${draft.student_role}
Audience: ${draft.audience}
Task: ${draft.task}
Deliverable: ${draft.deliverable}
Known weakness: ${draft.deliberate_weakness}

Faculty repair:
${repairText}

Faculty description of the evidence of learning:
${evidenceText}

Evaluate the repair specifically. Do not reward realism for its own sake. An authentic assessment must make the intended learning visible through meaningful student judgment, application, creation, critique, or transfer.

If the repair is vague, cosmetic, contradictory, or still permits students to succeed through superficial performance, say so.

Produce:
- a status and confidence,
- a specific feedback summary,
- concrete improvements,
- the most important remaining issue,
- a polished final assessment,
- a rationale explaining how the task aligns with the intended learning,
- a clear description of observable student evidence that would demonstrate learning.

Preserve strong participant ideas rather than replacing them without explanation.`;
}

async function submitS3Repair() {
  const repairText = document.getElementById('s3RepairText')?.value.trim() || '';
  const evidenceText = document.getElementById('s3EvidenceText')?.value.trim() || '';
  if (repairText.length < 35 || evidenceText.length < 25) return;

  const data = getS3Data();
  data.attempts += 1;
  data.repairText = repairText;
  data.evidenceStatement = evidenceText;
  data.repairAttempts.push({ repairText, evidenceText, timestamp: new Date().toISOString() });
  data.prompts.push(`S3 repair: ${repairText}`);
  data.prompts.push(`S3 evidence statement: ${evidenceText}`);

  const submit = document.getElementById('s3RepairSubmit');
  if (submit) submit.disabled = true;

  renderScenarioFeedback({
    panelId: 's3RepairFeedback',
    tone: 'developing',
    heading: 'Babbage is reviewing the evidence, not just the realism.',
    text: 'A workplace role or fancy deliverable is not enough. The review checks whether the task actually makes the intended learning observable.'
  });

  let review;
  try {
    const response = await requestBabbageAnalysis({
      analysis_type: 's3_review',
      max_output_tokens: 3400,
      system: pcS3ReviewSystemPrompt(data, repairText, evidenceText),
      messages: [{ role: 'user', content: 'Review the repaired authentic assessment now.' }]
    }, 's3-review');

    review = response?.analysis || null;
    if (!review || !review.final_assessment || !review.student_evidence_of_learning) throw new Error('Incomplete Scenario 3 review.');

    data.aiProvider = response.provider || data.aiProvider || '';
    data.aiModel = response.model || data.aiModel || '';
    data.aiRequestId = response.request_id || data.aiRequestId || '';
    data.aiElapsedMs = response.elapsed_ms ?? data.aiElapsedMs;
    data.aiUsage = response.usage || data.aiUsage || null;
  } catch (error) {
    console.warn('[PromptCraft] S3 Babbage review unavailable; using local fallback.', error);
    review = { ...S3_LOCAL_REVIEW_FALLBACK };
    data.aiProvider = 'local-fallback';
    data.aiModel = 'promptcraft-local-fallback';
  }

  data.babbageReview = review;
  data.structuredAnalysis = { s3_draft: data.babbageDraft, s3_review: review };
  data.finalResponse = [
    review.feedback_summary,
    `Final assessment: ${review.final_assessment}`,
    `Evidence of learning: ${review.student_evidence_of_learning}`
  ].join('\n\n');
  data.bestScore = Math.max(data.bestScore || 0, 5);
  data.currentScore = 5;
  data.oscqrLit = 'Authentic assessment; applied learning; observable evidence; transfer';

  renderS3FinalComparison();
}

function renderS3FinalComparison() {
  const data = getS3Data();
  const review = data.babbageReview || S3_LOCAL_REVIEW_FALLBACK;
  const improvements = Array.isArray(review.what_improved) ? review.what_improved : [String(review.what_improved || '')];

  markScenarioComplete();
  saveIncrementalData(SCENARIO_INDEX.ASSESSMENT);

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.ASSESSMENT,
    progressHTML: buildScenarioProgressHTML({ steps: S3_PROGRESS_STEPS, activeIndex: 4, ariaLabel: 'Scenario 3 progress' }),
    contentHTML: `
      <section class="pc-s3-final" aria-labelledby="s3FinalTitle">
        <div class="pc-s3-final-header">
          <div class="pc-activity-kicker">Scenario 3 complete · Babbage review</div>
          <h2 id="s3FinalTitle">${esc(review.status)}</h2>
          <p>${esc(review.feedback_summary)}</p>
        </div>

        <div class="pc-s3-before-after">
          <article class="pc-s3-comparison-card">
            <span>ORIGINAL MEASURE</span>
            <h3>Recall-heavy quiz</h3>
            <p>Students recognize definitions and choose correct examples. Average score: 86%.</p>
            <p class="pc-s3-consequence">What remains hidden: whether students can decide what to do with the knowledge.</p>
          </article>
          <article class="pc-s3-comparison-card is-after">
            <span>FINAL PERFORMANCE</span>
            <h3>Authentic assessment</h3>
            <p>${esc(review.final_assessment)}</p>
          </article>
        </div>

        <div class="pc-s3-evidence-callout">
          <div class="pc-activity-kicker">Observable evidence of learning</div>
          <p>${esc(review.student_evidence_of_learning)}</p>
        </div>

        <div class="pc-s3-review-grid">
          <article>
            <h3>What improved</h3>
            <ul>${improvements.filter(Boolean).map(item => `<li>${esc(item)}</li>`).join('')}</ul>
          </article>
          <article>
            <h3>Remaining limitation</h3>
            <p>${esc(review.remaining_issue)}</p>
          </article>
          <article>
            <h3>Why it aligns</h3>
            <p>${esc(review.alignment_rationale)}</p>
          </article>
        </div>

        <div class="pc-feedback-actions pc-s3-final-actions">
          <button class="pc-button pc-button--secondary" type="button" data-pc-action="replay-scenario" data-pc-scenario-index="2">Replay Scenario 3</button>
          <button class="pc-button pc-button--primary" type="button" data-pc-action="open-main-menu" data-pc-panel="scenarios">Return to Scenario Select</button>
        </div>
      </section>`
  });

  document.querySelector('#inputContainer button')?.focus();
}



// ══════════════════════════════════════════════════════
//  SCENARIO 4 — SYNCHRONOUS BIAS
// ══════════════════════════════════════════════════════

const S4_PROGRESS_STEPS = [
  '1 Diagnose',
  '2 Name the function',
  '3 Build with Babbage',
  '4 Audit equivalence',
  '5 Repair the plan'
];

const S4_DIAGNOSIS_OPTIONS = [
  { id: 'attendance_equals_engagement', label: 'The design treats being present at a live meeting as evidence of engagement.' },
  { id: 'students_need_discipline', label: 'Students mainly need stricter attendance expectations.' },
  { id: 'interaction_requires_live', label: 'The design assumes meaningful interaction can only happen synchronously.' },
  { id: 'recordings_fix_access', label: 'Posting a recording automatically creates equivalent access for students who miss the session.' },
  { id: 'technology_problem', label: 'The only real issue is whether students have a webcam and microphone.' },
  { id: 'instructor_preference', label: 'The instructor prefers live teaching, so the live format should remain the default requirement.' }
];

const S4_FUNCTION_OPTIONS = [
  { id: 'practice_feedback', tag: 'PRACTICE', title: 'Practice with feedback', text: 'Students try a skill, receive feedback, and revise their approach.' },
  { id: 'peer_exchange', tag: 'PEERS', title: 'Peer exchange', text: 'Students encounter other perspectives and respond to one another’s reasoning.' },
  { id: 'clarify_confusion', tag: 'CLARIFY', title: 'Clarify confusion', text: 'Students surface misconceptions and get targeted clarification.' },
  { id: 'attendance', tag: 'ATTEND', title: 'Be present at a set time', text: 'Students demonstrate participation by appearing in the live room.' },
  { id: 'social_presence', tag: 'SOCIAL', title: 'Build social presence', text: 'Students see classmates and feel connected to a learning community.' },
  { id: 'watch_instructor', tag: 'WATCH', title: 'Watch the instructor explain', text: 'Students receive information directly from the instructor in real time.' }
];

const S4_AUDIT_OPTIONS = [
  { id: 'recording_only', label: 'The “asynchronous option” is only a recording, so students can observe the interaction but cannot participate in it.' },
  { id: 'unequal_path', label: 'The asynchronous path exists, but it is clearly lower-value, more work, or less connected to feedback than the live path.' },
  { id: 'hidden_live_requirement', label: 'The plan claims flexibility, but an important graded step still quietly requires live attendance.' },
  { id: 'fragile_tech', label: 'Both paths depend on technology or bandwidth that may reproduce the same access barrier in a different form.' }
];

const S4_LOCAL_DRAFT_FALLBACK = {
  plan_title: 'Choose Your Participation Path',
  essential_learning_function: 'Peer exchange and feedback on reasoning',
  synchronous_path: 'Attend the live 45-minute discussion, respond to two classmates, and revise one idea before the session ends.',
  asynchronous_path: 'Watch the session recording and submit a short reflection about two comments you found useful.',
  evidence_of_learning: ['Responds to peer reasoning', 'Uses feedback to revise an idea', 'Explains the reason for the revision'],
  deliberate_weakness: 'recording_only',
  why_the_plan_looks_fair: 'Both groups receive access to the same discussion content and complete a follow-up activity.',
  likely_student_consequence: 'Students who cannot attend live are still positioned as observers. They never contribute reasoning for peers to respond to, so the two paths do not provide equivalent interaction.'
};

const S4_LOCAL_REVIEW_FALLBACK = {
  status: 'EQUIVALENCE IMPROVED',
  confidence: 'MODERATE',
  feedback_summary: 'The repair shifts the design from “live versus substitute work” toward two paths that can demonstrate the same learning function.',
  what_improved: [
    'The asynchronous path now requires contribution and response rather than passive viewing.',
    'Both paths generate comparable evidence of peer interaction and revision.'
  ],
  remaining_issue: 'The next refinement would be to make the timing window and response expectations explicit enough that asynchronous participants can reliably receive peer feedback.',
  final_participation_plan: 'Students may choose a live discussion or an asynchronous discussion window. In either path, each student posts or states an initial response, engages with at least two peers’ reasoning, receives or uses feedback, and submits a short revision explaining what changed and why.',
  equivalence_rationale: 'The two paths differ in timing, not in the essential learning work. Both require contribution, peer exchange, feedback, and revision.',
  observable_evidence: 'Evidence includes an initial contribution, substantive responses to peers, a revised idea, and a brief explanation connecting the revision to feedback.'
};

function getS4Data() {
  const data = scenarioData[SCENARIO_INDEX.SYNC];
  if (!Array.isArray(data.diagnosisAttempts)) data.diagnosisAttempts = [];
  if (!Array.isArray(data.functionAttempts)) data.functionAttempts = [];
  if (!Array.isArray(data.auditAttempts)) data.auditAttempts = [];
  if (!Array.isArray(data.repairAttempts)) data.repairAttempts = [];
  if (!data.babbageDraft || typeof data.babbageDraft !== 'object') data.babbageDraft = null;
  if (!data.babbageReview || typeof data.babbageReview !== 'object') data.babbageReview = null;
  return data;
}

function renderS4DiagnosisActivity() {
  const choicesHTML = buildScenarioChoiceCardsHTML({
    items: S4_DIAGNOSIS_OPTIONS,
    inputName: 's4-diagnosis',
    idPrefix: 's4-diagnosis'
  });

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.SYNC,
    progressHTML: buildScenarioProgressHTML({ steps: S4_PROGRESS_STEPS, activeIndex: 0, ariaLabel: 'Scenario 4 progress' }),
    contentHTML: `
      <div class="pc-s4-case-grid">
        <aside class="pc-s4-case-card">
          <div class="pc-activity-kicker">The course pattern</div>
          <h2>One required live session every week</h2>
          <div class="pc-s4-student-notes">
            <p><strong>Student A:</strong> Works evenings and can only attend about half of the sessions.</p>
            <p><strong>Student B:</strong> Uses captions and needs more processing time before responding.</p>
            <p><strong>Student C:</strong> Has unstable rural internet and often loses audio during video calls.</p>
            <p><strong>Instructor:</strong> “I need the live sessions because that’s where the real interaction happens.”</p>
          </div>
        </aside>
        ${buildScenarioTaskCardHTML({
          titleId: 's4DiagnosisTitle',
          kicker: 'Decision 1 · Diagnose the bias',
          title: 'What assumptions are causing the access problem?',
          instruction: 'Choose the two assumptions that most directly turn a useful live activity into a synchronous-attendance requirement.',
          choiceGridId: 's4DiagnosisChoices',
          choicesHTML,
          statusId: 's4DiagnosisStatus',
          submitId: 's4DiagnosisSubmit',
          submitLabel: 'Submit diagnosis',
          feedbackId: 's4DiagnosisFeedback'
        })}
      </div>`,
    focusSelector: 'input[name="s4-diagnosis"]'
  });

  wireExactSelection({
    rootId: 's4DiagnosisChoices',
    inputName: 's4-diagnosis',
    limit: 2,
    statusId: 's4DiagnosisStatus',
    submitId: 's4DiagnosisSubmit',
    onSubmit: submitS4Diagnosis
  });
}

function submitS4Diagnosis() {
  const selection = getCheckedValues('s4-diagnosis');
  if (selection.length !== 2) return;

  const data = getS4Data();
  const exact = selection.includes('attendance_equals_engagement') && selection.includes('interaction_requires_live');
  data.attempts += 1;
  data.diagnosisAttempts.push({ selection: [...selection], exact, timestamp: new Date().toISOString() });
  data.diagnosisFinal = [...selection];
  data.prompts.push(`S4 diagnosis: ${selection.join(', ')}`);

  disableScenarioChoices('s4-diagnosis', 's4DiagnosisSubmit');

  renderScenarioFeedback({
    panelId: 's4DiagnosisFeedback',
    tone: exact ? 'strong' : 'developing',
    heading: exact ? 'You separated the learning goal from the delivery habit.' : 'You found part of the access problem.',
    text: exact
      ? 'The design is treating synchronous attendance as the same thing as interaction. The instructional value may be real, but the clock is not the learning objective.'
      : 'Technology matters, but the deeper design problem is the assumption that meaningful interaction requires everyone to be present at the same moment and that attendance itself proves engagement.',
    actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s4-name-function">Name the learning function →</button>'
  });
}

function renderS4FunctionActivity() {
  const choicesHTML = buildScenarioChoiceCardsHTML({
    items: S4_FUNCTION_OPTIONS,
    inputName: 's4-function',
    idPrefix: 's4-function',
    variant: 'detail',
    marker: item => item.tag
  });

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.SYNC,
    progressHTML: buildScenarioProgressHTML({ steps: S4_PROGRESS_STEPS, activeIndex: 1, ariaLabel: 'Scenario 4 progress' }),
    contentHTML: buildScenarioTaskCardHTML({
      titleId: 's4FunctionTitle',
      kicker: 'Decision 2 · Name the function',
      title: 'What is the live session actually supposed to accomplish?',
      instruction: 'Choose three functions worth preserving. Do not choose the scheduling habit itself.',
      choiceGridId: 's4FunctionChoices',
      choicesHTML,
      statusId: 's4FunctionStatus',
      submitId: 's4FunctionSubmit',
      submitLabel: 'Preserve these functions',
      feedbackId: 's4FunctionFeedback',
      gridClass: 'pc-choice-grid--three'
    }),
    focusSelector: 'input[name="s4-function"]'
  });

  wireExactSelection({
    rootId: 's4FunctionChoices',
    inputName: 's4-function',
    limit: 3,
    statusId: 's4FunctionStatus',
    submitId: 's4FunctionSubmit',
    onSubmit: submitS4Function
  });
}

function submitS4Function() {
  const selection = getCheckedValues('s4-function');
  if (selection.length !== 3) return;

  const strongest = ['practice_feedback', 'peer_exchange', 'clarify_confusion'];
  const exact = strongest.every(id => selection.includes(id));
  const data = getS4Data();
  data.attempts += 1;
  data.functionAttempts.push({ selection: [...selection], exact, timestamp: new Date().toISOString() });
  data.functionFinal = [...selection];
  data.prompts.push(`S4 learning functions: ${selection.join(', ')}`);

  disableScenarioChoices('s4-function', 's4FunctionSubmit');

  renderScenarioFeedback({
    panelId: 's4FunctionFeedback',
    tone: exact ? 'strong' : 'developing',
    heading: exact ? 'Those are functions worth preserving.' : 'Some of those are goals; some are delivery habits.',
    text: exact
      ? 'Practice with feedback, peer exchange, and clarification can happen live, but none of them inherently require a single meeting time. That gives you room to design equivalent participation.'
      : 'The strongest targets are the things students do with one another and with feedback. Being present and watching an explanation can be useful, but they are not equivalent to the learning function itself.',
    actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s4-build-babbage">Ask Babbage to design two participation paths →</button>'
  });
}

function pcS4DraftSystemPrompt(data) {
  const functions = (data.functionFinal || []).map(id => {
    const item = S4_FUNCTION_OPTIONS.find(option => option.id === id);
    return item ? item.title : id;
  }).join(', ');

  return `You are Babbage, PromptCraft's instructional-design analysis engine.

SCENARIO 4: SYNCHRONOUS BIAS

Context:
An online course requires a weekly live session. Several students have work schedules, captioning/processing needs, or unstable rural internet. The instructor values the session because it produces interaction.

The participant identified these learning functions to preserve:
${functions || 'peer exchange, feedback, and clarification'}

Create a concise participation plan with:
- one synchronous path,
- one asynchronous path,
- observable evidence of learning that both paths should generate.

Deliberately include exactly ONE subtle equivalence weakness for the participant to audit:
- recording_only: the asynchronous option is mostly watching a recording rather than contributing.
- unequal_path: the asynchronous path exists but is clearly lower-value, more work, or less connected to feedback.
- hidden_live_requirement: the plan claims flexibility but still requires an important live step.
- fragile_tech: both paths rely on technology or bandwidth likely to reproduce the same access barrier.

Do not announce the weakness in the plan. Make the design look reasonable enough that an instructor might initially call it flexible.`;
}

function renderS4BabbageLoading() {
  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.SYNC,
    progressHTML: buildScenarioProgressHTML({ steps: S4_PROGRESS_STEPS, activeIndex: 2, ariaLabel: 'Scenario 4 progress' }),
    contentHTML: `
      <section class="pc-activity-card pc-s4-engine-card" aria-live="polite">
        <div class="pc-activity-kicker">Babbage Engine</div>
        <h2>Building two participation paths</h2>
        <p>Babbage is trying to preserve the learning function while loosening the time requirement.</p>
        <div class="pc-s2-engine-progress" role="progressbar" aria-label="Babbage participation-plan generation in progress">
          <span></span>
        </div>
        <p class="pc-s2-engine-note">The plan will include one subtle inequity. Flexibility written in a heading is not the same thing as equivalent participation.</p>
      </section>`
  });
}

async function generateS4BabbageDraft() {
  const data = getS4Data();
  renderS4BabbageLoading();

  let draft;
  try {
    const response = await requestBabbageAnalysis({
      analysis_type: 's4_draft',
      max_output_tokens: 2600,
      system: pcS4DraftSystemPrompt(data),
      messages: [{ role: 'user', content: 'Generate the two-path participation plan now.' }]
    }, 's4-draft');

    draft = response?.analysis || null;
    if (!draft || !draft.synchronous_path || !draft.asynchronous_path || !draft.deliberate_weakness) {
      throw new Error('Incomplete Scenario 4 draft.');
    }

    data.aiProvider = response.provider || '';
    data.aiModel = response.model || '';
    data.aiRequestId = response.request_id || '';
    data.aiElapsedMs = response.elapsed_ms ?? '';
    data.aiUsage = response.usage || null;
  } catch (error) {
    console.warn('[PromptCraft] S4 Babbage draft unavailable; using local fallback.', error);
    draft = { ...S4_LOCAL_DRAFT_FALLBACK };
    data.aiProvider = 'local-fallback';
    data.aiModel = 'promptcraft-local-fallback';
  }

  data.babbageDraft = draft;
  data.structuredAnalysis = { s4_draft: draft };
  data.finalResponse = `${draft.synchronous_path}\n\n${draft.asynchronous_path}`;
  renderS4AuditActivity();
}

function renderS4AuditActivity() {
  const data = getS4Data();
  const draft = data.babbageDraft || S4_LOCAL_DRAFT_FALLBACK;
  const choicesHTML = buildScenarioChoiceCardsHTML({
    items: S4_AUDIT_OPTIONS,
    inputName: 's4-audit',
    idPrefix: 's4-audit'
  });

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.SYNC,
    progressHTML: buildScenarioProgressHTML({ steps: S4_PROGRESS_STEPS, activeIndex: 3, ariaLabel: 'Scenario 4 progress' }),
    contentHTML: `
      <div class="pc-s4-audit-layout">
        <aside class="pc-s4-plan-card" aria-label="Babbage participation plan">
          <div class="pc-activity-kicker">Babbage draft</div>
          <h2>${esc(draft.plan_title)}</h2>
          <p><strong>Essential function:</strong> ${esc(draft.essential_learning_function)}</p>
          <div class="pc-s4-path-grid">
            <section>
              <span>LIVE PATH</span>
              <p>${esc(draft.synchronous_path)}</p>
            </section>
            <section>
              <span>ASYNC PATH</span>
              <p>${esc(draft.asynchronous_path)}</p>
            </section>
          </div>
          <h3>Evidence Babbage expects from either path</h3>
          <ul>${(draft.evidence_of_learning || []).map(item => `<li>${esc(item)}</li>`).join('')}</ul>
        </aside>
        ${buildScenarioTaskCardHTML({
          titleId: 's4AuditTitle',
          kicker: 'Decision 4 · Audit equivalence',
          title: 'Where does the “flexible” plan still break?',
          instruction: 'Choose the weakness that most undermines equivalent participation.',
          choiceGridId: 's4AuditChoices',
          choicesHTML,
          statusId: 's4AuditStatus',
          submitId: 's4AuditSubmit',
          submitLabel: 'Audit the plan',
          feedbackId: 's4AuditFeedback'
        })}
      </div>`,
    focusSelector: 'input[name="s4-audit"]'
  });

  wireExactSelection({
    rootId: 's4AuditChoices',
    inputName: 's4-audit',
    limit: 1,
    statusId: 's4AuditStatus',
    submitId: 's4AuditSubmit',
    onSubmit: submitS4Audit
  });
}

function submitS4Audit() {
  const selection = getCheckedValues('s4-audit');
  if (selection.length !== 1) return;

  const selected = selection[0];
  const data = getS4Data();
  const draft = data.babbageDraft || S4_LOCAL_DRAFT_FALLBACK;
  const exact = selected === draft.deliberate_weakness;

  data.attempts += 1;
  data.auditAttempts.push({
    selection: selected,
    exact,
    weakness: draft.deliberate_weakness,
    timestamp: new Date().toISOString()
  });
  data.prompts.push(`S4 audit: ${selected}`);

  disableScenarioChoices('s4-audit', 's4AuditSubmit');

  const correctLabel = S4_AUDIT_OPTIONS.find(item => item.id === draft.deliberate_weakness)?.label || draft.deliberate_weakness;
  renderScenarioFeedback({
    panelId: 's4AuditFeedback',
    tone: exact ? 'strong' : 'developing',
    heading: exact ? 'You found the inequity hiding inside the flexible plan.' : 'That is a real risk, but one weakness is more direct.',
    text: exact
      ? `You identified the flaw Babbage intentionally built into the plan. ${draft.likely_student_consequence}`
      : `The most consequential weakness in this draft is: ${correctLabel} ${draft.likely_student_consequence}`,
    actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s4-repair-plan">Repair the participation plan →</button>'
  });
}

function renderS4RepairActivity() {
  const data = getS4Data();
  const draft = data.babbageDraft || S4_LOCAL_DRAFT_FALLBACK;

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.SYNC,
    progressHTML: buildScenarioProgressHTML({ steps: S4_PROGRESS_STEPS, activeIndex: 4, ariaLabel: 'Scenario 4 progress' }),
    contentHTML: `
      <div class="pc-s4-repair-layout">
        <aside class="pc-s4-plan-card is-compact">
          <div class="pc-activity-kicker">Current async path</div>
          <p>${esc(draft.asynchronous_path)}</p>
          <div class="pc-s4-risk-note">${esc(draft.likely_student_consequence)}</div>
        </aside>

        <section class="pc-activity-card" aria-labelledby="s4RepairTitle">
          <div class="pc-activity-kicker">Decision 5 · Repair the plan</div>
          <h2 id="s4RepairTitle">Make the two paths equivalent in learning, not identical in format.</h2>
          <p class="pc-activity-instruction">Describe a repaired asynchronous path and the evidence that would show it accomplished the same essential learning function as the live path.</p>

          <label class="pc-s4-repair-label" for="s4AsyncRepairText">Repaired asynchronous path</label>
          <textarea id="s4AsyncRepairText" class="pc-s4-repair-textarea" rows="7" maxlength="2200" placeholder="Describe what asynchronous students will do, contribute, receive, and revise..."></textarea>

          <label class="pc-s4-repair-label" for="s4EvidenceText">Equivalent evidence of learning</label>
          <textarea id="s4EvidenceText" class="pc-s4-repair-textarea is-short" rows="4" maxlength="1200" placeholder="What observable evidence should both paths produce?"></textarea>

          <div class="pc-selection-bar">
            <span id="s4RepairStatus" role="status" aria-live="polite">Add both the path and the evidence.</span>
            <button class="pc-button pc-button--primary" id="s4RepairSubmit" type="button" disabled>Ask Babbage to review equivalence</button>
          </div>
          <div id="s4RepairFeedback" aria-live="polite"></div>
        </section>
      </div>`,
    focusSelector: '#s4AsyncRepairText'
  });

  const repair = document.getElementById('s4AsyncRepairText');
  const evidence = document.getElementById('s4EvidenceText');
  const status = document.getElementById('s4RepairStatus');
  const submit = document.getElementById('s4RepairSubmit');

  const update = () => {
    const r = repair.value.trim();
    const e = evidence.value.trim();
    const ready = r.length >= 40 && e.length >= 25;
    status.textContent = ready
      ? 'Plan ready for Babbage review.'
      : `${r.length} path characters · ${e.length} evidence characters`;
    submit.disabled = !ready;
  };

  repair.addEventListener('input', update);
  evidence.addEventListener('input', update);
  submit.addEventListener('click', submitS4Repair, { once: true });
  update();
}

function pcS4ReviewSystemPrompt(data, asyncRepair, evidenceText) {
  const draft = data.babbageDraft || S4_LOCAL_DRAFT_FALLBACK;

  return `You are Babbage, PromptCraft's instructional-design analysis engine.

SCENARIO 4: SYNCHRONOUS BIAS

Course problem:
A weekly live session creates unequal access for students with work schedules, captioning/processing needs, and unstable internet.

Essential learning function:
${draft.essential_learning_function}

Original live path:
${draft.synchronous_path}

Original asynchronous path:
${draft.asynchronous_path}

Known weakness:
${draft.deliberate_weakness}

Faculty repair to the asynchronous path:
${asyncRepair}

Faculty description of equivalent evidence:
${evidenceText}

Evaluate whether the repair creates equivalent learning opportunity, not whether the two paths are identical.

Do not praise the repair merely for offering choice. Check whether both paths require comparable contribution, interaction, feedback, revision, and observable learning where relevant.

If the repair still creates a lower-value substitute, hidden synchronous requirement, inaccessible technology dependency, or vague evidence, say so plainly.

Produce:
- status and confidence,
- a specific feedback summary,
- concrete improvements,
- the most important remaining issue,
- a polished final participation plan,
- an equivalence rationale,
- observable evidence that can be compared across both paths.`;
}

async function submitS4Repair() {
  const asyncRepair = document.getElementById('s4AsyncRepairText')?.value.trim() || '';
  const evidenceText = document.getElementById('s4EvidenceText')?.value.trim() || '';
  if (asyncRepair.length < 40 || evidenceText.length < 25) return;

  const data = getS4Data();
  data.attempts += 1;
  data.asyncRepair = asyncRepair;
  data.evidenceStatement = evidenceText;
  data.repairAttempts.push({ asyncRepair, evidenceText, timestamp: new Date().toISOString() });
  data.prompts.push(`S4 async repair: ${asyncRepair}`);
  data.prompts.push(`S4 equivalent evidence: ${evidenceText}`);

  const submit = document.getElementById('s4RepairSubmit');
  if (submit) submit.disabled = true;

  renderScenarioFeedback({
    panelId: 's4RepairFeedback',
    tone: 'developing',
    heading: 'Babbage is checking equivalence.',
    text: 'The review compares the learning work and evidence across both paths. Different timing is acceptable. Lower-value participation is not.'
  });

  let review;
  try {
    const response = await requestBabbageAnalysis({
      analysis_type: 's4_review',
      max_output_tokens: 3400,
      system: pcS4ReviewSystemPrompt(data, asyncRepair, evidenceText),
      messages: [{ role: 'user', content: 'Review the repaired participation plan now.' }]
    }, 's4-review');

    review = response?.analysis || null;
    if (!review || !review.final_participation_plan || !review.observable_evidence) {
      throw new Error('Incomplete Scenario 4 review.');
    }

    data.aiProvider = response.provider || data.aiProvider || '';
    data.aiModel = response.model || data.aiModel || '';
    data.aiRequestId = response.request_id || data.aiRequestId || '';
    data.aiElapsedMs = response.elapsed_ms ?? data.aiElapsedMs;
    data.aiUsage = response.usage || data.aiUsage || null;
  } catch (error) {
    console.warn('[PromptCraft] S4 Babbage review unavailable; using local fallback.', error);
    review = { ...S4_LOCAL_REVIEW_FALLBACK };
    data.aiProvider = 'local-fallback';
    data.aiModel = 'promptcraft-local-fallback';
  }

  data.babbageReview = review;
  data.structuredAnalysis = { s4_draft: data.babbageDraft, s4_review: review };
  data.finalResponse = [
    review.feedback_summary,
    `Final participation plan: ${review.final_participation_plan}`,
    `Observable evidence: ${review.observable_evidence}`
  ].join('\n\n');
  data.bestScore = Math.max(data.bestScore || 0, 5);
  data.currentScore = 5;
  data.oscqrLit = 'Equivalent participation; flexible interaction; access; learner choice';

  renderS4FinalComparison();
}

function renderS4FinalComparison() {
  const data = getS4Data();
  const draft = data.babbageDraft || S4_LOCAL_DRAFT_FALLBACK;
  const review = data.babbageReview || S4_LOCAL_REVIEW_FALLBACK;
  const improvements = Array.isArray(review.what_improved) ? review.what_improved : [String(review.what_improved || '')];

  markScenarioComplete();
  saveIncrementalData(SCENARIO_INDEX.SYNC);

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.SYNC,
    progressHTML: buildScenarioProgressHTML({ steps: S4_PROGRESS_STEPS, activeIndex: 4, ariaLabel: 'Scenario 4 progress' }),
    contentHTML: `
      <section class="pc-s4-final" aria-labelledby="s4FinalTitle">
        <div class="pc-s4-final-header">
          <div class="pc-activity-kicker">Scenario 4 complete · Babbage review</div>
          <h2 id="s4FinalTitle">${esc(review.status)}</h2>
          <p>${esc(review.feedback_summary)}</p>
        </div>

        <div class="pc-s4-before-after">
          <article class="pc-s4-comparison-card">
            <span>BEFORE</span>
            <h3>Flexibility by substitution</h3>
            <p>${esc(draft.asynchronous_path)}</p>
            <p class="pc-s4-consequence">${esc(draft.likely_student_consequence)}</p>
          </article>
          <article class="pc-s4-comparison-card is-after">
            <span>AFTER</span>
            <h3>Equivalent participation</h3>
            <p>${esc(review.final_participation_plan)}</p>
          </article>
        </div>

        <div class="pc-s4-evidence-callout">
          <div class="pc-activity-kicker">Comparable evidence across paths</div>
          <p>${esc(review.observable_evidence)}</p>
        </div>

        <div class="pc-s4-review-grid">
          <article>
            <h3>What improved</h3>
            <ul>${improvements.filter(Boolean).map(item => `<li>${esc(item)}</li>`).join('')}</ul>
          </article>
          <article>
            <h3>Remaining limitation</h3>
            <p>${esc(review.remaining_issue)}</p>
          </article>
          <article>
            <h3>Why the paths are equivalent</h3>
            <p>${esc(review.equivalence_rationale)}</p>
          </article>
        </div>

        <div class="pc-feedback-actions pc-s4-final-actions">
          <button class="pc-button pc-button--secondary" type="button" data-pc-action="replay-scenario" data-pc-scenario-index="3">Replay Scenario 4</button>
          <button class="pc-button pc-button--primary" type="button" data-pc-action="open-main-menu" data-pc-panel="scenarios">Return to Scenario Select</button>
        </div>
      </section>`
  });

  document.querySelector('#inputContainer button')?.focus();
}



// ══════════════════════════════════════════════════════
//  SCENARIO 5 — HALLUCINATION HUNT
//  All evidence below is fictional and intentionally contained inside the game.
//  The learning target is verification behavior, not memorization of facts.
// ══════════════════════════════════════════════════════

const S5_PROGRESS_STEPS = [
  '1 Inspect evidence',
  '2 Choose a check',
  '3 Audit Babbage',
  '4 Correct the claim',
  '5 Decide safe use'
];

const S5_EVIDENCE_PACKET = [
  {
    id: 'SOURCE-A',
    title: 'North Valley Student Learning Report',
    type: 'Institutional report · fictional training source',
    excerpt: 'In a pilot of 148 students, weekly retrieval-practice activities were associated with higher quiz retention after four weeks. The report does not compare course completion rates.'
  },
  {
    id: 'SOURCE-B',
    title: 'Teaching Practice Review',
    type: 'Review article · fictional training source',
    excerpt: 'The review describes retrieval practice as useful for strengthening recall when questions require learners to retrieve information from memory. It cautions that transfer to complex application tasks depends on how practice is designed.'
  },
  {
    id: 'SOURCE-C',
    title: 'Flexible Participation Case Study',
    type: 'Case study · fictional training source',
    excerpt: 'Students reported valuing a choice between live and asynchronous participation. The case study reports perceptions and participation patterns, not causal effects on grades.'
  },
  {
    id: 'SOURCE-D',
    title: 'Applied Learning Design Memo',
    type: 'Design memo · fictional training source',
    excerpt: 'The memo recommends combining retrieval practice with opportunities to apply concepts in realistic decisions. It provides design recommendations but does not report an experimental effect size.'
  }
];

const S5_CHECK_OPTIONS = [
  {
    id: 'trace_source',
    tag: 'TRACE',
    title: 'Trace each claim to a source',
    text: 'Check whether the cited source actually exists in the packet and whether it supports the wording of the claim.'
  },
  {
    id: 'check_numbers',
    tag: 'NUMBER',
    title: 'Verify every number',
    text: 'Confirm that percentages, sample sizes, effect sizes, and comparisons appear in the cited evidence.'
  },
  {
    id: 'match_strength',
    tag: 'SCOPE',
    title: 'Match claim strength to evidence',
    text: 'Check whether words such as causes, proves, always, or doubles go beyond what the source can support.'
  },
  {
    id: 'trust_citations',
    tag: 'CITE',
    title: 'Trust claims that include citations',
    text: 'Assume a citation is sufficient evidence unless the writing looks suspicious.'
  },
  {
    id: 'check_tone',
    tag: 'TONE',
    title: 'Judge credibility by tone',
    text: 'Prioritize claims that sound cautious, professional, and academically written.'
  },
  {
    id: 'verify_primary',
    tag: 'SOURCE',
    title: 'Inspect the underlying evidence',
    text: 'Read the relevant source excerpt instead of relying on Babbage’s summary of it.'
  }
];

const S5_LOCAL_BRIEF_FALLBACK = {
  brief_title: 'Evidence Brief: Strengthening Learning Activities',
  brief_summary: 'The evidence packet supports using retrieval practice as one part of a broader learning design, but the strength of the evidence varies by claim.',
  claims: [
    { claim_id: 'CLAIM-1', claim_text: 'SOURCE-A reports a pilot involving 148 students and describes stronger four-week quiz retention among students using weekly retrieval practice.', cited_source_id: 'SOURCE-A' },
    { claim_id: 'CLAIM-2', claim_text: 'Retrieval practice is most defensible as a recall-support strategy, while transfer to complex application depends on task design.', cited_source_id: 'SOURCE-B' },
    { claim_id: 'CLAIM-3', claim_text: 'Flexible participation increased final course grades by 22 percent in the case study.', cited_source_id: 'SOURCE-C' },
    { claim_id: 'CLAIM-4', claim_text: 'The design memo recommends pairing retrieval practice with realistic application opportunities.', cited_source_id: 'SOURCE-D' }
  ],
  deliberate_issue: 'unsupported_number',
  target_claim_id: 'CLAIM-3',
  why_unsafe: 'SOURCE-C reports perceptions and participation patterns, but it does not report a 22 percent grade increase. The number is unsupported by the evidence packet.',
  verification_priority: 'Trace quantitative claims directly to the source before using them in instructional materials.'
};

const S5_LOCAL_REVIEW_FALLBACK = {
  status: 'CLAIM REPAIRED',
  confidence: 'MODERATE',
  feedback_summary: 'The correction removes the unsupported claim and makes the verification boundary more explicit.',
  what_improved: [
    'The revised wording stays within what the cited evidence actually reports.',
    'The verification note distinguishes source evidence from AI-generated interpretation.'
  ],
  remaining_issue: 'A final publication check should still confirm the original source rather than relying only on this training packet.',
  corrected_claim: 'The case study reports that students valued having a choice between live and asynchronous participation and describes participation patterns; it does not establish a causal effect on grades.',
  verification_note: 'The corrected claim is limited to outcomes explicitly described in SOURCE-C. No grade effect should be reported from this source.',
  safe_use_recommendation: 'Use the corrected qualitative claim with its source context. Do not use the unsupported 22 percent figure.'
};

function getS5Data() {
  const data = scenarioData[SCENARIO_INDEX.HALLUCINATION];
  if (!Array.isArray(data.checkAttempts)) data.checkAttempts = [];
  if (!Array.isArray(data.auditAttempts)) data.auditAttempts = [];
  if (!Array.isArray(data.repairAttempts)) data.repairAttempts = [];
  if (!data.babbageBrief || typeof data.babbageBrief !== 'object') data.babbageBrief = null;
  if (!data.babbageReview || typeof data.babbageReview !== 'object') data.babbageReview = null;
  return data;
}

function renderS5EvidencePacketHTML() {
  return S5_EVIDENCE_PACKET.map(source => `
    <article class="pc-s5-source-card">
      <div class="pc-s5-source-id">${esc(source.id)}</div>
      <h3>${esc(source.title)}</h3>
      <p class="pc-s5-source-type">${esc(source.type)}</p>
      <p>${esc(source.excerpt)}</p>
    </article>
  `).join('');
}

function renderS5EvidenceActivity() {
  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.HALLUCINATION,
    progressHTML: buildScenarioProgressHTML({
      steps: S5_PROGRESS_STEPS,
      activeIndex: 0,
      ariaLabel: 'Scenario 5 progress'
    }),
    contentHTML: `
      <section class="pc-s5-evidence-stage" aria-labelledby="s5EvidenceTitle">
        <div class="pc-s5-evidence-header">
          <div class="pc-activity-kicker">Evidence packet</div>
          <h2 id="s5EvidenceTitle">These four sources are the entire evidence universe for this scenario.</h2>
          <p>All sources are fictional training materials. Your job is not to know outside facts. Your job is to check whether Babbage stays inside the evidence it was given.</p>
        </div>
        <div class="pc-s5-source-grid">${renderS5EvidencePacketHTML()}</div>
        <div class="pc-feedback-actions">
          <button class="pc-button pc-button--primary" type="button" data-pc-action="s5-choose-check">Choose your verification habit →</button>
        </div>
      </section>`,
    focusSelector: '[data-pc-action="s5-choose-check"]'
  });
}

function renderS5CheckActivity() {
  const choicesHTML = buildScenarioChoiceCardsHTML({
    items: S5_CHECK_OPTIONS,
    inputName: 's5-check',
    idPrefix: 's5-check',
    variant: 'detail',
    marker: item => item.tag
  });

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.HALLUCINATION,
    progressHTML: buildScenarioProgressHTML({
      steps: S5_PROGRESS_STEPS,
      activeIndex: 1,
      ariaLabel: 'Scenario 5 progress'
    }),
    contentHTML: buildScenarioTaskCardHTML({
      titleId: 's5CheckTitle',
      kicker: 'Decision 2 · Choose your verification habits',
      title: 'Which three checks are strongest before you use an AI-generated research claim?',
      instruction: 'Choose the checks that verify evidence rather than relying on how convincing the writing sounds.',
      choiceGridId: 's5CheckChoices',
      choicesHTML,
      statusId: 's5CheckStatus',
      submitId: 's5CheckSubmit',
      submitLabel: 'Use these checks',
      feedbackId: 's5CheckFeedback',
      gridClass: 'pc-choice-grid--three'
    }),
    focusSelector: 'input[name="s5-check"]'
  });

  wireExactSelection({
    rootId: 's5CheckChoices',
    inputName: 's5-check',
    limit: 3,
    statusId: 's5CheckStatus',
    submitId: 's5CheckSubmit',
    onSubmit: submitS5Check
  });
}

function submitS5Check() {
  const selection = getCheckedValues('s5-check');
  if (selection.length !== 3) return;

  const strongest = ['trace_source', 'check_numbers', 'match_strength'];
  const exact = strongest.every(id => selection.includes(id));
  const data = getS5Data();

  data.attempts += 1;
  data.checkAttempts.push({ selection: [...selection], exact, timestamp: new Date().toISOString() });
  data.checkFinal = [...selection];
  data.prompts.push(`S5 verification checks: ${selection.join(', ')}`);

  disableScenarioChoices('s5-check', 's5CheckSubmit');

  renderScenarioFeedback({
    panelId: 's5CheckFeedback',
    tone: exact ? 'strong' : 'developing',
    heading: exact ? 'Those checks verify evidence instead of presentation.' : 'Some of those checks are stronger than others.',
    text: exact
      ? 'Tracing the source, verifying numbers, and matching claim strength to evidence are direct tests. A confident tone or a citation-shaped object can still be wrong.'
      : 'The safest checks require you to inspect the evidence itself. Professional tone and the presence of a citation are not substitutes for source verification.',
    actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s5-build-brief">Ask Babbage to summarize the packet →</button>'
  });
}

function pcS5BriefSystemPrompt() {
  const packet = S5_EVIDENCE_PACKET.map(source =>
    `${source.id} — ${source.title}\n${source.excerpt}`
  ).join('\n\n');

  return `You are Babbage, PromptCraft's instructional-design analysis engine.

SCENARIO 5: HALLUCINATION HUNT

You must create a four-claim research brief using ONLY the controlled evidence packet below.

${packet}

Create exactly four claims. Each claim must cite one source ID from the packet.

Three claims must be faithful to the evidence.

Exactly ONE claim must contain one deliberate verification failure:
- fabricated_source: cite a source ID that does not exist in the packet.
- unsupported_number: include a percentage, effect size, sample size, or comparison not supported by the cited source.
- overclaim: turn cautious/descriptive evidence into a causal, universal, or stronger conclusion.
- source_mismatch: cite a real packet source that does not support the claim being made.

Set target_claim_id to the unsafe claim. Do not reveal which claim is unsafe inside the brief itself. The claims should all sound polished and plausible.

This is a closed evidence exercise. Do not introduce outside facts, real citations, or web information.`;
}

function renderS5BabbageLoading() {
  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.HALLUCINATION,
    progressHTML: buildScenarioProgressHTML({
      steps: S5_PROGRESS_STEPS,
      activeIndex: 2,
      ariaLabel: 'Scenario 5 progress'
    }),
    contentHTML: `
      <section class="pc-activity-card pc-s5-engine-card" aria-live="polite">
        <div class="pc-activity-kicker">Babbage Engine</div>
        <h2>Writing the evidence brief</h2>
        <p>Babbage is summarizing the controlled packet into four polished claims.</p>
        <div class="pc-s2-engine-progress" role="progressbar" aria-label="Babbage evidence-brief generation in progress">
          <span></span>
        </div>
        <p class="pc-s2-engine-note">One claim will be unsafe. The prose will not politely wave a red flag for you.</p>
      </section>`
  });
}

async function generateS5BabbageBrief() {
  const data = getS5Data();
  renderS5BabbageLoading();

  let brief;
  try {
    const response = await requestBabbageAnalysis({
      analysis_type: 's5_brief',
      max_output_tokens: 3000,
      system: pcS5BriefSystemPrompt(),
      messages: [{ role: 'user', content: 'Create the four-claim evidence brief now.' }]
    }, 's5-brief');

    brief = response?.analysis || null;
    if (!brief || !Array.isArray(brief.claims) || brief.claims.length !== 4 || !brief.target_claim_id) {
      throw new Error('Incomplete Scenario 5 brief.');
    }

    data.aiProvider = response.provider || '';
    data.aiModel = response.model || '';
    data.aiRequestId = response.request_id || '';
    data.aiElapsedMs = response.elapsed_ms ?? '';
    data.aiUsage = response.usage || null;
  } catch (error) {
    console.warn('[PromptCraft] S5 Babbage brief unavailable; using local fallback.', error);
    brief = JSON.parse(JSON.stringify(S5_LOCAL_BRIEF_FALLBACK));
    data.aiProvider = 'local-fallback';
    data.aiModel = 'promptcraft-local-fallback';
  }

  data.babbageBrief = brief;
  data.structuredAnalysis = { s5_brief: brief };
  data.finalResponse = brief.claims.map(claim => `${claim.claim_id}: ${claim.claim_text}`).join('\n');
  renderS5AuditActivity();
}

function renderS5AuditActivity() {
  const data = getS5Data();
  const brief = data.babbageBrief || S5_LOCAL_BRIEF_FALLBACK;

  const claimChoices = brief.claims.map(claim => ({
    id: claim.claim_id,
    label: `${claim.claim_id}: ${claim.claim_text} [${claim.cited_source_id}]`
  }));

  const choicesHTML = buildScenarioChoiceCardsHTML({
    items: claimChoices,
    inputName: 's5-audit',
    idPrefix: 's5-audit'
  });

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.HALLUCINATION,
    progressHTML: buildScenarioProgressHTML({
      steps: S5_PROGRESS_STEPS,
      activeIndex: 2,
      ariaLabel: 'Scenario 5 progress'
    }),
    contentHTML: `
      <div class="pc-s5-audit-layout">
        <aside class="pc-s5-brief-card">
          <div class="pc-activity-kicker">Babbage evidence brief</div>
          <h2>${esc(brief.brief_title)}</h2>
          <p>${esc(brief.brief_summary)}</p>
          <div class="pc-s5-claim-stack">
            ${brief.claims.map(claim => `
              <article>
                <span>${esc(claim.claim_id)}</span>
                <p>${esc(claim.claim_text)}</p>
                <small>Cited source: ${esc(claim.cited_source_id)}</small>
              </article>`).join('')}
          </div>
        </aside>

        <div>
          <details class="pc-s5-evidence-drawer">
            <summary>Open the evidence packet while you verify</summary>
            <div class="pc-s5-source-grid is-compact">${renderS5EvidencePacketHTML()}</div>
          </details>

          ${buildScenarioTaskCardHTML({
            titleId: 's5AuditTitle',
            kicker: 'Decision 3 · Audit Babbage',
            title: 'Which claim is unsafe to use as written?',
            instruction: 'Select the claim that fails when you trace it back to the evidence packet.',
            choiceGridId: 's5AuditChoices',
            choicesHTML,
            statusId: 's5AuditStatus',
            submitId: 's5AuditSubmit',
            submitLabel: 'Flag the claim',
            feedbackId: 's5AuditFeedback'
          })}
        </div>
      </div>`,
    focusSelector: 'input[name="s5-audit"]'
  });

  wireExactSelection({
    rootId: 's5AuditChoices',
    inputName: 's5-audit',
    limit: 1,
    statusId: 's5AuditStatus',
    submitId: 's5AuditSubmit',
    onSubmit: submitS5Audit
  });
}

function submitS5Audit() {
  const selection = getCheckedValues('s5-audit');
  if (selection.length !== 1) return;

  const selected = selection[0];
  const data = getS5Data();
  const brief = data.babbageBrief || S5_LOCAL_BRIEF_FALLBACK;
  const exact = selected === brief.target_claim_id;

  data.attempts += 1;
  data.auditAttempts.push({
    selection: selected,
    exact,
    target: brief.target_claim_id,
    issue: brief.deliberate_issue,
    timestamp: new Date().toISOString()
  });
  data.flaggedClaim = selected;
  data.prompts.push(`S5 flagged claim: ${selected}`);

  disableScenarioChoices('s5-audit', 's5AuditSubmit');

  renderScenarioFeedback({
    panelId: 's5AuditFeedback',
    tone: exact ? 'strong' : 'developing',
    heading: exact ? 'You found the hallucination.' : 'That claim may deserve scrutiny, but another one fails the packet.',
    text: exact
      ? `${brief.why_unsafe} Verification priority: ${brief.verification_priority}`
      : `The unsafe claim is ${brief.target_claim_id}. ${brief.why_unsafe} This is why verification has to follow the claim back to evidence rather than stopping at plausible prose.`,
    actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s5-correct-claim">Correct the claim →</button>'
  });
}

function renderS5CorrectionActivity() {
  const data = getS5Data();
  const brief = data.babbageBrief || S5_LOCAL_BRIEF_FALLBACK;
  const target = brief.claims.find(claim => claim.claim_id === brief.target_claim_id) || brief.claims[0];

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.HALLUCINATION,
    progressHTML: buildScenarioProgressHTML({
      steps: S5_PROGRESS_STEPS,
      activeIndex: 3,
      ariaLabel: 'Scenario 5 progress'
    }),
    contentHTML: `
      <div class="pc-s5-correction-layout">
        <aside class="pc-s5-unsafe-card">
          <div class="pc-activity-kicker">Unsafe claim</div>
          <h3>${esc(target.claim_id)}</h3>
          <p>${esc(target.claim_text)}</p>
          <p><strong>Cited source:</strong> ${esc(target.cited_source_id)}</p>
          <div class="pc-s5-issue-note">${esc(brief.why_unsafe)}</div>
        </aside>

        <section class="pc-activity-card" aria-labelledby="s5CorrectionTitle">
          <div class="pc-activity-kicker">Decision 4 · Correct & document</div>
          <h2 id="s5CorrectionTitle">Repair the claim without inventing new evidence.</h2>
          <p class="pc-activity-instruction">Rewrite the unsafe claim so it stays inside the evidence packet, then write a short verification note explaining what you checked.</p>

          <label class="pc-s5-correction-label" for="s5CorrectedClaim">Corrected claim</label>
          <textarea id="s5CorrectedClaim" class="pc-s5-correction-textarea" rows="6" maxlength="1800" placeholder="Rewrite the claim using only supported evidence..."></textarea>

          <label class="pc-s5-correction-label" for="s5VerificationNote">Verification note</label>
          <textarea id="s5VerificationNote" class="pc-s5-correction-textarea is-short" rows="4" maxlength="1200" placeholder="Explain what source, number, wording, or claim strength you verified..."></textarea>

          <div class="pc-selection-bar">
            <span id="s5CorrectionStatus" role="status" aria-live="polite">Add the corrected claim and verification note.</span>
            <button class="pc-button pc-button--primary" id="s5CorrectionSubmit" type="button" disabled>Ask Babbage to review the correction</button>
          </div>
          <div id="s5CorrectionFeedback" aria-live="polite"></div>
        </section>
      </div>`,
    focusSelector: '#s5CorrectedClaim'
  });

  const claim = document.getElementById('s5CorrectedClaim');
  const note = document.getElementById('s5VerificationNote');
  const status = document.getElementById('s5CorrectionStatus');
  const submit = document.getElementById('s5CorrectionSubmit');

  const update = () => {
    const c = claim.value.trim();
    const n = note.value.trim();
    const ready = c.length >= 35 && n.length >= 25;
    status.textContent = ready
      ? 'Correction ready for Babbage review.'
      : `${c.length} claim characters · ${n.length} verification characters`;
    submit.disabled = !ready;
  };

  claim.addEventListener('input', update);
  note.addEventListener('input', update);
  submit.addEventListener('click', submitS5Correction, { once: true });
  update();
}

function pcS5ReviewSystemPrompt(data, correctedClaim, verificationNote) {
  const brief = data.babbageBrief || S5_LOCAL_BRIEF_FALLBACK;
  const target = brief.claims.find(claim => claim.claim_id === brief.target_claim_id) || brief.claims[0];
  const packet = S5_EVIDENCE_PACKET.map(source =>
    `${source.id} — ${source.title}\n${source.excerpt}`
  ).join('\n\n');

  return `You are Babbage, PromptCraft's instructional-design analysis engine.

SCENARIO 5: HALLUCINATION HUNT

This is a closed evidence exercise. Use ONLY the packet below.

${packet}

Unsafe original claim:
${target.claim_text}

Cited source:
${target.cited_source_id}

Known failure:
${brief.deliberate_issue} — ${brief.why_unsafe}

Faculty corrected claim:
${correctedClaim}

Faculty verification note:
${verificationNote}

Evaluate whether the correction stays inside the evidence and whether the verification note identifies the actual verification move.

Do not reward cautious wording if the claim is still unsupported. Do not add outside facts.

Produce:
- status and confidence,
- specific feedback,
- concrete improvements,
- the most important remaining issue,
- a corrected claim that is fully supported by the packet,
- a verification note suitable for documenting the check,
- a recommendation about what is safe to use from the original brief.`;
}

async function submitS5Correction() {
  const correctedClaim = document.getElementById('s5CorrectedClaim')?.value.trim() || '';
  const verificationNote = document.getElementById('s5VerificationNote')?.value.trim() || '';
  if (correctedClaim.length < 35 || verificationNote.length < 25) return;

  const data = getS5Data();
  data.attempts += 1;
  data.correctedClaim = correctedClaim;
  data.verificationNote = verificationNote;
  data.repairAttempts.push({ correctedClaim, verificationNote, timestamp: new Date().toISOString() });
  data.prompts.push(`S5 corrected claim: ${correctedClaim}`);
  data.prompts.push(`S5 verification note: ${verificationNote}`);

  const submit = document.getElementById('s5CorrectionSubmit');
  if (submit) submit.disabled = true;

  renderScenarioFeedback({
    panelId: 's5CorrectionFeedback',
    tone: 'developing',
    heading: 'Babbage is checking your correction against the packet.',
    text: 'The review is constrained to the same four sources. No convenient new facts are allowed to wander in from the wilderness.'
  });

  let review;
  try {
    const response = await requestBabbageAnalysis({
      analysis_type: 's5_review',
      max_output_tokens: 3200,
      system: pcS5ReviewSystemPrompt(data, correctedClaim, verificationNote),
      messages: [{ role: 'user', content: 'Review the corrected claim and verification note now.' }]
    }, 's5-review');

    review = response?.analysis || null;
    if (!review || !review.corrected_claim || !review.safe_use_recommendation) {
      throw new Error('Incomplete Scenario 5 review.');
    }

    data.aiProvider = response.provider || data.aiProvider || '';
    data.aiModel = response.model || data.aiModel || '';
    data.aiRequestId = response.request_id || data.aiRequestId || '';
    data.aiElapsedMs = response.elapsed_ms ?? data.aiElapsedMs;
    data.aiUsage = response.usage || data.aiUsage || null;
  } catch (error) {
    console.warn('[PromptCraft] S5 Babbage review unavailable; using local fallback.', error);
    review = { ...S5_LOCAL_REVIEW_FALLBACK };
    data.aiProvider = 'local-fallback';
    data.aiModel = 'promptcraft-local-fallback';
  }

  data.babbageReview = review;
  data.structuredAnalysis = { s5_brief: data.babbageBrief, s5_review: review };
  data.finalResponse = [
    review.feedback_summary,
    `Corrected claim: ${review.corrected_claim}`,
    `Safe-use recommendation: ${review.safe_use_recommendation}`
  ].join('\n\n');
  data.bestScore = Math.max(data.bestScore || 0, 5);
  data.currentScore = 5;
  data.oscqrLit = 'AI verification; source checking; claim strength; evidence literacy';

  renderS5FinalReport();
}

function renderS5FinalReport() {
  const data = getS5Data();
  const brief = data.babbageBrief || S5_LOCAL_BRIEF_FALLBACK;
  const review = data.babbageReview || S5_LOCAL_REVIEW_FALLBACK;
  const target = brief.claims.find(claim => claim.claim_id === brief.target_claim_id) || brief.claims[0];
  const improvements = Array.isArray(review.what_improved) ? review.what_improved : [String(review.what_improved || '')];

  markScenarioComplete();
  saveIncrementalData(SCENARIO_INDEX.HALLUCINATION);

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.HALLUCINATION,
    progressHTML: buildScenarioProgressHTML({
      steps: S5_PROGRESS_STEPS,
      activeIndex: 4,
      ariaLabel: 'Scenario 5 progress'
    }),
    contentHTML: `
      <section class="pc-s5-final" aria-labelledby="s5FinalTitle">
        <div class="pc-s5-final-header">
          <div class="pc-activity-kicker">Scenario 5 complete · Verification report</div>
          <h2 id="s5FinalTitle">${esc(review.status)}</h2>
          <p>${esc(review.feedback_summary)}</p>
        </div>

        <div class="pc-s5-before-after">
          <article class="pc-s5-comparison-card is-unsafe">
            <span>UNSAFE CLAIM</span>
            <h3>${esc(target.claim_id)}</h3>
            <p>${esc(target.claim_text)}</p>
            <small>${esc(brief.why_unsafe)}</small>
          </article>
          <article class="pc-s5-comparison-card is-safe">
            <span>CORRECTED CLAIM</span>
            <h3>Verified wording</h3>
            <p>${esc(review.corrected_claim)}</p>
          </article>
        </div>

        <div class="pc-s5-verification-callout">
          <div class="pc-activity-kicker">Verification note</div>
          <p>${esc(review.verification_note)}</p>
        </div>

        <div class="pc-s5-review-grid">
          <article>
            <h3>What improved</h3>
            <ul>${improvements.filter(Boolean).map(item => `<li>${esc(item)}</li>`).join('')}</ul>
          </article>
          <article>
            <h3>Remaining limitation</h3>
            <p>${esc(review.remaining_issue)}</p>
          </article>
          <article>
            <h3>Safe-use decision</h3>
            <p>${esc(review.safe_use_recommendation)}</p>
          </article>
        </div>

        <div class="pc-feedback-actions pc-s5-final-actions">
          <button class="pc-button pc-button--secondary" type="button" data-pc-action="replay-scenario" data-pc-scenario-index="4">Replay Scenario 5</button>
          <button class="pc-button pc-button--primary" type="button" data-pc-action="open-main-menu" data-pc-panel="scenarios">Return to Scenario Select</button>
        </div>
      </section>`
  });

  document.querySelector('#inputContainer button')?.focus();
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
