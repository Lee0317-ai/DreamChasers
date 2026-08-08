#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import random
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[3]
SOURCE_DIR = ROOT / "output/hulebu-ui-assets/hulebu-ui-component-sources"
SPEC_SHEET = SOURCE_DIR / "ui-components-spec-sheet.png"
GAMEPLAY_SHEET = SOURCE_DIR / "hulebu-gameplay-ui-reference.png"
TILE_ROOT = ROOT / "output/hulebu-ui-assets/hulebu-master-tile-pack-v7-clean-template-dots/base"
OUT_DIR = ROOT / "output/hulebu-ui-assets/hulebu-ui-component-pack-v4-redesigned-style"
PACK_NAME = "hulebu-ui-component-pack-v4-redesigned-style"

FONT_CN = "/System/Library/Fonts/STHeiti Medium.ttc"
FONT_CN_LIGHT = "/System/Library/Fonts/STHeiti Light.ttc"
FONT_EN = "/System/Library/Fonts/Avenir Next.ttc"

GREEN = (28, 83, 57, 255)
GREEN_DARK = (12, 47, 36, 255)
GREEN_LIGHT = (76, 130, 88, 255)
GOLD = (205, 153, 70, 255)
GOLD_LIGHT = (246, 215, 132, 255)
GOLD_DARK = (103, 68, 28, 255)
PAPER = (235, 221, 185, 255)
PAPER_DARK = (199, 177, 133, 255)
WOOD = (82, 49, 29, 255)
WOOD_DARK = (31, 19, 14, 255)
RED = (142, 38, 29, 255)


def ensure_dirs() -> None:
    for sub in [
        "source",
        "hud",
        "buttons/combo",
        "buttons/tools",
        "combo-choice",
        "slots",
        "panels",
        "cards",
        "preview",
    ]:
        (OUT_DIR / sub).mkdir(parents=True, exist_ok=True)


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def cn(size: int) -> ImageFont.FreeTypeFont:
    return font(FONT_CN, size)


def cn_light(size: int) -> ImageFont.FreeTypeFont:
    return font(FONT_CN_LIGHT, size)


def en(size: int) -> ImageFont.FreeTypeFont:
    return font(FONT_EN, size)


def text_center(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    fill: tuple[int, int, int, int],
    text_font: ImageFont.ImageFont,
    stroke_width: int = 0,
    stroke_fill: tuple[int, int, int, int] | None = None,
) -> None:
    bbox = draw.textbbox((0, 0), text, font=text_font, stroke_width=stroke_width)
    width = bbox[2] - bbox[0]
    height = bbox[3] - bbox[1]
    draw.text(
        (xy[0] - width / 2 - bbox[0], xy[1] - height / 2 - bbox[1]),
        text,
        fill=fill,
        font=text_font,
        stroke_width=stroke_width,
        stroke_fill=stroke_fill,
    )


def gradient_rect(size: tuple[int, int], top, bottom) -> Image.Image:
    width, height = size
    image = Image.new("RGBA", size)
    pixels = image.load()
    for y in range(height):
        t = y / max(1, height - 1)
        color = tuple(round(top[i] * (1 - t) + bottom[i] * t) for i in range(4))
        for x in range(width):
            pixels[x, y] = color
    return image


def add_noise(image: Image.Image, amount: int = 18, seed: int = 1) -> Image.Image:
    rng = random.Random(seed)
    out = image.copy().convert("RGBA")
    pixels = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            n = rng.randint(-amount, amount)
            pixels[x, y] = (
                max(0, min(255, r + n)),
                max(0, min(255, g + n)),
                max(0, min(255, b + n)),
                a,
            )
    return out


def shadowed(base: Image.Image, shadow_offset: tuple[int, int] = (0, 8), blur: int = 10) -> Image.Image:
    alpha = base.getchannel("A")
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    shadow_alpha = alpha.filter(ImageFilter.GaussianBlur(blur))
    shadow.putalpha(shadow_alpha.point(lambda value: round(value * 0.38)))
    out = Image.new("RGBA", (base.width + 24, base.height + 28), (0, 0, 0, 0))
    out.alpha_composite(shadow, (12 + shadow_offset[0], 10 + shadow_offset[1]))
    out.alpha_composite(base, (12, 10))
    return out


def draw_gold_frame(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], radius: int, width: int = 5) -> None:
    for index, color in enumerate([GOLD_DARK, GOLD_LIGHT, GOLD, GOLD_DARK]):
        inset = index * 2
        draw.rounded_rectangle(
            (box[0] + inset, box[1] + inset, box[2] - inset, box[3] - inset),
            radius=max(1, radius - inset),
            outline=color,
            width=max(1, width - index),
        )


def draw_corner_flourish(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color=GOLD_LIGHT) -> None:
    x0, y0, x1, y1 = box
    for sx, sy in [(1, 1), (-1, 1), (1, -1), (-1, -1)]:
        cx = x0 + 24 if sx == 1 else x1 - 24
        cy = y0 + 24 if sy == 1 else y1 - 24
        draw.ellipse((cx - 8, cy - 8, cx + 8, cy + 8), outline=color, width=3)
        ax0, ay0 = cx - 18 * sx, cy - 18 * sy
        ax1, ay1 = cx + 28 * sx, cy + 28 * sy
        draw.arc((min(ax0, ax1), min(ay0, ay1), max(ax0, ax1), max(ay0, ay1)), 0, 270, fill=color, width=2)


def material_panel(
    size: tuple[int, int],
    fill_top,
    fill_bottom,
    radius: int = 24,
    seed: int = 1,
    frame_width: int = 5,
) -> Image.Image:
    width, height = size
    panel = Image.new("RGBA", size, (0, 0, 0, 0))
    mask = Image.new("L", size, 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle((8, 8, width - 8, height - 8), radius=radius, fill=255)
    fill = add_noise(gradient_rect(size, fill_top, fill_bottom), seed=seed)
    panel.alpha_composite(fill)
    panel.putalpha(mask)
    draw = ImageDraw.Draw(panel)
    draw_gold_frame(draw, (8, 8, width - 8, height - 8), radius, frame_width)
    draw_corner_flourish(draw, (8, 8, width - 8, height - 8))
    return shadowed(panel)


def crop_circle(source: Image.Image, box: tuple[int, int, int, int], diameter: int) -> Image.Image:
    crop = source.crop(box).resize((diameter, diameter), Image.Resampling.LANCZOS).convert("RGBA")
    mask = Image.new("L", (diameter, diameter), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, diameter - 1, diameter - 1), fill=255)
    crop.putalpha(mask)
    return crop


def load_tile(name: str, height: int) -> Image.Image:
    tile = Image.open(TILE_ROOT / name).convert("RGBA")
    scale = height / tile.height
    return tile.resize((round(tile.width * scale), height), Image.Resampling.LANCZOS)


def save(path: str, image: Image.Image, entries: list[dict[str, object]], name: str, kind: str = "redesigned") -> None:
    target = OUT_DIR / path
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target)
    entries.append({"name": name, "kind": kind, "path": path, "alpha": alpha_stats(image)})


def alpha_stats(image: Image.Image) -> dict[str, object]:
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    hist = alpha.histogram()
    total = rgba.width * rgba.height
    return {
        "size": [rgba.width, rgba.height],
        "transparentRatio": round(hist[0] / total, 4),
        "partialAlphaRatio": round(sum(hist[1:255]) / total, 4),
        "alphaBbox": list(alpha.getbbox() or (0, 0, 0, 0)),
    }


def make_level_badge() -> Image.Image:
    image = material_panel((400, 170), GREEN_LIGHT, GREEN_DARK, 30, 11)
    draw = ImageDraw.Draw(image)
    text_center(draw, (image.width // 2, 62), "关卡", GOLD_LIGHT, cn(32), 1, GOLD_DARK)
    text_center(draw, (image.width // 2, 113), "3-1", (242, 225, 166, 255), en(58), 2, (42, 30, 18, 255))
    tassel = Image.new("RGBA", image.size, (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(tassel)
    cx, cy = image.width // 2, 161
    tdraw.line((cx, cy - 8, cx, cy + 32), fill=GOLD, width=3)
    tdraw.ellipse((cx - 7, cy + 15, cx + 7, cy + 29), fill=GREEN_LIGHT, outline=GOLD_DARK, width=2)
    for dx in [-14, -7, 0, 7, 14]:
        tdraw.line((cx, cy + 29, cx + dx, cy + 58), fill=(138, 35, 20, 255), width=3)
    image.alpha_composite(tassel)
    return image


def make_score_badge() -> Image.Image:
    image = material_panel((330, 138), (244, 231, 199, 255), PAPER, 18, 12)
    draw = ImageDraw.Draw(image)
    text_center(draw, (image.width // 2, 54), "分数", (58, 42, 27, 255), cn(28))
    text_center(draw, (image.width // 2, 101), "1280", GREEN, en(58))
    return image


def make_counter_wide() -> Image.Image:
    image = material_panel((740, 158), PAPER, (220, 202, 161, 255), 14, 13)
    draw = ImageDraw.Draw(image)
    header = material_panel((230, 48), GREEN_LIGHT, GREEN_DARK, 18, 14, 3)
    image.alpha_composite(header, ((image.width - header.width) // 2, 4))
    text_center(draw, (image.width // 2, 38), "记牌器", GOLD_LIGHT, cn(28), 1, GOLD_DARK)
    labels = [("万", "12", (137, 23, 27, 255)), ("筒", "8", GREEN), ("条", "10", GREEN), ("风", "4", (38, 38, 38, 255)), ("箭", "3", (137, 23, 27, 255)), ("花", "0", (38, 38, 38, 255))]
    start = 85
    gap = 112
    for index, (label, count, color) in enumerate(labels):
        x = start + index * gap
        if index:
            draw.line((x - 49, 66, x - 49, 128), fill=(151, 126, 84, 180), width=2)
        text_center(draw, (x, 82), label, color, cn(24))
        text_center(draw, (x, 116), count, color, en(30))
    return image


def make_combo_button(label: str, fire: bool) -> Image.Image:
    w, h = (196, 142) if fire else (178, 124)
    image = Image.new("RGBA", (w + 36, h + 34), (0, 0, 0, 0))
    if fire:
        rng = random.Random(label)
        glow = Image.new("RGBA", image.size, (0, 0, 0, 0))
        gdraw = ImageDraw.Draw(glow)
        for angle in range(0, 360, 8):
            radius = rng.randint(4, 10)
            x = image.width // 2 + math.cos(math.radians(angle)) * (w / 2 + rng.randint(-6, 5))
            y = image.height // 2 + math.sin(math.radians(angle)) * (h / 2 + rng.randint(-4, 6))
            gdraw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(255, 129, 28, 150))
        image.alpha_composite(glow.filter(ImageFilter.GaussianBlur(3)))
    panel = material_panel((w, h), GREEN_LIGHT, GREEN_DARK, 18, 20 + len(label), 4)
    image.alpha_composite(panel, ((image.width - panel.width) // 2, (image.height - panel.height) // 2))
    draw = ImageDraw.Draw(image)
    text_center(draw, (image.width // 2, image.height // 2 + 2), label, GOLD_LIGHT, cn(50 if len(label) == 1 else 42), 2, GOLD_DARK)
    return image


def draw_tool_icon(draw: ImageDraw.ImageDraw, kind: str, center: tuple[int, int]) -> None:
    cx, cy = center
    cream = (236, 218, 175, 255)
    if kind == "shuffle":
        draw.arc((cx - 28, cy - 28, cx + 28, cy + 28), 30, 205, fill=cream, width=8)
        draw.arc((cx - 28, cy - 28, cx + 28, cy + 28), 210, 25, fill=cream, width=8)
        draw.polygon([(cx - 34, cy + 1), (cx - 49, cy - 2), (cx - 38, cy - 15)], fill=cream)
        draw.polygon([(cx + 34, cy - 1), (cx + 49, cy + 2), (cx + 38, cy + 15)], fill=cream)
    elif kind == "undo":
        draw.arc((cx - 24, cy - 22, cx + 30, cy + 34), 195, 15, fill=cream, width=11)
        draw.polygon([(cx - 28, cy - 15), (cx - 58, cy - 15), (cx - 42, cy - 34)], fill=cream)
    elif kind == "hint":
        draw.ellipse((cx - 55, cy - 30, cx + 55, cy + 30), outline=cream, width=10)
        draw.ellipse((cx - 18, cy - 18, cx + 18, cy + 18), fill=cream)
    elif kind == "buff":
        for angle in range(0, 360, 60):
            px = cx + math.cos(math.radians(angle)) * 22
            py = cy + math.sin(math.radians(angle)) * 22
            draw.ellipse((px - 18, py - 25, px + 18, py + 25), fill=GOLD_LIGHT, outline=GOLD_DARK, width=2)
        draw.ellipse((cx - 9, cy - 9, cx + 9, cy + 9), fill=GREEN, outline=GOLD_DARK, width=2)
    elif kind == "counter":
        for y in [-18, 0, 18]:
            draw.rounded_rectangle((cx - 34, cy + y - 5, cx + 34, cy + y + 5), radius=4, fill=cream)
            draw.ellipse((cx - 50, cy + y - 7, cx - 36, cy + y + 7), fill=cream)


def make_tool_button(kind: str, label: str, count: int | None = None) -> Image.Image:
    image = Image.new("RGBA", (184, 188), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    cx, cy = 92, 78
    draw.ellipse((22, 8, 162, 148), fill=GREEN, outline=GOLD_DARK, width=7)
    draw.ellipse((29, 15, 155, 141), outline=GOLD_LIGHT, width=3)
    draw_tool_icon(draw, kind, (cx, cy))
    draw.rounded_rectangle((38, 124, 146, 172), radius=12, fill=(39, 35, 23, 255), outline=GOLD_DARK, width=5)
    draw.rounded_rectangle((43, 129, 141, 167), radius=9, outline=GOLD_LIGHT, width=2)
    text_font = en(30) if label == "Buff" else cn(28)
    text_center(draw, (92, 148), label, GOLD_LIGHT, text_font, 1, GOLD_DARK)
    if count is not None:
        draw.ellipse((132, 106, 178, 152), fill=RED, outline=GOLD_LIGHT, width=3)
        text_center(draw, (155, 129), str(count), (255, 239, 194, 255), en(28), 1, (80, 20, 16, 255))
    return shadowed(image, (0, 4), 7)


def make_slots(count: int, label: str | None = None) -> Image.Image:
    cell_w, cell_h = 58, 88
    gap = 6
    width = 54 + count * cell_w + (count - 1) * gap
    height = 124
    image = Image.new("RGBA", (width + 26, height + 26), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    outer = (13, 13, width + 13, height + 13)
    draw.rounded_rectangle(outer, radius=24, fill=WOOD_DARK, outline=GOLD_DARK, width=6)
    draw.rounded_rectangle((outer[0] + 8, outer[1] + 8, outer[2] - 8, outer[3] - 8), radius=18, outline=GOLD_LIGHT, width=2)
    if label:
        draw.rounded_rectangle((28, 39, 116, 92), radius=8, fill=(63, 37, 22, 255), outline=GOLD, width=2)
        text_center(draw, (72, 65), label, GOLD_LIGHT, cn(24))
        start_x = 124
    else:
        start_x = 36
    for i in range(count):
        x = start_x + i * (cell_w + gap)
        fill = add_noise(Image.new("RGBA", (cell_w, cell_h), WOOD), 18, 80 + i)
        mask = Image.new("L", (cell_w, cell_h), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, cell_w - 1, cell_h - 1), radius=10, fill=255)
        fill.putalpha(mask)
        image.alpha_composite(fill, (x, 31))
        draw.rounded_rectangle((x, 31, x + cell_w, 31 + cell_h), radius=10, outline=(161, 103, 48, 255), width=3)
    return image


def make_buff_panel() -> Image.Image:
    image = material_panel((330, 500), (238, 223, 190, 255), (219, 201, 160, 255), 18, 50)
    draw = ImageDraw.Draw(image)
    title = material_panel((210, 58), GREEN_LIGHT, GREEN_DARK, 18, 51, 3)
    image.alpha_composite(title, ((image.width - title.width) // 2, 28))
    text_center(draw, (image.width // 2, 68), "已获得 Buff", GOLD_LIGHT, cn(25), 1, GOLD_DARK)
    buffs = [("连消强化", "每次连消3张或以上\\n得分 +10%", GREEN), ("得分加成", "本局得分 +20%", RED), ("槽位扩展", "槽位上限 +1", (45, 94, 116, 255))]
    for i, (name, desc, color) in enumerate(buffs):
        y = 122 + i * 118
        draw.rounded_rectangle((34, y, image.width - 34, y + 100), radius=12, fill=(244, 232, 200, 230), outline=PAPER_DARK, width=2)
        draw.ellipse((52, y + 18, 112, y + 78), fill=color, outline=GOLD_LIGHT, width=3)
        text_center(draw, (162, y + 31), name, (42, 31, 20, 255), cn(22))
        for line_index, line in enumerate(desc.split("\\n")):
            text_center(draw, (173, y + 58 + line_index * 22), line, (63, 48, 31, 255), cn_light(17))
        draw.ellipse((260, y + 35, 305, y + 80), fill=(97, 57, 24, 255), outline=GOLD_LIGHT, width=2)
        text_center(draw, (282, y + 58), f"Lv.{2 if i == 0 else 1}", GOLD_LIGHT, en(16))
    return image


def make_reward_card(title: str, body: str, accent, icon: str) -> Image.Image:
    image = material_panel((200, 260), (246, 234, 204, 255), (229, 211, 169, 255), 18, 60 + len(title), 4)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((28, 28, image.width - 28, 62), radius=10, fill=(247, 237, 206, 210), outline=accent, width=3)
    text_center(draw, (image.width // 2, 45), title, accent, cn(21), 1, (250, 238, 196, 255))
    draw.ellipse((54, 82, 146, 174), fill=accent, outline=GOLD_LIGHT, width=5)
    if icon == "tiles":
        t1 = load_tile("tile_wan_03.png", 55)
        t2 = load_tile("tile_wan_04.png", 55)
        image.alpha_composite(t1.rotate(-11, expand=True), (63, 104))
        image.alpha_composite(t2.rotate(12, expand=True), (101, 92))
    elif icon == "score":
        text_center(draw, (100, 128), "分", GOLD_LIGHT, cn(42), 2, GOLD_DARK)
    else:
        draw.rounded_rectangle((72, 112, 128, 150), radius=6, fill=WOOD, outline=GOLD_LIGHT, width=3)
        draw.ellipse((122, 138, 158, 174), fill=(99, 142, 96, 255), outline=GOLD_LIGHT, width=3)
        text_center(draw, (140, 156), "+", GOLD_LIGHT, en(28))
    for index, line in enumerate(body.split("\\n")):
        text_center(draw, (image.width // 2, 198 + index * 24), line, (54, 39, 25, 255), cn_light(18))
    return image


def make_scene_card(source: Image.Image, name: str, status: str, accent, thumb_box: tuple[int, int, int, int]) -> Image.Image:
    image = material_panel((170, 300), (246, 234, 204, 255), (226, 208, 167, 255), 18, 80 + len(name), 4)
    draw = ImageDraw.Draw(image)
    thumb = crop_circle(source, thumb_box, 96)
    draw.ellipse((37, 55, 133, 151), fill=accent, outline=GOLD_LIGHT, width=4)
    image.alpha_composite(thumb, (37, 55))
    text_center(draw, (image.width // 2, 184), name, accent, cn(25), 1, (247, 237, 204, 255))
    draw.rounded_rectangle((47, 212, 123, 250), radius=8, fill=accent, outline=GOLD_LIGHT, width=2)
    text_center(draw, (85, 231), status, (247, 237, 204, 255), cn(17))
    return image


def make_combo_choice_panel(with_tiles: tuple[str, list[str]] | None = None) -> Image.Image:
    image = material_panel((500, 100), (245, 232, 199, 255), (228, 208, 166, 255), 14, 90, 4)
    draw = ImageDraw.Draw(image)
    for x in [image.width // 3, image.width * 2 // 3]:
        draw.line((x, 34, x, 98), fill=(151, 112, 61, 180), width=2)
    centers = [image.width // 6, image.width // 2, image.width * 5 // 6]
    if with_tiles:
        for center_x, tile_name in zip(centers, with_tiles[1]):
            tile = load_tile(tile_name, 68)
            image.alpha_composite(tile, (center_x - tile.width // 2, 32))
    return image


def checkerboard(size: tuple[int, int], cell: int = 12) -> Image.Image:
    image = Image.new("RGBA", size, (255, 255, 255, 255))
    draw = ImageDraw.Draw(image)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            color = (224, 224, 224, 255) if (x // cell + y // cell) % 2 else (248, 248, 248, 255)
            draw.rectangle((x, y, x + cell - 1, y + cell - 1), fill=color)
    return image


def render_contact_sheet(entries: list[dict[str, object]]) -> None:
    thumbs = []
    for entry in entries:
        image = Image.open(OUT_DIR / str(entry["path"])).convert("RGBA")
        image.thumbnail((180, 158), Image.Resampling.LANCZOS)
        tile = checkerboard((220, 202))
        tile.alpha_composite(image, ((220 - image.width) // 2, 12))
        draw = ImageDraw.Draw(tile)
        draw.text((10, 176), str(entry["name"])[:30], fill=(38, 38, 38, 255), font=ImageFont.load_default())
        thumbs.append(tile)
    columns = 4
    rows = math.ceil(len(thumbs) / columns)
    sheet = checkerboard((columns * 220, rows * 202))
    for index, tile in enumerate(thumbs):
        sheet.alpha_composite(tile, ((index % columns) * 220, (index // columns) * 202))
    sheet.save(OUT_DIR / "preview/contact-sheet.png")


def main() -> None:
    ensure_dirs()
    shutil.copyfile(SPEC_SHEET, OUT_DIR / "source/ui-components-spec-sheet.png")
    shutil.copyfile(GAMEPLAY_SHEET, OUT_DIR / "source/hulebu-gameplay-ui-reference.png")
    source = Image.open(GAMEPLAY_SHEET).convert("RGBA")
    entries: list[dict[str, object]] = []

    save("hud/level_badge.png", make_level_badge(), entries, "level_badge")
    save("hud/score_badge.png", make_score_badge(), entries, "score_badge")
    save("hud/tile_counter_wide.png", make_counter_wide(), entries, "tile_counter_wide")

    for label, key in [("吃", "chi"), ("碰", "peng"), ("杠", "gang"), ("补杠", "bugang")]:
        save(f"buttons/combo/action_{key}_normal.png", make_combo_button(label, False), entries, f"combo_{key}_normal")
        save(f"buttons/combo/action_{key}_fire.png", make_combo_button(label, True), entries, f"combo_{key}_fire")

    save("buttons/tools/tool_shuffle.png", make_tool_button("shuffle", "洗牌", 3), entries, "tool_shuffle")
    save("buttons/tools/tool_undo.png", make_tool_button("undo", "撤回", 3), entries, "tool_undo")
    save("buttons/tools/tool_hint.png", make_tool_button("hint", "提示", 3), entries, "tool_hint")
    save("buttons/tools/tool_buff.png", make_tool_button("buff", "Buff", 2), entries, "tool_buff")
    save("buttons/tools/tool_counter.png", make_tool_button("counter", "记牌器", None), entries, "tool_counter")

    save("slots/discard_slots.png", make_slots(3, "弃牌区"), entries, "discard_slots")
    save("slots/hand_slots_8.png", make_slots(8, None), entries, "hand_slots_8")
    save("panels/buff_drawer_panel.png", make_buff_panel(), entries, "buff_drawer_panel")

    save("cards/reward_combo_strength.png", make_reward_card("连消强化", "每次连消3张或以上\\n得分 +10%", GREEN, "tiles"), entries, "reward_card_combo")
    save("cards/reward_score_bonus.png", make_reward_card("得分加成", "本局得分\\n+20%", RED, "score"), entries, "reward_card_score")
    save("cards/reward_slot_expand.png", make_reward_card("槽位扩展", "槽位上限\\n+1", (45, 94, 116, 255), "slot"), entries, "reward_card_slot")

    scenes = [
        ("scene_skin_east_card", "东风场", "已拥有", GREEN, (39, 1388, 119, 1468), "cards/scene_skin_east_card.png"),
        ("scene_skin_south_card", "南风场", "未解锁", (151, 61, 42, 255), (183, 1388, 263, 1468), "cards/scene_skin_south_card.png"),
        ("scene_skin_west_card", "西风场", "未解锁", (126, 72, 28, 255), (326, 1388, 406, 1468), "cards/scene_skin_west_card.png"),
        ("scene_skin_north_card", "北风场", "未解锁", (50, 75, 103, 255), (475, 1388, 555, 1468), "cards/scene_skin_north_card.png"),
    ]
    for component_name, scene_name, status, accent, box, path in scenes:
        save(path, make_scene_card(source, scene_name, status, accent, box), entries, component_name)

    panel = make_combo_choice_panel()
    save("combo-choice/panel_bg.png", panel, entries, "combo_choice_panel_bg")
    preview_sets = [
        ("combo_choice_preview_wan_03_04_05", ["tile_wan_03.png", "tile_wan_04.png", "tile_wan_05.png"]),
        ("combo_choice_preview_wan_04_05_06", ["tile_wan_04.png", "tile_wan_05.png", "tile_wan_06.png"]),
    ]
    for name, tiles in preview_sets:
        save(f"combo-choice/{name}.png", make_combo_choice_panel((name, tiles)), entries, name)

    render_contact_sheet(entries)

    manifest = {
        "name": PACK_NAME,
        "sourceImages": {
            "styleReference": "source/ui-components-spec-sheet.png",
            "gameplayReference": "source/hulebu-gameplay-ui-reference.png",
            "tilePack": "../hulebu-master-tile-pack-v7-clean-template-dots/base",
        },
        "notes": [
            "This is a redesigned UI kit based on the reference style, not a crop-only extraction.",
            "All formal components are transparent RGBA PNGs with complete silhouettes.",
            "Scene skin cards are rebuilt as complete cards and use reference thumbnail crops only inside the circular preview.",
            "This pack is not wired into Web or Cocos runtime yet.",
        ],
        "components": entries,
    }
    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT_DIR / "alpha-report.json").write_text(
        json.dumps(
            {
                "pack": PACK_NAME,
                "components": [{"name": entry["name"], "path": entry["path"], "alpha": entry["alpha"]} for entry in entries],
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"wrote {OUT_DIR}")


if __name__ == "__main__":
    main()
