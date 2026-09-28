# PromptCraft

Current application: `PROMPTCRAFT_V429`, browser patch `592`, research schema `V121`, Apps Script receiver source `V93`, asset manifest `v151`.

Scenario 1 is **Start With the Learning** with Maya and Professor Pixel. Its playable source is `src/js/scenarios/s1-start-with-learning.js`, selected by `src/js/scenarios/registry.js`. The internal `content-avalanche` scenario key remains for saved data and research compatibility.

## Work on the application

- Edit JavaScript and CSS under `src/`. `runtime/` is generated browser output.
- Run `python tools/build.py` after source changes, then `python tools/build.py --check` to confirm the browser files match.
- Run `python tools/audit_assets.py` and `python tools/audit_css.py` when changing assets or styles.
- `index.html` opens the game; `wall.html` opens the Ideas Wall. `netlify/functions/babbage.js` owns the Babbage server contract.
- `apps-script/PromptCraft_Receiver_V93_Start_With_Learning.js` is the retained receiver source. After deploying it as a new web-app version, run `initializeWorkbookNow()` once. V93 removes retired scenario-result tabs, rebuilds a compact S1 summary, and preserves detailed evidence in the raw history. During testing, `resetResearchDataNow()` clears collected test records without removing headers or workbook structure. `inspectS1TrackingNow()` provides a privacy-safe count of the S1 event types received.

## Production references

- `docs/README.md` maps the current production documents.
- `docs/development/s1-removal-audit.md` records remaining legacy source dependencies.
- `docs/asset-management/` contains the S1 artwork lists, recording scripts, and production trackers.

Historical patch packages, test suites, and retired recording guides were removed from this working package. The original uploaded repository ZIP remains a separate backup. The current S1 route has completed structural validation after the Course Guide saved-content, local reset, typography, color, print-layout, spacing, and guide-to-dialogue interaction cleanup; deploy Patch 592 and Receiver V93, then run the hosted smoke pass before participant testing.
