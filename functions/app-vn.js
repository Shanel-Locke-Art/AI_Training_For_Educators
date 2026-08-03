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
    if (isRegularMobileDialogue) {
      if (window.pcIpadBoardCenterFrameV200) {
        cancelAnimationFrame(window.pcIpadBoardCenterFrameV200);
        window.pcIpadBoardCenterFrameV200 = null;
      }
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
      if (window.pcIpadBoardCenterFrameV200) {
        cancelAnimationFrame(window.pcIpadBoardCenterFrameV200);
        window.pcIpadBoardCenterFrameV200 = null;
      }
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
  left: '19.8%',
  top: '15.2%',
  width: '38.3%',
  height: '44.5%'
};

// [WORKSTATION FRAME: DESKTOP PREDICTION + LIVE ANALYSIS]
function pcApplyWidePredictionComputerV207(terminal, photo, screen, viewportHeight) {
  if (!terminal || !photo || !screen) return false;

  const isShortDesktop = Number.isFinite(viewportHeight) && viewportHeight <= 950;
  const terminalWidth = isShortDesktop ? 'min(66vw, 1320px)' : 'min(72vw, 1500px)';
  const terminalTop = isShortDesktop ? '35.5%' : '34%';

  pcSetImportantStyles(terminal, [
    ['position', 'absolute'],
    ['inset', 'auto'],
    ['left', '50%'],
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


// v225: The completed desktop diagnostic reuses the approved live workstation crop.
// The photographed monitor geometry remains unchanged. The report now removes the
// reserved scrollbar gutter that was shifting it left, starts at a larger readable
// type scale, and progressively reduces that scale only when a generated response
// needs more room. The action buttons are centered independently of legacy dialogue
// positioning so they remain centered beneath the workstation at every wide size.
const PC_WIDE_ANALYSIS_REPORT_SCREEN_GEOMETRY_V215 = {
  left: '19.8%',
  top: '15.2%',
  width: '38.3%',
  height: '44.5%'
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
    'display', 'flex-direction', 'gap', 'grid-template-rows', 'align-items', 'justify-content'
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
    'display', 'grid-template-columns', 'grid-template-rows', 'gap', 'width', 'height',
    'min-height', 'margin', 'box-sizing', 'align-items', 'align-content', 'flex',
    'flex-grow', 'flex-shrink', 'flex-basis'
  ]);
  cards.forEach((card) => pcRemoveInlineStyles(card, [
    'margin', 'padding', 'min-width', 'min-height', 'height', 'border-width',
    'box-shadow', 'box-sizing', 'display', 'flex-direction', 'justify-content', 'overflow'
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
  const compactCards = [...report.querySelectorAll('.analysis-card.compact')];
  const detailCards = [...report.querySelectorAll('.analysis-issue-card, .analysis-repair-card')];
  const impactCard = report.querySelector('.analysis-impact-card');
  const labels = [...report.querySelectorAll('.analysis-label')];
  const values = [...report.querySelectorAll('.analysis-value')];
  const notes = [...report.querySelectorAll('.analysis-note')];
  if (!header || !badge || !title || !summary || !grid) return false;

  const screenRect = screen.getBoundingClientRect();
  const clampNumber = (min, value, max) => Math.max(min, Math.min(max, value));
  const base = {
    badge: clampNumber(9, screenRect.width * 0.0112, 12.5),
    title: clampNumber(27, screenRect.width * 0.0345, 37),
    summary: clampNumber(14, screenRect.width * 0.0175, 18.5),
    label: clampNumber(9.5, screenRect.width * 0.0126, 12.5),
    value: clampNumber(14, screenRect.width * 0.0175, 18.5),
    note: clampNumber(10.5, screenRect.width * 0.0136, 14),
    outputPadding: clampNumber(0, screenRect.width * 0.0016, 3),
    gap: clampNumber(6, screenRect.width * 0.0088, 11),
    cardPadding: clampNumber(7, screenRect.width * 0.0094, 11),
    headerPadding: clampNumber(8, screenRect.width * 0.011, 13)
  };

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
    ['padding', `${base.outputPadding}px`],
    ['display', 'flex'],
    ['align-items', 'stretch'],
    ['justify-content', 'stretch'],
    ['overflow', 'hidden'],
    ['overflow-x', 'hidden'],
    ['overflow-y', 'hidden'],
    ['white-space', 'normal'],
    ['scrollbar-gutter', 'auto'],
    ['box-sizing', 'border-box'],
    ['transform', 'none']
  ]);

  pcSetImportantStyles(report, [
    ['position', 'relative'],
    ['width', '100%'],
    ['max-width', '100%'],
    ['height', '100%'],
    ['min-width', '0'],
    ['min-height', '0'],
    ['margin', '0'],
    ['padding', '0'],
    ['display', 'flex'],
    ['flex-direction', 'column'],
    ['gap', `${base.gap}px`],
    ['align-items', 'stretch'],
    ['justify-content', 'flex-start'],
    ['overflow', 'hidden'],
    ['box-sizing', 'border-box'],
    ['transform', 'none'],
    ['transform-origin', 'center center']
  ]);

  pcSetImportantStyles(grid, [
    ['display', 'grid'],
    ['grid-template-columns', 'minmax(0, 1fr) minmax(0, 1fr)'],
    ['grid-template-rows', 'auto auto auto'],
    ['gap', `${base.gap}px`],
    ['width', '100%'],
    ['height', 'auto'],
    ['min-height', '0'],
    ['margin', '0'],
    ['align-items', 'stretch'],
    ['align-content', 'start'],
    ['flex', '0 0 auto'],
    ['box-sizing', 'border-box']
  ]);

  const applyScale = (scale) => {
    const scaled = (value, floor = 1) => Math.max(floor, value * scale);

    pcSetImportantStyles(report, [['gap', `${scaled(base.gap, 4)}px`]]);
    pcSetImportantStyles(header, [
      ['margin', '0'],
      ['padding', `${scaled(base.headerPadding, 6)}px`],
      ['border-width', '1px'],
      ['box-shadow', 'none'],
      ['box-sizing', 'border-box']
    ]);
    pcSetImportantStyles(badge, [
      ['margin', `0 0 ${scaled(4, 2)}px`],
      ['padding', `${scaled(2, 1)}px ${scaled(6, 4)}px`],
      ['font-size', `${scaled(base.badge, 7)}px`],
      ['line-height', '1']
    ]);
    pcSetImportantStyles(title, [
      ['margin', `0 0 ${scaled(5, 3)}px`],
      ['font-size', `${scaled(base.title, 17)}px`],
      ['line-height', '1.04']
    ]);
    pcSetImportantStyles(summary, [
      ['width', '97%'],
      ['max-width', 'none'],
      ['margin', '0 auto'],
      ['font-size', `${scaled(base.summary, 9.5)}px`],
      ['line-height', '1.2'],
      ['overflow-wrap', 'normal'],
      ['word-break', 'normal']
    ]);
    pcSetImportantStyles(grid, [['gap', `${scaled(base.gap, 4)}px`]]);

    cards.forEach((card) => pcSetImportantStyles(card, [
      ['margin', '0'],
      ['padding', `${scaled(base.cardPadding, 5)}px`],
      ['min-width', '0'],
      ['min-height', '0'],
      ['height', 'auto'],
      ['border-width', '1px'],
      ['box-shadow', 'none'],
      ['box-sizing', 'border-box'],
      ['display', 'flex'],
      ['flex-direction', 'column'],
      ['justify-content', 'flex-start'],
      ['overflow', 'hidden']
    ]));
    compactCards.forEach((card) => pcSetImportantStyles(card, [
      ['min-height', `${scaled(70, 56)}px`]
    ]));
    detailCards.forEach((card) => pcSetImportantStyles(card, [
      ['min-height', `${scaled(102, 78)}px`]
    ]));
    if (impactCard) {
      pcSetImportantStyles(impactCard, [
        ['min-height', `${scaled(74, 58)}px`]
      ]);
    }
    labels.forEach((label) => pcSetImportantStyles(label, [
      ['margin', `0 0 ${scaled(3, 2)}px`],
      ['font-size', `${scaled(base.label, 7)}px`],
      ['line-height', '1.02']
    ]));
    values.forEach((value) => pcSetImportantStyles(value, [
      ['font-size', `${scaled(base.value, 9)}px`],
      ['line-height', '1.18'],
      ['overflow-wrap', 'break-word'],
      ['word-break', 'normal']
    ]));
    notes.forEach((note) => pcSetImportantStyles(note, [
      ['margin-top', `${scaled(3, 2)}px`],
      ['font-size', `${scaled(base.note, 8)}px`],
      ['line-height', '1.14']
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

  let scale = 1;
  applyScale(scale);
  // Generated diagnoses can vary substantially in length. Reduce only as much
  // as needed, preserving the larger default typography for ordinary responses.
  for (let pass = 0; pass < 12 && !contentFits(); pass += 1) {
    scale = Math.max(0.62, scale * 0.94);
    applyScale(scale);
    if (scale <= 0.62) break;
  }

  // A final narrow fallback keeps unusually long generated copy available
  // without allowing card borders or the monitor frame to overlap.
  if (!contentFits()) {
    pcSetImportantStyles(output, [
      ['overflow-y', 'auto'],
      ['scrollbar-gutter', 'stable both-edges']
    ]);
  }

  return true;
}

// [COMPLETED ANALYSIS: DESKTOP WORKSTATION]
function pcApplyWideAnalysisReportComputerV215(terminal, photo, screen, viewportHeight) {
  if (!terminal || !photo || !screen) return false;

  const viewportWidth = pcAnalysisViewportWidthV122();
  const safeViewportHeight = Number.isFinite(viewportHeight) && viewportHeight > 0
    ? viewportHeight
    : pcViewportHeight();

  // v257: The completed report gets a tall, close workstation crop. The source
  // photograph is cropped with cover, never stretched. The explicit pixel box
  // also prevents old aspect-ratio rules from briefly flattening the machine.
  const aspect = 1.72;
  const maxHeight = Math.max(560, safeViewportHeight * 0.78);
  const maxWidth = Math.min(viewportWidth * 0.96, 1840);
  const width = Math.max(980, Math.min(maxWidth, maxHeight * aspect));
  const height = width / aspect;

  pcSetImportantStyles(terminal, [
    ['position', 'absolute'],
    ['inset', 'auto'],
    ['left', '50%'],
    ['right', 'auto'],
    ['top', '42%'],
    ['bottom', 'auto'],
    ['width', `${Math.round(width)}px`],
    ['height', `${Math.round(height)}px`],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['aspect-ratio', 'auto'],
    ['transform', 'translate(-50%, -50%)'],
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
    ['left', '13.5%'],
    ['right', 'auto'],
    ['top', '14.7%'],
    ['bottom', 'auto'],
    ['width', '46.3%'],
    ['height', '46.5%'],
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
    pcApplyLiveAnalyzingLayoutV202();
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
  // one pass, then capture that exact box for Claude's analyzing transition.
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
  const titleLine = output?.querySelector('.pc-terminal-title-line');
  const gaps = output?.querySelectorAll('.pc-terminal-gap') || [];

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
    'font-size', 'line-height', 'white-space'
  ]);
  pcRemoveInlineStyles(titleLine, ['font-size', 'line-height', 'letter-spacing']);
  gaps.forEach((gap) => pcRemoveInlineStyles(gap, ['height']));
}

// [LIVE ANALYSIS: READOUT POSITION]
function positionClaudeAnalyzingReadoutV161() {
  const terminal = document.getElementById('claudeTerminalScene');
  const outputEl = document.getElementById('claudeTerminalOutput');
  const screen = terminal?.querySelector('.claude-terminal-screen');
  const readout = outputEl?.querySelector('.pc-analyzing-readout');
  const titleLine = outputEl?.querySelector('.pc-terminal-title-line');
  const gaps = outputEl?.querySelectorAll('.pc-terminal-gap') || [];
  if (!terminal || !outputEl || !screen || !readout) return false;

  const viewportWidth = pcAnalysisViewportWidthV122();
  const viewportHeight = Math.min(
    window.innerHeight || Number.POSITIVE_INFINITY,
    document.documentElement?.clientHeight || Number.POSITIVE_INFINITY,
    window.visualViewport?.height || Number.POSITIVE_INFINITY
  );
  const mode = pcGetLiveAnalysisModeV256(viewportWidth);
  const isPortraitTablet = mode === 'tablet' && viewportHeight > viewportWidth * 1.08;
  const isCompactDesktop = mode === 'desktop' && viewportWidth <= 1366 && viewportHeight <= 900;

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

  if (mode === 'phone') {
    pcSetImportantStyles(readout, [
      ['position', 'absolute'],
      ['left', '18%'],
      ['top', '20%'],
      ['right', 'auto'],
      ['bottom', 'auto'],
      ['width', '64%'],
      ['max-width', '64%'],
      ['height', 'auto'],
      ['margin', '0'],
      ['padding', '0'],
      ['transform', 'none'],
      ['text-align', 'left'],
      ['box-sizing', 'border-box'],
      ['font-size', 'clamp(.78rem, 3vw, .92rem)'],
      ['line-height', '1.24']
    ]);
    if (titleLine) {
      pcSetImportantStyles(titleLine, [
        ['font-size', '1.16em'],
        ['line-height', '1.1'],
        ['letter-spacing', '.015em']
      ]);
    }
    gaps.forEach((gap) => pcSetImportantStyles(gap, [['height', '.55em']]));
  } else {
    // v257: Tablet and desktop both position the readout inside the CRT layer
    // established by pcApplyLiveComputerFrameV256. No height-dependent iPad
    // branch remains, so intermediate landscape sizes cannot lose lines.
    pcSetImportantStyles(readout, [
      ['position', 'absolute'],
      ['left', '8%'],
      ['top', '49%'],
      ['right', 'auto'],
      ['bottom', 'auto'],
      ['width', '84%'],
      ['max-width', '84%'],
      ['height', 'auto'],
      ['margin', '0'],
      ['padding', '0'],
      ['transform', 'translateY(-50%)'],
      ['text-align', 'left'],
      ['box-sizing', 'border-box'],
      ['white-space', 'normal'],
      ['font-size', isPortraitTablet
        ? 'clamp(.82rem, 1.55vw, 1rem)'
        : mode === 'tablet'
          ? 'clamp(.72rem, 1.35vw, .94rem)'
          : isCompactDesktop
            ? 'clamp(.96rem, 1.2vw, 1.08rem)'
            : 'clamp(.82rem, .92vw, 1rem)'],
      ['line-height', isPortraitTablet ? '1.17' : isCompactDesktop ? '1.18' : '1.14']
    ]);
    if (titleLine) {
      pcSetImportantStyles(titleLine, [
        ['font-size', isCompactDesktop ? '1.1em' : '1.08em'],
        ['line-height', isCompactDesktop ? '1.1' : '1.08'],
        ['letter-spacing', '.012em']
      ]);
    }
    gaps.forEach((gap) => pcSetImportantStyles(gap, [
      ['height', isPortraitTablet ? '.34em' : isCompactDesktop ? '.42em' : '.28em']
    ]));
  }

  return true;
}
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
    'min-height', 'max-height'
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
  const dialogueRect = dialogue?.getBoundingClientRect();
  const measuredStageHeight = dialogueRect && dialogueRect.top > overlayRect.top
    ? Math.round(dialogueRect.top - overlayRect.top)
    : Math.round(overlayRect.height * 0.72);
  const isPortraitTablet = mode === 'tablet' && overlayRect.height > overlayRect.width * 1.08;
  const portraitDialogueTop = isPortraitTablet
    ? Math.round(overlayRect.height * 0.64)
    : null;
  const stageHeight = Math.max(340, isPortraitTablet ? portraitDialogueTop : measuredStageHeight);

  // v305: Portrait tablets use the same compact workstation-to-dialogue rhythm
  // as the Nest Hub layout. The computer ends immediately above the black panel
  // instead of floating inside a tall unused stage. Landscape and desktop keep
  // their existing geometry unchanged.
  const aspect = 2.0;
  const widthLimit = mode === 'tablet'
    ? (isPortraitTablet
        ? Math.min(viewportWidth * 1.18, 1040)
        : Math.min(viewportWidth * 1.02, 1180))
    : Math.min(viewportWidth * 0.90, 1680);
  const heightLimit = Math.max(320, stageHeight * (isPortraitTablet ? 0.94 : mode === 'tablet' ? 0.98 : 0.94));
  const width = Math.max(520, Math.min(widthLimit, heightLimit * aspect));
  const height = width / aspect;
  const downShift = mode === 'tablet' ? (isPortraitTablet ? 10 : 16) : 14;
  const centeredTop = ((stageHeight - height) / 2) + downShift;
  const portraitTop = portraitDialogueTop - height - 2;
  const top = isPortraitTablet
    ? Math.max(18, portraitTop)
    : Math.max(8, Math.min(centeredTop, stageHeight - height - 4));
  const dialogueTop = isPortraitTablet ? Math.round(top + height + 2) : null;

  pcSetImportantStyles(overlay, [
    ['background', '#050805']
  ]);

  pcSetImportantStyles(scene, [
    ['position', 'absolute'],
    ['inset', isPortraitTablet ? 'auto' : '0'],
    ['left', '0'],
    ['right', '0'],
    ['top', '0'],
    ['bottom', isPortraitTablet ? 'auto' : '0'],
    ['width', '100%'],
    ['height', isPortraitTablet ? `${dialogueTop}px` : '100%'],
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

  if (isPortraitTablet && dialogue) {
    pcSetImportantStyles(dialogue, [
      ['position', 'absolute'],
      ['inset', 'auto'],
      ['left', '0'],
      ['right', '0'],
      ['top', `${dialogueTop}px`],
      ['bottom', '0'],
      ['width', '100%'],
      ['height', 'auto'],
      ['min-height', '0'],
      ['max-height', 'none']
    ]);

    const speaker = document.getElementById('vnSpeaker');
    const text = document.getElementById('vnText');
    pcSetImportantStyles(speaker, [
      ['font-size', 'clamp(1.75rem, 3vw, 2rem)'],
      ['line-height', '1.15']
    ]);
    pcSetImportantStyles(text, [
      ['font-size', 'clamp(1.3125rem, 2.35vw, 1.5625rem)'],
      ['line-height', '1.42']
    ]);
  }

  pcSetImportantStyles(terminal, [
    ['position', 'absolute'],
    ['inset', 'auto'],
    ['left', '50%'],
    ['right', 'auto'],
    ['top', `${Math.round(top)}px`],
    ['bottom', 'auto'],
    ['width', `${Math.round(width)}px`],
    ['height', `${Math.round(height)}px`],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['aspect-ratio', 'auto'],
    ['transform', 'translateX(-50%)'],
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

  // The workstation now uses the full 2:1 transparent render with no side crop.
  // These coordinates match the usable glass inside the CRT bezel, rather than
  // painting the terminal layer across the monitor frame on portrait tablets.
  pcSetImportantStyles(screen, [
    ['position', 'absolute'],
    ['inset', 'auto'],
    ['left', '14.7%'],
    ['right', 'auto'],
    ['top', '14.5%'],
    ['bottom', 'auto'],
    ['width', '44.5%'],
    ['height', '44.8%'],
    ['min-width', '0'],
    ['min-height', '0'],
    ['max-width', 'none'],
    ['max-height', 'none'],
    ['transform', 'none'],
    ['margin', '0'],
    ['padding', '0'],
    ['display', 'block'],
    ['overflow', 'hidden'],
    ['box-sizing', 'border-box'],
    ['transition', 'none']
  ]);
}
function pcApplyLivePhoneStageV256({ overlay, scene, dialogue, terminal, photo, screen }) {
  const overlayRect = overlay.getBoundingClientRect();
  const dialogueRect = dialogue?.getBoundingClientRect();
  const measuredStageHeight = dialogueRect && dialogueRect.top > overlayRect.top
    ? Math.round(dialogueRect.top - overlayRect.top)
    : Math.round(overlayRect.height * 0.72);
  const stageHeight = Math.max(320, measuredStageHeight);

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

// Backward-compatible names used by existing state transitions.
function pcApplyLiveAnalyzingLayoutV202() {
  return pcApplyLiveAnalyzingLayoutV256();
}
function pcQueueLiveAnalyzingLayoutV202() {
  pcScheduleLiveAnalyzingLayoutV256({ immediate: true });
}
window.pcApplyLiveAnalyzingLayout = pcApplyLiveAnalyzingLayoutV256;

function renderClaudeAnalyzingReadout(partLabel = 'Scenario diagnosis') {
  const outputEl = document.getElementById('claudeTerminalOutput');
  if (!outputEl) return;

  const sectionLabel = terminalizeClaudeText(partLabel || 'Scenario diagnosis').toUpperCase() || 'SCENARIO DIAGNOSIS';
  outputEl.classList.remove('claude-analysis-layout');
  outputEl.classList.add('pc-analyzing-output');

  outputEl.innerHTML = `
    <div class="pc-analyzing-readout" aria-label="Claude terminal analyzing">
      <div class="pc-terminal-line pc-terminal-title-line">CLAUDE TERMINAL</div>
      <div class="pc-terminal-gap" aria-hidden="true"></div>
      <div class="pc-terminal-line">&gt; SECTION</div>
      <div class="pc-terminal-line pc-terminal-indent">${esc(sectionLabel)}</div>
      <div class="pc-terminal-gap" aria-hidden="true"></div>
      <div class="pc-terminal-line">&gt; STATUS</div>
      <div class="pc-terminal-line pc-terminal-indent pc-analyzing-status">ANALYZING<span class="claude-terminal-cursor" aria-hidden="true"></span></div>
    </div>
  `;

  positionClaudeAnalyzingReadoutV161();
  requestAnimationFrame(positionClaudeAnalyzingReadoutV161);
  window.setTimeout(positionClaudeAnalyzingReadoutV161, 60);
  window.setTimeout(positionClaudeAnalyzingReadoutV161, 220);
  pcQueueLiveAnalyzingLayoutV202();
}


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
  // v255: Completed analysis has two layouts only. Phones and tablets share
  // one framed diagnostic panel; wider screens use the photographed computer.
  // Removing the intermediate terminal mode prevents a third composition from
  // appearing briefly while the viewport crosses neighboring breakpoints.
  return width <= 1180 ? 'panel' : 'computer';
}

function pcClearLegacyAnalysisInlineStylesV122() {
  const overlay = document.getElementById('vnOverlay');
  const terminal = document.getElementById('claudeTerminalScene');
  const photo = terminal ? terminal.querySelector('.claude-terminal-photo') : null;
  const screen = terminal ? terminal.querySelector('.claude-terminal-screen') : null;
  const dialogue = overlay ? overlay.querySelector('.vn-dialogue') : null;
  const scene = overlay ? overlay.querySelector('.vn-scene') : null;

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
  pcRemoveInlineStyles(scene, ['flex', 'height', 'min-height']);
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
  const menuButton = overlay?.querySelector('.vn-main-menu-toggle');
  const targets = [overlay, terminal, output].filter(Boolean);
  const isActive = pcIsAnalysisReportActiveV122();

  if (!isActive) {
    if (pcAnalysisLayoutModeV255 !== null) {
      targets.forEach((element) => element.classList.remove(...PC_ANALYSIS_LAYOUT_CLASSES_V267));
      pcClearLegacyAnalysisInlineStylesV122();
      pcRemoveInlineStyles(menuButton, ['display', 'visibility', 'pointer-events']);
      pcAnalysisLayoutModeV255 = null;
    }
    return false;
  }

  const layout = pcGetAnalysisLayoutV122();
  const modeChanged = layout !== pcAnalysisLayoutModeV255;

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

  if (layout === 'panel') {
    // CSS owns the phone/tablet panel completely. There are deliberately no
    // delayed inline geometry passes in this mode.
    pcSetImportantStyles(menuButton, [
      ['display', 'none'],
      ['visibility', 'hidden'],
      ['pointer-events', 'none']
    ]);
    return true;
  }

  pcRemoveInlineStyles(menuButton, ['display', 'visibility', 'pointer-events']);
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
  pcAnalysisLayoutGenerationV255 += 1;
  if (pcAnalysisLayoutFrameV255) cancelAnimationFrame(pcAnalysisLayoutFrameV255);
  if (pcAnalysisLayoutSettleTimerV255) clearTimeout(pcAnalysisLayoutSettleTimerV255);
  pcAnalysisLayoutFrameV255 = 0;
  pcAnalysisLayoutSettleTimerV255 = 0;
  pcAnalysisLayoutModeV255 = null;

  const overlay = document.getElementById('vnOverlay');
  const terminal = document.getElementById('claudeTerminalScene');
  const output = document.getElementById('claudeTerminalOutput');
  const menuButton = overlay?.querySelector('.vn-main-menu-toggle');

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
  // This is an interaction moment: Pixel consults Claude through the terminal close-up.
  vnQueue = [];
  clearTimeout(vnTypeTimer);
  vnTyping = true;
  vnOnComplete = null;
  vnFullText = '';
  vnCurrentText = '';

const overlay = document.getElementById('vnOverlay');

pcClearAnalysisLayoutV122();

overlay.classList.remove(
  'claude-prediction',
  'pc-clean-prediction',
  'pc-prediction-question',
  'claude-terminal-consult',
  'claude-terminal-textmode',
  'pc-clean-output',
  'pc-clean-final',
  'analysis-complete'
);

overlay.classList.add('active', 'claude-terminal-consult');

setVNClaudeMode(false);
setVNClaudeTerminalMode(true);
setClaudeTerminalTextMode(false);

musicStartVN();

setClaudeShelfState('idle', 'idle');

setClaudeTerminalState(
  'thinking',
  'CLAUDE TERMINAL',
  `SECTION:\n${esc(partLabel).toUpperCase()}\n\nANALYZING...`
);

renderClaudeAnalyzingReadout(partLabel);
pcQueueModernTerminalAlignmentV147();
pcQueueLiveAnalyzingLayoutV202();

  const speaker = document.getElementById('vnSpeaker');
  if (speaker) speaker.textContent = 'Professor Pixel';

  const vnText = document.getElementById('vnText');
  if (vnText) {
    vnText.innerHTML = `<div><strong>Let's ask Claude what it notices.</strong></div><div style="margin-top:8px;">Claude is analyzing the teaching problem now.</div><div class="vn-prediction-note">Terminal active...</div>`;
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
    issue: '',
    repair: '',
    confidence: '',
    impact: ''
  };

  let current = '';

  for (const line of lines) {
    const upper = line.toUpperCase().replace(/:$/, '');

    if (/^(MOCK )?ANALYSIS COMPLETE$/.test(upper) || upper === 'SCENARIO DIAGNOSTIC') continue;

    if (upper === 'STATUS') { current = 'status'; continue; }
    if (upper === 'ISSUE DETECTED') { current = 'issue'; continue; }
    if (upper === 'RECOMMENDED REPAIR') { current = 'repair'; continue; }
    if (upper === 'EXPECTED IMPACT') { current = 'impact'; continue; }
    if (upper === 'CONFIDENCE') { current = 'confidence'; continue; }

    if (current && result[current]) result[current] += ' ' + line;
    else if (current) result[current] = line;
  }

  const fallbackIssue = clean
    .replace(/^(MOCK )?ANALYSIS COMPLETE\s*/i, '')
    .replace(/^SCENARIO DIAGNOSTIC\s*/i, '')
    .trim();

  return {
    status: result.status || 'High-confidence repair',
    issue: result.issue || fallbackIssue || 'The prompt has a discussion design problem that may limit student interaction.',
    repair: result.repair || 'Add a clear reason for students to extend, challenge, compare, or build on a peer’s idea using evidence or reasoning.',
    impact: result.impact || 'Students will be more likely to extend conversations, challenge ideas, compare perspectives, and engage in deeper discussion.',
    confidence: result.confidence || 'High'
  };
}

function buildClaudeAnalysisHTML(feedback, mock = false) {
  const d = parseClaudeDiagnosticSections(feedback);
  const badge = mock ? 'MOCK ANALYSIS COMPLETE' : 'ANALYSIS COMPLETE';

  return `
    <div class="analysis-report" role="document" aria-label="Claude scenario diagnostic report">
      <header class="analysis-header">
        <div class="analysis-badge">${esc(badge)}</div>
        <h2 class="analysis-title">Scenario Diagnostic</h2>
        <p class="analysis-summary">
          Claude found the discussion design problem and suggested a repair that gives students a clearer reason to keep the conversation going.
        </p>
      </header>

      <div class="analysis-grid" aria-label="Diagnostic findings">
        <section class="analysis-card analysis-status-card compact">
          <span class="analysis-label">Status</span>
          <div class="analysis-value big">✓ ${esc(d.status)}</div>
        </section>

        <section class="analysis-card analysis-confidence-card compact">
          <span class="analysis-label">Confidence</span>
          <div class="analysis-value big">${esc(d.confidence)}</div>
          <div class="analysis-note">Strong evidence pattern detected.</div>
        </section>

        <section class="analysis-card analysis-issue-card">
          <span class="analysis-label">Issue Detected</span>
          <div class="analysis-value">${esc(d.issue)}</div>
        </section>

        <section class="analysis-card analysis-repair-card">
          <span class="analysis-label">Recommended Repair</span>
          <div class="analysis-value">${esc(d.repair)}</div>
        </section>

        <section class="analysis-card analysis-impact-card wide">
          <span class="analysis-label">Expected Impact</span>
          <div class="analysis-value">${esc(d.impact)}</div>
        </section>
      </div>
    </div>
  `;
}


function showClaudeConsultResult(feedback, mock = false, onClose = null) {
  claudeTerminalCloseCallback = typeof onClose === 'function' ? onClose : null;
  const label = mock ? 'MOCK ANALYSIS COMPLETE' : 'ANALYSIS COMPLETE';
  const terminalText = `${label}\n\n${terminalizeClaudeText(feedback)}`;

  setClaudeTerminalTextMode(true);

  setClaudeTerminalState(
    'responding',
    mock ? 'MOCK CLAUDE TERMINAL' : 'CLAUDE TERMINAL',
    esc(terminalText)
  );

  const output = document.getElementById('claudeTerminalOutput');

  if (output) {
    output.classList.add('claude-analysis-layout');
    output.innerHTML = buildClaudeAnalysisHTML(terminalText, mock);
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
      <button id="claudeTTSBtn" class="claude-tts-btn" type="button" onclick="event.stopPropagation();toggleClaudeTTS()">🔊 Read Analysis</button>
      <button class="vn-return-btn terminal-return" type="button" onclick="event.stopPropagation();closeClaudeConsultOverlay()">Continue</button>
    `;
    setTimeout(() => vnText.querySelector('.vn-return-btn')?.focus(), 100);
    pcScheduleAnalysisLayoutV255();
  }

  const hint = document.getElementById('vnAdvanceHint');
  if (hint) hint.classList.remove('show');
}


// NOTE: Terminal diagnosis copy is still inline. Candidate for dialogue.js or scenario-data.js.
function showClaudeFinalResponseInTerminal(responseText, mock = false, onClose = null, scoreTotal = null) {
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
  // v156: Keep the Claude analyzing screen visible long enough to inspect.
  // Change this from DevTools before opening Claude when a longer pause is useful:
  //   PC_CLAUDE_PROCESSING_HOLD_MS = 60000
  // The default is 30 seconds.
  if (!Number.isFinite(Number(window.PC_CLAUDE_PROCESSING_HOLD_MS))) {
    window.PC_CLAUDE_PROCESSING_HOLD_MS = 30000;
  }
  const claudeProcessingHoldMs = Math.max(
    0,
    Number(window.PC_CLAUDE_PROCESSING_HOLD_MS) || 30000
  );

  setTimeout(() => {
    const terminalOutput = scenarioIndex === 0 && typeof scoreTotal === 'number'
      ? buildS1TerminalDiagnosis(scoreTotal, responseText)
      : responseText;
    showClaudeConsultResult(terminalOutput, mock, effectiveClose);
  }, claudeProcessingHoldMs);
}

// NOTE: Pixel score-reflection dialogue is still inline. Candidate for dialogue.js pass 2.
function closeClaudeConsultOverlay() {
  const cb = claudeTerminalCloseCallback;
  claudeTerminalCloseCallback = null;
  const overlay = document.getElementById('vnOverlay');
  pcClearAnalysisLayoutV122();
  if (overlay) overlay.classList.remove('active', 'claude-consult', 'claude-terminal-consult', 'claude-terminal-textmode', 'claude-prediction');
  document.getElementById('vnCharacter')?.classList.remove('visible', 'is-active', 'is-inactive');
  document.getElementById('vnStudentCharacter')?.classList.remove('visible', 'is-active', 'is-inactive');
  overlay?.classList.remove('pc-dual-character');
  setClaudeShelfState('idle', 'idle');
  setClaudeTerminalTextMode(false);
  setClaudeTerminalState('idle', 'CLAUDE TERMINAL', 'IDLE');
  musicEndVN();
  if (cb) {
    setTimeout(cb, 250);
  } else {
    document.getElementById('promptInput')?.focus();
  }
  function stopClaudeTTS() {
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
    }
    const btn = document.getElementById('claudeTTSBtn');
    if (btn) btn.textContent = '🔊 Read Analysis';
  }
}

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
      const overlay = document.getElementById('vnOverlay');
      overlay.classList.remove('active', 'claude-consult', 'claude-terminal-consult');
      document.getElementById('vnCharacter').classList.remove('visible', 'is-active', 'is-inactive');
      document.getElementById('vnStudentCharacter')?.classList.remove('visible', 'is-active', 'is-inactive');
      const pixelCharacter = document.getElementById('vnCharacter');
      const studentCharacter = document.getElementById('vnStudentCharacter');
      if (pixelCharacter) pixelCharacter.style.removeProperty('display');
      if (studentCharacter) studentCharacter.style.removeProperty('display');
      overlay.classList.remove('pc-dual-character');
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

  const overlay = document.getElementById('vnOverlay');
  overlay.classList.add('active');

  // Reset Claude modes, then configure the active VN speaker. Dual-cast scenes keep
  // the secondary character opposite Pixel on wide screens and show one on small screens.
  setVNClaudeMode(false);
  setVNClaudeTerminalMode(false);
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
  } else {
    pixel?.classList.add('visible', 'is-active');
    pixel?.classList.remove('is-inactive');
    student?.classList.remove('visible', 'is-active', 'is-inactive');
  }

  pcApplyDualCastResponsive();
  if (isJordan) vnSetStudentExpression(expression);
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

function vnAdvance() {
  const overlay = document.getElementById('vnOverlay');

  // HARD STOP: during Claude terminal/thinking screens, clicks on the black
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
  // not advance the scene. Only the actual "Continue to Claude" button should
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
