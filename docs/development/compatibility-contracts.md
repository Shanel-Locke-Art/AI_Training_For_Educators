# PromptCraft compatibility contracts

These contracts are intentionally preserved while PromptCraft is refactored and visually revised.

## Application and research

- App build: `PROMPTCRAFT_V429`
- Research schema: `V121`
- Apps Script receiver: `V82`
- Apps Script deployment: existing configured deployment URL
- Current asset manifest: `v144`
- Current documentation/cache revision: `446`
- Scenario result tabs retain full narrative text; Process Log remains abbreviated by design

The V121 payload still sends both `babbage_response` and the historical `claude_response` key. `claude_response` exists only because the current receiver/schema expects it. It is not permission to restore Claude terminology in browser UI, DOM selectors, actions, function names, or the Netlify endpoint.

`tools/validate.py` enforces that only the known compatibility uses of `claude_response` remain.

## Babbage proxy

- Active endpoint: `netlify/functions/babbage.js`
- Retired endpoint: `netlify/functions/claude.js` must remain absent
- Existing S1-S5 structured proxy contracts remain testable
- S3-S5 browser implementations are intentionally absent until rebuilt against the shared architecture

## Scenario availability

- S1 Engagement: implemented
- S2 Metacognition: implemented
- S3-S8: locked development shells

Do not restore old S3-S5 prototype browser implementations as a shortcut when S3 development begins.

## Shared gameplay and lifecycle

- S1 and S2 use the shared VN/character-slot architecture.
- Scenario switching must cancel stale timers, callbacks, AI requests, audio, overlays, and state.
- Babbage report exits explicitly distinguish VN handoffs from application/workspace handoffs.
- Completed Babbage analysis retains the CRT visual identity; surrounding controls use the current PromptCraft/GFC UI system.
- Source and generated runtime files must remain synchronized through `tools/build.py`.

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

## Versioning

Cache/query parameters may change independently of the app build. Do not change `PROMPTCRAFT_V429` just because a browser cache marker, wall revision, receiver marker, documentation revision, or deployment query parameter changes.
