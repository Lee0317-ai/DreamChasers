#!/usr/bin/env python3
from __future__ import annotations

import json
import math
from collections import deque
from pathlib import Path
from statistics import median

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[3]
PACK = ROOT / "output/hulebu-ui-assets/hulebu-formal-ui-v1"
PREVIEWS = PACK / "previews"
MASTER = PACK / "master-sources"

SCENE_SOURCE = PREVIEWS / "formal-ui-scene-v1.png"
ACTION_SOURCE = PREVIEWS / "formal-ui-actions-states-v1.png"
TOOL_SOURCE = PREVIEWS / "formal-ui-tools-states-v2.png"
BACKGROUND_SOURCE = MASTER / "scene-background-clean-v1.png"

STATES = ("normal", "active", "disabled")
ACTION_NAMES = ("chi", "peng", "gang", "bugang", "hu")
TOOL_NAMES = ("shuffle", "undo", "hint", "buff", "counter")


def ensure_sources() -> None:
    missing = [path for path in (SCENE_SOURCE, ACTION_SOURCE, TOOL_SOURCE, BACKGROUND_SOURCE) if not path.exists()]
    if missing:
        raise FileNotFoundError(f"Missing source files: {missing}")
    for child in ("background", "hud", "board", "actions", "tools", "previews"):
        (PACK / child).mkdir(parents=True, exist_ok=True)


def edge_color(image: Image.Image) -> tuple[int, int, int]:
    rgb = image.convert("RGB")
    samples: list[tuple[int, int, int]] = []
    for x in range(rgb.width):
        samples.append(rgb.getpixel((x, 0)))
        samples.append(rgb.getpixel((x, rgb.height - 1)))
    for y in range(rgb.height):
        samples.append(rgb.getpixel((0, y)))
        samples.append(rgb.getpixel((rgb.width - 1, y)))
    return tuple(int(median(channel)) for channel in zip(*samples))


def color_distance(left: tuple[int, int, int], right: tuple[int, int, int]) -> float:
    return math.sqrt(sum((left[index] - right[index]) ** 2 for index in range(3)))


def flood_alpha(image: Image.Image, tolerance: int, local_tolerance: int = 18) -> Image.Image:
    rgba = image.convert("RGBA")
    rgb = rgba.convert("RGB")
    background_color = edge_color(rgba)
    visited = bytearray(rgba.width * rgba.height)
    background = bytearray(rgba.width * rgba.height)
    queue: deque[tuple[int, int]] = deque()

    def push(x: int, y: int, parent_color: tuple[int, int, int] | None = None) -> None:
        if x < 0 or y < 0 or x >= rgba.width or y >= rgba.height:
            return
        index = y * rgba.width + x
        if visited[index]:
            return
        visited[index] = 1
        color = rgb.getpixel((x, y))
        matches_global = color_distance(color, background_color) <= tolerance
        matches_local = parent_color is not None and color_distance(color, parent_color) <= local_tolerance
        if matches_global or matches_local:
            background[index] = 1
            queue.append((x, y))

    for x in range(rgba.width):
        push(x, 0)
        push(x, rgba.height - 1)
    for y in range(rgba.height):
        push(0, y)
        push(rgba.width - 1, y)

    while queue:
        x, y = queue.popleft()
        parent_color = rgb.getpixel((x, y))
        push(x + 1, y, parent_color)
        push(x - 1, y, parent_color)
        push(x, y + 1, parent_color)
        push(x, y - 1, parent_color)

    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            if background[y * rgba.width + x]:
                red, green, blue, _ = pixels[x, y]
                pixels[x, y] = (red, green, blue, 0)
    return rgba


def remove_small_islands(image: Image.Image, minimum_area: int = 80) -> Image.Image:
    rgba = image.copy().convert("RGBA")
    alpha = rgba.getchannel("A")
    alpha_pixels = alpha.load()
    seen = bytearray(rgba.width * rgba.height)
    keep = bytearray(rgba.width * rgba.height)

    for start_y in range(rgba.height):
        for start_x in range(rgba.width):
            start_index = start_y * rgba.width + start_x
            if seen[start_index] or alpha_pixels[start_x, start_y] == 0:
                continue
            queue: deque[tuple[int, int]] = deque([(start_x, start_y)])
            component: list[tuple[int, int]] = []
            seen[start_index] = 1
            while queue:
                x, y = queue.popleft()
                component.append((x, y))
                for next_x, next_y in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if next_x < 0 or next_y < 0 or next_x >= rgba.width or next_y >= rgba.height:
                        continue
                    index = next_y * rgba.width + next_x
                    if seen[index] or alpha_pixels[next_x, next_y] == 0:
                        continue
                    seen[index] = 1
                    queue.append((next_x, next_y))
            if len(component) >= minimum_area:
                for x, y in component:
                    keep[y * rgba.width + x] = 1

    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            if alpha_pixels[x, y] and not keep[y * rgba.width + x]:
                red, green, blue, _ = pixels[x, y]
                pixels[x, y] = (red, green, blue, 0)
    return rgba


def keep_largest_alpha_component(image: Image.Image) -> Image.Image:
    rgba = image.copy().convert("RGBA")
    alpha = rgba.getchannel("A")
    alpha_pixels = alpha.load()
    seen = bytearray(rgba.width * rgba.height)
    components: list[list[tuple[int, int]]] = []
    for start_y in range(rgba.height):
        for start_x in range(rgba.width):
            index = start_y * rgba.width + start_x
            if seen[index] or alpha_pixels[start_x, start_y] < 16:
                continue
            queue: deque[tuple[int, int]] = deque([(start_x, start_y)])
            component: list[tuple[int, int]] = []
            seen[index] = 1
            while queue:
                x, y = queue.popleft()
                component.append((x, y))
                for next_x in range(x - 1, x + 2):
                    for next_y in range(y - 1, y + 2):
                        if next_x < 0 or next_y < 0 or next_x >= rgba.width or next_y >= rgba.height:
                            continue
                        next_index = next_y * rgba.width + next_x
                        if seen[next_index] or alpha_pixels[next_x, next_y] < 16:
                            continue
                        seen[next_index] = 1
                        queue.append((next_x, next_y))
            components.append(component)

    if not components:
        return rgba
    largest = max(components, key=len)
    keep = {y * rgba.width + x for x, y in largest}
    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            if y * rgba.width + x not in keep:
                red, green, blue, _ = pixels[x, y]
                pixels[x, y] = (red, green, blue, 0)
    return rgba


def soften_alpha(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    rgba.putalpha(alpha.point(lambda value: 0 if value < 10 else value))
    return rgba


def extract(source: Image.Image, box: tuple[int, int, int, int], tolerance: int) -> Image.Image:
    return soften_alpha(remove_small_islands(flood_alpha(source.crop(box), tolerance)))


def antialiased_mask(size: tuple[int, int], shapes: list[tuple[str, tuple[int, ...], int]]) -> Image.Image:
    scale = 4
    mask = Image.new("L", (size[0] * scale, size[1] * scale), 0)
    draw = ImageDraw.Draw(mask)
    for kind, box, radius in shapes:
        scaled_box = tuple(value * scale for value in box)
        if kind == "rounded":
            draw.rounded_rectangle(scaled_box, radius=radius * scale, fill=255)
        elif kind == "ellipse":
            draw.ellipse(scaled_box, fill=255)
        else:
            raise ValueError(f"Unsupported mask shape: {kind}")
    return mask.resize(size, Image.Resampling.LANCZOS)


def extract_masked(
    source: Image.Image,
    box: tuple[int, int, int, int],
    shapes: list[tuple[str, tuple[int, ...], int]],
) -> Image.Image:
    image = source.crop(box).convert("RGBA")
    image.putalpha(antialiased_mask(image.size, shapes))
    return image


def extract_enclosed(
    source: Image.Image,
    box: tuple[int, int, int, int],
    fallback_shapes: list[tuple[str, tuple[int, ...], int]],
    barrier_size: int = 9,
) -> Image.Image:
    image = source.crop(box).convert("RGBA")
    rgb = image.convert("RGB")
    barrier = Image.new("L", image.size, 0)
    barrier_pixels = barrier.load()
    rgb_pixels = rgb.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue = rgb_pixels[x, y]
            gold_or_paper = red >= 92 and green >= 72 and red - blue >= 16
            warm_wood = red >= 58 and red >= green * 1.18 and green >= blue * 1.08
            if gold_or_paper or warm_wood:
                barrier_pixels[x, y] = 255

    barrier = barrier.filter(ImageFilter.MaxFilter(barrier_size))
    barrier_pixels = barrier.load()
    outside = bytearray(image.width * image.height)
    queue: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        if x < 0 or y < 0 or x >= image.width or y >= image.height:
            return
        index = y * image.width + x
        if outside[index] or barrier_pixels[x, y] > 0:
            return
        outside[index] = 1
        queue.append((x, y))

    for x in range(image.width):
        push(x, 0)
        push(x, image.height - 1)
    for y in range(image.height):
        push(0, y)
        push(image.width - 1, y)
    while queue:
        x, y = queue.popleft()
        push(x + 1, y)
        push(x - 1, y)
        push(x, y + 1)
        push(x, y - 1)

    alpha = Image.new("L", image.size, 0)
    alpha_pixels = alpha.load()
    for y in range(image.height):
        for x in range(image.width):
            if not outside[y * image.width + x]:
                alpha_pixels[x, y] = 255
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.7))
    opaque_ratio = sum(alpha.histogram()[128:]) / (image.width * image.height)
    if opaque_ratio < 0.12 or opaque_ratio > 0.86:
        alpha = antialiased_mask(image.size, fallback_shapes)
    image.putalpha(alpha)
    return keep_largest_alpha_component(image)


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


def save_asset(
    image: Image.Image,
    relative_path: str,
    key: str,
    entries: list[dict[str, object]],
    *,
    state: str | None = None,
    nine_slice: list[int] | None = None,
) -> None:
    target = PACK / relative_path
    target.parent.mkdir(parents=True, exist_ok=True)
    rgba = image.convert("RGBA")
    rgba.save(target)
    entry: dict[str, object] = {
        "key": key,
        "path": relative_path,
        "width": rgba.width,
        "height": rgba.height,
        "anchor": [0.5, 0.5],
        "state": state,
        "nineSlice": nine_slice,
        "alpha": alpha_stats(rgba),
    }
    entries.append(entry)


def build_background(entries: list[dict[str, object]]) -> Image.Image:
    source = Image.open(BACKGROUND_SOURCE).convert("RGBA")
    target_aspect = 390 / 844
    crop_width = round(source.height * target_aspect)
    left = (source.width - crop_width) // 2
    portrait = source.crop((left, 0, left + crop_width, source.height))
    portrait = portrait.resize((780, 1688), Image.Resampling.LANCZOS)
    save_asset(portrait, "background/scene-emerald-v1.png", "background.scene.emerald", entries)
    entries[-1]["anchor"] = [0.5, 0.5]
    return portrait


def build_hud_and_board(entries: list[dict[str, object]]) -> dict[str, Image.Image]:
    source = Image.open(SCENE_SOURCE).convert("RGBA")
    definitions = (
        ("hud/level-badge.png", "hud.levelBadge", (130, 28, 435, 180), [("rounded", (3, 2, 302, 149), 48)], [55, 55, 45, 45]),
        ("hud/score-badge.png", "hud.scoreBadge", (598, 30, 870, 180), [("rounded", (2, 2, 269, 147), 34)], [40, 40, 32, 32]),
        ("hud/tile-counter.png", "hud.tileCounter", (30, 510, 215, 622), [("rounded", (2, 2, 182, 109), 25)], [28, 28, 24, 24]),
        ("board/discard-slots.png", "board.discardSlots", (210, 920, 770, 1088), [("rounded", (3, 3, 557, 165), 38)], [60, 60, 45, 45]),
        ("board/hand-slots.png", "board.handSlots", (92, 1088, 915, 1308), [("rounded", (3, 3, 820, 217), 55)], [85, 85, 65, 65]),
    )
    result: dict[str, Image.Image] = {}
    for relative_path, key, box, shapes, nine_slice in definitions:
        if key == "board.handSlots":
            image = extract_masked(source, box, shapes)
        else:
            image = extract_enclosed(source, box, shapes, 9)
        save_asset(image, relative_path, key, entries, nine_slice=nine_slice)
        result[key] = image
    return result


def build_state_assets(entries: list[dict[str, object]]) -> tuple[dict[str, Image.Image], dict[str, Image.Image]]:
    action_source = Image.open(ACTION_SOURCE).convert("RGBA")
    tool_source = Image.open(TOOL_SOURCE).convert("RGBA")
    action_centers_x = (320, 570, 830)
    action_centers_y = (278, 548, 818, 1090, 1360)
    tool_centers_x = (200, 515, 825)
    tool_centers_y = (165, 466, 765, 1065, 1360)
    actions: dict[str, Image.Image] = {}
    tools: dict[str, Image.Image] = {}

    for row, action in enumerate(ACTION_NAMES):
        for column, state in enumerate(STATES):
            center_x = action_centers_x[column]
            center_y = action_centers_y[row]
            box = (center_x - 130, center_y - 100, center_x + 130, center_y + 100)
            image = extract_masked(
                action_source,
                box,
                [("rounded", (3, 5, 257, 195), 36)],
            )
            key = f"actions.{action}.{state}"
            save_asset(image, f"actions/{action}-{state}.png", key, entries, state=state, nine_slice=[45, 45, 34, 34])
            actions[key] = image

    for row, tool in enumerate(TOOL_NAMES):
        for column, state in enumerate(STATES):
            center_x = tool_centers_x[column]
            center_y = tool_centers_y[row]
            box = (center_x - 122, center_y - 136, center_x + 122, center_y + 136)
            image = extract_enclosed(
                tool_source,
                box,
                [
                    ("ellipse", (22, 0, 222, 205), 0),
                    ("rounded", (18, 168, 226, 268), 18),
                ],
                9,
            )
            key = f"tools.{tool}.{state}"
            save_asset(image, f"tools/{tool}-{state}.png", key, entries, state=state)
            tools[key] = image
    return actions, tools


def thumbnail(image: Image.Image, box: tuple[int, int]) -> Image.Image:
    copy = image.copy().convert("RGBA")
    copy.thumbnail(box, Image.Resampling.LANCZOS)
    return copy


def build_preview(
    background: Image.Image,
    hud_board: dict[str, Image.Image],
    actions: dict[str, Image.Image],
    tools: dict[str, Image.Image],
) -> None:
    canvas = background.copy().convert("RGBA")

    placements = (
        ("hud.levelBadge", (28, 38), (290, 145)),
        ("hud.scoreBadge", (480, 45), (260, 145)),
        ("hud.tileCounter", (30, 540), (175, 115)),
        ("board.discardSlots", (145, 1050), (490, 155)),
        ("board.handSlots", (55, 1230), (670, 205)),
    )
    for key, position, size in placements:
        canvas.alpha_composite(thumbnail(hud_board[key], size), position)

    for index, action in enumerate(ACTION_NAMES):
        image = thumbnail(actions[f"actions.{action}.normal"], (135, 92))
        canvas.alpha_composite(image, (42 + index * 145, 1480))

    for index, tool in enumerate(TOOL_NAMES):
        image = thumbnail(tools[f"tools.{tool}.normal"], (105, 118))
        canvas.alpha_composite(image, (655, 255 + index * 145))

    draw = ImageDraw.Draw(canvas)
    draw.rectangle((0, 0, canvas.width - 1, canvas.height - 1), outline=(218, 182, 105, 180), width=3)
    canvas.save(PACK / "previews/formal-ui-batch-ab-preview.png")


def build_states_preview(actions: dict[str, Image.Image], tools: dict[str, Image.Image]) -> None:
    cell_width = 300
    cell_height = 220
    canvas = Image.new("RGBA", (cell_width * 3, cell_height * 10), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    checker = 24
    for y in range(0, canvas.height, checker):
        for x in range(0, canvas.width, checker):
            shade = 48 if (x // checker + y // checker) % 2 == 0 else 72
            draw.rectangle((x, y, x + checker - 1, y + checker - 1), fill=(shade, shade, shade, 255))

    rows = [("actions", name, actions) for name in ACTION_NAMES]
    rows.extend(("tools", name, tools) for name in TOOL_NAMES)
    for row, (prefix, name, source) in enumerate(rows):
        for column, state in enumerate(STATES):
            key = f"{prefix}.{name}.{state}"
            image = thumbnail(source[key], (270, 176))
            x = column * cell_width + (cell_width - image.width) // 2
            y = row * cell_height + 28 + (176 - image.height) // 2
            canvas.alpha_composite(image, (x, y))
            draw.text((column * cell_width + 10, row * cell_height + 8), key, fill=(242, 224, 178, 255))
    canvas.save(PACK / "previews/formal-ui-batch-ab-states-preview.png")


def validate(entries: list[dict[str, object]]) -> dict[str, object]:
    errors: list[str] = []
    keys = [str(entry["key"]) for entry in entries]
    if len(keys) != len(set(keys)):
        errors.append("Duplicate manifest keys found.")
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
                if any(value > 10 for value in corners):
                    errors.append(f"Opaque corner background: {entry['path']}")

    for prefix, names in (("actions", ACTION_NAMES), ("tools", TOOL_NAMES)):
        for name in names:
            sizes = {
                (entry["width"], entry["height"])
                for entry in entries
                if str(entry["key"]).startswith(f"{prefix}.{name}.")
            }
            if len(sizes) != 1:
                errors.append(f"State size mismatch: {prefix}.{name}")

    return {
        "pack": "hulebu-formal-ui-v1",
        "batch": "A+B",
        "assetCount": len(entries),
        "status": "passed" if not errors else "failed",
        "errors": errors,
        "checks": {
            "uniqueKeys": len(keys) == len(set(keys)),
            "rgbaAssets": True if not errors else not any("Non-RGBA" in error for error in errors),
            "transparentCorners": not any("Opaque corner background" in error for error in errors),
            "stateCanvasAlignment": not any("State size mismatch" in error for error in errors),
            "targetViewport": {"width": 390, "height": 844, "resourceScale": 2},
        },
    }


def main() -> None:
    ensure_sources()
    entries: list[dict[str, object]] = []
    background = build_background(entries)
    hud_board = build_hud_and_board(entries)
    actions, tools = build_state_assets(entries)
    build_preview(background, hud_board, actions, tools)
    build_states_preview(actions, tools)

    manifest = {
        "name": "hulebu-formal-ui-v1",
        "version": 1,
        "batch": "A+B",
        "designViewport": {"width": 390, "height": 844},
        "resourceScale": 2,
        "visualBasis": "T249 approved formal UI previews and the PPTOKEN clean background master.",
        "assets": entries,
    }
    (PACK / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    report = validate(entries)
    (PACK / "validation-report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    if report["status"] != "passed":
        raise SystemExit(json.dumps(report, ensure_ascii=False, indent=2))
    print(f"Built {len(entries)} assets in {PACK}")


if __name__ == "__main__":
    main()
