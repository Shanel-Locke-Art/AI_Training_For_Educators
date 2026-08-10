# PromptCraft project structure

PromptCraft runs as a classic browser application with shared globals. The main application loads one generated stylesheet and two JavaScript files:

1. `styles/promptcraft.css` for the complete ordered application cascade.
2. `functions/dialogue.js` for dialogue content and expression metadata.
3. `functions/app.bundle.js` for the application runtime.

The separate Ideas Wall page loads `styles/wall.css` and `functions/wall.js`. Its page-owned files are intentionally excluded from the main application bundles.

The generated JavaScript bundle is assembled, in order, from:

1. `functions/app.js` for shared state, configuration, research logging, assets, and audio.
2. `functions/app-scenarios.js` for scenario definitions, menus, reusable activity builders, and scenario navigation state.
3. `functions/app-vn.js` for the visual-novel engine, Babbage terminal flows, and responsive scene controllers.
4. `functions/app-workbench.js` for scenario workbenches, scoring, completion, reflection, and development tools.

## Editing JavaScript

Edit the four modular source files. Do not edit `functions/app.bundle.js` directly. Rebuild and validate with:

```bash
python tools/build-production.py
python tools/validate-project.py
python tools/test-runtime.py
```

The build adds defensive semicolon boundaries between JavaScript source files, compiles the complete CSS owner cascade into one runtime stylesheet, and runs `node --check` against every runtime script. Validation checks bundle drift, duplicate HTML IDs, local file references, UI action ownership, CSS structure, retired selectors, exact duplicate CSS rules, asset ownership, the Babbage/OpenAI proxy, synchronized cache versions, and the temporary Claude-analysis hold. The runtime test exercises all eight scenarios at desktop, tablet, and phone sizes, plus onboarding, the Babbage analyzing geometry, and Ideas Wall interactions. It requires Python Playwright and Chromium.

Do not add `async`, `defer`, or `type="module"` to the runtime script tags without first converting the shared globals.


## Phase 2 JavaScript ownership

PromptCraft now routes application-owned button clicks through the delegated `PC_UI_ACTIONS` registry in `functions/app.js`. Static and generated controls declare a `data-pc-action` value; the module that owns the behavior registers the matching handler with `pcRegisterUIActions()`. This keeps rerendered controls from accumulating duplicate listeners and makes action ownership searchable.

Scenario activation is owned by `pcActivateScenario()` in `functions/app-workbench.js`. Scenario index validation, tab unlocking, workspace renderers, and post-introduction actions are shared through the registries in `functions/app-scenarios.js`. Scenario-specific content remains in configuration objects such as `S2_ACTIVITY_CONFIG`, while the reusable renderers own the DOM assembly.

Use native `submit`, `change`, and keyboard events where those semantics matter. Do not replace them with click actions merely for uniformity.

## Phase 3 CSS ownership

`style.css` is the source manifest and records the complete owner order. `tools/build-production.py` compiles all 17 owner files into `styles/promptcraft.css`, which is the only local stylesheet loaded by `index.html`. Do not edit the generated stylesheet directly or load an owner file separately to win a cascade dispute. That is how a stylesheet becomes a geological record.

The compatibility layer in `styles/30-legacy-responsive.css` remains active, but it is now formatted and searchable. Retired selectors from removed navigation, feedback, expression-badge, and terminal-gap interfaces were deleted. `tools/audit-css.py` rejects those selectors if they return and also detects exact duplicate rules.

Modify the existing owner rule whenever possible. Add a new owner file only for a genuinely new screen family or state, and place it deliberately in `style.css`. See `styles/README.md` for the ownership map and maintenance rules.


## Phase 4 hardening

Phase 4 establishes the clean baseline for future interface work. Application controls now use the delegated action registry for click, submit, change, keyboard, and details-toggle behavior; inline HTML event handlers are prohibited by validation. Image fallbacks retain their error handlers, and research payload logging is disabled unless the page is opened with `?debug=1`.

The Ideas Wall owns its CSS and JavaScript in `styles/wall.css` and `functions/wall.js`. Project links are relative so the site can run from a subfolder or Canvas-hosted package rather than assuming deployment at the domain root. The Babbage Netlify proxy validates methods, body size, JSON, and message content, preserves upstream status codes, prevents caching, and has a local test in `tools/test-netlify-function.js`.

`assets/asset-manifest.json` classifies every shipped asset as runtime, planned, development reference, or documentation. `tools/audit-assets.py` rejects missing, unclassified, or unregistered assets. The following obsolete files were removed from the clean baseline:

- `test-reflection.html`
- `netlify/netlify.toml`
- `assets/images/characters/students/jordan/dryly-amused.png`

Before packaging a release, run:

```bash
python tools/build-production.py --check
python tools/validate-project.py
python tools/test-runtime.py
```

The browser runtime is intentionally framework-free and uses relative local paths, which keeps the package suitable for ordinary static hosting and Canvas-compatible web delivery. External services still require network access and their configured endpoints.

## Babbage analysis transition

Babbage's progress display now follows observable request stages. After a live response arrives, the final parsing/render transition uses the short `PC_CLAUDE_PROCESSING_HOLD_DEFAULT_MS` compatibility constant in `functions/app-vn.js`; it should remain brief because the progress bar itself owns the waiting experience.

## V369 refactor baseline

Scenario 1 is the regression reference for visual and interaction behavior. The browser application is now split into a provider-neutral Babbage client (`functions/app-babbage.js`), shared scenario framework (`functions/app-scenario-shared.js`), core scenario/menu runtime (`functions/app-scenarios.js`), and current S2-S5 development prototypes (`functions/app-scenario-prototypes.js`). Prototype scenarios are preserved for design reference but are not considered approved final implementations.

The deployed Babbage GET health response reports the proxy version, OpenAI configuration state, model, and supported structured contracts. `node tools/test-babbage-live.js <site-url>` performs a free GET-only deployment check. Add `--contracts` only when intentionally testing every live structured contract because it makes model API calls.
