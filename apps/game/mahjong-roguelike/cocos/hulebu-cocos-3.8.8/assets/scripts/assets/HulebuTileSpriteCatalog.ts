import { resources, SpriteFrame } from "cc";

export const HULEBU_TILE_SPRITE_FRAME_PATHS: Record<string, string> = {
  "tile.tiao.1": "ui/mahjong-tiles/tiles/refreshed/numbered/tiao/tiao-01/spriteFrame",
  "tile.tiao.2": "ui/mahjong-tiles/tiles/refreshed/numbered/tiao/tiao-02/spriteFrame",
  "tile.tiao.3": "ui/mahjong-tiles/tiles/refreshed/numbered/tiao/tiao-03/spriteFrame",
  "tile.tiao.4": "ui/mahjong-tiles/tiles/refreshed/numbered/tiao/tiao-04/spriteFrame",
  "tile.tiao.5": "ui/mahjong-tiles/tiles/refreshed/numbered/tiao/tiao-05/spriteFrame",
  "tile.tiao.6": "ui/mahjong-tiles/tiles/refreshed/numbered/tiao/tiao-06/spriteFrame",
  "tile.tiao.7": "ui/mahjong-tiles/tiles/refreshed/numbered/tiao/tiao-07/spriteFrame",
  "tile.tiao.8": "ui/mahjong-tiles/tiles/refreshed/numbered/tiao/tiao-08/spriteFrame",
  "tile.tiao.9": "ui/mahjong-tiles/tiles/refreshed/numbered/tiao/tiao-09/spriteFrame",
  "tile.tong.1": "ui/mahjong-tiles/tiles/refreshed/numbered/tong/tong-01/spriteFrame",
  "tile.tong.2": "ui/mahjong-tiles/tiles/refreshed/numbered/tong/tong-02/spriteFrame",
  "tile.tong.3": "ui/mahjong-tiles/tiles/refreshed/numbered/tong/tong-03/spriteFrame",
  "tile.tong.4": "ui/mahjong-tiles/tiles/refreshed/numbered/tong/tong-04/spriteFrame",
  "tile.tong.5": "ui/mahjong-tiles/tiles/refreshed/numbered/tong/tong-05/spriteFrame",
  "tile.tong.6": "ui/mahjong-tiles/tiles/refreshed/numbered/tong/tong-06/spriteFrame",
  "tile.tong.7": "ui/mahjong-tiles/tiles/refreshed/numbered/tong/tong-07/spriteFrame",
  "tile.tong.8": "ui/mahjong-tiles/tiles/refreshed/numbered/tong/tong-08/spriteFrame",
  "tile.tong.9": "ui/mahjong-tiles/tiles/refreshed/numbered/tong/tong-09/spriteFrame",
  "tile.wan.1": "ui/mahjong-tiles/tiles/refreshed/numbered/wan/wan-01/spriteFrame",
  "tile.wan.2": "ui/mahjong-tiles/tiles/refreshed/numbered/wan/wan-02/spriteFrame",
  "tile.wan.3": "ui/mahjong-tiles/tiles/refreshed/numbered/wan/wan-03/spriteFrame",
  "tile.wan.4": "ui/mahjong-tiles/tiles/refreshed/numbered/wan/wan-04/spriteFrame",
  "tile.wan.5": "ui/mahjong-tiles/tiles/refreshed/numbered/wan/wan-05/spriteFrame",
  "tile.wan.6": "ui/mahjong-tiles/tiles/refreshed/numbered/wan/wan-06/spriteFrame",
  "tile.wan.7": "ui/mahjong-tiles/tiles/refreshed/numbered/wan/wan-07/spriteFrame",
  "tile.wan.8": "ui/mahjong-tiles/tiles/refreshed/numbered/wan/wan-08/spriteFrame",
  "tile.wan.9": "ui/mahjong-tiles/tiles/refreshed/numbered/wan/wan-09/spriteFrame",
  "tile.honor.1": "ui/mahjong-tiles/tiles/refreshed/honors/honor-east/spriteFrame",
  "tile.honor.2": "ui/mahjong-tiles/tiles/refreshed/honors/honor-south/spriteFrame",
  "tile.honor.3": "ui/mahjong-tiles/tiles/refreshed/honors/honor-west/spriteFrame",
  "tile.honor.4": "ui/mahjong-tiles/tiles/refreshed/honors/honor-north/spriteFrame",
  "tile.honor.5": "ui/mahjong-tiles/tiles/refreshed/honors/honor-red/spriteFrame",
  "tile.honor.6": "ui/mahjong-tiles/tiles/refreshed/honors/honor-green/spriteFrame",
  "tile.honor.7": "ui/mahjong-tiles/tiles/refreshed/honors/honor-white/spriteFrame",
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
      const loadedFrame = error ? null : spriteFrame ?? null;
      this.loadedFrames.set(tileKey, loadedFrame);

      const callbacks = this.pendingCallbacks.get(tileKey) ?? [];
      this.pendingCallbacks.delete(tileKey);
      callbacks.forEach((pendingCallback) => pendingCallback(loadedFrame));
    });
  }
}
