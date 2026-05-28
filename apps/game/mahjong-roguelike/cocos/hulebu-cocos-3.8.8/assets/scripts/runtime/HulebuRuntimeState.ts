import type { HulebuCocosSceneModel, HulebuComboControlModel, HulebuComboType } from "../contracts/HulebuSceneModel";
import type { HulebuLayoutSize } from "../bootstrap/HulebuSampleSceneModel";
import type { HulebuLevelTileConfig, HulebuRuntimeLevelConfig, HulebuTileSuit } from "../config/HulebuLevelConfig";

interface HulebuRuntimeTile extends HulebuLevelTileConfig {
  location: "board" | "slot" | "reserve" | "removed";
}

interface HulebuComboCandidate {
  type: HulebuComboType;
  tileIds: string[];
  key: string;
}

const SUIT_LABELS: Record<HulebuTileSuit, string> = {
  wan: "万",
  tiao: "条",
  tong: "筒",
  honor: "",
};

const HONOR_LABELS: Record<number, string> = {
  1: "东",
  2: "南",
  3: "西",
  4: "北",
  5: "中",
  6: "发",
  7: "白",
};

const COMBO_TYPES: HulebuComboType[] = ["hu", "gang", "peng", "chi"];

function scaleLayoutValue(value: number, scale: number): number {
  return Math.round(value * scale);
}

export class HulebuRuntimeState {
  private readonly level: HulebuRuntimeLevelConfig;
  private tiles: HulebuRuntimeTile[];
  private slot: string[];
  private reserve: string[];
  private score = 0;
  private coins = 0;

  constructor(level: HulebuRuntimeLevelConfig) {
    this.level = level;
    this.tiles = level.tiles.map((tile) => ({
      ...tile,
      blockedBy: [...tile.blockedBy],
    }));
    this.slot = [...level.initialSlotOrder];
    this.reserve = [...level.initialReserveOrder];
  }

  moveTileToSlot(tileId: string): boolean {
    if (this.isBoardCleared()) {
      return false;
    }

    const tile = this.findTile(tileId);
    if (!tile || tile.location !== "board" || this.isTileBlocked(tileId) || this.slot.length >= this.level.defaults.slotLimit) {
      return false;
    }

    tile.location = "slot";
    this.slot.push(tileId);
    return true;
  }

  executeComboByKey(candidateKey: string | null): boolean {
    if (this.isBoardCleared()) {
      return false;
    }

    if (!candidateKey) {
      return false;
    }

    const candidate = this.getComboCandidates().find((item) => item.key === candidateKey);
    if (!candidate) {
      return false;
    }

    candidate.tileIds.forEach((tileId) => {
      const tile = this.findTile(tileId);
      if (tile) {
        tile.location = "removed";
      }
    });
    this.slot = this.slot.filter((tileId) => candidate.tileIds.indexOf(tileId) === -1);
    this.score += this.getComboScore(candidate.type);
    this.coins += candidate.type === "gang" ? 6 : 3;
    return true;
  }

  isBoardCleared(): boolean {
    return this.tiles.every((tile) => tile.location !== "board");
  }

  getLevelConfig(): HulebuRuntimeLevelConfig {
    return this.level;
  }

  getLevelOrder(): number {
    return this.level.order;
  }

  getRewardChoices(): string[] {
    return this.level.rewardPool.slice(0, 3);
  }

  toSceneModel(layout: HulebuLayoutSize): HulebuCocosSceneModel {
    const layoutScale = Math.max(1, layout.scale ?? 1);
    const screenWidth = Math.max(320, Math.round(layout.cssWidth ?? layout.width / layoutScale));
    const screenHeight = Math.max(568, Math.round(layout.cssHeight ?? layout.height / layoutScale));
    const configCenterX = 310;
    const configCenterY = 180;
    const boardCenterX = scaleLayoutValue(screenWidth / 2, layoutScale);
    const boardCenterY = scaleLayoutValue(screenHeight * 0.56, layoutScale);
    const boardScale = Math.min(
      1.16,
      Math.max(0.78, Math.min(screenWidth / 430, screenHeight / 740)),
    ) * layoutScale;

    return {
      boardNodes: this.tiles
        .filter((tile) => tile.location === "board")
        .sort((a, b) => a.layer - b.layer || a.id.localeCompare(b.id))
        .map((tile) => {
          const blocked = this.isTileBlocked(tile.id);
          const layerVisualOffset = scaleLayoutValue(tile.layer * 4, boardScale);
          return {
            name: `Tile_${tile.id}`,
            tileId: tile.id,
            label: this.getTileLabel(tile),
            position: {
              x: Math.round(boardCenterX + (tile.x - configCenterX) * boardScale + layerVisualOffset),
              y: Math.round(boardCenterY - (tile.y - configCenterY) * boardScale + layerVisualOffset),
            },
            zIndex: tile.layer * 100,
            interactable: !blocked,
            dimmed: blocked,
            prefabKey: `tile.${tile.suit}.${tile.rank}`,
            sourcePackage: this.level.id,
            stackDepth: tile.layer + 1,
          };
        }),
      slotNodes: this.createCells("Slot", this.slot, this.level.defaults.slotLimit),
      reserveNodes: this.createCells("Reserve", this.reserve, this.level.defaults.reserveLimit),
      comboControls: this.getComboControls(),
      hud: {
        boardRemainingText: `余牌 ${this.tiles.filter((tile) => tile.location === "board").length}`,
        slotStatusText: this.getSlotStatusText(),
        scoreText: `分 ${this.score}`,
        coinsText: `铜钱 ${this.coins}`,
        toolText: `洗 ${this.level.defaults.tools.shuffle} / 撤 ${this.level.defaults.tools.undo} / 透 ${this.level.defaults.tools.vision}`,
      },
    };
  }

  getComboControls(): HulebuComboControlModel[] {
    const candidates = this.getComboCandidates();
    return COMBO_TYPES.map((combo) => {
      const matching = candidates.filter((candidate) => candidate.type === combo);
      return {
        name: `Combo_${combo[0].toUpperCase()}${combo.slice(1)}`,
        combo,
        interactable: matching.length > 0,
        badgeText: String(matching.length),
        candidateKey: matching[0]?.key ?? null,
      };
    });
  }

  private createCells(prefix: "Slot" | "Reserve", tileIds: string[], capacity: number) {
    return Array.from({ length: capacity }, (_, index) => {
      const tileId = tileIds[index] ?? null;
      const tile = tileId ? this.findTile(tileId) : null;
      return {
        name: `${prefix}_${index}`,
        index,
        tileId,
        label: tile ? this.getTileLabel(tile) : null,
        occupied: Boolean(tile),
        prefabKey: tile ? `tile.${tile.suit}.${tile.rank}` : null,
      };
    });
  }

  private getComboCandidates(): HulebuComboCandidate[] {
    const candidates: HulebuComboCandidate[] = [];
    const slotTiles = this.slot.map((tileId) => this.findTile(tileId)).filter((tile): tile is HulebuRuntimeTile => Boolean(tile));

    if (slotTiles.length === this.level.defaults.slotLimit && this.canHu(slotTiles)) {
      candidates.push(this.makeCandidate("hu", slotTiles));
    }

    const groups = new Map<string, HulebuRuntimeTile[]>();
    slotTiles.forEach((tile) => {
      const key = `${tile.suit}-${tile.rank}`;
      const group = groups.get(key) ?? [];
      group.push(tile);
      groups.set(key, group);
    });

    groups.forEach((group) => {
      if (group.length >= 4) {
        candidates.push(this.makeCandidate("gang", group.slice(0, 4)));
      }
      if (group.length >= 3) {
        candidates.push(this.makeCandidate("peng", group.slice(0, 3)));
      }
    });

    for (const suit of ["wan", "tiao", "tong"] as HulebuTileSuit[]) {
      for (let rank = 1; rank <= 7; rank += 1) {
        const first = slotTiles.find((tile) => tile.suit === suit && tile.rank === rank);
        const second = slotTiles.find((tile) => tile.suit === suit && tile.rank === rank + 1);
        const third = slotTiles.find((tile) => tile.suit === suit && tile.rank === rank + 2);
        if (first && second && third) {
          candidates.push(this.makeCandidate("chi", [first, second, third]));
        }
      }
    }

    return candidates;
  }

  private canHu(tiles: HulebuRuntimeTile[]): boolean {
    const counts = new Map<string, number>();
    tiles.forEach((tile) => {
      const key = `${tile.suit}-${tile.rank}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    for (const [key, count] of counts) {
      if (count < 2) {
        continue;
      }
      const nextCounts = new Map(counts);
      nextCounts.set(key, count - 2);
      if (this.canMakeMelds(nextCounts, 2)) {
        return true;
      }
    }

    return false;
  }

  private canMakeMelds(counts: Map<string, number>, meldsRemaining: number): boolean {
    if (meldsRemaining === 0) {
      return [...counts.values()].every((count) => count === 0);
    }

    const entry = [...counts.entries()].find(([, count]) => count > 0);
    if (!entry) {
      return false;
    }

    const [key, count] = entry;
    if (count >= 3) {
      const nextCounts = new Map(counts);
      nextCounts.set(key, count - 3);
      if (this.canMakeMelds(nextCounts, meldsRemaining - 1)) {
        return true;
      }
    }

    const [suit, rankText] = key.split("-");
    const rank = Number(rankText);
    if (suit !== "honor" && rank <= 7) {
      const second = `${suit}-${rank + 1}`;
      const third = `${suit}-${rank + 2}`;
      if ((counts.get(second) ?? 0) > 0 && (counts.get(third) ?? 0) > 0) {
        const nextCounts = new Map(counts);
        nextCounts.set(key, count - 1);
        nextCounts.set(second, (nextCounts.get(second) ?? 0) - 1);
        nextCounts.set(third, (nextCounts.get(third) ?? 0) - 1);
        if (this.canMakeMelds(nextCounts, meldsRemaining - 1)) {
          return true;
        }
      }
    }

    return false;
  }

  private makeCandidate(type: HulebuComboType, tiles: HulebuRuntimeTile[]): HulebuComboCandidate {
    return {
      type,
      tileIds: tiles.map((tile) => tile.id),
      key: `${type}:${tiles.map((tile) => tile.id).sort().join(",")}`,
    };
  }

  private getComboScore(combo: HulebuComboType): number {
    if (combo === "hu") {
      return 120;
    }
    if (combo === "gang") {
      return 50;
    }
    return combo === "peng" ? 20 : 10;
  }

  private getSlotStatusText(): string {
    if (this.isBoardCleared()) {
      return "牌山已清空";
    }
    if (this.getComboCandidates().length > 0) {
      return "可消除";
    }
    if (this.slot.length >= this.level.defaults.slotLimit) {
      return "槽位已满";
    }
    return `槽位 ${this.slot.length}/${this.level.defaults.slotLimit}`;
  }

  private isTileBlocked(tileId: string): boolean {
    const tile = this.findTile(tileId);
    if (!tile || tile.location !== "board") {
      return false;
    }

    return tile.blockedBy.some((blockerId) => this.findTile(blockerId)?.location === "board");
  }

  private findTile(tileId: string): HulebuRuntimeTile | undefined {
    return this.tiles.find((tile) => tile.id === tileId);
  }

  private getTileLabel(tile: Pick<HulebuRuntimeTile, "suit" | "rank">): string {
    if (tile.suit === "honor") {
      return HONOR_LABELS[tile.rank] ?? `字${tile.rank}`;
    }
    return `${tile.rank}${SUIT_LABELS[tile.suit]}`;
  }
}
