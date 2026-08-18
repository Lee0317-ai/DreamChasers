#!/usr/bin/env python3
"""Build a labeled contact sheet for the T287 gap components."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
NORMALIZED = ROOT / "normalized"
BACKGROUND = ROOT / "backgrounds" / "images" / "loading.png"
OUT = ROOT / "previews" / "gap-components-v3.png"

CELL_W, CELL_H = 460, 430
COLS = 4
BG = (247, 243, 235)
LABEL_BG = (255, 252, 246)
TEXT = (94, 74, 58)

ITEMS = [
    "combo-choice-panel",
    "discard-rescue-panel",
    "archetype-card",
    "boss-health-bar",
    "btn-confirm",
    "btn-cancel",
    "btn-close",
    "btn-back",
    "toast-banner",
    "tutorial-highlight-frame",
    "result-stats-panel",
]


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for name in ("PingFang.ttc", "Hiragino Sans GB.ttc", "Arial Unicode.ttf"):
        path = Path("/System/Library/Fonts") / name
        if path.exists():
            try:
                return ImageFont.truetype(str(path), size)
            except OSError:
                continue
    return ImageFont.load_default()


def draw_component(draw: ImageDraw.ImageDraw, img: Image.Image, cell_x: int, cell_y: int) -> None:
    max_w, max_h = CELL_W - 40, CELL_H - 76
    ratio = min(max_w / img.width, max_h / img.height, 1.0)
    w, h = round(img.width * ratio), round(img.height * ratio)
    resized = img.resize((w, h), Image.LANCZOS)
    x = cell_x + (CELL_W - w) // 2
    y = cell_y + 16 + (max_h - h) // 2
    if resized.mode == "RGBA":
        sheet.paste(resized, (x, y), resized)
    else:
        sheet.paste(resized, (x, y))


rows = 3
sheet = Image.new("RGB", (COLS * CELL_W, rows * CELL_H), BG)
draw = ImageDraw.Draw(sheet)
font = load_font(22)

items = [(name, NORMALIZED / f"{name}.png") for name in ITEMS]
items.append(("loading-screen (background)", BACKGROUND))

for idx, (name, path) in enumerate(items):
    col, row = idx % COLS, idx // COLS
    x, y = col * CELL_W, row * CELL_H
    draw.rectangle([x + 8, y + 8, x + CELL_W - 8, y + CELL_H - 8], outline=(226, 214, 196), width=2)
    img = Image.open(path).convert("RGBA")
    draw_component(draw, img, x, y)
    label = name
    bbox = draw.textbbox((0, 0), label, font=font)
    tw = bbox[2] - bbox[0]
    draw.rectangle([x + 16, y + CELL_H - 52, x + tw + 30, y + CELL_H - 18], fill=LABEL_BG)
    draw.text((x + 23, y + CELL_H - 47), label, fill=TEXT, font=font)

OUT.parent.mkdir(parents=True, exist_ok=True)
sheet.save(OUT)
print(f"saved {OUT} ({sheet.width}x{sheet.height})")
