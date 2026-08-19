#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
css = (ROOT / "src/css/ui/gfc-theme.css").read_text(encoding="utf-8")

assert "border: 2px solid rgba(117,191,225,.88) !important;" in css
assert "html body .pc-scenario-shell .pc-shell-primary {\n  border: 2px solid rgba(117,191,225,.88) !important;" in css
assert "border-color: var(--gfc-gold) !important;" in css
print("GFC action border contract passed.")
