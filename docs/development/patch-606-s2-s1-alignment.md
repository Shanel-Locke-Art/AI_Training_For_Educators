# Patch 606 — S2 alignment with S1

Apply these changed files over V429 / Patch 605. Research V121, receiver V94, and
assets v152 remain unchanged. S2 remains the first accessibility section preview.

## What changed

The previous S2 file combined content, validation, state, AI requests, every screen,
and event handlers. Inspection and diagnosis shared one Canvas page, and its choice,
editor, and review formatting diverged from S1. The refactor gives S2 the same source
responsibilities and uses S1's established components for its major screen types.

| S2 screen | Shared S1 mechanic/presentation |
| --- | --- |
| Visual introduction | Existing shared visual novel, Lena and Professor Pixel |
| Module | Canvas module rows, viewed marker, opened-count progress, gated Continue |
| Original page | Shared `pcRenderCanvasPage`, rich text, Canvas item navigation |
| Diagnosis | Shared `pcRenderLearningDiagnosisChoices`, comparison and decision card |
| AI request | S1 editor shell; attached original HTML; plain-language request |
| Babbage review | Existing shared consultation and in-world terminal |
| Repair comparison | S1 checkpoint/diagnosis-result card and student panel |
| Practice HTML editor | S1 editor shell, insertion, validation and preview action |
| Verify | Shared Canvas page, original comparison, outline and three required checks |
| Repair saved | S1 checkpoint card, changed Lena response, transfer guidance and revisit/replay |

Inspection now hands off to a separate diagnosis screen. That is the only added
screen: the same original decision follows the same page inspection. Existing repair
content and the API contract remain intact. Useful back/review controls preserve the
request, selected decision, and editor contents. Progress reports actual pages opened
or checks completed instead of the previous ambiguous numbered steps.

S1 itself now calls the same page and choice renderers. Its rendered gameplay DOM is
preserved. A shared college-theme rule gives secondary learning-task buttons the same
navy/blue/gold treatment; the previous green secondary treatment is removed from these
surfaces. Babbage's terminal styling remains inside the computer display.

## Source owners

All files below are under `src/js/scenarios/`:

- `s2-accessibility-content.js`: page HTML, prompt, choices, check labels, example repair.
- `s2-accessibility-state.js`: fresh state factory, saved repair, restore/reset, check gate.
- `s2-accessibility-validation.js`: allowed HTML, original content/links and outline checks.
- `s2-accessibility-workspace.js`: individual screen renderers and shared composition.
- `s2-accessibility-ai.js`: request, fallback, report handoff and stale-response guards.
- `s2-accessibility.js`: named learner actions and transitions.

The unused static intro branch is removed; the existing visual introduction remains
the entry point. Unknown screen state returns to exploration instead of pretending to
be completed. The original local-storage key and saved repair format are retained.

Validation also rejects additional visible text outside the expected top-level HTML
blocks. That text previously escaped the content comparison. All existing script,
attribute, wording, link and outline rejection checks remain in place.

## Scope and verification

S2 does not mark a full scenario complete, award scenario XP, emit legacy metacognition
research events, or write to S1's Course Guide. No S3 work, new accessibility activities,
receiver/schema changes, artwork changes, or final recording changes are included.

The full S1 walkthrough compares all 18 gameplay screens with the pre-refactor DOM
and selected computed-style captures at desktop, tablet and phone. It also checks
completion/reload/XP/replay, guide/print/clear actions and late-response ownership.

S2 tests exercise the full repair at those viewports, required gates, keyboard diagnosis,
review/back navigation, check progress, invalid HTML, preservation of S1's guide,
saved repair reload, narrative replay and horizontal overflow. Simulated live AI tests
cover request/report handoff, copy feedback, invalid output retry, and late cancellation.
Presentation tests now compare the shared module, page and diagnosis styles, not only
the outer stage. Browser replies are fixtures; hosted AI/tracking and physical devices
are not tested by these local checks.

Run build synchronization, repository validation, and CSS/asset audits. The update ZIP
contains only files changed since Patch 605. Add the new source files and overwrite
matching paths; no deletion is required.

Results: full S1 and S2 flows passed at all three viewports. Shared module/page/diagnosis
style comparisons, simulated live AI/retry/cancellation, build synchronization, structural
validation and CSS/asset audits passed. Desktop and phone screen captures were visually
inspected. The sources for S3/S4, dialogue, research, receiver, assets, and the Babbage
server contract remain byte-identical to Patch 605.
