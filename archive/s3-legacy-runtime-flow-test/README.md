# S3 legacy end-to-end runtime test (moved during the orphaned-test audit)

`test_s3_runtime_flow.py` was never wired into `tools/check.py` (quick or
`--full`). Source inspection shows it drives an S3 step sequence that no
longer exists: it clicks `[data-pc-action="s3-continue-blueprint"]`,
`[data-pc-action="s3-continue-revise"]`, and
`[data-pc-action="s3-run-babbage"]`, none of which are registered anywhere
in current source (confirmed via full-project grep).

This matches the same step-model rename found and fixed in
`tests/test_s3_authentic_assessment.py`: S3's stages went from
Diagnose/Blueprint/Predict/Test-evidence/Audit/Revise to
Sort-evidence/Build/Stress-test/Audit-Babbage/Repair/Apply. The static test
was a straightforward string-swap fix. This one is a full Playwright
end-to-end run through the old step sequence, so it can't be fixed with a
find-and-replace, it needs to be re-driven against the current DOM and
button flow, and verified in a real browser. This sandbox couldn't launch
Chromium to do that verification, so it's archived rather than guessed at.

If end-to-end browser coverage of the current S3 flow is wanted, use this
file as a reference for the harness shape (local Babbage-fallback routing,
`choose()` helper for radio inputs), but the actual step interactions need
to be rebuilt against the live `s3-authentic-assessment.js` action names.
