#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import shutil
from collections import deque
from dataclasses import dataclass
from pathlib import Path
from statistics import median

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[3]
SOURCE_DIR = ROOT / "output/hulebu-ui-assets/hulebu-ui-component-sources"
SPEC_SHEET = SOURCE_DIR / "ui-components-spec-sheet.png"
GAMEPLAY_SHEET = SOURCE_DIR / "hulebu-gameplay-ui-reference.png"
TILE_ROOT = ROOT / "output/hulebu-ui-assets/hulebu-master-tile-pack-v7-clean-template-dots/base"
OUT_DIR = ROOT / "output/hulebu-ui-assets/hulebu-ui-component-pack-v1-transparent"
PACK_NAME = "hulebu-ui-component-pack-v1-transparent"
PACK_NOTES = [
    "Formal components are transparent RGBA PNGs.",
    "Combo choice panel uses an empty shell plus T051 v7 mahjong tile thumbnails in generated previews.",
    "This pack is not wired into Web or Cocos runtime yet.",
]


@dataclass(frozen=True)
class Component:
    name: str
    source: str
    box: tuple[int, int, int, int]
    out: str
    tolerance: int = 30


COMPONENTS: list[Component] = [
    Component("level_badge", "spec", (72, 52, 438, 236), "hud/level_badge.png", 34),
    Component("score_badge", "spec", (471, 67, 782, 190), "hud/score_badge.png", 34),
    Component("tile_counter_wide", "spec", (18, 302, 742, 472), "hud/tile_counter_wide.png", 34),
    Component("combo_chi_normal", "spec", (27, 516, 188, 638), "buttons/combo/action_chi_normal.png", 32),
    Component("combo_peng_normal", "spec", (181, 516, 342, 638), "buttons/combo/action_peng_normal.png", 32),
    Component("combo_gang_normal", "spec", (345, 516, 496, 638), "buttons/combo/action_gang_normal.png", 32),
    Component("combo_bugang_normal", "spec", (496, 516, 667, 638), "buttons/combo/action_bugang_normal.png", 32),
    Component("combo_chi_fire", "spec", (27, 648, 190, 760), "buttons/combo/action_chi_fire.png", 54),
    Component("combo_peng_fire", "spec", (185, 648, 344, 760), "buttons/combo/action_peng_fire.png", 54),
    Component("combo_gang_fire", "spec", (340, 648, 499, 760), "buttons/combo/action_gang_fire.png", 54),
    Component("combo_bugang_fire", "spec", (501, 648, 668, 760), "buttons/combo/action_bugang_fire.png", 54),
    Component("tool_shuffle", "spec", (749, 307, 899, 437), "buttons/tools/tool_shuffle.png", 30),
    Component("tool_undo", "spec", (750, 447, 899, 575), "buttons/tools/tool_undo.png", 30),
    Component("tool_hint", "spec", (750, 587, 899, 716), "buttons/tools/tool_hint.png", 30),
    Component("tool_buff", "spec", (749, 724, 900, 870), "buttons/tools/tool_buff.png", 30),
    Component("discard_slots", "spec", (36, 1046, 354, 1136), "slots/discard_slots.png", 30),
    Component("hand_slots_8", "spec", (24, 1152, 586, 1278), "slots/hand_slots_8.png", 30),
    Component("buff_drawer_panel", "spec", (598, 954, 900, 1408), "panels/buff_drawer_panel.png", 32),
    Component("reward_card_combo", "spec", (24, 1317, 202, 1518), "cards/reward_combo_strength.png", 32),
    Component("reward_card_score", "spec", (216, 1317, 389, 1518), "cards/reward_score_bonus.png", 32),
    Component("reward_card_slot", "spec", (405, 1317, 579, 1518), "cards/reward_slot_expand.png", 32),
    Component("tool_counter", "gameplay", (486, 766, 558, 844), "buttons/tools/tool_counter.png", 40),
    Component("scene_skin_east_card", "gameplay", (8, 1368, 146, 1636), "cards/scene_skin_east_card.png", 34),
    Component("scene_skin_south_card", "gameplay", (158, 1368, 289, 1636), "cards/scene_skin_south_card.png", 34),
    Component("scene_skin_west_card", "gameplay", (308, 1368, 437, 1636), "cards/scene_skin_west_card.png", 34),
    Component("scene_skin_north_card", "gameplay", (462, 1368, 577, 1636), "cards/scene_skin_north_card.png", 34),
]


def ensure_dirs() -> None:
    for sub in [
        "source",
        "hud",
        "buttons/combo",
        "buttons/tools",
        "combo-choice",
        "slots",
        "panels",
        "cards",
        "preview",
    ]:
        (OUT_DIR / sub).mkdir(parents=True, exist_ok=True)


def edge_color(image: Image.Image) -> tuple[int, int, int]:
    rgb = image.convert("RGB")
    pixels: list[tuple[int, int, int]] = []
    width, height = rgb.size
    for x in range(width):
        pixels.append(rgb.getpixel((x, 0)))
        pixels.append(rgb.getpixel((x, height - 1)))
    for y in range(height):
        pixels.append(rgb.getpixel((0, y)))
        pixels.append(rgb.getpixel((width - 1, y)))
    return tuple(int(median(channel)) for channel in zip(*pixels))


def color_distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return math.sqrt(sum((a[i] - b[i]) ** 2 for i in range(3)))


def flood_alpha(crop: Image.Image, tolerance: int) -> Image.Image:
    rgba = crop.convert("RGBA")
    rgb = rgba.convert("RGB")
    bg = edge_color(rgba)
    width, height = rgba.size
    visited = bytearray(width * height)
    background = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        if x < 0 or y < 0 or x >= width or y >= height:
            return
        idx = y * width + x
        if visited[idx]:
            return
        visited[idx] = 1
        if color_distance(rgb.getpixel((x, y)), bg) <= tolerance:
            background[idx] = 1
            queue.append((x, y))

    for x in range(width):
        push(x, 0)
        push(x, height - 1)
    for y in range(height):
        push(0, y)
        push(width - 1, y)

    while queue:
        x, y = queue.popleft()
        push(x + 1, y)
        push(x - 1, y)
        push(x, y + 1)
        push(x, y - 1)

    out = Image.new("RGBA", rgba.size)
    src = rgba.load()
    dst = out.load()
    for y in range(height):
        for x in range(width):
            idx = y * width + x
            r, g, b, a = src[x, y]
            dst[x, y] = (r, g, b, 0 if background[idx] else a)
    return out


def remove_pale_sheet_background(image: Image.Image) -> Image.Image:
    out = image.copy().convert("RGBA")
    pixels = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            channel_spread = max(r, g, b) - min(r, g, b)
            looks_like_sheet = (
                r >= 190
                and g >= 170
                and b >= 135
                and abs(r - g) <= 42
                and abs(g - b) <= 58
                and channel_spread <= 78
            )
            if looks_like_sheet:
                pixels[x, y] = (r, g, b, 0)
    return out


def remove_small_alpha_islands(image: Image.Image, min_area: int = 90) -> Image.Image:
    rgba = image.copy().convert("RGBA")
    alpha = rgba.getchannel("A")
    width, height = rgba.size
    seen = bytearray(width * height)
    keep = bytearray(width * height)
    alpha_pixels = alpha.load()

    for start_y in range(height):
        for start_x in range(width):
            start_idx = start_y * width + start_x
            if seen[start_idx] or alpha_pixels[start_x, start_y] == 0:
                continue
            queue: deque[tuple[int, int]] = deque([(start_x, start_y)])
            seen[start_idx] = 1
            component: list[tuple[int, int]] = []
            while queue:
                x, y = queue.popleft()
                component.append((x, y))
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    idx = ny * width + nx
                    if seen[idx] or alpha_pixels[nx, ny] == 0:
                        continue
                    seen[idx] = 1
                    queue.append((nx, ny))
            if len(component) >= min_area:
                for x, y in component:
                    keep[y * width + x] = 1

    pixels = rgba.load()
    for y in range(height):
        for x in range(width):
            if alpha_pixels[x, y] and not keep[y * width + x]:
                r, g, b, _ = pixels[x, y]
                pixels[x, y] = (r, g, b, 0)
    return rgba


def remove_thin_artifacts(image: Image.Image) -> Image.Image:
    rgba = image.copy().convert("RGBA")
    alpha = rgba.getchannel("A")
    width, height = rgba.size
    seen = bytearray(width * height)
    alpha_pixels = alpha.load()
    pixels = rgba.load()

    for start_y in range(height):
        for start_x in range(width):
            start_idx = start_y * width + start_x
            if seen[start_idx] or alpha_pixels[start_x, start_y] == 0:
                continue
            queue: deque[tuple[int, int]] = deque([(start_x, start_y)])
            seen[start_idx] = 1
            component: list[tuple[int, int]] = []
            while queue:
                x, y = queue.popleft()
                component.append((x, y))
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    idx = ny * width + nx
                    if seen[idx] or alpha_pixels[nx, ny] == 0:
                        continue
                    seen[idx] = 1
                    queue.append((nx, ny))
            xs = [point[0] for point in component]
            ys = [point[1] for point in component]
            bbox_w = max(xs) - min(xs) + 1
            bbox_h = max(ys) - min(ys) + 1
            is_horizontal_rule = bbox_h <= 22 and bbox_w >= 34
            is_vertical_rule = bbox_w <= 20 and bbox_h >= 34
            if is_horizontal_rule or is_vertical_rule:
                for x, y in component:
                    r, g, b, _ = pixels[x, y]
                    pixels[x, y] = (r, g, b, 0)
    return rgba


def pad_transparent(image: Image.Image, padding: int = 6) -> Image.Image:
    rgba = image.convert("RGBA")
    out = Image.new("RGBA", (rgba.width + padding * 2, rgba.height + padding * 2), (0, 0, 0, 0))
    out.alpha_composite(rgba, (padding, padding))
    return out


def alpha_stats(image: Image.Image) -> dict[str, object]:
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    hist = alpha.histogram()
    total = rgba.width * rgba.height
    return {
        "size": [rgba.width, rgba.height],
        "transparentRatio": round(hist[0] / total, 4),
        "partialAlphaRatio": round(sum(hist[1:255]) / total, 4),
        "alphaBbox": list(alpha.getbbox() or (0, 0, 0, 0)),
    }


def save_component(component: Component, sources: dict[str, Image.Image]) -> dict[str, object]:
    crop = sources[component.source].crop(component.box)
    out = flood_alpha(crop, component.tolerance)
    if "fire" in component.out:
        out = remove_pale_sheet_background(out)
    out = remove_small_alpha_islands(out)
    out = remove_thin_artifacts(out)
    out = pad_transparent(out)
    target = OUT_DIR / component.out
    target.parent.mkdir(parents=True, exist_ok=True)
    out.save(target)
    return {
        "name": component.name,
        "kind": "crop",
        "source": component.source,
        "box": list(component.box),
        "path": component.out,
        "alpha": alpha_stats(out),
    }


def erase_combo_text(panel: Image.Image) -> Image.Image:
    out = panel.copy().convert("RGBA")
    draw = ImageDraw.Draw(out)
    fill = (232, 218, 184, 255)
    # Clear text and small selector diamonds while leaving the frame and separators.
    for x0, x1 in [(62, 139), (219, 295), (372, 450)]:
        draw.rounded_rectangle((x0, 20, x1, 64), radius=8, fill=fill)
    return out


def load_tile(tile_name: str, height: int) -> Image.Image:
    tile = Image.open(TILE_ROOT / tile_name).convert("RGBA")
    scale = height / tile.height
    return tile.resize((round(tile.width * scale), height), Image.Resampling.LANCZOS)


def build_combo_choice(sources: dict[str, Image.Image]) -> list[dict[str, object]]:
    raw = sources["spec"].crop((36, 819, 515, 902))
    panel = erase_combo_text(flood_alpha(raw, 30))
    panel_path = OUT_DIR / "combo-choice/panel_bg.png"
    panel.save(panel_path)

    entries: list[dict[str, object]] = [
        {
            "name": "combo_choice_panel_bg",
            "kind": "generated",
            "source": "spec",
            "box": [36, 819, 515, 902],
            "path": "combo-choice/panel_bg.png",
            "alpha": alpha_stats(panel),
        }
    ]

    preview_sets = [
        ("combo_choice_preview_wan_03_04_05", ["tile_wan_03.png", "tile_wan_04.png", "tile_wan_05.png"]),
        ("combo_choice_preview_wan_04_05_06", ["tile_wan_04.png", "tile_wan_05.png", "tile_wan_06.png"]),
    ]
    centers = [102, 258, 414]
    for name, tiles in preview_sets:
        preview = panel.copy()
        for center_x, tile_name in zip(centers, tiles):
            tile = load_tile(tile_name, 58)
            x = center_x - tile.width // 2
            y = 13
            preview.alpha_composite(tile, (x, y))
        out_path = OUT_DIR / f"combo-choice/{name}.png"
        preview.save(out_path)
        entries.append(
            {
                "name": name,
                "kind": "generated",
                "source": "spec+v7-tiles",
                "path": f"combo-choice/{name}.png",
                "alpha": alpha_stats(preview),
            }
        )
    return entries


def checkerboard(size: tuple[int, int], cell: int = 12) -> Image.Image:
    image = Image.new("RGBA", size, (255, 255, 255, 255))
    draw = ImageDraw.Draw(image)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            color = (224, 224, 224, 255) if (x // cell + y // cell) % 2 else (248, 248, 248, 255)
            draw.rectangle((x, y, x + cell - 1, y + cell - 1), fill=color)
    return image


def render_contact_sheet(entries: list[dict[str, object]]) -> None:
    thumbs: list[tuple[str, Image.Image]] = []
    for entry in entries:
        path = OUT_DIR / str(entry["path"])
        image = Image.open(path).convert("RGBA")
        image.thumbnail((180, 150), Image.Resampling.LANCZOS)
        tile = checkerboard((220, 190))
        tile.alpha_composite(image, ((220 - image.width) // 2, 12))
        draw = ImageDraw.Draw(tile)
        label = str(entry["name"])
        draw.text((10, 164), label[:28], fill=(38, 38, 38, 255), font=ImageFont.load_default())
        thumbs.append((label, tile))

    columns = 4
    rows = math.ceil(len(thumbs) / columns)
    sheet = Image.new("RGBA", (columns * 220, rows * 190), (246, 240, 226, 255))
    for index, (_, tile) in enumerate(thumbs):
        x = (index % columns) * 220
        y = (index // columns) * 190
        sheet.alpha_composite(tile, (x, y))
    sheet.save(OUT_DIR / "preview/contact-sheet.png")


def main() -> None:
    ensure_dirs()
    shutil.copyfile(SPEC_SHEET, OUT_DIR / "source/ui-components-spec-sheet.png")
    shutil.copyfile(GAMEPLAY_SHEET, OUT_DIR / "source/hulebu-gameplay-ui-reference.png")

    sources = {
        "spec": Image.open(SPEC_SHEET).convert("RGBA"),
        "gameplay": Image.open(GAMEPLAY_SHEET).convert("RGBA"),
    }

    entries: list[dict[str, object]] = []
    for component in COMPONENTS:
        entries.append(save_component(component, sources))
    entries.extend(build_combo_choice(sources))

    render_contact_sheet(entries)

    manifest = {
        "name": PACK_NAME,
        "sourceImages": {
            "spec": "source/ui-components-spec-sheet.png",
            "gameplay": "source/hulebu-gameplay-ui-reference.png",
            "tilePack": "../hulebu-master-tile-pack-v7-clean-template-dots/base",
        },
        "notes": PACK_NOTES,
        "components": entries,
    }
    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    alpha_report = {
        "pack": manifest["name"],
        "components": [
            {
                "name": entry["name"],
                "path": entry["path"],
                "alpha": entry["alpha"],
            }
            for entry in entries
        ],
    }
    (OUT_DIR / "alpha-report.json").write_text(
        json.dumps(alpha_report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"wrote {OUT_DIR}")


if __name__ == "__main__":
    main()
