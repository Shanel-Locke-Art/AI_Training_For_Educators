#!/usr/bin/env python3
"""Static contract for S1's case-page-only response and terminal handoff."""

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
        "function pcRouteS1ReflectionToCasePage",
        "function pcShowS1ReflectionLoading",
        "pcS1CaseReflectionText",
        "data-pc-state=\"before\"",
        "data-pc-state=\"after\"",
        "Analyze with Babbage →",
        "BABBAGE ANALYSIS BOOT",
        "pcShowS1ReflectionLoading();",
    ):
        assert marker in shared
        assert marker in runtime

    for retired_marker in (
        "panel.id = 'pcS1AfterReflection'",
        "panel.id = 'pcS1DialogueChoices'",
        "pcShowS1DialogueDiagnosis(normalized, onDone)",
    ):
        assert retired_marker not in shared
        assert retired_marker not in runtime

    for marker in (
        "V488 — the case file is now the only S1 comparison surface",
        ".pc-s1-reflection-loading",
        "pc-s1-loading-progress",
        "min-height:100dvh",
    ):
        assert marker in css
        assert marker in runtime_css

    assert "patch=527" in index
    assert "DEV · 527" in index
    print("S1 case-page-only terminal 488 contract passed.")


if __name__ == "__main__":
    main()
