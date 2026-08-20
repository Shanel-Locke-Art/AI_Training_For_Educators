#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]


def read(rel):
    return (ROOT / rel).read_text(encoding='utf-8')


def main():
    s3 = read('src/js/scenarios/s3-authentic-assessment.js')
    shared = read('src/js/scenarios/shared-components.js')
    registry = read('src/js/scenarios/registry.js')
    vn = read('src/js/ui/visual-novel.js')
    tracking = read('src/js/research/tracking.js')
    bundle = read('runtime/js/promptcraft.bundle.js')
    css = read('src/css/scenarios/shared.css')
    index = read('index.html')
    babbage = read('netlify/functions/babbage.js')
    manifest = json.loads(read('assets/asset-manifest.json'))

    assert "implemented: true, developmentStatus: 'Playable'" in registry
    assert "rendererKey: 'assessment-opening'" in registry
    assert "afterIntroAction: 's3-diagnosis'" in registry
    assert "{ id: 'pixel', slot: 'right' }, { id: 'maya', slot: 'left' }" in registry

    for step in ('Diagnose', 'Blueprint', 'Predict', 'Test evidence', 'Audit Babbage', 'Revise'):
        assert step in s3
    for dimension in ('Performance', 'Context', 'Observable evidence', 'Reasoning', 'Criteria'):
        assert dimension in s3
    assert "awardScenarioScoreXP(SCENARIO_INDEX.ASSESSMENT, score.total, 5)" in s3
    assert "markScenarioComplete();" in s3
    assert "analysis_type: 's3_evidence_analysis'" in s3
    assert "Treat the claim as an analysis to audit, not a verdict." in s3
    assert 'adapt when one operating condition changes' in s3

    assert 'function buildEvidenceWorkbenchHTML' in shared
    assert 'function wireEvidenceWorkbench' in shared
    assert '.pc-evidence-workbench' in css
    assert '.pc-s3-' not in css, 'S3 should use shared presentation rules rather than a scenario-specific CSS system.'

    assert "pcRegisterVNCharacter('maya'" in vn
    for name in ('neutral.png', 'thinking.png', 'uncertain.png', 'frustrated.png', 'confident.png'):
        rel = f'assets/images/characters/students/maya/{name}'
        assert (ROOT / rel).is_file(), f'Missing Maya production portrait: {rel}'
        assert rel in manifest['runtime_images'].values(), f'Maya asset is not classified as runtime: {rel}'

    for field in ('diagnosisAttempts', 'blueprintAttempts', 'predictionAttempts', 'evidenceAttempts', 'auditAttempts', 'repairAttempts'):
        assert field in tracking
    for field in ('s3_diagnosis_json', 's3_evidence_json', 's3_audit_json', 's3_repair_text', 's3_evidence_statement'):
        assert field in tracking
    for field in ('blueprintAttempts', 'predictionAttempts', 'evidenceAttempts', 'evidenceFinal', 'initialScore', 'revisedScore', 'scoreDelta'):
        assert field in tracking, f'S3 research payload is missing {field}'

    assert "'s3_evidence_analysis'" in babbage
    assert "promptcraft_s3_evidence_analysis_v1" in babbage
    assert "PROMPTCRAFT_BABBAGE_PROXY_VERSION = 'V370'" in babbage

    assert '/* SOURCE: src/js/scenarios/s3-authentic-assessment.js */' in bundle
    assert "analysis_type: 's3_evidence_analysis'" in bundle
    assert 'runtime/css/promptcraft.css?v=429&patch=447' in index
    assert 'runtime/js/promptcraft.bundle.js?v=429&amp;patch=447&amp;receiver=82' in index
    assert 'runtime/js/dialogue-data.js?v=142' in index

    print('Scenario 3 Authentic Assessment contract passed.')


if __name__ == '__main__':
    main()
