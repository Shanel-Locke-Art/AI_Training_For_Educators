/* PromptCraft live Babbage analysis presentation.
   Owns the analyzing readout, responsive live workstation modes, and the
   request-lifecycle progress model shown while Babbage is processing. */

// v161: Position the live analyzing readout inside the already-aligned
// monitor rectangle. These percentages are relative to the physical green
// screen, not to the full computer artwork.
function pcResetAnalyzingReadout(){
  const screen = document.querySelector('#babbageTerminalScene .babbage-terminal-screen');
  const output = document.getElementById('babbageTerminalOutput');
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
function positionBabbageAnalyzingReadout() {
  const terminal = document.getElementById('babbageTerminalScene');
  const outputEl = document.getElementById('babbageTerminalOutput');
  const screen = terminal?.querySelector('.babbage-terminal-screen');
  const readout = outputEl?.querySelector('.pc-analyzing-readout');
  const panel = outputEl?.querySelector('.pc-analyzing-panel');
  const titleLine = outputEl?.querySelector('.pc-terminal-title-line');
  const dividers = outputEl?.querySelectorAll('.pc-terminal-divider') || [];
  const progress = outputEl?.querySelector('.pc-analyzing-progress');
  const cursors = outputEl?.querySelectorAll('.babbage-terminal-cursor') || [];
  if (!terminal || !outputEl || !screen || !readout || !panel) return false;

  const viewportWidth = pcAnalysisViewportWidth();
  const mode = pcGetLiveAnalysisMode(viewportWidth);
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
    ['animation', 'babbageCursorBlink 0.82s steps(1,end) infinite']
  ]));

  return true;
}
window.pcPositionBabbageAnalyzingReadout = positionBabbageAnalyzingReadout;

window.pcPositionBabbageAnalyzingReadout = positionBabbageAnalyzingReadout;


function pcClearMobileAnalyzingStage(){
  const overlay = document.getElementById('vnOverlay');
  const scene = document.getElementById('vnScene');
  const sceneBg = document.getElementById('vnSceneBg');
  const dialogue = document.getElementById('vnDialogue');
  const speaker = document.getElementById('vnSpeaker');
  const text = document.getElementById('vnText');
  const terminal = document.getElementById('babbageTerminalScene');
  const photo = terminal?.querySelector('.babbage-terminal-photo');
  const screen = terminal?.querySelector('.babbage-terminal-screen');

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
  pcResetAnalyzingReadout();
  window.pcMobileAnalyzingStageActive = false;
}

// [LIVE ANALYSIS RESPONSIVE OWNER — V256]
// One function owns the complete live-analyzing composition. It has exactly
// three modes and no uncovered width range:
//   phone   <= 700px
//   tablet  701–1180px
//   desktop > 1180px
// This replaces the former mixture of iPad-only, >1510px-only, CSS fallback,
// and delayed passes that briefly exposed different workstation sizes.
const PC_LIVE_ANALYSIS_CLASSES = [
  'pc-live-analysis-phone',
  'pc-live-analysis-tablet',
  'pc-live-analysis-desktop'
];
let pcLiveAnalysisFrame = 0;
let pcLiveAnalysisTimer = 0;
let pcLiveAnalysisMode = null;

function pcGetLiveAnalysisMode(viewportWidth) {
  if (viewportWidth <= 700) return 'phone';
  if (viewportWidth <= 1180) return 'tablet';
  return 'desktop';
}

function pcGetComputerFrameLikeCompleted(viewportWidth, viewportHeight) {
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

function pcApplyLiveComputerFrame({
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
  // v327: whenever a photographed computer is visible, the analyzing state now
  // uses the exact workstation frame calculation as the completed diagnostic.
  // Only the monitor contents and bottom controls/dialogue differ between states.
  const frame = pcGetComputerFrameLikeCompleted(viewportWidth, pcViewportHeight());
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
  pcApplyAnalysisDeskExtension(scene, frame, pcViewportHeight());

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
    ['left', PC_WIDE_ANALYSIS_REPORT_SCREEN_GEOMETRY.left],
    ['right', 'auto'],
    ['top', PC_WIDE_ANALYSIS_REPORT_SCREEN_GEOMETRY.top],
    ['bottom', 'auto'],
    ['width', PC_WIDE_ANALYSIS_REPORT_SCREEN_GEOMETRY.width],
    ['height', PC_WIDE_ANALYSIS_REPORT_SCREEN_GEOMETRY.height],
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
function pcApplyLivePhoneStage({ overlay, scene, dialogue, terminal, photo, screen }) {
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

function pcClearLiveAnalyzingLayout() {
  const overlay = document.getElementById('vnOverlay');
  overlay?.classList.remove(...PC_LIVE_ANALYSIS_CLASSES);
  pcLiveAnalysisMode = null;
  pcClearMobileAnalyzingStage();
}

function pcApplyLiveAnalyzingLayout() {
  const overlay = document.getElementById('vnOverlay');
  const scene = document.getElementById('vnScene');
  const dialogue = document.getElementById('vnDialogue');
  const terminal = document.getElementById('babbageTerminalScene');
  const photo = terminal?.querySelector('.babbage-terminal-photo');
  const screen = terminal?.querySelector('.babbage-terminal-screen');
  const output = document.getElementById('babbageTerminalOutput');
  if (!overlay || !scene || !terminal || !photo || !screen || !output) return false;
  if (typeof pcIsAnalysisReportActive === 'function' && pcIsAnalysisReportActive()) return false;

  const isConsultThinking = overlay.classList.contains('active') &&
    overlay.classList.contains('babbage-terminal-consult') &&
    !overlay.classList.contains('babbage-terminal-textmode') &&
    terminal.classList.contains('thinking');
  const isPredictionOpen = overlay.classList.contains('active') &&
    (overlay.classList.contains('babbage-prediction') ||
      overlay.classList.contains('pc-clean-prediction') ||
      overlay.classList.contains('pc-prediction-question'));

  if (isPredictionOpen) return false;
  if (!isConsultThinking) {
    pcClearLiveAnalyzingLayout();
    return false;
  }

  const viewportWidth = pcAnalysisViewportWidth();
  const mode = pcGetLiveAnalysisMode(viewportWidth);
  if (mode !== pcLiveAnalysisMode) {
    overlay.classList.remove(...PC_LIVE_ANALYSIS_CLASSES);
    overlay.classList.add(`pc-live-analysis-${mode}`);
    pcLiveAnalysisMode = mode;
  }

  // Start from one clean geometry set before applying the current mode.
  pcClearMobileAnalyzingStage();
  overlay.classList.add(`pc-live-analysis-${mode}`);
  pcLiveAnalysisMode = mode;

  if (mode === 'phone') {
    window.pcMobileAnalyzingStageActive = true;
    pcApplyLivePhoneStage({ overlay, scene, dialogue, terminal, photo, screen });
  } else {
    window.pcMobileAnalyzingStageActive = false;
    pcApplyLiveComputerFrame({
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

  positionBabbageAnalyzingReadout();
  return true;
}

function pcScheduleLiveAnalyzingLayout({ immediate = false } = {}) {
  if (pcLiveAnalysisFrame) cancelAnimationFrame(pcLiveAnalysisFrame);
  if (pcLiveAnalysisTimer) clearTimeout(pcLiveAnalysisTimer);
  pcLiveAnalysisFrame = 0;
  pcLiveAnalysisTimer = 0;

  const apply = () => pcApplyLiveAnalyzingLayout();
  if (immediate) apply();
  pcLiveAnalysisFrame = requestAnimationFrame(() => {
    pcLiveAnalysisFrame = 0;
    apply();
  });
  pcLiveAnalysisTimer = window.setTimeout(() => {
    pcLiveAnalysisTimer = 0;
    apply();
  }, 100);
}

if (!window.pcLiveAnalyzingLayoutInstalled) {
  window.pcLiveAnalyzingLayoutInstalled = true;
  window.addEventListener('resize', pcScheduleLiveAnalyzingLayout, { passive: true });
  window.addEventListener('orientationchange', pcScheduleLiveAnalyzingLayout, { passive: true });
  window.visualViewport?.addEventListener('resize', pcScheduleLiveAnalyzingLayout, { passive: true });
  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('vnOverlay');
    const terminal = document.getElementById('babbageTerminalScene');
    const observer = new MutationObserver(() => pcScheduleLiveAnalyzingLayout());
    if (overlay) observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
    if (terminal) observer.observe(terminal, { attributes: true, attributeFilter: ['class'] });
  }, { once: true });
}

window.pcApplyLiveAnalyzingLayout = pcApplyLiveAnalyzingLayout;

function renderBabbageAnalyzingReadout(partLabel = 'Scenario diagnosis') {
  const outputEl = document.getElementById('babbageTerminalOutput');
  if (!outputEl) return;

  const sectionLabel = terminalizeBabbageText(partLabel || 'Scenario diagnosis').toUpperCase() || 'SCENARIO DIAGNOSIS';
  outputEl.classList.remove('babbage-analysis-layout');
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
          <div class="pc-terminal-value pc-analyzing-status">ANALYZING<span class="babbage-terminal-cursor" aria-hidden="true"></span></div>
          <div class="pc-analyzing-progress" role="progressbar" aria-label="Babbage analysis progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <span class="pc-analyzing-progress-fill" aria-hidden="true"></span>
          </div>
          <div class="pc-analyzing-phase" aria-live="polite">PREPARING REQUEST</div>
        </div>
      </div>
    </div>
  `;

  positionBabbageAnalyzingReadout();
  requestAnimationFrame(positionBabbageAnalyzingReadout);
  window.setTimeout(positionBabbageAnalyzingReadout, 60);
  window.setTimeout(positionBabbageAnalyzingReadout, 220);
  pcScheduleLiveAnalyzingLayout({ immediate: true });
}

const PC_BABBAGE_PROCESSING_HOLD_DEFAULT_MS = 350;
let pcBabbageAnalysisProgressTimer = 0;
let pcBabbageAnalysisProgressFrame = 0;
let pcBabbageAnalysisProgressValue = 0;
let pcBabbageAnalysisProgressStartedAt = 0;

/*
  V360 progress model:
  The current non-streaming model request does not expose a true percentage
  complete. PromptCraft therefore reports real lifecycle stages and uses a
  conservative elapsed-time estimate only while the network request is
  outstanding. It never reaches 100% until an actual response has arrived and
  the diagnostic is ready to render.
*/
function pcGetBabbageProcessingHoldMs() {
  const configured = Number(window.PC_BABBAGE_PROCESSING_HOLD_MS);
  if (!Number.isFinite(configured)) {
    window.PC_BABBAGE_PROCESSING_HOLD_MS = PC_BABBAGE_PROCESSING_HOLD_DEFAULT_MS;
    return PC_BABBAGE_PROCESSING_HOLD_DEFAULT_MS;
  }
  return Math.max(0, configured);
}

function pcGetBabbageProgressElements() {
  const progress = document.querySelector('#babbageTerminalOutput .pc-analyzing-progress');
  return {
    progress,
    fill: progress?.querySelector('.pc-analyzing-progress-fill') || null,
    phase: document.querySelector('#babbageTerminalOutput .pc-analyzing-phase'),
    status: document.querySelector('#babbageTerminalOutput .pc-analyzing-status')
  };
}

function pcSetBabbageAnalysisProgress(value, phaseLabel = '', { complete = false } = {}) {
  const { progress, fill, phase, status } = pcGetBabbageProgressElements();
  if (!progress || !fill) return false;

  const safeValue = complete
    ? 100
    : Math.max(pcBabbageAnalysisProgressValue, Math.min(98, Number(value) || 0));

  pcBabbageAnalysisProgressValue = safeValue;
  progress.classList.toggle('is-complete', complete);
  progress.classList.remove('is-running');
  progress.setAttribute('aria-valuenow', String(Math.round(safeValue)));
  fill.style.setProperty('width', `${safeValue}%`, 'important');

  if (phase && phaseLabel) phase.textContent = terminalizeBabbageText(phaseLabel).toUpperCase();
  if (status) {
    status.firstChild.textContent = complete ? 'ANALYSIS READY' : 'ANALYZING';
  }
  return true;
}

function pcStopBabbageAnalysisProgress() {
  if (pcBabbageAnalysisProgressTimer) {
    window.clearInterval(pcBabbageAnalysisProgressTimer);
    pcBabbageAnalysisProgressTimer = 0;
  }
  if (pcBabbageAnalysisProgressFrame) {
    window.cancelAnimationFrame(pcBabbageAnalysisProgressFrame);
    pcBabbageAnalysisProgressFrame = 0;
  }
}

function pcStartBabbageAnalysisProgress(timeoutMs = 60000) {
  pcStopBabbageAnalysisProgress();
  pcBabbageAnalysisProgressStartedAt = performance.now();
  pcBabbageAnalysisProgressValue = 0;

  if (!pcSetBabbageAnalysisProgress(6, 'Preparing request')) return false;

  // The request has left the browser. These milestones describe things we can
  // actually know. Between them the bar advances slowly as an elapsed-time
  // estimate, capped at 84% so "almost done" never becomes a lie.
  window.setTimeout(() => pcSetBabbageAnalysisProgress(12, 'Sending course context'), 120);
  window.setTimeout(() => pcSetBabbageAnalysisProgress(18, 'Waiting for Babbage'), 500);

  const safeTimeout = Math.max(10000, Number(timeoutMs) || 60000);
  pcBabbageAnalysisProgressTimer = window.setInterval(() => {
    const elapsed = performance.now() - pcBabbageAnalysisProgressStartedAt;
    const ratio = Math.min(1, elapsed / safeTimeout);

    // Ease toward 84%. Typical 30–40 s responses land around 60–75% rather
    // than displaying a fake 100% several seconds before Babbage returns.
    const estimated = 18 + (66 * (1 - Math.exp(-2.2 * ratio)));
    const next = Math.min(84, estimated);

    let phaseLabel = 'Waiting for Babbage';
    if (elapsed >= 30000) phaseLabel = 'Babbage is still reasoning';
    else if (elapsed >= 12000) phaseLabel = 'Babbage is evaluating the design';

    pcSetBabbageAnalysisProgress(next, phaseLabel);
  }, 500);

  return true;
}

function pcMarkBabbageResponseReceived() {
  pcStopBabbageAnalysisProgress();
  return pcSetBabbageAnalysisProgress(90, 'Response received');
}

function pcMarkBabbageResponseParsed() {
  return pcSetBabbageAnalysisProgress(96, 'Building diagnostic');
}

function pcCompleteBabbageAnalysisProgress() {
  pcStopBabbageAnalysisProgress();
  return pcSetBabbageAnalysisProgress(100, 'Analysis complete', { complete: true });
}

function pcFailBabbageAnalysisProgress() {
  pcStopBabbageAnalysisProgress();
  return pcSetBabbageAnalysisProgress(
    Math.max(24, pcBabbageAnalysisProgressValue),
    'Live analysis unavailable — loading fallback'
  );
}

// Compatibility names retained because older scenario shells call these globals.
window.pcStartBabbageAnalysisProgress = pcStartBabbageAnalysisProgress;
window.pcSetBabbageAnalysisProgress = pcSetBabbageAnalysisProgress;
window.pcMarkBabbageResponseReceived = pcMarkBabbageResponseReceived;
window.pcMarkBabbageResponseParsed = pcMarkBabbageResponseParsed;
window.pcCompleteBabbageAnalysisProgress = pcCompleteBabbageAnalysisProgress;
window.pcFailBabbageAnalysisProgress = pcFailBabbageAnalysisProgress;

