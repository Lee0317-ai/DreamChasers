#!/usr/bin/env python3
"""构建胡了卜弃牌 UI 透明组件与 390×844 双倍预览。"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parents[2]
FORMAL = PROJECT / "output/hulebu-ui-assets/hulebu-formal-ui-v1"
REFERENCE = Path("/var/folders/1d/0h2ct7qn1_d7qb1lzf9yc7z80000gn/T/codex-clipboard-3a2afb10-b875-4bc2-922a-a6a9e53f0e66.png")
COMPONENTS = ROOT / "components"
PREVIEWS = ROOT / "previews"
VIEWPORT = (780, 1688)

GOLD = (195, 154, 74, 255)
LIGHT_GOLD = (241, 213, 145, 255)
JADE = (36, 91, 75, 255)
JADE_DARK = (18, 55, 47, 255)
IVORY = (245, 233, 204, 255)
CINNABAR = (154, 48, 39, 255)
CINNABAR_LIGHT = (212, 91, 65, 255)
MUTED = (91, 88, 75, 255)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/System/Library/Fonts/PingFang.ttc",
        "/System/Library/Fonts/STHeiti Medium.ttc",
        "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            try:
                return ImageFont.truetype(path, size, index=1 if bold else 0)
            except OSError:
                continue
    return ImageFont.load_default()


def rounded_panel(size: tuple[int, int], fill, outline=GOLD, radius=28, width=5, shadow=True):
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    if shadow:
        sh = Image.new("RGBA", size, (0, 0, 0, 0))
        sd = ImageDraw.Draw(sh)
        sd.rounded_rectangle((12, 14, size[0] - 12, size[1] - 8), radius=radius, fill=(0, 0, 0, 105))
        canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(9)))
    d = ImageDraw.Draw(canvas)
    d.rounded_rectangle((8, 6, size[0] - 9, size[1] - 12), radius=radius, fill=fill, outline=outline, width=width)
    d.rounded_rectangle((17, 15, size[0] - 18, size[1] - 21), radius=max(10, radius - 9), outline=(240, 215, 155, 105), width=2)
    return canvas


def build_discard_button(state: str) -> Image.Image:
    # 与正式 UI 的“洗牌 / 撤回”工具按钮同款尺寸与金属边框。
    source_name = "undo-active.png" if state == "active" else "undo-disabled.png" if state == "disabled" else "undo-normal.png"
    source = Image.open(FORMAL / "tools" / source_name).convert("RGBA")
    size = source.size
    active = state == "active"
    disabled = state == "disabled"
    panel = source.copy()
    # 同系列按钮在相同坐标取最暗像素，可排除浅色图标与文字并保留玉石底纹。
    state_suffix = "active" if active else "disabled" if disabled else "normal"
    peers = []
    for tool_name in ("shuffle", "undo", "hint", "buff", "counter"):
        peer = Image.open(FORMAL / "tools" / f"{tool_name}-{state_suffix}.png").convert("RGBA")
        peers.append(np.asarray(peer, dtype=np.uint8))
    stack = np.stack(peers)
    luminance = stack[..., 0] * 0.2126 + stack[..., 1] * 0.7152 + stack[..., 2] * 0.0722
    darkest = np.argmin(luminance, axis=0)
    clean_surface = np.take_along_axis(stack, darkest[None, ..., None], axis=0)[0]
    clean_image = Image.fromarray(clean_surface.astype(np.uint8), "RGBA")
    circle_mask = Image.new("L", size, 0)
    ImageDraw.Draw(circle_mask).ellipse((62, 28, 194, 178), fill=255)
    panel.paste(clean_image, (0, 0), circle_mask)
    plaque_mask = Image.new("L", size, 0)
    ImageDraw.Draw(plaque_mask).rounded_rectangle((58, 187, 224, 247), radius=13, fill=255)
    panel.paste(clean_image, (0, 0), plaque_mask)
    d = ImageDraw.Draw(panel, "RGBA")
    # 弃牌语义：牌面下落箭头，沿用正式按钮的象牙金高光。
    icon = (238, 213, 153, 255) if not disabled else (160, 151, 124, 190)
    d.rounded_rectangle((105, 54, 141, 96), radius=7, fill=(244, 231, 198, 255), outline=icon, width=3)
    d.line((123, 96, 123, 126), fill=icon, width=8)
    d.polygon(((99, 121), (147, 121), (123, 150)), fill=icon)
    text_fill = (251, 239, 205, 255) if not disabled else (170, 160, 133, 210)
    title_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Songti.ttc", 34, index=1)
    d.text((123, 218), "弃牌", font=title_font, fill=text_fill, anchor="mm", stroke_width=2, stroke_fill=(75, 48, 22, 255))
    if active:
        d.ellipse((61, 24, 195, 181), outline=(255, 210, 125, 125), width=5)
    return panel


def build_selection_frame() -> Image.Image:
    size = (132, 180)
    glow = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(glow)
    d.rounded_rectangle((16, 15, 115, 162), radius=15, outline=(220, 71, 51, 230), width=9)
    d.rounded_rectangle((22, 21, 109, 156), radius=12, outline=LIGHT_GOLD, width=3)
    d.polygon(((97, 6), (124, 6), (124, 34)), fill=CINNABAR_LIGHT)
    return glow.filter(ImageFilter.GaussianBlur(1.2))


def build_helper_ribbon() -> Image.Image:
    size = (560, 92)
    panel = rounded_panel(size, (25, 70, 59, 244), outline=GOLD, radius=28, width=4, shadow=False)
    d = ImageDraw.Draw(panel)
    d.ellipse((31, 24, 73, 66), fill=CINNABAR, outline=LIGHT_GOLD, width=3)
    d.line((52, 34, 52, 51), fill=IVORY, width=5)
    d.ellipse((49, 56, 55, 62), fill=IVORY)
    # 中部留空，由 Cocos Label 绘制“请选择一张手牌”。
    d.rounded_rectangle((96, 29, 516, 63), radius=14, fill=(241, 226, 191, 36))
    return panel


def build_confirm_bar() -> Image.Image:
    size = (700, 142)
    panel = rounded_panel(size, (24, 61, 52, 250), outline=GOLD, radius=30, width=5)
    d = ImageDraw.Draw(panel)
    d.rounded_rectangle((34, 35, 236, 103), radius=22, fill=(82, 86, 75, 255), outline=(177, 161, 122, 255), width=3)
    d.rounded_rectangle((258, 35, 666, 103), radius=22, fill=CINNABAR, outline=LIGHT_GOLD, width=4)
    d.line((246, 29, 246, 109), fill=(218, 190, 126, 95), width=2)
    return panel


def build_river_panel() -> Image.Image:
    size = (360, 190)
    panel = rounded_panel(size, (26, 66, 56, 245), outline=GOLD, radius=28, width=5)
    d = ImageDraw.Draw(panel)
    d.rounded_rectangle((36, 52, 157, 165), radius=15, fill=(17, 44, 38, 190), outline=(188, 150, 80, 150), width=3)
    d.rounded_rectangle((202, 52, 323, 165), radius=15, fill=(17, 44, 38, 190), outline=(188, 150, 80, 150), width=3)
    d.rounded_rectangle((96, 10, 264, 45), radius=14, fill=(239, 219, 174, 35))
    return panel


def build_success_badge() -> Image.Image:
    size = (310, 84)
    panel = rounded_panel(size, (31, 98, 73, 245), outline=LIGHT_GOLD, radius=27, width=4, shadow=False)
    d = ImageDraw.Draw(panel)
    d.ellipse((25, 20, 67, 62), fill=(231, 208, 144, 255))
    d.line((37, 41, 47, 52, 61, 30), fill=JADE_DARK, width=6, joint="curve")
    d.rounded_rectangle((88, 26, 274, 58), radius=12, fill=(244, 232, 201, 32))
    return panel


def save_component(name: str, image: Image.Image) -> dict:
    path = COMPONENTS / f"{name}.png"
    image.save(path)
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    nine_slices = {
        "discard-entry-normal": [30, 30, 28, 28],
        "discard-entry-active": [30, 30, 28, 28],
        "discard-entry-disabled": [30, 30, 28, 28],
        "helper-ribbon": [42, 42, 26, 26],
        "confirm-bar": [38, 38, 32, 32],
        "river-panel": [34, 34, 30, 30],
        "success-badge": [32, 32, 24, 24],
    }
    return {
        "key": f"discard.{name.replace('-', '.')}",
        "path": f"components/{name}.png",
        "width": image.width,
        "height": image.height,
        "anchor": [0.5, 0.5],
        "spriteType": "Sliced" if name in nine_slices else "Simple",
        "nineSlice": nine_slices.get(name),
        "alphaBbox": list(bbox) if bbox else None,
        "sha256": digest,
    }


def load_asset(relative: str, size=None) -> Image.Image:
    image = Image.open(FORMAL / relative).convert("RGBA")
    if size:
        image.thumbnail(size, Image.Resampling.LANCZOS)
    return image


def paste_center(base: Image.Image, image: Image.Image, center: tuple[int, int]):
    base.alpha_composite(image, (int(center[0] - image.width / 2), int(center[1] - image.height / 2)))


def draw_runtime_text(base: Image.Image, xy, text: str, size: int, fill=IVORY, anchor="mm", bold=False):
    ImageDraw.Draw(base).text(xy, text, font=font(size, bold), fill=fill, anchor=anchor)


def build_preview(assets: dict[str, Image.Image]):
    background = load_asset("background/scene-emerald-v1.png")
    preview = background.resize(VIEWPORT, Image.Resampling.LANCZOS)
    shade = Image.new("RGBA", VIEWPORT, (6, 25, 22, 32))
    preview = Image.alpha_composite(preview, shade)

    # 顶部信息区。
    level = load_asset("hud/level-badge.png", (240, 120))
    score = load_asset("hud/score-badge.png", (210, 115))
    counter = load_asset("hud/tile-counter.png", (170, 105))
    paste_center(preview, level, (150, 105))
    paste_center(preview, score, (390, 105))
    paste_center(preview, counter, (650, 105))

    # 牌山仅作场景说明，使用正式牌面。
    tile_names = ["wan-03", "bamboo-07", "dot-05", "wan-06", "honor-red", "dot-02", "bamboo-04"]
    tile_cache = {n: load_asset(f"tiles/mahjong/{n}.png", (94, 132)) for n in tile_names}
    positions = [(170, 330), (270, 350), (370, 325), (470, 354), (575, 331), (225, 470), (330, 492), (440, 472), (550, 495), (300, 615), (410, 605), (520, 626)]
    for idx, pos in enumerate(positions):
        tile = tile_cache[tile_names[idx % len(tile_names)]].copy()
        if idx < 5:
            tile = Image.alpha_composite(Image.new("RGBA", tile.size, (31, 48, 43, 105)), tile)
        paste_center(preview, tile, pos)

    # 牌河：只呈现已有弃牌，不画两个永久空框。
    river = assets["river-panel"].resize((330, 174), Image.Resampling.LANCZOS)
    paste_center(preview, river, (222, 890))
    draw_runtime_text(preview, (222, 843), "牌河 1/2", 27, IVORY, bold=True)
    river_tile = tile_cache["dot-02"].resize((75, 106), Image.Resampling.LANCZOS)
    paste_center(preview, river_tile, (166, 926))
    draw_runtime_text(preview, (535, 840), "弃牌后无法撤回", 23, (234, 218, 177, 225))

    # 进入弃牌态的入口按钮。
    discard_button = assets["discard-entry-active"].resize((144, 123), Image.Resampling.LANCZOS)
    paste_center(preview, discard_button, (646, 920))
    draw_runtime_text(preview, (646, 953), "弃牌", 25, IVORY, bold=True)

    # 轻量提示条。
    helper = assets["helper-ribbon"].resize((520, 86), Image.Resampling.LANCZOS)
    paste_center(preview, helper, (390, 1090))
    draw_runtime_text(preview, (405, 1090), "请选择一张手牌弃入牌河", 27, IVORY, bold=True)

    # 主槽与真实牌面。
    hand = load_asset("board/hand-slots.png").resize((720, 193), Image.Resampling.LANCZOS)
    paste_center(preview, hand, (390, 1307))
    hand_names = ["wan-03", "bamboo-07", "dot-05", "wan-06", "honor-red", "dot-02", "bamboo-04", "wan-03"]
    xs = [91, 176, 261, 346, 431, 516, 601, 686]
    for idx, (name, x) in enumerate(zip(hand_names, xs)):
        tile = tile_cache[name].resize((69, 98), Image.Resampling.LANCZOS)
        y = 1261 if idx == 3 else 1300
        paste_center(preview, tile, (x, y))
        if idx == 3:
            frame = assets["selection-frame"].resize((100, 136), Image.Resampling.LANCZOS)
            paste_center(preview, frame, (x, y))

    # 确认条在选中牌后出现；不覆盖主牌山。
    confirm = assets["confirm-bar"].resize((700, 142), Image.Resampling.LANCZOS)
    paste_center(preview, confirm, (390, 1532))
    draw_runtime_text(preview, (140, 1528), "取消", 29, (226, 218, 196, 255), bold=True)
    draw_runtime_text(preview, (468, 1528), "弃入牌河", 31, IVORY, bold=True)
    draw_runtime_text(preview, (390, 1648), "选中的牌会先上浮，再由玩家确认", 23, (233, 218, 180, 220))
    preview.save(PREVIEWS / "discard-flow-390x844@2x.png")


def build_contact_sheet(assets: dict[str, Image.Image]):
    sheet = Image.new("RGBA", (1100, 760), (23, 43, 38, 255))
    d = ImageDraw.Draw(sheet)
    d.text((50, 34), "胡了卜 · 弃牌 UI 透明组件", font=font(38, True), fill=IVORY)
    items = list(assets.items())
    for index, (name, img) in enumerate(items):
        col = index % 3
        row = index // 3
        x, y = 55 + col * 350, 105 + row * 205
        d.rounded_rectangle((x, y, x + 310, y + 170), radius=18, fill=(245, 235, 210, 28), outline=(203, 164, 87, 90), width=2)
        thumb = img.copy()
        thumb.thumbnail((275, 120), Image.Resampling.LANCZOS)
        paste_center(sheet, thumb, (x + 155, y + 70))
        d.text((x + 155, y + 148), name, font=font(19), fill=(57, 55, 48, 255), anchor="mm")
    sheet.save(PREVIEWS / "contact-sheet-v1.png")


def build_reference_preview(assets: dict[str, Image.Image]):
    """以用户实机截图为底图，验证弃牌层与现有 HUD 的坐标关系。"""
    if not REFERENCE.exists():
        return
    base = Image.open(REFERENCE).convert("RGBA")
    draw = ImageDraw.Draw(base, "RGBA")
    # 牌河放在动作栏上方，最多两格，不创建第三格。
    draw.rounded_rectangle((385, 920, 675, 1040), radius=18, fill=(19, 65, 54, 235), outline=(198, 157, 77, 255), width=4)
    draw.rounded_rectangle((425, 952, 545, 1018), radius=12, fill=(31, 48, 42, 235), outline=(198, 157, 77, 230), width=3)
    draw.rounded_rectangle((555, 952, 635, 1018), radius=12, fill=(31, 48, 42, 235), outline=(198, 157, 77, 230), width=3)
    draw.text((530, 936), "牌河 0/2", font=font(22, True), fill=IVORY, anchor="mm")
    # 右侧工具栏弃牌入口：使用与 Cocos 接入一致的透明按钮资源。
    discard_button = assets["discard-entry-normal"].resize((104, 126), Image.Resampling.LANCZOS)
    paste_center(base, discard_button, (732, 894))
    draw.text((732, 930), "弃牌", font=font(23, True), fill=IVORY, anchor="mm")
    # 动作栏保留原位，只高亮当前“吃 1”。
    draw.rounded_rectangle((447, 1045, 547, 1152), radius=14, outline=(241, 213, 145, 255), width=5)
    # 选中手牌只做局部描边和上浮。
    draw.rounded_rectangle((298, 1272, 375, 1383), radius=12, outline=(220, 71, 51, 255), width=6)
    draw.rounded_rectangle((303, 1277, 370, 1378), radius=10, outline=(241, 213, 145, 255), width=2)
    # 确认控件贴近右侧弃牌入口，不横跨动作栏。
    draw.rounded_rectangle((630, 948, 772, 1012), radius=18, fill=(18, 66, 55, 245), outline=(198, 157, 77, 255), width=3)
    draw.rounded_rectangle((640, 957, 698, 1003), radius=12, fill=(88, 87, 76, 255), outline=(180, 162, 119, 255), width=2)
    draw.rounded_rectangle((704, 957, 762, 1003), radius=12, fill=(164, 55, 42, 255), outline=(241, 213, 145, 255), width=2)
    draw.text((669, 980), "撤", font=font(20, True), fill=IVORY, anchor="mm")
    draw.text((733, 980), "弃", font=font(20, True), fill=IVORY, anchor="mm")
    draw.rounded_rectangle((330, 904, 622, 941), radius=14, fill=(20, 72, 59, 220), outline=(198, 157, 77, 220), width=2)
    draw.text((476, 923), "请选择一张手牌", font=font(20, True), fill=IVORY, anchor="mm")
    base.save(PREVIEWS / "discard-flow-reference-v2.png")


def main():
    COMPONENTS.mkdir(parents=True, exist_ok=True)
    PREVIEWS.mkdir(parents=True, exist_ok=True)
    assets = {
        "discard-entry-normal": build_discard_button("normal"),
        "discard-entry-active": build_discard_button("active"),
        "discard-entry-disabled": build_discard_button("disabled"),
        "selection-frame": build_selection_frame(),
        "helper-ribbon": build_helper_ribbon(),
        "confirm-bar": build_confirm_bar(),
        "river-panel": build_river_panel(),
        "success-badge": build_success_badge(),
    }
    manifest_assets = [save_component(name, image) for name, image in assets.items()]
    manifest = {
        "name": "hulebu-discard-ui-v1",
        "version": 1,
        "designViewport": {"width": 390, "height": 844},
        "resourceScale": 2,
        "textPolicy": "所有运行时中文由 Cocos Label 绘制，PNG 不烧字。",
        "assets": manifest_assets,
    }
    (ROOT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    build_preview(assets)
    build_contact_sheet(assets)
    build_reference_preview(assets)


if __name__ == "__main__":
    main()
