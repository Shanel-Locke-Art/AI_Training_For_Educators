#!/usr/bin/env python3
"""V502 contract: optional cast stays above dialogue and below Canvas."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    vn = read("src/js/ui/visual-novel.js")
    shared = read("src/js/scenarios/shared-components.js")
    css = read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for token in (
        "const hasRoom = availableRoom >= 140",
        "Math.min(150, availableRoom - 18)",
        "--pc-s1-cast-bottom",
        "window.innerHeight - dialogueRect.top + 4",
        "style.removeProperty('--pc-s1-cast-top')",
    ):
        assert token in vn
        assert token in runtime

    for token in (
        "V502 — anchor the optional cast to the dialogue boundary",
        "position: fixed !important",
        "top: auto !important",
        "bottom: var(--pc-s1-cast-bottom) !important",
        "width: min(36vw, 245px) !important",
        "max-height: 150px !important",
    ):
        assert token in css
        assert token in runtime_css

    assert "style.removeProperty('--pc-s1-cast-bottom')" in shared
    assert "function pcRestoreS1ResponsiveCapture(panel, evidence)" in shared
    assert "patch=522" in index
    assert "DEV · 522" in index
    print("V502 dialogue-anchored adaptive-cast contract passed.")


if __name__ == "__main__":
    main()

