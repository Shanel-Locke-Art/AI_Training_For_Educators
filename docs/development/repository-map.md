# PromptCraft repository architecture

This is the canonical repository map for `PROMPTCRAFT_V429` as represented by browser/cache patch 525 and Phase 0 repository baseline revision 524. Older flat/numeric layouts should not be reconstructed from memory.

## Receiver and release ownership

| Path | Ownership |
|---|---|
| `apps-script/PromptCraft_Receiver_V83_Readable_Prompt_Data.js` | Exact, unchanged V83 Apps Script baseline |
| `release/baseline-manifest.json` | Machine-readable build/schema/patch/receiver/proxy/archive identity |
| `tools/receiver/workbook_inventory_read_only.gs` | Read-only production workbook shape/header inventory helper |
| `tests/test_receiver_v83_fixture.js` | Memory-only V83 characterization harness |
| `tests/fixtures/receiver/` | Named V121 payload fixtures; no production research data |

Receiver V83 is a preserved baseline, not an editable rolling file. A behavior change creates V84 and must retain V83 for migration comparison.

## Runtime entry points

| Path | Ownership |
|---|---|
| `index.html` | Main PromptCraft application shell |
| `wall.html` | Public Ideas Wall shell |
| `runtime/js/promptcraft.bundle.js` | Generated application JavaScript |
| `runtime/js/dialogue-data.js` | Generated/synchronized dialogue data |
| `runtime/js/ideas-wall.js` | Generated/synchronized Ideas Wall JavaScript |
| `runtime/css/promptcraft.css` | Generated application CSS |
| `runtime/css/ideas-wall.css` | Generated/synchronized Ideas Wall CSS |

Files under `runtime/` are browser output. Edit their owners under `src/` instead.

## JavaScript source ownership

```text
src/js/
├── manifest.json
├── ai/
│   └── babbage-client.js
├── app/
│   ├── runtime-state.js          # global runtime + teaching progress state
│   ├── config-and-assets.js      # ASSETS registry + receiver configuration
│   ├── scenario-runtime.js
│   ├── action-routing.js         # shared navigation + development UI actions
│   └── bootstrap.js
├── audio/
│   ├── audio-engine.js
│   └── babbage-tts.js
├── content/
│   └── dialogue-data.js
├── dev/
│   └── development-tools.js
├── pages/
│   └── ideas-wall.js
├── research/
│   └── tracking.js
├── scenarios/
│   ├── shared-shell.js            # mission, scroll, input, and locked-shell helpers
│   ├── s1-canvas-evidence.js      # current S1 Canvas evidence + transfer flow
│   ├── shared-components.js       # scenario-neutral activity builders
│   ├── registry.js
│   ├── s1-course-design.js       # unreachable from the current registry — see s1-unreachable-modules.md
│   ├── s1-engagement.js          # dormant guided builder; retained pending browser proof
│   ├── s2-metacognition.js
│   └── s3-authentic-assessment.js
└── ui/
    ├── visual-novel.js
    ├── workstation-layout.js
    ├── completed-analysis-layout.js
    ├── live-analysis-layout.js
    ├── analysis-layout-controller.js
    ├── babbage-terminal.js
    └── prediction-gate.js
```

`src/js/manifest.json` defines bundle order and standalone source/runtime mappings. `tools/build.py` fails if a JavaScript source owner exists but is not declared in the manifest.

Phase 2 separates the former 3,339-line mixed `shared-components.js` owner into three files without changing the executable statements: `shared-shell.js` owns the application-facing scenario shell, `s1-canvas-evidence.js` owns current S1 behavior, and `shared-components.js` contains only reusable activity builders. Shared navigation actions formerly appended to `s1-engagement.js` now belong to `app/action-routing.js`; development-only actions belong to `dev/development-tools.js`.

## CSS source ownership

```text
src/css/
├── manifest.css
├── compat/
├── foundation/
├── layout/
├── pages/
│   └── ideas-wall.css
├── responsive/
├── scenarios/
└── ui/
    └── gfc-theme.css
```

`src/css/manifest.css` defines the application cascade. `pages/ideas-wall.css` is intentionally standalone. `tools/build.py` fails if an undeclared CSS owner appears.

## Assets

`assets/asset-manifest.json` is the canonical asset classification map. Current manifest version: `149`.

Major current asset groups:

- application/classroom backgrounds
- GFC S1/S2 campus backgrounds
- Professor Pixel portraits
- Jordan S2 portraits
- scenario scene art
- Babbage mark, Charles Babbage portrait, Babbage engine
- Great Falls College print/logo asset
- PromptCraft QR code
- S1 Content Avalanche Canvas evidence, paired across instructor/student and before/after views, plus eight dedicated smartboard-focused views
- current runtime audio
- planned line-by-line audio
- development-only character references

## Tooling

| Tool | Purpose |
|---|---|
| `tools/build.py` | Generate/synchronize runtime output and syntax-check JavaScript |
| `tools/validate.py` | Structural, compatibility, action-registration, and hardening guards |
| `tools/audit_css.py` | CSS duplicate/retired-selector audit |
| `tools/audit_assets.py` | Asset classification/reference audit |
| `tools/check.py` | One-command regression runner; `--full` includes browser tests |

Current browser regression coverage also includes teaching progression, Ideas Wall header/theme, GFC action borders, Babbage print/save, S1/S2 guided repair, terminal handoffs, and analysis overflow.

## Scenario boundary

The approved Canvas-oriented roadmap is S1 Content Avalanche, S2 Access Is Part of the Design, S3 Confident Student Problem, S4 The 96% Problem, S5 Hallucination Hunt, S6 Predict the Output, S7 Human Judgment Line, and S8 Reflect, Revise, Reuse.

S1 now has an unlocked Content Avalanche evidence station built from its structured Canvas screenshots. Professor Pixel first establishes the course history and faculty context in the classroom; the flow then opens the actual Canvas evidence on the classroom smartboard and automatically continues into the first case briefing without requiring a separate replay button. Pixel begins the Canvas introduction alone. Jordan is not rendered until Pixel introduces him; Jordan’s first line activates the dual cast and slides him into the left slot while Pixel remains on the right. The scene-level owner then preserves both characters and the current Before or After screenshot across queued dialogue handoffs. Smartboard dialogue uses eight board-specific focused views that remove unused Canvas margins and enlarge the relevant module, assignment, or directions content; the assignment Before view uses a safe-fit composition so the complete direction line and right-side Canvas controls remain visible inside the board. At phone and compact-tablet widths through 1100 CSS pixels, Canvas case dialogue leaves the miniature prop composition and becomes a full-screen evidence reader: the complete transcribed evidence list scrolls in the upper scene, narration and diagnosis choices remain readable in an independently scrollable lower pane, and decorative portraits, smartboard hardware, and the redundant overlay menu are suppressed so they cannot cover evidence. The Canvas Focus Before/After state now sits inside the evidence toolbar instead of overlapping the evidence context or title. Wider screens retain the dual-character classroom and focused Canvas screenshot, while the evidence station retains unchanged full screenshots and full-size links. Each case now follows a formative diagnose–explain–AI-assist–reveal loop: inspect Before, choose one of three dialogue responses, hear the explanation, zoom into a dedicated full-screen Babbage workspace, reveal the approved After, and hear Pixel and Jordan compare what changed. The workspace presents one readable step at a time—instructor task, AI draft, and human review—reuses the existing Pixel/Jordan AI dialogue as inline coaching, owns a true scrollable grid row, and keeps Back/Continue controls outside that scrolling region. It fills short-landscape and narrow mobile viewports instead of scaling itself inside the decorative smartboard. Completing human review returns the player to the classroom before the Canvas After reveal. The static After state uses a compact three-step case handoff—teaching lens, Babbage contribution, instructor verification—instead of competing summary cards. After all four cases, Start Canvas Rescue opens the applied player activity. The player selects four design-brief ingredients, sends the bounded brief through the provider-neutral Babbage client to the `s1_canvas_rescue` structured backend contract, reviews five proposed Canvas repairs, and decides what to keep or return for human review. When the backend is unavailable, the same interaction uses an explicitly labeled bounded test fallback. The final student-view debrief reports brief specificity and instructor-review judgment while reinforcing that AI can inventory, extract, reorganize, compare, and draft, but the instructor owns purpose, accuracy, accessibility, alignment, and student experience. The full-width station remains available for close inspection. S1 remains excluded from implemented-scenario completion calculations until final acceptance and progression activation. S2 currently uses a development shell. S3 and S4 are the two active browser implementations. Their source filenames and internal action keys retain the earlier `s2`/`s3` names for receiver and saved-data compatibility while their registry positions, labels, progress state, and generic tracking identify them as Scenarios 3 and 4. S5-S8 remain development shells.

Each S1 case now follows one connected formative loop: inspect the Before view, diagnose the learner problem, reveal the instructor-approved After view, write a 2–4 sentence explanation of why the redesign helps students, and review Babbage’s analysis. The writing prompt is embedded in the dialogue pane while the After evidence remains visible. Babbage’s single full-screen feedback report checks whether the explanation names the original problem, cites a visible Canvas change, and connects that change to the student experience; players can revise before continuing. This replaces the former three-screen task/draft/decision detour. The instructor and student Before-module scenes now use direct responsive Canvas captures supplied from the live course rather than HTML reconstructions. A responsive `<picture>` selects the phone capture below 480 CSS pixels and the wider compact capture for small tablets and short desktop test viewports, preserving Canvas’s real wrapping, item icons, accessibility indicators, publication controls, point metadata, and perspective-specific controls. Other evidence surfaces retain their readable Canvas-styled transcription until equivalent responsive source captures are available. Full-body character art remains suppressed in compact evidence mode so Pixel and Jordan cannot cover the source; their names and narration preserve speaker identity in the dedicated dialogue pane. On phone and compact-tablet evidence scenes, the Canvas surface reaches every edge of the upper pane with no smartboard hardware, dark surround, card margin, rounded corner, border, or shadow. The scenario-start dialogue owner preserves the short S1 `boardText` instead of replacing it with the longer menu description.

The server-side Babbage proxy keeps S3-S5 structured response contracts because those are future-facing integration contracts, not playable browser implementations.

## Retired layout/naming patterns

Do not restore:

- flat `functions/app*.js` browser source structure
- numeric `styles/*.css` ownership as the development model
- `scenario-prototypes.js`
- `netlify/functions/claude.js`
- Claude-named browser selectors/actions/API functions
- patch-number suffixes on runtime state classes/functions when a semantic name exists
- removed S2 case-file/evidence layout selectors recorded by `tools/audit_css.py`

The retained `claude_response` tokens exist only for V121 receiver compatibility.

## Asset-management files

Canonical workbooks:

- `docs/asset-management/PromptCraft_Production_Overview_Simplified.xlsx`
- `docs/asset-management/PromptCraft_Visual_Asset_Tracker_Simplified.xlsx`
- `docs/asset-management/PromptCraft_Voice_Recording_Tracker.xlsx`

Do not create version-number duplicates of these workbooks for routine updates. Version history belongs in source control/research records.
