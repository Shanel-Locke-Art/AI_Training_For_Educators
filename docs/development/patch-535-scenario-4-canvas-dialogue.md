# Patch 535: Scenario 4 Canvas dialogue draft

Patch 535 revises displayed Scenario 4, The 96% Problem, so the dialogue and
case evidence consistently distinguish a Canvas quiz score from the evidence
required by the module outcome.

## Canvas evidence contract

The approved privacy-safe Canvas captures now live under
`assets/images/scenes/scenario-04-96-percent-problem/canvas/`:

1. `s4-before-module.png`
2. `s4-before-quiz.png`
3. `s4-before-grade-96.png`
4. `s4-after-module.png`
5. `s4-after-brief.png`
6. `s4-after-assignment.png`
7. `s4-after-rubric.png`
8. `s4-after-transfer.png`

The runtime opening smartboard uses `s4-before-module.png`; the complete set is
registered as current Scenario 4 Canvas evidence. The fictional 96% evidence uses
Maya only and contains no real student identity.

## Dialogue ownership

- `src/js/content/dialogue-data.js` owns all 36 fixed Pixel and Maya lines.
- `src/js/scenarios/s3-authentic-assessment.js` owns the displayed Scenario 4
  case evidence, gameplay, feedback, AI handoffs, and local fallback quote.
- Existing dialogue IDs, internal `s3` action names, save fields, analysis types,
  tracking fields, and receiver mappings remain unchanged.

## Recording status

`docs/asset-management/PromptCraft_Voice_Recording_Tracker.xlsx` includes all
36 Scenario 4 lines as `Draft, Do Not Record`. File names and paths are reserved
using the existing internal `scenario-03` compatibility name. No audio files
change in this patch.

## Compatibility

- App build remains `PROMPTCRAFT_V429`.
- Research schema remains `V121`.
- Browser/cache patch advances from 534 to 535.
- Dialogue asset identity remains 149. The patch query invalidates the updated
  dialogue file in browser caches.
- Live receiver V83, receiver candidate V84, Babbage proxy V373, tracking,
  scoring, progression, printing, responsive layouts, and accessibility
  behavior remain unchanged.
