#!/usr/bin/env python3
from __future__ import annotations

import math

from PIL import Image, ImageDraw, ImageFont

import build_ui_component_pack_v3  # noqa: F401 - applies v3 source-faithful crop fixes.
import build_ui_component_pack_v1 as base


base.OUT_DIR = base.ROOT / "output/hulebu-ui-assets/hulebu-ui-component-pack-v5-source-faithful"
base.PACK_NAME = "hulebu-ui-component-pack-v5-source-faithful"
base.PACK_NOTES = [
    "Formal components are transparent RGBA PNGs.",
    "This pack keeps the original reference texture and lighting instead of procedurally redrawing the UI.",
    "Right-side tool buttons, score plaque, and combo choice panel reuse the v3 crop/matte fixes.",
    "Scene skin cards use corrected full-card gameplay-reference crop boxes.",
    "Combo choice panel uses an empty shell plus T051 v7 mahjong tile thumbnails in generated previews.",
    "This pack is not wired into Web or Cocos runtime yet.",
]


base.COMPONENTS = [
    *base.COMPONENTS,
    base.Component("tool_counter", "gameplay", (16, 512, 128, 586), "buttons/tools/tool_counter.png", 40),
    base.Component("scene_skin_east_card", "gameplay", (8, 1308, 146, 1628), "cards/scene_skin_east_card.png", 38),
    base.Component("scene_skin_south_card", "gameplay", (156, 1308, 296, 1628), "cards/scene_skin_south_card.png", 38),
    base.Component("scene_skin_west_card", "gameplay", (300, 1308, 428, 1628), "cards/scene_skin_west_card.png", 38),
    base.Component("scene_skin_north_card", "gameplay", (426, 1308, 558, 1628), "cards/scene_skin_north_card.png", 38),
]


def checkerboard(size: tuple[int, int], cell: int = 12) -> Image.Image:
    image = Image.new("RGBA", size, (255, 255, 255, 255))
    draw = ImageDraw.Draw(image)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            if (x // cell + y // cell) % 2:
                draw.rectangle((x, y, x + cell - 1, y + cell - 1), fill=(224, 224, 224, 255))
            else:
                draw.rectangle((x, y, x + cell - 1, y + cell - 1), fill=(248, 248, 248, 255))
    return image


def render_contact_sheet(entries: list[dict[str, object]]) -> None:
    thumbs: list[Image.Image] = []
    for entry in entries:
        path = base.OUT_DIR / str(entry["path"])
        image = Image.open(path).convert("RGBA")
        image.thumbnail((180, 150), Image.Resampling.LANCZOS)
        tile = checkerboard((220, 190))
        tile.alpha_composite(image, ((220 - image.width) // 2, 12))
        draw = ImageDraw.Draw(tile)
        label = str(entry["name"])
        draw.text((10, 164), label[:28], fill=(38, 38, 38, 255), font=ImageFont.load_default())
        thumbs.append(tile)

    columns = 4
    rows = math.ceil(len(thumbs) / columns)
    sheet = checkerboard((columns * 220, rows * 190))
    for index, tile in enumerate(thumbs):
        sheet.alpha_composite(tile, ((index % columns) * 220, (index // columns) * 190))
    sheet.save(base.OUT_DIR / "preview/contact-sheet.png")


base.render_contact_sheet = render_contact_sheet


if __name__ == "__main__":
    base.main()
