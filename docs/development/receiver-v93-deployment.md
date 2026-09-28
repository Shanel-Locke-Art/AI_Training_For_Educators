# Receiver V93 deployment and workbook operations

The source file is `apps-script/PromptCraft_Receiver_V93_Start_With_Learning.js`. It expects application `PROMPTCRAFT_V429` and V121 payloads. Browser patch 592 and asset manifest v151 are independent of the receiver version.

## Collection and projections

| Input | Durable destination | Readable result |
|---|---|---|
| S1–S8 incremental event | `98 - Raw Events` (32 V121 columns), `97 - Raw Responses` checkpoint for S1/S2, `96 - Raw Payload Archive`, `99 - Raw Audit` | `01 - Sessions`, relevant scenario tab, `10 - Process Log`, `12 - Research Responses`, `13 - Process Events`, Overview |
| Full response | `97 - Raw Responses` (75 V121 columns), raw archive and audit | Relevant scenario and session views |
| Idea / wall candidate | `11 - Ideas Wall`, raw archive and audit | Published entries only on the public wall; candidates require review |
| Challenge score | `12 - Challenge Scores` only | Anonymous top XP; no participant ID, course text, or research payload |

The current S1 tab is `02 - S1 Start With Learning`. Retired scenario result tabs are removed when the workbook is initialized. The compact S1 tab covers renamed activities, placement match, alignment diagnosis, guide status, My Course activity count, the latest checkpoint, and a short feedback excerpt. Static OSCQR references and complete event detail remain in the research guide and raw history instead of repeating in every S1 row. Personal My Course wording stays on the participant's device. V93 groups session and scenario views by **participant ID plus session ID**, retains distinct events by event ID, and caps wrapped S1 rows at a readable height.

## Manual operations in the bound Apps Script editor

- `initializeWorkbookNow()` creates/formats missing tabs, removes retired scenario-result tabs, and rebuilds readable views from existing raw records. It preserves current raw records.
- `refreshResearchViewsNow()` clears and rebuilds derived research views from raw records. If a row comes back, it is still in a raw tab.
- `inspectS1TrackingNow()` returns privacy-safe counts of received S1 event types. It does not return participant text.
- `resetChallengeScoresNow()` clears Challenge Scores data rows under a script lock, preserves the header and formatting, and returns the number cleared. Incoming challenge posts can populate the tab again later.
- `verifyV84MigrationNow()` is read-only and returns fingerprints of the raw tabs; the function retains its historical name.
- `resetResearchDataNow()` is the testing reset. It clears data rows from the raw archive, raw responses, raw events, raw audit, Ideas Wall, Challenge Scores, and obsolete scenario result tabs. It then rebuilds empty readable views while preserving headers, formatting, formulas, and the workbook structure. The execution log prints `testing_data_reset: true` and the number of rows cleared from each data sheet. This cannot be undone in Google Sheets unless the spreadsheet version history is used.

Publishing the edited Apps Script requires a new web app deployment version; changing the repository file alone does not update the live endpoint. Once deployed, the Overview's script/deployment indicator should show `V93` and `Current` after the next accepted payload. Run `initializeWorkbookNow()` once after deployment so the compact columns and retired-tab removal are applied. V93 fixes an undefined schema-name reference in both `initializeWorkbookNow()` and `refreshResearchViewsNow()`, so either operation can finish and return its status normally. Run `resetResearchDataNow()` from the Apps Script editor only when all collected records are disposable test data. If Sessions updates but the S1 tab does not, run `inspectS1TrackingNow()` to distinguish a browser connection-test row from one of the four current S1 checkpoints. The actual live workbook and deployed web app were not accessible in this workspace.

## Local verification

V93 JavaScript syntax, source/runtime synchronization, CSS audit, and structural validation passed. A temporary in-memory receiver check exercised S1 normalization, duplicate event IDs, two participants sharing a session ID, scenario projections, retired scenario-tab cleanup, testing-row reset, and Challenge Scores reset. No test fixture was added to the production package.
