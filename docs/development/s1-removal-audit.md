# Scenario 1 removal audit — 2026-09-22

The current playable route is `rendererKey: 'start-with-learning'` in `src/js/scenarios/registry.js`, which calls `renderS1StartWithLearning()` in `src/js/scenarios/s1-start-with-learning.js`. The internal `content-avalanche` key and `CONTENT_AVALANCHE` index remain compatibility identifiers.

The standalone `s1-course-design.js` prototype and its dedicated CSS had no caller from the current registry. They were excluded from the build. Their archived copies and prototype tests were removed from this clean working package; the original uploaded ZIP remains the backup.

## Still in the build

| Owner | Dependency | Removal gate |
|---|---|---|
| `s1-engagement.js` and `s1-engagement.css` | `scenario-runtime.js` refers to `sendGuided`, `getS1GuidedValues`, and `analyzeS1Guided`; `babbage-client.js` also refers to the latter two. | Refactor the shared fallback branches and verify the current route in a browser. |
| `s1-canvas-evidence.js` and older Canvas captures | Shared application code still has evidence-page hooks and the asset registry holds its captures. | Trace those hooks and verify the live S1 route before removing module, styles, and registered captures together. |

The full historical test suite, release manifests, retired guides, and previous receiver source copies are no longer in this working package. `python tools/build.py --check` remains the source/runtime synchronization check. Browser interaction and responsive screenshots could not run here because Chromium and Python Playwright were unavailable. This is a clean production workspace checkpoint, not deployment validation.
