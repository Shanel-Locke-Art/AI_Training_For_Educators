#!/usr/bin/env python3
"""Audit PromptCraft CSS ownership files for structural drift and stale selectors."""

from __future__ import annotations

import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STYLE_MANIFEST = ROOT / "style.css"
RETIRED_CLASSES = {
    "analysis-label-icon",
    "consult-claude-btn",
    "feedback-panel",
    "fp-body",
    "fp-header",
    "fp-success",
    "fp-tips",
    "header-right",
    "pc-choice-card--detail",
    "pc-clean-continue",
    "pc-terminal-gap",
    "s1-post-analysis-reflection",
    "s1-result-badge",
    "s1-result-heading",
    "s1-result-label",
    "scenario-entry",
    "scenario-keep-link",
    "scenario-nav-btn",
    "scenario-nav-card",
    "scenario-nav-sub",
    "scenario-nav-text",
    "scenario-nav-title",
    "scenario-nav-wrap",
    "score-chip",
    "score-chips",
    "vn-dialogue-box",
    "vn-expression-badge",
    "vn-student-expression-badge",
    "vn-textbox",
}
RETIRED_IDS = {"vnExprBadge", "vnStudentExprBadge", "vnTextBox"}
STANDALONE_CSS = (ROOT / "styles/wall.css",)


def source_paths() -> tuple[Path, ...]:
    manifest = STYLE_MANIFEST.read_text(encoding="utf-8")
    values = re.findall(r'@import\s+url\(["\']([^"\'?]+)', manifest)
    return tuple(ROOT / value for value in values)


def strip_comments(text: str) -> str:
    output: list[str] = []
    index = 0
    quote: str | None = None
    escaped = False
    while index < len(text):
        char = text[index]
        if quote:
            output.append(char)
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            index += 1
            continue
        if char in {'"', "'"}:
            quote = char
            output.append(char)
            index += 1
            continue
        if char == "/" and index + 1 < len(text) and text[index + 1] == "*":
            end = text.find("*/", index + 2)
            if end < 0:
                raise ValueError("Unclosed CSS comment")
            output.append(" ")
            index = end + 2
            continue
        output.append(char)
        index += 1
    return "".join(output)


def find_open_brace(text: str, start: int) -> int:
    quote: str | None = None
    escaped = False
    parens = brackets = 0
    for index in range(start, len(text)):
        char = text[index]
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            continue
        if char in {'"', "'"}:
            quote = char
        elif char == "(":
            parens += 1
        elif char == ")":
            parens -= 1
        elif char == "[":
            brackets += 1
        elif char == "]":
            brackets -= 1
        elif char == "{" and parens == 0 and brackets == 0:
            return index
    return -1


def find_close_brace(text: str, open_index: int) -> int:
    depth = 1
    quote: str | None = None
    escaped = False
    for index in range(open_index + 1, len(text)):
        char = text[index]
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            continue
        if char in {'"', "'"}:
            quote = char
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return index
    return -1


def normalize(value: str) -> str:
    value = re.sub(r"\s+", " ", value.strip())
    value = re.sub(r"\s*,\s*", ",", value)
    value = re.sub(r"\s*:\s*", ":", value)
    value = re.sub(r"\s*;\s*", ";", value)
    return value


def parse_rules(
    text: str,
    *,
    file_name: str,
    context: tuple[str, ...] = (),
) -> list[tuple[tuple[str, ...], str, str, str]]:
    rules: list[tuple[tuple[str, ...], str, str, str]] = []
    cursor = 0
    while cursor < len(text):
        while cursor < len(text) and (text[cursor].isspace() or text[cursor] == ";"):
            cursor += 1
        if cursor >= len(text):
            break
        open_index = find_open_brace(text, cursor)
        if open_index < 0:
            trailing = text[cursor:].strip()
            if trailing:
                raise ValueError(f"Unexpected trailing CSS in {file_name}: {trailing[:80]}")
            break
        close_index = find_close_brace(text, open_index)
        if close_index < 0:
            raise ValueError(f"Unclosed CSS block in {file_name}")
        header = text[cursor:open_index].strip()
        body = text[open_index + 1 : close_index]
        normalized_header = normalize(header)
        if header.startswith("@media") or header.startswith("@keyframes"):
            rules.extend(
                parse_rules(
                    body,
                    file_name=file_name,
                    context=context + (normalized_header,),
                )
            )
        elif header.startswith("@"):
            raise ValueError(f"Unsupported block at-rule in {file_name}: {header}")
        else:
            rules.append((context, normalized_header, normalize(body), header))
        cursor = close_index + 1
    return rules


def main() -> int:
    errors: list[str] = []
    duplicate_locations: dict[tuple[tuple[str, ...], str, str], list[str]] = defaultdict(list)
    rule_count = 0

    for path in source_paths():
        if not path.is_file():
            errors.append(f"Missing CSS source: {path.relative_to(ROOT)}")
            continue
        try:
            clean = strip_comments(path.read_text(encoding="utf-8"))
            rules = parse_rules(clean, file_name=path.name)
        except ValueError as error:
            errors.append(str(error))
            continue

        rule_count += len(rules)
        for context, selector, declarations, raw_selector in rules:
            duplicate_locations[(context, selector, declarations)].append(path.name)
            for name in RETIRED_CLASSES:
                if re.search(rf"(?<![\w-])\.{re.escape(name)}(?![\w-])", raw_selector):
                    errors.append(f"Retired selector .{name} remains in {path.name}.")
            for name in RETIRED_IDS:
                if re.search(rf"(?<![\w-])#{re.escape(name)}(?![\w-])", raw_selector):
                    errors.append(f"Retired selector #{name} remains in {path.name}.")

    for (_, selector, _), locations in duplicate_locations.items():
        if len(locations) > 1:
            errors.append(
                f"Exact duplicate CSS rule for {selector} remains in: " + ", ".join(locations)
            )

    standalone_rule_count = 0
    for path in STANDALONE_CSS:
        if not path.is_file():
            errors.append(f"Missing standalone stylesheet: {path.relative_to(ROOT)}")
            continue
        try:
            clean = strip_comments(path.read_text(encoding="utf-8"))
            standalone_rule_count += len(parse_rules(clean, file_name=path.name))
        except ValueError as error:
            errors.append(str(error))

    if errors:
        for error in dict.fromkeys(errors):
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    print(
        f"PromptCraft CSS audit passed: {rule_count} active application rules across "
        f"{len(source_paths())} owner files and {standalone_rule_count} Ideas Wall rules."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
