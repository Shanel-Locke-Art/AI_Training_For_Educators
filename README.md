# PromptCraft V429

This repository includes the completed Phase 0 through Phase 6 controlled refactor baseline for PromptCraft.

Stable compatibility identifiers:

- Application build: `PROMPTCRAFT_V429`
- Research schema: `V121`
- Browser/cache patch: `534`
- Apps Script receiver candidate: `V84` (`V83` preserved unchanged and remains the live baseline until deployment)
- Babbage proxy: `V373`
- Asset manifest: `v149`

Start with:

- `docs/README.md` for the documentation map
- `docs/development/phase-0-baseline.md` for baseline status and production safety boundaries
- `release/baseline-manifest.json` for machine-readable versions and archive hashes
- `release/phase1-manifest.json` for Phase 1 versions and validation status
- `release/phase2-manifest.json` for Phase 2 versions, ownership scope, and validation status
- `release/phase3-manifest.json` for Phase 3 viewport ownership and validation status
- `release/phase4-manifest.json` for Phase 4 CSS inventory status and the visual validation boundary
- `release/phase5-manifest.json` for Phase 5 tracking, V84 receiver, and deployment-gate status
- `release/phase6-manifest.json` for final architecture, ownership, and changed-file packaging status
- `docs/development/patch-530-shared-analysis-presentation.md` for the optional shared final-analysis presentation model
- `docs/development/patch-531-scenario-3-analysis.md` for the Scenario 3 visual and print migration
- `docs/development/patch-532-scenario-4-analysis.md` for the Scenario 4 analysis and shared-print migration
- `docs/development/patch-533-scenarios-3-4-canvas-orientation.md` for the Canvas teaching context used by displayed Scenarios 3 and 4
- `docs/development/patch-534-scenario-3-canvas-dialogue.md` for the Scenario 3 Canvas dialogue and screenshot contract
- `docs/development/repository-map.md` for source ownership
- `docs/development/phase-2-javascript-ownership.md` for the patch 525 ownership split and retained-code boundary
- `docs/development/phase-3-viewport-controller.md` for the patch 526 viewport policy and subscriber ownership
- `docs/development/phase-4-css-readiness.md` for the ordered CSS migration plan and current blocker
- `docs/development/phase-5-tracking-receiver.md` for readable/raw sheet ownership, V84 changes, and copied-workbook verification
- `docs/development/phase-6-architecture-release.md` for final subsystem ownership and release packaging rules

Editable browser source lives under `src/`; generated browser output lives under `runtime/`. The exact supplied V83 receiver and additive V84 candidate are both under `apps-script/`. Do not deploy or initialize V84 against production until its read-only inventory has been recorded on a recovery copy. V84 disables destructive reset. Patch 534 revises displayed Scenario 3 around a privacy-safe Week 4 Canvas module and 84% quiz-result evidence contract while leaving screenshots and audio pending; browser/cache patch 534 is current.
