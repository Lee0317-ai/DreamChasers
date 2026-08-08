#!/usr/bin/env python3
from __future__ import annotations

import json
import statistics
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageFilter

import build_master_tile_pack_green_base_v3 as v3


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "hulebu-master-tile-pack-v4-standard-body"
STANDARD_BODY_ID = "tile_wan_01"
DOT_IDS = [f"tile_dot_{index:02d}" for index in range(1, 10)]
BAMBOO_IDS = [f"tile_bamboo_{index:02d}" for index in range(1, 10)]
STANDARD_BODY_IDS = {*DOT_IDS, *BAMBOO_IDS}

DOT_FOCUS_BOX = (48, 56, 226, 286)
BAMBOO_FOCUS_BOX = (48, 54, 228, 300)


def set_v3_output_dir() -> None:
    v3.OUT_DIR = OUT_DIR


def safe_median(values: list[int], fallback: int) -> int:
    return int(statistics.median(values)) if values else fallback


def sample_face_fill_color(tile: Image.Image) -> tuple[int, int, int]:
    rgba = tile.convert("RGBA")
    pixels = rgba.load()
    samples: list[tuple[int, int, int]] = []
    for y in range(58, 272):
        for x in range(56, 220):
            if 62 <= x <= 210 and 70 <= y <= 282:
                continue
            r, g, b, a = pixels[x, y]
            if a > 180 and max(r, g, b) > 150:
                samples.append((r, g, b))

    if not samples:
        return (243, 225, 191)

    return (
        safe_median([sample[0] for sample in samples], 243),
        safe_median([sample[1] for sample in samples], 225),
        safe_median([sample[2] for sample in samples], 191),
    )


def build_blank_standard_body(tile: Image.Image) -> Image.Image:
    rgba = tile.convert("RGBA")
    fill_color = sample_face_fill_color(rgba)
    mask = Image.new("L", rgba.size, 0)
    mask_pixels = mask.load()
    pixels = rgba.load()

    for y in range(68, 278):
        for x in range(60, 212):
            r, g, b, a = pixels[x, y]
            if a < 160:
                continue
            luminance = (r * 299 + g * 587 + b * 114) // 1000
            saturation = max(r, g, b) - min(r, g, b)
            if luminance < 205 or saturation > 46 or r < 138 or g < 128 or b < 112:
                mask_pixels[x, y] = 255

    mask = mask.filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(1.0))
    fill = Image.new("RGBA", rgba.size, (*fill_color, 255))
    blank = Image.composite(fill, rgba, mask)
    blank.putalpha(rgba.getchannel("A"))
    return blank


def seed_symbol_mask(source: Image.Image, focus_box: tuple[int, int, int, int]) -> Image.Image:
    rgba = source.convert("RGBA")
    pixels = rgba.load()
    mask = Image.new("L", rgba.size, 0)
    mask_pixels = mask.load()

    for y in range(focus_box[1], focus_box[3]):
        for x in range(focus_box[0], focus_box[2]):
            r, g, b, a = pixels[x, y]
            if a < 120:
                continue
            luminance = (r * 299 + g * 587 + b * 114) // 1000
            saturation = max(r, g, b) - min(r, g, b)
            if luminance < 232 or saturation > 38 or r < 160 or g < 160 or b < 150:
                mask_pixels[x, y] = 255

    return mask


def make_symbol_transfer_tile(source: Image.Image, template: Image.Image, focus_box: tuple[int, int, int, int]) -> Image.Image:
    mask = seed_symbol_mask(source, focus_box)
    mask = mask.filter(ImageFilter.MaxFilter(13)).filter(ImageFilter.GaussianBlur(0.5))
    result = Image.composite(source.convert("RGBA"), template, mask)
    result.putalpha(template.getchannel("A"))
    return result


def update_manifest_and_report(standard_body: Image.Image) -> None:
    manifest_path = OUT_DIR / "manifest.json"
    crop_report_path = OUT_DIR / "crop-report.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    crop_report = json.loads(crop_report_path.read_text(encoding="utf-8"))

    manifest["version"] = "hulebu-master-tile-pack-v4-standard-body"
    manifest["basis"] = (
        "Wan and honor tiles keep the approved v3 base; dot/bamboo symbols are transferred onto a shared "
        "standard body so their green base matches the approved reference."
    )

    crop_report["method"] = "standard-body-symbol-transfer-v4"
    crop_report["outputDir"] = str(OUT_DIR.relative_to(ROOT))
    crop_report["notes"] = [
        "Wan 1-9 and east/south/west/north remain on the approved rounded crop path.",
        "Dot and bamboo are rebuilt on a shared standard body derived from tile_wan_01.",
        "Only the dot/bamboo symbols are transferred; the base alpha and green footing now match the approved body.",
        "State overlays are generated separately and are not baked into base tile art.",
    ]

    for slot in crop_report.get("slots", []):
        if slot.get("id") in STANDARD_BODY_IDS:
            slot["exportMode"] = "standard-body-symbol-transfer"
            slot["bodySource"] = STANDARD_BODY_ID

    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    crop_report_path.write_text(json.dumps(crop_report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def save_standard_body_previews(standard_body: Image.Image, blank_standard_body: Image.Image) -> None:
    (OUT_DIR / "preview" / "standard-body-template.png").parent.mkdir(parents=True, exist_ok=True)
    standard_body.save(OUT_DIR / "preview" / "standard-body-source.png")
    blank_standard_body.save(OUT_DIR / "preview" / "standard-body-blank.png")


def rewrite_standard_body_tiles(blank_standard_body: Image.Image) -> None:
    source_standard_body = Image.open(OUT_DIR / "base" / f"{STANDARD_BODY_ID}.png").convert("RGBA")
    focus_boxes = {
        **{item_id: DOT_FOCUS_BOX for item_id in DOT_IDS},
        **{item_id: BAMBOO_FOCUS_BOX for item_id in BAMBOO_IDS},
    }
    for item_id in STANDARD_BODY_IDS:
        source = Image.open(OUT_DIR / "base" / f"{item_id}.png").convert("RGBA")
        rebuilt = make_symbol_transfer_tile(source, blank_standard_body, focus_boxes[item_id])
        rebuilt.save(OUT_DIR / "base" / f"{item_id}.png")

    save_standard_body_previews(source_standard_body, blank_standard_body)
    blank_standard_body.save(OUT_DIR / "preview" / "standard-body-template.png")
    for item_id in ["tile_dot_01", "tile_dot_09", "tile_bamboo_01", "tile_bamboo_09"]:
        symbol_mask = seed_symbol_mask(Image.open(OUT_DIR / "base" / f"{item_id}.png").convert("RGBA"), focus_boxes[item_id])
        symbol_mask.filter(ImageFilter.MaxFilter(13)).save(OUT_DIR / "preview" / f"symbol-mask-{item_id}.png")


def regenerate_outputs() -> None:
    v3.make_contact_sheet([
        {"id": item_id, "file": f"base/{item_id}.png", "canvas": {"width": 272, "height": 384}}
        for item_id in v3.BASE_ITEM_ORDER
    ])
    v3.make_state_samples(v3.save_effects())


def main() -> int:
    set_v3_output_dir()
    v3.main()

    standard_body_source = Image.open(OUT_DIR / "base" / f"{STANDARD_BODY_ID}.png").convert("RGBA")
    blank_standard_body = build_blank_standard_body(standard_body_source)
    rewrite_standard_body_tiles(blank_standard_body)
    update_manifest_and_report(blank_standard_body)
    v3.make_contact_sheet([
        {"id": item_id, "file": f"base/{item_id}.png", "canvas": {"width": 272, "height": 384}}
        for item_id in v3.BASE_ITEM_ORDER
    ])
    v3.make_state_samples(
        [
            {"id": "selected_glow", "file": "effects/effect_selected_glow.png", "layer": "above"},
            {"id": "playable_fire", "file": "effects/effect_playable_fire.png", "layer": "below"},
            {"id": "disabled_shade", "file": "effects/effect_disabled_shade.png", "layer": "above"},
            {"id": "acquired_badge", "file": "effects/effect_acquired_badge.png", "layer": "above"},
        ]
    )
    print(f"built {OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
