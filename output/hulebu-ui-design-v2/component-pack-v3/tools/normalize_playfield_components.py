#!/usr/bin/env python3
"""Normalize playfield panels and a repeatable single hand slot."""

from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


SPECS = {
    "counter-toggle": (320, 170, 290, 145),
    "counter-panel": (900, 280, 860, 245),
    "meld-pool-panel": (620, 250, 580, 215),
    "loose-drop-zone": (620, 250, 580, 215),
    "hand-slot": (150, 220, 128, 200),
}


def remove_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    if rgba.getchannel("A").getextrema()[0] < 255:
        return rgba
    for corner in ((0, 0), (rgba.width - 1, 0), (0, rgba.height - 1), (rgba.width - 1, rgba.height - 1)):
        ImageDraw.floodfill(rgba, corner, (0, 0, 0, 0), thresh=72)
    return rgba


def bbox(image: Image.Image) -> tuple[int, int, int, int]:
    mask = np.asarray(image.getchannel("A")) > 16
    columns = np.flatnonzero(mask.sum(axis=0) >= 8)
    rows = np.flatnonzero(mask.sum(axis=1) >= 8)
    if columns.size == 0 or rows.size == 0:
        raise ValueError("component has no visible content")
    return int(columns[0]), int(rows[0]), int(columns[-1] + 1), int(rows[-1] + 1)


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: normalize_playfield_components.py <component-pack-v3-directory>")
    base = Path(sys.argv[1])
    records = []
    for name, (canvas_w, canvas_h, max_w, max_h) in SPECS.items():
        image = remove_background(Image.open(base / "images" / f"{name}.png"))
        crop = image.crop(bbox(image))
        scale = min(max_w / crop.width, max_h / crop.height)
        resized = crop.resize((round(crop.width * scale), round(crop.height * scale)), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
        canvas.alpha_composite(resized, ((canvas_w - resized.width) // 2, (canvas_h - resized.height) // 2))
        target = base / "normalized" / f"{name}.png"
        target.parent.mkdir(parents=True, exist_ok=True)
        canvas.save(target)
        records.append({"name": name, "size": [canvas_w, canvas_h], "repeatable": name == "hand-slot"})
    (base / "playfield-components-manifest.json").write_text(
        json.dumps({"assets": records}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"normalized {len(records)} playfield components")


if __name__ == "__main__":
    main()
