#!/usr/bin/env python3
"""V508 contract: S1 missions and Canvas dialogue have stable layout owners."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    shared = (ROOT / "src/js/scenarios/shared-components.js").read_text(encoding="utf-8")
    css = (ROOT / "src/css/responsive/final-overrides.css").read_text(encoding="utf-8")
    index = (ROOT / "index.html").read_text(encoding="utf-8")

    assert "function pcPrepareS1MissionBoardImage" in shared
    assert "loadSceneImage(evidence.smartboardSrc || evidence.src, evidence.src)" in shared
    assert "pcPrepareS1MissionBoardImage(normalized);" in shared
    assert "pc-s1-mission-board-image" in shared

    assert "V508 - S1 mission and Canvas-dialogue ownership" in css
    assert "object-fit: contain !important" in css
    assert "inset: 0 0 var(--pc-vn-dialogue-min-height" in css
    assert "background: #010609 !important" in css
    assert '[data-pc-character="eli"]' in css
    assert "object-fit: cover !important" not in css[css.index("/* V508"):]

    assert "patch=524" in index
    print("V508 S1 mission image and contained Canvas dialogue contract passed.")


if __name__ == "__main__":
    main()
