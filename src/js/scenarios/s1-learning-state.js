/* S1 local workspace, reset, scoring and asynchronous-work guards. */

// P590 starts the production-ready local workspace after the guide test cycle.
// Earlier generations contain prototype entries and must never populate a new run.
const PC_S1_MY_COURSE_STORAGE_KEY = 'promptcraft_my_course_s1_v3';
const PC_S1_GUIDE_STORAGE_KEY = 'promptcraft_s1_course_guide_v3';
const PC_S1_RETIRED_STORAGE_KEYS = Object.freeze([
  'promptcraft_my_course_s1_v1',
  'promptcraft_s1_course_guide_v1',
  'promptcraft_my_course_s1_v2',
  'promptcraft_s1_course_guide_v2'
]);
let pcS1WorkspaceEpoch = 0;

try { PC_S1_RETIRED_STORAGE_KEYS.forEach(key => localStorage.removeItem(key)); } catch (_error) {}

function pcInvalidateS1AsyncWork() {
  pcS1WorkspaceEpoch += 1;
  try { window.pcAbortScenarioBabbageRequests?.(); } catch (_error) {}
  return pcS1WorkspaceEpoch;
}

function pcS1AsyncWorkIsCurrent(epoch) {
  // Leaving S1 does not reset its local epoch. Also check scenario ownership
  // so a late response cannot render a guide over the next scenario.
  return Number(epoch) === pcS1WorkspaceEpoch && scenarioIndex === SCENARIO_INDEX.CONTENT_AVALANCHE;
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

function pcClearS1LocalWorkspace() {
  // Invalidate first. Otherwise a Babbage request that began before reset can
  // finish after localStorage is cleared and write the saved guide back.
  pcInvalidateS1AsyncWork();
  const keys = [
    ...PC_S1_RETIRED_STORAGE_KEYS,
    PC_S1_MY_COURSE_STORAGE_KEY,
    PC_S1_GUIDE_STORAGE_KEY
  ];
  let cleared = true;
  try {
    keys.forEach(key => localStorage.removeItem(key));
    cleared = keys.every(key => localStorage.getItem(key) === null);
  } catch (_error) {
    cleared = false;
  }
  if (typeof pcS1LearningState !== 'undefined' && pcS1LearningState) {
    pcS1LearningState.myCourse = pcEmptyS1MyCourse();
    pcS1LearningState.guide = pcLoadS1Guide();
    pcS1LearningState.guideBabbageResponse = null;
    pcS1LearningState.myCourseBabbageResponse = null;
  }
  if (typeof updateMainMenuHome === 'function') updateMainMenuHome();
  if (document.body.classList.contains('pc-s1-guide-open') && typeof pcRenderCourseGuideOverview === 'function') {
    pcRenderCourseGuideOverview();
  }
  return cleared;
}

function pcCreateS1LearningState() {
  return {
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
    diagnosisRationale: '',
    diagnosisGoal: '',
    diagnosisEvidence: '',
    diagnosisNotice: '',
    diagnosisConfirmed: false,
    organizationXPEarned: 0,
    diagnosisXPEarned: 0,
    guideXPEarned: 0,
    myCourseXPEarned: 0,
    transferXPEarned: 0,
    transferReflection: '',
    transferActivity: '',
    transferChange: '',
    transferEvidence: '',
    guide: pcLoadS1Guide(),
    guideBabbageResponse: null,
    myCourseStep: 'focus',
    myCourse: pcLoadS1MyCourse(),
    myCourseNotice: '',
    myCourseBabbageResponse: null
  };
}

let pcS1LearningState = pcCreateS1LearningState();
let pcS1GuideOpenedFromMenu = false;

function pcPrepareS1GuideSurface(fromMenu = false) {
  pcS1GuideOpenedFromMenu = Boolean(fromMenu);
  document.body.classList.remove(
    's1-active',
    's1-result-active',
    'pc-shared-result-active',
    'pc-scenario-activity-active',
    'pc-main-menu-open',
    'pc-audio-setup-open',
    'pc-s1-ai-workspace-active',
    'pc-s1-reflection-analysis-active',
    'pc-s1-reflection-loading-active'
  );
  document.body.classList.add('pc-s1-guide-open');
  // A saved guide can be opened after a cancelled or interrupted modal. Clear
  // those full-screen surfaces before rendering so an invisible layer cannot
  // retain focus or swallow guide clicks and wheel input.
  ['nameModalOverlay', 'audioSetupOverlay', 'mainMenuOverlay'].forEach(id => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
    modal.inert = true;
    modal.hidden = true;
    modal.style.removeProperty('opacity');
    modal.style.removeProperty('pointer-events');
  });
  const overlay = pcSetVNOverlayState({ active: false });
  if (overlay) {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.inert = true;
    // The guide is a normal reading surface, not a dialogue layer. Keep the
    // retired VN surface out of hit testing as well as out of the tab order.
    overlay.style.setProperty('pointer-events', 'none', 'important');
  }
}

function pcResetS1LearningState() {
  pcInvalidateS1AsyncWork();
  pcS1GuideOpenedFromMenu = false;
  document.body.classList.remove('pc-s1-guide-open');
  const overlay = document.getElementById('vnOverlay');
  if (overlay) {
    overlay.inert = false;
    overlay.removeAttribute('aria-hidden');
    overlay.style.removeProperty('pointer-events');
  }
  pcS1LearningState = pcCreateS1LearningState();
}

function pcS1LearningAllOpened() {
  return pcS1LearningState.opened.size === PC_S1_LEARNING_ITEMS.length;
}

function pcS1LearningProgressText() {
  return `${pcS1LearningState.opened.size} of ${PC_S1_LEARNING_ITEMS.length} activities opened`;
}
