#!/usr/bin/env python3
"""Browser regression for S1 written feedback and the player Canvas Rescue loop."""

from __future__ import annotations

import os
import shutil
import sys
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
CONTENT_TYPES = {
    ".css": "text/css",
    ".html": "text/html",
    ".ico": "image/x-icon",
    ".js": "application/javascript",
    ".json": "application/json",
    ".mp3": "audio/mpeg",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
}


def main() -> int:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("ERROR: Python Playwright is required.", file=sys.stderr)
        return 2

    chromium = os.environ.get("PROMPTCRAFT_CHROMIUM") or shutil.which("chromium") or shutil.which("google-chrome")
    if not chromium:
        print("ERROR: Chromium was not found.", file=sys.stderr)
        return 2

    html = (ROOT / "index.html").read_text(encoding="utf-8").replace(
        "<head>", '<head><base href="https://promptcraft.test/">', 1
    )
    failures: list[str] = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=chromium, args=["--no-sandbox"])
        page = browser.new_page(viewport={"width": 1600, "height": 1000})
        page_errors: list[str] = []
        page.on("pageerror", lambda error: page_errors.append(str(error)))

        def handle(route, request) -> None:
            parsed = urlparse(request.url)
            if parsed.hostname != "promptcraft.test":
                route.abort()
                return
            if request.method != "GET":
                route.fulfill(status=200, body="ok", content_type="text/plain")
                return
            relative = parsed.path.lstrip("/") or "index.html"
            path = ROOT / relative
            if not path.is_file():
                route.fulfill(status=404, body="missing", content_type="text/plain")
                return
            route.fulfill(
                status=200,
                body=path.read_bytes(),
                content_type=CONTENT_TYPES.get(path.suffix.lower(), "application/octet-stream"),
            )

        page.route("**/*", handle)
        page.set_content(html, wait_until="domcontentloaded")
        page.wait_for_timeout(700)

        # Keep the After evidence visible while the player writes, then open one
        # full-screen Babbage feedback report.
        page.evaluate("""() => {
          scenarioIndex = SCENARIO_INDEX.CONTENT_AVALANCHE;
          pcS1PreviewChecks = PC_S1_PREVIEW_CASES.map(() => ({ selected: 'test', answered: true }));
          window.pcS1WorkspaceFinished = false;
          pcShowS1AfterReflection(0, () => { window.pcS1WorkspaceFinished = true; });
        }""")
        page.wait_for_timeout(250)
        reflection = page.evaluate("""() => ({
          form: Boolean(document.getElementById('pcS1AfterReflection')),
          textarea: Boolean(document.getElementById('pcS1AfterReflectionText')),
          state: document.body.dataset.pcS1CanvasState,
          prompt: document.getElementById('vnText')?.innerText || ''
        })""")
        if not reflection["form"] or not reflection["textarea"] or reflection["state"] != "after":
            failures.append(f"The written reflection did not open with the After evidence: {reflection}")

        strong_response = (
            "In the Before view, students had to guess where to start and what order to follow. "
            "The After view adds Start Here, Learn, Submit, and Continue labels, so learners can navigate a clear path."
        )
        page.locator("#pcS1AfterReflectionText").fill(strong_response)
        page.locator('[data-pc-action="s1-submit-after-reflection"]').click()
        page.wait_for_timeout(125)
        analysis = page.evaluate("""() => {
          const panel = document.getElementById('pcS1ReflectionAnalysis');
          const content = document.querySelector('.pc-s1-reflection-analysis-content');
          return {
            exists: Boolean(panel),
            text: panel?.innerText || '',
            fixed: panel ? getComputedStyle(panel).position === 'fixed' : false,
            scrollable: content ? ['auto', 'scroll'].includes(getComputedStyle(content).overflowY) : false,
            modal: panel?.getAttribute('role') === 'dialog' && panel?.getAttribute('aria-modal') === 'true'
          };
        }""")
        if not analysis["exists"] or "Strong explanation" not in analysis["text"]:
            failures.append("Babbage did not return the expected criterion-based feedback.")
        if not analysis["fixed"] or not analysis["scrollable"] or not analysis["modal"]:
            failures.append("The Babbage analysis is missing its full-screen modal or scrolling contract.")

        page.set_viewport_size({"width": 375, "height": 667})
        page.wait_for_timeout(75)
        mobile_geometry = page.evaluate("""() => {
          const shell = document.querySelector('.pc-s1-reflection-analysis-shell');
          const content = document.querySelector('.pc-s1-reflection-analysis-content');
          const footer = document.querySelector('.pc-s1-reflection-analysis-footer');
          const s = shell?.getBoundingClientRect();
          const c = content?.getBoundingClientRect();
          const f = footer?.getBoundingClientRect();
          return {
            shellFits: Boolean(s && s.left >= -1 && s.right <= innerWidth + 1 && s.top >= -1 && s.bottom <= innerHeight + 1),
            contentHasHeight: Boolean(c && c.height > 80),
            footerVisible: Boolean(f && f.top >= 0 && f.bottom <= innerHeight + 1)
          };
        }""")
        if not all(mobile_geometry.values()):
            failures.append(f"The 375x667 analysis geometry is invalid: {mobile_geometry}")

        page.locator('[data-pc-action="s1-revise-after-reflection"]').click()
        page.wait_for_timeout(100)
        if page.locator("#pcS1AfterReflectionText").input_value() != strong_response:
            failures.append("Revise response did not restore the player’s explanation.")
        page.locator('[data-pc-action="s1-submit-after-reflection"]').click()
        page.wait_for_timeout(100)
        page.locator('[data-pc-action="s1-complete-after-reflection"]').click()
        page.wait_for_timeout(180)
        if page.locator("#pcS1ReflectionAnalysis").count() or not page.evaluate("window.pcS1WorkspaceFinished"):
            failures.append("Babbage feedback did not return the player to the case flow.")
        page.set_viewport_size({"width": 1600, "height": 1000})

        page.evaluate("""() => {
          pcClearS1CanvasDialogueScene();
          scenarioIndex = SCENARIO_INDEX.CONTENT_AVALANCHE;
          pcS1PreviewChecks = PC_S1_PREVIEW_CASES.map(() => ({ selected: 'test', answered: true }));
          pcRenderS1CanvasRescue();
        }""")
        page.wait_for_timeout(100)
        if page.locator(".pc-s1-rescue-brief-card").count() != 4:
            failures.append("Canvas Rescue did not render four design-brief decisions.")

        for section_id, choice_id in (
            ("goal", "specific-goal"),
            ("learner", "observed-problem"),
            ("constraints", "preserve-verify"),
            ("deliverable", "reviewable-package"),
        ):
            page.locator(f'input[name="pc-s1-rescue-{section_id}"][value="{choice_id}"]').check()

        if page.locator("#pcS1GenerateDraft").is_disabled():
            failures.append("The Babbage draft button stayed disabled after all brief decisions were supplied.")
        page.locator("#pcS1GenerateDraft").click()
        page.wait_for_timeout(1250)

        if page.locator(".pc-s1-rescue-proposal").count() != 5:
            failures.append("Babbage did not return five reviewable Canvas proposals.")

        for proposal_id, decision in (
            ("start-here", "use"),
            ("module-path", "use"),
            ("assignment-checklist", "use"),
            ("remove-alternatives", "review"),
            ("invent-outcome", "review"),
        ):
            page.locator(f'input[name="pc-s1-proposal-{proposal_id}"][value="{decision}"]').check()

        if page.locator("#pcS1CompleteReview").is_disabled():
            failures.append("The student-view test stayed disabled after all AI proposals were reviewed.")
        page.locator("#pcS1CompleteReview").click()
        page.wait_for_timeout(250)

        result_text = page.locator(".pc-s1-rescue-result").inner_text()
        if "4/4" not in result_text or "5/5" not in result_text:
            failures.append("The completed rescue did not report the expected perfect brief and review scores.")
        if "AI can inventory, extract, reorganize, compare, and draft" not in result_text:
            failures.append("The final human-judgment principle is missing from the rescue result.")
        if page_errors:
            failures.extend(f"Browser error: {error}" for error in page_errors)
        browser.close()

    if failures:
        print("PromptCraft S1 AI Canvas Rescue runtime test FAILED:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("PromptCraft S1 AI Canvas Rescue browser flow passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
