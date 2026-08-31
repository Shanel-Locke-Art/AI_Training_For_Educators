#!/usr/bin/env python3
"""V497 contract: centered tablet evidence and measured phone cast return."""

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

    for token in (
        "pc-s1-real-canvas-capture--centered",
        "isNestHub ? 'min(90vw, 920px)' : isPortraitTablet ? 'min(88vw, 820px)'",
        "centeredCanvas ? '0 auto' : '0'",
        "captureImage?.addEventListener('load', updatePhoneCastRoom)",
    ):
        assert token in shared
        assert token in runtime

    for token in (
        "function pcUpdateS1PhoneCastRoom()",
        "dialogue.getBoundingClientRect().top - image.getBoundingClientRect().bottom",
        "const hasRoom = availableRoom >= 140",
        "pc-s1-phone-cast-room",
        "window.pcUpdateS1PhoneCastRoom = pcUpdateS1PhoneCastRoom",
    ):
        assert token in visual_novel
        assert token in runtime

    v497 = css.split("/* V497", 1)[1]
    assert "width: min(88vw, 820px) !important" in v497
    assert "width: min(90vw, 920px) !important" in v497
    assert "margin: 0 auto !important" in v497
    assert "pc-s1-phone-cast-room" in v497
    assert "#vnStudentCharacter#vnStudentCharacter" in v497
    assert "#vnCharacter#vnCharacter" in v497
    assert "/* V497" in runtime_css

    assert "patch=523" in index
    assert "DEV · 523" in index
    print("V497 centered-tablet and adaptive-phone-cast contract passed.")


if __name__ == "__main__":
    main()
