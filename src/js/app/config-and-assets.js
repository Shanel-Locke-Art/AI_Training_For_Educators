// ══════════════════════════════════════════════════════
//  SURVEY CONFIGURATION
//  Change SURVEY_MODE to 'sheets' or 'qualtrics' when ready
//  Paste your Google Apps Script Web App URL into SHEETS_URL
// ══════════════════════════════════════════════════════
const SURVEY_MODE   = 'sheets';
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzAtqwPWbS-5BZQ3LyTjgDIkABoMM8KeL-OrzErb64SAipeu6gbxGFSjfHV_GVcH5ZU/exec';
const QUALTRICS_URL = 'YOUR_QUALTRICS_SURVEY_URL_HERE';

// Keep live Babbage available when this build is opened from a copied folder,
// localhost, GitHub Pages, or another static host. The previous root-relative URL
// only worked when the page itself was served by the Netlify deployment.
const PC_CANONICAL_DEPLOYMENT_ORIGIN = 'https://promptcraft-test.netlify.app';
const PC_BABBAGE_ENDPOINT = String(
  window.PC_BABBAGE_ENDPOINT
  || `${PC_CANONICAL_DEPLOYMENT_ORIGIN}/.netlify/functions/babbage`
).trim();

// ══════════════════════════════════════════════════════
//  BUILD + DATA SCHEMA VERSIONING
//  The app version is read from the active bundle's cache-busting query in index.html.
//  Update runtime/js/promptcraft.bundle.js?v=### once and the console build label and main-menu
//  version will stay synchronized automatically. Change the schema only when
//  the saved research-data structure changes.
// ══════════════════════════════════════════════════════
const PC_APP_SCRIPT_URL = (() => {
  const currentScriptUrl = document.currentScript?.src || '';
  if (/(?:^|\/)runtime\/js\/promptcraft\.bundle\.js(?:[?#]|$)/.test(currentScriptUrl)) {
    return currentScriptUrl;
  }
  const script = [...document.scripts].find(item =>
    /(?:^|\/)(?:runtime\/js\/promptcraft\.bundle|functions\/(?:app\.bundle|app))\.js(?:[?#]|$)/.test(item.src)
  );
  return script?.src || new URL('runtime/js/promptcraft.bundle.js', document.baseURI).href;
})();
const PC_APP_VERSION = new URL(PC_APP_SCRIPT_URL).searchParams.get('v') || 'DEV';
const PC_APP_SCHEMA_VERSION = 'V121';
const PC_APP_BUILD_LABEL = `PROMPTCRAFT_V${PC_APP_VERSION}`;

function pcSyncAppVersionLabels() {
  const versionText = `Version ${PC_APP_VERSION}`;
  document.querySelectorAll('[data-pc-app-version], #mainMenuVersion').forEach((element) => {
    element.textContent = versionText;
  });
}

pcDebug('[PromptCraft] Loaded app.js build:', PC_APP_BUILD_LABEL, 'schema:', PC_APP_SCHEMA_VERSION);

// ══════════════════════════════════════════════════════
//  ASSET PATHS
//  Resolve every runtime asset from the project root, not from whichever URL
//  the browser happens to treat as the current document. This keeps images
//  working in nested hosting folders, Live Server, and copied project builds.
// ══════════════════════════════════════════════════════
const PC_PROJECT_ROOT_URL = new URL('../../', PC_APP_SCRIPT_URL);

function pcProjectUrl(path = '') {
  const cleanPath = String(path).replace(/^\.\//, '').replace(/^\//, '');
  return new URL(cleanPath, PC_PROJECT_ROOT_URL).href;
}

function pcSetImageFallbackVisibility(img, showFallback) {
  if (!img) return;
  const fallbackId = img.dataset.pcFallbackElement || '';
  const fallbackElement = fallbackId ? document.getElementById(fallbackId) : null;
  const loadedDisplay = img.dataset.pcLoadedDisplay || '';

  img.style.display = showFallback ? 'none' : loadedDisplay;
  if (fallbackElement) fallbackElement.style.display = showFallback ? (fallbackElement.dataset.pcFallbackDisplay || 'flex') : 'none';
}

function pcUseImageFallback(img, fallback = '') {
  if (!img) return;
  const fallbackPath = fallback || img.dataset.pcFallback || '';
  if (!fallbackPath || img.dataset.pcFallbackApplied === 'true') {
    pcSetImageFallbackVisibility(img, true);
    return;
  }
  img.dataset.pcFallbackApplied = 'true';
  img.src = /^([a-z]+:|data:|blob:)/i.test(fallbackPath)
    ? fallbackPath
    : pcProjectUrl(fallbackPath);
}

function pcSetImageSource(img, primary, fallback = '') {
  if (!img || !primary) return;
  img.dataset.pcFallback = fallback || '';
  img.dataset.pcFallbackApplied = 'false';
  img.onload = () => pcSetImageFallbackVisibility(img, false);
  img.onerror = () => pcUseImageFallback(img, fallback);
  img.src = /^([a-z]+:|data:|blob:)/i.test(primary)
    ? primary
    : pcProjectUrl(primary);
}

function pcHydrateStaticImages() {
  document.querySelectorAll('img[data-pc-image]').forEach(img => {
    pcSetImageSource(img, img.dataset.pcImage, img.dataset.pcFallback || '');
  });
}

pcExposeGlobals({
  pcProjectUrl,
  pcUseImageFallback,
  pcSetImageSource
});

const ASSETS = Object.freeze({
  images: Object.freeze({
    backgrounds: Object.freeze({
      app: pcProjectUrl('assets/images/backgrounds/app-background.png?v=2'),
      classroom: pcProjectUrl('assets/images/backgrounds/classroom.png'),
      scenarios: Object.freeze({
        0: pcProjectUrl('assets/images/backgrounds/gfc/s1-science-wing.jpg'),
        2: pcProjectUrl('assets/images/backgrounds/gfc/s2-study-lounge.jpg')
      })
    }),
    professorPixel: Object.freeze({
      neutral: pcProjectUrl('assets/images/characters/professor-pixel/neutral.png'),
      thinking: pcProjectUrl('assets/images/characters/professor-pixel/thinking.png'),
      excited: pcProjectUrl('assets/images/characters/professor-pixel/excited.png'),
      encouraging: pcProjectUrl('assets/images/characters/professor-pixel/encouraging.png'),
      skeptical: pcProjectUrl('assets/images/characters/professor-pixel/skeptical.png'),
      proud: pcProjectUrl('assets/images/characters/professor-pixel/proud.png')
    }),
    students: Object.freeze({
      jordan: Object.freeze({
        neutral: pcProjectUrl('assets/images/characters/students/jordan/neutral.png'),
        uncertain: pcProjectUrl('assets/images/characters/students/jordan/uncertain.png'),
        frustrated: pcProjectUrl('assets/images/characters/students/jordan/frustrated.png'),
        thinking: pcProjectUrl('assets/images/characters/students/jordan/thinking.png'),
        confident: pcProjectUrl('assets/images/characters/students/jordan/confident.png')
      }),
      eli: Object.freeze({
        neutral: pcProjectUrl('assets/images/characters/students/eli/neutral.png'),
        uncertain: pcProjectUrl('assets/images/characters/students/eli/uncertain.png'),
        frustrated: pcProjectUrl('assets/images/characters/students/eli/frustrated.png'),
        thinking: pcProjectUrl('assets/images/characters/students/eli/thinking.png'),
        confident: pcProjectUrl('assets/images/characters/students/eli/confident.png')
      }),
      maya: Object.freeze({
        neutral: pcProjectUrl('assets/images/characters/students/maya/neutral.png'),
        thinking: pcProjectUrl('assets/images/characters/students/maya/thinking.png'),
        uncertain: pcProjectUrl('assets/images/characters/students/maya/uncertain.png'),
        frustrated: pcProjectUrl('assets/images/characters/students/maya/frustrated.png'),
        confident: pcProjectUrl('assets/images/characters/students/maya/confident.png')
      })
    }),
    scenes: Object.freeze({
      0: pcProjectUrl('assets/images/scenes/scenario-01-engagement/scene.png'),
      1: pcProjectUrl('assets/images/backgrounds/classroom.png'),
      2: pcProjectUrl('assets/images/scenes/scenario-02-metacognition/scene.png'),
      3: pcProjectUrl('assets/images/backgrounds/classroom.png'),
      4: pcProjectUrl('assets/images/scenes/scenario-05-hallucination-hunt/scene.png'),
      5: pcProjectUrl('assets/images/scenes/scenario-06-predict-output/scene.png'),
      complete: pcProjectUrl('assets/images/scenes/completion/all-scenarios-complete.png')
    }),
    canvasContentAvalanche: Object.freeze({
      instructor: Object.freeze({
        beforeModule: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/instructor-before-module.png'),
        beforeModuleMobileWide: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/instructor-before-module-mobile-wide.png'),
        beforeModuleMobilePhone: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/instructor-before-module-mobile-phone.png'),
        afterModule: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/instructor-after-module.png'),
        beforeWeek4Notes: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/instructor-before-week-4-notes.png'),
        beforeComparisonAssignment: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/instructor-before-comparison-assignment.png'),
        beforeBuriedDirections: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/instructor-before-buried-directions.png'),
        afterStartHere: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/instructor-after-start-here.png'),
        afterSubmitAssignment: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/instructor-after-submit-assignment.png'),
        afterReadPage: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/instructor-after-read-page.png')
      }),
      student: Object.freeze({
        beforeModule: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/student-before-module.png'),
        beforeModuleMobileWide: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/student-before-module-mobile-wide.png'),
        beforeModuleMobilePhone: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/student-before-module-mobile-phone.png'),
        afterModule: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/student-after-module.png'),
        beforeComparisonAssignment: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/student-before-comparison-assignment.png'),
        afterStartHere: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/student-after-start-here.png')
      }),
      smartboard: Object.freeze({
        instructorBeforeModule: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/smartboard/instructor-before-module-focus.png'),
        instructorAfterModule: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/smartboard/instructor-after-module-focus.png'),
        studentBeforeModule: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/smartboard/student-before-module-focus.png'),
        studentAfterModule: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/smartboard/student-after-module-focus.png'),
        instructorBeforeComparisonAssignment: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/smartboard/instructor-before-comparison-assignment-safe-focus.png'),
        instructorAfterSubmitAssignment: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/smartboard/instructor-after-submit-assignment-focus.png'),
        instructorBeforeBuriedDirections: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/smartboard/instructor-before-buried-directions-focus.png'),
        instructorAfterStartHere: pcProjectUrl('assets/images/scenes/scenario-01-content-avalanche/canvas/smartboard/instructor-after-start-here-focus.png')
      })
    })
  }),
  audio: Object.freeze({
    music: Object.freeze({
      background: pcProjectUrl('assets/audio/music/background.mp3')
    }),
    professorPixel: Object.freeze({
      scenarioIntro0: pcProjectUrl('assets/audio/voice/professor-pixel/scenario-01/intro.mp3'),
      reflectionOpen: pcProjectUrl('assets/audio/voice/professor-pixel/reflection/open.mp3')
    })
  })
});

// Scenario 1 Canvas evidence is kept as structured data so a gallery, card-sort,
// or before/after comparison can reuse the same assets without duplicating paths
// or losing the perspective and instructional purpose of each screenshot.
const PC_S1_CANVAS_EVIDENCE = Object.freeze([
  Object.freeze({ id: 'instructor-before-module', perspective: 'instructor', state: 'before', surface: 'module', src: ASSETS.images.canvasContentAvalanche.instructor.beforeModule, compactSrc: ASSETS.images.canvasContentAvalanche.instructor.beforeModuleMobileWide, mobileSrc: ASSETS.images.canvasContentAvalanche.instructor.beforeModuleMobilePhone, smartboardSrc: ASSETS.images.canvasContentAvalanche.smartboard.instructorBeforeModule, alt: 'Actual Canvas mobile instructor view of the expanded BEFORE Week 4 Content Avalanche module with content-type icons, accessibility indicators, publication controls, a quiz, and a comparison assignment.' }),
  Object.freeze({ id: 'instructor-after-module', perspective: 'instructor', state: 'after', surface: 'module', src: ASSETS.images.canvasContentAvalanche.instructor.afterModule, smartboardSrc: ASSETS.images.canvasContentAvalanche.smartboard.instructorAfterModule, alt: 'Instructor view of the expanded AFTER Week 4 Visible Learning Path module organized into Start Here, Learn, Submit, and Continue sections.' }),
  Object.freeze({ id: 'instructor-before-week-4-notes', perspective: 'instructor', state: 'before', surface: 'page', src: ASSETS.images.canvasContentAvalanche.instructor.beforeWeek4Notes, alt: 'Instructor view of the Week 4 Notes page where directions appear in a dense paragraph and refer learners to several other module items.' }),
  Object.freeze({ id: 'instructor-before-comparison-assignment', perspective: 'instructor', state: 'before', surface: 'assignment', src: ASSETS.images.canvasContentAvalanche.instructor.beforeComparisonAssignment, smartboardSrc: ASSETS.images.canvasContentAvalanche.smartboard.instructorBeforeComparisonAssignment, alt: 'Instructor view of the vague Comparison assignment, which tells learners to find additional directions elsewhere in the module.' }),
  Object.freeze({ id: 'instructor-before-buried-directions', perspective: 'instructor', state: 'before', surface: 'page', src: ASSETS.images.canvasContentAvalanche.instructor.beforeBuriedDirections, smartboardSrc: ASSETS.images.canvasContentAvalanche.smartboard.instructorBeforeBuriedDirections, alt: 'Instructor view of the What to do next page where the 400-word requirement, evidence expectations, case, deadline, and quiz sequence are finally revealed.' }),
  Object.freeze({ id: 'instructor-after-start-here', perspective: 'instructor', state: 'after', surface: 'page', src: ASSETS.images.canvasContentAvalanche.instructor.afterStartHere, smartboardSrc: ASSETS.images.canvasContentAvalanche.smartboard.instructorAfterStartHere, alt: 'Instructor view of the redesigned Start Here page showing the destination, ordered learning path, estimated workload, due point, value, and learning outcome.' }),
  Object.freeze({ id: 'instructor-after-submit-assignment', perspective: 'instructor', state: 'after', surface: 'assignment', src: ASSETS.images.canvasContentAvalanche.instructor.afterSubmitAssignment, smartboardSrc: ASSETS.images.canvasContentAvalanche.smartboard.instructorAfterSubmitAssignment, alt: 'Instructor view of the redesigned submission assignment with the task, four required parts, success criteria, length, due point, and point value visible together.' }),
  Object.freeze({ id: 'instructor-after-read-page', perspective: 'instructor', state: 'after', surface: 'page', src: ASSETS.images.canvasContentAvalanche.instructor.afterReadPage, alt: 'Instructor view of the redesigned reading page with purpose, estimated time, two planning models, direct reading links, an evidence-capture task, and a clear next step.' }),
  Object.freeze({ id: 'student-before-module', perspective: 'student', state: 'before', surface: 'module', src: ASSETS.images.canvasContentAvalanche.student.beforeModule, compactSrc: ASSETS.images.canvasContentAvalanche.student.beforeModuleMobileWide, mobileSrc: ASSETS.images.canvasContentAvalanche.student.beforeModuleMobilePhone, smartboardSrc: ASSETS.images.canvasContentAvalanche.smartboard.studentBeforeModule, alt: 'Actual Canvas mobile student view of the BEFORE module showing a long flat list of files and pages with no visible learning sequence or instructor-only publication controls.' }),
  Object.freeze({ id: 'student-after-module', perspective: 'student', state: 'after', surface: 'module', src: ASSETS.images.canvasContentAvalanche.student.afterModule, smartboardSrc: ASSETS.images.canvasContentAvalanche.smartboard.studentAfterModule, alt: 'Student view of the AFTER module showing a visible path from Start Here through Learn and Submit to Continue.' }),
  Object.freeze({ id: 'student-before-comparison-assignment', perspective: 'student', state: 'before', surface: 'assignment', src: ASSETS.images.canvasContentAvalanche.student.beforeComparisonAssignment, alt: 'Student submission view of the vague Comparison assignment with a large text editor but no visible length, evidence, case, or success requirements.' }),
  Object.freeze({ id: 'student-after-start-here', perspective: 'student', state: 'after', surface: 'page', src: ASSETS.images.canvasContentAvalanche.student.afterStartHere, alt: 'Student view of the redesigned Start Here page with the purpose, sequence, workload, due point, point value, learning outcome, and next step visible before work begins.' })
]);

function pcGetS1CanvasEvidence(id) {
  return PC_S1_CANVAS_EVIDENCE.find(item => item.id === id) || null;
}

pcExposeGlobals({ PC_S1_CANVAS_EVIDENCE, pcGetS1CanvasEvidence });

function pcGetScenarioBackgroundAsset(index) {
  const normalized = Number(index);
  return ASSETS.images.backgrounds.scenarios[normalized] || ASSETS.images.backgrounds.classroom;
}

pcExposeGlobals({ pcGetScenarioBackgroundAsset });

const LEGACY_ASSETS = Object.freeze({
  images: Object.freeze({
    backgrounds: Object.freeze({
      app: 'images/background.png',
      classroom: 'images/classroom-bg.png'
    }),
    professorPixel: Object.freeze({
      neutral: 'images/pixel-neutral.png',
      thinking: 'images/pixel-thinking.png',
      excited: 'images/pixel-excited.png',
      encouraging: 'images/pixel-encouraging.png',
      skeptical: 'images/pixel-skeptical.png',
      proud: 'images/pixel-proud.png'
    }),
    students: Object.freeze({
      jordan: Object.freeze({
        neutral: 'images/characters/students/jordan/neutral.png',
        uncertain: 'images/characters/students/jordan/uncertain.png',
        frustrated: 'images/characters/students/jordan/frustrated.png',
        thinking: 'images/characters/students/jordan/thinking.png',
        confident: 'images/characters/students/jordan/confident.png'
      }),
      eli: Object.freeze({
        neutral: 'images/characters/students/eli/neutral.png',
        uncertain: 'images/characters/students/eli/uncertain.png',
        frustrated: 'images/characters/students/eli/frustrated.png',
        thinking: 'images/characters/students/eli/thinking.png',
        confident: 'images/characters/students/eli/confident.png'
      }),
      maya: Object.freeze({
        neutral: 'images/characters/students/maya/neutral.png',
        thinking: 'images/characters/students/maya/thinking.png',
        uncertain: 'images/characters/students/maya/uncertain.png',
        frustrated: 'images/characters/students/maya/frustrated.png',
        confident: 'images/characters/students/maya/confident.png'
      })
    }),
    scenes: Object.freeze({
      0: 'images/scene-s1.png',
      1: 'images/scene-s2.png',
      2: 'images/classroom-bg.png',
      3: 'images/scene-s4.png',
      4: 'images/scene-s5.png',
      5: 'images/scene-s6.png',
      complete: 'images/scene-complete.png'
    })
  })
});

// Make CSS background paths use the same project-root resolution as JavaScript.
document.documentElement.style.setProperty('--pc-app-background', `url("${ASSETS.images.backgrounds.app}")`);
document.documentElement.style.setProperty('--pc-app-background-legacy', 'none');


// Robust Google Sheets poster.
// text/plain keeps this a CORS-simple request while normal CORS mode lets the app
// read the V84 receiver response. The old no-cors request always returned an opaque
// response, so the app reported success even when Apps Script returned an error.
const PC_SHEETS_DEBUG = PC_RUNTIME_DEBUG;

async function postToSheets(payload, label = 'PromptCraft data') {
  if (SURVEY_MODE !== 'sheets' || !SHEETS_URL || SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    console.warn('[PromptCraft] Sheets URL is not configured. Skipping:', label);
    return false;
  }

  const body = JSON.stringify(payload || {});

  try {
    if (PC_SHEETS_DEBUG) pcDebug(`[PromptCraft] Sending ${label} to Sheets:`, payload);

    const response = await fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body
    });

    const responseText = await response.text();
    let result = {};
    try { result = responseText ? JSON.parse(responseText) : {}; } catch (_error) {}
    if (!response.ok || result.status !== 'ok') {
      const message = result.message || responseText || `HTTP ${response.status}`;
      throw new Error(`Sheets receiver rejected ${label}: ${message}`);
    }

    if (PC_SHEETS_DEBUG) pcDebug(`[PromptCraft] Sheets write confirmed: ${label}`, result);
    return true;
  } catch (err) {
    console.warn(`[PromptCraft] fetch failed for ${label}:`, err);
  }

  // Fallback for some browser/security contexts.
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
      const ok = navigator.sendBeacon(SHEETS_URL, blob);
      pcDebug(`[PromptCraft] sendBeacon fallback ${ok ? 'queued' : 'failed'}: ${label}`);
      return ok;
    }
  } catch (err) {
    console.warn(`[PromptCraft] sendBeacon failed for ${label}:`, err);
  }

  return false;
}

// Run from DevTools console: testSheetsPing()
// This deliberately creates a visible, clearly labeled S1 connection-test row.
window.testSheetsPing = function testSheetsPing() {
  return postToSheets({
    type: 'incremental',
    schema_version: PC_APP_SCHEMA_VERSION,
    app_build: PC_APP_BUILD_LABEL,
    timestamp: new Date().toISOString(),
    participant_id: 'browser-test',
    scenario_index: 1,
    scenario_label: 'S1: The Content Avalanche',
    session_duration_min: 0,
    attempts: 1,
    current_score: 1,
    best_score: 1,
    score_delta: '',
    prompt_text: 'Browser-to-Apps-Script test ping',
    claude_response: 'If this row appears, the deployed site can write to Sheets.',
    babbage_response: 'If this row appears, the deployed site can write to Sheets.',
    ai_provider: 'receiver-test',
    ai_model: 'receiver-test',
    quality_indicators_lit: '',
    self_report_prediction: '',
    time_since_last_attempt_sec: '',
    screen_width: window.innerWidth || window.screen.width,
    event_type: 'browser_connection_test_complete',
    session_id: pcSessionId,
    notes_coding_memo: location.href
  }, 'browser test ping');
};

// Read-only connection check for both external services. Run from DevTools with:
// await testPromptCraftConnections()
window.testPromptCraftConnections = async function testPromptCraftConnections() {
  async function check(url) {
    try {
      const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`, { cache: 'no-store' });
      const text = await response.text();
      let body = {};
      try { body = text ? JSON.parse(text) : {}; } catch (_error) {}
      return { ok: response.ok, status: response.status, body };
    } catch (error) {
      return { ok: false, status: 0, error: String(error && error.message ? error.message : error) };
    }
  }

  const [sheets, babbage] = await Promise.all([
    check(SHEETS_URL),
    check(PC_BABBAGE_ENDPOINT)
  ]);
  const result = { sheets, babbage };
  console.table({
    sheets: { ok: sheets.ok, status: sheets.status, version: sheets.body?.receiver_version || '', configured: sheets.body?.workbook_accessible ?? '' },
    babbage: { ok: babbage.ok, status: babbage.status, version: babbage.body?.proxy_version || '', configured: babbage.body?.configured ?? '' }
  });
  return result;
};
