# Patch 542: scenario screenshot scope

Patch 542 improves the visual-regression evidence produced by `tests/test_runtime.py`. It does not change scenario design, dialogue, gameplay, tracking, AI integration, accessibility behavior, or production assets.

## Audit finding

Patch 541 proved that the internal captures loaded assets correctly and that Scenario 1 Before and After evidence was distinct. The focused capture step could still place mobile content beneath PromptCraft's sticky header controls, and the capture set did not preserve a separate top-of-scenario view for comparing the shared shell.

The Patch 541 evidence also confirms that the shared visual alignment from Patch 536 is intact:

- Scenarios 1, 3, and 4 use the same PromptCraft header and scenario navigation.
- Their opening activities use the same mission-banner hierarchy and stage width.
- Their scenario-specific mechanics remain intentionally different.

## Change

The screenshot suite now produces three additional files in every viewport directory:

- `s1-00-overview.png`
- `s3-00-overview.png`
- `s4-00-overview.png`

Focused checkpoints use centered `scrollIntoView` positioning. This keeps the selected activity content visible below sticky mobile controls while retaining nearby context. The complete inventory is 51 named scenario captures: 17 each for desktop, tablet, and phone.

## Preservation boundary

No application source, compiled JavaScript, compiled CSS, receiver, schema, spreadsheet, raw archive, image, or audio file changed. `PROMPTCRAFT_V429`, schema `V121`, receiver `V83`, receiver candidate `V84`, Babbage proxy `V373`, and asset manifest `v149` remain unchanged.
