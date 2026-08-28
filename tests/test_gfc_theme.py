#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def require(path, needle):
    text=(ROOT/path).read_text(encoding="utf-8")
    assert needle in text, f"Missing {needle!r} in {path}"

def current_patch(index_html):
    """Read the live cache-buster patch number from index.html instead of
    hardcoding one, since it advances on every release."""
    match = re.search(r"promptcraft\.css\?v=429&patch=(\d+)", index_html)
    assert match, "Could not find promptcraft.css patch marker in index.html"
    return match.group(1)

def main():
    for rel in (
        "assets/images/backgrounds/gfc/s1-science-wing.jpg",
        "assets/images/backgrounds/gfc/s2-study-lounge.jpg",
    ):
        assert (ROOT/rel).is_file(), f"Missing campus background {rel}"
    require("src/css/manifest.css", '@import url("ui/gfc-theme.css");')
    require("src/css/ui/gfc-theme.css", "--gfc-navy: #112650")
    require("src/js/app/config-and-assets.js", "s1-science-wing.jpg")
    require("src/js/app/config-and-assets.js", "s2-study-lounge.jpg")
    require("src/js/app/scenario-runtime.js", "pcGetScenarioBackgroundAsset(index)")
    require("index.html", "Great Falls College Montana State University")
    index_html = (ROOT / "index.html").read_text(encoding="utf-8")
    patch = current_patch(index_html)
    require("index.html", f"runtime/css/promptcraft.css?v=429&patch={patch}")
    require("index.html", f"runtime/js/promptcraft.bundle.js?v=429&amp;patch={patch}&amp;receiver=82")
    require("wall.html", "GFC MSU")
    require("wall.html", "runtime/css/ideas-wall.css?v=443")
    require("src/css/pages/ideas-wall.css", "--forest-950: #071a36")
    require("src/css/pages/ideas-wall.css", "--forest-900: #0b2852")
    require("src/css/ui/gfc-theme.css", "V429 GFC VISUAL QA CORRECTIONS")
    require("src/css/ui/gfc-theme.css", ".name-modal-overlay")
    require("src/css/ui/gfc-theme.css", ".audio-setup-overlay")
    require("src/css/ui/gfc-theme.css", ".pc-s2-babbage-draft")
    require("src/css/responsive/final-overrides.css", "width: calc(100vw - clamp(40px, 4vw, 72px));")
    require("src/js/ui/babbage-terminal.js", "pcSetVNOverlayState({ active: true, modes: ['babbage-terminal-consult'] });")
    require("src/js/ui/completed-analysis-layout.js", "['scroll-padding-bottom', '18px']")
    require("src/js/ui/completed-analysis-layout.js", "Very dense desktop reports are usually only a few pixels taller")
    require("src/css/ui/gfc-theme.css", "V429 GFC VISUAL QA · SHARED RESULT + DEVELOPMENT SHELL")
    require("src/css/ui/gfc-theme.css", ".pc-scenario-shell .pc-shell-primary")
    require("src/css/ui/gfc-theme.css", "s1-result-active.pc-shared-result-active")
    require("src/js/ui/babbage-terminal.js", "babbageTerminalCloseHandoff")
    require("index.html", "assets/images/ui/charles-babbage.png")
    require("index.html", "We\'re inspired by a pioneer.")
    require("index.html", "Not an oracle")
    require("index.html", "Human judgment required")
    require("src/css/ui/brand-menu.css", ".pc-babbage-portrait-card")
    require("src/css/ui/brand-menu.css", ".pc-babbage-note--judgment")
    print("Great Falls College theme contract passed.")

if __name__ == "__main__":
    main()
