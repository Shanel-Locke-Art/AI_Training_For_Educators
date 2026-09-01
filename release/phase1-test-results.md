# Phase 1 validation results

Phase 1 release: `PROMPTCRAFT_V429_PHASE1_P524`

## Deterministic release gate

Result: 61 of 61 checks passed.

The gate now includes the formerly omitted current contracts for:

- S1 comparison modal and case-input binding;
- connection recovery and confirmed Sheets responses;
- live S1 evidence tracking;
- browser build-version detection;
- S1 transfer-plan tracking and dedicated AI schema;
- framed introduction purpose prompts;
- viewport-family introduction behavior;
- V83 receiver characterization fixtures.

Intermediate patch tests 519–522 and dormant S1 prototype tests are explicitly classified outside the current gate in `tests/TEST_CLASSIFICATION.md`.

## Repaired failures

- Structural hardening now passes.
- Asset classification now passes without adding, removing, or repopulating asset files.
- Proxy unit tests now pass with proxy V373.
- S1 Canvas Rescue and S3 Authentic Assessment contracts now pass.
- The active `s1_transfer_plan_analysis` request now has a dedicated strict schema.
- The missing GFC print-image request was removed while retaining the existing Great Falls College text affiliation and report styling.

## Browser suite

The full runner reached all browser checks, but Python Playwright and a browser executable are unavailable in this workspace. All 17 browser tests stopped on that missing environment dependency before interacting with PromptCraft. No browser product assertion failed.

Phase 2 must keep the deterministic gate green and should run the browser suite in the project’s configured Playwright environment before any verified-unreachable code is deleted.
