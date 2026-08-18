/* PROMPTCRAFT SHARED SCENARIO FRAMEWORK
   Reusable mission, progress, choice, feedback, and activity-shell helpers.
   Scenario 1 remains the visual/behavioral regression reference. */

// ── SHARED SCENARIO STRUCTURE ─────────────────────────
// Scenario 1 established the clean mission-briefing pattern. The remaining
// scenarios now use the same anatomy rather than each inventing another card.
function getScenarioUI(index = scenarioIndex) {
  return SCENARIO_UI[index] || SCENARIO_UI[SCENARIO_INDEX.ENGAGEMENT];
}

function buildScenarioMissionHTML(index, options = {}) {
  const ui = getScenarioUI(index);
  const eyebrow = options.eyebrow || 'Mission Briefing';
  const title = options.title || ui.missionTitle;
  const copy = options.copy || ui.missionCopy;
  const extraClass = options.className ? ` ${options.className}` : '';
  const extraHTML = options.extraHTML || '';

  return `
    <section class="scenario-mission${extraClass}" role="region" aria-label="${esc(eyebrow)}">
      <div class="mission-eyebrow">${esc(eyebrow)}</div>
      <div class="mission-title">${esc(title)}</div>
      <div class="mission-copy">${esc(copy)}</div>
      ${extraHTML}
    </section>`;
}

function resetSectionScroll(...elements) {
  const targets = [
    document.scrollingElement,
    document.documentElement,
    document.body,
    document.getElementById('chat'),
    document.getElementById('inputContainer'),
    ...elements
  ].filter(Boolean);

  const reset = () => {
    targets.forEach(target => {
      try { target.scrollTop = 0; } catch(e) {}
      try { target.scrollLeft = 0; } catch(e) {}
    });
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); }
    catch(e) { try { window.scrollTo(0, 0); } catch(_) {} }
  };

  reset();
  requestAnimationFrame(reset);
}

function setScenarioInputVisible(visible, { focus = false } = {}) {
  const container = document.getElementById('inputContainer');
  if (!container) return;
  container.style.display = visible ? '' : 'none';
  if (visible && focus) {
    setTimeout(() => document.getElementById('promptInput')?.focus(), 100);
  }
}

function renderScenarioPlaceholder(index) {
  const ui = getScenarioUI(index);
  const area = document.getElementById('chat');
  const container = document.getElementById('inputContainer');
  if (!area) return;

  if (container) {
    container.className = 'pc-scenario-placeholder-host';
    container.innerHTML = '';
    container.style.display = 'none';
  }

  const plannedSteps = Array.isArray(ui.plannedLoop) && ui.plannedLoop.length
    ? `<ol class="pc-shell-loop">${ui.plannedLoop.map(step => `<li>${esc(step)}</li>`).join('')}</ol>`
    : '';

  area.innerHTML = `
    <section class="pc-scenario-shell" role="region" aria-labelledby="pcShellTitle">
      <div class="pc-shell-status">Locked · In development</div>
      <h2 id="pcShellTitle">${esc(ui.tabLabel)} is not yet available</h2>
      <p class="pc-shell-copy">${esc(ui.missionCopy)}</p>
      ${plannedSteps ? `<div class="pc-shell-plan"><h3>Planned game loop</h3>${plannedSteps}</div>` : ''}
      <p class="pc-shell-note">This scenario is intentionally locked while its gameplay and instructional design are rebuilt. Scenario 1 and Scenario 2 are currently available.</p>
      <div class="pc-shell-actions">
        <button type="button" class="pc-shell-primary" data-pc-action="open-main-menu" data-pc-panel="scenarios">Return to Scenario Select</button>
        <button type="button" class="pc-shell-secondary" data-pc-action="launch-scenario" data-pc-scenario-index="1" data-pc-skip-name-gate="true">Play Scenario 2</button>
      </div>
    </section>`;
  resetSectionScroll(area, container);
}


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
