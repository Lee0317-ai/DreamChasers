from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
V3 = Path("/Users/lee/Desktop/Lee/DreamChasers/output/hulebu-ui-design-v2/component-pack-v3")
OUT = ROOT / "previews"

def asset(folder: Path, name: str) -> Image.Image:
    return Image.open(folder / f"{name}.png").convert("RGBA")

def place(canvas: Image.Image, image: Image.Image, center: tuple[int, int], max_size: tuple[int, int] | None = None) -> None:
    if max_size:
        scale = min(max_size[0] / image.width, max_size[1] / image.height, 1)
        image = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    canvas.alpha_composite(image, (round(center[0] - image.width / 2), round(center[1] - image.height / 2)))

def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    bg = V3 / "backgrounds" / "images"
    ui = ROOT / "normalized"
    v3 = V3 / "normalized"

    login = asset(bg, "title-lobby")
    place(login, asset(ui, "mascot-login-pedestal"), (512, 415), (420, 180))
    place(login, asset(v3, "mascot-idle"), (512, 350), (260, 330))
    place(login, asset(ui, "login-status-panel"), (512, 760), (720, 180))
    place(login, asset(ui, "login-wechat-normal"), (512, 910), (640, 160))
    place(login, asset(ui, "login-guest-normal"), (512, 1050), (640, 140))
    place(login, asset(ui, "icon-cloud-sync"), (245, 760), (90, 90))
    login.save(OUT / "t291-login-flow-preview.png")

    gameplay = asset(bg, "gameplay")
    place(gameplay, asset(ui, "speech-bubble-left"), (650, 370), (720, 260))
    place(gameplay, asset(v3, "mascot-guide"), (850, 405), (240, 300))
    place(gameplay, asset(v3, "combo-choice-panel"), (512, 760), (620, 620))
    for index, name in enumerate(("action-chi", "action-peng", "action-gang")):
        place(gameplay, asset(v3, name), (300 + index * 210, 1290), (170, 170))
    gameplay.save(OUT / "t291-gameplay-bubble-preview.png")

    states = sorted((ui / "states").glob("*.png"))
    thumb_w, thumb_h, label_h, cols = 240, 150, 28, 4
    rows = (len(states) + cols - 1) // cols
    sheet = Image.new("RGBA", (cols * thumb_w, rows * (thumb_h + label_h)), (53, 47, 52, 255))
    draw = ImageDraw.Draw(sheet)
    for index, path in enumerate(states):
        image = Image.open(path).convert("RGBA")
        scale = min((thumb_w - 18) / image.width, (thumb_h - 14) / image.height)
        image = image.resize((max(1, round(image.width * scale)), max(1, round(image.height * scale))), Image.Resampling.LANCZOS)
        x = (index % cols) * thumb_w + (thumb_w - image.width) // 2
        y = (index // cols) * (thumb_h + label_h) + (thumb_h - image.height) // 2
        sheet.alpha_composite(image, (x, y))
        draw.text(((index % cols) * thumb_w + 7, (index // cols) * (thumb_h + label_h) + thumb_h + 6), path.stem, fill=(255, 248, 229, 255))
    sheet.save(OUT / "t291-state-assets-preview.png")
    print("wrote flow previews")

if __name__ == "__main__":
    main()
