#!/usr/bin/env python3
"""Regression guard for the S1 Content Avalanche Canvas evidence set."""

from __future__ import annotations

import json
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = json.loads((ROOT / "assets/asset-manifest.json").read_text(encoding="utf-8"))
CONFIG = (ROOT / "src/js/app/config-and-assets.js").read_text(encoding="utf-8")

EXPECTED = (
    "instructor-before-module.png",
    "instructor-after-module.png",
    "instructor-before-week-4-notes.png",
    "instructor-before-comparison-assignment.png",
    "instructor-before-buried-directions.png",
    "instructor-after-start-here.png",
    "instructor-after-submit-assignment.png",
    "instructor-after-read-page.png",
    "student-before-module.png",
    "student-after-module.png",
    "student-before-comparison-assignment.png",
    "student-after-start-here.png",
)

EXPECTED_SMARTBOARD = (
    "instructor-before-module-focus.png",
    "instructor-after-module-focus.png",
    "student-before-module-focus.png",
    "student-after-module-focus.png",
    "instructor-before-comparison-assignment-safe-focus.png",
    "instructor-after-submit-assignment-focus.png",
    "instructor-before-buried-directions-focus.png",
    "instructor-after-start-here-focus.png",
)


def png_dimensions(path: Path) -> tuple[int, int]:
    data = path.read_bytes()[:24]
    assert data[:8] == b"\x89PNG\r\n\x1a\n", f"Not a PNG: {path}"
    return struct.unpack(">II", data[16:24])


def main() -> int:
    runtime_paths = set(MANIFEST.get("runtime_images", {}).values())
    for filename in EXPECTED:
        relative = f"assets/images/scenes/scenario-01-content-avalanche/canvas/{filename}"
        assert (ROOT / relative).is_file(), f"Missing Canvas evidence image: {relative}"
        assert relative in runtime_paths, f"Canvas evidence is not classified for runtime: {relative}"
        assert relative in CONFIG, f"Canvas evidence is absent from the ASSETS registry: {relative}"

    for filename in EXPECTED_SMARTBOARD:
        relative = f"assets/images/scenes/scenario-01-content-avalanche/canvas/smartboard/{filename}"
        path = ROOT / relative
        assert path.is_file(), f"Missing focused smartboard image: {relative}"
        assert relative in runtime_paths, f"Focused smartboard image is not classified for runtime: {relative}"
        assert relative in CONFIG, f"Focused smartboard image is absent from the ASSETS registry: {relative}"
        width, height = png_dimensions(path)
        assert 1.62 <= width / height <= 1.65, f"Focused image does not fill the smartboard: {relative} ({width}x{height})"

    assert "const PC_S1_CANVAS_EVIDENCE = Object.freeze([" in CONFIG
    assert CONFIG.count("perspective: 'instructor'") == 8
    assert CONFIG.count("perspective: 'student'") == 4
    assert CONFIG.count("state: 'before'") == 6
    assert CONFIG.count("state: 'after'") == 6
    assert CONFIG.count(" alt: '") >= 12
    assert CONFIG.count("smartboardSrc:") == 8
    assert "smartboard: Object.freeze({" in CONFIG
    assert "pcGetS1CanvasEvidence" in CONFIG

    print("Scenario 1 Canvas evidence asset contract passed (12 full screenshots + 8 focused smartboard views).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
