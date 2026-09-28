# Receiver V94 deployment and workbook operations

The source file is `apps-script/PromptCraft_Receiver_V94_Start_With_Learning.js`. It expects application `PROMPTCRAFT_V429` and remains compatible with V121 payloads. Deploy it with browser Patch 593.

## Focused Scenario 1 evidence

The readable `02 - S1 Start With Learning` view contains one combined row per participant and session. It reports:

- completion status and elapsed session duration;
- renamed example activities and Prepare / Practice / Evidence placements;
- placement matches, placement total, and activities to reconsider;
- alignment diagnosis, correctness, and the participant's written rationale;
- whether the guide was saved and how many personal activities were listed;
- the participant's short transfer reflection;
- whether feedback was live or built-in and whether the AI request failed.

Personal module titles, intended-learning statements, activity names, and saved guide content remain on the participant's device. Static OSCQR references are documented once in `90 - Research Guide` instead of being repeated in every event.

XP, combined checkpoint scores, and checkpoint counts are not presented as evidence of learning. New S1 incremental events also avoid storing the same response in Claude, Babbage, and final-response fields.

## Workbook views

The normal tab bar contains:

- `00 - Overview`
- `01 - Sessions`
- the current populated scenario result tabs
- `90 - Research Guide`
- `11 - Ideas Wall` only when it contains records

Process logs, readable event copies, challenge scores, raw payloads, raw responses, raw events, and raw audit records are retained but hidden. They remain available for troubleshooting and recovery.

## Collection behavior

Browser posts are serialized so challenge-score and research requests from the same session do not compete. Intermediate S1 events are saved immediately to raw history. The readable views rebuild after `s1_course_guide_complete`, when the complete S1 evidence record is available.

If the receiver lock is occupied by research processing, a challenge-score update is deferred without creating a raw research error. Challenge scores are game telemetry and remain outside the research views.

## Manual operations

- `initializeWorkbookNow()` creates and formats missing tabs, applies the focused views, hides technical tabs, and rebuilds readable results from retained raw events.
- `refreshResearchViewsNow()` rebuilds derived views without deleting raw records.
- `inspectS1TrackingNow()` returns privacy-safe S1 event counts without participant text.
- `resetResearchDataNow()` clears disposable testing records, including raw data, challenge scores, and derived results, while preserving workbook structure and formatting.
- `resetChallengeScoresNow()` clears only anonymous challenge-score rows.

## Deployment

1. Replace the bound Apps Script `Code.gs` contents with the V94 receiver source.
2. Save and run `initializeWorkbookNow()` once from the editor.
3. Open **Deploy > Manage deployments**, edit the current web-app deployment, select **New version**, and deploy. The existing web-app URL can remain unchanged.
4. Deploy browser Patch 593.
5. Complete a fresh S1 test and confirm the Overview reports Receiver V94 and `Current`.

If all existing rows are disposable testing records, run `resetResearchDataNow()` before the fresh test. Google Sheets version history is the only recovery path after that reset.

## Local verification

JavaScript syntax, source/runtime synchronization, CSS audit, and structural validation must pass before deployment. The hosted smoke test should confirm the rationale form, transfer-reflection form, final S1 submission, readable S1 row, feedback source, and hidden technical tabs.
