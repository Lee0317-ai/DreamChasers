import { resources, SpriteFrame } from "cc";
import { getHulebuFormalMahjongSpritePath } from "./HulebuFormalUiCatalog";

export const HULEBU_TILE_SPRITE_FRAME_PATHS: Record<string, string> = {
  "tile.back": getHulebuFormalMahjongSpritePath("back-default"),
  ...Object.fromEntries(Array.from({ length: 9 }, (_, index) => [`tile.tiao.${index + 1}`, getHulebuFormalMahjongSpritePath(`bamboo-${String(index + 1).padStart(2, "0")}`)])),
  ...Object.fromEntries(Array.from({ length: 9 }, (_, index) => [`tile.tong.${index + 1}`, getHulebuFormalMahjongSpritePath(`dot-${String(index + 1).padStart(2, "0")}`)])),
  ...Object.fromEntries(Array.from({ length: 9 }, (_, index) => [`tile.wan.${index + 1}`, getHulebuFormalMahjongSpritePath(`wan-${String(index + 1).padStart(2, "0")}`)])),
  "tile.honor.1": getHulebuFormalMahjongSpritePath("honor-east"),
  "tile.honor.2": getHulebuFormalMahjongSpritePath("honor-south"),
  "tile.honor.3": getHulebuFormalMahjongSpritePath("honor-west"),
  "tile.honor.4": getHulebuFormalMahjongSpritePath("honor-north"),
  "tile.honor.5": getHulebuFormalMahjongSpritePath("honor-red"),
  "tile.honor.6": getHulebuFormalMahjongSpritePath("honor-green"),
  "tile.honor.7": getHulebuFormalMahjongSpritePath("honor-white"),
};

const HULEBU_LEGACY_TILE_SPRITE_FRAME_PATHS: Record<string, string> = {
  "tile.tiao.1": "ui/v6/tiles/mahjong/bamboo/tile_bamboo_01/spriteFrame",
  "tile.tiao.2": "ui/v6/tiles/mahjong/bamboo/tile_bamboo_02/spriteFrame",
  "tile.tiao.3": "ui/v6/tiles/mahjong/bamboo/tile_bamboo_03/spriteFrame",
  "tile.tiao.4": "ui/v6/tiles/mahjong/bamboo/tile_bamboo_04/spriteFrame",
  "tile.tiao.5": "ui/v6/tiles/mahjong/bamboo/tile_bamboo_05/spriteFrame",
  "tile.tiao.6": "ui/v6/tiles/mahjong/bamboo/tile_bamboo_06/spriteFrame",
  "tile.tiao.7": "ui/v6/tiles/mahjong/bamboo/tile_bamboo_07/spriteFrame",
  "tile.tiao.8": "ui/formal-v1/tiles/mahjong/bamboo-08/spriteFrame",
  "tile.tiao.9": "ui/v6/tiles/mahjong/bamboo/tile_bamboo_09/spriteFrame",
  "tile.tong.1": "ui/v6/tiles/mahjong/dot/tile_dot_01/spriteFrame",
  "tile.tong.2": "ui/v6/tiles/mahjong/dot/tile_dot_02/spriteFrame",
  "tile.tong.3": "ui/v6/tiles/mahjong/dot/tile_dot_03/spriteFrame",
  "tile.tong.4": "ui/v6/tiles/mahjong/dot/tile_dot_04/spriteFrame",
  "tile.tong.5": "ui/v6/tiles/mahjong/dot/tile_dot_05/spriteFrame",
  "tile.tong.6": "ui/v6/tiles/mahjong/dot/tile_dot_06/spriteFrame",
  "tile.tong.7": "ui/v6/tiles/mahjong/dot/tile_dot_07/spriteFrame",
  "tile.tong.8": "ui/v6/tiles/mahjong/dot/tile_dot_08/spriteFrame",
  "tile.tong.9": "ui/v6/tiles/mahjong/dot/tile_dot_09/spriteFrame",
  "tile.wan.1": "ui/v6/tiles/mahjong/wan/tile_wan_01/spriteFrame",
  "tile.wan.2": "ui/v6/tiles/mahjong/wan/tile_wan_02/spriteFrame",
  "tile.wan.3": "ui/v6/tiles/mahjong/wan/tile_wan_03/spriteFrame",
  "tile.wan.4": "ui/v6/tiles/mahjong/wan/tile_wan_04/spriteFrame",
  "tile.wan.5": "ui/v6/tiles/mahjong/wan/tile_wan_05/spriteFrame",
  "tile.wan.6": "ui/v6/tiles/mahjong/wan/tile_wan_06/spriteFrame",
  "tile.wan.7": "ui/v6/tiles/mahjong/wan/tile_wan_07/spriteFrame",
  "tile.wan.8": "ui/v6/tiles/mahjong/wan/tile_wan_08/spriteFrame",
  "tile.wan.9": "ui/v6/tiles/mahjong/wan/tile_wan_09/spriteFrame",
  "tile.honor.1": "ui/v6/tiles/mahjong/honor/tile_honor_east/spriteFrame",
  "tile.honor.2": "ui/v6/tiles/mahjong/honor/tile_honor_south/spriteFrame",
  "tile.honor.3": "ui/v6/tiles/mahjong/honor/tile_honor_west/spriteFrame",
  "tile.honor.4": "ui/v6/tiles/mahjong/honor/tile_honor_north/spriteFrame",
  "tile.honor.5": "ui/v6/tiles/mahjong/honor/tile_honor_red/spriteFrame",
  "tile.honor.6": "ui/v6/tiles/mahjong/honor/tile_honor_green/spriteFrame",
  "tile.honor.7": "ui/v6/tiles/mahjong/honor/tile_honor_whiteboard/spriteFrame",
};

type HulebuTileSpriteCallback = (spriteFrame: SpriteFrame | null) => void;

export function getHulebuTileSpriteFramePath(tileKey: string | null | undefined): string | null {
  if (!tileKey) {
    return null;
  }

  return HULEBU_TILE_SPRITE_FRAME_PATHS[tileKey] ?? null;
}

export class HulebuTileSpriteCatalog {
  private readonly loadedFrames = new Map<string, SpriteFrame | null>();
  private readonly pendingCallbacks = new Map<string, HulebuTileSpriteCallback[]>();

  loadTileSpriteFrame(tileKey: string | null | undefined, callback: HulebuTileSpriteCallback): void {
    const path = getHulebuTileSpriteFramePath(tileKey);
    if (!tileKey || !path) {
      callback(null);
      return;
    }

    if (this.loadedFrames.has(tileKey)) {
      callback(this.loadedFrames.get(tileKey) ?? null);
      return;
    }

    const pending = this.pendingCallbacks.get(tileKey);
    if (pending) {
      pending.push(callback);
      return;
    }

    this.pendingCallbacks.set(tileKey, [callback]);
    resources.load(path, SpriteFrame, (error, spriteFrame) => {
      if (!error && spriteFrame) {
        this.resolveTileLoad(tileKey, spriteFrame);
        return;
      }

      const legacyPath = HULEBU_LEGACY_TILE_SPRITE_FRAME_PATHS[tileKey];
      if (!legacyPath) {
        this.resolveTileLoad(tileKey, null);
        return;
      }

      resources.load(legacyPath, SpriteFrame, (legacyError, legacySpriteFrame) => {
        this.resolveTileLoad(tileKey, legacyError ? null : legacySpriteFrame ?? null);
      });
    });
  }

  private resolveTileLoad(tileKey: string, spriteFrame: SpriteFrame | null): void {
    this.loadedFrames.set(tileKey, spriteFrame);
    const callbacks = this.pendingCallbacks.get(tileKey) ?? [];
    this.pendingCallbacks.delete(tileKey);
    callbacks.forEach((pendingCallback) => pendingCallback(spriteFrame));
  }
}
