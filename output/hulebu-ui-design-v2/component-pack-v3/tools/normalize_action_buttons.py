#!/usr/bin/env python3
"""Normalize generated action buttons to fixed runtime canvases."""

from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


SPECS = {
    "action-hu": (512, 512, 450, 450),
    "action-gang": (512, 512, 450, 450),
    "action-peng": (512, 512, 450, 450),
    "action-chi": (512, 512, 450, 450),
    "action-bugang": (768, 512, 700, 450),
}


def transparent_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    if rgba.getchannel("A").getextrema()[0] < 255:
        return rgba
    for corner in ((0, 0), (rgba.width - 1, 0), (0, rgba.height - 1), (rgba.width - 1, rgba.height - 1)):
        ImageDraw.floodfill(rgba, corner, (0, 0, 0, 0), thresh=72)
    return rgba


def content_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = np.asarray(image.getchannel("A")) > 16
    columns = np.flatnonzero(alpha.sum(axis=0) >= 8)
    rows = np.flatnonzero(alpha.sum(axis=1) >= 8)
    if columns.size == 0 or rows.size == 0:
        raise ValueError("button has no visible content")
    return int(columns[0]), int(rows[0]), int(columns[-1] + 1), int(rows[-1] + 1)


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: normalize_action_buttons.py <component-pack-v3-directory>")
    base = Path(sys.argv[1])
    records = []
    for name, (canvas_w, canvas_h, max_w, max_h) in SPECS.items():
        source = base / "images" / f"{name}.png"
        image = transparent_background(Image.open(source))
        crop = image.crop(content_bbox(image))
        scale = min(max_w / crop.width, max_h / crop.height)
        resized = crop.resize((round(crop.width * scale), round(crop.height * scale)), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
        offset = ((canvas_w - resized.width) // 2, (canvas_h - resized.height) // 2)
        canvas.alpha_composite(resized, offset)
        target = base / "normalized" / f"{name}.png"
        target.parent.mkdir(parents=True, exist_ok=True)
        canvas.save(target)
        records.append({"name": name, "size": [canvas_w, canvas_h], "anchor": [canvas_w // 2, canvas_h // 2]})
    manifest = base / "action-buttons-manifest.json"
    manifest.write_text(json.dumps({"assets": records}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"normalized {len(records)} action buttons")


if __name__ == "__main__":
    main()
