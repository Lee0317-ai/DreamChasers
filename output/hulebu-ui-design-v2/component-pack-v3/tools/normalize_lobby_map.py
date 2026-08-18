#!/usr/bin/env python3
"""Normalize lobby/map components and derive the matching star-progress plaque."""

from __future__ import annotations

import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


SPECS = {
    "avatar-frame": (240, 240, 215, 215),
    "currency-plaque": (360, 120, 340, 100),
    "bottom-nav-frame": (900, 170, 860, 145),
    "chapter-plaque": (520, 140, 490, 115),
    "path-segment": (320, 160, 290, 135),
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


def normalize(source: Path, target: Path, spec: tuple[int, int, int, int]) -> None:
    canvas_w, canvas_h, max_w, max_h = spec
    image = remove_background(Image.open(source))
    crop = image.crop(bbox(image))
    scale = min(max_w / crop.width, max_h / crop.height)
    resized = crop.resize((round(crop.width * scale), round(crop.height * scale)), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    canvas.alpha_composite(resized, ((canvas_w - resized.width) // 2, (canvas_h - resized.height) // 2))
    target.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(target)


def star_points(cx: float, cy: float, outer: float, inner: float) -> list[tuple[float, float]]:
    points = []
    for index in range(10):
        radius = outer if index % 2 == 0 else inner
        angle = -math.pi / 2 + index * math.pi / 5
        points.append((cx + math.cos(angle) * radius, cy + math.sin(angle) * radius))
    return points


def derive_star_progress(base: Path, target: Path) -> None:
    scale = 4
    canvas = Image.new("RGBA", (420 * scale, 140 * scale), (0, 0, 0, 0))
    plaque = Image.open(base).convert("RGBA").resize((420 * scale, 113 * scale), Image.Resampling.LANCZOS)
    canvas.alpha_composite(plaque, (0, 13 * scale))
    draw = ImageDraw.Draw(canvas)
    for cx in (160, 210, 260):
        outer = star_points(cx * scale, 70 * scale, 18 * scale, 8 * scale)
        inner = star_points(cx * scale, 70 * scale, 13 * scale, 6 * scale)
        draw.polygon(outer, fill=(245, 116, 126, 255))
        draw.polygon(inner, fill=(255, 247, 224, 255))
    canvas.resize((420, 140), Image.Resampling.LANCZOS).save(target)


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: normalize_lobby_map.py <component-pack-v3-directory>")
    base = Path(sys.argv[1])
    records = []
    for name, spec in SPECS.items():
        target = base / "normalized" / f"{name}.png"
        normalize(base / "images" / f"{name}.png", target, spec)
        records.append({"name": name, "size": list(spec[:2]), "derived": False})
    star_target = base / "normalized" / "star-progress.png"
    derive_star_progress(base / "normalized" / "chapter-plaque.png", star_target)
    records.append({"name": "star-progress", "size": [420, 140], "derived": True, "source": "chapter-plaque"})
    (base / "lobby-map-manifest.json").write_text(json.dumps({"assets": records}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"normalized {len(records)} lobby/map assets")


if __name__ == "__main__":
    main()
