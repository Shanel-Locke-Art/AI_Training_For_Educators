# Patch 534: Scenario 3 Canvas dialogue draft

Patch 534 revises displayed Scenario 3, The Confident Student Problem, so the
opening, diagnosis feedback, intervention responses, case evidence, and AI
handoffs consistently reference the planned Canvas evidence.

## Canvas evidence contract

The final screenshot integration will use two privacy-safe captures from a
sandbox course:

1. `s3-jordan-week4-module-student.png`: an expanded student-view Week 4 module
   containing an overview, reading, practice check, graded quiz, and reflection.
2. `s3-jordan-quiz-result-84-student.png`: a student-view 84% quiz result with
   no identifying student information.

The dialogue intentionally describes only details required by this capture
plan. It does not provide Canvas navigation instructions. Screenshot assets are
not added in this patch because the final captures do not yet exist.

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
