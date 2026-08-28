/* PROMPTCRAFT SCENARIOS, MENU, AND INLINE COACHING
   Extracted from app.js in Version 270. Load after the preceding PromptCraft scripts. */

//  SCENARIOS
// ══════════════════════════════════════════════════════
const scenarios = [
  {
    desc: "A Canvas module has plenty of content but no visible path. Inspect what students actually see, uncover the hidden requirements, and use AI to reorganize the experience without replacing instructor judgment.",
    oscqr: [], system: ""
  },
  { desc: "A polished Canvas course still creates barriers. Find the accessibility problems, connect them to current standards, and use AI to support—but not replace—an informed accessibility review.", oscqr: [], system: "" },
  { desc: "A student is earning good grades but cannot explain what helped, what failed, or what to try next. Use Canvas evidence and AI to build a stronger learning-reflection loop.", oscqr: [], system: "" },
  { desc: "A high Canvas score may prove recall without proving transferable learning. Examine the evidence, strengthen the assessment, and audit what AI claims the score means.", oscqr: [], system: "" },
  { desc: "An AI-generated course resource looks ready to publish in Canvas. Verify its claims, citations, and usefulness before students encounter it.", oscqr: [], system: "" },
  { desc: "A vague request can produce a polished but unusable Canvas item. Predict what AI will misunderstand, test the request, and revise it deliberately.", oscqr: [], system: "" },
  { desc: "Decide which course-design tasks AI can accelerate and which decisions still require faculty expertise, context, and responsibility.", oscqr: [], system: "" },
  { desc: "Apply what you have learned to a real Canvas item, evaluate the result, and create a reusable process for thoughtful AI-assisted design.", oscqr: [], system: "" }
];

// ══════════════════════════════════════════════════════
//  SCENARIO UI CONFIGURATION
//  Every scenario gets the
//  same mission briefing anatomy, VN introduction orchestration, reset path,
//  and explicit input ownership. Scenario-specific activities stay separate.
// ══════════════════════════════════════════════════════
const SCENARIO_UI = [
  {
    key: 'content-avalanche',
    dataLabel: 'S1: The Content Avalanche',
    tabLabel: 'S1: The Content Avalanche',
    missionTitle: 'Turn a content pile into a visible learning path.',
    missionCopy: 'A Canvas module has plenty of content but no visible path. Inspect what students actually see, uncover the hidden requirements, and use AI to reorganize the experience without replacing instructor judgment.',
    boardText: 'Week 4 has plenty of content but no clear path. Find what students must guess.',
    rendererKey: 'content-avalanche-preview',
    workspaceMode: 'development',
    introLayout: 'standard',
    introCast: 'dual',
    introCharacters: [{ id: 'pixel', slot: 'right' }, { id: 'eli', slot: 'left' }],
    inputMode: 'placeholder', inputVisible: false, supportsPrompt: false,
    implemented: false,
    previewAvailable: true,
    previewIntroduction: true,
    developmentStatus: 'Preview available · In development',
    plannedLoop: ['Inspect the Canvas evidence', 'Find the hidden requirements', 'Rebuild the learning path', 'Check the student view']
  },
  {
    key: 'accessibility',
    dataLabel: 'S2: Access Is Part of the Design',
    tabLabel: 'S2: Access Is Part of the Design',
    missionTitle: 'Find the barriers a polished course can hide.',
    missionCopy: 'A polished Canvas course still creates barriers. Find the accessibility problems, connect them to current standards, and use AI to support—but not replace—an informed accessibility review.',
    boardText: 'Scenario 2 is in development.',
    rendererKey: 'development-shell', workspaceMode: 'development', introLayout: 'none', introCast: 'single',
    inputMode: 'placeholder', inputVisible: false, supportsPrompt: false,
    implemented: false, developmentStatus: 'Planned · In development',
    plannedLoop: ['Inspect the Canvas experience', 'Connect barriers to standards', 'Repair with AI support', 'Verify with human review']
  },
  {
    key: 'metacognition',
    dataLabel: 'S3: The Confident Student Problem',
    tabLabel: 'S3: The Confident Student Problem',
    missionTitle: 'Help a successful student learn from the process.',
    missionCopy: 'A student is earning good grades but cannot explain what helped, what failed, or what to try next. Use Canvas evidence and AI to build a stronger learning-reflection loop.',
    boardText: 'Jordan is completing the Canvas work, but he cannot explain what helped, what failed, or what he should try next.',
    rendererKey: 'metacognition-opening',
    workspaceMode: 'activity',
    introLayout: 'standard',
    introCast: 'dual',
    introCharacters: [{ id: 'pixel', slot: 'right' }, { id: 'jordan', slot: 'left' }],
    afterIntroAction: 's2-diagnosis',
    inputMode: 'scenario-2', inputVisible: true, supportsPrompt: false,
    implemented: true, developmentStatus: 'Playable',
    plannedLoop: ['Listen to the student', 'Identify the missing thinking move', 'Audit Babbage\'s activity', 'Repair one weak element', 'Hear the changed student response']
  },
  {
    key: 'assessment',
    dataLabel: 'S4: The 96% Problem',
    tabLabel: 'S4: The 96% Problem',
    missionTitle: 'Decide what a high Canvas score actually proves.',
    missionCopy: 'A high Canvas score may prove recall without proving transferable learning. Examine the evidence, strengthen the assessment, and audit what AI claims the score means.',
    boardText: 'A high Canvas score can be accurate while the learning claim attached to it is too large.',
    rendererKey: 'assessment-opening', workspaceMode: 'activity', introLayout: 'standard', introCast: 'dual',
    introCharacters: [{ id: 'pixel', slot: 'right' }, { id: 'maya', slot: 'left' }],
    afterIntroAction: 's3-diagnosis',
    inputMode: 'scenario-3', inputVisible: true, supportsPrompt: false,
    implemented: true, developmentStatus: 'Playable',
    plannedLoop: ['Sort evidence', 'Build assessment', 'Stress-test evidence', 'Audit Babbage', 'Repair the inference', 'Apply to your teaching']
  },
  {
    key: 'hallucination',
    dataLabel: 'S5: Hallucination Hunt',
    tabLabel: 'S5: Hallucination Hunt',
    missionTitle: 'Verify before you publish.',
    missionCopy: 'An AI-generated course resource looks ready to publish in Canvas. Verify its claims, citations, and usefulness before students encounter it.',
    boardText: 'Scenario 5 is in development.',
    rendererKey: 'development-shell',
    workspaceMode: 'development',
    introLayout: 'none',
    introCast: 'single',
    inputMode: 'placeholder', inputVisible: false, supportsPrompt: false,
    implemented: false, developmentStatus: 'Planned',
    plannedLoop: ['Inspect', 'Verify', 'Correct', 'Decide']
  },
  {
    key: 'prediction', dataLabel: 'S6: Predict the Output', tabLabel: 'S6: Predict the Output',
    missionTitle: 'Predict what AI will misunderstand.',
    missionCopy: 'A vague request can produce a polished but unusable Canvas item. Predict what AI will misunderstand, test the request, and revise it deliberately.',
    boardText: 'Scenario 6 is in redesign.', rendererKey: 'development-shell', workspaceMode: 'development', introLayout: 'none', introCast: 'single',
    inputMode: 'placeholder', inputVisible: false, supportsPrompt: false,
    implemented: false, developmentStatus: 'Planned', plannedLoop: ['Forecast', 'Test', 'Compare', 'Revise']
  },
  {
    key: 'human-judgment', dataLabel: 'S7: The Human Judgment Line', tabLabel: 'S7: The Human Judgment Line',
    missionTitle: 'Decide where human judgment belongs.',
    missionCopy: 'Decide which course-design tasks AI can accelerate and which decisions still require faculty expertise, context, and responsibility.',
    boardText: 'Scenario 7 is in redesign.', rendererKey: 'development-shell', workspaceMode: 'development', introLayout: 'none', introCast: 'single',
    inputMode: 'placeholder', inputVisible: false, supportsPrompt: false,
    implemented: false, developmentStatus: 'Planned', plannedLoop: ['Classify', 'Justify', 'Revise the boundary']
  },
  {
    key: 'reflect-revise-reuse', dataLabel: 'S8: Reflect, Revise, Reuse', tabLabel: 'S8: Reflect, Revise, Reuse',
    missionTitle: 'Turn one revision into a reusable practice.',
    missionCopy: 'Apply what you have learned to a real Canvas item, evaluate the result, and create a reusable process for thoughtful AI-assisted design.',
    boardText: 'Scenario 8 is in redesign.', rendererKey: 'development-shell', workspaceMode: 'development', introLayout: 'none', introCast: 'single',
    inputMode: 'placeholder', inputVisible: false, supportsPrompt: false,
    implemented: false, developmentStatus: 'Planned', plannedLoop: ['Choose a Canvas item', 'Revise with AI support', 'Evaluate the result', 'Save a reusable process']
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
  'content-avalanche-preview': () => renderS1ContentAvalanchePreview(),
  'metacognition-opening': ({ container }) => renderS2Standby(container),
  'assessment-opening': ({ container }) => renderS3Standby(container),
  'development-shell': ({ index }) => renderScenarioPlaceholder(index)
});

const PC_SCENARIO_AFTER_INTRO_ACTIONS = Object.freeze({
  's2-diagnosis': () => renderS2DiagnosisActivity(),
  's3-diagnosis': () => renderS3DiagnosisActivity()
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
  requestAnimationFrame(pcApplyIpadLayout);
  window.setTimeout(pcApplyIpadLayout, 80);
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
  requestAnimationFrame(pcApplyIpadLayout);
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

  window.scenarioIntroEnabled = true;
  return false;
}

function continueFromMainMenu() {
  if (!pcScenarioHasLaunched) return launchScenarioFromMenu(SCENARIO_INDEX.CONTENT_AVALANCHE);
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
let babbageTerminalCloseCallback = null;
let babbageTerminalCloseHandoff = 'app';
let vnTyping = false;
let vnTypeTimer = null;
let vnCurrentText = '';
let vnFullText = '';
let vnOnComplete = null;


// ── BABBAGE SHELF STATE SYSTEM ────────────────────────

function setVNBabbageMode(enabled = false) {
  const overlay = document.getElementById('vnOverlay');
  if (!overlay) return;
  overlay.classList.toggle('babbage-consult', !!enabled);
}

function setVNBabbageTerminalMode(enabled = false) {
  const overlay = document.getElementById('vnOverlay');
  if (!overlay) return;
  overlay.classList.toggle('babbage-terminal-consult', !!enabled);
}

function setBabbageTerminalTextMode(enabled = false) {
  const terminal = document.getElementById('babbageTerminalScene');
  const overlay = document.getElementById('vnOverlay');
  if (terminal) terminal.classList.toggle('textmode', !!enabled);
  if (overlay) overlay.classList.toggle('babbage-terminal-textmode', !!enabled);
}

function terminalizeBabbageText(text) {
  return String(text || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\*\*/g, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function setBabbageTerminalState(state = 'idle', title = 'BABBAGE ENGINE', output = 'IDLE') {
  if (state !== 'thinking' && typeof pcClearMobileAnalyzingStage === 'function') {
    pcClearMobileAnalyzingStage();
  }
  const terminal = document.getElementById('babbageTerminalScene');
  const titleEl = document.getElementById('babbageTerminalTitle');
  const outputEl = document.getElementById('babbageTerminalOutput');
  if (terminal) {
    terminal.classList.remove('idle', 'thinking', 'responding');
    terminal.classList.add(state);
  }
  if (titleEl) titleEl.textContent = title;
  if (outputEl) {
    outputEl.classList.remove('babbage-analysis-layout', 'pc-analyzing-output');
    const outputText = String(output ?? '');
    if (!outputText.includes('\n') && !outputText.includes('<')) {
      const statusLine = document.createElement('span');
      statusLine.className = 'babbage-terminal-status-line';

      const statusText = document.createElement('span');
      statusText.className = 'babbage-terminal-status-text';
      statusText.textContent = outputText;

      const cursor = document.createElement('span');
      cursor.className = 'babbage-terminal-cursor';
      cursor.setAttribute('aria-hidden', 'true');

      statusLine.append(statusText, cursor);
      outputEl.replaceChildren(statusLine);
    } else {
      outputEl.innerHTML = `${output}<span class="babbage-terminal-cursor" aria-hidden="true"></span>`;
    }
  }
}



// ══════════════════════════════════════════════════════
