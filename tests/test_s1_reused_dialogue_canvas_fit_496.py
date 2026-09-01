#!/usr/bin/env python3
"""V496 contract: reuse VN dialogue; adjust only documented Canvas captures."""

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
        "function pcApplyS1DocumentedCaptureFit",
        "const isShortPhone = width <= 390 && height <= 700",
        "const isPortraitTablet = width >= 740 && width <= 1040 && height >= 1000",
        "const isNestHub = width >= 980 && width <= 1060 && height <= 650",
        "picture.querySelectorAll('source').forEach(source => source.remove())",
        "pcApplyS1DocumentedCaptureFit(panel, evidence)",
    ):
        assert token in shared
        assert token in runtime

    v496 = css.split("/* V496", 1)[1]
    assert "#vnAdvanceHint" in v496
    assert "position: absolute !important" in v496
    assert "background: transparent !important" in v496
    assert ".pc-s1-real-canvas-capture--documented-fit" in v496
    assert "object-position: top left !important" in v496
    assert "position: static !important" not in v496
    assert "/* V496" in runtime_css

    # The next-case bridge remains narrated by the established cast.
    assert "pcPlayS1PreviewBriefing(nextCaseIndex, null, { classroom: true })" in shared
    assert "patch=524" in index
    assert "DEV · 524" in index

    print("V496 reused-dialogue and documented Canvas-fit contract passed.")


if __name__ == "__main__":
    main()

