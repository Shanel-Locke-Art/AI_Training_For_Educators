# Patch 534: Scenario 3 Canvas dialogue draft

Patch 534 revises displayed Scenario 3, The Confident Student Problem, so the
opening, diagnosis feedback, intervention responses, case evidence, and AI
handoffs consistently reference the planned Canvas evidence.

## Canvas evidence contract

The approved privacy-safe Canvas captures now live under
`assets/images/scenes/scenario-03-confident-student/canvas/`:

1. `s3-before-module.png`
2. `s3-before-reflect.png`
3. `s3-after-module.png`
4. `s3-after-reflect.png`
5. `s3-after-evidence-check.png`
6. `s3-after-feedback.png`

The runtime opening smartboard uses `s3-before-module.png`; the remaining files are
registered as current Scenario 3 Canvas evidence for subsequent activity views.

## Dialogue ownership

- `src/js/content/dialogue-data.js` owns the opening, fixed Pixel feedback, and
  registered Jordan intervention responses.
- `src/js/scenarios/s2-metacognition.js` owns the matching local fallback
  responses and Canvas-specific consequence text.
- Existing line IDs, audio filenames, source paths, scenario keys, save fields,
  and receiver mappings remain unchanged.

## Recording status

`docs/asset-management/PromptCraft_Voice_Recording_Tracker.xlsx` contains the
same 14 revised Scenario 3 lines. They are marked `Draft, Do Not Record` until
the Canvas screenshots, responsive presentation, and final dialogue are
approved. No audio files change in this patch.

## Compatibility

- App build remains `PROMPTCRAFT_V429`.
- Research schema remains `V121`.
- Browser/cache patch advances from 533 to 534.
- Dialogue asset identity remains 149. The advancing patch query invalidates
  the browser cache for the updated dialogue file.
- Live receiver V83, receiver candidate V84, Babbage proxy V373, tracking,
  scoring, progression, printing, and accessibility mechanics remain unchanged.
