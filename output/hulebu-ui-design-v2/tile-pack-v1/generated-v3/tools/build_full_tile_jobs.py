#!/usr/bin/env python3
"""Build isolated edit prompts and source mappings for the full Mahjong set."""

from __future__ import annotations

import json
import sys
from pathlib import Path


STYLE = (
    "Create a cute polished 2D mobile-game asset with a warm ivory ceramic "
    "face, mint-green thickness, a small coral-pink edge accent, rounded chunky "
    "toy proportions, soft clay-like volume, and clean highly readable symbols. "
    "Center one complete tile in a straight front view with equal margins. Use a "
    "transparent background. Add nothing else."
)


def face_prompt(identity: str, detail: str) -> str:
    return (
        f"Restyle this single game tile while preserving its exact {identity} "
        f"identity, symbols, colors, count, and layout. {detail} {STYLE}"
    )


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit(
            "usage: build_full_tile_jobs.py <generated-v3-directory> <source-tiles-directory>"
        )
    base = Path(sys.argv[1])
    source_tiles = Path(sys.argv[2])
    prompt_dir = base / "prompts"
    prompt_dir.mkdir(parents=True, exist_ok=True)
    jobs: list[dict[str, str]] = []

    for family, folder, identity, detail in (
        ("wan", "numbered/wan", "Characters suit", "Keep the readable numeral above 萬 and use thick rounded playful lettering."),
        ("tiao", "numbered/tiao", "Bamboo suit", "Keep the exact existing bamboo or one-bamboo emblem arrangement; make the motifs thick, rounded, segmented, and readable like friendly sticker icons."),
        ("tong", "numbered/tong", "Dots suit", "Keep the exact number and arrangement of circular pips; make them large rounded sticker badges with simple concentric details."),
    ):
        for number in range(1, 10):
            name = f"{family}-{number:02d}"
            prompt = face_prompt(identity, detail)
            prompt_path = prompt_dir / f"{name}.prompt.txt"
            if not prompt_path.exists():
                prompt_path.write_text(prompt + "\n", encoding="utf-8")
            jobs.append(
                {
                    "name": name,
                    "source": str(source_tiles / folder / f"{name}.png"),
                    "prompt": str(prompt_path),
                }
            )

    honor_details = {
        "honor-east": "Keep the readable Traditional Chinese character 東 in thick rounded dark-green lettering.",
        "honor-south": "Keep the readable Traditional Chinese character 南 in thick rounded dark-green lettering.",
        "honor-west": "Keep the readable Traditional Chinese character 西 in thick rounded dark-green lettering.",
        "honor-north": "Keep the readable Traditional Chinese character 北 in thick rounded dark-green lettering.",
        "honor-red": "Keep the readable Chinese character 中 in thick rounded coral-red lettering.",
        "honor-green": "Keep the readable Traditional Chinese character 發 in thick rounded jade-green lettering.",
        "honor-white": "Keep the center intentionally blank and preserve the subtle empty-tile border treatment.",
    }
    for name, detail in honor_details.items():
        prompt = face_prompt("honor tile", detail)
        prompt_path = prompt_dir / f"{name}.prompt.txt"
        if not prompt_path.exists():
            prompt_path.write_text(prompt + "\n", encoding="utf-8")
        jobs.append(
            {
                "name": name,
                "source": str(source_tiles / "honors" / f"{name}.png"),
                "prompt": str(prompt_path),
            }
        )

    back_name = "tile-back"
    back_prompt = (
        "Restyle this single Mahjong tile back while preserving one complete tile "
        "and its back-facing orientation. Use a mint-green ceramic back, coral-pink "
        "inner border, and a centered embossed emblem of a cute round pink carrot "
        "mascot with two blue oval eyes, a black curved smile, and a small green leaf "
        "crown. Keep the emblem simple and readable at small size. Use rounded chunky "
        "toy proportions, soft clay-like volume, a straight front view, equal margins, "
        "and a transparent background. No text and no additional objects."
    )
    back_prompt_path = prompt_dir / f"{back_name}.prompt.txt"
    if not back_prompt_path.exists():
        back_prompt_path.write_text(back_prompt + "\n", encoding="utf-8")
    jobs.append(
        {
            "name": back_name,
            "source": str(
                source_tiles.parents[1] / "formal-v1/tiles/mahjong/back-default.png"
            ),
            "prompt": str(back_prompt_path),
        }
    )

    manifest = base / "full-tile-jobs.json"
    manifest.write_text(
        json.dumps({"jobs": jobs}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"wrote {len(jobs)} jobs to {manifest}")


if __name__ == "__main__":
    main()
