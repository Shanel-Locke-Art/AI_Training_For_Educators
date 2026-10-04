# S1 production loop audit and refactor boundary

Baseline: V429 / Patch 603. Target: Patch 604. Research V121, receiver V94,
and assets v152 remain unchanged. S1 is the reference implementation.

## Active loop

| Screen/state | Decision or action | Gate and feedback | Transition/event |
| --- | --- | --- | --- |
| Menu and launch | Choose S1; finish name/audio setup if needed | Existing launch gates | Shared Maya/Pixel visual introduction |
| Module / activity page | Inspect five items; Previous, Next, Modules | Viewed markers; Continue requires all five opened | Rename |
| Rename | Enter a clearer name for each item | Empty or unchanged title rejected; saved title retained; advance to next missing item | Rename summary |
| Rename summary | Revise titles or organize | Original and revised names shown together | Organization board |
| Organization board | Drag, tap, or use Enter/Space to place items | All five need a placement; status updates after moves | Revised module; practice XP and `s1_learning_path_organized` |
| Revised module | Inspect placements; revise or request guide | Placement-specific coaching, not an assumed correct arrangement | Guide AI loading surface |
| Guide Step 1 | Review navigation guidance and reusable reference | Live feedback or existing fallback; epoch guard rejects obsolete responses | Save or revise |
| Save Guide Step 1 | Save guidance | Local guide saved; guide XP and `s1_course_guide_step_added` | Maya/Pixel reflection |
| Alignment diagnosis | Choose an issue and explain why | Reason requires 10 trimmed characters; every choice has feedback | Diagnosis result; XP and `s1_alignment_diagnosis_complete` |
| Diagnosis result | Revisit diagnosis or continue | Corrective explanation preserves learner reasoning | Maya/Pixel My Course transition |
| My Course: focus | Name one module/unit | Required title; local save | Intended learning |
| My Course: intent | Describe what students should do | Required statement; local save | Activities |
| My Course: activities | Enter current activity names | First two required, two optional; sharing explanation | AI review/loading, existing fallback if needed |
| My Course feedback | Revise overview or enter a next step | Reflection requires 10 trimmed characters | Add to guide; practice/transfer XP and `s1_course_guide_complete` |
| Full saved guide | Read, jump to sections, print, return to menu, clear, or continue | Saved course context and feedback retained locally | Closing Pixel dialogue |
| Closing dialogue | Advance both lines | Guide-complete research event has already been recorded | Calls `markScenarioComplete()`, then scenario menu; see preview guard below |

The research guide-complete event is recorded when the guide is saved. The closing
scene calls `markScenarioComplete()`, but that function currently returns early because
S1 has `implemented: false` in the registry. Thus the baseline does **not** mark the
scenario complete in the menu. Preserve this behavior during the structural comparison;
resolve production/preview completion policy as a separate explicit change.

## Additional routes

- Saved-guide menu opens the full guide when a My Course review was saved, otherwise
  Step 1 or the empty overview. It suppresses modal hit testing and keyboard focus.
- Clear My Guide invalidates pending S1 AI work and clears current/retired workspace keys.
- Revisit/revise routes preserve titles, placements, reasoning, and course context.
- Developer fill remains a development utility, not a learner-facing transition.
- Reset and scenario changes invalidate AI work; late replies cannot replace another scenario.

## Inherited code findings

| Code | Evidence | Treatment |
| --- | --- | --- |
| `pcRunS1BabbageAnalysis` | Still registered under `s1-learning-review-babbage`; not in the normal revised-module → guide path | Retain as compatibility review route; isolate from active workspace rendering |
| `pcRenderS1BabbageComplete` | No callers found in bundled source; old evidence-gap screen | Retain in compatibility file for this update; no removal until external invocation risk is resolved |
| `s1-engagement.js` | Manifest explicitly retains dormant guided-builder code; registered global legacy actions still exist | Keep intact; do not remove based only on current menu configuration |
| `s1-canvas-evidence.js` | Older evidence/building helpers coexist with the new loop | Keep intact; outside current refactor boundary |
| Legacy `s2-metacognition.js` | Menu index 2 now maps to S3 | Do not alter; it is not the Lena accessibility loop |
| `pcRenderS1GuideMiniModule`, `pcBuildS1MyCourseReport`, and individual Canvas-nav wrappers | No production callers found; names remain global compatibility entry points | Retain for this structural pass; document before any removal |
| `pc-s1-*` shared CSS names | S2 already uses these selectors; downstream theme/responsive files also depend on them | Keep as compatibility names while giving the shared layout an explicit owner |
| Historical CSS overrides | Final stage rules rely on earlier declarations and later theme rules | Move without reordering; do not bulk-delete earlier rules |

A further defect reproduced during the audit: an S1 Guide AI response arriving after
opening S2 passed the local epoch-only guard and replaced the S2 workspace. Patch 604
adds scenario ownership to that guard. A regression now holds the reply, changes the
scenario, then releases the reply and verifies S2 remains visible.

## Refactor responsibilities

- Shared presentation owns the task stage, standard taskbar, Canvas navigation/shell,
  and student panel. It renders trusted application templates, not raw AI HTML.
- S1 content owns Maya's example, standards connections, choices, and development examples.
- S1 state owns initialization, reset, storage, progress, scoring helpers, and async guards.
- S1 workspace owns activity screens; guide and My Course each own their domain screens.
- S1 dialogue owns reflection and closing handoffs; the controller owns actions and transitions.
- Compatibility review code stays separate and callable under the existing action names.

Do not change lesson wording, action identifiers, storage keys, XP, research fields,
logos, character assets, or S3. Shared CSS moves keep their original cascade positions.

## Verification

`tools/test_s1_learning_loop.cjs` runs actual onboarding, introduction, the complete
production loop, keyboard organization, required-input gates, saved guide, completion,
the existing preview completion guard,
and scenario switching at 1440×1000, 820×1180, and 390×844. It can record and compare
canonical DOM plus computed layout styles against a pre-refactor walkthrough using
`PC_BASELINE_DIR` and `PC_RECORD_BASELINE=1`. All external requests are blocked and AI
responses are fixtures. This does not verify hosted AI, deployed tracking, or final audio.

Existing S2 flow/AI tests and presentation checks remain required. Build and repository
validation must cover the newly split source files, including all late-response guards.

## Patch 605 follow-up

The preview completion defect described above is now resolved. S1 opts into
`completionAvailable` without enabling the legacy prompt interface. Its final dialogue
marks completion; the existing completion-award record restores menu status on reload.
A saved guide by itself is not treated as completion. Replay keeps the existing reset
policy. The late-response fix from Patch 604 remains covered by the regression.
