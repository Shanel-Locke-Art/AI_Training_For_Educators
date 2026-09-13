# Patch 536: Scenario 1 shared visual shell

Patch 536 aligns the Scenario 1 Content Avalanche screen with the visual system
already used by displayed Scenarios 3 and 4. This is a presentation refactor,
not a gameplay redesign.

## Decision

Scenarios 3 and 4 already share the reusable mission briefing, progress rail,
stage width, typography, spacing, and card rhythm. Scenario 1 now uses that
same page-level framing. Its Canvas evidence station remains scenario-specific
because inspecting a full-width Canvas screen is the core activity rather than
a decorative result summary.

## Preserved behavior

- Four Canvas case tabs and their existing completion state.
- Before and Reveal After comparison controls.
- Full-size evidence modal, Read Size and Fit Image behavior, and supported
  device-profile rules.
- Written comparison input and minimum-word validation.
- Pixel and Eli dialogue, Babbage analysis, Canvas Rescue, transfer activity,
  scoring, progression, tracking, printing, and accessibility behavior.
- Existing Canvas screenshot and audio assets.

## Architecture

- `src/js/scenarios/shared-shell.js` continues to own the shared mission
  briefing builder.
- `src/js/scenarios/shared-components.js` continues to own the shared progress
  rail builder.
- `src/js/scenarios/s1-canvas-evidence.js` owns S1 case content, state, and
  evidence interactions while composing those shared builders.
- `src/css/scenarios/shared.css` owns both the common stage measurements and
  the S1 evidence-station presentation.

## Compatibility

- App build remains `PROMPTCRAFT_V429`.
- Research schema remains `V121`.
- Browser/cache patch advances from 535 to 536.
- Live receiver V83, receiver candidate V84, Babbage proxy V373, and asset
  manifest 149 remain unchanged.
- No spreadsheet, receiver, dialogue, audio, screenshot, or raw archive changes
  are included.
