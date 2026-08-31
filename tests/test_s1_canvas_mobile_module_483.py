#!/usr/bin/env python3
"""Static contract for the Canvas-faithful S1 mobile module interface."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/shared-components.js")
    css = read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for marker in (
        "groupTitle: 'BEFORE · Week 4 Content Avalanche'",
        "sectionTitle: 'WEEK 4 MATERIALS'",
        "pc-s1-canvas-module-group-head",
        "pc-s1-canvas-module-section-head",
        "pc-s1-canvas-accessibility",
        "pc-s1-canvas-kebab",
        "data-canvas-item-type",
    ):
        assert marker in shared
        assert marker in runtime

    for marker in (
        "V483 — Canvas-faithful mobile Modules evidence",
        ".pc-s1-mobile-evidence-lens--modules",
        "border-left: 4px solid #079447",
        ".pc-s1-canvas-row-status.is-unpublished",
        "li[data-canvas-item-type=\"attachment\"]",
    ):
        assert marker in css
        assert marker in runtime_css

    assert "patch=523" in index
    assert "DEV · 523" in index
    print("S1 Canvas-faithful mobile module 483 contract passed.")


if __name__ == "__main__":
    main()
