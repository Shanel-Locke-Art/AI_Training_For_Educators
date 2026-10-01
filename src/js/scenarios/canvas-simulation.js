/* Shared Canvas presentation. S1 wrappers retain the original DOM and actions. */

function pcRenderCanvasGlobalNav({ preventAction = 's1-learning-prevent-link', moAsset = PC_S1_MO_ASSET } = {}) {
  return `
    <nav class="pc-s1-canvas-global-nav" aria-label="Canvas global navigation">
      <div class="pc-s1-canvas-global-brand" aria-hidden="true">
        <img src="${esc(moAsset)}" alt="" />
      </div>
      <a href="#" data-pc-action="${esc(preventAction)}"><span class="pc-s1-canvas-global-dot" aria-hidden="true"></span><b>Account</b></a>
      <a href="#" data-pc-action="${esc(preventAction)}"><span class="pc-s1-canvas-global-glyph" aria-hidden="true">⌂</span><b>Dashboard</b></a>
      <a href="#" class="is-active" data-pc-action="${esc(preventAction)}"><span class="pc-s1-canvas-global-glyph" aria-hidden="true">▣</span><b>Courses</b></a>
      <a href="#" data-pc-action="${esc(preventAction)}"><span class="pc-s1-canvas-global-glyph" aria-hidden="true">□</span><b>Calendar</b></a>
      <a href="#" data-pc-action="${esc(preventAction)}"><span class="pc-s1-canvas-global-glyph" aria-hidden="true">▱</span><b>Inbox</b></a>
      <a href="#" data-pc-action="${esc(preventAction)}"><span class="pc-s1-canvas-global-glyph" aria-hidden="true">◷</span><b>History</b></a>
      <a href="#" data-pc-action="${esc(preventAction)}"><span class="pc-s1-canvas-global-glyph" aria-hidden="true">?</span><b>Help</b></a>
    </nav>`;
}

function pcRenderCanvasCourseNav({ preventAction = 's1-learning-prevent-link', moduleAction = 's1-learning-show-module' } = {}) {
  return `
    <nav class="pc-s1-canvas-course-nav" aria-label="Canvas course navigation">
      <a href="#" data-pc-action="${esc(preventAction)}">Home</a>
      <a href="#" class="is-active" aria-current="page" data-pc-action="${esc(moduleAction)}">Modules</a>
      <a href="#" data-pc-action="${esc(preventAction)}">Grades</a>
      <a href="#" data-pc-action="${esc(preventAction)}">Panorama</a>
      <a href="#" data-pc-action="${esc(preventAction)}">Discussions</a>
      <a href="#" data-pc-action="${esc(preventAction)}">Assignments</a>
    </nav>`;
}

function pcRenderCanvasTopbar({ context = 'Modules', courseTitle = 'Community Health', preventAction = 's1-learning-prevent-link' } = {}) {
  return `
    <div class="pc-s1-canvas-topbar">
      <button type="button" class="pc-s1-canvas-hamburger" data-pc-action="${esc(preventAction)}" aria-label="Canvas navigation menu"><span></span><span></span><span></span></button>
      <div class="pc-s1-canvas-course-title">${esc(courseTitle)} <span aria-hidden="true">›</span> <strong>${esc(context)}</strong></div>
    </div>`;
}

function pcRenderCanvasShell(mainHTML, { context = 'Modules', courseTitle = 'Community Health', preventAction = 's1-learning-prevent-link', moduleAction = 's1-learning-show-module', moAsset = PC_S1_MO_ASSET } = {}) {
  return `
    <div class="pc-s1-canvas-app" aria-label="Canvas course simulation">
      ${pcRenderCanvasGlobalNav({ preventAction, moAsset })}
      <div class="pc-s1-canvas-course-shell">
        ${pcRenderCanvasTopbar({ context, courseTitle, preventAction })}
        <div class="pc-s1-canvas-course-body">
          ${pcRenderCanvasCourseNav({ preventAction, moduleAction })}
          <main class="pc-s1-canvas-main">${mainHTML}</main>
        </div>
      </div>
    </div>`;
}

function pcRenderCanvasStudentPanel({ name, portraitSrc = '', quote = '', idPrefix = 'pcStudent' } = {}) {
  return `
    <aside class="pc-s1-maya-panel" aria-labelledby="${esc(idPrefix)}Name">
      <div class="pc-s1-maya-panel-inner">
        <div class="pc-s1-maya-quote" aria-live="polite">
          <span id="${esc(idPrefix)}Name">${esc(name)}</span>
          <p>${esc(quote)}</p>
        </div>
        <div class="pc-s1-maya-art-wrap">
          <img class="pc-s1-maya-art" src="${esc(portraitSrc)}" alt="${esc(name)}" />
        </div>
      </div>
    </aside>`;
}
