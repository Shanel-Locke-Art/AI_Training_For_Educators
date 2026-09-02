#!/usr/bin/env python3
"""Compatibility contract for the responsive S1 Babbage analysis report."""

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
        "pcEvaluateS1AfterReflection",
        "pcShowS1ReflectionAnalysis",
        "workspace.id = 'pcS1ReflectionAnalysis'",
        "aria-modal",
        "Strong explanation",
        "On the right track",
        "Needs another look",
        "Names the learner problem",
        "Cites a visible Canvas change",
        "Connects the change to students",
        "overlay.inert = true",
    ):
        assert marker in source
        assert marker in runtime

    for selector in (
        ".pc-s1-reflection-analysis",
        ".pc-s1-reflection-analysis-shell",
        ".pc-s1-reflection-analysis-content",
        ".pc-s1-reflection-analysis-footer",
        ".pc-s1-reflection-feedback",
        "body.pc-s1-reflection-analysis-active",
    ):
        assert selector in css
        assert selector in runtime_css

    for responsive_contract in ("overflow-y:auto", "overscroll-behavior:contain", "height:100dvh", "@media (max-width:700px)"):
        assert responsive_contract in css
        assert responsive_contract in runtime_css

    assert "pcGetS1AIWorkspaceStepHTML" not in source
    assert "pcRenderS1AIWorkspaceStep" not in source
    assert "patch=527" in index
    assert "DEV · 527" in index
    print("S1 responsive Babbage reflection analysis contract passed through patch 484.")


if __name__ == "__main__":
    main()
