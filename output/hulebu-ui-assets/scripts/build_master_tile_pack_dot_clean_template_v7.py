#!/usr/bin/env python3
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import build_master_tile_pack_dot_clean_v6 as v6


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "hulebu-master-tile-pack-v7-clean-template-dots"


def update_metadata() -> None:
    manifest_path = OUT_DIR / "manifest.json"
    crop_report_path = OUT_DIR / "crop-report.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    crop_report = json.loads(crop_report_path.read_text(encoding="utf-8"))

    manifest["version"] = "hulebu-master-tile-pack-v7-clean-template-dots"
    manifest["basis"] = (
        "Wan and honor tiles keep the approved v3 base; bamboo stays on the v4 shared body; dot symbols "
        "use strict color masking, feathered fusion, bottom-fragment cleanup, and a fully cleaned standard body."
    )

    crop_report["method"] = "standard-body-dot-clean-template-v7"
    crop_report["generatedAt"] = datetime.now(timezone.utc).isoformat()
    crop_report["outputDir"] = str(OUT_DIR.relative_to(ROOT))
    crop_report["notes"] = [
        "Wan 1-9 and east/south/west/north remain on the approved rounded crop path.",
        "The shared standard body now cleans the full lower part of the original wan glyph before reuse.",
        "Bamboo remains on the v4 shared standard body because its symbols already read as integrated.",
        "Dot 1-9 are rebuilt from raw crops with a stricter color mask, soft feathering, and bottom-fragment cleanup.",
        "The dot rebuild avoids transferring source tile face/background pixels and removes red crop leftovers near the lower edge.",
        "State overlays are generated separately and are not baked into base tile art.",
    ]

    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    crop_report_path.write_text(json.dumps(crop_report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main() -> int:
    v6.OUT_DIR = OUT_DIR
    v6.main()
    update_metadata()
    print(f"built {OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
