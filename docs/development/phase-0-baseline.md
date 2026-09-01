# Phase 0 clean baseline

Phase 0 establishes a reproducible PromptCraft baseline without changing gameplay, dialogue, layout, tracking behavior, AI behavior, accessibility behavior, the V121 research schema, or the V83 receiver implementation.

## Version ownership

| Identifier | Phase 0 value | Meaning |
|---|---|---|
| Application build | `PROMPTCRAFT_V429` | Stable application identity; unchanged |
| Research schema | `V121` | Browser/receiver data contract; unchanged |
| Browser cache patch | `523` | Current runtime asset marker; unchanged because runtime files did not change |
| Repository baseline revision | `524` | Phase 0 source-ownership and documentation package |
| Apps Script receiver | `V83` | Supplied receiver source; preserved byte-for-byte |
| Babbage proxy source | `V372` | Current supplied source; known contract/version mismatch remains documented |
| Asset manifest | `v148` | Asset classification baseline; no assets copied or changed |

`release/baseline-manifest.json` is the machine-readable owner for these identifiers and the two uploaded archive hashes. Query parameter `receiver=85` in the current HTML is a stale cache marker, not proof of receiver V85. It remains unchanged in Phase 0 so a documentation-only patch does not rewrite browser runtime references before regression tests are repaired.

## Receiver source ownership

The supplied V83 receiver is stored unchanged at:

`apps-script/PromptCraft_Receiver_V83_Readable_Prompt_Data.js`

Expected SHA-256:

`f20107b3faa3f28794c9631bfa75e0834c84d96b6eaae2149095be0fb11bba58`

The repository copy must continue to match that hash until an explicitly tested receiver revision is created. A changed receiver must advance from V83 to V84 and include copied-workbook migration results. Do not edit V83 in place.

## Production workbook safety boundary

During the refactor, do not run these V83 functions against the production workbook:

- `initializeWorkbookNow()`
- `resetResearchDataNow()`

The first can delete named legacy/retired sheets during consolidation and refresh. The second clears all three raw archives and Ideas Wall data. Testing must use a copied workbook.

`tools/receiver/workbook_inventory_read_only.gs` is the approved Phase 0 inventory helper. It reads tab order, visibility, dimensions, frozen areas, headers, header hashes, and raw-archive counts. It does not call `setValue`, `setValues`, `clear`, `deleteSheet`, `insertSheet`, or another workbook mutation method. Run it from the production workbook's container-bound Apps Script editor, retain the JSON execution-log result outside the workbook, then create a recovery copy before receiver replay.

The physical production inventory is intentionally marked pending until the workbook owner runs the helper. Local repository work must not invent those counts.

## Characterization fixtures

Run:

```bash
node tests/test_receiver_v83_fixture.js
```

The Phase 0 harness executes the unchanged receiver in a memory-only Sheets substitute. It verifies:

- exact receiver source identity;
- V83/V121/V429 health output;
- current S1, S3, and S4 incremental preservation in hidden raw sheets;
- S1 checkpoint upsert behavior;
- malformed JSON behavior;
- the known legacy scenario-tab mapping, 4,500-character audit preview, and absence of locking.

These are characterization tests, not approval of the known V83 projection defects. A future V84 suite will replace the legacy-mapping assertions with corrected current-roadmap expectations while retaining V83 fixtures for migration replay.

## Phase 0 exit status

Completed locally:

- uploaded archive hashes recorded;
- V83 source preserved under repository ownership;
- release/version manifest added;
- production-destructive administration paths documented and prohibited;
- read-only inventory helper added;
- memory-only receiver characterization harness added.

Pending owner/deployment evidence:

- confirm the supplied V83 file exactly matches the deployed Apps Script project;
- run and retain the read-only production workbook inventory;
- create a recoverable workbook copy before any fixture replay;
- record live receiver/proxy health evidence at the time Phase 0 is accepted.

No structural JavaScript/CSS movement or obsolete-code deletion begins until the Phase 1 regression gate is repaired and current contracts pass.
