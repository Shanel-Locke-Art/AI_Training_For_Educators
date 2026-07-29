#!/usr/bin/env python3
"""Build PromptCraft's browser-ready CSS and JavaScript files.

Editable files live in src/. Generated files are written to public/.
Run this script from anywhere inside the project:

    python tools/build-production.py

Requires tinycss2: pip install tinycss2
"""
from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import Path
import re
import shutil
import sys
from typing import Iterable, Sequence

try:
    import tinycss2
except ImportError as exc:
    raise SystemExit("tinycss2 is required: pip install tinycss2") from exc

ROOT = Path(__file__).resolve().parents[1]
CSS_LOADER = ROOT / "src" / "css" / "index.css"
CSS_OUTPUT = ROOT / "public" / "styles" / "promptcraft.bundle.css"
DIALOGUE_SOURCE = ROOT / "src" / "js" / "dialogue.js"
DIALOGUE_OUTPUT = ROOT / "public" / "scripts" / "dialogue.js"
JS_OUTPUT = ROOT / "public" / "scripts" / "app.bundle.js"
JS_SOURCES = (
    ROOT / "src" / "js" / "app-core.js",
    ROOT / "src" / "js" / "scenarios.js",
    ROOT / "src" / "js" / "vn-engine.js",
    ROOT / "src" / "js" / "workbench.js",
)
RULE_CONTAINERS = {"media", "supports", "container", "layer", "scope", "document"}
DECLARATION_CONTAINERS = {"font-face", "page", "property", "counter-style"}


def serialize(tokens: Sequence[object] | None) -> str:
    return tinycss2.serialize(tokens or ()).strip()


def collapse_space(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


@dataclass
class Declaration:
    name: str
    value: str
    important: bool
    node_id: int
    keep: bool = True

    def render(self) -> str:
        return f"{self.name}:{self.value}{'!important' if self.important else ''};"


@dataclass
class QualifiedRule:
    selector: str
    context: tuple[str, ...]
    node_id: int
    declarations: list[Declaration] = field(default_factory=list)
    extras: list[str] = field(default_factory=list)

    def render(self) -> str:
        body = "".join(d.render() for d in self.declarations if d.keep) + "".join(self.extras)
        return f"{self.selector}{{{body}}}" if body else ""


@dataclass
class AtRule:
    keyword: str
    prelude: str
    children: list[object] | None = None
    declarations: list[str] | None = None
    raw_content: str | None = None

    def render(self) -> str:
        head = f"@{self.keyword}" + (f" {self.prelude}" if self.prelude else "")
        if self.children is not None:
            return head + "{" + "".join(child.render() for child in self.children) + "}"
        if self.declarations is not None:
            return head + "{" + "".join(self.declarations) + "}"
        if self.raw_content is not None:
            return head + "{" + self.raw_content + "}"
        return head + ";"


class CssBuilder:
    def __init__(self) -> None:
        self.next_node_id = 1
        self.qualified_rules: list[QualifiedRule] = []

    def parse_rules(self, rules: Iterable[object], context: tuple[str, ...] = ()) -> list[object]:
        parsed: list[object] = []
        for rule in rules:
            if rule.type == "qualified-rule":
                node = QualifiedRule(
                    selector=collapse_space(serialize(rule.prelude)),
                    context=context,
                    node_id=self.next_node_id,
                )
                self.next_node_id += 1
                for item in tinycss2.parse_declaration_list(rule.content, skip_comments=True, skip_whitespace=True):
                    if item.type == "declaration":
                        node.declarations.append(
                            Declaration(item.name, serialize(item.value), bool(item.important), node.node_id)
                        )
                    elif item.type == "at-rule":
                        node.extras.append(tinycss2.serialize([item]).strip())
                self.qualified_rules.append(node)
                parsed.append(node)
                continue

            if rule.type != "at-rule":
                continue

            keyword = rule.lower_at_keyword
            prelude = collapse_space(serialize(rule.prelude))
            if rule.content is None:
                parsed.append(AtRule(keyword=keyword, prelude=prelude))
                continue

            context_key = f"@{keyword} {prelude}".strip()
            if keyword in RULE_CONTAINERS or keyword.endswith("keyframes"):
                inner = tinycss2.parse_rule_list(rule.content, skip_comments=True, skip_whitespace=True)
                parsed.append(AtRule(keyword=keyword, prelude=prelude,
                                     children=self.parse_rules(inner, context + (context_key,))))
                continue

            if keyword in DECLARATION_CONTAINERS:
                declarations: list[str] = []
                for item in tinycss2.parse_declaration_list(rule.content, skip_comments=True, skip_whitespace=True):
                    if item.type == "declaration":
                        declarations.append(
                            f"{item.name}:{serialize(item.value)}{'!important' if item.important else ''};"
                        )
                    elif item.type == "at-rule":
                        declarations.append(tinycss2.serialize([item]).strip())
                parsed.append(AtRule(keyword=keyword, prelude=prelude, declarations=declarations))
                continue

            parsed.append(AtRule(keyword=keyword, prelude=prelude, raw_content=serialize(rule.content)))
        return parsed

    def remove_shadowed_declarations(self) -> int:
        groups: dict[tuple[tuple[str, ...], str, str], list[tuple[QualifiedRule, list[Declaration]]]] = defaultdict(list)
        for rule in self.qualified_rules:
            by_property: dict[str, list[Declaration]] = defaultdict(list)
            for declaration in rule.declarations:
                by_property[declaration.name.lower()].append(declaration)
            for property_name, declarations in by_property.items():
                groups[(rule.context, rule.selector, property_name)].append((rule, declarations))

        removed = 0
        for (context, _selector, _property), nodes in groups.items():
            if len(nodes) < 2 or any("keyframes" in part for part in context):
                continue
            important_nodes = [
                (rule, declarations)
                for rule, declarations in nodes
                if any(declaration.important for declaration in declarations)
            ]
            winner_rule = important_nodes[-1][0] if important_nodes else nodes[-1][0]
            for rule, declarations in nodes:
                if rule.node_id == winner_rule.node_id:
                    continue
                for declaration in declarations:
                    if declaration.keep:
                        declaration.keep = False
                        removed += 1
        return removed


def css_sources() -> list[Path]:
    loader = CSS_LOADER.read_text(encoding="utf-8")
    imports = re.findall(r'@import\s+url\(["\']?([^"\')?]+)', loader)
    if not imports:
        raise RuntimeError("No CSS imports found in src/css/index.css")
    return [CSS_LOADER.parent / imported.split("?", 1)[0] for imported in imports]


def build_css() -> tuple[int, int, int]:
    source_text = "\n".join(path.read_text(encoding="utf-8") for path in css_sources())
    builder = CssBuilder()
    parsed = builder.parse_rules(tinycss2.parse_stylesheet(source_text, skip_comments=True, skip_whitespace=True))
    removed = builder.remove_shadowed_declarations()
    output = "/* PromptCraft production CSS. Generated by tools/build-production.py. */" + "".join(
        node.render() for node in parsed
    )
    CSS_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    CSS_OUTPUT.write_text(output + "\n", encoding="utf-8")
    return len(source_text.encode()), len(output.encode()), removed


def build_js() -> tuple[int, int]:
    parts: list[str] = []
    source_bytes = 0
    for path in JS_SOURCES:
        text = path.read_text(encoding="utf-8")
        source_bytes += len(text.encode())
        parts.append(f"/* SOURCE: {path.relative_to(ROOT)} */\n{text.rstrip()}\n;")
    output = "/* PromptCraft application bundle. Generated by tools/build-production.py. */\n" + "\n".join(parts) + "\n"
    JS_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    JS_OUTPUT.write_text(output, encoding="utf-8")
    shutil.copy2(DIALOGUE_SOURCE, DIALOGUE_OUTPUT)
    return source_bytes, len(output.encode())


def main() -> int:
    css_before, css_after, removed = build_css()
    js_before, js_after = build_js()
    print(f"CSS: {css_before:,} -> {css_after:,} bytes; {removed:,} shadowed declarations removed")
    print(f"JS:  {js_before:,} -> {js_after:,} bytes; four source modules bundled")
    print("Copied dialogue.js to public/scripts/dialogue.js")
    return 0


if __name__ == "__main__":
    sys.exit(main())
