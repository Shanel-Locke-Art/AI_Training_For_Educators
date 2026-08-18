# PromptCraft compatibility contracts

These contracts are intentionally preserved while the internal implementation is refactored.

## Application and research

- App build: `PROMPTCRAFT_V429`
- Research schema: `V121`
- Apps Script receiver: V82
- Apps Script deployment: existing configured deployment URL
- Scenario result tabs retain full narrative text; Process Log remains abbreviated by design

The V121 payload still sends both `babbage_response` and the historical `claude_response` key. `claude_response` exists only because the current receiver/schema expects it. It is not permission to restore Claude terminology in browser UI, DOM selectors, actions, function names, or the Netlify endpoint.

`tools/validate.py` enforces that only the two known `claude_response` source lines remain.

## Babbage proxy

- Active endpoint: `netlify/functions/babbage.js`
- Retired endpoint: `netlify/functions/claude.js` must remain absent
- Existing S1–S5 structured proxy contracts remain testable
- S3–S5 browser implementations are intentionally absent until rebuilt against the shared architecture

## Scenario availability

- S1 Engagement: implemented
- S2 Metacognition: implemented
- S3–S8: locked development shells

No old S3–S5 prototype browser implementation should be restored as a shortcut when S3 development begins.

## Ideas Wall

Moderation contract:

- completed scenario result
- score at least 4/5
- substantive candidate text of at least 120 characters
- duplicates ignored
- threshold creates a review candidate, not a publication
- only Review Status `Publish` appears publicly

The public card displays the complete descriptive paragraph.

## Versioning

Cache/query parameters may change independently of the app build. Do not change `PROMPTCRAFT_V429` just because a browser cache marker, wall revision, receiver marker, or deployment query parameter changes.
