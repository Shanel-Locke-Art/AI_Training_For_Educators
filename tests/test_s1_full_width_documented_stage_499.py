#!/usr/bin/env python3
"""V499 contract: documented devices own the complete Canvas evidence stage."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/shared-components.js")
    css = read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    dev = read("src/js/dev/development-tools.js")
    index = read("index.html")

    for token in (
        "pc-s1-documented-device-stage",
        "const isShortPhone = width <= 390 && height <= 700",
        "const isPortraitTablet = width >= 740 && width <= 1040",
        "const isNestHub = width >= 980 && width <= 1060",
        "classList.add('pc-s1-documented-device-stage')",
    ):
        assert token in shared
        assert token in runtime

    for token in (
        ".pc-s1-documented-device-stage",
        "#pcS1MobileEvidenceLens.pc-s1-mobile-evidence-lens--real-capture",
        "width: 100vw !important",
        "overflow-x: hidden !important",
        "justify-content: center !important",
    ):
        assert token in css
        assert token in runtime_css

    assert "document.getElementById('pcS1CaseReflectionText')" in dev
    assert "activeS1Case ? pcFillS1DevFields() : resetS1Dev()" in dev
    assert "patch=522" in index
    assert "DEV · 522" in index
    print("V499 full-width documented Canvas-stage contract passed.")


if __name__ == "__main__":
    main()

