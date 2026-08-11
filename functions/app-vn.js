/* PROMPTCRAFT VISUAL NOVEL AND RESPONSIVE LAYOUT ENGINE
   Extracted from app.js in Version 270. Load after the preceding PromptCraft scripts. */

//  RESPONSIVE LAYOUT CONTROL
//  Search anchors inside this section:
//    [LAYOUT METRICS]            viewport measurements
//    [WORKSTATION FRAME]         shared computer size and monitor geometry
//    [LIVE ANALYSIS]             Claude analyzing readout
//    [COMPLETED ANALYSIS]        responsive diagnostic report
//    [PREDICTION DIALOGUE]       prediction choices and feedback spacing
//
//  Keep layout geometry here. Do not add competing CSS patches for these
//  JavaScript-owned computer states. That was how the workstation acquired
//  several contradictory opinions about its own dimensions.
// ══════════════════════════════════════════════════════

// [LAYOUT METRICS]
function pcViewportHeight() {
  const values = [
    window.innerHeight,
    document.documentElement?.clientHeight,
    window.visualViewport?.height
  ].filter((value) => Number.isFinite(value) && value > 0);

  return values.length ? Math.min(...values) : window.innerHeight;
}

function pcGetViewportWidthV273() {
  const values = [
    window.innerWidth,
    document.documentElement?.clientWidth,
    window.visualViewport?.width
  ].filter((value) => Number.isFinite(value) && value > 0);

  return values.length ? Math.min(...values) : window.innerWidth;
}

function pcGetViewportFamilyV273() {
  const width = pcGetViewportWidthV273();
  const height = pcViewportHeight();
  const aspectRatio = width / Math.max(height, 1);

  // Width has to participate before height. Otherwise a 1024 × 600 display
  // is mistaken for a phone and receives a nearly 100vw smartboard.
  if (width >= 760 && height <= 720) return 'short-landscape';
  if (width <= 380 || (width <= 560 && height <= 720)) return 'compact-phone';
  if (width <= 560) return 'standard-phone';
  if (width <= 1100 && aspectRatio < 0.9) return 'portrait-tablet';
  if (width <= 1400 && height <= 950) return 'compact-desktop';
  return 'desktop';
}

function pcApplyViewportFamilyV273() {
  const family = pcGetViewportFamilyV273();
  const html = document.documentElement;
  const body = document.body;
  const overlay = document.getElementById('vnOverlay');

  if (html) html.dataset.pcViewportFamily = family;
  if (body) body.dataset.pcViewportFamily = family;
  if (overlay) overlay.dataset.pcViewportFamily = family;
}

// [WORKSTATION FRAME]
// v159: Capture the prediction computer relative to the VN scene, not the
// browser viewport. The terminal is absolutely positioned inside #vnScene, so
// viewport coordinates caused the analyzing computer to shift even when the
// stored rectangle itself was accurate.
let pcPredictionTerminalFrameV159 = null;

function pcSetImportantStyles(element, declarations) {
  if (!element) return;
  declarations.forEach(([property, value]) => {
    element.style.setProperty(property, value, 'important');
  });
}

function pcRemoveInlineStyles(element, properties) {
  if (!element) return;
  properties.forEach((property) => element.style.removeProperty(property));
}

const PC_VN_OVERLAY_MODE_CLASSES = Object.freeze([
  'claude-prediction',
  'pc-clean-prediction',
  'pc-prediction-question',
  'pc-prediction-result',
  'claude-terminal-consult',
  'claude-terminal-textmode',
  'claude-analysis',
  'claude-consult',
  'pc-clean-output',
  'pc-clean-final',
  'analysis-complete',
  'scenario-intro-active'
]);

function pcSetVNOverlayState({ active = null, modes = [], preserve = [] } = {}) {
  const overlay = document.getElementById('vnOverlay') || document.querySelector('.vn-overlay');
  if (!overlay) return null;

  const preserved = new Set(preserve);
  PC_VN_OVERLAY_MODE_CLASSES.forEach(className => {
    if (!preserved.has(className)) overlay.classList.remove(className);
  });
  if (active === true) overlay.classList.add('active');
  if (active === false) overlay.classList.remove('active');
  if (modes.length) overlay.classList.add(...modes);
  return overlay;
}

function pcResetVNCharacters() {
  const overlay = document.getElementById('vnOverlay') || document.querySelector('.vn-overlay');
  const pixel = document.getElementById('vnCharacter');
  const student = document.getElementById('vnStudentCharacter');

  pixel?.classList.remove('visible', 'is-active', 'is-inactive');
  student?.classList.remove('visible', 'is-active', 'is-inactive');
  pixel?.style.removeProperty('display');
  student?.style.removeProperty('display');
  overlay?.classList.remove('pc-dual-character');
}

function pcResetVNDialogueState() {
  document.getElementById('vnDialogue')?.classList.remove(
    'has-choices',
    'prediction-question',
    'prediction-result'
  );
}

function pcApplyIpadLayoutV200(){
  if (typeof pcIsAnalysisReportActiveV122 === 'function' && pcIsAnalysisReportActiveV122()) return;

  const viewportWidth = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0);
  const viewportHeight = Math.max(window.innerHeight || 0, document.documentElement.clientHeight || 0);
  const isIpadViewport = viewportWidth >= 768 && viewportWidth <= 1180 && viewportHeight >= 900;
  const menuOverlay = document.getElementById('mainMenuOverlay');
  const menuShell = menuOverlay?.querySelector('.pc-main-menu-shell');
  const overlay = document.getElementById('vnOverlay');
  const smartboardWrap = document.querySelector('.vn-smartboard-wrap');
  const dialogue = document.getElementById('vnDialogue');
  const speaker = document.getElementById('vnSpeaker');
  const vnText = document.getElementById('vnText');
  const advanceHint = document.getElementById('vnAdvanceHint');
  const character = document.getElementById('vnCharacter');
  const portrait = document.getElementById('vnPortrait');

  const specialDialogueClasses = [
    'claude-prediction',
    'pc-clean-prediction',
    'pc-prediction-question',
    'claude-terminal-consult',
    'claude-terminal-textmode',
    'claude-analysis',
    'claude-consult',
    'pc-clean-output'
  ];

  const isRegularMobileDialogue = Boolean(
    viewportWidth <= 700 &&
    overlay?.classList.contains('active') &&
    !specialDialogueClasses.some(className => overlay.classList.contains(className))
  );

  // The iPhone SE Level 1 intro is the sole phone layout whose smartboard top
  // must be owned by CSS. The legacy 78px inline declaration prevented its
  // exact-height media query from moving the complete board upward.
  const isLevelOneIphoneSEIntro = Boolean(
    isRegularMobileDialogue &&
    scenarioIndex === SCENARIO_INDEX.ENGAGEMENT &&
    viewportWidth >= 370 && viewportWidth <= 380 &&
    viewportHeight >= 650 && viewportHeight <= 690 &&
    viewportHeight > viewportWidth
  );

  const isIntermediateIntro = Boolean(
    viewportWidth >= 701 &&
    viewportWidth <= 1510 &&
    overlay?.classList.contains('active') &&
    overlay.classList.contains('scenario-intro-active') &&
    !specialDialogueClasses.some(className => overlay.classList.contains(className))
  );

  // CSS owns regular intermediate portrait geometry. Remove stale inline values
  // left by prediction or legacy tablet states before the intro is shown.
  if (isIntermediateIntro) {
    pcRemoveInlineStyles(character, [
      'left', 'right', 'top', 'bottom', 'width', 'height',
      'min-width', 'min-height', 'max-width', 'max-height',
      'transform', 'transform-origin', 'z-index'
    ]);
    pcRemoveInlineStyles(portrait, [
      'width', 'height', 'min-width', 'min-height',
      'max-width', 'max-height', 'object-fit', 'object-position',
      'transform', 'transform-origin'
    ]);
  }

  if (menuOverlay) {
    if (isIpadViewport) {
      pcSetImportantStyles(menuOverlay, [
        ['padding-top', '22px'],
        ['padding-bottom', '22px'],
        ['overflow-y', 'auto']
      ]);
    } else {
      pcRemoveInlineStyles(menuOverlay, ['padding-top', 'padding-bottom', 'overflow-y']);
    }
  }

  if (menuShell) {
    if (isIpadViewport) {
      pcSetImportantStyles(menuShell, [
        ['margin', '0 auto'],
        ['width', 'min(82vw, 760px)'],
        ['max-height', 'calc(100vh - 44px)']
      ]);
    } else {
      pcRemoveInlineStyles(menuShell, ['margin', 'width', 'max-height']);
    }
  }

  if (smartboardWrap) {
    if (window.pcIpadBoardCenterFrameV200) {
      cancelAnimationFrame(window.pcIpadBoardCenterFrameV200);
      window.pcIpadBoardCenterFrameV200 = null;
    }

    if (isLevelOneIphoneSEIntro) {
      pcRemoveInlineStyles(smartboardWrap, [
        'left', 'right', 'top', 'margin-left', 'margin-right',
        'transform', 'transform-origin'
      ]);
    } else if (isRegularMobileDialogue) {
      pcSetImportantStyles(smartboardWrap, [
        ['left', 'clamp(8px, 3vw, 18px)'],
        ['right', 'clamp(8px, 3vw, 18px)'],
        ['top', '78px'],
        ['margin-left', '0'],
        ['margin-right', '0'],
        ['transform', 'none'],
        ['transform-origin', 'top center']
      ]);
    } else {
      pcRemoveInlineStyles(smartboardWrap, [
        'left', 'right', 'top', 'margin-left', 'margin-right',
        'transform', 'transform-origin'
      ]);
    }
  }

  // Shared CSS owns dialogue typography at every width. JavaScript only clears
  // stale inline values left by older prediction and tablet layouts. Keeping
  // font sizes out of resize handlers prevents the 700/701 and 1180/1181 jumps.
  pcRemoveInlineStyles(dialogue, ['padding-left', 'padding-right']);
  pcRemoveInlineStyles(speaker, [
    'font-family', 'font-size', 'font-weight', 'font-style',
    'line-height', 'margin-bottom'
  ]);
  pcRemoveInlineStyles(vnText, [
    'font-family', 'font-size', 'font-weight', 'line-height'
  ]);
  pcRemoveInlineStyles(advanceHint, ['font-size']);
}

let pcResponsiveChromeFrameV262 = 0;
function pcScheduleResponsiveChromeV262() {
  if (pcResponsiveChromeFrameV262) cancelAnimationFrame(pcResponsiveChromeFrameV262);
  pcResponsiveChromeFrameV262 = requestAnimationFrame(() => {
    pcResponsiveChromeFrameV262 = 0;
    pcApplyViewportFamilyV273();
    pcApplyIpadLayoutV200();
  });
}

if (!window.pcIpadLayoutV200Installed) {
  window.pcIpadLayoutV200Installed = true;
  window.addEventListener('resize', pcScheduleResponsiveChromeV262, { passive: true });
  window.addEventListener('orientationchange', pcScheduleResponsiveChromeV262, { passive: true });
  window.visualViewport?.addEventListener('resize', pcScheduleResponsiveChromeV262, { passive: true });
  document.addEventListener('DOMContentLoaded', () => {
    pcScheduleResponsiveChromeV262();
    const overlay = document.getElementById('vnOverlay');
    if (overlay && !window.pcIpadOverlayObserverV200) {
      window.pcIpadOverlayObserverV200 = new MutationObserver(pcScheduleResponsiveChromeV262);
      window.pcIpadOverlayObserverV200.observe(overlay, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }, { once: true });
}

function pcCapturePredictionTerminalFrameV159(terminal) {
  const scene = document.getElementById('vnScene');
  if (!terminal || !scene) return false;

  const terminalRect = terminal.getBoundingClientRect();
  const sceneRect = scene.getBoundingClientRect();

  if (
    terminalRect.width < 10 ||
    terminalRect.height < 10 ||
    sceneRect.width < 10 ||
    sceneRect.height < 10
  ) return false;

  pcPredictionTerminalFrameV159 = {
    leftPct: ((terminalRect.left - sceneRect.left) / sceneRect.width) * 100,
    topPct: ((terminalRect.top - sceneRect.top) / sceneRect.height) * 100,
    widthPct: (terminalRect.width / sceneRect.width) * 100,
    heightPct: (terminalRect.height / sceneRect.height) * 100
  };

  return true;
}

function pcApplyPredictionTerminalFrameV159(terminal, photo) {
  const scene = document.getElementById('vnScene');
  const frame = pcPredictionTerminalFrameV159;
  if (!terminal || !photo || !scene || !frame) return false;

  pcSetImportantStyles(scene, [
    ['position', 'relative']
  ]);

  pcSetImportantStyles(terminal, [
    ['position', 'absolute'],
    ['inset', 'auto'],
    ['left', `${frame.leftPct}%`],
    ['top', `${frame.topPct}%`],
    ['right', 'auto'],
    ['bottom', 'auto'],
    ['width', `${frame.widthPct}%`],
    ['height', `${frame.heightPct}%`],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['aspect-ratio', 'auto'],
    ['transform', 'none'],
    ['margin', '0']
  ]);

  pcSetImportantStyles(photo, [
    ['position', 'relative'],
    ['inset', 'auto'],
    ['width', '100%'],
    ['height', '100%'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['aspect-ratio', 'auto'],
    ['margin', '0'],
    // v207: The captured frame uses the prediction artwork's exact box.
    // Stretch the source image to that box just as the prediction state does so
    // the monitor coordinates remain identical when Claude begins analyzing.
    ['background-size', '100% 100%'],
    ['background-position', 'center center'],
    ['background-repeat', 'no-repeat']
  ]);

  return true;
}

// Expose the captured frame for inspection without mutating it.
window.pcGetPredictionTerminalFrame = () => (
  pcPredictionTerminalFrameV159 ? { ...pcPredictionTerminalFrameV159 } : null
);
window.pcCapturePredictionTerminalFrame = () => {
  const terminal = document.getElementById('claudeTerminalScene');
  const captured = pcCapturePredictionTerminalFrameV159(terminal);
  return captured ? { ...pcPredictionTerminalFrameV159 } : null;
};

// v186: Remove prediction-only geometry that earlier builds wrote inline.
// This deliberately does not touch class names or terminal content.
function pcClearPredictionLayoutInlineStylesV186() {
  const terminal = document.getElementById('claudeTerminalScene');
  const photo = terminal?.querySelector('.claude-terminal-photo');
  const screen = terminal?.querySelector('.claude-terminal-screen');
  const output = document.getElementById('claudeTerminalOutput');

  pcRemoveInlineStyles(terminal, [
    'position','inset','left','right','top','bottom','width','height',
    'min-width','min-height','max-width','max-height','aspect-ratio',
    'transform','margin','padding','display','opacity','visibility','overflow',
    'background','background-image','border','border-radius','box-shadow','z-index'
  ]);
  pcRemoveInlineStyles(photo, [
    'position','inset','left','right','top','bottom','width','height',
    'min-width','min-height','max-width','max-height','aspect-ratio',
    'transform','margin','padding','display','overflow','background',
    'background-image','background-size','background-position','background-repeat',
    'border','border-radius','box-shadow','filter'
  ]);
  pcRemoveInlineStyles(screen, [
    'position','inset','left','right','top','bottom','width','height',
    'min-width','min-height','max-width','max-height','transform','margin','padding',
    'display','align-items','justify-content','overflow','background','border',
    'border-radius','box-shadow','box-sizing'
  ]);
  pcRemoveInlineStyles(output, [
    'position','inset','left','right','top','bottom','width','height',
    'min-width','min-height','max-width','max-height','margin','padding','display',
    'overflow','background','border','border-radius','box-shadow','text-align',
    'white-space'
  ]);
}
window.pcClearPredictionLayoutInlineStyles = pcClearPredictionLayoutInlineStylesV186;

// v207: One authoritative owner for the photographed prediction computer on
// full-width screens. Earlier CSS and delayed layout passes disagreed about the
// outer frame and sometimes cleared the measured monitor geometry, leaving a
// large workstation with a small floating terminal panel. Keep this helper in
// JavaScript because prediction is rebuilt dynamically and later passes can
// otherwise win the cascade with stale inline values.
const PC_WIDE_PREDICTION_SCREEN_GEOMETRY_V207 = {
  left: '21.7%',
  top: '12.7%',
  width: '39.0%',
  height: '44.1%'
};

// [WORKSTATION FRAME: DESKTOP PREDICTION + LIVE ANALYSIS]
function pcApplyWidePredictionComputerV207(terminal, photo, screen, viewportHeight) {
  if (!terminal || !photo || !screen) return false;

  const isShortDesktop = Number.isFinite(viewportHeight) && viewportHeight <= 950;
  const terminalWidth = isShortDesktop ? 'min(66vw, 1320px)' : 'min(72vw, 1500px)';
  const terminalLeft = '47.5%';
  const terminalTop = isShortDesktop ? '37%' : '35.5%';

  pcSetImportantStyles(terminal, [
    ['position', 'absolute'],
    ['inset', 'auto'],
    ['left', terminalLeft],
    ['right', 'auto'],
    ['top', terminalTop],
    ['bottom', 'auto'],
    ['width', terminalWidth],
    ['height', 'auto'],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['aspect-ratio', '2 / 1'],
    ['transform', 'translate(-50%, -50%)'],
    ['margin', '0'],
    ['display', 'block'],
    ['opacity', '1'],
    ['visibility', 'visible'],
    ['overflow', 'visible'],
    ['z-index', '20']
  ]);

  pcSetImportantStyles(photo, [
    ['position', 'absolute'],
    ['inset', '0'],
    ['left', '0'],
    ['right', '0'],
    ['top', '0'],
    ['bottom', '0'],
    ['width', '100%'],
    ['height', '100%'],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['aspect-ratio', 'auto'],
    ['transform', 'none'],
    ['margin', '0'],
    ['background-size', '100% 100%'],
    ['background-position', 'center center'],
    ['background-repeat', 'no-repeat'],
    ['overflow', 'hidden']
  ]);

  pcSetImportantStyles(screen, [
    ['position', 'absolute'],
    ['inset', 'auto'],
    ['left', PC_WIDE_PREDICTION_SCREEN_GEOMETRY_V207.left],
    ['right', 'auto'],
    ['top', PC_WIDE_PREDICTION_SCREEN_GEOMETRY_V207.top],
    ['bottom', 'auto'],
    ['width', PC_WIDE_PREDICTION_SCREEN_GEOMETRY_V207.width],
    ['height', PC_WIDE_PREDICTION_SCREEN_GEOMETRY_V207.height],
    ['box-sizing', 'border-box'],
    ['transform', 'none'],
    ['overflow', 'hidden']
  ]);

  return true;
}

window.pcApplyWidePredictionComputer = () => {
  const terminal = document.getElementById('claudeTerminalScene');
  const photo = terminal?.querySelector('.claude-terminal-photo');
  const screen = terminal?.querySelector('.claude-terminal-screen');
  const viewportHeight = pcViewportHeight();
  return pcApplyWidePredictionComputerV207(terminal, photo, screen, viewportHeight);
};


// v321: The completed desktop diagnostic now uses the same measured monitor glass
// as the approved prediction/live-analysis workstation. The full 2:1 computer
// render stays intact so the monitor can scale up without re-cropping the tower
// or shifting the report outside the physical screen.
const PC_WIDE_ANALYSIS_REPORT_SCREEN_GEOMETRY_V215 = {
  // v346: Restore the proven monitor-glass geometry. The v345 geometry pushed
  // the terminal layer outside the photographed inner bezel on several tablets.
  left: '22.2%',
  top: '12.85%',
  width: '40.3%',
  height: '45.45%'
};

function pcClearWideAnalysisActionsV215() {
  const actionRow = document.getElementById('vnText');
  const buttons = actionRow ? [...actionRow.querySelectorAll('button')] : [];

  pcRemoveInlineStyles(actionRow, [
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'min-width', 'min-height', 'max-width', 'max-height', 'margin', 'padding',
    'display', 'grid-template-columns', 'align-items', 'justify-content', 'gap',
    'overflow', 'box-sizing', 'transform', 'z-index'
  ]);
  buttons.forEach((button) => pcRemoveInlineStyles(button, [
    'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
    'margin', 'padding', 'box-sizing', 'flex', 'flex-grow', 'flex-shrink', 'flex-basis'
  ]));
}

function pcCenterWideAnalysisActionsV215() {
  const actionRow = document.getElementById('vnText');
  if (!actionRow) return false;

  const buttons = [...actionRow.querySelectorAll('button')];
  if (!buttons.length) return false;

  pcSetImportantStyles(actionRow, [
    ['position', 'fixed'],
    ['inset', 'auto'],
    ['left', '50%'],
    ['right', 'auto'],
    ['top', 'auto'],
    ['bottom', 'clamp(22px, 2.8vh, 34px)'],
    ['width', 'max-content'],
    ['height', 'auto'],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'calc(100vw - 32px)'],
    ['max-height', 'none'],
    ['margin', '0'],
    ['padding', '0'],
    ['display', 'flex'],
    ['align-items', 'center'],
    ['justify-content', 'stretch'],
    ['gap', '14px'],
    ['overflow', 'visible'],
    ['box-sizing', 'border-box'],
    ['transform', 'translateX(-50%)'],
    ['z-index', '90']
  ]);

  buttons.forEach((button) => pcSetImportantStyles(button, [
    ['width', 'clamp(156px, 9vw, 176px)'],
    ['min-width', '0'],
    ['max-width', '176px'],
    ['height', 'auto'],
    ['min-height', '46px'],
    ['max-height', 'none'],
    ['margin', '0'],
    ['box-sizing', 'border-box'],
    ['flex', '1 1 auto']
  ]));

  return true;
}

function pcClearWideAnalysisReportContentStylesV215() {
  const output = document.getElementById('claudeTerminalOutput');
  const report = output?.querySelector('.analysis-report');
  const header = report?.querySelector('.analysis-header');
  const badge = report?.querySelector('.analysis-badge');
  const title = report?.querySelector('.analysis-title');
  const summary = report?.querySelector('.analysis-summary');
  const grid = report?.querySelector('.analysis-grid');
  const cards = report ? [...report.querySelectorAll('.analysis-card')] : [];
  const labels = report ? [...report.querySelectorAll('.analysis-label')] : [];
  const values = report ? [...report.querySelectorAll('.analysis-value')] : [];
  const notes = report ? [...report.querySelectorAll('.analysis-note')] : [];

  pcRemoveInlineStyles(output, [
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'min-width', 'min-height', 'max-width', 'max-height', 'margin', 'padding',
    'display', 'align-items', 'justify-content', 'overflow', 'overflow-x', 'overflow-y',
    'white-space', 'scrollbar-gutter', 'box-sizing', 'transform'
  ]);
  pcRemoveInlineStyles(report, [
    'position', 'width', 'max-width', 'height', 'min-width', 'min-height',
    'margin', 'padding', 'overflow', 'box-sizing', 'transform', 'transform-origin',
    'display', 'flex-direction', 'gap', 'grid-template-rows', 'align-items', 'justify-content',
    'border', 'border-radius', 'background', 'box-shadow', 'flex'
  ]);
  pcRemoveInlineStyles(header, [
    'margin', 'padding', 'border-width', 'box-shadow', 'box-sizing'
  ]);
  pcRemoveInlineStyles(badge, ['margin', 'padding', 'font-size', 'line-height']);
  pcRemoveInlineStyles(title, ['margin', 'font-size', 'line-height']);
  pcRemoveInlineStyles(summary, [
    'width', 'max-width', 'margin', 'font-size', 'line-height', 'overflow-wrap', 'word-break'
  ]);
  pcRemoveInlineStyles(grid, [
    'display', 'grid-template-columns', 'grid-template-rows', 'grid-template-areas', 'gap', 'width', 'height',
    'min-height', 'margin', 'box-sizing', 'align-items', 'align-content', 'flex',
    'flex-grow', 'flex-shrink', 'flex-basis'
  ]);
  cards.forEach((card) => pcRemoveInlineStyles(card, [
    'margin', 'padding', 'min-width', 'min-height', 'height', 'border-width',
    'box-shadow', 'box-sizing', 'display', 'flex-direction', 'justify-content', 'overflow',
    'grid-area', 'border-radius'
  ]));
  labels.forEach((label) => pcRemoveInlineStyles(label, [
    'margin', 'font-size', 'line-height'
  ]));
  values.forEach((value) => pcRemoveInlineStyles(value, [
    'font-size', 'line-height', 'overflow-wrap', 'word-break'
  ]));
  notes.forEach((note) => pcRemoveInlineStyles(note, [
    'margin-top', 'font-size', 'line-height'
  ]));

  pcClearWideAnalysisActionsV215();
}

// [COMPLETED ANALYSIS: CONTENT AUTO-FIT]
function pcFitWideAnalysisReportV215(screen) {
  if (!screen) return false;

  const output = screen.querySelector('#claudeTerminalOutput.claude-analysis-layout');
  const report = output?.querySelector('.analysis-report');
  if (!output || !report) return false;

  const header = report.querySelector('.analysis-header');
  const badge = report.querySelector('.analysis-badge');
  const title = report.querySelector('.analysis-title');
  const summary = report.querySelector('.analysis-summary');
  const grid = report.querySelector('.analysis-grid');
  const cards = [...report.querySelectorAll('.analysis-card')];
  const statusCard = report.querySelector('.analysis-status-card');
  const confidenceCard = report.querySelector('.analysis-confidence-card');
  const workedCard = report.querySelector('.analysis-worked-card');
  const issueCard = report.querySelector('.analysis-issue-card');
  const repairCard = report.querySelector('.analysis-repair-card');
  const impactCard = report.querySelector('.analysis-impact-card');
  const labels = [...report.querySelectorAll('.analysis-label')];
  const icons = [...report.querySelectorAll('.analysis-icon')];
  const values = [...report.querySelectorAll('.analysis-value')];
  const bigValues = [...report.querySelectorAll('.analysis-value.big')];
  const notes = [...report.querySelectorAll('.analysis-note')];
  if (!header || !badge || !title || !summary || !grid) return false;

  const screenRect = screen.getBoundingClientRect();
  const clampNumber = (min, value, max) => Math.max(min, Math.min(max, value));
  const viewportWidth = pcAnalysisViewportWidthV122();
  const viewportHeight = pcViewportHeight();
  // v329: Short landscape workstation displays (notably Nest Hub Max) have a
  // physically wide monitor even though the measured glass can land just below
  // the old 560x320 cutoff. Treat those screens like the full-screen desktop
  // diagnostic so the complete two-column report auto-fits inside the monitor
  // instead of switching to the oversized tablet/scrolling typography.
  // v330: Nest Hub (1024 × 600 class) now uses the photographed workstation
  // instead of the old floating terminal panel. Its physical monitor is smaller
  // than the desktop cutoff, so explicitly treat that glass as a wide diagnostic
  // surface. This preserves the two-column report and avoids the giant clipped
  // single-column panel that previously occupied the whole display.
  const isNestHubWorkstation = viewportWidth >= 980 && viewportWidth <= 1100 &&
    viewportHeight >= 560 && viewportHeight <= 680 &&
    screenRect.width >= 500 && screenRect.height >= 275;
  // v332: The 1024x1366 iPad Pro was being misclassified as a wide desktop
  // simply because its photographed monitor is physically wide. Keep portrait
  // tablets in the readable tablet layout so the report can use larger text and
  // scroll inside the monitor instead of shrinking until every card fits.
  const isPortraitTabletWorkstation = viewportWidth >= 900 && viewportWidth <= 1100 &&
    viewportHeight >= 1200;
  const isWideDesktopMonitor = !isPortraitTabletWorkstation && (isNestHubWorkstation ||
    (screenRect.width >= 560 && screenRect.height >= 320) ||
    (viewportWidth > 1180 && viewportHeight <= 900 &&
      screenRect.width >= 500 && screenRect.height >= 270));
  const isShortLandscapePanel = !isWideDesktopMonitor && viewportWidth >= 900 && viewportHeight <= 700;
  const isCompactAnalysisPanel = !isWideDesktopMonitor && (viewportWidth <= 640 || isShortLandscapePanel);
  const isTabletWorkstation = !isWideDesktopMonitor && viewportWidth >= 700 && viewportWidth <= 1366;
  const isMediumAnalysisPanel = !isCompactAnalysisPanel && (viewportWidth > 640 && viewportWidth <= 920 || isTabletWorkstation);
  const isTallPortraitWorkstation = isWideDesktopMonitor && viewportWidth >= 980 && viewportWidth <= 1100 && viewportHeight >= 1280;
  const isLargePortraitWorkstation = isTallPortraitWorkstation && viewportWidth >= 1000 && viewportHeight >= 1320;
  // v333: Give the 1024x1366 iPad Pro the same *visual* diagnostic treatment
  // as the iPad Air. Because the Pro's photographed monitor glass is physically
  // larger, reusing the ordinary tablet scale makes the report look noticeably
  // smaller even though its CSS font size is technically larger. Increase the
  // Pro's type scale enough to match the Air's screen-relative proportions; the
  // report already scrolls inside the monitor when the larger content needs room.
  const isIPadProReadableProfile = isPortraitTabletWorkstation &&
    viewportWidth >= 980 && viewportWidth <= 1060 &&
    viewportHeight >= 1320 && viewportHeight <= 1400;
  // v372: Surface Pro and similar tall 900px-class portrait workstations have
  // plenty of monitor width, but previous auto-fit logic treated that width as
  // permission to shrink the report aggressively. Use a larger medium profile
  // and let the monitor scroll instead.
  const isTallMediumPortraitReadableProfile = isMediumAnalysisPanel &&
    viewportWidth >= 820 && viewportWidth <= 960 &&
    viewportHeight >= 1200;
  const mediumScale = isMediumAnalysisPanel
    ? (isIPadProReadableProfile
      ? 1.42
      : isTallMediumPortraitReadableProfile
        ? 1.34
        : clampNumber(1.02, viewportWidth / 860, viewportHeight >= 1100 ? 1.22 : 1.14))
    : 1;
  const useSingleColumn = screenRect.width < 420 || isCompactAnalysisPanel;
  const widthFactor = screenRect.width / 900;
  const heightFactor = screenRect.height / 520;
  const fitFactor = clampNumber(
    0.56,
    Math.min(widthFactor, heightFactor) * (isLargePortraitWorkstation ? 1.62 : isTallPortraitWorkstation ? 1.30 : 1),
    isLargePortraitWorkstation ? 1.48 : 1.26
  );
  const base = isCompactAnalysisPanel ? {
    badge: 11,
    title: 29,
    summary: 17,
    label: 12,
    value: 17,
    big: 19,
    note: 15.5,
    outputPadding: 5,
    reportPadding: 9,
    gap: 11,
    cardPadding: 10,
    headerGap: 8
  } : isMediumAnalysisPanel ? {
    badge: 11.5 * mediumScale,
    title: 36 * mediumScale,
    summary: 18 * mediumScale,
    label: 12.25 * mediumScale,
    value: 17.25 * mediumScale,
    big: 20.5 * mediumScale,
    note: 15.5 * mediumScale,
    outputPadding: 10,
    reportPadding: 15,
    gap: 13,
    cardPadding: 13,
    headerGap: 9
  } : {
    badge: clampNumber(7.5, 10.5 * fitFactor, 12),
    title: clampNumber(19, 32 * fitFactor, 36),
    summary: clampNumber(10, 15.5 * fitFactor, 17.5),
    label: clampNumber(8, 11.5 * fitFactor, 12.5),
    value: clampNumber(10, 15.2 * fitFactor, 17.5),
    big: clampNumber(11, 17 * fitFactor, 19.5),
    note: isWideDesktopMonitor
      ? clampNumber(10, 13.8 * fitFactor, 15.5)
      : clampNumber(8.5, 12.2 * fitFactor, 13.5),
    outputPadding: isWideDesktopMonitor
      ? clampNumber(0, 1.1 * fitFactor, 2)
      : clampNumber(2, 4.5 * fitFactor, 6),
    reportPadding: isWideDesktopMonitor
      ? clampNumber(1, 3 * fitFactor, 5)
      : clampNumber(3.5, 6 * fitFactor, 8),
    gap: isWideDesktopMonitor
      ? clampNumber(2, 4.4 * fitFactor, 6)
      : clampNumber(4, 6.5 * fitFactor, 9),
    cardPadding: isWideDesktopMonitor
      ? clampNumber(3, 5.6 * fitFactor, 7)
      : clampNumber(5, 8 * fitFactor, 10),
    headerGap: isWideDesktopMonitor
      ? clampNumber(1.25, 3 * fitFactor, 4.5)
      : clampNumber(3, 4.75 * fitFactor, 6)
  };

  // v345: The terminal output is the monitor glass. Put the green edge on
  // the glass itself instead of on an inset report card, so the diagnostic
  // reaches the physical inner bezel on every workstation format.
  pcSetImportantStyles(output, [
    ['position', 'absolute'],
    ['inset', '0'],
    ['left', '0'],
    ['right', '0'],
    ['top', '0'],
    ['bottom', '0'],
    ['width', '100%'],
    ['height', '100%'],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['margin', '0'],
    ['padding', isMediumAnalysisPanel ? '3px' : `${Math.max(2, base.outputPadding)}px`],
    ['display', 'flex'],
    ['align-items', 'stretch'],
    ['justify-content', 'stretch'],
    ['overflow', 'hidden'],
    ['overflow-x', 'hidden'],
    ['overflow-y', 'hidden'],
    ['white-space', 'normal'],
    ['scrollbar-gutter', 'auto'],
    ['box-sizing', 'border-box'],
    ['transform', 'none'],
    ['border', '0'],
    ['border-radius', '0'],
    ['background', 'transparent'],
    ['box-shadow', 'none']
  ]);

  pcSetImportantStyles(report, [
    ['position', 'relative'],
    ['width', '100%'],
    ['max-width', '100%'],
    ['height', '100%'],
    ['min-width', '0'],
    ['min-height', '0'],
    ['margin', '0'],
    ['padding', `${base.reportPadding}px`],
    ['display', 'flex'],
    ['flex-direction', 'column'],
    ['gap', `${base.gap}px`],
    ['align-items', 'stretch'],
    ['justify-content', 'flex-start'],
    ['overflow', 'hidden'],
    ['box-sizing', 'border-box'],
    ['border', '1px solid rgba(72,255,92,.92)'],
    ['border-radius', `${isMediumAnalysisPanel ? 4 : clampNumber(7, 11 * fitFactor, 14)}px`],
    ['background', 'linear-gradient(180deg, rgba(0,35,18,.96), rgba(0,14,7,.98))'],
    ['box-shadow', 'inset 0 0 22px rgba(45,255,94,.08)'],
    ['transform', 'none'],
    ['transform-origin', 'center center']
  ]);

  pcSetImportantStyles(header, [
    ['margin', '0'],
    ['padding', '0'],
    ['display', 'grid'],
    ['gap', `${base.headerGap}px`],
    ['border', '0'],
    ['box-shadow', 'none'],
    ['box-sizing', 'border-box'],
    ['flex', '0 0 auto']
  ]);

  pcSetImportantStyles(grid, [
    ['display', 'grid'],
    ['grid-template-columns', useSingleColumn ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) minmax(0, 1fr)'],
    ['grid-template-rows', useSingleColumn
      ? 'auto auto auto auto auto auto'
      : 'minmax(0, .62fr) minmax(0, 1.18fr) minmax(0, .78fr) minmax(0, 1.02fr)'],
    ['grid-template-areas', useSingleColumn
      ? '"status" "confidence" "issue" "repair" "impact" "worked"'
      : '"status confidence" "issue repair" "impact impact" "worked worked"'],
    ['gap', `${base.gap}px`],
    ['width', '100%'],
    ['height', 'auto'],
    ['min-height', '0'],
    ['margin', '0'],
    ['align-items', 'stretch'],
    ['align-content', 'stretch'],
    ['flex', '1 1 auto'],
    ['box-sizing', 'border-box']
  ]);

  if (statusCard) pcSetImportantStyles(statusCard, [['grid-area', 'status']]);
  if (confidenceCard) pcSetImportantStyles(confidenceCard, [['grid-area', 'confidence']]);
  if (workedCard) pcSetImportantStyles(workedCard, [['grid-area', 'worked']]);
  if (issueCard) pcSetImportantStyles(issueCard, [['grid-area', 'issue']]);
  if (repairCard) pcSetImportantStyles(repairCard, [['grid-area', 'repair']]);
  if (impactCard) pcSetImportantStyles(impactCard, [['grid-area', 'impact']]);

  // v370: Completed analysis is allowed to scroll before typography becomes
  // uncomfortably small. Babbage responses are variable-length, so fitting the
  // entire report at once is no longer more important than readability.
  // The higher floors apply only to photographed workstation layouts; compact
  // and medium panel modes already use their own readable scrolling profiles.
  const readableFloor = isWideDesktopMonitor ? {
    badge: 8,
    title: 20,
    summary: 12.5,
    label: 9,
    value: 13,
    big: 14,
    note: 12.5
  } : isMediumAnalysisPanel ? {
    badge: isTallMediumPortraitReadableProfile ? 11 : 9.5,
    title: isTallMediumPortraitReadableProfile ? 30 : 26,
    summary: isTallMediumPortraitReadableProfile ? 16 : 14,
    label: isTallMediumPortraitReadableProfile ? 11.5 : 10.5,
    value: isTallMediumPortraitReadableProfile ? 16 : 14.5,
    big: isTallMediumPortraitReadableProfile ? 18 : 16.5,
    note: isTallMediumPortraitReadableProfile ? 15 : 13.5
  } : {
    badge: 6.5,
    title: 15,
    summary: 8.5,
    label: 6.5,
    value: 8,
    big: 9,
    note: 8.5
  };

  const applyScale = (scale) => {
    const scaled = (value, floor = 1) => Math.max(floor, value * scale);
    report.classList.toggle('analysis-report-fitted-compact', scale < 0.78);
    report.classList.toggle('analysis-report-fitted-tight', scale < 0.64);

    pcSetImportantStyles(report, [
      ['gap', `${scaled(base.gap, 3)}px`],
      ['padding', `${scaled(base.reportPadding, 4)}px`]
    ]);
    pcSetImportantStyles(header, [['gap', `${scaled(base.headerGap, 2)}px`]]);
    pcSetImportantStyles(badge, [
      ['margin', '0 auto'],
      ['padding', `${scaled(2, 1)}px ${scaled(8, 4)}px`],
      ['font-size', `${scaled(base.badge, readableFloor.badge)}px`],
      ['line-height', '1'],
      ['justify-self', 'center']
    ]);
    pcSetImportantStyles(title, [
      ['margin', '0'],
      ['font-size', `${scaled(base.title, readableFloor.title)}px`],
      ['line-height', '1.02'],
      ['text-align', 'center']
    ]);
    pcSetImportantStyles(summary, [
      ['width', isCompactAnalysisPanel || isWideDesktopMonitor ? '100%' : '96%'],
      ['max-width', 'none'],
      ['margin', '0 auto'],
      ['padding-bottom', isCompactAnalysisPanel || isMediumAnalysisPanel ? `${scaled(4, 2)}px` : '0'],
      ['font-size', `${scaled(base.summary, readableFloor.summary)}px`],
      ['line-height', isCompactAnalysisPanel || isMediumAnalysisPanel ? '1.2' : '1.16'],
      ['text-align', 'center'],
      ['overflow-wrap', 'break-word'],
      ['word-break', 'normal']
    ]);
    pcSetImportantStyles(grid, [
      ['gap', `${scaled(base.gap, 3)}px`],
      ['margin-top', isCompactAnalysisPanel || isMediumAnalysisPanel ? `${scaled(3, 1)}px` : '0']
    ]);

    cards.forEach((card) => pcSetImportantStyles(card, [
      ['margin', '0'],
      ['padding', `${scaled(base.cardPadding, 4)}px`],
      ['min-width', '0'],
      ['min-height', '0'],
      ['height', '100%'],
      ['border-width', '1px'],
      ['border-radius', `${scaled(8, 5)}px`],
      ['box-shadow', 'inset 0 0 12px rgba(42,255,91,.04)'],
      ['box-sizing', 'border-box'],
      ['display', 'flex'],
      ['flex-direction', 'column'],
      ['justify-content', 'flex-start'],
      ['overflow', 'hidden']
    ]));
    labels.forEach((label) => pcSetImportantStyles(label, [
      ['margin', `0 0 ${scaled(3, 1.5)}px`],
      ['font-size', `${scaled(base.label, readableFloor.label)}px`],
      ['line-height', '1.04'],
      ['display', 'flex'],
      ['align-items', 'center'],
      ['gap', `${scaled(5, 3)}px`]
    ]));
    icons.forEach((icon) => pcSetImportantStyles(icon, [
      ['width', `${scaled(15, 10)}px`],
      ['height', `${scaled(15, 10)}px`],
      ['font-size', `${scaled(base.label, 6.5)}px`],
      ['line-height', '1']
    ]));
    values.forEach((value) => pcSetImportantStyles(value, [
      ['font-size', `${scaled(base.value, readableFloor.value)}px`],
      ['line-height', '1.14'],
      ['overflow-wrap', 'break-word'],
      ['word-break', 'normal']
    ]));
    bigValues.forEach((value) => pcSetImportantStyles(value, [
      ['font-size', `${scaled(base.big, readableFloor.big)}px`],
      ['line-height', '1.1']
    ]));
    notes.forEach((note) => pcSetImportantStyles(note, [
      ['display', 'block'],
      ['width', '100%'],
      ['margin-top', `${scaled(4, 2)}px`],
      ['font-size', `${scaled(base.note, readableFloor.note)}px`],
      ['font-weight', '700'],
      ['line-height', '1.18'],
      ['text-align', 'left'],
      ['overflow-wrap', 'break-word'],
      ['word-break', 'normal']
    ]));
  };

  const contentFits = () => {
    const reportFits = report.scrollHeight <= report.clientHeight + 1 &&
      report.scrollWidth <= report.clientWidth + 1;
    const cardsFit = cards.every((card) =>
      card.scrollHeight <= card.clientHeight + 1 &&
      card.scrollWidth <= card.clientWidth + 1
    );
    return reportFits && cardsFit;
  };

  const finalizeScrollableReportLayout = () => {
    cards.forEach((card) => pcSetImportantStyles(card, [
      ['height', 'auto'],
      ['min-height', '0'],
      ['overflow', 'visible']
    ]));
    pcSetImportantStyles(grid, [
      ['height', 'auto'],
      ['min-height', '0'],
      ['overflow', 'visible']
    ]);
    pcSetImportantStyles(report, [
      ['height', 'auto'],
      ['min-height', '0'],
      ['overflow', 'visible']
    ]);

    void report.offsetHeight;

    cards.forEach((card) => {
      const neededHeight = Math.ceil(card.scrollHeight) + 2;
      pcSetImportantStyles(card, [
        ['min-height', `${neededHeight}px`],
        ['height', 'auto']
      ]);
    });

    const gridHeight = Math.ceil(grid.scrollHeight) + 2;
    pcSetImportantStyles(grid, [
      ['min-height', `${gridHeight}px`],
      ['height', 'auto']
    ]);

    const reportHeight = Math.ceil(report.scrollHeight) + 2;
    pcSetImportantStyles(report, [
      ['min-height', `${reportHeight}px`],
      ['height', `${reportHeight}px`]
    ]);
  };

  if (isCompactAnalysisPanel) {
    applyScale(1);
    report.classList.add('analysis-report-scrollable');
    pcSetImportantStyles(output, [
      ['display', 'block'],
      ['overflow-y', 'auto'],
      ['overflow-x', 'hidden'],
      ['scrollbar-gutter', 'auto'],
      ['padding', `0 4px ${Math.max(8, base.outputPadding)}px`],
      ['box-sizing', 'border-box']
    ]);
    pcSetImportantStyles(report, [
      ['display', 'block'],
      ['width', 'calc(100% - 4px)'],
      ['max-width', 'calc(100% - 4px)'],
      ['margin', '0 auto'],
      ['height', 'auto'],
      ['min-height', '0'],
      ['overflow', 'visible'],
      ['box-sizing', 'border-box']
    ]);
    pcSetImportantStyles(grid, [
      ['display', 'block'],
      ['grid-template-columns', 'none'],
      ['grid-template-rows', 'none'],
      ['grid-template-areas', 'none'],
      ['height', 'auto'],
      ['overflow', 'visible']
    ]);
    cards.forEach((card, index) => pcSetImportantStyles(card, [
      ['display', 'block'],
      ['width', '100%'],
      ['max-width', '100%'],
      ['height', 'auto'],
      ['min-height', '0'],
      ['overflow', 'visible'],
      ['margin', `0 0 ${index === cards.length - 1 ? 0 : base.gap}px 0`],
      ['box-sizing', 'border-box']
    ]));
    values.forEach((value) => pcSetImportantStyles(value, [
      ['display', 'block'],
      ['position', 'static'],
      ['white-space', 'normal'],
      ['overflow-wrap', 'anywhere'],
      ['word-break', 'break-word']
    ]));
    notes.forEach((note) => pcSetImportantStyles(note, [
      ['display', 'block'],
      ['position', 'static'],
      ['white-space', 'normal'],
      ['overflow-wrap', 'anywhere'],
      ['word-break', 'break-word']
    ]));
    finalizeScrollableReportLayout();
    return true;
  }

  if (isMediumAnalysisPanel) {
    applyScale(1);
    report.classList.remove('analysis-report-scrollable');

    // Medium portrait screens use a content-height diagnostic instead of
    // stretching each row across the entire monitor. The complete report is
    // centered when it fits and becomes a single scrolling surface only when
    // generated content genuinely needs more vertical room.
    pcSetImportantStyles(output, [
      ['display', 'flex'],
      ['flex-direction', 'column'],
      ['align-items', 'center'],
      ['justify-content', 'center'],
      ['overflow-y', 'hidden'],
      ['overflow-x', 'hidden'],
      ['scrollbar-gutter', 'auto'],
      ['padding', `${base.outputPadding}px`],
      ['box-sizing', 'border-box']
    ]);
    // v333: Use the same side breathing room as iPad Air on the Pro profile.
    // The monitor bezel already supplies the visual inset, so the extra 20px made
    // the Pro report feel smaller and more compressed than the Air version.
    const mediumSideInset = isIPadProReadableProfile ? 10 : (isPortraitTabletWorkstation ? 20 : 10);
    pcSetImportantStyles(report, [
      ['display', 'flex'],
      ['flex-direction', 'column'],
      ['width', `calc(100% - ${mediumSideInset}px)`],
      ['max-width', `calc(100% - ${mediumSideInset}px)`],
      ['height', 'auto'],
      ['min-height', '0'],
      ['max-height', 'none'],
      ['margin', '0 auto'],
      ['padding', `${base.reportPadding}px`],
      ['gap', `${base.gap}px`],
      ['overflow', 'visible'],
      ['border', '1px solid rgba(72,255,92,.92)'],
      ['border-radius', '12px'],
      ['box-sizing', 'border-box'],
      ['flex', '0 0 auto']
    ]);
    pcSetImportantStyles(header, [
      ['display', 'grid'],
      ['gap', `${base.headerGap}px`],
      ['flex', '0 0 auto'],
      ['margin', '0'],
      ['padding', '0']
    ]);
    pcSetImportantStyles(summary, [
      ['padding-bottom', '6px'],
      ['line-height', '1.22']
    ]);
    pcSetImportantStyles(grid, [
      ['display', 'grid'],
      ['grid-template-columns', 'minmax(0, 1fr) minmax(0, 1fr)'],
      ['grid-template-rows', 'auto auto auto auto'],
      ['grid-template-areas', '"status confidence" "issue repair" "impact impact" "worked worked"'],
      ['width', '100%'],
      ['height', 'auto'],
      ['min-height', '0'],
      ['flex', '0 0 auto'],
      ['align-items', 'start'],
      ['align-content', 'start'],
      ['overflow', 'visible'],
      ['margin-top', '4px'],
      ['box-sizing', 'border-box']
    ]);
    cards.forEach((card) => pcSetImportantStyles(card, [
      ['display', 'flex'],
      ['flex-direction', 'column'],
      ['justify-content', 'flex-start'],
      ['align-self', 'start'],
      ['width', '100%'],
      ['max-width', '100%'],
      ['height', 'auto'],
      ['min-height', '0'],
      ['padding', `${base.cardPadding}px`],
      ['overflow', 'visible'],
      ['box-sizing', 'border-box']
    ]));
    values.forEach((value) => pcSetImportantStyles(value, [
      ['display', 'block'],
      ['position', 'static'],
      ['white-space', 'normal'],
      ['overflow-wrap', 'break-word'],
      ['word-break', 'normal']
    ]));
    notes.forEach((note) => pcSetImportantStyles(note, [
      ['display', 'block'],
      ['position', 'static'],
      ['white-space', 'normal'],
      ['overflow-wrap', 'break-word'],
      ['word-break', 'normal']
    ]));

    // v346: Keep tablet text readable without letting the DOM screen spill over
    // the monitor bezel. Scroll only inside the glass, and always reset to the top.
    const readableScale = viewportWidth <= 790 ? 0.92
      : viewportWidth <= 930 ? 0.94
        : 0.96;
    applyScale(readableScale);
    report.classList.add('analysis-report-scrollable');
    pcSetImportantStyles(output, [
      ['display', 'block'],
      ['overflow-y', 'auto'],
      ['overflow-x', 'hidden'],
      ['overscroll-behavior', 'contain'],
      ['touch-action', 'pan-y'],
      ['scrollbar-gutter', 'stable'],
      ['padding', '3px']
    ]);
    pcSetImportantStyles(report, [
      ['width', '100%'],
      ['max-width', '100%'],
      ['margin', '0'],
      ['height', 'auto'],
      ['min-height', '100%'],
      ['overflow', 'visible'],
      ['border-radius', '4px']
    ]);
    pcSetImportantStyles(grid, [
      ['height', 'auto'],
      ['min-height', '0'],
      ['grid-template-rows', 'auto auto auto auto'],
      ['align-items', 'start'],
      ['align-content', 'start']
    ]);
    cards.forEach((card) => pcSetImportantStyles(card, [
      ['height', 'auto'],
      ['min-height', 'max-content'],
      ['align-self', 'start'],
      ['overflow', 'hidden'],
      ['overflow-wrap', 'anywhere']
    ]));
    output.scrollTop = 0;
    return true;
  }

  const minScale = 0.48;
  const scaleStep = 0.94;
  const maxPasses = 18;
  let scale = report.classList.contains('analysis-report-very-dense') ? 0.86
    : report.classList.contains('analysis-report-dense') ? 0.93
      : 1;
  applyScale(scale);

  for (let pass = 0; pass < maxPasses && !contentFits(); pass += 1) {
    scale = Math.max(minScale, scale * scaleStep);
    applyScale(scale);
    if (scale <= minScale) break;
  }

  if (!contentFits()) {
    report.classList.add('analysis-report-scrollable');
    pcSetImportantStyles(output, [
      ['display', 'block'],
      ['overflow-y', 'auto'],
      ['overflow-x', 'hidden'],
      ['overscroll-behavior-y', 'contain'],
      ['touch-action', 'pan-y'],
      ['scrollbar-gutter', 'stable'],
      ['box-sizing', 'border-box']
    ]);
    pcSetImportantStyles(report, [
      ['height', 'auto'],
      ['min-height', '100%'],
      ['overflow', 'visible']
    ]);
    pcSetImportantStyles(grid, [
      ['grid-template-rows', useSingleColumn
        ? 'auto auto auto auto auto auto'
        : 'auto auto auto auto'],
      ['height', 'auto'],
      ['min-height', '0'],
      ['align-items', 'start'],
      ['align-content', 'start'],
      ['overflow', 'visible'],
      ['flex', '0 0 auto']
    ]);
    cards.forEach((card) => pcSetImportantStyles(card, [
      ['height', 'auto'],
      ['min-height', 'max-content'],
      ['align-self', 'start'],
      ['overflow', 'hidden'],
      ['overflow-wrap', 'anywhere'],
      ['word-break', 'normal']
    ]));
    output.scrollTop = 0;
  } else {
    report.classList.remove('analysis-report-scrollable');
  }

  return true;
}


// v338: Extend the wooden desktop beneath contained completed-analysis workstations.
// The source workstation artwork ends above the fixed action buttons on tall tablet
// layouts, which exposed the dark classroom/floor strip. Continue the desk surface
// through that lower region while keeping the buttons layered in front.
function pcRemoveAnalysisDeskExtensionV338() {
  document.getElementById('pcAnalysisDeskExtensionV338')?.remove();
}

function pcApplyAnalysisDeskExtensionV338(scene, frame, viewportHeight) {
  if (!scene || !frame?.isContainedWorkstation) {
    pcRemoveAnalysisDeskExtensionV338();
    return false;
  }

  let extension = document.getElementById('pcAnalysisDeskExtensionV338');
  if (!extension) {
    extension = document.createElement('div');
    extension.id = 'pcAnalysisDeskExtensionV338';
    extension.setAttribute('aria-hidden', 'true');
    scene.appendChild(extension);
  }

  const rawTop = Number.parseFloat(frame.top);
  if (!Number.isFinite(rawTop)) {
    pcRemoveAnalysisDeskExtensionV338();
    return false;
  }

  const centeredVertically = String(frame.transform || '').includes('translate(-50%, -50%)');
  const terminalTopPx = centeredVertically ? rawTop - (frame.height / 2) : rawTop;
  const terminalBottomPx = terminalTopPx + frame.height;
  const safeHeight = Number.isFinite(viewportHeight) && viewportHeight > 0
    ? viewportHeight
    : pcViewportHeight();
  const extensionTop = Math.max(0, Math.min(safeHeight, terminalBottomPx - 2));

  pcSetImportantStyles(extension, [
    ['position', 'absolute'],
    ['left', '0'],
    ['right', '0'],
    ['top', `${Math.round(extensionTop)}px`],
    ['bottom', '0'],
    ['width', '100%'],
    ['height', 'auto'],
    ['min-height', '0'],
    ['margin', '0'],
    ['padding', '0'],
    ['display', 'block'],
    ['background-image', 'url("assets/images/backgrounds/desk-extension.png")'],
    ['background-size', 'cover'],
    ['background-position', 'center center'],
    ['background-repeat', 'no-repeat'],
    ['background-color', '#7a3f1d'],
    ['border', '0'],
    ['box-shadow', 'none'],
    ['pointer-events', 'none'],
    ['overflow', 'hidden'],
    ['z-index', '55']
  ]);

  return true;
}

// [COMPLETED ANALYSIS: DESKTOP WORKSTATION]
function pcApplyWideAnalysisReportComputerV215(terminal, photo, screen, viewportHeight) {
  if (!terminal || !photo || !screen) return false;

  const overlay = document.getElementById('vnOverlay');
  const scene = document.getElementById('vnScene');
  const sceneBg = document.getElementById('vnSceneBg');
  const viewportWidth = pcAnalysisViewportWidthV122();
  const safeViewportHeight = Number.isFinite(viewportHeight) && viewportHeight > 0
    ? viewportHeight
    : pcViewportHeight();

  const frame = pcGetComputerFrameLikeCompletedV327(viewportWidth, safeViewportHeight);
  const isContainedWorkstation = frame.isContainedWorkstation;
  const width = frame.width;
  const height = frame.height;
  const terminalLeft = frame.left;
  const terminalTop = frame.top;
  const terminalTransform = frame.transform;

  // v344: Completed Scenario Diagnostic must keep the classroom visible.
  // The dark workstation matte is intentionally limited to prediction/live-analysis states.
  if (overlay && isContainedWorkstation) {
    pcSetImportantStyles(overlay, [['background', 'transparent']]);
  }
  if (scene && isContainedWorkstation) {
    pcSetImportantStyles(scene, [
      ['position', 'absolute'],
      ['inset', '0'],
      ['left', '0'],
      ['right', '0'],
      ['top', '0'],
      ['bottom', '0'],
      ['width', '100%'],
      ['height', '100%'],
      ['min-height', '0'],
      ['padding', '0'],
      ['overflow', 'hidden'],
      ['background', 'transparent']
    ]);
  }
  if (sceneBg && isContainedWorkstation) {
    pcSetImportantStyles(sceneBg, [
      ['display', 'block'],
      ['visibility', 'visible'],
      ['opacity', '1']
    ]);
  }

  pcApplyAnalysisDeskExtensionV338(scene, frame, safeViewportHeight);

  pcSetImportantStyles(terminal, [
    ['position', 'absolute'],
    ['inset', 'auto'],
    ['left', terminalLeft],
    ['right', 'auto'],
    ['top', terminalTop],
    ['bottom', 'auto'],
    ['width', `${Math.round(width)}px`],
    ['height', `${Math.round(height)}px`],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['aspect-ratio', 'auto'],
    ['transform', terminalTransform],
    ['margin', '0'],
    ['padding', '0'],
    ['display', 'block'],
    ['opacity', '1'],
    ['visibility', 'visible'],
    ['overflow', 'visible'],
    ['transition', 'none'],
    ['z-index', '60']
  ]);

  pcSetImportantStyles(photo, [
    ['position', 'absolute'],
    ['inset', '0'],
    ['width', '100%'],
    ['height', '100%'],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['aspect-ratio', 'auto'],
    ['transform', 'none'],
    ['margin', '0'],
    ['padding', '0'],
    ['display', 'block'],
    ['background-image', 'var(--pc-app-background)'],
    ['background-size', '100% 100%'],
    ['background-position', 'center center'],
    ['background-repeat', 'no-repeat'],
    ['background-color', 'transparent'],
    ['border', '0'],
    ['border-radius', '0'],
    ['box-shadow', 'none'],
    ['overflow', 'hidden'],
    ['transition', 'none']
  ]);

  pcSetImportantStyles(screen, [
    ['position', 'absolute'],
    ['inset', 'auto'],
    ['left', PC_WIDE_ANALYSIS_REPORT_SCREEN_GEOMETRY_V215.left],
    ['right', 'auto'],
    ['top', PC_WIDE_ANALYSIS_REPORT_SCREEN_GEOMETRY_V215.top],
    ['bottom', 'auto'],
    ['width', PC_WIDE_ANALYSIS_REPORT_SCREEN_GEOMETRY_V215.width],
    ['height', PC_WIDE_ANALYSIS_REPORT_SCREEN_GEOMETRY_V215.height],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['box-sizing', 'border-box'],
    ['transform', 'none'],
    ['overflow', 'hidden'],
    ['padding', '0'],
    ['transition', 'none']
  ]);

  pcFitWideAnalysisReportV215(screen);
  pcCenterWideAnalysisActionsV215();
  return true;
}
// v186: Align the physical monitor only when the computer artwork is visible.
// Medium and mobile completed-analysis layouts are terminal-only, so all
// desktop inline geometry is removed and responsive CSS owns those screens.
function pcAlignModernTerminalScreenV149() {
  const activeOverlayV257 = document.getElementById('vnOverlay');
  const activeTerminalV257 = document.getElementById('claudeTerminalScene');
  const liveAnalysisV257 = Boolean(
    activeOverlayV257?.classList.contains('active') &&
    activeOverlayV257.classList.contains('claude-terminal-consult') &&
    !activeOverlayV257.classList.contains('claude-terminal-textmode') &&
    activeTerminalV257?.classList.contains('thinking')
  );
  if (liveAnalysisV257) {
    pcScheduleLiveAnalyzingLayoutV256({ immediate: true });
    return;
  }

  if (typeof pcIsAnalysisReportActiveV122 === 'function' && pcIsAnalysisReportActiveV122()) {
    pcScheduleAnalysisLayoutV255();
    return;
  }

  const overlay = document.getElementById('vnOverlay');
  const terminal = document.getElementById('claudeTerminalScene');
  const photo = terminal?.querySelector('.claude-terminal-photo');
  const screen = terminal?.querySelector('.claude-terminal-screen');
  const output = document.getElementById('claudeTerminalOutput');

  if (!overlay || !terminal || !photo || !screen) return;

  const predictionOpen = overlay.classList.contains('claude-prediction') ||
    overlay.classList.contains('pc-clean-prediction');
  const consultThinking = overlay.classList.contains('claude-terminal-consult') &&
    !overlay.classList.contains('claude-terminal-textmode');
  const analysisOpen = overlay.classList.contains('claude-terminal-textmode') &&
    output?.classList.contains('claude-analysis-layout');
  const viewportWidth = pcAnalysisViewportWidthV122();
  const viewportHeight = pcViewportHeight();
  const isIpadConsultThinking = consultThinking &&
    viewportWidth >= 768 && viewportWidth <= 1180 && viewportHeight >= 900;

  if (!predictionOpen && !consultThinking && !analysisOpen) return;

  // v203: Compact live-analysis modes own their screen geometry. Do not let
  // the legacy monitor-alignment pass overwrite the full mobile stage or put
  // the iPad readout back above the photographed monitor.
  if (consultThinking && viewportWidth <= 760) {
    pcApplyLiveAnalyzingLayoutV256();
    return;
  }
  if (isIpadConsultThinking) {
    pcApplyTabletAnalyzingComputerV214(terminal, photo);
    positionClaudeAnalyzingReadoutV161();
    return;
  }

  // v186: Prediction layouts below the full desktop breakpoint are owned by
  // one CSS section. Clear every layout style left by earlier screen states and
  // return before JavaScript can impose desktop geometry.
  if (predictionOpen && viewportWidth <= 1510) {
    pcPredictionTerminalFrameV159 = null;
    pcClearPredictionLayoutInlineStylesV186();
    return;
  }

  // v207: Full-width prediction is JavaScript-owned because delayed functions
  // and inline cleanup were restoring the oversized CSS frame after the correct
  // geometry had rendered. Apply the approved workstation and monitor bounds in
  // one pass, then capture that exact box for Babbage's analyzing transition.
  if (predictionOpen) {
    pcClearPredictionLayoutInlineStylesV186();
    pcApplyWidePredictionComputerV207(terminal, photo, screen, viewportHeight);
    requestAnimationFrame(() => {
      pcApplyWidePredictionComputerV207(terminal, photo, screen, viewportHeight);
      pcCapturePredictionTerminalFrameV159(terminal);
    });
    return;
  }

  // v210: Wide live analysis is owned directly instead of trusting a captured
  // rectangle that can be cleared by later observer passes. Tablet layouts keep
  // the captured/CSS behavior, while full-screen analysis reuses the approved
  // prediction workstation scale.
  if (consultThinking) {
    if (viewportWidth > 1510) {
      pcApplyWidePredictionComputerV207(terminal, photo, screen, viewportHeight);
    } else {
      pcApplyPredictionTerminalFrameV159(terminal, photo);
    }
  }

  // Completed reports below the wide breakpoint intentionally abandon the
  // computer artwork. Clear every inline desktop value so CSS can render the
  // terminal-only and stacked mobile layouts at full width.
  if (analysisOpen && viewportWidth <= 1510) {
    pcClearLegacyAnalysisInlineStylesV122();
    return;
  }

  // v215: The wide completed report has a single JavaScript owner. This
  // prevents pcApplyAnalysisLayoutV122 and the legacy alignment queue from
  // alternating between a reduced workstation and the old full-width image.
  if (analysisOpen) {
    pcApplyWideAnalysisReportComputerV215(terminal, photo, screen, viewportHeight);
    return;
  }

  // Live analysis uses the photographed monitor rectangle. The outer terminal
  // frame was established above; this aligns only the green screen layer.
  pcSetImportantStyles(photo, [
    ['position', 'relative']
  ]);
  pcSetImportantStyles(screen, [
    ['position', 'absolute'],
    ['inset', 'auto'],
    ['left', PC_WIDE_PREDICTION_SCREEN_GEOMETRY_V207.left],
    ['right', 'auto'],
    ['top', PC_WIDE_PREDICTION_SCREEN_GEOMETRY_V207.top],
    ['bottom', 'auto'],
    ['width', PC_WIDE_PREDICTION_SCREEN_GEOMETRY_V207.width],
    ['height', PC_WIDE_PREDICTION_SCREEN_GEOMETRY_V207.height],
    ['box-sizing', 'border-box'],
    ['transform', 'none'],
    ['overflow', 'hidden']
  ]);
}

// Expose a stable debugging hook in DevTools.
window.pcAlignModernTerminalScreen = pcAlignModernTerminalScreenV149;

function pcQueueModernTerminalAlignmentV147() {
  requestAnimationFrame(pcAlignModernTerminalScreenV149);
  window.setTimeout(pcAlignModernTerminalScreenV149, 40);
  window.setTimeout(pcAlignModernTerminalScreenV149, 180);
}

if (!window.pcModernTerminalAlignmentV147Installed) {
  window.pcModernTerminalAlignmentV147Installed = true;
  window.addEventListener('resize', pcQueueModernTerminalAlignmentV147, { passive: true });
  window.addEventListener('orientationchange', pcQueueModernTerminalAlignmentV147, { passive: true });
  window.visualViewport?.addEventListener('resize', pcQueueModernTerminalAlignmentV147, { passive: true });
}

// v161: Position the live analyzing readout inside the already-aligned
// monitor rectangle. These percentages are relative to the physical green
// screen, not to the full computer artwork.
const PC_ANALYZING_READOUT_LEFT = '33%';
const PC_ANALYZING_READOUT_TOP = '12%';
const PC_ANALYZING_READOUT_WIDTH = '78%';

function pcResetAnalyzingReadoutV203(){
  const screen = document.querySelector('#claudeTerminalScene .claude-terminal-screen');
  const output = document.getElementById('claudeTerminalOutput');
  const readout = output?.querySelector('.pc-analyzing-readout');
  const panel = output?.querySelector('.pc-analyzing-panel');
  const titleLine = output?.querySelector('.pc-terminal-title-line');
  const dividers = output?.querySelectorAll('.pc-terminal-divider') || [];
  const progress = output?.querySelector('.pc-analyzing-progress');

  pcRemoveInlineStyles(screen, [
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'min-width', 'min-height', 'max-width', 'max-height', 'margin', 'padding',
    'display', 'align-items', 'justify-content', 'flex-direction', 'gap',
    'overflow', 'background', 'border', 'border-radius', 'box-shadow',
    'box-sizing', 'transform'
  ]);
  pcRemoveInlineStyles(output, [
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'min-width', 'min-height', 'max-width', 'max-height', 'margin', 'padding',
    'display', 'overflow', 'transform', 'text-align'
  ]);
  pcRemoveInlineStyles(readout, [
    'position', 'left', 'right', 'top', 'bottom', 'width', 'max-width',
    'height', 'margin', 'padding', 'transform', 'text-align', 'box-sizing',
    'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'white-space'
  ]);
  pcRemoveInlineStyles(panel, [
    'width', 'max-width', 'margin', 'padding', 'border', 'border-radius',
    'background', 'box-shadow', 'box-sizing'
  ]);
  pcRemoveInlineStyles(titleLine, ['font-size', 'line-height', 'letter-spacing', 'white-space']);
  dividers.forEach((divider) => pcRemoveInlineStyles(divider, ['margin']));
  pcRemoveInlineStyles(progress, ['gap', 'margin-top']);
}

// [LIVE ANALYSIS: READOUT POSITION]
function positionClaudeAnalyzingReadoutV161() {
  const terminal = document.getElementById('claudeTerminalScene');
  const outputEl = document.getElementById('claudeTerminalOutput');
  const screen = terminal?.querySelector('.claude-terminal-screen');
  const readout = outputEl?.querySelector('.pc-analyzing-readout');
  const panel = outputEl?.querySelector('.pc-analyzing-panel');
  const titleLine = outputEl?.querySelector('.pc-terminal-title-line');
  const dividers = outputEl?.querySelectorAll('.pc-terminal-divider') || [];
  const progress = outputEl?.querySelector('.pc-analyzing-progress');
  const cursors = outputEl?.querySelectorAll('.claude-terminal-cursor') || [];
  if (!terminal || !outputEl || !screen || !readout || !panel) return false;

  const viewportWidth = pcAnalysisViewportWidthV122();
  const mode = pcGetLiveAnalysisModeV256(viewportWidth);
  const screenRect = screen.getBoundingClientRect();
  const screenPixelWidth = Math.max(1, screenRect.width || 320);
  const screenPixelHeight = Math.max(1, screenRect.height || 220);
  const clampNumber = (min, value, max) => Math.max(min, Math.min(max, value));
  const terminalFontPx = clampNumber(
    mode === 'phone' ? 11 : 10,
    Math.min(screenPixelWidth / 23, screenPixelHeight / 15.5),
    mode === 'desktop' ? 22 : 18
  );
  const panelPaddingPx = clampNumber(9, Math.min(screenPixelWidth, screenPixelHeight) * 0.055, 22);
  const readoutInset = mode === 'phone' ? 7 : 6;

  pcSetImportantStyles(outputEl, [
    ['position', 'absolute'],
    ['inset', '0'],
    ['left', '0'],
    ['right', '0'],
    ['top', '0'],
    ['bottom', '0'],
    ['width', '100%'],
    ['height', '100%'],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['margin', '0'],
    ['padding', '0'],
    ['display', 'block'],
    ['overflow', 'hidden'],
    ['transform', 'none'],
    ['text-align', 'left']
  ]);

  pcSetImportantStyles(readout, [
    ['position', 'absolute'],
    ['left', `${readoutInset}%`],
    ['right', 'auto'],
    ['top', '50%'],
    ['bottom', 'auto'],
    ['width', `${100 - (readoutInset * 2)}%`],
    ['max-width', `${100 - (readoutInset * 2)}%`],
    ['height', 'auto'],
    ['margin', '0'],
    ['padding', '0'],
    ['transform', 'translateY(-50%)'],
    ['text-align', 'left'],
    ['box-sizing', 'border-box'],
    ['font-family', '"Source Code Pro", "Courier New", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'],
    ['font-size', `${terminalFontPx.toFixed(2)}px`],
    ['font-weight', '700'],
    ['line-height', '1.12'],
    ['letter-spacing', '.018em'],
    ['white-space', 'normal']
  ]);

  pcSetImportantStyles(panel, [
    ['width', '100%'],
    ['max-width', '100%'],
    ['margin', '0'],
    ['padding', `${panelPaddingPx.toFixed(1)}px`],
    ['border', '1px solid rgba(76,255,103,.88)'],
    ['border-radius', `${clampNumber(7, screenPixelWidth * 0.022, 15)}px`],
    ['background', 'linear-gradient(180deg, rgba(0,35,18,.72), rgba(0,15,7,.82))'],
    ['box-shadow', 'inset 0 0 18px rgba(48,255,96,.06), 0 0 9px rgba(42,255,89,.10)'],
    ['box-sizing', 'border-box']
  ]);

  if (titleLine) {
    pcSetImportantStyles(titleLine, [
      ['font-size', '1.22em'],
      ['line-height', '1.04'],
      ['letter-spacing', '.025em'],
      ['white-space', 'nowrap'],
      ['text-align', 'center']
    ]);
  }
  dividers.forEach((divider) => pcSetImportantStyles(divider, [
    ['margin', `${clampNumber(5, terminalFontPx * 0.52, 11)}px 0`]
  ]));
  if (progress) {
    pcSetImportantStyles(progress, [
      ['gap', `${clampNumber(2, terminalFontPx * 0.22, 5)}px`],
      ['margin-top', `${clampNumber(5, terminalFontPx * 0.55, 11)}px`]
    ]);
  }
  cursors.forEach((cursor) => pcSetImportantStyles(cursor, [
    ['display', 'inline-block'],
    ['width', '0.66em'],
    ['height', '1em'],
    ['margin-left', '0.34em'],
    ['background', 'rgba(210,255,225,0.92)'],
    ['box-shadow', '0 0 5px rgba(200,255,218,0.42), 0 0 12px rgba(22,255,66,0.16)'],
    ['vertical-align', '-0.14em'],
    ['animation', 'claudeCursorBlink 0.82s steps(1,end) infinite']
  ]));

  return true;
}
window.pcPositionClaudeAnalyzingReadout = positionClaudeAnalyzingReadoutV161;

window.pcPositionClaudeAnalyzingReadout = positionClaudeAnalyzingReadoutV161;


function pcClearMobileAnalyzingStageV202(){
  const overlay = document.getElementById('vnOverlay');
  const scene = document.getElementById('vnScene');
  const sceneBg = document.getElementById('vnSceneBg');
  const dialogue = document.getElementById('vnDialogue');
  const speaker = document.getElementById('vnSpeaker');
  const text = document.getElementById('vnText');
  const terminal = document.getElementById('claudeTerminalScene');
  const photo = terminal?.querySelector('.claude-terminal-photo');
  const screen = terminal?.querySelector('.claude-terminal-screen');

  pcRemoveInlineStyles(overlay, ['background']);
  pcRemoveInlineStyles(sceneBg, ['display', 'visibility', 'opacity']);
  pcRemoveInlineStyles(scene, [
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'min-height', 'padding', 'overflow'
  ]);
  pcRemoveInlineStyles(dialogue, [
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'min-height', 'max-height', 'display', 'visibility', 'padding', 'overflow',
    'pointer-events'
  ]);
  pcRemoveInlineStyles(speaker, ['font-size', 'line-height']);
  pcRemoveInlineStyles(text, ['font-size', 'line-height']);
  pcRemoveInlineStyles(terminal, [
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'min-width', 'min-height', 'max-width', 'max-height', 'aspect-ratio',
    'transform', 'margin', 'padding', 'display', 'overflow', 'transition', 'z-index'
  ]);
  pcRemoveInlineStyles(photo, [
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'min-width', 'min-height', 'max-width', 'max-height', 'aspect-ratio',
    'transform', 'margin', 'padding', 'display', 'overflow', 'background',
    'background-image', 'background-size', 'background-position',
    'background-repeat', 'border', 'border-radius', 'box-shadow', 'filter', 'transition'
  ]);
  pcRemoveInlineStyles(screen, [
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'min-width', 'min-height', 'max-width', 'max-height', 'aspect-ratio',
    'transform', 'margin', 'padding', 'display', 'overflow', 'background',
    'border', 'border-radius', 'box-shadow', 'box-sizing', 'transition'
  ]);
  pcResetAnalyzingReadoutV203();
  window.pcMobileAnalyzingStageV202Active = false;
}

// [LIVE ANALYSIS RESPONSIVE OWNER — V256]
// One function owns the complete live-analyzing composition. It has exactly
// three modes and no uncovered width range:
//   phone   <= 700px
//   tablet  701–1180px
//   desktop > 1180px
// This replaces the former mixture of iPad-only, >1510px-only, CSS fallback,
// and delayed passes that briefly exposed different workstation sizes.
const PC_LIVE_ANALYSIS_CLASSES_V256 = [
  'pc-live-analysis-phone-v256',
  'pc-live-analysis-tablet-v256',
  'pc-live-analysis-desktop-v256'
];
let pcLiveAnalysisFrameV256 = 0;
let pcLiveAnalysisTimerV256 = 0;
let pcLiveAnalysisModeV256 = null;

function pcGetLiveAnalysisModeV256(viewportWidth) {
  if (viewportWidth <= 700) return 'phone';
  if (viewportWidth <= 1180) return 'tablet';
  return 'desktop';
}

function pcGetComputerFrameLikeCompletedV327(viewportWidth, viewportHeight) {
  const safeViewportHeight = Number.isFinite(viewportHeight) && viewportHeight > 0
    ? viewportHeight
    : pcViewportHeight();
  const aspect = 2.0;
  const isContainedWorkstation = viewportWidth <= 1510;
  const controlsReserve = isContainedWorkstation ? 114 : 90;
  const topReserve = isContainedWorkstation ? 28 : 12;
  const availableHeight = Math.max(320, safeViewportHeight - topReserve - controlsReserve);

  let width;
  let height;
  let left = '50%';
  let top;
  let transform = 'translateX(-50%)';

  if (isContainedWorkstation) {
    const isShortLandscape = safeViewportHeight <= 740;
    const isNestHubWorkstation = viewportWidth >= 980 && viewportWidth <= 1100 &&
      safeViewportHeight >= 560 && safeViewportHeight <= 680;
    const isNestHubMaxWorkstation = viewportWidth >= 1180 && viewportWidth <= 1366 &&
      safeViewportHeight >= 720 && safeViewportHeight <= 900;
    const isTallPortraitTablet = safeViewportHeight >= 980 && viewportWidth >= 700 && viewportWidth <= 1100;
    const isLargePortraitTablet = isTallPortraitTablet && viewportWidth >= 980 && safeViewportHeight >= 1280;
    const isMiniPortraitTablet = isTallPortraitTablet && viewportWidth < 800;
    if (isNestHubWorkstation) {
      // Deliberately zoom the artwork past the viewport edges. The useful part is
      // the monitor/keyboard, not the tower's entire right flank. This gives the
      // 1024 × 600 screen enough physical monitor pixels for readable diagnostic
      // text while keeping the controls clear at the bottom.
      width = 1340;
      height = width / aspect;
      left = '58.4%';
      top = '-42px';
    } else if (isNestHubMaxWorkstation) {
      // v332: Match the visual weight of the approved full-screen workstation.
      // The previous height-limited calculation left the 1280x800 Nest Hub Max
      // monitor too small, wasting the very screen space meant to carry the report.
      width = 1660;
      height = width / aspect;
      left = '50%';
      top = '-18px';
    } else {
      // v334: Keep the iPad Pro's physical monitor fully inside the portrait viewport.
      // Match the iPad Air's monitor-to-viewport ratio (~94%) instead of letting the
      // Pro monitor span the full viewport width and clip both bezel edges.
      const desiredWidth = Math.min(
        viewportWidth * (isLargePortraitTablet ? 2.34 : isMiniPortraitTablet ? 2.24 : isTallPortraitTablet ? 2.34 : isShortLandscape ? 1.56 : 1.90),
        isLargePortraitTablet ? 2400 : isMiniPortraitTablet ? 2160 : isTallPortraitTablet ? 2300 : isShortLandscape ? 1700 : 1920
      );
      const maxWidthByHeight = availableHeight * aspect * (isLargePortraitTablet ? 1.21 : isMiniPortraitTablet ? 1.14 : isTallPortraitTablet ? 1.18 : isShortLandscape ? 1.09 : 1.05);
      width = Math.max(isLargePortraitTablet ? 1580 : isMiniPortraitTablet ? 1320 : isTallPortraitTablet ? 1440 : isShortLandscape ? 1140 : 1000, Math.min(desiredWidth, maxWidthByHeight));
      height = width / aspect;
      left = isLargePortraitTablet ? '61.25%' : isMiniPortraitTablet ? '60.0%' : isTallPortraitTablet ? '60.35%' : isShortLandscape ? '58.1%' : '59.2%';
      const centeredTop = topReserve + Math.max(6, (availableHeight - height) * (isShortLandscape ? 0.04 : isLargePortraitTablet ? 0.08 : isTallPortraitTablet ? 0.10 : 0.18));
      top = `${Math.round(Math.max(topReserve, Math.min(centeredTop, safeViewportHeight - controlsReserve - height)))}px`;
    }
  } else {
    const usableStageHeight = Math.max(720, safeViewportHeight - topReserve - controlsReserve);
    const targetHeight = Math.max(780, usableStageHeight * 1.08);
    const widthFromHeight = targetHeight * aspect;
    const widthFromViewport = viewportWidth * 1.24;
    width = Math.max(1760, Math.min(2280, Math.max(widthFromHeight, widthFromViewport)));
    height = width / aspect;
    const minCenterY = topReserve + (height / 2);
    const maxCenterY = safeViewportHeight - controlsReserve + Math.min(36, safeViewportHeight * 0.03) - (height / 2);
    const centerY = Math.max(
      minCenterY,
      Math.min((safeViewportHeight * 0.48) + 18, maxCenterY)
    );
    left = viewportWidth >= 2100 ? '57%' : viewportWidth >= 1800 ? '58%' : '59%';
    top = `${Math.round(centerY)}px`;
    transform = 'translate(-50%, -50%)';
  }

  // v331: Center the *physical monitor* over the action buttons rather than
  // centering the full 2:1 workstation artwork. The tower makes the artwork's
  // midpoint sit well to the right of the monitor, so using the artwork center
  // causes the monitor to drift left on portrait/tablet layouts. The monitor
  // glass occupies 22.2%..62.5% of the source render, putting its center at
  // 42.35% of the artwork width. Anchor that point to the viewport midpoint.
  if (isContainedWorkstation) {
    const monitorCenterFraction = (22.2 + (40.3 / 2)) / 100;
    const artworkAnchorPx = (viewportWidth / 2) + (width * (0.5 - monitorCenterFraction));
    left = `${Math.round(artworkAnchorPx)}px`;
  }

  return { width, height, left, top, transform, isContainedWorkstation };
}

function pcApplyLiveComputerFrameV256({
  overlay,
  scene,
  dialogue,
  terminal,
  photo,
  screen,
  mode,
  viewportWidth
}) {
  const sceneBg = document.getElementById('vnSceneBg');
  const overlayRect = overlay.getBoundingClientRect();
  const isPortraitTablet = mode === 'tablet' && overlayRect.height > overlayRect.width * 1.08;

  // v327: whenever a photographed computer is visible, the analyzing state now
  // uses the exact workstation frame calculation as the completed diagnostic.
  // Only the monitor contents and bottom controls/dialogue differ between states.
  const frame = pcGetComputerFrameLikeCompletedV327(viewportWidth, pcViewportHeight());
  const width = frame.width;
  const height = frame.height;
  const top = frame.top;
  // v328: The dialogue is intentionally collapsed for the entire live-analysis
  // state. The workstation can therefore use the full scene height instead of
  // reserving a text panel beneath it.

  pcSetImportantStyles(overlay, [
    ['background', '#050805']
  ]);

  pcSetImportantStyles(scene, [
    ['position', 'absolute'],
    ['inset', '0'],
    ['left', '0'],
    ['right', '0'],
    ['top', '0'],
    ['bottom', '0'],
    ['width', '100%'],
    ['height', '100%'],
    ['min-height', '0'],
    ['padding', '0'],
    ['overflow', 'hidden'],
    ['background', 'transparent']
  ]);

  pcSetImportantStyles(sceneBg, [
    ['display', 'block'],
    ['visibility', 'visible'],
    ['opacity', '.55']
  ]);

  // v339: Use the same wooden desk continuation during the live analyzing state
  // as the completed diagnostic. This removes the dark lower strip on contained
  // tablet/foldable workstation layouts while the dialogue remains collapsed.
  pcApplyAnalysisDeskExtensionV338(scene, frame, pcViewportHeight());

  if (dialogue) {
    pcSetImportantStyles(dialogue, [
      ['display', 'none'],
      ['visibility', 'hidden'],
      ['height', '0'],
      ['min-height', '0'],
      ['max-height', '0'],
      ['padding', '0'],
      ['overflow', 'hidden'],
      ['pointer-events', 'none']
    ]);
  }

  pcSetImportantStyles(terminal, [
    ['position', 'absolute'],
    ['inset', 'auto'],
    ['left', frame.left],
    ['right', 'auto'],
    ['top', frame.top],
    ['bottom', 'auto'],
    ['width', `${Math.round(width)}px`],
    ['height', `${Math.round(height)}px`],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['aspect-ratio', 'auto'],
    ['transform', frame.transform],
    ['margin', '0'],
    ['padding', '0'],
    ['display', 'block'],
    ['opacity', '1'],
    ['visibility', 'visible'],
    ['overflow', 'visible'],
    ['transition', 'none'],
    ['z-index', '20']
  ]);

  pcSetImportantStyles(photo, [
    ['position', 'absolute'],
    ['inset', '0'],
    ['width', '100%'],
    ['height', '100%'],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['aspect-ratio', 'auto'],
    ['transform', 'none'],
    ['margin', '0'],
    ['padding', '0'],
    ['display', 'block'],
    ['background-image', 'var(--pc-app-background)'],
    ['background-size', '100% 100%'],
    ['background-position', 'center center'],
    ['background-repeat', 'no-repeat'],
    ['background-color', 'transparent'],
    ['border', '0'],
    ['border-radius', '0'],
    ['box-shadow', 'none'],
    ['overflow', 'hidden'],
    ['transition', 'none']
  ]);

  // The workstation uses the full 2:1 transparent render with no side crop.
  // Keep the live terminal inside the monitor's inner glass, not the bezel.
  // These percentages are measured from the source artwork and therefore stay
  // aligned at every tablet and desktop workstation size.
  pcSetImportantStyles(screen, [
    ['position', 'absolute'],
    ['inset', 'auto'],
    ['left', PC_WIDE_ANALYSIS_REPORT_SCREEN_GEOMETRY_V215.left],
    ['right', 'auto'],
    ['top', PC_WIDE_ANALYSIS_REPORT_SCREEN_GEOMETRY_V215.top],
    ['bottom', 'auto'],
    ['width', PC_WIDE_ANALYSIS_REPORT_SCREEN_GEOMETRY_V215.width],
    ['height', PC_WIDE_ANALYSIS_REPORT_SCREEN_GEOMETRY_V215.height],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['transform', 'none'],
    ['margin', '0'],
    ['padding', '0'],
    ['display', 'block'],
    ['overflow', 'hidden'],
    ['background', 'transparent'],
    ['background-image', 'none'],
    ['border', '0'],
    ['border-radius', '0'],
    ['box-shadow', 'none'],
    ['box-sizing', 'border-box'],
    ['transition', 'none']
  ]);
}
function pcApplyLivePhoneStageV256({ overlay, scene, dialogue, terminal, photo, screen }) {
  const overlayRect = overlay.getBoundingClientRect();
  const stageHeight = Math.max(320, Math.round(overlayRect.height));

  if (dialogue) {
    pcSetImportantStyles(dialogue, [
      ['display', 'none'],
      ['visibility', 'hidden'],
      ['height', '0'],
      ['min-height', '0'],
      ['max-height', '0'],
      ['padding', '0'],
      ['overflow', 'hidden'],
      ['pointer-events', 'none']
    ]);
  }

  pcSetImportantStyles(scene, [
    ['position', 'absolute'],
    ['inset', 'auto'],
    ['left', '0'],
    ['right', '0'],
    ['top', '0'],
    ['bottom', 'auto'],
    ['width', '100%'],
    ['height', `${stageHeight}px`],
    ['min-height', `${stageHeight}px`],
    ['padding', '0'],
    ['overflow', 'hidden']
  ]);
  pcSetImportantStyles(terminal, [
    ['position', 'absolute'],
    ['inset', '0'],
    ['width', '100%'],
    ['height', '100%'],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['aspect-ratio', 'auto'],
    ['transform', 'none'],
    ['margin', '0'],
    ['padding', '0'],
    ['display', 'block'],
    ['overflow', 'hidden'],
    ['z-index', '6']
  ]);
  pcSetImportantStyles(photo, [
    ['position', 'absolute'],
    ['inset', '0'],
    ['width', '100%'],
    ['height', '100%'],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['transform', 'none'],
    ['margin', '0'],
    ['padding', '0'],
    ['display', 'block'],
    ['overflow', 'hidden'],
    ['background-image', 'none'],
    ['background', 'radial-gradient(circle at 50% 34%, rgba(20,96,53,.74), rgba(0,48,25,.97) 58%, #001b0d 100%)'],
    ['border', '0'],
    ['border-radius', '0'],
    ['box-shadow', 'none'],
    ['filter', 'none']
  ]);
  pcSetImportantStyles(screen, [
    ['position', 'absolute'],
    ['inset', '0'],
    ['width', '100%'],
    ['height', '100%'],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['transform', 'none'],
    ['margin', '0'],
    ['padding', '0'],
    ['display', 'block'],
    ['overflow', 'hidden'],
    ['background', 'linear-gradient(180deg, rgba(0,32,16,.12), rgba(0,13,6,.30)), repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 5px)'],
    ['border', '0'],
    ['border-radius', '0'],
    ['box-shadow', 'inset 0 0 90px rgba(0,0,0,.36)'],
    ['box-sizing', 'border-box']
  ]);
}

function pcClearLiveAnalyzingLayoutV256() {
  const overlay = document.getElementById('vnOverlay');
  overlay?.classList.remove(...PC_LIVE_ANALYSIS_CLASSES_V256);
  pcLiveAnalysisModeV256 = null;
  pcClearMobileAnalyzingStageV202();
}

function pcApplyLiveAnalyzingLayoutV256() {
  const overlay = document.getElementById('vnOverlay');
  const scene = document.getElementById('vnScene');
  const dialogue = document.getElementById('vnDialogue');
  const terminal = document.getElementById('claudeTerminalScene');
  const photo = terminal?.querySelector('.claude-terminal-photo');
  const screen = terminal?.querySelector('.claude-terminal-screen');
  const output = document.getElementById('claudeTerminalOutput');
  if (!overlay || !scene || !terminal || !photo || !screen || !output) return false;
  if (typeof pcIsAnalysisReportActiveV122 === 'function' && pcIsAnalysisReportActiveV122()) return false;

  const isConsultThinking = overlay.classList.contains('active') &&
    overlay.classList.contains('claude-terminal-consult') &&
    !overlay.classList.contains('claude-terminal-textmode') &&
    terminal.classList.contains('thinking');
  const isPredictionOpen = overlay.classList.contains('active') &&
    (overlay.classList.contains('claude-prediction') ||
      overlay.classList.contains('pc-clean-prediction') ||
      overlay.classList.contains('pc-prediction-question'));

  if (isPredictionOpen) return false;
  if (!isConsultThinking) {
    pcClearLiveAnalyzingLayoutV256();
    return false;
  }

  const viewportWidth = pcAnalysisViewportWidthV122();
  const mode = pcGetLiveAnalysisModeV256(viewportWidth);
  if (mode !== pcLiveAnalysisModeV256) {
    overlay.classList.remove(...PC_LIVE_ANALYSIS_CLASSES_V256);
    overlay.classList.add(`pc-live-analysis-${mode}-v256`);
    pcLiveAnalysisModeV256 = mode;
  }

  // Start from one clean geometry set before applying the current mode.
  pcClearMobileAnalyzingStageV202();
  overlay.classList.add(`pc-live-analysis-${mode}-v256`);
  pcLiveAnalysisModeV256 = mode;

  if (mode === 'phone') {
    window.pcMobileAnalyzingStageV202Active = true;
    pcApplyLivePhoneStageV256({ overlay, scene, dialogue, terminal, photo, screen });
  } else {
    window.pcMobileAnalyzingStageV202Active = false;
    pcApplyLiveComputerFrameV256({
      overlay,
      scene,
      dialogue,
      terminal,
      photo,
      screen,
      mode,
      viewportWidth
    });
  }

  positionClaudeAnalyzingReadoutV161();
  return true;
}

function pcScheduleLiveAnalyzingLayoutV256({ immediate = false } = {}) {
  if (pcLiveAnalysisFrameV256) cancelAnimationFrame(pcLiveAnalysisFrameV256);
  if (pcLiveAnalysisTimerV256) clearTimeout(pcLiveAnalysisTimerV256);
  pcLiveAnalysisFrameV256 = 0;
  pcLiveAnalysisTimerV256 = 0;

  const apply = () => pcApplyLiveAnalyzingLayoutV256();
  if (immediate) apply();
  pcLiveAnalysisFrameV256 = requestAnimationFrame(() => {
    pcLiveAnalysisFrameV256 = 0;
    apply();
  });
  pcLiveAnalysisTimerV256 = window.setTimeout(() => {
    pcLiveAnalysisTimerV256 = 0;
    apply();
  }, 100);
}

if (!window.pcLiveAnalyzingLayoutV256Installed) {
  window.pcLiveAnalyzingLayoutV256Installed = true;
  window.addEventListener('resize', pcScheduleLiveAnalyzingLayoutV256, { passive: true });
  window.addEventListener('orientationchange', pcScheduleLiveAnalyzingLayoutV256, { passive: true });
  window.visualViewport?.addEventListener('resize', pcScheduleLiveAnalyzingLayoutV256, { passive: true });
  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('vnOverlay');
    const terminal = document.getElementById('claudeTerminalScene');
    const observer = new MutationObserver(() => pcScheduleLiveAnalyzingLayoutV256());
    if (overlay) observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
    if (terminal) observer.observe(terminal, { attributes: true, attributeFilter: ['class'] });
  }, { once: true });
}

window.pcApplyLiveAnalyzingLayout = pcApplyLiveAnalyzingLayoutV256;

function renderClaudeAnalyzingReadout(partLabel = 'Scenario diagnosis') {
  const outputEl = document.getElementById('claudeTerminalOutput');
  if (!outputEl) return;

  const sectionLabel = terminalizeClaudeText(partLabel || 'Scenario diagnosis').toUpperCase() || 'SCENARIO DIAGNOSIS';
  outputEl.classList.remove('claude-analysis-layout');
  outputEl.classList.add('pc-analyzing-output');

  outputEl.innerHTML = `
    <div class="pc-analyzing-readout" aria-label="Babbage Engine analyzing">
      <div class="pc-analyzing-panel">
        <div class="pc-terminal-line pc-terminal-title-line">BABBAGE ENGINE</div>
        <div class="pc-terminal-divider" aria-hidden="true"></div>
        <div class="pc-terminal-section">
          <div class="pc-terminal-kicker">&gt; SECTION</div>
          <div class="pc-terminal-value">${esc(sectionLabel)}</div>
        </div>
        <div class="pc-terminal-divider" aria-hidden="true"></div>
        <div class="pc-terminal-section">
          <div class="pc-terminal-kicker">&gt; STATUS</div>
          <div class="pc-terminal-value pc-analyzing-status">ANALYZING<span class="claude-terminal-cursor" aria-hidden="true"></span></div>
          <div class="pc-analyzing-progress" role="progressbar" aria-label="Babbage analysis progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <span class="pc-analyzing-progress-fill" aria-hidden="true"></span>
          </div>
          <div class="pc-analyzing-phase" aria-live="polite">PREPARING REQUEST</div>
        </div>
      </div>
    </div>
  `;

  positionClaudeAnalyzingReadoutV161();
  requestAnimationFrame(positionClaudeAnalyzingReadoutV161);
  window.setTimeout(positionClaudeAnalyzingReadoutV161, 60);
  window.setTimeout(positionClaudeAnalyzingReadoutV161, 220);
  pcScheduleLiveAnalyzingLayoutV256({ immediate: true });
}

const PC_CLAUDE_PROCESSING_HOLD_DEFAULT_MS = 350;
let pcClaudeAnalysisProgressTimerV360 = 0;
let pcClaudeAnalysisProgressFrameV360 = 0;
let pcClaudeAnalysisProgressValueV360 = 0;
let pcClaudeAnalysisProgressStartedAtV360 = 0;

/*
  V360 progress model:
  Anthropic's non-streaming Messages API does not expose a true percentage
  complete. PromptCraft therefore reports real lifecycle stages and uses a
  conservative elapsed-time estimate only while the network request is
  outstanding. It never reaches 100% until an actual response has arrived and
  the diagnostic is ready to render.
*/
function pcGetClaudeProcessingHoldMsV316() {
  const configured = Number(window.PC_CLAUDE_PROCESSING_HOLD_MS);
  if (!Number.isFinite(configured)) {
    window.PC_CLAUDE_PROCESSING_HOLD_MS = PC_CLAUDE_PROCESSING_HOLD_DEFAULT_MS;
    return PC_CLAUDE_PROCESSING_HOLD_DEFAULT_MS;
  }
  return Math.max(0, configured);
}

function pcGetClaudeProgressElementsV360() {
  const progress = document.querySelector('#claudeTerminalOutput .pc-analyzing-progress');
  return {
    progress,
    fill: progress?.querySelector('.pc-analyzing-progress-fill') || null,
    phase: document.querySelector('#claudeTerminalOutput .pc-analyzing-phase'),
    status: document.querySelector('#claudeTerminalOutput .pc-analyzing-status')
  };
}

function pcSetClaudeAnalysisProgressV360(value, phaseLabel = '', { complete = false } = {}) {
  const { progress, fill, phase, status } = pcGetClaudeProgressElementsV360();
  if (!progress || !fill) return false;

  const safeValue = complete
    ? 100
    : Math.max(pcClaudeAnalysisProgressValueV360, Math.min(98, Number(value) || 0));

  pcClaudeAnalysisProgressValueV360 = safeValue;
  progress.classList.toggle('is-complete', complete);
  progress.classList.remove('is-running');
  progress.setAttribute('aria-valuenow', String(Math.round(safeValue)));
  fill.style.setProperty('width', `${safeValue}%`, 'important');

  if (phase && phaseLabel) phase.textContent = terminalizeClaudeText(phaseLabel).toUpperCase();
  if (status) {
    status.firstChild.textContent = complete ? 'ANALYSIS READY' : 'ANALYZING';
  }
  return true;
}

function pcStopClaudeAnalysisProgressV360() {
  if (pcClaudeAnalysisProgressTimerV360) {
    window.clearInterval(pcClaudeAnalysisProgressTimerV360);
    pcClaudeAnalysisProgressTimerV360 = 0;
  }
  if (pcClaudeAnalysisProgressFrameV360) {
    window.cancelAnimationFrame(pcClaudeAnalysisProgressFrameV360);
    pcClaudeAnalysisProgressFrameV360 = 0;
  }
}

function pcStartClaudeAnalysisProgressV360(timeoutMs = 60000) {
  pcStopClaudeAnalysisProgressV360();
  pcClaudeAnalysisProgressStartedAtV360 = performance.now();
  pcClaudeAnalysisProgressValueV360 = 0;

  if (!pcSetClaudeAnalysisProgressV360(6, 'Preparing request')) return false;

  // The request has left the browser. These milestones describe things we can
  // actually know. Between them the bar advances slowly as an elapsed-time
  // estimate, capped at 84% so "almost done" never becomes a lie.
  window.setTimeout(() => pcSetClaudeAnalysisProgressV360(12, 'Sending course context'), 120);
  window.setTimeout(() => pcSetClaudeAnalysisProgressV360(18, 'Waiting for Babbage'), 500);

  const safeTimeout = Math.max(10000, Number(timeoutMs) || 60000);
  pcClaudeAnalysisProgressTimerV360 = window.setInterval(() => {
    const elapsed = performance.now() - pcClaudeAnalysisProgressStartedAtV360;
    const ratio = Math.min(1, elapsed / safeTimeout);

    // Ease toward 84%. Typical 30–40 s responses land around 60–75% rather
    // than displaying a fake 100% several seconds before Babbage returns.
    const estimated = 18 + (66 * (1 - Math.exp(-2.2 * ratio)));
    const next = Math.min(84, estimated);

    let phaseLabel = 'Waiting for Babbage';
    if (elapsed >= 30000) phaseLabel = 'Babbage is still reasoning';
    else if (elapsed >= 12000) phaseLabel = 'Babbage is evaluating the design';

    pcSetClaudeAnalysisProgressV360(next, phaseLabel);
  }, 500);

  return true;
}

function pcMarkClaudeResponseReceivedV360() {
  pcStopClaudeAnalysisProgressV360();
  return pcSetClaudeAnalysisProgressV360(90, 'Response received');
}

function pcMarkClaudeResponseParsedV360() {
  return pcSetClaudeAnalysisProgressV360(96, 'Building diagnostic');
}

function pcCompleteClaudeAnalysisProgressV360() {
  pcStopClaudeAnalysisProgressV360();
  return pcSetClaudeAnalysisProgressV360(100, 'Analysis complete', { complete: true });
}

function pcFailClaudeAnalysisProgressV360() {
  pcStopClaudeAnalysisProgressV360();
  return pcSetClaudeAnalysisProgressV360(
    Math.max(24, pcClaudeAnalysisProgressValueV360),
    'Live analysis unavailable — loading fallback'
  );
}

// Compatibility names retained because older scenario shells call these globals.
window.pcStartClaudeAnalysisProgress = pcStartClaudeAnalysisProgressV360;
window.pcSetClaudeAnalysisProgress = pcSetClaudeAnalysisProgressV360;
window.pcMarkClaudeResponseReceived = pcMarkClaudeResponseReceivedV360;
window.pcMarkClaudeResponseParsed = pcMarkClaudeResponseParsedV360;
window.pcCompleteClaudeAnalysisProgress = pcCompleteClaudeAnalysisProgressV360;
window.pcFailClaudeAnalysisProgress = pcFailClaudeAnalysisProgressV360;

const PC_ANALYSIS_LAYOUT_CLASSES_V267 = [
  'pc-analysis-report-active-v122',
  'pc-analysis-panel-v255',
  'pc-analysis-computer-v255'
];

let pcAnalysisLayoutModeV255 = null;
let pcAnalysisLayoutFrameV255 = 0;
let pcAnalysisLayoutSettleTimerV255 = 0;
let pcAnalysisLayoutGenerationV255 = 0;

function pcAnalysisViewportWidthV122() {
  const values = [
    window.innerWidth,
    document.documentElement ? document.documentElement.clientWidth : null,
    window.visualViewport ? window.visualViewport.width : null
  ].filter((value) => Number.isFinite(value) && value > 0);

  return values.length ? Math.min(...values) : 9999;
}

// [COMPLETED ANALYSIS: BREAKPOINT OWNER]
function pcGetAnalysisLayoutV122() {
  const width = pcAnalysisViewportWidthV122();
  const height = pcViewportHeight();
  // v336: Keep phones on the framed panel, but let tablet and fold portrait
  // screens graduate to the photographed workstation so the completed
  // diagnostic uses the same classroom-computer composition as the regular
  // analysis view instead of floating inside a large terminal border.
  // v330: The Nest Hub class is wide enough to show the real workstation even
  // though it is short. Keeping it in panel mode produced a floating report with
  // cropped left edges and no relationship to the rest of the computer sequence.
  if (width >= 900 && height <= 700) return 'computer';
  if (width >= 700 && height >= 760) return 'computer';
  return width <= 1180 ? 'panel' : 'computer';
}

function pcClearLegacyAnalysisInlineStylesV122() {
  pcRemoveAnalysisDeskExtensionV338();
  const overlay = document.getElementById('vnOverlay');
  const terminal = document.getElementById('claudeTerminalScene');
  const photo = terminal ? terminal.querySelector('.claude-terminal-photo') : null;
  const screen = terminal ? terminal.querySelector('.claude-terminal-screen') : null;
  const dialogue = overlay ? overlay.querySelector('.vn-dialogue') : null;
  const scene = overlay ? overlay.querySelector('.vn-scene') : null;
  const sceneBg = document.getElementById('vnSceneBg');
  const menuButton = document.querySelector('.vn-brand-menu');
  const appHeader = document.querySelector('.pc-app-header');
  const compactNav = document.querySelector('.pc-compact-nav');
  const devBar = document.querySelector('.dev-bar');

  pcClearWideAnalysisReportContentStylesV215();

  pcRemoveInlineStyles(terminal, [
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'max-width', 'max-height', 'min-height', 'aspect-ratio', 'transform',
    'margin', 'padding', 'display', 'opacity', 'visibility', 'z-index', 'overflow'
  ]);
  pcRemoveInlineStyles(photo, [
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'max-width', 'max-height', 'aspect-ratio', 'border-radius', 'padding',
    'margin', 'background', 'background-image', 'border', 'box-shadow', 'display',
    'overflow', 'z-index', 'transform'
  ]);
  pcRemoveInlineStyles(screen, [
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'border-radius', 'padding', 'box-sizing', 'overflow', 'overflow-y', 'overflow-x',
    'z-index', 'transform', 'display', 'flex-direction', 'margin', 'max-width',
    'max-height', 'min-width', 'min-height', 'background', 'border', 'box-shadow'
  ]);
  pcRemoveInlineStyles(dialogue, [
    'height', 'min-height', 'padding', 'overflow', 'background', 'border'
  ]);
  pcRemoveInlineStyles(scene, ['position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height', 'min-height', 'padding', 'overflow', 'background']);
  pcRemoveInlineStyles(sceneBg, ['display', 'visibility', 'opacity']);
  pcRemoveInlineStyles(menuButton, ['display', 'visibility', 'pointer-events', 'opacity']);
  pcRemoveInlineStyles(overlay, ['background']);
  pcRemoveInlineStyles(appHeader, ['display', 'visibility', 'pointer-events', 'opacity']);
  pcRemoveInlineStyles(compactNav, ['display', 'visibility', 'pointer-events', 'opacity']);
  pcRemoveInlineStyles(devBar, ['display', 'visibility', 'pointer-events', 'opacity']);
}

function pcIsAnalysisReportActiveV122() {
  const overlay = document.getElementById('vnOverlay');
  const output = document.getElementById('claudeTerminalOutput');

  return Boolean(
    overlay &&
    overlay.classList.contains('active') &&
    overlay.classList.contains('claude-terminal-textmode') &&
    output &&
    output.classList.contains('claude-analysis-layout')
  );
}

// v267: Removed the unused legacy medium terminal-analysis controller.
function pcApplyAnalysisLayoutV122() {
  const overlay = document.getElementById('vnOverlay');
  const terminal = document.getElementById('claudeTerminalScene');
  const output = document.getElementById('claudeTerminalOutput');
  const menuButton = overlay?.querySelector('.vn-brand-menu');
  const appHeader = document.querySelector('.pc-app-header');
  const compactNav = document.querySelector('.pc-compact-nav');
  const devBar = document.querySelector('.dev-bar');
  const targets = [overlay, terminal, output].filter(Boolean);
  const isActive = pcIsAnalysisReportActiveV122();

  if (!isActive) {
    if (pcAnalysisLayoutModeV255 !== null) {
      targets.forEach((element) => element.classList.remove(...PC_ANALYSIS_LAYOUT_CLASSES_V267));
      pcClearLegacyAnalysisInlineStylesV122();
      pcRemoveInlineStyles(menuButton, ['display', 'visibility', 'pointer-events', 'opacity']);
      pcAnalysisLayoutModeV255 = null;
    }
    return false;
  }

  const layout = pcGetAnalysisLayoutV122();
  const modeChanged = layout !== pcAnalysisLayoutModeV255;
  [appHeader, compactNav, devBar].forEach((element) => pcSetImportantStyles(element, [
    ['display', 'none'],
    ['visibility', 'hidden'],
    ['pointer-events', 'none']
  ]));

  if (modeChanged) {
    // Clear once at the breakpoint transition, then assign the new mode in the
    // same task. Repeated resize events inside one mode no longer strip the
    // current geometry and expose an intermediate blank/oversized frame.
    pcClearLegacyAnalysisInlineStylesV122();
    targets.forEach((element) => {
      element.classList.remove(...PC_ANALYSIS_LAYOUT_CLASSES_V267);
      element.classList.add('pc-analysis-report-active-v122');
      element.classList.add(layout === 'panel'
        ? 'pc-analysis-panel-v255'
        : 'pc-analysis-computer-v255');
    });
    pcAnalysisLayoutModeV255 = layout;
  } else {
    targets.forEach((element) => {
      element.classList.add('pc-analysis-report-active-v122');
      element.classList.toggle('pc-analysis-panel-v255', layout === 'panel');
      element.classList.toggle('pc-analysis-computer-v255', layout === 'computer');
    });
  }

  if (menuButton && 'open' in menuButton) menuButton.open = false;
  pcSetImportantStyles(menuButton, [
    ['display', 'none'],
    ['visibility', 'hidden'],
    ['pointer-events', 'none'],
    ['opacity', '0']
  ]);

  if (layout === 'panel') {
    // CSS owns the outer phone/tablet panel, while the shared auto-fit routine
    // keeps the dynamic report inside its available monitor area.
    const panelScreen = terminal?.querySelector('.claude-terminal-screen');
    if (panelScreen) pcFitWideAnalysisReportV215(panelScreen);
    return true;
  }

  const photo = terminal?.querySelector('.claude-terminal-photo');
  const screen = terminal?.querySelector('.claude-terminal-screen');
  pcApplyWideAnalysisReportComputerV215(terminal, photo, screen, pcViewportHeight());
  return true;
}

function pcScheduleAnalysisLayoutV255({ immediate = false } = {}) {
  const generation = ++pcAnalysisLayoutGenerationV255;

  if (pcAnalysisLayoutFrameV255) {
    cancelAnimationFrame(pcAnalysisLayoutFrameV255);
    pcAnalysisLayoutFrameV255 = 0;
  }
  if (pcAnalysisLayoutSettleTimerV255) {
    clearTimeout(pcAnalysisLayoutSettleTimerV255);
    pcAnalysisLayoutSettleTimerV255 = 0;
  }

  const apply = () => {
    if (generation !== pcAnalysisLayoutGenerationV255) return;
    pcApplyAnalysisLayoutV122();
  };

  if (immediate) apply();
  pcAnalysisLayoutFrameV255 = requestAnimationFrame(() => {
    pcAnalysisLayoutFrameV255 = 0;
    apply();
  });
  pcAnalysisLayoutSettleTimerV255 = window.setTimeout(() => {
    pcAnalysisLayoutSettleTimerV255 = 0;
    apply();
  }, 120);
}

function pcClearAnalysisLayoutV122() {
  pcStopClaudeAnalysisProgressV360();
  pcAnalysisLayoutGenerationV255 += 1;
  if (pcAnalysisLayoutFrameV255) cancelAnimationFrame(pcAnalysisLayoutFrameV255);
  if (pcAnalysisLayoutSettleTimerV255) clearTimeout(pcAnalysisLayoutSettleTimerV255);
  pcAnalysisLayoutFrameV255 = 0;
  pcAnalysisLayoutSettleTimerV255 = 0;
  pcAnalysisLayoutModeV255 = null;

  const overlay = document.getElementById('vnOverlay');
  const terminal = document.getElementById('claudeTerminalScene');
  const output = document.getElementById('claudeTerminalOutput');
  const menuButton = overlay?.querySelector('.vn-brand-menu');

  [overlay, terminal, output].filter(Boolean).forEach((element) => {
    element.classList.remove(...PC_ANALYSIS_LAYOUT_CLASSES_V267);
  });

  pcRemoveInlineStyles(menuButton, ['display', 'visibility', 'pointer-events']);
  pcClearLegacyAnalysisInlineStylesV122();
}

if (!window.pcAnalysisLayoutV122Installed) {
  window.pcAnalysisLayoutV122Installed = true;
  window.addEventListener('resize', pcScheduleAnalysisLayoutV255, { passive: true });
  window.addEventListener('orientationchange', pcScheduleAnalysisLayoutV255, { passive: true });
  window.visualViewport?.addEventListener('resize', pcScheduleAnalysisLayoutV255, { passive: true });
}

function showClaudeConsultOverlay(partLabel) {
  // This is an interaction moment: Pixel consults Babbage through the terminal close-up.
  vnQueue = [];
  clearTimeout(vnTypeTimer);
  vnTyping = true;
  vnOnComplete = null;
  vnFullText = '';
  vnCurrentText = '';

pcClearAnalysisLayoutV122();

const overlay = pcSetVNOverlayState({
  active: true,
  modes: ['claude-terminal-consult']
});
setClaudeTerminalTextMode(false);

musicStartVN();

setClaudeShelfState('idle', 'idle');

setClaudeTerminalState(
  'thinking',
  'BABBAGE ENGINE',
  `SECTION:\n${esc(partLabel).toUpperCase()}\n\nANALYZING...`
);

renderClaudeAnalyzingReadout(partLabel);
pcQueueModernTerminalAlignmentV147();
pcScheduleLiveAnalyzingLayoutV256({ immediate: true });

  const speaker = document.getElementById('vnSpeaker');
  if (speaker) speaker.textContent = 'Professor Pixel';

  const vnText = document.getElementById('vnText');
  if (vnText) {
    vnText.innerHTML = `<div><strong>Let's ask Babbage what it notices.</strong></div><div style="margin-top:8px;">Babbage is analyzing the teaching problem now.</div><div class="vn-prediction-note">Terminal active...</div>`;
  }

  const hint = document.getElementById('vnAdvanceHint');
  if (hint) hint.classList.remove('show');

  setTimeout(() => {
    document.getElementById('vnDialogue')?.focus();
  }, 100);
}

function parseClaudeDiagnosticSections(text) {
  const clean = terminalizeClaudeText(text);
  const lines = clean
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean);

  const result = {
    status: '',
    confidence: '',
    summary: '',
    worked: '',
    issue: '',
    repair: '',
    impact: ''
  };

  let current = '';

  for (const line of lines) {
    const upper = line.toUpperCase().replace(/:$/, '');

    if (/^(MOCK )?ANALYSIS COMPLETE$/.test(upper) || upper === 'SCENARIO DIAGNOSTIC') continue;

    if (upper === 'STATUS') { current = 'status'; continue; }
    if (upper === 'CONFIDENCE') { current = 'confidence'; continue; }
    if (upper === 'FEEDBACK SUMMARY') { current = 'summary'; continue; }
    if (upper === 'WHAT WORKED') { current = 'worked'; continue; }
    if (upper === 'ISSUE DETECTED') { current = 'issue'; continue; }
    if (upper === 'RECOMMENDED REPAIR') { current = 'repair'; continue; }
    if (upper === 'EXPECTED IMPACT') { current = 'impact'; continue; }
    if (upper === 'REVISED DISCUSSION PROMPT' || upper === 'COURSE QUALITY CHECK') { current = ''; continue; }

    if (current && result[current]) result[current] += ' ' + line;
    else if (current) result[current] = line;
  }

  const fallbackIssue = clean
    .replace(/^(MOCK )?ANALYSIS COMPLETE\s*/i, '')
    .replace(/^SCENARIO DIAGNOSTIC\s*/i, '')
    .trim();

  return {
    status: result.status || 'High-confidence repair',
    confidence: result.confidence || 'High',
    summary: result.summary || 'Babbage evaluated the specific repair choices in your prompt and identified the strongest next refinement.',
    worked: result.worked || 'Your prompt gave Babbage enough instructional direction to produce a targeted redesign.',
    issue: result.issue || fallbackIssue || 'The prompt has a discussion design problem that may limit student interaction.',
    repair: result.repair || 'Add a clear reason for students to extend, challenge, compare, or build on a peer’s idea using evidence or reasoning.',
    impact: result.impact || 'Students will be more likely to extend conversations, challenge ideas, compare perspectives, and engage in deeper discussion.'
  };
}

function buildClaudeAnalysisHTML(feedback, mock = false, mockReason = '') {
  const d = parseClaudeDiagnosticSections(feedback);
  const badge = mock ? (mockReason === 'backend-unavailable' ? 'BACKEND FALLBACK ANALYSIS' : 'MOCK ANALYSIS COMPLETE') : 'ANALYSIS COMPLETE';
  const totalCharacters = [d.status, d.confidence, d.summary, d.worked, d.issue, d.repair, d.impact]
    .join(' ')
    .length;
  const densityClass = totalCharacters > 1100
    ? 'analysis-report-very-dense'
    : totalCharacters > 820
      ? 'analysis-report-dense'
      : '';

  return `
    <div class="analysis-report ${densityClass}" data-analysis-characters="${totalCharacters}" role="document" aria-label="Babbage scenario diagnostic report">
      <header class="analysis-header">
        <div class="analysis-badge">${esc(badge)}</div>
        <h2 class="analysis-title">Scenario Diagnostic</h2>
        <p class="analysis-summary">${esc(d.summary)}</p>
      </header>

      <div class="analysis-grid" aria-label="Diagnostic findings">
        <section class="analysis-card analysis-status-card compact">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">✓</span><span>Status</span></span>
          <div class="analysis-value big">${esc(d.status)}</div>
        </section>

        <section class="analysis-card analysis-confidence-card compact">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">◎</span><span>Confidence</span></span>
          <div class="analysis-value big">${esc(d.confidence)}</div>
          <div class="analysis-note">Babbage's confidence in this specific diagnosis.</div>
        </section>

        <section class="analysis-card analysis-worked-card">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">+</span><span>What Worked</span></span>
          <div class="analysis-value">${esc(d.worked)}</div>
        </section>

        <section class="analysis-card analysis-issue-card">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">!</span><span>Issue Detected</span></span>
          <div class="analysis-value">${esc(d.issue)}</div>
        </section>

        <section class="analysis-card analysis-repair-card">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">↗</span><span>Recommended Repair</span></span>
          <div class="analysis-value">${esc(d.repair)}</div>
        </section>

        <section class="analysis-card analysis-impact-card wide">
          <span class="analysis-label"><span class="analysis-icon" aria-hidden="true">▥</span><span>Expected Impact</span></span>
          <div class="analysis-value">${esc(d.impact)}</div>
        </section>
      </div>
    </div>
  `;
}

function showClaudeConsultResult(feedback, mock = false, onClose = null, mockReason = '') {
  claudeTerminalCloseCallback = typeof onClose === 'function' ? onClose : null;
  const label = mock ? (mockReason === 'backend-unavailable' ? 'BACKEND FALLBACK ANALYSIS' : 'MOCK ANALYSIS COMPLETE') : 'ANALYSIS COMPLETE';
  const terminalText = `${label}\n\n${terminalizeClaudeText(feedback)}`;

  setClaudeTerminalTextMode(true);

  setClaudeTerminalState(
    'responding',
    mock ? 'MOCK BABBAGE ENGINE' : 'BABBAGE ENGINE',
    esc(terminalText)
  );

  const output = document.getElementById('claudeTerminalOutput');

  if (output) {
    output.classList.add('claude-analysis-layout');
    output.innerHTML = buildClaudeAnalysisHTML(terminalText, mock, mockReason);
  }

  requestAnimationFrame(() => {
    pcScheduleAnalysisLayoutV255({ immediate: true });
    const screen = output?.closest('.claude-terminal-screen');
    if (screen) screen.scrollTop = 0;
    if (output) output.scrollTop = 0;
  });

  const speaker = document.getElementById('vnSpeaker');
  if (speaker) speaker.textContent = 'Professor Pixel';

  const vnText = document.getElementById('vnText');
  if (vnText) {
    vnText.innerHTML = `
      <button id="claudeTTSBtn" class="claude-tts-btn" type="button" data-pc-action="toggle-claude-tts" data-pc-stop-propagation="true">🔊 Read Analysis</button>
      <button class="vn-return-btn terminal-return" type="button" data-pc-action="close-claude-consult" data-pc-stop-propagation="true">Continue</button>
    `;
    setTimeout(() => vnText.querySelector('.vn-return-btn')?.focus(), 100);
    pcScheduleAnalysisLayoutV255();
  }

  const hint = document.getElementById('vnAdvanceHint');
  if (hint) hint.classList.remove('show');
}


// NOTE: Terminal diagnosis copy is still inline. Candidate for dialogue.js or scenario-data.js.
function showClaudeFinalResponseInTerminal(responseText, mock = false, onClose = null, scoreTotal = null, mockReason = '', structuredAnalysis = null) {
  // Scenario-specific result handoff: S2 currently uses the shared terminal flow.
  let effectiveClose = onClose;
  if (scenarioIndex === 1) {
    effectiveClose = function() {
      addS2ClaudeResultCard(responseText);
      if (typeof onClose === 'function') onClose();
    };
  }
  // If the thinking screen is already open, keep it and swap to the result quickly.
  const overlay = document.getElementById('vnOverlay');
  if (!overlay || !overlay.classList.contains('active')) {
    showClaudeConsultOverlay('Scenario diagnosis');
  }
  // V360: the progress bar now follows the real Babbage request lifecycle.
  // By the time this function runs the response has arrived; briefly show the
  // final parsing/rendering stages, then reveal the report.
  pcMarkClaudeResponseParsedV360();
  const claudeProcessingHoldMs = pcGetClaudeProcessingHoldMsV316();

  window.setTimeout(() => {
    pcCompleteClaudeAnalysisProgressV360();
    const terminalOutput = scenarioIndex === 0 && typeof scoreTotal === 'number'
      ? buildS1TerminalDiagnosis(scoreTotal, responseText, structuredAnalysis)
      : responseText;
    window.setTimeout(() => {
      showClaudeConsultResult(terminalOutput, mock, effectiveClose, mockReason);
    }, Math.min(180, claudeProcessingHoldMs));
  }, Math.min(180, claudeProcessingHoldMs));
}

// NOTE: Pixel score-reflection dialogue is still inline. Candidate for dialogue.js pass 2.
function closeClaudeConsultOverlay() {
  const cb = claudeTerminalCloseCallback;
  claudeTerminalCloseCallback = null;
  pcClearAnalysisLayoutV122();
  pcSetVNOverlayState({ active: false });
  pcResetVNCharacters();
  pcResetVNDialogueState();
  setClaudeShelfState('idle', 'idle');
  setClaudeTerminalTextMode(false);
  setClaudeTerminalState('idle', 'BABBAGE ENGINE', 'IDLE');
  musicEndVN();
  if (cb) {
    setTimeout(cb, 250);
  } else {
    document.getElementById('promptInput')?.focus();
  }
}

pcRegisterUIActions({
  'toggle-claude-tts': () => toggleClaudeTTS(),
  'close-claude-consult': () => closeClaudeConsultOverlay()
});

function setClaudeShelfState(state = 'idle', label = '') {
  const shelf = document.getElementById('claudeShelf');
  const status = document.getElementById('claudeShelfStatus');
  if (!shelf) return;
  shelf.classList.remove('idle', 'thinking', 'responding');
  shelf.classList.add(state);
  if (status) status.textContent = label || state;
}

function vnShow(expression, text, onComplete, meta = {}) {
  // Add to queue. Meta keeps the shared VN system backward compatible while
  // allowing any scenario line to identify a secondary speaker.
  vnQueue.push({ expression, text, onComplete, ...meta });
  if (!vnTyping) vnPlayNext();
}

function vnPlayNext() {
  if (vnQueue.length === 0) {
    setTimeout(() => {
      pcSetVNOverlayState({ active: false });
      pcResetVNCharacters();
      pcResetVNDialogueState();
      document.getElementById('promptInput')?.focus();
      // Fade music down when VN closes
      musicEndVN();
      setClaudeShelfState('idle', 'idle');
    }, 300);
    vnTyping = false;
    return;
  }

  const { expression, text, onComplete, speaker = 'Professor Pixel', character = 'pixel' } = vnQueue.shift();
  vnOnComplete = onComplete || null;
  vnTyping = true;

  const overlay = pcSetVNOverlayState({
    active: true,
    preserve: ['scenario-intro-active']
  });

  // Reset Claude modes, then configure the active VN speaker. Dual-cast scenes keep
  // the secondary character opposite Pixel on wide screens and show one on small screens.
  setClaudeTerminalTextMode(false);

  // Fade music up when VN opens
  musicStartVN();
  setClaudeShelfState('idle', 'idle');

  vnSetDialogueCharacter(character, expression, speaker);
  requestAnimationFrame(pcApplyIpadLayoutV200);

  setTimeout(() => {
    pcFocusWithoutScroll(document.getElementById('vnDialogue'));
  }, 100);

  document.getElementById('vnAdvanceHint').classList.remove('show');

  vnFullText = text;
  vnCurrentText = '';
  document.getElementById('vnText').innerHTML = '';
  vnTypeWriter(text);
}

function vnSetExpression(expr) {
  const img = document.getElementById('vnPortrait');
  const src = EXPRESSIONS[expr] || EXPRESSIONS.neutral;
  if (!img) return;

  // Expression names are implementation state, not visible interface copy.
  // Only swap the portrait image; never write labels such as "neutral" or
  // "thinking" into the scene.
  if (img.style.display !== 'none') {
    img.style.opacity = '0';
    setTimeout(() => {
      pcSetImageSource(img, src, LEGACY_ASSETS.images.professorPixel[expr] || LEGACY_ASSETS.images.professorPixel.neutral);
      img.style.opacity = '1';
    }, 150);
  } else {
    pcSetImageSource(img, src, LEGACY_ASSETS.images.professorPixel[expr] || LEGACY_ASSETS.images.professorPixel.neutral);
  }
}

function vnSetStudentExpression(expr) {
  const img = document.getElementById('vnStudentPortrait');
  const expressions = ASSETS.images.students.jordan;
  const src = expressions[expr] || expressions.neutral;
  if (!img) return;
  img.style.opacity = '0';
  setTimeout(() => {
    pcSetImageSource(img, src, LEGACY_ASSETS.images.students.jordan[expr] || LEGACY_ASSETS.images.students.jordan.neutral);
    img.style.opacity = '1';
  }, 120);
}

function vnSetDialogueCharacter(character = 'pixel', expression = 'neutral', speakerName = 'Professor Pixel') {
  const overlay = document.getElementById('vnOverlay');
  const pixel = document.getElementById('vnCharacter');
  const student = document.getElementById('vnStudentCharacter');
  const speaker = document.getElementById('vnSpeaker');
  const dialogue = document.getElementById('vnDialogue');
  const isJordan = character === 'jordan';
  const useDualCast = getScenarioUI(scenarioIndex).introCast === 'dual' && (isJordan || character === 'pixel');

  if (speaker) speaker.textContent = speakerName || (isJordan ? 'Jordan' : 'Professor Pixel');
  if (dialogue) dialogue.setAttribute('aria-label', `${speaker?.textContent || speakerName} is speaking. Press Space or Enter to continue.`);
  overlay?.classList.toggle('pc-dual-character', useDualCast);

  if (useDualCast) {
    pixel?.classList.add('visible');
    student?.classList.add('visible');
    pixel?.classList.toggle('is-active', !isJordan);
    pixel?.classList.toggle('is-inactive', isJordan);
    student?.classList.toggle('is-active', isJordan);
    student?.classList.toggle('is-inactive', !isJordan);
  } else if (isJordan) {
    // Standard single-cast intros reuse Scenario 1 geometry exactly. The
    // active student's portrait is rendered inside Pixel's established
    // character container rather than creating parallel positioning rules.
    pixel?.classList.add('visible', 'is-active');
    pixel?.classList.remove('is-inactive');
    student?.classList.remove('visible', 'is-active', 'is-inactive');
  } else {
    pixel?.classList.add('visible', 'is-active');
    pixel?.classList.remove('is-inactive');
    student?.classList.remove('visible', 'is-active', 'is-inactive');
  }

  pcApplyDualCastResponsive();
  if (isJordan && !useDualCast) {
    const portrait = document.getElementById('vnPortrait');
    const expressions = ASSETS.images.students.jordan;
    const src = expressions[expression] || expressions.neutral;
    if (portrait) {
      portrait.style.opacity = '0';
      setTimeout(() => {
        pcSetImageSource(portrait, src, LEGACY_ASSETS.images.students.jordan[expression] || LEGACY_ASSETS.images.students.jordan.neutral);
        portrait.style.opacity = '1';
      }, 120);
    }
  } else if (isJordan) vnSetStudentExpression(expression);
  else vnSetExpression(expression);
}

function pcApplyDualCastResponsive() {
  const overlay = document.getElementById('vnOverlay');
  const pixel = document.getElementById('vnCharacter');
  const student = document.getElementById('vnStudentCharacter');
  const compact = window.matchMedia?.('(max-width: 620px), (max-height: 650px)').matches;
  if (!overlay?.classList.contains('pc-dual-character')) {
    if (pixel) pixel.style.display = '';
    if (student) student.style.display = '';
    return;
  }
  if (pixel) {
    if (compact && pixel.classList.contains('is-inactive')) pixel.style.setProperty('display', 'none', 'important');
    else pixel.style.removeProperty('display');
  }
  if (student) {
    if (compact && student.classList.contains('is-inactive')) student.style.setProperty('display', 'none', 'important');
    else student.style.removeProperty('display');
  }
}

if (!window.pcDualCastResponsiveInstalled) {
  window.pcDualCastResponsiveInstalled = true;
  window.addEventListener('resize', pcApplyDualCastResponsive, { passive: true });
  window.visualViewport?.addEventListener('resize', pcApplyDualCastResponsive, { passive: true });
}

function vnTypeWriter(text) {
  const el = document.getElementById('vnText');
  let i = 0;
  const speed = 28; // ms per character

  function type() {
    if (i < text.length) {
      vnCurrentText += text[i];
      el.innerHTML = vnCurrentText + '<span class="vn-cursor"></span>';
      i++;
      vnTypeTimer = setTimeout(type, speed);
    } else {
      // Typing done
      el.innerHTML = vnCurrentText;
      document.getElementById('vnAdvanceHint').classList.add('show');
      playSound(null); // audio hook — add sound key if desired
    }
  }
  type();
}

function vnSkipType() {
  // Instantly complete current line
  clearTimeout(vnTypeTimer);
  const el = document.getElementById('vnText');
  el.innerHTML = vnFullText;
  document.getElementById('vnAdvanceHint').classList.add('show');
}

pcRegisterUIActions({
  'vn-advance': () => vnAdvance(),
  'vn-skip': () => vnSkipType()
});

function vnAdvance() {
  const overlay = document.getElementById('vnOverlay');

  // HARD STOP: during Babbage terminal/thinking screens, clicks on the black
  // dialogue panel must NOT advance or clear the VN text. Only the explicit
  // Continue button on the finished analysis screen should close it.
  const terminal = document.getElementById('claudeTerminalScene');
  const terminalIsThinking = terminal?.classList.contains('thinking');
  const terminalReturnVisible = !!document.querySelector('.terminal-return, #pcContinueToClaudeBtn');
  if (
    overlay &&
    overlay.classList.contains('active') &&
    (overlay.classList.contains('claude-terminal-consult') || overlay.classList.contains('claude-terminal-textmode')) &&
    !terminalReturnVisible &&
    (terminalIsThinking || !overlay.classList.contains('claude-terminal-textmode'))
  ) {
    return;
  }

  // HARD STOP: once the prediction has been logged, the black VN box must
  // not advance the scene. Only the actual "Continue to Babbage" button should
  // move the user into the Claude processing screen. Otherwise a stray click
  // jumps the state machine into the weird empty terminal screen. Charming.
  if (
    window.pcWaitingForClaudeContinue ||
    document.getElementById('pcContinueToClaudeBtn')
  ) {
    return;
  }

  // Do not auto-advance while prediction choices are visible.
  if (
    overlay &&
    (
      overlay.classList.contains('claude-prediction') ||
      overlay.classList.contains('pc-clean-prediction')
    ) &&
    (
      document.querySelector('.vn-prediction-options') ||
      document.getElementById('vnPredictionChoicePanel') ||
      document.getElementById('predictionGate') ||
      document.querySelector('.pc-choice-panel-final')
    )
  ) {
    return;
  }

  // If still typing, skip to end first
  if (document.getElementById('vnAdvanceHint').classList.contains('show') === false) {
    vnSkipType();
    return;
  }
  // Otherwise advance to next line or close
  if (vnOnComplete) {
    const cb = vnOnComplete;
    vnOnComplete = null;
    cb();
  }
  vnTyping = false;
  vnPlayNext();
}

// ── PROFESSOR PIXEL DIALOGUE SEQUENCES ───────────────
/* pixelDialogue moved to dialogue.js */


function getScenarioStartDialogueKey(index) {
  const ui = SCENARIO_UI?.[index];
  return ui?.key ? `scenarioStart_${ui.key}` : `scenarioStart_${index}`;
}

function getScenarioIndexFromDialogueKey(key) {
  if (!key.startsWith('scenarioStart_')) return -1;

  const suffix = key.slice('scenarioStart_'.length);
  const legacyIndex = Number(suffix);
  if (Number.isInteger(legacyIndex) && scenarios[legacyIndex]) return legacyIndex;

  return SCENARIO_UI.findIndex(ui => ui.key === suffix);
}

function playPixelSequence(key, onDone) {
  const lines = pixelDialogue[key];
  if (!lines) return;

  // Update board text and play intro audio on scenario starts
  if (key.startsWith('scenarioStart_')) {
    const i = getScenarioIndexFromDialogueKey(key);
    if (i >= 0 && scenarios[i]) {
      const boardText = document.getElementById('vnBoardText');
      if (boardText) boardText.textContent = scenarios[i].desc;
      // Play scenario intro — suppressed during initial load to avoid double audio
      if (window.scenarioIntroEnabled) playSound(`scenarioIntro${i}`);
    }
  }

  // Welcome narration on game start
  if (key === 'welcome') playSound('welcome');

  // Queue all lines
  lines.forEach((line, idx) => {
    const isLast = idx === lines.length - 1;
    vnShow(line.expr, line.text, isLast && onDone ? onDone : null, { speaker: line.speaker || 'Professor Pixel', character: line.character || 'pixel', id: line.id || '' });
  });
}

// ══════════════════════════════════════════════════════
//  SCENE ILLUSTRATION LOADER
//  Scene paths live in ASSETS.images.scenes. Add each new scenario image to
//  its named folder and update the manifest once rather than scattering paths.
// ══════════════════════════════════════════════════════
function loadSceneImage(src, fallback = '') {
  const img = document.getElementById('vnBoardImg');
  const loading = document.getElementById('vnBoardLoading');
  if (!img) return;

  if (loading) loading.style.display = 'none';
  img.classList.remove('loaded');

  if (!src) {
    img.removeAttribute('src');
    img.alt = '';
    return;
  }

  const test = new Image();
  test.onload = () => {
    img.src = src;
    img.alt = 'Scene illustration';
    img.classList.add('loaded');
  };
  test.onerror = () => {
    if (fallback && test.src !== pcProjectUrl(fallback)) {
      test.src = pcProjectUrl(fallback);
      return;
    }
    // A future scenario may not have final art yet. Fail silently and retain
    // the text-based smartboard rather than displaying a broken image icon.
    img.removeAttribute('src');
    img.alt = '';
    img.classList.remove('loaded');
  };
  test.src = src;
}

// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  pcHydrateStaticImages();
  // The main menu is the true application entry point. Scenario 1 is rendered
  // quietly behind it as a safe fallback, but no dialogue begins until the
  // learner chooses Start or selects a scenario.
  updateAudioSettingsButton();
  startGame();

  // Safety check: if S1 content is still empty after load, render it again.
  setTimeout(() => {
    const scenarioText = document.getElementById('scenarioText');
    const inputContainer = document.getElementById('inputContainer');

    if ((!scenarioText || !scenarioText.textContent.trim()) ||
        (!inputContainer || !inputContainer.textContent.trim())) {
      console.warn('[PromptCraft] Startup watchdog repaired empty initial scenario render.');
      try {
        window.scenarioIntroEnabled = false;
        loadScenario(SCENARIO_INDEX.ENGAGEMENT);
        window.pcInitialScenarioRendered = true;
      } catch (err) {
        console.error('[PromptCraft] Startup watchdog could not render S1:', err);
      }
    }
  }, 900);
});

// ══════════════════════════════════════════════════════
