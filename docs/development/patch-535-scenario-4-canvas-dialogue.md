# Patch 535: Scenario 4 Canvas dialogue draft

Patch 535 revises displayed Scenario 4, The 96% Problem, so the dialogue and
case evidence consistently distinguish a Canvas quiz score from the evidence
required by the module outcome.

## Canvas evidence contract

The final screenshot integration will use three privacy-safe student-view
captures from a sandbox course:

1. `s4-maya-week4-assessments-student.png`: the expanded Week 4 module showing
   the Canvas quiz and county planning assignment in context.
2. `s4-maya-quiz-result-96-student.png`: the 96% Canvas quiz result with no
   identifying student information.
3. `s4-maya-county-planning-assignment-student.png`: the Canvas Assignment
   showing the county brief, required submission evidence, and visible rubric.

Canvas remains the learning and delivery environment. The activity teaches
assessment alignment and evidence quality, not Canvas navigation. Screenshot
assets are not added because the final captures do not yet exist.

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
