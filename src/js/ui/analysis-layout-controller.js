/* PromptCraft completed-analysis responsive controller.
   Selects the shared completed-report layout family, clears stale geometry,
   and schedules responsive alignment after report content changes. */

const PC_ANALYSIS_LAYOUT_CLASSES = [
  'pc-analysis-report-active',
  'pc-analysis-panel',
  'pc-analysis-computer'
];

let pcAnalysisLayoutMode = null;
let pcAnalysisLayoutFrame = 0;
let pcAnalysisLayoutSettleTimer = 0;
let pcAnalysisLayoutFontTimer = 0;
let pcAnalysisLayoutGeneration = 0;

function pcAnalysisViewportWidth() {
  const values = [
    window.innerWidth,
    document.documentElement ? document.documentElement.clientWidth : null,
    window.visualViewport ? window.visualViewport.width : null
  ].filter((value) => Number.isFinite(value) && value > 0);

  return values.length ? Math.min(...values) : 9999;
}

// [COMPLETED ANALYSIS: BREAKPOINT OWNER]
function pcGetAnalysisLayout() {
  const width = pcAnalysisViewportWidth();
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

function pcClearLegacyAnalysisInlineStyles() {
  pcRemoveAnalysisDeskExtension();
  const overlay = document.getElementById('vnOverlay');
  const terminal = document.getElementById('babbageTerminalScene');
  const photo = terminal ? terminal.querySelector('.babbage-terminal-photo') : null;
  const screen = terminal ? terminal.querySelector('.babbage-terminal-screen') : null;
  const dialogue = overlay ? overlay.querySelector('.vn-dialogue') : null;
  const scene = overlay ? overlay.querySelector('.vn-scene') : null;
  const sceneBg = document.getElementById('vnSceneBg');
  const menuButton = document.querySelector('.vn-brand-menu');
  const appHeader = document.querySelector('.pc-app-header');
  const compactNav = document.querySelector('.pc-compact-nav');
  const devBar = document.querySelector('.dev-bar');

  pcClearWideAnalysisReportContentStyles();

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

function pcIsAnalysisReportActive() {
  const overlay = document.getElementById('vnOverlay');
  const output = document.getElementById('babbageTerminalOutput');

  return Boolean(
    overlay &&
    overlay.classList.contains('active') &&
    overlay.classList.contains('babbage-terminal-textmode') &&
    output &&
    output.classList.contains('babbage-analysis-layout')
  );
}

// v267: Removed the unused legacy medium terminal-analysis controller.
function pcApplyAnalysisLayout() {
  const overlay = document.getElementById('vnOverlay');
  const terminal = document.getElementById('babbageTerminalScene');
  const output = document.getElementById('babbageTerminalOutput');
  const menuButton = overlay?.querySelector('.vn-brand-menu');
  const appHeader = document.querySelector('.pc-app-header');
  const compactNav = document.querySelector('.pc-compact-nav');
  const devBar = document.querySelector('.dev-bar');
  const targets = [overlay, terminal, output].filter(Boolean);
  const isActive = pcIsAnalysisReportActive();

  if (!isActive) {
    if (pcAnalysisLayoutMode !== null) {
      targets.forEach((element) => element.classList.remove(...PC_ANALYSIS_LAYOUT_CLASSES));
      pcClearLegacyAnalysisInlineStyles();
      pcRemoveInlineStyles(menuButton, ['display', 'visibility', 'pointer-events', 'opacity']);
      pcAnalysisLayoutMode = null;
    }
    return false;
  }

  const layout = pcGetAnalysisLayout();
  const modeChanged = layout !== pcAnalysisLayoutMode;
  [appHeader, compactNav, devBar].forEach((element) => pcSetImportantStyles(element, [
    ['display', 'none'],
    ['visibility', 'hidden'],
    ['pointer-events', 'none']
  ]));

  if (modeChanged) {
    // Clear once at the breakpoint transition, then assign the new mode in the
    // same task. Repeated resize events inside one mode no longer strip the
    // current geometry and expose an intermediate blank/oversized frame.
    pcClearLegacyAnalysisInlineStyles();
    targets.forEach((element) => {
      element.classList.remove(...PC_ANALYSIS_LAYOUT_CLASSES);
      element.classList.add('pc-analysis-report-active');
      element.classList.add(layout === 'panel'
        ? 'pc-analysis-panel'
        : 'pc-analysis-computer');
    });
    pcAnalysisLayoutMode = layout;
  } else {
    targets.forEach((element) => {
      element.classList.add('pc-analysis-report-active');
      element.classList.toggle('pc-analysis-panel', layout === 'panel');
      element.classList.toggle('pc-analysis-computer', layout === 'computer');
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
    const panelScreen = terminal?.querySelector('.babbage-terminal-screen');
    if (panelScreen) pcFitWideAnalysisReport(panelScreen);
    return true;
  }

  const photo = terminal?.querySelector('.babbage-terminal-photo');
  const screen = terminal?.querySelector('.babbage-terminal-screen');
  pcApplyWideAnalysisReportComputer(terminal, photo, screen, pcViewportHeight());
  return true;
}

function pcScheduleAnalysisLayout({ immediate = false } = {}) {
  const generation = ++pcAnalysisLayoutGeneration;

  if (pcAnalysisLayoutFrame) {
    cancelAnimationFrame(pcAnalysisLayoutFrame);
    pcAnalysisLayoutFrame = 0;
  }
  if (pcAnalysisLayoutSettleTimer) {
    clearTimeout(pcAnalysisLayoutSettleTimer);
    pcAnalysisLayoutSettleTimer = 0;
  }
  if (pcAnalysisLayoutFontTimer) {
    clearTimeout(pcAnalysisLayoutFontTimer);
    pcAnalysisLayoutFontTimer = 0;
  }

  const apply = () => {
    if (generation !== pcAnalysisLayoutGeneration) return;
    pcApplyAnalysisLayout();
  };

  if (immediate) apply();
  pcAnalysisLayoutFrame = requestAnimationFrame(() => {
    pcAnalysisLayoutFrame = 0;
    apply();
  });
  pcAnalysisLayoutSettleTimer = window.setTimeout(() => {
    pcAnalysisLayoutSettleTimer = 0;
    apply();
  }, 120);
  // V492: web fonts and generated analysis copy can settle after the first
  // measurement. Re-run once after that window so content-sized cards are
  // measured from their final typography instead of overlapping a later row.
  pcAnalysisLayoutFontTimer = window.setTimeout(() => {
    pcAnalysisLayoutFontTimer = 0;
    apply();
  }, 480);
}

function pcClearAnalysisLayout() {
  pcStopBabbageAnalysisProgress();
  pcAnalysisLayoutGeneration += 1;
  if (pcAnalysisLayoutFrame) cancelAnimationFrame(pcAnalysisLayoutFrame);
  if (pcAnalysisLayoutSettleTimer) clearTimeout(pcAnalysisLayoutSettleTimer);
  if (pcAnalysisLayoutFontTimer) clearTimeout(pcAnalysisLayoutFontTimer);
  pcAnalysisLayoutFrame = 0;
  pcAnalysisLayoutSettleTimer = 0;
  pcAnalysisLayoutFontTimer = 0;
  pcAnalysisLayoutMode = null;

  const overlay = document.getElementById('vnOverlay');
  const terminal = document.getElementById('babbageTerminalScene');
  const output = document.getElementById('babbageTerminalOutput');
  const menuButton = overlay?.querySelector('.vn-brand-menu');

  [overlay, terminal, output].filter(Boolean).forEach((element) => {
    element.classList.remove(...PC_ANALYSIS_LAYOUT_CLASSES);
  });

  pcRemoveInlineStyles(menuButton, ['display', 'visibility', 'pointer-events']);
  pcClearLegacyAnalysisInlineStyles();
}

if (!window.pcAnalysisLayoutInstalled) {
  window.pcAnalysisLayoutInstalled = true;
  window.addEventListener('resize', pcScheduleAnalysisLayout, { passive: true });
  window.addEventListener('orientationchange', pcScheduleAnalysisLayout, { passive: true });
  window.visualViewport?.addEventListener('resize', pcScheduleAnalysisLayout, { passive: true });
}
