#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

import build_ui_component_pack_v1 as base


base.OUT_DIR = base.ROOT / "output/hulebu-ui-assets/hulebu-ui-component-pack-v2-usable-only"
base.PACK_NAME = "hulebu-ui-component-pack-v2-usable-only"
base.PACK_NOTES = [
    "Formal components are transparent RGBA PNGs.",
    "Gameplay-composite-only partial crops are excluded from this usable pack.",
    "Combo choice panel uses an empty shell plus T051 v7 mahjong tile thumbnails in generated previews.",
    "This pack is not wired into Web or Cocos runtime yet.",
]
base.COMPONENTS = [component for component in base.COMPONENTS if component.source == "spec"]


if __name__ == "__main__":
    base.main()
