#!/usr/bin/env python3
"""V509 contract: responsive evidence and the transfer task remain usable."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/shared-components.js")
    css = read("src/css/scenarios/shared.css")
    dev = read("src/js/dev/development-tools.js")
    actions = read("src/js/scenarios/s1-engagement.js")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for token in (
        "evidence.mobileSrc || evidence.compactSrc || evidence.smartboardSrc || evidence.src",
        ": evidence.src;",
        "const usePhoneLayout = width <= 560",
        '<textarea name="week" rows="2" maxlength="120"',
        "function pcFillS1TransferDevTask()",
        "DEV example added. Review or edit it, then analyze the path.",
    ):
        assert token in shared
        assert token in runtime

    for token in (
        "width:100%",
        "max-width:100%",
        "min-width:0",
        "object-fit:contain",
        "overflow-wrap:anywhere !important",
        "white-space:pre-wrap !important",
    ):
        assert token in css
        assert token in runtime_css

    assert "function devFillS1TransferTask()" in dev
    assert "dev-fill-s1-transfer" in actions
    assert index.count('data-pc-action="dev-fill-s1-transfer"') == 2
    assert "S1 Path ✏️" in index
    assert "patch=524" in index
    assert "DEV · 524" in index
    print("V509 responsive evidence and transfer DEV-fill contract passed.")


if __name__ == "__main__":
    main()
