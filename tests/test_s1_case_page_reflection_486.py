#!/usr/bin/env python3
"""Static contract for S1 case-page reflection, CRT feedback, and week planning."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/s1-canvas-evidence.js")
    css = read("src/css/scenarios/shared.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for marker in (
        "function pcSubmitS1CaseReflection",
        "pcS1CaseReflectionText",
        "Analyze with Babbage →",
        "Practice Analysis",
        "function pcRenderS1WeekPlanner",
        "Describe what each part of the path should do.",
        "START HERE",
        "PRACTICE",
        "Analyze my module path →",
    ):
        assert marker in shared
        assert marker in runtime

    for marker in (
        "V486 — continuous case comparison",
        ".pc-s1-case-reflection",
        ".pc-s1-reflection-analysis--terminal",
        ".pc-s1-week-planner-grid",
        "repeating-linear-gradient",
    ):
        assert marker in css
        assert marker in runtime_css

    assert "patch=527" in index
    assert "DEV · 527" in index
    print("S1 case-page reflection and week planner 486 contract passed.")


if __name__ == "__main__":
    main()
