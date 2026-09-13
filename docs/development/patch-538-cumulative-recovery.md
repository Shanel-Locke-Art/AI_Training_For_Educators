# Patch 538: cumulative recovery baseline

Patch 538 provides one coherent Windows overlay containing the final versions
of every file changed from Patch 534 through Patch 538. It repairs a mixed
local patch state without repopulating unchanged application assets.

The overlay restores the Scenario 3 and 4 Canvas dialogue revisions, their
source/runtime synchronization, the Scenario 1 shared visual shell, recording
tracker status, and the Windows-compatible Playwright runner. The Teaching
Progress browser test now honors the Chromium path supplied by the runner.

The exact V83 receiver, V84 candidate, raw archives, existing screenshots, and
audio assets are deliberately excluded. The protected V83 file remains schema
compatible and retains SHA-256
`f20107b3faa3f28794c9631bfa75e0834c84d96b6eaae2149095be0fb11bba58`.

- App build remains `PROMPTCRAFT_V429`.
- Research schema remains `V121`.
- Browser/cache patch advances from 537 to 538.
- Live receiver V83, candidate V84, proxy V373, and asset manifest 149 remain
  unchanged.
