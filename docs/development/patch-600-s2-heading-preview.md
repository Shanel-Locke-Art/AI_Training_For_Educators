# Patch 600 — S2 heading repair preview

Application V429; browser patch 600; research V121; Apps Script receiver V94; asset manifest v151.

## Playable section

Open Scenario Select → S2: Access Is Part of the Design. Lena describes losing her place in the materials; the activity does not infer a diagnosis. Inspect a Canvas page, an image-only handout, and a diagram, then repair the page’s fake headings. Handout and diagram repair are reserved for later sections.

The player copies the original HTML, asks Babbage in plain language, reviews the repaired heading outline, inserts or pastes the result into a practice Canvas HTML editor, previews it, and checks wording, heading relationships, and links before applying. The default request does not require knowledge of HTML markup. A clearly labeled built-in example is available for practice without a live service. Applying saves this section on the current device; it does not mark the full scenario complete.

## Implementation

- Extracted five Canvas rendering functions into `src/js/scenarios/canvas-simulation.js`; S1 retains wrappers with the original signatures and identical rendered output.
- Added `s2-accessibility.js` and scoped responsive styles. Enabled only the existing S2 menu slot. Existing later scenario implementations remain untouched.
- Added the Babbage `s2_accessibility_heading_repair` structured response contract (`repaired_html`, `explanation`). Deploy `netlify/functions/babbage.js` with this browser update to enable live repair. An older deployed function cannot provide the new contract.
- Rejects changed information, changed links, incorrect heading levels, unwanted attributes and executable markup. Accepted output is reconstructed from an allowlist before preview. This focused validator is not a general accessibility audit.
- Preserves request text after rejected output and ignores late replies after leaving S2.
- S2 practice storage is separate from S1 guide storage. Full S2 guide, My Course, XP, completion and research integration remain pending. No research/receiver schema migration is included.
- Preserves PromptCraft typography, logos and Great Falls College palette. Green terminal styling stays inside the existing Babbage computer display. Lena’s existing reference artwork is expandable and labeled; a finished portrait is still pending.
- Adjusted startup recovery to recognize a rendered scenario even when the normal chat input is hidden.

## Verification

`python tools/build.py --check` and `python tools/validate.py` verify source/runtime synchronization and structural, asset and CSS checks.

Browser regression covers desktop (1440 × 1000), tablet (820 × 1180), and phone (390 × 844): inspection gates, repair/paste/preview, disabled and enabled buttons, invalid HTML, verification checks, scrolling/content width, local reload, guide preservation, saved S1 guide return, and S1 item navigation. Original S1 Canvas renderers were compared with the extracted wrappers for identical HTML.

The AI browser regression uses structured fixtures, not a production AI call. It covers name/audio onboarding, request payload, terminal handoff, copy feedback, rejected response retry, request preservation, and cancellation after leaving the scenario. Hosted AI and hosted research testing are still required before participant use.

Reproduce browser checks after installing Playwright and its Chromium browser:

```sh
node tools/test_s2_accessibility.cjs
node tools/test_s2_accessibility_ai.cjs
```

Set `PC_CHROME_EXECUTABLE` to use another Chromium executable. `PC_SINGLE_PROCESS=1` is optional for restricted environments. Tests serve only local files and block external requests.

## Design references

- [OSCQR Standard 21](https://oscqr.suny.edu/standard21/): document readability and heading hierarchy.
- [WCAG 2.1 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html): programmatically identifiable structure.
- [WCAG 2.1 2.4.6](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html): descriptive headings and labels.

This repair preserves existing descriptive labels and makes their hierarchy explicit. It addresses one accessibility barrier and does not claim full WCAG conformance.

## Update package

The ZIP contains only files added or changed for Patch 600, including generated runtime bundles. Apply them over the uploaded V429/P599 repository, retaining their relative paths. No deletions are required; no assets or receiver files are changed.
