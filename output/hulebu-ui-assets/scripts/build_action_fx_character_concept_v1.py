#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "output/hulebu-ui-assets/hulebu-action-fx-character-concept-v1"
TILE_DIR = (
    ROOT
    / "output/hulebu-ui-assets/hulebu-ui-component-pack-v6-source-faithful-transparent-tiles/tiles/mahjong"
)
FONT_PATH = Path("/System/Library/Fonts/Supplemental/Songti.ttc")


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_PATH), size=size)


def ensure_dirs() -> None:
    for sub in ["preview", "stickers", "characters", "frames"]:
        (OUT_DIR / sub).mkdir(parents=True, exist_ok=True)


def checkerboard(size: tuple[int, int], cell: int = 16) -> Image.Image:
    image = Image.new("RGBA", size, (255, 255, 255, 255))
    draw = ImageDraw.Draw(image)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            color = (224, 224, 224, 255) if (x // cell + y // cell) % 2 else (248, 248, 248, 255)
            draw.rectangle((x, y, x + cell - 1, y + cell - 1), fill=color)
    return image


def text_center(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], text: str, fill, fnt) -> None:
    bbox = draw.textbbox((0, 0), text, font=fnt)
    x = box[0] + (box[2] - box[0] - (bbox[2] - bbox[0])) // 2
    y = box[1] + (box[3] - box[1] - (bbox[3] - bbox[1])) // 2
    draw.text((x, y), text, fill=fill, font=fnt)


def add_glow(base: Image.Image, source: Image.Image, xy: tuple[int, int], radius: int = 18, color=(246, 190, 82, 120)) -> None:
    alpha = source.getchannel("A")
    glow = Image.new("RGBA", source.size, color)
    glow.putalpha(alpha.filter(ImageFilter.GaussianBlur(radius)))
    base.alpha_composite(glow, xy)
    base.alpha_composite(source, xy)


def create_action_sticker(name: str, text: str, scale: str, palette: tuple[tuple[int, int, int, int], tuple[int, int, int, int]]) -> dict[str, object]:
    sizes = {
        "small": (280, 150, 72),
        "medium": (360, 190, 92),
        "large": (520, 280, 142),
    }
    width, height, font_size = sizes[scale]
    image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    shadow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle((28, 34, width - 28, height - 30), radius=34, fill=(20, 44, 34, 180))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    image.alpha_composite(shadow)

    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((22, 26, width - 22, height - 36), radius=32, fill=palette[0], outline=(227, 179, 86, 255), width=5)
    draw.rounded_rectangle((36, 40, width - 36, height - 50), radius=24, outline=(255, 235, 167, 170), width=2)
    for inset, alpha in ((8, 90), (16, 60), (24, 35)):
        draw.rounded_rectangle(
            (22 - inset, 26 - inset, width - 22 + inset, height - 36 + inset),
            radius=38 + inset,
            outline=(255, 160, 48, alpha),
            width=3,
        )
    fnt = font(font_size)
    bbox = draw.textbbox((0, 0), text, font=fnt)
    x = (width - (bbox[2] - bbox[0])) // 2
    y = (height - (bbox[3] - bbox[1])) // 2 - 14
    draw.text((x + 3, y + 4), text, fill=(72, 39, 19, 210), font=fnt)
    draw.text((x, y), text, fill=palette[1], font=fnt)

    path = OUT_DIR / f"stickers/action_{name}_callout.png"
    image.save(path)
    return {
        "name": f"action_{name}_callout",
        "path": str(path.relative_to(OUT_DIR)),
        "size": [width, height],
        "role": "transparent operation word sticker",
    }


def create_character(name: str, robe: tuple[int, int, int, int], accent: tuple[int, int, int, int]) -> dict[str, object]:
    image = Image.new("RGBA", (520, 760), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    aura = Image.new("RGBA", image.size, (0, 0, 0, 0))
    aura_draw = ImageDraw.Draw(aura)
    aura_draw.ellipse((72, 40, 472, 720), fill=(248, 216, 148, 55))
    aura = aura.filter(ImageFilter.GaussianBlur(38))
    image.alpha_composite(aura)

    # Hair and head.
    draw.ellipse((214, 92, 304, 184), fill=(238, 212, 178, 255))
    draw.pieslice((178, 56, 340, 210), 190, 350, fill=(32, 28, 26, 255))
    draw.ellipse((184, 68, 244, 132), fill=(28, 24, 22, 255))
    draw.ellipse((278, 64, 340, 130), fill=(28, 24, 22, 255))
    draw.line((198, 82, 118, 28), fill=(230, 184, 94, 210), width=4)
    draw.line((318, 82, 396, 30), fill=(230, 184, 94, 210), width=4)

    # Robe silhouette.
    draw.polygon([(260, 170), (108, 690), (420, 690)], fill=robe)
    draw.polygon([(142, 292), (40, 528), (176, 486), (238, 184)], fill=tuple(max(0, c - 18) for c in robe[:3]) + (230,))
    draw.polygon([(376, 294), (500, 500), (352, 478), (286, 184)], fill=tuple(max(0, c - 10) for c in robe[:3]) + (230,))
    draw.polygon([(260, 170), (214, 680), (306, 680)], fill=(248, 229, 190, 210))
    draw.line((226, 194, 156, 654), fill=accent, width=7)
    draw.line((292, 194, 360, 654), fill=accent, width=7)
    draw.arc((102, 338, 420, 714), 206, 334, fill=(255, 235, 172, 160), width=5)

    # Fan / tile gesture.
    fan = [(352, 348), (472, 300), (462, 432)]
    draw.polygon(fan, fill=(238, 219, 176, 245), outline=(203, 154, 74, 255))
    for i in range(5):
        draw.line((366, 358, 442 + i * 5, 316 + i * 20), fill=(156, 102, 50, 130), width=2)
    draw.rounded_rectangle((88, 428, 158, 520), radius=10, fill=(246, 227, 183, 245), outline=(34, 99, 68, 220), width=3)
    draw.text((106, 442), "胡", fill=(142, 38, 31, 240), font=font(42))

    path = OUT_DIR / f"characters/{name}_court_lady_cutin.png"
    image.save(path)
    return {
        "name": f"{name}_court_lady_cutin",
        "path": str(path.relative_to(OUT_DIR)),
        "size": [image.width, image.height],
        "role": "transparent restrained guofeng character cut-in placeholder",
    }


def load_tile(group: str, filename: str, height: int) -> Image.Image:
    tile = Image.open(TILE_DIR / group / filename).convert("RGBA")
    scale = height / tile.height
    return tile.resize((round(tile.width * scale), height), Image.Resampling.LANCZOS)


def draw_panel(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], title: str, subtitle: str) -> None:
    draw.rounded_rectangle(box, radius=28, fill=(20, 56, 48, 228), outline=(215, 170, 84, 255), width=3)
    draw.rounded_rectangle((box[0] + 10, box[1] + 10, box[2] - 10, box[3] - 10), radius=22, outline=(247, 225, 160, 80), width=2)
    draw.text((box[0] + 28, box[1] + 22), title, fill=(255, 231, 166, 255), font=font(34))
    draw.text((box[0] + 30, box[1] + 68), subtitle, fill=(219, 211, 184, 220), font=font(19))


def render_concept_board(entries: list[dict[str, object]]) -> None:
    board = Image.new("RGBA", (1536, 1024), (16, 58, 54, 255))
    draw = ImageDraw.Draw(board)
    for y in range(0, 1024, 34):
        draw.line((0, y, 1536, y + 60), fill=(255, 255, 255, 9), width=1)
    for x in range(0, 1536, 42):
        draw.line((x, 0, x + 80, 1024), fill=(0, 0, 0, 12), width=1)

    draw.text((54, 38), "胡了卜｜国风克制操作演出概念", fill=(255, 235, 175, 255), font=font(48))
    draw.text((58, 100), "人物只在杠 / 补杠 / 胡等高价值操作出现；碰 / 吃保留轻贴图，避免拖慢牌局节奏。", fill=(225, 218, 196, 230), font=font(23))

    draw_panel(draw, (54, 150, 968, 884), "胡：最大演出", "短暂停顿 + 右侧掌局人 cut-in + 8 张牌亮起 + 金色“胡了”贴图")
    draw_panel(draw, (1006, 150, 1484, 462), "杠：中强演出", "四张牌合拢，金波扫过，人物侧影轻出")
    draw_panel(draw, (1006, 490, 1484, 756), "补杠：升级演出", "明碰区升格，贴图更小，节奏更快")
    draw_panel(draw, (1006, 790, 1484, 970), "碰 / 吃：轻演出", "小字牌吸附，轻、快、无人物")

    east = Image.open(OUT_DIR / "characters/east_court_lady_cutin.png").convert("RGBA")
    north = Image.open(OUT_DIR / "characters/north_court_lady_cutin.png").convert("RGBA")
    character = east.resize((330, 482), Image.Resampling.LANCZOS)
    board.alpha_composite(character, (624, 316))

    hu = Image.open(OUT_DIR / "stickers/action_hu_callout.png").convert("RGBA")
    add_glow(board, hu, (250, 274), radius=20, color=(255, 190, 72, 100))
    tile_names = [
        ("wan", "tile_wan_03.png"),
        ("wan", "tile_wan_03.png"),
        ("wan", "tile_wan_03.png"),
        ("dot", "tile_dot_05.png"),
        ("dot", "tile_dot_06.png"),
        ("dot", "tile_dot_07.png"),
        ("honor", "tile_honor_east.png"),
        ("honor", "tile_honor_east.png"),
    ]
    points = [(170, 590), (250, 552), (330, 590), (438, 552), (518, 590), (598, 552), (310, 700), (432, 700)]
    for index, ((group, name), point) in enumerate(zip(tile_names, points)):
        tile = load_tile(group, name, 118)
        aura = Image.new("RGBA", tile.size, (255, 203, 89, 85 if index < 6 else 65))
        aura.putalpha(tile.getchannel("A").filter(ImageFilter.GaussianBlur(10)))
        board.alpha_composite(aura, point)
        board.alpha_composite(tile, point)
    draw.text((142, 828), "节奏建议：胡演出 1.0-1.3 秒，第二次以后点击可加速。", fill=(242, 225, 176, 245), font=font(24))

    gang = Image.open(OUT_DIR / "stickers/action_gang_callout.png").convert("RGBA")
    board.alpha_composite(north.resize((178, 260), Image.Resampling.LANCZOS), (1268, 184))
    add_glow(board, gang.resize((280, 148), Image.Resampling.LANCZOS), (1052, 258), radius=14, color=(255, 166, 55, 90))
    for i in range(4):
        tile = load_tile("bamboo", "tile_bamboo_08.png", 88)
        board.alpha_composite(tile, (1078 + i * 54, 358 - int(math.sin(i) * 10)))
    draw.rounded_rectangle((1024, 414, 1462, 448), radius=12, fill=(9, 38, 34, 170))
    draw.text((1036, 418), "0.55 秒内完成：轻震屏 + 金波，不遮挡牌山。", fill=(224, 214, 187, 225), font=font(17))

    bugang = Image.open(OUT_DIR / "stickers/action_bugang_callout.png").convert("RGBA")
    add_glow(board, bugang.resize((230, 122), Image.Resampling.LANCZOS), (1052, 594), radius=12, color=(255, 176, 65, 80))
    for i in range(3):
        tile = load_tile("dot", "tile_dot_02.png", 74)
        board.alpha_composite(tile, (1052 + i * 52, 672))
    tile = load_tile("dot", "tile_dot_02.png", 86)
    board.alpha_composite(tile, (1254, 648))
    draw.rounded_rectangle((1024, 718, 1462, 746), radius=12, fill=(9, 38, 34, 170))
    draw.text((1036, 721), "表现“碰升级成杠”，比杠更短更轻。", fill=(224, 214, 187, 225), font=font(16))

    for text, x in [("碰", 1048), ("吃", 1168)]:
        sticker = create_action_sticker(f"mini_{text}", text, "small", ((30, 90, 64, 245), (244, 211, 135, 255)))
        image = Image.open(OUT_DIR / sticker["path"]).convert("RGBA").resize((150, 80), Image.Resampling.LANCZOS)
        board.alpha_composite(image, (x, 884))

    path = OUT_DIR / "preview/action-fx-character-concept-board.png"
    board.save(path)
    entries.append(
        {
            "name": "action_fx_character_concept_board",
            "path": str(path.relative_to(OUT_DIR)),
            "size": [board.width, board.height],
            "role": "concept board preview",
        }
    )


def render_asset_sheet(entries: list[dict[str, object]]) -> None:
    image_entries = [entry for entry in entries if entry["path"].startswith(("stickers/", "characters/"))]
    columns = 4
    cell_w, cell_h = 300, 260
    rows = math.ceil(len(image_entries) / columns)
    sheet = checkerboard((columns * cell_w, rows * cell_h))
    draw = ImageDraw.Draw(sheet)
    for index, entry in enumerate(image_entries):
        asset = Image.open(OUT_DIR / str(entry["path"])).convert("RGBA")
        asset.thumbnail((230, 180), Image.Resampling.LANCZOS)
        x = (index % columns) * cell_w + (cell_w - asset.width) // 2
        y = (index // columns) * cell_h + 16
        sheet.alpha_composite(asset, (x, y))
        draw.text(((index % columns) * cell_w + 12, (index // columns) * cell_h + 212), entry["name"][:30], fill=(38, 38, 38, 255), font=ImageFont.load_default())
    sheet.save(OUT_DIR / "preview/transparent-sticker-sheet.png")


def main() -> None:
    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    ensure_dirs()
    entries: list[dict[str, object]] = []

    entries.append(create_character("east", (37, 118, 86, 238), (230, 176, 80, 230)))
    entries.append(create_character("south", (146, 66, 50, 238), (238, 188, 98, 230)))
    entries.append(create_character("west", (132, 83, 35, 238), (236, 190, 86, 230)))
    entries.append(create_character("north", (48, 86, 114, 238), (224, 216, 184, 230)))
    entries.append(create_action_sticker("gang", "杠", "medium", ((30, 96, 65, 245), (244, 210, 134, 255))))
    entries.append(create_action_sticker("bugang", "补杠", "medium", ((31, 92, 68, 245), (244, 210, 134, 255))))
    entries.append(create_action_sticker("hu", "胡了", "large", ((36, 86, 66, 250), (255, 225, 146, 255))))

    render_concept_board(entries)
    render_asset_sheet(entries)

    manifest = {
        "name": "hulebu-action-fx-character-concept-v1",
        "notes": [
            "Concept-only assets for restrained guofeng operation feedback.",
            "Character cut-ins are programmatic placeholders because PPTOKEN_API_KEY is not set in the current environment.",
            "Do not ship these as final character art; replace with generated or hand-painted transparent character illustrations after direction approval.",
            "No Web or Cocos runtime integration in this task.",
        ],
        "sourceAssets": {
            "mahjongTiles": "../hulebu-ui-component-pack-v6-source-faithful-transparent-tiles/tiles/mahjong",
            "font": str(FONT_PATH),
        },
        "assets": entries,
        "previews": {
            "conceptBoard": "preview/action-fx-character-concept-board.png",
            "transparentStickerSheet": "preview/transparent-sticker-sheet.png",
        },
        "recommendedRuntimeHierarchy": [
            {"action": "chi_peng", "strength": "light", "durationMs": 300, "characterCutin": False},
            {"action": "gang", "strength": "medium", "durationMs": 550, "characterCutin": True},
            {"action": "bugang", "strength": "medium-light", "durationMs": 450, "characterCutin": True},
            {"action": "hu", "strength": "high", "durationMs": 1200, "characterCutin": True},
        ],
    }
    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {OUT_DIR}")


if __name__ == "__main__":
    main()
