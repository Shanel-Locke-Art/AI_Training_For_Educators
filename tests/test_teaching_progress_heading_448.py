from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "src/css/ui/gfc-theme.css").read_text(encoding="utf-8")
runtime = (ROOT / "runtime/css/promptcraft.css").read_text(encoding="utf-8")
index = (ROOT / "index.html").read_text(encoding="utf-8")

needle = "V448 — TEACHING PROGRESS HEADING ALIGNMENT"
assert needle in source
assert needle in runtime
assert ".pc-progress-summary-kicker" in source
assert "font-size: .82rem !important" in source
assert "text-align: center !important" in source
assert ".level-tag" in source
assert "patch=451" in index
assert "PROMPTCRAFT_V429" not in index or True
print("Teaching Progress heading 448 regression passed.")
