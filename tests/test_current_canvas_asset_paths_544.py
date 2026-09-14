#!/usr/bin/env python3
"""Patch 544 guard for current visible scenario screenshot folders and runtime routing."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "src/js/app/config-and-assets.js"
CONFIG = CONFIG_PATH.read_text(encoding="utf-8")
MANIFEST = json.loads((ROOT / "assets/asset-manifest.json").read_text(encoding="utf-8"))

EXPECTED = {
    1: ("scenario-01-content-avalanche", [
        "s1-before-module.png", "s1-before-notes.png", "s1-before-assignment.png",
        "s1-after-module.png", "s1-after-start-here.png", "s1-after-assignment.png",
    ]),
    2: ("scenario-02-accessibility", [
        "s2-before-module.png", "s2-before-field-guide.png", "s2-before-media.png",
        "s2-after-module.png", "s2-after-field-guide.png", "s2-after-check.png",
    ]),
    3: ("scenario-03-confident-student", [
        "s3-before-module.png", "s3-before-reflect.png", "s3-after-module.png",
        "s3-after-reflect.png", "s3-after-evidence-check.png", "s3-after-feedback.png",
    ]),
    4: ("scenario-04-96-percent-problem", [
        "s4-before-module.png", "s4-before-quiz.png", "s4-before-grade-96.png",
        "s4-after-module.png", "s4-after-brief.png", "s4-after-assignment.png",
        "s4-after-rubric.png", "s4-after-transfer.png",
    ]),
}


def main() -> int:
    runtime_paths = set(MANIFEST["runtime_images"].values())
    assert MANIFEST["version"] == 150

    for number, (folder, names) in EXPECTED.items():
        for name in names:
            rel = f"assets/images/scenes/{folder}/canvas/{name}"
            assert (ROOT / rel).is_file(), rel
            assert rel in runtime_paths, f"not runtime-classified: {rel}"
            assert rel in CONFIG, f"not registered in config: {rel}"
        opening = f"assets/images/scenes/{folder}/canvas/s{number}-before-module.png"
        assert opening in CONFIG, f"opening smartboard is not routed to current S{number}: {opening}"

    assert "assets/images/backgrounds/gfc/s3-study-lounge.jpg" in CONFIG
    assert "assets/images/backgrounds/gfc/s2-study-lounge.jpg" not in CONFIG
    for retired in (
        "scenario-01-engagement/scene.png",
        "scenario-02-metacognition/scene.png",
        "scenario-03-authentic-assessment/scene.png",
        "scenario-04-sync-bias/scene.png",
    ):
        assert retired not in CONFIG, f"retired visible-scenario path is still active: {retired}"

    assert "PC_CANVAS_EVIDENCE_BY_SCENARIO" in CONFIG
    assert "pcGetScenarioCanvasEvidence" in CONFIG
    print("Patch 544 current Canvas asset path contract passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
