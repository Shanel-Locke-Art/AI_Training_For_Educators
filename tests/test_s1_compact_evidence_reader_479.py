#!/usr/bin/env python3
"""Static contract for readable, scrollable S1 Canvas evidence through tablets."""

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    source = read("src/js/scenarios/shared-components.js")
    css = read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for marker in (
        "pc-s1-mobile-evidence-state",
        "${evidence.state === 'after' ? 'After' : 'Before'}",
        "pc-s1-mobile-evidence-reader-head",
        "pc-s1-mobile-evidence-context",
        "Scroll evidence ↓",
    ):
        assert marker in source, f"Source is missing compact evidence marker: {marker}"
        assert marker in runtime, f"Runtime is missing compact evidence marker: {marker}"

    for marker in (
        "V479 — full-screen S1 Canvas evidence reader on compact viewports",
        "@media screen and (max-width: 1100px)",
        ".pc-s1-mobile-evidence-state",
        ".vn-smartboard-wrap::after",
        ".vn-brand-menu",
        "grid-template-rows: auto auto auto auto auto !important",
        "overflow-y: auto !important",
        "touch-action: pan-y !important",
    ):
        assert marker in css, f"Source CSS is missing compact reader contract: {marker}"
        assert marker in runtime_css, f"Runtime CSS is missing compact reader contract: {marker}"

    reader = css[css.index("/* V479 —"):css.index("@media (max-width: 600px)", css.index("/* V479 —"))]
    assert "padding: 14px !important" in reader
    assert "display: none !important" in reader
    assert "max-width: 700px" not in reader
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
    print("S1 scrollable compact Canvas evidence reader 479 contract passed.")


if __name__ == "__main__":
    main()
