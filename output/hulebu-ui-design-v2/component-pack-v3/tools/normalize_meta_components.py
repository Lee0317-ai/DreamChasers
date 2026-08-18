#!/usr/bin/env python3
"""Normalize lobby, map, reward, and result components."""

from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


SPECS = {
    "title-brand": (760, 190, 730, 170),
    "mode-card": (440, 300, 410, 270),
    "level-node": (190, 190, 170, 170),
    "reward-card": (340, 480, 315, 455),
    "victory-seal": (280, 280, 250, 250),
    "failure-seal": (280, 280, 250, 250),
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
        raise SystemExit("usage: normalize_meta_components.py <component-pack-v3-directory>")
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
        records.append({"name": name, "size": [canvas_w, canvas_h], "runtimeTextAreas": name in {"title-brand", "mode-card", "reward-card"}})
    (base / "meta-components-manifest.json").write_text(json.dumps({"assets": records}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"normalized {len(records)} meta-flow components")


if __name__ == "__main__":
    main()
