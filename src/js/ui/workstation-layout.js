/* PromptCraft shared viewport and workstation geometry.
   Owns viewport families, VN state reset helpers, prediction workstation capture,
   and wide workstation framing shared by prediction and analysis states. */

//  RESPONSIVE LAYOUT CONTROL
//  Search anchors inside this section:
//    [LAYOUT METRICS]            viewport measurements
//    [WORKSTATION FRAME]         shared computer size and monitor geometry
//    [LIVE ANALYSIS]             Babbage analyzing readout
//    [COMPLETED ANALYSIS]        responsive diagnostic report
//    [PREDICTION DIALOGUE]       prediction choices and feedback spacing
//
//  Keep layout geometry here. Do not add competing CSS patches for these
//  JavaScript-owned computer states. That was how the workstation acquired
//  several contradictory opinions about its own dimensions.
// ══════════════════════════════════════════════════════

// [WORKSTATION FRAME]
// v159: Capture the prediction computer relative to the VN scene, not the
// browser viewport. The terminal is absolutely positioned inside #vnScene, so
// viewport coordinates caused the analyzing computer to shift even when the
// stored rectangle itself was accurate.
let pcPredictionTerminalFrame = null;

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
  'babbage-prediction',
  'pc-clean-prediction',
  'pc-prediction-question',
  'pc-prediction-result',
  'babbage-terminal-consult',
  'babbage-terminal-textmode',
  'babbage-analysis',
  'babbage-consult',
  'pc-clean-output',
  'pc-clean-final',
  'analysis-complete',
  'scenario-intro-active',
  'pc-s1-dialogue-choice'
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
  const characters = [
    document.getElementById('vnCharacter'),
    document.getElementById('vnStudentCharacter')
  ];
  const portraits = [
    document.getElementById('vnPortrait'),
    document.getElementById('vnStudentPortrait')
  ];
  const characterProps = [
    'display','visibility','opacity','filter','position','left','right','top','bottom',
    'width','height','min-width','max-width','min-height','max-height','align-items',
    'justify-content','transform','transform-origin','z-index'
  ];
  const portraitProps = [
    'display','visibility','opacity','filter','width','height','min-width','max-width',
    'min-height','max-height','object-fit','object-position','transform','transform-origin','z-index'
  ];

  characters.forEach(character => {
    if (!character) return;

    // Hide the slot before releasing dual-cast geometry. Otherwise a portrait
    // can remain visible for its opacity transition after pc-dual-character is
    // removed, briefly falling back to intrinsic image dimensions between the
    // VN introduction and the scenario workbench. The next cast render clears
    // these inline properties through pcClearVNSlotInlineStyles().
    character.style.setProperty('display', 'none', 'important');
    character.style.setProperty('visibility', 'hidden', 'important');
    character.style.setProperty('opacity', '0', 'important');
    character.classList.remove('visible', 'is-active', 'is-inactive');

    characterProps.forEach(property => {
      if (!['display', 'visibility', 'opacity'].includes(property)) {
        character.style.removeProperty(property);
      }
    });
    delete character.dataset.pcCharacter;
    delete character.dataset.pcCastSide;
  });
  portraits.forEach(portrait => {
    if (portrait?._pcExpressionTimer) {
      clearTimeout(portrait._pcExpressionTimer);
      portrait._pcExpressionTimer = null;
    }
    if (portrait?._pcEntranceTimer) {
      clearTimeout(portrait._pcEntranceTimer);
      portrait._pcEntranceTimer = null;
    }
    portraitProps.forEach(property => portrait?.style.removeProperty(property));
    if (portrait) {
      portrait.classList.remove('pc-vn-enter-slide-left');
      delete portrait.dataset.pcCharacter;
    }
  });
  overlay?.classList.remove('pc-dual-character', 'pc-s2-two-character', 'pc-s2-narrow-jordan');
  window.pcCurrentVNCast = [];
  window.pcCurrentVNSpeaker = '';
}

function pcResetVNDialogueState() {
  const dialogue = document.getElementById('vnDialogue');
  if (!dialogue) return;
  dialogue.classList.remove('has-choices', 'prediction-question', 'prediction-result', 'pc-s1-diagnosis-dialogue');
  delete dialogue.dataset.pcExplicitAction;
  dialogue.setAttribute('role', 'button');
  dialogue.setAttribute('tabindex', '0');
  const speaker = document.getElementById('vnSpeaker')?.textContent?.trim() || 'Professor Pixel';
  dialogue.setAttribute('aria-label', `${speaker} is speaking. Press Space or Enter to continue.`);
}

function pcApplyIpadLayout(metrics = pcGetViewportMetrics()){
  if (typeof pcIsAnalysisReportActive === 'function' && pcIsAnalysisReportActive()) return;

  const viewportWidth = metrics.maxDocumentWidth;
  const viewportHeight = metrics.maxDocumentHeight;
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
    'babbage-prediction',
    'pc-clean-prediction',
    'pc-prediction-question',
    'babbage-terminal-consult',
    'babbage-terminal-textmode',
    'babbage-analysis',
    'babbage-consult',
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
    scenarioIndex === SCENARIO_INDEX.CONTENT_AVALANCHE &&
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
    if (window.pcIpadBoardCenterFrame) {
      cancelAnimationFrame(window.pcIpadBoardCenterFrame);
      window.pcIpadBoardCenterFrame = null;
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

let pcResponsiveChromeFrame = 0;
function pcScheduleResponsiveChrome() {
  if (pcResponsiveChromeFrame) cancelAnimationFrame(pcResponsiveChromeFrame);
  pcResponsiveChromeFrame = requestAnimationFrame(() => {
    pcResponsiveChromeFrame = 0;
    const metrics = pcGetViewportMetrics();
    pcApplyViewportFamily(metrics);
    pcApplyIpadLayout(metrics);
  });
}

if (!window.pcIpadLayoutInstalled) {
  window.pcIpadLayoutInstalled = true;
  pcSubscribeViewport('responsive-chrome', metrics => pcApplyIpadLayout(metrics));
  document.addEventListener('DOMContentLoaded', () => {
    pcScheduleResponsiveChrome();
    const overlay = document.getElementById('vnOverlay');
    if (overlay && !window.pcIpadOverlayObserver) {
      window.pcIpadOverlayObserver = new MutationObserver(pcScheduleResponsiveChrome);
      window.pcIpadOverlayObserver.observe(overlay, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }, { once: true });
}

function pcCapturePredictionTerminalFrameGeometry(terminal) {
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

  pcPredictionTerminalFrame = {
    leftPct: ((terminalRect.left - sceneRect.left) / sceneRect.width) * 100,
    topPct: ((terminalRect.top - sceneRect.top) / sceneRect.height) * 100,
    widthPct: (terminalRect.width / sceneRect.width) * 100,
    heightPct: (terminalRect.height / sceneRect.height) * 100
  };

  return true;
}

function pcApplyPredictionTerminalFrame(terminal, photo) {
  const scene = document.getElementById('vnScene');
  const frame = pcPredictionTerminalFrame;
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
    // the monitor coordinates remain identical when Babbage begins analyzing.
    ['background-size', '100% 100%'],
    ['background-position', 'center center'],
    ['background-repeat', 'no-repeat']
  ]);

  return true;
}

// Expose the captured frame for inspection without mutating it.
window.pcGetPredictionTerminalFrame = () => (
  pcPredictionTerminalFrame ? { ...pcPredictionTerminalFrame } : null
);
window.pcCapturePredictionTerminalFrame = () => {
  const terminal = document.getElementById('babbageTerminalScene');
  const captured = pcCapturePredictionTerminalFrameGeometry(terminal);
  return captured ? { ...pcPredictionTerminalFrame } : null;
};

// v186: Remove prediction-only geometry that earlier builds wrote inline.
// This deliberately does not touch class names or terminal content.
function pcClearPredictionLayoutInlineStyles() {
  const terminal = document.getElementById('babbageTerminalScene');
  const photo = terminal?.querySelector('.babbage-terminal-photo');
  const screen = terminal?.querySelector('.babbage-terminal-screen');
  const output = document.getElementById('babbageTerminalOutput');

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
window.pcClearPredictionLayoutInlineStyles = pcClearPredictionLayoutInlineStyles;

// v207: One authoritative owner for the photographed prediction computer on
// full-width screens. Earlier CSS and delayed layout passes disagreed about the
// outer frame and sometimes cleared the measured monitor geometry, leaving a
// large workstation with a small floating terminal panel. Keep this helper in
// JavaScript because prediction is rebuilt dynamically and later passes can
// otherwise win the cascade with stale inline values.
// v461: One measured monitor-glass rectangle for every photographed Babbage
// workstation state. The app-background source artwork places the usable CRT
// glass at x=22.2%..62.5%. Keeping prediction, live analysis, and completed
// analysis on this single geometry prevents the green layer from drifting onto
// the bezel when responsive workstation frames scale or crop differently.
const PC_WORKSTATION_MONITOR_GLASS_GEOMETRY = Object.freeze({
  left: '22.2%',
  top: '12.85%',
  width: '40.3%',
  height: '45.45%'
});

const PC_WIDE_PREDICTION_SCREEN_GEOMETRY = PC_WORKSTATION_MONITOR_GLASS_GEOMETRY;

// [WORKSTATION FRAME: DESKTOP PREDICTION + LIVE ANALYSIS]
function pcApplyWidePredictionComputerFrame(terminal, photo, screen, viewportHeight) {
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

  return true;
}

window.pcApplyWidePredictionComputer = () => {
  const terminal = document.getElementById('babbageTerminalScene');
  const photo = terminal?.querySelector('.babbage-terminal-photo');
  const screen = terminal?.querySelector('.babbage-terminal-screen');
  const viewportHeight = pcViewportHeight();
  return pcApplyWidePredictionComputerFrame(terminal, photo, screen, viewportHeight);
};
