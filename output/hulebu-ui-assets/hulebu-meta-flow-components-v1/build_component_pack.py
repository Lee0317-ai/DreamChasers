#!/usr/bin/env python3
"""Build transparent HuLeBu meta-flow UI components from keyed source sheets."""

from __future__ import annotations

import hashlib
import json
import math
from dataclasses import dataclass
from pathlib import Path
from statistics import median

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
SOURCE_DIR = ROOT / "master-sources"
COMPONENT_DIR = ROOT / "components"
PREVIEW_DIR = ROOT / "preview"


@dataclass(frozen=True)
class Asset:
    key: str
    source: str
    crop: tuple[int, int, int, int]
    output: str
    label: str
    anchor: tuple[float, float] = (0.5, 0.5)
    nine_slice: tuple[int, int, int, int] | None = None
    square: bool = False
    states: tuple[str, ...] = ("default",)
    state_strategy: str = "single-sprite"


ASSETS = (
    Asset(
        "meta.title.brandPlaque",
        "title-common-sheet-v1.png",
        (8, 165, 580, 466),
        "title/title-brand-plaque.png",
        "Title plaque",
        nine_slice=(104, 104, 46, 46),
    ),
    Asset(
        "meta.title.jadeSeal",
        "title-common-sheet-v1.png",
        (570, 110, 970, 510),
        "title/title-jade-seal.png",
        "Jade seal",
        square=True,
    ),
    Asset(
        "meta.title.primaryButton",
        "title-common-sheet-v1.png",
        (955, 170, 1528, 455),
        "common/button-primary-blank.png",
        "Primary button",
        nine_slice=(104, 104, 42, 42),
        states=("normal", "pressed", "disabled"),
        state_strategy="runtime-tint-and-scale",
    ),
    Asset(
        "meta.title.secondaryButton",
        "title-common-sheet-v1.png",
        (8, 545, 558, 836),
        "common/button-secondary-blank.png",
        "Secondary button",
        nine_slice=(96, 96, 42, 42),
        states=("normal", "pressed", "disabled"),
        state_strategy="runtime-tint-and-scale",
    ),
    Asset(
        "meta.title.saveNotePanel",
        "title-common-sheet-v1.png",
        (535, 545, 1045, 842),
        "common/note-panel-blank.png",
        "Note panel",
        nine_slice=(46, 46, 42, 42),
    ),
    Asset(
        "meta.lobby.avatarFrame",
        "lobby-panels-sheet-v1.png",
        (8, 8, 468, 503),
        "lobby/avatar-frame.png",
        "Avatar frame",
        square=True,
    ),
    Asset(
        "meta.lobby.currencyPlaque",
        "lobby-panels-sheet-v1.png",
        (484, 8, 972, 503),
        "lobby/currency-plaque.png",
        "Currency plaque",
        nine_slice=(86, 86, 38, 38),
    ),
    Asset(
        "meta.lobby.continuePanel",
        "lobby-panels-sheet-v1.png",
        (988, 8, 1528, 503),
        "lobby/continue-panel.png",
        "Continue panel",
        nine_slice=(92, 92, 64, 64),
        states=("default", "active"),
        state_strategy="runtime-highlight-overlay",
    ),
    Asset(
        "meta.lobby.progressTrack",
        "lobby-panels-sheet-v1.png",
        (8, 520, 468, 1016),
        "lobby/progress-track.png",
        "Progress track",
        nine_slice=(104, 104, 22, 22),
    ),
    Asset(
        "meta.lobby.bottomNav",
        "lobby-panels-sheet-v1.png",
        (484, 520, 972, 1016),
        "lobby/bottom-nav-frame.png",
        "Bottom navigation",
        nine_slice=(74, 74, 54, 54),
    ),
    Asset(
        "meta.lobby.entry.main",
        "lobby-badges-sheet-v1.png",
        (6, 6, 621, 621),
        "lobby/entry-main-journey.png",
        "Main journey",
        square=True,
        states=("normal", "notice"),
        state_strategy="runtime-badge-overlay",
    ),
    Asset(
        "meta.lobby.entry.modes",
        "lobby-badges-sheet-v1.png",
        (633, 6, 1248, 621),
        "lobby/entry-modes.png",
        "Modes",
        square=True,
        states=("normal", "notice"),
        state_strategy="runtime-badge-overlay",
    ),
    Asset(
        "meta.lobby.entry.collection",
        "lobby-badges-sheet-v1.png",
        (6, 633, 621, 1248),
        "lobby/entry-collection.png",
        "Collection",
        square=True,
        states=("normal", "claimable"),
        state_strategy="runtime-badge-overlay",
    ),
    Asset(
        "meta.lobby.entry.growth",
        "lobby-badges-sheet-v1.png",
        (633, 633, 1248, 1248),
        "lobby/entry-growth.png",
        "Growth",
        square=True,
        states=("normal", "affordable"),
        state_strategy="runtime-badge-overlay",
    ),
)


def sample_key(image: Image.Image) -> tuple[int, int, int]:
    width, height = image.size
    patch = max(2, min(width, height, 12))
    samples: list[tuple[int, int, int]] = []
    for left, top in (
        (0, 0),
        (width - patch, 0),
        (0, height - patch),
        (width - patch, height - patch),
    ):
        for y in range(top, top + patch):
            for x in range(left, left + patch):
                samples.append(image.getpixel((x, y))[:3])
    return tuple(int(round(median(pixel[index] for pixel in samples))) for index in range(3))


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def remove_magenta_key(image: Image.Image) -> tuple[Image.Image, tuple[int, int, int]]:
    rgba = image.convert("RGBA")
    key = sample_key(rgba)
    pixels = rgba.load()
    width, height = rgba.size

    for y in range(height):
        for x in range(width):
            red, green, blue, source_alpha = pixels[x, y]
            distance = max(abs(red - key[0]), abs(green - key[1]), abs(blue - key[2]))
            dominance = min(red, blue) - green
            magenta_dominant = (
                min(red, blue) >= 128
                and dominance >= 24
                and abs(red - blue) <= 90
            )
            key_like = distance <= 30 or magenta_dominant

            if key_like:
                distance_ratio = smoothstep((distance - 8.0) / 70.0)
                denominator = max(1.0, float(max(key)) - green)
                dominance_ratio = 1.0 - min(1.0, max(0.0, dominance) / denominator)
                output_alpha = int(round(255.0 * min(distance_ratio, dominance_ratio)))
            else:
                output_alpha = 255

            output_alpha = int(round(output_alpha * source_alpha / 255.0))
            if output_alpha <= 8:
                pixels[x, y] = (0, 0, 0, 0)
                continue

            if key_like and output_alpha < 252:
                cap = max(0, green - 1)
                red = min(red, cap)
                blue = min(blue, cap)
            pixels[x, y] = (red, green, blue, output_alpha)

    return rgba, key


def trim_and_pad(image: Image.Image, *, square: bool, padding: int = 18) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.point(lambda value: 255 if value > 8 else 0).getbbox()
    if bbox is None:
        raise ValueError("Component has no visible pixels after chroma-key removal")

    trimmed = image.crop(bbox)
    width = trimmed.width + padding * 2
    height = trimmed.height + padding * 2
    if square:
        side = max(width, height)
        width = side
        height = side

    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    canvas.alpha_composite(trimmed, ((width - trimmed.width) // 2, (height - trimmed.height) // 2))
    return canvas


def alpha_stats(image: Image.Image) -> dict[str, object]:
    alpha = image.getchannel("A")
    histogram = alpha.histogram()
    total = image.width * image.height
    transparent = histogram[0]
    opaque = histogram[255]
    partial = total - transparent - opaque
    bbox = alpha.point(lambda value: 255 if value > 8 else 0).getbbox()
    corners = [alpha.getpixel(point) for point in ((0, 0), (image.width - 1, 0), (0, image.height - 1), (image.width - 1, image.height - 1))]
    return {
        "transparentPixels": transparent,
        "partialPixels": partial,
        "opaquePixels": opaque,
        "transparentRatio": round(transparent / total, 6),
        "alphaBbox": list(bbox) if bbox else None,
        "cornersTransparent": all(value == 0 for value in corners),
    }


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def checkerboard(size: tuple[int, int], step: int = 16) -> Image.Image:
    board = Image.new("RGBA", size, (226, 226, 226, 255))
    draw = ImageDraw.Draw(board)
    for y in range(0, size[1], step):
        for x in range(0, size[0], step):
            if (x // step + y // step) % 2:
                draw.rectangle((x, y, x + step - 1, y + step - 1), fill=(194, 194, 194, 255))
    return board


def fit_image(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    scale = min(size[0] / image.width, size[1] / image.height, 1.0)
    target = (max(1, int(image.width * scale)), max(1, int(image.height * scale)))
    return image.resize(target, Image.Resampling.LANCZOS)


def build_contact_sheet(entries: list[dict[str, object]]) -> Path:
    columns = 4
    card_width, card_height = 356, 246
    margin, gap = 28, 18
    rows = math.ceil(len(entries) / columns)
    width = margin * 2 + columns * card_width + (columns - 1) * gap
    height = margin * 2 + 54 + rows * card_height + (rows - 1) * gap
    canvas = Image.new("RGBA", (width, height), (24, 31, 29, 255))
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default(size=17)
    small_font = ImageFont.load_default(size=14)
    draw.text((margin, margin), "HuLeBu meta-flow transparent components v1", font=font, fill=(244, 235, 204, 255))

    for index, entry in enumerate(entries):
        row, column = divmod(index, columns)
        x = margin + column * (card_width + gap)
        y = margin + 54 + row * (card_height + gap)
        draw.rounded_rectangle((x, y, x + card_width, y + card_height), radius=8, fill=(41, 52, 48, 255), outline=(117, 139, 126, 255), width=1)
        preview = checkerboard((card_width - 24, 174))
        component = Image.open(ROOT / str(entry["path"])).convert("RGBA")
        fitted = fit_image(component, (preview.width - 24, preview.height - 20))
        preview.alpha_composite(fitted, ((preview.width - fitted.width) // 2, (preview.height - fitted.height) // 2))
        canvas.alpha_composite(preview, (x + 12, y + 12))
        draw.text((x + 14, y + 195), str(entry["label"]), font=font, fill=(246, 238, 211, 255))
        draw.text((x + 14, y + 220), f'{entry["width"]}x{entry["height"]}  {entry["key"]}', font=small_font, fill=(165, 186, 174, 255))

    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    path = PREVIEW_DIR / "contact-sheet-v1.png"
    canvas.convert("RGB").save(path, "PNG", optimize=True)
    return path


def main() -> None:
    COMPONENT_DIR.mkdir(parents=True, exist_ok=True)
    source_cache: dict[str, Image.Image] = {}
    entries: list[dict[str, object]] = []

    for asset in ASSETS:
        source = source_cache.setdefault(asset.source, Image.open(SOURCE_DIR / asset.source).convert("RGBA"))
        keyed, sampled_key = remove_magenta_key(source.crop(asset.crop))
        component = trim_and_pad(keyed, square=asset.square)
        destination = COMPONENT_DIR / asset.output
        destination.parent.mkdir(parents=True, exist_ok=True)
        component.save(destination, "PNG", optimize=True)

        stats = alpha_stats(component)
        if not stats["cornersTransparent"]:
            raise ValueError(f"Non-transparent corner detected: {asset.output}")
        if asset.square and component.width != component.height:
            raise ValueError(f"Square component has non-square canvas: {asset.output}")

        entries.append(
            {
                "key": asset.key,
                "label": asset.label,
                "path": str(destination.relative_to(ROOT)),
                "source": f"master-sources/{asset.source}",
                "sourceCrop": list(asset.crop),
                "sampledKeyColor": "#{:02X}{:02X}{:02X}".format(*sampled_key),
                "width": component.width,
                "height": component.height,
                "anchor": {"x": asset.anchor[0], "y": asset.anchor[1]},
                "spriteMode": "sliced" if asset.nine_slice else "simple",
                "nineSlice": (
                    {
                        "left": asset.nine_slice[0],
                        "right": asset.nine_slice[1],
                        "top": asset.nine_slice[2],
                        "bottom": asset.nine_slice[3],
                    }
                    if asset.nine_slice
                    else None
                ),
                "states": list(asset.states),
                "stateStrategy": asset.state_strategy,
                "runtimeTextRequired": asset.key not in {
                    "meta.title.jadeSeal",
                    "meta.lobby.avatarFrame",
                    "meta.lobby.progressTrack",
                },
                "alpha": stats,
                "sha256": sha256(destination),
            }
        )

    contact_sheet = build_contact_sheet(entries)
    manifest = {
        "name": "hulebu-meta-flow-components-v1",
        "version": 1,
        "task": "T273",
        "encoding": "UTF-8 without BOM",
        "runtime": "Cocos Creator",
        "sourcePolicy": {
            "generatedSheetsAreRuntimeAssets": False,
            "componentPngsAreRuntimeCandidates": True,
            "runtimeTextOverlayRequired": True,
            "keyedBackgroundRemoved": True,
        },
        "componentCount": len(entries),
        "components": entries,
        "preview": {
            "path": str(contact_sheet.relative_to(ROOT)),
            "width": Image.open(contact_sheet).width,
            "height": Image.open(contact_sheet).height,
        },
    }
    (ROOT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Built {len(entries)} components")
    print(contact_sheet)


if __name__ == "__main__":
    main()
