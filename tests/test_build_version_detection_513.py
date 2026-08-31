from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main():
    config = (ROOT / "src/js/app/config-and-assets.js").read_text(encoding="utf-8")
    bundle = (ROOT / "runtime/js/promptcraft.bundle.js").read_text(encoding="utf-8")
    index = (ROOT / "index.html").read_text(encoding="utf-8")

    checks = {
        "current bundle URL is preferred": "document.currentScript?.src" in config,
        "PromptCraft bundle filename is recognized": "runtime\\/js\\/promptcraft\\.bundle" in config,
        "V429 remains the public build": "promptcraft.bundle.js?v=429" in index,
        "deployment marker advanced": "patch=522" in index and "DEV · 522" in index,
        "runtime synchronized": "document.currentScript?.src" in bundle,
    }
    failures = [name for name, passed in checks.items() if not passed]
    if failures:
        raise SystemExit("Build version detection 513 failed: " + ", ".join(failures))
    print("PromptCraft build version detection 513 contract passed.")


if __name__ == "__main__":
    main()
