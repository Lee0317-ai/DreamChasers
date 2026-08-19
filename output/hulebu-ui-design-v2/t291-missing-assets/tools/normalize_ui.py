#!/usr/bin/env python3
from __future__ import annotations

import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "images" / "raw"
CLEAN = ROOT / "images" / "clean"
OUT = ROOT / "normalized"
PROMPTS = ROOT / "prompts"
MANIFEST = ROOT / "manifest.json"
KEY = "/Users/lee/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py"
PYTHON = "/Users/lee/.codex/skills/.venv-sprite-forge/bin/python"

TARGETS = {
    "login-wechat-normal": (640, 160),
    "login-guest-normal": (640, 140),
    "login-status-panel": (720, 180),
    "icon-wechat": (160, 160),
    "icon-cloud-sync": (160, 160),
    "icon-login-error": (160, 160),
    "loading-spinner-sheet": (512, 512),
    "mascot-login-pedestal": (420, 180),
    "speech-bubble-left": (720, 260),
    "speech-bubble-right": (720, 260),
    "speech-bubble-top": (640, 240),
    "speech-bubble-warning": (720, 260),
    "speech-bubble-success": (720, 260),
    "lobby-entry-mainline": (440, 300),
    "lobby-entry-modes": (440, 300),
    "lobby-entry-collection": (440, 300),
    "lobby-entry-growth": (440, 300),
    "mode-collection": (280, 280),
    "lobby-continue-panel": (760, 170),
    "node-current": (210, 210),
    "node-locked": (190, 190),
    "star-empty": (120, 120),
    "star-filled": (120, 120),
    "chapter-switch-frame": (360, 120),
    "result-title-victory": (760, 190),
    "result-title-failure": (760, 190),
    "result-suggestion-panel": (720, 190),
    "result-unlock-ribbon": (720, 150),
    "reward-title-panel": (720, 160),
    "event-title-panel": (720, 160),
}

def clean(name: str) -> Path:
    CLEAN.mkdir(parents=True, exist_ok=True)
    target = CLEAN / f"{name}.png"
    if not target.exists():
        subprocess.run([PYTHON, KEY, "--input", str(RAW / f"{name}.png"), "--out", str(target), "--key-color", "#FF00FF", "--tolerance", "72", "--soft-matte", "--transparent-threshold", "45", "--opaque-threshold", "110", "--edge-feather", "1", "--edge-contract", "1", "--despill", "--force"], check=True)
    return target

def remove_connected_dark_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    for corner in ((0, 0), (rgba.width - 1, 0), (0, rgba.height - 1), (rgba.width - 1, rgba.height - 1)):
        pixel = rgba.getpixel(corner)
        if pixel[3] > 0 and max(pixel[:3]) < 90:
            ImageDraw.floodfill(rgba, corner, (0, 0, 0, 0), thresh=72)
    return rgba

def normalize(name: str, target_size: tuple[int, int]) -> dict:
    image = remove_connected_dark_background(Image.open(clean(name)))
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        raise ValueError(f"{name} has no visible alpha after chroma key")
    crop = image.crop(bbox)
    if name == "star-empty":
        # The generated center is a black fill; the asset contract requires a true hollow socket.
        center = (crop.width // 2, crop.height // 2)
        if max(crop.getpixel(center)[:3]) < 80:
            ImageDraw.floodfill(crop, center, (0, 0, 0, 0), thresh=72)
    tw, th = target_size
    scale = min((tw * 0.96) / crop.width, (th * 0.88) / crop.height)
    resized = crop.resize((max(1, round(crop.width * scale)), max(1, round(crop.height * scale))), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    canvas.alpha_composite(resized, ((tw - resized.width) // 2, (th - resized.height) // 2))
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{name}.png"
    canvas.save(path)
    return {"name": name, "raw": f"images/raw/{name}.png", "clean": f"images/clean/{name}.png", "normalized": f"normalized/{name}.png", "size": [tw, th], "alpha": True, "prompt": f"prompts/{name}.prompt.txt"}

def main() -> None:
    records = [normalize(name, size) for name, size in TARGETS.items() if (RAW / f"{name}.png").exists()]
    payload = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}
    payload["normalizedAssets"] = records
    MANIFEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"normalized {len(records)} assets")

if __name__ == "__main__":
    main()
