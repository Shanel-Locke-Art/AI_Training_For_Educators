#!/usr/bin/env python3
"""V506 contract: readable evidence backdrop and simplified transfer flow."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/shared-components.js")
    css = read("src/css/scenarios/shared.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for token in (
        "pc-s1-canvas-backdrop-active",
        "pcSetImageSource(sceneBackground, evidence.smartboardSrc || evidence.src, evidence.src)",
        "Canvas evidence background with Professor Pixel and Eli dialogue",
        "document.querySelector('#vnOverlay .vn-smartboard')?.setAttribute('aria-hidden', 'true')",
        "assets/images/ui/babbage-mark.svg",
        "BABBAGE FINDING",
        "EVIDENCE CONNECTIONS",
        "DESIGN TAKEAWAY",
        "View your practice response",
        "Plan an example learning path.",
        "Choose a real week, module, or topic, or invent a simple example.",
        "Example: discussion, knowledge check, or worked example",
    ):
        assert token in shared
        assert token in runtime

    for token in (
        "body.pc-s1-canvas-backdrop-active",
        "object-fit:cover !important",
        ".pc-s1-reflection-analysis-mark img",
        ".pc-s1-reflection-focus",
        ".pc-s1-week-planner-basics",
        "grid-template-columns:repeat(2,minmax(0,1fr)) !important",
        "height:72px !important",
    ):
        assert token in css
        assert token in runtime_css

    assert "← Revise response" not in shared
    assert "patch=509" in index
    assert "DEV · 509" in index
    print("V506 readable Canvas backdrop, focused analysis, and example planner contract passed.")


if __name__ == "__main__":
    main()
