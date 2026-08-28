#!/usr/bin/env python3
"""V507 contract: Eli replaces Jordan in S1 without changing S2."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    config = read("src/js/app/config-and-assets.js")
    vn = read("src/js/ui/visual-novel.js")
    registry = read("src/js/scenarios/registry.js")
    shared = read("src/js/scenarios/shared-components.js")
    dialogue = read("src/js/content/dialogue-data.js")
    manifest = read("assets/asset-manifest.json")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_dialogue = read("runtime/js/dialogue-data.js")
    index = read("index.html")

    for expression in ("neutral", "uncertain", "frustrated", "thinking", "confident"):
        portrait = ROOT / f"assets/images/characters/students/eli/{expression}.png"
        assert portrait.is_file() and portrait.stat().st_size > 100_000
        assert f"students/eli/{expression}.png" in config
        assert f"eli-{expression}.png" in manifest

    assert "pcRegisterVNCharacter('eli'" in vn
    assert "introCharacters: [{ id: 'pixel', slot: 'right' }, { id: 'eli', slot: 'left' }]" in registry
    assert "{ id: 'eli', slot: 'left' }" in shared
    assert "Professor Pixel and Eli dialogue" in shared

    s1_dialogue = dialogue[:dialogue.index('"scenarioStart_engagement"')]
    assert '"speaker": "Eli"' in s1_dialogue
    assert '"character": "eli"' in s1_dialogue
    assert '"speaker": "Jordan"' not in s1_dialogue
    assert '"character": "jordan"' not in s1_dialogue

    # Jordan remains the learner in Scenario 2.
    assert '"speaker": "Jordan"' in dialogue
    assert "ASSETS.images.students.jordan" in runtime
    assert '"speaker": "Eli"' in runtime_dialogue
    assert "patch=509" in index
    assert "DEV · 509" in index
    print("V507 Eli character and dialogue integration contract passed.")


if __name__ == "__main__":
    main()
