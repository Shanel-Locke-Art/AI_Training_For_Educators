# Phase 2 JavaScript ownership refactor

Release: `PROMPTCRAFT_V429_PHASE2_P525`  
Application build: `PROMPTCRAFT_V429`  
Research schema: `V121`  
Receiver: `V83`  
Babbage proxy: `V373`

## Scope

Phase 2 changes JavaScript ownership only. It does not redesign a screen,
change dialogue, alter gameplay, modify tracking fields, change the Apps Script
receiver, or add/remove assets.

## New ownership boundary

| Owner | Responsibility |
|---|---|
| `src/js/scenarios/shared-shell.js` | Scenario lookup, mission briefing, scroll reset, input visibility, and locked-scenario shell |
| `src/js/scenarios/s1-canvas-evidence.js` | Current S1 case files, Canvas evidence reader/modal, reflection analysis, Canvas Rescue, and week-plan transfer |
| `src/js/scenarios/shared-components.js` | Scenario-neutral progress, choice, evidence, manipulation, guided-repair, transfer, result, and activity-shell builders |
| `src/js/app/action-routing.js` | Shared scenario switching and next-scenario navigation actions |
| `src/js/dev/development-tools.js` | Development-only navigation, fill, transfer-fill, reset, and next actions |
| `src/js/scenarios/s1-engagement.js` | Retained legacy S1 guided builder and its scenario-owned actions |
| `src/js/scenarios/s1-course-design.js` | Retained legacy S1 course-design prototype |

The former `shared-components.js` contained 3,339 lines spanning the first
three responsibilities. The split is mechanical: the existing sections were
moved intact, then owner comments and manifest entries were added. The runtime
bundle remains generated from the same global-script model and source order.

## Current S1 route

`SCENARIO_UI[0].rendererKey` remains `content-avalanche-preview`. The registry
maps that key to `renderS1ContentAvalanchePreview()` in
`s1-canvas-evidence.js`. No scenario metadata selects `guided-builder`, and no
registry route calls an `s1-course-design.js` entry point.

`tests/test_phase2_module_ownership.py` guards the route, module order, owner
boundaries, action ownership, and explicit dormant-module inventory. Existing
S1 tests now inspect the S1 owner rather than the old mixed filename.

## Deliberately retained code

`s1-course-design.js` and `s1-engagement.js` remain declared in the bundle.
They are listed under `retained_dormant_modules` in `src/js/manifest.json` so
their status is machine-readable. They were not deleted because the full
browser suite cannot launch without Python Playwright and a browser executable
in this workspace.

Deletion requires browser evidence that normal launch, replay, scenario
switching, development controls, and the S1 evidence/transfer path never enter
either prototype. Static reachability evidence alone is not sufficient.

## Validation boundary

- Deterministic regression gate: 62/62 passed.
- Source/runtime synchronization: passed.
- JavaScript syntax checks: passed.
- V121 receiver fixtures: passed unchanged.
- Browser product assertions: not run because the environment lacks Python
  Playwright and a browser executable. This is an environment block, not a
  product failure.

Phase 3 can centralize viewport logic from this ownership baseline. Removal of
dormant S1 code remains a separate, browser-gated cleanup task.
