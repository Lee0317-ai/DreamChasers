#!/usr/bin/env python3
"""Compose a stacked tile mountain from individual runtime-ready tiles."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
TILES = ROOT.parents[0] / "tile-pack-v1/generated-v3/normalized"
OUT = ROOT / "previews" / "page-gameplay-v3-mountain.png"
W, H = 1024, 1536


def load(name: str, width: int, height: int) -> Image.Image:
    image = Image.open(TILES / f"{name}.png").convert("RGBA")
    return image.resize((width, height), Image.Resampling.LANCZOS)


def paste_center(canvas: Image.Image, image: Image.Image, cx: int, cy: int) -> None:
    canvas.alpha_composite(image, (round(cx - image.width / 2), round(cy - image.height / 2)))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--nodes", type=Path, default=Path("/tmp/t287-mountain-nodes.json"))
    parser.add_argument("--out", type=Path, default=OUT)
    args = parser.parse_args()
    canvas = Image.open(ROOT / "backgrounds/images/gameplay.png").convert("RGBA")
    canvas = canvas.resize((W, H), Image.Resampling.LANCZOS)
    # Keep the board area clear: this preview uses only the tile mountain, HUD,
    # tools, actions, and eight repeatable slots, with no baked bottom row.
    width, height = 112, 140
    tile = {name: load(name, width, height) for name in {
        "tile-back",
        "wan-01",
        "wan-05",
        "tiao-02",
        "tiao-05",
        "tong-03",
        "tong-08",
        "honor-east",
        "honor-red",
        "honor-green",
    }}
    data = json.loads(args.nodes.read_text())
    nodes = sorted(data["nodes"], key=lambda node: (node["layer"], node["y"], node["x"]))
    center_x, center_y = 512, 740
    scale = 2.15
    # Only the top tile of each column stack shows a face; everything below it
    # stays face-down, matching the visibility rule used by the real generator.
    top_by_column = {}
    for node in nodes:
        key = (round(node["x"] / 24), round(node["y"] / 24))
        top_by_column[key] = max(top_by_column.get(key, (0, None))[0], node["layer"]), node
    face_pool = ["wan-01", "tiao-05", "tong-08", "honor-red", "honor-east", "wan-05", "tiao-02"]
    face_index = 0
    pasted = []
    for node in nodes:
        pasted.append(node)
        key = (round(node["x"] / 24), round(node["y"] / 24))
        is_top = top_by_column.get(key, (0, None))[1] is node
        name = "tile-back"
        if is_top:
            name = face_pool[face_index % len(face_pool)]
            face_index += 1
        paste_center(canvas, tile[name], center_x + node["x"] * scale, center_y + node["y"] * scale)
    # HUD, tools, actions, and slots are intentionally omitted from this variant
    # so the tile mountain can be reviewed alone against the gameplay background.
    OUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(args.out)
    print(args.out)


if __name__ == "__main__":
    main()
