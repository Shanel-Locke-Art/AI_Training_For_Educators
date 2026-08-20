// ══════════════════════════════════════════════════════
//  SURVEY CONFIGURATION
//  Change SURVEY_MODE to 'sheets' or 'qualtrics' when ready
//  Paste your Google Apps Script Web App URL into SHEETS_URL
// ══════════════════════════════════════════════════════
const SURVEY_MODE   = 'sheets';
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzAtqwPWbS-5BZQ3LyTjgDIkABoMM8KeL-OrzErb64SAipeu6gbxGFSjfHV_GVcH5ZU/exec';
const QUALTRICS_URL = 'YOUR_QUALTRICS_SURVEY_URL_HERE';

// ══════════════════════════════════════════════════════
//  BUILD + DATA SCHEMA VERSIONING
//  The app version is read from the active bundle's cache-busting query in index.html.
//  Update runtime/js/promptcraft.bundle.js?v=### once and the console build label and main-menu
//  version will stay synchronized automatically. Change the schema only when
//  the saved research-data structure changes.
// ══════════════════════════════════════════════════════
const PC_APP_SCRIPT_URL = (() => {
  const script = [...document.scripts].find(item =>
    /(?:^|\/)functions\/(?:app\.bundle|app)\.js(?:[?#]|$)/.test(item.src)
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
        1: pcProjectUrl('assets/images/backgrounds/gfc/s2-study-lounge.jpg')
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
      1: pcProjectUrl('assets/images/scenes/scenario-02-metacognition/scene.png'),
      2: pcProjectUrl('assets/images/backgrounds/classroom.png'),
      3: pcProjectUrl('assets/images/scenes/scenario-04-sync-bias/scene.png'),
      4: pcProjectUrl('assets/images/scenes/scenario-05-hallucination-hunt/scene.png'),
      5: pcProjectUrl('assets/images/scenes/scenario-06-predict-output/scene.png'),
      complete: pcProjectUrl('assets/images/scenes/completion/all-scenarios-complete.png')
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
// Uses text/plain so browser no-cors requests are not silently mangled by preflight/CORS rules.
// Apps Script still receives the JSON string in e.postData.contents.
const PC_SHEETS_DEBUG = PC_RUNTIME_DEBUG;

async function postToSheets(payload, label = 'PromptCraft data') {
  if (SURVEY_MODE !== 'sheets' || !SHEETS_URL || SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    console.warn('[PromptCraft] Sheets URL is not configured. Skipping:', label);
    return false;
  }

  const body = JSON.stringify(payload || {});

  try {
    if (PC_SHEETS_DEBUG) pcDebug(`[PromptCraft] Sending ${label} to Sheets:`, payload);

    await fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body
    });

    if (PC_SHEETS_DEBUG) pcDebug(`[PromptCraft] Sheets request dispatched: ${label}`);
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
window.testSheetsPing = function testSheetsPing() {
  return postToSheets({
    type: 'incremental',
    schema_version: PC_APP_SCHEMA_VERSION,
    app_build: PC_APP_BUILD_LABEL,
    timestamp: new Date().toISOString(),
    participant_id: 'browser-test',
    scenario_index: 'TEST',
    scenario_label: 'Browser ping',
    session_duration_min: 0,
    attempts: 0,
    current_score: '',
    best_score: '',
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
    event_type: 'browser_test_ping',
    session_id: pcSessionId,
    notes_coding_memo: location.href
  }, 'browser test ping');
};
