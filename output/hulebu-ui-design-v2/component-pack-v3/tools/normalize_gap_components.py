#!/usr/bin/env python3
"""Normalize gap-fill UI components: trim transparent edges, scale to target sizes."""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "images" / "batch-gap"
DST = ROOT / "normalized"

# name -> target (width, height); proportions kept close to generation canvas
TARGETS = {
    "combo-choice-panel": (900, 900),
    "discard-rescue-panel": (860, 640),
    "archetype-card": (340, 480),
    "boss-health-bar": (860, 260),
    "btn-confirm": (300, 130),
    "btn-cancel": (300, 130),
    "btn-close": (140, 140),
    "btn-back": (140, 140),
    "toast-banner": (720, 180),
    "tutorial-highlight-frame": (520, 520),
    "result-stats-panel": (680, 760),
}


def trim_alpha(im: Image.Image, threshold: int = 8) -> Image.Image:
    alpha = im.getchannel("A")
    bbox = alpha.point(lambda p: 255 if p > threshold else 0).getbbox()
    return im.crop(bbox) if bbox else im


def main() -> None:
    assets = []
    for name, target in TARGETS.items():
        src = SRC / f"{name}.png"
        if not src.exists():
            print(f"missing {src.name}, skipped")
            continue
        im = Image.open(src).convert("RGBA")
        im = trim_alpha(im)
        # fit inside target box, keep aspect, center on transparent canvas
        tw, th = target
        scale = min(tw / im.width, th / im.height)
        nw, nh = max(1, round(im.width * scale)), max(1, round(im.height * scale))
        im = im.resize((nw, nh), Image.LANCZOS)
        canvas = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
        canvas.paste(im, ((tw - nw) // 2, (th - nh) // 2), im)
        canvas.save(DST / f"{name}.png")
        assets.append({"name": name, "size": [tw, th]})
        print(f"ok {name} -> {tw}x{th}")

    manifest = ROOT / "gap-components-manifest.json"
    manifest.write_text(
        json.dumps({"assets": assets}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"manifest: {manifest}")


if __name__ == "__main__":
    main()
