/* PROMPTCRAFT SCENARIO 1 — CANVAS EVIDENCE AND TRANSFER
   Current Content Avalanche case files, evidence viewer, AI reflection,
   Canvas Rescue, and course-week transfer activity. */

const PC_S1_PREVIEW_CASES = Object.freeze([
  Object.freeze({
    label: 'Module structure',
    kicker: 'Instructor view · Module structure',
    title: 'Can the instructor see a teachable sequence?',
    before: 'instructor-before-module',
    after: 'instructor-after-module',
    briefingKey: 's1_case_module_briefing',
    explanationKey: 's1_case_module_explanation',
    aiDemoKey: 's1_case_module_ai_demo',
    revealKey: 's1_case_module_reveal',
    aiDemo: Object.freeze({
      diagnosis: 'Students see plenty of content but no visible starting point or learning sequence.',
      operation: 'Inventory and sequence the module',
      output: Object.freeze([
        'Inventory: nine learning items plus one assignment',
        'Group by learner action: orient, learn, practice, submit, continue',
        'Draft path: Start Here → Learn → Submit → Continue'
      ]),
      summary: 'AI inventoried and grouped the existing items into a first-pass learning path.',
      judgment: 'Confirm the purpose, prerequisites, and actual teaching sequence before changing Canvas.',
      destination: 'Reveal a verified Start Here → Learn → Submit → Continue path in Canvas.'
    }),
    beforeCue: 'Scan the item names and order. Where would a student begin, and what tells them which materials prepare them for the assignment?',
    afterCue: 'Look for a destination and an explicit path through Start Here, Learn, Submit, and Continue.',
    insight: 'The redesign changes a flat content list into a visible learning path without deleting the course content.',
    reflection: Object.freeze({
      prompt: 'Why is the After module easier for students to use?',
      problemTerms: Object.freeze(['start', 'sequence', 'order', 'path', 'guess']),
      changeTerms: Object.freeze(['start here', 'learn', 'submit', 'continue', 'group', 'label']),
      learnerTerms: Object.freeze(['student', 'learner', 'find', 'know', 'prepare', 'navigate', 'clear'])
    }),
    question: 'What needs to be fixed first?',
    correctChoice: 'visible-sequence',
    choices: Object.freeze([
      Object.freeze({ id: 'rename-files', label: 'Rename every file so each title sounds more polished.', feedback: 'Clear titles can help, but polished names alone do not show the purpose or sequence.' }),
      Object.freeze({ id: 'visible-sequence', label: 'Make the destination and learning sequence visible.', feedback: 'Yes. Students need to see where to begin, how the materials prepare them, and what comes next.' }),
      Object.freeze({ id: 'remove-content', label: 'Remove most of the content so the module is shorter.', feedback: 'Less content is not automatically better. The first repair is to make the existing path understandable.' })
    ])
  }),
  Object.freeze({
    label: 'Student path',
    kicker: 'Student view · Wayfinding',
    title: 'Can students tell where to begin and what comes next?',
    before: 'student-before-module',
    after: 'student-after-module',
    briefingKey: 's1_case_student_path_briefing',
    explanationKey: 's1_case_student_path_explanation',
    aiDemoKey: 's1_case_student_path_ai_demo',
    revealKey: 's1_case_student_path_reveal',
    aiDemo: Object.freeze({
      diagnosis: 'Students must guess the destination, starting point, action sequence, and finish line.',
      operation: 'Run a learner-view wayfinding audit',
      output: Object.freeze([
        'Destination visible? No',
        'Starting point visible? No',
        'Completion point visible? No',
        'Action labels consistent? No'
      ]),
      summary: 'AI audited the student-visible signals and flagged where a learner must guess.',
      judgment: 'Validate the audit with real student behavior; AI cannot experience confusion for them.',
      destination: 'Reveal a student-visible route that works without extra instructor explanation.'
    }),
    beforeCue: 'Imagine this is your first visit to Week 4. What would you have to open, remember, or guess before you knew what to do?',
    afterCue: 'Check whether the module labels and sequence answer those questions without extra instructor explanation.',
    insight: 'The student view tests the course’s visible organization rather than the organization that exists only in the instructor’s head.',
    reflection: Object.freeze({
      prompt: 'Why does the After view create a better student path?',
      problemTerms: Object.freeze(['guess', 'begin', 'start', 'next', 'finish', 'path']),
      changeTerms: Object.freeze(['order', 'sequence', 'start here', 'continue', 'action', 'label']),
      learnerTerms: Object.freeze(['student', 'learner', 'navigate', 'find', 'understand', 'independent', 'clear'])
    }),
    question: 'Which repair addresses the student-view problem?',
    correctChoice: 'learner-path',
    choices: Object.freeze([
      Object.freeze({ id: 'more-resources', label: 'Add another example and an optional reading.', feedback: 'More resources add choices, but they do not tell students how the current items fit together.' }),
      Object.freeze({ id: 'learner-path', label: 'Show the intended order and completion path in the module.', feedback: 'Yes. The course organization must be visible from the learner’s side of Canvas.' }),
      Object.freeze({ id: 'email-reminder', label: 'Email students the correct order each week.', feedback: 'A reminder may help temporarily, but the path should live where students do the work.' })
    ])
  }),
  Object.freeze({
    label: 'Assignment',
    kicker: 'Instructor view · Assignment directions',
    title: 'Are the requirements located where students submit?',
    before: 'instructor-before-comparison-assignment',
    after: 'instructor-after-submit-assignment',
    briefingKey: 's1_case_assignment_briefing',
    explanationKey: 's1_case_assignment_explanation',
    aiDemoKey: 's1_case_assignment_ai_demo',
    revealKey: 's1_case_assignment_reveal',
    aiDemo: Object.freeze({
      diagnosis: 'The assignment requirements are scattered across several Canvas locations.',
      operation: 'Extract the scattered assignment requirements',
      output: Object.freeze([
        'About 400 words using both planning-model readings',
        'Explain a difference and apply both models to the transit case',
        'Recommend an approach; submit Sunday; complete the quiz first'
      ]),
      summary: 'AI extracted requirements from several locations and assembled a reviewable checklist.',
      judgment: 'Check every extracted requirement against the course and define what successful evidence looks like.',
      destination: 'Reveal a verified assignment with the complete task at the point of submission.'
    }),
    beforeCue: 'Identify every requirement that is missing from this assignment page. Where would a student have to search for it?',
    afterCue: 'Look for the task, four required parts, success criteria, length, due point, and point value in one location.',
    insight: 'The revised assignment moves critical directions to the point of need instead of making students reconstruct the task from several pages.',
    reflection: Object.freeze({
      prompt: 'Why is the After assignment easier to complete successfully?',
      problemTerms: Object.freeze(['scattered', 'search', 'missing', 'reconstruct', 'several', 'buried']),
      changeTerms: Object.freeze(['requirements', 'task', 'criteria', 'due', 'evidence', 'one location', 'assignment page']),
      learnerTerms: Object.freeze(['student', 'learner', 'complete', 'success', 'plan', 'understand', 'clear'])
    }),
    question: 'Where should the full task requirements appear?',
    correctChoice: 'point-of-need',
    choices: Object.freeze([
      Object.freeze({ id: 'module-notes', label: 'Only in the module notes so the assignment page stays short.', feedback: 'That keeps the assignment short by making students reconstruct it from another location.' }),
      Object.freeze({ id: 'point-of-need', label: 'On the assignment page where students prepare and submit.', feedback: 'Yes. Put the task, evidence, constraints, and success criteria at the point of need.' }),
      Object.freeze({ id: 'rubric-only', label: 'Only in a rubric students can open after they start writing.', feedback: 'A rubric can reinforce expectations, but the task itself should be visible before writing begins.' })
    ])
  }),
  Object.freeze({
    label: 'Expectations',
    kicker: 'Instructor view · Hidden expectations',
    title: 'Are important directions buried or made visible?',
    before: 'instructor-before-buried-directions',
    after: 'instructor-after-start-here',
    briefingKey: 's1_case_expectations_briefing',
    explanationKey: 's1_case_expectations_explanation',
    aiDemoKey: 's1_case_expectations_ai_demo',
    revealKey: 's1_case_expectations_reveal',
    aiDemo: Object.freeze({
      diagnosis: 'Purpose, workload, due point, and sequence appear too late for students to plan.',
      operation: 'Draft a Start Here page from verified details',
      output: Object.freeze([
        'State the destination and learning outcome',
        'Show the Learn → Practice → Submit sequence',
        'Surface workload, due point, value, and next action'
      ]),
      summary: 'AI converted verified requirements into a first-draft advance organizer.',
      judgment: 'Verify workload, dates, outcomes, accessibility, and tone before publishing the page.',
      destination: 'Reveal a verified Start Here page that makes expectations visible before work begins.'
    }),
    beforeCue: 'Find the workload, evidence expectations, case, deadline, and required sequence. How late does the learner encounter them?',
    afterCue: 'Check whether purpose, workload, due point, value, learning outcome, and the next action are visible before work begins.',
    insight: 'The Start Here page turns late discoveries into an advance organizer students can use to plan their work.',
    reflection: Object.freeze({
      prompt: 'Why does the After page help students before work begins?',
      problemTerms: Object.freeze(['late', 'buried', 'plan', 'before', 'hidden', 'guess']),
      changeTerms: Object.freeze(['purpose', 'workload', 'due', 'sequence', 'outcome', 'next action', 'start here']),
      learnerTerms: Object.freeze(['student', 'learner', 'plan', 'prepare', 'time', 'expect', 'clear'])
    }),
    question: 'What should students see before they begin Week 4?',
    correctChoice: 'advance-organizer',
    choices: Object.freeze([
      Object.freeze({ id: 'late-directions', label: 'The detailed directions after they finish the readings.', feedback: 'Directions discovered late cannot help students plan time, attention, or evidence gathering.' }),
      Object.freeze({ id: 'advance-organizer', label: 'Purpose, sequence, workload, due point, and next action.', feedback: 'Yes. These expectations form an advance organizer students can use before work begins.' }),
      Object.freeze({ id: 'announcement', label: 'A general announcement reminding them that Week 4 is important.', feedback: 'An announcement does not replace a usable plan at the beginning of the module.' })
    ])
  })
]);

/* A desktop Canvas capture cannot remain legible after it is reduced to a
   phone-sized classroom smartboard. Keep the real screenshot as the source of
   truth, but replace its thumbnail with a faithful full-screen evidence reader
   on narrow screens. Each reader transcribes details that are visibly present
   in the corresponding capture; the complete image remains available in the
   full-size evidence station. */
const PC_S1_MOBILE_EVIDENCE_LENSES = Object.freeze({
  'instructor-before-module': Object.freeze({
    kind: 'modules',
    groupTitle: 'BEFORE · Week 4 Content Avalanche',
    sectionTitle: 'WEEK 4 MATERIALS',
    context: 'Instructor view · Module list',
    title: 'BEFORE · Week 4 Materials',
    rows: Object.freeze([
      'Unit4_final_v3.txt',
      'Week 4 Notes',
      'recording_10-12_transcript.txt',
      'Community Models',
      'ModelB_reading_NEW.txt',
      'Extra Examples',
      'Quiz 4 · Sep 20 · 1 point',
      'Comparison · Sep 20 · 20 points',
      'What to do next?'
    ]),
    finding: 'Nine items · no visible starting point'
  }),
  'instructor-after-module': Object.freeze({
    kind: 'modules',
    groupTitle: 'AFTER · Week 4 Visible Learning Path',
    sectionTitle: 'VISIBLE LEARNING PATH',
    context: 'Instructor view · Learning path',
    title: 'AFTER · Visible Learning Path',
    rows: Object.freeze([
      'START HERE · Purpose + due point',
      'LEARN',
      'READ · Compare the two planning models',
      'WATCH · See the models applied',
      'PRACTICE · Check your comparison',
      'SUBMIT · 400-word comparison + evidence',
      'CONTINUE · Preview Week 5'
    ]),
    finding: 'CONTINUE · Preview Week 5'
  }),
  'student-before-module': Object.freeze({
    kind: 'modules',
    groupTitle: 'BEFORE · Week 4 Content Avalanche',
    sectionTitle: 'WEEK 4 MATERIALS',
    context: 'Student view · Module list',
    title: 'BEFORE · Week 4 Materials',
    rows: Object.freeze([
      'Unit4_final_v3.txt',
      'Week 4 Notes',
      'recording_10-12_transcript.txt',
      'Community Models',
      'ModelB_reading_NEW.txt',
      'Extra Examples',
      'Comparison · Sep 20 · 20 points',
      'What to do next?'
    ]),
    finding: 'No destination · no visible finish line'
  }),
  'student-after-module': Object.freeze({
    kind: 'modules',
    groupTitle: 'AFTER · Week 4 Visible Learning Path',
    sectionTitle: 'VISIBLE LEARNING PATH',
    context: 'Student view · Learning path',
    title: 'AFTER · Visible Learning Path',
    rows: Object.freeze([
      'START HERE · Purpose + due point',
      'LEARN',
      'READ · Compare the two planning models',
      'WATCH · See the models applied',
      'PRACTICE · Check your comparison',
      'SUBMIT · 400-word comparison + evidence',
      'CONTINUE · Preview Week 5'
    ]),
    finding: 'A visible route from start to continue'
  }),
  'instructor-before-comparison-assignment': Object.freeze({
    kind: 'assignment',
    context: 'Instructor view · Assignment',
    title: 'Comparison',
    rows: Object.freeze([
      "Review this week's materials",
      'Additional directions are in the module notes',
      'Points · 20',
      'Submitting · a text entry box',
      'Due · Sep 20',
      'No visible parts or success criteria'
    ]),
    finding: 'The actual requirements live somewhere else'
  }),
  'instructor-after-submit-assignment': Object.freeze({
    kind: 'assignment',
    context: 'Instructor view · Assignment',
    title: 'SUBMIT · Planning approach',
    rows: Object.freeze([
      'Due Sun 11:59 · 400 words · 20 points',
      'Explain one meaningful difference',
      'Apply both models to the transit case',
      'Recommend one model or a deliberate hybrid',
      'Use specific evidence from each reading',
      'Success criteria appear before writing'
    ]),
    finding: 'Requirements moved to the point of need'
  }),
  'instructor-before-buried-directions': Object.freeze({
    kind: 'page',
    context: 'Instructor view · Late directions',
    title: 'What to do next?',
    rows: Object.freeze([
      '400 words + evidence from both readings',
      'Apply both models to the transit case',
      'Recommend an approach and explain why',
      'Quiz first',
      'Submit Sunday by 11:59 p.m.',
      'These details appear near the module end'
    ]),
    finding: 'Important directions appear near the end'
  }),
  'instructor-after-start-here': Object.freeze({
    kind: 'page',
    context: 'Instructor view · Advance organizer',
    title: 'START HERE · Purpose + due point',
    rows: Object.freeze([
      'Destination: recommend an approach',
      'READ · focused model comparison',
      'WATCH · worked transit example',
      'PRACTICE · three no-stakes checks',
      'SUBMIT · 400-word recommendation',
      '75–90 min · Sun 11:59 · 20 points',
      'Learning outcome and next action are visible'
    ]),
    finding: 'Expectations visible before work begins'
  })
});

const PC_S1_RESCUE_BRIEF_SECTIONS = Object.freeze([
  Object.freeze({
    id: 'goal',
    number: '01',
    label: 'Instructional destination',
    prompt: 'What should Babbage understand about the learning goal?',
    correctChoice: 'specific-goal',
    choices: Object.freeze([
      Object.freeze({ id: 'general-goal', label: 'Make Week 4 clearer and more engaging.' }),
      Object.freeze({ id: 'specific-goal', label: 'Students compare two planning models, apply both to the transit case, and recommend an approach.' })
    ])
  }),
  Object.freeze({
    id: 'learner',
    number: '02',
    label: 'Observed learner problem',
    prompt: 'Which learner information belongs in the brief?',
    correctChoice: 'observed-problem',
    choices: Object.freeze([
      Object.freeze({ id: 'motivation', label: 'Students probably lack motivation and need more content.' }),
      Object.freeze({ id: 'observed-problem', label: 'Students cannot see where to begin, how items connect, or what the assignment requires.' })
    ])
  }),
  Object.freeze({
    id: 'constraints',
    number: '03',
    label: 'Boundaries',
    prompt: 'What must the AI preserve or avoid?',
    correctChoice: 'preserve-verify',
    choices: Object.freeze([
      Object.freeze({ id: 'shorter', label: 'Make the module shorter by removing anything that appears repetitive.' }),
      Object.freeze({ id: 'preserve-verify', label: 'Preserve verified content and accessible formats; flag assumptions instead of inventing requirements.' })
    ])
  }),
  Object.freeze({
    id: 'deliverable',
    number: '04',
    label: 'Reviewable output',
    prompt: 'What should Babbage return to the instructor?',
    correctChoice: 'reviewable-package',
    choices: Object.freeze([
      Object.freeze({ id: 'redesign-everything', label: 'Redesign the entire course and publish the changes automatically.' }),
      Object.freeze({ id: 'reviewable-package', label: 'Draft a Start Here page, module sequence, and assignment checklist with assumptions clearly marked.' })
    ])
  })
]);

const PC_S1_RESCUE_PROPOSALS = Object.freeze([
  Object.freeze({
    id: 'start-here',
    title: 'Add a Start Here page',
    detail: 'Surface the destination, estimated workload, due point, learning outcome, and next action before work begins.',
    expected: 'use',
    rationale: 'Keep it. This uses verified course information to give students an advance organizer.'
  }),
  Object.freeze({
    id: 'module-path',
    title: 'Group the existing module into a visible path',
    detail: 'Organize the preserved items under Start Here, Learn, Practice, Submit, and Continue.',
    expected: 'use',
    rationale: 'Keep it. The proposal reorganizes existing content around learner actions without reducing substance.'
  }),
  Object.freeze({
    id: 'assignment-checklist',
    title: 'Move verified requirements to the assignment',
    detail: 'Place the four required parts, evidence expectations, length, due point, and success criteria beside submission.',
    expected: 'use',
    rationale: 'Keep it after source verification. It moves directions to the point of need.'
  }),
  Object.freeze({
    id: 'remove-alternatives',
    title: 'Delete transcripts and alternate formats',
    detail: 'Babbage marked them as repetitive and suggested removing them to make the module shorter.',
    expected: 'review',
    rationale: 'Return it for review. Apparent repetition may provide accessibility, flexibility, or an instructional alternative.'
  }),
  Object.freeze({
    id: 'invent-outcome',
    title: 'Replace the learning outcome with an AI-written one',
    detail: 'Babbage drafted a more polished outcome but cannot confirm that it matches the approved course outcome.',
    expected: 'review',
    rationale: 'Return it for review. The instructor must verify alignment and cannot let polish override the approved outcome.'
  })
]);

let pcS1PreviewCaseIndex = 0;
let pcS1PreviewState = 'before';
let pcS1CanvasDialogueCaseIndex = 0;
let pcS1CanvasDialogueState = 'before';
let pcS1CanvasDialogueMode = false;
function pcCreateS1PreviewCheck() {
  return { selected: '', answered: false, revealed: false, reflection: '', analysis: null };
}

let pcS1PreviewChecks = PC_S1_PREVIEW_CASES.map(() => pcCreateS1PreviewCheck());
let pcS1DialogueDiagnosis = null;
let pcS1RescueBriefAnswers = {};
let pcS1RescueProposalAnswers = {};
let pcS1RescueAIAnalysis = null;
let pcS1RescueAISource = 'local-fallback';
let pcS1AIWorkspaceState = null;
let pcS1WeekPlanState = null;
let pcS1WeekPlanReward = null;

function pcClearS1MobileEvidenceLens() {
  document.getElementById('pcS1MobileEvidenceLens')?.remove();
  document.getElementById('vnOverlay')?.classList.remove(
    'pc-s1-phone-cast-room',
    'pc-s1-documented-device-stage'
  );
  document.getElementById('vnOverlay')?.style.removeProperty('--pc-s1-cast-top');
  document.getElementById('vnOverlay')?.style.removeProperty('--pc-s1-cast-bottom');
  document.getElementById('vnOverlay')?.style.removeProperty('--pc-s1-cast-height');
  const boardWrap = document.querySelector('#vnOverlay .vn-smartboard-wrap');
  if (boardWrap) boardWrap.setAttribute('aria-label', 'Smartboard challenge display');
  document.querySelector('#vnOverlay .vn-smartboard')?.setAttribute('aria-hidden', 'true');
}

function pcClearS1IntroEvidenceCard() {
  document.getElementById('pcS1IntroEvidenceCard')?.remove();
  document.getElementById('vnOverlay')?.classList.remove('pc-s1-intro-evidence-active');
}

function pcRenderS1IntroEvidenceCard(item, evidence, caseIndex = 0) {
  const scene = document.getElementById('vnScene');
  const overlay = document.getElementById('vnOverlay');
  if (!scene || !overlay || !item || !evidence) return false;

  pcClearS1IntroEvidenceCard();
  const card = document.createElement('section');
  card.id = 'pcS1IntroEvidenceCard';
  card.className = 'pc-s1-intro-evidence-card';
  card.setAttribute('role', 'img');
  card.setAttribute('aria-label', `${item.title} ${evidence.alt}`);
  card.innerHTML = `
    <header>
      <span>CASE ${Number(caseIndex) + 1} · ${evidence.state.toUpperCase()} CANVAS EVIDENCE</span>
      <strong>${esc(item.title)}</strong>
    </header>
    <picture class="pc-s1-intro-evidence-picture">
      ${evidence.mobileSrc ? `<source media="(max-width: 520px)" srcset="${esc(evidence.mobileSrc)}">` : ''}
      ${evidence.compactSrc ? `<source media="(max-width: 1100px) and (orientation: portrait)" srcset="${esc(evidence.compactSrc)}">` : ''}
      <img src="${esc(evidence.smartboardSrc || evidence.src)}" alt="${esc(evidence.alt)}" draggable="false" loading="eager" decoding="async">
    </picture>`;
  scene.appendChild(card);
  overlay.classList.add('pc-s1-intro-evidence-active');
  return true;
}

function pcRestoreS1ResponsiveCapture(panel, evidence) {
  const overlay = document.getElementById('vnOverlay');
  const picture = panel?.querySelector('.pc-s1-real-canvas-capture');
  const image = picture?.querySelector('img');
  if (!picture || !image) return false;

  overlay?.classList.remove('pc-s1-documented-device-stage', 'pc-s1-phone-cast-room');
  overlay?.style.removeProperty('--pc-s1-cast-top');
  overlay?.style.removeProperty('--pc-s1-cast-bottom');
  overlay?.style.removeProperty('--pc-s1-cast-height');
  picture.classList.remove(
    'pc-s1-real-canvas-capture--documented-fit',
    'pc-s1-real-canvas-capture--centered'
  );
  ['width', 'max-width', 'margin', 'display', 'justify-content', 'align-items']
    .forEach(property => picture.style.removeProperty(property));
  [
    'display', 'width', 'min-width', 'max-width', 'height', 'margin',
    'object-fit', 'object-position'
  ].forEach(property => image.style.removeProperty(property));

  // A targeted fit removes <source> elements to prevent emulation heuristics
  // from selecting a different screenshot. Rebuild the original responsive
  // picture every time before selecting the current viewport profile.
  picture.querySelectorAll('source').forEach(source => source.remove());
  const addSource = (media, srcset) => {
    if (!srcset) return;
    const source = document.createElement('source');
    source.media = media;
    source.srcset = srcset;
    picture.insertBefore(source, image);
  };
  addSource(
    '(min-width: 980px) and (max-width: 1060px) and (max-height: 650px) and (orientation: landscape)',
    evidence.compactSrc
  );
  addSource('(min-width: 700px) and (orientation: landscape)', evidence.src);
  addSource('(max-width: 480px)', evidence.mobileSrc);
  image.src = evidence.compactSrc;
  return true;
}

function pcApplyS1DocumentedCaptureFit(panel, evidence) {
  if (!pcRestoreS1ResponsiveCapture(panel, evidence)) return false;
  // Device emulation may scale the page to 50%/75%, which can make innerWidth
  // larger than the selected device profile. Use the smaller emulated-screen
  // dimension so these documented fits remain stable at every preview scale.
  const width = Math.min(window.innerWidth, window.screen?.width || window.innerWidth);
  const height = Math.min(window.innerHeight, window.screen?.height || window.innerHeight);
  const isShortPhone = width <= 390 && height <= 700 && height > width;
  const isPortraitTablet = width >= 740 && width <= 1040 && height >= 1000 && height > width;
  const isNestHub = width >= 980 && width <= 1060 && height <= 650 && width > height;
  if (!isShortPhone && !isPortraitTablet && !isNestHub) return true;

  const picture = panel.querySelector('.pc-s1-real-canvas-capture');
  const image = picture?.querySelector('img');
  if (!picture || !image) return false;

  // The legacy smartboard shell can remain narrower than the emulated device
  // even after the capture itself is sized to 100vw. Mark these documented
  // outliers so the final cascade can widen the complete evidence-stage chain,
  // rather than clipping a correctly sized image inside a half-width parent.
  document.getElementById('vnOverlay')?.classList.add('pc-s1-documented-device-stage');

  // These are the documented outliers only. Choose the complete mobile Canvas
  // capture directly, then size that capture to the viewport. Removing picture
  // sources here prevents browser zoom/orientation heuristics from selecting the
  // desktop screenshot while DevTools is emulating one of these profiles.
  picture.querySelectorAll('source').forEach(source => source.remove());
  const selectedSource = isShortPhone && evidence.mobileSrc
    ? evidence.mobileSrc
    : evidence.compactSrc;
  image.src = selectedSource;
  picture.classList.add('pc-s1-real-canvas-capture--documented-fit');
  const centeredCanvas = isPortraitTablet || isNestHub;
  if (centeredCanvas) picture.classList.add('pc-s1-real-canvas-capture--centered');
  picture.style.setProperty('width', '100vw', 'important');
  picture.style.setProperty('max-width', 'none', 'important');
  picture.style.setProperty('margin', '0', 'important');
  image.style.setProperty('display', 'block', 'important');
  image.style.setProperty(
    'width',
    isNestHub ? 'min(90vw, 920px)' : isPortraitTablet ? 'min(88vw, 820px)' : '100vw',
    'important'
  );
  image.style.setProperty('min-width', centeredCanvas ? '0' : '100vw', 'important');
  image.style.setProperty('max-width', 'none', 'important');
  image.style.setProperty('height', 'auto', 'important');
  image.style.setProperty('margin', centeredCanvas ? '0 auto' : '0', 'important');
  image.style.setProperty('object-fit', 'contain', 'important');
  image.style.setProperty('object-position', centeredCanvas ? 'top center' : 'top left', 'important');
  return true;
}

function pcRefreshS1CanvasEvidenceLayout() {
  const panel = document.getElementById('pcS1MobileEvidenceLens');
  const evidence = panel?._pcS1Evidence;
  if (!panel || !evidence || !panel.classList.contains('pc-s1-mobile-evidence-lens--real-capture')) {
    return false;
  }
  pcApplyS1DocumentedCaptureFit(panel, evidence);
  requestAnimationFrame(() => {
    if (typeof pcUpdateS1PhoneCastRoom === 'function') pcUpdateS1PhoneCastRoom();
  });
  return true;
}

window.pcRefreshS1CanvasEvidenceLayout = pcRefreshS1CanvasEvidenceLayout;

function pcRenderS1MobileEvidenceLens(evidence) {
  pcClearS1MobileEvidenceLens();
  const screen = document.querySelector('#vnOverlay .vn-screen');
  const boardWrap = document.querySelector('#vnOverlay .vn-smartboard-wrap');
  const lens = evidence ? PC_S1_MOBILE_EVIDENCE_LENSES[evidence.id] : null;
  if (!screen || !lens) return false;

  const panel = document.createElement('div');
  panel.id = 'pcS1MobileEvidenceLens';
  panel.className = `pc-s1-mobile-evidence-lens pc-s1-mobile-evidence-lens--${evidence.state} pc-s1-mobile-evidence-lens--${lens.kind}`;
  panel.setAttribute('role', 'document');
  panel.setAttribute('tabindex', '0');
  panel.setAttribute('aria-label', `${lens.context}: ${lens.title}. Scroll to review all evidence.`);

  if (evidence.compactSrc) {
    panel._pcS1Evidence = evidence;
    panel.classList.add('pc-s1-mobile-evidence-lens--real-capture');
    panel.innerHTML = `
      <picture class="pc-s1-real-canvas-capture pc-s1-real-canvas-capture--${esc(evidence.id)}">
        ${evidence.compactSrc ? `<source media="(min-width: 980px) and (max-width: 1060px) and (max-height: 650px) and (orientation: landscape)" srcset="${esc(evidence.compactSrc)}">` : ''}
        ${evidence.src ? `<source media="(min-width: 700px) and (orientation: landscape)" srcset="${esc(evidence.src)}">` : ''}
        ${evidence.mobileSrc ? `<source media="(max-width: 480px)" srcset="${esc(evidence.mobileSrc)}">` : ''}
        <img src="${esc(evidence.compactSrc)}" alt="${esc(evidence.alt)}" draggable="false" loading="eager" decoding="async">
      </picture>`;
    screen.appendChild(panel);
    pcApplyS1DocumentedCaptureFit(panel, evidence);
    const captureImage = panel.querySelector('.pc-s1-real-canvas-capture img');
    const updatePhoneCastRoom = () => {
      if (typeof pcUpdateS1PhoneCastRoom === 'function') pcUpdateS1PhoneCastRoom();
    };
    captureImage?.addEventListener('load', updatePhoneCastRoom);
    requestAnimationFrame(updatePhoneCastRoom);
    screen.closest('.vn-smartboard')?.setAttribute('aria-hidden', 'false');
    if (boardWrap) {
      boardWrap.setAttribute('aria-label', `${evidence.alt} The real Canvas mobile capture is scrollable in the evidence pane.`);
    }
    requestAnimationFrame(() => {
      const scene = document.getElementById('vnScene');
      if (scene) scene.scrollTop = 0;
    });
    return true;
  }

  const canvasSection = lens.kind === 'modules' ? 'Modules' : lens.kind === 'assignment' ? 'Assignments' : 'Pages';
  const isModules = lens.kind === 'modules';
  const canvasRows = lens.rows.map(row => {
    const isHeading = isModules && /^(LEARN|SUBMIT)$/.test(row);
    const itemType = /Quiz/i.test(row)
      ? 'quiz'
      : /Comparison|SUBMIT/i.test(row)
        ? 'assignment'
        : /\.txt/i.test(row)
          ? 'attachment'
          : 'page';
    const isPublished = !/Quiz 4/i.test(row);
    return `<li class="${isHeading ? 'is-module-heading' : ''}" data-canvas-item-type="${itemType}">
      <span class="pc-s1-canvas-drag" aria-hidden="true">⠿</span>
      <span class="pc-s1-canvas-item-icon" aria-hidden="true"></span>
      <span class="pc-s1-canvas-item-copy">${esc(row)}</span>
      ${isHeading ? '' : '<span class="pc-s1-canvas-accessibility" aria-label="Accessibility checked">♿</span>'}
      ${isHeading ? '' : isPublished
        ? '<span class="pc-s1-canvas-row-status" aria-label="Published">✓</span>'
        : '<span class="pc-s1-canvas-row-status is-unpublished" aria-label="Unpublished">◯</span>'}
      ${isHeading ? '' : '<span class="pc-s1-canvas-kebab" aria-hidden="true">⋮</span>'}
    </li>`;
  }).join('');
  const canvasHeader = isModules
    ? `<div class="pc-s1-canvas-module-group-head">
        <span class="pc-s1-canvas-drag" aria-hidden="true">⠿</span>
        <span class="pc-s1-canvas-caret" aria-hidden="true">⌄</span>
        <strong>${esc(lens.groupTitle)}</strong>
        <span class="pc-s1-canvas-row-status" aria-label="Published">✓</span>
        <span class="pc-s1-canvas-add" aria-hidden="true">＋</span>
        <span class="pc-s1-canvas-kebab" aria-hidden="true">⋮</span>
      </div>
      <div class="pc-s1-canvas-module-section-head">
        <span class="pc-s1-canvas-drag" aria-hidden="true">⠿</span>
        <strong>${esc(lens.sectionTitle)}</strong>
        <span class="pc-s1-canvas-row-status" aria-label="Published">✓</span>
        <span class="pc-s1-canvas-kebab" aria-hidden="true">⋮</span>
      </div>`
    : `<div class="pc-s1-mobile-evidence-reader-head">
        <span class="pc-s1-canvas-wordmark">Canvas</span>
        <span class="pc-s1-mobile-evidence-context">${esc(lens.context)}</span>
        <span class="pc-s1-mobile-evidence-state">${evidence.state === 'after' ? 'After' : 'Before'}</span>
      </div>
      <div class="pc-s1-canvas-breadcrumb" aria-label="Canvas location">
        <span>Week 4</span><b aria-hidden="true">›</b><strong>${canvasSection}</strong>
        <span class="pc-s1-mobile-evidence-scroll-hint">Scroll evidence ↓</span>
      </div>
      <div class="pc-s1-canvas-pagehead">
        <strong class="pc-s1-mobile-evidence-title">${esc(lens.title)}</strong>
        <span class="pc-s1-canvas-published"><b aria-hidden="true">✓</b> Published</span>
      </div>`;
  panel.innerHTML = `
    ${canvasHeader}
    <ul class="pc-s1-mobile-evidence-rows">
      ${canvasRows}
    </ul>
    <div class="pc-s1-mobile-evidence-finding"><b>Inspection focus</b><span>${esc(lens.finding)}</span></div>`;
  screen.appendChild(panel);
  screen.closest('.vn-smartboard')?.setAttribute('aria-hidden', 'false');

  if (boardWrap) {
    boardWrap.setAttribute(
      'aria-label',
      `${evidence.alt} A readable mobile evidence lens is shown; the full Canvas capture is available in the evidence station.`
    );
  }
  requestAnimationFrame(() => {
    const scene = document.getElementById('vnScene');
    if (scene) scene.scrollTop = 0;
  });
  return true;
}

function pcGetS1CanvasDialogueCast() {
  return [
    { id: 'pixel', slot: 'right' },
    { id: 'eli', slot: 'left' }
  ];
}

function pcCountS1ReflectionWords(value = '') {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

function pcEvaluateS1AfterReflection(item, response) {
  const normalized = String(response || '').toLowerCase();
  const reflection = item?.reflection || {};
  const matches = terms => Array.isArray(terms) && terms.some(term => normalized.includes(String(term).toLowerCase()));
  const criteria = [
    {
      id: 'problem',
      label: 'Names the learner problem',
      met: matches(reflection.problemTerms),
      feedback: 'Explain what students had to search for, remember, or guess in the Before view.'
    },
    {
      id: 'change',
      label: 'Cites a visible Canvas change',
      met: matches(reflection.changeTerms),
      feedback: 'Name a concrete change you can see in the After view.'
    },
    {
      id: 'benefit',
      label: 'Connects the change to students',
      met: matches(reflection.learnerTerms),
      feedback: 'Connect that design change to what a student can now understand or do.'
    }
  ];
  const score = criteria.filter(criterion => criterion.met).length;
  const verdict = score === 3 ? 'Strong explanation' : score === 2 ? 'On the right track' : 'Needs another look';
  const summary = score === 3
    ? 'Your explanation identifies the original learner problem, points to a visible redesign, and explains why that change helps students.'
    : score === 2
      ? 'Your explanation includes two important parts, but one connection is still implicit.'
      : 'Your explanation describes a preference, but it needs more evidence from the Before and After views.';
  return { score, criteria, verdict, summary };
}

function pcClearS1AfterReflectionUI() {
  document.getElementById('pcS1AfterReflection')?.remove();
  const overlay = document.getElementById('vnOverlay');
  overlay?.classList.remove('pc-s1-after-reflection-entry');
  const dialogue = document.getElementById('vnDialogue');
  if (dialogue) {
    dialogue.classList.remove('has-choices', 'pc-s1-after-reflection-dialogue');
    delete dialogue.dataset.pcExplicitAction;
    dialogue.setAttribute('role', 'button');
    dialogue.setAttribute('tabindex', '0');
  }
}

function pcClearS1ReflectionLoading() {
  document.getElementById('pcS1ReflectionLoading')?.remove();
  document.body.classList.remove('pc-s1-reflection-loading-active');
}

function pcShowS1ReflectionLoading() {
  const state = pcS1AIWorkspaceState;
  const item = state ? PC_S1_PREVIEW_CASES[state.caseIndex] : null;
  if (!state || !item) return false;
  pcClearS1ReflectionLoading();
  const loading = document.createElement('section');
  loading.id = 'pcS1ReflectionLoading';
  loading.className = 'pc-s1-reflection-loading';
  loading.setAttribute('role', 'status');
  loading.setAttribute('aria-live', 'polite');
  loading.innerHTML = `
    <div class="pc-s1-reflection-loading-shell">
      <p class="pc-s1-reflection-loading-brand">PROMPTCRAFT // BABBAGE ANALYSIS BOOT</p>
      <h2>Loading case ${state.caseIndex + 1}: ${esc(item.label)}</h2>
      <div class="pc-s1-reflection-loading-log" aria-label="Analysis progress">
        <p>&gt; reading PLAYER_RESPONSE.LOG</p>
        <p>&gt; comparing BEFORE_CAPTURE and AFTER_CAPTURE</p>
        <p>&gt; checking learner problem</p>
        <p>&gt; checking visible Canvas change</p>
        <p>&gt; checking student benefit<span class="pc-s1-terminal-cursor" aria-hidden="true">_</span></p>
      </div>
      <div class="pc-s1-reflection-loading-track" aria-hidden="true"><span></span></div>
    </div>`;
  document.body.appendChild(loading);
  document.body.classList.add('pc-s1-reflection-loading-active');
  pcScheduleScenarioTask(() => {
    pcShowS1ReflectionAnalysis();
  }, 1350, SCENARIO_INDEX.CONTENT_AVALANCHE);
  return true;
}

function pcNormalizeS1EvidenceAnalysis(remote, fallback) {
  if (!remote || typeof remote !== 'object') return fallback;
  const fields = [
    ['problem', 'Names the learner problem', 'learner_problem'],
    ['change', 'Cites a visible Canvas change', 'visible_change'],
    ['benefit', 'Connects the change to students', 'student_benefit']
  ];
  const criteria = fields.map(([id, label, key]) => ({
    id,
    label,
    met: Boolean(remote[key]?.met),
    feedback: String(remote[key]?.feedback || fallback.criteria.find(item => item.id === id)?.feedback || '')
  }));
  const score = criteria.filter(criterion => criterion.met).length;
  return {
    score,
    criteria,
    verdict: String(remote.verdict || fallback.verdict).replace(/_/g, ' '),
    summary: String(remote.summary || fallback.summary),
    designTakeaway: String(remote.design_takeaway || '')
  };
}

function pcRecordS1EvidenceAnalysis(state, item, analysis, response) {
  const data = scenarioData[SCENARIO_INDEX.CONTENT_AVALANCHE];
  if (!data) return false;
  const playerResponse = String(state.response || '').trim();
  const previousAttempts = Number(data.attempts || 0);
  data.attempts = previousAttempts + 1;
  data.prompts = Array.isArray(data.prompts) ? data.prompts : [];
  data.prompts.push(`S1 evidence case ${state.caseIndex + 1} (${item.label}): ${playerResponse}`);
  data.currentScore = Number(analysis.score || 0);
  if (previousAttempts === 0) data.initialScore = data.currentScore;
  data.scoreDelta = data.currentScore - Number(data.initialScore || 0);
  data.bestScore = Math.max(Number(data.bestScore || 0), data.currentScore);
  data.finalResponse = analysis.summary || '';
  data.structuredAnalysis = {
    analysis_type: 's1_evidence_analysis',
    case_index: state.caseIndex + 1,
    case_label: item.label,
    player_response: playerResponse,
    ...analysis
  };
  const indicatorLabels = {
    problem: 'Learner problem identified',
    change: 'Visible Canvas change cited',
    benefit: 'Student benefit explained'
  };
  data.oscqrLit = analysis.criteria
    .filter(criterion => criterion.met)
    .map(criterion => indicatorLabels[criterion.id] || criterion.label)
    .join('; ');
  data.aiProvider = response?.provider || 'local-fallback';
  data.aiModel = response?.model || 'promptcraft-local-evaluator';
  data.aiRequestId = response?.request_id || '';
  data.aiElapsedMs = response?.elapsed_ms ?? '';
  data.aiUsage = response?.usage || null;
  saveIncrementalData(SCENARIO_INDEX.CONTENT_AVALANCHE, 's1_evidence_analysis_complete');
  return true;
}

async function pcShowS1ReflectionAnalysis() {
  const state = pcS1AIWorkspaceState;
  const item = state ? PC_S1_PREVIEW_CASES[state.caseIndex] : null;
  if (!state || !item) return false;
  const fallbackAnalysis = pcEvaluateS1AfterReflection(item, state.response);
  let response = null;
  let analysis = fallbackAnalysis;
  try {
    response = await requestBabbageAnalysis({
      analysis_type: 's1_evidence_analysis',
      max_output_tokens: 1200,
      system: `You are Babbage, PromptCraft's Canvas evidence-analysis assistant. Evaluate only whether the faculty learner's comparison (1) names the learner problem in the Before view, (2) cites a visible design change in the After view, and (3) explains the student benefit. Do not invent course facts. Case: ${item.label}. Before cue: ${item.beforeCue}. After cue: ${item.afterCue}.`,
      messages: [{ role: 'user', content: state.response }]
    }, 's1-evidence-analysis');
    if (response?.analysis && !response.mock && response.provider !== 'local-fallback') {
      analysis = pcNormalizeS1EvidenceAnalysis(response.analysis, fallbackAnalysis);
    }
  } catch (error) {
    console.warn('[PromptCraft] Live S1 evidence analysis unavailable; using the labeled local evaluator.', error);
  }
  if (state !== pcS1AIWorkspaceState || scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) return false;
  pcClearS1ReflectionLoading();
  state.analysis = analysis;
  state.analysisSource = response?.analysis && !response.mock && response.provider !== 'local-fallback' ? 'live' : 'local-fallback';
  pcRecordS1EvidenceAnalysis(state, item, analysis, response);
  const overlay = document.getElementById('vnOverlay');
  const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  if (overlay) {
    pcReleaseFocusBeforeHide(overlay);
    state.overlay = overlay;
    state.overlayAriaHidden = overlay.hasAttribute('aria-hidden') ? overlay.getAttribute('aria-hidden') : null;
    state.overlayWasInert = Boolean(overlay.inert);
    overlay.inert = true;
    overlay.setAttribute('aria-hidden', 'true');
  }
  state.returnFocus = returnFocus;
  const isFinalCase = state.caseIndex === PC_S1_PREVIEW_CASES.length - 1;
  const continueLabel = isFinalCase
    ? 'Continue to Design Your Week →'
    : `Continue to case ${state.caseIndex + 2} →`;

  const workspace = document.createElement('section');
  workspace.id = 'pcS1ReflectionAnalysis';
  workspace.className = `pc-s1-reflection-analysis pc-s1-reflection-analysis--terminal pc-s1-reflection-analysis--score-${analysis.score}`;
  workspace.setAttribute('role', 'dialog');
  workspace.setAttribute('aria-modal', 'true');
  workspace.setAttribute('aria-labelledby', 'pcS1ReflectionAnalysisTitle');
  workspace.innerHTML = `
    <div class="pc-s1-reflection-analysis-shell">
      <header class="pc-s1-reflection-analysis-header">
        <span class="pc-s1-reflection-analysis-mark">
          <img src="${pcProjectUrl('assets/images/ui/babbage-mark.svg')}" alt="Babbage">
        </span>
        <div>
          <p>BABBAGE // CASE_${state.caseIndex + 1} // ${esc(item.label).toUpperCase()} // ${state.analysisSource === 'live' ? 'LIVE' : 'LOCAL FALLBACK'}</p>
          <h2 id="pcS1ReflectionAnalysisTitle">Practice Analysis</h2>
        </div>
        <span class="pc-s1-reflection-analysis-verdict">STATUS: ${esc(analysis.verdict).toUpperCase()}</span>
      </header>
      <div class="pc-s1-reflection-analysis-content">
        <section class="pc-s1-reflection-focus" aria-labelledby="pcS1ReflectionFeedbackHeading">
          <span>BABBAGE FINDING</span>
          <h3 id="pcS1ReflectionFeedbackHeading">${esc(analysis.summary)}</h3>
        </section>
        <section class="pc-s1-reflection-feedback" aria-labelledby="pcS1ReflectionFeedbackHeading">
          <p class="pc-s1-reflection-analysis-kicker">EVIDENCE CONNECTIONS</p>
          <ol>
            ${analysis.criteria.map(criterion => `
              <li class="${criterion.met ? 'is-met' : 'is-missing'}">
                <span aria-hidden="true">${criterion.met ? '[PASS]' : '[CHECK]'}</span>
                <div><strong>${esc(criterion.label)}</strong><p>${criterion.met ? 'Found in your explanation.' : esc(criterion.feedback)}</p></div>
              </li>`).join('')}
          </ol>
        </section>
        <aside class="pc-s1-reflection-teaching-point">
          <span>DESIGN TAKEAWAY</span>
          <p>${esc(analysis.designTakeaway || item.insight)}</p>
        </aside>
        <details class="pc-s1-reflection-response">
          <summary>View your practice response</summary>
          <blockquote>${esc(state.response)}</blockquote>
        </details>
      </div>
      <footer class="pc-s1-reflection-analysis-footer">
        <p>Babbage can check for connections. You still decide whether the explanation is accurate.</p>
        <div>
          <button id="babbageTTSBtn" type="button" class="pc-shell-secondary pc-s1-reflection-tts" data-pc-action="toggle-babbage-tts" data-pc-stop-propagation="true">🔊 Read Analysis</button>
          <button type="button" class="pc-shell-primary" data-pc-action="s1-complete-after-reflection">${continueLabel}</button>
        </div>
      </footer>
    </div>`;
  document.body.appendChild(workspace);
  document.body.classList.add('pc-s1-reflection-analysis-active');
  pcScheduleScenarioTask(() => pcFocusWithoutScroll(workspace.querySelector('#pcS1ReflectionAnalysisTitle')), 50, SCENARIO_INDEX.CONTENT_AVALANCHE);
  return true;
}

function pcClearS1ReflectionAnalysis({ restoreFocus = true, clearState = false } = {}) {
  const state = pcS1AIWorkspaceState;
  const workspace = document.getElementById('pcS1ReflectionAnalysis');
  pcReleaseFocusBeforeHide(workspace);
  workspace?.remove();
  document.body.classList.remove('pc-s1-reflection-analysis-active');
  if (window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
  const overlay = state?.overlay || document.getElementById('vnOverlay');
  if (overlay && state && Object.prototype.hasOwnProperty.call(state, 'overlayWasInert')) {
    overlay.inert = Boolean(state.overlayWasInert);
    if (state.overlayAriaHidden === null) overlay.removeAttribute('aria-hidden');
    else overlay.setAttribute('aria-hidden', state.overlayAriaHidden);
  }
  if (restoreFocus && state?.returnFocus?.isConnected) pcFocusWithoutScroll(state.returnFocus);
  if (clearState) pcS1AIWorkspaceState = null;
}

function pcReviseS1AfterReflection() {
  const state = pcS1AIWorkspaceState;
  if (!state) return false;
  const { caseIndex, response } = state;
  pcClearS1ReflectionAnalysis({ restoreFocus: false, clearState: false });
  pcS1PreviewCaseIndex = caseIndex;
  pcS1PreviewState = 'after';
  pcS1PreviewChecks[caseIndex].reflection = response;
  pcS1AIWorkspaceState = null;
  pcRenderS1PreviewEvidence();
  const textarea = document.getElementById('pcS1CaseReflectionText');
  textarea?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  pcScheduleScenarioTask(() => textarea?.focus({ preventScroll: true }), 80, SCENARIO_INDEX.CONTENT_AVALANCHE);
  return true;
}

function pcCompleteS1AfterReflection() {
  const state = pcS1AIWorkspaceState;
  if (!state) return false;
  const { caseIndex } = state;
  const checkState = pcS1PreviewChecks[caseIndex];
  checkState.answered = true;
  checkState.analysis = state.analysis;
  const score = Math.max(0, Math.min(3, Number(state.analysis?.score) || 0));
  const earnedXP = awardS1PracticeXP(caseIndex, score);
  pcClearS1ReflectionAnalysis({ restoreFocus: false, clearState: true });
  const nextCaseIndex = caseIndex + 1;
  pcPrepareS1ClassroomDialogueScene();
  pcPrepareS1MissionBoardImage(caseIndex, 'after');
  const boardText = document.getElementById('vnBoardText');
  const item = PC_S1_PREVIEW_CASES[caseIndex];
  if (boardText && item) boardText.textContent = `What changed: ${item.afterCue}`;
  const feedback = pcBuildS1PixelProgressFeedback(score, 3, earnedXP, `Case ${caseIndex + 1}`, checkState.analysis);
  vnShow(score >= 3 ? 'proud' : score >= 2 ? 'encouraging' : 'thinking', feedback, () => {
    if (nextCaseIndex < PC_S1_PREVIEW_CASES.length) {
      pcPlayS1PreviewBriefing(nextCaseIndex, null, { classroom: true });
      return;
    }
    pcRenderS1WeekPlanner();
  }, {
    id: `p-s1-case-progress-${caseIndex + 1}`,
    speaker: 'Professor Pixel',
    character: 'pixel',
    cast: [{ id: 'pixel', slot: 'right' }]
  });
  return true;
}

function pcBuildS1PixelProgressFeedback(score, maxScore, earnedXP, activityLabel, analysis = null) {
  void earnedXP;
  void activityLabel;
  const missingCriterion = analysis?.criteria?.find(criterion => !criterion.met);
  const quality = score >= maxScore
    ? 'That explanation works because you named what students had to figure out, pointed to the visible Canvas change, and explained what the change helps students do.'
    : score >= Math.ceil(maxScore / 2)
      ? `You made most of the connection. Before the next case, make this part explicit: ${missingCriterion?.feedback || 'connect the visible design choice to what students can now understand or do.'}`
      : 'Babbage found only part of the comparison. Use the Before view to name what students had to guess, the After view to name the change, and then explain why that change matters.';
  return quality;
}

function pcClearS1ReflectionExperience() {
  pcCloseS1EvidenceModal({ restoreFocus: false });
  pcClearS1AfterReflectionUI();
  pcClearS1ReflectionLoading();
  pcClearS1ReflectionAnalysis({ restoreFocus: false, clearState: true });
}

function pcRestoreS1CanvasDialogueScene() {
  if (!pcS1CanvasDialogueMode || scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) return false;
  const item = PC_S1_PREVIEW_CASES[pcS1CanvasDialogueCaseIndex];
  const evidence = item ? pcGetS1CanvasEvidence(item[pcS1CanvasDialogueState]) : null;
  if (!item || !evidence) return false;

  pcClearS1MobileEvidenceLens();
  document.body.classList.add('pc-s1-canvas-dialogue-active');
  document.body.classList.remove('pc-s1-canvas-smartboard-active', 'pc-s1-canvas-backdrop-active');
  document.body.dataset.pcS1CanvasState = pcS1CanvasDialogueState;
  const overlay = document.getElementById('vnOverlay');
  overlay?.classList.remove('pc-s1-mobile-evidence-reader', 'pc-s1-mission-board-image');
  overlay?.setAttribute('aria-label', 'Framed Canvas evidence with Professor Pixel and Eli dialogue');
  const boardImage = document.getElementById('vnBoardImg');
  if (boardImage) boardImage.dataset.pcS1Evidence = evidence.id;
  loadSceneImage('', '');
  pcRenderS1IntroEvidenceCard(item, evidence, pcS1CanvasDialogueCaseIndex);
  const boardText = document.getElementById('vnBoardText');
  if (boardText) boardText.textContent = pcS1CanvasDialogueState === 'after' ? item.afterCue : item.beforeCue;
  document.querySelector('#vnOverlay .vn-smartboard')?.setAttribute('aria-hidden', 'true');
  return true;
}

function pcPrepareS1ClassroomDialogueScene() {
  pcClearS1ReflectionExperience();
  pcClearS1DialogueDiagnosisUI();
  pcClearS1MobileEvidenceLens();
  pcClearS1IntroEvidenceCard();
  pcS1CanvasDialogueMode = false;
  document.body.classList.remove('pc-s1-canvas-dialogue-active', 'pc-s1-canvas-smartboard-active', 'pc-s1-canvas-backdrop-active');
  delete document.body.dataset.pcS1CanvasState;
  const overlay = document.getElementById('vnOverlay');
  overlay?.classList.remove('pc-s1-mobile-evidence-reader', 'pc-s1-mission-board-image');
  overlay?.setAttribute('aria-label', 'PromptCraft character dialogue');
  overlay?.querySelector('.vn-screen')?.style.removeProperty('--pc-s1-mission-board-image');
  const sceneBackground = document.getElementById('vnSceneBg');
  if (sceneBackground) {
    delete sceneBackground.dataset.pcS1Evidence;
    pcSetImageSource(
      sceneBackground,
      ASSETS.images.backgrounds.classroom,
      LEGACY_ASSETS.images.backgrounds.classroom
    );
  }
  loadSceneImage('', '');
  return true;
}

function pcPrepareS1MissionBoardImage(caseIndex = pcS1PreviewCaseIndex, state = 'before') {
  const normalized = Math.max(0, Math.min(PC_S1_PREVIEW_CASES.length - 1, Number(caseIndex) || 0));
  const item = PC_S1_PREVIEW_CASES[normalized];
  const evidenceKey = state === 'after' ? item?.after : item?.before;
  const evidence = item ? pcGetS1CanvasEvidence(evidenceKey) : null;
  const overlay = document.getElementById('vnOverlay');
  if (!item || !evidence || !overlay) return false;

  const source = evidence.smartboardSrc || evidence.src;
  const cssSource = String(source).replace(/["\\\n\r]/g, match => `\\${match}`);
  overlay.classList.add('pc-s1-mission-board-image');
  overlay.querySelector('.vn-screen')?.style.setProperty(
    '--pc-s1-mission-board-image',
    `url("${cssSource}")`
  );
  pcClearS1IntroEvidenceCard();
  loadSceneImage(evidence.smartboardSrc || evidence.src, evidence.src);
  document.querySelector('#vnOverlay .vn-smartboard')?.setAttribute('aria-hidden', 'false');
  return true;
}

function pcPrepareS1CanvasDialogueScene(caseIndex = pcS1PreviewCaseIndex, state = 'before') {
  const normalized = Math.max(0, Math.min(PC_S1_PREVIEW_CASES.length - 1, Number(caseIndex) || 0));
  const item = PC_S1_PREVIEW_CASES[normalized];
  const evidence = item ? pcGetS1CanvasEvidence(item[state === 'after' ? 'after' : 'before']) : null;
  if (!item || !evidence) return false;

  pcS1CanvasDialogueCaseIndex = normalized;
  pcS1CanvasDialogueState = state === 'after' ? 'after' : 'before';
  pcS1CanvasDialogueMode = true;
  const boardImage = document.getElementById('vnBoardImg');
  if (boardImage) delete boardImage.dataset.pcS1Evidence;
  return pcRestoreS1CanvasDialogueScene();
}

function pcClearS1CanvasDialogueScene() {
  pcClearS1ReflectionExperience();
  pcClearS1DialogueDiagnosisUI();
  pcClearS1MobileEvidenceLens();
  pcClearS1IntroEvidenceCard();
  pcS1CanvasDialogueMode = false;
  document.body.classList.remove('pc-s1-canvas-dialogue-active', 'pc-s1-canvas-smartboard-active', 'pc-s1-canvas-backdrop-active');
  delete document.body.dataset.pcS1CanvasState;
  const overlay = document.getElementById('vnOverlay');
  overlay?.classList.remove('pc-s1-mobile-evidence-reader', 'pc-s1-mission-board-image');
  overlay?.setAttribute('aria-label', 'PromptCraft character dialogue');
  overlay?.querySelector('.vn-screen')?.style.removeProperty('--pc-s1-mission-board-image');
  const boardImage = document.getElementById('vnBoardImg');
  if (boardImage) delete boardImage.dataset.pcS1Evidence;
  const sceneBackground = document.getElementById('vnSceneBg');
  if (sceneBackground) delete sceneBackground.dataset.pcS1Evidence;
  loadSceneImage('', '');
  return true;
}

function pcScheduleS1CanvasDialogueSceneCleanup() {
  pcScheduleScenarioTask(() => {
    const overlay = document.getElementById('vnOverlay');
    if (!overlay?.classList.contains('active')) pcClearS1CanvasDialogueScene();
  }, 420, SCENARIO_INDEX.CONTENT_AVALANCHE);
}

function pcRouteS1ReflectionToCasePage(
  index = pcS1PreviewCaseIndex,
  initialResponse = '',
  onDone = null,
  { revealAfter = true } = {}
) {
  const normalized = Math.max(0, Math.min(PC_S1_PREVIEW_CASES.length - 1, Number(index) || 0));
  const checkState = pcS1PreviewChecks[normalized];
  if (!checkState || scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) return false;

  if (String(initialResponse || '').trim()) checkState.reflection = String(initialResponse).trim();
  if (revealAfter) checkState.revealed = true;
  pcS1PreviewCaseIndex = normalized;
  pcS1PreviewState = revealAfter ? 'after' : 'before';

  pcClearS1AfterReflectionUI();
  pcClearS1DialogueDiagnosisUI();
  // Clear the cast while the constrained S1 geometry still applies. Removing
  // the scene classes first can expose Eli at intrinsic size for one frame.
  pcResetVNCharacters();
  pcS1CanvasDialogueMode = false;
  document.body.classList.remove('pc-s1-canvas-dialogue-active', 'pc-s1-canvas-smartboard-active', 'pc-s1-canvas-backdrop-active');
  delete document.body.dataset.pcS1CanvasState;
  const overlay = document.getElementById('vnOverlay');
  pcReleaseFocusBeforeHide(overlay);
  pcSetVNOverlayState({ active: false });
  overlay?.classList.remove(
    'pc-s1-mobile-evidence-reader',
    'pc-s1-after-reflection-entry',
    'pc-s1-dialogue-choice',
    'scenario-intro-active'
  );
  overlay?.setAttribute('aria-label', 'PromptCraft character dialogue');
  loadSceneImage('', '');

  if (!document.getElementById('pcS1EvidenceViewer')) renderS1ContentAvalanchePreview({ preserveProgress: true });
  pcRenderS1PreviewEvidence();
  if (typeof onDone === 'function') onDone();

  const target = document.getElementById(revealAfter ? 'pcS1Debrief' : 'pcS1EvidenceViewer');
  pcScheduleScenarioTask(() => {
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (revealAfter) document.getElementById('pcS1CaseReflectionText')?.focus({ preventScroll: true });
  }, 80, SCENARIO_INDEX.CONTENT_AVALANCHE);
  return true;
}

function pcPlayS1PreviewBriefing(index = pcS1PreviewCaseIndex, onDone = null, { classroom = false } = {}) {
  const normalized = Math.max(0, Math.min(PC_S1_PREVIEW_CASES.length - 1, Number(index) || 0));
  const item = PC_S1_PREVIEW_CASES[normalized];
  if (!item?.briefingKey || scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) return false;
  const lines = window.pixelDialogue?.[item.briefingKey];
  if (!Array.isArray(lines) || !lines.length) return false;

  // Match S2's sequence: introduce the case on the ordinary classroom stage,
  // then place the real Canvas capture on that same smartboard for the short
  // evidence discussion. The shared dual-cast renderer owns position, speaker
  // emphasis, and inactive-character dimming in both phases.
  pcPrepareS1ClassroomDialogueScene();
  pcPrepareS1MissionBoardImage(normalized);
  const challengeBoard = document.getElementById('vnBoardText');
  if (challengeBoard) challengeBoard.textContent = item.beforeCue;
  const cast = pcGetS1CanvasDialogueCast();
  const queueLine = (line, completion = null) => vnShow(
    line.expr || 'neutral',
    line.text || '',
    completion,
    {
      speaker: line.speaker || (line.character === 'eli' ? 'Eli' : 'Professor Pixel'),
      character: line.character || 'pixel',
      cast: line.cast || cast,
      entrance: line.entrance || '',
      id: line.id || ''
    }
  );
  const finish = () => pcRouteS1ReflectionToCasePage(normalized, '', onDone, { revealAfter: false });
  const queueCanvasDiscussion = () => {
    pcPrepareS1CanvasDialogueScene(normalized, 'before');
    const remaining = lines.slice(1);
    if (!remaining.length) return finish();
    remaining.forEach((line, lineIndex) => {
      queueLine(line, lineIndex === remaining.length - 1 ? finish : null);
    });
  };
  queueLine(lines[0], queueCanvasDiscussion);
  return true;
}

function pcClearS1DialogueDiagnosisUI() {
  pcS1DialogueDiagnosis = null;
  document.getElementById('pcS1DialogueChoices')?.remove();
  const overlay = document.getElementById('vnOverlay');
  overlay?.classList.remove('pc-s1-dialogue-choice');
  const dialogue = document.getElementById('vnDialogue');
  if (dialogue) {
    dialogue.classList.remove('has-choices', 'pc-s1-diagnosis-dialogue');
    delete dialogue.dataset.pcExplicitAction;
    dialogue.setAttribute('role', 'button');
    dialogue.setAttribute('tabindex', '0');
  }
}

let pcS1EvidenceModalReturnFocus = null;

const PC_S1_READ_SIZE_VIEWPORTS = Object.freeze([
  Object.freeze([853, 1280]),
  Object.freeze([912, 1368]),
  Object.freeze([1024, 1366]),
  Object.freeze([820, 1180]),
  Object.freeze([768, 1024]),
]);

function pcGetS1EvidenceDefaultZoom() {
  const viewportSizes = [
    [window.screen?.width, window.screen?.height],
    [window.innerWidth, window.innerHeight],
    [document.documentElement?.clientWidth, document.documentElement?.clientHeight],
  ].map(([width, height]) => [Math.round(Number(width)), Math.round(Number(height))]);
  const useReadSize = PC_S1_READ_SIZE_VIEWPORTS.some(([profileWidth, profileHeight]) =>
    viewportSizes.some(([width, height]) => width === profileWidth && height === profileHeight)
  );
  return useReadSize ? 'read' : 'fit';
}

function pcCloseS1EvidenceModal({ restoreFocus = true } = {}) {
  const modal = document.getElementById('pcS1EvidenceModal');
  if (!modal) return false;
  document.removeEventListener('keydown', pcHandleS1EvidenceModalKeydown);
  modal.remove();
  document.body.classList.remove('pc-s1-evidence-modal-active');
  if (restoreFocus && pcS1EvidenceModalReturnFocus?.isConnected) pcS1EvidenceModalReturnFocus.focus();
  pcS1EvidenceModalReturnFocus = null;
  return true;
}

function pcHandleS1EvidenceModalKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    pcCloseS1EvidenceModal();
  }
}

function pcRefreshS1EvidenceModalLayout() {
  const modal = document.getElementById('pcS1EvidenceModal');
  const evidence = modal?._pcS1Evidence;
  const image = document.getElementById('pcS1EvidenceModalImage');
  if (!modal || !evidence || !image) return false;

  const width = Math.min(
    window.innerWidth,
    window.visualViewport?.width || window.innerWidth,
    window.screen?.width || window.innerWidth
  );
  const height = Math.min(
    window.innerHeight,
    window.visualViewport?.height || window.innerHeight,
    window.screen?.height || window.innerHeight
  );
  const usePhoneLayout = width <= 560;
  const source = usePhoneLayout
    ? (evidence.mobileSrc || evidence.compactSrc || evidence.smartboardSrc || evidence.src)
    : evidence.src;
  const mode = usePhoneLayout ? 'phone' : 'desktop';

  modal.classList.remove(
    'pc-s1-evidence-modal--phone-capture',
    'pc-s1-evidence-modal--compact-capture',
    'pc-s1-evidence-modal--desktop-capture'
  );
  modal.classList.add(`pc-s1-evidence-modal--${mode}-capture`);

  if (!modal.dataset.pcEvidenceZoom) {
    pcSetS1EvidenceModalZoom(pcGetS1EvidenceDefaultZoom(), { userSelected: false });
  }

  if (image.dataset.pcModalSource !== source) {
    image.dataset.pcModalSource = source;
    pcSetImageSource(image, source);
    const scroll = modal.querySelector('.pc-s1-evidence-modal-scroll');
    if (scroll) {
      scroll.scrollTop = 0;
      scroll.scrollLeft = 0;
    }
  }
  return true;
}

function pcSetS1EvidenceModalZoom(mode = 'read', { userSelected = true } = {}) {
  const modal = document.getElementById('pcS1EvidenceModal');
  const scroll = modal?.querySelector('.pc-s1-evidence-modal-scroll');
  if (!modal || !scroll) return false;
  const normalized = mode === 'fit' ? 'fit' : 'read';
  modal.dataset.pcEvidenceZoom = normalized;
  if (userSelected) modal.dataset.pcEvidenceZoomSelected = 'true';
  modal.querySelectorAll('[data-pc-evidence-zoom]').forEach(button => {
    const active = button.dataset.pcEvidenceZoom === normalized;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  scroll.scrollTop = 0;
  scroll.scrollLeft = 0;
  return true;
}

let pcS1EvidenceModalResizeFrame = 0;
function pcScheduleS1EvidenceModalLayout() {
  cancelAnimationFrame(pcS1EvidenceModalResizeFrame);
  pcS1EvidenceModalResizeFrame = requestAnimationFrame(pcRefreshS1EvidenceModalLayout);
}

window.addEventListener('resize', pcScheduleS1EvidenceModalLayout, { passive: true });
window.visualViewport?.addEventListener('resize', pcScheduleS1EvidenceModalLayout, { passive: true });

function pcOpenS1EvidenceModal() {
  const item = PC_S1_PREVIEW_CASES[pcS1PreviewCaseIndex];
  const evidence = item ? pcGetS1CanvasEvidence(item[pcS1PreviewState]) : null;
  if (!item || !evidence) return false;

  pcCloseS1EvidenceModal({ restoreFocus: false });
  pcS1EvidenceModalReturnFocus = document.activeElement;
  const stateLabel = pcS1PreviewState === 'after' ? 'After' : 'Before';
  const modal = document.createElement('section');
  modal.id = 'pcS1EvidenceModal';
  modal.className = 'pc-s1-evidence-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'pcS1EvidenceModalTitle');
  modal._pcS1Evidence = evidence;
  modal.innerHTML = `
    <div class="pc-s1-evidence-modal-shell">
      <header>
        <div>
          <span>Case ${pcS1PreviewCaseIndex + 1} · ${esc(stateLabel)} Canvas evidence</span>
          <h2 id="pcS1EvidenceModalTitle">${esc(item.title)}</h2>
        </div>
        <button type="button" class="pc-s1-evidence-modal-close" data-pc-action="s1-close-evidence-modal" aria-label="Close full-size Canvas evidence">×</button>
      </header>
      <div class="pc-s1-evidence-modal-scroll" tabindex="0" aria-label="Scrollable full-size Canvas evidence">
        <img id="pcS1EvidenceModalImage" alt="${esc(evidence.alt)}" />
      </div>
      <footer>
        <p>Choose Read size to zoom in, then scroll to inspect the Canvas screen.</p>
        <div class="pc-s1-evidence-modal-zoom" role="group" aria-label="Canvas evidence size">
          <button type="button" data-pc-action="s1-evidence-zoom" data-pc-evidence-zoom="read" aria-pressed="false">Read size</button>
          <button type="button" data-pc-action="s1-evidence-zoom" data-pc-evidence-zoom="fit" aria-pressed="false">Fit image</button>
        </div>
        <button type="button" class="pc-shell-primary" data-pc-action="s1-close-evidence-modal">Close evidence</button>
      </footer>
    </div>`;
  modal.addEventListener('click', event => {
    if (event.target === modal) pcCloseS1EvidenceModal();
  });
  document.body.appendChild(modal);
  document.body.classList.add('pc-s1-evidence-modal-active');
  pcSetS1EvidenceModalZoom(pcGetS1EvidenceDefaultZoom(), { userSelected: false });
  pcRefreshS1EvidenceModalLayout();
  document.addEventListener('keydown', pcHandleS1EvidenceModalKeydown);
  modal.querySelector('.pc-s1-evidence-modal-close')?.focus();
  return true;
}

function pcRenderS1PreviewEvidence() {
  const viewer = document.getElementById('pcS1EvidenceViewer');
  const image = document.getElementById('pcS1EvidenceImage');
  const link = document.getElementById('pcS1EvidenceFullSize');
  const imageLink = document.getElementById('pcS1EvidenceFullSizeImage');
  if (!viewer || !image || !link || !imageLink) return false;

  const item = PC_S1_PREVIEW_CASES[pcS1PreviewCaseIndex];
  const evidence = item ? pcGetS1CanvasEvidence(item[pcS1PreviewState]) : null;
  if (!item || !evidence) return false;

  const isAfter = pcS1PreviewState === 'after';
  const title = document.getElementById('pcS1CaseTitle');
  const kicker = document.getElementById('pcS1CaseKicker');
  const counter = document.getElementById('pcS1CaseCounter');
  const cueLabel = document.getElementById('pcS1CueLabel');
  const cue = document.getElementById('pcS1Cue');
  const debrief = document.getElementById('pcS1Debrief');
  const reflectionPrompt = document.getElementById('pcS1CaseReflectionPrompt');
  const reflectionText = document.getElementById('pcS1CaseReflectionText');
  const reflectionCount = document.getElementById('pcS1CaseReflectionCount');
  const reflectionSubmit = document.getElementById('pcS1CaseReflectionSubmit');
  const reflectionStatus = document.getElementById('pcS1CaseReflectionStatus');
  const stateBadge = viewer.querySelector('.pc-s1-viewer-state');
  const perspective = document.getElementById('pcS1EvidencePerspective');
  const previous = document.getElementById('pcS1PreviousCase');
  const next = document.getElementById('pcS1NextCase');
  const checkState = pcS1PreviewChecks[pcS1PreviewCaseIndex];
  const allCasesComplete = pcS1PreviewChecks.every(check => check.answered);

  viewer.dataset.state = pcS1PreviewState;
  if (title) title.textContent = item.title;
  if (kicker) kicker.textContent = item.kicker;
  if (counter) counter.textContent = `Case file ${pcS1PreviewCaseIndex + 1} of ${PC_S1_PREVIEW_CASES.length}`;
  if (cueLabel) cueLabel.textContent = isAfter ? 'What changed?' : 'Case question';
  if (cue) cue.textContent = isAfter ? item.afterCue : item.beforeCue;
  if (stateBadge) stateBadge.textContent = isAfter ? 'After' : 'Before';
  if (debrief) debrief.hidden = false;
  if (reflectionPrompt) reflectionPrompt.textContent = item.reflection?.prompt || 'Why is the After version stronger for students?';
  if (reflectionText && reflectionText.value !== (checkState.reflection || '')) reflectionText.value = checkState.reflection || '';
  const reflectionWords = pcCountS1ReflectionWords(checkState.reflection || '');
  if (reflectionCount) reflectionCount.textContent = `${reflectionWords} of 12 words minimum`;
  if (reflectionText) {
    reflectionText.disabled = false;
    reflectionText.readOnly = false;
    reflectionText.placeholder = checkState.revealed
      ? 'In the Before view, students had to… In the After view… This helps because…'
      : 'Begin with what you notice in Before. Reveal After to complete your comparison.';
  }
  if (reflectionSubmit) reflectionSubmit.disabled = !checkState.revealed || reflectionWords < 12;
  if (reflectionStatus) {
    reflectionStatus.textContent = checkState.answered
      ? 'Babbage analysis complete. You may revise and analyze again.'
      : checkState.revealed
        ? 'Use evidence from both views, then send your explanation to Babbage.'
        : 'Write what you notice in Before, then reveal After to finish the comparison.';
  }
  if (perspective) perspective.textContent = `${evidence.perspective} · ${evidence.surface}`;

  pcSetImageSource(image, evidence.src);
  image.alt = evidence.alt;
  const fullSizeLabel = `Open full-size ${pcS1PreviewState} screenshot for ${item.label}`;
  link.setAttribute('aria-label', fullSizeLabel);
  imageLink.setAttribute('aria-label', fullSizeLabel);

  document.querySelectorAll('[data-pc-action="s1-preview-toggle-state"]').forEach(button => {
    const active = button.dataset.pcState === pcS1PreviewState;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
    if (button.dataset.pcState === 'after') {
      button.disabled = false;
      button.textContent = checkState.revealed ? 'After' : 'Reveal After';
      button.title = 'Show the redesigned Canvas evidence';
    }
  });
  document.querySelectorAll('[data-pc-action="s1-preview-select-case"]').forEach(button => {
    const active = Number(button.dataset.pcCaseIndex) === pcS1PreviewCaseIndex;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  });

  if (previous) previous.disabled = pcS1PreviewCaseIndex === 0;
  if (next) {
    const isFinalCase = pcS1PreviewCaseIndex === PC_S1_PREVIEW_CASES.length - 1;
    next.disabled = !checkState.answered || (isFinalCase && !allCasesComplete);
    next.textContent = isFinalCase
      ? (allCasesComplete ? 'Design Your Week →' : 'Complete all case analyses')
      : (checkState.answered ? 'Next case file →' : 'Complete Babbage analysis');
  }
  if (reflectionText && reflectionText.dataset.pcReflectionBound !== 'true') {
    reflectionText.dataset.pcReflectionBound = 'true';
    reflectionText.addEventListener('input', pcUpdateS1CaseReflectionState);
  }
  return true;
}

function pcUpdateS1CaseReflectionState() {
  const textarea = document.getElementById('pcS1CaseReflectionText');
  const checkState = pcS1PreviewChecks[pcS1PreviewCaseIndex];
  if (!textarea || !checkState) return false;
  checkState.reflection = textarea.value;
  const words = pcCountS1ReflectionWords(textarea.value);
  const count = document.getElementById('pcS1CaseReflectionCount');
  const submit = document.getElementById('pcS1CaseReflectionSubmit');
  if (count) count.textContent = `${words} of 12 words minimum`;
  if (submit) submit.disabled = !checkState.revealed || words < 12;
  return true;
}

function pcSubmitS1CaseReflection() {
  const checkState = pcS1PreviewChecks[pcS1PreviewCaseIndex];
  if (!checkState?.revealed || pcCountS1ReflectionWords(checkState.reflection) < 12) return false;
  pcS1AIWorkspaceState = {
    caseIndex: pcS1PreviewCaseIndex,
    response: checkState.reflection.trim(),
    onDone: null
  };
  return pcShowS1ReflectionLoading();
}

function pcSelectS1PreviewCase(index, { narrate = false } = {}) {
  const normalized = Math.max(0, Math.min(PC_S1_PREVIEW_CASES.length - 1, Number(index) || 0));
  pcS1PreviewCaseIndex = normalized;
  pcS1PreviewState = 'before';
  const rendered = pcRenderS1PreviewEvidence();
  if (rendered && narrate) pcPlayS1PreviewBriefing(normalized);
  return rendered;
}

function pcSetS1PreviewState(state) {
  const requested = state === 'after' ? 'after' : 'before';
  if (requested === 'after') pcS1PreviewChecks[pcS1PreviewCaseIndex].revealed = true;
  pcS1PreviewState = requested;
  return pcRenderS1PreviewEvidence();
}

function pcGetS1RescueBriefAnswers() {
  const form = document.getElementById('pcS1RescueBriefForm');
  if (!form) return {};
  return Object.fromEntries(PC_S1_RESCUE_BRIEF_SECTIONS.map(section => {
    const selected = form.querySelector(`input[name="pc-s1-rescue-${section.id}"]:checked`);
    return [section.id, selected?.value || ''];
  }));
}

function pcGetS1RescueBriefForBabbage() {
  return Object.fromEntries(PC_S1_RESCUE_BRIEF_SECTIONS.map(section => {
    const selectedId = pcS1RescueBriefAnswers[section.id] || '';
    const selected = section.choices.find(choice => choice.id === selectedId);
    return [section.id, selected?.label || 'Not supplied'];
  }));
}

function pcBuildS1RescueSystemPrompt() {
  return `You are Babbage, an instructional-design analysis assistant inside PromptCraft.
Analyze the instructor's four-part design brief for a Canvas module repair.
Return exactly five proposals using these IDs once each: start-here, module-path, assignment-checklist, remove-alternatives, invent-outcome.
The first three should be evidence-based draft repairs. The last two deliberately cross a human-judgment boundary and must be marked INSTRUCTOR_REVIEW.
Do not claim that you changed Canvas. Do not invent approved outcomes, requirements, dates, workload estimates, accessibility decisions, or course policy.
Treat transcripts and alternate formats as potentially purposeful accessibility resources.
Keep every proposal concrete, concise, and suitable for a higher-education instructor to review.`;
}

function pcNormalizeS1RescueAIAnalysis(analysis) {
  const byId = new Map((Array.isArray(analysis?.proposals) ? analysis.proposals : []).map(proposal => [proposal?.id, proposal]));
  return {
    brief_quality: ['STRONG', 'DEVELOPING', 'WEAK'].includes(analysis?.brief_quality) ? analysis.brief_quality : 'DEVELOPING',
    brief_summary: String(analysis?.brief_summary || 'Babbage produced a bounded first pass from the supplied design brief.'),
    assumptions: Array.isArray(analysis?.assumptions) && analysis.assumptions.length
      ? analysis.assumptions.map(value => String(value)).slice(0, 6)
      : ['Course outcomes, dates, accessibility needs, and approved requirements require instructor verification.'],
    proposals: PC_S1_RESCUE_PROPOSALS.map(fallback => {
      const incoming = byId.get(fallback.id) || {};
      return {
        ...fallback,
        title: String(incoming.title || fallback.title),
        detail: String(incoming.detail || fallback.detail),
        aiBoundary: incoming.recommended_boundary === 'INSTRUCTOR_REVIEW' ? 'review' : 'use',
        aiRationale: String(incoming.rationale || fallback.rationale)
      };
    })
  };
}

function pcUpdateS1RescueBriefState() {
  pcS1RescueBriefAnswers = pcGetS1RescueBriefAnswers();
  const completed = Object.values(pcS1RescueBriefAnswers).filter(Boolean).length;
  const counter = document.getElementById('pcS1RescueBriefCounter');
  const submit = document.getElementById('pcS1GenerateDraft');
  if (counter) counter.textContent = `${completed} of ${PC_S1_RESCUE_BRIEF_SECTIONS.length} brief decisions supplied`;
  if (submit) submit.disabled = completed !== PC_S1_RESCUE_BRIEF_SECTIONS.length;
  return completed;
}

function pcRenderS1WeekPlanner() {
  const area = document.getElementById('chat');
  const container = document.getElementById('inputContainer');
  if (!area || !pcS1PreviewChecks.every(check => check.answered)) return false;
  pcS1WeekPlanState = null;
  pcS1WeekPlanReward = null;
  if (container) {
    container.className = 'pc-s1-week-planner-host';
    container.innerHTML = '';
    container.style.display = 'none';
  }
  const categories = [
    ['start', 'START HERE', 'How will this section orient students to the week, the goal, and what they will accomplish?'],
    ['learn', 'LEARN', 'What will students use to build the knowledge or skills they need?'],
    ['practice', 'PRACTICE', 'How will students try the skill and check understanding before submitting?'],
    ['submit', 'SUBMIT', 'What will students produce, and where will directions and success criteria appear?'],
    ['continue', 'CONTINUE', 'How will students reflect, use feedback, and know what comes next?']
  ];
  area.innerHTML = `
    <section class="pc-s1-week-planner" role="region" aria-labelledby="pcS1WeekPlannerTitle">
      <header class="pc-s1-week-planner-hero">
        <span>Case files complete · Transfer task</span>
        <h2 id="pcS1WeekPlannerTitle">Describe what each part of the path should do.</h2>
        <p>Choose a real or invented week, module, or topic. For each header, explain its purpose for students. You may include example materials, but focus on what students should understand or do in that section.</p>
      </header>
      <form id="pcS1WeekPlannerForm" class="pc-s1-week-planner-form">
        <div class="pc-s1-week-planner-basics">
          <label><span>Week, module, or topic</span><textarea name="week" rows="2" maxlength="120" placeholder="Example: Week 4 · Comparing planning models" required></textarea></label>
          <label><span>Student destination or purpose</span><textarea name="destination" rows="2" maxlength="280" placeholder="Example: Students will compare two planning models." required></textarea></label>
        </div>
        <div class="pc-s1-week-planner-grid">
          ${categories.map(([id, label, hint], index) => `
            <label class="pc-s1-week-category pc-s1-week-category--${id}">
              <span><b>${String(index + 1).padStart(2, '0')}</b>${label}</span>
              <small>${hint}</small>
              <textarea name="${id}" rows="4" maxlength="500" placeholder="${esc({
                start: 'Example: Give an overview of the week, name the goal, show due dates, and identify the first action.',
                learn: 'Example: Introduce key ideas through a short reading, video, demonstration, or example.',
                practice: 'Example: Let students rehearse with a discussion, knowledge check, worked example, or draft.',
                submit: 'Example: Explain the final product, evidence, deadline, and success criteria at the point of submission.',
                continue: 'Example: Close with feedback, reflection, completion cues, and a bridge to the next week.'
              }[id])}"></textarea>
            </label>`).join('')}
        </div>
        <footer class="pc-s1-week-planner-actions">
          <p id="pcS1WeekPlannerStatus" aria-live="polite">Add a week, a destination, and at least three path categories.</p>
          <button type="button" class="pc-shell-secondary" data-pc-action="s1-rescue-return-cases">← Review case files</button>
          <button type="button" id="pcS1AnalyzeWeekPlan" class="pc-shell-primary" data-pc-action="s1-week-plan-analyze">Analyze my module path →</button>
        </footer>
      </form>
    </section>`;
  resetSectionScroll(area, container);
  return true;
}

function pcFillS1TransferDevTask() {
  const fill = () => {
    const form = document.getElementById('pcS1WeekPlannerForm');
    if (!form) return false;
    const values = {
      week: 'Week 4 · Comparing community planning models',
      destination: 'Students will compare two planning models and recommend one for a neighborhood transit case.',
      start: 'Orient students with a short overview of the week, the learning goal, the due date, and the first action.',
      learn: 'Build the needed knowledge through a brief video, two planning-model readings, and one worked comparison.',
      practice: 'Let students rehearse the comparison with a low-stakes knowledge check and discussion before submitting.',
      submit: 'Place the 400-word recommendation, evidence requirements, deadline, and success criteria beside submission.',
      continue: 'Close the week with feedback, reflection, a clear completion cue, and a preview of what comes next.'
    };
    Object.entries(values).forEach(([name, value]) => {
      const field = form.elements.namedItem(name);
      if (!field) return;
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      if (typeof autoGrow === 'function') autoGrow(field);
    });
    const status = document.getElementById('pcS1WeekPlannerStatus');
    if (status) status.textContent = 'DEV example added. Review or edit it, then analyze the path.';
    form.elements.namedItem('week')?.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  };

  if (fill()) return true;
  if (scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) return false;
  pcS1PreviewChecks = pcS1PreviewChecks.map(check => ({ ...check, answered: true, revealed: true }));
  if (!pcRenderS1WeekPlanner()) return false;
  return fill();
}

function pcBuildS1WeekPlanFallback(data, completed) {
  const signals = [
    {
      id: 'CLEAR_DESTINATION',
      met: Boolean(String(data.destination || '').trim()),
      strength: 'The destination tells students what they should understand, produce, or decide by the end of the week.',
      gap: 'State a student-facing destination that describes what learners will understand or do.'
    },
    {
      id: 'VISIBLE_START',
      met: Boolean(String(data.start || '').trim()),
      strength: 'START HERE gives students an overview, a purpose, and a clear first action.',
      gap: 'Use START HERE to orient students to the week, its purpose, and what they should do first.'
    },
    {
      id: 'LEARNING_SEQUENCE',
      met: Boolean(String(data.learn || '').trim()) && Boolean(String(data.practice || '').trim()),
      strength: 'LEARN and PRACTICE create a visible progression from building knowledge to trying the skill before submission.',
      gap: 'Include both a LEARN step and a low-stakes PRACTICE step so students can prepare before submission.'
    },
    {
      id: 'VISIBLE_SUBMISSION',
      met: Boolean(String(data.submit || '').trim()),
      strength: 'SUBMIT identifies the assessed work and places expectations at the point where students need them.',
      gap: 'Explain what students will submit, where they will submit it, and what evidence or criteria will be used.'
    },
    {
      id: 'CONTINUATION_CUE',
      met: Boolean(String(data.continue || '').trim()),
      strength: 'CONTINUE gives students a completion cue and shows what happens after the assessed work.',
      gap: 'Add a completion, feedback, reflection, or next-week cue so students know when the path is finished.'
    }
  ];
  const indicators = signals.filter(signal => signal.met).map(signal => signal.id);
  const missing = signals.filter(signal => !signal.met);
  return {
    status: indicators.length >= 5 ? 'STRONG' : indicators.length >= 3 ? 'DEVELOPING' : 'REVISE',
    summary: indicators.length >= 5
      ? 'This pathway gives students a clear destination and a complete sequence from orientation through continuation. The structure makes it easier to see what to do first, how to prepare, what to submit, and when the week is complete.'
      : `This pathway makes ${indicators.length} of 5 student-facing signals visible. The foundation is usable, but the missing signals still require students to infer part of the learning path.`,
    quality_indicators: indicators,
    strengths: signals.filter(signal => signal.met).map(signal => signal.strength),
    gaps: missing.map(signal => signal.gap),
    recommended_next_step: missing.length
      ? `Revise the ${missing.length} missing pathway signal${missing.length === 1 ? '' : 's'}, then read the module once from a student's starting point.`
      : 'Preview the pathway in Canvas Student View and verify dates, workload, accessibility, alignment, and submission directions before publishing.',
    human_review_note: 'The instructor must verify course alignment, workload, accessibility, dates, policies, and accuracy before publishing.'
  };
}

function pcNormalizeS1WeekPlanAnalysis(remote, fallback) {
  if (!remote || typeof remote !== 'object') return fallback;
  const usefulText = (value, minimum, fallbackValue) => {
    const text = String(value || '').trim();
    return text.length >= minimum ? text : fallbackValue;
  };
  const usefulList = (value, fallbackValue) => {
    const list = Array.isArray(value)
      ? value.map(item => String(item || '').trim()).filter(item => item.length >= 24)
      : [];
    return list.length ? list : fallbackValue;
  };
  return {
    status: fallback.status,
    summary: usefulText(remote.summary, 60, fallback.summary),
    quality_indicators: [...fallback.quality_indicators],
    strengths: usefulList(remote.strengths, fallback.strengths),
    gaps: usefulList(remote.gaps, fallback.gaps),
    recommended_next_step: usefulText(remote.recommended_next_step, 35, fallback.recommended_next_step),
    human_review_note: usefulText(remote.human_review_note, 35, fallback.human_review_note)
  };
}

function pcRecordS1WeekPlanAnalysis(instructorAnswers, analysis, response) {
  const scenario = scenarioData[SCENARIO_INDEX.CONTENT_AVALANCHE];
  if (!scenario) return false;
  const labels = {
    CLEAR_DESTINATION: 'Clear destination or purpose',
    VISIBLE_START: 'Visible starting point',
    LEARNING_SEQUENCE: 'Visible learning sequence',
    VISIBLE_SUBMISSION: 'Visible submission and evidence',
    CONTINUATION_CUE: 'Visible continuation cue'
  };
  const previousAttempts = Number(scenario.attempts || 0);
  scenario.attempts = previousAttempts + 1;
  scenario.prompts = Array.isArray(scenario.prompts) ? scenario.prompts : [];
  scenario.prompts.push([
    `Instructor week/module: ${instructorAnswers.week}`,
    `Destination: ${instructorAnswers.destination}`,
    `START HERE: ${instructorAnswers.start || ''}`,
    `LEARN: ${instructorAnswers.learn || ''}`,
    `PRACTICE: ${instructorAnswers.practice || ''}`,
    `SUBMIT: ${instructorAnswers.submit || ''}`,
    `CONTINUE: ${instructorAnswers.continue || ''}`
  ].join(' | '));
  scenario.currentScore = Array.isArray(analysis.quality_indicators) ? analysis.quality_indicators.length : 0;
  if (previousAttempts === 0) scenario.initialScore = scenario.currentScore;
  scenario.scoreDelta = scenario.currentScore - Number(scenario.initialScore || 0);
  scenario.bestScore = Math.max(Number(scenario.bestScore || 0), scenario.currentScore);
  scenario.finalResponse = analysis.summary || '';
  scenario.oscqrLit = (analysis.quality_indicators || []).map(id => labels[id] || id).join('; ');
  scenario.structuredAnalysis = {
    analysis_type: 's1_transfer_plan_analysis',
    instructor_answers: { ...instructorAnswers },
    analysis: { ...analysis }
  };
  scenario.aiProvider = response?.provider || 'local-fallback';
  scenario.aiModel = response?.model || 'promptcraft-local-evaluator';
  scenario.aiRequestId = response?.request_id || '';
  scenario.aiElapsedMs = response?.elapsed_ms ?? '';
  scenario.aiUsage = response?.usage || null;
  saveIncrementalData(SCENARIO_INDEX.CONTENT_AVALANCHE, 's1_instructor_plan_analysis_complete');
  return true;
}

function pcBuildS1WeekPlanCriteria(analysis) {
  const indicators = new Set(Array.isArray(analysis.quality_indicators) ? analysis.quality_indicators : []);
  return [
    {
      id: 'CLEAR_DESTINATION',
      label: 'Clear student destination',
      met: indicators.has('CLEAR_DESTINATION'),
      pass: 'Students can see what they should understand, produce, or decide by the end of the week.',
      check: 'State the destination as something students will understand or do.'
    },
    {
      id: 'VISIBLE_START',
      label: 'Visible starting point',
      met: indicators.has('VISIBLE_START'),
      pass: 'START HERE gives students the purpose of the week and a clear first action.',
      check: 'Use START HERE to explain the week, its purpose, and what students should do first.'
    },
    {
      id: 'LEARNING_SEQUENCE',
      label: 'Preparation before submission',
      met: indicators.has('LEARNING_SEQUENCE'),
      pass: 'LEARN and PRACTICE show how students build knowledge and rehearse before submitting assessed work.',
      check: 'Include both preparation and a low-stakes opportunity to practice before submission.'
    },
    {
      id: 'VISIBLE_SUBMISSION',
      label: 'Visible submission expectations',
      met: indicators.has('VISIBLE_SUBMISSION'),
      pass: 'SUBMIT places the assessed work, evidence expectations, and directions at the point of need.',
      check: 'Explain what students submit, where it goes, and what evidence or criteria matter.'
    },
    {
      id: 'CONTINUATION_CUE',
      label: 'Clear completion and continuation cue',
      met: indicators.has('CONTINUATION_CUE'),
      pass: 'CONTINUE tells students how the week closes and what happens next.',
      check: 'Add a completion, feedback, reflection, or next-week cue.'
    }
  ];
}

function pcClearS1WeekPlanAnalysis() {
  document.getElementById('pcS1WeekPlanAnalysis')?.remove();
  document.body.classList.remove('pc-s1-reflection-analysis-active');
  return true;
}

function pcRenderS1WeekPlanAnalysis(data, analysis, analysisSource) {
  pcClearS1ReflectionLoading();
  pcClearS1WeekPlanAnalysis();
  const criteria = pcBuildS1WeekPlanCriteria(analysis);
  const score = criteria.filter(criterion => criterion.met).length;
  const displayScore = score >= 5 ? 3 : score >= 3 ? 2 : 1;
  const verdict = score >= 5 ? 'Strong learning path' : score >= 3 ? 'Developing learning path' : 'Path needs revision';
  const workspace = document.createElement('section');
  workspace.id = 'pcS1WeekPlanAnalysis';
  workspace.className = `pc-s1-reflection-analysis pc-s1-reflection-analysis--terminal pc-s1-reflection-analysis--score-${displayScore}`;
  workspace.setAttribute('role', 'dialog');
  workspace.setAttribute('aria-modal', 'true');
  workspace.setAttribute('aria-labelledby', 'pcS1WeekPlanAnalysisTitle');
  workspace.innerHTML = `
    <div class="pc-s1-reflection-analysis-shell">
      <header class="pc-s1-reflection-analysis-header">
        <span class="pc-s1-reflection-analysis-mark">
          <img src="${pcProjectUrl('assets/images/ui/babbage-mark.svg')}" alt="Babbage">
        </span>
        <div>
          <p>BABBAGE // TRANSFER_TASK // PATH_CHECK // ${esc(analysisSource)}</p>
          <h2 id="pcS1WeekPlanAnalysisTitle" tabindex="-1">Module Path Analysis</h2>
        </div>
        <span class="pc-s1-reflection-analysis-verdict">STATUS: ${esc(verdict).toUpperCase()}</span>
      </header>
      <div class="pc-s1-reflection-analysis-content">
        <section class="pc-s1-reflection-focus" aria-labelledby="pcS1WeekPlanFinding">
          <span>BABBAGE FINDING</span>
          <h3 id="pcS1WeekPlanFinding">${esc(analysis.summary)}</h3>
        </section>
        <section class="pc-s1-reflection-feedback" aria-labelledby="pcS1WeekPlanSignals">
          <p id="pcS1WeekPlanSignals" class="pc-s1-reflection-analysis-kicker">LEARNING PATH SIGNALS · ${score} OF 5 VISIBLE</p>
          <ol>
            ${criteria.map(criterion => `
              <li class="${criterion.met ? 'is-met' : 'is-missing'}">
                <span aria-hidden="true">${criterion.met ? '[PASS]' : '[CHECK]'}</span>
                <div>
                  <strong>${esc(criterion.label)}</strong>
                  <p>${esc(criterion.met ? criterion.pass : criterion.check)}</p>
                </div>
              </li>`).join('')}
          </ol>
        </section>
        <aside class="pc-s1-reflection-teaching-point">
          <span>NEXT DESIGN MOVE</span>
          <p>${esc(analysis.recommended_next_step)}</p>
          <p><strong>Instructor review:</strong> ${esc(analysis.human_review_note)}</p>
        </aside>
        <details class="pc-s1-reflection-response">
          <summary>View the module path you submitted</summary>
          <blockquote>
            <strong>${esc(data.week)}</strong><br>
            <strong>Destination:</strong> ${esc(data.destination)}<br><br>
            <strong>START HERE:</strong> ${esc(data.start || 'Not supplied')}<br>
            <strong>LEARN:</strong> ${esc(data.learn || 'Not supplied')}<br>
            <strong>PRACTICE:</strong> ${esc(data.practice || 'Not supplied')}<br>
            <strong>SUBMIT:</strong> ${esc(data.submit || 'Not supplied')}<br>
            <strong>CONTINUE:</strong> ${esc(data.continue || 'Not supplied')}
          </blockquote>
        </details>
      </div>
      <footer class="pc-s1-reflection-analysis-footer">
        <p>Babbage can identify visible pathway signals. You still verify alignment, workload, accessibility, dates, and accuracy.</p>
        <div>
          <button id="babbageTTSBtn" type="button" class="pc-shell-secondary pc-s1-reflection-tts" data-pc-action="toggle-babbage-tts" data-pc-stop-propagation="true">🔊 Read Analysis</button>
          <button type="button" class="pc-shell-secondary" data-pc-action="s1-week-plan-restart">← Revise my week</button>
          <button type="button" class="pc-shell-primary" data-pc-action="s1-complete-week-plan">Complete Scenario 1</button>
        </div>
      </footer>
    </div>`;
  document.body.appendChild(workspace);
  document.body.classList.add('pc-s1-reflection-analysis-active');
  pcScheduleScenarioTask(() => pcFocusWithoutScroll(workspace.querySelector('#pcS1WeekPlanAnalysisTitle')), 50, SCENARIO_INDEX.CONTENT_AVALANCHE);
  return true;
}

function pcShowS1WeekPlanLoading(data) {
  pcClearS1ReflectionLoading();
  const loading = document.createElement('section');
  loading.id = 'pcS1ReflectionLoading';
  loading.className = 'pc-s1-reflection-loading';
  loading.setAttribute('role', 'status');
  loading.setAttribute('aria-live', 'polite');
  loading.innerHTML = `
    <div class="pc-s1-reflection-loading-shell">
      <p class="pc-s1-reflection-loading-brand">PROMPTCRAFT // BABBAGE TRANSFER ANALYSIS BOOT</p>
      <h2>Checking the pathway for ${esc(data.week)}</h2>
      <div class="pc-s1-reflection-loading-log" aria-label="Analysis progress">
        <p>&gt; reading INSTRUCTOR_MODULE_PATH.LOG</p>
        <p>&gt; checking student destination and starting point</p>
        <p>&gt; checking preparation and practice sequence</p>
        <p>&gt; checking submission directions</p>
        <p>&gt; checking completion and continuation cue<span class="pc-s1-terminal-cursor" aria-hidden="true">_</span></p>
      </div>
      <div class="pc-s1-reflection-loading-track" aria-hidden="true"><span></span></div>
    </div>`;
  document.body.appendChild(loading);
  document.body.classList.add('pc-s1-reflection-loading-active');
  pcScheduleScenarioTask(() => pcRunS1WeekPlanAnalysis(data), 900, SCENARIO_INDEX.CONTENT_AVALANCHE);
  return true;
}

async function pcRunS1WeekPlanAnalysis(data) {
  const categoryIds = ['start', 'learn', 'practice', 'submit', 'continue'];
  const completed = categoryIds.filter(id => String(data[id] || '').trim().length >= 4);
  const root = document.querySelector('.pc-s1-week-planner');
  const fallbackAnalysis = pcBuildS1WeekPlanFallback(data, completed);
  let response = null;
  let analysis = fallbackAnalysis;
  try {
    response = await requestBabbageAnalysis({
      analysis_type: 's1_transfer_plan_analysis',
      max_output_tokens: 1400,
      system: `You are Babbage, PromptCraft's Canvas learning-path analyst. Analyze only the instructor-supplied fields. Check for a clear destination, visible starting point, LEARN plus PRACTICE preparation, visible submission and evidence expectations, and a continuation cue. Do not invent course requirements. Return a complete JSON analysis with: status (STRONG, DEVELOPING, or REVISE); a specific two- or three-sentence summary; quality_indicators using only CLEAR_DESTINATION, VISIBLE_START, LEARNING_SEQUENCE, VISIBLE_SUBMISSION, and CONTINUATION_CUE; strengths with specific references to the supplied pathway; gaps with actionable revisions; recommended_next_step; and human_review_note. Never return only a status or an empty next step.`,
      messages: [{ role: 'user', content: JSON.stringify(data, null, 2) }]
    }, 's1-transfer-plan-analysis');
    if (response?.analysis && !response.mock && response.provider !== 'local-fallback') {
      analysis = pcNormalizeS1WeekPlanAnalysis(response.analysis, fallbackAnalysis);
    }
  } catch (error) {
    console.warn('[PromptCraft] Live transfer-plan analysis unavailable; using the labeled local evaluator.', error);
  }
  if (!root?.isConnected || scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) {
    pcClearS1ReflectionLoading();
    return false;
  }
  pcRecordS1WeekPlanAnalysis(data, analysis, response);
  const transferScore = Math.max(0, Math.min(5, Array.isArray(analysis.quality_indicators) ? analysis.quality_indicators.length : 0));
  pcS1WeekPlanReward = { score: transferScore, earnedXP: awardS1TransferXP(transferScore) };
  const analysisSource = response?.analysis && !response.mock && response.provider !== 'local-fallback'
    ? 'LIVE + LOCAL VALIDATION'
    : 'LOCAL FALLBACK';
  return pcRenderS1WeekPlanAnalysis(data, analysis, analysisSource);
}

function pcAnalyzeS1WeekPlan() {
  const form = document.getElementById('pcS1WeekPlannerForm');
  if (!form) return false;
  const data = Object.fromEntries(new FormData(form).entries());
  const categoryIds = ['start', 'learn', 'practice', 'submit', 'continue'];
  const completed = categoryIds.filter(id => String(data[id] || '').trim().length >= 4);
  const status = document.getElementById('pcS1WeekPlannerStatus');
  if (!String(data.week || '').trim() || !String(data.destination || '').trim() || completed.length < 3) {
    if (status) status.textContent = 'Add a week, a destination, and at least three categories before Babbage analyzes the path.';
    return false;
  }
  pcS1WeekPlanState = data;
  const submitButton = document.getElementById('pcS1AnalyzeWeekPlan');
  if (submitButton) submitButton.disabled = true;
  if (status) status.textContent = 'Babbage is analyzing the instructor-supplied module path…';
  return pcShowS1WeekPlanLoading(data);
}

function pcCompleteS1WeekPlan() {
  const reward = pcS1WeekPlanReward || { score: 0, earnedXP: 0 };
  pcClearS1WeekPlanAnalysis();
  markScenarioComplete();
  pcPrepareS1ClassroomDialogueScene();
  pcPrepareS1MissionBoardImage(PC_S1_PREVIEW_CASES.length - 1, 'after');
  const boardText = document.getElementById('vnBoardText');
  if (boardText) boardText.textContent = 'Your module path: destination, preparation, practice, submission, and continuation.';
  const feedback = reward.score >= 5
    ? 'Your pathway gives students a visible destination, a place to begin, preparation and practice before submission, and a clear ending. That is a complete learning path, not just a list of materials.'
    : `Your pathway has ${reward.score} of 5 student-facing signals. Use Babbage's checked rows to revise the missing parts before publishing in Canvas.`;
  vnShow(reward.score >= 5 ? 'proud' : reward.score >= 3 ? 'encouraging' : 'thinking', feedback, () => {
    openMainMenu('scenarios');
  }, {
    id: 'p-s1-transfer-progress',
    speaker: 'Professor Pixel',
    character: 'pixel',
    cast: [{ id: 'pixel', slot: 'right' }]
  });
  return true;
}

function pcRestartS1WeekPlan() {
  const saved = pcS1WeekPlanState;
  pcClearS1WeekPlanAnalysis();
  pcRenderS1WeekPlanner();
  const form = document.getElementById('pcS1WeekPlannerForm');
  if (form && saved) Object.entries(saved).forEach(([name, value]) => {
    const field = form.elements.namedItem(name);
    if (field) field.value = value;
  });
  return true;
}

function pcRenderS1CanvasRescue() {
  const area = document.getElementById('chat');
  const container = document.getElementById('inputContainer');
  if (!area || !pcS1PreviewChecks.every(check => check.answered)) return false;

  return pcRenderS1WeekPlanner();

  pcS1RescueBriefAnswers = {};
  pcS1RescueProposalAnswers = {};
  pcS1RescueAIAnalysis = null;
  pcS1RescueAISource = 'local-fallback';
  if (container) {
    container.className = 'pc-s1-rescue-host';
    container.innerHTML = '';
    container.style.display = 'none';
  }

  area.innerHTML = `
    <section class="pc-s1-rescue" role="region" aria-labelledby="pcS1RescueTitle">
      <header class="pc-s1-rescue-hero">
        <span>Case files complete · Applied mission</span>
        <div>
          <p>Scenario 1 · Canvas course rescue</p>
          <h2 id="pcS1RescueTitle">Build the brief before Babbage builds the draft.</h2>
          <p>The case files showed what AI can inspect and draft. Now you decide what information it receives, what boundaries it follows, and which recommendations are safe to use.</p>
        </div>
        <ol aria-label="Canvas Rescue progress">
          <li class="is-active"><b>1</b> Brief</li>
          <li><b>2</b> AI draft</li>
          <li><b>3</b> Instructor review</li>
        </ol>
      </header>

      <form id="pcS1RescueBriefForm" class="pc-s1-rescue-brief">
        <div class="pc-s1-rescue-intro">
          <div>
            <span>Player task</span>
            <h3>Choose the strongest information for the AI design brief.</h3>
          </div>
          <p>Babbage will propose a repair—not publish one. Specific evidence and boundaries produce a draft the instructor can actually evaluate.</p>
        </div>
        <div class="pc-s1-rescue-brief-grid">
          ${PC_S1_RESCUE_BRIEF_SECTIONS.map(section => `
            <fieldset class="pc-s1-rescue-brief-card">
              <legend><b>${esc(section.number)}</b><span>${esc(section.label)}</span></legend>
              <p>${esc(section.prompt)}</p>
              <div class="pc-s1-rescue-brief-choices">
                ${section.choices.map(choice => `
                  <label>
                    <input type="radio" name="pc-s1-rescue-${esc(section.id)}" value="${esc(choice.id)}"
                           data-pc-action="s1-rescue-select-brief" />
                    <span>${esc(choice.label)}</span>
                  </label>`).join('')}
              </div>
            </fieldset>`).join('')}
        </div>
        <footer class="pc-s1-rescue-actions">
          <p id="pcS1RescueBriefCounter" aria-live="polite">0 of ${PC_S1_RESCUE_BRIEF_SECTIONS.length} brief decisions supplied</p>
          <button type="button" class="pc-shell-secondary" data-pc-action="s1-rescue-return-cases">Return to case files</button>
          <button id="pcS1GenerateDraft" type="button" class="pc-shell-primary" data-pc-action="s1-rescue-generate-draft" disabled>Send brief to Babbage →</button>
        </footer>
      </form>
    </section>`;
  resetSectionScroll(area, container);
  return true;
}

async function pcGenerateS1RescueDraft() {
  pcS1RescueBriefAnswers = pcGetS1RescueBriefAnswers();
  if (Object.values(pcS1RescueBriefAnswers).filter(Boolean).length !== PC_S1_RESCUE_BRIEF_SECTIONS.length) return false;
  const root = document.querySelector('.pc-s1-rescue');
  if (!root) return false;

  const runToken = pcCaptureScenarioRun(SCENARIO_INDEX.CONTENT_AVALANCHE);
  const startedAt = performance.now();

  root.innerHTML = `
    <section class="pc-s1-rescue-loading" role="status" aria-live="polite">
      <div class="pc-s1-rescue-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
      <span>Babbage · Analyzing supplied brief</span>
      <h2>Building a reviewable Canvas repair—not changing the course.</h2>
      <p>Inventorying evidence · checking boundaries · marking assumptions · drafting recommendations</p>
    </section>`;

  let response = null;
  try {
    response = await requestBabbageAnalysis({
      analysis_type: 's1_canvas_rescue',
      max_output_tokens: 2600,
      system: pcBuildS1RescueSystemPrompt(),
      messages: [{
        role: 'user',
        content: `Build a reviewable Canvas repair from this instructor-supplied brief:\n${JSON.stringify(pcGetS1RescueBriefForBabbage(), null, 2)}`
      }]
    }, 's1-canvas-rescue');
  } catch (error) {
    console.warn('[PromptCraft] S1 Canvas Rescue analysis unavailable; using the bounded local fallback.', error);
  }
  if (!pcIsScenarioRunCurrent(runToken)) return false;

  const analysis = response?.analysis || response?.structured || null;
  pcS1RescueAIAnalysis = pcNormalizeS1RescueAIAnalysis(analysis);
  pcS1RescueAISource = response && !response.mock && response.provider !== 'local-fallback' ? 'live' : 'local-fallback';
  const remaining = 1050 - (performance.now() - startedAt);
  if (remaining > 0) await new Promise(resolve => window.setTimeout(resolve, remaining));
  if (!pcIsScenarioRunCurrent(runToken)) return false;
  pcRenderS1RescueDraftReview();
  return true;
}

function pcRenderS1RescueDraftReview() {
  const root = document.querySelector('.pc-s1-rescue');
  if (!root || scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) return false;
  pcS1RescueProposalAnswers = {};
  const briefScore = PC_S1_RESCUE_BRIEF_SECTIONS.filter(section => pcS1RescueBriefAnswers[section.id] === section.correctChoice).length;
  const analysis = pcS1RescueAIAnalysis || pcNormalizeS1RescueAIAnalysis(null);
  const proposals = analysis.proposals;
  const sourceLabel = pcS1RescueAISource === 'live' ? 'Live Babbage draft' : 'Babbage test fallback';

  root.innerHTML = `
    <header class="pc-s1-rescue-hero pc-s1-rescue-hero--review">
      <span>${sourceLabel} ready · Instructor review required</span>
      <div>
        <p>Canvas Rescue · Step 2 of 3</p>
        <h2>Babbage found useful repairs—and two recommendations it cannot safely decide.</h2>
        <p>Your brief supplied ${briefScore} of ${PC_S1_RESCUE_BRIEF_SECTIONS.length} strong design signals. ${esc(analysis.brief_summary)} Review every recommendation before anything reaches Canvas.</p>
      </div>
      <ol aria-label="Canvas Rescue progress">
        <li class="is-complete"><b>✓</b> Brief</li>
        <li class="is-active"><b>2</b> AI draft</li>
        <li><b>3</b> Instructor review</li>
      </ol>
    </header>
    <section class="pc-s1-rescue-review" aria-labelledby="pcS1ReviewTitle">
      <div class="pc-s1-rescue-intro">
        <div><span>Your decision</span><h3 id="pcS1ReviewTitle">Keep the repair or return it for instructor review.</h3></div>
        <p>AI can make a recommendation sound confident even when the underlying instructional decision is not verified.</p>
      </div>
      <div class="pc-s1-rescue-proposals">
        ${proposals.map((proposal, index) => `
          <article class="pc-s1-rescue-proposal" data-proposal-id="${esc(proposal.id)}">
            <div class="pc-s1-rescue-proposal-copy">
              <span>AI proposal ${String(index + 1).padStart(2, '0')}</span>
              <h3>${esc(proposal.title)}</h3>
              <p>${esc(proposal.detail)}</p>
            </div>
            <div class="pc-s1-rescue-proposal-actions" role="group" aria-label="Review ${esc(proposal.title)}">
              <label><input type="radio" name="pc-s1-proposal-${esc(proposal.id)}" value="use" data-pc-action="s1-rescue-review-proposal" /><span>Keep in draft</span></label>
              <label><input type="radio" name="pc-s1-proposal-${esc(proposal.id)}" value="review" data-pc-action="s1-rescue-review-proposal" /><span>Return for review</span></label>
            </div>
          </article>`).join('')}
      </div>
      <footer class="pc-s1-rescue-actions">
        <p id="pcS1RescueReviewCounter" aria-live="polite">0 of ${PC_S1_RESCUE_PROPOSALS.length} recommendations reviewed</p>
        <button type="button" class="pc-shell-secondary" data-pc-action="s1-rescue-restart">Revise the brief</button>
        <button id="pcS1CompleteReview" type="button" class="pc-shell-primary" data-pc-action="s1-rescue-complete-review" disabled>Run student-view test →</button>
      </footer>
    </section>`;
  resetSectionScroll(document.getElementById('chat'), document.getElementById('inputContainer'));
  return true;
}

function pcUpdateS1RescueProposalState() {
  pcS1RescueProposalAnswers = Object.fromEntries(PC_S1_RESCUE_PROPOSALS.map(proposal => {
    const selected = document.querySelector(`input[name="pc-s1-proposal-${proposal.id}"]:checked`);
    return [proposal.id, selected?.value || ''];
  }));
  const completed = Object.values(pcS1RescueProposalAnswers).filter(Boolean).length;
  const counter = document.getElementById('pcS1RescueReviewCounter');
  const submit = document.getElementById('pcS1CompleteReview');
  if (counter) counter.textContent = `${completed} of ${PC_S1_RESCUE_PROPOSALS.length} recommendations reviewed`;
  if (submit) submit.disabled = completed !== PC_S1_RESCUE_PROPOSALS.length;
  return completed;
}

function pcCompleteS1RescueReview() {
  if (pcUpdateS1RescueProposalState() !== PC_S1_RESCUE_PROPOSALS.length) return false;
  const root = document.querySelector('.pc-s1-rescue');
  if (!root) return false;
  const briefScore = PC_S1_RESCUE_BRIEF_SECTIONS.filter(section => pcS1RescueBriefAnswers[section.id] === section.correctChoice).length;
  const reviewScore = PC_S1_RESCUE_PROPOSALS.filter(proposal => pcS1RescueProposalAnswers[proposal.id] === proposal.expected).length;

  root.innerHTML = `
    <header class="pc-s1-rescue-hero pc-s1-rescue-hero--complete">
      <span>Student-view test complete · Development mission cleared</span>
      <div>
        <p>Canvas Rescue · Step 3 of 3</p>
        <h2>You used AI for speed without surrendering instructional judgment.</h2>
        <p>Babbage produced the first pass. You controlled the evidence, boundaries, accessibility decisions, and final course-design judgment.</p>
      </div>
      <ol aria-label="Canvas Rescue progress">
        <li class="is-complete"><b>✓</b> Brief</li><li class="is-complete"><b>✓</b> AI draft</li><li class="is-complete"><b>✓</b> Review</li>
      </ol>
    </header>
    <section class="pc-s1-rescue-result">
      <div class="pc-s1-rescue-score-row">
        <article><span>Brief specificity</span><strong>${briefScore}/${PC_S1_RESCUE_BRIEF_SECTIONS.length}</strong><p>${briefScore === PC_S1_RESCUE_BRIEF_SECTIONS.length ? 'The AI received a grounded goal, learner problem, boundaries, and reviewable deliverable.' : 'Some brief choices encouraged assumptions. Revise them to see how stronger context limits the draft.'}</p></article>
        <article><span>Instructor review</span><strong>${reviewScore}/${PC_S1_RESCUE_PROPOSALS.length}</strong><p>${reviewScore === PC_S1_RESCUE_PROPOSALS.length ? 'You kept the evidence-based repairs and intercepted the unverified accessibility and alignment decisions.' : 'Review the flagged recommendations below. Confidence is not the same as instructional authority.'}</p></article>
      </div>
      <div class="pc-s1-rescue-result-list">
        ${PC_S1_RESCUE_PROPOSALS.map(proposal => {
          const correct = pcS1RescueProposalAnswers[proposal.id] === proposal.expected;
          return `<article class="${correct ? 'is-correct' : 'needs-review'}"><span>${correct ? 'Sound judgment' : 'Reconsider'}</span><h3>${esc(proposal.title)}</h3><p>${esc(proposal.rationale)}</p></article>`;
        }).join('')}
      </div>
      <div class="pc-s1-rescue-principle">
        <span>S1 design principle</span>
        <p><strong>AI can inventory, extract, reorganize, compare, and draft.</strong> The instructor remains responsible for purpose, accuracy, accessibility, alignment, and the student experience.</p>
      </div>
      <footer class="pc-s1-rescue-actions">
        <button type="button" class="pc-shell-secondary" data-pc-action="s1-rescue-restart">Try the rescue again</button>
        <button type="button" class="pc-shell-primary" data-pc-action="open-main-menu" data-pc-panel="scenarios">Return to Scenario Select</button>
      </footer>
    </section>`;

  pcPrepareS1ClassroomDialogueScene();
  playPixelSequence('s1_canvas_rescue_complete');
  resetSectionScroll(document.getElementById('chat'), document.getElementById('inputContainer'));
  return true;
}

function pcHandleS1PreviewNext() {
  if (pcS1PreviewCaseIndex < PC_S1_PREVIEW_CASES.length - 1) {
    const nextCaseIndex = pcS1PreviewCaseIndex + 1;
    return pcPlayS1PreviewBriefing(nextCaseIndex, null, { classroom: true });
  }
  if (pcS1PreviewChecks.every(check => check.answered)) return pcRenderS1CanvasRescue();
  return false;
}

function renderS1ContentAvalanchePreview({ preserveProgress = false } = {}) {
  const area = document.getElementById('chat');
  const container = document.getElementById('inputContainer');
  if (!area) return false;

  pcS1PreviewCaseIndex = 0;
  pcS1PreviewState = 'before';
  if (!preserveProgress) pcS1PreviewChecks = PC_S1_PREVIEW_CASES.map(() => pcCreateS1PreviewCheck());

  if (container) {
    container.className = 'pc-s1-preview-host';
    container.innerHTML = '';
    container.style.display = 'none';
  }

  const caseButtons = PC_S1_PREVIEW_CASES.map((item, index) => `
    <button type="button" role="tab" aria-selected="${index === 0}" tabindex="${index === 0 ? '0' : '-1'}"
            class="pc-s1-case-tab${index === 0 ? ' is-active' : ''}"
            data-pc-action="s1-preview-select-case" data-pc-case-index="${index}">
      <b>${String(index + 1).padStart(2, '0')}</b><span>${esc(item.label)}</span>
    </button>`).join('');

  area.innerHTML = `
    <section class="pc-s1-preview" role="region" aria-labelledby="pcS1PreviewTitle">
      <header class="pc-s1-preview-hero">
        <span class="pc-s1-preview-status">Development preview · Evidence station</span>
        <div class="pc-activity-kicker">Scenario 1 · Canvas course design</div>
        <h2 id="pcS1PreviewTitle">The Content Avalanche</h2>
        <p>Compare real Canvas screens, explain which redesign helps students, and let Babbage test your reasoning.</p>
        <div class="pc-s1-preview-task" aria-labelledby="pcS1TaskTitle">
          <div>
            <span>Your mission</span>
            <h3 id="pcS1TaskTitle">Find the learning path hidden inside the content.</h3>
          </div>
          <ol>
            <li><b>Inspect Before</b> and notice what a student or instructor must hunt for.</li>
            <li><b>Reveal After</b> and compare the same Canvas task.</li>
            <li><b>Explain</b> why the redesign is stronger using visible evidence.</li>
            <li><b>Analyze</b> your reasoning in Babbage’s terminal.</li>
            <li><b>Transfer</b> the pattern to one week of your own course.</li>
          </ol>
        </div>
      </header>

      <nav class="pc-s1-case-tabs" role="tablist" aria-label="Content Avalanche case files">${caseButtons}</nav>

      <article class="pc-s1-evidence-station" aria-labelledby="pcS1CaseTitle">
        <header class="pc-s1-evidence-heading">
          <div>
            <span id="pcS1CaseCounter">Case file 1 of 4</span>
            <small id="pcS1CaseKicker"></small>
            <h3 id="pcS1CaseTitle"></h3>
          </div>
        </header>

        <div class="pc-s1-evidence-viewer" id="pcS1EvidenceViewer" data-state="before">
          <div class="pc-s1-viewer-bar">
            <span class="pc-s1-viewer-state">Before</span>
            <span id="pcS1EvidencePerspective"></span>
            <button id="pcS1EvidenceFullSize" type="button" class="pc-s1-full-size-trigger" data-pc-action="s1-open-evidence-modal">Open full size ⛶</button>
          </div>
          <button id="pcS1EvidenceFullSizeImage" type="button" class="pc-s1-evidence-image-link" data-pc-action="s1-open-evidence-modal">
            <img id="pcS1EvidenceImage" src="" alt="" />
          </button>
        </div>

        <div class="pc-s1-inspection-panel" aria-live="polite">
          <div class="pc-s1-inspection-copy">
            <span id="pcS1CueLabel">Case question</span>
            <p id="pcS1Cue"></p>
          </div>
          <div class="pc-s1-case-handoff pc-s1-case-reflection" id="pcS1Debrief">
            <div class="pc-s1-case-reflection-head">
              <div>
                <span>Compare the evidence</span>
                <h4 id="pcS1CaseReflectionPrompt">Why is the After version stronger?</h4>
              </div>
              <div class="pc-s1-state-switch" role="group" aria-label="Choose comparison view">
                <button type="button" class="is-active" aria-pressed="true" data-pc-action="s1-preview-toggle-state" data-pc-state="before">Before</button>
                <button type="button" aria-pressed="false" data-pc-action="s1-preview-toggle-state" data-pc-state="after">Reveal After</button>
              </div>
            </div>
            <p id="pcS1CaseReflectionStatus" class="pc-s1-case-reflection-status"></p>
            <label for="pcS1CaseReflectionText">Your comparison</label>
            <textarea id="pcS1CaseReflectionText" rows="5" maxlength="900"></textarea>
            <div class="pc-s1-case-reflection-actions">
              <span id="pcS1CaseReflectionCount" aria-live="polite">0 of 12 words minimum</span>
              <button id="pcS1CaseReflectionSubmit" type="button" class="pc-shell-primary" data-pc-action="s1-submit-case-reflection" disabled>Analyze with Babbage →</button>
            </div>
          </div>
        </div>

        <footer class="pc-s1-evidence-actions">
          <button id="pcS1PreviousCase" type="button" class="pc-shell-secondary" data-pc-action="s1-preview-previous-case">← Previous case</button>
          <p>Compare the screens, explain the improvement, and complete Babbage’s analysis before moving on.</p>
          <button id="pcS1NextCase" type="button" class="pc-shell-primary" data-pc-action="s1-preview-next-case">Next case file →</button>
          <button type="button" class="pc-shell-secondary" data-pc-action="open-main-menu" data-pc-panel="scenarios">Exit preview</button>
        </footer>
      </article>
    </section>`;

  pcRenderS1PreviewEvidence();
  resetSectionScroll(area, container);
  return true;
}

pcRegisterUIActions({
  's1-preview-select-case': target => pcSelectS1PreviewCase(target.dataset.pcCaseIndex),
  's1-preview-toggle-state': target => pcSetS1PreviewState(target.dataset.pcState),
  's1-open-evidence-modal': () => pcOpenS1EvidenceModal(),
  's1-close-evidence-modal': () => pcCloseS1EvidenceModal(),
  's1-evidence-zoom': target => pcSetS1EvidenceModalZoom(target.dataset.pcEvidenceZoom),
  's1-submit-case-reflection': () => pcSubmitS1CaseReflection(),
  's1-complete-after-reflection': () => pcCompleteS1AfterReflection(),
  's1-preview-previous-case': () => pcSelectS1PreviewCase(pcS1PreviewCaseIndex - 1),
  's1-preview-next-case': () => pcHandleS1PreviewNext(),
  's1-rescue-select-brief': () => pcUpdateS1RescueBriefState(),
  's1-rescue-generate-draft': () => pcGenerateS1RescueDraft(),
  's1-rescue-review-proposal': () => pcUpdateS1RescueProposalState(),
  's1-rescue-complete-review': () => pcCompleteS1RescueReview(),
  's1-rescue-restart': () => pcRenderS1CanvasRescue(),
  's1-rescue-return-cases': () => renderS1ContentAvalanchePreview({ preserveProgress: true }),
  's1-week-plan-analyze': () => pcAnalyzeS1WeekPlan(),
  's1-week-plan-restart': () => pcRestartS1WeekPlan(),
  's1-complete-week-plan': () => pcCompleteS1WeekPlan()
});

pcExposeGlobals({ pcFillS1TransferDevTask });

