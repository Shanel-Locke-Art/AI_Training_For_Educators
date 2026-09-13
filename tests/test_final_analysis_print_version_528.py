#!/usr/bin/env python3
"""Current contract for final-analysis readability, printing, and labels."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    index = read("index.html")
    config = read("src/js/app/config-and-assets.js")
    terminal = read("src/js/ui/babbage-terminal.js")
    scenario = read("src/js/scenarios/s1-canvas-evidence.js")
    css = read("src/css/scenarios/shared.css")
    bundle = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")

    assert 'runtime/css/promptcraft.css?v=429&patch=538' in index
    assert 'promptcraft.bundle.js?v=429&amp;patch=538&amp;receiver=84' in index
    assert 'Version 429 · Patch 538' in index
    assert 'DEV · 538' in index

    assert "const PC_BROWSER_PATCH" in config
    assert "searchParams.get('patch')" in config
    assert "`Version ${PC_APP_VERSION}${patchText}`" in config
    assert "const PC_APP_SCHEMA_VERSION = 'V121'" in config

    assert 'id="pcS1WeekPlanAnalysis"' not in scenario
    assert 'data-pc-action="print-babbage-report"' in scenario
    assert 'pc-s1-reflection-print' in scenario
    assert "document.getElementById('pcS1WeekPlanAnalysis')" in terminal
    assert "reportTitle = textOf('.pc-s1-reflection-analysis-header h2')" in terminal
    assert "inputTitle = 'Module path submitted'" in terminal
    assert "submittedPath?.innerText" in terminal
    assert "criterionItems('.pc-s1-reflection-feedback li.is-met')" in terminal
    assert "criterionItems('.pc-s1-reflection-feedback li.is-missing')" in terminal

    heading_rule = css[css.index(
        ".pc-s1-reflection-analysis--terminal .pc-s1-reflection-focus h3 {"
    ):]
    heading_rule = heading_rule[:heading_rule.index("}")]
    assert "max-width:none !important" in heading_rule
    assert "clamp(1.25rem,2.25vw,1.8rem)" in heading_rule
    assert "34ch" not in heading_rule

    assert terminal.rstrip() in bundle
    assert config.rstrip() in bundle
    assert css.rstrip() in runtime_css
    print("Patch 529 final-analysis print, heading, and version-label contract passed.")


if __name__ == "__main__":
    main()
