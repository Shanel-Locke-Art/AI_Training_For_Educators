#!/usr/bin/env python3
"""Regression guard for the normalized S1 Content Avalanche Canvas evidence set."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = json.loads((ROOT / "assets/asset-manifest.json").read_text(encoding="utf-8"))
CONFIG = (ROOT / "src/js/app/config-and-assets.js").read_text(encoding="utf-8")

EXPECTED = (
    "s1-before-module.png",
    "s1-before-notes.png",
    "s1-before-assignment.png",
    "s1-after-module.png",
    "s1-after-start-here.png",
    "s1-after-assignment.png",
)


def main() -> int:
    runtime_paths = set(MANIFEST.get("runtime_images", {}).values())
    base = "assets/images/scenes/scenario-01-content-avalanche/canvas"
    for filename in EXPECTED:
        relative = f"{base}/{filename}"
        assert (ROOT / relative).is_file(), f"Missing Canvas evidence image: {relative}"
        assert relative in runtime_paths, f"Canvas evidence is not classified for runtime: {relative}"
        assert relative in CONFIG, f"Canvas evidence is absent from the ASSETS registry: {relative}"

    # Stable logical evidence IDs remain available to gameplay, but compact,
    # mobile, and smartboard sources now intentionally reuse the approved captures.
    assert "const PC_S1_CANVAS_EVIDENCE = Object.freeze([" in CONFIG
    assert "smartboard: Object.freeze({" in CONFIG
    assert "pcGetS1CanvasEvidence" in CONFIG
    assert "s1-before-module.png" in CONFIG
    assert "s1-after-module.png" in CONFIG
    assert "s1-before-assignment.png" in CONFIG
    assert "s1-after-assignment.png" in CONFIG
    assert "s1-before-notes.png" in CONFIG
    assert "s1-after-start-here.png" in CONFIG

    print("Scenario 1 normalized Canvas evidence asset contract passed (6 approved captures).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
