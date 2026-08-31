#!/usr/bin/env python3
"""V517 contract: case-introduction evidence adapts by viewport family."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/shared-components.js")
    css = read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for token in (
        '(max-width: 520px)',
        '(max-width: 1100px) and (orientation: portrait)',
        'evidence.mobileSrc',
        'evidence.compactSrc',
    ):
        assert token in shared
        assert token in runtime

    for token in (
        '@media screen and (min-width: 701px) and (orientation: portrait)',
        '@media screen and (min-width: 701px) and (orientation: landscape)',
        'grid-template-rows: auto minmax(0, 1fr);',
        'width: min(72vw, 980px);',
        'width: min(18vw, 230px) !important;',
        'height: calc(100dvh - var(--pc-vn-dialogue-min-height, 232px) - 24px);',
    ):
        assert token in css
        assert token in runtime_css

    assert 'patch=523' in index
    assert 'DEV · 523' in index
    print('V517 viewport-family introduction layout contract passed.')


if __name__ == '__main__':
    main()
