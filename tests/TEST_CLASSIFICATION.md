# PromptCraft test classification

The authoritative release gate is `tools/check.py`. Tests are classified by behavior ownership rather than filename age.

## Mandatory current contracts

All tests referenced by `QUICK_CHECKS` or `BROWSER_CHECKS` in `tools/check.py` are mandatory current contracts. Phase 1 adds the previously omitted active checks for patches 490, 491, and 510–516, except for the dormant prototype test described below.

Patch 525 adds `test_phase2_module_ownership.py` to the mandatory gate. It
guards the current S1 registry route, module load order, shared/S1 ownership,
application navigation ownership, development-action ownership, and the
explicit retained-dormant list.

Patch 526 adds `test_viewport_controller_526.js` to the mandatory gate. It
guards metric fallbacks, six viewport families, emulated-device behavior,
exact Read Size profiles, centralized listener ownership, and all registered
responsive subscribers.

The Phase 4 readiness checkpoint adds `test_phase4_css_ownership.py` without
advancing the browser patch. It guards the complete cascade inventory, ordered
component migration plan, unchanged runtime-CSS marker, and the rule that
structural CSS deletion is forbidden while visual baselines are unavailable.

Patch 527 adds `test_phase5_tracking_contract.js` and
`test_receiver_v84_fixture.js` to the mandatory gate while retaining the V83
characterization test. They guard stable event identity, activity/score-scale
metadata, V121 compatibility, V83 source identity, V84 duplicate suppression,
formula-safe cells, lossless chunked raw payloads, corrected readable labels,
non-destructive tab handling, and the copied-workbook fingerprint function.

The Phase 6 checkpoint adds `test_phase6_release_contract.py` without advancing
the browser patch. It guards version taxonomy, final ownership documentation,
unchanged product-source hashes, sorted changed-file manifests, debris exclusion,
generated-runtime ownership, and reproducible manifest-only ZIP creation.

The Phase 6 spreadsheet synchronization adds
`test_phase6_spreadsheet_sync.py` without advancing the browser patch. It guards
the three canonical production workbooks, current V429/V121/V83/V84/v149 labels,
manifest-backed visual and audio counts, current roadmap labels, retained legacy
path compatibility, bounded formulas, workbook hashes, and stale-label removal.

Patch 528 added `test_final_analysis_print_version_528.py`. Its active deployment
markers advance with the current browser patch while it continues to guard the
wider, smaller final Module Path heading, the restored shared Print / Save PDF
action, the V429 and V121 compatibility boundary, and a main-menu label that
displays both the stable application build and the advancing browser patch.

Patch 529 adds `test_final_analysis_print_layout_529.py`. It guards scannable
criterion rows in the printed What Worked and Issue Detected findings, plus the
accessible five-step Canvas module-path example. It does not alter gameplay,
tracking, AI requests, or the V121 research schema.

Patch 530 adds `test_shared_analysis_presentation_530.py`. It guards the
optional shared presentation argument, structured PASS and CHECK rows,
accessible process-example lists, responsive ownership, screen-to-print
extraction, legacy paragraph fallback, and unchanged Scenario 3 and Scenario 4
call sites.

Patch 531 adds `test_s3_shared_analysis_migration_531.py`. It guards the
displayed Scenario 3 presentation mapper, separate improvement rows, remaining
limitation row, four-step reflection example, corrected visible numbering,
final-result print action, shared printer reuse, and preservation of internal
`s2` compatibility identifiers.

Patch 532 adds `test_s4_shared_analysis_migration_532.py`. It guards structured
case and Transfer Lab findings, the five-step assessment evidence sequence,
restored print actions, parity with every field from the retired custom print
document, shared printer delegation, corrected visible Scenario 4 numbering,
and preservation of internal `s3` compatibility identifiers.

Patch 533 adds `test_s3_s4_canvas_orientation_533.py`. It protects the Canvas
teaching context in displayed Scenarios 3 and 4 while keeping internal scenario
identities, AI analysis contracts, receiver V83, V429, and V121 unchanged.

Patch 534 adds `test_s3_canvas_dialogue_534.py`. It protects the Scenario 3
Canvas evidence wording, stable dialogue IDs, synchronized intervention
fallbacks, draft-only recording status, and the separated V429/V121/patch
version contract.

Patch 535 adds `test_s4_canvas_dialogue_535.py`. It protects the Scenario 4
Canvas quiz, assignment, submission, rubric, and changed-constraint dialogue;
stable internal `s3` IDs; draft-only voice-tracker rows; and the separated
V429/V121/patch version contract.

## Superseded patch assertions

These files describe mutually exclusive intermediate states and are retained only as patch history:

- `test_s1_validated_transfer_analysis_519.py`
- `test_s1_validated_transfer_analysis_520.py`
- `test_s1_validated_transfer_analysis_521.py`
- `test_s1_validated_transfer_analysis_522.py`

Their current replacement is `test_s1_validated_transfer_analysis_523.py`.

## Dormant prototype tests

These files exercise the dormant `s1-course-design.js` prototype and are excluded from the current release gate:

- `test_s1_course_design.js`
- `test_s1_course_design_runtime.js`
- `test_s1_spreadsheet_checkpoints_511.py`

They remain available until browser verification permits a later archival or
removal. They must not be interpreted as proof that the prototype is live.

## Environment-specific diagnostic

`test_babbage_live.js` calls a deployed service and is intentionally not part of the deterministic local release gate. The local proxy contract is covered by `test_netlify_function.js`.
