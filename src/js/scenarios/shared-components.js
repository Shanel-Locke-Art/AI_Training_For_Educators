/* PROMPTCRAFT SHARED SCENARIO ACTIVITY COMPONENTS
   Scenario-neutral progress, choice, evidence, manipulation, transfer,
   guided-repair, result, and activity-shell builders. */

// ══════════════════════════════════════════════════════
//  SHARED SCENARIO ACTIVITY COMPONENTS
//  These builders are scenario-neutral. S2 is the first user, and S3–S8 can
//  reuse the same mission, progress, evidence, choice, feedback, and action
//  anatomy without cloning another screen system.
// ══════════════════════════════════════════════════════
function buildScenarioProgressHTML({ steps = [], activeIndex = 0, ariaLabel = 'Scenario progress' } = {}) {
  if (!steps.length) return '';
  return `
    <div class="pc-scenario-progress" aria-label="${esc(ariaLabel)}">
      ${steps.map((step, index) => `<span${index === activeIndex ? ' class="active" aria-current="step"' : ''}>${esc(step)}</span>`).join('')}
    </div>`;
}

function buildScenarioChoiceCardsHTML({
  items = [],
  inputName,
  idPrefix,
  variant = 'compact',
  marker = (_, index) => String(index + 1).padStart(2, '0')
} = {}) {
  return items.map((item, index) => {
    const inputId = `${idPrefix}-${item.id}`;
    const markerText = typeof marker === 'function' ? marker(item, index) : item[marker] || '';
    const body = variant === 'detail'
      ? `<span class="pc-choice-body"><strong>${esc(item.title)}</strong><span>“${esc(item.text)}”</span></span>`
      : `<span class="pc-choice-copy">${esc(item.label)}</span>`;
    return `
      <label class="pc-choice-card pc-choice-card--${esc(variant)}" for="${esc(inputId)}">
        <input type="checkbox" id="${esc(inputId)}" name="${esc(inputName)}" value="${esc(item.id)}" />
        <span class="pc-choice-marker">${esc(markerText)}</span>
        ${body}
      </label>`;
  }).join('');
}

function buildScenarioTaskCardHTML({
  titleId,
  kicker,
  title,
  instruction,
  choiceGridId,
  choicesHTML,
  statusId,
  submitId,
  submitLabel,
  feedbackId,
  gridClass = '',
  includeFeedback = true
} = {}) {
  return `
    <section class="pc-activity-card pc-activity-task" aria-labelledby="${esc(titleId)}">
      <div class="pc-activity-kicker">${esc(kicker)}</div>
      <h2 id="${esc(titleId)}">${esc(title)}</h2>
      <p class="pc-activity-instruction">${esc(instruction)}</p>
      <div class="pc-choice-grid${gridClass ? ` ${esc(gridClass)}` : ''}" id="${esc(choiceGridId)}">${choicesHTML}</div>
      <div class="pc-selection-bar">
        <span id="${esc(statusId)}" role="status" aria-live="polite">0 selected</span>
        <button class="pc-button pc-button--primary" id="${esc(submitId)}" type="button" disabled>${esc(submitLabel)}</button>
      </div>
      ${includeFeedback && feedbackId ? `<div id="${esc(feedbackId)}" aria-live="polite"></div>` : ''}
    </section>`;
}


// ── SHARED STUDENT EVIDENCE PANEL ────────────────────
// Keeps student voice visible beside the performance/result being interpreted.
// S3 uses this pattern now; future scenarios can reuse it without cloning a
// scenario-specific portrait/quote card.
function buildStudentEvidencePanelHTML({
  title = 'Student Evidence',
  portraitSrc = '',
  portraitAlt = '',
  characterId = '',
  quote = '',
  resultLabel = 'Result',
  resultValue = '',
  resultNote = ''
} = {}) {
  const characterAttr = characterId ? ` data-pc-character="${esc(characterId)}"` : '';
  return `
    <section class="pc-student-evidence"${characterAttr} aria-label="${esc(title)}">
      <h2 class="pc-student-evidence-title">${esc(title)}</h2>
      <div class="pc-student-evidence-portrait">
        <img src="${esc(portraitSrc)}" alt="${esc(portraitAlt)}" />
      </div>
      <blockquote class="pc-student-evidence-quote">
        <span class="pc-student-evidence-quote-mark" aria-hidden="true">“</span>
        <span class="pc-student-evidence-quote-copy">${esc(quote)}</span>
        <span class="pc-student-evidence-quote-mark" aria-hidden="true">”</span>
      </blockquote>
      <div class="pc-student-evidence-result">
        <span>${esc(resultLabel)}</span>
        <strong>${esc(resultValue)}</strong>
        ${resultNote ? `<small>${esc(resultNote)}</small>` : ''}
      </div>
    </section>`;
}

// ── SHARED DRAG / DROP INTERACTION SYSTEM ────────────
// S3 introduces manipulation as a reusable PromptCraft mechanic. Mouse users
// can drag cards; touch and keyboard users select a card and then choose a
// destination. The scenario supplies content and scoring, while this component
// owns movement, accessibility state, capacity rules, and responsive behavior.
function buildDragCardHTML(card = {}) {
  return `
    <div class="pc-drag-card" draggable="true" tabindex="0" role="button"
         aria-grabbed="false" data-pc-drag-card="${esc(card.id)}"
         data-pc-drag-group="${esc(card.group || '')}"
         data-pc-home-tray="${esc(card.homeTray || '__tray__')}">
      ${card.tag ? `<span class="pc-drag-card-tag">${esc(card.tag)}</span>` : ''}
      <strong>${esc(card.title || card.label || card.id)}</strong>
      ${card.text ? `<span class="pc-drag-card-copy">${esc(card.text)}</span>` : ''}
    </div>`;
}

function buildDragSortBoardHTML({
  rootId = 'pcDragBoard',
  titleId = 'pcDragBoardTitle',
  kicker = 'Evidence board',
  title = 'Sort the evidence',
  instruction = '',
  cards = [],
  zones = [],
  statusId = 'pcDragBoardStatus',
  submitId = 'pcDragBoardSubmit',
  submitLabel = 'Continue',
  trayLabel = 'Evidence cards',
  trayHint = 'Drag a card into a category. On touch or keyboard, select the card and then select a category.',
  feedbackId = 'pcDragBoardFeedback'
} = {}) {
  const cardsHTML = cards.map(card => buildDragCardHTML({ ...card, homeTray: '__tray__' })).join('');
  const zonesHTML = zones.map(zone => `
    <section class="pc-drop-zone" tabindex="0" role="button"
             aria-label="${esc(zone.label || zone.id)} drop zone"
             data-pc-drop-zone="${esc(zone.id)}"
             data-pc-accept-group="${esc(zone.acceptGroup || '')}"
             data-pc-capacity="${Number(zone.capacity || 99)}">
      <div class="pc-drop-zone-head">
        ${zone.tag ? `<span>${esc(zone.tag)}</span>` : ''}
        <strong>${esc(zone.label || zone.id)}</strong>
      </div>
      ${zone.description ? `<p>${esc(zone.description)}</p>` : ''}
      <div class="pc-drop-zone-cards" data-pc-zone-cards="${esc(zone.id)}"></div>
    </section>`).join('');

  return `
    <section class="pc-activity-card pc-activity-task pc-drag-activity" aria-labelledby="${esc(titleId)}">
      <div class="pc-activity-kicker">${esc(kicker)}</div>
      <h2 id="${esc(titleId)}">${esc(title)}</h2>
      ${instruction ? `<p class="pc-activity-instruction">${esc(instruction)}</p>` : ''}
      <div class="pc-drag-board" id="${esc(rootId)}">
        <section class="pc-drag-tray" aria-label="${esc(trayLabel)}" data-pc-drop-zone="__tray__" data-pc-is-tray="true" data-pc-capacity="999">
          <div class="pc-drag-tray-head"><strong>${esc(trayLabel)}</strong><span>${esc(trayHint)}</span></div>
          <div class="pc-drag-tray-cards" data-pc-zone-cards="__tray__">${cardsHTML}</div>
        </section>
        <div class="pc-drop-zone-grid">${zonesHTML}</div>
      </div>
      <div class="pc-selection-bar">
        <span id="${esc(statusId)}" role="status" aria-live="polite">0 of ${cards.length} cards placed</span>
        <button class="pc-button pc-button--primary" id="${esc(submitId)}" type="button" disabled>${esc(submitLabel)}</button>
      </div>
      <div id="${esc(feedbackId)}" aria-live="polite"></div>
    </section>`;
}

function buildDragSlotWorkbenchHTML({
  rootId = 'pcDragSlotWorkbench',
  titleId = 'pcDragSlotWorkbenchTitle',
  kicker = 'Assessment workbench',
  title = 'Build the assessment',
  instruction = '',
  dimensions = [],
  statusId = 'pcDragSlotWorkbenchStatus',
  submitId = 'pcDragSlotWorkbenchSubmit',
  submitLabel = 'Test this design',
  feedbackId = 'pcDragSlotWorkbenchFeedback',
  initialSelections = {}
} = {}) {
  const rowsHTML = dimensions.map((dimension, index) => {
    const trayId = `__tray__:${dimension.id}`;
    const selectedId = String(initialSelections?.[dimension.id] || '');
    const cards = (dimension.options || []).map(option => ({
      ...option,
      group: dimension.id,
      homeTray: trayId
    }));
    const selected = cards.find(card => String(card.id) === selectedId) || null;
    const trayCards = cards.filter(card => !selected || card.id !== selected.id).map(buildDragCardHTML).join('');
    const slotCard = selected ? buildDragCardHTML(selected) : '';
    return `
      <section class="pc-drag-slot-row" data-pc-slot-row="${esc(dimension.id)}">
        <header class="pc-drag-slot-heading">
          <span class="pc-drag-slot-number">${String(index + 1).padStart(2, '0')}</span>
          <div><h3>${esc(dimension.label || dimension.id)}</h3>${dimension.description ? `<p>${esc(dimension.description)}</p>` : ''}</div>
        </header>
        <div class="pc-drag-slot-layout">
          <div class="pc-drag-option-tray" aria-label="${esc(dimension.label)} options"
               data-pc-drop-zone="${esc(trayId)}" data-pc-is-tray="true"
               data-pc-accept-group="${esc(dimension.id)}" data-pc-capacity="999">
            <div class="pc-drag-option-tray-label">Available choices</div>
            <div class="pc-drag-option-cards" data-pc-zone-cards="${esc(trayId)}">${trayCards}</div>
          </div>
          <div class="pc-drag-slot" tabindex="0" role="button"
               aria-label="${esc(dimension.label)} assessment slot"
               data-pc-drop-zone="${esc(dimension.id)}"
               data-pc-accept-group="${esc(dimension.id)}" data-pc-capacity="1">
            <div class="pc-drag-slot-label"><span>Drop here</span><strong>${esc(dimension.label)}</strong></div>
            <div class="pc-drop-zone-cards" data-pc-zone-cards="${esc(dimension.id)}">${slotCard}</div>
          </div>
        </div>
      </section>`;
  }).join('');

  return `
    <section class="pc-activity-card pc-activity-task pc-drag-activity" aria-labelledby="${esc(titleId)}">
      <div class="pc-activity-kicker">${esc(kicker)}</div>
      <h2 id="${esc(titleId)}">${esc(title)}</h2>
      ${instruction ? `<p class="pc-activity-instruction">${esc(instruction)}</p>` : ''}
      <p class="pc-drag-access-note">Drag one choice into each slot. On touch or keyboard, select a card and then select its slot.</p>
      <div class="pc-drag-slot-workbench" id="${esc(rootId)}">${rowsHTML}</div>
      <div class="pc-selection-bar">
        <span id="${esc(statusId)}" role="status" aria-live="polite">0 of ${dimensions.length} design decisions ready</span>
        <button class="pc-button pc-button--primary" id="${esc(submitId)}" type="button" disabled>${esc(submitLabel)}</button>
      </div>
      <div id="${esc(feedbackId)}" aria-live="polite"></div>
    </section>`;
}

function getDragBoardPlacements(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return {};
  return Object.fromEntries(Array.from(root.querySelectorAll('[data-pc-drag-card]')).map(card => {
    const zone = card.closest('[data-pc-drop-zone]');
    const zoneId = zone?.dataset.pcDropZone || '';
    return [card.dataset.pcDragCard, zone?.dataset.pcIsTray === 'true' ? '' : zoneId];
  }));
}

function getDragSlotSelections({ rootId, dimensions = [] } = {}) {
  const root = document.getElementById(rootId);
  if (!root) return {};
  const zones = Array.from(root.querySelectorAll('[data-pc-drop-zone]'));
  return Object.fromEntries(dimensions.map(dimension => {
    const zone = zones.find(item => item.dataset.pcDropZone === String(dimension.id));
    const card = zone?.querySelector('[data-pc-drag-card]');
    return [dimension.id, card?.dataset.pcDragCard || ''];
  }));
}

function lockDragBoard(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return false;
  root.dataset.pcDragLocked = 'true';
  root.classList.add('is-reviewed');
  root.querySelectorAll('[data-pc-drag-card]').forEach(card => {
    card.draggable = false;
    card.setAttribute('aria-grabbed', 'false');
    card.setAttribute('tabindex', '-1');
    card.classList.remove('is-selected', 'is-dragging');
  });
  root.querySelectorAll('[data-pc-drop-zone]').forEach(zone => {
    zone.setAttribute('tabindex', '-1');
    zone.classList.remove('is-targetable', 'is-drop-hover');
  });
  return true;
}

function wireDragBoard({
  rootId,
  statusId,
  submitId,
  requiredCardIds = [],
  requiredZoneIds = [],
  onMove = null,
  onUpdate = null,
  onSubmit = null
} = {}) {
  const root = document.getElementById(rootId);
  const status = document.getElementById(statusId);
  const submit = document.getElementById(submitId);
  if (!root || !status || !submit) return false;

  let selectedCard = null;
  let draggedCard = null;
  let suppressCardClickUntil = 0;
  let currentReady = false;
  let currentCount = 0;
  let currentNeededCount = 0;

  const cards = () => Array.from(root.querySelectorAll('[data-pc-drag-card]'));
  const zones = () => Array.from(root.querySelectorAll('[data-pc-drop-zone]'));

  function zoneCards(zone) {
    return zone?.querySelector(':scope > [data-pc-zone-cards], :scope .pc-drop-zone-cards, :scope .pc-drag-tray-cards, :scope .pc-drag-option-cards');
  }

  function accepts(zone, card) {
    if (!zone || !card) return false;
    const accept = String(zone.dataset.pcAcceptGroup || '').trim();
    if (!accept) return true;
    const groups = accept.split(',').map(value => value.trim()).filter(Boolean);
    return groups.includes(String(card.dataset.pcDragGroup || ''));
  }

  function findHomeTray(card) {
    const id = String(card?.dataset.pcHomeTray || '__tray__');
    return zones().find(zone => zone.dataset.pcDropZone === id) || zones().find(zone => zone.dataset.pcIsTray === 'true') || null;
  }

  function clearSelection() {
    cards().forEach(card => {
      card.classList.remove('is-selected');
      card.setAttribute('aria-grabbed', 'false');
    });
    zones().forEach(zone => zone.classList.remove('is-targetable', 'is-drop-hover'));
    selectedCard = null;
  }

  function select(card) {
    if (root.dataset.pcDragLocked === 'true') return;
    if (!card || card.dataset.pcCardLocked === 'true') return;
    if (selectedCard === card) {
      clearSelection();
      return;
    }
    clearSelection();
    selectedCard = card;
    card.classList.add('is-selected');
    card.setAttribute('aria-grabbed', 'true');
    zones().forEach(zone => zone.classList.toggle('is-targetable', accepts(zone, card)));
  }

  function move(card, zone, interaction = 'drag') {
    if (root.dataset.pcDragLocked === 'true') return false;
    if (!card || card.dataset.pcCardLocked === 'true' || !zone || !accepts(zone, card)) return false;
    const target = zoneCards(zone);
    if (!target) return false;
    const capacity = Math.max(1, Number(zone.dataset.pcCapacity || 99));
    const existing = Array.from(target.children).filter(child => child.matches?.('[data-pc-drag-card]') && child !== card);
    if (existing.length >= capacity) {
      existing.slice(capacity - 1).forEach(displaced => {
        const home = findHomeTray(displaced);
        const homeTarget = zoneCards(home);
        if (homeTarget) homeTarget.appendChild(displaced);
      });
    }
    target.appendChild(card);
    const placement = zone.dataset.pcIsTray === 'true' ? '' : zone.dataset.pcDropZone;
    clearSelection();
    update();
    if (typeof onMove === 'function') {
      onMove(getDragBoardPlacements(rootId), {
        cardId: card.dataset.pcDragCard,
        zoneId: placement,
        interaction
      });
    }
    return true;
  }

  function update() {
    const placements = getDragBoardPlacements(rootId);
    const placedCardIds = Object.entries(placements).filter(([, zoneId]) => Boolean(zoneId)).map(([cardId]) => cardId);
    const filledZoneIds = zones().filter(zone => zone.dataset.pcIsTray !== 'true' && zone.querySelector('[data-pc-drag-card]')).map(zone => zone.dataset.pcDropZone);
    const cardsReady = requiredCardIds.length ? requiredCardIds.every(id => placements[id]) : true;
    const zonesReady = requiredZoneIds.length ? requiredZoneIds.every(id => filledZoneIds.includes(String(id))) : true;
    const ready = cardsReady && zonesReady;
    const neededCount = requiredCardIds.length || requiredZoneIds.length || cards().length;
    const currentCountValue = requiredCardIds.length ? requiredCardIds.filter(id => placements[id]).length
      : requiredZoneIds.length ? requiredZoneIds.filter(id => filledZoneIds.includes(String(id))).length
      : placedCardIds.length;
    currentReady = ready;
    currentCount = currentCountValue;
    currentNeededCount = neededCount;
    const remaining = Math.max(0, neededCount - currentCountValue);
    status.textContent = requiredZoneIds.length
      ? (ready
        ? `${currentCountValue} of ${neededCount} design decisions ready · ready to continue`
        : `${currentCountValue} of ${neededCount} design decisions ready · ${remaining} remaining`)
      : (ready
        ? `${currentCountValue} of ${neededCount} cards placed · ready to check`
        : `${currentCountValue} of ${neededCount} cards placed · ${remaining} remaining`);
    // Keep the control responsive even before the board is complete. A disabled
    // button gives no feedback when a browser misses a placement update.
    submit.disabled = false;
    submit.dataset.pcReady = ready ? 'true' : 'false';
    submit.setAttribute('aria-describedby', statusId);
    submit.title = ready ? 'Check the completed board' : 'Place the remaining cards, then check the board';
    submit.classList.toggle('is-not-ready', !ready);
    root.classList.toggle('is-complete', ready);
    root.classList.remove('needs-more');
    if (typeof onUpdate === 'function') onUpdate(placements, { ready, currentCount: currentCountValue, neededCount, filledZoneIds });
  }

  root.addEventListener('dragstart', event => {
    if (root.dataset.pcDragLocked === 'true') { event.preventDefault(); return; }
    const card = event.target.closest?.('[data-pc-drag-card]');
    if (!card || card.dataset.pcCardLocked === 'true') { event.preventDefault(); return; }
    draggedCard = card;
    select(card);
    card.classList.add('is-dragging');
    try { event.dataTransfer.setData('text/plain', card.dataset.pcDragCard); } catch (e) {}
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  });

  root.addEventListener('dragend', event => {
    event.target.closest?.('[data-pc-drag-card]')?.classList.remove('is-dragging');
    zones().forEach(zone => zone.classList.remove('is-drop-hover'));
    draggedCard = null;
    suppressCardClickUntil = performance.now() + 250;
  });

  root.addEventListener('dragover', event => {
    if (root.dataset.pcDragLocked === 'true') return;
    const zone = event.target.closest?.('[data-pc-drop-zone]');
    const card = draggedCard || selectedCard;
    if (!zone || !card || !accepts(zone, card)) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    zones().forEach(item => item.classList.toggle('is-drop-hover', item === zone));
  });

  root.addEventListener('dragleave', event => {
    const zone = event.target.closest?.('[data-pc-drop-zone]');
    zone?.classList.remove('is-drop-hover');
  });

  root.addEventListener('drop', event => {
    if (root.dataset.pcDragLocked === 'true') return;
    const zone = event.target.closest?.('[data-pc-drop-zone]');
    const card = draggedCard || selectedCard;
    if (!zone || !card || !accepts(zone, card)) return;
    event.preventDefault();
    move(card, zone, 'drag');
    draggedCard = null;
    suppressCardClickUntil = performance.now() + 250;
  });

  root.addEventListener('click', event => {
    if (root.dataset.pcDragLocked === 'true') return;
    const card = event.target.closest?.('[data-pc-drag-card]');
    if (card) {
      if (card.dataset.pcCardLocked === 'true') return;
      if (performance.now() < suppressCardClickUntil) return;
      select(card);
      return;
    }
    const zone = event.target.closest?.('[data-pc-drop-zone]');
    if (zone && selectedCard) move(selectedCard, zone, 'tap');
  });

  root.addEventListener('keydown', event => {
    if (root.dataset.pcDragLocked === 'true') return;
    const card = event.target.closest?.('[data-pc-drag-card]');
    const zone = event.target.closest?.('[data-pc-drop-zone]');
    if (event.key === 'Escape') {
      clearSelection();
      return;
    }
    if (!['Enter', ' '].includes(event.key)) return;
    if (card) {
      if (card.dataset.pcCardLocked === 'true') return;
      event.preventDefault();
      select(card);
    } else if (zone && selectedCard) {
      event.preventDefault();
      move(selectedCard, zone, 'keyboard');
    }
  });

  root.addEventListener('pc-drag-refresh', update);

  if (typeof onSubmit === 'function') submit.addEventListener('click', event => {
    update();
    if (!currentReady) {
      event.preventDefault();
      const remaining = Math.max(0, currentNeededCount - currentCount);
      root.classList.add('needs-more');
      status.textContent = requiredZoneIds.length
        ? `${remaining} design decision${remaining === 1 ? '' : 's'} still need${remaining === 1 ? 's' : ''} a card before you can continue.`
        : `${remaining} card${remaining === 1 ? '' : 's'} still need${remaining === 1 ? 's' : ''} to be placed before you can continue.`;
      status.focus?.({ preventScroll: true });
      return;
    }
    onSubmit(event);
  });
  update();
  return true;
}

// ── SHARED SCENARIO RESULT PAGE ─────────────────────
// Scenario 1 established the final-result presentation: one focused parchment
// card, one review panel, one reference panel, and a persistent action bar.
// Later scenarios feed content into this renderer rather than inventing a new
// completion screen. The legacy S1 class names remain the visual owner so the
// two scenarios literally share the same layout and responsive behavior.
function pcRenderSharedScenarioResult({
  eyebrow = 'Babbage result',
  title = 'Revised activity',
  bodyHTML = '',
  reviewTitle = '',
  reviewItems = [],
  referenceTitle = '',
  referenceItems = [],
  controlsTitle = 'Scenario result',
  controlsSub = '',
  controlsActionsHTML = ''
} = {}) {
  document.body.classList.remove('pc-scenario-activity-active');
  document.body.classList.add('s1-result-active', 'pc-shared-result-active');

  const area = document.getElementById('chat');
  if (!area) return null;
  area.innerHTML = '';

  const reviewHTML = reviewTitle && reviewItems.length ? `
    <section class="s1-babbage-revision-review" aria-label="${esc(reviewTitle)}">
      <div class="s1-clean-reference-title">${esc(reviewTitle)}</div>
      ${reviewItems.filter(item => item && item.value).map(item => `
        <div class="s1-babbage-review-item"><strong>${esc(item.label)}:</strong> ${esc(item.value)}</div>`).join('')}
    </section>` : '';

  const referenceHTML = referenceTitle && referenceItems.length ? `
    <div class="s1-clean-reference">
      <div class="s1-clean-reference-title">${esc(referenceTitle)}</div>
      ${referenceItems.filter(item => item && item.value).map(item => `
        <div><strong>${esc(item.label)}:</strong> ${esc(item.value)}</div>`).join('')}
    </div>` : '';

  const card = document.createElement('div');
  card.className = 's1-result-card s1-result-card-focused pc-shared-result-card';
  card.innerHTML = `
    <div class="s1-result-eyebrow">${esc(eyebrow)}</div>
    <div class="s1-result-title">${esc(title)}</div>
    <div class="s1-result-content-box">
      <div class="s1-result-body">${bodyHTML}</div>
      ${reviewHTML}
      ${referenceHTML}
    </div>`;
  area.appendChild(card);

  const container = document.getElementById('inputContainer');
  if (container) {
    container.className = '';
    container.style.display = 'block';
    container.innerHTML = `
      <div class="s1-result-controls" role="region" aria-label="${esc(controlsTitle)} options">
        <div>
          <div class="s1-result-controls-title">${esc(controlsTitle)}</div>
          <div class="s1-result-controls-sub">${esc(controlsSub)}</div>
        </div>
        <div class="s1-result-controls-actions">${controlsActionsHTML}</div>
      </div>`;
  }

  try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch(e) { window.scrollTo(0, 0); }
  area.scrollTop = 0;
  requestAnimationFrame(() => {
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch(e) { window.scrollTo(0, 0); }
    try { area.scrollTop = 0; } catch(e) {}
  });
  return card;
}



// ── SHARED TRANSFER LAB ──────────────────────────────
// Reusable bridge from a fictional PromptCraft case to the educator's own
// teaching material. Scenarios supply field labels, analysis logic, and final
// actions; this component owns the common form/revision/comparison anatomy.
function buildTransferLabInputHTML({
  titleId = 'pcTransferInputTitle',
  kicker = 'Transfer Lab · Your teaching',
  title = 'Apply this to your own work',
  instruction = '',
  privacyNote = '',
  fields = [],
  submitAction = '',
  submitLabel = 'Diagnose my assessment',
  backAction = '',
  backLabel = 'Back',
  feedbackId = 'pcTransferInputFeedback'
} = {}) {
  const fieldsHTML = fields.map(field => `
    <label class="pc-transfer-field${field.fullWidth ? ' pc-transfer-field--wide' : ''}">
      <span>${esc(field.label)}</span>
      ${field.hint ? `<small>${esc(field.hint)}</small>` : ''}
      <textarea id="${esc(field.id)}" rows="${Number(field.rows || 4)}" maxlength="${Number(field.maxlength || 2200)}" placeholder="${esc(field.placeholder || '')}">${esc(field.value || '')}</textarea>
    </label>`).join('');
  return `
    <section class="pc-transfer-lab pc-transfer-input" aria-labelledby="${esc(titleId)}">
      <div class="pc-activity-kicker">${esc(kicker)}</div>
      <h2 id="${esc(titleId)}">${esc(title)}</h2>
      ${instruction ? `<p class="pc-transfer-intro">${esc(instruction)}</p>` : ''}
      ${privacyNote ? `<div class="pc-transfer-privacy"><strong>Privacy note</strong><span>${esc(privacyNote)}</span></div>` : ''}
      <div class="pc-transfer-field-grid">${fieldsHTML}</div>
      <div id="${esc(feedbackId)}" class="pc-transfer-feedback" role="status" aria-live="polite"></div>
      <div class="pc-transfer-actions">
        ${backAction ? `<button class="pc-button pc-button--secondary" type="button" data-pc-action="${esc(backAction)}">${esc(backLabel)}</button>` : ''}
        <button class="pc-button pc-button--primary" type="button" data-pc-action="${esc(submitAction)}">${esc(submitLabel)}</button>
      </div>
    </section>`;
}

function buildTransferRevisionWorkbenchHTML({
  titleId = 'pcTransferRevisionTitle',
  kicker = 'Transfer Lab · Rebuild',
  title = 'Build the stronger version',
  instruction = '',
  dimensions = [],
  submitAction = '',
  submitLabel = 'Compare original and revised',
  backAction = '',
  feedbackId = 'pcTransferRevisionFeedback'
} = {}) {
  return `
    <section class="pc-transfer-lab pc-transfer-revision" aria-labelledby="${esc(titleId)}">
      <div class="pc-activity-kicker">${esc(kicker)}</div>
      <h2 id="${esc(titleId)}">${esc(title)}</h2>
      ${instruction ? `<p class="pc-transfer-intro">${esc(instruction)}</p>` : ''}
      <div class="pc-transfer-dimension-grid">
        ${dimensions.map((dimension, index) => `
          <label class="pc-transfer-dimension">
            <span class="pc-transfer-dimension-num">${index + 1}</span>
            <strong>${esc(dimension.label)}</strong>
            ${dimension.hint ? `<small>${esc(dimension.hint)}</small>` : ''}
            <textarea id="${esc(dimension.id)}" rows="4" maxlength="1800" placeholder="${esc(dimension.placeholder || '')}">${esc(dimension.value || '')}</textarea>
          </label>`).join('')}
      </div>
      <div id="${esc(feedbackId)}" class="pc-transfer-feedback" role="status" aria-live="polite"></div>
      <div class="pc-transfer-actions">
        ${backAction ? `<button class="pc-button pc-button--secondary" type="button" data-pc-action="${esc(backAction)}">Back</button>` : ''}
        <button class="pc-button pc-button--primary" type="button" data-pc-action="${esc(submitAction)}">${esc(submitLabel)}</button>
      </div>
    </section>`;
}

function buildTransferComparisonHTML({
  titleId = 'pcTransferComparisonTitle',
  kicker = 'Transfer Lab · Compare',
  title = 'Original vs. revised',
  original = '',
  revised = '',
  analysisItems = [],
  actionsHTML = ''
} = {}) {
  return `
    <section class="pc-transfer-lab pc-transfer-comparison" aria-labelledby="${esc(titleId)}">
      <div class="pc-activity-kicker">${esc(kicker)}</div>
      <h2 id="${esc(titleId)}">${esc(title)}</h2>
      <div class="pc-transfer-compare-grid">
        <article><span>Original assessment</span><p>${esc(original)}</p></article>
        <article class="is-revised"><span>Revised assessment design</span><p>${esc(revised)}</p></article>
      </div>
      ${analysisItems.length ? `<div class="pc-transfer-analysis-list">${analysisItems.filter(item => item?.value).map(item => `<div><strong>${esc(item.label)}</strong><p>${esc(item.value)}</p></div>`).join('')}</div>` : ''}
      <div class="pc-transfer-actions pc-transfer-actions--final">${actionsHTML}</div>
    </section>`;
}

// ── SHARED GUIDED REPAIR WORKSPACE ───────────────────
// Scenario 1 proved the numbered 2×2 repair workspace. This scenario-neutral
// version lets later scenarios reuse the same interaction model while supplying
// their own field prompts, reference material, assembly logic, and submit action.
function buildGuidedRepairWorkspaceHTML({
  referenceHTML = '',
  titleId = 'pcGuidedRepairTitle',
  kicker = 'Repair workspace',
  title = 'Repair the design',
  instruction = '',
  fields = [],
  previewLabel = 'Assembled prompt',
  previewId = 'pcGuidedRepairPreview',
  nudgeId = 'pcGuidedRepairNudge',
  statusId = 'pcGuidedRepairStatus',
  submitId = 'pcGuidedRepairSubmit',
  submitLabel = 'Ask Babbage to review',
  feedbackId = 'pcGuidedRepairFeedback',
  previewFullWidth = false
} = {}) {
  const fieldsHTML = fields.map((field, index) => `
    <div class="pc-guided-repair-field">
      <label class="pc-guided-repair-label" for="${esc(field.id)}">
        <span class="pc-guided-repair-num">${esc(field.number || String(index + 1))}</span>
        <span>${esc(field.label)}</span>
      </label>
      <textarea
        class="pc-guided-repair-textarea"
        id="${esc(field.id)}"
        rows="3"
        maxlength="${Number(field.maxlength || 700)}"
        placeholder="${esc(field.placeholder || '')}"
        aria-label="${esc(field.ariaLabel || field.label)}"
        data-pc-guided-repair-input="true"></textarea>
    </div>`).join('');

  const previewHTML = `
    <div class="pc-guided-repair-preview-wrap">
      <div class="pc-guided-repair-preview-label">${esc(previewLabel)}</div>
      <div class="pc-guided-repair-preview" id="${esc(previewId)}" role="status" aria-live="polite"></div>
    </div>`;

  const actionsHTML = `
    <div class="pc-guided-repair-actions">
      <div class="pc-guided-repair-nudge" id="${esc(nudgeId)}"></div>
      <div class="pc-guided-repair-submit-wrap">
        <span id="${esc(statusId)}" class="pc-guided-repair-status" role="status" aria-live="polite">0 of ${fields.length} ingredients ready</span>
        <button class="pc-button pc-button--primary" id="${esc(submitId)}" type="button" disabled>${esc(submitLabel)}</button>
      </div>
    </div>`;

  return `
    <div class="pc-guided-repair-layout${previewFullWidth ? ' pc-guided-repair-layout--full-preview' : ''}">
      <aside class="pc-guided-repair-reference" aria-label="Repair reference">
        ${referenceHTML}
      </aside>
      <section class="pc-guided-repair-builder" aria-labelledby="${esc(titleId)}">
        <div class="pc-guided-repair-head">
          <div>
            <div class="pc-activity-kicker">${esc(kicker)}</div>
            <h2 id="${esc(titleId)}">${esc(title)}</h2>
            ${instruction ? `<p class="pc-guided-repair-instruction">${esc(instruction)}</p>` : ''}
          </div>
        </div>
        <div class="pc-guided-repair-fields">${fieldsHTML}</div>
        ${previewFullWidth ? '' : previewHTML}
        ${previewFullWidth ? '' : actionsHTML}
        ${previewFullWidth ? '' : `<div id="${esc(feedbackId)}" aria-live="polite"></div>`}
      </section>
      ${previewFullWidth ? `<div class="pc-guided-repair-footer">${previewHTML}${actionsHTML}<div id="${esc(feedbackId)}" aria-live="polite"></div></div>` : ''}
    </div>`;
}

function getGuidedRepairValues(fieldIds = []) {
  return Object.fromEntries(fieldIds.map(id => [id, document.getElementById(id)?.value.trim() || '']));
}

function wireGuidedRepairWorkspace({
  fieldIds = [],
  previewId,
  nudgeId,
  statusId,
  submitId,
  minLength = 12,
  buildPreview,
  onUpdate = null,
  onSubmit
} = {}) {
  const fields = fieldIds.map(id => document.getElementById(id)).filter(Boolean);
  const preview = document.getElementById(previewId);
  const nudge = document.getElementById(nudgeId);
  const status = document.getElementById(statusId);
  const submit = document.getElementById(submitId);
  if (!fields.length || !preview || !status || !submit) return false;

  const update = () => {
    const values = getGuidedRepairValues(fieldIds);
    const ready = fieldIds.filter(id => (values[id] || '').length >= minLength);
    const missing = fieldIds.filter(id => !ready.includes(id));
    const assembled = typeof buildPreview === 'function' ? buildPreview(values) : '';

    preview.textContent = assembled || 'Your repaired reflection prompt will assemble here as you complete the four ingredients.';
    preview.classList.toggle('is-empty', !assembled);
    status.textContent = `${ready.length} of ${fieldIds.length} ingredients ready`;
    submit.disabled = ready.length !== fieldIds.length;

    if (nudge) {
      if (missing.length) {
        nudge.style.display = 'block';
        nudge.innerHTML = `<strong>Pixel's nudge:</strong> Complete each ingredient so the repaired prompt can require evidence, evaluation, and a next move.`;
      } else {
        nudge.style.display = 'none';
        nudge.innerHTML = '';
      }
    }

    if (typeof onUpdate === 'function') onUpdate(values, assembled, ready);
  };

  fields.forEach(field => field.addEventListener('input', () => {
    if (typeof autoGrow === 'function') autoGrow(field);
    update();
  }));
  if (typeof onSubmit === 'function') submit.addEventListener('click', onSubmit, { once: true });
  update();
  return true;
}

function mountScenarioActivity({
  container = document.getElementById('inputContainer'),
  scenarioIndex: index = scenarioIndex,
  progressHTML = '',
  contentHTML = '',
  focusSelector = ''
} = {}) {
  if (!container || Number(index) !== Number(scenarioIndex)) return false;
  container.className = 'pc-scenario-workbench';
  container.style.display = 'flex';
  container.innerHTML = `
    <div class="pc-scenario-stage">
      ${buildScenarioMissionHTML(index, { extraHTML: progressHTML })}
      ${contentHTML}
    </div>`;
  resetSectionScroll(container);
  if (focusSelector) {
    pcScheduleScenarioTask(() => {
      if (Number(index) !== Number(scenarioIndex)) return;
      const target = container.querySelector(focusSelector);
      if (!target) return;
      try {
        target.focus({ preventScroll: true });
      } catch(e) {
        target.focus();
        resetSectionScroll(container);
      }
      // Keep the Mission Briefing anchored at the top even if a browser ignores
      // preventScroll or performs a delayed focus scroll after layout settles.
      requestAnimationFrame(() => {
        if (Number(index) === Number(scenarioIndex)) resetSectionScroll(container);
      });
    }, 80, index);
  }
  return true;
}

function wireExactSelection({ rootId, inputName, limit, statusId, submitId, onSubmit }) {
  const root = document.getElementById(rootId);
  const status = document.getElementById(statusId);
  const submit = document.getElementById(submitId);
  if (!root || !status || !submit) return;
  const inputs = [...root.querySelectorAll(`input[name="${inputName}"]`)];

  const update = changed => {
    let selected = inputs.filter(input => input.checked);
    if (selected.length > limit && changed) {
      changed.checked = false;
      selected = inputs.filter(input => input.checked);
      status.textContent = `Choose only ${limit}. ${selected.length} of ${limit} selected.`;
    } else {
      status.textContent = `${selected.length} of ${limit} selected`;
    }
    submit.disabled = selected.length !== limit;
    inputs.forEach(input => input.closest('.pc-choice-card')?.classList.toggle('selected', input.checked));
  };

  root.addEventListener('change', event => {
    const input = event.target.closest?.(`input[name="${inputName}"]`);
    if (input) update(input);
  });
  submit.addEventListener('click', onSubmit, { once: true });
  update(null);
}

function getCheckedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
}

function disableScenarioChoices(name, submitId) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(input => { input.disabled = true; });
  const submit = document.getElementById(submitId);
  if (submit) submit.disabled = true;
}

function renderScenarioFeedback({ panelId, tone = 'developing', heading, text, actionsHTML = '' } = {}) {
  const panel = document.getElementById(panelId);
  if (!panel) return null;
  panel.innerHTML = `
    <div class="pc-feedback-card is-${esc(tone)}">
      <div class="pc-feedback-heading">${esc(heading)}</div>
      <p>${esc(text)}</p>
      <div class="pc-feedback-actions">${actionsHTML}</div>
    </div>`;
  panel.querySelector('button')?.focus();
  return panel;
}
