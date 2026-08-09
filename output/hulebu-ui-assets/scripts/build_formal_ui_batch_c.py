#!/usr/bin/env python3
from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[3]
PACK = ROOT / "output/hulebu-ui-assets/hulebu-formal-ui-v1"
MASTER_SHEET = PACK / "master-sources/cards-modals-sheet-v1.png"
TILE_SOURCE = ROOT / "output/hulebu-ui-assets/hulebu-master-tile-pack-v7-clean-template-dots"
MANIFEST_PATH = PACK / "manifest.json"
REPORT_PATH = PACK / "validation-report.json"

CARD_DEFINITIONS = (
    ("cards.reward.combo", "cards/reward-combo.png", (32, 64, 266, 565)),
    ("cards.reward.score", "cards/reward-score.png", (274, 64, 510, 565)),
    ("cards.reward.slot", "cards/reward-slot.png", (518, 64, 756, 565)),
    ("cards.wind.template", "cards/wind-template.png", (764, 64, 1000, 565)),
)

MODAL_DEFINITIONS = (
    ("modals.tutorial", "modals/tutorial.png", (28, 586, 500, 894)),
    ("modals.comboChoice", "modals/combo-choice.png", (520, 586, 998, 894)),
    ("modals.pause", "modals/pause.png", (28, 892, 500, 1208)),
    ("modals.settings", "modals/settings.png", (520, 892, 998, 1208)),
    ("modals.settlement", "modals/settlement.png", (28, 1202, 500, 1530)),
)

HONOR_BACK_IDS = {
    "tile_honor_east",
    "tile_honor_south",
    "tile_honor_west",
    "tile_honor_north",
    "tile_honor_red",
    "tile_honor_green",
    "tile_honor_whiteboard",
    "tile_back_default",
}
HONOR_IDS = HONOR_BACK_IDS - {"tile_back_default"}
STRICT_HONOR_CONTENT_IDS = {"tile_honor_red", "tile_honor_green", "tile_honor_whiteboard"}


def alpha_stats(image: Image.Image) -> dict[str, object]:
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    histogram = alpha.histogram()
    total = rgba.width * rgba.height
    return {
        "transparentRatio": round(histogram[0] / total, 4),
        "partialAlphaRatio": round(sum(histogram[1:255]) / total, 4),
        "alphaBbox": list(alpha.getbbox() or (0, 0, 0, 0)),
    }


def remove_chroma_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            red, green, blue, _ = pixels[x, y]
            distance = math.sqrt((red - 255) ** 2 + green**2 + (blue - 255) ** 2)
            if distance <= 28:
                alpha = 0
            elif distance >= 92:
                alpha = 255
            else:
                alpha = round((distance - 28) / 64 * 255)
            magenta_excess = (red + blue) / 2 - green
            if magenta_excess > 45:
                spill_alpha = round(max(0, min(255, (130 - magenta_excess) / 85 * 255)))
                alpha = min(alpha, spill_alpha)
                red = min(red, green + 35)
                blue = min(blue, green + 35)
            pixels[x, y] = (red, green, blue, alpha)
    return rgba


def trim_transparent(image: Image.Image, padding: int = 8) -> Image.Image:
    rgba = image.convert("RGBA")
    bbox = rgba.getchannel("A").getbbox()
    if bbox is None:
        raise ValueError("Cannot trim an empty-alpha image.")
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(rgba.width, bbox[2] + padding)
    bottom = min(rgba.height, bbox[3] + padding)
    return rgba.crop((left, top, right, bottom))


def center_on_canvas(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    source = image.convert("RGBA")
    if source.width > size[0] or source.height > size[1]:
        source.thumbnail((size[0], size[1]), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    canvas.alpha_composite(source, ((size[0] - source.width) // 2, (size[1] - source.height) // 2))
    return canvas


def clear_fully_transparent_rgb(image: Image.Image) -> Image.Image:
    rgba = image.copy().convert("RGBA")
    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            red, green, blue, alpha = pixels[x, y]
            if alpha == 0 and (red or green or blue):
                pixels[x, y] = (0, 0, 0, 0)
    return rgba


def has_hidden_transparent_rgb(image: Image.Image) -> bool:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            red, green, blue, alpha = pixels[x, y]
            if alpha == 0 and (red or green or blue):
                return True
    return False


def replace_lower_body(image: Image.Image, standard_body: Image.Image, start_y: int = 288) -> Image.Image:
    rgba = image.copy().convert("RGBA")
    lower_body = standard_body.convert("RGBA").crop((0, start_y, rgba.width, rgba.height))
    rgba.paste(lower_body, (0, start_y))
    return rgba


def has_standard_lower_body(image: Image.Image, standard_body: Image.Image, start_y: int = 288) -> bool:
    actual = image.convert("RGBA").crop((0, start_y, image.width, image.height))
    expected = standard_body.convert("RGBA").crop((0, start_y, image.width, image.height))
    return ImageChops.difference(actual, expected).getbbox() is None


def build_honor_content_mask(source: Image.Image, minimum_alpha: int = 0) -> Image.Image:
    rgba = source.convert("RGBA")
    mask = Image.new("L", rgba.size, 0)
    source_pixels = rgba.load()
    mask_pixels = mask.load()
    for y in range(42, 288):
        for x in range(48, 224):
            red, green, blue, alpha = source_pixels[x, y]
            luminance = (red * 299 + green * 587 + blue * 114) / 1000
            dark_alpha = max(0, min(255, round((175 - luminance) / 70 * 255)))
            red_alpha = max(0, min(255, round((red - max(green, blue) - 12) / 42 * 255)))
            green_alpha = max(0, min(255, round((green - max(red, blue) - 8) / 34 * 255)))
            mask_pixels[x, y] = min(alpha, max(dark_alpha, red_alpha, green_alpha))
    if minimum_alpha > 0:
        mask = mask.point(lambda value: 0 if value < minimum_alpha else value)
    return mask.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.35))


def build_standard_honor(
    source: Image.Image,
    standard_body: Image.Image,
    *,
    minimum_content_alpha: int = 0,
) -> Image.Image:
    content = source.copy().convert("RGBA")
    content.putalpha(
        ImageChops.multiply(
            content.getchannel("A"),
            build_honor_content_mask(content, minimum_content_alpha),
        )
    )
    result = standard_body.copy().convert("RGBA")
    result.alpha_composite(content)
    return result


def has_standard_body_outside_content(image: Image.Image, standard_body: Image.Image) -> bool:
    actual = image.convert("RGBA")
    expected = standard_body.convert("RGBA")
    outside = Image.new("L", image.size, 255)
    ImageDraw.Draw(outside).rectangle((46, 40, 225, 290), fill=0)
    visible = expected.getchannel("A").point(lambda alpha: 255 if alpha > 0 else 0)
    rgb_difference = ImageChops.difference(actual.convert("RGB"), expected.convert("RGB")).convert("L")
    alpha_difference = ImageChops.difference(actual.getchannel("A"), expected.getchannel("A"))
    difference = ImageChops.lighter(rgb_difference, alpha_difference)
    return ImageChops.multiply(ImageChops.multiply(difference, outside), visible).getbbox() is None


def save_asset(
    image: Image.Image,
    key: str,
    relative_path: str,
    entries: list[dict[str, object]],
    *,
    nine_slice: list[int] | None = None,
) -> None:
    rgba = image.convert("RGBA")
    target = PACK / relative_path
    target.parent.mkdir(parents=True, exist_ok=True)
    rgba.save(target)
    entries.append(
        {
            "key": key,
            "path": relative_path,
            "width": rgba.width,
            "height": rgba.height,
            "anchor": [0.5, 0.5],
            "state": None,
            "nineSlice": nine_slice,
            "alpha": alpha_stats(rgba),
        }
    )


def build_cards_and_modals(entries: list[dict[str, object]]) -> tuple[dict[str, Image.Image], dict[str, Image.Image]]:
    source = Image.open(MASTER_SHEET).convert("RGBA")
    cards: dict[str, Image.Image] = {}
    modals: dict[str, Image.Image] = {}

    card_parts: list[tuple[str, str, Image.Image]] = []
    for key, relative_path, box in CARD_DEFINITIONS:
        card_parts.append((key, relative_path, trim_transparent(remove_chroma_background(source.crop(box)))))
    card_width = max(image.width for _, _, image in card_parts)
    card_height = max(image.height for _, _, image in card_parts)
    for key, relative_path, image in card_parts:
        standardized = center_on_canvas(image, (card_width, card_height))
        save_asset(standardized, key, relative_path, entries, nine_slice=[42, 42, 70, 70])
        cards[key] = standardized

    modal_parts: list[tuple[str, str, Image.Image]] = []
    for key, relative_path, box in MODAL_DEFINITIONS:
        modal_parts.append((key, relative_path, trim_transparent(remove_chroma_background(source.crop(box)))))
    modal_width = max(image.width for _, _, image in modal_parts)
    modal_height = max(image.height for _, _, image in modal_parts)
    for key, relative_path, image in modal_parts:
        standardized = center_on_canvas(image, (modal_width, modal_height))
        save_asset(standardized, key, relative_path, entries, nine_slice=[58, 58, 58, 58])
        modals[key] = standardized

    return cards, modals


def tile_key(item_id: str) -> tuple[str, str]:
    suffix = item_id.removeprefix("tile_")
    if suffix.startswith("wan_"):
        number = suffix.removeprefix("wan_")
        return f"tiles.mahjong.wan.{number}", f"tiles/mahjong/wan-{number}.png"
    if suffix.startswith("dot_"):
        number = suffix.removeprefix("dot_")
        return f"tiles.mahjong.dot.{number}", f"tiles/mahjong/dot-{number}.png"
    if suffix.startswith("bamboo_"):
        number = suffix.removeprefix("bamboo_")
        return f"tiles.mahjong.bamboo.{number}", f"tiles/mahjong/bamboo-{number}.png"
    if suffix.startswith("honor_"):
        honor = suffix.removeprefix("honor_")
        honor = "white" if honor == "whiteboard" else honor
        return f"tiles.mahjong.honor.{honor}", f"tiles/mahjong/honor-{honor}.png"
    if suffix == "back_default":
        return "tiles.mahjong.back.default", "tiles/mahjong/back-default.png"
    raise ValueError(f"Unknown tile id: {item_id}")


def build_bamboo_eight() -> Image.Image:
    blank = Image.open(TILE_SOURCE / "preview/standard-body-blank.png").convert("RGBA")
    bamboo_two = Image.open(TILE_SOURCE / "base/tile_bamboo_02.png").convert("RGBA")
    source_crop = bamboo_two.crop((82, 42, 190, 154))
    blank_crop = blank.crop((82, 42, 190, 154))
    difference = ImageChops.difference(source_crop.convert("RGB"), blank_crop.convert("RGB")).convert("L")
    mask = difference.point(lambda value: 255 if value >= 18 else 0)
    mask = mask.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    bbox = mask.getbbox()
    if bbox is None:
        raise ValueError("Could not extract the standard bamboo glyph.")
    glyph = source_crop.crop(bbox).convert("RGBA")
    glyph.putalpha(mask.crop(bbox))
    glyph.thumbnail((38, 58), Image.Resampling.LANCZOS)

    result = blank.copy()
    centers_x = (103, 169)
    centers_y = (74, 132, 190, 248)
    for center_y in centers_y:
        for center_x in centers_x:
            result.alpha_composite(glyph, (center_x - glyph.width // 2, center_y - glyph.height // 2))
    return result


def build_tiles(entries: list[dict[str, object]]) -> dict[str, Image.Image]:
    source_manifest = json.loads((TILE_SOURCE / "manifest.json").read_text(encoding="utf-8"))
    source_items = list(source_manifest["items"])
    if not any(str(item["id"]) == "tile_back_default" for item in source_items):
        source_items.append({"id": "tile_back_default", "file": "base/tile_back_default.png"})
    standard_body = Image.open(TILE_SOURCE / "preview/standard-body-blank.png").convert("RGBA")
    standard_alpha = standard_body.getchannel("A")
    tiles: dict[str, Image.Image] = {}
    for item in source_items:
        item_id = str(item["id"])
        key, relative_path = tile_key(item_id)
        if item_id == "tile_bamboo_08":
            image = build_bamboo_eight()
        else:
            image = Image.open(TILE_SOURCE / str(item["file"])).convert("RGBA")
        if item_id in HONOR_IDS:
            image = build_standard_honor(
                image,
                standard_body,
                minimum_content_alpha=48 if item_id in STRICT_HONOR_CONTENT_IDS else 0,
            )
            image = clear_fully_transparent_rgb(image)
        elif item_id == "tile_back_default":
            image.putalpha(standard_alpha)
            image = replace_lower_body(image, standard_body)
            image = clear_fully_transparent_rgb(image)
        if image.size != (272, 384):
            raise ValueError(f"Unexpected tile size for {item['id']}: {image.size}")
        save_asset(image, key, relative_path, entries)
        tiles[key] = image
    if len(tiles) != 35:
        raise ValueError(f"Expected 35 tile assets, got {len(tiles)}")
    return tiles


def checker_canvas(size: tuple[int, int], checker: int = 24) -> Image.Image:
    canvas = Image.new("RGBA", size, (0, 0, 0, 255))
    draw = ImageDraw.Draw(canvas)
    for y in range(0, size[1], checker):
        for x in range(0, size[0], checker):
            shade = 50 if (x // checker + y // checker) % 2 == 0 else 76
            draw.rectangle((x, y, x + checker - 1, y + checker - 1), fill=(shade, shade, shade, 255))
    return canvas


def thumbnail(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    copy = image.copy().convert("RGBA")
    copy.thumbnail(size, Image.Resampling.LANCZOS)
    return copy


def build_cards_modals_preview(cards: dict[str, Image.Image], modals: dict[str, Image.Image]) -> None:
    canvas = checker_canvas((1200, 1680), 30)
    card_keys = [definition[0] for definition in CARD_DEFINITIONS]
    for index, key in enumerate(card_keys):
        image = thumbnail(cards[key], (250, 580))
        x = 25 + index * 292 + (250 - image.width) // 2
        canvas.alpha_composite(image, (x, 40))

    modal_keys = [definition[0] for definition in MODAL_DEFINITIONS]
    for index, key in enumerate(modal_keys):
        image = thumbnail(modals[key], (540, 330))
        column = index % 2
        row = index // 2
        x = 40 + column * 580 + (540 - image.width) // 2
        y = 660 + row * 330 + (300 - image.height) // 2
        canvas.alpha_composite(image, (x, y))
    canvas.save(PACK / "previews/formal-ui-batch-c-cards-modals.png")


def build_tiles_preview(tiles: dict[str, Image.Image]) -> None:
    keys = [key for key in tiles if key != "tiles.mahjong.back.default"]
    keys.append("tiles.mahjong.back.default")
    columns = 7
    rows = 5
    cell_width = 190
    cell_height = 260
    canvas = checker_canvas((columns * cell_width, rows * cell_height), 26)
    draw = ImageDraw.Draw(canvas)
    for index, key in enumerate(keys):
        image = thumbnail(tiles[key], (132, 186))
        x = (index % columns) * cell_width + (cell_width - image.width) // 2
        y = (index // columns) * cell_height + 28
        canvas.alpha_composite(image, (x, y))
        draw.text(((index % columns) * cell_width + 8, (index // columns) * cell_height + 222), key, fill=(242, 224, 178, 255))
    canvas.save(PACK / "previews/formal-ui-batch-c-tiles.png")


def validate(entries: list[dict[str, object]], preserved_count: int) -> dict[str, object]:
    errors: list[str] = []
    keys = [str(entry["key"]) for entry in entries]
    if len(keys) != len(set(keys)):
        errors.append("Duplicate manifest keys found.")
    if preserved_count != 36:
        errors.append(f"Expected 36 preserved Batch A+B assets, got {preserved_count}.")
    if len(entries) != 80:
        errors.append(f"Expected 80 total assets, got {len(entries)}.")

    tile_sizes: set[tuple[int, int]] = set()
    for entry in entries:
        target = PACK / str(entry["path"])
        if not target.exists():
            errors.append(f"Missing file: {entry['path']}")
            continue
        with Image.open(target) as image:
            if image.mode != "RGBA":
                errors.append(f"Non-RGBA image: {entry['path']}")
            if image.size != (entry["width"], entry["height"]):
                errors.append(f"Size mismatch: {entry['path']}")
            if str(entry["key"]).startswith("tiles.mahjong."):
                tile_sizes.add(image.size)
            if entry["key"] != "background.scene.emerald":
                alpha = image.getchannel("A")
                if alpha.getbbox() is None:
                    errors.append(f"Empty alpha: {entry['path']}")
                corners = (
                    alpha.getpixel((0, 0)),
                    alpha.getpixel((image.width - 1, 0)),
                    alpha.getpixel((0, image.height - 1)),
                    alpha.getpixel((image.width - 1, image.height - 1)),
                )
                if any(value > 12 for value in corners):
                    errors.append(f"Opaque corner background: {entry['path']}")
    if tile_sizes != {(272, 384)}:
        errors.append(f"Tile canvas mismatch: {sorted(tile_sizes)}")

    reference_alpha = Image.open(PACK / "tiles/mahjong/wan-01.png").convert("RGBA").getchannel("A")
    standard_body = Image.open(TILE_SOURCE / "preview/standard-body-blank.png").convert("RGBA")
    reference_bbox = reference_alpha.getbbox()
    honor_back_keys = {
        "tiles.mahjong.honor.east",
        "tiles.mahjong.honor.south",
        "tiles.mahjong.honor.west",
        "tiles.mahjong.honor.north",
        "tiles.mahjong.honor.red",
        "tiles.mahjong.honor.green",
        "tiles.mahjong.honor.white",
        "tiles.mahjong.back.default",
    }
    entry_by_key = {str(entry["key"]): entry for entry in entries}
    for key in honor_back_keys:
        path = PACK / str(entry_by_key[key]["path"])
        image = Image.open(path).convert("RGBA")
        if image.getchannel("A").getbbox() != reference_bbox:
            errors.append(f"Honor/back alpha bbox mismatch: {entry_by_key[key]['path']}")
        if has_hidden_transparent_rgb(image):
            errors.append(f"Hidden RGB under transparent pixels: {entry_by_key[key]['path']}")
        if not has_standard_lower_body(image, standard_body):
            errors.append(f"Non-standard lower body: {entry_by_key[key]['path']}")
        if key != "tiles.mahjong.back.default" and not has_standard_body_outside_content(image, standard_body):
            errors.append(f"Non-standard honor body: {entry_by_key[key]['path']}")

    return {
        "pack": "hulebu-formal-ui-v1",
        "batch": "A+B+C",
        "assetCount": len(entries),
        "status": "passed" if not errors else "failed",
        "errors": errors,
        "checks": {
            "preservedBatchABAssets": preserved_count == 36,
            "uniqueKeys": len(keys) == len(set(keys)),
            "rgbaAssets": not any("Non-RGBA" in error for error in errors),
            "transparentCorners": not any("Opaque corner background" in error for error in errors),
            "mahjongTileCount": sum(1 for key in keys if key.startswith("tiles.mahjong.")),
            "mahjongTileCanvas": {"width": 272, "height": 384},
            "honorBackStandardAlpha": not any("Honor/back alpha bbox mismatch" in error for error in errors),
            "transparentRgbCleared": not any("Hidden RGB under transparent pixels" in error for error in errors),
            "honorBackStandardLowerBody": not any("Non-standard lower body" in error for error in errors),
            "honorStandardWhiteBody": not any("Non-standard honor body" in error for error in errors),
            "targetViewport": {"width": 390, "height": 844, "resourceScale": 2},
        },
    }


def main() -> None:
    if not MASTER_SHEET.exists():
        raise FileNotFoundError(MASTER_SHEET)
    if not MANIFEST_PATH.exists():
        raise FileNotFoundError(MANIFEST_PATH)
    existing_manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    preserved = [
        entry
        for entry in existing_manifest["assets"]
        if not str(entry["key"]).startswith(("cards.", "modals.", "tiles.mahjong."))
    ]
    new_entries: list[dict[str, object]] = []
    cards, modals = build_cards_and_modals(new_entries)
    tiles = build_tiles(new_entries)
    entries = preserved + new_entries
    build_cards_modals_preview(cards, modals)
    build_tiles_preview(tiles)

    manifest = {
        **existing_manifest,
        "version": 2,
        "batch": "A+B+C",
        "batches": ["A", "B", "C"],
        "visualBasis": "T249 approved formal UI previews, PPTOKEN formal masters, and the cleaned v7 mahjong tile body.",
        "assets": entries,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    report = validate(entries, len(preserved))
    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if report["status"] != "passed":
        raise SystemExit(json.dumps(report, ensure_ascii=False, indent=2))
    print(f"Built Batch C: {len(new_entries)} assets; formal pack total: {len(entries)}")


if __name__ == "__main__":
    main()
