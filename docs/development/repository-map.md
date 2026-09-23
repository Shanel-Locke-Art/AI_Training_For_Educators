# PromptCraft source map

Current identifiers: application `PROMPTCRAFT_V429`, patch `580`, research `V121`, receiver `V91`, asset manifest `v151`.

| Area | Current owner |
|---|---|
| Scenario menu, current route, internal identifiers | `src/js/scenarios/registry.js` |
| Playable Scenario 1 | `src/js/scenarios/s1-start-with-learning.js` and `src/css/scenarios/s1-start-with-learning.css` |
| Shared scenario presentation | `src/js/scenarios/shared-shell.js`, `shared-components.js`, and `src/js/ui/visual-novel.js` |
| Scenario 3 and 4 browser implementations | `src/js/scenarios/s2-metacognition.js` and `s3-authentic-assessment.js` (internal names retained for compatibility) |
| App state, actions, and startup | `src/js/app/runtime-state.js`, `scenario-runtime.js`, `action-routing.js`, and `bootstrap.js` |
| Runtime asset registry and service configuration | `src/js/app/config-and-assets.js` and `assets/asset-manifest.json` |
| Dialogue | `src/js/content/dialogue-data.js` |
| Research events | `src/js/research/tracking.js` |
| Babbage browser and server | `src/js/ai/babbage-client.js` and `netlify/functions/babbage.js` |
| Receiver source | `apps-script/PromptCraft_Receiver_V91_Start_With_Learning.js` |
| Browser styles | `src/css/manifest.css` and its imports |
| Generated browser files | `runtime/`, rebuilt with `python tools/build.py` |

The older `s1-engagement.js` and `s1-canvas-evidence.js` are still compiled because shared fallback code refers to them. They are not selected by the current Scenario 1 registry. See `s1-removal-audit.md` before deleting them or their registered assets.
