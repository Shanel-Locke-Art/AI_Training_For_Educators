#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
dialogue = (ROOT / "src/js/content/dialogue-data.js").read_text(encoding="utf-8")
runtime = (ROOT / "src/js/app/runtime-state.js").read_text(encoding="utf-8")
index = (ROOT / "index.html").read_text(encoding="utf-8")

for stale in (
    "your AI coaching companion",
    "write your prompt in the box below",
    "Your prompting instincts are already getting sharper.",
    "Head into the Reflection Room",
    "Prompt Analysis panel",
    '"vague": [',
    '"decent": [',
    '"strong": [',
):
    assert stale not in dialogue, f"stale dialogue remains: {stale}"

for stale_id in ('"p4": {', '"p5": {', '"p6": {', '"p7": {', '"p8": {', '"p9": {'):
    assert stale_id not in dialogue, f"retired audio label remains: {stale_id}"

assert "I'm Professor Pixel. I'll guide you through each teaching challenge." in dialogue
assert "Babbage can analyze the information you provide, but the final judgment stays with you." in dialogue
assert "I'm Professor Pixel. I'll guide you through each teaching challenge." in runtime

# Read the live cache-buster patch/version numbers instead of hardcoding them,
# since they advance on every release.
dialogue_script_match = re.search(r'dialogue-data\.js\?v=(\d+)&amp;patch=(\d+)', index)
assert dialogue_script_match, "Could not find dialogue-data.js version/patch marker in index.html"
dialogue_version, dialogue_patch = dialogue_script_match.groups()
assert f"patch={dialogue_patch}" in index
assert f"runtime/js/dialogue-data.js?v={dialogue_version}&amp;patch={dialogue_patch}" in index

assert "ASSETS.audio.professorPixel.vague" not in (ROOT / "src/js/audio/audio-engine.js").read_text(encoding="utf-8")
assert "ASSETS.audio.professorPixel.welcome" not in (ROOT / "src/js/audio/audio-engine.js").read_text(encoding="utf-8")
assert "const source = window.pixelDialogue?.[`scoreReflection_${score}`]" in (ROOT / "src/js/scenarios/s1-engagement.js").read_text(encoding="utf-8")
assert "p87:" not in dialogue
assert "p94:" not in dialogue
assert '"scenarioComplete": [' not in dialogue
assert '"allComplete": [' not in dialogue
for dead_id in ('"p10": {', '"p11": {', '"p12": {', '"p13": {', '"p51": {', '"p52": {', '"p53": {', '"p54": {', '"p63": {', '"p64": {', '"p65": {', '"p66": {', '"p67": {'):
    assert dead_id not in dialogue, f"dead recording metadata remains: {dead_id}"

print("Dialogue cleanup checks passed.")
