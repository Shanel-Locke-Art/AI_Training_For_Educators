# S1 legacy dialogue-diagnosis and after-reflection flow (retired at V429 patch 489)

This holds four functions removed from `src/js/scenarios/shared-components.js`
during the patch-489 cleanup pass. They implemented S1's earlier two-stage
VN-dialogue flow:

1. **Dialogue diagnosis choice** — `pcShowS1DialogueDiagnosis()` /
   `pcChooseS1DialogueDiagnosis()`. Presented a set of choices directly in the
   VN character-dialogue box (`pc-s1-diagnosis-dialogue`, `pcS1DialogueChoices`)
   so the player picked one of several dialogue responses to "diagnose" the
   case.
2. **Separate after-reflection overlay** — `pcShowS1AfterReflection()` /
   `pcSubmitS1AfterReflection()`. Opened a second write-up box layered over
   the VN overlay (`pc-s1-after-reflection-entry`), distinct from the case
   page, and fed the result into the same Babbage loading/analysis chain.

## Why it was removed

Both were unreachable: nothing in current markup or JS ever emitted a
`data-pc-action="s1-dialogue-choose-diagnosis"` or
`data-pc-action="s1-submit-after-reflection"` element, and no other function
called `pcShowS1DialogueDiagnosis()` or `pcShowS1AfterReflection()`. The
`pcRegisterUIActions({...})` entries for both were also removed from
`shared-components.js`.

They were superseded by `pcPlayS1PreviewBriefing()`, which now routes
straight from Pixel's briefing dialogue into the case-page evidence station
via `pcRouteS1ReflectionToCasePage()` — one inline textarea
(`pcS1CaseReflectionText`) and one button (`s1-submit-case-reflection` /
`pcSubmitS1CaseReflection()`) instead of the two older VN-overlay stages.
This matches the "formative diagnose–explain–AI-assist–reveal loop"
described in `docs/development/repository-map.md`.

`pcRouteS1ReflectionToCasePage()` and the shared loading/analysis/cleanup
helpers these functions called into (`pcShowS1ReflectionLoading()`,
`pcClearS1AfterReflectionUI()`, `pcClearS1DialogueDiagnosisUI()`, etc.) were
**not** removed — the current flow still uses them. Only the two outer
entry points and their action registrations were dead.

## Do not restore

Do not re-register `s1-dialogue-choose-diagnosis` or
`s1-submit-after-reflection` as UI actions, and do not re-add calls to
`pcShowS1DialogueDiagnosis()` or `pcShowS1AfterReflection()`, unless the
case-page evidence station is being intentionally replaced again. If a
similar two-stage flow is wanted in the future, treat this file as
reference, not as something to paste back in unmodified — it predates the
current `pcS1CaseReflectionText`/`pcSubmitS1CaseReflection()` markup and
would need to be re-wired against it.

## Tests moved here alongside the code

- `test_s1_after_reflection_484.py` — a static-contract test that asserted
  `pcShowS1AfterReflection`, `pcSubmitS1AfterReflection`, and related
  markers existed in source. It was never wired into `tools/check.py`
  (quick or `--full`), so removing the functions it checked for broke
  nothing that was actually running.
- `test_s1_ai_canvas_rescue_runtime_474.py` — a Playwright browser test
  that drove the entire old flow end to end: calls
  `pcShowS1AfterReflection()` directly, clicks
  `[data-pc-action="s1-submit-after-reflection"]`, and asserts against
  `#pcS1AfterReflection` / `#pcS1AfterReflectionText`, none of which exist
  in current markup. It was also never wired into `check.py`. If
  browser-level coverage of the *current* case-page reflection flow
  (`pcS1CaseReflectionText`, `s1-submit-case-reflection`,
  `pcSubmitS1CaseReflection()`) is wanted, this file is a reasonable
  starting shape to rewrite from, but it would need real rework against
  the current DOM, not a find-and-replace.
