#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageFilter


EXPECTED_BASE_IDS = [
    *(f"tile_wan_{index:02d}" for index in range(1, 10)),
    *(f"tile_dot_{index:02d}" for index in range(1, 10)),
    *(f"tile_bamboo_{index:02d}" for index in range(1, 10)),
    "tile_honor_east",
    "tile_honor_south",
    "tile_honor_west",
    "tile_honor_north",
    "tile_honor_red",
    "tile_honor_green",
    "tile_honor_whiteboard",
    "tile_back_default",
]

EXPECTED_EFFECT_IDS = {
    "selected_glow",
    "playable_fire",
    "disabled_shade",
    "acquired_badge",
}

CANVAS_SIZE = (272, 384)
EXPECTED_METHODS = {
    "fixed-grid-manual-v2",
    "fixed-grid-green-base-v3",
    "standard-body-symbol-transfer-v4",
    "standard-body-dot-fused-v5",
    "standard-body-dot-clean-v6",
    "standard-body-dot-clean-template-v7",
}
GREEN_BASE_IDS = [
    *(f"tile_dot_{index:02d}" for index in range(1, 10)),
    *(f"tile_bamboo_{index:02d}" for index in range(1, 10)),
    "tile_honor_red",
    "tile_honor_green",
    "tile_honor_whiteboard",
    "tile_back_default",
]
MIN_BOTTOM_GREEN_PIXELS = 2500
STANDARD_BODY_IDS = [
    *(f"tile_dot_{index:02d}" for index in range(1, 10)),
    *(f"tile_bamboo_{index:02d}" for index in range(1, 10)),
]
STANDARD_BODY_REFERENCE_ID = "tile_wan_01"
MAX_STANDARD_BODY_BBOX_DELTA = 2
MAX_STANDARD_BODY_GREEN_DELTA = 450
DOT_IDS = [f"tile_dot_{index:02d}" for index in range(1, 10)]
DOT_FOCUS_BOX = (48, 56, 226, 286)
MAX_DOT_PASTE_PIXELS = 180
BOTTOM_RED_FRAGMENT_Y = 250
MAX_BOTTOM_RED_FRAGMENT_AREA = 20


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise AssertionError(f"missing required file: {path}") from None


def assert_png(path: Path, expected_size: tuple[int, int], *, require_alpha: bool) -> None:
    if not path.exists():
        raise AssertionError(f"missing png: {path}")

    with Image.open(path) as image:
        if image.size != expected_size:
            raise AssertionError(f"{path} size {image.size} != {expected_size}")
        if require_alpha and image.mode != "RGBA":
            raise AssertionError(f"{path} mode {image.mode} is not RGBA")
        if require_alpha:
            alpha = image.getchannel("A")
            if alpha.getbbox() is None:
                raise AssertionError(f"{path} has empty alpha")
            corner_values = [
                alpha.getpixel((0, 0)),
                alpha.getpixel((expected_size[0] - 1, 0)),
                alpha.getpixel((0, expected_size[1] - 1)),
                alpha.getpixel((expected_size[0] - 1, expected_size[1] - 1)),
            ]
            if min(corner_values) > 8:
                raise AssertionError(f"{path} does not keep transparent corner padding")


def bottom_green_pixel_count(path: Path) -> int:
    with Image.open(path) as image:
        rgba = image.convert("RGBA")
        count = 0
        for y in range(288, 374):
            for x in range(rgba.width):
                r, g, b, a = rgba.getpixel((x, y))
                if a > 150 and g > 45 and r < 145 and b < 145 and g >= r * 0.95 and g >= b * 1.02:
                    count += 1
        return count


def assert_green_bases(pack_dir: Path) -> None:
    for item_id in GREEN_BASE_IDS:
        path = pack_dir / "base" / f"{item_id}.png"
        green_pixels = bottom_green_pixel_count(path)
        if green_pixels < MIN_BOTTOM_GREEN_PIXELS:
            raise AssertionError(
                f"{path} bottom green base looks missing or clipped: "
                f"{green_pixels} < {MIN_BOTTOM_GREEN_PIXELS}"
            )


def alpha_bbox(path: Path) -> tuple[int, int, int, int] | None:
    with Image.open(path) as image:
        return image.convert("RGBA").getchannel("A").getbbox()


def assert_standard_bodies(pack_dir: Path) -> None:
    reference_path = pack_dir / "base" / f"{STANDARD_BODY_REFERENCE_ID}.png"
    reference_bbox = alpha_bbox(reference_path)
    reference_green = bottom_green_pixel_count(reference_path)
    if reference_bbox is None:
        raise AssertionError(f"reference tile has empty alpha: {reference_path}")

    for item_id in STANDARD_BODY_IDS:
        path = pack_dir / "base" / f"{item_id}.png"
        bbox = alpha_bbox(path)
        if bbox is None:
            raise AssertionError(f"{path} has empty alpha")
        deltas = [abs(left - right) for left, right in zip(bbox, reference_bbox)]
        if max(deltas) > MAX_STANDARD_BODY_BBOX_DELTA:
            raise AssertionError(f"{path} alpha bbox {bbox} does not match standard body {reference_bbox}")
        green_pixels = bottom_green_pixel_count(path)
        if abs(green_pixels - reference_green) > MAX_STANDARD_BODY_GREEN_DELTA:
            raise AssertionError(
                f"{path} bottom green base differs too much from standard body: "
                f"{green_pixels} vs {reference_green}"
            )


def is_obvious_symbol_pixel(r: int, g: int, b: int, a: int) -> bool:
    if a < 120:
        return False
    luminance = (r * 299 + g * 587 + b * 114) // 1000
    saturation = max(r, g, b) - min(r, g, b)
    red = r > 115 and g < 145 and b < 135 and r > g * 1.18
    green = g > 55 and r < 175 and b < 165 and g >= r * 0.75
    dark = luminance < 145
    vivid = saturation > 62 and min(r, g, b) < 205
    return red or green or dark or vivid


def assert_fused_dot_symbols(pack_dir: Path) -> None:
    template_path = pack_dir / "preview" / "standard-body-template.png"
    if not template_path.exists():
        raise AssertionError(f"missing standard body template preview: {template_path}")

    template = Image.open(template_path).convert("RGBA")
    for item_id in DOT_IDS:
        path = pack_dir / "base" / f"{item_id}.png"
        image = Image.open(path).convert("RGBA")
        symbol_core = Image.new("L", image.size, 0)
        core_pixels = symbol_core.load()
        image_pixels = image.load()
        template_pixels = template.load()
        for y in range(DOT_FOCUS_BOX[1], DOT_FOCUS_BOX[3]):
            for x in range(DOT_FOCUS_BOX[0], DOT_FOCUS_BOX[2]):
                if is_obvious_symbol_pixel(*image_pixels[x, y]):
                    core_pixels[x, y] = 255

        near_symbol = symbol_core.filter(ImageFilter.MaxFilter(43))
        near_pixels = near_symbol.load()
        patch_pixels = 0
        for y in range(DOT_FOCUS_BOX[1], DOT_FOCUS_BOX[3]):
            for x in range(DOT_FOCUS_BOX[0], DOT_FOCUS_BOX[2]):
                if near_pixels[x, y] > 0:
                    continue
                r, g, b, a = image_pixels[x, y]
                tr, tg, tb, ta = template_pixels[x, y]
                if a > 160 and ta > 160 and abs(r - tr) + abs(g - tg) + abs(b - tb) > 24:
                    patch_pixels += 1

        if patch_pixels > MAX_DOT_PASTE_PIXELS:
            raise AssertionError(
                f"{path} still looks like a pasted patch around dot symbols: "
                f"{patch_pixels} > {MAX_DOT_PASTE_PIXELS}"
            )


def is_red_symbol_pixel(r: int, g: int, b: int, a: int) -> bool:
    return a > 120 and r > 115 and g < 145 and b < 135 and r > g * 1.18


def assert_clean_dot_edges(pack_dir: Path) -> None:
    for item_id in DOT_IDS:
        path = pack_dir / "base" / f"{item_id}.png"
        image = Image.open(path).convert("RGBA")
        pixels = image.load()
        red_pixels = set()
        for y in range(DOT_FOCUS_BOX[1], DOT_FOCUS_BOX[3]):
            for x in range(DOT_FOCUS_BOX[0], DOT_FOCUS_BOX[2]):
                if is_red_symbol_pixel(*pixels[x, y]):
                    red_pixels.add((x, y))

        seen = set()
        for start in red_pixels:
            if start in seen:
                continue
            stack = [start]
            seen.add(start)
            component = []
            while stack:
                x, y = stack.pop()
                component.append((x, y))
                for next_x, next_y in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    point = (next_x, next_y)
                    if point in red_pixels and point not in seen:
                        seen.add(point)
                        stack.append(point)

            component_y_min = min(point[1] for point in component)
            if component_y_min >= BOTTOM_RED_FRAGMENT_Y and len(component) > MAX_BOTTOM_RED_FRAGMENT_AREA:
                raise AssertionError(
                    f"{path} has bottom red fragments that look like source-crop leftovers: "
                    f"area {len(component)} at y={component_y_min}"
                )


def main() -> int:
    if len(sys.argv) < 2:
        print(
            "usage: validate_master_tile_pack.py <pack-dir> "
            "[--require-green-base] [--require-standard-body] [--require-fused-dots] [--require-clean-dot-edges]",
            file=sys.stderr,
        )
        return 2

    pack_dir = Path(sys.argv[1])
    valid_options = {
        "--require-green-base",
        "--require-standard-body",
        "--require-fused-dots",
        "--require-clean-dot-edges",
    }
    require_green_base = "--require-green-base" in sys.argv[2:]
    require_standard_body = "--require-standard-body" in sys.argv[2:]
    require_fused_dots = "--require-fused-dots" in sys.argv[2:]
    require_clean_dot_edges = "--require-clean-dot-edges" in sys.argv[2:]
    unknown_options = [arg for arg in sys.argv[2:] if arg not in valid_options]
    if unknown_options:
        print(
            "unknown option(s): expected --require-green-base, --require-standard-body, "
            "--require-fused-dots and/or --require-clean-dot-edges",
            file=sys.stderr,
        )
        return 2

    manifest = load_json(pack_dir / "manifest.json")
    crop_report = load_json(pack_dir / "crop-report.json")

    method = crop_report.get("method")
    if method not in EXPECTED_METHODS:
        raise AssertionError(f"crop-report method must be one of {sorted(EXPECTED_METHODS)}")

    items = manifest.get("items", [])
    actual_base_ids = [item.get("id") for item in items]
    if actual_base_ids != EXPECTED_BASE_IDS:
        raise AssertionError(f"base ids mismatch: {actual_base_ids}")

    effects = manifest.get("effects", [])
    actual_effect_ids = {item.get("id") for item in effects}
    if actual_effect_ids != EXPECTED_EFFECT_IDS:
        raise AssertionError(f"effect ids mismatch: {actual_effect_ids}")

    if manifest.get("canvas") != {"width": CANVAS_SIZE[0], "height": CANVAS_SIZE[1]}:
        raise AssertionError("manifest canvas must be 272x384")

    slots = crop_report.get("slots", [])
    if len(slots) != len(EXPECTED_BASE_IDS):
        raise AssertionError(f"expected {len(EXPECTED_BASE_IDS)} crop slots, got {len(slots)}")

    slot_ids = [slot.get("id") for slot in slots]
    if slot_ids != EXPECTED_BASE_IDS:
        raise AssertionError("crop-report slot order does not match base ids")

    for item in items:
        assert_png(pack_dir / item["file"], CANVAS_SIZE, require_alpha=True)

    for effect in effects:
        assert_png(pack_dir / effect["file"], CANVAS_SIZE, require_alpha=True)

    if require_green_base or method in {
        "fixed-grid-green-base-v3",
        "standard-body-symbol-transfer-v4",
        "standard-body-dot-fused-v5",
        "standard-body-dot-clean-v6",
        "standard-body-dot-clean-template-v7",
    }:
        assert_green_bases(pack_dir)

    if require_standard_body or method in {
        "standard-body-symbol-transfer-v4",
        "standard-body-dot-fused-v5",
        "standard-body-dot-clean-v6",
        "standard-body-dot-clean-template-v7",
    }:
        assert_standard_bodies(pack_dir)

    if require_fused_dots or method in {
        "standard-body-dot-fused-v5",
        "standard-body-dot-clean-v6",
        "standard-body-dot-clean-template-v7",
    }:
        assert_fused_dot_symbols(pack_dir)

    if require_clean_dot_edges or method in {"standard-body-dot-clean-v6", "standard-body-dot-clean-template-v7"}:
        assert_clean_dot_edges(pack_dir)

    contact_sheet = pack_dir / "preview" / "contact-sheet.png"
    if not contact_sheet.exists():
        raise AssertionError("missing preview/contact-sheet.png")

    print(f"validated {pack_dir}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except AssertionError as error:
        print(f"validation failed: {error}", file=sys.stderr)
        raise SystemExit(1)
