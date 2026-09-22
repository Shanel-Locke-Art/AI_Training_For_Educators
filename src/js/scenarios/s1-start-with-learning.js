/* PROMPTCRAFT S1 — START WITH THE LEARNING
   Rebuild slice 1: explore Maya's intentionally unclear Canvas module. */

const PC_S1_MO_ASSET = 'assets/images/ui/mo-river-otter.png';

const PC_S1_LEARNING_ITEMS = Object.freeze([
  Object.freeze({
    id: 'food-access-reading',
    moduleTitle: 'Food_Access_Reading',
    typeLabel: 'Page',
    pageTitle: 'Food Access and Community Health',
    mayaQuote:
      'This reading explains how where people live can shape access to affordable, nutritious food and how that can affect health.',
    contentHTML: `
      <p>Access to nutritious food is shaped by more than individual choices. Transportation, household income, store location, work schedules, and the cost of fresh food can all affect what is realistically available to a household.</p>
      <p>Communities with limited access to full-service grocery stores are sometimes described as food deserts, although the term does not capture every local condition. A neighborhood may technically have food nearby while residents still face barriers related to price, transportation, disability, or store hours.</p>
      <h2>As you read</h2>
      <p>Pay attention to the difference between <strong>food availability</strong> and <strong>food access</strong>. Think about which community conditions can influence both.</p>
      <p><strong>Reading:</strong> Community Food Access Overview, pp. 4–11.</p>
    `
  }),
  Object.freeze({
    id: 'food-access-video',
    moduleTitle: 'FA_video_03',
    typeLabel: 'Video',
    pageTitle: 'Food Deserts and Community Barriers',
    mayaQuote:
      'This was the short video about what a food desert is, how it can affect a community, and some barriers people face when trying to get nutritious food.',
    contentHTML: `
      <p>Watch the short video below before continuing with the module.</p>
      <div class="pc-s1-canvas-video-player" role="img" aria-label="Embedded video player titled Food Deserts and Community Barriers, 6 minutes 18 seconds">
        <div class="pc-s1-canvas-video-screen">
          <button type="button" class="pc-s1-canvas-video-play" aria-label="Play Food Deserts and Community Barriers" data-pc-action="s1-learning-prevent-link">
            <span aria-hidden="true"></span>
          </button>
          <div class="pc-s1-canvas-video-overlay">
            <strong>Food Deserts and Community Barriers</strong>
            <span>6:18</span>
          </div>
          <div class="pc-s1-canvas-video-controls" aria-hidden="true">
            <span class="pc-s1-canvas-video-progress"><i></i></span>
            <span class="pc-s1-canvas-video-time">0:00 / 6:18</span>
          </div>
        </div>
      </div>
      <p>The video introduces several barriers to food access, including transportation, distance, affordability, and limited store selection.</p>
      <p><a href="#" data-pc-action="s1-learning-prevent-link">Video transcript</a></p>
    `
  }),
  Object.freeze({
    id: 'module-terms',
    moduleTitle: 'M3_terms',
    typeLabel: 'Page',
    pageTitle: 'Module 3 Terms',
    mayaQuote:
      'This page is mostly vocabulary: food access, food insecurity, food desert, transportation barrier, and social determinants of health.',
    contentHTML: `
      <p>Review these terms for Module 3.</p>
      <h2>Food access</h2>
      <p>The ability to obtain sufficient, affordable, and nutritious food.</p>
      <h2>Food insecurity</h2>
      <p>Limited or uncertain access to adequate food.</p>
      <h2>Food desert</h2>
      <p>A commonly used term for an area where residents have limited access to affordable, nutritious food retailers.</p>
      <h2>Transportation barrier</h2>
      <p>A transportation-related condition that makes it harder to reach needed goods or services.</p>
      <h2>Social determinants of health</h2>
      <p>The conditions in which people are born, grow, live, work, and age that can influence health outcomes.</p>
    `
  }),
  Object.freeze({
    id: 'discussion-3',
    moduleTitle: 'Discussion 3',
    typeLabel: 'Discussion',
    pageTitle: 'Discussion 3',
    mayaQuote:
      'This discussion asks me to describe one food-access barrier in a community and respond to two classmates.',
    contentHTML: `
      <p><strong>Due Sunday at 11:59 p.m.</strong></p>
      <p>After completing this week's reading and video, describe one barrier that could make it difficult for people in a community to access nutritious food.</p>
      <p>In your initial post, explain why the barrier matters. Then reply to at least two classmates.</p>
      <h2>Requirements</h2>
      <ul>
        <li>Initial post: approximately 200 words</li>
        <li>Two replies: approximately 75 words each</li>
        <li>Use at least one idea from this week's materials</li>
      </ul>
    `
  }),
  Object.freeze({
    id: 'quiz-3',
    moduleTitle: 'Quiz 3',
    typeLabel: 'Quiz',
    pageTitle: 'Quiz 3',
    mayaQuote:
      'This quiz checks whether I remember the main terms and examples from the reading and video.',
    contentHTML: `
      <p><strong>10 points · 5 questions · 1 attempt</strong></p>
      <p>This quiz covers the Module 3 reading, video, and vocabulary.</p>
      <h2>Instructions</h2>
      <p>Select the best answer for each question. Questions focus on definitions and examples from the module materials.</p>
      <p>Once you begin, complete the quiz in one sitting.</p>
    `
  })
]);

const PC_S1_LEARNING_DEFAULT_QUOTE =
  'These file names do not tell me much about what I am supposed to do first. I would probably start clicking until something made sense.';

const PC_S1_MY_COURSE_STORAGE_KEY = 'promptcraft_my_course_s1_v1';
const PC_S1_GUIDE_STORAGE_KEY = 'promptcraft_s1_course_guide_v1';

const PC_S1_SUGGESTED_PURPOSES = Object.freeze({
  'food-access-reading': 'prepare',
  'food-access-video': 'prepare',
  'module-terms': 'prepare',
  'discussion-3': 'practice',
  'quiz-3': 'evidence'
});

const PC_S1_PURPOSE_LABELS = Object.freeze({ prepare: 'Prepare', practice: 'Practice', evidence: 'Evidence' });

const PC_S1_OSCQR_STANDARDS = Object.freeze([
  Object.freeze({ number: 2, title: 'Module overview and predictability', connection: 'Module overviews, activity names, and sequence make course work easier to find and anticipate.' }),
  Object.freeze({ number: 9, title: 'Measurable alignment', connection: 'Objectives, learning activities, and assessments are checked against the same intended learning.' }),
  Object.freeze({ number: 16, title: 'Logical, uncluttered navigation', connection: 'Related work is organized together with consistent structure and self-evident titles.' }),
  Object.freeze({ number: 19, title: 'Clear instructions', connection: 'Students can tell what to do, what to produce, and what happens next.' }),
  Object.freeze({ number: 21, title: 'Readable headings and structure', connection: 'Text headers and heading styles reveal the purpose and structure of the module.' }),
  Object.freeze({ number: 45, title: 'Authentic evidence of mastery', connection: 'The module includes an appropriate way for students to demonstrate the intended learning.' }),
  Object.freeze({ number: 46, title: 'Clear assessment criteria', connection: 'Students can see the criteria for the evidence they are expected to produce.' })
]);

function pcS1OSCQRLabel() {
  return PC_S1_OSCQR_STANDARDS.map(item => `OSCQR ${item.number}: ${item.title}`).join(' | ');
}

function pcRenderS1OSCQRStandards() {
  return `<section class="pc-s1-guide-section pc-s1-oscqr-section" aria-labelledby="pcS1OSCQRHeading">
    <span class="pc-s1-result-eyebrow">OSCQR 4.1 connections</span>
    <h3 id="pcS1OSCQRHeading">Standards addressed in this guide</h3>
    <p>These standards are the direct course-design connections for the work in Scenario 1.</p>
    <div class="pc-s1-oscqr-grid">${PC_S1_OSCQR_STANDARDS.map(item => `<article><strong><span>OSCQR ${item.number}</span>${esc(item.title)}</strong><p>${esc(item.connection)}</p></article>`).join('')}</div>
  </section>`;
}

function pcRecordS1LearningProgress(eventType, score, promptText, responseText, detail = {}) {
  const data = scenarioData?.[SCENARIO_INDEX.CONTENT_AVALANCHE];
  if (!data) return false;
  data.attempts = Number(data.attempts || 0) + 1;
  const previous = Number(data.currentScore || 0);
  data.currentScore = Math.max(0, Math.min(5, Number(score) || 0));
  data.bestScore = Math.max(Number(data.bestScore || 0), data.currentScore);
  data.scoreDelta = Number((data.currentScore - previous).toFixed(2));
  data.prompts = Array.isArray(data.prompts) ? data.prompts : [];
  data.prompts.push(String(promptText || eventType));
  data.finalResponse = String(responseText || data.finalResponse || '');
  data.oscqrLit = pcS1OSCQRLabel();
  data.s1LearningPath = { ...(data.s1LearningPath || {}), ...detail, lastEvent: eventType };
  saveIncrementalData(SCENARIO_INDEX.CONTENT_AVALANCHE, eventType);
  return true;
}

function pcEvaluateS1Organization() {
  const placements = pcS1LearningState?.organization || {};
  const items = PC_S1_LEARNING_ITEMS.map((item, index) => {
    const actual = placements[item.id] || '';
    const suggested = PC_S1_SUGGESTED_PURPOSES[item.id] || '';
    return {
      id: item.id,
      title: pcS1LearningState?.renamedTitles?.[index] || item.moduleTitle,
      type: item.typeLabel,
      actual,
      suggested,
      matches: Boolean(actual && suggested && actual === suggested)
    };
  });
  const mismatches = items.filter(item => !item.matches);
  const matchCount = items.length - mismatches.length;
  let mayaQuote = 'The headers make the module easier to scan, but some placements still make the learning path hard to predict.';
  if (matchCount === items.length) {
    mayaQuote = 'This is much easier to scan. The titles tell me what each activity is for, and the headers give me a clear path from preparation to practice to evidence.';
  } else if (matchCount >= 3) {
    const first = mismatches[0];
    mayaQuote = `This is easier to scan, but I would still pause at “${first.title}.” I am not sure it belongs under ${PC_S1_PURPOSE_LABELS[first.actual] || 'that header'} if its main job is ${PC_S1_PURPOSE_LABELS[first.suggested] || 'different'}.`;
  } else {
    const examples = mismatches.slice(0, 2).map(item => `“${item.title}”`).join(' and ');
    mayaQuote = `The headers help me see the structure, but the path still feels mixed up. ${examples} would make me stop and wonder what I am supposed to be doing at that point.`;
  }
  const suggestions = mismatches.map(item => `${item.title} belongs under ${PC_S1_PURPOSE_LABELS[item.suggested]} because its main purpose is ${item.suggested === 'prepare' ? 'introducing or reviewing ideas' : item.suggested === 'practice' ? 'trying the work with feedback' : 'showing what students learned'}.`);
  return { items, mismatches, matchCount, total: items.length, mayaQuote, suggestions };
}

function pcEmptyS1MyCourse() {
  return { moduleTitle: '', intendedLearning: '', activities: ['', '', '', ''] };
}

function pcLoadS1MyCourse() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PC_S1_MY_COURSE_STORAGE_KEY) || 'null');
    if (!parsed || typeof parsed !== 'object') return pcEmptyS1MyCourse();
    const moduleTitle = String(parsed.moduleTitle || '');
    const intendedLearning = String(parsed.intendedLearning || '');
    const activities = Array.from({ length: 4 }, (_, index) => String(parsed.activities?.[index] || ''));
    const isLegacyDevExample = moduleTitle === 'DEV Module Overview'
      && intendedLearning.startsWith('Students will analyze a real course problem');
    return isLegacyDevExample ? pcEmptyS1MyCourse() : { moduleTitle, intendedLearning, activities };
  } catch (_error) {
    return pcEmptyS1MyCourse();
  }
}

function pcSaveS1MyCourse(data = pcS1LearningState?.myCourse) {
  if (!data) return false;
  try {
    localStorage.setItem(PC_S1_MY_COURSE_STORAGE_KEY, JSON.stringify({
      moduleTitle: String(data.moduleTitle || ''),
      intendedLearning: String(data.intendedLearning || ''),
      activities: Array.from({ length: 4 }, (_, index) => String(data.activities?.[index] || ''))
    }));
    return true;
  } catch (_error) {
    return false;
  }
}


function pcLoadS1Guide() {
  const empty = { step1: { added: false, personalizedInsight: null, personalizedNote: '', generatedAt: '' }, myCourseReview: null };
  try {
    const parsed = JSON.parse(localStorage.getItem(PC_S1_GUIDE_STORAGE_KEY) || 'null');
    if (!parsed || typeof parsed !== 'object') return empty;
    return {
      step1: {
        added: Boolean(parsed.step1?.added),
        personalizedInsight: parsed.step1?.personalizedInsight && typeof parsed.step1.personalizedInsight === 'object' ? parsed.step1.personalizedInsight : null,
        personalizedNote: String(parsed.step1?.personalizedNote || ''),
        generatedAt: String(parsed.step1?.generatedAt || '')
      },
      myCourseReview: parsed.myCourseReview && typeof parsed.myCourseReview === 'object' ? parsed.myCourseReview : null
    };
  } catch (_error) {
    return empty;
  }
}

function pcSaveS1Guide(guide = pcS1LearningState?.guide) {
  if (!guide) return false;
  try {
    localStorage.setItem(PC_S1_GUIDE_STORAGE_KEY, JSON.stringify(guide));
    return true;
  } catch (_error) {
    return false;
  }
}

let pcS1LearningState = {
  view: 'module',
  activeIndex: 0,
  opened: new Set(),
  checkpoint: false,
  renameIndex: 0,
  renamedTitles: new Array(PC_S1_LEARNING_ITEMS.length).fill(''),
  renameNotice: '',
  organization: Object.fromEntries(PC_S1_LEARNING_ITEMS.map(item => [item.id, ''])),
  organizationNotice: '',
  diagnosisChoice: '',
  diagnosisConfirmed: false,
  organizationXPEarned: 0,
  diagnosisXPEarned: 0,
  guideXPEarned: 0,
  myCourseXPEarned: 0,
  transferXPEarned: 0,
  guide: pcLoadS1Guide(),
  guideBabbageResponse: null,
  myCourseStep: 'focus',
  myCourse: pcLoadS1MyCourse(),
  myCourseNotice: '',
  myCourseBabbageResponse: null
};

function pcResetS1LearningState() {
  pcS1LearningState = {
    view: 'module',
    activeIndex: 0,
    opened: new Set(),
    checkpoint: false,
    renameIndex: 0,
    renamedTitles: new Array(PC_S1_LEARNING_ITEMS.length).fill(''),
    renameNotice: '',
    organization: Object.fromEntries(PC_S1_LEARNING_ITEMS.map(item => [item.id, ''])),
    organizationNotice: '',
    diagnosisChoice: '',
    diagnosisConfirmed: false,
    organizationXPEarned: 0,
    diagnosisXPEarned: 0,
    guideXPEarned: 0,
    myCourseXPEarned: 0,
    transferXPEarned: 0,
    guide: pcLoadS1Guide(),
    guideBabbageResponse: null,
    myCourseStep: 'focus',
    myCourse: pcLoadS1MyCourse(),
    myCourseNotice: '',
    myCourseBabbageResponse: null
  };
}

function pcS1LearningAllOpened() {
  return pcS1LearningState.opened.size === PC_S1_LEARNING_ITEMS.length;
}

function pcS1LearningProgressText() {
  return `${pcS1LearningState.opened.size} of ${PC_S1_LEARNING_ITEMS.length} activities opened`;
}

function pcRenderS1MayaPanel(quote = PC_S1_LEARNING_DEFAULT_QUOTE) {
  return `
    <aside class="pc-s1-maya-panel" aria-labelledby="pcS1MayaName">
      <div class="pc-s1-maya-panel-inner">
        <div class="pc-s1-maya-quote" aria-live="polite">
          <span id="pcS1MayaName">Maya</span>
          <p>${esc(quote)}</p>
        </div>
        <div class="pc-s1-maya-art-wrap">
          <img class="pc-s1-maya-art" src="${ASSETS.images.students.maya.neutral}" alt="Maya" />
        </div>
      </div>
    </aside>`;
}

function pcRenderS1CanvasGlobalNav() {
  return `
    <nav class="pc-s1-canvas-global-nav" aria-label="Canvas global navigation">
      <div class="pc-s1-canvas-global-brand" aria-hidden="true">
        <img src="${PC_S1_MO_ASSET}" alt="" />
      </div>
      <a href="#" data-pc-action="s1-learning-prevent-link"><span class="pc-s1-canvas-global-dot" aria-hidden="true"></span><b>Account</b></a>
      <a href="#" data-pc-action="s1-learning-prevent-link"><span class="pc-s1-canvas-global-glyph" aria-hidden="true">⌂</span><b>Dashboard</b></a>
      <a href="#" class="is-active" data-pc-action="s1-learning-prevent-link"><span class="pc-s1-canvas-global-glyph" aria-hidden="true">▣</span><b>Courses</b></a>
      <a href="#" data-pc-action="s1-learning-prevent-link"><span class="pc-s1-canvas-global-glyph" aria-hidden="true">□</span><b>Calendar</b></a>
      <a href="#" data-pc-action="s1-learning-prevent-link"><span class="pc-s1-canvas-global-glyph" aria-hidden="true">▱</span><b>Inbox</b></a>
      <a href="#" data-pc-action="s1-learning-prevent-link"><span class="pc-s1-canvas-global-glyph" aria-hidden="true">◷</span><b>History</b></a>
      <a href="#" data-pc-action="s1-learning-prevent-link"><span class="pc-s1-canvas-global-glyph" aria-hidden="true">?</span><b>Help</b></a>
    </nav>`;
}

function pcRenderS1CanvasCourseNav() {
  return `
    <nav class="pc-s1-canvas-course-nav" aria-label="Canvas course navigation">
      <a href="#" data-pc-action="s1-learning-prevent-link">Home</a>
      <a href="#" class="is-active" aria-current="page" data-pc-action="s1-learning-show-module">Modules</a>
      <a href="#" data-pc-action="s1-learning-prevent-link">Grades</a>
      <a href="#" data-pc-action="s1-learning-prevent-link">Panorama</a>
      <a href="#" data-pc-action="s1-learning-prevent-link">Discussions</a>
      <a href="#" data-pc-action="s1-learning-prevent-link">Assignments</a>
    </nav>`;
}

function pcRenderS1CanvasTopbar(context = 'Modules') {
  return `
    <div class="pc-s1-canvas-topbar">
      <button type="button" class="pc-s1-canvas-hamburger" data-pc-action="s1-learning-prevent-link" aria-label="Canvas navigation menu"><span></span><span></span><span></span></button>
      <div class="pc-s1-canvas-course-title">Community Health <span aria-hidden="true">›</span> <strong>${esc(context)}</strong></div>
    </div>`;
}

function pcRenderS1ModuleRows() {
  return PC_S1_LEARNING_ITEMS.map((item, index) => {
    const opened = pcS1LearningState.opened.has(index);
    return `
      <li class="pc-s1-canvas-module-row${opened ? ' is-viewed' : ''}">
        <span class="pc-s1-canvas-row-indent" aria-hidden="true"></span>
        <span class="pc-s1-canvas-doc-icon" aria-hidden="true"></span>
        <button type="button" class="pc-s1-canvas-item-link" data-pc-action="s1-learning-open-item" data-pc-item-index="${index}">
          <span class="pc-s1-canvas-item-title">${esc(item.moduleTitle)}</span>
        </button>
        <span class="pc-s1-canvas-item-type">${esc(item.typeLabel)}</span>
        <span class="pc-s1-canvas-status" aria-label="${opened ? 'Viewed' : 'Not yet viewed'}" title="${opened ? 'Viewed' : 'Not yet viewed'}">${opened ? '✓' : ''}</span>
      </li>`;
  }).join('');
}

function pcRenderS1CanvasShell(mainHTML, context = 'Modules') {
  return `
    <div class="pc-s1-canvas-app" aria-label="Canvas course simulation">
      ${pcRenderS1CanvasGlobalNav()}
      <div class="pc-s1-canvas-course-shell">
        ${pcRenderS1CanvasTopbar(context)}
        <div class="pc-s1-canvas-course-body">
          ${pcRenderS1CanvasCourseNav()}
          <main class="pc-s1-canvas-main">${mainHTML}</main>
        </div>
      </div>
    </div>`;
}

function pcRenderS1CanvasModule() {
  const allOpened = pcS1LearningAllOpened();
  return pcRenderS1CanvasShell(`
    <div class="pc-s1-canvas-module-toolbar"><button type="button" data-pc-action="s1-learning-prevent-link">Collapse All</button></div>
    <div class="pc-s1-canvas-jump"><span aria-hidden="true">▸</span><strong>Jump to Module</strong></div>
    <section class="pc-s1-canvas-module" aria-labelledby="pcS1CanvasModuleTitle">
      <div class="pc-s1-canvas-module-head"><span aria-hidden="true">⌄</span><h2 id="pcS1CanvasModuleTitle">Module 3: Food Access</h2><span class="pc-s1-canvas-module-requirement">Complete all items</span></div>
      <ul class="pc-s1-canvas-module-list">${pcRenderS1ModuleRows()}</ul>
    </section>
    <div class="pc-s1-explore-footer">
      <div class="pc-s1-explore-progress" aria-live="polite">
        <strong>${esc(pcS1LearningProgressText())}</strong>
        <span>${allOpened ? 'You have inspected every activity.' : 'Open every activity to understand what Maya is being asked to do.'}</span>
      </div>
      <button type="button" class="pc-shell-primary" data-pc-action="s1-learning-complete-explore" ${allOpened ? '' : 'disabled aria-disabled="true"'}>Continue</button>
    </div>`, 'Modules');
}

function pcRenderS1CanvasItem(index) {
  const item = PC_S1_LEARNING_ITEMS[index];
  if (!item) return pcRenderS1CanvasModule();
  const isLast = index === PC_S1_LEARNING_ITEMS.length - 1;
  const allOpened = pcS1LearningAllOpened();
  const nextControl = isLast
    ? (allOpened
        ? '<button type="button" class="pc-s1-canvas-continue" data-pc-action="s1-learning-start-rename">Continue to rename ›</button>'
        : '<button type="button" data-pc-action="s1-learning-show-module">Back to Modules</button>')
    : '<button type="button" aria-label="Next" data-pc-action="s1-learning-next-item">Next ›</button>';
  return pcRenderS1CanvasShell(`
    <div class="pc-s1-canvas-item-header"><h1 id="pcS1CanvasItemTitle">${esc(item.pageTitle)}</h1></div>
    <article class="pc-s1-canvas-content-page" aria-labelledby="pcS1CanvasItemTitle">
      <div class="pc-s1-canvas-richtext">${item.contentHTML}</div>
    </article>
    <nav class="pc-s1-canvas-prev-next" aria-label="Canvas item navigation">
      <button type="button" aria-label="Previous" data-pc-action="s1-learning-prev-item" ${index <= 0 ? 'disabled aria-disabled="true"' : ''}>‹ Previous</button>
      ${nextControl}
    </nav>`, item.moduleTitle);
}

function pcRenderS1ExploreWorkspace() {
  const area = document.getElementById('chat');
  if (!area) return false;
  const isItem = pcS1LearningState.view === 'item';
  const item = isItem ? PC_S1_LEARNING_ITEMS[pcS1LearningState.activeIndex] : null;
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;

  area.innerHTML = `
    <section class="pc-s1-learning pc-scenario-stage" role="region" aria-labelledby="pcS1LearningTitle" style="--pc-s1-learning-bg:url('${sceneBg}')">
      <div class="pc-s1-learning-taskbar">
        <div>
          <span>Scenario 1 · Start With the Learning</span>
          <h1 id="pcS1LearningTitle">Explore Maya's module</h1>
          <p>Open all five activities and inspect what Maya is actually being asked to do.</p>
        </div>
        <div class="pc-s1-learning-task-status">${esc(pcS1LearningProgressText())}</div>
      </div>
      <div class="pc-s1-learning-shell">
        <div class="pc-s1-learning-workspace">
          <section class="pc-s1-canvas-frame" aria-label="Maya's Canvas course">${isItem ? pcRenderS1CanvasItem(pcS1LearningState.activeIndex) : pcRenderS1CanvasModule()}</section>
          ${pcRenderS1MayaPanel(item ? item.mayaQuote : PC_S1_LEARNING_DEFAULT_QUOTE)}
        </div>
      </div>
    </section>`;
  return true;
}

function pcOpenS1LearningItem(indexValue) {
  const index = Number(indexValue);
  if (!Number.isInteger(index) || !PC_S1_LEARNING_ITEMS[index]) return false;
  pcS1LearningState.activeIndex = index;
  pcS1LearningState.opened.add(index);
  pcS1LearningState.view = 'item';
  pcRenderS1ExploreWorkspace();
  resetSectionScroll(document.getElementById('chat'));
  return true;
}

function pcShowS1LearningModule() {
  pcS1LearningState.view = 'module';
  pcRenderS1ExploreWorkspace();
  resetSectionScroll(document.getElementById('chat'));
  return false;
}

function pcMoveS1LearningItem(delta) {
  const next = Math.min(
    PC_S1_LEARNING_ITEMS.length - 1,
    Math.max(0, pcS1LearningState.activeIndex + Number(delta || 0))
  );
  if (next === pcS1LearningState.activeIndex) return false;
  return pcOpenS1LearningItem(next);
}

function pcS1RenameProgressText() {
  const completed = pcS1LearningState.renamedTitles.filter(Boolean).length;
  return `${completed} of ${PC_S1_LEARNING_ITEMS.length} titles renamed`;
}

function pcRenderS1RenameRows() {
  return PC_S1_LEARNING_ITEMS.map((item, index) => {
    const saved = pcS1LearningState.renamedTitles[index];
    const active = index === pcS1LearningState.renameIndex;
    return `
      <li class="pc-s1-rename-row${active ? ' is-active' : ''}${saved ? ' is-saved' : ''}">
        <span class="pc-s1-canvas-row-indent" aria-hidden="true"></span>
        <span class="pc-s1-canvas-doc-icon" aria-hidden="true"></span>
        <div class="pc-s1-rename-row-copy">
          <span class="pc-s1-rename-original">${esc(item.moduleTitle)}</span>
          ${saved ? `<span class="pc-s1-rename-saved-title">${esc(saved)}</span>` : '<span class="pc-s1-rename-pending">Needs a clearer title</span>'}
        </div>
        <span class="pc-s1-canvas-item-type">${esc(item.typeLabel)}</span>
        <span class="pc-s1-canvas-status" aria-label="${saved ? 'Renamed' : active ? 'Current item' : 'Not yet renamed'}">${saved ? '✓' : ''}</span>
      </li>`;
  }).join('');
}

function pcRenderS1RenameCanvas() {
  const item = PC_S1_LEARNING_ITEMS[pcS1LearningState.renameIndex];
  const saved = pcS1LearningState.renamedTitles[pcS1LearningState.renameIndex] || '';
  return pcRenderS1CanvasShell(`
    <div class="pc-s1-rename-instructions">
      <h1>Rename the unclear module items</h1>
      <p>Type a clearer title for the highlighted activity. Maya will remind you what the page contained, but she will not give you the answer.</p>
    </div>
    <form class="pc-s1-rename-editor" data-pc-submit-action="s1-learning-save-rename">
      <div class="pc-s1-rename-editor-heading">
        <span>Current title</span>
        <strong>${esc(item.moduleTitle)}</strong>
      </div>
      <label for="pcS1RenameInput">New title</label>
      <div class="pc-s1-rename-input-row">
        <input id="pcS1RenameInput" name="newTitle" type="text" value="${esc(saved)}" autocomplete="off" required maxlength="90" placeholder="Type a clearer title" aria-describedby="pcS1RenameHelp pcS1RenameNotice" />
        <button type="submit" class="pc-shell-primary">Save title</button>
      </div>
      <p id="pcS1RenameHelp" class="pc-s1-rename-help">Use language that helps a student understand what they will open or do. Do not worry about making it perfect.</p>
      <p id="pcS1RenameNotice" class="pc-s1-rename-notice" aria-live="polite">${esc(pcS1LearningState.renameNotice || '')}</p>
    </form>
    <section class="pc-s1-canvas-module pc-s1-rename-module" aria-labelledby="pcS1RenameModuleTitle">
      <div class="pc-s1-canvas-module-head">
        <span aria-hidden="true">⌄</span>
        <h2 id="pcS1RenameModuleTitle">Module 3: Food Access</h2>
        <span class="pc-s1-canvas-module-requirement">Rename all items</span>
      </div>
      <ul class="pc-s1-canvas-module-list">${pcRenderS1RenameRows()}</ul>
    </section>`, 'Modules');
}

function pcRenderS1RenameWorkspace() {
  const area = document.getElementById('chat');
  if (!area) return false;
  const index = pcS1LearningState.renameIndex;
  const item = PC_S1_LEARNING_ITEMS[index];
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  area.innerHTML = `
    <section class="pc-s1-learning pc-scenario-stage pc-s1-renaming" role="region" aria-labelledby="pcS1LearningTitle" style="--pc-s1-learning-bg:url('${sceneBg}')">
      <div class="pc-s1-learning-taskbar">
        <div>
          <span>Scenario 1 · Start With the Learning</span>
          <h1 id="pcS1LearningTitle">Make the module easier to navigate</h1>
          <p>Rename each activity so Maya can tell what it contains before opening it.</p>
        </div>
        <div class="pc-s1-learning-task-status">${esc(pcS1RenameProgressText())}</div>
      </div>
      <div class="pc-s1-learning-shell">
        <div class="pc-s1-learning-workspace">
          <section class="pc-s1-canvas-frame" aria-label="Rename Maya's Canvas module items">${pcRenderS1RenameCanvas()}</section>
          ${pcRenderS1MayaPanel(item.mayaQuote)}
        </div>
      </div>
    </section>`;
  requestAnimationFrame(() => document.getElementById('pcS1RenameInput')?.focus());
  return true;
}

function pcStartS1Rename() {
  if (!pcS1LearningAllOpened()) return false;
  pcS1LearningState.view = 'rename';
  pcS1LearningState.checkpoint = true;
  const firstMissing = pcS1LearningState.renamedTitles.findIndex(title => !title);
  pcS1LearningState.renameIndex = firstMissing >= 0 ? firstMissing : 0;
  pcS1LearningState.renameNotice = '';
  pcRenderS1RenameWorkspace();
  resetSectionScroll(document.getElementById('chat'));
  return true;
}

function pcSaveS1Rename(form) {
  if (!form) return false;
  const input = form.querySelector('#pcS1RenameInput');
  const value = String(input?.value || '').trim().replace(/\s+/g, ' ');
  const index = pcS1LearningState.renameIndex;
  const original = PC_S1_LEARNING_ITEMS[index]?.moduleTitle || '';
  if (!value) {
    pcS1LearningState.renameNotice = 'Enter a title before saving.';
    pcRenderS1RenameWorkspace();
    return false;
  }
  if (value.toLowerCase() === original.toLowerCase()) {
    pcS1LearningState.renameNotice = 'Try a title that gives Maya more information than the original name.';
    pcRenderS1RenameWorkspace();
    return false;
  }
  pcS1LearningState.renamedTitles[index] = value;
  const nextMissing = pcS1LearningState.renamedTitles.findIndex((title, itemIndex) => itemIndex > index && !title);
  if (nextMissing >= 0) {
    pcS1LearningState.renameIndex = nextMissing;
    pcS1LearningState.renameNotice = `Saved “${value}”. Moving to the next item.`;
    pcRenderS1RenameWorkspace();
    return false;
  }
  const anyMissing = pcS1LearningState.renamedTitles.findIndex(title => !title);
  if (anyMissing >= 0) {
    pcS1LearningState.renameIndex = anyMissing;
    pcS1LearningState.renameNotice = `Saved “${value}”. One more title still needs attention.`;
    pcRenderS1RenameWorkspace();
    return false;
  }
  pcRenderS1RenameComplete();
  return false;
}

function pcRenderS1RenameComplete() {
  pcS1LearningState.view = 'rename-complete';
  const area = document.getElementById('chat');
  if (!area) return false;
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  const rows = PC_S1_LEARNING_ITEMS.map((item, index) => `
    <li><span>${esc(item.moduleTitle)}</span><strong>${esc(pcS1LearningState.renamedTitles[index])}</strong></li>`).join('');
  area.innerHTML = `
    <section class="pc-s1-learning pc-scenario-stage pc-s1-renaming" role="region" aria-labelledby="pcS1RenameCompleteTitle" style="--pc-s1-learning-bg:url('${sceneBg}')">
      <div class="pc-s1-learning-taskbar">
        <div>
          <span>Scenario 1 · Start With the Learning</span>
          <h1 id="pcS1RenameCompleteTitle">The module names are clearer</h1>
          <p>Now organize the activities so Maya can see how each one functions in the learning path.</p>
        </div>
        <div class="pc-s1-learning-task-status">5 of 5 titles renamed</div>
      </div>
      <div class="pc-s1-learning-shell">
        <div class="pc-s1-learning-workspace">
          <section class="pc-s1-rename-summary" aria-labelledby="pcS1RenameSummaryTitle">
            <h2 id="pcS1RenameSummaryTitle">Your renamed module</h2>
            <ul>${rows}</ul>
            <div class="pc-s1-rename-summary-actions">
              <button type="button" class="pc-shell-secondary" data-pc-action="s1-learning-start-rename">Review or revise titles</button>
              <button type="button" class="pc-shell-primary" data-pc-action="s1-learning-start-organize">Organize activities</button>
            </div>
          </section>
          ${pcRenderS1MayaPanel('I can tell what these activities are now. Next I need to understand how they fit together, not just what they are called.')}
        </div>
      </div>
    </section>`;
  resetSectionScroll(area);
  return true;
}

const PC_S1_ORGANIZE_ZONES = Object.freeze([
  Object.freeze({ id: 'prepare', label: 'Prepare', definition: 'Students learn or review information they will need.' }),
  Object.freeze({ id: 'practice', label: 'Practice', definition: 'Students try the skill, think with the ideas, or get feedback.' }),
  Object.freeze({ id: 'evidence', label: 'Evidence', definition: 'Students show what they can actually do for the intended learning.' })
]);

function pcS1OrganizeProgressText() {
  const placed = Object.values(pcS1LearningState.organization || {}).filter(Boolean).length;
  return `${placed} of ${PC_S1_LEARNING_ITEMS.length} activities placed`;
}

function pcRenderS1OrganizeCard(item, index) {
  const title = pcS1LearningState.renamedTitles[index] || item.moduleTitle;
  return `<div class="pc-s1-organize-card pc-drag-card" draggable="true" tabindex="0" role="button"
    aria-grabbed="false" data-pc-drag-card="${esc(item.id)}" data-pc-drag-group="activity" data-pc-home-tray="__tray__">
      <span class="pc-s1-canvas-doc-icon" aria-hidden="true"></span>
      <span class="pc-s1-organize-card-copy"><strong>${esc(title)}</strong><small>${esc(item.typeLabel)}</small></span>
    </div>`;
}

function pcRenderS1OrganizeCanvas() {
  const placements = pcS1LearningState.organization || {};
  const cardByZone = zoneId => PC_S1_LEARNING_ITEMS.map((item, index) => ({ item, index }))
    .filter(entry => (placements[entry.item.id] || '') === zoneId)
    .map(entry => pcRenderS1OrganizeCard(entry.item, entry.index)).join('');
  const unplaced = PC_S1_LEARNING_ITEMS.map((item, index) => ({ item, index }))
    .filter(entry => !(placements[entry.item.id] || ''))
    .map(entry => pcRenderS1OrganizeCard(entry.item, entry.index)).join('');
  const zones = PC_S1_ORGANIZE_ZONES.map(zone => `
    <section class="pc-s1-organize-zone" tabindex="0" role="button" aria-label="${esc(zone.label)} text header destination"
      data-pc-drop-zone="${esc(zone.id)}" data-pc-accept-group="activity" data-pc-capacity="5">
      <div class="pc-s1-organize-text-header">
        <strong>${esc(zone.label)}</strong>
        <span>${esc(zone.definition)}</span>
      </div>
      <div class="pc-s1-organize-zone-items" data-pc-zone-cards="${esc(zone.id)}">${cardByZone(zone.id)}</div>
    </section>`).join('');
  return pcRenderS1CanvasShell(`
    <div class="pc-s1-organize-instructions">
      <h1>Organize the learning path</h1>
      <p>Move every activity under the Canvas text header that best describes its purpose. Drag an activity, or select it and then select a destination.</p>
    </div>
    <div class="pc-s1-organize-board" id="pcS1OrganizeBoard">
      <section class="pc-s1-organize-tray" data-pc-drop-zone="__tray__" data-pc-is-tray="true" data-pc-capacity="999" aria-label="Activities not yet placed">
        <div class="pc-s1-organize-tray-heading"><strong>1. Activities to organize</strong><span>Select an activity, then choose a header on the right—or drag it across.</span></div>
        <div class="pc-s1-organize-tray-items" data-pc-zone-cards="__tray__">${unplaced}</div>
      </section>
      <section class="pc-s1-organize-destinations" aria-labelledby="pcS1DestinationHeading">
        <div class="pc-s1-organize-destination-heading"><strong id="pcS1DestinationHeading">2. Canvas text headers</strong><span>Place each activity under the header that describes its purpose.</span></div>
        <div class="pc-s1-organize-zones">${zones}</div>
      </section>
    </div>
    <div class="pc-s1-organize-footer">
      <span id="pcS1OrganizeStatus" tabindex="-1" role="status" aria-live="polite">${esc(pcS1OrganizeProgressText())}</span>
      <button type="button" id="pcS1OrganizeContinue" class="pc-shell-primary">Continue</button>
    </div>
    <p class="pc-s1-organize-notice" id="pcS1OrganizeNotice" aria-live="polite">${esc(pcS1LearningState.organizationNotice || '')}</p>
  `, 'Modules');
}

function pcRenderS1OrganizeWorkspace() {
  pcS1LearningState.view = 'organize';
  const area = document.getElementById('chat');
  if (!area) return false;
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  area.innerHTML = `
    <section class="pc-s1-learning pc-scenario-stage pc-s1-organizing" role="region" aria-labelledby="pcS1OrganizeTitle" style="--pc-s1-learning-bg:url('${sceneBg}')">
      <div class="pc-s1-learning-taskbar">
        <div>
          <span>Scenario 1 · Start With the Learning</span>
          <h1 id="pcS1OrganizeTitle">Organize the activities</h1>
          <p>Use Canvas-style text headers to make the purpose of the learning path visible.</p>
        </div>
        <div class="pc-s1-learning-task-status">${esc(pcS1OrganizeProgressText())}</div>
      </div>
      <div class="pc-s1-learning-shell">
        <div class="pc-s1-learning-workspace">
          <section class="pc-s1-canvas-frame" aria-label="Organize Maya's Canvas activities">${pcRenderS1OrganizeCanvas()}</section>
          ${pcRenderS1MayaPanel('These headings help me see the learning path. I need to decide whether each activity prepares me, lets me practice, or shows what I can actually do.')}
        </div>
      </div>
    </section>`;
  requestAnimationFrame(() => {
    wireDragBoard({
      rootId: 'pcS1OrganizeBoard',
      statusId: 'pcS1OrganizeStatus',
      submitId: 'pcS1OrganizeContinue',
      requiredCardIds: PC_S1_LEARNING_ITEMS.map(item => item.id),
      onMove: placements => {
        pcS1LearningState.organization = { ...placements };
        const status = document.querySelector('.pc-s1-learning-task-status');
        if (status) status.textContent = pcS1OrganizeProgressText();
      },
      onUpdate: placements => {
        pcS1LearningState.organization = { ...placements };
        const status = document.querySelector('.pc-s1-learning-task-status');
        if (status) status.textContent = pcS1OrganizeProgressText();
      },
      onSubmit: () => pcCompleteS1Organize()
    });
  });
  return true;
}

function pcStartS1Organize() {
  if (pcS1LearningState.renamedTitles.some(title => !title)) return pcStartS1Rename();
  pcS1LearningState.organizationNotice = '';
  pcRenderS1OrganizeWorkspace();
  resetSectionScroll(document.getElementById('chat'));
  return true;
}


function pcRenderS1RevisedModuleCanvas() {
  const placements = pcS1LearningState.organization || {};
  const review = pcEvaluateS1Organization();
  const rowsFor = zoneId => PC_S1_LEARNING_ITEMS.map((item, index) => ({ item, index }))
    .filter(entry => placements[entry.item.id] === zoneId)
    .map(({ item, index }) => {
      const evaluated = review.items.find(entry => entry.id === item.id);
      const purposeReasons = {
        'food-access-reading': 'The reading builds background knowledge students need before they analyze the problem.',
        'food-access-video': 'The video introduces examples and barriers students need before they apply the ideas.',
        'module-terms': 'The terms page supplies vocabulary students need before discussion or assessment.',
        'discussion-3': 'The discussion lets students practice explaining a barrier and learn from peer responses.',
        'quiz-3': 'The quiz produces evidence of what students remember, even though it does not yet measure the full intended analysis.'
      };
      const reason = purposeReasons[item.id] || `${item.typeLabel} supports ${PC_S1_PURPOSE_LABELS[evaluated?.suggested] || 'this part of the path'}.`;
      const feedback = evaluated?.matches
        ? `<span class="pc-s1-module-feedback is-good"><strong>Fits under ${esc(PC_S1_PURPOSE_LABELS[zoneId])}</strong><small>${esc(reason)}</small></span>`
        : `<span class="pc-s1-module-feedback is-reconsider"><strong>Move to ${esc(PC_S1_PURPOSE_LABELS[evaluated?.suggested] || 'another section')}</strong><small>${esc(reason)}</small></span>`;
      return `
      <li class="pc-s1-canvas-module-row is-viewed pc-s1-final-module-row${evaluated?.matches ? ' is-good-placement' : ' is-reconsider-placement'}">
        <span class="pc-s1-canvas-row-indent" aria-hidden="true"></span>
        <span class="pc-s1-canvas-doc-icon" aria-hidden="true"></span>
        <span class="pc-s1-final-module-title">${esc(pcS1LearningState.renamedTitles[index] || item.moduleTitle)}</span>
        ${feedback}
      </li>`;
    }).join('');

  const sections = PC_S1_ORGANIZE_ZONES.map(zone => `
    <section class="pc-s1-final-module-section" aria-labelledby="pcS1Final-${esc(zone.id)}">
      <div class="pc-s1-final-text-header">
        <strong id="pcS1Final-${esc(zone.id)}">${esc(zone.label)}</strong>
        <span>${esc(zone.definition)}</span>
      </div>
      <ul class="pc-s1-canvas-module-list">${rowsFor(zone.id)}</ul>
    </section>`).join('');

  const summary = review.mismatches.length
    ? `<div class="pc-s1-module-review-summary is-reconsider"><strong>${review.matchCount} of ${review.total} placements fit the suggested learning path.</strong><span>Babbage and Maya will point out placements worth reconsidering before this is added to your guide.</span></div>`
    : `<div class="pc-s1-module-review-summary is-good"><strong>All ${review.total} placements fit the suggested learning path.</strong><span>The structure now moves clearly from preparation to practice to evidence.</span></div>`;

  return pcRenderS1CanvasShell(`
    <div class="pc-s1-final-module-intro">
      <h1>Module 3: Food Access</h1>
      <p>This is the module after your title and text-header changes.</p>
    </div>
    ${summary}
    <div class="pc-s1-final-module-sections">${sections}</div>
    <div class="pc-s1-final-module-actions">
      <button type="button" class="pc-shell-primary" data-pc-action="s1-learning-build-guide-step1">${pcS1LearningState.guide?.step1?.added ? 'View Step 1 of My Course Guide' : 'Build Step 1 of My Course Guide'}</button>
    </div>`, 'Modules');
}

function pcRenderS1RevisedModuleOverview() {
  pcS1LearningState.view = 'revised-overview';
  const area = document.getElementById('chat');
  if (!area) return false;
  if (!pcS1LearningState.organizationXPEarned && typeof awardS1PracticeXP === 'function') {
    pcS1LearningState.organizationXPEarned = awardS1PracticeXP(0, 3);
  }
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  const xpNote = pcS1LearningState.organizationXPEarned
    ? `Navigation repair complete · +${pcS1LearningState.organizationXPEarned} XP`
    : 'Navigation repair complete';
  area.innerHTML = `
    <section class="pc-s1-learning pc-scenario-stage pc-s1-revised-overview" role="region" aria-labelledby="pcS1RevisedOverviewTitle" style="--pc-s1-learning-bg:url('${sceneBg}')">
      <div class="pc-s1-learning-taskbar">
        <div>
          <span>Scenario 1 · Start With the Learning</span>
          <h1 id="pcS1RevisedOverviewTitle">See the module you rebuilt</h1>
          <p>Your clearer titles and Canvas text headers are now shown together as Maya would encounter them.</p>
        </div>
        <div class="pc-s1-learning-task-status">${esc(xpNote)}</div>
      </div>
      <div class="pc-s1-learning-shell">
        <div class="pc-s1-learning-workspace">
          <section class="pc-s1-canvas-frame" aria-label="Revised Maya Canvas module">${pcRenderS1RevisedModuleCanvas()}</section>
          ${pcRenderS1MayaPanel(pcEvaluateS1Organization().mayaQuote)}
        </div>
      </div>
    </section>`;
  resetSectionScroll(area);
  return true;
}


function pcBuildS1GuideStep1Input() {
  const placements = pcS1LearningState.organization || {};
  return {
    guideStep: 'Make the Learning Path Visible',
    originalTitles: PC_S1_LEARNING_ITEMS.map(item => item.moduleTitle),
    revisedActivities: PC_S1_LEARNING_ITEMS.map((item, index) => ({
      title: pcS1LearningState.renamedTitles[index] || item.moduleTitle,
      purpose: placements[item.id] || 'unplaced',
      type: item.typeLabel
    }))
  };
}

function pcGetS1GuideStep1Insight(response, input) {
  const counts = ['prepare', 'practice', 'evidence'].reduce((acc, key) => {
    acc[key] = input.revisedActivities.filter(item => item.purpose === key).length;
    return acc;
  }, {});
  const review = pcEvaluateS1Organization();
  const mismatchText = review.suggestions.length
    ? review.suggestions[0]
    : 'Your placements match the suggested Prepare → Practice → Evidence learning path.';
  const fallback = {
    source: 'fallback',
    summary: review.mismatches.length
      ? `Your clearer titles improve scanning, but ${review.mismatches.length} ${review.mismatches.length === 1 ? 'placement still needs' : 'placements still need'} another look before the learning path is fully coherent.`
      : 'Your revised titles and placements create a clear, visible learning path from preparation to practice to evidence.',
    strengths: [
      'Activity titles use clearer, student-facing language instead of abbreviations or generic labels.',
      `The module now shows ${counts.prepare} Prepare, ${counts.practice} Practice, and ${counts.evidence} Evidence ${counts.evidence === 1 ? 'activity' : 'activities'}.`,
      review.mismatches.length ? `${review.matchCount} of ${review.total} activity placements already fit the suggested learning purpose.` : 'All activity placements fit the suggested learning purpose.'
    ],
    watchFor: mismatchText,
    impact: review.mismatches.length
      ? 'Students can scan the module more easily, but misplaced activities may still give mixed signals about when they are learning, practicing, or demonstrating learning.'
      : 'Students can predict both what each item contains and why it appears at that point in the module.'
  };

  const a = response?.structured;
  if (!a || typeof a !== 'object') return fallback;
  const worked = Array.isArray(a.what_worked) ? a.what_worked.map(item => String(item || '').trim()).filter(Boolean).slice(0, 3) : [];
  return {
    source: response?.mock || response?.provider === 'local-fallback' ? 'fallback' : 'live',
    summary: String(a.feedback_summary || '').trim() || fallback.summary,
    strengths: worked.length ? worked : fallback.strengths,
    watchFor: review.mismatches.length ? mismatchText : (String(a.recommended_repair || a.issue_detected || '').trim() || fallback.watchFor),
    impact: String(a.expected_impact || '').trim() || fallback.impact
  };
}

function pcRenderS1GuideInsight(insight) {
  const result = insight && typeof insight === 'object' ? insight : {};
  const strengths = Array.isArray(result.strengths) ? result.strengths.filter(Boolean) : [];
  const sourceLabel = result.source === 'live' ? 'Live Babbage review' : 'Built-in review';
  return `
    <article class="pc-s1-my-course-findings pc-s1-guide-personalized-feedback">
      <span class="pc-s1-result-eyebrow">${sourceLabel}</span>
      <h3>Feedback on the learning path you built</h3>
      <p>${esc(result.summary || 'Review the activity titles and placements against the purpose of each activity.')}</p>
      ${strengths.length ? `<ul>${strengths.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}
      <div class="pc-s1-my-course-next-check"><h3>Check next</h3><p>${esc(result.watchFor || 'Confirm that each activity appears where students will expect to use it.')}</p></div>
      ${result.impact ? `<p><strong>Likely student impact:</strong> ${esc(result.impact)}</p>` : ''}
    </article>
    <div class="pc-s1-guide-reference-grid">
      <section>
        <span class="pc-s1-result-eyebrow">Prepare</span>
        <p>Students get what they need before trying the work.</p><ul><li>Readings and videos</li><li>Examples and demonstrations</li><li>Vocabulary and background</li></ul>
      </section>
      <section>
        <span class="pc-s1-result-eyebrow">Practice</span>
        <p>Students try, discuss, and get feedback.</p><ul><li>Discussions and drafts</li><li>Practice problems and checks</li><li>Peer review and rehearsal</li></ul>
      </section>
      <section>
        <span class="pc-s1-result-eyebrow">Evidence</span>
        <p>Students show what they can do.</p><ul><li>Projects and case responses</li><li>Presentations and portfolios</li><li>Aligned assessments</li></ul>
      </section>
    </div>
    <div class="pc-s1-guide-header-ideas">
      <span class="pc-s1-result-eyebrow">Other text headers you can use</span>
      <p><strong>You do not have to use Prepare / Practice / Evidence.</strong> Try purpose-driven labels such as Start Here, Learn, Watch, Read, Try It, Discuss, Check Your Understanding, Apply, Submit, or Reflect. Consistency matters more than copying one exact vocabulary set.</p>
    </div>`;
}

function pcRenderS1GuideMiniModule(input) {
  const zoneLabel = { prepare: 'Prepare', practice: 'Practice', evidence: 'Evidence' };
  return ['prepare', 'practice', 'evidence'].map(zone => {
    const items = input.revisedActivities.filter(item => item.purpose === zone);
    return `<div class="pc-s1-guide-module-group"><strong>${zoneLabel[zone]}</strong>${items.length ? items.map(item => `<span>${esc(item.title)}</span>`).join('') : '<span class="is-empty">No activity placed</span>'}</div>`;
  }).join('');
}

function pcRenderS1WeeklyModulePattern() {
  const weeks = [
    { week: 'Week 1', topic: 'Introduce the problem', learn: 'Overview, reading, short example', show: 'Explain the problem in a brief response' },
    { week: 'Week 2', topic: 'Work with the evidence', learn: 'Demonstration, discussion, guided practice', show: 'Use evidence in a draft or case response' },
    { week: 'Week 3', topic: 'Apply the learning', learn: 'Targeted review and feedback', show: 'Submit the aligned performance or product' }
  ];
  return `<section class="pc-s1-guide-section pc-s1-weekly-pattern" aria-labelledby="pcS1WeeklyPatternHeading">
    <span class="pc-s1-result-eyebrow">Repeatable module pattern</span>
    <h3 id="pcS1WeeklyPatternHeading">Keep a few anchors consistent each week</h3>
    <p>Students do not need every module to contain every category. Repeat the overview, a clear path into the work, and a visible place to show learning; change the activities to fit that week.</p>
    <div class="pc-s1-weekly-pattern-grid">${weeks.map(item => `<article>
      <header><span>${esc(item.week)}</span><strong>${esc(item.topic)}</strong></header>
      <div><b>Start here</b><p>State what students will learn and what they will produce.</p></div>
      <div><b>Learn and try</b><p>${esc(item.learn)}</p></div>
      <div class="is-evidence"><b>Show your learning</b><p>${esc(item.show)}</p></div>
    </article>`).join('')}</div>
  </section>`;
}

function pcRenderS1GuideStep1() {
  pcS1LearningState.view = 'guide-step1';
  const area = document.getElementById('chat');
  if (!area) return false;
  const input = pcBuildS1GuideStep1Input();
  const guide = pcS1LearningState.guide?.step1 || {};
  const insight = guide.personalizedInsight || pcGetS1GuideStep1Insight(pcS1LearningState.guideBabbageResponse, input);
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  area.innerHTML = `
    <section class="pc-s1-learning pc-scenario-stage pc-s1-guide-preview" role="region" aria-labelledby="pcS1GuideStep1Title" style="--pc-s1-learning-bg:url('${sceneBg}')">
      <div class="pc-s1-learning-taskbar">
        <div><span>My PromptCraft Course Guide · Step 1</span><h1 id="pcS1GuideStep1Title">Make the Learning Path Visible</h1><p>A Canvas building reference for your own course.</p></div>
        <div class="pc-s1-learning-task-status">${guide.added ? 'Added to My Guide' : 'Guide preview'}</div>
      </div>
      <div class="pc-s1-guide-paper" role="document" aria-label="Course Guide Step 1 preview">
        <header class="pc-s1-guide-paper-header"><span>My PromptCraft Course Guide · Step 1</span><h2>Make the Learning Path Visible</h2><p>A Canvas building reference for your own course.</p></header>
        <section class="pc-s1-guide-section">
          <h3>Why this matters</h3>
          <p>Students should be able to tell what an item is, why it is there, and what comes next without opening every page first. Descriptive titles and text headers make the learning path visible at the module level.</p>
        </section>
        <section class="pc-s1-guide-section pc-s1-guide-babbage-note">
          <span class="pc-s1-result-eyebrow">Canvas building reference</span><h3>Choose text headers by learning purpose</h3>
          <p class="pc-s1-guide-reference-intro">The practice module used Prepare, Practice, and Evidence to make progression visible. Use the same idea in your own course, but choose labels that make sense for your students and discipline.</p>
          ${pcRenderS1GuideInsight(insight)}
        </section>
        <section class="pc-s1-guide-section pc-s1-guide-tip-grid">
          <div><h3>Use this in your own Canvas course</h3><ul><li>Name items for the task students will actually open or complete.</li><li>Use short text headers to show purpose and progression.</li><li>Keep the module sequence consistent enough that students can predict what comes next.</li></ul></div>
          <div><h3>Course-design connection</h3><p>This supports clear navigation, transparent activity purpose, consistent organization, and alignment between the learning path and what students are eventually asked to demonstrate.</p></div>
        </section>
        ${pcRenderS1WeeklyModulePattern()}
        ${pcRenderS1OSCQRStandards()}
        <section class="pc-s1-guide-section pc-s1-guide-ai-box"><h3>Try this with AI</h3><ul><li>Give AI a list of vague Canvas item names and ask for clearer student-facing alternatives, then verify each suggestion.</li><li>Ask AI to sort activities into Prepare, Practice, and Evidence, then check the classifications against your own intent.</li><li>Ask AI which titles still fail to reveal what students actually do.</li></ul></section>
        <footer class="pc-s1-guide-actions">
          ${guide.added
            ? '<button type="button" class="pc-shell-secondary" data-pc-action="s1-learning-view-guide-step1">View saved guide</button><button type="button" class="pc-shell-primary" data-pc-action="s1-learning-reflect-overview">Continue with Maya</button>'
            : '<button type="button" class="pc-shell-primary" data-pc-action="s1-learning-add-guide-step1">Add to My Guide</button>'}
        </footer>
      </div>
    </section>`;
  resetSectionScroll(area);
  return true;
}

async function pcGenerateS1GuideStep1() {
  const input = pcBuildS1GuideStep1Input();
  pcS1LearningState.view = 'guide-step1-babbage';
  showBabbageConsultOverlay('Course Guide · Step 1', {
    speakerName: 'Professor Pixel',
    heading: 'Babbage is preparing your first guide section.',
    body: 'It is turning the titles and learning-path structure you just built into a concise note you can actually use later.'
  });
  let response = {};
  try {
    response = await requestBabbageAnalysis({
      analysis_type: 'scenario1',
      system: `You are Babbage, PromptCraft's course-guide editor. Using only the supplied revised activity titles and Prepare / Practice / Evidence placements, evaluate navigation and organization only. Be specific about the learner's actual placements. For this example, reading, video, and vocabulary are best treated as Prepare, discussion as Practice, and the quiz as Evidence. If a placement differs, state what should be reconsidered rather than treating every arrangement as equally successful. Keep feedback concise. In the normal structured response, use feedback_summary for a 1-2 sentence overview, what_worked for up to three concrete strengths, recommended_repair for one practical thing to keep checking, and expected_impact for the likely student-facing effect. Do not evaluate the later instructor-intent alignment problem yet. Do not invent course facts.`,
      messages: [{ role: 'user', content: JSON.stringify(input, null, 2) }]
    }, 'main');
  } catch (error) {
    console.warn('[PromptCraft] S1 Guide Step 1 generation failed before fallback rendering:', error);
    response = { mock: true, mockReason: 'scenario-error' };
  }
  pcS1LearningState.guideBabbageResponse = response;
  const insight = pcGetS1GuideStep1Insight(response, input);
  pcS1LearningState.guide.step1.personalizedInsight = insight;
  pcS1LearningState.guide.step1.generatedAt = new Date().toISOString();
  pcSaveS1Guide();
  document.getElementById('vnOverlay')?.classList.remove('active');
  return pcRenderS1GuideStep1();
}

function pcAddS1GuideStep1() {
  pcS1LearningState.guide.step1.added = true;
  pcSaveS1Guide();
  if (!pcS1LearningState.guideXPEarned && typeof awardS1PracticeXP === 'function') {
    pcS1LearningState.guideXPEarned = awardS1PracticeXP(2, 3);
  }
  const review = pcEvaluateS1Organization();
  const organizationScore = review.matchCount === review.total ? 2 : review.matchCount >= 3 ? 1 : 0;
  const diagnosisScore = pcS1LearningState.diagnosisChoice === 'evidence-gap' ? 2 : 1;
  pcRecordS1LearningProgress('s1_course_guide_step_added', Math.min(5, organizationScore + diagnosisScore + 1), 'Added learning-path guidance to My Course Guide', pcS1LearningState.guide?.step1?.personalizedInsight?.summary || 'Learning-path guidance saved.', { guideStepAdded: true });
  return pcRenderS1GuideStep1();
}

function pcViewS1GuideStep1() {
  const rendered = pcRenderS1GuideStep1();
  requestAnimationFrame(() => document.querySelector('.pc-s1-guide-paper')?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  return rendered;
}

function pcReviseBeforeS1Guide() {
  pcS1LearningState.guide.step1.added = false;
  pcSaveS1Guide();
  return pcRenderS1RenameComplete();
}

const PC_S1_DIAGNOSIS_CHOICES = Object.freeze([
  Object.freeze({
    id: 'more-content',
    text: 'The module needs more content before Maya can learn the topic.'
  }),
  Object.freeze({
    id: 'navigation-only',
    text: 'The main problem is that Maya cannot tell where to start in the module.'
  }),
  Object.freeze({
    id: 'evidence-gap',
    text: 'The module gives Maya useful preparation, but it does not provide evidence that she can perform the intended learning.'
  }),
  Object.freeze({
    id: 'quiz-length',
    text: 'The quiz is too short to count as a meaningful assessment.'
  })
]);

function pcPlayS1OverviewReflection() {
  pcS1LearningState.view = 'overview-dialogue';
  const cast = [{ id: 'maya', slot: 'left' }, { id: 'pixel', slot: 'right' }];
  // Guide/Babbage handoffs can leave VN typing state alive even when the overlay
  // is closed. Reset the queue state explicitly so this button always starts
  // the reflection instead of silently enqueueing dialogue behind a stale flag.
  try {
    clearTimeout(vnTypeTimer);
    vnQueue = [];
    vnTyping = false;
    vnOnComplete = null;
    vnFullText = '';
    vnCurrentText = '';
  } catch (_error) {}
  pcPrepareS1ClassroomDialogueScene();
  const sceneBackground = document.getElementById('vnSceneBg');
  if (sceneBackground) pcSetImageSource(sceneBackground, ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom, LEGACY_ASSETS.images.backgrounds.classroom);
  document.getElementById('vnOverlay')?.classList.add('pc-s1-guide-reflection');
  loadSceneImage('', '');
  const board = document.getElementById('vnBoardText');
  if (board) board.textContent = 'Clear path → meaningful practice → evidence of learning';
  document.querySelector('#vnOverlay .vn-smartboard')?.setAttribute('aria-hidden', 'false');
  vnShow('neutral',
    'This is much easier to follow. I can see the path before I start clicking, and the titles tell me what each activity is for.',
    null,
    { speaker: 'Maya', character: 'maya', cast }
  );
  vnShow('thinking',
    'Good. You repaired the navigation problem. Now compare what Maya actually does with what the instructor says she should be able to do.',
    () => {
      document.getElementById('vnOverlay')?.classList.remove('pc-s1-guide-reflection');
      pcSetVNOverlayState({ active: false });
      pcRenderS1Diagnosis();
    },
    { speaker: 'Professor Pixel', character: 'pixel', cast }
  );
  return true;
}

function pcRenderS1Diagnosis() {
  pcS1LearningState.view = 'diagnosis';
  const area = document.getElementById('chat');
  if (!area) return false;
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  const selected = pcS1LearningState.diagnosisChoice;
  const choices = PC_S1_DIAGNOSIS_CHOICES.map(choice => `
    <button type="button" class="pc-s1-diagnosis-choice${selected === choice.id ? ' is-selected' : ''}"
      data-pc-action="s1-learning-select-diagnosis" data-pc-diagnosis-id="${esc(choice.id)}"
      aria-pressed="${selected === choice.id ? 'true' : 'false'}">
      <span class="pc-s1-diagnosis-radio" aria-hidden="true"></span>
      <span>${esc(choice.text)}</span>
    </button>`).join('');

  area.innerHTML = `
    <section class="pc-s1-learning pc-scenario-stage pc-s1-diagnosis" role="region" aria-labelledby="pcS1DiagnosisTitle" style="--pc-s1-learning-bg:url('${sceneBg}')">
      <div class="pc-s1-learning-taskbar">
        <div>
          <span>Scenario 1 · Start With the Learning</span>
          <h1 id="pcS1DiagnosisTitle">Check whether the activities match the learning</h1>
          <p>Clear navigation helps Maya find the work. Alignment determines whether that work lets her demonstrate the intended learning.</p>
        </div>
        <div class="pc-s1-learning-task-status">Alignment check</div>
      </div>
      <div class="pc-s1-learning-shell">
        <div class="pc-s1-learning-workspace">
          <section class="pc-s1-diagnosis-card" aria-labelledby="pcS1DiagnosisQuestion">
            <div class="pc-s1-diagnosis-purpose">
              <strong>Why you are doing this</strong>
              <p>You already made the module easier to follow. Now compare what the instructor wants Maya to do with what the current activities actually ask her to produce. The gap between those two is the design problem to solve next.</p>
            </div>
            <div class="pc-s1-diagnosis-compare" aria-label="Alignment comparison">
              <div class="pc-s1-diagnosis-context is-intent">
                <span>Instructor intent</span>
                <strong>Analyze a community food-access problem and use evidence to recommend an appropriate response.</strong>
              </div>
              <div class="pc-s1-diagnosis-context is-evidence">
                <span>Current evidence</span>
                <strong>Reading, video, vocabulary, a discussion describing a barrier, and a quiz checking terms and examples.</strong>
              </div>
            </div>
            <div class="pc-s1-diagnosis-question-block">
              <span class="pc-s1-result-eyebrow">Your decision</span>
              <h2 id="pcS1DiagnosisQuestion">What is the main alignment problem?</h2>
              <p class="pc-s1-diagnosis-help">Choose the single issue that matters most for whether this module demonstrates the intended learning.</p>
            </div>
            <div class="pc-s1-diagnosis-choices">${choices}</div>
          </section>
          ${pcRenderS1MayaPanel('The module is clearer now. I can see what I am supposed to do. The question is whether any of this actually lets me show the performance the instructor cares about.')}
        </div>
      </div>
    </section>`;
  resetSectionScroll(area);
  return true;
}

function pcSelectS1Diagnosis(id) {
  if (!PC_S1_DIAGNOSIS_CHOICES.some(choice => choice.id === id)) return false;
  pcS1LearningState.diagnosisChoice = id;
  pcS1LearningState.diagnosisConfirmed = false;
  return pcUseS1Diagnosis();
}

function pcGetS1DiagnosisChoice() {
  return PC_S1_DIAGNOSIS_CHOICES.find(choice => choice.id === pcS1LearningState.diagnosisChoice) || null;
}

function pcBuildS1BabbageInput() {
  return {
    scenario: 'Start With the Learning',
    reviewType: 'module-organization',
    activities: PC_S1_LEARNING_ITEMS.map((item, index) => ({
      originalTitle: item.moduleTitle,
      renamedTitle: pcS1LearningState.renamedTitles[index] || item.moduleTitle,
      purpose: pcS1LearningState.organization?.[item.id] || 'unplaced',
      type: item.typeLabel
    }))
  };
}

function pcBuildS1BabbageReportHTML(input, response = {}) {
  const prepare = input.activities.filter(item => item.purpose === 'prepare').map(item => item.renamedTitle);
  const practice = input.activities.filter(item => item.purpose === 'practice').map(item => item.renamedTitle);
  const evidence = input.activities.filter(item => item.purpose === 'evidence').map(item => item.renamedTitle);
  const sourceLabel = response?.mock ? 'Fallback review' : 'Live Babbage review';
  const insight = pcGetS1GuideStep1Insight(response, pcBuildS1GuideStep1Input());
  return `
    <article class="pc-s1-babbage-report pc-s1-guide-plan-report" role="document" aria-label="Babbage Scenario 1 guide-plan review">
      <header>
        <span class="pc-s1-babbage-kicker">${esc(sourceLabel)}</span>
        <h2>Step 1 guide plan</h2>
      </header>
      <section class="pc-s1-guide-plan-intro">
        <h3>What Babbage will carry into your guide</h3>
        <p>${esc(insight.summary)}</p>
      </section>
      <section class="pc-s1-guide-plan-grid">
        <div><span class="pc-s1-result-eyebrow">Your revised learning path</span><p><strong>Prepare:</strong> ${esc(prepare.join(', ') || 'No activities')}</p><p><strong>Practice:</strong> ${esc(practice.join(', ') || 'No activities')}</p><p><strong>Evidence:</strong> ${esc(evidence.join(', ') || 'No activities')}</p></div>
        <div><span class="pc-s1-result-eyebrow">Guide section will include</span><ul><li>Why clear Canvas names and text headers matter</li><li>A visual Canvas building reference with activity examples</li><li>Other useful text-header names</li><li>Canvas tips, course-design connections, and AI ideas</li></ul></div>
      </section>
      <section class="pc-s1-babbage-structure-note">
        <h3>${pcEvaluateS1Organization().mismatches.length ? 'A placement to revisit' : 'One thing to keep checking'}</h3>
        <p>${esc(insight.watchFor)}</p>
      </section>
    </article>`;
}

async function pcRunS1BabbageAnalysis() {
  if (PC_S1_LEARNING_ITEMS.some(item => !pcS1LearningState.organization?.[item.id])) return false;
  pcS1LearningState.view = 'babbage-structure';
  const input = pcBuildS1BabbageInput();

  showBabbageConsultOverlay('Scenario 1 organization review', {
    speakerName: 'Professor Pixel',
    heading: 'Babbage is reviewing the module structure you built.',
    body: 'It is looking only at the activity titles you created and how you placed them under Prepare, Practice, and Evidence.'
  });

  let response = {};
  try {
    response = await requestBabbageAnalysis({
      system: `You are Babbage, PromptCraft's course-organization reviewer. Analyze only the supplied Scenario 1 titles and Prepare / Practice / Evidence placements. Be specific about the learner's actual choices rather than praising every arrangement. Reading, video, and vocabulary usually function as Prepare in this example; discussion functions as Practice; the quiz functions as Evidence. If the learner placed an activity elsewhere, identify it as something to reconsider and explain the learning-purpose mismatch briefly. Focus on whether revised names make activity purpose easier to predict and whether the headers make the learning path easier to follow. Do not evaluate the later instructor-intent alignment problem yet. Do not invent course facts.`,
      messages: [{
        role: 'user',
        content: `Review this learner-created module organization:\n${JSON.stringify(input, null, 2)}`
      }]
    }, 'main');
  } catch (error) {
    console.warn('[PromptCraft] S1 Babbage organization review failed before fallback rendering:', error);
    response = { mock: true, mockReason: 'scenario-error' };
  }

  pcS1LearningState.babbageInput = input;
  pcS1LearningState.babbageResponse = response;
  const overlay = document.getElementById('vnOverlay');
  overlay?.classList.add('pc-s1-structure-analysis');
  return showBabbageTerminalReport({
    reportHTML: pcBuildS1BabbageReportHTML(input, response),
    terminalStateText: 'S1 MODULE ORGANIZATION REVIEW COMPLETE',
    engineLabel: response?.mock ? 'BABBAGE FALLBACK' : 'BABBAGE ENGINE',
    speakerName: 'Professor Pixel',
    onClose: () => {
      document.getElementById('vnOverlay')?.classList.remove('pc-s1-structure-analysis');
      pcS1LearningState.diagnosisChoice = '';
      pcS1LearningState.diagnosisConfirmed = false;
      pcRenderS1RevisedModuleOverview();
    },
    readLabel: '',
    printLabel: '',
    continueLabel: 'Review revised module',
    ariaLabel: 'Babbage Scenario 1 module-organization review',
    closeHandoff: 'app'
  });
}

function pcRenderS1BabbageComplete() {
  pcS1LearningState.view = 'babbage-complete';
  const area = document.getElementById('chat');
  if (!area) return false;
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  area.innerHTML = `
    <section class="pc-s1-learning pc-scenario-stage" role="region" aria-labelledby="pcS1BabbageCompleteTitle" style="--pc-s1-learning-bg:url('${sceneBg}')">
      <div class="pc-s1-learning-taskbar">
        <div>
          <span>Scenario 1 · Start With the Learning</span>
          <h1 id="pcS1BabbageCompleteTitle">Babbage confirmed the evidence gap</h1>
          <p>The example-course analysis is complete. Your renaming, organization, and diagnosis are still retained.</p>
        </div>
        <div class="pc-s1-learning-task-status">Analysis complete</div>
      </div>
      <div class="pc-s1-learning-shell">
        <div class="pc-s1-learning-workspace">
          <section class="pc-s1-checkpoint-card pc-s1-babbage-complete-card">
            <h2>What matters</h2>
            <p>Clearer names and a better learning path help Maya navigate the module, but organization alone cannot create evidence of the intended performance.</p>
            <div class="pc-s1-babbage-complete-actions">
              <button type="button" class="pc-shell-primary" data-pc-action="s1-learning-review-babbage">Review Babbage analysis</button>
              <button type="button" class="pc-shell-secondary" data-pc-action="s1-learning-show-module">Review Maya's module</button>
            </div>
          </section>
          ${pcRenderS1MayaPanel('That makes sense. I can get through the module more easily now, but the quiz still does not show whether I can analyze a problem and recommend a response.')}
        </div>
      </div>
    </section>`;
  resetSectionScroll(area);
  return true;
}


function pcRenderS1DiagnosisResult() {
  pcS1LearningState.view = 'diagnosis-result';
  const area = document.getElementById('chat');
  if (!area) return false;
  const selected = pcGetS1DiagnosisChoice();
  const correct = selected?.id === 'evidence-gap';
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  area.innerHTML = `
    <section class="pc-s1-learning pc-scenario-stage pc-s1-diagnosis-result" role="region" aria-labelledby="pcS1DiagnosisResultTitle" style="--pc-s1-learning-bg:url('${sceneBg}')">
      <div class="pc-s1-learning-taskbar">
        <div>
          <span>Scenario 1 · Start With the Learning</span>
          <h1 id="pcS1DiagnosisResultTitle">Diagnosis recorded</h1>
          <p>${correct ? 'You identified the difference between useful preparation and evidence of the intended performance.' : 'Your diagnosis is saved. Compare it with the intended performance before moving into the next S1 phase.'}</p>
        </div>
        <div class="pc-s1-learning-task-status">${esc(pcS1LearningState.diagnosisXPEarned ? `Diagnosis complete · +${pcS1LearningState.diagnosisXPEarned} XP` : 'Diagnosis complete')}</div>
      </div>
      <div class="pc-s1-learning-shell">
        <div class="pc-s1-learning-workspace">
          <section class="pc-s1-checkpoint-card pc-s1-diagnosis-result-card">
            <span class="pc-s1-result-eyebrow">Your diagnosis</span>
            <h2>${esc(selected?.text || '')}</h2>
            <p>${correct
              ? 'That is the central alignment issue. Maya has reading, vocabulary, discussion, and recall work, but none of the current activities asks her to analyze a community food-access problem and recommend a response using evidence.'
              : 'This issue may affect the experience, but the instructor intent asks Maya to analyze a problem and recommend a response using evidence. The next design question is whether the current activities actually produce that evidence.'}</p>
            <div class="pc-s1-diagnosis-result-actions">
              <button type="button" class="pc-shell-secondary" data-pc-action="s1-learning-continue-diagnosis">Review Diagnosis 1</button>
              <button type="button" class="pc-shell-primary" data-pc-action="s1-learning-start-my-course">Continue to My Course</button>
            </div>
          </section>
          ${pcRenderS1MayaPanel(correct
            ? 'That is the difference I was missing. The module is easier to navigate now, but I still need a chance to show that I can analyze a problem and recommend a response.'
            : 'The module is clearer now. I still need to compare what I completed with what the instructor says I should actually be able to do.')}
        </div>
      </div>
    </section>`;
  resetSectionScroll(area);
  return true;
}

function pcPlayS1MyCourseTransition() {
  pcS1LearningState.view = 'my-course-dialogue';
  const cast = [{ id: 'maya', slot: 'left' }, { id: 'pixel', slot: 'right' }];
  try {
    clearTimeout(vnTypeTimer);
    vnQueue = [];
    vnTyping = false;
    vnOnComplete = null;
    vnFullText = '';
    vnCurrentText = '';
  } catch (_error) {}
  pcPrepareS1ClassroomDialogueScene();
  const sceneBackground = document.getElementById('vnSceneBg');
  if (sceneBackground) pcSetImageSource(sceneBackground, ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom, LEGACY_ASSETS.images.backgrounds.classroom);
  document.getElementById('vnOverlay')?.classList.add('pc-s1-guide-reflection');
  loadSceneImage('', '');
  const board = document.getElementById('vnBoardText');
  if (board) board.textContent = 'Navigation is clear. Now check alignment.';
  document.querySelector('#vnOverlay .vn-smartboard')?.setAttribute('aria-hidden', 'false');
  vnShow('neutral',
    'The clearer names and headers helped me find my way. They did not change what the activities actually ask me to demonstrate.',
    null,
    { speaker: 'Maya', character: 'maya', cast }
  );
  vnShow('encouraging',
    'Exactly. Now apply the same inspection to one of your own modules. We will build the overview in small pieces before Babbage reviews anything.',
    () => {
      document.getElementById('vnOverlay')?.classList.remove('pc-s1-guide-reflection');
      pcSetVNOverlayState({ active: false });
      pcRenderS1MyCourseStep('focus');
    },
    { speaker: 'Professor Pixel', character: 'pixel', cast }
  );
  return true;
}

function pcS1MyCourseProgress(step) {
  return ({ focus: '1 of 3', intent: '2 of 3', activities: '3 of 3' })[step] || 'My Course';
}

function pcRenderS1MyCourseSummary() {
  const data = pcS1LearningState.myCourse || pcEmptyS1MyCourse();
  return `
    <aside class="pc-s1-my-course-summary" aria-label="My Course overview so far">
      <span class="pc-s1-result-eyebrow">Private My Course workspace</span>
      <h2>${esc(data.moduleTitle || 'Your module')}</h2>
      ${data.intendedLearning ? `<p><strong>Intended learning</strong><br>${esc(data.intendedLearning)}</p>` : '<p>Add the intended learning next.</p>'}
      <p class="pc-s1-my-course-privacy">Saved locally on this device. This workspace is not added to V121 research tracking.</p>
    </aside>`;
}

function pcRenderS1MyCourseStep(step = 'focus') {
  pcS1LearningState.view = 'my-course';
  pcS1LearningState.myCourseStep = step;
  const area = document.getElementById('chat');
  if (!area) return false;
  const data = pcS1LearningState.myCourse || pcEmptyS1MyCourse();
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  let taskHTML = '';

  if (step === 'focus') {
    taskHTML = `
      <form class="pc-s1-my-course-card" data-pc-submit-action="s1-my-course-save-focus">
        <span class="pc-s1-result-eyebrow">My Course · Step 1</span>
        <h2>Choose one module or unit</h2>
        <p>Start small. Use one module you want to inspect rather than trying to repair an entire course at once.</p>
        <label for="pcS1MyCourseTitle">Module or unit name</label>
        <input id="pcS1MyCourseTitle" name="moduleTitle" type="text" maxlength="120" value="${esc(data.moduleTitle)}" placeholder="Example: Week 4 — Informative Speech" required>
        <div class="pc-s1-my-course-actions"><button type="submit" class="pc-shell-primary">Continue</button></div>
      </form>`;
  } else if (step === 'intent') {
    taskHTML = `
      <form class="pc-s1-my-course-card" data-pc-submit-action="s1-my-course-save-intent">
        <span class="pc-s1-result-eyebrow">My Course · Step 2</span>
        <h2>What should students be able to do?</h2>
        <p>Describe the performance you care about. Avoid listing content students should merely encounter.</p>
        <label for="pcS1MyCourseIntent">By the end of this module, students should be able to…</label>
        <textarea id="pcS1MyCourseIntent" name="intendedLearning" rows="5" maxlength="700" placeholder="Example: Compare two sources and support a recommendation with evidence." required>${esc(data.intendedLearning)}</textarea>
        <div class="pc-s1-my-course-actions">
          <button type="button" class="pc-shell-secondary" data-pc-action="s1-my-course-step" data-pc-my-course-step="focus">Back</button>
          <button type="submit" class="pc-shell-primary">Continue</button>
        </div>
      </form>`;
  } else {
    const activityInputs = Array.from({ length: 4 }, (_, index) => `
      <label class="pc-s1-my-course-activity-row" for="pcS1MyCourseActivity${index}">
        <span>Activity ${index + 1}${index < 2 ? ' · required' : ' · optional'}</span>
        <input id="pcS1MyCourseActivity${index}" name="activity${index}" type="text" maxlength="180" value="${esc(data.activities[index] || '')}" placeholder="Example: Watch the sample speech video" ${index < 2 ? 'required' : ''}>
      </label>`).join('');
    taskHTML = `
      <form class="pc-s1-my-course-card" data-pc-submit-action="s1-my-course-review">
        <span class="pc-s1-result-eyebrow">My Course · Step 3</span>
        <h2>What do students currently do?</h2>
        <p>List the activity names students see now. Babbage will review only this overview, not invent missing course details.</p>
        <div class="pc-s1-my-course-activities">${activityInputs}</div>
        <div class="pc-s1-my-course-consent">When you choose <strong>Review with Babbage</strong>, only this module name, intended learning statement, and activity list are sent for feedback. They are not added to V121 research tracking.</div>
        <div class="pc-s1-my-course-actions">
          <button type="button" class="pc-shell-secondary" data-pc-action="s1-my-course-step" data-pc-my-course-step="intent">Back</button>
          <button type="submit" class="pc-shell-primary">Review with Babbage</button>
        </div>
      </form>`;
  }

  area.innerHTML = `
    <section class="pc-s1-learning pc-scenario-stage pc-s1-my-course" role="region" aria-labelledby="pcS1MyCourseTitleHeading" style="--pc-s1-learning-bg:url('${sceneBg}')">
      <div class="pc-s1-learning-taskbar">
        <div>
          <span>Scenario 1 · My Course</span>
          <h1 id="pcS1MyCourseTitleHeading">Build your module overview</h1>
          <p>Give Babbage enough real course context to respond to your design instead of guessing.</p>
        </div>
        <div class="pc-s1-learning-task-status">${pcS1MyCourseProgress(step)}</div>
      </div>
      <div class="pc-s1-learning-shell">
        <div class="pc-s1-my-course-layout">
          ${taskHTML}
          ${pcRenderS1MyCourseSummary()}
        </div>
      </div>
    </section>`;
  resetSectionScroll(area);
  return true;
}

function pcSaveS1MyCourseFocus(form) {
  const title = String(new FormData(form).get('moduleTitle') || '').trim();
  if (!title) return false;
  pcS1LearningState.myCourse.moduleTitle = title;
  pcSaveS1MyCourse();
  return pcRenderS1MyCourseStep('intent');
}

function pcSaveS1MyCourseIntent(form) {
  const intendedLearning = String(new FormData(form).get('intendedLearning') || '').trim();
  if (!intendedLearning) return false;
  pcS1LearningState.myCourse.intendedLearning = intendedLearning;
  pcSaveS1MyCourse();
  return pcRenderS1MyCourseStep('activities');
}

function pcGetS1MyCourseFeedback(response, data) {
  const activityCount = data.activities.filter(Boolean).length;
  const structured = response?.structured && typeof response.structured === 'object' ? response.structured : {};
  const hasLiveAnalysis = !response?.mock && response?.provider !== 'local-fallback' && Object.keys(structured).length > 0;
  const worked = Array.isArray(structured.what_worked) ? structured.what_worked.map(item => String(item || '').trim()).filter(Boolean).slice(0, 3) : [];
  const intent = String(data.intendedLearning || '').trim();
  const activities = data.activities.filter(Boolean).map(item => String(item).trim());
  const isUnclear = text => /^(?:.{0,2}|(?:test|testing|asdf|qwerty|lorem|random|placeholder|n\/a)(?:\s+\w+){0,2})$/i.test(text)
    || /^(.)\1{3,}$/i.test(text) || !/[a-z]{3}/i.test(text);
  const unclearIntent = isUnclear(intent) || !/\b(analy[sz]e|apply|build|compare|create|demonstrate|design|develop|evaluate|explain|identify|interpret|justify|perform|produce|recommend|solve|use|write)\b/i.test(intent);
  const navigationOnly = activities.length > 0 && activities.every(item => /^(start here|your instructor|helpful links|next steps|overview|introduction|course resources|welcome|syllabus)$/i.test(item));
  const unclearActivities = activities.length > 0 && activities.every(isUnclear);
  const limitedInput = unclearIntent || navigationOnly || unclearActivities;
  const improvementIdeas = data.activities.filter(Boolean).map(activity => {
    const title = String(activity || '').trim();
    const lower = title.toLowerCase();
    if (/video|watch|demonstration/.test(lower)) return `For “${title},” name the topic and tell students what to notice or use afterward.`;
    if (/discuss|discussion|respond|reply/.test(lower)) return `For “${title},” state the question, the evidence students should use, and what a strong response includes.`;
    if (/submit|analysis|project|assignment|quiz|test/.test(lower)) return `For “${title},” name the deliverable and criteria that demonstrate “${data.intendedLearning || 'the intended learning'}.”`;
    if (/read|chapter|article|case/.test(lower)) return `For “${title},” include the topic and the purpose for reading so students know how it prepares them.`;
    return `For “${title},” replace the generic label with the task, topic, and expected result students will recognize in Canvas.`;
  });
  const aiConcerns = Array.isArray(structured?.input_quality?.concerns)
    ? structured.input_quality.concerns.map(item => String(item || '').trim()).filter(Boolean)
    : [];
  if (limitedInput && !hasLiveAnalysis) return {
    source: 'fallback',
    clear: navigationOnly
      ? 'These entries describe ways to navigate the course. I cannot identify a learning task, practice opportunity, or evidence of learning from them.'
      : 'I cannot judge the learning path from these entries yet. The intended learning or the activity names need more detail.',
    worked: navigationOnly ? ['The course has a starting point and support links.'] : ['You have a draft module to revise.'],
    unknown: unclearIntent
      ? 'The intended learning needs an observable action and a topic before I can check whether the activities align.'
      : 'The listed items do not show what students will practice or produce to demonstrate the intended learning.',
    next: unclearIntent
      ? 'State what students should be able to do with the course content. Then name the activities that help them practice and show that action.'
      : 'Keep these navigation items, then add a named practice task and an assignment or other product that shows the intended learning.',
    improvementIdeas: navigationOnly
      ? ['Keep “Start Here” and “Helpful Links” as navigation or support items.', 'Add a practice activity that asks students to use the course ideas.', 'Add an assignment or other evidence that shows what students learned.']
      : ['Replace test text with the real topic and student task.', 'Describe what students will do during practice.', 'Name what students will produce to show their learning.']
  };
  return {
    source: hasLiveAnalysis ? 'live' : 'fallback',
    clear: String(structured.feedback_summary || '').trim() || `You named the module and listed ${activityCount} activities. Their titles alone do not establish alignment.`,
    worked: worked.length ? worked : [`Your intended learning states: ${intent}`, `${activityCount} activity titles are available to inspect.`],
    unknown: String(structured.issue_detected || '').trim() || 'Activity titles alone cannot show whether students practice the intended performance or produce evidence of it.',
    next: String(structured.recommended_repair || '').trim() || 'Inspect the instructions and student work for each activity. Then compare the evidence students produce with the intended learning.',
    improvementIdeas: [...aiConcerns, ...improvementIdeas].filter((item, index, list) => list.indexOf(item) === index).slice(0, 4)
  };
}

function pcBuildS1MyCourseReport(data, response) {
  const feedback = pcGetS1MyCourseFeedback(response, data);
  return `
    <article class="pc-s1-babbage-report pc-s1-guide-plan-report pc-s1-my-course-report" role="document" aria-label="Babbage My Course module overview review">
      <header><span class="pc-s1-babbage-kicker">${response?.mock ? 'Fallback analysis' : 'Live Babbage analysis'}</span><h2>My Course overview</h2></header>
      <section class="pc-s1-guide-plan-intro"><h3>What Babbage can see</h3><p>${esc(feedback.clear)}</p></section>
      <section class="pc-s1-guide-plan-grid">
        <div><span class="pc-s1-result-eyebrow">Your module</span><p><strong>${esc(data.moduleTitle)}</strong></p><p>${esc(data.intendedLearning)}</p></div>
        <div><span class="pc-s1-result-eyebrow">Current activities</span><ul>${data.activities.filter(Boolean).map(activity => `<li>${esc(activity)}</li>`).join('')}</ul></div>
      </section>
      <section class="pc-s1-my-course-findings"><h3>What is clear</h3><ul>${feedback.worked.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>
      <section class="pc-s1-my-course-findings"><h3>What needs inspection</h3><p>${esc(feedback.unknown)}</p></section>
      <section class="pc-s1-babbage-structure-note"><h3>Next check</h3><p>${esc(feedback.next)}</p></section>
    </article>`;
}

async function pcReviewS1MyCourse(form) {
  const values = new FormData(form);
  const activities = Array.from({ length: 4 }, (_, index) => String(values.get(`activity${index}`) || '').trim());
  if (!activities[0] || !activities[1]) return false;
  pcS1LearningState.myCourse.activities = activities;
  pcSaveS1MyCourse();
  const data = { ...pcS1LearningState.myCourse, activities: [...activities] };
  pcS1LearningState.view = 'my-course-babbage';
  showBabbageConsultOverlay('My Course overview review', {
    speakerName: 'Professor Pixel',
    heading: 'Babbage is reviewing your module overview.',
    body: 'It is using only the module name, intended learning statement, and activities you chose to share.'
  });
  let response = {};
  try {
    response = await requestBabbageAnalysis({
      analysis_type: 'scenario1',
      system: `You are Babbage, PromptCraft's instructional-design review partner. Review only the faculty member's supplied module title, intended learning statement, and current activity titles. Respond to their actual wording. In the structured response, use feedback_summary for a short overview, what_worked for up to three specific observations, issue_detected for what cannot yet be established from titles, and recommended_repair for one practical, specific improvement tied to their activities. Do not invent course facts. Do not rewrite the course. Focus on navigation, activity purpose, and whether preparation, practice, and evidence support the intended learning.`,
      messages: [{ role: 'user', content: JSON.stringify(data, null, 2) }]
    }, 'main');
  } catch (error) {
    console.warn('[PromptCraft] My Course overview review failed before fallback rendering:', error);
    response = { mock: true, mockReason: 'scenario-error' };
  }
  pcS1LearningState.myCourseBabbageResponse = response;
  pcSetVNOverlayState({ active: false });
  return pcRenderS1MyCourseFeedback();
}

function pcRenderS1MyCourseFeedback() {
  pcS1LearningState.view = 'my-course-feedback';
  const area = document.getElementById('chat');
  if (!area) return false;
  const data = pcS1LearningState.myCourse;
  const feedback = pcGetS1MyCourseFeedback(pcS1LearningState.myCourseBabbageResponse, data);
  const added = Boolean(pcS1LearningState.guide?.myCourseReview?.added);
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  area.innerHTML = `
    <section class="pc-s1-learning pc-scenario-stage pc-s1-my-course" role="region" aria-labelledby="pcS1MyCourseFeedbackTitle" style="--pc-s1-learning-bg:url('${sceneBg}')">
      <div class="pc-s1-learning-taskbar">
        <div><span>Scenario 1 · My Course</span><h1 id="pcS1MyCourseFeedbackTitle">Babbage’s course setup feedback</h1><p>Review the suggestions, then save them to your personal course guide.</p></div>
        <div class="pc-s1-learning-task-status">${added ? 'Added to My Guide' : 'Ready to review'}</div>
      </div>
      <div class="pc-s1-learning-shell">
        <div class="pc-s1-my-course-review-canvas">
          <header class="pc-s1-my-course-canvas-bar"><span class="pc-s1-canvas-menu-mark" aria-hidden="true">☰</span><strong>My Course Guide</strong><span>Modules</span><span>${esc(data.moduleTitle)}</span></header>
          <nav class="pc-s1-my-course-review-links" aria-label="Jump to a course guidance section"><button type="button" data-pc-action="s1-learning-review-section" data-pc-review-section="pcS1ReviewFeedback">Babbage feedback</button><button type="button" data-pc-action="s1-learning-review-section" data-pc-review-section="pcS1ReviewImprovements">Activity suggestions</button><button type="button" data-pc-action="s1-learning-review-section" data-pc-review-section="pcS1ReviewPattern">Module pattern</button></nav>
          <div class="pc-s1-my-course-review-body">
            <article class="pc-s1-my-course-review-page">
              <span class="pc-s1-result-eyebrow">${feedback.source === 'live' ? 'Live Babbage review' : 'Built-in review'}</span>
              <h2 id="pcS1ReviewFeedback">Set up ${esc(data.moduleTitle || 'your module')} around the learning students must demonstrate</h2>
              <section><h3>What is already clear</h3><ul>${feedback.worked.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>
              <section><h3>What the activity titles cannot confirm</h3><p>${esc(feedback.unknown)}</p></section>
              <section class="pc-s1-my-course-next-check"><h3>Recommended course setup check</h3><p>${esc(feedback.next)}</p></section>
              <section id="pcS1ReviewImprovements"><h3>Ways to improve the activities you entered</h3><ul>${feedback.improvementIdeas.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>
              <section id="pcS1ReviewPattern"><h3>Suggested module pattern</h3><div class="pc-s1-guide-reference-grid"><div><strong>Prepare</strong><em>Readings, examples, demonstrations</em></div><div><strong>Practice</strong><em>Discussion, drafts, feedback</em></div><div><strong>Evidence</strong><em>Work that demonstrates the intended learning</em></div></div></section>
              <div class="pc-s1-my-course-actions">
                <button type="button" class="pc-shell-secondary" data-pc-action="s1-my-course-step" data-pc-my-course-step="focus">Revise overview</button>
                ${added ? '<button type="button" class="pc-shell-primary" data-pc-action="s1-learning-view-full-guide">View My Course Guide</button>' : '<button type="button" class="pc-shell-primary" data-pc-action="s1-my-course-add-guide">Add to My Course Guide</button>'}
              </div>
              <p class="pc-s1-my-course-privacy">Your module text and this saved guidance remain local-first and outside V121 research tracking.</p>
            </article>
          </div>
        </div>
      </div>
    </section>`;
  resetSectionScroll(area);
  return true;
}

function pcAddS1MyCourseReviewToGuide() {
  const data = pcS1LearningState.myCourse;
  const feedback = pcGetS1MyCourseFeedback(pcS1LearningState.myCourseBabbageResponse, data);
  pcS1LearningState.guide.myCourseReview = {
    added: true,
    moduleTitle: data.moduleTitle,
    intendedLearning: data.intendedLearning,
    activities: data.activities.filter(Boolean),
    feedback,
    source: feedback.source,
    addedAt: new Date().toISOString()
  };
  pcSaveS1Guide();
  if (!pcS1LearningState.myCourseXPEarned && typeof awardS1PracticeXP === 'function') {
    pcS1LearningState.myCourseXPEarned = awardS1PracticeXP(3, 3);
  }
  const completedActivities = data.activities.filter(activity => String(activity || '').trim()).length;
  const transferScore = Math.min(5, (data.moduleTitle.trim() ? 1 : 0) + (data.intendedLearning.trim() ? 2 : 0) + Math.min(2, Math.ceil(completedActivities / 2)));
  if (!pcS1LearningState.transferXPEarned && typeof awardS1TransferXP === 'function') {
    pcS1LearningState.transferXPEarned = awardS1TransferXP(transferScore);
  }
  const review = pcEvaluateS1Organization();
  const organizationScore = review.matchCount === review.total ? 2 : review.matchCount >= 3 ? 1 : 0;
  const diagnosisScore = pcS1LearningState.diagnosisChoice === 'evidence-gap' ? 2 : 1;
  const finalScore = Math.min(5, organizationScore + diagnosisScore + (transferScore >= 4 ? 1 : 0));
  pcRecordS1LearningProgress('s1_course_guide_complete', finalScore, 'Completed My Course Guide', 'Personal course guidance completed on this device.', {
    diagnosisChoice: pcS1LearningState.diagnosisChoice,
    activityCount: completedActivities,
    organization: pcS1LearningState.organization,
    renamedTitles: pcS1LearningState.renamedTitles,
    oscqrStandards: PC_S1_OSCQR_STANDARDS.map(item => item.number)
  });
  return pcRenderS1FullGuide();
}

function pcRenderS1FullGuide() {
  pcS1LearningState.view = 'full-guide';
  const area = document.getElementById('chat');
  if (!area) return false;
  const savedReview = pcS1LearningState.guide?.myCourseReview;
  const course = savedReview?.added ? {
    moduleTitle: savedReview.moduleTitle || '',
    intendedLearning: savedReview.intendedLearning || '',
    activities: Array.isArray(savedReview.activities) ? savedReview.activities : []
  } : pcS1LearningState.myCourse;
  const feedback = savedReview?.feedback || pcGetS1MyCourseFeedback(pcS1LearningState.myCourseBabbageResponse, course);
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  area.innerHTML = `
    <section class="pc-s1-learning pc-scenario-stage pc-s1-full-guide" role="region" aria-labelledby="pcS1FullGuideTitle" style="--pc-s1-learning-bg:url('${sceneBg}')">
      <div class="pc-s1-learning-taskbar"><div><span>My PromptCraft Course Guide · Scenario 1</span><h1 id="pcS1FullGuideTitle">Start with the learning</h1><p>Your visual guide combines the module-building reference with Babbage’s feedback on your course.</p></div><div class="pc-s1-learning-task-status">Saved to My Guide</div></div>
      <div class="pc-s1-guide-paper pc-s1-full-guide-paper">
        <header class="pc-s1-guide-paper-header"><span>My PromptCraft Course Guide</span><h2>Make the path visible, then check the evidence</h2><p>Use this page when building or revising a Canvas module.</p></header>
        <section class="pc-s1-guide-section"><span class="pc-s1-result-eyebrow">Start here</span><h3>Choose headers by learning purpose</h3><p>Begin with the learning students need to do, then group the activities that prepare them, let them practice, and provide evidence.</p>${pcRenderS1GuideInsight(pcS1LearningState.guide?.step1?.personalizedInsight)}</section>
        <section class="pc-s1-guide-section pc-s1-full-guide-personal"><span class="pc-s1-result-eyebrow">${feedback.source === 'live' ? 'Live Babbage suggestions for your course' : 'Built-in course review'}</span><h3>${esc(course.moduleTitle || 'Your module')}</h3><p>${esc(feedback.clear || '')}</p><p><strong>Intended learning:</strong> ${esc(course.intendedLearning)}</p><section class="pc-s1-my-course-findings"><h3>What is clear</h3><ul>${(feedback.worked || []).map(item => `<li>${esc(item)}</li>`).join('')}</ul></section><section class="pc-s1-my-course-findings"><h3>What needs inspection</h3><p>${esc(feedback.unknown || '')}</p></section><div class="pc-s1-full-guide-tips">${(feedback.improvementIdeas || []).map((tip, index) => `<article><span>${index + 1}</span><p>${esc(tip)}</p></article>`).join('')}</div><div class="pc-s1-my-course-next-check"><h3>Next check</h3><p>${esc(feedback.next || '')}</p></div></section>
        <section class="pc-s1-guide-section"><span class="pc-s1-result-eyebrow">Your visual module</span><h3>${esc(course.moduleTitle || 'Your module')}</h3><p>This draft groups activities only when their titles show a clear purpose. Review every placement against your actual instructions; items with an unclear purpose need your decision.</p><div class="pc-s1-full-guide-module" aria-label="Visual example of the teacher's Canvas module">${pcRenderS1MyCourseMiniModule(course)}</div></section>
        ${pcRenderS1WeeklyModulePattern()}
        ${pcRenderS1OSCQRStandards()}
        <section class="pc-s1-guide-section pc-s1-guide-tip-grid"><div><h3>Canvas build checklist</h3><ul><li>Name each item for the task students will open or complete.</li><li>Use short headers to show preparation, practice, and evidence.</li><li>Check the instructions and criteria, not only the activity titles.</li></ul></div><div><h3>Use AI effectively</h3><ul><li>Give AI your real titles and intended learning.</li><li>Ask for specific improvements instead of a generic course rewrite.</li><li>Verify every suggestion against your teaching intent and student needs.</li></ul></div></section>
        <footer class="pc-s1-guide-actions"><button type="button" class="pc-shell-primary" data-pc-action="s1-learning-close-with-pixel">Continue with Professor Pixel</button></footer>
      </div>
    </section>`;
  resetSectionScroll(area);
  return true;
}

function pcRenderS1MyCourseMiniModule(course) {
  const groups = { prepare: [], practice: [], evidence: [], unclear: [] };
  course.activities.filter(Boolean).forEach(activity => {
    const text = String(activity);
    const lower = text.toLowerCase();
    const purpose = /submit|quiz|test|project|presentation|recorded|final/.test(lower)
      ? 'evidence'
      : /practice|discuss|discussion|draft|peer|rehears/.test(lower)
        ? 'practice'
        : /read|watch|video|lecture|demonstration|example|lesson/.test(lower)
          ? 'prepare'
          : 'unclear';
    groups[purpose].push(text);
  });
  const learningGroups = ['prepare', 'practice', 'evidence'].map(purpose => `
    <div class="pc-s1-guide-module-group">
      <strong>${esc(PC_S1_PURPOSE_LABELS[purpose])}</strong>
      ${groups[purpose].length ? groups[purpose].map(activity => `<span>${esc(activity)}</span>`).join('') : '<span class="is-empty">No activity identified yet</span>'}
    </div>`).join('');
  return learningGroups + (groups.unclear.length
    ? `<div class="pc-s1-guide-module-group pc-s1-guide-module-unclear"><strong>Purpose to confirm</strong>${groups.unclear.map(activity => `<span>${esc(activity)}</span>`).join('')}</div>`
    : '');
}

function pcPlayS1ClosingDialogue() {
  pcS1LearningState.view = 'closing-dialogue';
  try {
    clearTimeout(vnTypeTimer);
    vnQueue = [];
    vnTyping = false;
    vnOnComplete = null;
    vnFullText = '';
    vnCurrentText = '';
  } catch (_error) {}
  pcPrepareS1ClassroomDialogueScene();
  document.getElementById('vnOverlay')?.classList.add('pc-s1-clean-closing');
  loadSceneImage('', '');
  const board = document.getElementById('vnBoardText');
  if (board) board.textContent = '';
  document.querySelector('#vnOverlay .vn-smartboard')?.setAttribute('aria-hidden', 'true');
  vnShow('proud', 'You now have a guide you can reuse: make the module path visible, start with the intended learning, and inspect the evidence students actually produce.', null, { speaker: 'Professor Pixel', character: 'pixel', cast: [{ id: 'pixel', slot: 'right' }] });
  vnShow('encouraging', 'Next comes access. A course can be logically organized and still create barriers for students. That is why the next scenario asks you to examine who can actually use the learning experience you designed.', () => {
    document.getElementById('vnOverlay')?.classList.remove('pc-s1-clean-closing');
    pcSetVNOverlayState({ active: false });
    markScenarioComplete();
    openMainMenu('scenarios');
  }, { speaker: 'Professor Pixel', character: 'pixel', cast: [{ id: 'pixel', slot: 'right' }] });
  return true;
}


function pcUseS1Diagnosis() {
  if (!pcS1LearningState.diagnosisChoice) return false;
  pcS1LearningState.diagnosisConfirmed = true;
  if (!pcS1LearningState.diagnosisXPEarned && typeof awardS1PracticeXP === 'function') {
    pcS1LearningState.diagnosisXPEarned = awardS1PracticeXP(1, pcS1LearningState.diagnosisChoice === 'evidence-gap' ? 3 : 1);
  }
  const review = pcEvaluateS1Organization();
  const organizationScore = review.matchCount === review.total ? 2 : review.matchCount >= 3 ? 1 : 0;
  const correct = pcS1LearningState.diagnosisChoice === 'evidence-gap';
  pcRecordS1LearningProgress('s1_alignment_diagnosis_complete', organizationScore + (correct ? 2 : 1), pcGetS1DiagnosisChoice()?.text || pcS1LearningState.diagnosisChoice, correct ? 'Identified the gap between preparation and evidence of the intended learning.' : 'Selected an alignment diagnosis and received corrective feedback.', { diagnosisChoice: pcS1LearningState.diagnosisChoice, diagnosisCorrect: correct });
  return pcRenderS1DiagnosisResult();
}

function pcCompleteS1Organize() {
  const placements = pcS1LearningState.organization || {};
  if (PC_S1_LEARNING_ITEMS.some(item => !placements[item.id])) return false;
  pcS1LearningState.organizationNotice = '';
  pcS1LearningState.babbageInput = pcBuildS1BabbageInput();
  pcS1LearningState.babbageResponse = {};
  if (!pcS1LearningState.organizationXPEarned && typeof awardS1PracticeXP === 'function') {
    pcS1LearningState.organizationXPEarned = awardS1PracticeXP(0, 3);
  }
  const review = pcEvaluateS1Organization();
  const score = review.matchCount === review.total ? 2 : review.matchCount >= 3 ? 1 : 0;
  pcRecordS1LearningProgress('s1_learning_path_organized', score, pcS1LearningState.renamedTitles.join(' | '), `${review.matchCount} of ${review.total} activities match the suggested learning purpose.`, { organization: pcS1LearningState.organization, renamedTitles: pcS1LearningState.renamedTitles, placementMatches: review.matchCount, placementTotal: review.total });
  return pcRenderS1RevisedModuleOverview();
}

const PC_S1_DEV_RENAMES = Object.freeze([
  'Food Access and Community Health Reading',
  'Food Deserts and Community Barriers Video',
  'Module 3 Food Access Terms',
  'Discuss Community Food-Access Barriers',
  'Module 3 Food Access Quiz'
]);

function pcFillS1StartLearningDev() {
  if (scenarioIndex !== SCENARIO_INDEX.CONTENT_AVALANCHE) return false;
  if (pcS1LearningState.view === 'rename') {
    pcS1LearningState.renamedTitles = [...PC_S1_DEV_RENAMES];
    pcS1LearningState.renameNotice = 'DEV titles added.';
    pcRenderS1RenameComplete();
    return true;
  }
  if (pcS1LearningState.view === 'rename-complete') return pcStartS1Organize();
  if (pcS1LearningState.view === 'revised-overview') return pcGenerateS1GuideStep1();
  if (pcS1LearningState.view === 'guide-step1' || pcS1LearningState.view === 'guide-step1-babbage') {
    pcS1LearningState.guide.step1.added = true;
    pcSaveS1Guide();
    return pcRenderS1GuideStep1();
  }
  if (pcS1LearningState.view === 'diagnosis') {
    pcS1LearningState.diagnosisChoice = 'evidence-gap';
    pcS1LearningState.diagnosisConfirmed = false;
    pcRenderS1Diagnosis();
    return true;
  }
  if (pcS1LearningState.view === 'diagnosis-result') return pcPlayS1MyCourseTransition();
  if (pcS1LearningState.view === 'my-course') {
    pcS1LearningState.myCourse = {
      moduleTitle: 'Week 4 — Informative Speech',
      intendedLearning: 'Students will organize and deliver a five-minute informative speech using credible supporting evidence.',
      activities: ['Read: Organizing an Informative Speech', 'Watch: Model Speech and Notice the Structure', 'Practice: Draft and Peer Review the Outline', 'Submit: Recorded Informative Speech']
    };
    pcSaveS1MyCourse();
    return pcRenderS1MyCourseStep('activities');
  }
  if (pcS1LearningState.view === 'my-course-feedback') return pcAddS1MyCourseReviewToGuide();
  if (pcS1LearningState.view === 'full-guide') return pcPlayS1ClosingDialogue();
  if (pcS1LearningState.view === 'organize') {
    pcS1LearningState.organization = {
      'food-access-reading': 'prepare',
      'food-access-video': 'prepare',
      'module-terms': 'prepare',
      'discussion-3': 'practice',
      'quiz-3': 'evidence'
    };
    pcS1LearningState.organizationNotice = 'DEV organization added. Review or change it before continuing.';
    pcRenderS1OrganizeWorkspace();
    return true;
  }
  pcS1LearningState.opened = new Set(PC_S1_LEARNING_ITEMS.map((_, index) => index));
  pcS1LearningState.activeIndex = PC_S1_LEARNING_ITEMS.length - 1;
  pcS1LearningState.view = 'item';
  pcRenderS1ExploreWorkspace();
  return true;
}

function pcCompleteS1LearningExplore() {
  return pcStartS1Rename();
}

function renderS1StartWithLearning({ preserveProgress = false } = {}) {
  const area = document.getElementById('chat');
  const container = document.getElementById('inputContainer');
  if (!area) return false;
  if (!preserveProgress) pcResetS1LearningState();
  if (container) {
    container.className = 'pc-s1-learning-host';
    container.innerHTML = '';
    container.style.display = 'none';
  }
  const rendered = pcRenderS1ExploreWorkspace();
  resetSectionScroll(area, container);
  return rendered;
}

function pcScrollS1ReviewSection(sectionId) {
  const section = document.getElementById(String(sectionId || ''));
  const scroller = document.querySelector('.pc-s1-my-course-review-canvas');
  if (!section || !scroller) return false;
  const targetTop = Math.max(0, section.offsetTop - 118);
  scroller.scrollTo({ top: targetTop, behavior: 'smooth' });
  section.setAttribute('tabindex', '-1');
  window.setTimeout(() => section.focus({ preventScroll: true }), 250);
  return true;
}

function pcHasSavedS1Guide() {
  const guide = pcLoadS1Guide();
  return Boolean(guide?.step1?.added || guide?.myCourseReview?.added);
}

function pcOpenSavedS1Guide() {
  pcS1LearningState.guide = pcLoadS1Guide();
  if (!pcHasSavedS1Guide()) return false;
  if (typeof closeMainMenu === 'function') closeMainMenu({ force: true });
  return pcS1LearningState.guide?.myCourseReview?.added
    ? pcRenderS1FullGuide()
    : pcRenderS1GuideStep1();
}

pcRegisterUIActions({
  's1-learning-open-item': target => pcOpenS1LearningItem(target.dataset.pcItemIndex),
  's1-learning-show-module': () => pcShowS1LearningModule(),
  's1-learning-prev-item': () => pcMoveS1LearningItem(-1),
  's1-learning-next-item': () => pcMoveS1LearningItem(1),
  's1-learning-complete-explore': () => pcCompleteS1LearningExplore(),
  's1-learning-start-rename': () => pcStartS1Rename(),
  's1-learning-save-rename': form => pcSaveS1Rename(form),
  's1-learning-start-organize': () => pcStartS1Organize(),
  's1-learning-select-diagnosis': target => pcSelectS1Diagnosis(target.dataset.pcDiagnosisId),
  's1-learning-reflect-overview': () => pcPlayS1OverviewReflection(),
  's1-learning-build-guide-step1': () => pcGenerateS1GuideStep1(),
  's1-learning-add-guide-step1': () => pcAddS1GuideStep1(),
  's1-learning-view-guide-step1': () => pcViewS1GuideStep1(),
  's1-learning-continue-diagnosis': () => pcRenderS1Diagnosis(),
  's1-learning-start-my-course': () => pcPlayS1MyCourseTransition(),
  's1-my-course-add-guide': () => pcAddS1MyCourseReviewToGuide(),
  's1-learning-view-full-guide': () => pcRenderS1FullGuide(),
  's1-learning-review-section': target => pcScrollS1ReviewSection(target.dataset.pcReviewSection),
  's1-learning-close-with-pixel': () => pcPlayS1ClosingDialogue(),
  's1-my-course-step': target => pcRenderS1MyCourseStep(target.dataset.pcMyCourseStep || 'focus'),
  's1-learning-review-babbage': () => pcRunS1BabbageAnalysis(),
  's1-my-course-save-focus': form => pcSaveS1MyCourseFocus(form),
  's1-my-course-save-intent': form => pcSaveS1MyCourseIntent(form),
  's1-my-course-review': form => pcReviewS1MyCourse(form),
  'open-saved-course-guide': () => pcOpenSavedS1Guide(),
  's1-learning-prevent-link': () => false
});

pcExposeGlobals({ renderS1StartWithLearning, pcOpenS1LearningItem, pcShowS1LearningModule, pcStartS1Rename, pcStartS1Organize, pcRenderS1RevisedModuleOverview, pcRenderS1GuideStep1, pcGenerateS1GuideStep1, pcRenderS1Diagnosis, pcRenderS1DiagnosisResult, pcRenderS1MyCourseStep, pcRenderS1MyCourseFeedback, pcFillS1StartLearningDev, pcHasSavedS1Guide, pcOpenSavedS1Guide });
