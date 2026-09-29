# Scenario 1 Cleanup Log

## 2026-09-29 — Patch 599 consistent Continue controls

- Replaced the remaining dark-green Continue buttons with the shared blue primary-action treatment.
- Standardized Continue-button height, padding, radius, type, capitalization, wrapping, hover, focus, and disabled states.
- Applied the shared control to Scenario 1, prediction results, Babbage return actions, completed results, the main menu, and narrow responsive layouts without changing navigation behavior.

## 2026-09-29 — Patch 598 shared blue-and-gold branding

- Standardized shared PromptCraft surfaces on the Great Falls College navy, blue, sky, and gold palette.
- Replaced the visual-novel menu’s temporary star with the approved PromptCraft/Babbage mark.
- Added the approved mark to the main menu and Course Guide headers, including the printed guide.
- Removed the remaining non-semantic dark-green brand treatments while preserving green for actual success states and Babbage’s in-world CRT display.
- Corrected two outdated blue-token references so onboarding and S2 evidence borders use the intended shared palette.

## 2026-09-28 — Patch 597 recording audit and print contrast

- Audited every active Scenario 1 spoken line against the application source: six Professor Pixel lines and three Maya lines require recording.
- Confirmed the Maya guide also documents all 16 fixed or conditional on-screen lines; the two runtime-generated organizer lines remain on-screen rather than receiving misleading fixed recordings.
- Updated the recording scripts and production trackers with the verified line inventory, exact filenames, source IDs, and asset paths.
- Darkened printed Course Guide card headings so they remain readable even when a browser suppresses background colors.

## 2026-09-28 — Patch 596 reliable Course Guide reset

- Reset now invalidates and aborts any active Scenario 1 Babbage request before clearing local Course Guide data.
- Late analysis responses can no longer repopulate the guide or redraw a Scenario 1 result after reset.
- The reset verifies that every current and retired Scenario 1 guide/workspace key was removed.
- The development control now says `Reset Run + XP + Guide` so its scope is explicit.
- Saved guides now include a user-facing `Clear My Guide` control with confirmation and an immediate empty-state refresh.

## 2026-09-28 — Patch 595 purposeful required responses

- Reframed the diagnosis explanation as a comparison between the participant’s reasoning and the alignment feedback.
- Reframed the transfer reflection as a personal next step saved in My Course Guide.
- Added plain-language research-record notices and reminders not to enter names.
- Disabled both submit actions until the participant enters a meaningful response, with live readiness messages.

## 2026-09-28 — Patch 594 shared typography hierarchy

- Standardized the game on Nunito for body copy and controls, Fraunces for display headings and dialogue, and uppercase Source Code Pro for section labels and eyebrow headings.
- Applied the same hierarchy to the main menu, scenarios, Course Guide, onboarding, analysis screens, and Ideas Wall.
- Preserved the Canvas replica and Babbage terminal as intentional in-world typography exceptions.
- Removed the unused Lora webfont request and bumped the browser cache key to Patch 594.

## 2026-09-28 — Patch 593 and Receiver V94 focused research evidence

- Replaced S1 checkpoint scores and attempt counts in the readable workbook with placement decisions, alignment correctness, written rationale, transfer reflection, completion status, and feedback provenance.
- Added one short alignment-rationale prompt and one transfer-reflection prompt to the S1 experience.
- Kept personal module titles, learning statements, activities, and saved guide content on the participant device.
- Removed repeated S1 OSCQR strings and duplicate Claude/Babbage/final-response payload text from new incremental events while retaining V121 compatibility.
- Corrected the active raw scenario label to `S1: Start With the Learning`.
- Serialized browser posts and deferred S1 readable-view rebuilding until the final checkpoint to prevent challenge-score updates from competing with research saves.
- Hid redundant Process Log, Research Responses, Process Events, challenge, and raw tabs from the normal workbook view. Raw records remain available for troubleshooting.
- Rebuilt the Overview, Sessions, S1 results, and Research Guide around relevant research evidence and set explicit readable column widths.

## 2026-09-28 — Receiver V93 schema-reference repair

- Corrected two receiver status responses that referenced the nonexistent `EXPECTED_SCHEMA` variable instead of `EXPECTED_APP_SCHEMA_VERSION`.
- Updated the workbook initialization message to describe the current retired-tab cleanup accurately.
- Receiver V93 can now complete `initializeWorkbookNow()` and `refreshResearchViewsNow()` without failing while building the final response.

## 2026-09-28 — Patch 592 navy activity suggestion cards

- Matched the saved-guide activity suggestions to the visual structure of the module-pattern cards.
- Added the “Ways to improve the activities you entered” section heading to the saved guide.
- Replaced numbered circles with dark navy activity-title header bands and light recommendation bodies.
- Bumped the browser cache key to Patch 592.

## 2026-09-28 — Patch 591 activity suggestion headings

- Converted each saved-guide activity suggestion from one paragraph into a real heading and supporting recommendation.
- Uses the instructor’s quoted activity title as the card heading when one is available.
- Increased card padding and heading contrast while retaining the numbered two-column layout.
- Bumped the browser cache key to Patch 591.

## 2026-09-28 — Patch 590 clean Course Guide storage

- Moved the Course Guide and My Course workspace to a fresh local-storage generation so prototype entries cannot return after a cache clear.
- Removed the retired v1 and v2 guide/workspace records automatically when the updated application loads.
- Updated Reset Run + XP to clear the current guide generation and immediately refresh the main-menu guide state.
- Bumped the browser cache key to Patch 590.

## 2026-09-24 — Patch 589 guide footer spacing

- Added bottom padding inside the Step 1 “Try this with AI” panel.
- Added more breathing room above and below the saved-guide action buttons on desktop and mobile.
- Bumped the browser cache key to Patch 589.

## 2026-09-24 — Patch 588 guide and receiver cleanup

- Rebuilt the saved Step 1 guide hierarchy to match the clean main-menu Course Guide, separating the reusable Canvas reference from participant-specific feedback.
- Removed the nested pale review panel and technical “Live Babbage review” label from the learner-facing guide.
- Replaced Receiver V91 with V92. The S1 research tab now keeps analysis-ready fields, removes repeated OSCQR text and full placement maps from the summary, and caps wrapped row height.
- Retired scenario result tabs are deleted during workbook initialization instead of remaining as hidden duplicates; full current evidence remains in the raw history.
- Bumped the browser cache key to Patch 588.

## 2026-09-24 — Patch 587 S1 guide handoff repair

- Removed the repeated title block inside Course Guide Step 1; the reading surface now has one page header.
- Replaced the two-step Add/Continue handoff with one `Save to My Guide and Continue` action.
- Restored focus, pointer, and accessibility state whenever the shared dialogue overlay reopens after the guide, fixing the Maya scene that rendered but could not advance.
- Bumped the browser cache key to Patch 587.

## 2026-09-24 — Patch 586 Course Guide brand consistency

- Aligned Course Guide headings with the main menu's Fraunces display type.
- Aligned guide labels and eyebrows with the Source Code Pro uppercase treatment used across the PromptCraft brand.
- Kept body copy and buttons in Nunito for readable interface text.
- Replaced off-brand green guide buttons with the Great Falls College navy, blue, sky, and gold color system.
- Standardized guide headers, cards, empty-state notice, borders, focus rings, and hover states across empty, preview, and populated guide views.
- Bumped the browser cache key to Patch 586.

## 2026-09-24 — Patch 585 clean Course Guide workspace

- Moved the local My Course workspace and Course Guide to new v2 browser-storage keys so development examples from the v1 test cycle cannot appear in a new run.
- Updated the local guide-section count to use the v2 guide record.
- Expanded Reset Run + XP so it clears both old and current S1 Course Guide and My Course storage.
- Removed the automatic DEV fill that ran immediately after reset; reset now returns S1 to a genuinely empty starting state.
- Left receiver V91 and V121 research records unchanged because this is a browser-local workspace correction.
- Bumped the browser cache key to Patch 585.

## 2026-09-23 — Patch 584 saved-content-only Course Guide

- Removed the populated-guide overview, generic OSCQR cards, general course checklist, and AI-use checklist because the learner had not chosen to save them.
- Limited the populated guide to the learner's saved course feedback and saved module view.
- Used the saved module name as the guide title and removed the AI-source label from the feedback heading.
- Cleaned repeated punctuation in saved generated feedback before display or printing.
- Kept recommendation cards together during printing to avoid a single stranded item at the bottom of a page.
- Bumped the browser cache key to Patch 584.

## 2026-09-23 — Patch 583 Course Guide content and print cleanup

- Removed the S1 practice example, repeated module pattern, Scenario 1 labels, and scenario-specific framing from the saved full guide.
- Reframed the guide as a growing collection of material the learner deliberately saves while completing scenarios in any order.
- Kept the learner's saved course feedback, module view, a concise set of relevant OSCQR connections, and a short checklist.
- Replaced Prepare / Practice / Evidence labels in the saved module view with broader course-design language.
- Strengthened text and border contrast on the reading surface.
- Added print-specific heading colors and tighter pagination so the guide remains readable when background graphics are disabled.
- Bumped the browser cache key to Patch 583.

## 2026-09-23 — Patch 582 neutral Course Guide entry

- Made My Course Guide available from the main menu before any scenario begins.
- Added a short scenario-neutral overview that explains what the guide is, why to use it, and that scenarios may be completed in any order.
- Prevented unsaved Scenario 1 examples or fallback feedback from appearing as participant work.
- Removed the persistent app chrome while the guide is open so the guide has one header and one scroll surface.
- Reworked print styling to remove app controls, fit the page, and avoid splitting key cards.
- Bumped the browser cache key to Patch 582.

## 2026-09-23 — Patch 581 saved guide interaction and single header

- Removed the repeated inner Course Guide banner from the saved S1 guide; the outer guide title is now the only page header.
- Made the saved guide own the hit-testing and scroll surface: hidden VN/menu layers are inert and excluded from pointer input while the guide is open.
- Restored the VN layer when leaving the guide so closing dialogue and normal scenario navigation continue to work.
- Bumped the browser cache key to Patch 581 so a deployment cannot reuse the Patch 580 runtime.

## 2026-09-23 — Patch 580 asset naming standard

- Standardized S1 recording names as `speaker_scenario_line`, including `pp_s01_01.mp3` and `maya_s01_01.mp3`.
- Renamed existing shared audio by speaker and context, with the earlier S1 runtime introduction reserved as `pp_s01_00.mp3`.
- Standardized character, background, interface, scene, reference, and retained legacy visual filenames.
- Added `ASSET_NAMING_STANDARD.md` and updated both recording scripts, all three production workbooks, the asset manifest, runtime paths, and written asset guides.
- Removed the obsolete version-specific asset workbook rebuild script so it cannot recreate the previous filenames.

## 2026-09-23 — Patch 579 saved guide navigation and layout

- Prevented the previous dialogue overlay from reactivating over a Course Guide opened from the Main Menu.
- Added a dedicated scroll container, sticky section navigation, working section jumps, Back to Main Menu, and Print / Save PDF controls.
- Reflowed the saved guide into a narrower reading page with clearer feedback cards and responsive phone behavior.

## 2026-09-22 — Patch 578 feedback, guide access, and research view

- Corrected the My Course review so a valid live Babbage response is no longer replaced by the limited-input fallback.
- Corrected the Step 1 guide renderer so it displays the calculated Babbage insight instead of discarding it.
- Added visible `Live Babbage review` and `Built-in review` labels so the feedback source is clear.
- Preserved the saved My Course feedback in the local guide and added a `My Course Guide` button to the main menu after a guide section has been saved.
- Moved the personalized course critique ahead of the generic visual-module reference in the completed guide.
- Simplified the S1 research projection from 13 columns to 11, combined guide status fields, converted technical values to readable labels, and froze only the first two identifying columns.
- Confirmed the deployed Babbage proxy is configured and returns a specific structured response for deliberately weak course input.

## 2026-09-22 — Dormant course-design prototype removal

- Removed the unreachable `s1-course-design.js` and its dedicated CSS from this working package; their prototype tests and temporary archive were removed in the subsequent repository cleanup.
- Removed both source files from the build manifests and regenerated the browser bundles. These files are no longer shipped to players.
- Updated the Phase 2 route guard to assert the current `start-with-learning` renderer instead of the superseded evidence route.
- Left the old Canvas evidence and guided builder modules in place because they still have references in shared code and old tests. Their dependency review and browser coverage are required before removal.
- The uploaded baseline's broad check already had failures in superseded S1 expectations, stale CSS inventory, spreadsheet expectations, and static validation; a full passing release gate is not claimed.


## 2026-09-17 — Start With the Learning, exploration slice

### Removed
Nothing. No legacy S1 file, function, style, asset, or generated/runtime source was removed in this pass.

### Added
- `src/js/scenarios/s1-start-with-learning.js`: isolated ownership for the revised S1 exploration state, five Canvas items, page navigation, Maya quote mapping, and the exploration completion gate.
- `src/css/scenarios/s1-start-with-learning.css`: isolated S1 composition and Canvas-like presentation for this slice.
- `tests/test_s1_start_with_learning_544.py`: real Chromium regression for five-item exploration, Maya quote changes, retained viewed state, PromptCraft menu, Teaching Progress, phone width, and 200% text scaling.

### Preserved
- Existing PromptCraft logo and Babbage mark.
- PromptCraft dropdown and Teaching Progress UI.
- `PROMPTCRAFT_V429` and V121 research schema.
- Existing Babbage workstation/monitor/desk/classroom assets and code.
- Existing Maya artwork, used directly from `assets/images/characters/students/maya/maya_01_neutral.png`.
- Existing GFC theme.
- Existing S1 legacy implementations and Canvas evidence assets. They remain untouched pending replacement coverage and the full S1 completion gate.
- `src/` remains authoritative; `runtime/` is generated by `tools/build.py`.

### Why no dead code was removed
The revised S1 currently replaces only the exploration slice. The rename, organization, diagnosis, Babbage analysis, and My Course portions do not yet exist in the new route, so the project's dead-code removal gate is not satisfied.

### Tests protecting this slice
- `python tools/build.py --check`
- `python tests/test_s1_start_with_learning_544.py`
- Browser playthrough verified five Canvas activities, Previous/Next navigation, viewed-state retention, gated Continue, PromptCraft menu, Teaching Progress, mobile width, 200% text scaling, and no page-level horizontal overflow.

### Known baseline/test-suite debt
`release/phase4-css-ownership.json` was stale before this rebuild and remains stale. Several older static S1 tests still assert that `content-avalanche-preview` is the active S1 route; those tests describe the superseded route and should be migrated deliberately rather than being treated as runtime failures of the new exploration slice.
