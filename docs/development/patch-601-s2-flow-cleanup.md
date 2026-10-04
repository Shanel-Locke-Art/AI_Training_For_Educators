# Patch 601 — focused S2 flow and Lena drafts

Apply this changed-files-only update over Patch 600. Application V429, research V121 and Apps Script receiver V94 remain unchanged. Browser patch is 601; asset manifest is 152.

The first preview mixed future activities into a heading repair, displayed two workspaces on the review screen, and introduced a separate visual style. This update uses S1’s established task header, Canvas frame, student panel and shared buttons. It presents one page and one main task at a time:

1. Meet Lena and open the learning page.
2. Inspect the page and identify the heading barrier. Incorrect choices give feedback; the correct choice enables Continue.
3. Review a plain-language AI request with the source HTML already attached.
4. Compare the original structure with the repaired outline.
5. Insert or paste the repair into a separate practice Canvas HTML editor.
6. Compare, verify and save the page.

Handout and diagram repair remain planned but no longer appear as unfinished distractions. Source/repaired HTML and the offline example are expandable. One primary action guides each screen. Green styling remains confined to Babbage’s existing in-world display.

Three transparent draft Lena expressions are integrated, with stable filenames and replacement instructions in her asset README. Drafts preserve her concept-sheet appearance. S1 source and styles are untouched. Existing S2 practice repairs remain readable; Practice again starts the revised sequence.

## Validation

Run `python tools/build.py --check` and `python tools/validate.py`. Browser checks in `tools/test_s2_accessibility.cjs` exercise desktop, tablet and phone, wrong/correct diagnosis, repair review/editor separation, validation gates, reload, S1 guide preservation and navigation, and horizontal overflow at every transition. `tools/test_s2_accessibility_ai.cjs` checks onboarding, simulated structured AI responses, invalid response retries and late response cancellation. Screens were visually inspected at all three sizes. No production AI call or deployment was performed.

Use the browser test commands documented in the Patch 600 note. Optional `PC_SCREENSHOTS` captures transition screens. Live AI needs Patch 600’s Netlify contract; that unchanged function is not duplicated in this update.

## Current upload merge

This package is based on `AI_Training_For_Educators - Copy(20261001-194228).zip`, which contained Patch 600. The upload’s S1 source and stylesheet, recording tracker, Jordan artwork, receiver and Netlify function are preserved byte for byte. Generated CSS was rebuilt from that upload’s retained S1 stylesheet plus the new S2 stylesheet. Files absent from the upload are not restored unless they are part of this S2 update. Only added/changed files are exported. Apply the ZIP’s contents into the uploaded repository root, retaining relative paths.
