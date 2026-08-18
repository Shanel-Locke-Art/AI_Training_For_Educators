/* PROMPTCRAFT WORKBENCH, SCORING, COMPLETION, AND DEV TOOLS
   Extracted from app.js in Version 270. Load after the preceding PromptCraft scripts. */

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
  if (!ui.implemented) {
    window.pcScenarioIntroPending = false;
    return;
  }

  const overlay = document.getElementById('vnOverlay') || document.querySelector('.vn-overlay');
  const useSpecialIntroLayout = ui.introLayout === 'special';
  overlay?.classList.toggle('scenario-intro-active', useSpecialIntroLayout);
  const onDone = () => {
    if (useSpecialIntroLayout) overlay?.classList.remove('scenario-intro-active');
    // Every scenario uses the same cast cleanup when its VN introduction hands
    // control to the workbench. No character-specific teardown belongs here.
    pcResetVNCharacters();
    pcRunScenarioAfterIntroAction(ui.afterIntroAction);
  };

  if (window.scenarioIntroTimer) clearTimeout(window.scenarioIntroTimer);
  window.scenarioIntroTimer = null;

  // v218: Start the VN overlay in the same task as the scenario render. The old
  // 300 ms pause exposed the workbench while navigation and generated fields
  // settled, making the entire page appear to drop just before the challenge.
  window.pcScenarioIntroPending = false;
  pcApplyIpadLayout();
  playPixelSequence(getScenarioStartDialogueKey(index), onDone);
  requestAnimationFrame(() => {
    if (scenarioIndex === index) pcApplyIpadLayout();
  });
  pcScheduleScenarioTask(pcApplyIpadLayout, 120, index);
}


function pcActivateScenario(index, { explicitButton = null, playIntroduction = true } = {}) {
  const normalized = pcNormalizeScenarioIndex(index);
  if (normalized === null) return false;

  pcBeginScenarioRun();
  pcClearVNStateForScenarioSwitch();
  resetScenarioRunState(normalized);
  selectScenarioTab(normalized, explicitButton);
  window.scenarioIntroEnabled = true;

  const implemented = Boolean(getScenarioUI(normalized).implemented);
  // v216: Mark the introduction before rendering the workbench. This prevents
  // its first textarea from briefly stealing focus and scrolling the page just
  // before Professor Pixel states the challenge.
  window.pcScenarioIntroPending = implemented && playIntroduction;
  loadScenario(normalized);

  if (implemented && playIntroduction) playScenarioIntroduction(normalized);
  else window.pcScenarioIntroPending = false;
  return false;
}

function switchScenario(i, btn) {
  return pcActivateScenario(i, { explicitButton: btn });
}


function pcClearVNStateForScenarioSwitch() {
  const overlay = document.getElementById('vnOverlay');
  const dialogue = document.getElementById('vnDialogue');

  // Stop callbacks and media owned by the scenario we just left before touching
  // the new one. Attempt/history data stays intact for research logging; only
  // live presentation state is discarded.
  if (window.scenarioIntroTimer) clearTimeout(window.scenarioIntroTimer);
  window.scenarioIntroTimer = null;
  try { stopAutomaticNarration(); } catch (e) {}
  try { pcStopS2JordanInterventionVoice(); } catch (e) {}
  try { pcStopBabbageAnalysisProgress(); } catch (e) {}
  try { pcClearLiveAnalyzingLayout(); } catch (e) {}
  try { pcClearAnalysisLayout(); } catch (e) {}
  try { pcSetBabbageSubmitting(false); } catch (e) {}
  try { babbageTerminalCloseCallback = null; } catch (e) {}
  try { pcSharedWorkstationResultContinue = null; } catch (e) {}

  // Scenario state may add semantic markers, but presentation teardown is shared.
  overlay?.classList.remove('pc-s2-jordan-recording', 'pc-s2-two-character', 'pc-s2-narrow-jordan');
  dialogue?.classList.remove('pc-s2-recorded-dialogue', 'prediction-question', 'prediction-result');
  document.getElementById('s2JordanVNControls')?.remove();

  pcSetVNOverlayState({ active: false });
  pcResetVNCharacters();
  pcResetVNDialogueState();
  document.querySelectorAll('#vnPredictionChoicePanel,#predictionGate,.pc-choice-panel-final,.pc-clean-choice-grid,.vn-choice-list').forEach(el => el.remove());
  if (typeof pcClearPredictionPresentation === 'function') pcClearPredictionPresentation();
  if (typeof pcClearPredictionLayoutInlineStyles === 'function') pcClearPredictionLayoutInlineStyles();

  window.pendingPromptForPrediction = '';
  window.pendingPromptAfterPrediction = '';
  window.pcWaitingForBabbageContinue = false;

  predictionGateActive = false;
  vnQueue = [];
  vnTyping = false;
  vnOnComplete = null;
  clearTimeout(vnTypeTimer);
  setBabbageShelfState('idle', 'idle');
  setBabbageTerminalTextMode(false);
  setBabbageTerminalState('idle', 'BABBAGE ENGINE', 'AWAITING INPUT...');
  musicEndVN();
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

function pcFillS2DevRepairFields() {
  const values = {
    s2RepairEvidence: 'Describe one specific sign of what you could explain without notes and where your understanding still broke down.',
    s2RepairEvaluation: 'Compare that evidence with the strategy you used and explain which part actually helped or failed to help your understanding.',
    s2RepairNextMove: 'Decide what you will keep, change, or try next time based on that evidence instead of the grade alone.',
    s2RepairSuccess: 'include the strategy, specific learning evidence, a judgment about why it worked or failed, and one evidence-based next move.'
  };

  const tryFill = (attempts = 0) => {
    const fields = Object.keys(values).map(id => document.getElementById(id));
    if (fields.every(Boolean)) {
      Object.entries(values).forEach(([id, value]) => {
        const field = document.getElementById(id);
        field.value = value;
        if (typeof autoGrow === 'function') autoGrow(field);
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      document.getElementById('s2RepairEvidence')?.focus({ preventScroll: true });
      return true;
    }
    if (attempts < 30) pcScheduleScenarioTask(() => tryFill(attempts + 1), 80, SCENARIO_INDEX.METACOGNITION);
    return false;
  };

  return tryFill();
}

function resetS2Dev() {
  // The plain S2 DEV button still opens the scenario normally. S2 ✏️ is the
  // fast-path for layout/content testing: establish one coherent successful
  // run through Decisions 1–4, open Decision 5, then populate its guided fields.
  pcActivateScenario(SCENARIO_INDEX.METACOGNITION, { playIntroduction: false });
  const data = getS2Data();
  const now = new Date().toISOString();

  data.attempts = 4;
  data.prompts = [
    'S2 diagnosis: Evidence of what the strategy actually did',
    'S2 intervention: Make the strategy produce evidence',
    'S2 thinking move: evaluate',
    'S2 audit: no_evidence'
  ];
  data.diagnosisAttempts = [{ selection: ['evidence'], result: 'strong', timestamp: now }];
  data.diagnosisFinal = ['evidence'];
  data.evidenceAttempts = [{ selection: ['evidence_check'], exact: true, consequence: 'Now Jordan has evidence he can act on.', timestamp: now }];
  data.evidenceFinal = ['evidence_check'];
  data.thinkingMoveAttempts = [{ selection: 'evaluate', timestamp: now }];
  data.thinkingMove = 'evaluate';
  data.auditAttempts = [{ selection: 'no_evidence', exact: true, weakness: 'no_evidence', timestamp: now }];
  data.repairAttempts = [];
  data.repairText = '';
  data.repairParts = {};
  data.repairDraftParts = {};
  data.repairDraftText = '';
  data.babbageDraft = { ...S2_LOCAL_DRAFT_FALLBACK };
  data.babbageReview = null;
  data.s2ReviewSource = '';
  data.structuredAnalysis = { s2_draft: data.babbageDraft };
  data.finalResponse = data.babbageDraft.activity_prompt;
  data.lastEvidenceFeedback = {
    heading: 'Now Jordan has evidence he can act on.',
    copy: 'Jordan is no longer guessing from a feeling or grade. He monitored understanding, connected evidence to the strategy, and made a decision.',
    tone: 'strong',
    choice: 'evidence_check'
  };
  data.openingCheckpointReached = true;

  renderS2RepairActivity();
  pcScheduleScenarioTask(pcFillS2DevRepairFields, 90, SCENARIO_INDEX.METACOGNITION);
  return false;
}

function resetS1Dev() {
    resetScenarioRunState(SCENARIO_INDEX.ENGAGEMENT);

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

    selectScenarioTab(SCENARIO_INDEX.ENGAGEMENT);

    window.scenarioIntroEnabled = true;
    if (Array.isArray(navCardShown)) navCardShown[SCENARIO_INDEX.ENGAGEMENT] = false;

    loadScenario(SCENARIO_INDEX.ENGAGEMENT);

    setTimeout(() => {
      pcFillS1DevFields();
    }, 120);
  }

pcExposeGlobals({
  pcClearVNStateForScenarioSwitch,
  pcFillS1DevFields,
  pcFillS2DevRepairFields,
  resetS1Dev,
  resetS2Dev
});

function prepareScenarioShell(index) {
  const scenario = scenarios[index];
  const ui = getScenarioUI(index);

  document.body.classList.remove('s1-active', 's1-result-active', 'pc-scenario-activity-active');
  document.body.classList.toggle('s1-active', ui.workspaceMode === 'guided' && ui.implemented);
  document.body.classList.toggle('pc-scenario-activity-active', ui.workspaceMode === 'activity' && ui.implemented);
  document.body.dataset.pcScenario = ui.key;
  document.body.dataset.pcWorkspace = ui.workspaceMode || 'development';

  const boardText = document.getElementById('vnBoardText');
  const chat = document.getElementById('chat');
  const boardLoading = document.getElementById('vnBoardLoading');
  const boardImage = document.getElementById('vnBoardImg');

  if (boardText) boardText.textContent = ui.boardText || scenario.desc;
  if (chat) chat.innerHTML = '';
  if (boardLoading) boardLoading.style.display = 'none';


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


function loadScenario(i) {
  const index = Number(i);
  if (!Number.isInteger(index) || !scenarios[index]) return;
  prepareScenarioShell(index);
  requestAnimationFrame(pcApplyIpadLayout);
  renderScenarioInput(index);
}


// ══════════════════════════════════════════════════════
//  OSCQR metadata detection (used for learning analytics, not interface chrome)
// ══════════════════════════════════════════════════════
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
  const isBabbage = role === 'babbage';

  const initials = getInitials(playerName);
  const hasName = playerName !== 'You';
  const avatarHTML = isUser
    ? `<div class="avatar user-av${hasName ? ' has-name' : ''}" aria-hidden="true">${initials}</div>`
    : isBabbage
      ? `<div class="babbage-avatar" aria-hidden="true">⌘</div>`
      : pixelAvatarHTML(pixelExpr || 'neutral');

  const senderLabel = isUser ? playerName : isBabbage ? 'Babbage' : 'Professor Pixel';

  wrap.innerHTML = `
    ${avatarHTML}
    <div class="bubble-wrap">
      <div class="bubble-sender">${senderLabel}</div>
      <div class="bubble">${html}</div>
    </div>`;
  area.appendChild(wrap);
  // Only scroll to bottom for user messages -- AI/Babbage messages handled by caller
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
  container.classList.remove('s1-workbench', 's1-clean-workbench', 'pc-scenario-workbench');
  pcRenderScenarioWorkspace(idx, container);
}



// ── MODE 3: OPEN WITH MEMORY HINT (Scenario 3) ───────


// ── MODE 4: PLAIN OPEN (Scenario 4 + skip target) ────

// ── UNIFIED SEND ENTRY POINT ──────────────────────────
// Guard state keeps the VN prediction prompt from reopening or re-submitting
// while Babbage is already processing. Without this, the VN click handler can
// turn one prompt into a tiny haunted carousel.
let predictionGateActive = false;
let isSubmittingToBabbage = false;

// ══════════════════════════════════════════════════════
//  SEND
// ══════════════════════════════════════════════════════
async function send() {
  if (scenarioIndex === SCENARIO_INDEX.ENGAGEMENT && typeof sendGuided === 'function') {
    return sendGuided();
  }
  return false;
}


function pcSetBabbageSubmitting(value) {
  isSubmittingToBabbage = !!value;
  window.isSubmittingToBabbage = !!value;
}

async function sendMain(text) {
  if (!text || isSubmittingToBabbage) return;
  if (scenarioIndex !== SCENARIO_INDEX.ENGAGEMENT || !getScenarioUI(scenarioIndex).implemented) return;

  const runToken = pcCaptureScenarioRun(SCENARIO_INDEX.ENGAGEMENT);
  pcSetBabbageSubmitting(true);
  attempts++;
  lastPromptText = text;
  const attEl = document.getElementById('attNum');
  if (attEl) attEl.textContent = attempts;

  history.push({ role: 'user', content: text });
  const btn = document.getElementById('sendBtn');
  if (btn) btn.disabled = true;
  addTyping();

  try {
    const data = await requestBabbageAnalysis({
      max_output_tokens: 5000,
      system: scenarios[SCENARIO_INDEX.ENGAGEMENT].system,
      messages: history
    }, 'main');
    if (!pcIsScenarioRunCurrent(runToken)) return;
    removeTyping();

    if (data.error) {
      addMsg('ai', `<span style="color:var(--red)">Error: ${esc(data.error.message || 'Babbage request failed.')}</span>`);
      return;
    }

    const reply = data.content?.[0]?.text || '';
    const structuredAnalysis = data.structured || null;
    history.push({ role: 'assistant', content: reply });

    const score = scorePrompt(text);
    const active = detectOSCQR(reply, scenarios[SCENARIO_INDEX.ENGAGEMENT].oscqr);
    trackPrompt(SCENARIO_INDEX.ENGAGEMENT, text, score.total, reply, active.map(id => {
      const indicator = scenarios[SCENARIO_INDEX.ENGAGEMENT].oscqr.find(item => item.id === id);
      return indicator ? indicator.label : id;
    }), {
      provider: data.provider || (data.mock ? 'local-fallback' : ''),
      model: data.model || '',
      request_id: data.request_id || '',
      elapsed_ms: data.elapsed_ms,
      usage: data.usage || null,
      structured: structuredAnalysis
    });

    gainXP(score.total * 6);
    lastScore = score.total;
    showBabbageFinalResponseInTerminal(reply, !!data.mock, () => {
      addS1BabbageResultCard(reply, structuredAnalysis);
      showS1PostAnalysisReflection(score.total);
    }, score.total, data.mockReason || '', structuredAnalysis);
  } catch (error) {
    if (pcIsScenarioRunCurrent(runToken)) {
      removeTyping();
      addMsg('ai', `<span style="color:var(--red)">Something went wrong. Please try again.</span>`);
    }
  } finally {
    pcSetBabbageSubmitting(false);
    predictionGateActive = false;
    const btn = document.getElementById('sendBtn');
    if (btn) btn.disabled = false;
  }
}

// ══════════════════════════════════════════════════════
function scorePrompt(text) {
  const value = String(text || '');
  const values = (window.playerHistory && window.playerHistory.s1) || getS1GuidedValues();
  const checks = analyzeS1Guided(values);
  const hasLearners = !!checks.audience;
  const hasGoal = !!checks.issue;
  const hasContext = !!checks.interaction;
  const hasConstraint = !!checks.constraints;
  const isDetailed = !!checks.success;
  const penalty = checks.demeaning ? 2 : 0;
  return {
    hasLearners, hasGoal, hasContext, hasConstraint, isDetailed,
    demeaning: !!checks.demeaning,
    total: Math.max(0, [hasLearners, hasGoal, hasContext, hasConstraint, isDetailed].filter(Boolean).length - penalty)
  };
}


// ══════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════
function parseS1BabbageStructuredResponse(text) {
  const raw = String(text || '').replace(/\r/g, '').trim();
  const headings = [
    ['status', 'STATUS'],
    ['confidence', 'CONFIDENCE'],
    ['summary', 'FEEDBACK SUMMARY'],
    ['worked', 'WHAT WORKED'],
    ['issue', 'ISSUE DETECTED'],
    ['repair', 'RECOMMENDED REPAIR'],
    ['impact', 'EXPECTED IMPACT'],
    ['draft', 'REVISED DISCUSSION PROMPT'],
    ['quality', 'COURSE QUALITY CHECK']
  ];
  const result = Object.fromEntries(headings.map(([key]) => [key, '']));
  let current = '';

  raw.split('\n').forEach(line => {
    const trimmed = line.trim();
    const normalized = trimmed
      .replace(/^#{1,4}\s*/, '')
      .replace(/^\*{1,2}|\*{1,2}$/g, '')
      .replace(/:$/, '')
      .trim()
      .toUpperCase();
    const match = headings.find(([, label]) => normalized === label);
    if (match) { current = match[0]; return; }
    if (!current) return;
    result[current] += (result[current] ? '\n' : '') + line;
  });

  Object.keys(result).forEach(key => { result[key] = result[key].trim(); });
  return result;
}

function cleanS1BabbageDraft(text) {
  const parsed = parseS1BabbageStructuredResponse(text);
  const draft = parsed.draft || String(text || '');
  return draft
    .replace(/^#{1,3}\s*Revised Discussion Prompt(?::[^\n]*)?\s*/i, '')
    .replace(/^Revised Discussion Prompt(?::[^\n]*)?\s*/i, '')
    .replace(/^Here's your redesigned discussion prompt:\s*/i, '')
    .replace(/^\s*---+\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function esc(t) {
  return String(t ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Minimal markdown formatter used by result cards and legacy chat bubbles.
// An earlier cleanup removed this helper, which made Consult Babbage crash after the mock response returned.
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

function closeReflection() {
  document.getElementById('reflectionOverlay').classList.remove('visible');
}

pcRegisterUIActions({
  'close-reflection': () => closeReflection(),
  'submit-reflection': (_target, event) => handleReflectionSubmit(event)
});

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
      pcDebug('[PromptCraft] Submitting full session payload:', payload);

      await postToSheets(payload, 'full session payload');
      pcDebug('[PromptCraft] Sheets submission sent');
    } catch(err) {
      console.warn('[PromptCraft] Sheets submission error:', err);
    }

    // Always also submit to Netlify Forms as a backup
    // This ensures data is never lost even if Sheets fails silently
    try {
      const netlifyData = new URLSearchParams();
      netlifyData.append('form-name', 'promptcraft-reflection');
      formData.forEach((v, k) => netlifyData.append(k, v));
      await fetch(pcProjectUrl(''), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: netlifyData.toString()
      });
      pcDebug('[PromptCraft] Netlify fallback sent');
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
      if (el && narrative) el.innerHTML = fmt(narrative);
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
    const res = await fetch(pcProjectUrl(''), {
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
        if (el && narrative) el.innerHTML = fmt(narrative);
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
