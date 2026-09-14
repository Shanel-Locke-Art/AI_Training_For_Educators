# Patch 543 validation results

Release: `PROMPTCRAFT_V429_RUNTIME_CAPTURE_STABILITY_P543`

## Patch 542 browser evidence

- All 51 intended scenario screenshots were written: 17 each for desktop, tablet, and phone.
- PromptCraft brand assets loaded in all three viewports.
- Scenario 1 Before and After screenshots had different SHA-256 hashes in all three viewports.
- Desktop and phone opening-overview and centered-checkpoint framing succeeded.
- The tablet run failed one onboarding timing assertion and captured the name dialog over its 17 scenario views.

## Patch 543 validation

- Deterministic quick gate: **83 of 83 checks passed**.
- Patch 541 screenshot integrity contract: **passed**.
- Patch 542 screenshot scope contract: **passed**.
- Patch 543 runtime capture stability contract: **passed**.
- Python syntax compilation: **passed**.
- Source/runtime synchronization: **passed**.
- Full browser capture: **requires confirmation in the user's Windows Playwright environment**.

## Preserved contracts

- App build remains `PROMPTCRAFT_V429`; schema remains `V121`.
- Browser/cache patch advances from 542 to 543.
- Gameplay, dialogue, responsive CSS, tracking, AI integration, accessibility,
  receivers, spreadsheets, Canvas evidence assets, audio, and raw archives are unchanged.
