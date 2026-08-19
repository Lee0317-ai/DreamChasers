from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "normalized"
OUT = ROOT / "previews" / "t291-ui-mothers.png"
files = sorted(SRC.glob("*.png"))
thumb_w, thumb_h = 260, 180
label_h = 34
cols = 4
rows = (len(files) + cols - 1) // cols
canvas = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + label_h)), (47, 42, 48))
draw = ImageDraw.Draw(canvas)
font = ImageFont.load_default()
for index, path in enumerate(files):
    image = Image.open(path).convert("RGBA")
    scale = min((thumb_w - 22) / image.width, (thumb_h - 18) / image.height)
    size = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    image = image.resize(size, Image.Resampling.LANCZOS)
    x = (index % cols) * thumb_w + (thumb_w - image.width) // 2
    y = (index // cols) * (thumb_h + label_h) + (thumb_h - image.height) // 2
    checker = Image.new("RGB", (image.width, image.height), (237, 231, 214))
    for cx in range(0, image.width, 12):
        for cy in range(0, image.height, 12):
            if (cx // 12 + cy // 12) % 2:
                draw_color = (214, 207, 191)
                ImageDraw.Draw(checker).rectangle((cx, cy, cx + 11, cy + 11), fill=draw_color)
    canvas.paste(checker, (x, y))
    canvas.paste(image, (x, y), image)
    label = path.stem
    draw.text(((index % cols) * thumb_w + 8, (index // cols) * (thumb_h + label_h) + thumb_h + 8), label, fill=(255, 248, 229), font=font)
OUT.parent.mkdir(parents=True, exist_ok=True)
canvas.save(OUT)
print(OUT)
