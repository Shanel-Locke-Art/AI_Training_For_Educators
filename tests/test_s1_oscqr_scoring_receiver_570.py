from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
s1 = (ROOT / "src/js/scenarios/s1-start-with-learning.js").read_text(encoding="utf-8")
tracking = (ROOT / "src/js/research/tracking.js").read_text(encoding="utf-8")
receiver = (ROOT / "apps-script/PromptCraft_Receiver_V85_Start_With_Learning.js").read_text(encoding="utf-8")
index = (ROOT / "index.html").read_text(encoding="utf-8")

for number in (2, 9, 16, 19, 21, 45, 46):
    assert f"number: {number}" in s1

assert "pcRenderS1OSCQRStandards()" in s1
assert "pcRecordS1LearningProgress('s1_learning_path_organized'" in s1
assert "pcRecordS1LearningProgress('s1_alignment_diagnosis_complete'" in s1
assert "pcRecordS1LearningProgress('s1_course_guide_complete'" in s1
assert "awardS1PracticeXP(3, 3)" in s1
assert "awardS1TransferXP(transferScore)" in s1

for key in ("s1_diagnosis_choice", "s1_learning_path_json", "s1_course_guide_json", "s1_oscqr_standards"):
    assert key in tracking
    assert key in receiver

assert "PROMPTCRAFT_RECEIVER_VERSION = 'V85'" in receiver
assert "S1: Start With the Learning" in receiver
assert "Alignment Diagnosis" in receiver
assert "OSCQR Standards" in receiver
patches = [int(value) for value in re.findall(r"patch=(\d+)", index)]
assert patches and min(patches) >= 570
assert "receiver=85" in index
assert re.search(r"DEV\s*[·�]\s*(?:57\d|5[8-9]\d|[6-9]\d{2,})", index)

print("P570 S1 OSCQR guide, scoring, tracking, and V85 receiver checks passed.")
