from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main():
    shared = (ROOT / "src/js/scenarios/shared-components.js").read_text(encoding="utf-8")
    proxy = (ROOT / "netlify/functions/babbage.js").read_text(encoding="utf-8")
    bundle = (ROOT / "runtime/js/promptcraft.bundle.js").read_text(encoding="utf-8")
    index = (ROOT / "index.html").read_text(encoding="utf-8")

    checks = {
        "active S1 flow calls live evidence analysis": "analysis_type: 's1_evidence_analysis'" in shared,
        "active S1 flow records the attempt": "pcRecordS1EvidenceAnalysis" in shared,
        "active S1 flow writes a checkpoint": "'s1_evidence_analysis_complete'" in shared,
        "loading remains until the async response": "async function pcShowS1ReflectionAnalysis()" in shared,
        "proxy has a dedicated evidence contract": "promptcraft_s1_evidence_analysis_v1" in proxy,
        "proxy version advanced": "PROMPTCRAFT_BABBAGE_PROXY_VERSION = 'V372'" in proxy,
        "runtime bundle synchronized": "s1_evidence_analysis_complete" in bundle,
        "deployment marker advanced": "patch=512" in index and "DEV · 512" in index,
    }
    failures = [name for name, passed in checks.items() if not passed]
    if failures:
        raise SystemExit("S1 live evidence tracking 512 failed: " + ", ".join(failures))
    print("PromptCraft S1 live evidence tracking 512 contract passed.")


if __name__ == "__main__":
    main()
