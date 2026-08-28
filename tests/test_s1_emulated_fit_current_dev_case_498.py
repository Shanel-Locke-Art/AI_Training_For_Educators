#!/usr/bin/env python3
"""V498 contract: stable emulated fits and current-case S1 DEV fill."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/shared-components.js")
    dev = read("src/js/dev/development-tools.js")
    runtime = read("runtime/js/promptcraft.bundle.js")
    index = read("index.html")

    for token in (
        "Math.min(window.innerWidth, window.screen?.width || window.innerWidth)",
        "Math.min(window.innerHeight, window.screen?.height || window.innerHeight)",
        "const isShortPhone = width <= 390 && height <= 700",
        "const isPortraitTablet = width >= 740 && width <= 1040",
        "const isNestHub = width >= 980 && width <= 1060",
    ):
        assert token in shared
        assert token in runtime

    fill = dev[dev.index("function devFillScenario"):dev.index("function devNextScenario")]
    assert "scenarioIndex === SCENARIO_INDEX.CONTENT_AVALANCHE" in fill
    assert "document.getElementById('pcS1CaseReflectionText')" in fill
    assert "activeS1Case ? pcFillS1DevFields() : resetS1Dev()" in fill
    assert fill in runtime

    assert "patch=509" in index
    assert "DEV · 509" in index
    print("V498 emulated-device fit and current-case DEV-fill contract passed.")


if __name__ == "__main__":
    main()

