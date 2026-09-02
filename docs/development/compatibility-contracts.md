# PromptCraft compatibility contracts

These contracts are intentionally preserved while PromptCraft is refactored and visually revised.

## Application and research

- App build: `PROMPTCRAFT_V429`
- Research schema: `V121`
- Apps Script receiver candidate: `V84`; supplied `V83` source preserved unchanged
- Apps Script deployment: existing configured deployment URL
- Current asset manifest: `v149`
- Current browser/cache revision: `527`
- Current repository baseline revision: `524`
- Scenario result tabs retain full narrative text; Process Log remains abbreviated by design

The authoritative Phase 0 version record is `release/baseline-manifest.json`. The receiver query marker currently embedded in `index.html` is not an authoritative receiver version.

The V121 payload still sends both `babbage_response` and the historical `claude_response` key. `claude_response` exists only because the current receiver/schema expects it. It is not permission to restore Claude terminology in browser UI, DOM selectors, actions, function names, or the Netlify endpoint.

`tools/validate.py` enforces that only the known compatibility uses of `claude_response` remain.

## Babbage proxy

- Active endpoint: `netlify/functions/babbage.js`
- Current source version: `V373`
- Retired endpoint: `netlify/functions/claude.js` must remain absent
- Existing S1-S5 structured proxy contracts remain testable
- Active S1 evidence, Canvas Rescue, and transfer-plan requests have dedicated strict schemas
- S3-S5 browser implementations are intentionally absent until rebuilt against the shared architecture

## Scenario availability

Registry position (`registry.js`) is authoritative for what's playable, not
source filenames. Internal filenames/action keys retain earlier `s2`/`s3`
naming for receiver and saved-data compatibility, while registry position
and dataLabel identify the current scenario order:

- S1 The Content Avalanche (`content-avalanche`): preview available, in development
- S2 Access Is Part of the Design (`accessibility`): planned, in development
- S3 The Confident Student Problem (`metacognition`, implemented in `s2-metacognition.js`): playable
- S4 The 96% Problem (`assessment`, implemented in `s3-authentic-assessment.js`): playable
- S5-S8: locked development shells

Do not restore old S3-S5 prototype browser implementations as a shortcut when
S5+ development begins.

## Shared gameplay and lifecycle

- S1 and S2 use the shared VN/character-slot architecture.
- Scenario switching must cancel stale timers, callbacks, AI requests, audio, overlays, and state.
- Babbage report exits explicitly distinguish VN handoffs from application/workspace handoffs.
- Completed Babbage analysis retains the CRT visual identity; surrounding controls use the current PromptCraft/GFC UI system.
- Source and generated runtime files must remain synchronized through `tools/build.py`.

## Viewport ownership

- `src/js/ui/viewport-controller.js` is the application-wide owner of viewport dimensions, viewport families, resize/orientation listeners, and subscriber notification.
- Responsive consumers subscribe by behavior name and retain ownership of their own DOM changes.
- Device emulation keeps the prior minimum-of-inner-and-screen sizing policy for S1 Canvas evidence and cast placement.
- The S1 Read Size defaults keep the exact documented device-profile table.
- The standalone Ideas Wall page retains its page-local resize listener because it does not load the main application bundle.

## Teaching progression

The education-based teaching progression system is local UI/game state and does not change the V121 research schema.

- Storage key: `promptcraft_teaching_progress_v1`
- Scenario score improvements award XP only when the score improves.
- Scenario completion XP is awarded once per scenario.
- Repeating an identical score/completion does not farm XP.
- Current education-level ladder begins with `Teaching Explorer` and progresses through teaching/design roles.

## Ideas Wall

Moderation contract:

- completed scenario result
- score at least 4/5
- substantive candidate text of at least 120 characters
- duplicates ignored
- threshold creates a review candidate, not a publication
- only Review Status `Publish` appears publicly

The public card displays the complete descriptive paragraph. The public wall uses its own page stylesheet and current PromptCraft/GFC header/menu treatment; do not mix its moderation logic with visual-theme changes.

## Receiver and research workbook

- The immutable V83 baseline source is `apps-script/PromptCraft_Receiver_V83_Readable_Prompt_Data.js`.
- The additive V84 candidate is `apps-script/PromptCraft_Receiver_V84_Readable_Raw_Separation.js`. V83 remains the live baseline until V84 passes copied-workbook verification and is deliberately deployed.
- V83 may be characterized and replayed against memory-only fixtures or a copied workbook; it must not be edited in place.
- V84 must first run on a recovery copy. Record `verifyV84MigrationNow()` before and after initialization and compare every raw-sheet row count and SHA-256 fingerprint.
- Do not run V83 `initializeWorkbookNow()` or `resetResearchDataNow()` against production during refactoring. V84 disables `resetResearchDataNow()`.
- Preserve all existing raw response, event, and audit rows and the V121 column layout.
- V84 retains the 75-column `97 - Raw Responses`, 32-column `98 - Raw Events`, and 9-column `99 - Raw Audit` contracts without renaming columns.
- `96 - Raw Payload Archive` is additive, hidden, append-only, and lossless. Payloads longer than one Google Sheets cell are stored in ordered 45,000-character chunks.
- `12 - Research Responses` and `13 - Process Events` are additive readable projections. `11 - Ideas Wall` remains isolated from research projections.
- Existing scenario tab names remain unchanged for spreadsheet compatibility. V84's verified mapping supplies the current roadmap labels in readable rows and documentation.

## Versioning

Cache/query parameters may change independently of the app build. Do not change `PROMPTCRAFT_V429` just because a browser cache marker, wall revision, receiver marker, documentation revision, or deployment query parameter changes.
