# Patch 625: typography and Babbage artwork

Apply these changed files over Browser Patch 624. Application V429, research schema V121 and receiver V95 remain current; asset manifest advances to v158.

## Interface

The course interface uses Arial with Helvetica/sans-serif fallbacks for headings, instructions, labels, buttons and navigation. Weight and size provide hierarchy within one family. Monospace remains confined to HTML/code and Babbage's computer display. Google Fonts requests are removed from both entry pages. A shared CSS cascade layer supersedes inherited font declarations without changing scenario geometry or logic. The CSS audit now recognizes this standard layer syntax.

Ideas Wall and My Course Guide menu actions use quiet blue outlined buttons. Menu buttons, including the privacy notice and return action, no longer have underlined text. Active navigation retains its gold selection accent; keyboard focus remains visible.

## Artwork

A new full-color, photorealistic visualization of Charles Babbage replaces the stylized About portrait. Its natural studio lighting, navy period clothing and direct gaze follow Professor Pixel's photographic presentation. This is generated historical-character artwork, not an archival photograph. The About portrait alt text identifies it as an AI visualization.

The logo retains the navy/gold circular seal, pale blue interior, laurel, circuit ornaments and gear, with a full-color photographic Babbage portrait. The existing SVG filename now wraps an embedded PNG, updating every current logo placement without changing references. The original About image remains classified as a development reference. Runtime portrait key ui_03_charles_babbage.png resolves to ui_03_charles_babbage_v2.png.

Generated with the built-in image generator. Portrait references: supplied historical seated Babbage image and pp_01_neutral_v4.png. Direction: recognizable swept-back silver hair and sideburns, natural skin, viewer eye contact, dark navy period frock coat, white shirt and black cravat, transparent waist-up cutout matching Pixel's lighting. Logo references: previous seal and the new portrait. Direction: preserve the seal geometry and ornaments, replace the stylized central face with a full-color photographic head-and-shoulders portrait, transparent exterior and no lettering.

## Verification

Structural validation, asset classification and CSS audits; runtime synchronization; Playwright menu navigation, font and portrait assertions; story framing; reader/audio controls and Canvas HTML preview; task/input hierarchy; full S1 and S2 example gameplay and shared presentation on desktop, tablet and phone. Short desktop is included in story, reader and task checks. External services are blocked in browser tests; no live AI or Apps Script traffic is claimed. Scenario logic, research payloads and S3 implementation are unchanged.
