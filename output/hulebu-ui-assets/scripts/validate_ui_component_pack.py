#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image


def fail(message: str) -> None:
    raise SystemExit(message)


def validate(path: Path) -> None:
    manifest_path = path / "manifest.json"
    if not manifest_path.exists():
        fail(f"missing manifest: {manifest_path}")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    components = manifest.get("components", [])
    pack_name = str(manifest.get("name", ""))
    is_usable_only = pack_name.endswith("v2-usable-only") or pack_name.endswith("v3-usable-clean")
    min_components = 20 if is_usable_only else 25
    if len(components) < min_components:
        fail(f"expected at least {min_components} components, got {len(components)}")

    required = {
        "buttons/combo/action_chi_normal.png",
        "buttons/combo/action_chi_fire.png",
        "buttons/tools/tool_shuffle.png",
        "combo-choice/panel_bg.png",
        "combo-choice/combo_choice_preview_wan_03_04_05.png",
        "slots/hand_slots_8.png",
        "hud/tile_counter_wide.png",
        "cards/reward_combo_strength.png",
    }
    if not is_usable_only:
        required.add("buttons/tools/tool_counter.png")
        required.add("cards/scene_skin_east_card.png")
    seen = {entry.get("path") for entry in components}
    missing = sorted(required - seen)
    if missing:
        fail(f"missing required components: {', '.join(missing)}")

    for entry in components:
        validate_image_entry(path, entry)

    tile_components = manifest.get("tileComponents", [])
    if pack_name.endswith("v6-source-faithful-transparent-tiles"):
        if len(tile_components) < 35:
            fail(f"expected at least 35 transparent mahjong tile components, got {len(tile_components)}")
        required_tiles = {
            "tiles/mahjong/wan/tile_wan_01.png",
            "tiles/mahjong/dot/tile_dot_01.png",
            "tiles/mahjong/bamboo/tile_bamboo_01.png",
            "tiles/mahjong/honor/tile_honor_east.png",
            "tiles/mahjong/honor/tile_honor_north.png",
            "tiles/mahjong/back/tile_back_default.png",
        }
        seen_tiles = {entry.get("path") for entry in tile_components}
        missing_tiles = sorted(required_tiles - seen_tiles)
        if missing_tiles:
            fail(f"missing required tile components: {', '.join(missing_tiles)}")
        tile_preview = path / "preview/mahjong-tile-contact-sheet.png"
        if not tile_preview.exists():
            fail("missing preview/mahjong-tile-contact-sheet.png")

    for entry in tile_components:
        validate_image_entry(path, entry, min_transparent_ratio=0.10)

    preview = path / "preview/contact-sheet.png"
    if not preview.exists():
        fail("missing preview/contact-sheet.png")
    alpha_report = path / "alpha-report.json"
    if not alpha_report.exists():
        fail("missing alpha-report.json")
    print(f"validated {path}")


def validate_image_entry(path: Path, entry: object, min_transparent_ratio: float = 0.02) -> None:
    if not isinstance(entry, dict):
        fail(f"image entry must be an object: {entry}")
    rel = entry.get("path")
    if not isinstance(rel, str):
        fail(f"image entry missing path: {entry}")
    image_path = path / rel
    if not image_path.exists():
        fail(f"missing image file: {rel}")
    image = Image.open(image_path).convert("RGBA")
    alpha = image.getchannel("A")
    hist = alpha.histogram()
    total = image.width * image.height
    transparent_ratio = hist[0] / total
    bbox = alpha.getbbox()
    if bbox is None:
        fail(f"{rel} is fully transparent")
    if transparent_ratio < min_transparent_ratio:
        fail(f"{rel} does not look cut out; transparent ratio {transparent_ratio:.2%}")
    edge_alpha = []
    for x in range(image.width):
        edge_alpha.append(alpha.getpixel((x, 0)))
        edge_alpha.append(alpha.getpixel((x, image.height - 1)))
    for y in range(image.height):
        edge_alpha.append(alpha.getpixel((0, y)))
        edge_alpha.append(alpha.getpixel((image.width - 1, y)))
    transparent_edges = sum(1 for value in edge_alpha if value == 0) / len(edge_alpha)
    if transparent_edges < 0.50:
        fail(f"{rel} has too much opaque edge background: {transparent_edges:.2%} transparent edge pixels")


def main() -> None:
    if len(sys.argv) != 2:
        fail("usage: validate_ui_component_pack.py <pack-dir>")
    validate(Path(sys.argv[1]))


if __name__ == "__main__":
    main()
