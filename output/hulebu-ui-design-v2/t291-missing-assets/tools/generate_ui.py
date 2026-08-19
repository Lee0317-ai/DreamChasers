#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "images" / "raw"
PROMPTS = ROOT / "prompts"
MANIFEST = ROOT / "manifest.json"
CLI = Path("/Users/lee/.codex/skills/pptoken-imagegen/scripts/pptoken_imagegen.py")
PYTHON = Path("/Users/lee/.codex/skills/.venv-sprite-forge/bin/python")

STYLE = "polished 2D mobile game UI asset for the Hulebu cute mahjong roguelike, warm ivory ceramic face, mint-green side thickness, coral-pink edge accents, rounded chunky toy proportions, soft clay-like volume, clean HD game art, consistent straight front view, no pixel art"

ASSETS = [
    ("login-wechat-normal", (640, 160), "wide transparent primary login button shell with a reserved icon bay on the left and a blank label bay on the right, no logo, no text, no numbers, no mascot"),
    ("login-guest-normal", (640, 140), "wide transparent secondary guest-play button shell, visibly quieter than the primary button, blank label bay, no icon, no text, no numbers, no mascot"),
    ("login-status-panel", (720, 180), "wide transparent nine-slice status panel with a blank header band, blank two-line message area, and small blank retry control bay, no text, no icons, no numbers"),
    ("icon-wechat", (160, 160), "single transparent rounded icon of a simple jade-green speech-bubble login symbol with two tiny circular cutouts, no brand logo, no text"),
    ("icon-cloud-sync", (160, 160), "single transparent icon of a mint cloud with two coral circular sync arrows, no text, no numbers"),
    ("icon-login-error", (160, 160), "single transparent icon of a warm ivory cloud with a coral warning mark and tiny mint edge, friendly network error mood, no text, no numbers"),
    ("loading-spinner-sheet", (512, 512), "2x2 transparent animation sheet showing the same small mint-and-coral ceramic loading ring in four sequential rotational poses, each frame centered in its quadrant, no text, no numbers, keep all pixels inside a 65 percent safe area"),
    ("mascot-login-pedestal", (420, 180), "single transparent low rounded lotus-leaf and soft cloud pedestal for a small character to stand on, empty center, no character, no text, no background scene"),
    ("speech-bubble-left", (720, 260), "wide transparent nine-slice speech bubble with tail pointing down-right toward a mascot on the right, warm ivory center, coral and mint border, blank center for two lines of runtime text, no text, no icons"),
    ("speech-bubble-right", (720, 260), "wide transparent nine-slice speech bubble with tail pointing down-left toward a mascot on the left, warm ivory center, coral and mint border, blank center for two lines of runtime text, no text, no icons"),
    ("speech-bubble-top", (640, 240), "wide transparent nine-slice speech bubble with centered downward tail for a mascot below, warm ivory center, coral and mint border, blank center for two lines of runtime text, no text, no icons"),
    ("speech-bubble-warning", (720, 260), "wide transparent warning speech bubble with restrained coral warning rim and mint depth, warm ivory center, blank two-line message area, friendly game warning not a red error dialog, no text, no icons"),
    ("speech-bubble-success", (720, 260), "wide transparent success speech bubble with mint success rim and coral accent, warm ivory center, blank two-line message area, no text, no icons"),
    ("lobby-entry-mainline", (440, 300), "transparent rounded horizontal lobby entry card for mainline adventure, blank title bay, large blank illustration bay with subtle winding path and tiny ceramic node motif, no readable text, no numbers, no mascot"),
    ("lobby-entry-modes", (440, 300), "transparent rounded horizontal lobby entry card for multiple game modes, blank title bay, large blank illustration bay with four small abstract ceramic route tokens, no readable text, no numbers, no mascot"),
    ("lobby-entry-collection", (440, 300), "transparent rounded horizontal lobby entry card for tile collection and achievement gallery, blank title bay, large blank illustration bay with small framed tile mosaic motif, no readable text, no numbers, no mascot"),
    ("lobby-entry-growth", (440, 300), "transparent rounded horizontal lobby entry card for meta progression, blank title bay, large blank illustration bay with small sprouting jade leaf and coin motif, no readable text, no numbers, no mascot"),
    ("mode-collection", (280, 280), "single transparent round mode icon for collection and achievement gallery, ceramic album frame holding three blank tile silhouettes and one small star, no text, no numbers"),
    ("lobby-continue-panel", (760, 170), "wide transparent nine-slice continue-run panel with blank title bay, blank progress bay, and blank right-side action bay, no text, no numbers, no icons"),
    ("node-current", (210, 210), "single transparent map node for the currently available level, round warm ivory ceramic node with soft mint halo and coral edge, blank center, no lock, no text, no numbers, no path"),
    ("node-locked", (190, 190), "single transparent map node for a locked level, warm ivory ceramic round node with restrained mint shadow and simple coral closed-lock silhouette, no text, no numbers, no path"),
    ("star-empty", (120, 120), "single transparent empty five-point star socket, warm ivory ceramic with mint depth and coral outline, hollow center, no text, no numbers"),
    ("star-filled", (120, 120), "single transparent filled five-point reward star, warm ivory ceramic with bright coral center accent and mint depth, no text, no numbers"),
    ("chapter-switch-frame", (360, 120), "wide transparent nine-slice chapter switch frame with two blank arrow bays at left and right and blank center title bay, no arrows drawn, no text, no numbers"),
    ("result-title-victory", (760, 190), "wide transparent ceremonial result title plaque for victory, blank center title area, soft upward celebratory silhouette and small jade/coral accents, no text, no numbers, no mascot"),
    ("result-title-failure", (760, 190), "wide transparent result title plaque for failure, blank center title area, gentle subdued coral and mint accents, encouraging rather than harsh, no text, no numbers, no mascot"),
    ("result-suggestion-panel", (720, 190), "wide transparent nine-slice suggestion panel with blank two-line message area and small blank icon bay, warm ivory center, no text, no numbers, no icons"),
    ("result-unlock-ribbon", (720, 150), "wide transparent nine-slice unlock information ribbon with blank center message area and small blank end ornaments, no text, no numbers"),
    ("reward-title-panel", (720, 160), "wide transparent nine-slice reward-choice title panel with blank center title bay and subtle three-choice notch motif, no text, no numbers, no cards"),
    ("event-title-panel", (720, 160), "wide transparent nine-slice pre-level event title panel with blank center title bay and subtle coral lantern and mint leaf accents, no text, no numbers, no cards"),
]

def main() -> None:
    IMAGES.mkdir(parents=True, exist_ok=True)
    PROMPTS.mkdir(parents=True, exist_ok=True)
    generated = []
    for name, target, description in ASSETS:
        prompt = f"{STYLE}. Create one independent game UI asset on a perfectly flat solid pure magenta #FF00FF background for chroma-key extraction: {description}. No gradient background, no floor, no cast shadow outside the asset, no checkerboard, no watermark, no background scene."
        (PROMPTS / f"{name}.prompt.txt").write_text(prompt + "\n", encoding="utf-8")
        out = IMAGES / f"{name}.png"
        if not out.exists():
            size = "1536x1024" if target[0] / target[1] > 1.6 else "1024x1024"
            cmd = [str(PYTHON), str(CLI), "generate", "--transport", "proxy", "--prompt", prompt, "--size", size, "--quality", "high", "--background", "transparent", "--format", "png", "--out", str(out)]
            print(f"generate {name} {target[0]}x{target[1]}", flush=True)
            subprocess.run(cmd, check=True, env=os.environ.copy())
        generated.append({"name": name, "source": f"images/raw/{name}.png", "prompt": f"prompts/{name}.prompt.txt", "targetSize": list(target), "kind": "mother"})
    MANIFEST.write_text(json.dumps({"task": "T291", "style": STYLE, "assets": generated}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {MANIFEST}")

if __name__ == "__main__":
    main()
