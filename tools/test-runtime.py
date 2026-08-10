#!/usr/bin/env python3
"""Run PromptCraft browser smoke tests without requiring a local web server."""

from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
VIEWPORTS = {
    "desktop": (1600, 1000),
    "tablet": (1024, 768),
    "phone": (390, 844),
}
CONTENT_TYPES = {
    ".css": "text/css",
    ".html": "text/html",
    ".ico": "image/x-icon",
    ".js": "application/javascript",
    ".json": "application/json",
    ".mp3": "audio/mpeg",
    ".png": "image/png",
}


def with_test_base(html: str) -> str:
    return html.replace("<head>", '<head><base href="https://promptcraft.test/">', 1)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--screenshots", action="store_true", help="Save state screenshots.")
    parser.add_argument(
        "--output",
        type=Path,
        default=ROOT / "runtime-test-output",
        help="Directory for the JSON report and optional screenshots.",
    )
    args = parser.parse_args()

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("ERROR: Python Playwright is required for runtime tests.", file=sys.stderr)
        return 2

    chromium = os.environ.get("PROMPTCRAFT_CHROMIUM") or shutil.which("chromium") or shutil.which("google-chrome")
    if not chromium:
        print("ERROR: Chromium was not found. Set PROMPTCRAFT_CHROMIUM to its executable.", file=sys.stderr)
        return 2

    args.output.mkdir(parents=True, exist_ok=True)
    index_html = with_test_base((ROOT / "index.html").read_text(encoding="utf-8"))
    wall_html = with_test_base((ROOT / "wall.html").read_text(encoding="utf-8"))
    results: list[dict] = []
    failures: list[str] = []

    def register_routes(page, missing: set[str]) -> None:
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
                missing.add(relative)
                route.fulfill(status=404, body="missing", content_type="text/plain")
                return

            route.fulfill(
                status=200,
                body=path.read_bytes(),
                content_type=CONTENT_TYPES.get(path.suffix.lower(), "application/octet-stream"),
            )

        page.route("**/*", handle)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            executable_path=chromium,
            args=["--no-sandbox"],
        )

        for viewport_name, (width, height) in VIEWPORTS.items():
            page = browser.new_page(viewport={"width": width, "height": height})
            page_errors: list[str] = []
            missing: set[str] = set()
            page.on("pageerror", lambda error, page_errors=page_errors: page_errors.append(str(error)))
            register_routes(page, missing)
            page.set_content(index_html, wait_until="domcontentloaded")
            page.wait_for_timeout(1200)

            # Verify the event registry replaced the former inline handlers.
            page.evaluate("closeMainMenu(); showNameModal()")
            page.locator("#nameInput").fill("Runtime Tester")
            page.locator("#nameInput").press("Enter")
            page.wait_for_timeout(520)
            if not page.locator("#audioSetupOverlay.visible").count():
                failures.append(f"{viewport_name}: Enter key did not advance name onboarding.")
            page.evaluate("""() => {
              const radio = document.querySelector('input[name="audioMode"][value="silent"]');
              radio.checked = true;
              radio.dispatchEvent(new Event('change', { bubbles: true }));
              document.getElementById('audioSetupForm').requestSubmit();
            }""")
            page.wait_for_timeout(280)

            for scenario in range(8):
                page.evaluate("index => devGoScenario(index)", scenario)
                page.wait_for_timeout(220)
                state = page.evaluate(
                    """() => ({
                        activeScenario: window.devStatus().activeScenario,
                        selectedTab: [...document.querySelectorAll('.tab-btn')]
                          .findIndex(tab => tab.classList.contains('active')),
                        scenarioText: document.getElementById('scenarioText')?.innerText.trim() || '',
                        inputText: document.getElementById('inputContainer')?.innerText.trim() || '',
                        bodyWidth: document.body.scrollWidth,
                        viewportWidth: window.innerWidth
                    })"""
                )
                label = f"{viewport_name} scenario {scenario + 1}"
                if state["activeScenario"] != scenario + 1:
                    failures.append(f"{label}: active scenario mismatch.")
                if state["selectedTab"] != scenario:
                    failures.append(f"{label}: selected tab mismatch.")
                if not state["scenarioText"]:
                    failures.append(f"{label}: scenario text is empty.")
                if scenario < 2 and not state["inputText"]:
                    failures.append(f"{label}: implemented workspace is empty.")
                if state["bodyWidth"] > state["viewportWidth"] + 1:
                    failures.append(f"{label}: horizontal overflow detected.")

                results.append({"viewport": viewport_name, "scenario": scenario + 1, "state": state})
                if args.screenshots:
                    page.screenshot(path=str(args.output / f"{viewport_name}-scenario-{scenario + 1}.png"))

            page.evaluate("devGoScenario(0)")
            page.wait_for_timeout(200)
            page.evaluate(
                """() => {
                    window.PC_CLAUDE_PROCESSING_HOLD_MS = 120;
                    showClaudeConsultOverlay('Scenario diagnosis');
                }"""
            )
            page.wait_for_timeout(35)
            geometry = page.evaluate(
                """() => {
                    const rect = selector => document.querySelector(selector)?.getBoundingClientRect();
                    const serialise = value => value ? ({
                      left:value.left, top:value.top, right:value.right, bottom:value.bottom,
                      width:value.width, height:value.height
                    }) : null;
                    return {
                      photo: serialise(rect('#claudeTerminalScene .claude-terminal-photo')),
                      screen: serialise(rect('#claudeTerminalScene .claude-terminal-screen')),
                      output: serialise(rect('#claudeTerminalOutput')),
                      analyzing: document.getElementById('claudeTerminalOutput')?.classList.contains('pc-analyzing-output') || false
                    };
                }"""
            )
            photo, screen, output = geometry["photo"], geometry["screen"], geometry["output"]
            if not geometry["analyzing"]:
                failures.append(f"{viewport_name}: Babbage analyzing state did not open.")
            if not all((photo, screen, output)):
                failures.append(f"{viewport_name}: Babbage analysis geometry is incomplete.")
            else:
                tolerance = 1.5
                if (
                    screen["left"] < photo["left"] - tolerance
                    or screen["top"] < photo["top"] - tolerance
                    or screen["right"] > photo["right"] + tolerance
                    or screen["bottom"] > photo["bottom"] + tolerance
                ):
                    failures.append(f"{viewport_name}: terminal screen escapes the workstation image.")
                if (
                    output["left"] < screen["left"] - tolerance
                    or output["top"] < screen["top"] - tolerance
                    or output["right"] > screen["right"] + tolerance
                    or output["bottom"] > screen["bottom"] + tolerance
                ):
                    failures.append(f"{viewport_name}: analysis output escapes the terminal screen.")
            results.append({"viewport": viewport_name, "analysis": geometry})
            if args.screenshots:
                page.screenshot(path=str(args.output / f"{viewport_name}-analysis.png"))

            if page_errors:
                failures.extend(f"{viewport_name}: page error: {error}" for error in page_errors)
            if missing:
                failures.append(f"{viewport_name}: missing local requests: {', '.join(sorted(missing))}")
            page.close()

        # Ideas Wall interaction and extracted asset smoke test.
        wall_page = browser.new_page(viewport={"width": 1024, "height": 768})
        wall_errors: list[str] = []
        wall_missing: set[str] = set()
        wall_page.on("pageerror", lambda error: wall_errors.append(str(error)))
        register_routes(wall_page, wall_missing)
        wall_page.set_content(wall_html, wait_until="domcontentloaded")
        wall_page.wait_for_timeout(500)
        wall_page.locator('.filter-btn[data-filter="2"]').click()
        wall_page.wait_for_timeout(50)
        wall_state = wall_page.evaluate(
            """() => ({
              activeFilter: document.querySelector('.filter-btn.active')?.dataset.filter || '',
              cards: document.querySelectorAll('.idea-card').length,
              backHref: document.querySelector('.back-link')?.getAttribute('href') || ''
            })"""
        )
        if wall_state["activeFilter"] != "2":
            failures.append("Ideas Wall: filter interaction failed.")
        if wall_state["backHref"] != "index.html":
            failures.append("Ideas Wall: back link is not project-relative.")
        if wall_errors:
            failures.extend(f"Ideas Wall: page error: {error}" for error in wall_errors)
        if wall_missing:
            failures.append("Ideas Wall: missing local requests: " + ", ".join(sorted(wall_missing)))
        results.append({"ideasWall": wall_state})
        if args.screenshots:
            wall_page.screenshot(path=str(args.output / "ideas-wall.png"))
        wall_page.close()
        browser.close()

    report = {"passed": not failures, "failures": failures, "results": results}
    (args.output / "runtime-test-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")

    if failures:
        for failure in failures:
            print(f"ERROR: {failure}", file=sys.stderr)
        return 1

    print(
        "PromptCraft runtime tests passed: 8 scenarios across 3 viewports, "
        "Babbage analysis geometry, onboarding events, and Ideas Wall interactions."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
