#!/usr/bin/env python3
"""V503 contract: full-size evidence selects a complete, scrollable capture."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/s1-canvas-evidence.js")
    css = read("src/css/scenarios/shared.css")
    runtime = read("runtime/js/promptcraft.bundle.js")
    runtime_css = read("runtime/css/promptcraft.css")
    index = read("index.html")

    for token in (
        "function pcRefreshS1EvidenceModalLayout(metrics = pcGetViewportMetrics())",
        "width <= 560",
        "evidence.mobileSrc",
        ": evidence.src;",
        "pc-s1-evidence-modal--${mode}-capture",
        "image.dataset.pcModalSource",
        "modal._pcS1Evidence = evidence",
        "pcSubscribeViewport('s1-evidence-modal'",
        "pcRefreshS1EvidenceModalLayout();",
    ):
        assert token in shared
        assert token in runtime

    for token in (
        ".pc-s1-evidence-modal--phone-capture .pc-s1-evidence-modal-scroll img",
        ".pc-s1-evidence-modal--compact-capture .pc-s1-evidence-modal-scroll img",
        ".pc-s1-evidence-modal--desktop-capture .pc-s1-evidence-modal-scroll img",
        "grid-template-columns:minmax(0,1fr) 40px",
        "touch-action:pan-x pan-y pinch-zoom",
        "scrollbar-gutter:stable both-edges",
        "max-height:none !important",
        "object-fit:contain",
        ".pc-s1-evidence-modal-shell > footer p { display:none; }",
    ):
        assert token in css
        assert token in runtime_css

    assert "data-pc-action=\"s1-close-evidence-modal\"" in shared
    assert "pcHandleS1EvidenceModalKeydown" in shared
    assert "patch=527" in index
    assert "DEV · 527" in index
    print("V503 responsive full-size Canvas-evidence modal contract passed.")


if __name__ == "__main__":
    main()
