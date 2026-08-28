from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / "src/js/scenarios/shared-components.js").read_text(encoding="utf-8")
CSS = (ROOT / "src/css/scenarios/shared.css").read_text(encoding="utf-8")
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")


def test_full_size_evidence_uses_in_app_modal_not_new_tab():
    assert 'data-pc-action="s1-open-evidence-modal"' in JS
    assert 'data-pc-action="s1-close-evidence-modal"' in JS
    assert 'aria-modal' in JS
    assert "pcHandleS1EvidenceModalKeydown" in JS
    assert 'target="_blank"' not in JS[JS.index('id="pcS1EvidenceFullSize"') - 100:JS.index('id="pcS1EvidenceFullSizeImage"') + 200]


def test_comparison_field_is_editable_and_stably_bound():
    render = JS[JS.index("function pcRenderS1PreviewEvidence") : JS.index("function pcSubmitS1CaseReflection")]
    assert "reflectionText.disabled = false" in render
    assert "reflectionText.readOnly = false" in render
    assert "pcReflectionBound" in render
    assert "addEventListener('input', pcUpdateS1CaseReflectionState)" in render
    assert "textarea.addEventListener('input'" not in render


def test_desktop_grid_override_and_phone_modal_exist():
    assert ".pc-s1-case-handoff.pc-s1-case-reflection" in CSS
    assert "grid-template-columns:minmax(0,1fr) !important" in CSS
    assert ".pc-s1-evidence-modal" in CSS
    assert "height:100dvh" in CSS


def test_patch_marker_is_491():
    assert "DEV · 509" in INDEX
    assert "patch=509" in INDEX
