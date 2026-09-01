#!/usr/bin/env python3
"""Compatibility contract for the connected S1 evidence-to-feedback flow."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    source = read("src/js/scenarios/shared-components.js")
    runtime = read("runtime/js/promptcraft.bundle.js")
    css = read("src/css/scenarios/shared.css")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for marker in (
        "pcS1PreviewState = 'after'",
        "function pcRouteS1ReflectionToCasePage",
        "pcS1CaseReflectionText",
        "Reveal After",
        "Analyze with Babbage →",
        "pcShowS1ReflectionLoading",
        "pcShowS1ReflectionAnalysis",
    ):
        assert marker in source
        assert marker in runtime

    assert "pcShowS1AfterReflection(pending.caseIndex, onDone)" not in source
    assert "panel.id = 'pcS1DialogueChoices'" not in source
    assert "pcShowS1AIDemonstration" not in source
    assert "See Babbage’s draft →" not in source

    for marker in (".pc-s1-case-reflection", ".pc-s1-reflection-loading", ".pc-s1-reflection-analysis", "overscroll-behavior:contain"):
        assert marker in css
        assert marker in runtime_css

    assert "patch=524" in index
    assert "DEV · 524" in index
    print("S1 evidence-to-written-reflection handoff contract passed through patch 484.")


if __name__ == "__main__":
    main()
