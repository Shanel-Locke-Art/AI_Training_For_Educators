#!/usr/bin/env python3
"""Regression contract replacing fragile device-only Canvas transforms."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    css = read("src/css/responsive/final-overrides.css")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for marker in (
        "V491 — one predictable crop for the two real module captures",
        ".pc-s1-real-canvas-capture--instructor-before-module",
        ".pc-s1-real-canvas-capture--student-before-module",
        "transform: none !important",
        "object-position: top center !important",
    ):
        assert marker in css
        assert marker in runtime_css

    for removed in (
        "translateY(-50px) scale(1.1)",
        "translateY(-55px) scale(1.2)",
        "translateY(-50px) scale(1.75)",
    ):
        assert removed not in css
        assert removed not in runtime_css
    for marker in (
        "V493 cascade lock",
        "position: static !important",
        "padding: 0 0 max(190px, 25dvh) !important",
        "overflow-y: auto !important",
        "width: 122% !important",
        "margin: -30px 0 0 -11% !important",
    ):
        assert marker in css
        assert marker in runtime_css
    assert "patch=522" in index
    assert "DEV · 522" in index
    print("S1 stable module capture contract passed.")


if __name__ == "__main__":
    main()
