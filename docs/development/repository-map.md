# PromptCraft source map

Current identifiers: application `PROMPTCRAFT_V429`, patch `606`, research `V121`, receiver `V94`, asset manifest `v152`.

| Area | Current owner |
|---|---|
| Scenario menu, current route, internal identifiers | `src/js/scenarios/registry.js` |
| S1 controller/actions | `src/js/scenarios/s1-start-with-learning.js` |
| S1 lesson content and saved state | `s1-learning-content.js` and `s1-learning-state.js` |
| S1 activity screens | `s1-learning-workspace.js` |
| S1 guide, My Course and dialogue | `s1-learning-guide.js`, `s1-learning-my-course.js`, `s1-learning-dialogue.js` |
| Retained S1 review routes | `s1-learning-compatibility.js` |
| Shared S1/S2 task frame | `src/js/scenarios/learning-presentation.js`; `src/css/scenarios/learning-presentation.css` and `learning-stage-responsive.css` |
| S1 domain-specific styles | `src/css/scenarios/s1-start-with-learning.css` |
| S2 controller/actions | `src/js/scenarios/s2-accessibility.js` |
| S2 content, state and validation | `s2-accessibility-content.js`, `s2-accessibility-state.js`, `s2-accessibility-validation.js` |
| S2 screens and AI repair | `s2-accessibility-workspace.js` and `s2-accessibility-ai.js` |
| S2 heading teaching and reading view | `src/js/scenarios/s2-accessibility-reader.js` |
| S2 Canvas editor practice | `src/js/scenarios/s2-accessibility-editor.js` |
| S2 activity-specific styles | `src/css/scenarios/s2-accessibility.css` |
| Shared Canvas simulation | `src/js/scenarios/canvas-simulation.js` (S1-compatible renderers used by S1 and S2) |
| Shared scenario presentation | `src/js/scenarios/shared-shell.js`, `shared-components.js`, and `src/js/ui/visual-novel.js` |
| Scenario 3 and 4 browser implementations | `src/js/scenarios/s2-metacognition.js` and `s3-authentic-assessment.js` (internal names retained for compatibility) |
| App state, actions, and startup | `src/js/app/runtime-state.js`, `scenario-runtime.js`, `action-routing.js`, and `bootstrap.js` |
| Runtime asset registry and service configuration | `src/js/app/config-and-assets.js` and `assets/asset-manifest.json` |
| Dialogue | `src/js/content/dialogue-data.js` |
| Research events | `src/js/research/tracking.js` |
| Babbage browser and server | `src/js/ai/babbage-client.js` and `netlify/functions/babbage.js` |
| Receiver source | `apps-script/PromptCraft_Receiver_V94_Start_With_Learning.js` |
| Browser styles | `src/css/manifest.css` and its imports |
| Generated browser files | `runtime/`, rebuilt with `python tools/build.py` |

The older `s1-engagement.js` and `s1-canvas-evidence.js` are still compiled because shared fallback code refers to them. They are not selected by the current Scenario 1 registry. See `s1-removal-audit.md` before deleting them or their registered assets.

All `s1-learning-*.js` owners are under `src/js/scenarios/`. See `S1_PRODUCTION_LOOP_AUDIT.md` for the complete active flow and inherited-code findings.

Patch 605 adds an explicit `completionAvailable` capability in the registry. Completion and restore logic live in `src/js/app/scenario-runtime.js`; this is independent of legacy prompt rendering.

S2 source owners are under `src/js/scenarios/`. `canvas-simulation.js` now owns the Canvas page renderer used by both S1 and S2; `learning-presentation.js` also owns their common diagnosis-choice renderer.
