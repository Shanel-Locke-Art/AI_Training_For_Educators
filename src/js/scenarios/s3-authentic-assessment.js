/* PROMPTCRAFT SCENARIO 3 — AUTHENTIC ASSESSMENT
   Evidence Board: Sort → Build → Stress-test → Audit Babbage → Repair.
   Scenario-specific content lives here. Drag/drop mechanics, VN presentation,
   Babbage workstation, scoring, research logging, results, and lifecycle are shared. */

const S3_PROGRESS_STEPS = [
  '1 Sort evidence',
  '2 Build',
  '3 Stress-test',
  '4 Audit Babbage',
  '5 Repair',
  '6 Apply'
];

const S3_LEARNING_OUTCOME = 'Given a rural community planning problem, analyze stakeholder needs and local evidence, recommend a feasible response, and justify the trade-offs behind the decision.';
const S3_ORIGINAL_ASSESSMENT = 'Define land use, infrastructure, stakeholder engagement, and zoning. Explain the four stages of the planning cycle and identify the best answer in one short planning example.';
const S3_MAYA_SCORE = '96%';

const S3_DIAGNOSIS_CARDS = [
  { id: 'define_zoning', tag: 'QUIZ ITEM', title: 'Define zoning', text: 'Maya accurately defines zoning and gives the textbook example.' },
  { id: 'name_cycle', tag: 'QUIZ ITEM', title: 'Name the planning cycle', text: 'Maya lists the four planning stages in the correct order.' },
  { id: 'match_terms', tag: 'QUIZ ITEM', title: 'Match key terms', text: 'Maya matches six planning terms to their definitions.' },
  { id: 'explain_stakeholders', tag: 'SHORT ANSWER', title: 'Explain stakeholder engagement', text: 'Maya explains why community input matters during planning.' },
  { id: 'summarize_example', tag: 'SHORT ANSWER', title: 'Summarize a sample plan', text: 'Maya summarizes how a textbook town responded to a planning problem.' },
  { id: 'choose_example', tag: 'APPLICATION', title: 'Choose a response from a provided example', text: 'Maya selects the response that best fits a short, highly structured example.' }
];

const S3_DIAGNOSIS_ZONES = [
  { id: 'know', tag: 'KNOW', label: 'Know', description: 'Recall, recognize, identify, or define information.' },
  { id: 'explain', tag: 'EXPLAIN', label: 'Explain', description: 'Describe meaning, relationships, or why something matters.' },
  { id: 'apply', tag: 'APPLY', label: 'Apply', description: 'Use knowledge to respond to a situation or problem.' },
  { id: 'decide', tag: 'DECIDE', label: 'Decide & justify', description: 'Make a defensible choice and explain the evidence and trade-offs.' }
];

const S3_DIAGNOSIS_KEY = Object.freeze({
  define_zoning: 'know',
  name_cycle: 'know',
  match_terms: 'know',
  explain_stakeholders: 'explain',
  summarize_example: 'explain',
  choose_example: 'apply'
});

const S3_BLUEPRINT_DIMENSIONS = [
  {
    id: 'context',
    label: 'Situation',
    description: 'What context gives the task realistic constraints?',
    options: [
      { id: 'chapter_review', tag: 'TEXTBOOK', title: 'Chapter review', text: 'Use the same worked example and values students already practiced.', score: 0 },
      { id: 'generic_scenario', tag: 'SCENARIO', title: 'Generic real-world scenario', text: 'Give students a fictional town problem, but no meaningful constraints or competing needs.', score: 0 },
      { id: 'county_brief', tag: 'BRIEF', title: 'County planning brief', text: 'Provide population data, budget limits, road access, stakeholder concerns, and a decision deadline.', score: 1 }
    ]
  },
  {
    id: 'performance',
    label: 'Performance',
    description: 'What must Maya actually do?',
    options: [
      { id: 'define_terms', tag: 'RECALL', title: 'Define the planning terms', text: 'Write definitions for the concepts used in the case.', score: 0 },
      { id: 'summarize_options', tag: 'SUMMARY', title: 'Summarize the possible responses', text: 'Describe each option the county could consider.', score: 0 },
      { id: 'recommend_response', tag: 'DECIDE', title: 'Recommend a feasible response', text: 'Choose a course of action that fits the evidence and constraints in the county brief.', score: 1 }
    ]
  },
  {
    id: 'evidence',
    label: 'Observable evidence',
    description: 'What product makes the performance visible?',
    options: [
      { id: 'vocabulary_sheet', tag: 'TERMS', title: 'Completed vocabulary worksheet', text: 'Collect the planning terms and definitions used in the unit.', score: 0 },
      { id: 'recommendation_only', tag: 'ANSWER', title: 'Final recommendation only', text: 'Record which option Maya chose without requiring the evidence behind it.', score: 0 },
      { id: 'decision_record', tag: 'RECORD', title: 'Decision memo + evidence table', text: 'Collect Maya’s recommendation, the local evidence she used, and the constraints her plan addresses.', score: 1 }
    ]
  },
  {
    id: 'reasoning',
    label: 'Reasoning',
    description: 'What thinking must become visible?',
    options: [
      { id: 'state_preference', tag: 'OPINION', title: 'State the preferred option', text: 'Ask Maya which option she likes best.', score: 0 },
      { id: 'list_pros_cons', tag: 'LIST', title: 'List pros and cons', text: 'Ask for advantages and disadvantages without connecting them to a decision.', score: 0 },
      { id: 'justify_tradeoff', tag: 'WHY', title: 'Justify the choice and reject an alternative', text: 'Connect evidence to the recommendation, explain one trade-off, and show why another plausible option was rejected.', score: 1 }
    ]
  },
  {
    id: 'criteria',
    label: 'Success criteria',
    description: 'What distinguishes strong evidence from a polished submission?',
    options: [
      { id: 'format', tag: 'POLISH', title: 'Grammar, formatting, and completeness', text: 'Score presentation quality and whether every section is filled in.', score: 0 },
      { id: 'required_terms', tag: 'CHECKLIST', title: 'Required terms and word count', text: 'Score whether Maya uses the vocabulary and reaches the required length.', score: 0 },
      { id: 'performance_criteria', tag: 'EVIDENCE', title: 'Evidence fit, feasibility, reasoning, and adaptation', text: 'Score whether the recommendation fits the evidence, addresses constraints, explains trade-offs, and can be adapted when one condition changes.', score: 1 }
    ]
  }
];

const S3_STRESS_CARDS = [
  { id: 'correct_choice', tag: 'RESULT', title: 'Maya chooses the most feasible option', text: 'Her recommendation fits the county brief.' },
  { id: 'uses_evidence', tag: 'EVIDENCE', title: 'She connects local data to the recommendation', text: 'Maya cites population, road-access, and budget evidence that supports her choice.' },
  { id: 'rejects_alternative', tag: 'REASONING', title: 'She rejects a plausible alternative', text: 'Maya explains why a more popular option fails an important budget constraint.' },
  { id: 'uses_terms', tag: 'TERMS', title: 'She uses all six course terms correctly', text: 'The memo uses the required planning vocabulary accurately.' },
  { id: 'polished', tag: 'POLISH', title: 'The memo looks professional', text: 'The document is clean, polished, and carefully formatted.' },
  { id: 'adapts', tag: 'TRANSFER', title: 'She adapts when the budget changes', text: 'After a 20% budget cut, Maya revises the recommendation and explains what changed in her reasoning.' }
];

const S3_STRESS_ZONES = [
  { id: 'proves', tag: 'STRONG', label: 'Proves it', description: 'Strong evidence for the intended performance.' },
  { id: 'helps', tag: 'PARTIAL', label: 'Helps, but not enough', description: 'Relevant evidence that does not support the full claim by itself.' },
  { id: 'doesnt', tag: 'NO', label: 'Doesn’t prove it', description: 'May be useful for another purpose, but not for this learning claim.' }
];

const S3_STRESS_KEY = Object.freeze({
  correct_choice: 'helps',
  uses_evidence: 'proves',
  rejects_alternative: 'proves',
  uses_terms: 'helps',
  polished: 'doesnt',
  adapts: 'proves'
});

const S3_LOCAL_BABBAGE_ANALYSIS = Object.freeze({
  claim_about_learning: 'Because the redesigned assessment requires a recommendation, evidence-based reasoning, and adaptation to a changed constraint, one strong performance would be enough to conclude Maya can transfer the skill independently to new planning problems.',
  confidence: 'HIGH',
  evidence_used: [
    'The redesigned task requires Maya to make a planning recommendation in a realistic county case.',
    'It requires her to connect local evidence and constraints to the recommendation instead of only recalling terms.',
    'It asks her to adapt the plan after a meaningful condition changes, making her reasoning visible.'
  ],
  judgment: 'STRONGER EVIDENCE',
  recommendation: 'Replace the recall-heavy test with a county planning brief that requires a recommendation, an evidence-based rationale, a rejected alternative, and a revision after one meaningful constraint changes.',
  deliberate_issue: 'ignores_transfer',
  why_this_inference_is_plausible: 'The redesign aligns the assessment with the course outcome by making application, reasoning, and adaptation observable. One successful case still does not establish broad independent transfer.'
});

const S3_AUDIT_ZONES = [
  { id: 'supported', tag: 'SUPPORTED', label: 'Supported', description: 'The available evidence directly supports this claim.' },
  { id: 'needs_more', tag: 'MORE', label: 'Needs more evidence', description: 'The claim may be reasonable, but it reaches beyond what this evidence establishes.' },
  { id: 'not_supported', tag: 'NO', label: 'Not supported', description: 'The cited feature does not support this learning claim.' }
];

const S3_REPAIR_DIMENSION = [{
  id: 'repair',
  label: 'Transfer check',
  description: 'What final change would keep the assessment from making a claim larger than its evidence?',
  options: [
    { id: 'more_polish', tag: 'POLISH', title: 'Add another presentation-quality check', text: 'Require additional formatting, editing, and visual polish.', score: 0 },
    { id: 'repeat_same', tag: 'REPEAT', title: 'Repeat the same case with new numbers', text: 'Give Maya the same structure and decision with slightly different values.', score: 0 },
    { id: 'changed_constraint', tag: 'ADAPT', title: 'Change a meaningful constraint', text: 'After Maya commits to a recommendation, change one major condition and require her to adapt the plan and explain what changed.', score: 1 }
  ]
}];

function getS3Data() {
  const data = scenarioData[SCENARIO_INDEX.ASSESSMENT];
  if (!Array.isArray(data.diagnosisAttempts)) data.diagnosisAttempts = [];
  if (!Array.isArray(data.blueprintAttempts)) data.blueprintAttempts = [];
  if (!Array.isArray(data.evidenceAttempts)) data.evidenceAttempts = [];
  if (!Array.isArray(data.auditAttempts)) data.auditAttempts = [];
  if (!Array.isArray(data.repairAttempts)) data.repairAttempts = [];
  if (!Array.isArray(data.dragEvents)) data.dragEvents = [];
  if (!data.blueprintInitial || typeof data.blueprintInitial !== 'object') data.blueprintInitial = {};
  if (!data.blueprintFinal || typeof data.blueprintFinal !== 'object') data.blueprintFinal = {};
  if (!Array.isArray(data.evidenceFinal)) data.evidenceFinal = [];
  if (!data.babbageEvidenceAnalysis || typeof data.babbageEvidenceAnalysis !== 'object') data.babbageEvidenceAnalysis = null;
  if (typeof data.s3AnalysisSource !== 'string') data.s3AnalysisSource = '';
  if (typeof data.evidenceStatement !== 'string') data.evidenceStatement = '';
  if (typeof data.repairText !== 'string') data.repairText = '';
  if (!Number.isFinite(Number(data.initialScore))) data.initialScore = 0;
  if (!Number.isFinite(Number(data.revisedScore))) data.revisedScore = 0;
  if (!Number.isFinite(Number(data.currentScore))) data.currentScore = 0;
  if (!Number.isFinite(Number(data.scoreDelta))) data.scoreDelta = 0;
  return data;
}

function s3Progress(activeIndex) {
  return buildScenarioProgressHTML({
    steps: S3_PROGRESS_STEPS,
    activeIndex,
    ariaLabel: 'Scenario 3 progress'
  });
}

function s3TrackDrag(phase, placements, detail = {}) {
  const data = getS3Data();
  data.dragEvents.push({
    phase,
    placements: { ...placements },
    ...detail,
    timestamp: new Date().toISOString()
  });
}

function s3PlayCastSequence(key, onDone) {
  const lines = pixelDialogue?.[key];
  if (!Array.isArray(lines) || !lines.length) {
    if (typeof onDone === 'function') onDone();
    return false;
  }
  const cast = getScenarioUI(SCENARIO_INDEX.ASSESSMENT)?.introCharacters || [
    { id: 'pixel', slot: 'right' },
    { id: 'maya', slot: 'left' }
  ];
  const runToken = pcCaptureScenarioRun(SCENARIO_INDEX.ASSESSMENT);
  lines.forEach((line, index) => {
    const isLast = index === lines.length - 1;
    vnShow(line.expr || 'neutral', line.text || '', isLast && onDone ? () => {
      if (pcIsScenarioRunCurrent(runToken)) onDone();
    } : null, {
      speaker: line.speaker || (line.character === 'maya' ? 'Maya' : 'Professor Pixel'),
      character: line.character || 'pixel',
      cast: line.cast || cast,
      id: line.id || ''
    });
  });
  return true;
}

function renderS3Standby(container) {
  mountScenarioActivity({
    container,
    scenarioIndex: SCENARIO_INDEX.ASSESSMENT,
    contentHTML: `
      <section class="pc-activity-card pc-activity-standby" aria-live="polite">
        <div class="pc-activity-kicker">Case file loading</div>
        <h2>The 96% Problem</h2>
        <p>Pixel and Maya will introduce the case. Start by listening to what the grade does and does not tell you.</p>
      </section>`
  });
}

function getS3MayaCaseQuote() {
  const opening = Array.isArray(window.pixelDialogue?.scenarioStart_assessment) ? window.pixelDialogue.scenarioStart_assessment : [];
  return opening.find(line => line.id === 'maya-s3-02')?.text
    || "But if someone handed me a real planning problem tomorrow, I wouldn't know where to start.";
}

function buildS3CaseBriefHTML({ compact = false } = {}) {
  const contextHTML = `
    <div class="pc-case-brief-copy">
      <div><span>Learning outcome</span><p>${esc(S3_LEARNING_OUTCOME)}</p></div>
      <div><span>Current assessment</span><p>${esc(S3_ORIGINAL_ASSESSMENT)}</p></div>
    </div>`;

  if (compact) {
    return `
      <section class="pc-case-brief pc-case-brief--compact" aria-label="Scenario 3 case brief">
        <div class="pc-case-brief-score"><span>Maya’s score</span><strong>${S3_MAYA_SCORE}</strong><small>Original assessment</small></div>
        ${contextHTML}
      </section>`;
  }

  return `
    ${buildStudentEvidencePanelHTML({
      title: 'Student Evidence',
      portraitSrc: ASSETS.images.students.maya.uncertain,
      portraitAlt: 'Maya, an adult rural learner and parent, looking uncertain',
      characterId: 'maya',
      quote: getS3MayaCaseQuote(),
      resultLabel: 'Original result',
      resultValue: S3_MAYA_SCORE,
      resultNote: 'High score'
    })}
    <section class="pc-case-brief pc-case-brief--context" aria-label="Scenario 3 learning outcome and current assessment">
      ${contextHTML}
    </section>`;
}

function s3MarkSortResults(rootId, answerKey) {
  const root = document.getElementById(rootId);
  if (!root) return { correct: 0, total: 0, remaining: 0 };
  let correct = 0;
  const cards = Array.from(root.querySelectorAll('[data-pc-drag-card]'));
  const tray = Array.from(root.querySelectorAll('[data-pc-drop-zone]')).find(zone => zone.dataset.pcIsTray === 'true');
  const trayTarget = tray?.querySelector('[data-pc-zone-cards]');

  cards.forEach(card => {
    card.classList.remove('is-incorrect');
    card.querySelector('.pc-drag-card-correction')?.remove();
    const cardId = card.dataset.pcDragCard;
    const zone = card.closest('[data-pc-drop-zone]');
    const actual = zone?.dataset.pcIsTray === 'true' ? '' : (zone?.dataset.pcDropZone || '');
    const expected = answerKey[cardId] || '';
    const isCorrect = actual === expected;

    if (isCorrect) {
      correct += 1;
      card.classList.add('is-correct');
      card.dataset.pcCardLocked = 'true';
      card.draggable = false;
      card.setAttribute('aria-grabbed', 'false');
      card.setAttribute('aria-disabled', 'true');
      card.setAttribute('tabindex', '-1');
      return;
    }

    card.classList.remove('is-correct');
    delete card.dataset.pcCardLocked;
    card.draggable = true;
    card.removeAttribute('aria-disabled');
    card.setAttribute('tabindex', '0');
    card.classList.add('is-incorrect');
    const note = document.createElement('span');
    note.className = 'pc-drag-card-correction';
    note.textContent = 'Try another category.';
    card.appendChild(note);
    if (trayTarget) trayTarget.appendChild(card);
  });

  const remaining = Math.max(0, cards.length - correct);
  if (remaining === 0) {
    lockDragBoard(rootId);
  } else {
    root.dataset.pcDragLocked = 'false';
    root.classList.remove('is-reviewed', 'is-complete');
    root.dispatchEvent(new CustomEvent('pc-drag-refresh'));
  }
  return { correct, total: cards.length, remaining };
}

function renderS3DiagnosisActivity() {
  if (scenarioIndex !== SCENARIO_INDEX.ASSESSMENT) return false;
  const boardHTML = buildDragSortBoardHTML({
    rootId: 's3DiagnosisBoard',
    titleId: 's3DiagnosisTitle',
    kicker: 'Case File 03 · Diagnose',
    title: 'What did Maya’s 96% actually measure?',
    instruction: 'Sort every card by the kind of performance it makes visible. Categories can hold more than one card, and correct placements will stay in place after you check your work.',
    cards: S3_DIAGNOSIS_CARDS,
    zones: S3_DIAGNOSIS_ZONES,
    statusId: 's3DiagnosisStatus',
    submitId: 's3DiagnosisSubmit',
    submitLabel: 'Check the evidence map',
    trayLabel: 'What Maya was asked to do',
    trayHint: 'Drag every card into a category. More than one card can belong in the same category.',
    feedbackId: 's3DiagnosisFeedback'
  });
  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.ASSESSMENT,
    progressHTML: s3Progress(0),
    contentHTML: `${buildS3CaseBriefHTML()}${boardHTML}`,
    focusSelector: '#s3DiagnosisBoard [data-pc-drag-card]'
  });
  wireDragBoard({
    rootId: 's3DiagnosisBoard',
    statusId: 's3DiagnosisStatus',
    submitId: 's3DiagnosisSubmit',
    requiredCardIds: S3_DIAGNOSIS_CARDS.map(card => card.id),
    onMove: (placements, detail) => s3TrackDrag('diagnosis', placements, detail),
    onSubmit: submitS3Diagnosis
  });
  return true;
}

function submitS3Diagnosis() {
  const placements = getDragBoardPlacements('s3DiagnosisBoard');
  if (S3_DIAGNOSIS_CARDS.some(card => !placements[card.id])) return;
  const attemptedPlacements = { ...placements };
  const result = s3MarkSortResults('s3DiagnosisBoard', S3_DIAGNOSIS_KEY);
  const data = getS3Data();
  data.attempts += 1;
  data.diagnosisAttempts.push({ placements: attemptedPlacements, correctCount: result.correct, total: result.total, timestamp: new Date().toISOString() });
  data.prompts.push(`S3 evidence sort: ${result.correct}/${result.total}`);

  const status = document.getElementById('s3DiagnosisStatus');
  const submit = document.getElementById('s3DiagnosisSubmit');

  if (result.remaining > 0) {
    if (status) status.textContent = `${result.correct} of ${result.total} cards correctly placed · ${result.remaining} returned to the tray`;
    if (submit) submit.disabled = false;
    renderScenarioFeedback({
      panelId: 's3DiagnosisFeedback',
      tone: result.correct >= 4 ? 'strong' : 'developing',
      heading: `${result.correct} correct placement${result.correct === 1 ? '' : 's'} locked in.`,
      text: `Those cards will stay where they belong. The remaining ${result.remaining} card${result.remaining === 1 ? ' has' : 's have'} returned to the tray so you can reconsider only the unresolved evidence.`
    });
    return;
  }

  data.diagnosisFinal = attemptedPlacements;
  if (submit) submit.disabled = true;
  renderScenarioFeedback({
    panelId: 's3DiagnosisFeedback',
    tone: 'strong',
    heading: `${result.correct} of ${result.total} evidence cards aligned.`,
    text: 'The original assessment contains useful knowledge checks, but very little evidence of the decision-making and justification named in the course outcome.',
    actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s3-diagnosis-dialogue">Talk it through with Maya →</button>'
  });
}

function scoreS3Blueprint(selections = {}) {
  const byDimension = Object.fromEntries(S3_BLUEPRINT_DIMENSIONS.map(dimension => {
    const option = dimension.options.find(item => item.id === selections[dimension.id]);
    return [dimension.id, Number(option?.score || 0)];
  }));
  return { byDimension, total: Object.values(byDimension).reduce((sum, value) => sum + value, 0) };
}

function labelS3BlueprintSelection(dimensionId, selectionId) {
  const dimension = S3_BLUEPRINT_DIMENSIONS.find(item => item.id === dimensionId);
  return dimension?.options.find(item => item.id === selectionId)?.title || selectionId || 'Not selected';
}

function summarizeS3Blueprint(selections = {}) {
  return S3_BLUEPRINT_DIMENSIONS.map(dimension => `${dimension.label}: ${labelS3BlueprintSelection(dimension.id, selections[dimension.id])}`).join(' | ');
}

function renderS3BlueprintActivity() {
  if (scenarioIndex !== SCENARIO_INDEX.ASSESSMENT) return false;
  const workbenchHTML = buildDragSlotWorkbenchHTML({
    rootId: 's3BlueprintWorkbench',
    titleId: 's3BlueprintTitle',
    kicker: 'Assessment Workbench · Build',
    title: 'Build an assessment that can support the claim.',
    instruction: 'Drag one choice into each slot. A realistic setting alone is not enough; the task has to make the intended performance and reasoning visible.',
    dimensions: S3_BLUEPRINT_DIMENSIONS,
    statusId: 's3BlueprintStatus',
    submitId: 's3BlueprintSubmit',
    submitLabel: 'Stress-test this assessment',
    feedbackId: 's3BlueprintFeedback'
  });
  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.ASSESSMENT,
    progressHTML: s3Progress(1),
    contentHTML: `${buildS3CaseBriefHTML({ compact: true })}${workbenchHTML}`,
    focusSelector: '#s3BlueprintWorkbench [data-pc-drag-card]'
  });
  wireDragBoard({
    rootId: 's3BlueprintWorkbench',
    statusId: 's3BlueprintStatus',
    submitId: 's3BlueprintSubmit',
    requiredZoneIds: S3_BLUEPRINT_DIMENSIONS.map(dimension => dimension.id),
    onMove: (placements, detail) => s3TrackDrag('blueprint', placements, detail),
    onSubmit: submitS3Blueprint
  });
  return true;
}

function submitS3Blueprint() {
  const selections = getDragSlotSelections({ rootId: 's3BlueprintWorkbench', dimensions: S3_BLUEPRINT_DIMENSIONS });
  if (S3_BLUEPRINT_DIMENSIONS.some(dimension => !selections[dimension.id])) return;
  const data = getS3Data();
  const score = scoreS3Blueprint(selections);
  data.attempts += 1;
  data.blueprintAttempts.push({ phase: 'initial', selections: { ...selections }, score: score.total, timestamp: new Date().toISOString() });
  data.blueprintInitial = { ...selections };
  data.blueprintFinal = { ...selections };
  data.initialScore = score.total;
  data.currentScore = score.total;
  data.bestScore = Math.max(Number(data.bestScore || 0), score.total);
  data.prompts.push(`S3 blueprint: ${summarizeS3Blueprint(selections)}`);
  awardScenarioScoreXP(SCENARIO_INDEX.ASSESSMENT, score.total, 5);
  const submit = document.getElementById('s3BlueprintSubmit');
  if (submit) submit.disabled = true;
  lockDragBoard('s3BlueprintWorkbench');
  const key = score.total >= 5 ? 's3_blueprint_strong' : score.total >= 3 ? 's3_blueprint_mixed' : 's3_blueprint_weak';
  renderScenarioFeedback({
    panelId: 's3BlueprintFeedback',
    tone: score.total >= 4 ? 'strong' : 'developing',
    heading: `${score.total} of 5 evidence-design indicators are aligned.`,
    text: 'The score is not the verdict. The next step is to put student evidence through the design and see what conclusions it can actually support.',
    actionsHTML: `<button class="pc-button pc-button--primary" type="button" data-pc-action="s3-blueprint-dialogue" data-pc-dialogue-key="${esc(key)}">Hear Maya’s reaction →</button>`
  });
}

function renderS3StressTestActivity() {
  if (scenarioIndex !== SCENARIO_INDEX.ASSESSMENT) return false;
  const data = getS3Data();
  const blueprintSummary = summarizeS3Blueprint(data.blueprintInitial);
  const boardHTML = buildDragSortBoardHTML({
    rootId: 's3StressBoard',
    titleId: 's3StressTitle',
    kicker: 'Evidence Test · Stress-test',
    title: 'What does Maya’s performance actually prove?',
    instruction: 'Sort each piece of Maya’s work by how strongly it supports the course outcome. Judge the evidence, not the effort, polish, or grade.',
    cards: S3_STRESS_CARDS,
    zones: S3_STRESS_ZONES,
    statusId: 's3StressStatus',
    submitId: 's3StressSubmit',
    submitLabel: 'Evaluate the evidence',
    trayLabel: 'Evidence from Maya’s attempt',
    feedbackId: 's3StressFeedback'
  });
  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.ASSESSMENT,
    progressHTML: s3Progress(2),
    contentHTML: `
      <section class="pc-design-snapshot" aria-label="Your assessment design">
        <span>Your assessment design</span><p>${esc(blueprintSummary)}</p>
      </section>
      ${boardHTML}`,
    focusSelector: '#s3StressBoard [data-pc-drag-card]'
  });
  wireDragBoard({
    rootId: 's3StressBoard',
    statusId: 's3StressStatus',
    submitId: 's3StressSubmit',
    requiredCardIds: S3_STRESS_CARDS.map(card => card.id),
    onMove: (placements, detail) => s3TrackDrag('stress_test', placements, detail),
    onSubmit: submitS3StressTest
  });
  return true;
}

function submitS3StressTest() {
  const placements = getDragBoardPlacements('s3StressBoard');
  if (S3_STRESS_CARDS.some(card => !placements[card.id])) return;
  const result = s3MarkSortResults('s3StressBoard', S3_STRESS_KEY);
  const data = getS3Data();
  const detailed = S3_STRESS_CARDS.map(card => ({ cardId: card.id, judgment: placements[card.id], expected: S3_STRESS_KEY[card.id], correct: placements[card.id] === S3_STRESS_KEY[card.id] }));
  data.attempts += 1;
  data.evidenceAttempts.push({ placements: { ...placements }, results: detailed, correctCount: result.correct, total: result.total, timestamp: new Date().toISOString() });
  data.evidenceFinal = detailed;
  const submit = document.getElementById('s3StressSubmit');
  if (submit) submit.disabled = true;
  renderScenarioFeedback({
    panelId: 's3StressFeedback',
    tone: result.correct >= 5 ? 'strong' : 'developing',
    heading: `${result.correct} of ${result.total} evidence judgments aligned.`,
    text: 'A correct answer or polished product can contribute evidence without proving the whole outcome. The strongest evidence makes the recommendation, evidence, reasoning, and adaptation visible together.',
    actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s3-stress-dialogue">Compare notes with Maya →</button>'
  });
}

function buildS3BabbageSystemPrompt(data) {
  return `You are Babbage, PromptCraft's fictional analysis system in Scenario 3: Authentic Assessment. The faculty learner must evaluate your conclusions rather than treat you as an answer key.

Course outcome:
${S3_LEARNING_OUTCOME}

Original assessment:
${S3_ORIGINAL_ASSESSMENT}

Faculty assessment blueprint:
${summarizeS3Blueprint(data.blueprintInitial)}

Student evidence produced during the stress test:
${S3_STRESS_CARDS.map((card, index) => `${index + 1}. ${card.title}: ${card.text}`).join('\n')}

Compare the original test with the redesigned assessment. Explain how and why the new assessment could provide stronger evidence of the intended learning because it asks the student to perform, justify, and adapt rather than mainly reproduce information. In recommendation, propose a concise improved assessment task. In evidence_used, identify the design features that make stronger evidence visible. Keep one specific overreach for the human audit: in claim_about_learning, imply that one strong performance on this redesigned case is enough to establish broad independent transfer to new planning problems. Set deliberate_issue to ignores_transfer. Do not reveal that the overreach was instructed or deliberate in visible prose.`;
}

function buildS3BabbageReportHTML(analysis = S3_LOCAL_BABBAGE_ANALYSIS, fallback = false) {
  const evidence = Array.isArray(analysis.evidence_used) ? analysis.evidence_used : [];
  const summary = 'Babbage compared the original recall-heavy test with the assessment you built. The redesign asks the student to perform the course outcome instead of mainly reproduce information.';
  const issue = 'The original assessment can produce a high score without requiring a planning decision, an evidence-based rationale, or adaptation when conditions change.';
  const worked = evidence.length
    ? evidence.join(' ')
    : 'The redesign makes the recommendation, evidence, reasoning, and adaptation visible in the student performance.';
  const standardReportText = [
    'STATUS', analysis.judgment || 'STRONGER EVIDENCE',
    'CONFIDENCE', analysis.confidence || 'HIGH',
    'FEEDBACK SUMMARY', summary,
    'WHAT WORKED', worked,
    'ISSUE DETECTED', issue,
    'RECOMMENDED REPAIR', analysis.recommendation || S3_LOCAL_BABBAGE_ANALYSIS.recommendation,
    'EXPECTED IMPACT', analysis.claim_about_learning || S3_LOCAL_BABBAGE_ANALYSIS.claim_about_learning
  ].join('\n\n');

  // Reuse the shared Babbage report from the earlier scenarios rather than
  // creating a second S3-only CRT dashboard.
  return buildBabbageAnalysisHTML(
    standardReportText,
    fallback,
    fallback ? 'backend-unavailable' : ''
  );
}

async function runS3BabbageEvidenceAnalysis() {
  if (scenarioIndex !== SCENARIO_INDEX.ASSESSMENT) return false;
  const runToken = pcCaptureScenarioRun(SCENARIO_INDEX.ASSESSMENT);
  const data = getS3Data();
  // The Babbage workstation is its own scene. Clear the VN cast first so Maya
  // and Pixel cannot linger behind the computer after a dual-character sequence.
  try { pcResetVNCharacters(); } catch (e) {}
  showBabbageConsultOverlay('Assessment comparison', {
    speakerName: 'Professor Pixel',
    heading: 'Babbage is comparing the two assessment designs.',
    body: 'It will explain what the original test measured, what the redesign makes visible, and how far that evidence can support a claim.'
  });

  let analysis = null;
  let fallback = false;
  try {
    const response = await requestBabbageAnalysis({
      analysis_type: 's3_evidence_analysis',
      max_output_tokens: 1600,
      system: buildS3BabbageSystemPrompt(data),
      messages: [{ role: 'user', content: 'Analyze the evidence and make the requested evidence-sufficiency judgment.' }]
    }, 's3-evidence-analysis');
    if (!pcIsScenarioRunCurrent(runToken)) return false;
    if (response?.mock || response?.provider === 'local-fallback') throw new Error('Live Babbage unavailable.');
    analysis = response?.analysis || response?.structured || null;
    if (!analysis?.claim_about_learning) throw new Error('Incomplete S3 evidence analysis.');
    analysis.deliberate_issue = 'ignores_transfer';
    data.aiProvider = response.provider || '';
    data.aiModel = response.model || '';
    data.aiRequestId = response.request_id || '';
    data.aiElapsedMs = response.elapsed_ms ?? '';
    data.aiUsage = response.usage || null;
    data.s3AnalysisSource = 'live';
  } catch (error) {
    if (!pcIsScenarioRunCurrent(runToken)) return false;
    console.warn('[PromptCraft] S3 Babbage evidence analysis unavailable; using local fallback.', error);
    analysis = { ...S3_LOCAL_BABBAGE_ANALYSIS, evidence_used: [...S3_LOCAL_BABBAGE_ANALYSIS.evidence_used] };
    data.aiProvider = 'local-fallback';
    data.aiModel = 'promptcraft-local-fallback';
    data.aiRequestId = '';
    data.aiElapsedMs = '';
    data.aiUsage = null;
    data.s3AnalysisSource = 'fallback';
    fallback = true;
  }

  data.babbageEvidenceAnalysis = analysis;
  data.structuredAnalysis = { s3_evidence_analysis: analysis };
  data.finalResponse = analysis.claim_about_learning || '';
  try { pcMarkBabbageResponseParsed(); } catch (e) {}
  pcScheduleScenarioTask(() => {
    try { pcCompleteBabbageAnalysisProgress(); } catch (e) {}
    pcScheduleScenarioTask(() => {
      showBabbageTerminalReport({
        reportHTML: buildS3BabbageReportHTML(analysis, fallback),
        terminalStateText: fallback ? 'BACKEND FALLBACK ANALYSIS READY' : 'ASSESSMENT COMPARISON COMPLETE',
        engineLabel: fallback ? 'BABBAGE FALLBACK' : 'BABBAGE ENGINE',
        speakerName: 'Professor Pixel',
        onClose: renderS3AuditActivity,
        readLabel: 'Read Analysis',
        printLabel: 'Print / Save PDF',
        continueLabel: 'Audit Babbage',
        ariaLabel: 'Babbage assessment comparison report'
      });
    }, 120, SCENARIO_INDEX.ASSESSMENT);
  }, 120, SCENARIO_INDEX.ASSESSMENT);
  return true;
}

function getS3AuditCards() {
  const analysis = getS3Data().babbageEvidenceAnalysis || S3_LOCAL_BABBAGE_ANALYSIS;
  return [
    { id: 'evidence_link', tag: 'BABBAGE', title: 'The redesigned planning brief provides stronger evidence than the original recall-heavy test.', text: 'The new task requires a recommendation, evidence-based reasoning, and adaptation instead of only definitions and explanation.' },
    { id: 'polish_claim', tag: 'BABBAGE', title: 'A correct recommendation by itself proves the student’s planning reasoning.', text: 'A correct choice can be useful evidence, but the reasoning behind that choice still has to become visible.' },
    { id: 'transfer_claim', tag: 'BABBAGE', title: 'One strong redesigned performance proves broad independent transfer.', text: analysis.claim_about_learning || S3_LOCAL_BABBAGE_ANALYSIS.claim_about_learning }
  ];
}

const S3_AUDIT_KEY = Object.freeze({
  evidence_link: 'supported',
  polish_claim: 'not_supported',
  transfer_claim: 'needs_more'
});

function renderS3AuditActivity() {
  if (scenarioIndex !== SCENARIO_INDEX.ASSESSMENT) return false;
  const boardHTML = buildDragSortBoardHTML({
    rootId: 's3AuditBoard',
    titleId: 's3AuditTitle',
    kicker: 'Babbage Challenge · Human audit',
    title: 'How far does each Babbage claim reach?',
    instruction: 'Sort Babbage’s claims by whether the evidence actually supports them. Confidence is not evidence. Apparently machines also enjoy sounding certain.',
    cards: getS3AuditCards(),
    zones: S3_AUDIT_ZONES,
    statusId: 's3AuditStatus',
    submitId: 's3AuditSubmit',
    submitLabel: 'Challenge the analysis',
    trayLabel: 'Babbage claims',
    feedbackId: 's3AuditFeedback'
  });
  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.ASSESSMENT,
    progressHTML: s3Progress(3),
    contentHTML: boardHTML,
    focusSelector: '#s3AuditBoard [data-pc-drag-card]'
  });
  wireDragBoard({
    rootId: 's3AuditBoard',
    statusId: 's3AuditStatus',
    submitId: 's3AuditSubmit',
    requiredCardIds: getS3AuditCards().map(card => card.id),
    onMove: (placements, detail) => s3TrackDrag('babbage_audit', placements, detail),
    onSubmit: submitS3Audit
  });
  return true;
}

function submitS3Audit() {
  const placements = getDragBoardPlacements('s3AuditBoard');
  const cards = getS3AuditCards();
  if (cards.some(card => !placements[card.id])) return;
  const result = s3MarkSortResults('s3AuditBoard', S3_AUDIT_KEY);
  const data = getS3Data();
  data.attempts += 1;
  data.auditAttempts.push({ placements: { ...placements }, correctCount: result.correct, total: result.total, expected: { ...S3_AUDIT_KEY }, timestamp: new Date().toISOString() });
  const submit = document.getElementById('s3AuditSubmit');
  if (submit) submit.disabled = true;
  renderScenarioFeedback({
    panelId: 's3AuditFeedback',
    tone: result.correct === result.total ? 'strong' : 'developing',
    heading: `${result.correct} of ${result.total} Babbage claims calibrated to the evidence.`,
    text: 'The crucial overreach is transfer. One strong performance supports a meaningful claim, but it does not automatically prove independent performance across substantially new contexts.',
    actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s3-audit-dialogue">Challenge Babbage with Pixel and Maya →</button>'
  });
}

function renderS3RepairActivity() {
  if (scenarioIndex !== SCENARIO_INDEX.ASSESSMENT) return false;
  const data = getS3Data();
  const workbenchHTML = buildDragSlotWorkbenchHTML({
    rootId: 's3RepairWorkbench',
    titleId: 's3RepairTitle',
    kicker: 'Repair · Strengthen the inference',
    title: 'Add the smallest change that produces stronger transfer evidence.',
    instruction: 'Do not rebuild the whole assessment. Repair the specific place where the evidence is weaker than the claim.',
    dimensions: S3_REPAIR_DIMENSION,
    statusId: 's3RepairStatus',
    submitId: 's3RepairSubmit',
    submitLabel: 'Test this repair',
    feedbackId: 's3RepairFeedback'
  });
  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.ASSESSMENT,
    progressHTML: s3Progress(4),
    contentHTML: `
      <section class="pc-design-snapshot" aria-label="Babbage inference to repair">
        <span>Inference gap</span>
        <p>${esc((data.babbageEvidenceAnalysis || S3_LOCAL_BABBAGE_ANALYSIS).claim_about_learning || '')}</p>
      </section>
      ${workbenchHTML}`,
    focusSelector: '#s3RepairWorkbench [data-pc-drag-card]'
  });
  wireDragBoard({
    rootId: 's3RepairWorkbench',
    statusId: 's3RepairStatus',
    submitId: 's3RepairSubmit',
    requiredZoneIds: ['repair'],
    onMove: (placements, detail) => s3TrackDrag('repair', placements, detail),
    onSubmit: submitS3Repair
  });
  return true;
}

function submitS3Repair() {
  const selection = getDragSlotSelections({ rootId: 's3RepairWorkbench', dimensions: S3_REPAIR_DIMENSION }).repair;
  if (!selection) return;
  const option = S3_REPAIR_DIMENSION[0].options.find(item => item.id === selection);
  const strong = Number(option?.score || 0) === 1;
  const data = getS3Data();
  data.attempts += 1;
  data.repairAttempts.push({ selection, strong, timestamp: new Date().toISOString() });

  if (!strong) {
    renderScenarioFeedback({
      panelId: 's3RepairFeedback',
      tone: 'developing',
      heading: 'That changes the task, but not the inference problem.',
      text: selection === 'more_polish'
        ? 'Presentation quality can matter professionally, but more polish does not tell you whether Maya can adapt the planning judgment in a changed context.'
        : 'New numbers inside the same structure may test accuracy again, but the learner can still rely on the same decision pattern. Change a meaningful constraint so adaptation becomes visible.',
      actionsHTML: ''
    });
    return;
  }

  const finalBlueprint = { ...data.blueprintInitial, criteria: 'performance_criteria' };
  const revised = scoreS3Blueprint(finalBlueprint).total;
  data.blueprintFinal = finalBlueprint;
  data.revisedScore = revised;
  data.currentScore = revised;
  data.bestScore = Math.max(Number(data.bestScore || 0), revised);
  data.scoreDelta = revised - Number(data.initialScore || 0);
  data.repairText = option.title;
  data.evidenceStatement = 'The assessment now requires Maya to make a context-bound decision, show the evidence and trade-offs behind it, and adapt that decision when a meaningful condition changes.';
  data.blueprintAttempts.push({ phase: 'revision', selections: { ...finalBlueprint }, score: revised, repair: selection, timestamp: new Date().toISOString() });
  awardScenarioScoreXP(SCENARIO_INDEX.ASSESSMENT, revised, 5);
  const submit = document.getElementById('s3RepairSubmit');
  if (submit) submit.disabled = true;
  lockDragBoard('s3RepairWorkbench');
  renderScenarioFeedback({
    panelId: 's3RepairFeedback',
    tone: 'strong',
    heading: 'Now the transfer claim has evidence behind it.',
    text: 'The changed constraint makes Maya adapt rather than repeat. That is a much stronger basis for claiming she can carry the reasoning into a new version of the problem.',
    actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s3-final-dialogue">Finish the case with Maya →</button>'
  });
}

function buildS3FinalBlueprintHTML(selections = {}) {
  return `
    <div class="pc-evidence-chain">
      ${S3_BLUEPRINT_DIMENSIONS.map(dimension => `
        <div><span>${esc(dimension.label)}</span><strong>${esc(labelS3BlueprintSelection(dimension.id, selections[dimension.id]))}</strong></div>`).join('')}
      <div><span>Transfer check</span><strong>Change a meaningful constraint and require adaptation</strong></div>
    </div>`;
}


let s3TransferLabState = null;

const S3_TRANSFER_PERFORMANCE_OPTIONS = Object.freeze([
  { id: 'know', label: 'Know', text: 'Recall, recognize, identify, or define information.' },
  { id: 'explain', label: 'Explain', text: 'Describe meaning, relationships, or why something matters.' },
  { id: 'apply', label: 'Apply', text: 'Use knowledge in a situation or problem.' },
  { id: 'decide', label: 'Decide & justify', text: 'Make a defensible choice and explain the evidence or trade-offs.' }
]);

const S3_TRANSFER_GAP_OPTIONS = Object.freeze([
  { id: 'performance', label: 'Performance', text: 'Students may not have to do the thing named in the outcome.' },
  { id: 'context', label: 'Context', text: 'The task may not include meaningful conditions, audience, or constraints.' },
  { id: 'evidence', label: 'Observable evidence', text: 'The product may not reveal enough about the intended learning.' },
  { id: 'reasoning', label: 'Reasoning', text: 'Students can complete the task without making their thinking visible.' },
  { id: 'criteria', label: 'Success criteria', text: 'The assessment may reward polish or completion more than the intended performance.' }
]);

const S3_TRANSFER_LOCAL_ANALYSIS = Object.freeze({
  status: 'REDESIGN OPPORTUNITY',
  confidence: 'MODERATE',
  feedback_summary: 'The current assessment can be strengthened by aligning the task more directly with the performance named in the learning outcome.',
  current_evidence: 'The existing task provides some evidence of knowledge or explanation, but it may not make application, judgment, reasoning, or transfer visible enough to support the full outcome.',
  alignment_gap: 'The strongest opportunity is to require students to perform the intended learning in a meaningful context and make the reasoning behind that performance observable.',
  authenticity_opportunity: 'Give students a realistic situation with relevant constraints, require a decision or product, and ask them to justify why their response fits the evidence and context.',
  suggested_revision: 'Use a context-rich task in which students must produce an observable response, justify it with course evidence, consider a meaningful alternative, and adapt when one condition changes.',
  why_stronger_evidence: 'The revision moves the assessment from reproducing information toward observable performance, reasoning, and adaptation.',
  remaining_limitation: 'One assessment still cannot prove every form of transfer. Interpret the evidence within the task and course context.',
  suggested_components: {
    situation: 'Place the learner in a realistic course, professional, community, or disciplinary situation with meaningful constraints.',
    performance: 'Require the learner to make or create the performance named in the learning outcome, not merely describe it.',
    evidence: 'Require a product, decision, demonstration, plan, analysis, or other artifact that makes the performance observable.',
    reasoning: 'Ask the learner to explain the evidence, trade-offs, or rationale behind the response and address at least one alternative.',
    criteria: 'Judge success using alignment to the outcome, quality of evidence and reasoning, and the learner’s ability to respond to a meaningful change in conditions.'
  },
  share_title: 'Authentic assessment redesign',
  share_summary: 'I revised an assessment so students must perform the intended learning in context, make their reasoning visible, and respond to meaningful constraints instead of mainly reproducing information.'
});

function resetS3TransferLabState() {
  s3TransferLabState = {
    input: { context: '', outcome: '', assessment: '', criteria: '' },
    diagnosis: { evidence: [], gap: '' },
    analysis: null,
    analysisSource: '',
    revised: { situation: '', performance: '', evidence: '', reasoning: '', criteria: '' },
    ideaSubmitted: false
  };
  return s3TransferLabState;
}

function getS3TransferLabState() {
  return s3TransferLabState || resetS3TransferLabState();
}

function setS3TransferResearchMetadata(extra = {}) {
  const data = getS3Data();
  const state = getS3TransferLabState();
  data.transferLabMetadata = {
    used: true,
    diagnosisEvidence: [...(state.diagnosis.evidence || [])],
    diagnosisGap: state.diagnosis.gap || '',
    analysisSource: state.analysisSource || '',
    revisionCompleted: Boolean(state.revised && Object.values(state.revised).every(Boolean)),
    ideaSubmitted: Boolean(state.ideaSubmitted),
    ...extra
  };
}

function mountS3TransferLab(contentHTML, focusSelector = '') {
  document.body.classList.remove('s1-result-active', 'pc-shared-result-active');
  return mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.ASSESSMENT,
    progressHTML: s3Progress(5),
    contentHTML,
    focusSelector
  });
}

function renderS3TransferInput({ reset = false } = {}) {
  if (scenarioIndex !== SCENARIO_INDEX.ASSESSMENT) return false;
  const state = reset ? resetS3TransferLabState() : getS3TransferLabState();
  setS3TransferResearchMetadata({ stage: 'input' });
  const html = buildTransferLabInputHTML({
    titleId: 's3TransferInputTitle',
    kicker: 'Transfer Lab · Your assessment',
    title: 'Bring one of your own assessments into the lab.',
    instruction: 'Paste a learning outcome and the assessment students currently complete. Context and success criteria are optional, but they help Babbage make a more grounded comparison.',
    privacyNote: 'Your raw assessment is used for this Transfer Lab analysis and local print report. It is not automatically included in the Ideas Wall submission or the Transfer Lab research checkpoint.',
    fields: [
      { id: 's3TransferContext', label: 'Course or context (optional)', hint: 'Enough context to interpret the task without identifying a student.', rows: 2, maxlength: 700, value: state.input.context, placeholder: 'Example: Introductory psychology, first-year students, online course' },
      { id: 's3TransferOutcome', label: 'Learning outcome', hint: 'What should students be able to do?', rows: 3, maxlength: 1400, value: state.input.outcome, placeholder: 'Paste or describe the learning outcome.' },
      { id: 's3TransferAssessment', label: 'Current assessment', hint: 'What do students currently have to do?', rows: 6, maxlength: 3500, value: state.input.assessment, placeholder: 'Paste the assignment, assessment prompt, or a concise description of it.', fullWidth: true },
      { id: 's3TransferCriteria', label: 'Current success criteria (optional)', hint: 'Rubric criteria, grading priorities, or what currently earns a strong score.', rows: 3, maxlength: 1600, value: state.input.criteria, placeholder: 'What currently counts as successful performance?', fullWidth: true }
    ],
    submitAction: 's3-transfer-diagnose',
    submitLabel: 'Diagnose my assessment →',
    backAction: 's3-transfer-back-result',
    backLabel: 'Skip Transfer Lab · View result',
    feedbackId: 's3TransferInputFeedback'
  });
  return mountS3TransferLab(html, '#s3TransferOutcome');
}

function submitS3TransferInput() {
  const state = getS3TransferLabState();
  const values = {
    context: document.getElementById('s3TransferContext')?.value.trim() || '',
    outcome: document.getElementById('s3TransferOutcome')?.value.trim() || '',
    assessment: document.getElementById('s3TransferAssessment')?.value.trim() || '',
    criteria: document.getElementById('s3TransferCriteria')?.value.trim() || ''
  };
  const feedback = document.getElementById('s3TransferInputFeedback');
  const problems = [];
  if (values.outcome.length < 12) problems.push('Add a little more detail to the learning outcome.');
  if (values.assessment.length < 30) problems.push('Add enough of the current assessment for its required performance to be visible.');
  if (problems.length) {
    if (feedback) { feedback.className = 'pc-transfer-feedback is-error'; feedback.textContent = problems.join(' '); }
    return false;
  }
  state.input = values;
  setS3TransferResearchMetadata({ stage: 'human_diagnosis' });
  return renderS3TransferDiagnosis();
}

function renderS3TransferDiagnosis() {
  const state = getS3TransferLabState();
  const evidenceChecks = S3_TRANSFER_PERFORMANCE_OPTIONS.map(item => `
    <label class="pc-transfer-check"><input type="checkbox" name="s3TransferEvidence" value="${esc(item.id)}"${state.diagnosis.evidence.includes(item.id) ? ' checked' : ''}><span><strong>${esc(item.label)}</strong><small>${esc(item.text)}</small></span></label>`).join('');
  const gapChecks = S3_TRANSFER_GAP_OPTIONS.map(item => `
    <label class="pc-transfer-check"><input type="radio" name="s3TransferGap" value="${esc(item.id)}"${state.diagnosis.gap === item.id ? ' checked' : ''}><span><strong>${esc(item.label)}</strong><small>${esc(item.text)}</small></span></label>`).join('');
  const html = `
    <section class="pc-transfer-lab" aria-labelledby="s3TransferDiagnosisTitle">
      <div class="pc-activity-kicker">Transfer Lab · Human diagnosis first</div>
      <h2 id="s3TransferDiagnosisTitle">What does your current assessment actually make visible?</h2>
      <p class="pc-transfer-intro">Commit to your own judgment before Babbage analyzes the task. Select every kind of performance the assessment currently makes visible, then identify the weakest link you most want to examine.</p>
      <div class="pc-transfer-diagnosis-grid">
        <section class="pc-transfer-diagnosis-group"><h3>Evidence currently visible</h3><p>Select one or more.</p><div class="pc-transfer-check-grid">${evidenceChecks}</div></section>
        <section class="pc-transfer-diagnosis-group"><h3>Weakest link</h3><p>Select the one you most want Babbage to test.</p><div class="pc-transfer-check-grid">${gapChecks}</div></section>
      </div>
      <div id="s3TransferDiagnosisFeedback" class="pc-transfer-feedback" role="status" aria-live="polite"></div>
      <div class="pc-transfer-actions"><button class="pc-button pc-button--secondary" type="button" data-pc-action="s3-transfer-edit-input">Back</button><button class="pc-button pc-button--primary" type="button" data-pc-action="s3-transfer-run-babbage">Ask Babbage to analyze →</button></div>
    </section>`;
  return mountS3TransferLab(html, 'input[name="s3TransferEvidence"]');
}

function submitS3TransferDiagnosis() {
  const state = getS3TransferLabState();
  const evidence = [...document.querySelectorAll('input[name="s3TransferEvidence"]:checked')].map(input => input.value);
  const gap = document.querySelector('input[name="s3TransferGap"]:checked')?.value || '';
  const feedback = document.getElementById('s3TransferDiagnosisFeedback');
  if (!evidence.length || !gap) {
    if (feedback) { feedback.className = 'pc-transfer-feedback is-error'; feedback.textContent = 'Select at least one kind of visible evidence and one weakest link before asking Babbage.'; }
    return false;
  }
  state.diagnosis = { evidence, gap };
  setS3TransferResearchMetadata({ stage: 'babbage_analysis' });
  return runS3TransferBabbageAnalysis();
}

function buildS3TransferSystemPrompt(state) {
  const evidenceLabels = state.diagnosis.evidence.map(id => S3_TRANSFER_PERFORMANCE_OPTIONS.find(item => item.id === id)?.label || id).join(', ');
  const gapLabel = S3_TRANSFER_GAP_OPTIONS.find(item => item.id === state.diagnosis.gap)?.label || state.diagnosis.gap;
  return `You are Babbage, PromptCraft's fictional analysis system. Analyze an educator's own assessment using Scenario 3's authentic-assessment evidence framework. The educator must retain professional judgment; do not present your response as an answer key.

Course/context:
${state.input.context || 'Not supplied'}

Learning outcome:
${state.input.outcome}

Current assessment:
${state.input.assessment}

Current success criteria:
${state.input.criteria || 'Not supplied'}

Educator's diagnosis before AI:
Evidence they believe is visible: ${evidenceLabels}
Weakest link they selected: ${gapLabel}

Analyze what the assessment actually asks students to perform and how well that performance supports the stated learning outcome. Distinguish realistic-looking tasks from tasks that genuinely make application, judgment, reasoning, or adaptation observable. Recommend a stronger assessment without changing the disciplinary purpose or inventing course facts. Provide five concrete revision components: situation, performance, evidence, reasoning, and criteria. Explain one remaining limitation so the educator does not overclaim what a single assessment proves. The share_title and share_summary must describe the design idea in generalized terms and must not reproduce the educator's original assessment text verbatim or include student-identifying information.`;
}

function buildS3TransferReportHTML(analysis, fallback = false) {
  const reportText = [
    'STATUS', analysis.status || 'REDESIGN OPPORTUNITY',
    'CONFIDENCE', analysis.confidence || 'MODERATE',
    'FEEDBACK SUMMARY', analysis.feedback_summary || '',
    'WHAT WORKED', analysis.current_evidence || '',
    'ISSUE DETECTED', analysis.alignment_gap || '',
    'RECOMMENDED REPAIR', analysis.suggested_revision || '',
    'EXPECTED IMPACT', `${analysis.why_stronger_evidence || ''} ${analysis.remaining_limitation || ''}`.trim()
  ].join('\n\n');
  return buildBabbageAnalysisHTML(reportText, fallback, fallback ? 'backend-unavailable' : '');
}

async function runS3TransferBabbageAnalysis() {
  if (scenarioIndex !== SCENARIO_INDEX.ASSESSMENT) return false;
  const state = getS3TransferLabState();
  const runToken = pcCaptureScenarioRun(SCENARIO_INDEX.ASSESSMENT);
  try { pcResetVNCharacters(); } catch (e) {}
  showBabbageConsultOverlay('Your assessment', {
    speakerName: 'Professor Pixel',
    heading: 'Babbage is comparing your outcome with the evidence your assessment can produce.',
    body: 'It will suggest a stronger design, but you will decide what to keep, change, or reject.'
  });
  let analysis = null;
  let fallback = false;
  try {
    const response = await requestBabbageAnalysis({
      analysis_type: 's3_transfer_assessment',
      max_output_tokens: 1900,
      system: buildS3TransferSystemPrompt(state),
      messages: [{ role: 'user', content: 'Analyze this assessment and return the structured Transfer Lab design review.' }]
    }, 's3-transfer-assessment');
    if (!pcIsScenarioRunCurrent(runToken)) return false;
    if (response?.mock || response?.provider === 'local-fallback') throw new Error('Live Babbage unavailable.');
    analysis = response?.analysis || response?.structured || null;
    if (!analysis?.suggested_revision || !analysis?.suggested_components) throw new Error('Incomplete Transfer Lab analysis.');
    state.analysisSource = 'live';
  } catch (error) {
    if (!pcIsScenarioRunCurrent(runToken)) return false;
    console.warn('[PromptCraft] S3 Transfer Lab Babbage unavailable; using local fallback.', error);
    analysis = JSON.parse(JSON.stringify(S3_TRANSFER_LOCAL_ANALYSIS));
    state.analysisSource = 'fallback';
    fallback = true;
  }
  state.analysis = analysis;
  setS3TransferResearchMetadata({ stage: 'revision', analysisSource: state.analysisSource });
  try { pcMarkBabbageResponseParsed(); } catch (e) {}
  pcScheduleScenarioTask(() => {
    try { pcCompleteBabbageAnalysisProgress(); } catch (e) {}
    pcScheduleScenarioTask(() => showBabbageTerminalReport({
      reportHTML: buildS3TransferReportHTML(analysis, fallback),
      terminalStateText: fallback ? 'TRANSFER LAB FALLBACK READY' : 'ASSESSMENT DESIGN REVIEW COMPLETE',
      engineLabel: fallback ? 'BABBAGE FALLBACK' : 'BABBAGE ENGINE',
      speakerName: 'Professor Pixel',
      onClose: renderS3TransferRevision,
      readLabel: 'Read Analysis',
      printLabel: '',
      continueLabel: 'Rebuild My Assessment',
      ariaLabel: 'Babbage Transfer Lab assessment analysis'
    }), 120, SCENARIO_INDEX.ASSESSMENT);
  }, 120, SCENARIO_INDEX.ASSESSMENT);
  return true;
}

function renderS3TransferRevision() {
  const state = getS3TransferLabState();
  const suggested = state.analysis?.suggested_components || S3_TRANSFER_LOCAL_ANALYSIS.suggested_components;
  const current = state.revised || {};
  const dimensions = [
    { id: 's3TransferSituation', key: 'situation', label: 'Situation / Context', hint: 'Where does the performance happen, and what meaningful conditions shape it?', value: current.situation || suggested.situation || '' },
    { id: 's3TransferPerformance', key: 'performance', label: 'Performance', hint: 'What must the learner actually do?', value: current.performance || suggested.performance || '' },
    { id: 's3TransferEvidence', key: 'evidence', label: 'Observable Evidence', hint: 'What product or performance will make the learning visible?', value: current.evidence || suggested.evidence || '' },
    { id: 's3TransferReasoning', key: 'reasoning', label: 'Reasoning', hint: 'What explanation, evidence, trade-off, or decision process must become visible?', value: current.reasoning || suggested.reasoning || '' },
    { id: 's3TransferCriteria', key: 'criteria', label: 'Success Criteria', hint: 'What distinguishes strong evidence from mere completion or polish?', value: current.criteria || suggested.criteria || '' }
  ];
  const html = buildTransferRevisionWorkbenchHTML({
    titleId: 's3TransferRevisionTitle',
    kicker: 'Transfer Lab · Rebuild',
    title: 'Turn Babbage’s suggestions into your assessment.',
    instruction: 'These fields are editable. Keep what fits your course, rewrite what does not, and make the evidence chain yours.',
    dimensions,
    submitAction: 's3-transfer-compare',
    submitLabel: 'Compare original and revised →',
    backAction: 's3-transfer-rediagnose',
    feedbackId: 's3TransferRevisionFeedback'
  });
  return mountS3TransferLab(html, '#s3TransferSituation');
}

function submitS3TransferRevision() {
  const state = getS3TransferLabState();
  const revised = {
    situation: document.getElementById('s3TransferSituation')?.value.trim() || '',
    performance: document.getElementById('s3TransferPerformance')?.value.trim() || '',
    evidence: document.getElementById('s3TransferEvidence')?.value.trim() || '',
    reasoning: document.getElementById('s3TransferReasoning')?.value.trim() || '',
    criteria: document.getElementById('s3TransferCriteria')?.value.trim() || ''
  };
  const missing = Object.entries(revised).filter(([, value]) => value.length < 8).map(([key]) => key);
  const feedback = document.getElementById('s3TransferRevisionFeedback');
  if (missing.length) {
    if (feedback) { feedback.className = 'pc-transfer-feedback is-error'; feedback.textContent = `Add a little more detail to: ${missing.join(', ')}.`; }
    return false;
  }
  state.revised = revised;
  setS3TransferResearchMetadata({ stage: 'comparison', revisionCompleted: true });
  // Derived metadata only. Raw faculty text deliberately stays out of research saves.
  saveIncrementalData(SCENARIO_INDEX.ASSESSMENT);
  return renderS3TransferComparison();
}

function getS3TransferRevisedAssessmentText(state = getS3TransferLabState()) {
  const r = state.revised;
  return `Situation: ${r.situation}\n\nPerformance: ${r.performance}\n\nObservable evidence: ${r.evidence}\n\nReasoning: ${r.reasoning}\n\nSuccess criteria: ${r.criteria}`;
}

function buildS3TransferShareSummary(state = getS3TransferLabState()) {
  const r = state.revised;
  return `I revised an assessment so students work in this kind of situation: ${r.situation} The performance now requires: ${r.performance} Students make their learning visible through: ${r.evidence} Their reasoning becomes visible by: ${r.reasoning} Success is judged using: ${r.criteria}`.replace(/\s+/g, ' ').trim();
}

function renderS3TransferComparison() {
  const state = getS3TransferLabState();
  const analysis = state.analysis || S3_TRANSFER_LOCAL_ANALYSIS;
  const html = buildTransferComparisonHTML({
    titleId: 's3TransferComparisonTitle',
    kicker: 'Transfer Lab · Final analysis',
    title: 'Your assessment now asks for stronger evidence.',
    original: state.input.assessment,
    revised: getS3TransferRevisedAssessmentText(state),
    analysisItems: [
      { label: 'Why the revision is stronger', value: analysis.why_stronger_evidence },
      { label: 'Alignment opportunity', value: analysis.authenticity_opportunity },
      { label: 'Keep this limitation in view', value: analysis.remaining_limitation }
    ],
    actionsHTML: `
      <button class="pc-button pc-button--secondary" type="button" data-pc-action="s3-transfer-edit-revision">Edit Revision</button>
      <button class="pc-button pc-button--secondary" type="button" data-pc-action="s3-transfer-print">Print / Save PDF</button>
      <button class="pc-button pc-button--primary" type="button" data-pc-action="s3-transfer-share">Prepare Ideas Wall Post</button>
      <button class="pc-button pc-button--secondary" type="button" data-pc-action="s3-transfer-back-result">Back to Scenario Result</button>`
  });
  return mountS3TransferLab(html, '[data-pc-action="s3-transfer-print"]');
}

function renderS3TransferShare() {
  const state = getS3TransferLabState();
  const suggestedTitle = state.analysis?.share_title || S3_TRANSFER_LOCAL_ANALYSIS.share_title;
  const summary = buildS3TransferShareSummary(state) || state.analysis?.share_summary || S3_TRANSFER_LOCAL_ANALYSIS.share_summary;
  const html = `
    <section class="pc-transfer-lab" aria-labelledby="s3TransferShareTitle">
      <div class="pc-activity-kicker">Transfer Lab · Ideas Wall</div>
      <h2 id="s3TransferShareTitle">Review exactly what you want to share.</h2>
      <p class="pc-transfer-intro">Your original assessment is not included. Edit this generalized design summary before submitting it for moderation.</p>
      <div class="pc-transfer-share-form">
        <label><span>Idea title</span><input id="s3TransferIdeaTitle" maxlength="120" value="${esc(suggestedTitle)}"></label>
        <label><span>Shareable description</span><textarea id="s3TransferIdeaSummary" maxlength="1800">${esc(summary)}</textarea></label>
        <div class="pc-transfer-share-preview"><strong>Moderation:</strong> this submission enters the existing Ideas Wall queue as <strong>Needs Review</strong>. It will appear publicly only if its status is changed to <strong>Publish</strong>.</div>
      </div>
      <div id="s3TransferShareFeedback" class="pc-transfer-feedback" role="status" aria-live="polite"></div>
      <div class="pc-transfer-actions"><button class="pc-button pc-button--secondary" type="button" data-pc-action="s3-transfer-back-comparison">Back</button><button class="pc-button pc-button--primary" type="button" data-pc-action="s3-transfer-submit-idea">Submit for Ideas Wall review</button></div>
    </section>`;
  return mountS3TransferLab(html, '#s3TransferIdeaTitle');
}

async function submitS3TransferIdea() {
  const state = getS3TransferLabState();
  const title = document.getElementById('s3TransferIdeaTitle')?.value.trim() || '';
  const summary = document.getElementById('s3TransferIdeaSummary')?.value.trim() || '';
  const feedback = document.getElementById('s3TransferShareFeedback');
  const button = document.querySelector('[data-pc-action="s3-transfer-submit-idea"]');
  if (title.length < 4 || summary.length < 120) {
    if (feedback) { feedback.className = 'pc-transfer-feedback is-error'; feedback.textContent = 'Add a clear title and at least 120 characters of shareable description before submitting.'; }
    return false;
  }
  if (SURVEY_MODE !== 'sheets' || !SHEETS_URL || SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    if (feedback) { feedback.className = 'pc-transfer-feedback is-error'; feedback.textContent = 'The Ideas Wall receiver is not configured in this build.'; }
    return false;
  }
  if (button) { button.disabled = true; button.textContent = 'Submitting…'; }
  try {
    const participantId = document.querySelector('input[name="participant_id"]')?.value?.trim() || (playerName !== 'You' ? playerName : 'anonymous');
    const sent = await postToSheets({
      type: 'idea',
      schema_version: PC_APP_SCHEMA_VERSION,
      app_build: PC_APP_BUILD_LABEL,
      timestamp: new Date().toISOString(),
      participant_id: participantId,
      session_id: pcSessionId,
      scenario_index: 3,
      scenario_label: 'S3: Authentic Assessment',
      score: Number(getS3Data().bestScore || getS3Data().revisedScore || 0),
      idea: `${title}\n\n${summary}`,
      candidate_reason: 'Explicit S3 Transfer Lab submission',
      review_status: 'Needs Review',
      research_notes: 'User-reviewed Transfer Lab summary; raw faculty assessment excluded.'
    }, 'Ideas Wall submission');
    if (!sent) throw new Error('Ideas Wall receiver did not accept the submission request.');
    state.ideaSubmitted = true;
    setS3TransferResearchMetadata({ stage: 'shared', ideaSubmitted: true });
    saveIncrementalData(SCENARIO_INDEX.ASSESSMENT);
    if (feedback) { feedback.className = 'pc-transfer-feedback is-success'; feedback.textContent = 'Submitted for moderation. It will appear on the public Ideas Wall only if it is marked Publish.'; }
    if (button) { button.textContent = 'Submitted for review'; }
    return true;
  } catch (error) {
    if (button) { button.disabled = false; button.textContent = 'Submit for Ideas Wall review'; }
    if (feedback) { feedback.className = 'pc-transfer-feedback is-error'; feedback.textContent = 'The Ideas Wall submission could not be sent. Your local Transfer Lab work is still available on this screen.'; }
    return false;
  }
}

function pcPrintS3TransferLabReport() {
  const state = getS3TransferLabState();
  const analysis = state.analysis || S3_TRANSFER_LOCAL_ANALYSIS;
  if (!state.input.assessment || !state.revised.performance) return false;
  const printedAt = new Date().toLocaleString();
  const evidenceLabels = state.diagnosis.evidence.map(id => S3_TRANSFER_PERFORMANCE_OPTIONS.find(item => item.id === id)?.label || id).join(', ');
  const gapLabel = S3_TRANSFER_GAP_OPTIONS.find(item => item.id === state.diagnosis.gap)?.label || state.diagnosis.gap;
  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;
  try { printWindow.opener = null; } catch (e) {}
  let logo = '';
  try { logo = new URL('assets/images/brand/great-falls-college-logo.jpg', window.location.href).href; } catch (e) {}
  const section = (title, content) => content ? `<section><h2>${esc(title)}</h2><div class="box">${esc(content).replace(/\n/g,'<br>')}</div></section>` : '';
  printWindow.document.open();
  printWindow.document.write(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>PromptCraft Assessment Design Analysis</title><style>
    :root{--navy:#112650;--blue:#086c9f;--gold:#e6a51d;--ink:#172236;--muted:#607083;--line:#cad6df}*{box-sizing:border-box}body{margin:0;background:#eef3f7;color:var(--ink);font:14px/1.5 Arial,sans-serif}.toolbar{max-width:900px;margin:14px auto;text-align:right}.toolbar button{padding:10px 16px;border:2px solid var(--gold);border-radius:7px;background:var(--navy);color:#fff;font-weight:800}.sheet{max-width:900px;margin:0 auto 30px;background:#fff;padding:30px 36px;box-shadow:0 12px 36px rgba(8,26,54,.12);border-top:8px solid var(--navy)}header{border-bottom:3px solid var(--gold);padding-bottom:18px}.brand{display:flex;align-items:center;gap:14px}.brand img{width:58px;height:58px;object-fit:contain}.eyebrow{font-size:10px;letter-spacing:.13em;text-transform:uppercase;font-weight:900;color:var(--blue)}h1{margin:5px 0 4px;font:700 32px/1.08 Georgia,serif;color:var(--navy)}.meta{color:var(--muted);font-size:12px}section{margin-top:24px;break-inside:avoid}h2{margin:0 0 8px;padding-bottom:5px;border-bottom:2px solid var(--navy);font:700 19px Georgia,serif;color:var(--navy)}.box{padding:13px 15px;border:1px solid var(--line);background:#f9fbfc}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.finding{padding:12px 14px;border-left:4px solid var(--blue);background:#f4f9fc}.finding strong{display:block;color:var(--navy);margin-bottom:4px}.footer{margin-top:28px;padding-top:12px;border-top:2px solid var(--gold);color:var(--muted);font-size:11px}@media print{body{background:#fff}.toolbar{display:none}.sheet{max-width:none;margin:0;padding:0;box-shadow:none;border-top:0}.grid{gap:9px}@page{margin:.6in}}
  </style></head><body><div class="toolbar"><button onclick="window.print()">Print / Save PDF</button></div><main class="sheet"><header><div class="brand">${logo ? `<img src="${esc(logo)}" alt="">` : ''}<div><div class="eyebrow">PromptCraft · Assessment Designer</div><h1>Assessment Design Analysis</h1><div class="meta">Generated ${esc(printedAt)}</div></div></div></header>
  ${section('Course / context', state.input.context)}${section('Learning outcome', state.input.outcome)}${section('Original assessment', state.input.assessment)}${section('Original success criteria', state.input.criteria)}
  <section><h2>Instructor diagnosis before Babbage</h2><div class="grid"><div class="finding"><strong>Evidence currently visible</strong>${esc(evidenceLabels)}</div><div class="finding"><strong>Weakest link identified</strong>${esc(gapLabel)}</div></div></section>
  <section><h2>Babbage design analysis</h2><div class="grid"><div class="finding"><strong>Current evidence</strong>${esc(analysis.current_evidence || '')}</div><div class="finding"><strong>Alignment gap</strong>${esc(analysis.alignment_gap || '')}</div><div class="finding"><strong>Authenticity opportunity</strong>${esc(analysis.authenticity_opportunity || '')}</div><div class="finding"><strong>Remaining limitation</strong>${esc(analysis.remaining_limitation || '')}</div></div></section>
  ${section('Revised assessment design', getS3TransferRevisedAssessmentText(state))}${section('Why the revision provides stronger evidence', analysis.why_stronger_evidence || '')}
  <div class="footer"><strong>Instructional judgment still matters.</strong> Babbage is a design-analysis aid, not an answer key. Review the revision using your disciplinary context, learners, and assessment requirements.</div></main></body></html>`);
  printWindow.document.close();
  try { printWindow.focus(); } catch (e) {}
  return true;
}

function completeS3CaseAndStartTransfer() {
  if (scenarioIndex !== SCENARIO_INDEX.ASSESSMENT) return false;
  // The fictional case is complete before the educator begins the optional
  // transfer task, so completion/XP should not depend on whether they continue.
  markScenarioComplete();
  saveIncrementalData(SCENARIO_INDEX.ASSESSMENT);
  return renderS3TransferInput({ reset: true });
}

function renderS3FinalResult() {
  if (scenarioIndex !== SCENARIO_INDEX.ASSESSMENT) return false;
  const data = getS3Data();
  const initial = Number(data.initialScore || 0);
  const revised = Number(data.revisedScore || data.currentScore || initial);
  const delta = revised - initial;
  const stress = data.evidenceAttempts[data.evidenceAttempts.length - 1];
  const audit = data.auditAttempts[data.auditAttempts.length - 1];
  const analysis = data.babbageEvidenceAnalysis || S3_LOCAL_BABBAGE_ANALYSIS;

  markScenarioComplete();
  saveIncrementalData(SCENARIO_INDEX.ASSESSMENT);

  pcRenderSharedScenarioResult({
    eyebrow: `Scenario 3 complete · ${revised}/5 assessment indicators`,
    title: 'Assessment Evidence Profile',
    bodyHTML: buildS3FinalBlueprintHTML(data.blueprintFinal || data.blueprintInitial),
    reviewTitle: 'What your evidence now supports',
    reviewItems: [
      { label: 'Original assessment', value: `Maya’s ${S3_MAYA_SCORE} primarily supported knowledge and explanation, not the full performance claim.` },
      { label: 'Assessment design', value: `${revised}/5 evidence-design indicators aligned${delta > 0 ? `, improving by ${delta}` : ''}.` },
      { label: 'Student evidence test', value: stress ? `${stress.correctCount}/${stress.total} evidence judgments aligned.` : '' },
      { label: 'Babbage audit', value: audit ? `${audit.correctCount}/${audit.total} claims calibrated to the available evidence.` : '' },
      { label: 'Defensible claim', value: data.evidenceStatement }
    ],
    referenceTitle: 'Case reference',
    referenceItems: [
      { label: 'Learning outcome', value: S3_LEARNING_OUTCOME },
      { label: 'Babbage claim audited', value: analysis.claim_about_learning || '' },
      { label: 'Final repair', value: data.repairText || '' }
    ],
    controlsTitle: 'Scenario 3 result',
    controlsSub: 'You built the assessment, tested the evidence, challenged Babbage, and repaired the exact inference gap instead of treating a high score as proof of everything.',
    controlsActionsHTML: `
      <button class="continue-btn" type="button" data-pc-action="s3-transfer-start">Apply This to My Assessment</button>
      <button class="s1-secondary-btn" type="button" data-pc-action="s3-replay">Replay Scenario 3</button>
      <button class="s1-secondary-btn" type="button" data-pc-action="open-main-menu" data-pc-panel="scenarios">Scenario Select</button>`
  });
  document.querySelector('#inputContainer button')?.focus();
  return true;
}

pcRegisterUIActions({
  's3-diagnosis-dialogue': () => s3PlayCastSequence('s3_after_diagnosis', renderS3BlueprintActivity),
  's3-blueprint-dialogue': target => s3PlayCastSequence(target.dataset.pcDialogueKey || 's3_blueprint_mixed', renderS3StressTestActivity),
  's3-stress-dialogue': () => s3PlayCastSequence('s3_after_stress_test', runS3BabbageEvidenceAnalysis),
  's3-audit-dialogue': () => s3PlayCastSequence('s3_after_babbage_audit', renderS3RepairActivity),
  's3-final-dialogue': () => s3PlayCastSequence('s3_final_exchange', completeS3CaseAndStartTransfer),
  's3-transfer-start': () => renderS3TransferInput({ reset: true }),
  's3-transfer-diagnose': () => submitS3TransferInput(),
  's3-transfer-edit-input': () => renderS3TransferInput({ reset: false }),
  's3-transfer-run-babbage': () => submitS3TransferDiagnosis(),
  's3-transfer-rediagnose': () => renderS3TransferDiagnosis(),
  's3-transfer-compare': () => submitS3TransferRevision(),
  's3-transfer-edit-revision': () => renderS3TransferRevision(),
  's3-transfer-share': () => renderS3TransferShare(),
  's3-transfer-submit-idea': () => submitS3TransferIdea(),
  's3-transfer-back-comparison': () => renderS3TransferComparison(),
  's3-transfer-print': () => pcPrintS3TransferLabReport(),
  's3-transfer-back-result': () => renderS3FinalResult(),
  's3-replay': () => { resetS3TransferLabState(); return pcActivateScenario(SCENARIO_INDEX.ASSESSMENT, { playIntroduction: true }); }
});
