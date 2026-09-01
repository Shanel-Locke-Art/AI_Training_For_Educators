#!/usr/bin/env python3
"""Static contract for the readable, no-scroll S1 mobile Canvas evidence lens."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    source = read("src/js/scenarios/s1-canvas-evidence.js")
    css = read("src/css/scenarios/shared.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for marker in (
        "PC_S1_MOBILE_EVIDENCE_LENSES",
        "pcRenderS1MobileEvidenceLens",
        "pcClearS1MobileEvidenceLens",
        "pcS1MobileEvidenceLens",
        "Instructor view · Module list",
        "Student view · Learning path",
        "Requirements moved to the point of need",
        "Expectations visible before work begins",
        "the full Canvas capture is available in the evidence station",
    ):
        assert marker in source, f"Source is missing mobile evidence marker: {marker}"
        assert marker in runtime, f"Runtime is missing mobile evidence marker: {marker}"

    for selector in (
        ".pc-s1-mobile-evidence-lens",
        ".pc-s1-mobile-evidence-context",
        ".pc-s1-mobile-evidence-title",
        ".pc-s1-mobile-evidence-rows",
        ".pc-s1-mobile-evidence-finding",
    ):
        assert selector in css, f"Source CSS is missing: {selector}"
        assert selector in runtime_css, f"Runtime CSS is missing: {selector}"

    for contract in (
        "@media screen and (max-width: 700px)",
        "grid-template-rows: auto auto minmax(0, 1fr) auto",
        "overflow: hidden",
        "top: 3px",
    ):
        assert contract in css
        assert contract in runtime_css

    assert "overflow-y: auto" not in css[css.index(".pc-s1-mobile-evidence-lens {"):css.index("/* Babbage is a workspace")]
    assert 'object-fit: contain !important' in css, "Desktop focused captures must remain intact."
    assert "patch=526" in index
    assert "DEV · 526" in index
    print("S1 readable mobile Canvas evidence lens remains intact through patch 482.")


if __name__ == "__main__":
    main()
