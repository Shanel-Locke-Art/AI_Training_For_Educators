# Receiver V95: guided S1 responses

Use `apps-script/PromptCraft_Receiver_V95_Start_With_Learning.js` with browser Patch 620. Application V429 and research schema V121 remain unchanged.

## What changes in the spreadsheet

The readable `02 - S1 Start With Learning` view retains its original 18 columns and appends:

1. Learning Goal Observation
2. Current Work Observation
3. Activity to Work On
4. Planned Change or Check
5. Expected Student Work

These columns are derived from the existing `diagnosisRationale` and `transferReflection` values. No additional personal overview fields are sent. The combined originals remain visible and raw history remains unchanged. Older single-box responses remain in their original columns; their new columns are blank. Multiline responses retain their line breaks. Derived responses receive the existing spreadsheet formula protection when written.

## Apply the receiver update

1. Open the existing bound Apps Script project and replace `Code.gs` contents with the V95 source. Do not add a second copy beside the old receiver.
2. Save and run `initializeWorkbookNow()` once. This rebuilds readable views from retained raw records, including previously collected Patch 618/619 responses.
3. Open **Deploy > Manage deployments**, edit the current web-app deployment, select **New version**, and deploy. Keep the existing web-app URL.
4. Apply browser Patch 620 over Patch 619.
5. Complete a fresh S1 test. Confirm Receiver V95 in the workbook overview and verify the two comparison and three next-step answers in their new columns.

No data reset is needed for this update. `refreshResearchViewsNow()` can also rebuild the views without removing raw records.

S2 remains a practice preview. The new listening examples do not add S2 research events or completion tracking.

## Verification limits

The local receiver test exercises the actual view builder, including checkpoint merging, older responses, malformed prefix sequences, multiline text, preservation of original data, formula protection, and unchanged other scenario views. Google Apps Script deployment and a live workbook write require the hosted smoke test above; they were not performed from this workspace.
