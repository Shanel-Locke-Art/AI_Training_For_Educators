# PromptCraft

Current application: `PROMPTCRAFT_V429`, browser patch `608`, research schema `V121`, Apps Script receiver source `V94`, asset manifest `v152`.

Scenario 1 is **Start With the Learning** with Maya and Professor Pixel. Its controller is `src/js/scenarios/s1-start-with-learning.js`; production responsibilities live in `s1-learning-*.js`, selected by `src/js/scenarios/registry.js`. The internal `content-avalanche` scenario key remains for saved data and research compatibility.

## Work on the application

- Edit JavaScript and CSS under `src/`. `runtime/` is generated browser output.
- Run `python tools/build.py` after source changes, then `python tools/build.py --check` to confirm the browser files match.
- Run `python tools/audit_assets.py` and `python tools/audit_css.py` when changing assets or styles.
- `index.html` opens the game; `wall.html` opens the Ideas Wall. `netlify/functions/babbage.js` owns the Babbage server contract.
- `apps-script/PromptCraft_Receiver_V94_Start_With_Learning.js` is the retained receiver source. After deploying it as a new web-app version, run `initializeWorkbookNow()` once. V94 presents focused S1 evidence, hides redundant technical views, and preserves detailed recovery records in raw history. During testing, `resetResearchDataNow()` clears collected test records without removing headers or workbook structure. `inspectS1TrackingNow()` provides a privacy-safe count of the S1 event types received.

## Production references

- `docs/README.md` maps the current production documents.
- `docs/development/s1-removal-audit.md` records remaining legacy source dependencies.
- `docs/asset-management/` contains the S1 artwork lists, recording scripts, and production trackers.

Historical patch packages, test suites, and retired recording guides were removed from this working package. The original uploaded repository ZIP remains a separate backup. Receiver V94 remains the existing S1 receiver. This patch does not change its deployment or initialization requirements. Complete a hosted S1 smoke pass before participant testing.

## S2 heading-repair preview (Patch 603)

Scenario Select opens **S2: Access Is Part of the Design**. This focused activity uses S1’s task header, Canvas frame, character panel and shared button styles. Meet Lena, inspect one page, identify its heading barrier, ask Babbage, review the repair, insert it into the practice HTML editor, then check and save it. Each screen has one main task; unfinished handout and diagram activities are not in the playable section.

Lena has three replaceable transparent draft portraits: neutral, thinking and confident. See `assets/images/characters/students/lena/README.md` for filenames and replacement instructions. Asset manifest is now v152.

Live Babbage still requires the `s2_accessibility_heading_repair` Netlify contract introduced in Patch 600. Patch 601 does not change that function. Built-in practice examples are labeled. S2 practice storage remains independent of S1; full scenario guide, My Course, XP and research integration are pending. Application V429, schema V121 and receiver V94 remain unchanged.

Patch 602 restores the S2 visual narrative introduction using the shared dialogue system, Professor Pixel and Lena’s draft portraits. The introduction hands off to Lena’s Canvas module. Practice again replays the opening. Text is draft dialogue; no final voice recordings are added.

Patch 603 removes the remaining independent S2 layout rules. S2 inherits S1’s photographic stage, title treatment, module rows, character panel and workspace scrolling. S1 and S2 visual narrative colors now share the college theme. Use `node tools/test_s1_s2_presentation.cjs` to verify matching presentation at desktop, tablet and phone sizes.

## S1 production refactor (Patch 604)

The complete S1 loop is mapped in `docs/development/S1_PRODUCTION_LOOP_AUDIT.md`.
S1 now separates lesson content, saved state, workspace rendering, guides, My Course,
dialogue, and retained compatibility reviews. S1 and S2 compose their taskbar, stage,
and Canvas/student workspace through `learning-presentation.js`. Shared CSS has explicit
owners and keeps the original cascade order.

A late S1 AI reply can no longer replace a subsequently opened scenario. All storage,
research and XP contracts remain in place. The inherited completion issue documented in that audit is resolved by Patch 605,
which separates production completion from the legacy prompt-interface setting.

Run `node tools/test_s1_learning_loop.cjs` for the full S1 walkthrough, plus the existing
S2 flow, S2 AI, and S1/S2 presentation checks. The loop test supports optional pre-refactor
DOM/style comparison through `PC_BASELINE_DIR`; use `PC_RECORD_BASELINE=1` only on the
old version when recording a baseline. See `docs/development/patch-604-s1-production-refactor.md`.

## S1 completion (Patch 605)

S1 now marks itself Completed after the final Professor Pixel dialogue, awards the
existing completion XP once, and restores its Completed menu status after a reload.
Saving the guide alone does not complete the scenario. Starting a new practice run
resets that run's progress, following the existing replay policy.

The registry's `completionAvailable` capability lets a production loop complete while
older prompt entry remains disabled. S2 remains a heading-repair preview. Existing
progress storage, research V121, receiver V94, and assets v152 are unchanged. See
`docs/development/patch-605-s1-completion.md` for the change and verification.

## S2 alignment with S1 (Patch 606)

S2 now separates content, state/storage, HTML validation, workspace rendering, AI, and
learner actions, matching S1's production organization. The existing heading-repair
activity remains a section preview. Its visual introduction is retained.

Inspection and diagnosis are separate tasks. The original and repaired pages use the
same Canvas page renderer as S1; diagnosis choices use the same choice renderer.
Request and HTML editing use S1's editor shell, while review and saved-repair feedback
use S1's checkpoint cards. Progress reflects pages opened and checks completed.

See `docs/development/patch-606-s2-s1-alignment.md`. Apply over Patch 605. S2 has no
new full-scenario completion, XP, research events, or S1 guide writes.

## S2 heading explanation and listening demo (Patch 607)

The inspection page explains headings, screen readers, and heading levels before the
AI repair. The decision screen adds a shorter reminder, evenly stacked choices, and
navigation kept inside the card. An optional **Hear how headings help** panel compares
heading navigation before and after repair, and reads the original text in order.
Transcripts remain available when browser speech is unavailable. Audio never starts
automatically and stops when the panel closes, a task changes, or the menu opens.

This is a browser-voice simulation, not a recorded screen reader or an accessibility
checker. Actual screen reader speech and controls vary. See
`docs/development/patch-607-s2-headings-and-listening.md`. Apply over Patch 606.

## Canvas-style reading and editing practice (Patch 608)

S2 now opens a Canvas-inspired reading view directly in PromptCraft, using the learner’s
lesson text. It includes play/pause/resume/stop, adjustable speed and text size, optional
spacing and passage focus, and voice-timed word highlighting when available. Voices
without word timing highlight the current passage. Original and repaired heading
navigation remain separate examples. Nothing plays automatically.

The practice editor starts in its visual view. Select a section title and use the
Paragraph/Heading dropdown to explore structure, or use the **</>** button below the
editor to paste Babbage’s HTML repair. Return to the visual view before checking the page.
This is a focused practice recreation, not a live Canvas or Microsoft connection.
Apply over Patch 607. See `docs/development/patch-608-canvas-reading-and-editor.md`.
