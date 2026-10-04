/* S1 activity screens composed with shared learning presentation. */

function pcRenderS1MayaPanel(quote = PC_S1_LEARNING_DEFAULT_QUOTE) {
  return pcRenderCanvasStudentPanel({ name: 'Maya', portraitSrc: ASSETS.images.students.maya.neutral, quote, idPrefix: 'pcS1Maya' });
}

function pcRenderS1CanvasGlobalNav() {
  return pcRenderCanvasGlobalNav();
}

function pcRenderS1CanvasCourseNav() {
  return pcRenderCanvasCourseNav();
}

function pcRenderS1CanvasTopbar(context = 'Modules') {
  return pcRenderCanvasTopbar({ context });
}

function pcRenderS1ModuleRows() {
  return PC_S1_LEARNING_ITEMS.map((item, index) => {
    const opened = pcS1LearningState.opened.has(index);
    return `
      <li class="pc-s1-canvas-module-row${opened ? ' is-viewed' : ''}">
        <span class="pc-s1-canvas-row-indent" aria-hidden="true"></span>
        <span class="pc-s1-canvas-doc-icon" aria-hidden="true"></span>
        <button type="button" class="pc-s1-canvas-item-link" data-pc-action="s1-learning-open-item" data-pc-item-index="${index}">
          <span class="pc-s1-canvas-item-title">${esc(item.moduleTitle)}</span>
        </button>
        <span class="pc-s1-canvas-item-type">${esc(item.typeLabel)}</span>
        <span class="pc-s1-canvas-status" aria-label="${opened ? 'Viewed' : 'Not yet viewed'}" title="${opened ? 'Viewed' : 'Not yet viewed'}">${opened ? '✓' : ''}</span>
      </li>`;
  }).join('');
}

function pcRenderS1CanvasShell(mainHTML, context = 'Modules') {
  return pcRenderCanvasShell(mainHTML, { context });
}

function pcRenderS1CanvasModule() {
  const allOpened = pcS1LearningAllOpened();
  return pcRenderS1CanvasShell(`
    <div class="pc-s1-canvas-module-toolbar"><button type="button" data-pc-action="s1-learning-prevent-link">Collapse All</button></div>
    <div class="pc-s1-canvas-jump"><span aria-hidden="true">▸</span><strong>Jump to Module</strong></div>
    <section class="pc-s1-canvas-module" aria-labelledby="pcS1CanvasModuleTitle">
      <div class="pc-s1-canvas-module-head"><span aria-hidden="true">⌄</span><h2 id="pcS1CanvasModuleTitle">Module 3: Food Access</h2><span class="pc-s1-canvas-module-requirement">Complete all items</span></div>
      <ul class="pc-s1-canvas-module-list">${pcRenderS1ModuleRows()}</ul>
    </section>
    <div class="pc-s1-explore-footer">
      <div class="pc-s1-explore-progress" aria-live="polite">
        <strong>${esc(pcS1LearningProgressText())}</strong>
        <span>${allOpened ? 'You have inspected every activity.' : 'Open every activity to understand what Maya is being asked to do.'}</span>
      </div>
      <button type="button" class="pc-shell-primary" data-pc-action="s1-learning-complete-explore" ${allOpened ? '' : 'disabled aria-disabled="true"'}>Continue</button>
    </div>`, 'Modules');
}

function pcRenderS1CanvasItem(index) {
  const item = PC_S1_LEARNING_ITEMS[index];
  if (!item) return pcRenderS1CanvasModule();
  const isLast = index === PC_S1_LEARNING_ITEMS.length - 1;
  const allOpened = pcS1LearningAllOpened();
  const nextControl = isLast
    ? (allOpened
        ? '<button type="button" class="pc-s1-canvas-continue" data-pc-action="s1-learning-start-rename">Continue to rename ›</button>'
        : '<button type="button" data-pc-action="s1-learning-show-module">Back to Modules</button>')
    : '<button type="button" aria-label="Next" data-pc-action="s1-learning-next-item">Next ›</button>';
  return pcRenderS1CanvasShell(pcRenderCanvasPage({
    titleId: 'pcS1CanvasItemTitle', title: item.pageTitle, contentHTML: item.contentHTML,
    navigationHTML: `<nav class="pc-s1-canvas-prev-next" aria-label="Canvas item navigation">
      <button type="button" aria-label="Previous" data-pc-action="s1-learning-prev-item" ${index <= 0 ? 'disabled aria-disabled="true"' : ''}>‹ Previous</button>
      ${nextControl}
    </nav>`
  }), item.moduleTitle);
}

function pcRenderS1ExploreWorkspace() {
  const area = document.getElementById('chat');
  if (!area) return false;
  const isItem = pcS1LearningState.view === 'item';
  const item = isItem ? PC_S1_LEARNING_ITEMS[pcS1LearningState.activeIndex] : null;
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;

  area.innerHTML = pcRenderLearningStage({
    className: '', titleId: 'pcS1LearningTitle',
    background: sceneBg,
    taskbarHTML: pcRenderLearningTaskbar({ titleId: 'pcS1LearningTitle', label: `Scenario 1 · Start With the Learning`, title: `Explore Maya's module`, instruction: `Open all five activities and inspect what Maya is actually being asked to do.`, status: `${pcS1LearningProgressText()}` }),
    bodyHTML: pcRenderLearningWorkspace({
      mainHTML: `<section class="pc-s1-canvas-frame" aria-label="Maya's Canvas course">${isItem ? pcRenderS1CanvasItem(pcS1LearningState.activeIndex) : pcRenderS1CanvasModule()}</section>`,
      studentHTML: pcRenderS1MayaPanel(item ? item.mayaQuote : PC_S1_LEARNING_DEFAULT_QUOTE)
    })
  });
  return true;
}

function pcS1RenameProgressText() {
  const completed = pcS1LearningState.renamedTitles.filter(Boolean).length;
  return `${completed} of ${PC_S1_LEARNING_ITEMS.length} titles renamed`;
}

function pcRenderS1RenameRows() {
  return PC_S1_LEARNING_ITEMS.map((item, index) => {
    const saved = pcS1LearningState.renamedTitles[index];
    const active = index === pcS1LearningState.renameIndex;
    return `
      <li class="pc-s1-rename-row${active ? ' is-active' : ''}${saved ? ' is-saved' : ''}">
        <span class="pc-s1-canvas-row-indent" aria-hidden="true"></span>
        <span class="pc-s1-canvas-doc-icon" aria-hidden="true"></span>
        <div class="pc-s1-rename-row-copy">
          <span class="pc-s1-rename-original">${esc(item.moduleTitle)}</span>
          ${saved ? `<span class="pc-s1-rename-saved-title">${esc(saved)}</span>` : '<span class="pc-s1-rename-pending">Needs a clearer title</span>'}
        </div>
        <span class="pc-s1-canvas-item-type">${esc(item.typeLabel)}</span>
        <span class="pc-s1-canvas-status" aria-label="${saved ? 'Renamed' : active ? 'Current item' : 'Not yet renamed'}">${saved ? '✓' : ''}</span>
      </li>`;
  }).join('');
}

function pcRenderS1RenameCanvas() {
  const item = PC_S1_LEARNING_ITEMS[pcS1LearningState.renameIndex];
  const saved = pcS1LearningState.renamedTitles[pcS1LearningState.renameIndex] || '';
  return pcRenderS1CanvasShell(`
    <div class="pc-s1-rename-instructions">
      <h1>Rename the unclear module items</h1>
      <p>Type a clearer title for the highlighted activity. Maya will remind you what the page contained, but she will not give you the answer.</p>
    </div>
    <form class="pc-s1-rename-editor" data-pc-submit-action="s1-learning-save-rename">
      <div class="pc-s1-rename-editor-heading">
        <span>Current title</span>
        <strong>${esc(item.moduleTitle)}</strong>
      </div>
      <label for="pcS1RenameInput">New title</label>
      <div class="pc-s1-rename-input-row">
        <input id="pcS1RenameInput" name="newTitle" type="text" value="${esc(saved)}" autocomplete="off" required maxlength="90" placeholder="Type a clearer title" aria-describedby="pcS1RenameHelp pcS1RenameNotice" />
        <button type="submit" class="pc-shell-primary">Save title</button>
      </div>
      <p id="pcS1RenameHelp" class="pc-s1-rename-help">Use language that helps a student understand what they will open or do. Do not worry about making it perfect.</p>
      <p id="pcS1RenameNotice" class="pc-s1-rename-notice" aria-live="polite">${esc(pcS1LearningState.renameNotice || '')}</p>
    </form>
    <section class="pc-s1-canvas-module pc-s1-rename-module" aria-labelledby="pcS1RenameModuleTitle">
      <div class="pc-s1-canvas-module-head">
        <span aria-hidden="true">⌄</span>
        <h2 id="pcS1RenameModuleTitle">Module 3: Food Access</h2>
        <span class="pc-s1-canvas-module-requirement">Rename all items</span>
      </div>
      <ul class="pc-s1-canvas-module-list">${pcRenderS1RenameRows()}</ul>
    </section>`, 'Modules');
}

function pcRenderS1RenameWorkspace() {
  const area = document.getElementById('chat');
  if (!area) return false;
  const index = pcS1LearningState.renameIndex;
  const item = PC_S1_LEARNING_ITEMS[index];
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  area.innerHTML = pcRenderLearningStage({
    className: 'pc-s1-renaming', titleId: 'pcS1LearningTitle',
    background: sceneBg,
    taskbarHTML: pcRenderLearningTaskbar({ titleId: 'pcS1LearningTitle', label: `Scenario 1 · Start With the Learning`, title: `Make the module easier to navigate`, instruction: `Rename each activity so Maya can tell what it contains before opening it.`, status: `${pcS1RenameProgressText()}` }),
    bodyHTML: pcRenderLearningWorkspace({
      mainHTML: `<section class="pc-s1-canvas-frame" aria-label="Rename Maya's Canvas module items">${pcRenderS1RenameCanvas()}</section>`,
      studentHTML: pcRenderS1MayaPanel(item.mayaQuote)
    })
  });
  requestAnimationFrame(() => document.getElementById('pcS1RenameInput')?.focus());
  return true;
}

function pcRenderS1RenameComplete() {
  pcS1LearningState.view = 'rename-complete';
  const area = document.getElementById('chat');
  if (!area) return false;
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  const rows = PC_S1_LEARNING_ITEMS.map((item, index) => `
    <li><span>${esc(item.moduleTitle)}</span><strong>${esc(pcS1LearningState.renamedTitles[index])}</strong></li>`).join('');
  area.innerHTML = pcRenderLearningStage({
    className: 'pc-s1-renaming', titleId: 'pcS1RenameCompleteTitle',
    background: sceneBg,
    taskbarHTML: pcRenderLearningTaskbar({ titleId: 'pcS1RenameCompleteTitle', label: `Scenario 1 · Start With the Learning`, title: `The module names are clearer`, instruction: `Now organize the activities so Maya can see how each one functions in the learning path.`, status: `5 of 5 titles renamed` }),
    bodyHTML: pcRenderLearningWorkspace({
      mainHTML: `<section class="pc-s1-rename-summary" aria-labelledby="pcS1RenameSummaryTitle">
            <h2 id="pcS1RenameSummaryTitle">Your renamed module</h2>
            <ul>${rows}</ul>
            <div class="pc-s1-rename-summary-actions">
              <button type="button" class="pc-shell-secondary" data-pc-action="s1-learning-start-rename">Review or revise titles</button>
              <button type="button" class="pc-shell-primary" data-pc-action="s1-learning-start-organize">Organize activities</button>
            </div>
          </section>`,
      studentHTML: pcRenderS1MayaPanel('I can tell what these activities are now. Next I need to understand how they fit together, not just what they are called.')
    })
  });
  resetSectionScroll(area);
  return true;
}

function pcS1OrganizeProgressText() {
  const placed = Object.values(pcS1LearningState.organization || {}).filter(Boolean).length;
  return `${placed} of ${PC_S1_LEARNING_ITEMS.length} activities placed`;
}

function pcRenderS1OrganizeCard(item, index) {
  const title = pcS1LearningState.renamedTitles[index] || item.moduleTitle;
  return `<div class="pc-s1-organize-card pc-drag-card" draggable="true" tabindex="0" role="button"
    aria-grabbed="false" data-pc-drag-card="${esc(item.id)}" data-pc-drag-group="activity" data-pc-home-tray="__tray__">
      <span class="pc-s1-canvas-doc-icon" aria-hidden="true"></span>
      <span class="pc-s1-organize-card-copy"><strong>${esc(title)}</strong><small>${esc(item.typeLabel)}</small></span>
    </div>`;
}

function pcRenderS1OrganizeCanvas() {
  const placements = pcS1LearningState.organization || {};
  const cardByZone = zoneId => PC_S1_LEARNING_ITEMS.map((item, index) => ({ item, index }))
    .filter(entry => (placements[entry.item.id] || '') === zoneId)
    .map(entry => pcRenderS1OrganizeCard(entry.item, entry.index)).join('');
  const unplaced = PC_S1_LEARNING_ITEMS.map((item, index) => ({ item, index }))
    .filter(entry => !(placements[entry.item.id] || ''))
    .map(entry => pcRenderS1OrganizeCard(entry.item, entry.index)).join('');
  const zones = PC_S1_ORGANIZE_ZONES.map(zone => `
    <section class="pc-s1-organize-zone" tabindex="0" role="button" aria-label="${esc(zone.label)} text header destination"
      data-pc-drop-zone="${esc(zone.id)}" data-pc-accept-group="activity" data-pc-capacity="5">
      <div class="pc-s1-organize-text-header">
        <strong>${esc(zone.label)}</strong>
        <span>${esc(zone.definition)}</span>
      </div>
      <div class="pc-s1-organize-zone-items" data-pc-zone-cards="${esc(zone.id)}">${cardByZone(zone.id)}</div>
    </section>`).join('');
  return pcRenderS1CanvasShell(`
    <div class="pc-s1-organize-instructions">
      <h1>Organize the learning path</h1>
      <p>Move every activity under the Canvas text header that best describes its purpose. Drag an activity, or select it and then select a destination.</p>
    </div>
    <div class="pc-s1-organize-board" id="pcS1OrganizeBoard">
      <section class="pc-s1-organize-tray" data-pc-drop-zone="__tray__" data-pc-is-tray="true" data-pc-capacity="999" aria-label="Activities not yet placed">
        <div class="pc-s1-organize-tray-heading"><strong>1. Activities to organize</strong><span>Select an activity, then choose a header on the right—or drag it across.</span></div>
        <div class="pc-s1-organize-tray-items" data-pc-zone-cards="__tray__">${unplaced}</div>
      </section>
      <section class="pc-s1-organize-destinations" aria-labelledby="pcS1DestinationHeading">
        <div class="pc-s1-organize-destination-heading"><strong id="pcS1DestinationHeading">2. Canvas text headers</strong><span>Place each activity under the header that describes its purpose.</span></div>
        <div class="pc-s1-organize-zones">${zones}</div>
      </section>
    </div>
    <div class="pc-s1-organize-footer">
      <span id="pcS1OrganizeStatus" tabindex="-1" role="status" aria-live="polite">${esc(pcS1OrganizeProgressText())}</span>
      <button type="button" id="pcS1OrganizeContinue" class="pc-shell-primary">Continue</button>
    </div>
    <p class="pc-s1-organize-notice" id="pcS1OrganizeNotice" aria-live="polite">${esc(pcS1LearningState.organizationNotice || '')}</p>
  `, 'Modules');
}

function pcRenderS1OrganizeWorkspace() {
  pcS1LearningState.view = 'organize';
  const area = document.getElementById('chat');
  if (!area) return false;
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  area.innerHTML = pcRenderLearningStage({
    className: 'pc-s1-organizing', titleId: 'pcS1OrganizeTitle',
    background: sceneBg,
    taskbarHTML: pcRenderLearningTaskbar({ titleId: 'pcS1OrganizeTitle', label: `Scenario 1 · Start With the Learning`, title: `Organize the activities`, instruction: `Use Canvas-style text headers to make the purpose of the learning path visible.`, status: `${pcS1OrganizeProgressText()}` }),
    bodyHTML: pcRenderLearningWorkspace({
      mainHTML: `<section class="pc-s1-canvas-frame" aria-label="Organize Maya's Canvas activities">${pcRenderS1OrganizeCanvas()}</section>`,
      studentHTML: pcRenderS1MayaPanel('These headings help me see the learning path. I need to decide whether each activity prepares me, lets me practice, or shows what I can actually do.')
    })
  });
  requestAnimationFrame(() => {
    wireDragBoard({
      rootId: 'pcS1OrganizeBoard',
      statusId: 'pcS1OrganizeStatus',
      submitId: 'pcS1OrganizeContinue',
      requiredCardIds: PC_S1_LEARNING_ITEMS.map(item => item.id),
      onMove: placements => {
        pcS1LearningState.organization = { ...placements };
        const status = document.querySelector('.pc-s1-learning-task-status');
        if (status) status.textContent = pcS1OrganizeProgressText();
      },
      onUpdate: placements => {
        pcS1LearningState.organization = { ...placements };
        const status = document.querySelector('.pc-s1-learning-task-status');
        if (status) status.textContent = pcS1OrganizeProgressText();
      },
      onSubmit: () => pcCompleteS1Organize()
    });
  });
  return true;
}

function pcRenderS1RevisedModuleCanvas() {
  const placements = pcS1LearningState.organization || {};
  const review = pcEvaluateS1Organization();
  const rowsFor = zoneId => PC_S1_LEARNING_ITEMS.map((item, index) => ({ item, index }))
    .filter(entry => placements[entry.item.id] === zoneId)
    .map(({ item, index }) => {
      const evaluated = review.items.find(entry => entry.id === item.id);
      const purposeReasons = {
        'food-access-reading': 'The reading builds background knowledge students need before they analyze the problem.',
        'food-access-video': 'The video introduces examples and barriers students need before they apply the ideas.',
        'module-terms': 'The terms page supplies vocabulary students need before discussion or assessment.',
        'discussion-3': 'The discussion lets students practice explaining a barrier and learn from peer responses.',
        'quiz-3': 'The quiz produces evidence of what students remember, even though it does not yet measure the full intended analysis.'
      };
      const reason = purposeReasons[item.id] || `${item.typeLabel} supports ${PC_S1_PURPOSE_LABELS[evaluated?.suggested] || 'this part of the path'}.`;
      const feedback = evaluated?.matches
        ? `<span class="pc-s1-module-feedback is-good"><strong>Fits under ${esc(PC_S1_PURPOSE_LABELS[zoneId])}</strong><small>${esc(reason)}</small></span>`
        : `<span class="pc-s1-module-feedback is-reconsider"><strong>Move to ${esc(PC_S1_PURPOSE_LABELS[evaluated?.suggested] || 'another section')}</strong><small>${esc(reason)}</small></span>`;
      return `
      <li class="pc-s1-canvas-module-row is-viewed pc-s1-final-module-row${evaluated?.matches ? ' is-good-placement' : ' is-reconsider-placement'}">
        <span class="pc-s1-canvas-row-indent" aria-hidden="true"></span>
        <span class="pc-s1-canvas-doc-icon" aria-hidden="true"></span>
        <span class="pc-s1-final-module-title">${esc(pcS1LearningState.renamedTitles[index] || item.moduleTitle)}</span>
        ${feedback}
      </li>`;
    }).join('');

  const sections = PC_S1_ORGANIZE_ZONES.map(zone => `
    <section class="pc-s1-final-module-section" aria-labelledby="pcS1Final-${esc(zone.id)}">
      <div class="pc-s1-final-text-header">
        <strong id="pcS1Final-${esc(zone.id)}">${esc(zone.label)}</strong>
        <span>${esc(zone.definition)}</span>
      </div>
      <ul class="pc-s1-canvas-module-list">${rowsFor(zone.id)}</ul>
    </section>`).join('');

  const summary = review.mismatches.length
    ? `<div class="pc-s1-module-review-summary is-reconsider"><strong>${review.matchCount} of ${review.total} placements fit the suggested learning path.</strong><span>Babbage and Maya will point out placements worth reconsidering before this is added to your guide.</span></div>`
    : `<div class="pc-s1-module-review-summary is-good"><strong>All ${review.total} placements fit the suggested learning path.</strong><span>The structure now moves clearly from preparation to practice to evidence.</span></div>`;

  return pcRenderS1CanvasShell(`
    <div class="pc-s1-final-module-intro">
      <h1>Module 3: Food Access</h1>
      <p>This is the module after your title and text-header changes.</p>
    </div>
    ${summary}
    <div class="pc-s1-final-module-sections">${sections}</div>
    <div class="pc-s1-final-module-actions">
      <button type="button" class="pc-shell-primary" data-pc-action="s1-learning-build-guide-step1">${pcS1LearningState.guide?.step1?.added ? 'View Step 1 of My Course Guide' : 'Build Step 1 of My Course Guide'}</button>
    </div>`, 'Modules');
}

function pcRenderS1RevisedModuleOverview() {
  pcS1LearningState.view = 'revised-overview';
  const area = document.getElementById('chat');
  if (!area) return false;
  if (!pcS1LearningState.organizationXPEarned && typeof awardS1PracticeXP === 'function') {
    pcS1LearningState.organizationXPEarned = awardS1PracticeXP(0, 3);
  }
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  const xpNote = pcS1LearningState.organizationXPEarned
    ? `Navigation repair complete · +${pcS1LearningState.organizationXPEarned} XP`
    : 'Navigation repair complete';
  area.innerHTML = pcRenderLearningStage({
    className: 'pc-s1-revised-overview', titleId: 'pcS1RevisedOverviewTitle',
    background: sceneBg,
    taskbarHTML: pcRenderLearningTaskbar({ titleId: 'pcS1RevisedOverviewTitle', label: `Scenario 1 · Start With the Learning`, title: `See the module you rebuilt`, instruction: `Your clearer titles and Canvas text headers are now shown together as Maya would encounter them.`, status: `${xpNote}` }),
    bodyHTML: pcRenderLearningWorkspace({
      mainHTML: `<section class="pc-s1-canvas-frame" aria-label="Revised Maya Canvas module">${pcRenderS1RevisedModuleCanvas()}</section>`,
      studentHTML: pcRenderS1MayaPanel(pcEvaluateS1Organization().mayaQuote)
    })
  });
  resetSectionScroll(area);
  return true;
}

function pcRenderS1Diagnosis() {
  pcS1LearningState.view = 'diagnosis';
  const area = document.getElementById('chat');
  if (!area) return false;
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  const selected = pcS1LearningState.diagnosisChoice;
  const choices = pcRenderLearningDiagnosisChoices({ choices: PC_S1_DIAGNOSIS_CHOICES, selected, action: 's1-learning-select-diagnosis' });

  area.innerHTML = pcRenderLearningStage({
    className: 'pc-s1-diagnosis', titleId: 'pcS1DiagnosisTitle',
    background: sceneBg,
    taskbarHTML: pcRenderLearningTaskbar({ titleId: 'pcS1DiagnosisTitle', label: `Scenario 1 · Start With the Learning`, title: `Check whether the activities match the learning`, instruction: `Clear navigation helps Maya find the work. Alignment determines whether that work lets her demonstrate the intended learning.`, status: `Alignment check` }),
    bodyHTML: pcRenderLearningWorkspace({
      mainHTML: `<form class="pc-s1-diagnosis-card" data-pc-submit-action="s1-learning-submit-diagnosis" aria-labelledby="pcS1DiagnosisQuestion">
            <div class="pc-s1-diagnosis-purpose">
              <strong>Why you are doing this</strong>
              <p>You already made the module easier to follow. Now compare what the instructor wants Maya to do with what the current activities actually ask her to produce. The gap between those two is the design problem to solve next.</p>
            </div>
            <div class="pc-s1-diagnosis-compare" aria-label="Alignment comparison">
              <div class="pc-s1-diagnosis-context is-intent">
                <span>Instructor intent</span>
                <strong>Analyze a community food-access problem and use evidence to recommend an appropriate response.</strong>
              </div>
              <div class="pc-s1-diagnosis-context is-evidence">
                <span>Current evidence</span>
                <strong>Reading, video, vocabulary, a discussion describing a barrier, and a quiz checking terms and examples.</strong>
              </div>
            </div>
            <div class="pc-s1-diagnosis-question-block">
              <span class="pc-s1-result-eyebrow">Your decision</span>
              <h2 id="pcS1DiagnosisQuestion">What is the main alignment problem?</h2>
              <p class="pc-s1-diagnosis-help">Choose the single issue that matters most for whether this module demonstrates the intended learning.</p>
            </div>
            <div class="pc-s1-diagnosis-choices">${choices}</div>
            ${selected ? `<div class="pc-s1-diagnosis-rationale">
              <label for="pcS1DiagnosisRationale"><strong>Explain what you noticed before checking your decision</strong><span>Your explanation will appear beside the alignment feedback so you can compare it with your reasoning. A short de-identified copy is also included in the study record. Do not include names.</span></label>
              <textarea id="pcS1DiagnosisRationale" name="diagnosisRationale" rows="3" minlength="10" maxlength="500" required aria-describedby="pcS1DiagnosisRationaleStatus" data-pc-input-action="s1-learning-update-diagnosis-rationale" placeholder="For example: The objective asks students to recommend a response, but the activities only check recall and description.">${esc(pcS1LearningState.diagnosisRationale)}</textarea>
              <p class="pc-s1-response-status" id="pcS1DiagnosisRationaleStatus">${pcS1LearningState.diagnosisRationale.trim().length >= 10 ? 'Ready to compare with the alignment feedback.' : 'Required: enter at least 10 characters. This is about your reasoning, not polished writing.'}</p>
              ${pcS1LearningState.diagnosisNotice ? `<p class="pc-s1-diagnosis-notice" role="alert">${esc(pcS1LearningState.diagnosisNotice)}</p>` : ''}
              <button type="submit" class="pc-shell-primary pc-s1-diagnosis-submit"${pcS1LearningState.diagnosisRationale.trim().length >= 10 ? '' : ' disabled'}>Compare my reasoning</button>
            </div>` : ''}
          </form>`,
      studentHTML: pcRenderS1MayaPanel('The module is clearer now. I can see what I am supposed to do. The question is whether any of this actually lets me show the performance the instructor cares about.')
    })
  });
  resetSectionScroll(area);
  return true;
}

function pcRenderS1DiagnosisResult() {
  pcS1LearningState.view = 'diagnosis-result';
  const area = document.getElementById('chat');
  if (!area) return false;
  const selected = pcGetS1DiagnosisChoice();
  const correct = selected?.id === 'evidence-gap';
  const sceneBg = ASSETS.images.backgrounds.scenarios?.[0] || ASSETS.images.backgrounds.classroom;
  area.innerHTML = pcRenderLearningStage({
    className: 'pc-s1-diagnosis-result', titleId: 'pcS1DiagnosisResultTitle',
    background: sceneBg,
    taskbarHTML: pcRenderLearningTaskbar({ titleId: 'pcS1DiagnosisResultTitle', label: `Scenario 1 · Start With the Learning`, title: `Diagnosis recorded`, instruction: `${correct ? 'You identified the difference between useful preparation and evidence of the intended performance.' : 'Your diagnosis is saved. Compare it with the intended performance before moving into the next S1 phase.'}`, status: `${pcS1LearningState.diagnosisXPEarned ? `Diagnosis complete · +${pcS1LearningState.diagnosisXPEarned} XP` : 'Diagnosis complete'}` }),
    bodyHTML: pcRenderLearningWorkspace({
      mainHTML: `<section class="pc-s1-checkpoint-card pc-s1-diagnosis-result-card">
            <span class="pc-s1-result-eyebrow">Your diagnosis</span>
            <h2>${esc(selected?.text || '')}</h2>
            <p>${correct
              ? 'That is the central alignment issue. Maya has reading, vocabulary, discussion, and recall work, but none of the current activities asks her to analyze a community food-access problem and recommend a response using evidence.'
              : 'This issue may affect the experience, but the instructor intent asks Maya to analyze a problem and recommend a response using evidence. The next design question is whether the current activities actually produce that evidence.'}</p>
            <div class="pc-s1-diagnosis-result-reason"><strong>Your reasoning</strong><p>${esc(pcS1LearningState.diagnosisRationale)}</p></div>
            <div class="pc-s1-diagnosis-result-actions">
              <button type="button" class="pc-shell-secondary" data-pc-action="s1-learning-continue-diagnosis">Review Diagnosis 1</button>
              <button type="button" class="pc-shell-primary" data-pc-action="s1-learning-start-my-course">Continue to My Course</button>
            </div>
          </section>`,
      studentHTML: pcRenderS1MayaPanel(correct
            ? 'That is the difference I was missing. The module is easier to navigate now, but I still need a chance to show that I can analyze a problem and recommend a response.'
            : 'The module is clearer now. I still need to compare what I completed with what the instructor says I should actually be able to do.')
    })
  });
  resetSectionScroll(area);
  return true;
}
