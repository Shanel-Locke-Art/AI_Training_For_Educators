#!/usr/bin/env python3
"""V506 contract: readable evidence backdrop and simplified transfer flow."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/s1-canvas-evidence.js")
    css = read("src/css/scenarios/shared.css") + read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for token in (
        "pc-s1-intro-evidence-active",
        "pcRenderS1IntroEvidenceCard(item, evidence, pcS1CanvasDialogueCaseIndex)",
        "Framed Canvas evidence with Professor Pixel and Eli dialogue",
        "document.querySelector('#vnOverlay .vn-smartboard')?.setAttribute('aria-hidden', 'true')",
        "assets/images/ui/babbage-mark.svg",
        "BABBAGE FINDING",
        "EVIDENCE CONNECTIONS",
        "DESIGN TAKEAWAY",
        "View your practice response",
        "Describe what each part of the path should do.",
        "Choose a real or invented week, module, or topic.",
        "Example: Let students rehearse with a discussion, knowledge check, worked example, or draft.",
    ):
        assert token in shared
        assert token in runtime

    for token in (
        ".pc-s1-intro-evidence-card",
        ".pc-s1-intro-evidence-picture img",
        ".pc-s1-reflection-analysis-mark img",
        ".pc-s1-reflection-focus",
        ".pc-s1-week-planner-basics",
        "grid-template-columns:repeat(2,minmax(0,1fr)) !important",
        "height:72px !important",
    ):
        assert token in css
        assert token in runtime_css

    assert "← Revise response" not in shared
    assert "patch=526" in index
    assert "DEV · 526" in index
    print("V506 readable Canvas backdrop, focused analysis, and example planner contract passed.")


if __name__ == "__main__":
    main()
