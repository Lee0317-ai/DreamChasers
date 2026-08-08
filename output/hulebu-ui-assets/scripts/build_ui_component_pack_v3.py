#!/usr/bin/env python3
from __future__ import annotations

from PIL import ImageDraw

import build_ui_component_pack_v1 as base


base.OUT_DIR = base.ROOT / "output/hulebu-ui-assets/hulebu-ui-component-pack-v3-usable-clean"
base.PACK_NAME = "hulebu-ui-component-pack-v3-usable-clean"
base.PACK_NOTES = [
    "Formal components are transparent RGBA PNGs.",
    "Gameplay-composite-only partial crops are excluded from this usable pack.",
    "Right-side tool buttons use corrected full-component crop boxes.",
    "Pale plaques keep their internal panel fill instead of being hollowed out.",
    "Combo choice panel uses an empty shell plus T051 v7 mahjong tile thumbnails in generated previews.",
    "This pack is not wired into Web or Cocos runtime yet.",
]


REPLACEMENTS = {
    "score_badge": base.Component(
        "score_badge",
        "spec",
        (458, 54, 795, 205),
        "hud/score_badge.png",
        22,
    ),
    "tool_shuffle": base.Component(
        "tool_shuffle",
        "spec",
        (720, 280, 930, 450),
        "buttons/tools/tool_shuffle.png",
        34,
    ),
    "tool_undo": base.Component(
        "tool_undo",
        "spec",
        (720, 430, 930, 590),
        "buttons/tools/tool_undo.png",
        34,
    ),
    "tool_hint": base.Component(
        "tool_hint",
        "spec",
        (720, 570, 930, 735),
        "buttons/tools/tool_hint.png",
        34,
    ),
    "tool_buff": base.Component(
        "tool_buff",
        "spec",
        (720, 735, 930, 910),
        "buttons/tools/tool_buff.png",
        34,
    ),
}


base.COMPONENTS = [
    REPLACEMENTS.get(component.name, component)
    for component in base.COMPONENTS
    if component.source == "spec"
]


def erase_combo_choice_content(panel):
    out = panel.copy().convert("RGBA")
    draw = ImageDraw.Draw(out)
    fill = (232, 218, 184, 255)
    # Clear the original text and selector diamonds while keeping the frame and dividers.
    for x0, x1 in [(42, 150), (200, 310), (354, 464)]:
        draw.rounded_rectangle((x0, 8, x1, 84), radius=7, fill=fill)
    return out


def build_combo_choice(sources):
    raw = sources["spec"].crop((30, 812, 522, 908))
    panel = erase_combo_choice_content(base.flood_alpha(raw, 16))
    panel_path = base.OUT_DIR / "combo-choice/panel_bg.png"
    panel.save(panel_path)

    entries = [
        {
            "name": "combo_choice_panel_bg",
            "kind": "generated",
            "source": "spec",
            "box": [30, 812, 522, 908],
            "path": "combo-choice/panel_bg.png",
            "alpha": base.alpha_stats(panel),
        }
    ]

    preview_sets = [
        ("combo_choice_preview_wan_03_04_05", ["tile_wan_03.png", "tile_wan_04.png", "tile_wan_05.png"]),
        ("combo_choice_preview_wan_04_05_06", ["tile_wan_04.png", "tile_wan_05.png", "tile_wan_06.png"]),
    ]
    centers = [96, 252, 408]
    tile_height = 58
    tile_y = (panel.height - tile_height) // 2
    for name, tiles in preview_sets:
        preview = panel.copy()
        for center_x, tile_name in zip(centers, tiles):
            tile = base.load_tile(tile_name, tile_height)
            x = center_x - tile.width // 2
            preview.alpha_composite(tile, (x, tile_y))
        out_path = base.OUT_DIR / f"combo-choice/{name}.png"
        preview.save(out_path)
        entries.append(
            {
                "name": name,
                "kind": "generated",
                "source": "spec+v7-tiles",
                "path": f"combo-choice/{name}.png",
                "alpha": base.alpha_stats(preview),
            }
        )
    return entries


base.build_combo_choice = build_combo_choice


if __name__ == "__main__":
    base.main()
