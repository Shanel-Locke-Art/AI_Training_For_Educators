# PromptCraft documentation map

This folder contains the canonical project documentation for `PROMPTCRAFT_V429`.

Current compatibility baseline:

- Application build: `PROMPTCRAFT_V429`
- Research schema: `V121`
- Apps Script receiver: `V82`
- Asset manifest: `v144`
- Current browser/cache revision represented by this documentation pass: `446`

Cache/query revisions are not application build numbers. Do not rename the app build when a cache marker changes.

## Which file do I use?

### Asset management

| File | Use it for | Relationship to the others |
|---|---|---|
| `asset-management/master-asset-tracker.xlsx` | High-level production inventory across visual assets and audio | Main overview workbook. Use this when you want one place to see production status. |
| `asset-management/visual-asset-tracker.xlsx` | Detailed image production: backgrounds, scene art, character portraits, Babbage/brand UI assets, and references | Visual-only working tracker. More detailed than the master workbook for art production. |
| `asset-management/dialogue-voiceover-tracker.xlsx` | Dialogue wording, speaker/expression, voice filenames, recording status, and archived lines | Dialogue/recording source for voice production. It is not an image/audio-file inventory. |

The old `v137`, `v356`, and `PromptCraft_*_v356` spreadsheet filenames were byte-for-byte duplicates of the three canonical workbooks above. They are intentionally removed from this cleaned documentation package. Version history belongs in source control and the Process Log, not in duplicate filenames.

### Development documentation

| File | Purpose |
|---|---|
| `development/compatibility-contracts.md` | Things that must remain compatible: V429, V121, receiver V82, Babbage endpoint, Ideas Wall moderation, and versioning rules. |
| `development/repository-map.md` | Where source/runtime files live and which files own each subsystem. Start here when locating code. |
| `development/css-architecture.md` | CSS ownership and cascade order. Use before adding or moving styling. |
| `development/gfc-visual-theme.md` | Current Great Falls College / PromptCraft visual direction and shared branding rules. |
| `development/pre-s3-refactor.md` | Historical stabilization record explaining what was removed before S3 development and what must not be reconstructed. |

## Source-of-truth hierarchy

1. Current source code under `src/`
2. `assets/asset-manifest.json` for asset classification and current paths
3. Compatibility contracts in `development/compatibility-contracts.md`
4. These production trackers
5. Historical notes and archived dialogue

If a tracker conflicts with current source code, update the tracker. Do not change working runtime code merely to make an old spreadsheet true again.
