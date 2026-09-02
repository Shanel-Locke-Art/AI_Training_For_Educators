# Phase 4 CSS ownership readiness

Phase 4 consolidates CSS one component family at a time. This checkpoint builds
the final-cascade ownership evidence and deletion gate. It intentionally does
not move or delete CSS because the current workspace has no browser executable
for computed-style and screenshot baselines.

The app remains `PROMPTCRAFT_V429`, schema `V121`, receiver `V83`, proxy `V373`,
asset manifest `149`, and browser/cache patch `526`. The patch does not advance
because browser source and runtime CSS are unchanged.

## Measured baseline

| Measure | Current value |
|---|---:|
| Application CSS owners | 20 |
| Active application rules | 4,642 |
| Normalized selector headers | 2,721 |
| Selector headers owned by multiple files | 192 |
| Application `!important` declarations | 11,512 |
| `final-overrides.css` lines | 5,657 |
| `final-overrides.css` rules | 886 |
| `final-overrides.css` `!important` declarations | 1,737 |

The four additional `!important` declarations in the repository-wide count
belong to the standalone Ideas Wall stylesheet and are excluded from the main
application cascade totals.

`release/phase4-css-ownership.json` records all 4,642 rule occurrences in final
cascade order. A selector occurrence includes its source owner, cascade index,
rule index, media/keyframe context, and `!important` count. The inventory also
maps selectors into the migration families below. Family matching is an audit
aid; the full selector occurrence list remains authoritative.

## Controlled migration order

1. Onboarding and menu
2. Visual novel and cast
3. S1 evidence and modal
4. Babbage loading and results
5. S2
6. S3
7. Teaching progress

Each family may require multiple browser patches beginning with 527. A slice
must remain small enough to compare before and after states at every supported
viewport family.

## Required proof before a slice moves

- Computed styles captured before the move for the affected elements and states
- Screenshots captured at the six documented viewport families
- No visual difference beyond the approved pixel tolerance
- No new horizontal or vertical overflow
- Keyboard navigation, focus trapping and restoration, Escape behavior, and
  keyboard drag/drop remain intact where applicable
- Reduced-motion behavior and live announcements remain intact
- CSS audit reports fewer ownership conflicts or fewer `!important`
  declarations
- Only blocks proven superseded are deleted

## Current blocker

Python Playwright is unavailable. Node Playwright is installed, but its
Chromium, Firefox, and WebKit executables are absent. A bounded Chromium install
attempt did not produce an executable. Therefore no visual browser assertion
ran, and structural CSS movement or deletion remains prohibited.

This is an environment limitation, not a PromptCraft product failure. The
existing 63-check Phase 3 gate passed before this checkpoint, and the new CSS
ownership test raises the deterministic gate to 64 checks.
