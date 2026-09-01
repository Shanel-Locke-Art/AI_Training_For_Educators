#!/usr/bin/env python3
"""Static contract for Canvas-authentic compact S1 evidence views."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/shared-components.js")
    visual_novel = read("src/js/ui/visual-novel.js")
    css = read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for marker in (
        "kind: 'modules'",
        "kind: 'assignment'",
        "kind: 'page'",
        "pc-s1-canvas-wordmark",
        "pc-s1-canvas-breadcrumb",
        "pc-s1-canvas-pagehead",
        "pc-s1-canvas-published",
        "pc-s1-canvas-item-icon",
        "pc-s1-canvas-row-status",
        "Inspection focus",
    ):
        assert marker in shared
        assert marker in runtime

    for marker in (
        "compactS1Evidence",
        "pc-s1-mobile-evidence-reader",
        "style.setProperty('display', 'none', 'important')",
        "setAttribute('aria-hidden', 'true')",
    ):
        assert marker in visual_novel
        assert marker in runtime

    for marker in (
        "V481 — the compact evidence lens is a Canvas surface",
        ".pc-s1-canvas-wordmark",
        ".pc-s1-canvas-pagehead",
        ".pc-s1-canvas-item-icon",
        ".pc-s1-canvas-row-status",
        "user-select: none !important",
        "visibility: hidden !important",
    ):
        assert marker in css
        assert marker in runtime_css

    assert "patch=524" in index
    assert "DEV · 524" in index
    print("S1 Canvas-authentic compact interface remains intact through patch 482.")


if __name__ == "__main__":
    main()
