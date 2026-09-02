# Phase 5 tracking and receiver readability

Phase 5 advances the browser/cache patch to 527 and creates an additive V84
Apps Script receiver candidate. The app remains `PROMPTCRAFT_V429`; the payload
schema remains `V121`; proxy V373 and asset manifest 149 remain unchanged.

The supplied V83 file is unchanged and remains the live receiver baseline until
V84 is verified on a recovery copy and deliberately deployed.

## Findings corrected

- V83 readable labels reflected legacy scenario positions instead of the
  current Canvas roadmap.
- Retries had no stable event identity, so the same payload could create
  duplicate event rows.
- Scenario-level score deltas could compare activities with different scales,
  including S1 evidence analysis on 0–3 and instructor planning on 0–5.
- `99 - Raw Audit` retained only the first 4,500 characters of a payload.
- User-entered text beginning with spreadsheet formula characters could be
  interpreted as a formula in research sheets.
- Malformed JSON was rejected before any technical audit record was written.
- Refresh/initialization code could delete retired readable tabs.
- Overview formulas stopped at row 1,000.

## Browser tracking contract

Every new browser payload includes `event_id`. Incremental events also include:

- `activity_id`, identifying the comparable activity attempt;
- `score_scale_max`, recording the score denominator;
- the existing V121 scenario, attempt, response, AI, and timing fields.

The S1 evidence-analysis activity records a 0–3 scale. Current pathway,
instructor-plan, metacognition, and assessment activities use 0–5. V84 computes
or accepts a score delta only when the previous event has the same activity and
score scale.

## Readable and raw ownership

| Sheet | Visibility | V84 ownership |
|---|---|---|
| `02`–`09` existing scenario tabs | Visible | Existing names retained; readable labels use the verified current roadmap map |
| `10 - Process Log` | Visible | Existing chronological research log retained |
| `11 - Ideas Wall` | Visible | Moderated publication candidate workflow remains isolated |
| `12 - Research Responses` | Visible | Additive flattened readable response projection |
| `13 - Process Events` | Visible | Additive concise chronological event projection with activity, score scale, and event ID |
| `90 - Research Guide` | Visible | Documents current labels and legacy storage/tab-name compatibility |
| `96 - Raw Payload Archive` | Hidden | Additive lossless append-only payload chunks and event status |
| `97 - Raw Responses` | Hidden | Existing 75 V121 columns unchanged |
| `98 - Raw Events` | Hidden | Existing 32 V121 columns unchanged; new metadata is encoded in the existing coding-memo field |
| `99 - Raw Audit` | Hidden | Existing 9 columns unchanged; retains the 4,500-character preview and now records parse/write failures |

Strings beginning with `=`, `+`, `-`, or `@` are escaped in research cells.
The exact unescaped request body remains reconstructable from sheet 96.

## Idempotency and failures

The browser creates one event ID before posting. Fetch and sendBeacon reuse the
same serialized body. V84 holds a script lock while checking accepted archive
events and writing the request. A repeated accepted event returns success with
`duplicate: true` and does not append a second raw event, audit preview, or raw
archive payload.

Malformed JSON and processing failures are written to the lossless archive and
the raw audit before an error response is returned.

## Copied-workbook deployment gate

Do not deploy V84 directly over the production receiver.

1. Create a recovery copy of the production workbook.
2. Attach the V84 source to that copy.
3. Run `verifyV84MigrationNow()` and save the returned row counts and SHA-256 fingerprints.
4. Run `initializeWorkbookNow()` on the copy.
5. Replay the named V121 fixtures and representative copied records.
6. Run `verifyV84MigrationNow()` again.
7. Confirm sheets 97–99 retain their original row counts and fingerprints before replay, and only expected append-only rows appear after replay.
8. Confirm sheets 12 and 13 use current roadmap labels and contain no raw JSON payload columns.
9. Only then update the Apps Script production deployment to V84.

`resetResearchDataNow()` throws an error in V84. Reset and replay work belongs
only in a disposable workbook copy.
