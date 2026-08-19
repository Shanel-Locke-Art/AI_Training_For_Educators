/* PROMPTCRAFT DEVELOPMENT SCENARIOS
   Current S2-S5 prototypes. These are preserved as development material,
   not treated as approved final scenario designs. */

// ══════════════════════════════════════════════════════
//  SCENARIO 2 — METACOGNITION DETECTIVE OPENING
//  Vertical slice implemented with the shared activity component system.
// ══════════════════════════════════════════════════════
const S2_PROGRESS_STEPS = ['1 Diagnose', '2 Intervene', '3 Observe', '4 Audit Babbage', '5 Repair & compare'];

const S2_DIAGNOSIS_OPTIONS = [
  { id: 'evidence', tag: 'MISSING LINK', title: 'Evidence of what the strategy actually did', text: 'Connect Jordan’s study approach to specific signs of what he understood, where understanding broke down, and what changed.' },
  { id: 'strategy', tag: 'SWAP', title: 'A better study strategy', text: 'Replace rereading with a more effective study method before Jordan evaluates the learning process.' },
  { id: 'performance', tag: 'RESULT', title: 'A higher grade', text: 'Improve Jordan’s performance first, then decide whether the study strategy worked.' },
  { id: 'motivation', tag: 'EFFORT', title: 'More motivation', text: 'Increase Jordan’s effort or persistence so he engages more strongly with the material.' }
];

const S2_EVIDENCE_RESPONSES = [
  { id: 'confidence', tag: 'CONFIDENCE', title: 'Ask for a confidence rating', text: 'After studying, Jordan rates how confident he feels about the material from 1–5.' },
  { id: 'strategy_name', tag: 'REFLECT', title: 'Ask what strategy he used', text: 'After studying, Jordan names the study strategy he used and briefly describes it.' },
  { id: 'grade_compare', tag: 'RESULT', title: 'Compare the new grade', text: 'Jordan compares this assignment score with his previous score to decide whether the strategy worked.' },
  { id: 'evidence_check', tag: 'TEST', title: 'Make the strategy produce evidence', text: 'Jordan tries to explain the concepts without notes, identifies where understanding breaks down, and decides whether to keep or change his strategy.' }
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
    kicker: 'Decision 1 · Find the missing link',
    title: 'What does Jordan need before he can make an informed next move?',
    instruction: 'Jordan knows what he did and knows the result. Choose what belongs between his strategy and his next decision.',
    variant: 'detail',
    marker: () => '',
    gridClass: 'pc-choice-grid--radio-marker',
    limit: 1,
    choiceGridId: 's2DiagnosisChoices',
    statusId: 's2DiagnosisStatus',
    submitId: 's2DiagnosisSubmit',
    submitLabel: 'Place the missing link',
    feedbackId: 's2DiagnosisFeedback',
    activeIndex: 0,
    focusSelector: 'input[name="s2-diagnosis"]',
    onSubmit: submitS2Diagnosis,
    wrapContent: taskHTML => `<section class="s2-loop-puzzle" aria-labelledby="s2CaseFileTitle"><header class="s2-loop-header"><div class="s2-loop-title"><div class="pc-activity-kicker">Case File 02 · Jordan</div><h1 id="s2CaseFileTitle">The Confident Student Problem</h1></div><section class="s2-evidence-panel" aria-labelledby="s2EvidencePanelTitle"><h2 id="s2EvidencePanelTitle" class="s2-evidence-title">Student Evidence</h2><div class="s2-evidence-portrait"><img src="${ASSETS.images.students.jordan.uncertain}" alt="Jordan, an adult online learner, looking uncertain" /></div><blockquote class="s2-jordan-quote"><span class="s2-quote-mark" aria-hidden="true">“</span><span class="s2-quote-copy">I guess something<br />worked.</span><span class="s2-quote-mark" aria-hidden="true">”</span></blockquote><div class="s2-loop-result"><span>Result</span><strong>84% ↑</strong><small>Improved from last time</small></div></section></header>${buildS2JordanEvidenceHTML()}${taskHTML}</section>`
  }),
  evidence: Object.freeze({
    items: S2_EVIDENCE_RESPONSES,
    inputName: 's2-evidence',
    idPrefix: 's2-evidence',
    variant: 'detail',
    marker: item => item.tag,
    titleId: 's2EvidenceTitle',
    kicker: 'Decision 2 · Intervene',
    title: 'What would you add to Jordan’s next learning attempt?',
    instruction: 'Choose one intervention. Each option creates a different kind of evidence, and Jordan’s response will show you what your design actually made possible.',
    choiceGridId: 's2EvidenceChoices',
    gridClass: 'pc-choice-grid--tagged-detail',
    statusId: 's2EvidenceStatus',
    submitId: 's2EvidenceSubmit',
    submitLabel: 'Try this intervention',
    limit: 1,
    feedbackId: 's2EvidenceFeedback',
    activeIndex: 1,
    focusSelector: 'input[name="s2-evidence"]',
    onSubmit: submitS2Evidence
  }),
  thinkingMove: Object.freeze({
    items: S2_THINKING_MOVES,
    inputName: 's2-thinking-move',
    idPrefix: 's2-thinking',
    variant: 'detail',
    marker: item => item.tag,
    titleId: 's2ThinkingTitle',
    kicker: 'Decision 3 · Choose the thinking move',
    title: 'What should Jordan practice first?',
    instruction: 'Choose the move that most directly addresses the problem you diagnosed. Strong metacognition eventually uses all four, but this case needs a useful starting point.',
    choiceGridId: 's2ThinkingChoices',
    gridClass: 'pc-choice-grid--tagged-detail',
    statusId: 's2ThinkingStatus',
    submitId: 's2ThinkingSubmit',
    submitLabel: 'Build the activity',
    limit: 1,
    feedbackId: 's2ThinkingFeedback',
    activeIndex: 2,
    focusSelector: 'input[name="s2-thinking-move"]',
    onSubmit: submitS2ThinkingMove
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
  if (typeof data.s2ReviewSource !== 'string') data.s2ReviewSource = '';
  return data;
}


function buildS2CaseContextHTML() {
  return `
    <section class="pc-s2-case-context" aria-labelledby="s2CaseContextTitle">
      <div class="pc-s2-case-context__title">
        <div class="pc-activity-kicker">Case File 02 · Jordan</div>
        <h2 id="s2CaseContextTitle">The Confident Student Problem</h2>
      </div>
      <div class="pc-s2-context-flow" aria-label="Jordan's learning process after diagnosis">
        <div class="pc-s2-context-node"><span>Strategy</span><strong>Reread ×3</strong><small>What Jordan did</small></div>
        <div class="pc-s2-context-arrow" aria-hidden="true">→</div>
        <div class="pc-s2-context-node pc-s2-context-node--evidence"><span>Evidence</span><strong>Test understanding</strong><small>The missing link</small></div>
        <div class="pc-s2-context-arrow" aria-hidden="true">→</div>
        <div class="pc-s2-context-node"><span>Next move</span><strong>Choose from evidence</strong><small>Not from the grade alone</small></div>
      </div>
    </section>`;
}

function buildS2JordanEvidenceHTML() {
  return `
    <section class="s2-learning-gap" aria-labelledby="s2CluesTitle">
      <h2 id="s2CluesTitle">What is missing from Jordan’s learning process?</h2>
      <div class="s2-gap-flow" aria-label="Jordan's incomplete learning process">
        <div class="s2-flow-node"><span>Strategy</span><strong>Reread ×3</strong><small>What Jordan did</small></div>
        <div class="s2-flow-arrow" aria-hidden="true">→</div>
        <div class="s2-flow-node s2-flow-node--missing"><span>Missing</span><strong>?</strong><small>What belongs here?</small></div>
        <div class="s2-flow-arrow" aria-hidden="true">→</div>
        <div class="s2-flow-node"><span>Next move</span><strong>Reread again</strong><small>Repeat and hope</small></div>
      </div>
    </section>`;
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
    feedbackId: config.feedbackId,
    gridClass: config.gridClass || ''
  });
  const contentHTML = typeof config.wrapContent === 'function'
    ? config.wrapContent(taskHTML)
    : `<div class="pc-s2-step-shell">${buildS2CaseContextHTML()}${taskHTML}</div>`;

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

  // S2 Decision 1 is a single-choice decision rendered with the shared
  // checkbox card component. Replace the previous choice when the learner
  // selects a different missing link, rather than rejecting the new choice.
  if (config.inputName === 's2-diagnosis') {
    const choiceRoot = document.getElementById(config.choiceGridId);
    choiceRoot?.addEventListener('change', event => {
      const changed = event.target.closest?.(`input[name="${config.inputName}"]`);
      if (!changed || !changed.checked) return;
      choiceRoot.querySelectorAll(`input[name="${config.inputName}"]`).forEach(input => {
        if (input !== changed) input.checked = false;
      });
    });
  }

  wireExactSelection({
    rootId: config.choiceGridId,
    inputName: config.inputName,
    limit: config.limit || 1,
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
  const selected = selection[0] || '';
  if (selected === 'evidence') return { key: 's2_diagnosis_correct', level: 'strong' };
  if (selected === 'strategy') return { key: 's2_diagnosis_strategy', level: 'partial' };
  if (selected === 'motivation') return { key: 's2_diagnosis_motivation', level: 'reconsider' };
  return { key: 's2_diagnosis_performance', level: 'reconsider' };
}

function submitS2Diagnosis() {
  const selection = getCheckedValues('s2-diagnosis');
  if (selection.length !== 1) return;
  const result = classifyS2Diagnosis(selection);
  const data = getS2Data();
  const option = S2_DIAGNOSIS_OPTIONS.find(item => item.id === selection[0]);
  data.attempts += 1;
  data.diagnosisAttempts.push({ selection: [...selection], result: result.level, timestamp: new Date().toISOString() });
  data.prompts.push(`S2 diagnosis: ${option?.title || selection[0]}`);
  data.finalResponse = pixelDialogue[result.key]?.[0]?.text || '';

  if (result.key === 's2_diagnosis_correct') {
    disableScenarioChoices('s2-diagnosis', 's2DiagnosisSubmit');
  }

  // Diagnosis feedback belongs to Professor Pixel. If a previous intervention
  // recording was open during testing/replay, fully clear that presentation
  // before starting Pixel's normal S1 VN sequence.
  if (document.getElementById('vnOverlay')?.classList.contains('pc-s2-jordan-recording')) {
    pcCloseS2JordanRecordedDialogue();
  }
  playPixelSequence(result.key, () => {
    // A correct diagnosis should move directly into Intervention after
    // Professor Pixel finishes the feedback sequence. Do not stop on an
    // intermediate confirmation card that asks the learner to continue again.
    if (result.key === 's2_diagnosis_correct') {
      data.diagnosisFinal = [...selection];
      renderS2EvidenceActivity();
      return;
    }
    renderS2DiagnosisFeedback(selection, result);
  });
}

function renderS2DiagnosisFeedback(selection, result) {
  const exact = result.key === 's2_diagnosis_correct';
  const submittedValue = selection[0] || '';
  const choiceRoot = document.getElementById('s2DiagnosisChoices');

  // Professor Pixel's sequence is asynchronous. By the time it finishes, the
  // learner may already have moved the radio selection, so style the value that
  // was submitted rather than whichever input happens to be :checked now.
  choiceRoot?.querySelectorAll('.pc-choice-card').forEach(card => {
    card.classList.remove('is-incorrect', 'is-correct');
  });
  const submittedInput = [...document.querySelectorAll('input[name="s2-diagnosis"]')]
    .find(input => input.value === submittedValue);
  const submittedCard = submittedInput?.closest('.pc-choice-card');
  if (submittedCard) submittedCard.classList.add(exact ? 'is-correct' : 'is-incorrect');

  if (exact) {
    const missing = document.querySelector('.s2-flow-node--missing');
    if (missing) { missing.classList.add('is-solved'); missing.querySelector('strong').textContent = 'Evidence'; missing.querySelector('small').textContent = 'Connect strategy to learning'; }
  }
  const text = pixelDialogue[result.key]?.[0]?.text || '';
  renderScenarioFeedback({
    panelId: 's2DiagnosisFeedback',
    tone: exact ? 'strong' : 'developing',
    heading: exact ? 'That is the missing link.' : 'That changes the case, but it does not fill the gap.',
    text,
    actionsHTML: exact
      ? '<button class="pc-button pc-button--primary" type="button" id="s2ContinueEvidence" data-pc-action="s2-continue-evidence">Choose an intervention →</button>'
      : ''
  });

  if (!exact) {
    const submit = document.getElementById('s2DiagnosisSubmit');
    if (submit) {
      // The first submit listener is intentionally one-shot. Re-arm it after
      // incorrect feedback, but require the learner to choose a different option
      // before submitting again. This keeps the page in place instead of
      // rebuilding the entire Diagnose step.
      submit.disabled = true;
      submit.addEventListener('click', submitS2Diagnosis, { once: true });
    }

    const choices = document.getElementById('s2DiagnosisChoices');
    const currentValue = selection[0];
    const moveFocusToNewChoice = event => {
      const nextInput = event.target.closest?.('input[name="s2-diagnosis"]');
      if (!nextInput || nextInput.value === currentValue) return;

      // A new choice starts a genuinely new attempt: remove the previous red
      // state and Pixel feedback immediately, then let the standard selection
      // wiring enable Submit for the newly checked answer. Keep this listener
      // active so a learner can miss more than once without stale feedback.
      choices.querySelectorAll('.pc-choice-card').forEach(card => {
        card.classList.remove('is-incorrect', 'is-correct');
      });
      const feedback = document.getElementById('s2DiagnosisFeedback');
      if (feedback) feedback.innerHTML = '';
    };
    choices?.addEventListener('change', moveFocusToNewChoice, { once: true });
  }
}

function renderS2EvidenceActivity() {
  return renderS2SelectionActivity(S2_ACTIVITY_CONFIG.evidence);
}

function pcGetS2JordanInterventionDialogue(choice) {
  const fallback = {
    confidence: {
      voiceId: 'jordan-s2-intervention-confidence',
      expression: 'confident',
      quote: 'I’d say I’m a four out of five. I feel better about it this time.'
    },
    strategy_name: {
      voiceId: 'jordan-s2-intervention-strategy',
      expression: 'thinking',
      quote: 'I reread the chapter three times and highlighted the parts that seemed important.'
    },
    grade_compare: {
      voiceId: 'jordan-s2-intervention-grade',
      expression: 'confident',
      quote: 'I got an 84 instead of a 76, so rereading must have worked.'
    },
    evidence_check: {
      voiceId: 'jordan-s2-intervention-evidence',
      expression: 'thinking',
      quote: 'I could define both concepts, but without my notes I still couldn’t explain the difference. Rereading helped me recognize them, but it didn’t help me compare them. I need to try examples next.'
    }
  };
  const registered = window.s2JordanInterventionDialogue?.[choice];
  if (registered) return { ...registered, quote: registered.quote || registered.text || '' };
  return fallback[choice] || fallback.strategy_name;
}

const pcS2JordanVoiceCache = new Map();
function pcPlayS2JordanInterventionVoice(choice, options = {}) {
  const dialogue = pcGetS2JordanInterventionDialogue(choice);
  const status = document.getElementById('s2JordanVoiceStatus');
  const source = window.s2VoiceoverDrafts?.[dialogue.voiceId];
  const userInitiated = options.userInitiated === true;

  if (!source || typeof Howl === 'undefined') {
    if (status) status.textContent = 'Jordan recording is not available yet.';
    return false;
  }
  if (typeof audioPreferences !== 'undefined' && !audioPreferences.voicesEnabled && !userInitiated) {
    return false;
  }
  if (typeof audioPreferences !== 'undefined' && !audioPreferences.voicesEnabled && userInitiated) {
    if (status) status.textContent = 'Voice playback is off in audio settings.';
    return false;
  }

  let sound = pcS2JordanVoiceCache.get(dialogue.voiceId);
  if (!sound) {
    sound = new Howl({
      src: [source],
      volume: 0.92,
      html5: true,
      onplay: () => { if (status) status.textContent = 'Jordan recording playing…'; },
      onend: () => { if (status) status.textContent = 'Jordan recording complete.'; },
      onloaderror: () => { if (status) status.textContent = 'Jordan recording is not available yet.'; },
      onplayerror: () => { if (status) status.textContent = 'Jordan recording could not be played.'; }
    });
    pcS2JordanVoiceCache.set(dialogue.voiceId, sound);
  }

  pcS2JordanVoiceCache.forEach(other => {
    if (other !== sound) {
      try { other.stop(); } catch (e) {}
    }
  });
  try {
    sound.stop();
    sound.play();
    return true;
  } catch (e) {
    if (status) status.textContent = 'Jordan recording could not be played.';
    return false;
  }
}

function pcStopS2JordanInterventionVoice() {
  pcS2JordanVoiceCache.forEach(sound => {
    try { sound.stop(); } catch (e) {}
  });
}

function pcCloseS2JordanRecordedDialogue() {
  const overlay = document.getElementById('vnOverlay');
  overlay?.classList.remove('pc-s2-jordan-recording');
  document.getElementById('s2JordanVNControls')?.remove();
  const dialogue = document.getElementById('vnDialogue');
  dialogue?.classList.remove('pc-s2-recorded-dialogue', 'prediction-question', 'prediction-result');
  dialogue?.querySelector('.vn-skip')?.removeAttribute('hidden');
  try { pcResetVNDialogueState(); } catch (e) {}
  try { pcClearPredictionPresentation(); } catch (e) {}
  try { pcClearPredictionLayoutInlineStyles(); } catch (e) {}
  try { pcClearPredictionUI(); } catch (e) {}
  try { setBabbageTerminalState('idle', 'BABBAGE ENGINE', 'IDLE'); } catch (e) {}
  try { setBabbageShelfState('idle', 'idle'); } catch (e) {}
  try { pcResetVNCharacters(); } catch (e) {}
  pcSetVNOverlayState({ active: false });

  const speaker = document.getElementById('vnSpeaker');
  if (speaker) speaker.textContent = 'Professor Pixel';
}


function pcHandleS2OpeningCheckpoint() {
  pcCloseS2JordanRecordedDialogue();
  const data = getS2Data();
  data.evidenceFinal = pcGetLatestS2Selection('evidenceAttempts');
  data.openingCheckpointReached = true;

  const feedback = data.lastEvidenceFeedback || {};
  const pixelText = [feedback.heading, feedback.copy].filter(Boolean).join(' ')
    || 'Jordan’s response is the evidence. The useful intervention is the one that makes his learning process visible enough to evaluate and act on.';

  // This is a normal single-character VN beat. The shared cast renderer
  // handles Jordan leaving and Pixel returning; S2 does not own positioning.
  vnShow(feedback.tone === 'strong' ? 'proud' : 'thinking', pixelText, () => {
    renderS2ThinkingMoveActivity();
  }, { speaker: 'Professor Pixel', character: 'pixel', id: 's2-post-recording-pixel' });
}

function pcShowS2JordanRecordedDialogue(choice, result) {
  const recorded = pcGetS2JordanInterventionDialogue(choice);
  const expression = recorded.expression || 'neutral';

  const presentation = pcShowSharedWorkstationResult({
    terminalText: 'RECORDED DIALOGUE',
    speakerName: 'Jordan',
    character: 'jordan',
    expression,
    heading: 'Recorded student dialogue.',
    bodyHTML: `“${esc(recorded.quote)}”`,
    button: {
      onActivate: pcHandleS2OpeningCheckpoint,
      label: 'Continue →'
    },
    ariaLabel: 'Jordan recorded response. Continue when ready.',
    // State marker only. It intentionally owns no geometry or visual styling.
    overlayClasses: ['pc-s2-jordan-recording']
  });
  if (!presentation) return false;

  const status = document.createElement('div');
  status.id = 's2JordanVoiceStatus';
  status.className = 'sr-only';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  presentation.vnText?.querySelector('.pc-feedback-copy')?.appendChild(status);

  try { musicStartVN(); } catch (e) {}
  pcScheduleScenarioTask(() => pcPlayS2JordanInterventionVoice(choice), 140, SCENARIO_INDEX.METACOGNITION);
  pcScheduleScenarioTask(() => {
    const button = presentation.vnText?.querySelector('.prediction-continue-btn');
    pcFocusWithoutScroll(button);
  }, 100, SCENARIO_INDEX.METACOGNITION);
  return true;
}


function renderS2JordanInterventionFeedback(choice, result) {
  const panel = document.getElementById('s2EvidenceFeedback');
  if (panel) {
    panel.innerHTML = `<div class="sr-only" role="status">${esc(result.heading)} ${esc(result.copy)}</div>`;
  }
  pcShowS2JordanRecordedDialogue(choice, result);
  return panel;
}

function submitS2Evidence() {
  const selection = getCheckedValues('s2-evidence');
  if (selection.length !== 1) return;
  const choice = selection[0];
  const data = getS2Data();
  const option = S2_EVIDENCE_RESPONSES.find(item => item.id === choice);
  const consequences = {
    confidence: { tone: 'developing', heading: 'Jordan feels informed, but still cannot test the strategy.', copy: 'Confidence is useful information, but Jordan can still answer without showing what he understands or whether rereading caused the improvement.' },
    strategy_name: { tone: 'developing', heading: 'The strategy is visible. Its effectiveness is not.', copy: 'Jordan can now name what he did, but he still has no evidence for deciding whether it helped.' },
    grade_compare: { tone: 'developing', heading: 'Outcome bias just got stronger.', copy: 'The intervention encourages Jordan to treat the grade as proof of the strategy. The result changed, but the learning process is still invisible.' },
    evidence_check: { tone: 'strong', heading: 'Now Jordan has evidence he can act on.', copy: 'Jordan is no longer guessing from a feeling or grade. He monitored understanding, connected evidence to the strategy, and made a decision.' }
  };
  const result = consequences[choice] || consequences.strategy_name;
  data.attempts += 1;
  data.evidenceAttempts.push({ selection: [...selection], exact: choice === 'evidence_check', consequence: result.heading, timestamp: new Date().toISOString() });
  data.prompts.push(`S2 intervention: ${option?.title || choice}`);
  data.finalResponse = result.copy;
  data.lastEvidenceFeedback = { heading: result.heading, copy: result.copy, tone: result.tone, choice };
  disableScenarioChoices('s2-evidence', 's2EvidenceSubmit');
  renderS2JordanInterventionFeedback(choice, result);
}


function renderS2ThinkingMoveActivity() {
  return renderS2SelectionActivity(S2_ACTIVITY_CONFIG.thinkingMove);
}

function pcS2GetDraftIngredients(data = getS2Data()) {
  const diagnosisId = (data.diagnosisFinal || [])[0] || pcGetLatestS2Selection('diagnosisAttempts')[0] || 'evidence';
  const evidenceId = (data.evidenceFinal || [])[0] || pcGetLatestS2Selection('evidenceAttempts')[0] || 'evidence_check';
  const moveId = data.thinkingMove || 'evaluate';
  const diagnosis = S2_DIAGNOSIS_OPTIONS.find(item => item.id === diagnosisId) || S2_DIAGNOSIS_OPTIONS[0];
  const intervention = S2_EVIDENCE_RESPONSES.find(item => item.id === evidenceId) || S2_EVIDENCE_RESPONSES[3];
  const move = S2_THINKING_MOVES.find(item => item.id === moveId) || S2_THINKING_MOVES[2];
  const recorded = pcGetS2JordanInterventionDialogue(evidenceId);

  return {
    diagnosisId,
    diagnosisTitle: diagnosis.title,
    diagnosisDetail: diagnosis.text,
    evidenceId,
    interventionTitle: intervention.title,
    interventionDetail: intervention.text,
    jordanEvidence: recorded.quote,
    moveId,
    moveTitle: move.title,
    moveDetail: move.text
  };
}

function pcS2BuildDraftSystemPrompt(ingredients) {
  return `You are Babbage, PromptCraft's instructional-design analysis engine.

SCENARIO 2: METACOGNITION
Jordan completes assignments and sometimes earns better grades, but he cannot identify which learning strategy helped, evaluate why it helped, or decide what to do next.

The participant is building a reflection activity from these learner-selected ingredients:
- Diagnosis: ${ingredients.diagnosisTitle}
- Intervention/evidence move: ${ingredients.interventionTitle}
- Evidence Jordan produced: ${ingredients.jordanEvidence}
- Metacognitive thinking move: ${ingredients.moveTitle}

Create one short reflection activity for Jordan that responds to those ingredients. The activity should be plausible enough that an instructor might accept it, but deliberately include exactly ONE subtle weakness so the participant can audit the AI-generated design.

Choose exactly one weakness from:
- too_vague: the prompt is so broad that Jordan can answer without naming a strategy or learning evidence.
- no_evidence: Jordan is asked to judge a strategy but not cite evidence from his learning process.
- no_transfer: Jordan evaluates learning but is not asked to make a future decision.
- grade_focus: the activity centers grades/performance rather than how learning happened.

Do not announce the weakness inside the activity prompt. The design_rationale should explain the visible instructional intention without revealing the deliberate weakness. Put the explanation of the hidden weakness only in why_the_weakness_matters. Keep the activity concise and realistic.`;
}

function pcS2BuildDraftRequestText(ingredients) {
  return `Build the reflection draft from exactly these ingredients:

1. DIAGNOSIS
${ingredients.diagnosisTitle}
${ingredients.diagnosisDetail}

2. INTERVENTION AND OBSERVED EVIDENCE
${ingredients.interventionTitle}
Jordan's recorded response: ${ingredients.jordanEvidence}

3. THINKING MOVE
${ingredients.moveTitle}
${ingredients.moveDetail}

Generate the draft now. Do not replace these ingredients with a different diagnosis or intervention.`;
}

function buildS2DraftAnalysisHTML(data, draft) {
  const ingredients = pcS2GetDraftIngredients(data);
  const isFallback = data.aiProvider === 'local-fallback';
  const badge = isFallback ? 'DEMONSTRATION FALLBACK DRAFT' : 'LIVE BABBAGE DRAFT';
  const auditQuestion = `Does Jordan's likely response actually show “${ingredients.moveTitle},” or can he still avoid part of that thinking?`;
  const totalCharacters = [
    ingredients.diagnosisTitle, ingredients.interventionTitle, ingredients.jordanEvidence,
    ingredients.moveTitle, draft.activity_title, draft.activity_prompt,
    draft.likely_student_response, auditQuestion
  ].join(' ').length;
  const densityClass = totalCharacters > 1100
    ? 'analysis-report-very-dense'
    : totalCharacters > 820
      ? 'analysis-report-dense'
      : '';

  // Reuse S1's six semantic analysis slots instead of inventing a new grid.
  // The shared auto-fit routine knows these classes and assigns stable grid areas
  // across desktop, Nest Hub, tablets, foldables, and phones.
  return `
    <div class="analysis-report ${densityClass}" data-analysis-characters="${totalCharacters}" role="document" aria-label="Babbage reflection draft analysis">
      <header class="analysis-header">
        <div class="analysis-badge">${esc(badge)}</div>
        <h2 class="analysis-title">How your choices became the draft</h2>
        <p class="analysis-summary">Three inputs went to Babbage. Compare the thinking move you intended with the response the draft is likely to invite from Jordan.</p>
      </header>

      <div class="analysis-grid" aria-label="Reflection draft construction">
        <section class="analysis-card analysis-status-card compact">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">1</span><span>Input · Diagnosis</span></span>
          <div class="analysis-value big">${esc(ingredients.diagnosisTitle)}</div>
        </section>

        <section class="analysis-card analysis-confidence-card compact">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">3</span><span>Input · Thinking move</span></span>
          <div class="analysis-value big">${esc(ingredients.moveTitle)}</div>
        </section>

        <section class="analysis-card analysis-issue-card">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">2</span><span>Input · Evidence</span></span>
          <div class="analysis-value"><strong>${esc(ingredients.interventionTitle)}</strong></div>
          <div class="analysis-note">Jordan: “${esc(ingredients.jordanEvidence)}”</div>
        </section>

        <section class="analysis-card analysis-repair-card">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">→</span><span>Output · Babbage draft</span></span>
          <div class="analysis-value"><strong>${esc(draft.activity_title)}</strong></div>
          <div class="analysis-note">${esc(draft.activity_prompt)}</div>
        </section>

        <section class="analysis-card analysis-impact-card wide">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">▥</span><span>Effect · Likely Jordan response</span></span>
          <div class="analysis-value">“${esc(draft.likely_student_response)}”</div>
        </section>

        <section class="analysis-card analysis-worked-card wide">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">?</span><span>Audit lens</span></span>
          <div class="analysis-value">${esc(auditQuestion)}</div>
        </section>
      </div>
    </div>`;
}

function showS2DraftAnalysisInTerminal(data, draft) {
  const isFallback = data.aiProvider === 'local-fallback';
  const reportOptions = {
    reportHTML: buildS2DraftAnalysisHTML(data, draft),
    terminalStateText: isFallback ? 'DEMONSTRATION DRAFT READY' : 'REFLECTION DRAFT READY',
    engineLabel: isFallback ? 'BABBAGE FALLBACK' : 'BABBAGE ENGINE',
    speakerName: 'Professor Pixel',
    onClose: () => {
      if (scenarioIndex === SCENARIO_INDEX.METACOGNITION) renderS2AuditActivity();
    },
    readLabel: '🔊 Read Draft Analysis',
    continueLabel: 'Audit this draft →',
    ariaLabel: 'Babbage reflection draft analysis'
  };

  // Match S1's visible response handoff: keep the analyzer on screen while the
  // response is parsed, briefly show completion, then replace it with the report.
  try { pcMarkBabbageResponseParsed(); } catch (e) {}
  pcScheduleScenarioTask(() => {
    try { pcCompleteBabbageAnalysisProgress(); } catch (e) {}
    pcScheduleScenarioTask(() => {
      showBabbageTerminalReport(reportOptions);
    }, 160, SCENARIO_INDEX.METACOGNITION);
  }, 260, SCENARIO_INDEX.METACOGNITION);
  return true;
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

async function generateS2BabbageDraft() {
  const runToken = pcCaptureScenarioRun(SCENARIO_INDEX.METACOGNITION);
  const data = getS2Data();
  const ingredients = pcS2GetDraftIngredients(data);

  showBabbageConsultOverlay('Reflection design', {
    speakerName: 'Professor Pixel',
    heading: 'Your choices are going to Babbage.',
    body: 'Babbage is combining your diagnosis, the evidence Jordan produced, and your selected thinking move into a reflection activity.'
  });

  let result;
  try {
    const response = await requestBabbageAnalysis({
      analysis_type: 's2_draft',
      max_output_tokens: 2200,
      system: pcS2BuildDraftSystemPrompt(ingredients),
      messages: [{
        role: 'user',
        content: pcS2BuildDraftRequestText(ingredients)
      }]
    }, 's2-draft');
    if (!pcIsScenarioRunCurrent(runToken)) return false;

    result = response?.analysis || null;
    if (!result || !result.activity_prompt || !result.deliberate_weakness) throw new Error('Incomplete structured draft.');
    data.aiProvider = response.provider || '';
    data.aiModel = response.model || '';
    data.aiRequestId = response.request_id || '';
    data.aiElapsedMs = response.elapsed_ms ?? '';
    data.aiUsage = response.usage || null;
  } catch (error) {
    if (!pcIsScenarioRunCurrent(runToken)) return false;
    console.warn('[PromptCraft] S2 Babbage draft unavailable; using local fallback.', error);
    result = { ...S2_LOCAL_DRAFT_FALLBACK };
    data.aiProvider = 'local-fallback';
    data.aiModel = 'promptcraft-local-fallback';
  }

  data.babbageDraft = result;
  data.structuredAnalysis = { s2_draft: result };
  data.finalResponse = result.activity_prompt;
  data.s2DraftIngredients = ingredients;
  showS2DraftAnalysisInTerminal(data, result);
  return true;
}
function renderS2AuditActivity() {
  const data = getS2Data();
  const draft = data.babbageDraft || S2_LOCAL_DRAFT_FALLBACK;
  const choicesHTML = buildScenarioChoiceCardsHTML({
    items: S2_AUDIT_OPTIONS,
    inputName: 's2-audit',
    idPrefix: 's2-audit',
    marker: () => ''
  });

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.METACOGNITION,
    progressHTML: buildScenarioProgressHTML({ steps: S2_PROGRESS_STEPS, activeIndex: 3, ariaLabel: 'Scenario 2 progress' }),
    contentHTML: `
      <div class="pc-s2-step-shell">
        ${buildS2CaseContextHTML()}
        <div class="pc-s2-audit-layout">
        <aside class="pc-s2-babbage-draft" aria-label="Babbage reflection activity draft">
          <div class="pc-activity-kicker">Babbage draft</div>
          <h2>${esc(draft.activity_title)}</h2>
          <div class="pc-s2-draft-prompt">${esc(draft.activity_prompt)}</div>
          <section class="pc-s2-audit-jordan-evidence" aria-label="Likely Jordan response">
            <div class="pc-s2-audit-jordan-portrait">
              <img src="${ASSETS.images.students.jordan.uncertain}" alt="Jordan, an adult online learner, considering his study results" />
            </div>
            <div class="pc-s2-audit-jordan-response">
              <div class="pc-s2-audit-jordan-label">Jordan's likely response</div>
              <blockquote class="pc-s2-audit-jordan-quote">
                <span class="pc-s2-audit-jordan-quote-mark" aria-hidden="true">“</span>
                <span class="pc-s2-audit-jordan-quote-copy">${esc(draft.likely_student_response)}</span>
                <span class="pc-s2-audit-jordan-quote-mark" aria-hidden="true">”</span>
              </blockquote>
            </div>
          </section>
          <div class="pc-s2-babbage-rationale">
            <div class="pc-s2-babbage-rationale__label">Why Babbage chose it</div>
            <p>${esc(draft.design_rationale)}</p>
          </div>
        </aside>
        ${buildScenarioTaskCardHTML({
          titleId: 's2AuditTitle',
          kicker: 'Decision 4 · Audit the machine',
          title: 'What does Babbage’s draft still let Jordan avoid thinking about?',
          instruction: 'You just traced the ingredients, the draft, and Jordan’s likely response in the terminal. Choose the gap that most clearly prevents the intended thinking move from becoming visible.',
          choiceGridId: 's2AuditChoices',
          choicesHTML,
          statusId: 's2AuditStatus',
          submitId: 's2AuditSubmit',
          submitLabel: 'Audit the draft',
          feedbackId: 's2AuditFeedback',
          gridClass: 'pc-choice-grid--radio-marker',
          includeFeedback: false
        })}
        </div>
      </div>
      <div class="pc-s2-audit-feedback-wide" id="s2AuditFeedback" aria-live="polite"></div>`,
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

function pcS2RepairFieldConfig() {
  return [
    {
      id: 's2RepairEvidence',
      key: 'evidence',
      number: '1',
      label: 'Evidence to reveal',
      placeholder: 'What should Jordan have to describe about what he actually did, noticed, or understood?',
      ariaLabel: 'Describe the learning evidence Jordan should reveal'
    },
    {
      id: 's2RepairEvaluation',
      key: 'evaluation',
      number: '2',
      label: 'Evaluate the strategy',
      placeholder: 'How should Jordan judge whether the strategy actually helped his learning?',
      ariaLabel: 'Describe how Jordan should evaluate the learning strategy'
    },
    {
      id: 's2RepairNextMove',
      key: 'nextMove',
      number: '3',
      label: 'Next move',
      placeholder: 'What should Jordan decide to reuse, change, or try next time based on the evidence?',
      ariaLabel: 'Describe the next learning move Jordan should decide'
    },
    {
      id: 's2RepairSuccess',
      key: 'success',
      number: '4',
      label: 'Success criteria',
      placeholder: 'What must a strong reflection include so Jordan cannot answer with only a grade or feeling?',
      ariaLabel: 'Describe what a strong metacognitive reflection must include'
    }
  ];
}

function pcS2RepairPartsFromValues(values = {}) {
  return {
    evidence: values.s2RepairEvidence || '',
    evaluation: values.s2RepairEvaluation || '',
    nextMove: values.s2RepairNextMove || '',
    success: values.s2RepairSuccess || ''
  };
}

function pcS2BuildRepairedReflectionPrompt(parts = {}) {
  const evidence = String(parts.evidence || '').trim();
  const evaluation = String(parts.evaluation || '').trim();
  const nextMove = String(parts.nextMove || '').trim();
  const success = String(parts.success || '').trim();
  if (![evidence, evaluation, nextMove, success].some(Boolean)) return '';

  const lines = [
    'After completing the assignment, reflect on how your study strategy affected your learning.'
  ];
  if (evidence) lines.push(`1. Evidence — ${evidence}`);
  if (evaluation) lines.push(`2. Evaluation — ${evaluation}`);
  if (nextMove) lines.push(`3. Next move — ${nextMove}`);
  if (success) lines.push(`A strong response should ${success}`);
  return lines.join('\n');
}

function renderS2RepairActivity() {
  const data = getS2Data();
  const draft = data.babbageDraft || S2_LOCAL_DRAFT_FALLBACK;
  const weakness = S2_AUDIT_OPTIONS.find(item => item.id === draft.deliberate_weakness);
  const fields = pcS2RepairFieldConfig();

  const referenceHTML = `
    <div class="pc-activity-kicker">Original Babbage draft</div>
    <h2 class="pc-guided-repair-reference-title">${esc(draft.activity_title)}</h2>
    <div class="pc-guided-repair-source-prompt">${esc(draft.activity_prompt)}</div>
    <div class="pc-guided-repair-problem">
      <div class="pc-guided-repair-problem-label">What the audit found</div>
      <strong>${esc(weakness?.label || draft.deliberate_weakness)}</strong>
      <p>${esc(draft.why_the_weakness_matters)}</p>
    </div>
    <div class="pc-guided-repair-ingredients" aria-label="Repair ingredients">
      <div class="pc-guided-repair-ingredients-heading">Repair ingredients</div>
      <div class="pc-guided-repair-chip-row">
        <span class="pc-guided-repair-chip" data-pc-repair-chip="evidence">Evidence</span>
        <span class="pc-guided-repair-chip" data-pc-repair-chip="evaluation">Evaluation</span>
        <span class="pc-guided-repair-chip" data-pc-repair-chip="nextMove">Next Move</span>
        <span class="pc-guided-repair-chip" data-pc-repair-chip="success">Success Criteria</span>
      </div>
    </div>`;

  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.METACOGNITION,
    progressHTML: buildScenarioProgressHTML({ steps: S2_PROGRESS_STEPS, activeIndex: 4, ariaLabel: 'Scenario 2 progress' }),
    contentHTML: `
      <div class="pc-s2-step-shell">
        ${buildS2CaseContextHTML()}
        ${buildGuidedRepairWorkspaceHTML({
          referenceHTML,
          titleId: 's2RepairTitle',
          kicker: 'Decision 5 · Repair the design',
          title: 'Rebuild the reflection so Jordan has to show his thinking.',
          instruction: 'Fill in the four repair ingredients. PromptCraft will assemble them into the student-facing reflection prompt that Babbage reviews.',
          fields,
          previewLabel: 'Your assembled reflection prompt',
          previewId: 's2RepairPreview',
          previewFullWidth: true,
          nudgeId: 's2RepairNudge',
          statusId: 's2RepairStatus',
          submitId: 's2RepairSubmit',
          submitLabel: 'Ask Babbage to review the repair',
          feedbackId: 's2RepairFeedback'
        })}
      </div>`,
    focusSelector: '#s2RepairEvidence'
  });

  const fieldIds = fields.map(field => field.id);
  wireGuidedRepairWorkspace({
    fieldIds,
    previewId: 's2RepairPreview',
    nudgeId: 's2RepairNudge',
    statusId: 's2RepairStatus',
    submitId: 's2RepairSubmit',
    minLength: 12,
    buildPreview: values => pcS2BuildRepairedReflectionPrompt(pcS2RepairPartsFromValues(values)),
    onUpdate: (values, assembled, ready) => {
      const parts = pcS2RepairPartsFromValues(values);
      data.repairDraftParts = parts;
      data.repairDraftText = assembled;
      const readyKeys = new Set();
      fields.forEach(field => {
        if ((values[field.id] || '').length >= 12) readyKeys.add(field.key);
      });
      document.querySelectorAll('[data-pc-repair-chip]').forEach(chip => {
        chip.classList.toggle('covered', readyKeys.has(chip.dataset.pcRepairChip));
      });
    },
    onSubmit: submitS2Repair
  });
}

function pcS2BuildLocalReviewFallback(data, repair) {
  const parts = data.repairParts || {};
  const improvements = [];
  if (parts.evidence) improvements.push('The repair asks Jordan to surface evidence from his learning process.');
  if (parts.evaluation) improvements.push('The repair asks Jordan to judge the strategy instead of reporting only a feeling or grade.');
  if (parts.nextMove) improvements.push('The repair connects the reflection to a future learning decision.');
  if (parts.success) improvements.push('The success criteria make the expected metacognitive evidence more explicit.');

  return {
    status: 'DEMONSTRATION FALLBACK',
    confidence: 'LOW',
    feedback_summary: 'Live Babbage review was unavailable. PromptCraft is showing a clearly labeled demonstration review so the scenario can continue; the repaired activity below is the prompt you assembled, not an AI rewrite.',
    what_improved: improvements.length ? improvements.slice(0, 4) : ['The repair adds more explicit metacognitive structure than the original draft.'],
    remaining_issue: 'Because this is a local fallback rather than a live AI review, rerun the repair when Babbage is available to receive a model-generated critique and revision.',
    revised_activity: repair,
    student_response_after: 'I can point to what I tried, what evidence showed me where my understanding held or broke down, and what I would change on the next assignment.',
    why_student_thinking_changed: 'The repaired prompt requires Jordan to connect a strategy to evidence, evaluate what happened, and name a next move. This explanation is a demonstration fallback, not a live model judgment.'
  };
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

Faculty repair ingredients:
- Evidence to reveal: ${data.repairParts?.evidence || 'Not provided'}
- Evaluation of the strategy: ${data.repairParts?.evaluation || 'Not provided'}
- Next move: ${data.repairParts?.nextMove || 'Not provided'}
- Success criteria: ${data.repairParts?.success || 'Not provided'}

Assembled faculty repair:
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

function pcS2BuildRepairReviewDiagnosticText(review = {}) {
  const improved = Array.isArray(review.what_improved)
    ? review.what_improved.filter(Boolean).join(' • ')
    : String(review.what_improved || '').trim();

  return [
    'STATUS',
    review.status || 'REPAIR REVIEW COMPLETE',
    '',
    'CONFIDENCE',
    review.confidence || 'HIGH',
    '',
    'FEEDBACK SUMMARY',
    review.feedback_summary || 'Babbage reviewed the repair against Jordan’s metacognitive learning gap.',
    '',
    'WHAT WORKED',
    improved || 'The repaired reflection makes Jordan’s learning process more visible and gives him a clearer basis for evaluating the strategy.',
    '',
    'ISSUE DETECTED',
    review.remaining_issue || 'No major remaining issue was identified in the repaired reflection.',
    '',
    'RECOMMENDED REPAIR',
    review.revised_activity || 'Keep the assembled reflection focused on evidence, evaluation, and a next move.',
    '',
    'EXPECTED IMPACT',
    review.why_student_thinking_changed || 'Jordan must connect a strategy to learning evidence before deciding what to do next.'
  ].join('\n');
}

function pcS2ShowRepairReviewAnalysis(data, review, runToken) {
  if (!pcIsScenarioRunCurrent(runToken)) return false;

  const isFallback = data.s2ReviewSource === 'fallback' || data.aiProvider === 'local-fallback';
  const diagnosticText = pcS2BuildRepairReviewDiagnosticText(review);

  if (typeof pcMarkBabbageResponseParsed === 'function') pcMarkBabbageResponseParsed();
  if (typeof pcCompleteBabbageAnalysisProgress === 'function') pcCompleteBabbageAnalysisProgress();

  const reveal = () => {
    if (!pcIsScenarioRunCurrent(runToken)) return false;
    return showBabbageTerminalReport({
      reportHTML: buildBabbageAnalysisHTML(diagnosticText, isFallback, isFallback ? 'backend-unavailable' : ''),
      terminalStateText: `${isFallback ? 'BACKEND FALLBACK ANALYSIS' : 'ANALYSIS COMPLETE'}\n\n${diagnosticText}`,
      engineLabel: isFallback ? 'DEMONSTRATION BABBAGE ENGINE' : 'BABBAGE ENGINE',
      speakerName: 'Professor Pixel',
      onClose: () => {
        if (pcIsScenarioRunCurrent(runToken)) renderS2FinalComparison();
      },
      readLabel: '🔊 Read Analysis',
      printLabel: 'Print / Save PDF',
      continueLabel: 'Continue',
      ariaLabel: 'Babbage analysis of the repaired reflection activity'
    });
  };

  const delay = typeof pcGetBabbageProcessingHoldMs === 'function'
    ? Math.min(180, pcGetBabbageProcessingHoldMs())
    : 120;
  if (typeof pcScheduleScenarioTask === 'function') {
    pcScheduleScenarioTask(reveal, delay, SCENARIO_INDEX.METACOGNITION);
  } else {
    window.setTimeout(reveal, delay);
  }
  return true;
}

async function submitS2Repair() {
  const runToken = pcCaptureScenarioRun(SCENARIO_INDEX.METACOGNITION);
  const fieldIds = pcS2RepairFieldConfig().map(field => field.id);
  const values = getGuidedRepairValues(fieldIds);
  const parts = pcS2RepairPartsFromValues(values);
  const repair = pcS2BuildRepairedReflectionPrompt(parts);
  if (fieldIds.some(id => (values[id] || '').length < 12) || repair.length < 70) return;

  const data = getS2Data();
  data.attempts += 1;
  data.repairAttempts.push({ text: repair, parts: { ...parts }, timestamp: new Date().toISOString() });
  data.prompts.push(`S2 repair: ${repair}`);
  data.repairText = repair;
  data.repairParts = { ...parts };

  const submit = document.getElementById('s2RepairSubmit');
  if (submit) submit.disabled = true;

  if (typeof showBabbageConsultOverlay === 'function') {
    showBabbageConsultOverlay('Repair review', {
      speakerName: 'Professor Pixel',
      heading: 'Babbage is reviewing your repair.',
      body: 'It is comparing your assembled reflection prompt with Jordan’s learning-process gap.'
    });
  }

  let review;
  try {
    const response = await requestBabbageAnalysis({
      analysis_type: 's2_review',
      max_output_tokens: 3000,
      system: pcS2BuildReviewSystemPrompt(data, repair),
      messages: [{ role: 'user', content: 'Review the faculty repair now.' }]
    }, 's2-review');
    if (!pcIsScenarioRunCurrent(runToken)) return false;

    if (response?.mock || response?.provider === 'local-fallback') {
      throw new Error(`Babbage returned a local fallback (${response?.mockReason || 'backend unavailable'}).`);
    }
    review = response?.analysis || null;
    if (!review || !review.revised_activity || !review.student_response_after) throw new Error('Incomplete structured review.');
    data.aiProvider = response.provider || '';
    data.aiModel = response.model || '';
    data.aiRequestId = response.request_id || '';
    data.aiElapsedMs = response.elapsed_ms ?? null;
    data.aiUsage = response.usage || null;
    data.s2ReviewSource = 'live';
  } catch (error) {
    if (!pcIsScenarioRunCurrent(runToken)) return false;
    console.warn('[PromptCraft] S2 Babbage review unavailable; using labeled local fallback.', error);
    review = pcS2BuildLocalReviewFallback(data, repair);
    data.aiProvider = 'local-fallback';
    data.aiModel = 'promptcraft-local-fallback';
    data.aiRequestId = '';
    data.aiElapsedMs = null;
    data.aiUsage = null;
    data.s2ReviewSource = 'fallback';
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

  pcS2ShowRepairReviewAnalysis(data, review, runToken);
}

function renderS2FinalComparison() {
  if (scenarioIndex !== SCENARIO_INDEX.METACOGNITION) return false;
  const data = getS2Data();
  const draft = data.babbageDraft || S2_LOCAL_DRAFT_FALLBACK;
  const review = data.babbageReview || S2_LOCAL_REVIEW_FALLBACK;
  const improvedItems = Array.isArray(review.what_improved)
    ? review.what_improved.filter(Boolean)
    : [String(review.what_improved || '')].filter(Boolean);

  awardScenarioScoreXP(SCENARIO_INDEX.METACOGNITION, data.currentScore || data.bestScore || 5, 5);
  markScenarioComplete();
  saveIncrementalData(SCENARIO_INDEX.METACOGNITION);

  const reviewIsFallback = data.s2ReviewSource === 'fallback' || data.aiProvider === 'local-fallback';
  const reviewEyebrow = reviewIsFallback
    ? 'Demonstration fallback review · Scenario 2 complete'
    : `Live Babbage review${data.aiModel ? ` · ${data.aiModel}` : ''} · Scenario 2 complete`;
  const reviewTitle = reviewIsFallback
    ? 'Demonstration Review · Babbage unavailable'
    : "Babbage's Live Review of the Revision";

  pcRenderSharedScenarioResult({
    eyebrow: reviewEyebrow,
    title: 'Repaired Reflection Activity',
    bodyHTML: fmt(review.revised_activity || ''),
    reviewTitle,
    reviewItems: [
      {
        label: 'Strongest improvement',
        value: improvedItems.join(' ') || 'The repair makes the intended thinking more visible.'
      },
      { label: 'Remaining limitation', value: review.remaining_issue || '' },
      { label: "Why Jordan's thinking changed", value: review.why_student_thinking_changed || '' }
    ],
    referenceTitle: 'Before and after',
    referenceItems: [
      { label: 'Original draft', value: draft.activity_prompt || '' },
      { label: 'Jordan before', value: draft.likely_student_response || '' },
      { label: 'Jordan after', value: review.student_response_after || '' }
    ],
    controlsTitle: 'Scenario 2 result',
    controlsSub: reviewIsFallback ? 'Live Babbage was unavailable. This result uses the labeled demonstration fallback.' : 'Babbage reviewed your repair live. Choose the next step.',
    controlsActionsHTML: `
      <button class="s1-secondary-btn" type="button" data-pc-action="s2-repair-draft">Revise S2</button>
      <button class="continue-btn" type="button" data-pc-action="navigate-next" data-pc-scenario-index="2">Next scenario →</button>`
  });
  document.querySelector('#inputContainer button')?.focus();
  return true;
}

function pcGetLatestS2Selection(attemptKey) {
  const attempts = getS2Data()[attemptKey];
  const latest = Array.isArray(attempts) ? attempts[attempts.length - 1] : null;
  return Array.isArray(latest?.selection) ? [...latest.selection] : [];
}

pcRegisterUIActions({
  's2-continue-evidence': () => {
    getS2Data().diagnosisFinal = pcGetLatestS2Selection('diagnosisAttempts');
    renderS2EvidenceActivity();
  },
  's2-generate-draft': () => generateS2BabbageDraft(),
  's2-repair-draft': () => renderS2RepairActivity()
});
