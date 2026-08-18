#!/usr/bin/env python3
"""Assemble non-runtime page previews from isolated generated components."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
BG = ROOT / "backgrounds/images"
NORM = ROOT / "normalized"
PREVIEWS = ROOT / "previews"
TILES = ROOT.parents[0] / "tile-pack-v1/generated-v3/normalized"
W, H = 1024, 1536


def open_asset(path: Path, max_w: int | None = None, max_h: int | None = None) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    if max_w or max_h:
        image.thumbnail((max_w or image.width, max_h or image.height), Image.Resampling.LANCZOS)
    return image


def paste(canvas: Image.Image, image: Image.Image, cx: int, cy: int) -> None:
    canvas.alpha_composite(image, (round(cx - image.width / 2), round(cy - image.height / 2)))


def label(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, size: int = 28) -> None:
    draw.text(xy, text, fill="#5b2b34", font=ImageFont.load_default(size=size))


def page(name: str, title: str) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    canvas = Image.open(BG / f"{name}.png").convert("RGBA").resize((W, H), Image.Resampling.LANCZOS)
    return canvas, ImageDraw.Draw(canvas)


def title_lobby() -> None:
    canvas, draw = page("title-lobby", "title lobby")
    paste(canvas, open_asset(NORM / "title-brand.png", max_w=690, max_h=180), 512, 165)
    paste(canvas, open_asset(NORM / "avatar-frame.png", max_w=190, max_h=190), 155, 115)
    paste(canvas, open_asset(NORM / "currency-plaque.png", max_w=310, max_h=105), 800, 115)
    paste(canvas, open_asset(NORM / "mode-card.png", max_w=600, max_h=400), 512, 575)
    paste(canvas, open_asset(NORM / "mascot-guide.png", max_w=250, max_h=320), 760, 745)
    paste(canvas, open_asset(NORM / "bottom-nav-frame.png", max_w=880, max_h=170), 512, 1370)
    canvas.save(PREVIEWS / "page-title-lobby-v3.png")


def mode_map() -> None:
    canvas, draw = page("map", "mode map")
    paste(canvas, open_asset(NORM / "chapter-plaque.png", max_w=560, max_h=150), 512, 130)
    paste(canvas, open_asset(NORM / "star-progress.png", max_w=420, max_h=140), 512, 250)
    positions = [(365, 500), (655, 560), (500, 720), (350, 900), (675, 1050), (512, 1210)]
    nodes = ["node-normal", "node-event", "node-reward", "node-normal", "node-normal", "node-boss"]
    for index, (node, (x, y)) in enumerate(zip(nodes, positions)):
        max_size = 185 if node == "node-boss" else 155
        paste(canvas, open_asset(NORM / f"{node}.png", max_w=max_size, max_h=max_size), x, y)
        if node != "node-boss":
            label(draw, (x - 12, y - 14), str(index + 1), 30)
    paste(canvas, open_asset(NORM / "mascot-idle.png", max_w=210, max_h=265), 835, 1230)
    paste(canvas, open_asset(NORM / "bottom-nav-frame.png", max_w=880, max_h=170), 512, 1400)
    canvas.save(PREVIEWS / "page-mode-map-v3.png")


def gameplay() -> None:
    canvas, draw = page("gameplay", "gameplay")
    paste(canvas, open_asset(NORM / "hud-level.png", max_w=290, max_h=110), 170, 70)
    paste(canvas, open_asset(NORM / "hud-score.png", max_w=290, max_h=110), 500, 70)
    paste(canvas, open_asset(NORM / "hud-remaining.png", max_w=360, max_h=110), 850, 70)
    paste(canvas, open_asset(NORM / "counter-toggle.png", max_w=290, max_h=155), 160, 205)
    for i, name in enumerate(["tool-shuffle", "tool-undo", "tool-discard", "tool-vision"]):
        paste(canvas, open_asset(NORM / f"{name}.png", max_w=140, max_h=140), 895, 245 + i * 145)
    center_x, center_y = 512, 705
    tile_names = ["tile-back", "tile-back", "wan-01", "tiao-02", "tong-03", "honor-east", "honor-red", "honor-green"]
    positions = [(0, -260), (0, -175), (-155, -85), (-45, -85), (65, -85), (185, -85), (0, 15), (0, 105)]
    for tile, (dx, dy) in zip(tile_names, positions):
        paste(canvas, open_asset(TILES / f"{tile}.png", max_w=125, max_h=125), center_x + dx, center_y + dy)
    for x in range(8):
        paste(canvas, open_asset(NORM / "hand-slot.png", max_w=92, max_h=135), 155 + x * 102, 1330)
    actions = ["action-hu", "action-gang", "action-peng", "action-chi", "action-bugang"]
    xs = [155, 315, 475, 635, 850]
    for name, x in zip(actions, xs):
        max_w = 165 if name != "action-bugang" else 225
        paste(canvas, open_asset(NORM / f"{name}.png", max_w=max_w, max_h=120), x, 1165)
    paste(canvas, open_asset(NORM / "mascot-think.png", max_w=170, max_h=215), 870, 1020)
    canvas.save(PREVIEWS / "page-gameplay-v3.png")


def result() -> None:
    canvas, draw = page("result", "result")
    paste(canvas, open_asset(NORM / "victory-seal.png", max_w=250, max_h=250), 512, 230)
    paste(canvas, open_asset(NORM / "reward-card.png", max_w=310, max_h=440), 260, 720)
    paste(canvas, open_asset(NORM / "reward-card.png", max_w=310, max_h=440), 512, 700)
    paste(canvas, open_asset(NORM / "reward-card.png", max_w=310, max_h=440), 764, 720)
    paste(canvas, open_asset(NORM / "mascot-happy.png", max_w=250, max_h=320), 810, 1170)
    paste(canvas, open_asset(NORM / "hud-score.png", max_w=330, max_h=115), 230, 1170)
    paste(canvas, open_asset(NORM / "hud-score.png", max_w=330, max_h=115), 230, 1300)
    canvas.save(PREVIEWS / "page-result-v3.png")


def contact_sheet() -> None:
    names = ["page-title-lobby-v3", "page-mode-map-v3", "page-gameplay-v3", "page-result-v3"]
    thumb_w, thumb_h, gap, label_h = 320, 480, 20, 34
    sheet = Image.new("RGB", (gap + 4 * (thumb_w + gap), gap + thumb_h + label_h + gap), "#d99aa6")
    draw = ImageDraw.Draw(sheet)
    for index, name in enumerate(names):
        image = Image.open(PREVIEWS / f"{name}.png").convert("RGB")
        image.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        x = gap + index * (thumb_w + gap) + (thumb_w - image.width) // 2
        y = gap + (thumb_h - image.height) // 2
        sheet.paste(image, (x, y))
        draw.text((gap + index * (thumb_w + gap) + 8, gap + thumb_h + 10), name, fill="#5b2b34")
    sheet.save(PREVIEWS / "page-previews-v3.png")


def main() -> None:
    PREVIEWS.mkdir(parents=True, exist_ok=True)
    title_lobby()
    mode_map()
    gameplay()
    result()
    contact_sheet()
    print("assembled 4 page previews")


if __name__ == "__main__":
    main()
