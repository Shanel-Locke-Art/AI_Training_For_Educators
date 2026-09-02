#!/usr/bin/env python3
"""Static contract for edge-cropped real Canvas evidence in S1."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/s1-canvas-evidence.js")
    css = read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    marker = "pc-s1-real-canvas-capture--${esc(evidence.id)}"
    assert marker in shared and marker in runtime
    for token in (
        "V487 — visually crop the blank gutters",
        ".pc-s1-real-canvas-capture--instructor-before-module img",
        ".pc-s1-real-canvas-capture--student-before-module img",
        "width: 122% !important",
        "margin: -30px 0 0 -11% !important",
        "overflow-x: hidden !important",
    ):
        assert token in css and token in runtime_css
    assert "patch=527" in index
    assert "DEV · 527" in index
    print("S1 real Canvas edge crop 487 contract passed.")


if __name__ == "__main__":
    main()
