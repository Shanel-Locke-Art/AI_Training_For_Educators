#!/usr/bin/env python3
"""Static contract for direct Canvas mobile evidence captures in S1."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    config = read("src/js/app/config-and-assets.js")
    shared = read("src/js/scenarios/shared-components.js")
    css = read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    manifest = read("assets/asset-manifest.json")
    index = read("index.html")

    assets = (
        "instructor-before-module-mobile-wide.png",
        "instructor-before-module-mobile-phone.png",
        "student-before-module-mobile-wide.png",
        "student-before-module-mobile-phone.png",
    )
    for filename in assets:
        assert (ROOT / "assets/images/scenes/scenario-01-content-avalanche/canvas" / filename).is_file()
        assert filename in config
        assert filename in runtime
        assert filename in manifest

    for marker in (
        "compactSrc:",
        "mobileSrc:",
        "pc-s1-mobile-evidence-lens--real-capture",
        '<source media="(max-width: 480px)"',
        "pc-s1-real-canvas-capture",
    ):
        assert marker in shared or marker in config
        assert marker in runtime

    for marker in (
        "V485 — use the real Canvas responsive captures",
        ".pc-s1-mobile-evidence-lens--real-capture",
        ".pc-s1-real-canvas-capture img",
        "object-position: top center",
    ):
        assert marker in css
        assert marker in runtime_css

    assert "patch=524" in index
    assert "DEV · 524" in index
    print("S1 real Canvas mobile captures 485 contract passed.")


if __name__ == "__main__":
    main()
