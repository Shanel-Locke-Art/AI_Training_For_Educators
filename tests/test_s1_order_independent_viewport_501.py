#!/usr/bin/env python3
"""V501 contract: S1 Canvas viewport state is reset before every fit."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def main() -> None:
    shared = read("src/js/scenarios/s1-canvas-evidence.js")
    vn = read("src/js/ui/visual-novel.js")
    runtime = read("runtime/js/promptcraft.bundle.js")
    dev = read("src/js/dev/development-tools.js")
    index = read("index.html")

    for token in (
        "function pcRestoreS1ResponsiveCapture(panel, evidence)",
        "picture.classList.remove(",
        "picture.querySelectorAll('source').forEach(source => source.remove())",
        "picture.insertBefore(source, image)",
        "addSource('(max-width: 480px)', evidence.mobileSrc)",
        "panel._pcS1Evidence = evidence",
        "function pcRefreshS1CanvasEvidenceLayout({",
        "window.pcRefreshS1CanvasEvidenceLayout = pcRefreshS1CanvasEvidenceLayout",
        "captureImage?.addEventListener('load', updatePhoneCastRoom)",
    ):
        assert token in shared
        assert token in runtime

    apply_start = shared.index("function pcApplyS1DocumentedCaptureFit")
    apply = shared[apply_start:shared.index("function pcRefreshS1CanvasEvidenceLayout", apply_start)]
    assert apply.index("pcRestoreS1ResponsiveCapture(panel, evidence)") < apply.index("const width = metrics.emulatedWidth")

    for token in (
        "window.pcRefreshS1CanvasEvidenceLayout({ metrics, deferCastUpdate: false })",
        "slot.container.style.removeProperty('display')",
        "pcSubscribeViewport('s1-cast-room'",
    ):
        assert token in vn
        assert token in runtime

    assert "activeS1Case ? pcFillS1DevFields() : resetS1Dev()" in dev
    assert "patch=527" in index
    assert "DEV · 527" in index
    print("V501 order-independent Canvas viewport contract passed.")


if __name__ == "__main__":
    main()
