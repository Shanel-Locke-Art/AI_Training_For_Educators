# Receiver V90 deployment and workbook operations

The source file is `apps-script/PromptCraft_Receiver_V90_Start_With_Learning.js`. It expects application `PROMPTCRAFT_V429` and V121 payloads. Browser patch 578 and asset manifest v150 are independent of the receiver version.

## Collection and projections

| Input | Durable destination | Readable result |
|---|---|---|
| S1–S8 incremental event | `98 - Raw Events` (32 V121 columns), `97 - Raw Responses` checkpoint for S1/S2, `96 - Raw Payload Archive`, `99 - Raw Audit` | `01 - Sessions`, relevant scenario tab, `10 - Process Log`, `12 - Research Responses`, `13 - Process Events`, Overview |
| Full response | `97 - Raw Responses` (75 V121 columns), raw archive and audit | Relevant scenario and session views |
| Idea / wall candidate | `11 - Ideas Wall`, raw archive and audit | Published entries only on the public wall; candidates require review |
| Challenge score | `12 - Challenge Scores` only | Anonymous top XP; no participant ID, course text, or research payload |

The current S1 tab is `02 - S1 Start With Learning`. Older scenario result tabs are hidden without deleting their contents. The current tab covers renamed activities, learning-purpose organization, alignment diagnosis, guide completion, activity count, OSCQR references, and checkpoint feedback. Personal My Course wording stays on the participant's device. V90 groups session and scenario views by **participant ID plus session ID**, retains distinct events by event ID, and sizes wrapped narrative rows from their actual content.

## Manual operations in the bound Apps Script editor

- `initializeWorkbookNow()` creates/formats missing tabs and rebuilds readable views from existing raw records. It preserves raw records and existing tab names.
- `refreshResearchViewsNow()` clears and rebuilds derived research views from raw records. If a row comes back, it is still in a raw tab.
- `inspectS1TrackingNow()` returns privacy-safe counts of received S1 event types. It does not return participant text.
- `resetChallengeScoresNow()` clears Challenge Scores data rows under a script lock, preserves the header and formatting, and returns the number cleared. Incoming challenge posts can populate the tab again later.
- `verifyV84MigrationNow()` is read-only and returns fingerprints of the raw tabs; the function retains its historical name.
- `resetResearchDataNow()` intentionally throws. It cannot erase research data accidentally; use a disposable copy if an empty research workbook is required.

Run `initializeWorkbookNow()` on a **copy** of the research workbook first and compare raw tab row counts and fingerprints before replacing a deployed receiver. Publishing the edited Apps Script requires a new web app deployment version; changing the repository file alone does not update the live endpoint. Once deployed, the Overview's script/deployment indicator should show `V90` and `CURRENT` after the next accepted payload. If Sessions updates but the S1 tab does not, run `inspectS1TrackingNow()` to distinguish a browser connection-test row from one of the four current S1 checkpoints. The actual live workbook and deployed web app were not accessible in this workspace.

## Local verification

V90 JavaScript syntax, source/runtime synchronization, CSS audit, and structural validation passed. A temporary in-memory receiver check exercised S1 normalization, duplicate event IDs, two participants sharing a session ID, scenario projections, legacy scenario-tab cleanup, and Challenge Scores reset. No test fixture was added to the production package.
