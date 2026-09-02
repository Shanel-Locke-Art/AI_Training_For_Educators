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
