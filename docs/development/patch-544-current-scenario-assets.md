# Patch 544: current scenario asset paths

Patch 544 normalizes the PromptCraft visual asset folders to the current visible scenario registry and installs the approved S1-S4 Canvas screenshot captures.

## Current folders

- `scenario-01-content-avalanche/canvas/`
- `scenario-02-accessibility/canvas/`
- `scenario-03-confident-student/canvas/`
- `scenario-04-96-percent-problem/canvas/`

Legacy illustration folders whose names referred to the retired scenario sequence were moved under `assets/images/scenes/legacy/` and are reference-only.

## Runtime routing

`src/js/app/config-and-assets.js` now routes the opening smartboard for S1-S4 to each current scenario's `*-before-module.png` capture. It also registers the full approved screenshot set for S1-S4 under the central `ASSETS.images` registry. S1's existing evidence viewer retains its stable logical IDs but now resolves them to the normalized `s1-*` filenames.

The Scenario 3 Great Falls College backdrop is renamed to `assets/images/backgrounds/gfc/s3-study-lounge.jpg` so its file path matches the visible scenario position.

## Compatibility

- Application build remains `PROMPTCRAFT_V429`.
- Research schema remains `V121`.
- Browser/cache patch advances to `544`.
- Asset manifest advances to `v150`.
- Receiver, research-field names, audio compatibility paths, scoring, and saved data are unchanged.
