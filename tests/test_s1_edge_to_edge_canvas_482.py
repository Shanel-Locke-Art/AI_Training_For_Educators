#!/usr/bin/env python3
"""Static contract for the concise S1 mission and edge-to-edge Canvas pane."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    registry = read("src/js/scenarios/registry.js")
    visual_novel = read("src/js/ui/visual-novel.js")
    css = read("src/css/responsive/final-overrides.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    short_mission = "Week 4 has plenty of content but no clear path. Find what students must guess."
    assert short_mission in registry
    assert short_mission in runtime
    assert "boardText.textContent = ui?.boardText || scenarios[i].desc" in visual_novel
    assert "boardText.textContent = ui?.boardText || scenarios[i].desc" in runtime
    assert "boardText.textContent = scenarios[i].desc" not in visual_novel

    for marker in (
        "V482 — compact Canvas evidence fills the entire evidence pane",
        "padding: 0 !important",
        "min-height: 100% !important",
        "border: 0 !important",
        "border-radius: 0 !important",
        "box-shadow: none !important",
        "#vnSceneBg",
    ):
        assert marker in css
        assert marker in runtime_css

    assert "patch=522" in index
    assert "DEV · 522" in index
    print("S1 concise mission and edge-to-edge Canvas 482 contract passed.")


if __name__ == "__main__":
    main()
