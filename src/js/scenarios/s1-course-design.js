/* PROMPTCRAFT SCENARIO 1 — THE CONTENT AVALANCHE
   Diagnose → Build a Canvas path → Audit Babbage → Repair and compare. */

const S1_COURSE_PROGRESS_STEPS = ['1 Diagnose', '2 Build path', '3 Audit Babbage', '4 Repair & compare'];

const S1_COURSE_DIAGNOSIS_OPTIONS = [
  { id: 'more_content', tag: 'CONTENT', title: 'The module needs more resources', text: 'Add another reading and video so students have more background before they begin.' },
  { id: 'student_training', tag: 'TRAINING', title: 'Students need more Canvas training', text: 'Send students to general Canvas tutorials before they enter the module.' },
  { id: 'motivation', tag: 'MOTIVATION', title: 'Jordan is not motivated enough', text: 'Add a motivational announcement reminding students to manage their time.' },
  { id: 'pathway', tag: 'PATH', title: 'The learning path is hidden', text: 'The content exists, but the module does not reveal where to start, what is required, or how each item leads to the next.' }
];

const S1_COURSE_PATH_DIMENSIONS = [
  {
    id: 'entry', label: 'Entry point', description: 'How will students know where the week begins?',
    options: [
      { id: 'files_index', tag: 'FILES', title: 'Open the Files index', text: 'Tell students to browse the complete file list and choose the first relevant item.', score: 0 },
      { id: 'latest_announcement', tag: 'NEWS', title: 'Use the latest announcement', text: 'Put the weekly directions in an announcement that will eventually move down the feed.', score: 0 },
      { id: 'module_overview', tag: 'START', title: 'Start Here module overview', text: 'Begin with a stable overview that names the purpose, workload, due point, and first action.', score: 1 }
    ]
  },
  {
    id: 'labels', label: 'Action labels', description: 'What should item names tell students?',
    options: [
      { id: 'original_filenames', tag: 'FILES', title: 'Keep the original filenames', text: 'Leave names such as Unit4_final_v3.pdf and recording_10-12.mp4.', score: 0 },
      { id: 'number_only', tag: 'ORDER', title: 'Use numbers only', text: 'Rename the items 4.1, 4.2, and 4.3 without saying what learners should do.', score: 0 },
      { id: 'action_labels', tag: 'ACTION', title: 'Use verb-first labels', text: 'Name items Read, Watch, Practice, Submit, and Continue so the action and sequence are visible.', score: 1 }
    ]
  },
  {
    id: 'sequence', label: 'Learning sequence', description: 'How should the content support learning?',
    options: [
      { id: 'file_type', tag: 'TYPE', title: 'Group by file type', text: 'Put all readings first, then all videos, and all assignments at the bottom.', score: 0 },
      { id: 'import_order', tag: 'IMPORT', title: 'Keep the import order', text: 'Preserve the order used when the course copy was imported.', score: 0 },
      { id: 'learn_practice_submit', tag: 'PATH', title: 'Learn → Practice → Submit', text: 'Sequence resources around what students need to understand, try, produce, and do next.', score: 1 }
    ]
  },
  {
    id: 'completion', label: 'Completion cue', description: 'How will students know they are finished?',
    options: [
      { id: 'last_file', tag: 'END', title: 'The last file means done', text: 'Assume students will infer that reaching the final resource completes the module.', score: 0 },
      { id: 'gradebook_only', tag: 'GRADE', title: 'Check the gradebook later', text: 'Let a gradebook entry be the only confirmation that required work was submitted.', score: 0 },
      { id: 'submit_and_continue', tag: 'NEXT', title: 'Submit + continue cue', text: 'State the deliverable, success check, due point, and what opens or begins next.', score: 1 }
    ]
  }
];

const S1_COURSE_AUDIT_OPTIONS = [
  { id: 'more_media', tag: 'MEDIA', title: 'It should add another video', text: 'The overview needs one more explanation before students can begin.' },
  { id: 'buried_submission', tag: 'HIDDEN', title: 'The deliverable is still buried', text: 'The order looks cleaner, but students still have to open several items to discover what they must submit, when it is due, and how success will be judged.' },
  { id: 'more_prerequisites', tag: 'LOCKS', title: 'It needs more prerequisites', text: 'Every item should be locked until the previous item is marked complete.' },
  { id: 'longer_overview', tag: 'DETAIL', title: 'The overview needs to be longer', text: 'More explanatory text is the main requirement for a usable module.' }
];

const S1_COURSE_LOCAL_DRAFT = Object.freeze({
  module_title: 'Week 4 · Comparing Community Planning Models',
  proposed_sequence: ['Start Here', 'Read', 'Watch', 'Practice', 'Submit', 'Continue'],
  design_rationale: 'The sequence converts a flat collection of Canvas items into a stable path with verb-first labels and a visible beginning and end.',
  deliberate_weakness: 'buried_submission',
  likely_student_experience: 'I can follow the order now, but I still have to open several pages to find the actual deliverable, the due point, how long it may take, and what counts as successful work.',
  why_weakness_matters: 'A clean sequence reduces search, but the path is still incomplete when the required product, success criteria, workload, and next step are not visible at the decision point.'
});

function getS1CourseData() {
  const data = scenarioData[SCENARIO_INDEX.CONTENT_AVALANCHE];
  if (!Array.isArray(data.diagnosisAttempts)) data.diagnosisAttempts = [];
  if (!Array.isArray(data.pathwayAttempts)) data.pathwayAttempts = [];
  if (!Array.isArray(data.auditAttempts)) data.auditAttempts = [];
  if (!Array.isArray(data.repairAttempts)) data.repairAttempts = [];
  if (!Array.isArray(data.dragEvents)) data.dragEvents = [];
  if (!Array.isArray(data.prompts)) data.prompts = [];
  if (!data.pathwayFinal || typeof data.pathwayFinal !== 'object') data.pathwayFinal = {};
  if (!data.repairParts || typeof data.repairParts !== 'object') data.repairParts = {};
  if (!Number.isFinite(Number(data.currentScore))) data.currentScore = 0;
  if (!Number.isFinite(Number(data.bestScore))) data.bestScore = 0;
  return data;
}

function s1CourseProgress(activeIndex) {
  return buildScenarioProgressHTML({ steps: S1_COURSE_PROGRESS_STEPS, activeIndex, ariaLabel: 'Scenario 1 progress' });
}

function s1CoursePlayCastSequence(key, onDone) {
  const lines = pixelDialogue?.[key];
  if (!Array.isArray(lines) || !lines.length) {
    if (typeof onDone === 'function') onDone();
    return false;
  }
  const cast = getScenarioUI(SCENARIO_INDEX.CONTENT_AVALANCHE)?.introCharacters || [{ id: 'pixel', slot: 'right' }, { id: 'jordan', slot: 'left' }];
  const runToken = pcCaptureScenarioRun(SCENARIO_INDEX.CONTENT_AVALANCHE);
  lines.forEach((line, index) => {
    const isLast = index === lines.length - 1;
    vnShow(line.expr || 'neutral', line.text || '', isLast && onDone ? () => {
      if (pcIsScenarioRunCurrent(runToken)) onDone();
    } : null, {
      speaker: line.speaker || (line.character === 'jordan' ? 'Jordan' : 'Professor Pixel'),
      character: line.character || 'pixel', cast: line.cast || cast, id: line.id || ''
    });
  });
  return true;
}

function renderS1CourseDesignStandby(container) {
  mountScenarioActivity({
    container, scenarioIndex: SCENARIO_INDEX.CONTENT_AVALANCHE,
    contentHTML: `<section class="pc-activity-card pc-activity-standby" aria-live="polite"><div class="pc-activity-kicker">Case file loading</div><h2>The Content Avalanche</h2><p>Pixel and Jordan will introduce a familiar Canvas problem: plenty of content, but no visible route through it.</p></section>`
  });
}

function buildS1CourseCanvasPreviewHTML({ improved = false } = {}) {
  const items = improved
    ? [['START HERE', 'Start Here · Purpose, workload, due point'], ['READ', 'Read · Compare the two planning models'], ['WATCH', 'Watch · See the models applied'], ['PRACTICE', 'Practice · Check your comparison'], ['SUBMIT', 'Submit · 400-word comparison + evidence'], ['CONTINUE', 'Continue · Preview Week 5']]
    : [['PDF', 'Unit4_final_v3.pdf'], ['PAGE', 'Week 4 Notes'], ['MP4', 'recording_10-12.mp4'], ['PDF', 'ModelB_reading_NEW.pdf'], ['QUIZ', 'Quiz 4'], ['ASSIGN', 'Comparison']];
  return `<section class="pc-canvas-preview${improved ? ' is-improved' : ''}" aria-label="${improved ? 'Revised' : 'Original'} Canvas module preview"><header><span>Canvas · Modules</span><strong>Week 4</strong></header><div class="pc-canvas-preview-list">${items.map(([tag, title]) => `<div class="pc-canvas-preview-item"><span>${esc(tag)}</span><p>${esc(title)}</p><b aria-hidden="true">›</b></div>`).join('')}</div></section>`;
}

function buildS1CourseCaseBriefHTML({ compact = false } = {}) {
  return `<section class="pc-s1-course-case${compact ? ' is-compact' : ''}" aria-label="Content Avalanche case brief">${buildS1CourseCanvasPreviewHTML()}<div class="pc-s1-course-brief-copy"><div><span>Student report</span><p>“I can see all the files. I just cannot tell which one starts the week or what I am supposed to do with them.”</p></div><div><span>Professor assumption</span><p>Everything students need is already published in Canvas.</p></div><div><span>Your mission</span><p>Make the learning path visible without deleting useful course content.</p></div><div><span>How to succeed</span><p>Choose one answer per decision, then audit whether Babbage solves the student problem rather than only tidying the page.</p></div></div></section>`;
}

function renderS1CourseDiagnosisActivity() {
  if (scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) return false;
  const choicesHTML = buildScenarioChoiceCardsHTML({ items: S1_COURSE_DIAGNOSIS_OPTIONS, inputName: 's1-course-diagnosis', idPrefix: 's1-course-diagnosis', variant: 'detail', marker: () => '' });
  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.CONTENT_AVALANCHE, progressHTML: s1CourseProgress(0),
    contentHTML: `${buildS1CourseCaseBriefHTML()}${buildScenarioTaskCardHTML({ titleId: 's1CourseDiagnosisTitle', kicker: 'Decision 1 · Diagnose', title: 'What is the actual design failure?', instruction: 'Choose the explanation that best fits Jordan’s evidence. Do not solve a content problem that the case does not have.', choiceGridId: 's1CourseDiagnosisChoices', choicesHTML, statusId: 's1CourseDiagnosisStatus', submitId: 's1CourseDiagnosisSubmit', submitLabel: 'Test this diagnosis', feedbackId: 's1CourseDiagnosisFeedback', gridClass: 'pc-choice-grid--radio-marker' })}`,
    focusSelector: 'input[name="s1-course-diagnosis"]'
  });
  wireExactSelection({ rootId: 's1CourseDiagnosisChoices', inputName: 's1-course-diagnosis', limit: 1, statusId: 's1CourseDiagnosisStatus', submitId: 's1CourseDiagnosisSubmit', onSubmit: submitS1CourseDiagnosis });
  return true;
}

function submitS1CourseDiagnosis() {
  const selection = getCheckedValues('s1-course-diagnosis');
  if (selection.length !== 1) return;
  const selected = selection[0];
  const exact = selected === 'pathway';
  const data = getS1CourseData();
  data.attempts += 1;
  data.diagnosisAttempts.push({ selection: selected, exact, timestamp: new Date().toISOString() });
  data.diagnosisFinal = selected;
  data.prompts.push(`S1 diagnosis: ${selected}`);
  disableScenarioChoices('s1-course-diagnosis', 's1CourseDiagnosisSubmit');
  renderScenarioFeedback({ panelId: 's1CourseDiagnosisFeedback', tone: exact ? 'strong' : 'developing', heading: exact ? 'You diagnosed the path, not the student.' : 'That response treats a symptom, not Jordan’s evidence.', text: exact ? 'Jordan is not reporting missing content. He is reporting hidden sequence, requirements, and completion cues. The course has information architecture, but not yet a student-visible learning path.' : 'The course already contains plenty of material. Adding resources, generic training, or motivation does not tell Jordan where to begin, what is required, or how to know he is finished.', actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s1-course-after-diagnosis">Build the student path →</button>' });
}

function s1CourseTrackDrag(placements, detail = {}) {
  getS1CourseData().dragEvents.push({ phase: 'pathway', placements: { ...placements }, ...detail, timestamp: new Date().toISOString() });
}

function scoreS1CoursePath(selections = {}) {
  const byDimension = Object.fromEntries(S1_COURSE_PATH_DIMENSIONS.map(dimension => {
    const choice = dimension.options.find(option => option.id === selections[dimension.id]);
    return [dimension.id, Number(choice?.score || 0)];
  }));
  return { byDimension, total: Object.values(byDimension).reduce((sum, value) => sum + value, 0) };
}

function summarizeS1CoursePath(selections = {}) {
  return S1_COURSE_PATH_DIMENSIONS.map(dimension => {
    const choice = dimension.options.find(option => option.id === selections[dimension.id]);
    return `${dimension.label}: ${choice?.title || 'Not selected'}`;
  }).join(' | ');
}

function renderS1CoursePathwayActivity() {
  if (scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) return false;
  const workbenchHTML = buildDragSlotWorkbenchHTML({
    rootId: 's1CoursePathWorkbench',
    titleId: 's1CoursePathTitle',
    kicker: 'Decision 2 · Build the path',
    title: 'Turn the file collection into a route a student can follow.',
    instruction: 'Drag one choice into each slot. Aim for a stable entry point, action-oriented labels, a learning sequence, and an explicit completion cue.',
    dimensions: S1_COURSE_PATH_DIMENSIONS,
    statusId: 's1CoursePathStatus',
    submitId: 's1CoursePathSubmit',
    submitLabel: 'Test the student path',
    feedbackId: 's1CoursePathFeedback',
    initialSelections: getS1CourseData().pathwayFinal
  });
  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.CONTENT_AVALANCHE,
    progressHTML: s1CourseProgress(1),
    contentHTML: `${buildS1CourseCaseBriefHTML({ compact: true })}${workbenchHTML}`,
    focusSelector: '#s1CoursePathWorkbench [data-pc-drag-card]'
  });
  wireDragBoard({
    rootId: 's1CoursePathWorkbench', statusId: 's1CoursePathStatus', submitId: 's1CoursePathSubmit',
    requiredZoneIds: S1_COURSE_PATH_DIMENSIONS.map(dimension => dimension.id),
    onMove: (placements, detail) => s1CourseTrackDrag(placements, detail),
    onSubmit: submitS1CoursePath
  });
  return true;
}

function submitS1CoursePath() {
  const selections = getDragSlotSelections({ rootId: 's1CoursePathWorkbench', dimensions: S1_COURSE_PATH_DIMENSIONS });
  if (S1_COURSE_PATH_DIMENSIONS.some(dimension => !selections[dimension.id])) return;
  const pathScore = scoreS1CoursePath(selections);
  const data = getS1CourseData();
  const diagnosisPoint = data.diagnosisFinal === 'pathway' ? 1 : 0;
  const total = pathScore.total + diagnosisPoint;
  data.attempts += 1;
  data.pathwayAttempts.push({ selections: { ...selections }, score: pathScore.total, timestamp: new Date().toISOString() });
  data.pathwayFinal = { ...selections };
  data.initialScore = total;
  data.currentScore = total;
  data.bestScore = Math.max(Number(data.bestScore || 0), total);
  data.prompts.push(`S1 pathway: ${summarizeS1CoursePath(selections)}`);
  awardScenarioScoreXP(SCENARIO_INDEX.CONTENT_AVALANCHE, total, 5);
  lockDragBoard('s1CoursePathWorkbench');
  const submit = document.getElementById('s1CoursePathSubmit');
  if (submit) submit.disabled = true;
  renderScenarioFeedback({
    panelId: 's1CoursePathFeedback',
    tone: pathScore.total >= 3 ? 'strong' : 'developing',
    heading: `${pathScore.total} of 4 path signals are visible.`,
    text: pathScore.total >= 3
      ? 'Jordan can now see a much clearer route. The next question is whether an AI-generated module overview makes every important expectation visible at the moment he needs it.'
      : 'The module is more orderly, but one or more decisions still ask Jordan to infer the beginning, action, sequence, or ending. Babbage will draft from your choices so you can audit what remains hidden.',
    actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s1-course-run-babbage">Ask Babbage to draft the module →</button>'
  });
}

function buildS1CourseBabbageSystemPrompt(data) {
  return `You are Babbage, PromptCraft's fictional Canvas course-design engine. The faculty learner must audit your work rather than accept it as an answer key.

Jordan can see every published file in Week 4 but cannot tell where to begin, what is required, how long the work will take, what to submit, or what happens next.

Faculty pathway choices:
${summarizeS1CoursePath(data.pathwayFinal)}

Draft a concise Canvas module title and a six-step proposed_sequence using verb-first labels. Explain the design rationale and likely student experience. Keep one realistic human-audit problem: make the sequence look organized while leaving the precise deliverable, due point, workload estimate, and success criteria buried inside later items. Set deliberate_weakness to buried_submission. Do not reveal that the weakness was instructed or deliberate in visible prose.`;
}

function buildS1CourseBabbageReportHTML(draft = S1_COURSE_LOCAL_DRAFT, fallback = false) {
  const sequence = Array.isArray(draft.proposed_sequence) ? draft.proposed_sequence.join(' → ') : '';
  const standardReportText = [
    'STATUS', 'MODULE PATH DRAFTED',
    'CONFIDENCE', fallback ? 'DEMONSTRATION FALLBACK' : 'HIGH',
    'FEEDBACK SUMMARY', `${draft.module_title}. ${draft.design_rationale}`,
    'WHAT WORKED', `Proposed route: ${sequence}`,
    'ISSUE DETECTED', 'The student path still requires a human audit from the student point of view.',
    'RECOMMENDED REPAIR', 'Inspect whether the overview reveals the required deliverable, due point, workload, success criteria, and next action.',
    'EXPECTED IMPACT', draft.likely_student_experience
  ].join('\n\n');
  return buildBabbageAnalysisHTML(standardReportText, fallback, fallback ? 'backend-unavailable' : '');
}

async function generateS1CourseBabbageDraft() {
  if (scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) return false;
  const runToken = pcCaptureScenarioRun(SCENARIO_INDEX.CONTENT_AVALANCHE);
  const data = getS1CourseData();
  try { pcResetVNCharacters(); } catch (error) {}
  showBabbageConsultOverlay('Canvas module design', {
    speakerName: 'Professor Pixel',
    heading: 'Babbage is turning your choices into a Canvas module path.',
    body: 'The draft may be polished. Your job is to decide whether it actually resolves Jordan’s problem.'
  });

  let draft = null;
  let fallback = false;
  try {
    const response = await requestBabbageAnalysis({
      analysis_type: 'course_design_draft',
      max_output_tokens: 1800,
      system: buildS1CourseBabbageSystemPrompt(data),
      messages: [{ role: 'user', content: 'Draft the Canvas module path for the faculty learner to audit.' }]
    }, 'course-design-draft');
    if (!pcIsScenarioRunCurrent(runToken)) return false;
    if (response?.mock || response?.provider === 'local-fallback') throw new Error('Live Babbage unavailable.');
    draft = response?.analysis || response?.structured || null;
    if (!draft?.module_title || !Array.isArray(draft?.proposed_sequence)) throw new Error('Incomplete course-design draft.');
    draft.deliberate_weakness = 'buried_submission';
    data.aiProvider = response.provider || '';
    data.aiModel = response.model || '';
    data.aiRequestId = response.request_id || '';
    data.aiElapsedMs = response.elapsed_ms ?? '';
    data.aiUsage = response.usage || null;
    data.courseDraftSource = 'live';
  } catch (error) {
    if (!pcIsScenarioRunCurrent(runToken)) return false;
    console.warn('[PromptCraft] Course-design draft unavailable; using labeled local fallback.', error);
    draft = { ...S1_COURSE_LOCAL_DRAFT, proposed_sequence: [...S1_COURSE_LOCAL_DRAFT.proposed_sequence] };
    data.aiProvider = 'local-fallback';
    data.aiModel = 'promptcraft-local-fallback';
    data.courseDraftSource = 'fallback';
    fallback = true;
  }
  data.babbageDraft = draft;
  data.structuredAnalysis = { course_design_draft: draft };
  data.finalResponse = `${draft.module_title}\n${draft.proposed_sequence.join(' → ')}`;
  try { pcMarkBabbageResponseParsed(); } catch (error) {}
  try { pcCompleteBabbageAnalysisProgress(); } catch (error) {}
  pcScheduleScenarioTask(() => showBabbageTerminalReport({
    reportHTML: buildS1CourseBabbageReportHTML(draft, fallback),
    terminalStateText: fallback ? 'BACKEND FALLBACK MODULE DRAFT READY' : 'CANVAS MODULE DRAFT COMPLETE',
    engineLabel: fallback ? 'BABBAGE FALLBACK' : 'BABBAGE ENGINE',
    speakerName: 'Professor Pixel',
    onClose: renderS1CourseAuditActivity,
    readLabel: 'Read Analysis', printLabel: 'Print / Save PDF', continueLabel: 'Audit Babbage',
    ariaLabel: 'Babbage Canvas module design report'
  }), 140, SCENARIO_INDEX.CONTENT_AVALANCHE);
  return true;
}

function renderS1CourseAuditActivity() {
  if (scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) return false;
  const data = getS1CourseData();
  const draft = data.babbageDraft || S1_COURSE_LOCAL_DRAFT;
  const choicesHTML = buildScenarioChoiceCardsHTML({
    items: S1_COURSE_AUDIT_OPTIONS,
    inputName: 's1-course-audit',
    idPrefix: 's1-course-audit',
    variant: 'detail',
    marker: () => ''
  });
  const sequence = Array.isArray(draft.proposed_sequence) ? draft.proposed_sequence : S1_COURSE_LOCAL_DRAFT.proposed_sequence;
  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.CONTENT_AVALANCHE,
    progressHTML: s1CourseProgress(2),
    contentHTML: `
      <div class="pc-s1-course-audit-layout">
        <aside class="pc-s1-course-babbage-draft" aria-label="Babbage Canvas module draft">
          <div class="pc-activity-kicker">Babbage draft</div>
          <h2>${esc(draft.module_title)}</h2>
          <div class="pc-s1-course-sequence">${sequence.map((item, index) => `<div><span>${index + 1}</span><strong>${esc(item)}</strong></div>`).join('')}</div>
          <div class="pc-s1-course-draft-rationale"><span>Design rationale</span><p>${esc(draft.design_rationale)}</p></div>
          <blockquote><span>Jordan after the draft</span>“${esc(draft.likely_student_experience)}”</blockquote>
        </aside>
        ${buildScenarioTaskCardHTML({
          titleId: 's1CourseAuditTitle', kicker: 'Decision 3 · Audit the machine',
          title: 'What important problem does the polished draft still leave unresolved?',
          instruction: 'Use Jordan’s likely experience as evidence. Choose the weakness that matters most for navigating and completing the module.',
          choiceGridId: 's1CourseAuditChoices', choicesHTML,
          statusId: 's1CourseAuditStatus', submitId: 's1CourseAuditSubmit', submitLabel: 'Audit the draft',
          feedbackId: 's1CourseAuditFeedback', gridClass: 'pc-choice-grid--radio-marker', includeFeedback: false
        })}
      </div>
      <div class="pc-s1-course-audit-feedback" id="s1CourseAuditFeedback" aria-live="polite"></div>`,
    focusSelector: 'input[name="s1-course-audit"]'
  });
  wireExactSelection({
    rootId: 's1CourseAuditChoices', inputName: 's1-course-audit', limit: 1,
    statusId: 's1CourseAuditStatus', submitId: 's1CourseAuditSubmit', onSubmit: submitS1CourseAudit
  });
  return true;
}

function submitS1CourseAudit() {
  const selection = getCheckedValues('s1-course-audit');
  if (selection.length !== 1) return;
  const selected = selection[0];
  const data = getS1CourseData();
  const draft = data.babbageDraft || S1_COURSE_LOCAL_DRAFT;
  const weakness = draft.deliberate_weakness || 'buried_submission';
  const exact = selected === weakness;
  data.attempts += 1;
  data.auditAttempts.push({ selection: selected, exact, weakness, timestamp: new Date().toISOString() });
  data.auditFinal = selected;
  data.prompts.push(`S1 Babbage audit: ${selected}`);
  disableScenarioChoices('s1-course-audit', 's1CourseAuditSubmit');
  renderScenarioFeedback({
    panelId: 's1CourseAuditFeedback',
    tone: exact ? 'strong' : 'developing',
    heading: exact ? 'You caught the difference between order and guidance.' : 'That could help, but it is not the hidden failure.',
    text: exact
      ? draft.why_weakness_matters
      : `The sequence is cleaner, but Jordan still has to hunt for the deliverable, due point, workload, and success criteria. ${draft.why_weakness_matters}`,
    actionsHTML: '<button class="pc-button pc-button--primary" type="button" data-pc-action="s1-course-after-audit">Repair the student-facing overview →</button>'
  });
}

function s1CourseRepairFields() {
  return [
    { id: 's1CourseRepairPurpose', key: 'purpose', number: '1', label: 'Purpose and outcome', placeholder: 'What is this week for, and what should students be able to do by the end?', ariaLabel: 'Describe the module purpose and learning outcome' },
    { id: 's1CourseRepairSequence', key: 'sequence', number: '2', label: 'Required sequence and workload', placeholder: 'Name the required actions in order and give students a realistic workload estimate.', ariaLabel: 'Describe the required sequence and workload' },
    { id: 's1CourseRepairSubmit', key: 'submission', number: '3', label: 'Submission and success', placeholder: 'State exactly what students submit, when it is due, and what a successful response must show.', ariaLabel: 'Describe the required submission and success criteria' },
    { id: 's1CourseRepairNext', key: 'next', number: '4', label: 'Completion, next step, and help', placeholder: 'Explain how students know they are finished, what happens next, and where to get help.', ariaLabel: 'Describe completion, next step, and help' }
  ];
}

function s1CourseRepairPartsFromValues(values = {}) {
  return {
    purpose: values.s1CourseRepairPurpose || '',
    sequence: values.s1CourseRepairSequence || '',
    submission: values.s1CourseRepairSubmit || '',
    next: values.s1CourseRepairNext || ''
  };
}

function buildS1CourseRepairedOverview(parts = {}) {
  if (!Object.values(parts).some(Boolean)) return '';
  return [
    'WEEK 4 · COMPARING COMMUNITY PLANNING MODELS',
    parts.purpose ? `Purpose and outcome: ${parts.purpose}` : '',
    parts.sequence ? `Required path and workload: ${parts.sequence}` : '',
    parts.submission ? `Submit and succeed: ${parts.submission}` : '',
    parts.next ? `Finish, continue, and get help: ${parts.next}` : ''
  ].filter(Boolean).join('\n\n');
}

function renderS1CourseRepairActivity() {
  if (scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) return false;
  const data = getS1CourseData();
  const draft = data.babbageDraft || S1_COURSE_LOCAL_DRAFT;
  const fields = s1CourseRepairFields();
  const referenceHTML = `
    <div class="pc-activity-kicker">Original Babbage draft</div>
    <h2 class="pc-guided-repair-reference-title">${esc(draft.module_title)}</h2>
    <div class="pc-s1-course-sequence pc-s1-course-sequence--compact">${draft.proposed_sequence.map((item, index) => `<div><span>${index + 1}</span><strong>${esc(item)}</strong></div>`).join('')}</div>
    <div class="pc-guided-repair-problem"><div class="pc-guided-repair-problem-label">What your audit found</div><strong>The deliverable is still buried</strong><p>${esc(draft.why_weakness_matters)}</p></div>
    <div class="pc-guided-repair-ingredients" aria-label="Repair ingredients"><div class="pc-guided-repair-ingredients-heading">Student-visible signals</div><div class="pc-guided-repair-chip-row"><span class="pc-guided-repair-chip" data-pc-course-chip="purpose">Purpose</span><span class="pc-guided-repair-chip" data-pc-course-chip="sequence">Path</span><span class="pc-guided-repair-chip" data-pc-course-chip="submission">Submit</span><span class="pc-guided-repair-chip" data-pc-course-chip="next">Next</span></div></div>`;
  mountScenarioActivity({
    scenarioIndex: SCENARIO_INDEX.CONTENT_AVALANCHE,
    progressHTML: s1CourseProgress(3),
    contentHTML: buildGuidedRepairWorkspaceHTML({
      referenceHTML, titleId: 's1CourseRepairTitle', kicker: 'Decision 4 · Repair and compare',
      title: 'Write the overview Jordan needed before he opened the first file.',
      instruction: 'Make the path actionable at the decision point. Each field must give the student information they should not have to hunt for.',
      fields, previewLabel: 'Student-facing Canvas module overview', previewId: 's1CourseRepairPreview', previewFullWidth: true,
      nudgeId: 's1CourseRepairNudge', statusId: 's1CourseRepairStatus', submitId: 's1CourseRepairSubmitButton',
      submitLabel: 'Compare the student experience', feedbackId: 's1CourseRepairFeedback'
    }),
    focusSelector: '#s1CourseRepairPurpose'
  });
  const fieldIds = fields.map(field => field.id);
  wireGuidedRepairWorkspace({
    fieldIds, previewId: 's1CourseRepairPreview', nudgeId: 's1CourseRepairNudge', statusId: 's1CourseRepairStatus', submitId: 's1CourseRepairSubmitButton', minLength: 12,
    buildPreview: values => buildS1CourseRepairedOverview(s1CourseRepairPartsFromValues(values)),
    onUpdate: (values, assembled) => {
      const parts = s1CourseRepairPartsFromValues(values);
      data.repairDraftParts = parts;
      data.repairDraftText = assembled;
      Object.entries(parts).forEach(([key, value]) => document.querySelector(`[data-pc-course-chip="${key}"]`)?.classList.toggle('covered', value.length >= 12));
    },
    onSubmit: submitS1CourseRepair
  });
  return true;
}

function scoreS1CourseRepair(parts = {}) {
  const checks = {
    purpose: parts.purpose.length >= 12 && /learn|compare|analy|explain|apply|purpose|able/i.test(parts.purpose),
    sequence: parts.sequence.length >= 12 && /read|watch|practice|first|then|order|minute|hour|workload/i.test(parts.sequence),
    submission: parts.submission.length >= 12 && /submit|upload|post|due|criteria|evidence|successful|show/i.test(parts.submission),
    next: parts.next.length >= 12 && /next|complete|finish|help|question|continue|contact/i.test(parts.next)
  };
  return { checks, total: Object.values(checks).filter(Boolean).length };
}

function submitS1CourseRepair() {
  const fields = s1CourseRepairFields();
  const values = getGuidedRepairValues(fields.map(field => field.id));
  if (fields.some(field => (values[field.id] || '').length < 12)) return;
  const parts = s1CourseRepairPartsFromValues(values);
  const overview = buildS1CourseRepairedOverview(parts);
  const repairScore = scoreS1CourseRepair(parts);
  const data = getS1CourseData();
  const auditPoint = data.auditFinal === 'buried_submission' ? 1 : 0;
  const total = repairScore.total + auditPoint;
  data.attempts += 1;
  data.repairAttempts.push({ parts: { ...parts }, text: overview, score: repairScore.total, timestamp: new Date().toISOString() });
  data.repairParts = { ...parts };
  data.repairText = overview;
  data.revisedScore = total;
  data.currentScore = total;
  data.bestScore = Math.max(Number(data.bestScore || 0), total);
  data.scoreDelta = total - Number(data.initialScore || 0);
  data.finalResponse = overview;
  data.oscqrLit = 'Canvas module structure; student navigation; explicit directions; workload and completion cues';
  awardScenarioScoreXP(SCENARIO_INDEX.CONTENT_AVALANCHE, total, 5);
  s1CoursePlayCastSequence('s1_course_final_exchange', renderS1CourseFinalComparison);
}

function renderS1CourseFinalComparison() {
  if (scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) return false;
  const data = getS1CourseData();
  const draft = data.babbageDraft || S1_COURSE_LOCAL_DRAFT;
  markScenarioComplete();
  saveIncrementalData(SCENARIO_INDEX.CONTENT_AVALANCHE);
  pcRenderSharedScenarioResult({
    eyebrow: `Scenario 1 complete · ${data.bestScore || 0}/5 path signals`,
    title: 'The content stayed. The student path became visible.',
    bodyHTML: `<div class="pc-s1-course-final-overview">${fmt(data.repairText || '')}</div>`,
    reviewTitle: 'What changed in the Canvas design',
    reviewItems: [
      { label: 'Stable entry point', value: 'Students begin from a persistent module overview rather than a moving announcement or a raw Files list.' },
      { label: 'Visible action and sequence', value: 'Verb-first labels show what to do, while the module order follows learning rather than file type or import history.' },
      { label: 'Completion without hunting', value: 'The deliverable, due point, success criteria, workload, next step, and source of help are visible before students commit to the path.' }
    ],
    referenceTitle: 'Jordan before and after',
    referenceItems: [
      { label: 'Before', value: 'I can see all the files, but I do not know which one starts the week or what I am supposed to do with them.' },
      { label: 'After the AI draft', value: draft.likely_student_experience },
      { label: 'After your repair', value: 'I know why this week matters, what to do in order, what I have to submit, how to judge my work, and where I go next.' }
    ],
    controlsTitle: 'Scenario 1 result',
    controlsSub: 'AI helped organize the content; your student-view audit made the organization usable.',
    controlsActionsHTML: `<button class="s1-secondary-btn" type="button" data-pc-action="s1-course-repair">Revise S1</button><button class="continue-btn" type="button" data-pc-action="navigate-next" data-pc-scenario-index="1">Next scenario →</button>`
  });
  document.querySelector('#inputContainer button')?.focus();
  return true;
}

function pcPrimeS1CourseRepairDev() {
  pcActivateScenario(SCENARIO_INDEX.CONTENT_AVALANCHE, { playIntroduction: false });
  const data = getS1CourseData();
  data.diagnosisFinal = 'pathway';
  data.pathwayFinal = { entry: 'module_overview', labels: 'action_labels', sequence: 'learn_practice_submit', completion: 'submit_and_continue' };
  data.babbageDraft = { ...S1_COURSE_LOCAL_DRAFT, proposed_sequence: [...S1_COURSE_LOCAL_DRAFT.proposed_sequence] };
  data.auditFinal = 'buried_submission';
  pcScheduleScenarioTask(() => {
    renderS1CourseRepairActivity();
    const values = {
      s1CourseRepairPurpose: 'Compare two community planning models and explain which is more useful for a local planning decision.',
      s1CourseRepairSequence: 'Read the model guide, watch the example, practice with the check, then submit. Plan for about 90 minutes.',
      s1CourseRepairSubmit: 'Submit a 400-word comparison by Sunday at 11:59 PM using evidence from both models and the success checklist.',
      s1CourseRepairNext: 'You are finished when Canvas confirms submission; continue to the Week 5 preview or use the course Q&A for help.'
    };
    Object.entries(values).forEach(([id, value]) => {
      const field = document.getElementById(id);
      if (!field) return;
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }, 100, SCENARIO_INDEX.CONTENT_AVALANCHE);
}

pcRegisterUIActions({
  's1-course-after-diagnosis': () => s1CoursePlayCastSequence('s1_course_after_diagnosis', renderS1CoursePathwayActivity),
  's1-course-run-babbage': () => generateS1CourseBabbageDraft(),
  's1-course-after-audit': () => s1CoursePlayCastSequence('s1_course_after_audit', renderS1CourseRepairActivity),
  's1-course-repair': () => renderS1CourseRepairActivity()
});

pcExposeGlobals({
  renderS1CourseDesignStandby,
  renderS1CourseDiagnosisActivity,
  renderS1CoursePathwayActivity,
  renderS1CourseAuditActivity,
  renderS1CourseRepairActivity,
  renderS1CourseFinalComparison,
  pcPrimeS1CourseRepairDev
});
