# Patch 539: browser contract alignment

Patch 539 realigns the browser regression suite with the scenario registry and
Canvas-oriented dialogue already approved through Patch 538. It does not alter
gameplay, scenario dialogue, tracking, AI requests, accessibility behavior, or
responsive styling.

The corrected contracts cover:

- scenario workspaces mounted in either the shared chat surface or the activity
  input surface;
- Scenario 1's current `content-avalanche` identity during stale-task cleanup;
- Scenario 3's current Canvas grade evidence, result title, DEV shortcut, and
  shared radio-card selector;
- non-destructive audio-unavailable status inside Recorded Dialogue;
- Scenario 4's approved Canvas quiz and assignment language; and
- the current `Learning Path Builder` level title.

The standalone screenshot smoke command now discovers the Chromium executable
installed by Python Playwright, so it no longer requires a manually configured
`PROMPTCRAFT_CHROMIUM` environment variable.

- App build remains `PROMPTCRAFT_V429`.
- Research schema remains `V121`.
- Browser/cache patch advances from 538 to 539.
- Live receiver V83, candidate V84, proxy V373, and asset manifest 149 remain
  unchanged.
