# Dormant S1 modules after Phase 2 ownership separation

This record explains what remains dormant after patch 525. Phase 2 separated
live ownership, but did not delete either prototype because the required
browser executable was unavailable in the refactor workspace.

## Background

The live S1 scenario (`registry.js`, `key: 'content-avalanche'`) uses
`rendererKey: 'content-avalanche-preview'`, which routes into the Canvas
evidence-station flow implemented in `s1-canvas-evidence.js`
(`renderS1ContentAvalanchePreview`, `pcRouteS1ReflectionToCasePage`, the
`pcS1CaseReflectionText` / `s1-submit-case-reflection` case page). That is
the only S1 implementation reachable through normal play.

Two other complete S1 implementations are still declared in
`src/js/manifest.json`, still compiled into `runtime/js/promptcraft.bundle.js`
by every `tools/build.py` run, and still have their own CSS files compiled
into `runtime/css/promptcraft.css`, but neither is reachable from the
current registry.

## `src/js/scenarios/s1-course-design.js` — fully unreachable

554 lines, plus a dedicated 160-line `src/css/scenarios/s1-course-design.css`.

Its header comment: *"PROMPTCRAFT SCENARIO 1 — THE CONTENT AVALANCHE /
Diagnose → Build a Canvas path → Audit Babbage → Repair and compare."* This
is a second, complete build of the same "Content Avalanche" concept the
live evidence-station design also carries, using a different interaction
model entirely: pick a diagnosis from a list, drag-build a Canvas pathway,
audit the result with Babbage, then repair and compare.

Confirmed by full-project grep: none of its six render entry points
(`renderS1CourseDesignStandby`, `renderS1CourseDiagnosisActivity`,
`renderS1CoursePathwayActivity`, `renderS1CourseAuditActivity`,
`renderS1CourseRepairActivity`, `renderS1CourseFinalComparison`) has a
caller anywhere else in the source tree. They're only reachable via
`pcExposeGlobals({...})`, which attaches them to `window` for direct
function-call testing, which is how `tests/test_s1_course_design.js` and
`tests/test_s1_course_design_runtime.js` reach them. Its four registered UI
actions (`s1-course-after-diagnosis`, `s1-course-run-babbage`,
`s1-course-after-audit`, `s1-course-repair`) only appear inside this file's
own unreachable HTML output, never in live markup.

This module appears to be a full prototype that lost out to the current
evidence-station design and was never removed.

## `src/js/scenarios/s1-engagement.js` — dormant guided-builder implementation

491 lines after navigation extraction, plus a dedicated 582-line
`src/css/scenarios/s1-engagement.css`.

Its header comment: *"SCENARIO 1 — ENGAGEMENT WORKBENCH / Guided repair
builder, analysis handoff, score reflection, and revision."* This looks
like an older implementation than `s1-course-design.js`, an S1 built
around the same guided-repair-builder pattern S2 still uses today
(`renderGuidedBuilder`, an assembled-prompt preview, send to Babbage,
review, revise).

`renderGuidedBuilder` is registered in `registry.js` under
`'guided-builder': ({ container }) => renderGuidedBuilder(container)`, but
no scenario's `rendererKey` is `'guided-builder'`, so that entry point is
unreachable the same way `s1-course-design.js` is.

Patch 525 moved shared scenario-navigation actions to
`src/js/app/action-routing.js` and development-only actions to
`src/js/dev/development-tools.js`. `s1-engagement.js` now owns only its older
guided-builder implementation and related S1 actions.

It's also not certain every guided-builder function in this file is fully
dead. A few, `sendGuided`, `getS1GuidedValues`, `analyzeS1Guided`, are
still referenced by generic conditional branches in
`src/js/app/scenario-runtime.js`, for example:

```js
if (scenarioIndex === SCENARIO_INDEX.CONTENT_AVALANCHE && typeof sendGuided === 'function') {
  return sendGuided();
}
```

Whether that branch is actually reachable from the current S1 flow (which
submits through `s1-submit-case-reflection` / `pcSubmitS1CaseReflection()`
instead) wasn't traced further. Confirming it would need real browser
testing, not just source grep.

## Status after patch 525

Both dormant modules still build and ship as-is. Phase 2 deliberately makes
no deletion claim. If either is revisited:

- `s1-course-design.js` and its CSS file can likely be archived as a unit
  with the same confidence as the S1 reflection cleanup in
  `archive/s1-legacy-dialogue-diagnosis-v489/`.
- `s1-engagement.js` no longer owns shared navigation, but the
  `scenario-runtime.js` conditional branches above still require verification
  in an actual browser before the guided builder is removed.
