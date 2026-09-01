/* PromptCraft completed-analysis workstation layout.
   Owns diagnostic report fitting, desk extension, wide workstation composition,
   and terminal alignment for completed Babbage reports. */

// v321: The completed desktop diagnostic now uses the same measured monitor glass
// as the approved prediction/live-analysis workstation. The full 2:1 computer
// render stays intact so the monitor can scale up without re-cropping the tower
// or shifting the report outside the physical screen.
// v461: Completed reports use the exact same measured CRT glass as prediction
// and live analysis. Geometry ownership lives in workstation-layout.js.
const PC_WIDE_ANALYSIS_REPORT_SCREEN_GEOMETRY = PC_WORKSTATION_MONITOR_GLASS_GEOMETRY;

function pcClearWideAnalysisActions() {
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

function pcCenterWideAnalysisActions() {
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

function pcClearWideAnalysisReportContentStyles() {
  const output = document.getElementById('babbageTerminalOutput');
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
  report?.classList.remove('analysis-report-overflow-safe');

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

  pcClearWideAnalysisActions();
}

// [COMPLETED ANALYSIS: CONTENT AUTO-FIT]
function pcFitWideAnalysisReport(screen) {
  if (!screen) return false;

  const output = screen.querySelector('#babbageTerminalOutput.babbage-analysis-layout');
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
  const viewportWidth = pcGetViewportWidth();
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
  const declaredAnalysisCharacters = Number.parseInt(report.dataset.analysisCharacters || '0', 10) || 0;
  const hasDenseAnalysisContent = declaredAnalysisCharacters >= 820 ||
    report.classList.contains('analysis-report-dense') ||
    report.classList.contains('analysis-report-very-dense');
  const hasVeryDenseAnalysisContent = declaredAnalysisCharacters >= 1100 ||
    report.classList.contains('analysis-report-very-dense');
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
    badge: clampNumber(8, 10.9 * fitFactor, 12.4),
    title: clampNumber(20, 34 * fitFactor, 37.5),
    summary: clampNumber(10.8, 16.3 * fitFactor, 18.2),
    label: clampNumber(8.4, 12 * fitFactor, 12.9),
    value: clampNumber(10.9, 16 * fitFactor, 18.3),
    big: clampNumber(12, 18 * fitFactor, 20.4),
    note: isWideDesktopMonitor
      ? clampNumber(10.8, 14.5 * fitFactor, 16)
      : clampNumber(8.7, 12.4 * fitFactor, 13.8),
    outputPadding: isWideDesktopMonitor
      ? clampNumber(0, 0.9 * fitFactor, 1.5)
      : clampNumber(2, 4.5 * fitFactor, 6),
    reportPadding: isWideDesktopMonitor
      ? clampNumber(1, 2.7 * fitFactor, 4.25)
      : clampNumber(3.5, 6 * fitFactor, 8),
    gap: isWideDesktopMonitor
      ? clampNumber(2, 4 * fitFactor, 5.4)
      : clampNumber(4, 6.5 * fitFactor, 9),
    cardPadding: isWideDesktopMonitor
      ? clampNumber(3, 5.1 * fitFactor, 6.5)
      : clampNumber(5, 8 * fitFactor, 10),
    headerGap: isWideDesktopMonitor
      ? clampNumber(1.25, 2.7 * fitFactor, 4)
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
    // v428: Diagnostic copy is variable-length. Rows must be content-sized from
    // the first paint; fractional rows can be shorter than their cards and make
    // lower findings appear to collide before overflow-safe scrolling engages.
    ['grid-template-rows', useSingleColumn
      ? 'auto auto auto auto auto auto'
      : 'auto auto auto auto'],
    ['grid-template-areas', useSingleColumn
      ? '"status" "confidence" "issue" "repair" "impact" "worked"'
      : '"status confidence" "issue repair" "impact impact" "worked worked"'],
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
    badge: 8.5,
    title: 22,
    summary: 13.2,
    label: 9.5,
    value: 14,
    big: 15,
    note: 13.2
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
      ['height', 'auto'],
      ['align-self', 'stretch'],
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

  // v423: Variable-length Babbage output must never be squeezed into fixed
  // fractional grid rows. Dense S1 and S2 reports keep the same two-column
  // visual structure, but their rows become content-sized and the physical
  // monitor glass owns vertical scrolling. This preserves readable type and
  // prevents long prompt/report text from painting into neighboring cards.
  const enableOverflowSafeWideReport = (scale = 0.96) => {
    applyScale(scale);
    report.classList.add('analysis-report-scrollable', 'analysis-report-overflow-safe');
    pcSetImportantStyles(output, [
      ['display', 'block'],
      ['overflow-y', 'auto'],
      ['overflow-x', 'hidden'],
      ['overscroll-behavior-y', 'contain'],
      ['touch-action', 'pan-y'],
      ['scrollbar-gutter', 'stable'],
      ['scroll-padding-bottom', '18px'],
      ['box-sizing', 'border-box']
    ]);
    pcSetImportantStyles(report, [
      ['display', 'flex'],
      ['flex-direction', 'column'],
      ['height', 'auto'],
      ['min-height', '100%'],
      ['overflow', 'visible'],
      ['box-sizing', 'border-box']
    ]);
    // Very dense desktop reports are usually only a few pixels taller than the
    // physical monitor. Recover that space from decorative padding before we
    // ask the user to scroll; text stays at the established readable floor.
    if (isWideDesktopMonitor && hasVeryDenseAnalysisContent) {
      pcSetImportantStyles(report, [['padding', '1px 2px 2px']]);
      pcSetImportantStyles(header, [['gap', '2px']]);
      pcSetImportantStyles(grid, [['gap', '2px']]);
      cards.forEach((card) => pcSetImportantStyles(card, [['padding', '2px 4px']]));
    }
    pcSetImportantStyles(grid, [
      ['display', 'grid'],
      ['grid-template-columns', useSingleColumn ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) minmax(0, 1fr)'],
      ['grid-template-rows', useSingleColumn ? 'auto auto auto auto auto auto' : 'auto auto auto auto'],
      ['grid-template-areas', useSingleColumn
        ? '"status" "confidence" "issue" "repair" "impact" "worked"'
        : '"status confidence" "issue repair" "impact impact" "worked worked"'],
      ['grid-auto-rows', 'max-content'],
      ['row-gap', `${Math.max(8, Math.round((base.gap * scale) + 3))}px`],
      ['column-gap', `${Math.max(4, Math.round(base.gap * scale))}px`],
      ['height', 'auto'],
      ['min-height', '0'],
      ['align-items', 'start'],
      ['align-content', 'start'],
      ['overflow', 'visible'],
      ['flex', '0 0 auto']
    ]);
    cards.forEach((card) => pcSetImportantStyles(card, [
      ['height', 'auto'],
      ['min-height', '0'],
      ['align-self', 'stretch'],
      ['overflow', 'visible'],
      ['overflow-wrap', 'anywhere'],
      ['word-break', 'normal']
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
    output.scrollTop = 0;
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
      ['min-height', '0'],
      ['align-self', 'start'],
      ['overflow', 'visible'],
      ['overflow-wrap', 'anywhere']
    ]));
    output.scrollTop = 0;
    return true;
  }

  // Dense desktop reports go directly to the overflow-safe content-sized grid.
  // Waiting until the fixed-row layout fails can leave one paint frame where
  // long text overlaps a neighboring box, especially after web fonts settle.
  // v436: Short wide workstation displays (including Nest Hub Max) should also
  // prefer the overflow-safe grid on the first completed-analysis paint. That
  // keeps the two-column structure, allows the monitor glass to scroll when a
  // card runs long, and eliminates the transient box-collision state reported
  // on the 1280x800 profile while preserving readable text.
  const prefersOverflowSafeWideReport = isWideDesktopMonitor && (
    hasDenseAnalysisContent ||
    (viewportWidth <= 1366 && viewportHeight <= 900)
  );
  if (prefersOverflowSafeWideReport) {
    const preferredScale = hasVeryDenseAnalysisContent
      ? 0.86
      : hasDenseAnalysisContent
        ? 0.96
        : viewportWidth <= 1100
          ? 1.02
          : 1;
    enableOverflowSafeWideReport(preferredScale);
    return true;
  }

  const minScale = 0.72;
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
    enableOverflowSafeWideReport(Math.max(0.92, scale));
  } else {
    report.classList.remove('analysis-report-scrollable', 'analysis-report-overflow-safe');
  }

  return true;
}


// v338: Extend the wooden desktop beneath contained completed-analysis workstations.
// The source workstation artwork ends above the fixed action buttons on tall tablet
// layouts, which exposed the dark classroom/floor strip. Continue the desk surface
// through that lower region while keeping the buttons layered in front.
function pcRemoveAnalysisDeskExtension() {
  document.getElementById('pcAnalysisDeskExtension')?.remove();
}

function pcApplyAnalysisDeskExtension(scene, frame, viewportHeight) {
  if (!scene || !frame?.isContainedWorkstation) {
    pcRemoveAnalysisDeskExtension();
    return false;
  }

  let extension = document.getElementById('pcAnalysisDeskExtension');
  if (!extension) {
    extension = document.createElement('div');
    extension.id = 'pcAnalysisDeskExtension';
    extension.setAttribute('aria-hidden', 'true');
    scene.appendChild(extension);
  }

  const rawTop = Number.parseFloat(frame.top);
  if (!Number.isFinite(rawTop)) {
    pcRemoveAnalysisDeskExtension();
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
function pcApplyWideAnalysisReportComputer(terminal, photo, screen, viewportHeight) {
  if (!terminal || !photo || !screen) return false;

  const overlay = document.getElementById('vnOverlay');
  const scene = document.getElementById('vnScene');
  const sceneBg = document.getElementById('vnSceneBg');
  const viewportWidth = pcGetViewportWidth();
  const safeViewportHeight = Number.isFinite(viewportHeight) && viewportHeight > 0
    ? viewportHeight
    : pcViewportHeight();

  const frame = pcGetComputerFrameLikeCompleted(viewportWidth, safeViewportHeight);
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

  pcApplyAnalysisDeskExtension(scene, frame, safeViewportHeight);

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
    ['box-sizing', 'border-box'],
    ['transform', 'none'],
    ['overflow', 'hidden'],
    ['padding', '0'],
    ['transition', 'none']
  ]);

  pcFitWideAnalysisReport(screen);
  pcCenterWideAnalysisActions();
  return true;
}
// v186: Align the physical monitor only when the computer artwork is visible.
// Medium and mobile completed-analysis layouts are terminal-only, so all
// desktop inline geometry is removed and responsive CSS owns those screens.
function pcAlignModernTerminalScreen() {
  const activeOverlay = document.getElementById('vnOverlay');
  const activeTerminal = document.getElementById('babbageTerminalScene');
  const liveAnalysis = Boolean(
    activeOverlay?.classList.contains('active') &&
    activeOverlay.classList.contains('babbage-terminal-consult') &&
    !activeOverlay.classList.contains('babbage-terminal-textmode') &&
    activeTerminal?.classList.contains('thinking')
  );
  if (liveAnalysis) {
    pcScheduleLiveAnalyzingLayout({ immediate: true });
    return;
  }

  if (typeof pcIsAnalysisReportActive === 'function' && pcIsAnalysisReportActive()) {
    pcScheduleAnalysisLayout();
    return;
  }

  const overlay = document.getElementById('vnOverlay');
  const terminal = document.getElementById('babbageTerminalScene');
  const photo = terminal?.querySelector('.babbage-terminal-photo');
  const screen = terminal?.querySelector('.babbage-terminal-screen');
  const output = document.getElementById('babbageTerminalOutput');

  if (!overlay || !terminal || !photo || !screen) return;

  const predictionOpen = overlay.classList.contains('babbage-prediction') ||
    overlay.classList.contains('pc-clean-prediction');
  const consultThinking = overlay.classList.contains('babbage-terminal-consult') &&
    !overlay.classList.contains('babbage-terminal-textmode');
  const analysisOpen = overlay.classList.contains('babbage-terminal-textmode') &&
    output?.classList.contains('babbage-analysis-layout');
  const viewportWidth = pcGetViewportWidth();
  const viewportHeight = pcViewportHeight();
  const isIpadConsultThinking = consultThinking &&
    viewportWidth >= 768 && viewportWidth <= 1180 && viewportHeight >= 900;

  if (!predictionOpen && !consultThinking && !analysisOpen) return;

  // v203: Compact live-analysis modes own their screen geometry. Do not let
  // the legacy monitor-alignment pass overwrite the full mobile stage or put
  // the iPad readout back above the photographed monitor.
  if (consultThinking && viewportWidth <= 760) {
    pcApplyLiveAnalyzingLayout();
    return;
  }
  if (isIpadConsultThinking) {
    pcApplyTabletAnalyzingComputer(terminal, photo);
    positionBabbageAnalyzingReadout();
    return;
  }

  // v186: Prediction layouts below the full desktop breakpoint are owned by
  // one CSS section. Clear every layout style left by earlier screen states and
  // return before JavaScript can impose desktop geometry.
  if (predictionOpen && viewportWidth <= 1510) {
    pcPredictionTerminalFrame = null;
    pcClearPredictionLayoutInlineStyles();
    return;
  }

  // v207: Full-width prediction is JavaScript-owned because delayed functions
  // and inline cleanup were restoring the oversized CSS frame after the correct
  // geometry had rendered. Apply the approved workstation and monitor bounds in
  // one pass, then capture that exact box for Babbage's analyzing transition.
  if (predictionOpen) {
    pcClearPredictionLayoutInlineStyles();
    pcApplyWidePredictionComputerFrame(terminal, photo, screen, viewportHeight);
    requestAnimationFrame(() => {
      pcApplyWidePredictionComputerFrame(terminal, photo, screen, viewportHeight);
      pcCapturePredictionTerminalFrameGeometry(terminal);
    });
    return;
  }

  // v210: Wide live analysis is owned directly instead of trusting a captured
  // rectangle that can be cleared by later observer passes. Tablet layouts keep
  // the captured/CSS behavior, while full-screen analysis reuses the approved
  // prediction workstation scale.
  if (consultThinking) {
    if (viewportWidth > 1510) {
      pcApplyWidePredictionComputerFrame(terminal, photo, screen, viewportHeight);
    } else {
      pcApplyPredictionTerminalFrame(terminal, photo);
    }
  }

  // Completed reports below the wide breakpoint intentionally abandon the
  // computer artwork. Clear every inline desktop value so CSS can render the
  // terminal-only and stacked mobile layouts at full width.
  if (analysisOpen && viewportWidth <= 1510) {
    pcClearLegacyAnalysisInlineStyles();
    return;
  }

  // v215: The wide completed report has a single JavaScript owner. This
  // prevents pcApplyAnalysisLayout and the legacy alignment queue from
  // alternating between a reduced workstation and the old full-width image.
  if (analysisOpen) {
    pcApplyWideAnalysisReportComputer(terminal, photo, screen, viewportHeight);
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
    ['left', PC_WIDE_PREDICTION_SCREEN_GEOMETRY.left],
    ['right', 'auto'],
    ['top', PC_WIDE_PREDICTION_SCREEN_GEOMETRY.top],
    ['bottom', 'auto'],
    ['width', PC_WIDE_PREDICTION_SCREEN_GEOMETRY.width],
    ['height', PC_WIDE_PREDICTION_SCREEN_GEOMETRY.height],
    ['box-sizing', 'border-box'],
    ['transform', 'none'],
    ['overflow', 'hidden']
  ]);
}

// Expose a stable debugging hook in DevTools.
window.pcAlignModernTerminalScreen = pcAlignModernTerminalScreen;

function pcQueueModernTerminalAlignment() {
  requestAnimationFrame(pcAlignModernTerminalScreen);
  window.setTimeout(pcAlignModernTerminalScreen, 40);
  window.setTimeout(pcAlignModernTerminalScreen, 180);
}

if (!window.pcModernTerminalAlignmentInstalled) {
  window.pcModernTerminalAlignmentInstalled = true;
  pcSubscribeViewport('modern-terminal-alignment', () => pcAlignModernTerminalScreen());
}
