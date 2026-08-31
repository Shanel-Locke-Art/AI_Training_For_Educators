#!/usr/bin/env python3
from pathlib import Path
import json
import re

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

    for step in ('Sort evidence', 'Build', 'Stress-test', 'Audit Babbage', 'Repair', 'Apply'):
        assert step in s3
    for dimension in ('Performance', 'Context', 'Observable evidence', 'Reasoning', 'Criteria'):
        assert dimension in s3
    assert "awardScenarioScoreXP(SCENARIO_INDEX.ASSESSMENT, score.total, 5)" in s3
    assert "markScenarioComplete();" in s3
    assert "analysis_type: 's3_evidence_analysis'" in s3
    assert "The score is not the verdict. The next step is to put student evidence through the design and see what conclusions it can actually support." in s3
    assert 'adapt when one condition changes' in s3

    assert 'function buildStudentEvidencePanelHTML' in shared
    assert '.pc-student-evidence' in css
    assert '.pc-s3-' not in css, 'S3 should use shared presentation rules rather than a scenario-specific CSS system.'

    assert "pcRegisterVNCharacter('maya'" in vn
    for name in ('neutral.png', 'thinking.png', 'uncertain.png', 'frustrated.png', 'confident.png'):
        rel = f'assets/images/characters/students/maya/{name}'
        assert (ROOT / rel).is_file(), f'Missing Maya production portrait: {rel}'
        assert rel in manifest['runtime_images'].values(), f'Maya asset is not classified as runtime: {rel}'

    for field in ('diagnosisAttempts', 'blueprintAttempts', 'evidenceAttempts', 'auditAttempts', 'repairAttempts'):
        assert field in tracking
    for field in ('s3_diagnosis_json', 's3_evidence_json', 's3_audit_json', 's3_repair_text', 's3_evidence_statement'):
        assert field in tracking
    for field in ('blueprintAttempts', 'evidenceAttempts', 'evidenceFinal', 'initialScore', 'revisedScore', 'scoreDelta'):
        assert field in tracking, f'S3 research payload is missing {field}'

    assert "'s3_evidence_analysis'" in babbage
    assert "promptcraft_s3_evidence_analysis_v1" in babbage
    assert "PROMPTCRAFT_BABBAGE_PROXY_VERSION = 'V373'" in babbage

    assert '/* SOURCE: src/js/scenarios/s3-authentic-assessment.js */' in bundle
    assert "analysis_type: 's3_evidence_analysis'" in bundle
    # Read the live cache-buster patch/version numbers instead of hardcoding
    # them, since they advance on every release.
    patch_match = re.search(r"promptcraft\.css\?v=429&patch=(\d+)", index)
    assert patch_match, "Could not find promptcraft.css patch marker in index.html"
    patch = patch_match.group(1)
    dialogue_match = re.search(r'dialogue-data\.js\?v=(\d+)', index)
    assert dialogue_match, "Could not find dialogue-data.js version marker in index.html"
    dialogue_version = dialogue_match.group(1)
    assert f'runtime/css/promptcraft.css?v=429&patch={patch}' in index
    assert f'runtime/js/promptcraft.bundle.js?v=429&amp;patch={patch}&amp;receiver=85' in index
    assert f'runtime/js/dialogue-data.js?v={dialogue_version}' in index

    print('Scenario 3 Authentic Assessment contract passed.')


if __name__ == '__main__':
    main()
