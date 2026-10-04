/* Shared learning-task presentation, extracted from the production S1 loop.
   Keep pc-s1-* selector names as the existing theme/responsive compatibility API.
   HTML slots accept trusted application templates only; never pass raw AI output. */

function pcRenderLearningTaskbar({ label = '', titleId, title = '', instruction = '', status = '' } = {}) {
  return `
      <div class="pc-s1-learning-taskbar">
        <div>
          <span>${esc(label)}</span>
          <h1 id="${esc(titleId)}">${esc(title)}</h1>
          <p>${esc(instruction)}</p>
        </div>
        <div class="pc-s1-learning-task-status">${esc(status)}</div>
      </div>`;
}

function pcRenderLearningStage({ className = '', titleId, background = '', taskbarHTML = '', bodyHTML = '' } = {}) {
  const backgroundStyle = background ? ` style="--pc-s1-learning-bg:url('${esc(background)}')"` : '';
  return `
    <section class="pc-s1-learning pc-scenario-stage${className ? ` ${esc(className)}` : ''}" role="region" aria-labelledby="${esc(titleId)}"${backgroundStyle}>
      ${taskbarHTML}
      ${bodyHTML}
    </section>`;
}

function pcRenderLearningWorkspace({ mainHTML = '', studentHTML = '' } = {}) {
  return `
      <div class="pc-s1-learning-shell">
        <div class="pc-s1-learning-workspace">
          ${mainHTML}
          ${studentHTML}
        </div>
      </div>`;
}

function pcRenderLearningDiagnosisChoices({ choices = [], selected = '', action, choiceAttribute = 'data-pc-diagnosis-id' } = {}) {
  return choices.map(choice => `
    <button type="button" class="pc-s1-diagnosis-choice${selected === choice.id ? ' is-selected' : ''}"
      data-pc-action="${esc(action)}" ${choiceAttribute}="${esc(choice.id)}"
      aria-pressed="${selected === choice.id ? 'true' : 'false'}">
      <span class="pc-s1-diagnosis-radio" aria-hidden="true"></span>
      <span>${esc(choice.text)}</span>
    </button>`).join('');
}
