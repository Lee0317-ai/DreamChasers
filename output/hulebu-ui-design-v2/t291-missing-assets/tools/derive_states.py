from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
NORMALIZED = ROOT / "normalized"
STATES = ROOT / "normalized" / "states"
V3 = Path("/Users/lee/Desktop/Lee/DreamChasers/output/hulebu-ui-design-v2/component-pack-v3/normalized")

def fit_pressed(image: Image.Image, amount: float = 0.94) -> Image.Image:
    image = image.convert("RGBA")
    w, h = image.size
    inner = image.resize((round(w * amount), round(h * amount)), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    canvas.alpha_composite(inner, ((w - inner.width) // 2, (h - inner.height) // 2 + max(1, round(h * 0.025))))
    return canvas

def disabled(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    alpha = image.getchannel("A")
    rgb = ImageOps.grayscale(image.convert("RGB")).convert("RGB")
    rgb = ImageEnhance.Brightness(rgb).enhance(1.08)
    rgb = ImageEnhance.Contrast(rgb).enhance(0.72)
    result = rgb.convert("RGBA")
    result.putalpha(alpha.point(lambda p: round(p * 0.62)))
    return result

def load_v3(name: str) -> Image.Image:
    return Image.open(V3 / f"{name}.png").convert("RGBA")

def save(source: Image.Image, name: str, state: str) -> dict:
    STATES.mkdir(parents=True, exist_ok=True)
    image = source if state == "normal" else fit_pressed(source) if state == "pressed" else disabled(source)
    path = STATES / f"{name}-{state}.png"
    image.save(path)
    return {"name": f"{name}-{state}", "source": str(path.relative_to(ROOT)), "state": state, "size": list(image.size), "alpha": True}

def main() -> None:
    records = []
    for name, source_name, states in [
        ("login-wechat", "login-wechat-normal", ("pressed", "disabled")),
        ("login-guest", "login-guest-normal", ("pressed",)),
    ]:
        source = Image.open(NORMALIZED / f"{source_name}.png").convert("RGBA")
        for state in states:
            records.append(save(source, name, state))
    for name in ("action-chi", "action-peng", "action-gang", "action-bugang", "action-hu"):
        source = load_v3(name)
        for state in ("pressed", "disabled"):
            records.append(save(source, name, state))
    for name in ("tool-shuffle", "tool-undo", "tool-vision", "tool-discard"):
        records.append(save(load_v3(name), name, "disabled"))
    (ROOT / "state-assets-manifest.json").write_text(json.dumps({"assets": records}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"derived {len(records)} state assets")

if __name__ == "__main__":
    main()
