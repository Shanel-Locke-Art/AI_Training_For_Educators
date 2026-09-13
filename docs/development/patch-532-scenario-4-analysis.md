# Patch 532: Scenario 4 shared analysis and print parity

Patch 532 migrates the displayed Scenario 4, The 96% Problem, to the shared
final-analysis presentation and document-first print system. Its internal
`s3` filename, actions, saved-data fields, tracking mapping, and AI contracts
remain unchanged for compatibility.

## Case analysis

- Each item returned in `evidence_used` becomes a separate PASS row.
- The recall-heavy original assessment appears as a separate CHECK row.
- The report includes an accessible five-step assessment sequence: SITUATION,
  PERFORMANCE, EVIDENCE, REASONING, and CRITERIA.
- The terminal-text paragraph remains available for TTS and labeled fallback
  output, while screen and print views use the structured presentation.
- The final scenario result includes Print / Save PDF and rebuilds the same
  structured report from saved scenario state.

## Transfer Lab analysis

- Current evidence, authenticity opportunity, and stronger-evidence rationale
  appear as separate PASS rows.
- Alignment gap and remaining limitation appear as separate CHECK rows.
- The previously missing terminal Print / Save PDF action is restored.
- The final comparison continues to provide Print / Save PDF.
- The shared print input preserves all content formerly owned by the custom
  printer: course context, learning outcome, original assessment, original
  criteria, instructor diagnosis, weakest link, revised assessment design, and
  Babbage findings.

## Duplicate printer removal

`pcPrintS3TransferLabReport()` remains as a compatibility action bridge, but it
no longer creates a second HTML document or owns separate CSS. It rebuilds the
shared report from Transfer Lab state and calls
`pcPrintCurrentBabbageReport()`. This retains the established action name while
eliminating duplicate print ownership.

## User-facing numbering

The result eyebrow, controls title, and replay button now identify the activity
as Scenario 4. Internal `s3` identifiers remain unchanged.

## Preservation boundary

- App build remains `PROMPTCRAFT_V429`.
- Research schema remains `V121`.
- Live receiver V83, candidate V84, Babbage proxy V373, and asset manifest v149
  are unchanged.
- AI prompts and structured response contracts are unchanged.
- Gameplay, dialogue, scoring, XP, completion, progression, Ideas Wall
  moderation, tracking payloads, spreadsheets, raw archives, device profiles,
  and responsive CSS are unchanged.
- No assets are added or repackaged.

## Validation

- Deterministic release gate: 73 of 73 checks passed.
- All 17 browser checks were invoked but could not launch because Python
  Playwright is unavailable. The Node Playwright package also lacks its browser
  executable.
- No browser success is claimed and no product failure was observed.

