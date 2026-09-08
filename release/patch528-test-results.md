# Patch 528 validation results

Release: `PROMPTCRAFT_V429_FINAL_ANALYSIS_P528`

## Deterministic release gate

Result: 69 of 69 checks passed.

The new patch contract verifies:

- browser and development cache markers are 528;
- the main menu displays both `Version 429` and `Patch 528`;
- schema V121 remains unchanged;
- the final Module Path analysis includes Print / Save PDF;
- the shared print pipeline recognizes the Module Path report and captures its
  analysis, criteria, recommendations, and submitted work;
- the final finding heading has no 34-character width cap and uses the smaller
  responsive type range;
- editable source and generated runtime bundles are synchronized.

All prior mandatory structural, gameplay, tracking, receiver, asset, responsive
contract, AI proxy, accessibility-marker, S1, S2, and S3 quick checks pass.

## Browser suite

All 17 browser checks were invoked but could not launch because Python
Playwright is unavailable in this workspace. No browser product failure was
observed, and no browser success is claimed.

## Preservation result

- App remains `PROMPTCRAFT_V429`.
- Schema remains `V121`.
- Live receiver V83 and candidate receiver V84 are unchanged.
- Babbage proxy remains `V373`.
- Asset manifest remains `149`; no assets are packaged.
- Gameplay, dialogue, tracking data, spreadsheet structure, AI integration,
  device-profile logic, and accessibility behavior are unchanged.
