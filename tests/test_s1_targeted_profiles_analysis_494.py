#!/usr/bin/env python3
"""V494 contract: named device profiles and variable reflection analysis."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared_js = read("src/js/scenarios/s1-canvas-evidence.js")
    responsive_css = read("src/css/responsive/final-overrides.css")
    shared_css = read("src/css/scenarios/shared.css")
    runtime_js = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    assert '(min-width: 980px) and (max-width: 1060px) and (max-height: 650px)' in shared_js
    assert '(max-width: 390px) and (max-height: 700px)' in responsive_css
    assert '(min-width: 740px) and (max-width: 1040px) and (min-height: 1000px)' in responsive_css
    assert '(min-width: 980px) and (max-width: 1060px) and (max-height: 650px)' in responsive_css
    targeted_profiles = responsive_css.split('/* V494', 1)[1]
    assert 'width: 100vw !important' in targeted_profiles
    assert 'min-width: 100vw !important' in targeted_profiles
    assert 'width: 122vw !important' not in targeted_profiles
    assert 'width: 112vw !important' not in targeted_profiles

    assert 'grid-template-columns: minmax(72px, max-content) minmax(0, 1fr)' in shared_css
    assert 'grid-auto-rows: max-content' in shared_css
    assert 'overflow-y: auto' in shared_css
    assert 'scrollbar-gutter: stable' in shared_css
    assert 'overflow-wrap: anywhere' in shared_css

    assert 'max-width: 1060px' in runtime_js
    assert 'minmax(72px, max-content)' in runtime_css
    assert 'patch=526' in index
    assert 'DEV · 526' in index

    print("V494 targeted device and variable analysis contract passed.")


if __name__ == "__main__":
    main()
