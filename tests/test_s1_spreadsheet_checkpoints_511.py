from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def test_s1_records_meaningful_spreadsheet_checkpoints():
    source = (ROOT / "src/js/scenarios/s1-course-design.js").read_text(encoding="utf-8")
    tracking = (ROOT / "src/js/research/tracking.js").read_text(encoding="utf-8")

    for event_type in (
        "s1_pathway_complete",
        "s1_babbage_analysis_complete",
        "s1_babbage_fallback_complete",
        "s1_babbage_audit_complete",
    ):
        assert event_type in source

    assert "async function saveIncrementalData(scenarioIdx, eventType = 'scenario_complete')" in tracking
    assert "event_type: eventType" in tracking


def test_deployed_bundle_contains_s1_checkpoint_saves():
    bundle = (ROOT / "runtime/js/promptcraft.bundle.js").read_text(encoding="utf-8")
    index = (ROOT / "index.html").read_text(encoding="utf-8")

    assert "s1_pathway_complete" in bundle
    assert "s1_babbage_analysis_complete" in bundle
    assert "s1_babbage_audit_complete" in bundle
    assert "patch=511" in index


if __name__ == "__main__":
    test_s1_records_meaningful_spreadsheet_checkpoints()
    test_deployed_bundle_contains_s1_checkpoint_saves()
    print("PromptCraft S1 spreadsheet checkpoint 511 contract passed.")
