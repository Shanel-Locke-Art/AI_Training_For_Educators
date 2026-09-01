#!/usr/bin/env python3
"""Static contract for V493 evidence scrolling and variable analysis copy."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/s1-canvas-evidence.js")
    evidence_css = read("src/css/responsive/final-overrides.css")
    analysis_css = read("src/css/ui/completed-analysis.css")
    analysis_js = read("src/js/ui/analysis-layout-controller.js")
    runtime_css = read("runtime/css/promptcraft.css")
    runtime_js = read("runtime/js/promptcraft.bundle.js")

    assert '<source media="(min-width: 700px) and (orientation: landscape)"' in shared
    assert 'padding: 0 0 max(190px, 25dvh) !important' in evidence_css
    assert 'position: static !important' in evidence_css
    assert 'scroll-padding-bottom: max(190px, 25dvh) !important' in evidence_css
    assert 'width: 122% !important' in evidence_css
    assert 'width: 100% !important' in evidence_css

    assert 'V493 cascade lock' in analysis_css
    assert 'grid-auto-rows: max-content !important' in analysis_css
    assert 'overflow-y: auto !important' in analysis_css
    assert 'contain: none !important' in analysis_css
    assert 'pcAnalysisLayoutFontTimer' in analysis_js
    assert '}, 480);' in analysis_js

    for marker in (
        'padding: 0 0 max(190px, 25dvh) !important',
        'grid-auto-rows: max-content !important',
        'pcAnalysisLayoutFontTimer',
    ):
        assert marker in runtime_css or marker in runtime_js

    print("V493 responsive evidence and variable analysis contract passed.")


if __name__ == "__main__":
    main()
