# Lena draft portraits — Patch 601

These transparent PNGs are replaceable drafts based on the existing concept sheet, created with the built-in image-generation tool. The original concept sheet is retained in `references/`.

| Filename | Use |
|---|---|
| lena_neutral_draft.png | Introduction and review |
| lena_thinking_draft.png | Inspecting the page and asking AI |
| lena_confident_draft.png | Repair complete |

To replace a draft, export a transparent PNG using the same filename. Keep a waist-up portrait, head and arms visible, with similar framing and margins. Test the quote/portrait panel on desktop, tablet and phone. If you rename files, update `src/js/app/config-and-assets.js` and `assets/asset-manifest.json`, then rebuild. Runtime registration is in manifest v152.

## Generation prompt set

Neutral: create a single draft game portrait from Lena’s concept reference, keeping her fictional student identity, auburn high ponytail and bangs, purple hoodie, backpack strap and blue jeans. Painterly ink-and-watercolor style. Waist-up, attentive neutral expression, holding one small green notebook. Centered, whole head and both arms visible, transparent background. No lettering, logos, borders or panels.

Thinking: preserve the neutral portrait’s identity, clothing, notebook, hand placement, framing, proportions and style. Change only the face to thoughtful and mildly uncertain, with a slight brow furrow and closed mouth. No distress, tears or diagnosis symbols. Transparent background.

Confident: preserve the neutral portrait’s identity, clothing, notebook, hand placement, framing, proportions and style. Change only the face to quietly confident and relieved, with a small warm closed-mouth smile and relaxed brows. Transparent background.
