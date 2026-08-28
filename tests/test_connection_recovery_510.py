from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(relative):
    return (ROOT / relative).read_text(encoding="utf-8")


def main():
    config = read("src/js/app/config-and-assets.js")
    client = read("src/js/ai/babbage-client.js")
    bundle = read("runtime/js/promptcraft.bundle.js")
    index = read("index.html")

    checks = {
        "canonical Babbage deployment configured":
            "const PC_CANONICAL_DEPLOYMENT_ORIGIN = 'https://promptcraft-test.netlify.app';" in config,
        "Babbage client uses configured endpoint":
            "fetch(PC_BABBAGE_ENDPOINT" in client,
        "Sheets no longer hides receiver response":
            "mode: 'no-cors'" not in config,
        "Sheets requires receiver confirmation":
            "result.status !== 'ok'" in config,
        "visible browser write test":
            "event_type: 'browser_connection_test_complete'" in config,
        "read-only combined connection test":
            "window.testPromptCraftConnections" in config,
        "runtime bundle synchronized":
            "fetch(PC_BABBAGE_ENDPOINT" in bundle
            and "mode: 'no-cors'" not in bundle
            and "window.testPromptCraftConnections" in bundle,
        "browser cache marker advanced":
            "connections=510" in index,
        "receiver marker synchronized":
            "receiver=85" in index,
    }

    failures = [name for name, passed in checks.items() if not passed]
    if failures:
        raise SystemExit("Connection recovery 510 failed: " + ", ".join(failures))
    print("PromptCraft connection recovery 510 contract passed.")


if __name__ == "__main__":
    main()
