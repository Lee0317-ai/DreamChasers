#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import random
import shutil
import statistics
from collections import deque
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "master-sources"
OUT_DIR = ROOT / "hulebu-master-tile-pack-v3-retained-green-base"
CANVAS_SIZE = (272, 384)
TILE_MASK_BOX = (28, 24, 244, 352)
TILE_MASK_RADIUS = 26


BASE_ITEM_ORDER = [
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


SHEETS = {
    "wan": {
        "source": "source-wan-1-9.png",
        "export": "rounded",
        "ids": [f"tile_wan_{index:02d}" for index in range(1, 10)],
        "boxes": [
            (43, 215, 265, 557),
            (262, 215, 484, 557),
            (482, 215, 704, 557),
            (703, 215, 925, 557),
            (925, 215, 1147, 557),
            (1146, 215, 1368, 557),
            (1367, 215, 1589, 557),
            (1588, 215, 1810, 557),
            (1809, 215, 2031, 557),
        ],
    },
    "dot": {
        "source": "source-dot-1-9.png",
        "export": "edge-alpha",
        "ids": [f"tile_dot_{index:02d}" for index in range(1, 10)],
        "boxes": [
            (31, 188, 246, 608),
            (260, 188, 485, 608),
            (487, 188, 710, 608),
            (720, 188, 945, 608),
            (954, 188, 1181, 608),
            (1189, 188, 1415, 608),
            (1420, 188, 1649, 608),
            (1651, 188, 1864, 608),
            (1870, 188, 2097, 608),
        ],
    },
    "bamboo": {
        "source": "source-bamboo-1-9.png",
        "export": "edge-alpha",
        "ids": [f"tile_bamboo_{index:02d}" for index in range(1, 10)],
        "boxes": [
            (45, 214, 245, 638),
            (252, 214, 454, 638),
            (462, 214, 665, 638),
            (673, 214, 874, 638),
            (882, 214, 1083, 638),
            (1090, 214, 1290, 638),
            (1297, 214, 1495, 638),
            (1504, 214, 1704, 638),
            (1709, 214, 1908, 638),
        ],
    },
    "honor": {
        "source": "source-honor-back-effects.png",
        "ids": [
            "tile_honor_east",
            "tile_honor_south",
            "tile_honor_west",
            "tile_honor_north",
            "tile_honor_red",
            "tile_honor_green",
            "tile_honor_whiteboard",
            "tile_back_default",
        ],
        "boxes": [
            (43, 67, 265, 409),
            (266, 67, 488, 409),
            (490, 67, 712, 409),
            (713, 67, 935, 409),
            (945, 72, 1158, 414),
            (1170, 72, 1382, 414),
            (1398, 72, 1605, 414),
            (1629, 72, 1860, 420),
        ],
        "export_by_id": {
            "tile_honor_east": "rounded",
            "tile_honor_south": "rounded",
            "tile_honor_west": "rounded",
            "tile_honor_north": "rounded",
            "tile_honor_red": "edge-alpha",
            "tile_honor_green": "edge-alpha",
            "tile_honor_whiteboard": "edge-alpha",
            "tile_back_default": "edge-alpha",
        },
    },
}


def reset_out_dir() -> None:
    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    for child in ["base", "effects", "raw-crops", "preview"]:
        (OUT_DIR / child).mkdir(parents=True, exist_ok=True)


def rounded_tile_mask(size: tuple[int, int] = CANVAS_SIZE) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle(TILE_MASK_BOX, radius=TILE_MASK_RADIUS, fill=255)
    return mask.filter(ImageFilter.GaussianBlur(0.25))


def color_distance(left: tuple[int, int, int], right: tuple[int, int, int]) -> int:
    return abs(left[0] - right[0]) + abs(left[1] - right[1]) + abs(left[2] - right[2])


def edge_background_alpha(image: Image.Image, threshold: int = 58) -> Image.Image:
    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()

    samples = []
    for x in range(0, width, 2):
        samples.extend([pixels[x, 0], pixels[x, height - 1]])
    for y in range(0, height, 2):
        samples.extend([pixels[0, y], pixels[width - 1, y]])

    background = tuple(int(statistics.median([sample[channel] for sample in samples])) for channel in range(3))
    seen: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    def add_if_background(x: int, y: int) -> None:
        if (x, y) in seen:
            return
        if color_distance(pixels[x, y], background) <= threshold:
            seen.add((x, y))
            queue.append((x, y))

    for x in range(width):
        add_if_background(x, 0)
        add_if_background(x, height - 1)
    for y in range(height):
        add_if_background(0, y)
        add_if_background(width - 1, y)

    while queue:
        x, y = queue.popleft()
        for next_x, next_y in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= next_x < width and 0 <= next_y < height:
                add_if_background(next_x, next_y)

    alpha = Image.new("L", (width, height), 255)
    alpha_pixels = alpha.load()
    for x, y in seen:
        alpha_pixels[x, y] = 0

    rgba = rgb.convert("RGBA")
    rgba.putalpha(alpha)
    return rgba


def export_tile(source: Image.Image, box: tuple[int, int, int, int], item_id: str, export_mode: str) -> None:
    raw_crop = source.crop(box)
    raw_crop.save(OUT_DIR / "raw-crops" / f"{item_id}.png")

    resized = raw_crop.resize(CANVAS_SIZE, Image.Resampling.LANCZOS)
    if export_mode == "edge-alpha":
        tile = edge_background_alpha(resized)
    elif export_mode == "rounded":
        tile = resized.convert("RGBA")
        tile.putalpha(rounded_tile_mask())
    else:
        raise ValueError(f"unsupported export mode: {export_mode}")

    tile.save(OUT_DIR / "base" / f"{item_id}.png")


def draw_debug_source(source_path: Path, sheet_config: dict) -> None:
    source = Image.open(source_path).convert("RGB")
    draw = ImageDraw.Draw(source)
    for index, (item_id, box) in enumerate(zip(sheet_config["ids"], sheet_config["boxes"])):
        draw.rectangle(box, outline=(220, 40, 30), width=4)
        draw.text((box[0] + 8, box[1] + 8), str(index + 1), fill=(220, 40, 30))
        draw.text((box[0] + 8, box[1] + 28), item_id.replace("tile_", ""), fill=(220, 40, 30))
    source.save(OUT_DIR / "preview" / f"debug-{source_path.stem}.png")


def make_selected_glow() -> Image.Image:
    layer = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    glow = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    for inset, alpha in [(8, 90), (14, 150), (19, 220)]:
        box = (
            TILE_MASK_BOX[0] - inset,
            TILE_MASK_BOX[1] - inset,
            TILE_MASK_BOX[2] + inset,
            TILE_MASK_BOX[3] + inset,
        )
        draw.rounded_rectangle(box, radius=TILE_MASK_RADIUS + inset, outline=(102, 255, 174, alpha), width=7)
    layer.alpha_composite(glow.filter(ImageFilter.GaussianBlur(8)))
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle(
        (TILE_MASK_BOX[0] - 5, TILE_MASK_BOX[1] - 5, TILE_MASK_BOX[2] + 5, TILE_MASK_BOX[3] + 5),
        radius=TILE_MASK_RADIUS + 5,
        outline=(93, 244, 166, 235),
        width=5,
    )
    return layer


def make_playable_fire() -> Image.Image:
    rng = random.Random(724)
    layer = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    glow = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    for inset, alpha in [(12, 70), (20, 110), (30, 90)]:
        draw.rounded_rectangle(
            (
                TILE_MASK_BOX[0] - inset,
                TILE_MASK_BOX[1] + 34,
                TILE_MASK_BOX[2] + inset,
                TILE_MASK_BOX[3] + inset,
            ),
            radius=TILE_MASK_RADIUS + inset,
            outline=(255, 177, 35, alpha),
            width=12,
        )
    layer.alpha_composite(glow.filter(ImageFilter.GaussianBlur(10)))

    flame = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(flame)
    for side_x in [TILE_MASK_BOX[0] - 14, TILE_MASK_BOX[2] + 14]:
        for index in range(9):
            y = TILE_MASK_BOX[1] + 62 + index * 27
            height = rng.randint(26, 54)
            width = rng.randint(9, 18)
            direction = -1 if side_x < CANVAS_SIZE[0] / 2 else 1
            points = [
                (side_x, y + height),
                (side_x + direction * width, y + height * 0.46),
                (side_x + direction * rng.randint(3, 8), y),
            ]
            draw.polygon(points, fill=(255, rng.randint(140, 204), 28, rng.randint(120, 190)))
    for index in range(7):
        x = TILE_MASK_BOX[0] + 36 + index * 25
        y = TILE_MASK_BOX[3] + rng.randint(-10, 10)
        draw.ellipse((x - 10, y - 18, x + 10, y + 22), fill=(255, 197, 55, 120))
    layer.alpha_composite(flame.filter(ImageFilter.GaussianBlur(1.3)))
    return layer


def make_disabled_shade() -> Image.Image:
    layer = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    shade = Image.new("RGBA", CANVAS_SIZE, (72, 72, 66, 150))
    shade.putalpha(rounded_tile_mask())
    layer.alpha_composite(shade)
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle(TILE_MASK_BOX, radius=TILE_MASK_RADIUS, outline=(35, 35, 31, 125), width=4)
    return layer


def star_points(cx: float, cy: float, outer: float, inner: float, points: int = 5) -> list[tuple[float, float]]:
    result = []
    for index in range(points * 2):
        radius = outer if index % 2 == 0 else inner
        angle = -math.pi / 2 + index * math.pi / points
        result.append((cx + math.cos(angle) * radius, cy + math.sin(angle) * radius))
    return result


def make_acquired_badge() -> Image.Image:
    layer = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    cx, cy = 226, 56
    draw.ellipse((cx - 34, cy - 34, cx + 34, cy + 34), fill=(99, 62, 14, 245))
    draw.ellipse((cx - 29, cy - 29, cx + 29, cy + 29), fill=(238, 177, 45, 255))
    draw.ellipse((cx - 22, cy - 22, cx + 22, cy + 22), fill=(118, 75, 18, 255))
    draw.polygon(star_points(cx, cy, 20, 8), fill=(255, 235, 126, 255))
    draw.polygon(star_points(cx - 2, cy - 3, 13, 5), fill=(255, 189, 52, 230))
    return layer


def save_effects() -> list[dict]:
    effects = [
        ("selected_glow", "effect_selected_glow.png", "above", make_selected_glow()),
        ("playable_fire", "effect_playable_fire.png", "below", make_playable_fire()),
        ("disabled_shade", "effect_disabled_shade.png", "above", make_disabled_shade()),
        ("acquired_badge", "effect_acquired_badge.png", "above", make_acquired_badge()),
    ]
    manifest_entries = []
    for effect_id, filename, layer, image in effects:
        image.save(OUT_DIR / "effects" / filename)
        manifest_entries.append({"id": effect_id, "file": f"effects/{filename}", "layer": layer})
    return manifest_entries


def compose_sample(base: Image.Image, effect: Image.Image, *, layer: str) -> Image.Image:
    canvas = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    if layer == "below":
        canvas.alpha_composite(effect)
        canvas.alpha_composite(base)
    else:
        canvas.alpha_composite(base)
        canvas.alpha_composite(effect)
    return canvas


def label_font(size: int = 16) -> ImageFont.ImageFont:
    try:
        return ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", size)
    except OSError:
        return ImageFont.load_default()


def make_contact_sheet(items: list[dict]) -> None:
    columns = 7
    cell_w, cell_h = 178, 252
    margin = 26
    rows = math.ceil(len(items) / columns)
    sheet = Image.new("RGB", (margin * 2 + columns * cell_w, margin * 2 + rows * cell_h), (239, 225, 191))
    draw = ImageDraw.Draw(sheet)
    font = label_font(15)
    for index, item in enumerate(items):
        row, column = divmod(index, columns)
        x = margin + column * cell_w
        y = margin + row * cell_h
        tile = Image.open(OUT_DIR / item["file"]).convert("RGBA").resize((102, 144), Image.Resampling.LANCZOS)
        sheet.paste(tile, (x + 38, y + 12), tile)
        draw.text((x + 8, y + 166), item["id"], fill=(55, 45, 30), font=font)
    sheet.save(OUT_DIR / "preview" / "contact-sheet.png")


def make_state_samples(effects: list[dict]) -> None:
    base = Image.open(OUT_DIR / "base" / "tile_wan_05.png").convert("RGBA")
    base.save(OUT_DIR / "preview" / "sample_normal.png")
    for effect in effects:
        effect_image = Image.open(OUT_DIR / effect["file"]).convert("RGBA")
        sample_name = {
            "selected_glow": "sample_selected.png",
            "playable_fire": "sample_playable_fire.png",
            "disabled_shade": "sample_disabled.png",
            "acquired_badge": "sample_acquired.png",
        }[effect["id"]]
        compose_sample(base, effect_image, layer=effect["layer"]).save(OUT_DIR / "preview" / sample_name)


def main() -> int:
    reset_out_dir()

    slots = []
    source_reports = []
    for sheet_name, sheet_config in SHEETS.items():
        source_path = SOURCE_DIR / sheet_config["source"]
        source = Image.open(source_path).convert("RGB")
        draw_debug_source(source_path, sheet_config)
        source_reports.append({"sheet": sheet_name, "file": sheet_config["source"], "size": list(source.size)})
        for item_id, box in zip(sheet_config["ids"], sheet_config["boxes"]):
            export_mode = sheet_config.get("export_by_id", {}).get(item_id, sheet_config.get("export", "rounded"))
            export_tile(source, box, item_id, export_mode)
            slots.append(
                {
                    "id": item_id,
                    "sheet": sheet_name,
                    "source": sheet_config["source"],
                    "sourceBox": list(box),
                    "cropSize": [box[2] - box[0], box[3] - box[1]],
                    "exportMode": export_mode,
                    "output": f"base/{item_id}.png",
                }
            )

    effects = save_effects()
    items_by_id = {
        item_id: {"id": item_id, "file": f"base/{item_id}.png", "canvas": {"width": 272, "height": 384}}
        for item_id in BASE_ITEM_ORDER
    }
    items = [items_by_id[item_id] for item_id in BASE_ITEM_ORDER]

    manifest = {
        "version": "hulebu-master-tile-pack-v3-retained-green-base",
        "basis": "Manual source boxes; dot/bamboo/red/green/white/back use edge background alpha to retain green bases.",
        "canvas": {"width": 272, "height": 384},
        "items": items,
        "effects": effects,
    }
    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    crop_report = {
        "method": "fixed-grid-green-base-v3",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "sourceDir": str(SOURCE_DIR.relative_to(ROOT)),
        "outputDir": str(OUT_DIR.relative_to(ROOT)),
        "sources": source_reports,
        "canvas": {"width": 272, "height": 384},
        "slots": slots,
        "notes": [
            "Wan 1-9 and east/south/west/north keep the v2-style rounded crop because the user approved them.",
            "Dot, bamboo, red, green, whiteboard, and tile back use tighter measured source boxes.",
            "Edge flood-fill transparency preserves each tile's real green base instead of applying a short rounded mask.",
            "State overlays are generated separately and are not baked into base tile art.",
        ],
    }
    (OUT_DIR / "crop-report.json").write_text(json.dumps(crop_report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    make_contact_sheet(items)
    make_state_samples(effects)
    print(f"built {OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
