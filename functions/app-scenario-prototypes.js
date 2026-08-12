/* PROMPTCRAFT DEVELOPMENT SCENARIOS
   Current S2-S5 prototypes. These are preserved as development material,
   not treated as approved final scenario designs. */

// ══════════════════════════════════════════════════════
//  SCENARIO 2 — METACOGNITION DETECTIVE OPENING
//  Vertical slice implemented with the shared activity component system.
// ══════════════════════════════════════════════════════
const S2_PROGRESS_STEPS = ['1 Diagnose', '2 Intervene', '3 Observe', '4 Audit Babbage', '5 Repair & compare'];

const S2_DIAGNOSIS_OPTIONS = [
  { id: 'performance', tag: 'RESULT', title: 'Performance problem', text: 'Jordan’s grade shows he has not mastered the material well enough.' },
  { id: 'strategy', tag: 'STRATEGY', title: 'Strategy problem', text: 'Jordan needs to replace rereading with a better study strategy.' },
  { id: 'metacognitive', tag: 'PROCESS', title: 'Metacognitive problem', text: 'Jordan cannot connect a learning strategy to evidence that it helped, then use that evidence to decide what to do next.' },
  { id: 'motivation', tag: 'EFFORT', title: 'Motivation problem', text: 'Jordan needs stronger incentives or encouragement to engage with the material.' }
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
    kicker: 'Decision 1 · Diagnose the case',
    title: 'What is the instructional problem?',
    instruction: 'Review Jordan’s result, strategy, and next move. What problem would you address first?',
    variant: 'detail',
    marker: item => item.tag,
    limit: 1,
    choiceGridId: 's2DiagnosisChoices',
    statusId: 's2DiagnosisStatus',
    submitId: 's2DiagnosisSubmit',
    submitLabel: 'Submit diagnosis',
    feedbackId: 's2DiagnosisFeedback',
    activeIndex: 0,
    focusSelector: 'input[name="s2-diagnosis"]',
    onSubmit: submitS2Diagnosis,
    wrapContent: taskHTML => `<section class="s2-case-file" aria-labelledby="s2CaseFileTitle"><header class="s2-case-file-header"><div class="pc-activity-kicker">Case File 02 · Jordan</div><h1 id="s2CaseFileTitle">The Confident Student Problem</h1><p>Review the evidence from Jordan’s learning process, then decide what you would address first.</p></header><div class="pc-activity-layout">${buildS2JordanEvidenceHTML()}${taskHTML}</div></section>`
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
    statusId: 's2EvidenceStatus',
    submitId: 's2EvidenceSubmit',
    submitLabel: 'Try this intervention',
    limit: 1,
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
    <aside class="pc-evidence-card s2-case-evidence" aria-label="Evidence from Jordan">
      <div class="s2-evidence-portrait">
        <img src="${ASSETS.images.students.jordan.uncertain}" alt="Jordan, an adult online learner, looking uncertain" />
        <div class="s2-evidence-name"><span>Student</span><strong>Jordan</strong></div>
      </div>
      <div class="pc-evidence-card-copy">
        <div class="pc-activity-kicker">Student evidence</div>
        <h3>What do the clues tell you?</h3>
        <dl class="s2-evidence-list">
          <div class="s2-evidence-item"><dt>Result</dt><dd><strong>84%</strong><span>Improved from the previous assignment</span></dd></div>
          <div class="s2-evidence-item"><dt>Strategy</dt><dd>“I reread the chapter a few times.”</dd></div>
          <div class="s2-evidence-item"><dt>Next move</dt><dd>“I’ll probably reread everything again and hope it works.”</dd></div>
        </dl>
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
  if (selected === 'metacognitive') return { key: 's2_diagnosis_correct', level: 'strong' };
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

  disableScenarioChoices('s2-diagnosis', 's2DiagnosisSubmit');
  playPixelSequence(result.key, () => renderS2DiagnosisFeedback(selection, result));
}

function renderS2DiagnosisFeedback(selection, result) {
  const exact = result.key === 's2_diagnosis_correct';
  const text = pixelDialogue[result.key]?.[0]?.text || '';
  renderScenarioFeedback({
    panelId: 's2DiagnosisFeedback',
    tone: exact ? 'strong' : 'developing',
    heading: exact ? 'You found the hidden problem.' : 'That explains part of the case, not the whole thing.',
    text,
    actionsHTML: `
      ${exact ? '' : '<button class="pc-button pc-button--secondary" type="button" id="s2RetryDiagnosis" data-pc-action="s2-retry-diagnosis">Revise diagnosis</button>'}
      <button class="pc-button pc-button--primary" type="button" id="s2ContinueEvidence" data-pc-action="s2-continue-evidence">Choose an intervention →</button>`
  });
}

function renderS2EvidenceActivity() {
  return renderS2SelectionActivity(S2_ACTIVITY_CONFIG.evidence);
}

function submitS2Evidence() {
  const selection = getCheckedValues('s2-evidence');
  if (selection.length !== 1) return;
  const choice = selection[0];
  const data = getS2Data();
  const option = S2_EVIDENCE_RESPONSES.find(item => item.id === choice);
  const consequences = {
    confidence: { tone: 'developing', heading: 'Jordan feels informed, but still cannot test the strategy.', quote: 'I’d say I’m a four out of five. I feel better about it this time.', copy: 'Confidence is useful information, but Jordan can still answer without showing what he understands or whether rereading caused the improvement.' },
    strategy_name: { tone: 'developing', heading: 'The strategy is visible. Its effectiveness is not.', quote: 'I reread the chapter three times and highlighted the parts that seemed important.', copy: 'Jordan can now name what he did, but he still has no evidence for deciding whether it helped.' },
    grade_compare: { tone: 'developing', heading: 'Outcome bias just got stronger.', quote: 'I got an 84 instead of a 76, so rereading must have worked.', copy: 'The intervention encourages Jordan to treat the grade as proof of the strategy. The result changed, but the learning process is still invisible.' },
    evidence_check: { tone: 'strong', heading: 'Now Jordan has evidence he can act on.', quote: 'I could define both concepts, but without my notes I still couldn’t explain the difference. Rereading helped me recognize them, but it didn’t help me compare them. I need to try examples next.', copy: 'Jordan is no longer guessing from a feeling or grade. He monitored understanding, connected evidence to the strategy, and made a decision.' }
  };
  const result = consequences[choice] || consequences.strategy_name;
  data.attempts += 1;
  data.evidenceAttempts.push({ selection: [...selection], exact: choice === 'evidence_check', consequence: result.heading, timestamp: new Date().toISOString() });
  data.prompts.push(`S2 intervention: ${option?.title || choice}`);
  data.finalResponse = result.copy;
  disableScenarioChoices('s2-evidence', 's2EvidenceSubmit');

  renderScenarioFeedback({
    panelId: 's2EvidenceFeedback',
    tone: result.tone,
    heading: result.heading,
    text: `Jordan: “${result.quote}” ${result.copy}`,
    actionsHTML: `<button class="pc-button pc-button--primary" type="button" id="s2OpeningCheckpoint" data-pc-action="s2-opening-checkpoint">Give the case to Babbage →</button>`
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
    data.thinkingMove = 'evaluate';
    generateS2BabbageDraft();
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
