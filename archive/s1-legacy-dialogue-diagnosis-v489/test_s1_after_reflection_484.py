#!/usr/bin/env python3
"""Static contract for S1 After reflection and Babbage feedback."""

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

    for marker in (
        "function pcShowS1AfterReflection",
        "function pcEvaluateS1AfterReflection",
        "function pcSubmitS1AfterReflection",
        "function pcShowS1ReflectionAnalysis",
        "Analyze with Babbage →",
        "Comparison Analysis Terminal",
        "s1-revise-after-reflection",
        "s1-complete-after-reflection",
    ):
        assert marker in shared
        assert marker in runtime

    assert "pcShowS1AIDemonstration" not in shared
    assert "See Babbage’s draft →" not in shared

    for marker in (
        "V484 — S1 After-view explanation and Babbage feedback loop",
        ".pc-s1-reflection-analysis-shell",
        ".pc-s1-reflection-feedback",
        "height:100dvh",
    ):
        assert marker in css
        assert marker in runtime_css

    assert "panel.id = 'pcS1AfterReflection'" not in shared
    assert "panel.id = 'pcS1AfterReflection'" not in runtime

    assert "patch=489" in index
    assert "DEV · 489" in index
    print("S1 After reflection and Babbage feedback 484 contract passed.")


if __name__ == "__main__":
    main()
