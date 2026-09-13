# Patch 532 validation results

Release: `PROMPTCRAFT_V429_SCENARIO4_ANALYSIS_P532`

## Deterministic release gate

Result: 73 of 73 checks passed.

Patch 532 migrates the displayed Scenario 4 case analysis and Transfer Lab
analysis to the shared presentation and print system. The regression contracts
verify:

- separate evidence rows in the case analysis;
- separate current-evidence, authenticity, stronger-evidence, alignment-gap,
  and remaining-limitation rows in the Transfer Lab;
- the accessible SITUATION, PERFORMANCE, EVIDENCE, REASONING, and CRITERIA
  sequence;
- Print / Save PDF on the Transfer Lab analysis and final comparison;
- Print / Save PDF on the Scenario 4 result;
- preservation of every content field from the retired custom print document;
- removal of the duplicate window/document/CSS printer;
- delegation through the shared document-first printer;
- corrected visible Scenario 4 completion labels;
- preservation of internal `s3` compatibility identifiers;
- source/runtime JavaScript synchronization.

All prior mandatory structural, gameplay, tracking, receiver, asset, responsive,
AI proxy, accessibility-marker, and scenario quick checks pass.

## Browser suite

All 17 browser checks were invoked but could not launch because Python
Playwright is unavailable. The available Node Playwright package also lacks its
browser executable. No browser product failure was observed, and no browser
success is claimed.

## Preservation result

- App remains `PROMPTCRAFT_V429`.
- Schema remains `V121`.
- Live receiver V83 and candidate receiver V84 are unchanged.
- Babbage proxy remains `V373`.
- Asset manifest remains `149`; no assets are packaged.
- Responsive CSS, device profiles, spreadsheets, and raw archives are unchanged.
- AI prompts and response contracts are unchanged.
- Gameplay, dialogue, scoring, XP, completion, progression, tracking payloads,
  and Ideas Wall moderation are unchanged.
