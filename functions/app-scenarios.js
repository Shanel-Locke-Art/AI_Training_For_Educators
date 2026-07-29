/* PROMPTCRAFT SCENARIOS, MENU, AND INLINE COACHING
   Extracted from app.js in Version 270. Load after the preceding PromptCraft scripts. */

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
    outputEl.innerHTML = `${output}<span class="claude-terminal-cursor"></span>`;
  }
}



// ══════════════════════════════════════════════════════
