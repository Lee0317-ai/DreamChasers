#!/usr/bin/env python3
from __future__ import annotations

import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

import build_ui_component_pack_source_faithful_v5  # noqa: F401 - applies source-faithful v5 crop fixes.
import build_ui_component_pack_v1 as base


TILE_SOURCE_DIR = base.ROOT / "output/hulebu-ui-assets/hulebu-master-tile-pack-v7-clean-template-dots/base"

base.OUT_DIR = base.ROOT / "output/hulebu-ui-assets/hulebu-ui-component-pack-v6-source-faithful-transparent-tiles"
base.PACK_NAME = "hulebu-ui-component-pack-v6-source-faithful-transparent-tiles"
base.PACK_NOTES = [
    "Formal UI components are transparent RGBA PNGs.",
    "This pack keeps the v5 original-reference texture and lighting for HUD, buttons, panels, slots, cards, and combo choice UI.",
    "Mahjong tile faces are copied from T051 v7 as full transparent PNGs: outside canvas is alpha, while the cream face and green base stay intact.",
    "Combo choice panel uses an empty shell plus T051 v7 mahjong tile thumbnails in generated previews.",
    "This pack is not wired into Web or Cocos runtime yet.",
]


TILE_GROUPS: dict[str, list[str]] = {
    "wan": [f"tile_wan_{i:02d}.png" for i in range(1, 10)],
    "dot": [f"tile_dot_{i:02d}.png" for i in range(1, 10)],
    "bamboo": [f"tile_bamboo_{i:02d}.png" for i in range(1, 10)],
    "honor": [
        "tile_honor_east.png",
        "tile_honor_south.png",
        "tile_honor_west.png",
        "tile_honor_north.png",
        "tile_honor_red.png",
        "tile_honor_green.png",
        "tile_honor_whiteboard.png",
    ],
    "back": ["tile_back_default.png"],
}


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


def checkerboard(size: tuple[int, int], cell: int = 12) -> Image.Image:
    image = Image.new("RGBA", size, (255, 255, 255, 255))
    draw = ImageDraw.Draw(image)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            color = (224, 224, 224, 255) if (x // cell + y // cell) % 2 else (248, 248, 248, 255)
            draw.rectangle((x, y, x + cell - 1, y + cell - 1), fill=color)
    return image


def copy_transparent_tiles() -> list[dict[str, object]]:
    entries: list[dict[str, object]] = []
    for group, filenames in TILE_GROUPS.items():
        target_dir = base.OUT_DIR / "tiles/mahjong" / group
        target_dir.mkdir(parents=True, exist_ok=True)
        for filename in filenames:
            source = TILE_SOURCE_DIR / filename
            if not source.exists():
                raise FileNotFoundError(source)
            image = Image.open(source).convert("RGBA")
            target = target_dir / filename
            image.save(target)
            entries.append(
                {
                    "name": Path(filename).stem,
                    "kind": "transparent-mahjong-tile",
                    "group": group,
                    "source": "../hulebu-master-tile-pack-v7-clean-template-dots/base",
                    "path": str(target.relative_to(base.OUT_DIR)),
                    "alpha": alpha_stats(image),
                }
            )
    return entries


def render_tile_contact_sheet(entries: list[dict[str, object]]) -> None:
    tiles: list[Image.Image] = []
    for entry in entries:
        path = base.OUT_DIR / str(entry["path"])
        image = Image.open(path).convert("RGBA")
        image.thumbnail((96, 136), Image.Resampling.LANCZOS)
        cell = checkerboard((150, 186))
        cell.alpha_composite(image, ((150 - image.width) // 2, 10))
        draw = ImageDraw.Draw(cell)
        label = str(entry["name"])
        draw.text((8, 160), label[:22], fill=(38, 38, 38, 255), font=ImageFont.load_default())
        tiles.append(cell)

    columns = 7
    rows = (len(tiles) + columns - 1) // columns
    sheet = checkerboard((columns * 150, rows * 186))
    for index, tile in enumerate(tiles):
        sheet.alpha_composite(tile, ((index % columns) * 150, (index // columns) * 186))
    sheet.save(base.OUT_DIR / "preview/mahjong-tile-contact-sheet.png")


def append_tiles_to_reports(tile_entries: list[dict[str, object]]) -> None:
    manifest_path = base.OUT_DIR / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["name"] = base.PACK_NAME
    manifest["notes"] = base.PACK_NOTES
    manifest["sourceImages"]["tilePack"] = "../hulebu-master-tile-pack-v7-clean-template-dots/base"
    manifest["tileComponents"] = tile_entries
    manifest["previews"] = {
        "uiContactSheet": "preview/contact-sheet.png",
        "mahjongTileContactSheet": "preview/mahjong-tile-contact-sheet.png",
    }
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    alpha_report_path = base.OUT_DIR / "alpha-report.json"
    alpha_report = json.loads(alpha_report_path.read_text(encoding="utf-8"))
    alpha_report["pack"] = base.PACK_NAME
    alpha_report["tileComponents"] = [
        {
            "name": entry["name"],
            "path": entry["path"],
            "alpha": entry["alpha"],
        }
        for entry in tile_entries
    ]
    alpha_report_path.write_text(json.dumps(alpha_report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    if base.OUT_DIR.exists():
        shutil.rmtree(base.OUT_DIR)
    base.main()
    tile_entries = copy_transparent_tiles()
    render_tile_contact_sheet(tile_entries)
    append_tiles_to_reports(tile_entries)
    print(f"wrote {base.OUT_DIR}")


if __name__ == "__main__":
    main()
