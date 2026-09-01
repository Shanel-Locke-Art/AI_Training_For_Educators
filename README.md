# PromptCraft V429

This repository includes the Phase 2 JavaScript ownership refactor for PromptCraft.

Stable compatibility identifiers:

- Application build: `PROMPTCRAFT_V429`
- Research schema: `V121`
- Browser/cache patch: `525`
- Apps Script receiver: `V83`
- Babbage proxy: `V373`
- Asset manifest: `v149`

Start with:

- `docs/README.md` for the documentation map
- `docs/development/phase-0-baseline.md` for baseline status and production safety boundaries
- `release/baseline-manifest.json` for machine-readable versions and archive hashes
- `release/phase1-manifest.json` for Phase 1 versions and validation status
- `release/phase2-manifest.json` for Phase 2 versions, ownership scope, and validation status
- `docs/development/repository-map.md` for source ownership
- `docs/development/phase-2-javascript-ownership.md` for the patch 525 ownership split and retained-code boundary

Editable browser source lives under `src/`; generated browser output lives under `runtime/`. The exact supplied V83 receiver is preserved under `apps-script/`. Do not run V83's `initializeWorkbookNow()` or `resetResearchDataNow()` against the production research workbook during refactoring.
