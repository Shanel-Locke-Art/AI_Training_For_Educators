# Patch 536 validation results

Release: `PROMPTCRAFT_V429_S1_SHARED_VISUAL_SHELL_P536`

## Result

- Deterministic quick gate: **77 of 77 checks passed**.
- Patch-specific Scenario 1 shared-visual-shell contract: **passed**.
- Existing Scenario 1 evidence-station contract: **passed**.
- Source/runtime synchronization: **passed**.
- CSS ownership inventory: **regenerated and passed**.
- Receiver V83 and additive V84 fixtures: **passed**.
- Tracking, print, Babbage proxy, viewport, and accessibility contracts:
  **passed**.

## Visual review

The deployed Patch 534 baseline was reviewed in a controlled browser at the
same desktop viewport. Scenarios 3 and 4 shared the same mission briefing,
progress rail, student-evidence card, typography, spacing, and workbench
geometry. Scenario 1 alone used a separate development hero and task panel.
Patch 536 removes that page-level divergence while retaining the full-width
Canvas evidence viewer that S1 instructionally requires.

The current local Patch 536 could not be opened by the remote browser because
the cloud browser blocks loopback URLs. The source/runtime build and all 77
deterministic checks passed. A final local Playwright screenshot comparison is
still recommended before deployment.

## Preserved contracts

- App build remains `PROMPTCRAFT_V429`; schema remains `V121`.
- Browser/cache patch advances from 535 to 536.
- Live receiver V83, candidate V84, proxy V373, and asset manifest 149 are
  unchanged.
- No Canvas screenshots, audio, dialogue, spreadsheets, receiver files, or raw
  archives changed.
