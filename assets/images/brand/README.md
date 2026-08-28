# Brand assets

Expected here, per `assets/asset-manifest.json` (`runtime_images` ->
`gfc-print-logo.jpg`):

- `great-falls-college-logo.jpg` — the official GFC MSU logo used in the
  Print / Save PDF report header (`src/js/ui/babbage-terminal.js`,
  `.pc-print-logo`) and the S3 Transfer Lab report
  (`src/js/scenarios/s3-authentic-assessment.js`).

Displayed at 68x54-68px depending on viewport/print context
(`object-fit: contain`), so a roughly square or slightly wide logo with
some internal padding will scale cleanest. The report already degrades
gracefully without this file (the `<img>` has an `onerror` handler that
hides it), so nothing is visibly broken today, the report is just
currently missing its institutional branding.
