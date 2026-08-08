#!/usr/bin/env python3
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageFilter

import build_master_tile_pack_standard_body_v4 as v4


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "hulebu-master-tile-pack-v5-fused-dots"
DOT_IDS = [f"tile_dot_{index:02d}" for index in range(1, 10)]
DOT_FOCUS_BOX = (48, 56, 226, 286)
CANVAS_SIZE = (272, 384)


def set_v4_output_dir() -> None:
    v4.OUT_DIR = OUT_DIR


def is_dot_symbol_pixel(r: int, g: int, b: int, a: int) -> bool:
    if a < 120:
        return False
    luminance = (r * 299 + g * 587 + b * 114) // 1000
    saturation = max(r, g, b) - min(r, g, b)
    red = r > 115 and g < 145 and b < 135 and r > g * 1.18
    green = g > 55 and r < 175 and b < 165 and g >= r * 0.75
    dark = luminance < 145
    vivid = saturation > 62 and min(r, g, b) < 205
    return red or green or dark or vivid


def make_dot_mask(source: Image.Image) -> Image.Image:
    rgba = source.convert("RGBA")
    pixels = rgba.load()
    mask = Image.new("L", rgba.size, 0)
    mask_pixels = mask.load()

    for y in range(DOT_FOCUS_BOX[1], DOT_FOCUS_BOX[3]):
        for x in range(DOT_FOCUS_BOX[0], DOT_FOCUS_BOX[2]):
            if is_dot_symbol_pixel(*pixels[x, y]):
                mask_pixels[x, y] = 255

    return mask.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(1.2))


def rebuild_dot_tiles() -> None:
    template = Image.open(OUT_DIR / "preview" / "standard-body-template.png").convert("RGBA")
    for item_id in DOT_IDS:
        source = Image.open(OUT_DIR / "raw-crops" / f"{item_id}.png").convert("RGBA")
        source = source.resize(CANVAS_SIZE, Image.Resampling.LANCZOS)
        mask = make_dot_mask(source)
        rebuilt = Image.composite(source, template, mask)
        rebuilt.putalpha(template.getchannel("A"))
        rebuilt.save(OUT_DIR / "base" / f"{item_id}.png")
        mask.save(OUT_DIR / "preview" / f"dot-fusion-mask-{item_id}.png")


def update_metadata() -> None:
    manifest_path = OUT_DIR / "manifest.json"
    crop_report_path = OUT_DIR / "crop-report.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    crop_report = json.loads(crop_report_path.read_text(encoding="utf-8"))

    manifest["version"] = "hulebu-master-tile-pack-v5-fused-dots"
    manifest["basis"] = (
        "Wan and honor tiles keep the approved v3 base; bamboo stays on the v4 shared body; dot symbols "
        "use a stricter color mask and feathered fusion to avoid pasted patch edges."
    )

    crop_report["method"] = "standard-body-dot-fused-v5"
    crop_report["generatedAt"] = datetime.now(timezone.utc).isoformat()
    crop_report["outputDir"] = str(OUT_DIR.relative_to(ROOT))
    crop_report["notes"] = [
        "Wan 1-9 and east/south/west/north remain on the approved rounded crop path.",
        "Bamboo remains on the v4 shared standard body because its symbols already read as integrated.",
        "Dot 1-9 are rebuilt from raw crops with a stricter color mask and soft feathering.",
        "The dot rebuild avoids transferring source tile face/background pixels, removing the pasted-on patch look.",
        "State overlays are generated separately and are not baked into base tile art.",
    ]

    for slot in crop_report.get("slots", []):
        if slot.get("id") in DOT_IDS:
            slot["exportMode"] = "standard-body-dot-fused"
            slot["bodySource"] = "tile_wan_01"

    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    crop_report_path.write_text(json.dumps(crop_report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def regenerate_contact_sheet() -> None:
    v4.v3.make_contact_sheet(
        [
            {"id": item_id, "file": f"base/{item_id}.png", "canvas": {"width": 272, "height": 384}}
            for item_id in v4.v3.BASE_ITEM_ORDER
        ]
    )


def main() -> int:
    set_v4_output_dir()
    v4.main()
    rebuild_dot_tiles()
    update_metadata()
    regenerate_contact_sheet()
    print(f"built {OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
