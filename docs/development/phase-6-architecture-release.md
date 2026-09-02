# Phase 6 architecture and release checkpoint

Phase 6 closes the initial PromptCraft cleanup without changing product
behavior. It documents the final ownership boundaries and makes changed-file
packaging a tested release contract.

## Version disposition

| Identifier | Phase 6 value | Reason |
|---|---:|---|
| Application build | `PROMPTCRAFT_V429` | No application identity or gameplay change |
| Research schema | `V121` | No raw-column or browser schema change |
| Browser/cache patch | `527` | Phase 6 changes no browser source or runtime output |
| Receiver live baseline | `V83` | Preserved byte-for-byte and still the live baseline |
| Receiver candidate | `V84` | Unchanged, undeployed, and still gated by copied-workbook verification |
| Babbage proxy | `V373` | No proxy source change |
| Asset manifest | `v149` | No asset or asset-manifest change |
| Phase package | `PHASE6_P527` | Documentation/tooling release identity only |

A build, browser patch, receiver, proxy, asset version, and phase package are
separate identifiers. Advance only the identifier whose owned behavior or
artifact changed.

## Ownership boundaries

- `src/` is editable browser source. `runtime/` is generated output.
- `src/js/manifest.json` owns JavaScript build order and standalone outputs.
- `src/css/manifest.css` owns the application cascade. The Ideas Wall stylesheet
  remains intentionally standalone.
- `src/js/ui/viewport-controller.js` owns viewport measurement and notification;
  subscribers own their own DOM behavior.
- `src/js/research/tracking.js` owns browser research DTOs. The versioned Apps
  Script receiver owns spreadsheet ingestion, immutable raw contracts, readable
  projections, and lossless payload archives.
- V83 is immutable. V84 may become live only after the Phase 5 recovery-copy
  migration procedure passes.
- Dormant S1 prototypes remain explicitly retained. Their presence in the bundle
  does not make them current gameplay and does not justify deletion without the
  blocked browser proof.
- The large responsive compatibility cascade remains bounded by the Phase 4
  ownership inventory. Structural CSS consolidation remains blocked until visual
  and computed-style baselines can run.

The complete file-level routing map is `repository-map.md`.

## Release gate

Run:

```bash
python3 tools/check.py
python3 tools/check.py --full
```

The deterministic gate is authoritative. A browser check that cannot start
because Playwright or a browser executable is absent is recorded as environment
blocked, not passed and not a product failure. CSS deletion and dormant-module
removal remain prohibited while their required browser evidence is blocked.

## Changed-file packaging

1. Diff the phase working tree against the immediately preceding phase.
2. Record only those paths in sorted `release/phase6-changed-files.txt`.
3. Confirm no unchanged asset, `desktop.ini`, `__pycache__`, bytecode, or temporary
   output is listed.
4. Include generated runtime only when a source owner changed and the build is
   synchronized.
5. Generate the ZIP with `tools/package_changed.py`.
6. Compare ZIP entries with the manifest and record SHA-256 checksums.

Phase 6 contains documentation, release metadata, a packaging tool, and its
regression test only. It deliberately contains no browser runtime, CSS, dialogue,
asset, receiver, proxy, or research-data file.

## Remaining verified boundaries

- V84 is a candidate until copied-workbook fingerprints and fixture replay pass.
- The 17 browser checks require a Playwright/browser environment.
- Phase 4 CSS movement requires screenshot and computed-style baselines.
- Retained dormant S1 modules require live-path browser verification before
  archival or deletion.

These are documented safety gates, not evidence of a current product failure.
