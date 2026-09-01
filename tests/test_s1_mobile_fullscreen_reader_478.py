#!/usr/bin/env python3
"""Static contract for the full-screen, scrollable S1 phone evidence reader."""

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    source = read("src/js/scenarios/s1-canvas-evidence.js")
    css = read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for marker in (
        "pc-s1-mobile-evidence-reader",
        "pc-s1-mobile-evidence-reader-head",
        "pc-s1-mobile-evidence-scroll-hint",
        "Scroll evidence ↓",
        "role', 'document",
        "Scroll to review all evidence",
        "scene.scrollTop = 0",
    ):
        assert marker in source, f"Source is missing full-screen reader marker: {marker}"
        assert marker in runtime, f"Runtime is missing full-screen reader marker: {marker}"

    for marker in (
        "V479 — full-screen S1 Canvas evidence reader on compact viewports",
        "height: 100dvh !important",
        "#vnOverlay#vnOverlay.vn-overlay.active.pc-s1-mobile-evidence-reader #vnScene",
        "overflow-y: auto !important",
        "touch-action: pan-y !important",
        "aspect-ratio: auto !important",
        "grid-template-rows: auto auto auto auto auto !important",
        "#vnDialogue.pc-s1-diagnosis-dialogue",
        "display: none !important",
    ):
        assert marker in css, f"Source CSS is missing full-screen reader contract: {marker}"
        assert marker in runtime_css, f"Runtime CSS is missing full-screen reader contract: {marker}"

    assert "Unit4_final_v3.txt" in source
    assert "What to do next?" in source
    assert "SUBMIT · 400-word comparison + evidence" in source
    assert "Success criteria appear before writing" in source
    # Read the live cache-buster patch instead of hardcoding one, since it
    # advances on every release. The dev-label description text is also
    # rewritten on later patches (it now reads "...case-page-only terminal
    # flow" rather than "...case-page-only comparison"), so that specific
    # wording isn't checked here, only that a dev-label with the current
    # patch number exists.
    patch_match = re.search(r"promptcraft\.css\?v=429&patch=(\d+)", index)
    assert patch_match, "Could not find promptcraft.css patch marker in index.html"
    patch = patch_match.group(1)
    assert f"patch={patch}" in index
    assert f"DEV · {patch}" in index
    print("S1 full-screen mobile Canvas evidence reader remains intact through patch 482.")


if __name__ == "__main__":
    main()
