from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SHARED_JS = (ROOT / "src/js/scenarios/s1-canvas-evidence.js").read_text(encoding="utf-8")
DEV_JS = (ROOT / "src/js/app/scenario-runtime.js").read_text(encoding="utf-8")
SHARED_CSS = (ROOT / "src/css/scenarios/shared.css").read_text(encoding="utf-8")
RESPONSIVE_CSS = (ROOT / "src/css/responsive/final-overrides.css").read_text(encoding="utf-8")
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")


def test_dev_fill_targets_the_current_s1_comparison():
    fill = DEV_JS[DEV_JS.index("function pcFillS1DevFields"):DEV_JS.index("function pcFillS2DevRepairFields")]
    assert "pcS1CaseReflectionText" in fill
    assert "pcSetS1PreviewState('after')" in fill
    assert "dispatchEvent(new Event('input'" in fill
    assert "g-learners" not in fill


def test_comparison_field_is_always_editable_and_updates_state():
    render = SHARED_JS[SHARED_JS.index("function pcRenderS1PreviewEvidence"):SHARED_JS.index("function pcSubmitS1CaseReflection")]
    assert "reflectionText.disabled = false" in render
    assert "reflectionText.readOnly = false" in render
    assert "addEventListener('input', pcUpdateS1CaseReflectionState)" in render
    assert "pointer-events:auto !important" in SHARED_CSS


def test_full_size_evidence_is_an_in_app_dialog_with_exit_controls():
    assert 'className = \'pc-s1-evidence-modal\'' in SHARED_JS
    assert "aria-modal" in SHARED_JS
    assert "pc-s1-evidence-modal-close" in SHARED_JS
    assert "event.key === 'Escape'" in SHARED_JS
    case_markup = SHARED_JS[SHARED_JS.index('id="pcS1EvidenceFullSize"'):SHARED_JS.index('id="pcS1EvidenceFullSizeImage"') + 250]
    assert 'target="_blank"' not in case_markup


def test_case_response_is_single_surface_not_three_column_handoff():
    marker = SHARED_CSS.index("/* V491 — compact, readable case response. */")
    rules = SHARED_CSS[marker:]
    assert "display:block !important" in rules
    assert "grid-template-columns:minmax(0,1fr) minmax(240px,360px)" in rules
    assert "min-height:150px" in rules


def test_module_capture_has_no_device_specific_transform_matrix():
    assert "V491 — one predictable crop" in RESPONSIVE_CSS
    assert "transform: none !important" in RESPONSIVE_CSS
    assert "translateY(-50px) scale(1.75)" not in RESPONSIVE_CSS
    assert "patch=527" in INDEX
    assert "DEV · 527" in INDEX
