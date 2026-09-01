from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main():
    shared = (ROOT / "src/js/scenarios/shared-components.js").read_text(encoding="utf-8")
    proxy = (ROOT / "netlify/functions/babbage.js").read_text(encoding="utf-8")
    bundle = (ROOT / "runtime/js/promptcraft.bundle.js").read_text(encoding="utf-8")
    index = (ROOT / "index.html").read_text(encoding="utf-8")

    checks = {
        "evidence quality indicators are copied to tracking": "data.oscqrLit = analysis.criteria" in shared,
        "transfer task calls live Babbage": "analysis_type: 's1_transfer_plan_analysis'" in shared,
        "all instructor fields are labeled in the saved prompt": all(label in shared for label in (
            "Instructor week/module:", "Destination:", "START HERE:", "LEARN:", "PRACTICE:", "SUBMIT:", "CONTINUE:"
        )),
        "raw instructor answers are retained": "instructor_answers: { ...instructorAnswers }" in shared,
        "transfer quality indicators are saved": "scenario.oscqrLit" in shared,
        "improvement baseline is retained": "data.scoreDelta = data.currentScore - Number(data.initialScore || 0)" in shared,
        "final plan contributes to improvement": "scenario.scoreDelta = scenario.currentScore - Number(scenario.initialScore || 0)" in shared,
        "transfer completion writes a row": "s1_instructor_plan_analysis_complete" in shared,
        "dedicated proxy contract exists": "promptcraft_s1_transfer_plan_analysis_v1" in proxy,
        "runtime synchronized": "s1_instructor_plan_analysis_complete" in bundle,
        "deployment marker advanced": "patch=524" in index and "DEV · 524" in index,
    }
    failures = [name for name, passed in checks.items() if not passed]
    if failures:
        raise SystemExit("S1 quality and transfer tracking 514 failed: " + ", ".join(failures))
    print("PromptCraft S1 quality and transfer tracking 514 contract passed.")


if __name__ == "__main__":
    main()
