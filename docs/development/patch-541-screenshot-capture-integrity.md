# Patch 541: screenshot capture integrity

Patch 541 corrects problems found by reviewing the Patch 540 visual output.
These are test-harness corrections, not application design changes.

The runtime capture now:

- serves SVG and WebP files with their correct browser content types;
- verifies that the PromptCraft header mark loaded;
- scrolls each internal scenario checkpoint into view before capture;
- records viewport screenshots instead of stitched full-page screenshots;
- adds separate detail views for the Scenario 3 and Scenario 4 final results;
  and
- fails when the Scenario 1 Before and After captures are identical.

The result is fourteen internal views per viewport, or forty-two activity
screenshots across desktop, tablet, and phone. The separate final-result detail
views document report content without placing a sticky action panel in the
middle of a stitched page.

- App build remains `PROMPTCRAFT_V429`.
- Research schema remains `V121`.
- Browser/cache patch advances from 540 to 541.
- Gameplay, dialogue, responsive CSS, tracking, AI integration, accessibility,
  receivers, spreadsheets, Canvas evidence assets, audio, and raw archives
  remain unchanged.
