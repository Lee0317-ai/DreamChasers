#!/usr/bin/env python3
"""Normalize generated Mahjong tiles to one transparent runtime canvas."""

from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


CANVAS_SIZE = 1024
CONTENT_MAX_WIDTH = 720
CONTENT_MAX_HEIGHT = 920
ALPHA_THRESHOLD = 16
MIN_AXIS_PIXELS = 12


def remove_connected_dark_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    if alpha.getextrema()[0] < 255:
        return rgba

    draw = ImageDraw.Draw(rgba)
    for corner in (
        (0, 0),
        (rgba.width - 1, 0),
        (0, rgba.height - 1),
        (rgba.width - 1, rgba.height - 1),
    ):
        ImageDraw.floodfill(rgba, corner, (0, 0, 0, 0), thresh=72)
    return rgba


def robust_alpha_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = np.asarray(image.getchannel("A"))
    mask = alpha > ALPHA_THRESHOLD
    columns = np.flatnonzero(mask.sum(axis=0) >= MIN_AXIS_PIXELS)
    rows = np.flatnonzero(mask.sum(axis=1) >= MIN_AXIS_PIXELS)
    if columns.size == 0 or rows.size == 0:
        raise ValueError("image has no visible tile content")
    return (int(columns[0]), int(rows[0]), int(columns[-1] + 1), int(rows[-1] + 1))


def normalize(source: Path, target: Path) -> dict[str, object]:
    image = remove_connected_dark_background(Image.open(source))
    source_bbox = robust_alpha_bbox(image)
    cropped = image.crop(source_bbox)
    scale = min(
        CONTENT_MAX_WIDTH / cropped.width,
        CONTENT_MAX_HEIGHT / cropped.height,
    )
    resized = cropped.resize(
        (round(cropped.width * scale), round(cropped.height * scale)),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    offset = (
        (CANVAS_SIZE - resized.width) // 2,
        (CANVAS_SIZE - resized.height) // 2,
    )
    canvas.alpha_composite(resized, offset)
    target.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(target)
    return {
        "source": str(source),
        "output": str(target),
        "sourceSize": list(image.size),
        "sourceBBox": list(source_bbox),
        "outputSize": [CANVAS_SIZE, CANVAS_SIZE],
        "contentSize": list(resized.size),
        "anchor": [CANVAS_SIZE // 2, CANVAS_SIZE // 2],
    }


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: normalize_tiles.py <generated-v3-directory>")
    base = Path(sys.argv[1])
    sources = sorted((base / "images").glob("*.png"))
    records = [
        normalize(source, base / "normalized" / source.name)
        for source in sources
    ]
    (base / "normalized" / "normalization-manifest.json").write_text(
        json.dumps({"tiles": records}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"normalized {len(records)} tile(s)")


if __name__ == "__main__":
    main()
