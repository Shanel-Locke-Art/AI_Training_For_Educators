# PromptCraft documentation map

This folder contains the canonical project documentation for `PROMPTCRAFT_V429`.

Current compatibility baseline:

- Application build: `PROMPTCRAFT_V429`
- Research schema: `V121`
- Apps Script receiver candidate: `V84`; immutable/live baseline: `V83`
- Babbage proxy: `V373`
- Asset manifest: `v149`
- Current browser/cache revision: `543`
- Phase 0 repository baseline revision: `524` (documentation, receiver ownership, and fixtures only)
- Phase 2 refactor patch: `525` (JavaScript ownership only; no design or gameplay changes)
- Phase 3 refactor patch: `526` (viewport JavaScript ownership only; no design, gameplay, or CSS changes)
- Phase 4 readiness checkpoint: patch remains `526` (CSS ownership inventory and deletion gate only; runtime CSS unchanged)
- Phase 5 refactor patch: `527` (tracking identity and additive V84 readable/raw receiver separation)
- Phase 6 release checkpoint: patch remains `527` (final ownership documentation and changed-file packaging only)
- Final analysis readability and printing patch: `528` (wider/smaller Module Path finding, restored print action, synchronized menu build/patch label)
- Structured print-report patch: `529` (scannable criterion rows and a visual Canvas module-path example)
- Shared analysis presentation patch: `530` (optional structured findings and accessible process examples; no scenario migration)
- Scenario 3 analysis migration patch: `531` (structured reflection findings, accessible process example, and shared final printing)
- Scenario 4 analysis migration patch: `532` (structured assessment findings, five-step evidence sequence, and shared print parity)
- Scenarios 3 and 4 Canvas-orientation patch: `533` (Canvas as the teaching environment, with existing gameplay and contracts preserved)
- Scenario 3 Canvas-dialogue patch: `534` (draft dialogue, tracker status, and privacy-safe screenshot contract)
- Scenario 4 Canvas-dialogue patch: `535` (draft dialogue, tracker status, and privacy-safe screenshot contract)
- Scenario 1 shared-visual-shell patch: `536` (shared mission briefing and stage geometry; Canvas evidence mechanics preserved)
- Windows test-runner patch: `537` (bundled Chromium discovery, UTF-8 reads, and path normalization)
- Current visual-review patch: `543` (deterministic onboarding before 51 opening and focused captures across desktop, tablet, and phone)

Cache/query revisions are not application build numbers. Do not rename the app build when a cache marker changes.

## Which file do I use?

### Asset management

| File | Use it for | Relationship to the others |
|---|---|---|
| `asset-management/PromptCraft_Production_Overview_Simplified.xlsx` | High-level production inventory across visual assets and audio | Main overview workbook. Use this when you want one place to see production status. |
| `asset-management/PromptCraft_Visual_Asset_Tracker_Simplified.xlsx` | Detailed image production: backgrounds, scene art, character portraits, Babbage/brand UI assets, and references | Visual-only working tracker. More detailed than the master workbook for art production. |
| `asset-management/PromptCraft_Voice_Recording_Tracker.xlsx` | Dialogue wording, speaker/expression, voice filenames, recording status, and archived lines | Dialogue/recording source for voice production. It is not an image/audio-file inventory. |

The old `v137`, `v356`, and `PromptCraft_*_v356` spreadsheet filenames were byte-for-byte duplicates of the three canonical workbooks above. They are intentionally removed from this cleaned documentation package. Version history belongs in source control and the Process Log, not in duplicate filenames.

### Development documentation

| File | Purpose |
|---|---|
| `development/phase-0-baseline.md` | Recorded archive hashes, version ownership, V83 source identity, production workbook safety boundary, fixture instructions, and Phase 0 exit status. |
| `development/phase-2-javascript-ownership.md` | Patch 525 JavaScript ownership split, live S1 route, retained dormant modules, and deletion gate. |
| `development/phase-3-viewport-controller.md` | Patch 526 viewport metrics policy, centralized listener ownership, subscriber boundaries, and preservation checks. |
| `development/phase-4-css-readiness.md` | Final-cascade inventory findings, ordered component migration plan, and visual proof required before CSS movement or deletion. |
| `development/phase-5-tracking-receiver.md` | V84 event identity, score-scale ownership, readable projections, lossless raw archive, and copied-workbook deployment gate. |
| `development/phase-6-architecture-release.md` | Final subsystem ownership, version taxonomy, release gate, and changed-file-only packaging procedure. |
| `development/compatibility-contracts.md` | Things that must remain compatible: V429, V121, receiver V83, Babbage endpoint, Ideas Wall moderation, and versioning rules. |
| `development/repository-map.md` | Where source/runtime files live and which files own each subsystem. Start here when locating code. |
| `development/css-architecture.md` | CSS ownership, exact cascade order, and Phase 4 consolidation gate. Use before adding or moving styling. |
| `development/gfc-visual-theme.md` | Current Great Falls College / PromptCraft visual direction and shared branding rules. |
| `development/pre-s3-refactor.md` | Historical stabilization record explaining what was removed before S3 development and what must not be reconstructed. |
| `development/s1-unreachable-modules.md` | Findings record: two complete prior S1 implementations still build into the bundle but aren't reachable from the current registry. Read before assuming either is live or safe to delete. |
| `development/patch-530-shared-analysis-presentation.md` | Shared structured-finding and process-example interface, ownership, compatibility fallback, and Patch 530 validation status. |
| `development/patch-531-scenario-3-analysis.md` | Displayed Scenario 3 analysis migration, corrected visible numbering, shared printing, and preservation boundaries. |
| `development/patch-532-scenario-4-analysis.md` | Displayed Scenario 4 and Transfer Lab analysis migration, print-content parity, duplicate printer removal, and preservation boundaries. |
| `development/patch-533-scenarios-3-4-canvas-orientation.md` | Canvas module, assessment, feedback, submission, and rubric context for displayed Scenarios 3 and 4. |
| `development/patch-534-scenario-3-canvas-dialogue.md` | Scenario 3 Canvas dialogue draft, recording status, and required screenshot captures. |
| `development/patch-535-scenario-4-canvas-dialogue.md` | Scenario 4 Canvas dialogue draft, recording status, and required screenshot captures. |
| `development/patch-536-s1-shared-visual-shell.md` | Scenario 1 visual alignment with the shared S3/S4 scenario shell. |
| `development/patch-537-windows-test-runner.md` | Windows-compatible Playwright and regression-runner setup. |
| `development/patch-538-cumulative-recovery.md` | Cumulative changed-file recovery overlay through Patch 538. |
| `development/patch-539-browser-contract-alignment.md` | Browser regression expectations aligned with the current scenario registry and Canvas dialogue. |
| `development/patch-540-internal-scenario-screenshots.md` | Internal S1, S3, and S4 visual-review screenshot inventory. |
| `development/patch-541-screenshot-capture-integrity.md` | Screenshot asset loading, checkpoint focus, and duplicate-image integrity guards. |
| `development/patch-542-scenario-screenshot-scope.md` | Separate scenario-opening overviews from centered activity checkpoints for reliable visual comparison. |
| `development/patch-543-runtime-capture-stability.md` | Deterministic onboarding waits and the corrected 51-image visual-review inventory. |
| `development/patch-544-current-scenario-assets.md` | Current S1-S4 Canvas evidence folders, normalized filenames, and runtime smartboard routing. |

## Source-of-truth hierarchy

1. Current source code under `src/`
2. `assets/asset-manifest.json` for asset classification and current paths
3. Compatibility contracts in `development/compatibility-contracts.md`
4. `../release/baseline-manifest.json` for recorded release/deployment identifiers
5. These production trackers
6. Historical notes and archived dialogue

If a tracker conflicts with current source code, update the tracker. Do not change working runtime code merely to make an old spreadsheet true again.
