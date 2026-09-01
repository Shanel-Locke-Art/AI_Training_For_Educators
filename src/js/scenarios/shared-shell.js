/* PROMPTCRAFT SHARED SCENARIO SHELL
   Scenario lookup, mission briefing, scroll reset, input visibility, and the
   locked-scenario placeholder. */

// ── SHARED SCENARIO STRUCTURE ─────────────────────────
// Scenario 1 established the clean mission-briefing pattern. The remaining
// scenarios now use the same anatomy rather than each inventing another card.
function getScenarioUI(index = scenarioIndex) {
  return SCENARIO_UI[index] || SCENARIO_UI[SCENARIO_INDEX.CONTENT_AVALANCHE];
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
      <p class="pc-shell-note">This scenario is intentionally locked while its gameplay and instructional design are rebuilt. Scenario 1 has an unlocked Canvas evidence preview, and Scenarios 3 and 4 are currently playable.</p>
      <div class="pc-shell-actions">
        <button type="button" class="pc-shell-primary" data-pc-action="open-main-menu" data-pc-panel="scenarios">Return to Scenario Select</button>
        <button type="button" class="pc-shell-secondary" data-pc-action="launch-scenario" data-pc-scenario-index="2" data-pc-skip-name-gate="true">Play Scenario 3</button>
      </div>
    </section>`;
  resetSectionScroll(area, container);
}

