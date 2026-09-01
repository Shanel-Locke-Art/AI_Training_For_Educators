# PromptCraft test classification

The authoritative release gate is `tools/check.py`. Tests are classified by behavior ownership rather than filename age.

## Mandatory current contracts

All tests referenced by `QUICK_CHECKS` or `BROWSER_CHECKS` in `tools/check.py` are mandatory current contracts. Phase 1 adds the previously omitted active checks for patches 490, 491, and 510–516, except for the dormant prototype test described below.

## Superseded patch assertions

These files describe mutually exclusive intermediate states and are retained only as patch history:

- `test_s1_validated_transfer_analysis_519.py`
- `test_s1_validated_transfer_analysis_520.py`
- `test_s1_validated_transfer_analysis_521.py`
- `test_s1_validated_transfer_analysis_522.py`

Their current replacement is `test_s1_validated_transfer_analysis_523.py`.

## Dormant prototype tests

These files exercise the unreachable `s1-course-design.js` prototype and are excluded from the current release gate:

- `test_s1_course_design.js`
- `test_s1_course_design_runtime.js`
- `test_s1_spreadsheet_checkpoints_511.py`

They remain available until Phase 2 verifies and archives/removes the prototype. They must not be interpreted as proof that the prototype is live.

## Environment-specific diagnostic

`test_babbage_live.js` calls a deployed service and is intentionally not part of the deterministic local release gate. The local proxy contract is covered by `test_netlify_function.js`.
