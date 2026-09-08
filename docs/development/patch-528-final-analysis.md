# Patch 528: final analysis readability and printing

Patch 528 is a presentation and regression-hardening patch. The public application
build remains `PROMPTCRAFT_V429`, the research schema remains `V121`, and the live
Apps Script receiver remains V83. The V84 receiver candidate is unchanged.

## Changes

- The Scenario 1 Module Path finding now uses the available report width and a
  smaller responsive heading size. No report content or responsive breakpoint
  changed.
- The final Module Path analysis now exposes the shared Print / Save PDF action.
  Its printable report includes the status, visible and missing learning-path
  criteria, next design move, human-review note, and submitted path.
- The main-menu footer now displays both identities: `Version 429 · Patch 528`.
  The stable application build and advancing browser patch are read from the
  active bundle URL instead of being maintained as unrelated labels.
- Current deployment-marker regression assertions advance to 528. The Phase 6
  release test now treats P527 hashes as an archival checkpoint, allowing later
  controlled product patches while continuing to validate the archive format.

## Unchanged contracts

- Gameplay, dialogue, AI request/response behavior, tracking events, spreadsheet
  columns, research archives, receiver code, assets, and device-profile logic are
  unchanged.
- `PROMPTCRAFT_V429`, schema `V121`, dialogue assets `149`, live receiver V83,
  candidate receiver V84, and Babbage proxy V373 remain in force.
