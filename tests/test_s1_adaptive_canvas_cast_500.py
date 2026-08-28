#!/usr/bin/env python3
"""V500 contract: Pixel/Eli use measured blank Canvas space only."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    vn = read("src/js/ui/visual-novel.js")
    dialogue = read("src/js/content/dialogue-data.js")
    shared = read("src/js/scenarios/shared-components.js")
    css = read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_dialogue = read("runtime/js/dialogue-data.js")
    runtime_css = read("runtime/css/promptcraft.css")
    dev = read("src/js/dev/development-tools.js")
    index = read("index.html")

    for token in (
        "window.screen?.width || window.innerWidth",
        "screenWidth <= 1100",
        "dialogue.getBoundingClientRect().top - image.getBoundingClientRect().bottom",
        "availableRoom >= 140",
        "--pc-s1-cast-top",
        "--pc-s1-cast-height",
        "pcScheduleS1CastRoomUpdate",
        "window.visualViewport?.addEventListener('resize'",
    ):
        assert token in vn
        assert token in runtime

    intro_start = dialogue.index('"s1_canvas_evidence_intro"')
    intro = dialogue[intro_start:dialogue.index('],', intro_start) + 2]
    assert '"cast": PC_S1_CANVAS_DIALOGUE_CAST' in intro
    assert intro in runtime_dialogue

    for token in (
        "V500 — restore the established Pixel/Eli cast",
        "top: var(--pc-s1-cast-top) !important",
        "height: var(--pc-s1-cast-height) !important",
        "position: absolute !important",
        "pointer-events: none !important",
    ):
        assert token in css
        assert token in runtime_css

    assert "style.removeProperty('--pc-s1-cast-top')" in shared
    assert "pc-s1-documented-device-stage" in shared
    assert "activeS1Case ? pcFillS1DevFields() : resetS1Dev()" in dev
    assert "patch=509" in index
    assert "DEV · 509" in index
    print("V500 adaptive Canvas dialogue-cast contract passed.")


if __name__ == "__main__":
    main()
