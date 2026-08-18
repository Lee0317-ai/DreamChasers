#!/usr/bin/env python3
"""Compose a side-view tile mountain from individual runtime-ready tiles."""

from __future__ import annotations

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
TILES = ROOT.parents[0] / "tile-pack-v1/generated-v3/normalized"
COMPONENT_IMAGES = ROOT / "images"
OUT = ROOT / "previews" / "page-gameplay-v3-mountain-side.png"
W, H = 1024, 1536


def load(name: str, width: int, height: int, angle: float = 0) -> Image.Image:
    image = Image.open(TILES / f"{name}.png").convert("RGBA")
    image = image.resize((width, height), Image.Resampling.LANCZOS)
    if angle:
        image = image.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    return image


def load_component(name: str, width: int, height: int) -> Image.Image:
    image = Image.open(COMPONENT_IMAGES / f"{name}.png").convert("RGBA")
    return image.resize((width, height), Image.Resampling.LANCZOS)


def paste_center(canvas: Image.Image, image: Image.Image, cx: int, cy: int) -> None:
    canvas.alpha_composite(image, (round(cx - image.width / 2), round(cy - image.height / 2)))


def main() -> None:
    canvas = Image.open(ROOT / "backgrounds/images/gameplay.png").convert("RGBA").resize((W, H), Image.Resampling.LANCZOS)
    width, height = 150, 150
    step_x = int(width * 0.46)
    step_y = int(height * 0.21)
    center_x = 512
    sizes = [7, 6, 5, 4, 3, 2]
    # Front faces only appear on the outer slopes, embedded like tiles lying on the hillside.
    face_marks = {
        (0, 2, 6): "tiao-05",
        (0, 5, 4): "tong-08",
        (1, 1, 5): "wan-05",
        (1, 4, 1): "honor-green",
        (2, 2, 4): "tiao-02",
        (2, 4, 0): "honor-red",
        (3, 0, 3): "honor-green",
        (3, 3, 3): "honor-east",
        (4, 1, 1): "wan-01",
        (5, 0, 1): "tong-03",
    }
    y_centers = [950, 858, 766, 674, 582, 490]
    side_back = load_component("tile-side-back", width, height)
    for layer, size in enumerate(sizes):
        y0 = y_centers[layer]
        half = (size - 1) / 2
        for row in range(size):
            for column in range(size):
                x = center_x + (column - row) * step_x
                y = y0 + (column + row - 2 * half) * step_y
                name = face_marks.get((layer, row, column))
                if name:
                    angle = -20 if x < center_x else 20
                    paste_center(canvas, load(name, width - 18, height - 18, angle), x, y)
                else:
                    paste_center(canvas, side_back, x, y)
    canvas.save(OUT)
    print(OUT)
