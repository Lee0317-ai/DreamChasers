#!/usr/bin/env python3
"""Build transparent HuLeBu mode and map UI components from keyed sheets."""

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
    nine_slice: tuple[int, int, int, int] | None = None
    square: bool = False
    states: tuple[str, ...] = ("default",)
    state_strategy: str = "single-sprite"
    runtime_text: bool = False


ASSETS = (
    Asset(
        "meta.mode.entryPanel",
        "mode-panels-sheet-v1.png",
        (45, 95, 1490, 610),
        "modes/mode-entry-panel.png",
        "Mode entry panel",
        nine_slice=(330, 170, 105, 105),
        states=("normal", "active", "locked"),
        state_strategy="runtime-tint-and-overlay",
        runtime_text=True,
    ),
    Asset(
        "meta.mode.stateTag",
        "mode-panels-sheet-v1.png",
        (350, 625, 1190, 930),
        "modes/mode-state-tag.png",
        "Mode state tag",
        nine_slice=(105, 105, 48, 48),
        states=("normal", "active", "locked", "claimable"),
        state_strategy="runtime-tint-and-label",
        runtime_text=True,
    ),
    Asset("meta.mode.mainIcon", "mode-badges-sheet-v1.png", (6, 6, 506, 506), "modes/icon-main.png", "Main mode", square=True, states=("normal", "active"), state_strategy="runtime-highlight-overlay"),
    Asset("meta.mode.endlessIcon", "mode-badges-sheet-v1.png", (515, 6, 1021, 506), "modes/icon-endless.png", "Endless mode", square=True, states=("normal", "active"), state_strategy="runtime-highlight-overlay"),
    Asset("meta.mode.dailyIcon", "mode-badges-sheet-v1.png", (1024, 6, 1530, 506), "modes/icon-daily.png", "Daily mode", square=True, states=("normal", "claimable"), state_strategy="runtime-badge-overlay"),
    Asset("meta.mode.advancedIcon", "mode-badges-sheet-v1.png", (6, 518, 506, 1018), "modes/icon-advanced.png", "Advanced mode", square=True, states=("locked", "unlocked"), state_strategy="runtime-lock-overlay"),
    Asset("meta.mode.collectionIcon", "mode-badges-sheet-v1.png", (515, 518, 1021, 1018), "modes/icon-collection.png", "Collection mode", square=True, states=("normal", "claimable"), state_strategy="runtime-badge-overlay"),
    Asset(
        "meta.map.chapterPlaque",
        "map-panels-sheet-v1.png",
        (8, 65, 850, 475),
        "map/chapter-plaque.png",
        "Chapter plaque",
        nine_slice=(112, 112, 62, 62),
        runtime_text=True,
    ),
    Asset(
        "meta.map.starProgress",
        "map-panels-sheet-v1.png",
        (850, 65, 1528, 475),
        "map/star-progress-plaque.png",
        "Star progress plaque",
        runtime_text=True,
    ),
    Asset(
        "meta.map.chapterSwitch",
        "map-panels-sheet-v1.png",
        (8, 515, 850, 935),
        "map/chapter-switch-frame.png",
        "Chapter switch",
        runtime_text=True,
    ),
    Asset("meta.map.pathSegment", "map-panels-sheet-v1.png", (850, 430, 1528, 970), "map/path-segment-curved.png", "Curved path", states=("default",)),
    Asset("meta.map.node.normal", "map-nodes-sheet-v1.png", (6, 6, 506, 506), "map/node-normal.png", "Normal node", square=True, states=("available", "completed"), state_strategy="runtime-star-overlay", runtime_text=True),
    Asset("meta.map.node.current", "map-nodes-sheet-v1.png", (515, 6, 1021, 506), "map/node-current.png", "Current node", square=True, states=("active",), state_strategy="runtime-pulse", runtime_text=True),
    Asset("meta.map.node.locked", "map-nodes-sheet-v1.png", (1024, 6, 1530, 506), "map/node-locked.png", "Locked node", square=True, states=("locked",), runtime_text=True),
    Asset("meta.map.node.boss", "map-nodes-sheet-v1.png", (6, 518, 506, 1018), "map/node-boss.png", "Boss node", square=True, states=("locked", "available", "completed"), state_strategy="runtime-tint-and-star-overlay", runtime_text=True),
    Asset("meta.map.star.empty", "map-nodes-sheet-v1.png", (515, 518, 1021, 1018), "map/star-empty.png", "Empty star", square=True, states=("empty",)),
    Asset("meta.map.star.filled", "map-nodes-sheet-v1.png", (1024, 518, 1530, 1018), "map/star-filled.png", "Filled star", square=True, states=("filled",)),
)


def sample_key(image: Image.Image) -> tuple[int, int, int]:
    width, height = image.size
    patch = max(2, min(width, height, 12))
    samples: list[tuple[int, int, int]] = []
    for left, top in ((0, 0), (width - patch, 0), (0, height - patch), (width - patch, height - patch)):
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
    for y in range(rgba.height):
        for x in range(rgba.width):
            red, green, blue, source_alpha = pixels[x, y]
            distance = max(abs(red - key[0]), abs(green - key[1]), abs(blue - key[2]))
            dominance = min(red, blue) - green
            magenta_dominant = min(red, blue) >= 128 and dominance >= 24 and abs(red - blue) <= 90
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
    width, height = trimmed.width + padding * 2, trimmed.height + padding * 2
    if square:
        width = height = max(width, height)
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    canvas.alpha_composite(trimmed, ((width - trimmed.width) // 2, (height - trimmed.height) // 2))
    return canvas


def alpha_stats(image: Image.Image) -> dict[str, object]:
    alpha = image.getchannel("A")
    histogram = alpha.histogram()
    total = image.width * image.height
    bbox = alpha.point(lambda value: 255 if value > 8 else 0).getbbox()
    corners = [alpha.getpixel(point) for point in ((0, 0), (image.width - 1, 0), (0, image.height - 1), (image.width - 1, image.height - 1))]
    return {
        "transparentPixels": histogram[0],
        "partialPixels": total - histogram[0] - histogram[255],
        "opaquePixels": histogram[255],
        "transparentRatio": round(histogram[0] / total, 6),
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
    columns, card_width, card_height = 4, 356, 246
    margin, gap = 28, 18
    rows = math.ceil(len(entries) / columns)
    width = margin * 2 + columns * card_width + (columns - 1) * gap
    height = margin * 2 + 54 + rows * card_height + (rows - 1) * gap
    canvas = Image.new("RGBA", (width, height), (24, 31, 29, 255))
    draw = ImageDraw.Draw(canvas)
    font, small_font = ImageFont.load_default(size=17), ImageFont.load_default(size=14)
    draw.text((margin, margin), "HuLeBu mode and map transparent components v1", font=font, fill=(244, 235, 204, 255))
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
        entries.append({
            "key": asset.key,
            "label": asset.label,
            "path": str(destination.relative_to(ROOT)),
            "source": f"master-sources/{asset.source}",
            "sourceCrop": list(asset.crop),
            "sampledKeyColor": "#{:02X}{:02X}{:02X}".format(*sampled_key),
            "width": component.width,
            "height": component.height,
            "anchor": {"x": 0.5, "y": 0.5},
            "spriteMode": "sliced" if asset.nine_slice else "simple",
            "nineSlice": ({"left": asset.nine_slice[0], "right": asset.nine_slice[1], "top": asset.nine_slice[2], "bottom": asset.nine_slice[3]} if asset.nine_slice else None),
            "states": list(asset.states),
            "stateStrategy": asset.state_strategy,
            "runtimeTextRequired": asset.runtime_text,
            "alpha": stats,
            "sha256": sha256(destination),
        })
    contact_sheet = build_contact_sheet(entries)
    manifest = {
        "name": "hulebu-mode-map-components-v1",
        "version": 1,
        "task": "T274",
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
        "preview": {"path": str(contact_sheet.relative_to(ROOT)), "width": Image.open(contact_sheet).width, "height": Image.open(contact_sheet).height},
    }
    (ROOT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Built {len(entries)} components")
    print(contact_sheet)


if __name__ == "__main__":
    main()
