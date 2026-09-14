# Patch 540: internal scenario screenshots

Patch 540 changes the optional runtime screenshot output from outer scenario
shells to named internal activity checkpoints. This corrects a visual-review
problem where the menu or introductory layer could make every captured image
look the same.

The capture set now records twelve views for each tested viewport:

- Scenario 1 Canvas case, before and after;
- Scenario 3 diagnosis, Babbage audit, guided repair, and final result; and
- Scenario 4 diagnosis, assessment blueprint, stress test, Babbage audit,
  inference repair, and final result.

Desktop, tablet, and phone images are stored in separate folders under
`runtime-test-output/scenario-views/`. Screenshots use explicit local fallback
fixtures where a later checkpoint normally depends on a live Babbage response.
No external request or research record is created during capture.

- App build remains `PROMPTCRAFT_V429`.
- Research schema remains `V121`.
- Browser/cache patch advances from 539 to 540.
- Gameplay, dialogue, responsive CSS, tracking, receivers, spreadsheets,
  screenshots used as Canvas evidence, audio, and raw archives remain unchanged.
