const pcVNCharacterRegistry = new Map();

function pcRegisterVNCharacter(id, config = {}) {
  const key = String(id || '').trim().toLowerCase();
  if (!key) return false;
  pcVNCharacterRegistry.set(key, {
    id: key,
    label: config.label || key,
    expressions: config.expressions || {},
    legacyExpressions: config.legacyExpressions || {},
    slotBottomOffsetVar: config.slotBottomOffsetVar || '',
    portraitOffsetVar: config.portraitOffsetVar || ''
  });
  return true;
}

function pcResolveVNCharacterMap(source) {
  return typeof source === 'function' ? (source() || {}) : (source || {});
}

function pcGetVNCharacterDefinition(id = 'pixel') {
  const key = String(id || 'pixel').trim().toLowerCase();
  return pcVNCharacterRegistry.get(key) || pcVNCharacterRegistry.get('pixel');
}

function pcGetVNCharacterImage(id = 'pixel', expression = 'neutral') {
  const definition = pcGetVNCharacterDefinition(id);
  if (!definition) return { src: '', fallback: '' };
  const expressions = pcResolveVNCharacterMap(definition.expressions);
  const legacy = pcResolveVNCharacterMap(definition.legacyExpressions);
  return {
    src: expressions[expression] || expressions.neutral || '',
    fallback: legacy[expression] || legacy.neutral || ''
  };
}

pcRegisterVNCharacter('pixel', {
  label: 'Professor Pixel',
  expressions: () => EXPRESSIONS,
  legacyExpressions: () => LEGACY_ASSETS.images.professorPixel
});
pcRegisterVNCharacter('jordan', {
  label: 'Jordan',
  expressions: () => ASSETS.images.students.jordan,
  legacyExpressions: () => LEGACY_ASSETS.images.students.jordan
});
pcRegisterVNCharacter('eli', {
  label: 'Eli',
  expressions: () => ASSETS.images.students.eli,
  legacyExpressions: () => LEGACY_ASSETS.images.students.eli
});
pcRegisterVNCharacter('maya', {
  label: 'Maya',
  expressions: () => ASSETS.images.students.maya,
  legacyExpressions: () => LEGACY_ASSETS.images.students.maya,
  slotBottomOffsetVar: '--pc-character-maya-vn-bottom-offset',
  portraitOffsetVar: '--pc-character-maya-portrait-offset'
});

const PC_VN_CAST_SLOTS = Object.freeze([
  { containerId: 'vnCharacter', portraitId: 'vnPortrait', side: 'right' },
  { containerId: 'vnStudentCharacter', portraitId: 'vnStudentPortrait', side: 'left' }
]);

const PC_VN_SLOT_INLINE_PROPERTIES = Object.freeze([
  'display', 'visibility', 'opacity', 'filter', 'position',
  'left', 'right', 'top', 'bottom', 'width', 'height',
  'min-width', 'max-width', 'min-height', 'max-height',
  'align-items', 'justify-content', 'transform', 'transform-origin', 'z-index'
]);

const PC_VN_PORTRAIT_INLINE_PROPERTIES = Object.freeze([
  'display', 'visibility', 'opacity', 'filter', 'width', 'height',
  'min-width', 'max-width', 'min-height', 'max-height',
  'object-fit', 'object-position', 'transform', 'transform-origin', 'z-index'
]);

function pcGetVNSlot(slotIndex = 0) {
  const slot = PC_VN_CAST_SLOTS[slotIndex];
  if (!slot) return null;
  return {
    ...slot,
    container: document.getElementById(slot.containerId),
    portrait: document.getElementById(slot.portraitId)
  };
}

function pcClearVNSlotInlineStyles(slot) {
  if (!slot) return;
  PC_VN_SLOT_INLINE_PROPERTIES.forEach(property => slot.container?.style.removeProperty(property));
  PC_VN_PORTRAIT_INLINE_PROPERTIES.forEach(property => slot.portrait?.style.removeProperty(property));
}

function pcSetVNSlotPortrait(slotIndex, characterId, expression = 'neutral', { animate = false } = {}) {
  const slot = pcGetVNSlot(slotIndex);
  if (!slot?.portrait) return false;
  const character = pcGetVNCharacterDefinition(characterId);
  if (!character) return false;
  const { src, fallback } = pcGetVNCharacterImage(character.id, expression);
  if (!src && !fallback) return false;

  const portrait = slot.portrait;
  if (portrait._pcExpressionTimer) {
    clearTimeout(portrait._pcExpressionTimer);
    portrait._pcExpressionTimer = null;
  }

  const apply = () => {
    pcSetImageSource(portrait, src, fallback);
    portrait.dataset.pcCharacter = character.id;
    portrait.style.removeProperty('opacity');
    portrait._pcExpressionTimer = null;
  };

  if (animate && portrait.isConnected && getComputedStyle(portrait).display !== 'none') {
    portrait.style.opacity = '0';
    portrait._pcExpressionTimer = setTimeout(apply, 120);
  } else {
    apply();
  }
  return true;
}

function pcSetVNSlotCharacter(
  slotIndex,
  characterId,
  expression = 'neutral',
  { active = true, side = '' } = {}
) {
  const slot = pcGetVNSlot(slotIndex);
  if (!slot?.container || !slot?.portrait) return false;
  pcClearVNSlotInlineStyles(slot);

  if (!characterId) {
    slot.container.classList.remove('visible', 'is-active', 'is-inactive');
    slot.container.style.setProperty('display', 'none', 'important');
    delete slot.container.dataset.pcCharacter;
    delete slot.container.dataset.pcCastSide;
    delete slot.portrait.dataset.pcCharacter;
    return true;
  }

  const character = pcGetVNCharacterDefinition(characterId);
  if (!character) return false;
  const resolvedSide = side === 'left' || side === 'right' ? side : slot.side;
  slot.container.dataset.pcCharacter = character.id;
  slot.container.dataset.pcCastSide = resolvedSide;
  slot.portrait.dataset.pcCharacter = character.id;
  if (character.slotBottomOffsetVar) {
    slot.container.style.setProperty(
      'bottom',
      `calc(var(--pc-vn-character-bottom) + var(${character.slotBottomOffsetVar}, 0px))`,
      'important'
    );
  }
  if (character.portraitOffsetVar) {
    slot.portrait.style.setProperty(
      'transform',
      `translateY(var(${character.portraitOffsetVar}, 0px))`,
      'important'
    );
  }
  slot.container.classList.add('visible');
  slot.container.classList.toggle('is-active', Boolean(active));
  slot.container.classList.toggle('is-inactive', !active);
  pcSetVNSlotPortrait(slotIndex, character.id, expression);
  return true;
}

function pcNormalizeVNCast(cast, speakerId) {
  const entries = (Array.isArray(cast) ? cast : [])
    .map(entry => typeof entry === 'string' ? { id: entry } : { ...entry })
    .filter(entry => entry && entry.id)
    .slice(0, PC_VN_CAST_SLOTS.length);

  const speaker = String(speakerId || '').trim().toLowerCase();
  if (!entries.length && speaker) entries.push({ id: speaker });

  // Cast order is no longer a positioning contract. A scenario can request a
  // reusable left/right slot, while plain string arrays retain the default
  // primary-right / secondary-left order for backward compatibility.
  const positioned = new Array(PC_VN_CAST_SLOTS.length).fill(null);
  const unpositioned = [];
  entries.forEach(entry => {
    const requestedSide = String(entry.slot || entry.side || '').toLowerCase();
    const requestedIndex = requestedSide === 'right' ? 0 : requestedSide === 'left' ? 1 : -1;
    if (requestedIndex >= 0 && !positioned[requestedIndex]) {
      positioned[requestedIndex] = { ...entry, side: requestedSide };
    } else {
      unpositioned.push(entry);
    }
  });
  positioned.forEach((entry, index) => {
    if (entry) return;
    positioned[index] = unpositioned.shift() || null;
  });
  return positioned.filter(Boolean);
}

function pcRenderVNCast({ cast = [], speaker = 'pixel', expression = 'neutral' } = {}) {
  const overlay = document.getElementById('vnOverlay');
  const speakerId = String(speaker || 'pixel').trim().toLowerCase();
  const normalizedCast = pcNormalizeVNCast(cast, speakerId);
  if (!normalizedCast.some(entry => String(entry.id).toLowerCase() === speakerId)) {
    normalizedCast.splice(0, normalizedCast.length, { id: speakerId });
  }

  const isDual = normalizedCast.length > 1;
  overlay?.classList.toggle('pc-dual-character', isDual);
  // Retired scenario-specific cast classes must never become layout owners again.
  overlay?.classList.remove('pc-s2-two-character', 'pc-s2-narrow-jordan');

  PC_VN_CAST_SLOTS.forEach((_, slotIndex) => {
    const entry = normalizedCast[slotIndex];
    if (!entry) {
      pcSetVNSlotCharacter(slotIndex, null);
      return;
    }
    const id = String(entry.id).trim().toLowerCase();
    const active = id === speakerId;
    const slotExpression = active ? expression : (entry.expression || 'neutral');
    pcSetVNSlotCharacter(slotIndex, id, slotExpression, {
      active,
      side: entry.side || entry.slot || ''
    });
  });

  // Compact S1 evidence scenes give the Canvas interface the full visual stage.
  // Reapply this after every dialogue line because cast rendering intentionally
  // clears earlier inline layout state when expressions or speakers change.
  const compactS1Evidence = Boolean(
    overlay?.classList.contains('pc-s1-mobile-evidence-reader')
    && window.matchMedia?.('(max-width: 1100px)').matches
  );
  const compactS1HasCastRoom = Boolean(
    compactS1Evidence && overlay?.classList.contains('pc-s1-phone-cast-room')
  );
  overlay?.classList.toggle('pc-s1-phone-cast-room', compactS1HasCastRoom);
  if (compactS1Evidence && !compactS1HasCastRoom) {
    PC_VN_CAST_SLOTS.forEach((_, slotIndex) => {
      const slot = pcGetVNSlot(slotIndex);
      slot?.container?.style.setProperty('display', 'none', 'important');
      slot?.container?.setAttribute('aria-hidden', 'true');
    });
  } else {
    PC_VN_CAST_SLOTS.forEach((_, slotIndex) => {
      pcGetVNSlot(slotIndex)?.container?.removeAttribute('aria-hidden');
    });
  }

  window.pcCurrentVNCast = normalizedCast.map(entry => String(entry.id).trim().toLowerCase());
  window.pcCurrentVNSpeaker = speakerId;
  return true;
}

function pcUpdateS1PhoneCastRoom() {
  const overlay = document.getElementById('vnOverlay');
  const screenWidth = Math.min(
    window.innerWidth,
    window.screen?.width || window.innerWidth
  );
  const eligible = Boolean(
    overlay?.classList.contains('pc-s1-mobile-evidence-reader')
    && screenWidth <= 1100
  );
  const image = overlay?.querySelector('.pc-s1-real-canvas-capture img');
  const dialogue = document.getElementById('vnDialogue');
  const scene = document.getElementById('vnScene');
  const availableRoom = eligible && image && dialogue
    ? dialogue.getBoundingClientRect().top - image.getBoundingClientRect().bottom
    : 0;
  const hasRoom = availableRoom >= 140;
  overlay?.classList.toggle('pc-s1-phone-cast-room', hasRoom);

  if (hasRoom && scene) {
    const dialogueRect = dialogue.getBoundingClientRect();
    const castHeight = Math.max(112, Math.min(150, availableRoom - 18));
    overlay.style.removeProperty('--pc-s1-cast-top');
    overlay.style.setProperty(
      '--pc-s1-cast-bottom',
      `${Math.max(0, window.innerHeight - dialogueRect.top + 4)}px`
    );
    overlay.style.setProperty('--pc-s1-cast-height', `${castHeight}px`);
  } else {
    overlay?.style.removeProperty('--pc-s1-cast-top');
    overlay?.style.removeProperty('--pc-s1-cast-bottom');
    overlay?.style.removeProperty('--pc-s1-cast-height');
  }

  PC_VN_CAST_SLOTS.forEach((_, slotIndex) => {
    const slot = pcGetVNSlot(slotIndex);
    if (!slot?.container) return;
    if (hasRoom) {
      slot.container.style.removeProperty('display');
      slot.container.removeAttribute('aria-hidden');
    } else if (eligible) {
      slot.container.style.setProperty('display', 'none', 'important');
      slot.container.setAttribute('aria-hidden', 'true');
    } else {
      slot.container.style.removeProperty('display');
      slot.container.removeAttribute('aria-hidden');
    }
  });
  return hasRoom;
}

let pcS1CastRoomFrame = 0;
function pcScheduleS1CastRoomUpdate() {
  cancelAnimationFrame(pcS1CastRoomFrame);
  pcS1CastRoomFrame = requestAnimationFrame(() => {
    if (typeof window.pcRefreshS1CanvasEvidenceLayout === 'function'
        && window.pcRefreshS1CanvasEvidenceLayout()) return;
    pcUpdateS1PhoneCastRoom();
  });
}

window.addEventListener('resize', pcScheduleS1CastRoomUpdate, { passive: true });
window.visualViewport?.addEventListener('resize', pcScheduleS1CastRoomUpdate, { passive: true });



function vnSetDialogueCharacter(character = 'pixel', expression = 'neutral', speakerName = '', cast = null) {
  const characterId = String(character || 'pixel').trim().toLowerCase();
  const definition = pcGetVNCharacterDefinition(characterId);
  const speaker = document.getElementById('vnSpeaker');
  const dialogue = document.getElementById('vnDialogue');
  const castList = Array.isArray(cast) && cast.length ? cast : [characterId];

  pcRenderVNCast({ cast: castList, speaker: characterId, expression });

  const resolvedSpeaker = speakerName || definition?.label || characterId;
  if (speaker) speaker.textContent = resolvedSpeaker;
  if (dialogue) {
    dialogue.setAttribute('aria-label', `${resolvedSpeaker} is speaking. Press Space or Enter to continue.`);
  }
}

function pcAnimateVNCharacterEntrance(characterId = '', entrance = '') {
  if (entrance !== 'slide-left') return false;
  const id = String(characterId || '').trim().toLowerCase();
  const slot = [...document.querySelectorAll('#vnCharacter, #vnStudentCharacter')]
    .find(element => element.dataset.pcCharacter === id);
  const portrait = slot?.querySelector('img');
  if (!portrait) return false;

  if (portrait._pcEntranceTimer) clearTimeout(portrait._pcEntranceTimer);
  portrait.classList.remove('pc-vn-enter-slide-left');
  void portrait.offsetWidth;
  portrait.classList.add('pc-vn-enter-slide-left');
  portrait._pcEntranceTimer = setTimeout(() => {
    portrait.classList.remove('pc-vn-enter-slide-left');
    portrait._pcEntranceTimer = null;
  }, 760);
  return true;
}


window.pcRegisterVNCharacter = pcRegisterVNCharacter;
window.pcRenderVNCast = pcRenderVNCast;
window.pcGetVNCharacterDefinition = pcGetVNCharacterDefinition;
window.pcUpdateS1PhoneCastRoom = pcUpdateS1PhoneCastRoom;

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

function pcVNHasActiveHandoff() {
  const overlay = document.getElementById('vnOverlay');
  return Boolean(
    overlay &&
    overlay.classList.contains('active') &&
    (
      overlay.classList.contains('babbage-terminal-consult') ||
      overlay.classList.contains('babbage-terminal-textmode') ||
      overlay.classList.contains('babbage-prediction') ||
      overlay.classList.contains('pc-clean-prediction') ||
      overlay.classList.contains('pc-prediction-question') ||
      overlay.classList.contains('pc-clean-output') ||
      overlay.classList.contains('pc-s1-dialogue-choice')
    )
  );
}

function vnAdvance() {
  const overlay = document.getElementById('vnOverlay');
  const dialogue = document.getElementById('vnDialogue');

  // Workstation result scenes opt into explicit-action mode. In that state the
  // dialogue surface is informational only; the rendered Continue button owns
  // the transition. This prevents a stray click from consuming the scene.
  if (dialogue?.dataset.pcExplicitAction === 'true') return;

  // HARD STOP: during Babbage terminal/thinking screens, clicks on the black
  // dialogue panel must NOT advance or clear the VN text. Only the explicit
  // Continue button on the finished analysis screen should close it.
  const terminal = document.getElementById('babbageTerminalScene');
  const terminalIsThinking = terminal?.classList.contains('thinking');
  const terminalReturnVisible = !!document.querySelector('.terminal-return, #pcContinueToBabbageBtn');
  if (
    overlay &&
    overlay.classList.contains('active') &&
    (overlay.classList.contains('babbage-terminal-consult') || overlay.classList.contains('babbage-terminal-textmode')) &&
    !terminalReturnVisible &&
    (terminalIsThinking || !overlay.classList.contains('babbage-terminal-textmode'))
  ) {
    return;
  }

  // HARD STOP: once the prediction has been logged, the black VN box must
  // not advance the scene. Only the actual "Continue to Babbage" button should
  // move the user into the Babbage processing screen. Otherwise a stray click
  // jumps the state machine into the weird empty terminal screen. Charming.
  if (
    window.pcWaitingForBabbageContinue ||
    document.getElementById('pcContinueToBabbageBtn')
  ) {
    return;
  }

  // Do not auto-advance while prediction choices are visible.
  if (
    overlay &&
    (
      overlay.classList.contains('babbage-prediction') ||
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

  // A completion callback may hand the VN directly to another shared overlay
  // state, most notably the Babbage analyzing workstation. Do not let the old
  // empty VN queue schedule a close over the newly opened state.
  if (vnQueue.length === 0 && pcVNHasActiveHandoff()) return;
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
  const lines = window.pixelDialogue?.[key];
  if (!Array.isArray(lines) || !lines.length) {
    console.warn(`[PromptCraft] Dialogue sequence "${key}" is missing; continuing without VN dialogue.`);
    if (typeof onDone === 'function') onDone();
    return false;
  }

  let introCharacters = null;

  // Update board text and play intro audio on scenario starts. A scenario may
  // also declare a reusable cast here; the VN renderer decides how that cast
  // fits the current viewport without scenario-specific positioning code.
  if (key.startsWith('scenarioStart_')) {
    const i = getScenarioIndexFromDialogueKey(key);
    if (i >= 0 && scenarios[i]) {
      const boardText = document.getElementById('vnBoardText');
      const ui = getScenarioUI(i);
      if (boardText) boardText.textContent = ui?.boardText || scenarios[i].desc;
      if (ui?.introCast === 'dual' && Array.isArray(ui.introCharacters)) {
        introCharacters = ui.introCharacters;
      }
      // Play scenario intro — suppressed during initial load to avoid double audio
      if (window.scenarioIntroEnabled) playSound(`scenarioIntro${i}`);
    }
  }

  // Welcome narration on game start
  if (key === 'welcome') playSound('welcome');

  // Queue all lines
  lines.forEach((line, idx) => {
    const isLast = idx === lines.length - 1;
    vnShow(line.expr, line.text, isLast && onDone ? onDone : null, {
      speaker: line.speaker || 'Professor Pixel',
      character: line.character || 'pixel',
      cast: line.cast || introCharacters,
      entrance: line.entrance || '',
      id: line.id || ''
    });
  });
  return true;
}
