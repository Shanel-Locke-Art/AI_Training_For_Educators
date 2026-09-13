# Patch 533: Scenarios 3 and 4 Canvas orientation

Patch 533 makes the two currently playable later scenarios explicitly Canvas
oriented while preserving their instructional problems, decisions, scoring,
progression, AI contracts, tracking fields, accessibility behavior, and shared
analysis presentation.

Canvas remains the environment for the teaching problem. Neither scenario is a
Canvas navigation tutorial.

## Displayed Scenario 3: The Confident Student Problem

- Locates Jordan's case in a Week 4 Canvas module with a practice check and
  reflection assignment.
- Frames the intervention choices as Canvas-compatible checks, feedback, and
  reflection moves.
- Grounds both Babbage prompts in the Canvas module without changing the
  `s2_draft` or `s2_review` contracts.
- Reworks the visual process example as `OPEN MODULE`, `TRY THE CHECK`,
  `USE FEEDBACK`, and `CHOOSE NEXT MOVE`.

## Displayed Scenario 4: The 96% Problem

- Identifies the original assessment as a recall-heavy Canvas quiz in the Week
  4 module.
- Maps the assessment blueprint to a Canvas Page, Canvas Assignment,
  submission evidence, visible reasoning, and Canvas rubric.
- Reworks the visual process example as `MODULE CONTEXT`, `ASSIGNMENT`,
  `SUBMISSION`, `REASONING`, and `RUBRIC`.
- Makes the optional Transfer Lab ask for an educator's current Canvas
  assessment and module/rubric context without changing its privacy boundary.

## Preservation boundary

- App build remains `PROMPTCRAFT_V429`.
- Research schema remains `V121`.
- Browser/cache patch advances from 532 to 533.
- Live receiver V83, undeployed V84 candidate, Babbage proxy V373, receiver
  field names, internal `s2`/`s3` identifiers, save data, and raw archives are
  unchanged.
- Prerecorded dialogue text is unchanged so visible dialogue remains aligned
  with existing audio assets.
- No CSS or image/audio asset changes are included.

## Regression coverage

`tests/test_s3_s4_canvas_orientation_533.py` verifies the Canvas teaching
context and confirms preservation of the stable AI, receiver, build, and schema
contracts. Existing Scenario 3, Scenario 4, shared-analysis, tracking, print,
responsive, and accessibility tests remain in the release gate.
