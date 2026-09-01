#!/usr/bin/env python3
"""Run structural and hardening checks against the PromptCraft project."""

from __future__ import annotations

import re
import subprocess
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

from build import JS_SOURCES

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = (ROOT / "index.html", ROOT / "wall.html")
ACTION_ATTRIBUTES = (
    "data-pc-action",
    "data-pc-submit-action",
    "data-pc-change-action",
    "data-pc-key-action",
    "data-pc-toggle-action",
)
OBSOLETE_FILES = (
    ROOT / "netlify/netlify.toml",
)


class HtmlInspector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []
        self.references: list[tuple[str, str]] = []
        self.stylesheets: list[str] = []
        self.scripts: list[str] = []
        self.inline_events: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if data.get("id"):
            self.ids.append(data["id"] or "")
        for attribute in ("src", "href"):
            value = data.get(attribute)
            if value:
                self.references.append((attribute, value))
        if tag == "link" and data.get("rel") == "stylesheet" and data.get("href"):
            self.stylesheets.append(data["href"] or "")
        if tag == "script" and data.get("src"):
            self.scripts.append(data["src"] or "")
        self.inline_events.extend(name for name, _value in attrs if name.lower().startswith("on"))


def local_reference_path(value: str) -> Path | None:
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc or value.startswith(("#", "data:", "mailto:")):
        return None
    clean = parsed.path.lstrip("/")
    if not clean:
        return None
    return ROOT / clean


def run_check(command: list[str], label: str) -> str | None:
    result = subprocess.run(command, capture_output=True, text=True, check=False)
    if result.returncode:
        return f"{label}: " + (result.stderr or result.stdout).strip()
    return None


def main() -> int:
    errors: list[str] = []

    for command, label in (
        ([sys.executable, str(ROOT / "tools/build.py"), "--check"], "Build validation failed"),
        ([sys.executable, str(ROOT / "tools/audit_css.py")], "CSS audit failed"),
        ([sys.executable, str(ROOT / "tools/audit_assets.py")], "Asset audit failed"),
        (["node", str(ROOT / "tests/test_netlify_function.js")], "Babbage proxy test failed"),
    ):
        error = run_check(command, label)
        if error:
            errors.append(error)

    html_text: dict[str, str] = {}
    inspectors: dict[str, HtmlInspector] = {}
    for path in HTML_FILES:
        text = path.read_text(encoding="utf-8")
        inspector = HtmlInspector()
        inspector.feed(text)
        html_text[path.name] = text
        inspectors[path.name] = inspector

        duplicate_ids = sorted(
            identifier for identifier, count in Counter(inspector.ids).items() if count > 1
        )
        if duplicate_ids:
            errors.append(f"Duplicate {path.name} IDs: " + ", ".join(duplicate_ids))
        if inspector.inline_events:
            errors.append(
                f"Inline event handlers remain in {path.name}: "
                + ", ".join(sorted(set(inspector.inline_events)))
            )

        for attribute, value in inspector.references:
            if value.startswith("/"):
                errors.append(f"Project-root-relative {attribute} in {path.name}: {value}")
            local_path = local_reference_path(value)
            if local_path is not None and not local_path.exists():
                errors.append(f"Missing local {attribute} target in {path.name}: {value}")

    index_inspector = inspectors["index.html"]
    index_text = html_text["index.html"]
    local_index_styles = [
        value for value in index_inspector.stylesheets if local_reference_path(value) is not None
    ]
    if len(local_index_styles) != 1 or not re.fullmatch(
        r"runtime/css/promptcraft\.css\?v=\d+(?:&patch=\d+)?", local_index_styles[0] if local_index_styles else ""
    ):
        errors.append(
            "index.html must load exactly one local stylesheet: runtime/css/promptcraft.css?v=<build>[&patch=<cache>]."
        )

    wall_inspector = inspectors["wall.html"]
    local_wall_styles = [
        value for value in wall_inspector.stylesheets if local_reference_path(value) is not None
    ]
    if len(local_wall_styles) != 1 or not re.fullmatch(
        r"runtime/css/ideas-wall\.css\?v=\d+", local_wall_styles[0] if local_wall_styles else ""
    ):
        errors.append("wall.html must load runtime/css/ideas-wall.css with a numeric version.")
    if not any(re.fullmatch(r"runtime/js/ideas-wall\.js\?v=\d+", script) for script in wall_inspector.scripts):
        errors.append("wall.html must load runtime/js/ideas-wall.js with a numeric version.")

    script_match = re.search(r"runtime/js/promptcraft\.bundle\.js\?v=(\d+)", index_text)
    style_match = re.search(r"runtime/css/promptcraft\.css\?v=(\d+)", index_text)
    if not script_match:
        errors.append("index.html must load runtime/js/promptcraft.bundle.js with a numeric version.")
    if not style_match:
        errors.append("index.html must load runtime/css/promptcraft.css with a numeric version.")
    if script_match and style_match and script_match.group(1) != style_match.group(1):
        errors.append("The application and stylesheet cache versions must match.")

    source_paths = [ROOT / path for path in JS_SOURCES]
    source_text = "\n".join(path.read_text(encoding="utf-8") for path in source_paths)
    action_markup_text = index_text + "\n" + source_text

    used_actions: set[str] = set()
    for attribute in ACTION_ATTRIBUTES:
        for value in re.findall(rf'{re.escape(attribute)}=["\']([^"\']+)', action_markup_text):
            if value.startswith("${"):
                # Dynamically interpolated action (e.g. data-pc-action="${esc(submitAction)}").
                # The literal action name lives wherever the caller supplies the
                # submitAction/backAction argument, not in this markup string, so
                # it's resolved separately below instead of being treated as a
                # literal action name.
                continue
            used_actions.add(value)
    used_actions.update(
        re.findall(
            # Only submitAction/backAction feed data-pc-action attributes (see
            # buildTransferLabInputHTML / buildTransferRevisionWorkbenchHTML in
            # shared-components.js). afterIntroAction is a different dispatch
            # path (pcRunScenarioAfterIntroAction) and is not part of the
            # pcRegisterUIActions registry, so it's intentionally excluded here.
            r'''\b(?:submitAction|backAction)\s*:\s*['"]([a-z0-9-]+)['"]''',
            action_markup_text,
        )
    )

    registered_actions: set[str] = set()
    for source in source_paths:
        text = source.read_text(encoding="utf-8")
        for match in re.finditer(
            r"pcRegisterUIActions\(\{\s*(.*?)^\}\);",
            text,
            flags=re.DOTALL | re.MULTILINE,
        ):
            registered_actions.update(
                re.findall(
                    r'''^\s*["']([a-z0-9-]+)["']\s*:''',
                    match.group(1),
                    flags=re.MULTILINE,
                )
            )

    missing_actions = sorted(used_actions - registered_actions)
    unused_actions = sorted(registered_actions - used_actions)
    if missing_actions:
        errors.append("Unregistered UI actions: " + ", ".join(missing_actions))
    if unused_actions:
        errors.append("Registered UI actions with no matching control: " + ", ".join(unused_actions))

    app_source = (ROOT / "src/js/app/config-and-assets.js").read_text(encoding="utf-8")
    workbench_source = "\n".join((ROOT / path).read_text(encoding="utf-8") for path in JS_SOURCES)
    if "const PC_BABBAGE_PROCESSING_HOLD_DEFAULT_MS = 350;" not in workbench_source:
        errors.append("The Babbage post-response transition is not set to the approved short runtime.")
    if "const PC_SHEETS_DEBUG = PC_RUNTIME_DEBUG;" not in app_source:
        errors.append("Research payload debugging must remain opt-in.")
    if "console.log('[PromptCraft] Submitting full session payload:'" in workbench_source:
        errors.append("Reflection payloads must not be logged by default.")
    if "innerHTML = narrative.replace" in workbench_source:
        errors.append("AI growth narratives must be escaped before rendering.")

    # Architecture guards: retired S4-S5 browser prototypes and provider-specific
    # UI terminology must not creep back into the shared runtime. S3 is now an intentional
    # shared-architecture implementation rather than a dormant prototype. The two legacy
    # `claude_response` keys are an intentional V121 research-schema compatibility contract.
    legacy_provider_lines = [
        line.strip()
        for line in workbench_source.splitlines()
        if "claude" in line.lower()
    ]
    allowed_legacy_provider_lines = {
        "claude_response: s.finalResponse || '',",
        "claude_response: 'If this row appears, the deployed site can write to Sheets.',",
    }
    if set(legacy_provider_lines) != allowed_legacy_provider_lines or len(legacy_provider_lines) != 2:
        errors.append(
            "Legacy Claude terminology is only allowed for the two V121 claude_response payload keys."
        )

    css_source_text = "\n".join(
        path.read_text(encoding="utf-8") for path in (ROOT / "src/css").rglob("*.css")
    )
    if re.search(r"claude", index_text + "\n" + css_source_text, flags=re.IGNORECASE):
        errors.append("Provider-specific Claude terminology remains in browser markup or CSS.")

    if re.search(r"\b(?:render|open|start)S[45]", workbench_source):
        errors.append("Dormant S4-S5 browser prototype implementation code has returned.")
    if re.search(r"(?<![\w-])\.pc-s[45]-", css_source_text):
        errors.append("Dormant S4-S5 browser prototype selectors have returned.")
    if "netlify/functions/claude.js" in workbench_source or (ROOT / "netlify/functions/claude.js").exists():
        errors.append("The retired Claude Netlify endpoint must not be restored.")
    if re.search(r"pc-live-analysis-\$\{mode\}-v\d+", workbench_source):
        errors.append("Live-analysis state classes must use semantic names, not patch-version suffixes.")

    for path in OBSOLETE_FILES:
        if path.exists():
            errors.append(f"Obsolete development file remains: {path.relative_to(ROOT)}")

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    print("PromptCraft structural and hardening validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
