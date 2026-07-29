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
  const afterIntroActions = {
    's2-diagnosis': renderS2DiagnosisActivity
  };
  const onDone = () => {
    if (useSpecialIntroLayout) overlay?.classList.remove('scenario-intro-active');
    const action = afterIntroActions[ui.afterIntroAction];
    if (typeof action === 'function') action();
  };

  if (window.scenarioIntroTimer) clearTimeout(window.scenarioIntroTimer);
  window.scenarioIntroTimer = null;

  // v218: Start the VN overlay in the same task as the scenario render. The old
  // 300 ms pause exposed the workbench while navigation and generated fields
  // settled, making the entire page appear to drop just before the challenge.
  window.pcScenarioIntroPending = false;
  pcApplyIpadLayoutV200();
  playPixelSequence(getScenarioStartDialogueKey(index), onDone);
  requestAnimationFrame(pcApplyIpadLayoutV200);
  window.setTimeout(pcApplyIpadLayoutV200, 120);
}


function switchScenario(i, btn) {
  const index = Number(i);
  if (!Number.isInteger(index) || !scenarios[index]) return false;

  pcClearVNStateForScenarioSwitch();
  resetScenarioRunState(index);
  selectScenarioTab(index, btn);
  window.scenarioIntroEnabled = true;
  // v216: Mark the introduction before rendering the workbench. This prevents
  // its first textarea from briefly stealing focus and scrolling the page just
  // before Professor Pixel states the challenge.
  window.pcScenarioIntroPending = Boolean(getScenarioUI(index).implemented);
  loadScenario(index);

  if (getScenarioUI(index).implemented) playScenarioIntroduction(index);
  else window.pcScenarioIntroPending = false;
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
  overlay?.classList.remove('pc-dual-character');
  document.querySelectorAll('#vnPredictionChoicePanel,#predictionGate,.pc-choice-panel-final,.pc-clean-choice-grid,.vn-choice-list').forEach(el => el.remove());
  if (typeof pcClearPredictionPresentationV191 === 'function') pcClearPredictionPresentationV191();

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

  document.body.classList.remove('s1-active', 's1-result-active', 'pc-scenario-activity-active');
  document.body.classList.toggle('s1-active', ui.workspaceMode === 'guided' && ui.implemented);
  document.body.classList.toggle('pc-scenario-activity-active', ui.workspaceMode === 'activity' && ui.implemented);
  document.body.dataset.pcScenario = ui.key;
  document.body.dataset.pcWorkspace = ui.workspaceMode || 'development';

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
  requestAnimationFrame(pcApplyIpadLayoutV200);
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
const PC_SCENARIO_RENDERERS = Object.freeze({
  'guided-builder': ({ container }) => renderGuidedBuilder(container),
  'metacognition-opening': ({ container }) => renderS2Standby(container),
  'development-shell': ({ index }) => renderScenarioPlaceholder(index)
});

function renderInputMode(idx) {
  const container = document.getElementById('inputContainer');
  if (!container) return;
  container.classList.remove('s1-workbench', 's1-clean-workbench', 'pc-scenario-workbench');

  const ui = getScenarioUI(idx);
  const renderer = PC_SCENARIO_RENDERERS[ui.rendererKey] || PC_SCENARIO_RENDERERS['development-shell'];
  renderer({ index: idx, container, ui });
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
      // v216: Keep the CSS-defined three-row height during the opening. Calling
      // autoGrow on an empty field immediately after insertion caused the
      // workbench to contract and expand behind the VN scene.
      el.style.removeProperty('height');
    }
  });

  if (typeof onGuidedInput === 'function') {
    // Update chips and guidance without resizing an empty textarea.
    onGuidedInput(null);
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
        <div class="s1-clean-title s1-clean-title--small">Observed Problems</div>
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
  setTimeout(() => {
    if (!pcScenarioInputMayReceiveFocusV216()) return;
    pcFocusWithoutScroll(document.getElementById('g-learners'));
  }, 60);
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

// v191: Authoritative prediction presentation. The responsive prediction
// layout is rebuilt dynamically, so the JavaScript that creates it also owns
// the final grid width, spacing, portrait offset, and hidden expression badge.
function pcPredictionViewportWidthV191(){
  return Math.round(
    window.visualViewport?.width ||
    document.documentElement?.clientWidth ||
    window.innerWidth ||
    1920
  );
}

function pcPredictionViewportHeightV191(){
  return Math.round(
    window.visualViewport?.height ||
    document.documentElement?.clientHeight ||
    window.innerHeight ||
    1080
  );
}

function pcClearPredictionPresentationV191(){
  const overlay = document.getElementById('vnOverlay');
  const output = document.getElementById('claudeTerminalOutput');
  const speaker = document.getElementById('vnSpeaker');
  const vnText = document.getElementById('vnText');
  const feedbackCopy = document.querySelector('#vnText .pc-feedback-copy');
  const feedbackMessage = document.querySelector('#vnText .pc-feedback-message');
  const feedbackHeading = document.querySelector('#vnText .pc-feedback-heading');
  const dialogue = document.getElementById('vnDialogue');
  const character = document.getElementById('vnCharacter');
  const panel = document.getElementById('vnPredictionChoicePanel');
  const choiceButtons = panel?.querySelectorAll('.pc-clean-choice-btn') || [];
  const continueButton = document.getElementById('pcContinueToClaudeBtn');

  pcRemoveInlineStyles(output, [
    'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align',
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'margin', 'padding', 'transform'
  ]);
  pcRemoveInlineStyles(speaker, [
    'margin-left', 'margin-top', 'font-size', 'line-height', 'margin-bottom',
    'grid-column', 'grid-row', 'align-self'
  ]);
  pcRemoveInlineStyles(vnText, ['grid-column', 'grid-row', 'align-self']);
  pcRemoveInlineStyles(feedbackCopy, [
    'padding-left', 'padding-right', 'box-sizing', 'font-size', 'line-height'
  ]);
  pcRemoveInlineStyles(feedbackMessage, [
    'padding-left', 'padding-right', 'box-sizing', 'font-size', 'line-height'
  ]);
  pcRemoveInlineStyles(feedbackHeading, [
    'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'font-size', 'line-height'
  ]);
  choiceButtons.forEach((button) => pcRemoveInlineStyles(button, [
    'font-size', 'line-height', 'padding-top', 'padding-right',
    'padding-bottom', 'padding-left', 'min-height'
  ]));
  pcRemoveInlineStyles(continueButton, [
    'font-size', 'line-height', 'padding-top', 'padding-right',
    'padding-bottom', 'padding-left', 'min-height',
    'position', 'top', 'right', 'bottom', 'left', 'transform',
    'margin-top', 'margin-right', 'margin-bottom', 'margin-left'
  ]);
  pcRemoveInlineStyles(dialogue, [
    'display', 'grid-template-columns', 'grid-template-rows', 'column-gap',
    'row-gap', 'align-items', 'height', 'min-height', 'max-height',
    'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'box-sizing', 'overflow'
  ]);
  pcRemoveInlineStyles(character, ['left', 'right', 'height', 'max-height', 'transform']);
  pcRemoveInlineStyles(panel, [
    'position', 'inset', 'left', 'right', 'top', 'bottom',
    'translate', 'transform', 'width', 'max-width',
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'justify-self', 'align-self', 'justify-content', 'place-self',
    'grid-column', 'grid-row'
  ]);
  overlay?.style.removeProperty('--pc-prediction-dialogue-height');
  window.pcPredictionQuestionStatusCenterRatioV206 = null;

}

function pcPredictionOuterHeightV191(element){
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  const styles = window.getComputedStyle(element);
  const marginTop = Number.parseFloat(styles.marginTop) || 0;
  const marginBottom = Number.parseFloat(styles.marginBottom) || 0;
  return rect.height + marginTop + marginBottom;
}

function pcFitPredictionDialogueV191(viewportWidth){
  if (viewportWidth > 1510) return;

  const overlay = document.getElementById('vnOverlay');
  const dialogue = document.getElementById('vnDialogue');
  const speaker = document.getElementById('vnSpeaker');
  const vnText = document.getElementById('vnText');
  const panel = document.getElementById('vnPredictionChoicePanel');
  if (!overlay || !dialogue || !speaker || !vnText) return;

  // Measure the CSS-owned baseline on every pass so rotating or resizing can
  // shrink the dialogue again instead of preserving a stale inline height.
  overlay.style.removeProperty('--pc-prediction-dialogue-height');
  pcRemoveInlineStyles(dialogue, ['height', 'min-height', 'max-height']);

  const dialogueStyles = window.getComputedStyle(dialogue);
  // v231: Phone prediction panels should be measured from their real content,
  // not from the legacy 35vh minimum that created a hollow black reservation.
  const baselineHeight = viewportWidth <= 700
    ? 250
    : 270;
  const paddingTop = Number.parseFloat(dialogueStyles.paddingTop) || 0;
  const paddingBottom = Number.parseFloat(dialogueStyles.paddingBottom) || 0;
  const requiredHeight = Math.ceil(
    paddingTop +
    paddingBottom +
    pcPredictionOuterHeightV191(speaker) +
    pcPredictionOuterHeightV191(vnText) +
    (panel ? pcPredictionOuterHeightV191(panel) : 0) +
    2
  );

  const viewportHeight = pcPredictionViewportHeightV191();
  const extraDesktopResultBottomSpace =
    overlay?.classList.contains('pc-prediction-result') && viewportWidth > 1510 ? 40 : 0;
  const compactMobileHeightRatio = viewportWidth <= 340 ? 0.62 : 0.50;
  const maximumHeight = Math.max(
    baselineHeight,
    Math.floor(viewportHeight * (viewportWidth <= 700
      ? compactMobileHeightRatio
      : (overlay?.classList.contains('pc-prediction-result') ? 0.45 : 0.40)))
  );
  const targetHeight = Math.min(
    Math.max(Math.ceil(baselineHeight), requiredHeight + extraDesktopResultBottomSpace),
    maximumHeight
  );

  overlay.style.setProperty(
    '--pc-prediction-dialogue-height',
    `${targetHeight}px`,
    'important'
  );
  pcSetImportantStyles(dialogue, [
    ['height', `${targetHeight}px`],
    ['min-height', `${targetHeight}px`],
    ['max-height', `${targetHeight}px`]
  ]);
}

// [PREDICTION DIALOGUE: RESPONSIVE PRESENTATION]
function pcApplyPredictionPresentationV191(){
  if (!pcPredictionIsOpen()) return false;

  const viewportWidth = pcPredictionViewportWidthV191();
  const overlay = document.getElementById('vnOverlay');
  const isPredictionResult = !!overlay?.classList.contains('pc-prediction-result');
  const output = document.getElementById('claudeTerminalOutput');
  const speaker = document.getElementById('vnSpeaker');
  const feedbackCopy = document.querySelector('#vnText .pc-feedback-copy');
  const feedbackMessage = document.querySelector('#vnText .pc-feedback-message');
  const feedbackHeading = document.querySelector('#vnText .pc-feedback-heading');
  const dialogue = document.getElementById('vnDialogue');
  const character = document.getElementById('vnCharacter');
  const panel = document.getElementById('vnPredictionChoicePanel');
  const choiceButtons = panel?.querySelectorAll('.pc-clean-choice-btn') || [];
  const continueButton = document.getElementById('pcContinueToClaudeBtn');
  const terminal = document.getElementById('claudeTerminalScene');
  const terminalPhoto = terminal?.querySelector('.claude-terminal-photo');
  const terminalScreen = terminal?.querySelector('.claude-terminal-screen');
  const viewportHeight = pcPredictionViewportHeightV191();
  const isPhonePrediction = viewportWidth <= 700;
  const isCompactPrediction = viewportWidth > 700 && viewportWidth <= 1510;

  // v260: Prediction has only two visual modes. Phones use the simplified
  // green terminal background; every wider viewport reuses the same approved
  // photographed workstation geometry. This removes the old iPad-only frame
  // that jumped at 1180px and left the CRT overlay behind while resizing.
  if (isPhonePrediction) {
    pcClearPredictionLayoutInlineStylesV186();
  } else {
    pcApplyWidePredictionComputerV207(
      terminal,
      terminalPhoto,
      terminalScreen,
      viewportHeight
    );
    if (isCompactPrediction) {
      pcSetImportantStyles(terminal, [
        ['top', '28.5%'],
        ['width', 'min(72vw, 920px)']
      ]);
    }
  }

  // The status must remain readable across phones and tablet/iPad widths.
  // Wide desktop keeps the approved workstation typography unchanged.
  if (output && viewportWidth <= 700) {
    // v243: Use one fixed mobile position for both the question and logged-result
    // beats. Recalculating against a changed containing block made the same
    // AWAITING PREDICTION label jump upward after a choice was recorded.
    const mobileStatusTop = '29%';

    pcSetImportantStyles(output, [
      ['position', 'absolute'],
      ['inset', 'auto'],
      ['left', '0'],
      ['right', '0'],
      ['top', mobileStatusTop],
      ['bottom', 'auto'],
      ['width', '100%'],
      ['height', 'auto'],
      ['margin', '0'],
      ['padding', '0'],
      ['transform', 'translateY(-50%)'],
      ['font-size', 'clamp(1.12rem, 4.7vw, 1.38rem)'],
      ['font-weight', '900'],
      ['line-height', '1.12'],
      ['letter-spacing', '.04em'],
      ['text-align', 'center']
    ]);

  } else if (output && isCompactPrediction) {
    pcRemoveInlineStyles(output, [
      'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
      'margin', 'padding', 'transform'
    ]);
    pcSetImportantStyles(output, [
      ['font-size', '14px'],
      ['font-weight', '900'],
      ['line-height', '1.08'],
      ['letter-spacing', '.02em'],
      ['text-align', 'center'],
      ['white-space', 'nowrap']
    ]);
  } else {
    pcRemoveInlineStyles(output, [
      'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align',
      'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
      'margin', 'padding', 'transform'
    ]);
  }

  // The shared workstation helper above owns CRT geometry for every non-phone
  // prediction size. Only the screen's internal alignment needs reasserting.
  if (terminalScreen && !isPhonePrediction) {
    pcSetImportantStyles(terminalScreen, [
      ['padding', 'clamp(12px, 1.4vw, 20px)'],
      ['box-sizing', 'border-box'],
      ['display', 'flex'],
      ['align-items', 'center'],
      ['justify-content', 'center'],
      ['overflow', 'hidden']
    ]);
  }


  // v201: Use the approved intro-scene alignment and typography on iPad.
  // Phones keep their existing scale, while desktop remains untouched.
  if (speaker) {
    pcRemoveInlineStyles(speaker, ['margin-left', 'margin-top']);
    if (viewportWidth <= 700) {
      // v231: Keep the name and question together as one compact reading
      // block. The previous 16px gap contributed to the oversized black band.
      pcSetImportantStyles(speaker, [
        ['font-size', '1.15rem'],
        ['line-height', '1.15'],
        ['margin-bottom', '8px'],
        ['flex-shrink', '0']
      ]);
    } else {
      pcSetImportantStyles(speaker, [
        ['font-size', '22px'],
        ['line-height', '1.18'],
        ['margin-bottom', '10px']
      ]);
    }
  }

  if (speaker && viewportWidth <= 1510) {
    pcSetImportantStyles(speaker, [['flex-shrink', '0']]);
  } else if (speaker) {
    pcRemoveInlineStyles(speaker, ['flex-shrink']);
  }

  // v197: Align the white copy on both the prediction question and the
  // logged-prediction feedback screen. The result message has its own wrapper
  // so the Continue to Claude button keeps its approved position.
  const feedbackTextTarget = feedbackMessage || feedbackCopy;
  if (viewportWidth <= 1510) {
    const compactTextStyles = [
      ['flex-shrink', '0'],
      ['min-height', '0']
    ];
    compactTextStyles.push(
      ['width', '100%'],
      ['max-width', 'none'],
      ['box-sizing', 'border-box'],
      ['font-size', isPhonePrediction ? '1rem' : '18px'],
      ['line-height', isPhonePrediction ? '1.45' : '1.5']
    );
    pcSetImportantStyles(vnText, compactTextStyles);
  } else {
    pcRemoveInlineStyles(vnText, [
      'flex-shrink', 'min-height', 'width', 'max-width', 'box-sizing'
    ]);
  }

  if (feedbackTextTarget && viewportWidth <= 700) {
    pcSetImportantStyles(feedbackTextTarget, [
      // v231: Match the question copy to Professor Pixel's left edge.
      ['padding-left', '0'],
      ['padding-right', '0'],
      ['box-sizing', 'border-box'],
      ['width', '100%'],
      ['max-width', 'none'],
      ['font-size', '1rem'],
      ['line-height', '1.45']
    ]);
    if (feedbackHeading) {
      pcSetImportantStyles(feedbackHeading, [
        ['margin-top', '0'],
        ['margin-right', '0'],
        ['margin-bottom', '8px'],
        ['margin-left', '0'],
        ['line-height', '1.18']
      ]);
    }
  } else if (feedbackTextTarget && isCompactPrediction) {
    pcSetImportantStyles(feedbackTextTarget, [
      ['padding-left', '0'],
      ['padding-right', '0'],
      ['box-sizing', 'border-box'],
      ['width', '100%'],
      ['max-width', 'none'],
      ['font-size', '18px'],
      ['line-height', '1.5']
    ]);
  } else {
    pcRemoveInlineStyles(feedbackCopy, [
      'padding-left', 'padding-right', 'box-sizing', 'width', 'max-width',
      'font-size', 'line-height'
    ]);
    pcRemoveInlineStyles(feedbackMessage, [
      'padding-left', 'padding-right', 'box-sizing', 'width', 'max-width',
      'font-size', 'line-height'
    ]);
    pcRemoveInlineStyles(feedbackHeading, [
      'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
      'font-size', 'line-height'
    ]);
  }

  if (isCompactPrediction) {
    choiceButtons.forEach((button) => pcSetImportantStyles(button, [
      ['font-size', '16px'],
      ['line-height', '1.22'],
      ['padding-top', '12px'],
      ['padding-right', '18px'],
      ['padding-bottom', '12px'],
      ['padding-left', '18px'],
      ['min-height', '50px']
    ]));
    pcSetImportantStyles(continueButton, [
      ['font-size', '16px'],
      ['line-height', '1.2'],
      ['padding-top', '12px'],
      ['padding-right', '20px'],
      ['padding-bottom', '12px'],
      ['padding-left', '20px'],
      ['min-height', '50px']
    ]);
  } else if (viewportWidth <= 700) {
    choiceButtons.forEach((button) => pcSetImportantStyles(button, [
      ['position', 'relative'],
      ['width', '100%'],
      ['min-width', '0'],
      ['min-height', '46px'],
      ['margin', '0'],
      ['padding-top', '11px'],
      ['padding-right', '12px'],
      ['padding-bottom', '11px'],
      ['padding-left', '12px'],
      ['box-sizing', 'border-box'],
      ['font-size', 'clamp(.72rem, 2.8vw, .84rem)'],
      ['line-height', '1.2'],
      ['white-space', 'normal']
    ]));
    pcSetImportantStyles(continueButton, [
      ['font-size', 'clamp(.76rem, 2.9vw, .86rem)'],
      ['line-height', '1.2'],
      ['padding-top', '11px'],
      ['padding-right', '16px'],
      ['padding-bottom', '11px'],
      ['padding-left', '16px'],
      ['min-height', '46px']
    ]);
  } else {
    choiceButtons.forEach((button) => pcRemoveInlineStyles(button, [
      'position', 'width', 'min-width', 'font-size', 'line-height',
      'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
      'min-height', 'margin', 'box-sizing', 'white-space'
    ]));
    pcRemoveInlineStyles(continueButton, [
      'font-size', 'line-height', 'padding-top', 'padding-right',
      'padding-bottom', 'padding-left', 'min-height'
    ]);
  }

  // v209: Keep a visible reading gap between the desktop feedback copy and
  // its action. The v207 negative top offset solved clipping by pulling the
  // button upward, but it also crowded the final line of text.
  if (continueButton && isPredictionResult && viewportWidth > 1510) {
    pcSetImportantStyles(continueButton, [
      ['position', 'relative'],
      ['top', '0'],
      ['right', 'auto'],
      ['bottom', 'auto'],
      ['left', 'auto'],
      ['transform', 'none'],
      ['margin-top', '20px'],
      ['margin-right', '0'],
      ['margin-bottom', '32px'],
      ['margin-left', '0']
    ]);
    pcSetImportantStyles(vnText, [
      ['padding-bottom', '30px'],
      ['box-sizing', 'border-box']
    ]);
  } else {
    pcRemoveInlineStyles(continueButton, [
      'position', 'top', 'right', 'bottom', 'left', 'transform',
      'margin-top', 'margin-right', 'margin-bottom', 'margin-left'
    ]);
    pcRemoveInlineStyles(vnText, ['padding-bottom', 'box-sizing']);
  }

  // Pixel's PNG contains transparent space on its left edge. Move the actual
  // portrait left without dragging the dialogue copy toward the brackets.
  if (character) {
    const characterLeft = viewportWidth <= 480
      ? '0px'
      : viewportWidth <= 700
        ? '-8px'
        : viewportWidth <= 1510
          ? 'clamp(12px, 3vw, 42px)'
          : 'clamp(28px, 3.5vw, 70px)';
    pcSetImportantStyles(character, [
      ['left', characterLeft],
      ['right', 'auto'],
      ['transform', 'none']
    ]);

    // One fixed portrait scale for the entire intermediate range. The old
    // height-sensitive iPad branch made Pixel jump in size at nearly identical
    // widths and pushed the workstation off its expected center.
    if (isCompactPrediction) {
      pcSetImportantStyles(character, [
        ['height', 'clamp(280px, 34vh, 350px)'],
        ['max-height', '350px']
      ]);
    } else {
      pcRemoveInlineStyles(character, ['height', 'max-height']);
    }
  }

  // v241: Clear stale wide-screen grid values before applying the compact
  // phone/tablet layout. In v240 this ran afterward and erased the mobile flex
  // layout it was supposed to protect, because CSS apparently wanted paperwork.
  if (viewportWidth <= 1510) {
    pcRemoveInlineStyles(dialogue, [
      'display', 'grid-template-columns', 'grid-template-rows', 'column-gap',
      'row-gap', 'align-items', 'min-height', 'height', 'max-height',
      'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
      'box-sizing', 'overflow'
    ]);
    pcRemoveInlineStyles(speaker, [
      'grid-column', 'grid-row', 'align-self'
    ]);
    pcRemoveInlineStyles(vnText, [
      'grid-column', 'grid-row', 'align-self'
    ]);
    pcRemoveInlineStyles(panel, [
      'grid-column', 'grid-row', 'justify-self', 'align-self', 'place-self'
    ]);
  }

  // The compact prediction dialogue was forming an implicit max-content grid
  // column, which kept both the copy and the answer grid stranded on the left.
  if (dialogue && viewportWidth <= 1510) {
    const compactDialogueStyles = [
      ['grid-template-columns', 'minmax(0, 1fr)'],
      ['row-gap', '0']
    ];

    compactDialogueStyles.push(
      ['display', 'flex'],
      ['flex-direction', 'column'],
      ['justify-content', 'flex-start'],
      ['align-items', 'stretch'],
      ['padding-top', viewportWidth <= 700 ? '18px' : '24px'],
      ['padding-right', viewportWidth <= 700 ? '22px' : 'clamp(36px, 5vw, 64px)'],
      ['padding-bottom', viewportWidth <= 700 ? '16px' : '24px'],
      ['padding-left', viewportWidth <= 700 ? '22px' : 'clamp(36px, 5vw, 64px)'],
      ['box-sizing', 'border-box'],
      ['overflow', 'visible']
    );

    pcSetImportantStyles(dialogue, compactDialogueStyles);
  } else {
    pcRemoveInlineStyles(dialogue, [
      'grid-template-columns', 'row-gap', 'display', 'flex-direction',
      'justify-content', 'padding-top', 'padding-right', 'padding-bottom',
      'padding-left', 'box-sizing', 'overflow'
    ]);
  }

  if (panel) {
    if (viewportWidth <= 1510) {
      const panelWidth = viewportWidth <= 700
        ? '100%'
        : 'min(760px, calc(100% - 48px))';
      const panelMaxWidth = viewportWidth <= 700 ? 'none' : '760px';
      const panelGap = viewportWidth <= 480
        ? '14px'
        : viewportWidth <= 700
          ? '18px'
          : '16px';

      // v231: Explicitly put the panel in normal flow. Merely removing an
      // inline position allowed an older !important stylesheet rule to make it
      // absolute again, leaving a large empty black reservation above it.
      pcSetImportantStyles(panel, [
        ['position', 'static'],
        ['inset', 'auto'],
        ['left', 'auto'],
        ['right', 'auto'],
        ['top', 'auto'],
        ['bottom', 'auto'],
        ['translate', 'none'],
        ['transform', 'none'],
        ['width', panelWidth],
        ['max-width', panelMaxWidth],
        ['margin-top', panelGap],
        ['margin-right', 'auto'],
        ['margin-bottom', '0'],
        ['margin-left', 'auto'],
        ['padding', viewportWidth <= 700 ? '6px 4px 4px' : '0'],
        ['box-sizing', 'border-box'],
        ['display', 'grid'],
        ['grid-template-columns', viewportWidth <= 340 ? '1fr' : 'repeat(2, minmax(0, 1fr))'],
        ['grid-auto-rows', viewportWidth <= 700 ? 'minmax(46px, auto)' : 'auto'],
        ['gap', viewportWidth <= 700 ? '10px' : '12px'],
        ['height', 'auto'],
        ['min-height', '0'],
        ['flex-shrink', '0'],
        ['justify-self', 'center'],
        ['align-self', 'stretch'],
        ['justify-content', 'center'],
        ['place-self', 'auto']
      ]);
    } else {
      // The photographed workstation layout remains intact above 1510px. Only
      // the answer group is centered across the viewport.
      pcSetImportantStyles(panel, [
        ['position', 'fixed'],
        ['inset', 'auto'],
        ['left', '50%'],
        ['right', 'auto'],
        ['top', 'auto'],
        ['bottom', '20px'],
        ['translate', 'none'],
        ['transform', 'translateX(-50%)'],
        ['width', 'min(920px, calc(100vw - 96px))'],
        ['max-width', '920px'],
        ['margin', '0'],
        ['justify-self', 'center'],
        ['justify-content', 'center'],
        ['place-self', 'auto']
      ]);
    }
  }

  // v243: The logged-result beat no longer has an answer panel, so clear the
  // wide question grid instead of leaving the copy trapped in its 500px column.
  // A wider result message prevents needless wrapping and keeps Continue to
  // Claude inside the visible bottom panel.
  if (viewportWidth > 1510 && isPredictionResult && dialogue && speaker && vnText) {
    pcSetImportantStyles(dialogue, [
      ['display', 'flex'],
      ['flex-direction', 'column'],
      ['justify-content', 'flex-start'],
      ['align-items', 'stretch'],
      ['grid-template-columns', 'none'],
      ['grid-template-rows', 'none'],
      ['column-gap', '0'],
      ['row-gap', '0'],
      ['min-height', '230px'],
      ['height', 'auto'],
      ['max-height', 'none'],
      ['padding-top', '28px'],
      ['padding-right', 'clamp(48px, 5vw, 96px)'],
      ['padding-bottom', '28px'],
      ['padding-left', 'clamp(56px, 4.5vw, 90px)'],
      ['box-sizing', 'border-box'],
      ['overflow', 'visible']
    ]);

    pcSetImportantStyles(speaker, [
      ['grid-column', 'auto'],
      ['grid-row', 'auto'],
      ['align-self', 'auto'],
      ['margin-bottom', '10px']
    ]);

    pcSetImportantStyles(vnText, [
      ['grid-column', 'auto'],
      ['grid-row', 'auto'],
      ['align-self', 'auto'],
      ['width', '100%'],
      ['max-width', 'min(1280px, calc(100vw - 180px))'],
      ['padding-bottom', '0'],
      ['box-sizing', 'border-box']
    ]);

    pcSetImportantStyles(feedbackCopy, [
      ['width', '100%'],
      ['max-width', 'min(1280px, calc(100vw - 180px))'],
      ['margin', '0']
    ]);

    pcSetImportantStyles(feedbackMessage, [
      ['width', '100%'],
      ['max-width', 'min(1280px, calc(100vw - 180px))']
    ]);

    pcSetImportantStyles(continueButton, [
      ['position', 'relative'],
      ['inset', 'auto'],
      ['transform', 'none'],
      ['margin-top', '18px'],
      ['margin-right', '0'],
      ['margin-bottom', '0'],
      ['margin-left', '0']
    ]);
  }

  // v239: On wide screens, keep the question and choices in separate grid
  // columns inside the same dialogue panel. The former fixed, centered choice
  // group crossed over the question whenever the sentence wrapped.
  if (viewportWidth > 1510 && dialogue && speaker && vnText && panel) {
    pcSetImportantStyles(dialogue, [
      ['display', 'grid'],
      ['grid-template-columns', 'minmax(360px, 500px) minmax(620px, 1fr)'],
      ['grid-template-rows', 'auto auto'],
      ['column-gap', 'clamp(34px, 3vw, 64px)'],
      ['row-gap', '8px'],
      ['align-items', 'start'],
      ['min-height', '250px'],
      ['height', 'auto'],
      ['max-height', 'none'],
      ['padding-top', '28px'],
      ['padding-right', 'clamp(48px, 5vw, 96px)'],
      ['padding-bottom', '28px'],
      ['padding-left', 'clamp(56px, 4.5vw, 90px)'],
      ['box-sizing', 'border-box'],
      ['overflow', 'visible']
    ]);

    pcSetImportantStyles(speaker, [
      ['grid-column', '1'],
      ['grid-row', '1'],
      ['align-self', 'end'],
      ['margin-bottom', '4px']
    ]);

    pcSetImportantStyles(vnText, [
      ['grid-column', '1'],
      ['grid-row', '2'],
      ['align-self', 'start'],
      ['max-width', '500px']
    ]);

    pcSetImportantStyles(panel, [
      ['position', 'static'],
      ['inset', 'auto'],
      ['left', 'auto'],
      ['right', 'auto'],
      ['top', 'auto'],
      ['bottom', 'auto'],
      ['translate', 'none'],
      ['transform', 'none'],
      ['grid-column', '2'],
      ['grid-row', '1 / span 2'],
      ['width', '100%'],
      ['max-width', '920px'],
      ['margin', '0'],
      ['justify-self', 'center'],
      ['align-self', 'center'],
      ['justify-content', 'center'],
      ['place-self', 'center'],
      ['grid-template-columns', 'repeat(2, minmax(240px, 1fr))'],
      ['gap', '14px']
    ]);
  }

  if (dialogue && viewportWidth <= 1510) {
    pcFitPredictionDialogueV191(viewportWidth);
  }

  return true;
}

function pcQueuePredictionPresentationV191(){
  const apply = () => pcApplyPredictionPresentationV191();
  apply();
  requestAnimationFrame(apply);
  window.setTimeout(apply, 80);
}

let pcPredictionResizeFrameV260 = 0;
function pcSchedulePredictionPresentationV260(){
  if (pcPredictionResizeFrameV260) cancelAnimationFrame(pcPredictionResizeFrameV260);
  pcPredictionResizeFrameV260 = requestAnimationFrame(() => {
    pcPredictionResizeFrameV260 = 0;
    pcApplyPredictionPresentationV191();
  });
}

if (!window.pcPredictionPresentationV191Installed) {
  window.pcPredictionPresentationV191Installed = true;
  window.addEventListener('resize', pcSchedulePredictionPresentationV260, { passive: true });
  window.addEventListener('orientationchange', pcSchedulePredictionPresentationV260, { passive: true });
  window.visualViewport?.addEventListener('resize', pcSchedulePredictionPresentationV260, { passive: true });
}

window.pcApplyPredictionPresentation = pcApplyPredictionPresentationV191;

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

  pcQueuePredictionPresentationV191();
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
  try { pcClearPredictionLayoutInlineStylesV186(); } catch(e) {}
  pcQueueModernTerminalAlignmentV147();
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

  pcQueuePredictionPresentationV191();
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
        <div class="pc-feedback-message">
          <div class="pc-feedback-heading"><strong>Your prediction is logged.</strong></div>
          <div>${reaction}</div>
        </div>
        <button id="pcContinueToClaudeBtn" class="prediction-continue-btn" type="button">Continue to Claude →</button>
      </div>`;
    document.getElementById('pcContinueToClaudeBtn')?.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      pcContinueToClaudeAnalysis();
    });
  }
  pcQueuePredictionPresentationV191();
}

function pcContinueToClaudeAnalysis(){
  const text = window.pendingPromptAfterPrediction;
  if (!text || window.isSubmittingToClaude || (typeof isSubmittingToClaude !== 'undefined' && isSubmittingToClaude)) return false;

  // v160: Capture the correctly rendered prediction computer synchronously,
  // before any overlay classes are changed. The earlier asynchronous capture
  // could run after the prediction layout had already been removed, leaving the
  // stored frame null and giving the analyzing screen nothing useful to reuse.
  const predictionTerminal = document.getElementById('claudeTerminalScene');
  const predictionFrameCaptured = pcCapturePredictionTerminalFrameV159(predictionTerminal);
  console.info(
    '[PromptCraft] Prediction terminal frame capture:',
    predictionFrameCaptured ? { ...pcPredictionTerminalFrameV159 } : null
  );

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
  pcClearPredictionPresentationV191();

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

  // Reapply the captured prediction frame after the analyzing DOM state and
  // its CSS classes have finished changing. Multiple passes cover the first
  // layout frame and late font/image sizing without relying on resize events.
  const applyCapturedPredictionFrame = () => {
    const terminal = document.getElementById('claudeTerminalScene');
    const photo = terminal?.querySelector('.claude-terminal-photo');
    if (terminal && photo) pcApplyPredictionTerminalFrameV159(terminal, photo);
    pcAlignModernTerminalScreenV149();
  };
  requestAnimationFrame(applyCapturedPredictionFrame);
  window.setTimeout(applyCapturedPredictionFrame, 50);
  window.setTimeout(applyCapturedPredictionFrame, 220);

  sendMain(text);
  return false;
}

function sendText(text){
  if (!text || window.isSubmittingToClaude || (typeof isSubmittingToClaude !== 'undefined' && isSubmittingToClaude) || window.pcWaitingForClaudeContinue) return false;
  const btn = document.getElementById('sendBtn');
  if (btn) btn.disabled = true;
  return pcShowPredictionGate(text);
}

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
    version: PC_APP_VERSION,
    build: PC_APP_BUILD_LABEL,
    schema: PC_APP_SCHEMA_VERSION
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


