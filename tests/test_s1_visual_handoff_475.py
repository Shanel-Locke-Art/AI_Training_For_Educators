#!/usr/bin/env python3
"""Static contract for the S1 patch 475 visual refinement."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/shared-components.js")
    css = read("src/css/scenarios/shared.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    config = read("src/js/app/config-and-assets.js")
    manifest = read("assets/asset-manifest.json")
    index = read("index.html")

    safe_relative = (
        "assets/images/scenes/scenario-01-content-avalanche/canvas/smartboard/"
        "instructor-before-comparison-assignment-safe-focus.png"
    )
    safe_image = ROOT / safe_relative
    assert safe_image.is_file(), "Missing safe-fit assignment smartboard image."
    with Image.open(safe_image) as image:
        assert image.size == (1050, 643), f"Unexpected safe-fit dimensions: {image.size}"
        assert 1.62 <= image.width / image.height <= 1.65

    assert safe_relative in config
    assert safe_relative in manifest

    for marker in (
        'id="pcS1Debrief"',
        'id="pcS1CaseReflectionText"',
        "Compare the evidence",
        "Analyze with Babbage →",
        "if (debrief) debrief.hidden = false",
    ):
        assert marker in shared, f"Missing source handoff marker: {marker}"
        assert marker in runtime, f"Missing runtime handoff marker: {marker}"

    for selector in (
        ".pc-s1-case-handoff",
        ".pc-s1-case-reflection",
        ".pc-s1-case-reflection-head",
        ".pc-s1-case-reflection-actions",
    ):
        assert selector in css, f"Missing source selector: {selector}"
        assert selector in runtime_css, f"Missing runtime selector: {selector}"

    assert "pc-s1-ai-summary" not in shared
    assert "pcS1Takeaway" not in shared
    assert "patch=522" in index
    assert "DEV · 522" in index
    print("S1 smartboard and compact case handoff contract passed through patch 482.")


if __name__ == "__main__":
    main()
