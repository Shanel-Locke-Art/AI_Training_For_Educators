# Patch 530: shared analysis presentation foundation

Patch 530 adds the shared presentation model needed to align later scenario
analysis screens and printable reports with the Scenario 1 reference. It does
not migrate a scenario or change currently rendered gameplay.

## Shared ownership

- `src/js/ui/babbage-terminal.js` owns the optional structured findings,
  process-example markup, and screen-to-print extraction.
- `src/css/ui/completed-analysis.css` owns the corresponding responsive styles.
- Scenario modules will continue to own their labels, evidence, instructional
  language, and process steps when they opt into the model in later patches.

## Optional presentation data

The existing `buildBabbageAnalysisHTML(feedback, mock, mockReason)` call remains
valid. A fourth argument may now provide:

- `title`
- `reportTitle`
- `inputTitle`
- `workedItems`
- `issueItems`
- `processExample`, including its title, introduction, accessible label, and
  ordered steps

If these values are absent, the report retains its existing title, paragraph
findings, layout, and print behavior.

## Accessibility and printing

- Structured findings and process steps use native HTML with list and list-item
  roles.
- Visible PASS and CHECK labels are text, not color-only indicators.
- Long labels and details wrap without introducing horizontal scrolling.
- The print system reads the rendered shared report, so structured screen and
  print content use the same source.
- Process examples collapse to one column on narrow screens and remain readable
  in document-first print output.

## Preservation boundary

- App build remains `PROMPTCRAFT_V429`.
- Research schema remains `V121`.
- Live receiver V83, candidate V84, Babbage proxy V373, and asset manifest v149
  are unchanged.
- Scenario 3 and Scenario 4 still call the original shared report interface.
- Gameplay, dialogue, scoring, tracking payloads, AI requests, device profiles,
  spreadsheets, and raw archives are unchanged.

## Validation

- Deterministic release gate: 71 of 71 checks passed.
- Browser gate: all 17 checks were invoked but could not launch because Python
  Playwright is unavailable in the validation environment. No browser success
  is claimed and no product failure was observed.

