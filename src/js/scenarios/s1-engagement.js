// ══════════════════════════════════════════════════════
//  SCENARIO 1 — ENGAGEMENT WORKBENCH
//  Guided repair builder, analysis handoff, score reflection, and revision.
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
  const learners = String(values.learners || '').toLowerCase();
  const issue = String(values.issue || '').toLowerCase();
  const interaction = String(values.interaction || '').toLowerCase();
  const constraints = String(values.constraints || '').toLowerCase();
  const allText = `${learners} ${issue} ${interaction} ${constraints}`;
  const demeaning = /\b(stupid|idiot|idiots|lazy|dumb|moron|morons|hate (?:these|my|the) students|students suck)\b/.test(allText);
  const audience = /\b(student|learner|class|course|online|first-year|adult|faculty|cohort|gen ed|general education|asynchronous|undergraduate|graduate)\b/.test(learners)
    && learners.replace(/\b(student|students|learner|learners|class|course|online|asynchronous)\b/g, '').trim().length >= 4;
  const issueOK = /\b(one[ -]?sentence|surface|shallow|dead|not build|do not build|generic|canned|reply|replies|conversation|dies|stops|weak|required|evidence|reading)\b/.test(issue)
    && !/^\s*(it sucks|bad|terrible|awful|students suck)\s*[.!]?\s*$/.test(issue);
  const interactionOK = /\b(compare|contrast|respond|reply|peer|build|question|evidence|example|explain|reason|connect|disagree|agree|extend|challenge|follow[ -]?up|interpret|apply|analy[sz]e|synthesi[sz]e)\b/.test(interaction)
    && /\b(student|they|peer|classmate|reply|respond|compare|contrast|question|evidence|example|explain|reason|extend|challenge|build)\b/.test(interaction);
  const constraintsOK = /\b(minute|week|reply|peer|two|2|asynchronous|format|word|time|low tech|no extra|lms|canvas|deadline|due|initial post|reading|rubric|points?)\b/.test(constraints);
  const success = /\b(substantive|meaningful|evidence|example|build|criteria|reason|explain|success|quality|rubric|specific|follow[ -]?up|extend|challenge|demonstrate|show|apply|support)\b/.test(`${interaction} ${constraints}`)
    && !/^\s*(do work|work harder|participate|try harder|sound less canned)\s*[.!]?\s*$/.test(interaction);
  return { audience: audience && !demeaning, issue: issueOK, interaction: interactionOK, constraints: constraintsOK, success, demeaning };
};

function buildS1MissionHTML(){
  return buildScenarioMissionHTML(SCENARIO_INDEX.CONTENT_AVALANCHE, { className: 's1-clean-mission' });
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
            <div class="s1-clean-builder-sub">Give Babbage the information it needs to repair the actual teaching problem, not just make a prettier prompt.</div>
          </div>
        </div>
        <div class="s1-clean-fields">
          <div class="s1-clean-field">
            <label class="s1-clean-label" for="g-learners"><span class="s1-clean-num">1</span>Learners + course</label>
            <textarea class="s1-clean-textarea" id="g-learners" rows="3" placeholder="Who are these students? What kind of course is this?" data-pc-guided-input="true" aria-label="Describe learners and course"></textarea>
          </div>
          <div class="s1-clean-field">
            <label class="s1-clean-label" for="g-issue"><span class="s1-clean-num">2</span>What is failing?</label>
            <textarea class="s1-clean-textarea" id="g-issue" rows="3" placeholder="What exactly is going wrong in the discussion?" data-pc-guided-input="true" aria-label="Describe the discussion problem"></textarea>
          </div>
          <div class="s1-clean-field">
            <label class="s1-clean-label" for="g-interaction"><span class="s1-clean-num">3</span>Interaction move</label>
            <textarea class="s1-clean-textarea" id="g-interaction" rows="3" placeholder="How should students build on, challenge, compare, or extend peer ideas?" data-pc-guided-input="true" aria-label="Describe the interaction move"></textarea>
          </div>
          <div class="s1-clean-field">
            <label class="s1-clean-label" for="g-constraints"><span class="s1-clean-num">4</span>Constraints + success criteria</label>
            <textarea class="s1-clean-textarea" id="g-constraints" rows="3" placeholder="What limits matter? What should a strong reply include?" data-pc-guided-input="true" aria-label="Describe constraints and success criteria"></textarea>
          </div>
        </div>
      </section>
    </div>`;
}

function buildS1RepairFooterHTML(){
  return `
    <div class="pc-guided-repair-footer s1-clean-repair-footer">
      <div class="pc-guided-repair-preview-wrap">
        <div class="pc-guided-repair-preview-label">Your assembled repair brief</div>
        <div class="pc-guided-repair-preview is-empty" id="s1AssembledPrompt" role="status" aria-live="polite"></div>
      </div>
      <div class="pc-guided-repair-actions">
        <div class="s1-clean-nudge pc-guided-repair-nudge" id="s1BuilderNudge"></div>
        <div class="pc-guided-repair-submit-wrap">
          <span id="s1BuilderStatus" class="pc-guided-repair-status" role="status" aria-live="polite">0 of 4 ingredients ready</span>
          <button class="s1-clean-submit" id="sendBtn" type="button" data-pc-action="send-guided" disabled>Ask Babbage to review the repair</button>
        </div>
      </div>
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
      <div class="s1-clean-grid pc-guided-repair-layout--full-preview">
        ${buildS1LeftHTML()}
        ${buildS1RightHTML()}
        ${buildS1RepairFooterHTML()}
      </div>
    </div>`;
  restoreS1DraftToFields();
  if (typeof resetSectionScroll === 'function') resetSectionScroll(container);
  setTimeout(() => {
    if (!pcScenarioInputMayReceiveFocus()) return;
    pcFocusWithoutScroll(document.getElementById('g-learners'));
  }, 60);
};


function buildS1RepairBriefPreview(values){
  const lines = [
    'Repair the discussion so peer replies have a clear instructional purpose.'
  ];
  if (values.learners) lines.push(`1. Learners + course — ${values.learners}`);
  if (values.issue) lines.push(`2. Problem — ${values.issue}`);
  if (values.interaction) lines.push(`3. Interaction move — ${values.interaction}`);
  if (values.constraints) lines.push(`4. Constraints + success criteria — ${values.constraints}`);
  lines.push('Babbage will use this brief to create and explain a revised student-facing discussion prompt.');
  return lines.join('\n');
}

function updateS1AssembledPreview(values){
  const preview = document.getElementById('s1AssembledPrompt');
  const status = document.getElementById('s1BuilderStatus');
  const submit = document.getElementById('sendBtn');
  const fieldMap = {
    learners: 'g-learners',
    issue: 'g-issue',
    interaction: 'g-interaction',
    constraints: 'g-constraints'
  };
  const ready = Object.keys(fieldMap).filter(key => String(values[key] || '').trim().length >= 12);
  const assembled = ready.length ? buildS1RepairBriefPreview(values) : '';

  if (preview) {
    preview.textContent = assembled || 'Your repaired discussion prompt will assemble here as you complete the four ingredients.';
    preview.classList.toggle('is-empty', !assembled);
  }
  if (status) status.textContent = `${ready.length} of 4 ingredients ready`;
  if (submit) submit.disabled = ready.length !== 4;
}

function onGuidedInput(el){
  if (el && typeof autoGrow === 'function') autoGrow(el);
  const values = getS1GuidedValues();
  saveS1Draft(values);
  updateS1AssembledPreview(values);
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
  if (values.learners) parts.push(`Learners and course context: ${values.learners}`);
  if (values.issue) parts.push(`The current problem is: ${values.issue}`);
  if (values.interaction) parts.push(`Redesign the discussion so students: ${values.interaction}`);
  if (values.constraints) parts.push(`Constraints and success criteria: ${values.constraints}`);
  parts.push('Create a revised student-facing discussion prompt. Keep it practical for an asynchronous online course. Briefly explain how the revision addresses the original problem of surface-level replies.');
  return parts.join('\n\n');
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
      nudge.innerHTML = `<strong>Before we ask Babbage:</strong> Add more detail for ${missing.join(', ')}.`;
    }
    const focusMap = { 'audience/course':'g-learners', 'problem diagnosis':'g-issue', 'interaction move':'g-interaction', 'constraints':'g-constraints', 'success criteria':'g-constraints' };
    document.getElementById(focusMap[missing[0]])?.focus();
    return;
  }
  sendText(buildS1AssembledPrompt(values));
};

function buildS1TerminalDiagnosis(score, responseText, structuredAnalysis = null){
  const parsed = parseS1BabbageStructuredResponse(responseText);
  const values = getS1GuidedValues();
  const checks = analyzeS1Guided(values);
  const missing = [];
  if (!checks.audience) missing.push('learner context');
  if (!checks.issue) missing.push('problem diagnosis');
  if (!checks.interaction) missing.push('interaction strategy');
  if (!checks.constraints) missing.push('constraints');
  if (!checks.success) missing.push('success criteria');

  const fallbackStatus = score <= 2 ? 'NEEDS MORE CONTEXT' : score <= 3 ? 'PARTIAL REPAIR DETECTED' : score <= 4 ? 'STRONG REPAIR DETECTED' : 'HIGH-CONFIDENCE REPAIR';
  const fallbackConfidence = score <= 2 ? 'LOW' : score <= 3 ? 'MODERATE' : 'HIGH';
  const fallbackSummary = missing.length
    ? `Your repair has a usable direction, but it still needs more precision around ${missing.join(', ')}.`
    : 'Your repair identifies the engagement problem, gives peer replies an instructional purpose, and includes enough constraints for a usable redesign.';
  const fallbackWorked = [
    values.learners ? `You identified the learner/course context: ${values.learners}` : '',
    values.interaction ? `You specified this interaction move: ${values.interaction}` : ''
  ].filter(Boolean).join(' ');
  const fallbackIssue = missing.length
    ? `The most important remaining gap is ${missing[0]}.`
    : 'The design is strong enough to use; the next refinement is to make each required peer reply serve a distinct purpose.';
  const fallbackRepair = missing.length
    ? `Make the ${missing[0]} explicit and connect it to what students must actually do in the discussion.`
    : 'Differentiate the required peer replies so students cannot satisfy both with the same generic response move.';
  const fallbackImpact = 'That refinement should make student replies more purposeful and give classmates a clearer reason to continue the conversation.';

  const structuredWorked = Array.isArray(structuredAnalysis?.what_worked)
    ? structuredAnalysis.what_worked.map(item => `• ${item}`).join('\n')
    : String(structuredAnalysis?.what_worked || '');

  return [
    'STATUS', structuredAnalysis?.status || parsed.status || fallbackStatus,
    '', 'CONFIDENCE', structuredAnalysis?.confidence || parsed.confidence || fallbackConfidence,
    '', 'FEEDBACK SUMMARY', structuredAnalysis?.feedback_summary || parsed.summary || fallbackSummary,
    '', 'WHAT WORKED', structuredWorked || parsed.worked || fallbackWorked || 'You supplied enough information for Babbage to identify a concrete instructional direction.',
    '', 'ISSUE DETECTED', structuredAnalysis?.issue_detected || parsed.issue || fallbackIssue,
    '', 'RECOMMENDED REPAIR', structuredAnalysis?.recommended_repair || parsed.repair || fallbackRepair,
    '', 'EXPECTED IMPACT', structuredAnalysis?.expected_impact || parsed.impact || fallbackImpact
  ].join('\n');
}

function addS1BabbageResultCard(responseText, structuredAnalysis = null){
  document.body.classList.add('s1-result-active');
  const area = document.getElementById('chat');
  if (!area) return null;
  area.innerHTML = '';
  const values = (window.playerHistory && window.playerHistory.s1) || getS1GuidedValues();
  const card = document.createElement('div');
  card.className = 's1-result-card s1-result-card-focused';
  card.innerHTML = `
    <div class="s1-result-eyebrow">Babbage Draft</div>
    <div class="s1-result-title">Revised Discussion Prompt</div>
    <div class="s1-result-content-box">
      <div class="s1-result-body">${fmt(structuredAnalysis?.revised_discussion_prompt || cleanS1BabbageDraft(responseText))}</div>
      ${structuredAnalysis?.revision_review ? `
        <section class="s1-babbage-revision-review" aria-label="Babbage review of revised discussion prompt">
          <div class="s1-clean-reference-title">Babbage's Review of the Revision</div>
          <div class="s1-babbage-review-item"><strong>Strongest improvement:</strong> ${esc(structuredAnalysis.revision_review.strongest_improvement || '')}</div>
          <div class="s1-babbage-review-item"><strong>Remaining limitation:</strong> ${esc(structuredAnalysis.revision_review.remaining_limitation || '')}</div>
          <div class="s1-babbage-review-item"><strong>Why these changes:</strong> ${esc(structuredAnalysis.revision_review.why_these_changes || '')}</div>
        </section>` : ''}
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
        <div class="s1-result-controls-sub">${reviewMode ? `Babbage's draft is shown above. Review the analysis before Pixel explains what changed.` : `Pixel's explanation is complete. Choose the next step.`}</div>
      </div>
      <div class="s1-result-controls-actions">
        <button class="s1-secondary-btn" type="button" data-pc-action="revise-s1">Revise S1</button>
        ${reviewMode
          ? `<button class="continue-btn" type="button" data-pc-action="show-s1-reflection" data-pc-score="${Number(scoreTotal) || 0}">Continue with Pixel →</button>`
          : (thresholdMet ? `<button class="continue-btn" type="button" data-pc-action="navigate-next" data-pc-scenario-index="1">Next scenario →</button>` : `<button class="continue-btn" type="button" data-pc-action="revise-s1">Strengthen and try again</button>`)}
      </div>
    </div>`;
};

function getS1PixelScoreReflection(scoreTotal){
  const score = Math.max(0, Math.min(5, Math.round(Number(scoreTotal) || 0)));
  const source = window.pixelDialogue?.[`scoreReflection_${score}`];
  if (!Array.isArray(source)) return [];
  return source.map(line => ({
    ...line,
    audioKey: line.id || ''
  }));
}

function showS1PostAnalysisReflection(scoreTotal){
  // Robust S1 handoff: Babbage terminal/result page -> Professor Pixel VN review.
  // Pixel's dialogue is intentionally score-banded rather than generated so each
  // line can later map to a stable recorded-audio cue while still reflecting the
  // player's actual performance.
  try {
    window.pcWaitingForBabbageContinue = false;
    window.predictionGateActive = false;
    window.isSubmittingToBabbage = false;
    document.getElementById('pcContinueToBabbageBtn')?.remove();
    stopBabbageTTS?.();
  } catch(e) {}

  const overlay = pcSetVNOverlayState({ active: true });
  const dialogue = document.getElementById('vnDialogue');
  const speaker = document.getElementById('vnSpeaker');
  const text = document.getElementById('vnText');
  const hint = document.getElementById('vnAdvanceHint');
  const character = document.getElementById('vnCharacter');

  if (overlay) overlay.removeAttribute('aria-hidden');

  if (dialogue) {
    dialogue.classList.remove('has-choices');
    dialogue.style.display = '';
  }
  if (speaker) speaker.textContent = 'Professor Pixel';
  if (text) text.innerHTML = '';
  if (hint) hint.classList.remove('show');
  if (character) character.classList.add('visible');

  try { setVNBabbageMode(false); } catch(e) {}
  try { setVNBabbageTerminalMode(false); } catch(e) {}
  try { setBabbageTerminalTextMode(false); } catch(e) {}
  try { setBabbageShelfState('idle', 'idle'); } catch(e) {}

  try { clearTimeout(vnTypeTimer); } catch(e) {}
  try { vnQueue = []; } catch(e) {}
  vnOnComplete = null;
  vnTyping = false;
  vnFullText = '';
  vnCurrentText = '';

  const lines = getS1PixelScoreReflection(scoreTotal);
  lines.forEach((line, idx) => {
    const isLast = idx === lines.length - 1;
    if (dialogue) dialogue.dataset.audioCue = line.audioKey;
    vnShow(line.expr, line.text, isLast ? () => {
      if (scoreTotal >= SCORE_THRESHOLD) markScenarioComplete();
      showS1ResultControls(scoreTotal, 'postReflection');
    } : null);
  });
}

function reviseS1(){
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
}

pcExposeGlobals({
  showS1PostAnalysisReflection,
  reviseS1
});

if (!window.pcGuidedInputDelegationInstalled) {
  window.pcGuidedInputDelegationInstalled = true;
  document.addEventListener('input', event => {
    const field = event.target.closest?.('[data-pc-guided-input="true"]');
    if (field) onGuidedInput(field);
  });
}

pcRegisterUIActions({
  'send-guided': () => sendGuided(),
  'revise-s1': () => reviseS1(),
  'show-s1-reflection': target => showS1PostAnalysisReflection(Number(target.dataset.pcScore) || 0),
  'switch-scenario': target => {
    const index = pcNormalizeScenarioIndex(target.dataset.pcScenarioIndex);
    return index === null ? false : switchScenario(index, target);
  },
  'dev-go-scenario': target => window.devGoScenario?.(target.dataset.pcScenarioIndex),
  'dev-fill-scenario': target => window.devFillScenario?.(target.dataset.pcScenarioIndex),
  'dev-fill-s1-transfer': () => window.devFillS1TransferTask?.(),
  'dev-next-scenario': () => window.devNextScenario?.(),
  'navigate-next': target => window.navigateToNext?.(target.dataset.pcScenarioIndex)
});
