#!/usr/bin/env python3
"""Regression test for long-content Babbage analysis reports.

S1 and S2 share the completed-analysis renderer. This test deliberately feeds it
far more text than the ordinary scenarios so report cards must grow and the
physical monitor glass must scroll rather than allowing cards/text to overlap.
"""
from __future__ import annotations

import os
import shutil
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
VIEWPORTS = {
    "desktop": (1600, 1000),
    "nest-hub": (1024, 600),
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
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("ERROR: Python Playwright is required for overflow tests.", file=sys.stderr)
        return 2

    chromium = os.environ.get("PROMPTCRAFT_CHROMIUM") or shutil.which("chromium") or shutil.which("google-chrome")
    if not chromium:
        print("ERROR: Chromium was not found.", file=sys.stderr)
        return 2

    html = with_test_base((ROOT / "index.html").read_text(encoding="utf-8"))
    failures: list[str] = []

    def register_routes(page) -> None:
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

    geometry_js = """() => {
      const output = document.getElementById('babbageTerminalOutput');
      const report = output?.querySelector('.analysis-report');
      const cards = [...(report?.querySelectorAll('.analysis-card') || [])];
      const rect = el => {
        const r = el.getBoundingClientRect();
        return {x:r.x, y:r.y, right:r.right, bottom:r.bottom, w:r.width, h:r.height};
      };
      const cardInfo = cards.map(card => ({
        cls: card.className,
        rect: rect(card),
        content: [...card.querySelectorAll('.analysis-value,.analysis-note')].map(rect)
      }));
      const overlaps = [];
      for (let i = 0; i < cardInfo.length; i++) {
        for (let j = i + 1; j < cardInfo.length; j++) {
          const a = cardInfo[i].rect, b = cardInfo[j].rect;
          const iw = Math.min(a.right,b.right) - Math.max(a.x,b.x);
          const ih = Math.min(a.bottom,b.bottom) - Math.max(a.y,b.y);
          if (iw > 1 && ih > 1) overlaps.push([i,j,iw,ih]);
        }
      }
      const escaped = cardInfo.flatMap((card, ci) => card.content
        .map((c, ti) => ({ci,ti,c,card:card.rect}))
        .filter(item => item.c.x < item.card.x - 1 || item.c.right > item.card.right + 1 ||
                        item.c.y < item.card.y - 1 || item.c.bottom > item.card.bottom + 1));
      const os = output ? getComputedStyle(output) : null;
      return {
        overflowSafe: report?.classList.contains('analysis-report-overflow-safe') || false,
        outputOverflowY: os?.overflowY || '',
        outputClientHeight: output?.clientHeight || 0,
        outputScrollHeight: output?.scrollHeight || 0,
        overlaps,
        escaped,
        cardCount: cardInfo.length,
        reportCharacters: Number(report?.dataset.analysisCharacters || 0)
      };
    }"""

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path=chromium, args=["--no-sandbox"])
        for viewport, (width, height) in VIEWPORTS.items():
            page = browser.new_page(viewport={"width": width, "height": height})
            register_routes(page)
            page.set_content(html, wait_until="domcontentloaded")
            page.wait_for_timeout(800)

            # S1: unusually verbose diagnostic sections. Keep the same live
            # consult -> completed report handoff used by the application.
            page.evaluate("showBabbageConsultOverlay('Long-content regression')")
            page.wait_for_timeout(100)
            page.evaluate("""() => {
              const sentence = 'The participant supplied extensive instructional context, learner constraints, examples, success criteria, and several details that must remain visible in the analysis. ';
              const long = sentence.repeat(12);
              const feedback = [
                'ANALYSIS COMPLETE',
                'STATUS', 'High-confidence repair with extensive context',
                'CONFIDENCE', 'High',
                'FEEDBACK SUMMARY', long,
                'WHAT WORKED', long,
                'ISSUE DETECTED', long,
                'RECOMMENDED REPAIR', long,
                'EXPECTED IMPACT', long
              ].join('\\n');
              showBabbageTerminalReport({
                reportHTML: buildBabbageAnalysisHTML(feedback, false, ''),
                terminalStateText: 'ANALYSIS COMPLETE',
                continueLabel: 'Continue'
              });
            }""")
            page.wait_for_timeout(500)
            s1 = page.evaluate(geometry_js)
            label = f"{viewport} S1"
            if s1["cardCount"] != 6:
                failures.append(f"{label}: expected six analysis cards, found {s1['cardCount']}.")
            if not s1["overflowSafe"]:
                failures.append(f"{label}: dense report did not enter overflow-safe mode.")
            if s1["outputOverflowY"] not in ("auto", "scroll"):
                failures.append(f"{label}: monitor glass is not the vertical scroll owner.")
            if s1["overlaps"]:
                failures.append(f"{label}: analysis cards overlap: {s1['overlaps'][:3]}.")
            if s1["escaped"]:
                failures.append(f"{label}: analysis text escaped its card bounds.")

            page.evaluate("closeBabbageConsultOverlay()")
            page.wait_for_timeout(120)

            # S2: long Babbage draft and likely student response using the same renderer.
            page.evaluate("showBabbageConsultOverlay('Long-content S2 regression')")
            page.wait_for_timeout(100)
            page.evaluate("""() => {
              const data = getS2Data();
              data.diagnosisFinal = ['evidence'];
              data.evidenceFinal = ['evidence_check'];
              data.thinkingMove = 'evaluate';
              data.aiProvider = 'test';
              const sentence = 'Jordan explains multiple examples, compares strategies, identifies misconceptions, cites specific evidence from the task, and describes what he would change on a future assignment. ';
              const draft = {
                activity_title: 'Extended reflection activity with several required evidence checks',
                activity_prompt: sentence.repeat(13),
                likely_student_response: sentence.repeat(12)
              };
              showBabbageTerminalReport({
                reportHTML: buildS2DraftAnalysisHTML(data, draft),
                terminalStateText: 'REFLECTION DRAFT READY',
                continueLabel: 'Audit this draft'
              });
            }""")
            page.wait_for_timeout(500)
            s2 = page.evaluate(geometry_js)
            label = f"{viewport} S2"
            if s2["cardCount"] != 6:
                failures.append(f"{label}: expected six analysis cards, found {s2['cardCount']}.")
            if not s2["overflowSafe"]:
                failures.append(f"{label}: dense report did not enter overflow-safe mode.")
            if s2["outputOverflowY"] not in ("auto", "scroll"):
                failures.append(f"{label}: monitor glass is not the vertical scroll owner.")
            if s2["overlaps"]:
                failures.append(f"{label}: analysis cards overlap: {s2['overlaps'][:3]}.")
            if s2["escaped"]:
                failures.append(f"{label}: analysis text escaped its card bounds.")

            page.close()
        browser.close()

    if failures:
        for failure in failures:
            print(f"ERROR: {failure}", file=sys.stderr)
        return 1
    print("Long-content analysis reports are overflow-safe in S1 and S2 across desktop and Nest Hub layouts.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
