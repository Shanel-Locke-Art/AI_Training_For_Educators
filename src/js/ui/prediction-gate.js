// ══════════════════════════════════════════════════════
//  SHARED PREDICTION GATE
//  Prediction, workstation result handoff, and Babbage submission transition.
// ══════════════════════════════════════════════════════

const PC_PREDICTION_LABELS = {
  targeted: 'It will give a targeted response.',
  generic: 'It might still be generic.',
  ignores_constraints: 'It may ignore some constraints.',
  not_sure: 'I am not sure yet.'
};

const PC_PREDICTION_REACTIONS = {
  targeted: 'Good prediction. Now we will see whether Babbage actually had enough context to stay specific.',
  generic: 'That is a reasonable suspicion. Generic input often produces generic output, because apparently machines also enjoy vague assignments.',
  ignores_constraints: 'Exactly the kind of risk worth watching for. Constraints only help when the model actually uses them.',
  not_sure: 'Fair. The whole point is to build that prediction muscle before trusting the output.'
};

function pcStopVN(){
  try { vnQueue = []; } catch(e) {}
  try { clearTimeout(vnTypeTimer); } catch(e) {}
  try { vnTyping = false; vnOnComplete = null; vnFullText = ''; vnCurrentText = ''; } catch(e) {}
}

function pcClearPredictionUI(){
  document.getElementById('predictionGate')?.remove();
  document.getElementById('vnPredictionChoicePanel')?.remove();
  document.querySelectorAll('.vn-choice-list,.vn-prediction-options,.pc-clean-choice-grid,.pc-choice-panel-final').forEach(el => el.remove());
}

function pcPredictionIsOpen(){
  const overlay = document.getElementById('vnOverlay');
  const text = (document.getElementById('vnText')?.textContent || '').toLowerCase();
  return !!(overlay && overlay.classList.contains('active') &&
    (overlay.classList.contains('babbage-prediction') || overlay.classList.contains('pc-clean-prediction') || text.includes('what do you predict babbage will do')));
}

// v191: Authoritative prediction presentation. The responsive prediction
// layout is rebuilt dynamically, so the JavaScript that creates it also owns
// the final grid width, spacing, portrait offset, and hidden expression badge.
function pcPredictionViewportWidth(metrics = pcGetViewportMetrics()){
  return Math.round(metrics.preferredWidth);
}

function pcPredictionViewportHeight(metrics = pcGetViewportMetrics()){
  return Math.round(metrics.preferredHeight);
}

function pcClearPredictionPresentation(){
  const overlay = document.getElementById('vnOverlay');
  const output = document.getElementById('babbageTerminalOutput');
  const speaker = document.getElementById('vnSpeaker');
  const vnText = document.getElementById('vnText');
  const feedbackCopy = document.querySelector('#vnText .pc-feedback-copy');
  const feedbackMessage = document.querySelector('#vnText .pc-feedback-message');
  const feedbackHeading = document.querySelector('#vnText .pc-feedback-heading');
  const dialogue = document.getElementById('vnDialogue');
  const character = document.getElementById('vnCharacter');
  const panel = document.getElementById('vnPredictionChoicePanel');
  const choiceButtons = panel?.querySelectorAll('.pc-clean-choice-btn') || [];
  const continueButton = document.querySelector('#vnText .prediction-continue-btn');

  pcRemoveInlineStyles(output, [
    'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align',
    'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
    'margin', 'padding', 'transform'
  ]);
  pcRemoveInlineStyles(speaker, [
    'margin-left', 'margin-top', 'font-size', 'line-height', 'margin-bottom',
    'grid-column', 'grid-row', 'align-self'
  ]);
  pcRemoveInlineStyles(vnText, ['grid-column', 'grid-row', 'align-self']);
  pcRemoveInlineStyles(feedbackCopy, [
    'display', 'width', 'min-width', 'max-width',
    'margin-left', 'margin-right', 'padding-left', 'padding-right',
    'box-sizing', 'align-self', 'font-size', 'line-height'
  ]);
  pcRemoveInlineStyles(feedbackMessage, [
    'display', 'width', 'min-width', 'max-width',
    'margin-left', 'margin-right', 'padding-left', 'padding-right',
    'box-sizing', 'align-self', 'font-size', 'line-height'
  ]);
  pcRemoveInlineStyles(feedbackHeading, [
    'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'font-size', 'line-height'
  ]);
  choiceButtons.forEach((button) => pcRemoveInlineStyles(button, [
    'font-size', 'line-height', 'padding-top', 'padding-right',
    'padding-bottom', 'padding-left', 'min-height'
  ]));
  pcRemoveInlineStyles(continueButton, [
    'font-size', 'line-height', 'padding-top', 'padding-right',
    'padding-bottom', 'padding-left', 'min-height',
    'position', 'top', 'right', 'bottom', 'left', 'transform',
    'margin-top', 'margin-right', 'margin-bottom', 'margin-left'
  ]);
  pcRemoveInlineStyles(dialogue, [
    'display', 'grid-template-columns', 'grid-template-rows', 'column-gap',
    'row-gap', 'align-items', 'height', 'min-height', 'max-height',
    'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'box-sizing', 'overflow'
  ]);
  pcRemoveInlineStyles(character, ['left', 'right', 'height', 'max-height', 'transform']);
  pcRemoveInlineStyles(panel, [
    'position', 'inset', 'left', 'right', 'top', 'bottom',
    'translate', 'transform', 'width', 'max-width',
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'justify-self', 'align-self', 'justify-content', 'place-self',
    'grid-column', 'grid-row'
  ]);
  overlay?.style.removeProperty('--pc-prediction-dialogue-height');
  window.pcPredictionQuestionStatusCenterRatio = null;

}

function pcPredictionOuterHeight(element){
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  const styles = window.getComputedStyle(element);
  const marginTop = Number.parseFloat(styles.marginTop) || 0;
  const marginBottom = Number.parseFloat(styles.marginBottom) || 0;
  return rect.height + marginTop + marginBottom;
}

function pcFitPredictionDialogue(viewportWidth){
  if (viewportWidth > 1510) return;

  const overlay = document.getElementById('vnOverlay');
  const dialogue = document.getElementById('vnDialogue');
  const speaker = document.getElementById('vnSpeaker');
  const vnText = document.getElementById('vnText');
  const panel = document.getElementById('vnPredictionChoicePanel');
  if (!overlay || !dialogue || !speaker || !vnText) return;

  // Measure the CSS-owned baseline on every pass so rotating or resizing can
  // shrink the dialogue again instead of preserving a stale inline height.
  overlay.style.removeProperty('--pc-prediction-dialogue-height');
  pcRemoveInlineStyles(dialogue, ['height', 'min-height', 'max-height']);

  const dialogueStyles = window.getComputedStyle(dialogue);
  const viewportHeight = pcPredictionViewportHeight();
  const isLargePortraitPrediction = Boolean(
    viewportWidth >= 861 &&
    viewportWidth <= 1100 &&
    viewportHeight >= 1100
  );
  // Phone prediction panels are measured from their real content. Large
  // portrait tablets need a taller baseline so the enlarged copy and answer
  // buttons remain comfortable instead of being compressed into a phone-sized
  // dialogue band.
  const baselineHeight = viewportWidth <= 700
    ? 250
    : isLargePortraitPrediction
      ? 330
      : 270;
  const paddingTop = Number.parseFloat(dialogueStyles.paddingTop) || 0;
  const paddingBottom = Number.parseFloat(dialogueStyles.paddingBottom) || 0;
  const requiredHeight = Math.ceil(
    paddingTop +
    paddingBottom +
    pcPredictionOuterHeight(speaker) +
    pcPredictionOuterHeight(vnText) +
    (panel ? pcPredictionOuterHeight(panel) : 0) +
    2
  );

  const extraDesktopResultBottomSpace =
    overlay?.classList.contains('pc-prediction-result') && viewportWidth > 1510 ? 40 : 0;
  const compactMobileHeightRatio = viewportWidth <= 340 ? 0.62 : 0.50;
  const maximumHeight = Math.max(
    baselineHeight,
    Math.floor(viewportHeight * (viewportWidth <= 700
      ? compactMobileHeightRatio
      : (overlay?.classList.contains('pc-prediction-result') ? 0.45 : 0.40)))
  );
  const targetHeight = Math.min(
    Math.max(Math.ceil(baselineHeight), requiredHeight + extraDesktopResultBottomSpace),
    maximumHeight
  );

  overlay.style.setProperty(
    '--pc-prediction-dialogue-height',
    `${targetHeight}px`,
    'important'
  );
  pcSetImportantStyles(dialogue, [
    ['height', `${targetHeight}px`],
    ['min-height', `${targetHeight}px`],
    ['max-height', `${targetHeight}px`]
  ]);
}

// [PREDICTION DIALOGUE: RESPONSIVE PRESENTATION]
function pcApplyPredictionPresentation(metrics = pcGetViewportMetrics()){
  if (!pcPredictionIsOpen()) return false;

  const viewportWidth = pcPredictionViewportWidth(metrics);
  const overlay = document.getElementById('vnOverlay');
  const isPredictionResult = !!overlay?.classList.contains('pc-prediction-result');
  const output = document.getElementById('babbageTerminalOutput');
  const speaker = document.getElementById('vnSpeaker');
  const feedbackCopy = document.querySelector('#vnText .pc-feedback-copy');
  const feedbackMessage = document.querySelector('#vnText .pc-feedback-message');
  const feedbackHeading = document.querySelector('#vnText .pc-feedback-heading');
  const dialogue = document.getElementById('vnDialogue');
  const character = document.getElementById('vnCharacter');
  const panel = document.getElementById('vnPredictionChoicePanel');
  const choiceButtons = panel?.querySelectorAll('.pc-clean-choice-btn') || [];
  const continueButton = document.querySelector('#vnText .prediction-continue-btn');
  const terminal = document.getElementById('babbageTerminalScene');
  const terminalPhoto = terminal?.querySelector('.babbage-terminal-photo');
  const terminalScreen = terminal?.querySelector('.babbage-terminal-screen');
  const viewportHeight = pcPredictionViewportHeight(metrics);
  const isPhonePrediction = viewportWidth <= 700;
  const isCompactPrediction = viewportWidth > 700 && viewportWidth <= 1510;
  const isLargePortraitPrediction = Boolean(
    viewportWidth >= 861 &&
    viewportWidth <= 1100 &&
    viewportHeight >= 1100
  );

  // v306: CSS owns every phone, tablet, foldable, and compact-desktop
  // prediction composition through 1510px. This presentation pass runs again
  // after the first paint, so applying the old inline workstation geometry here
  // caused the visible snap back to the previous smaller layout. Only true wide
  // desktop screens keep the JavaScript-owned workstation frame.
  if (isPhonePrediction || isCompactPrediction) {
    pcClearPredictionLayoutInlineStyles();
  } else {
    pcApplyWidePredictionComputerFrame(
      terminal,
      terminalPhoto,
      terminalScreen,
      viewportHeight
    );

  }

  // The status must remain readable across phones and tablet/iPad widths.
  // Wide desktop keeps the approved workstation typography unchanged.
  if (output && viewportWidth <= 700) {
    // v243: Use one fixed mobile position for both the question and logged-result
    // beats. Recalculating against a changed containing block made the same
    // AWAITING PREDICTION label jump upward after a choice was recorded.
    const mobileStatusTop = 'clamp(190px, 27dvh, 245px)';

    pcSetImportantStyles(output, [
      ['position', 'absolute'],
      ['inset', 'auto'],
      ['left', '0'],
      ['right', '0'],
      ['top', mobileStatusTop],
      ['bottom', 'auto'],
      ['width', '100%'],
      ['height', 'auto'],
      ['margin', '0'],
      ['padding', '0'],
      ['transform', 'translateY(-50%)'],
      ['font-size', 'clamp(1.12rem, 4.7vw, 1.38rem)'],
      ['font-weight', '900'],
      ['line-height', '1.12'],
      ['letter-spacing', '.04em'],
      ['text-align', 'center']
    ]);

  } else if (output && isCompactPrediction) {
    pcRemoveInlineStyles(output, [
      'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
      'margin', 'padding', 'transform'
    ]);
    pcSetImportantStyles(output, [
      ['font-size', isLargePortraitPrediction ? '18px' : '14px'],
      ['font-weight', '900'],
      ['line-height', '1.08'],
      ['letter-spacing', '.02em'],
      ['text-align', 'center'],
      ['white-space', 'nowrap'],
      ['transform', 'translateX(clamp(14px, 2vw, 26px))']
    ]);
  } else if (output) {
    pcRemoveInlineStyles(output, [
      'position', 'inset', 'left', 'right', 'top', 'bottom', 'width', 'height',
      'margin', 'padding', 'transform'
    ]);
    pcSetImportantStyles(output, [
      ['font-size', 'clamp(1.5rem, 1.45vw, 1.9rem)'],
      ['font-weight', '900'],
      ['line-height', '1.05'],
      ['letter-spacing', '.045em'],
      ['text-align', 'center'],
      ['white-space', 'nowrap'],
      ['transform', 'translateX(clamp(14px, 2vw, 26px))']
    ]);
  }

  // The shared workstation helper above owns CRT geometry for every non-phone
  // prediction size. Only the screen's internal alignment needs reasserting.
  if (terminalScreen && !isPhonePrediction) {
    pcSetImportantStyles(terminalScreen, [
      ['padding', 'clamp(12px, 1.4vw, 20px)'],
      ['box-sizing', 'border-box'],
      ['display', 'flex'],
      ['align-items', 'center'],
      ['justify-content', 'center'],
      ['overflow', 'hidden'],
      ['background', 'transparent'],
      ['background-image', 'none'],
      ['border', '0'],
      ['border-radius', '0'],
      ['box-shadow', 'none']
    ]);
  }

  // v201: Use the approved intro-scene alignment and typography on iPad.
  // Phones keep their existing scale, while desktop remains untouched.
  if (speaker) {
    pcRemoveInlineStyles(speaker, ['margin-left', 'margin-top']);
    if (viewportWidth <= 700) {
      // v231: Keep the name and question together as one compact reading
      // block. The previous 16px gap contributed to the oversized black band.
      pcSetImportantStyles(speaker, [
        ['font-size', '1.15rem'],
        ['line-height', '1.15'],
        ['margin-bottom', '8px'],
        ['flex-shrink', '0']
      ]);
    } else {
      pcSetImportantStyles(speaker, [
        ['font-size', isLargePortraitPrediction ? '28px' : '22px'],
        ['line-height', isLargePortraitPrediction ? '1.12' : '1.18'],
        ['margin-bottom', isLargePortraitPrediction ? '12px' : '10px']
      ]);
    }
  }

  if (speaker && viewportWidth <= 1510) {
    pcSetImportantStyles(speaker, [['flex-shrink', '0']]);
  } else if (speaker) {
    pcRemoveInlineStyles(speaker, ['flex-shrink']);
  }

  // v317: Treat the feedback copy and its nested message as one responsive
  // reading region. Styling only the nested message left the outer wrapper at
  // its legacy 50vw cap, which forced early line breaks and an oversized phone
  // dialogue panel after a prediction was logged.
  const feedbackTextTargets = [feedbackCopy, feedbackMessage].filter(Boolean);
  if (viewportWidth <= 1510) {
    const compactTextStyles = [
      ['flex-shrink', '0'],
      ['min-height', '0']
    ];
    compactTextStyles.push(
      ['width', '100%'],
      ['max-width', 'none'],
      ['box-sizing', 'border-box'],
      ['font-size', isPhonePrediction ? '1rem' : isLargePortraitPrediction ? '22px' : '18px'],
      ['line-height', isPhonePrediction ? '1.45' : isLargePortraitPrediction ? '1.44' : '1.5']
    );
    pcSetImportantStyles(vnText, compactTextStyles);
  } else {
    pcRemoveInlineStyles(vnText, [
      'flex-shrink', 'min-height', 'width', 'max-width', 'box-sizing'
    ]);
  }

  if (feedbackTextTargets.length && viewportWidth <= 700) {
    feedbackTextTargets.forEach((feedbackTextTarget) => pcSetImportantStyles(feedbackTextTarget, [
      // Match the question copy to Professor Pixel's left edge and use the
      // dialogue's full available width before measuring its height.
      ['display', 'block'],
      ['width', '100%'],
      ['min-width', '0'],
      ['max-width', 'none'],
      ['margin-left', '0'],
      ['margin-right', '0'],
      ['padding-left', '0'],
      ['padding-right', '0'],
      ['box-sizing', 'border-box'],
      ['align-self', 'stretch'],
      ['font-size', '1rem'],
      ['line-height', '1.45']
    ]));
    if (feedbackHeading) {
      pcSetImportantStyles(feedbackHeading, [
        ['margin-top', '0'],
        ['margin-right', '0'],
        ['margin-bottom', '8px'],
        ['margin-left', '0'],
        ['line-height', '1.18']
      ]);
    }
  } else if (feedbackTextTargets.length && isCompactPrediction) {
    feedbackTextTargets.forEach((feedbackTextTarget) => pcSetImportantStyles(feedbackTextTarget, [
      ['display', 'block'],
      ['width', '100%'],
      ['min-width', '0'],
      ['max-width', 'none'],
      ['margin-left', '0'],
      ['margin-right', '0'],
      ['padding-left', '0'],
      ['padding-right', '0'],
      ['box-sizing', 'border-box'],
      ['align-self', 'stretch'],
      ['font-size', isLargePortraitPrediction ? '22px' : '18px'],
      ['line-height', isLargePortraitPrediction ? '1.44' : '1.5']
    ]));
  } else {
    pcRemoveInlineStyles(feedbackCopy, [
      'display', 'width', 'min-width', 'max-width',
      'margin-left', 'margin-right', 'padding-left', 'padding-right',
      'box-sizing', 'align-self', 'font-size', 'line-height'
    ]);
    pcRemoveInlineStyles(feedbackMessage, [
      'display', 'width', 'min-width', 'max-width',
      'margin-left', 'margin-right', 'padding-left', 'padding-right',
      'box-sizing', 'align-self', 'font-size', 'line-height'
    ]);
    pcRemoveInlineStyles(feedbackHeading, [
      'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
      'font-size', 'line-height'
    ]);
  }

  if (isCompactPrediction) {
    choiceButtons.forEach((button) => pcSetImportantStyles(button, [
      ['font-size', isLargePortraitPrediction ? '18px' : '16px'],
      ['line-height', '1.22'],
      ['padding-top', isLargePortraitPrediction ? '14px' : '12px'],
      ['padding-right', isLargePortraitPrediction ? '20px' : '18px'],
      ['padding-bottom', isLargePortraitPrediction ? '14px' : '12px'],
      ['padding-left', isLargePortraitPrediction ? '20px' : '18px'],
      ['min-height', isLargePortraitPrediction ? '56px' : '50px']
    ]));
    pcSetImportantStyles(continueButton, [
      ['font-size', isLargePortraitPrediction ? '18px' : '16px'],
      ['line-height', '1.2'],
      ['padding-top', isLargePortraitPrediction ? '14px' : '12px'],
      ['padding-right', isLargePortraitPrediction ? '22px' : '20px'],
      ['padding-bottom', isLargePortraitPrediction ? '14px' : '12px'],
      ['padding-left', isLargePortraitPrediction ? '22px' : '20px'],
      ['min-height', isLargePortraitPrediction ? '56px' : '50px']
    ]);
  } else if (viewportWidth <= 700) {
    choiceButtons.forEach((button) => pcSetImportantStyles(button, [
      ['position', 'relative'],
      ['width', '100%'],
      ['min-width', '0'],
      ['min-height', '46px'],
      ['margin', '0'],
      ['padding-top', '11px'],
      ['padding-right', '12px'],
      ['padding-bottom', '11px'],
      ['padding-left', '12px'],
      ['box-sizing', 'border-box'],
      ['font-size', 'clamp(.72rem, 2.8vw, .84rem)'],
      ['line-height', '1.2'],
      ['white-space', 'normal']
    ]));
    pcSetImportantStyles(continueButton, [
      ['font-size', 'clamp(.76rem, 2.9vw, .86rem)'],
      ['line-height', '1.2'],
      ['padding-top', '11px'],
      ['padding-right', '16px'],
      ['padding-bottom', '11px'],
      ['padding-left', '16px'],
      ['min-height', '46px']
    ]);
  } else {
    choiceButtons.forEach((button) => pcRemoveInlineStyles(button, [
      'position', 'width', 'min-width', 'font-size', 'line-height',
      'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
      'min-height', 'margin', 'box-sizing', 'white-space'
    ]));
    pcRemoveInlineStyles(continueButton, [
      'font-size', 'line-height', 'padding-top', 'padding-right',
      'padding-bottom', 'padding-left', 'min-height'
    ]);
  }

  // v209: Keep a visible reading gap between the desktop feedback copy and
  // its action. The v207 negative top offset solved clipping by pulling the
  // button upward, but it also crowded the final line of text.
  if (continueButton && isPredictionResult && viewportWidth > 1510) {
    pcSetImportantStyles(continueButton, [
      ['position', 'relative'],
      ['top', '0'],
      ['right', 'auto'],
      ['bottom', 'auto'],
      ['left', 'auto'],
      ['transform', 'none'],
      ['margin-top', '20px'],
      ['margin-right', '0'],
      ['margin-bottom', '32px'],
      ['margin-left', '0']
    ]);
    pcSetImportantStyles(vnText, [
      ['padding-bottom', '30px'],
      ['box-sizing', 'border-box']
    ]);
  } else {
    pcRemoveInlineStyles(continueButton, [
      'position', 'top', 'right', 'bottom', 'left', 'transform',
      'margin-top', 'margin-right', 'margin-bottom', 'margin-left'
    ]);
    pcRemoveInlineStyles(vnText, ['padding-bottom', 'box-sizing']);
  }

  // Pixel's PNG contains transparent space on its left edge. Move the actual
  // portrait left without dragging the dialogue copy toward the brackets.
  if (character) {
    const characterLeft = viewportWidth <= 700
      ? '0px'
      : isLargePortraitPrediction
        ? 'clamp(34px, 4.2vw, 52px)'
        : viewportWidth <= 1510
          ? 'clamp(12px, 3vw, 42px)'
          : 'clamp(28px, 3.5vw, 70px)';
    pcSetImportantStyles(character, [
      ['left', characterLeft],
      ['right', 'auto'],
      ['transform', 'none']
    ]);

    // One fixed portrait scale for the entire intermediate range. The old
    // height-sensitive iPad branch made Pixel jump in size at nearly identical
    // widths and pushed the workstation off its expected center.
    if (isCompactPrediction) {
      pcSetImportantStyles(character, [
        ['height', isLargePortraitPrediction ? 'clamp(370px, 31vh, 430px)' : 'clamp(280px, 34vh, 350px)'],
        ['max-height', isLargePortraitPrediction ? '430px' : '350px']
      ]);
    } else {
      pcRemoveInlineStyles(character, ['height', 'max-height']);
    }
  }

  // v241: Clear stale wide-screen grid values before applying the compact
  // phone/tablet layout. In v240 this ran afterward and erased the mobile flex
  // layout it was supposed to protect, because CSS apparently wanted paperwork.
  if (viewportWidth <= 1510) {
    pcRemoveInlineStyles(dialogue, [
      'display', 'grid-template-columns', 'grid-template-rows', 'column-gap',
      'row-gap', 'align-items', 'min-height', 'height', 'max-height',
      'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
      'box-sizing', 'overflow'
    ]);
    pcRemoveInlineStyles(speaker, [
      'grid-column', 'grid-row', 'align-self'
    ]);
    pcRemoveInlineStyles(vnText, [
      'grid-column', 'grid-row', 'align-self'
    ]);
    pcRemoveInlineStyles(panel, [
      'grid-column', 'grid-row', 'justify-self', 'align-self', 'place-self'
    ]);
  }

  // The compact prediction dialogue was forming an implicit max-content grid
  // column, which kept both the copy and the answer grid stranded on the left.
  if (dialogue && viewportWidth <= 1510) {
    const compactDialogueStyles = [
      ['grid-template-columns', 'minmax(0, 1fr)'],
      ['row-gap', '0']
    ];

    compactDialogueStyles.push(
      ['display', 'flex'],
      ['flex-direction', 'column'],
      ['justify-content', 'flex-start'],
      ['align-items', 'stretch'],
      ['padding-top', viewportWidth <= 700 ? '18px' : isLargePortraitPrediction ? '28px' : '24px'],
      ['padding-right', viewportWidth <= 700 ? '22px' : isLargePortraitPrediction ? 'clamp(46px, 6vw, 72px)' : 'clamp(36px, 5vw, 64px)'],
      ['padding-bottom', viewportWidth <= 700 ? '16px' : isLargePortraitPrediction ? '28px' : '24px'],
      ['padding-left', viewportWidth <= 700 ? '22px' : isLargePortraitPrediction ? 'clamp(46px, 6vw, 72px)' : 'clamp(36px, 5vw, 64px)'],
      ['box-sizing', 'border-box'],
      ['overflow', 'visible']
    );

    pcSetImportantStyles(dialogue, compactDialogueStyles);
  } else {
    pcRemoveInlineStyles(dialogue, [
      'grid-template-columns', 'row-gap', 'display', 'flex-direction',
      'justify-content', 'padding-top', 'padding-right', 'padding-bottom',
      'padding-left', 'box-sizing', 'overflow'
    ]);
  }

  if (panel) {
    if (viewportWidth <= 1510) {
      const panelWidth = viewportWidth <= 700
        ? '100%'
        : isLargePortraitPrediction
          ? 'min(820px, calc(100% - 64px))'
          : 'min(760px, calc(100% - 48px))';
      const panelMaxWidth = viewportWidth <= 700
        ? 'none'
        : isLargePortraitPrediction
          ? '820px'
          : '760px';
      const panelGap = viewportWidth <= 480
        ? '14px'
        : viewportWidth <= 700
          ? '18px'
          : '16px';

      // v231: Explicitly put the panel in normal flow. Merely removing an
      // inline position allowed an older !important stylesheet rule to make it
      // absolute again, leaving a large empty black reservation above it.
      pcSetImportantStyles(panel, [
        ['position', 'static'],
        ['inset', 'auto'],
        ['left', 'auto'],
        ['right', 'auto'],
        ['top', 'auto'],
        ['bottom', 'auto'],
        ['translate', 'none'],
        ['transform', 'none'],
        ['width', panelWidth],
        ['max-width', panelMaxWidth],
        ['margin-top', panelGap],
        ['margin-right', 'auto'],
        ['margin-bottom', '0'],
        ['margin-left', 'auto'],
        ['padding', viewportWidth <= 700 ? '6px 4px 4px' : '0'],
        ['box-sizing', 'border-box'],
        ['display', 'grid'],
        ['grid-template-columns', viewportWidth <= 340 ? '1fr' : 'repeat(2, minmax(0, 1fr))'],
        ['grid-auto-rows', viewportWidth <= 700 ? 'minmax(46px, auto)' : 'auto'],
        ['gap', viewportWidth <= 700 ? '10px' : isLargePortraitPrediction ? '14px' : '12px'],
        ['height', 'auto'],
        ['min-height', '0'],
        ['flex-shrink', '0'],
        ['justify-self', 'center'],
        ['align-self', 'stretch'],
        ['justify-content', 'center'],
        ['place-self', 'auto']
      ]);
    } else {
      // The photographed workstation layout remains intact above 1510px. Only
      // the answer group is centered across the viewport.
      pcSetImportantStyles(panel, [
        ['position', 'fixed'],
        ['inset', 'auto'],
        ['left', '50%'],
        ['right', 'auto'],
        ['top', 'auto'],
        ['bottom', '20px'],
        ['translate', 'none'],
        ['transform', 'translateX(-50%)'],
        ['width', 'min(920px, calc(100vw - 96px))'],
        ['max-width', '920px'],
        ['margin', '0'],
        ['justify-self', 'center'],
        ['justify-content', 'center'],
        ['place-self', 'auto']
      ]);
    }
  }

  // v243: The logged-result beat no longer has an answer panel, so clear the
  // wide question grid instead of leaving the copy trapped in its 500px column.
  // A wider result message prevents needless wrapping and keeps Continue to
  // Babbage inside the visible bottom panel.
  if (viewportWidth > 1510 && isPredictionResult && dialogue && speaker && vnText) {
    pcSetImportantStyles(dialogue, [
      ['display', 'flex'],
      ['flex-direction', 'column'],
      ['justify-content', 'flex-start'],
      ['align-items', 'stretch'],
      ['grid-template-columns', 'none'],
      ['grid-template-rows', 'none'],
      ['column-gap', '0'],
      ['row-gap', '0'],
      ['min-height', '230px'],
      ['height', 'auto'],
      ['max-height', 'none'],
      ['padding-top', '28px'],
      ['padding-right', 'clamp(48px, 5vw, 96px)'],
      ['padding-bottom', '28px'],
      ['padding-left', 'clamp(56px, 4.5vw, 90px)'],
      ['box-sizing', 'border-box'],
      ['overflow', 'visible']
    ]);

    pcSetImportantStyles(speaker, [
      ['grid-column', 'auto'],
      ['grid-row', 'auto'],
      ['align-self', 'auto'],
      ['margin-bottom', '10px']
    ]);

    pcSetImportantStyles(vnText, [
      ['grid-column', 'auto'],
      ['grid-row', 'auto'],
      ['align-self', 'auto'],
      ['width', '100%'],
      ['max-width', 'min(1280px, calc(100vw - 180px))'],
      ['padding-bottom', '0'],
      ['box-sizing', 'border-box']
    ]);

    pcSetImportantStyles(feedbackCopy, [
      ['width', '100%'],
      ['max-width', 'min(1280px, calc(100vw - 180px))'],
      ['margin', '0']
    ]);

    pcSetImportantStyles(feedbackMessage, [
      ['width', '100%'],
      ['max-width', 'min(1280px, calc(100vw - 180px))']
    ]);

    pcSetImportantStyles(continueButton, [
      ['position', 'relative'],
      ['inset', 'auto'],
      ['transform', 'none'],
      ['margin-top', '18px'],
      ['margin-right', '0'],
      ['margin-bottom', '0'],
      ['margin-left', '0']
    ]);
  }

  // v239: On wide screens, keep the question and choices in separate grid
  // columns inside the same dialogue panel. The former fixed, centered choice
  // group crossed over the question whenever the sentence wrapped.
  if (viewportWidth > 1510 && dialogue && speaker && vnText && panel) {
    pcSetImportantStyles(dialogue, [
      ['display', 'grid'],
      ['grid-template-columns', 'minmax(360px, 500px) minmax(620px, 1fr)'],
      ['grid-template-rows', 'auto auto'],
      ['column-gap', 'clamp(34px, 3vw, 64px)'],
      ['row-gap', '8px'],
      ['align-items', 'start'],
      ['min-height', '250px'],
      ['height', 'auto'],
      ['max-height', 'none'],
      ['padding-top', '28px'],
      ['padding-right', 'clamp(48px, 5vw, 96px)'],
      ['padding-bottom', '28px'],
      ['padding-left', 'clamp(56px, 4.5vw, 90px)'],
      ['box-sizing', 'border-box'],
      ['overflow', 'visible']
    ]);

    pcSetImportantStyles(speaker, [
      ['grid-column', '1'],
      ['grid-row', '1'],
      ['align-self', 'end'],
      ['margin-bottom', '4px']
    ]);

    pcSetImportantStyles(vnText, [
      ['grid-column', '1'],
      ['grid-row', '2'],
      ['align-self', 'start'],
      ['max-width', '500px']
    ]);

    pcSetImportantStyles(panel, [
      ['position', 'static'],
      ['inset', 'auto'],
      ['left', 'auto'],
      ['right', 'auto'],
      ['top', 'auto'],
      ['bottom', 'auto'],
      ['translate', 'none'],
      ['transform', 'none'],
      ['grid-column', '2'],
      ['grid-row', '1 / span 2'],
      ['width', '100%'],
      ['max-width', '920px'],
      ['margin', '0'],
      ['justify-self', 'center'],
      ['align-self', 'center'],
      ['justify-content', 'center'],
      ['place-self', 'center'],
      ['grid-template-columns', 'repeat(2, minmax(240px, 1fr))'],
      ['gap', '14px']
    ]);
  }

  if (dialogue && viewportWidth <= 1510) {
    pcFitPredictionDialogue(viewportWidth);
  }

  return true;
}

function pcQueuePredictionPresentation(){
  const apply = () => pcApplyPredictionPresentation();
  apply();
  requestAnimationFrame(apply);
  window.setTimeout(apply, 80);
}


let pcSharedWorkstationResultContinue = null;

function pcShowSharedWorkstationResult({
  terminalText = 'AWAITING PREDICTION',
  speakerName = 'Professor Pixel',
  character = 'pixel',
  expression = 'thinking',
  heading = '',
  bodyHTML = '',
  button = {},
  ariaLabel = '',
  overlayClasses = []
} = {}) {
  pcClearPredictionUI();
  pcStopVN();

  const overlay = pcSetVNOverlayState({
    active: true,
    modes: ['babbage-prediction', 'pc-clean-prediction', 'pc-prediction-result']
  });
  if (!overlay) return null;
  overlayClasses.filter(Boolean).forEach(className => overlay.classList.add(className));
  overlay.removeAttribute('aria-hidden');

  const sceneBackground = document.getElementById('vnSceneBg');
  if (sceneBackground) {
    pcSetImageSource(
      sceneBackground,
      pcGetScenarioBackgroundAsset(window.scenarioIndex),
      LEGACY_ASSETS.images.backgrounds.classroom
    );
  }

  try { setVNBabbageMode(false); } catch (e) {}
  try { setVNBabbageTerminalMode(false); } catch (e) {}
  try { setBabbageTerminalTextMode(false); } catch (e) {}
  try { setBabbageShelfState('idle', String(terminalText || '').toLowerCase()); } catch (e) {}
  try { setBabbageTerminalState('idle', 'BABBAGE ENGINE', terminalText); } catch (e) {}
  try { pcClearPredictionLayoutInlineStyles(); } catch (e) {}

  // The workstation result always uses the shared primary character slot.
  // Scenario code supplies identity and expression; layout remains unchanged.
  vnSetDialogueCharacter(character, expression, speakerName, [character]);

  const dialogue = document.getElementById('vnDialogue');
  if (dialogue) {
    dialogue.classList.remove('has-choices', 'prediction-question');
    dialogue.classList.add('prediction-result');
    dialogue.dataset.pcExplicitAction = 'true';
    dialogue.setAttribute('role', 'group');
    dialogue.setAttribute('tabindex', '-1');
    dialogue.setAttribute(
      'aria-label',
      ariaLabel || `${speakerName} result. Use the Continue button to proceed.`
    );
    dialogue.style.removeProperty('display');
  }

  const buttonId = button.id ? ` id="${button.id}"` : '';
  const stopPropagation = button.stopPropagation === false ? '' : ' data-pc-stop-propagation="true"';
  const buttonLabel = button.label || 'Continue →';
  pcSharedWorkstationResultContinue = typeof button.onActivate === 'function'
    ? button.onActivate
    : null;
  const vnText = document.getElementById('vnText');
  if (vnText) {
    vnText.innerHTML = `
      <div class="pc-feedback-copy">
        <div class="pc-feedback-message">
          ${heading ? `<div class="pc-feedback-heading"><strong>${heading}</strong></div>` : ''}
          <div>${bodyHTML}</div>
        </div>
        <button${buttonId} class="prediction-continue-btn" type="button" data-pc-action="shared-workstation-result-continue"${stopPropagation}>${buttonLabel}</button>
      </div>`;
  }

  const hint = document.getElementById('vnAdvanceHint');
  if (hint) hint.classList.remove('show');
  dialogue?.querySelector('.vn-skip')?.setAttribute('hidden', '');

  // This is the same geometry/layout pass used by S1. Every scenario using a
  // workstation result gets the identical frame, monitor, dialogue, and
  // responsive behavior automatically.
  pcQueuePredictionPresentation();
  return { overlay, dialogue, vnText };
}

window.pcShowSharedWorkstationResult = pcShowSharedWorkstationResult;

let pcPredictionResizeFrame = 0;
function pcSchedulePredictionPresentation(){
  if (pcPredictionResizeFrame) cancelAnimationFrame(pcPredictionResizeFrame);
  pcPredictionResizeFrame = requestAnimationFrame(() => {
    pcPredictionResizeFrame = 0;
    pcApplyPredictionPresentation();
  });
}

if (!window.pcPredictionPresentationInstalled) {
  window.pcPredictionPresentationInstalled = true;
  pcSubscribeViewport('prediction-presentation', metrics => pcApplyPredictionPresentation(metrics));
}

window.pcApplyPredictionPresentation = pcApplyPredictionPresentation;

function pcEnsurePredictionButtons(){
  if (!pcPredictionIsOpen()) return;
  if (window.pcWaitingForBabbageContinue) return;
  const prompt = window.pendingPromptForPrediction || window.pendingPromptAfterPrediction;
  if (!prompt) return;

  let panel = document.getElementById('vnPredictionChoicePanel');
  if (!panel) {
    const dialogue = document.getElementById('vnDialogue') || document.getElementById('vnText');
    if (!dialogue) return;
    panel = document.createElement('div');
    panel.id = 'vnPredictionChoicePanel';
    panel.className = 'pc-choice-panel-final';
    panel.setAttribute('role','group');
    panel.setAttribute('aria-label','Prediction choices');
    panel.innerHTML = Object.entries(PC_PREDICTION_LABELS).map(([choice,label]) =>
      `<button class="pc-clean-choice-btn" type="button" data-choice="${choice}" data-pc-action="choose-prediction" data-pc-choice="${choice}" data-pc-stop-propagation="true">${label}</button>`
    ).join('');
    dialogue.appendChild(panel);
  }

  pcQueuePredictionPresentation();
}

function pcShowPredictionGate(text){
  if (!text) return false;

  window.pendingPromptForPrediction = text;
  window.pendingPromptAfterPrediction = '';
  window.pcWaitingForBabbageContinue = false;
  window.predictionGateActive = true;
  try { predictionGateActive = true; } catch(e) {}

  pcClearPredictionUI();
  pcStopVN();

  const overlay = pcSetVNOverlayState({
    active: true,
    modes: ['babbage-prediction', 'pc-clean-prediction', 'pc-prediction-question']
  });

  const sceneBackground = document.getElementById('vnSceneBg');
  if (sceneBackground) {
    pcSetImageSource(
      sceneBackground,
      pcGetScenarioBackgroundAsset(window.scenarioIndex),
      LEGACY_ASSETS.images.backgrounds.classroom
    );
  }

  const dialogue = document.getElementById('vnDialogue');
  if (dialogue) {
    dialogue.classList.add('has-choices','prediction-question');
    dialogue.classList.remove('prediction-result');
  }

  try { setVNBabbageMode(false); } catch(e) {}
  try { setVNBabbageTerminalMode(false); } catch(e) {}
  try { setBabbageTerminalTextMode(false); } catch(e) {}
  try { setBabbageShelfState('idle', 'awaiting prediction'); } catch(e) {}
  try { setBabbageTerminalState('idle', 'BABBAGE ENGINE', 'AWAITING PREDICTION'); } catch(e) {}
  try { pcClearPredictionLayoutInlineStyles(); } catch(e) {}
  pcQueueModernTerminalAlignment();
  // Prediction questions use the same shared primary cast slot as every other
  // single-character VN/workstation scene.
  vnSetDialogueCharacter('pixel', 'thinking', 'Professor Pixel', ['pixel']);
  try { musicStartVN(); } catch(e) {}

  const hint = document.getElementById('vnAdvanceHint');
  if (hint) hint.classList.remove('show');

  const vnText = document.getElementById('vnText');
  if (vnText) {
    vnText.innerHTML = `
      <div class="pc-feedback-copy">
        <div><strong>Before we consult Babbage...</strong></div>
        <div>Based on the context you gave, what do you predict Babbage will do?</div>
      </div>`;
  }

  pcQueuePredictionPresentation();
  setTimeout(pcEnsurePredictionButtons, 0);
  setTimeout(pcEnsurePredictionButtons, 100);
  setTimeout(pcEnsurePredictionButtons, 350);
  setTimeout(() => dialogue?.focus(), 80);
  return false;
}

function pcChoosePrediction(choice){
  const text = window.pendingPromptForPrediction;
  if (!text || window.pcWaitingForBabbageContinue || window.isSubmittingToBabbage || (typeof isSubmittingToBabbage !== 'undefined' && isSubmittingToBabbage)) return;

  window.pendingPromptAfterPrediction = text;
  window.pendingPromptForPrediction = '';
  window.pcWaitingForBabbageContinue = true;
  window.predictionGateActive = false;
  try { predictionGateActive = false; } catch(e) {}

  const s = scenarioData && scenarioData[scenarioIndex];
  if (s) {
    if (!s.predictions) s.predictions = [];
    const predictionRecord = { choice, label: pcFormatPredictionChoice(choice), prompt:text, attempt:(s.attempts || 0) + 1, timestamp:new Date().toISOString() };
    s.predictions.push(predictionRecord);
    s.prediction = choice;
    s.selfReportPrediction = pcFormatPredictionsForSave(s, scenarioIndex);
  }

  const reaction = (window.predictionReactions && window.predictionReactions[choice]) || PC_PREDICTION_REACTIONS[choice] || PC_PREDICTION_REACTIONS.not_sure;
  pcShowSharedWorkstationResult({
    terminalText: 'AWAITING PREDICTION',
    speakerName: 'Professor Pixel',
    character: 'pixel',
    expression: 'thinking',
    heading: 'Your prediction is logged.',
    bodyHTML: reaction,
    button: {
      id: 'pcContinueToBabbageBtn',
      onActivate: pcContinueToBabbageAnalysis,
      label: 'Continue to Babbage →'
    },
    ariaLabel: 'Professor Pixel prediction result. Continue to Babbage when ready.'
  });
}

function pcContinueToBabbageAnalysis(){
  const text = window.pendingPromptAfterPrediction;
  if (!text || window.isSubmittingToBabbage || (typeof isSubmittingToBabbage !== 'undefined' && isSubmittingToBabbage)) return false;

  // v160: Capture the correctly rendered prediction computer synchronously,
  // before any overlay classes are changed. The earlier asynchronous capture
  // could run after the prediction layout had already been removed, leaving the
  // stored frame null and giving the analyzing screen nothing useful to reuse.
  const predictionTerminal = document.getElementById('babbageTerminalScene');
  const predictionFrameCaptured = pcCapturePredictionTerminalFrameGeometry(predictionTerminal);
  pcDebug(
    '[PromptCraft] Prediction terminal frame capture:',
    predictionFrameCaptured ? { ...pcPredictionTerminalFrame } : null
  );

  window.pendingPromptAfterPrediction = '';
  window.pcWaitingForBabbageContinue = false;

  // IMPORTANT: show Babbage's thinking screen immediately BEFORE the network/API call.
  // Previously this overlay did not appear until after Babbage returned, which made the
  // game look frozen for 20-30 seconds. Tiny little UX crime scene.
  pcSetVNOverlayState({
    active: true,
    modes: ['babbage-terminal-consult']
  });
  const dialogue = document.getElementById('vnDialogue');
  if (dialogue) dialogue.classList.remove('has-choices','prediction-question','prediction-result');
  document.getElementById('vnCharacter')?.classList.remove('visible');
  pcClearPredictionUI();
  pcClearPredictionPresentation();

  const vnText = document.getElementById('vnText');
  if (vnText) vnText.innerHTML = '';

  try { showBabbageConsultOverlay('Scenario diagnosis'); } catch(e) {
    try {
      setVNBabbageMode(false);
      setVNBabbageTerminalMode(true);
      setBabbageTerminalTextMode(false);
      setBabbageShelfState('thinking','analyzing');
      setBabbageTerminalState('thinking','BABBAGE ENGINE','ANALYZING...');
      renderBabbageAnalyzingReadout('Scenario diagnosis');
      musicStartVN();
    } catch(_) {}
  }

  // Reapply the captured prediction frame after the analyzing DOM state and
  // its CSS classes have finished changing. Multiple passes cover the first
  // layout frame and late font/image sizing without relying on resize events.
  const applyCapturedPredictionFrame = () => {
    const terminal = document.getElementById('babbageTerminalScene');
    const photo = terminal?.querySelector('.babbage-terminal-photo');
    if (terminal && photo) pcApplyPredictionTerminalFrame(terminal, photo);
    pcAlignModernTerminalScreen();
  };
  requestAnimationFrame(applyCapturedPredictionFrame);
  window.setTimeout(applyCapturedPredictionFrame, 50);
  window.setTimeout(applyCapturedPredictionFrame, 220);

  sendMain(text);
  return false;
}

function sendText(text){
  if (!text || window.isSubmittingToBabbage || (typeof isSubmittingToBabbage !== 'undefined' && isSubmittingToBabbage) || window.pcWaitingForBabbageContinue) return false;
  const btn = document.getElementById('sendBtn');
  if (btn) btn.disabled = true;
  return pcShowPredictionGate(text);
}

pcExposeGlobals({
  pcShowPredictionGate,
  showPredictionGate: pcShowPredictionGate,
  choosePrediction: pcChoosePrediction,
  finalChoosePrediction: pcChoosePrediction,
  pcContinueToBabbageAnalysis,
  finalContinueToBabbage: pcContinueToBabbageAnalysis,
  hardShowPredictionGate: pcShowPredictionGate,
  hardChoosePrediction: pcChoosePrediction,
  hardContinueToBabbage: pcContinueToBabbageAnalysis,
  hardSendText: sendText,
  sendText,
  ensurePredictionButtons: pcEnsurePredictionButtons
});

pcRegisterUIActions({
  'choose-prediction': target => pcChoosePrediction(target.dataset.pcChoice),
  'shared-workstation-result-continue': (target, event) => {
    if (typeof pcSharedWorkstationResultContinue === 'function') {
      return pcSharedWorkstationResultContinue(target, event);
    }
    return false;
  }
});

if (!window.__pcPredictionWatchdogBound) {
  window.__pcPredictionWatchdogBound = true;
  document.addEventListener('click', () => setTimeout(pcEnsurePredictionButtons, 50), true);
  setInterval(pcEnsurePredictionButtons, 600);
}
