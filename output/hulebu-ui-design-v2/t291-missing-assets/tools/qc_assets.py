from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
REPORT = ROOT / "qc-report.json"

def inspect(path: Path) -> dict:
    image = Image.open(path).convert("RGBA")
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    return {
        "path": str(path.relative_to(ROOT)),
        "size": list(image.size),
        "mode": "RGBA",
        "hasAlpha": alpha.getextrema() != (255, 255),
        "alphaExtrema": list(alpha.getextrema()),
        "contentBounds": list(bbox) if bbox else None,
        "nonEmpty": bbox is not None,
    }

def main() -> None:
    normalized = sorted((ROOT / "normalized").glob("*.png"))
    states = sorted((ROOT / "normalized" / "states").glob("*.png"))
    records = [inspect(path) for path in normalized + states]
    failures = [r for r in records if not r["hasAlpha"] or not r["nonEmpty"]]
    payload = {"task": "T291", "normalizedCount": len(normalized), "stateCount": len(states), "assets": records, "failures": failures}
    REPORT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"normalized={len(normalized)} states={len(states)} failures={len(failures)}")
    if failures:
        raise SystemExit(1)

if __name__ == "__main__":
    main()
