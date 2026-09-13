# Patch 537: Windows-compatible regression runner

Patch 537 corrects environment assumptions exposed by the first complete
Windows Playwright run. It does not change application design or gameplay.

## Changes

- `tools/check.py` discovers Chromium installed by the active Python Playwright
  environment and supplies its executable path to every child test.
- The viewport ownership test normalizes Windows path separators before
  applying source-owner exclusions.
- The S2 repair contract reads application source explicitly as UTF-8.
- `requirements-dev.txt` declares Playwright and Pillow, the two Python
  packages required by the complete regression suite.
- `.gitattributes` protects the supplied V83 receiver from automatic newline
  conversion. Its exact archive SHA-256 remains the compatibility boundary.

## Compatibility

- App build remains `PROMPTCRAFT_V429`; schema remains `V121`.
- Browser/cache patch advances from 536 to 537.
- S1 shared visual-shell behavior from Patch 536 is unchanged.
- Live receiver V83, candidate V84, proxy V373, asset manifest 149, tracking,
  dialogue, screenshots, audio, and spreadsheets are unchanged.
