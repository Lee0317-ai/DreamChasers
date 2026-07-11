import type {
  HulebuCocosSceneModel,
  HulebuComboControlModel,
  HulebuComboType,
  HulebuTileCounterModel,
} from "../contracts/HulebuSceneModel";
import type { HulebuLayoutSize } from "../bootstrap/HulebuSampleSceneModel";
import {
  getHulebuRunArchetypeConfig,
  getHulebuSpecialEventConfig,
  type HulebuBossGoalConfig,
  type HulebuLevelTileConfig,
  type HulebuRunArchetypeId,
  type HulebuRuntimeLevelConfig,
  type HulebuTileSuit,
  type HulebuToolType,
} from "../config/HulebuLevelConfig";

interface HulebuRuntimeTile extends HulebuLevelTileConfig {
  location: "board" | "slot" | "reserve" | "river" | "removed";
}

interface HulebuComboCandidate {
  type: HulebuComboType;
  tileIds: string[];
  key: string;
}

export interface HulebuRuntimeComboCandidateOption {
  type: HulebuComboType;
  key: string;
  tileIds: string[];
  labels: string[];
  prefabKeys: string[];
}

interface HulebuRuntimeOpenMeld {
  type: "peng" | "gang" | "bugang";
  tileKey: string;
  label: string;
  tileIds: string[];
  count: number;
}

export interface HulebuRuntimeSnapshot {
  tiles: HulebuRuntimeTile[];
  slot: string[];
  reserve: string[];
  river: string[];
  openMelds: HulebuRuntimeOpenMeld[];
  comboCounts: Record<HulebuComboType, number>;
  suitComboCounts: Record<HulebuTileSuit, number>;
  looseMountainDropIndex: number;
  score: number;
  coins: number;
  tools: HulebuRuntimeTools;
}

interface HulebuRuntimeTools {
  shuffle: number;
  undo: number;
  discard: number;
  vision: number;
}

export interface HulebuLevelModifierState {
  activeEventIds: string[];
  coinBonus: number;
  toolBonus: HulebuRuntimeTools;
  toolLocks: Partial<Record<HulebuToolType, boolean>>;
}

export interface HulebuRunRewardState {
  reserveBonus: number;
  shieldBonus: number;
  firstProtect: boolean;
  startingCoins: number;
  toolBonus: HulebuRuntimeTools;
  scoreBonus: Record<HulebuComboType, number>;
  pickedRewards: string[];
}

export interface HulebuMetaUpgradeState {
  reserveBonus: number;
  shieldBonus: number;
  toolBonus: number;
  riverBonus: number;
  startingCoins: number;
  visionBonus: number;
}

export interface HulebuRunArchetypeState {
  archetypeId: HulebuRunArchetypeId;
  label: string;
  startingCoins: number;
  toolBonus: HulebuRuntimeTools;
  scoreBonus: Record<HulebuComboType, number>;
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

const COMBO_TYPES: HulebuComboType[] = ["hu", "gang", "peng", "chi", "bugang"];
const BOSS_PROGRESS_COMBO_TYPES: HulebuComboType[] = ["hu", "gang", "peng", "chi", "bugang"];
const BOSS_PROGRESS_SUITS: HulebuTileSuit[] = ["wan", "tiao", "tong", "honor"];
const DEFAULT_RIVER_LIMIT = 3;
const KONG_SHAKE_LOOSE_COUNT = 2;
const HU_SHAKE_LOOSE_COUNT = 3;
const LOOSE_TILE_START_X = 210;
const LOOSE_TILE_START_Y = 64;
const LOOSE_TILE_GAP_X = 58;
const LOOSE_TILE_GAP_Y = 76;

export function createHulebuRunRewardState(): HulebuRunRewardState {
  return {
    reserveBonus: 0,
    shieldBonus: 0,
    firstProtect: false,
    startingCoins: 0,
    toolBonus: {
      shuffle: 0,
      undo: 0,
      discard: 0,
      vision: 0,
    },
    scoreBonus: createEmptyComboCounts(),
    pickedRewards: [],
  };
}

export function createHulebuLevelModifierState(): HulebuLevelModifierState {
  return {
    activeEventIds: [],
    coinBonus: 0,
    toolBonus: {
      shuffle: 0,
      undo: 0,
      discard: 0,
      vision: 0,
    },
    toolLocks: {},
  };
}

export function createHulebuMetaUpgradeState(): HulebuMetaUpgradeState {
  return {
    reserveBonus: 0,
    shieldBonus: 0,
    toolBonus: 0,
    riverBonus: 0,
    startingCoins: 0,
    visionBonus: 0,
  };
}

export function createHulebuRunArchetypeState(archetypeId: HulebuRunArchetypeId = "peng"): HulebuRunArchetypeState {
  const config = getHulebuRunArchetypeConfig(archetypeId);
  return {
    archetypeId: config.id,
    label: config.name,
    startingCoins: config.effect.startingCoins ?? 0,
    toolBonus: {
      shuffle: config.effect.toolBonus?.shuffle ?? 0,
      undo: config.effect.toolBonus?.undo ?? 0,
      discard: config.effect.toolBonus?.discard ?? 0,
      vision: config.effect.toolBonus?.vision ?? 0,
    },
    scoreBonus: {
      ...createEmptyComboCounts(),
      ...config.effect.scoreBonus,
    },
  };
}

export function applyHulebuSpecialEventToLevelState(
  currentState: HulebuLevelModifierState,
  eventId: string,
): HulebuLevelModifierState {
  const eventConfig = getHulebuSpecialEventConfig(eventId);
  const nextState = cloneLevelModifierState(currentState);
  nextState.activeEventIds.push(eventId);
  if (!eventConfig) {
    return nextState;
  }

  if (eventConfig.effect.type === "coin") {
    nextState.coinBonus += eventConfig.effect.amount;
  } else if (eventConfig.effect.type === "tool") {
    nextState.toolBonus[eventConfig.effect.tool] += eventConfig.effect.amount;
  } else if (eventConfig.effect.type === "forbid_tool") {
    nextState.toolLocks[eventConfig.effect.tool] = true;
  }

  return nextState;
}

export function mergeHulebuLevelModifierStates(
  baseState: HulebuLevelModifierState,
  nextState: HulebuLevelModifierState,
): HulebuLevelModifierState {
  return {
    activeEventIds: [...baseState.activeEventIds, ...nextState.activeEventIds],
    coinBonus: baseState.coinBonus + nextState.coinBonus,
    toolBonus: {
      shuffle: baseState.toolBonus.shuffle + nextState.toolBonus.shuffle,
      undo: baseState.toolBonus.undo + nextState.toolBonus.undo,
      discard: baseState.toolBonus.discard + nextState.toolBonus.discard,
      vision: baseState.toolBonus.vision + nextState.toolBonus.vision,
    },
    toolLocks: {
      ...baseState.toolLocks,
      ...nextState.toolLocks,
    },
  };
}

export function applyHulebuRewardToRunState(
  currentState: HulebuRunRewardState,
  rewardId: string,
): HulebuRunRewardState {
  const nextState = cloneRunRewardState(currentState);
  nextState.pickedRewards.push(rewardId);

  if (rewardId === "reserve_plus_1") {
    nextState.reserveBonus += 1;
  } else if (rewardId === "shield_plus_1") {
    nextState.shieldBonus += 1;
  } else if (rewardId === "first_protect_shield") {
    nextState.firstProtect = true;
    nextState.shieldBonus += 1;
  } else if (rewardId === "undo_plus_1") {
    nextState.toolBonus.undo += 1;
  } else if (rewardId === "vision_plus_1") {
    nextState.toolBonus.vision += 1;
  } else if (rewardId === "shuffle_plus_1") {
    nextState.toolBonus.shuffle += 1;
  } else if (rewardId === "coin_plus_20") {
    nextState.startingCoins += 20;
  } else if (rewardId === "chi_score_plus_8") {
    nextState.scoreBonus.chi += 8;
  } else if (rewardId === "peng_score_plus_10") {
    nextState.scoreBonus.peng += 10;
  } else if (rewardId === "gang_score_plus_25") {
    nextState.scoreBonus.gang += 25;
    nextState.scoreBonus.bugang += 25;
  } else if (rewardId === "advanced_east_probe") {
    nextState.toolBonus.vision += 1;
    nextState.scoreBonus.chi += 6;
  } else if (rewardId === "advanced_east_flow") {
    nextState.toolBonus.discard += 1;
    nextState.scoreBonus.hu += 18;
  } else if (rewardId === "advanced_south_river_guard") {
    nextState.toolBonus.discard += 1;
    nextState.shieldBonus += 1;
  } else if (rewardId === "advanced_south_stable_table") {
    nextState.reserveBonus += 1;
    nextState.scoreBonus.peng += 8;
  } else if (rewardId === "advanced_west_trial_audit") {
    nextState.toolBonus.undo += 1;
    nextState.scoreBonus.gang += 18;
    nextState.scoreBonus.bugang += 18;
  } else if (rewardId === "advanced_west_tail_gate") {
    nextState.firstProtect = true;
    nextState.shieldBonus += 1;
  } else if (rewardId === "advanced_north_kong_tide") {
    nextState.scoreBonus.gang += 30;
    nextState.scoreBonus.bugang += 30;
    nextState.startingCoins += 10;
  } else if (rewardId === "advanced_north_stable_life") {
    nextState.firstProtect = true;
    nextState.shieldBonus += 2;
    nextState.startingCoins += 20;
  }

  return nextState;
}

function scaleLayoutValue(value: number, scale: number): number {
  return Math.round(value * scale);
}

function cloneRunRewardState(state: HulebuRunRewardState): HulebuRunRewardState {
  return {
    reserveBonus: state.reserveBonus,
    shieldBonus: state.shieldBonus,
    firstProtect: state.firstProtect,
    startingCoins: state.startingCoins,
    toolBonus: { ...state.toolBonus },
    scoreBonus: { ...state.scoreBonus },
    pickedRewards: [...state.pickedRewards],
  };
}

function cloneLevelModifierState(state: HulebuLevelModifierState): HulebuLevelModifierState {
  return {
    activeEventIds: [...state.activeEventIds],
    coinBonus: state.coinBonus,
    toolBonus: { ...state.toolBonus },
    toolLocks: { ...state.toolLocks },
  };
}

function cloneMetaUpgradeState(state: HulebuMetaUpgradeState): HulebuMetaUpgradeState {
  return { ...state };
}

function cloneRunArchetypeState(state: HulebuRunArchetypeState): HulebuRunArchetypeState {
  return {
    archetypeId: state.archetypeId,
    label: state.label,
    startingCoins: state.startingCoins,
    toolBonus: { ...state.toolBonus },
    scoreBonus: { ...state.scoreBonus },
  };
}

export class HulebuRuntimeState {
  private readonly level: HulebuRuntimeLevelConfig;
  private readonly runRewards: HulebuRunRewardState;
  private readonly levelModifiers: HulebuLevelModifierState;
  private readonly metaUpgrades: HulebuMetaUpgradeState;
  private readonly runArchetype: HulebuRunArchetypeState;
  private tiles: HulebuRuntimeTile[];
  private slot: string[];
  private reserve: string[];
  private river: string[] = [];
  private openMelds: HulebuRuntimeOpenMeld[] = [];
  private comboCounts = createEmptyComboCounts();
  private suitComboCounts = createEmptySuitCounts();
  private riverLimit = DEFAULT_RIVER_LIMIT;
  private looseMountainDropIndex = 0;
  private tools: HulebuRuntimeTools;
  private history: HulebuRuntimeSnapshot[] = [];
  private score = 0;
  private coins = 0;

  constructor(
    level: HulebuRuntimeLevelConfig,
    runRewards: HulebuRunRewardState = createHulebuRunRewardState(),
    levelModifiers: HulebuLevelModifierState = createHulebuLevelModifierState(),
    metaUpgrades: HulebuMetaUpgradeState = createHulebuMetaUpgradeState(),
    runArchetype: HulebuRunArchetypeState = createHulebuRunArchetypeState(),
  ) {
    this.level = level;
    this.runRewards = cloneRunRewardState(runRewards);
    this.levelModifiers = cloneLevelModifierState(levelModifiers);
    this.metaUpgrades = cloneMetaUpgradeState(metaUpgrades);
    this.runArchetype = cloneRunArchetypeState(runArchetype);
    this.tiles = level.tiles.map((tile) => ({
      ...tile,
      blockedBy: [...tile.blockedBy],
    }));
    this.slot = [...level.initialSlotOrder];
    this.reserve = [...level.initialReserveOrder];
    this.riverLimit = DEFAULT_RIVER_LIMIT + this.metaUpgrades.riverBonus;
    this.tools = this.createEffectiveTools();
    this.coins = this.runRewards.startingCoins
      + this.levelModifiers.coinBonus
      + this.metaUpgrades.startingCoins
      + this.runArchetype.startingCoins;
  }

  static fromSnapshot(
    level: HulebuRuntimeLevelConfig,
    snapshot: HulebuRuntimeSnapshot,
    runRewards: HulebuRunRewardState = createHulebuRunRewardState(),
    levelModifiers: HulebuLevelModifierState = createHulebuLevelModifierState(),
    metaUpgrades: HulebuMetaUpgradeState = createHulebuMetaUpgradeState(),
    runArchetype: HulebuRunArchetypeState = createHulebuRunArchetypeState(),
  ): HulebuRuntimeState {
    const runtimeState = new HulebuRuntimeState(level, runRewards, levelModifiers, metaUpgrades, runArchetype);
    runtimeState.restoreSnapshot(snapshot);
    runtimeState.history = [];
    return runtimeState;
  }

  moveTileToSlot(tileId: string): boolean {
    if (this.isBoardCleared()) {
      return false;
    }

    const tile = this.findTile(tileId);
    if (!tile || tile.location !== "board" || this.isTileBlocked(tileId) || this.slot.length >= this.level.defaults.slotLimit) {
      return false;
    }

    this.pushHistory();
    tile.location = "slot";
    this.slot.push(tileId);
    return true;
  }

  executeComboByKey(candidateKey: string | null): boolean {
    if (!candidateKey) {
      return false;
    }

    const candidate = this.getComboCandidates().find((item) => item.key === candidateKey);
    if (!candidate) {
      return false;
    }

    this.pushHistory();
    if (candidate.type === "bugang") {
      this.recordBossProgress(candidate);
      this.applySupplementalGang(candidate);
      this.openMountainByAction(KONG_SHAKE_LOOSE_COUNT);
      this.score += this.getComboScore(candidate.type);
      this.coins += 6;
      this.clearHistoryAfterCombo();
      return true;
    }

    this.recordBossProgress(candidate);
    candidate.tileIds.forEach((tileId) => {
      const tile = this.findTile(tileId);
      if (tile) {
        tile.location = "removed";
      }
    });
    this.slot = this.slot.filter((tileId) => candidate.tileIds.indexOf(tileId) === -1);
    this.recordOpenMeld(candidate);
    if (candidate.type === "hu") {
      this.cleanRiverAfterHu();
      this.openMountainByAction(HU_SHAKE_LOOSE_COUNT);
    }
    if (candidate.type === "gang") {
      this.openMountainByAction(KONG_SHAKE_LOOSE_COUNT);
    }
    this.score += this.getComboScore(candidate.type);
    this.coins += candidate.type === "gang" ? 6 : 3;
    this.clearHistoryAfterCombo();
    return true;
  }

  discardSlotTile(slotIndex: number): boolean {
    if (this.isBoardCleared() || this.river.length >= this.riverLimit) {
      return false;
    }

    const tileId = this.slot[slotIndex];
    const tile = tileId ? this.findTile(tileId) : null;
    if (!tile || tile.location !== "slot") {
      return false;
    }

    this.pushHistory();
    this.slot.splice(slotIndex, 1);
    tile.location = "river";
    this.river.push(tileId);
    this.tools.discard = Math.max(0, this.tools.discard - 1);
    return true;
  }

  useShuffleTool(): boolean {
    if (this.isBoardCleared() || this.tools.shuffle <= 0) {
      return false;
    }

    const boardTiles = this.tiles.filter((tile) => tile.location === "board");
    if (boardTiles.length < 2) {
      return false;
    }

    this.pushHistory();
    this.tools.shuffle -= 1;
    const faces = boardTiles.map((tile) => ({ suit: tile.suit, rank: tile.rank }));
    const rotatedFaces = [...faces.slice(1), faces[0]];
    boardTiles.forEach((tile, index) => {
      tile.suit = rotatedFaces[index].suit;
      tile.rank = rotatedFaces[index].rank;
    });
    return true;
  }

  useUndoTool(): boolean {
    if (this.tools.undo <= 0 || this.history.length === 0) {
      return false;
    }

    const snapshot = this.history.pop();
    if (!snapshot) {
      return false;
    }

    this.restoreSnapshot(snapshot);
    this.tools.undo -= 1;
    return true;
  }

  isBoardCleared(): boolean {
    return this.tiles.every((tile) => tile.location !== "board");
  }

  isLevelCleared(): boolean {
    return this.isBoardCleared() && this.isBossGoalComplete();
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

  exportSnapshot(): HulebuRuntimeSnapshot {
    return {
      tiles: this.tiles.map((tile) => ({ ...tile, blockedBy: [...tile.blockedBy] })),
      slot: [...this.slot],
      reserve: [...this.reserve],
      river: [...this.river],
      openMelds: this.openMelds.map((meld) => ({ ...meld, tileIds: [...meld.tileIds] })),
      comboCounts: { ...this.comboCounts },
      suitComboCounts: { ...this.suitComboCounts },
      looseMountainDropIndex: this.looseMountainDropIndex,
      score: this.score,
      coins: this.coins,
      tools: { ...this.tools },
    };
  }

  toSceneModel(layout: HulebuLayoutSize): HulebuCocosSceneModel {
    const layoutScale = Math.max(0.72, Math.min(1, layout.scale ?? 1));
    const screenWidth = Math.max(320, Math.round(layout.width / layoutScale));
    const screenHeight = Math.max(568, Math.round(layout.height / layoutScale));
    const configCenterX = 310;
    const configCenterY = 180;
    const boardCenterX = scaleLayoutValue(screenWidth / 2, layoutScale);
    const boardCenterY = scaleLayoutValue(screenHeight * 0.56, layoutScale);
    const boardScale = Math.min(
      0.74,
      Math.max(0.62, Math.min(screenWidth / 860, screenHeight / 1280)),
    ) * layoutScale;

    return {
      boardNodes: this.tiles
        .filter((tile) => tile.location === "board")
        .sort((a, b) => a.layer - b.layer || a.id.localeCompare(b.id))
        .map((tile) => {
          const blocked = this.isTileBlocked(tile.id);
          return {
            name: `Tile_${tile.id}`,
            tileId: tile.id,
            label: this.getTileLabel(tile),
            position: {
              x: Math.round(boardCenterX + (tile.x - configCenterX) * boardScale),
              y: Math.round(boardCenterY - (tile.y - configCenterY) * boardScale),
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
      reserveNodes: this.createCells("Reserve", this.reserve, this.getReserveLimit()),
      openMeldNodes: this.openMelds.map((meld, index) => ({
        name: `OpenMeld_${index}`,
        index,
        type: meld.type,
        label: meld.label,
        tileKey: meld.tileKey,
        tileIds: [...meld.tileIds],
        count: meld.count,
        prefabKey: this.getPrefabKeyByTileKey(meld.tileKey),
      })),
      riverNodes: this.createRiverCells(),
      comboControls: this.getComboControls(),
      hud: {
        boardRemainingText: `余牌 ${this.tiles.filter((tile) => tile.location === "board").length}`,
        slotStatusText: this.getSlotStatusText(),
        scoreText: `分 ${this.score}`,
        coinsText: `铜钱 ${this.coins} / 护 ${this.getShieldCount()}`,
        toolText: `洗 ${this.tools.shuffle} / 撤 ${this.tools.undo} / 打 ${this.tools.discard} / 看 ${this.tools.vision} / 河 ${this.riverLimit} / 流 ${this.runArchetype.label} / 奖 ${this.runRewards.pickedRewards.length} / 事 ${this.levelModifiers.activeEventIds.length}`,
        tileCounter: this.getBoardTileCounter(),
        bossText: this.getBossHudText(),
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

  getComboCandidateOptions(combo: HulebuComboType): HulebuRuntimeComboCandidateOption[] {
    return this.getComboCandidates()
      .filter((candidate) => candidate.type === combo)
      .map((candidate) => ({
        type: candidate.type,
        key: candidate.key,
        tileIds: [...candidate.tileIds],
        labels: candidate.tileIds
          .map((tileId) => this.findTile(tileId))
          .filter((tile): tile is HulebuRuntimeTile => Boolean(tile))
          .map((tile) => this.getTileLabel(tile)),
        prefabKeys: candidate.tileIds
          .map((tileId) => this.findTile(tileId))
          .filter((tile): tile is HulebuRuntimeTile => Boolean(tile))
          .map((tile) => this.getPrefabKeyByTileKey(`${tile.suit}-${tile.rank}`)),
      }));
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

    this.openMelds.forEach((meld) => {
      if (meld.type !== "peng") {
        return;
      }
      const tile = slotTiles.find((slotTile) => `${slotTile.suit}-${slotTile.rank}` === meld.tileKey);
      if (tile) {
        candidates.push(this.makeCandidate("bugang", [tile]));
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
      return 120 + this.runRewards.scoreBonus.hu + this.runArchetype.scoreBonus.hu;
    }
    if (combo === "gang" || combo === "bugang") {
      return 50 + this.runRewards.scoreBonus[combo] + this.runArchetype.scoreBonus[combo];
    }
    return combo === "peng"
      ? 20 + this.runRewards.scoreBonus.peng + this.runArchetype.scoreBonus.peng
      : 10 + this.runRewards.scoreBonus.chi + this.runArchetype.scoreBonus.chi;
  }

  private getSlotStatusText(): string {
    if (this.isBoardCleared()) {
      return this.isBossGoalComplete() ? "牌山已清空" : "Boss目标未完成";
    }
    if (this.getComboCandidates().length > 0) {
      return "可消除";
    }
    if (this.slot.length >= this.level.defaults.slotLimit) {
      return this.canUseRiverDiscard() ? "槽位已满，可打牌入河" : "槽位已满";
    }
    return `槽位 ${this.slot.length}/${this.level.defaults.slotLimit}`;
  }

  private canUseRiverDiscard(): boolean {
    return this.river.length < this.riverLimit && this.tools.discard > 0;
  }

  private getReserveLimit(): number {
    return this.level.defaults.reserveLimit + this.runRewards.reserveBonus + this.metaUpgrades.reserveBonus;
  }

  private getShieldCount(): number {
    return this.level.defaults.shields + this.runRewards.shieldBonus + this.metaUpgrades.shieldBonus;
  }

  private createEffectiveTools(): HulebuRuntimeTools {
    const tools = {
      shuffle: this.level.defaults.tools.shuffle + this.runRewards.toolBonus.shuffle,
      undo: this.level.defaults.tools.undo + this.runRewards.toolBonus.undo,
      discard: this.level.defaults.tools.discard + this.runRewards.toolBonus.discard,
      vision: this.level.defaults.tools.vision + this.runRewards.toolBonus.vision,
    };

    tools.shuffle += this.runArchetype.toolBonus.shuffle;
    tools.undo += this.runArchetype.toolBonus.undo;
    tools.discard += this.runArchetype.toolBonus.discard;
    tools.vision += this.runArchetype.toolBonus.vision;

    tools.shuffle += this.metaUpgrades.toolBonus;
    tools.undo += this.metaUpgrades.toolBonus;
    tools.discard += this.metaUpgrades.toolBonus;
    tools.vision += this.metaUpgrades.toolBonus + this.metaUpgrades.visionBonus;

    tools.shuffle += this.levelModifiers.toolBonus.shuffle;
    tools.undo += this.levelModifiers.toolBonus.undo;
    tools.discard += this.levelModifiers.toolBonus.discard;
    tools.vision += this.levelModifiers.toolBonus.vision;

    (Object.keys(this.levelModifiers.toolLocks) as HulebuToolType[]).forEach((tool) => {
      if (this.levelModifiers.toolLocks[tool]) {
    tools[tool] = 0;
      }
    });

    tools.shuffle = Math.max(0, tools.shuffle);
    tools.undo = Math.max(0, tools.undo);
    tools.discard = Math.max(0, tools.discard);
    tools.vision = Math.max(0, tools.vision);

    return tools;
  }

  private createRiverCells() {
    return Array.from({ length: this.riverLimit }, (_, index) => {
      const tileId = this.river[index] ?? null;
      const tile = tileId ? this.findTile(tileId) : null;
      return {
        name: `River_${index}`,
        index,
        tileId,
        label: tile ? this.getTileLabel(tile) : null,
        occupied: Boolean(tile),
        prefabKey: tile ? `tile.${tile.suit}.${tile.rank}` : null,
      };
    });
  }

  private recordOpenMeld(candidate: HulebuComboCandidate): void {
    if (candidate.type !== "peng" && candidate.type !== "gang") {
      return;
    }

    const tile = this.findTile(candidate.tileIds[0]);
    if (!tile) {
      return;
    }

    this.openMelds.push({
      type: candidate.type,
      tileKey: `${tile.suit}-${tile.rank}`,
      label: this.getTileLabel(tile),
      tileIds: [...candidate.tileIds],
      count: candidate.tileIds.length,
    });
  }

  private applySupplementalGang(candidate: HulebuComboCandidate): void {
    const tile = this.findTile(candidate.tileIds[0]);
    if (!tile) {
      return;
    }

    const tileKey = `${tile.suit}-${tile.rank}`;
    const meld = this.openMelds.find((item) => item.type === "peng" && item.tileKey === tileKey);
    if (!meld) {
      return;
    }

    tile.location = "removed";
    this.slot = this.slot.filter((tileId) => tileId !== tile.id);
    meld.type = "bugang";
    meld.tileIds = [...meld.tileIds, tile.id];
    meld.count = 4;
  }

  private cleanRiverAfterHu(): void {
    const tileId = this.river.shift();
    if (!tileId) {
      return;
    }

    const tile = this.findTile(tileId);
    if (tile) {
      tile.location = "removed";
    }
  }

  private openMountainByAction(count: number): HulebuRuntimeTile[] {
    const targets = this.getOpenMountainTargets().slice(0, count);
    this.releaseMountainBlockers(targets);
    targets.forEach((tile) => this.shakeLooseMountainTile(tile));
    return targets;
  }

  private getOpenMountainTargets(): HulebuRuntimeTile[] {
    const boardTiles = this.tiles.filter((tile) => tile.location === "board");
    return boardTiles
      .filter((tile) => boardTiles.some((target) => target.id !== tile.id && target.blockedBy.includes(tile.id) && this.isTileBlocked(target.id)))
      .sort((a, b) => b.layer - a.layer || a.id.localeCompare(b.id));
  }

  private releaseMountainBlockers(targets: HulebuRuntimeTile[]): void {
    const targetIds = new Set(targets.map((tile) => tile.id));
    this.tiles.forEach((tile) => {
      tile.blockedBy = tile.blockedBy.filter((blockerId) => !targetIds.has(blockerId));
    });
  }

  private shakeLooseMountainTile(tile: HulebuRuntimeTile): void {
    const dropIndex = this.looseMountainDropIndex;
    this.looseMountainDropIndex += 1;
    const column = dropIndex % 4;
    const row = Math.floor(dropIndex / 4);
    tile.location = "board";
    tile.blockedBy = [];
    tile.layer = 0;
    tile.x = LOOSE_TILE_START_X + column * LOOSE_TILE_GAP_X;
    tile.y = LOOSE_TILE_START_Y + row * LOOSE_TILE_GAP_Y;
  }

  private pushHistory(): void {
    this.history.push(this.exportSnapshot());

    if (this.history.length > 12) {
      this.history.shift();
    }
  }

  private restoreSnapshot(snapshot: HulebuRuntimeSnapshot): void {
    this.tiles = snapshot.tiles.map((tile) => ({ ...tile, blockedBy: [...tile.blockedBy] }));
    this.slot = [...snapshot.slot];
    this.reserve = [...snapshot.reserve];
    this.river = [...snapshot.river];
    this.openMelds = snapshot.openMelds.map((meld) => ({ ...meld, tileIds: [...meld.tileIds] }));
    this.comboCounts = { ...snapshot.comboCounts };
    this.suitComboCounts = { ...snapshot.suitComboCounts };
    this.looseMountainDropIndex = snapshot.looseMountainDropIndex;
    this.score = snapshot.score;
    this.coins = snapshot.coins;
    this.tools = { ...snapshot.tools };
  }

  private recordBossProgress(candidate: HulebuComboCandidate): void {
    this.comboCounts[candidate.type] += 1;

    const suits = new Set<HulebuTileSuit>();
    candidate.tileIds.forEach((tileId) => {
      const tile = this.findTile(tileId);
      if (tile) {
        suits.add(tile.suit);
      }
    });

    suits.forEach((suit) => {
      this.suitComboCounts[suit] += 1;
    });
  }

  private isBossGoalComplete(): boolean {
    return this.getBossGoals().every((goal) => this.getBossGoalCurrentValue(goal) >= this.getBossGoalTargetValue(goal));
  }

  private getBossHudText(): string {
    const goals = this.getBossGoals();
    if (goals.length === 0) {
      return "";
    }

    const completeCount = goals.filter((goal) => this.getBossGoalCurrentValue(goal) >= this.getBossGoalTargetValue(goal)).length;
    const summary = goals
      .slice(0, 3)
      .map((goal) => `${this.getBossGoalLabel(goal)} ${this.getBossGoalCurrentValue(goal)}/${this.getBossGoalTargetValue(goal)}`)
      .join(" · ");

    const variantName = this.level.bossVariant?.name ?? "Boss";
    return `${variantName} ${completeCount}/${goals.length} · ${summary}`;
  }

  private getBossGoals(): HulebuBossGoalConfig[] {
    return this.level.bossGoals ?? [];
  }

  private getBossGoalCurrentValue(goal: HulebuBossGoalConfig): number {
    if (goal.type === "combo_count") {
      return this.comboCounts[goal.combo] ?? 0;
    }
    if (goal.type === "score_target") {
      return this.score;
    }

    return Math.min(...goal.suits.map((suit) => this.suitComboCounts[suit] ?? 0));
  }

  private getBossGoalTargetValue(goal: HulebuBossGoalConfig): number {
    return goal.type === "suit_set" ? goal.eachTarget : goal.target;
  }

  private getBossGoalLabel(goal: HulebuBossGoalConfig): string {
    if (goal.type === "score_target") {
      return "分";
    }
    if (goal.type === "suit_set") {
      return "花色";
    }

    return this.getComboLabel(goal.combo);
  }

  private getComboLabel(combo: HulebuComboType): string {
    const labels: Record<HulebuComboType, string> = {
      hu: "胡",
      gang: "杠",
      peng: "碰",
      chi: "吃",
      bugang: "补杠",
    };
    return labels[combo];
  }

  private clearHistoryAfterCombo(): void {
    this.history = [];
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

  private getBoardTileCounter(): HulebuTileCounterModel {
    const suitOrder: HulebuTileSuit[] = ["wan", "tiao", "tong", "honor"];
    const suitTotals = new Map<HulebuTileSuit, number>();
    const tileCounts = new Map<string, number>();

    this.tiles
      .filter((tile) => tile.location === "board")
      .forEach((tile) => {
        const key = `${tile.suit}-${tile.rank}`;
        tileCounts.set(key, (tileCounts.get(key) ?? 0) + 1);
        suitTotals.set(tile.suit, (suitTotals.get(tile.suit) ?? 0) + 1);
      });

    return {
      total: this.tiles.filter((tile) => tile.location === "board").length,
      suits: suitOrder.map((suit) => {
        const maxRank = suit === "honor" ? 7 : 9;
        return {
          suit,
          label: suit === "honor" ? "字" : SUIT_LABELS[suit],
          total: suitTotals.get(suit) ?? 0,
          tiles: Array.from({ length: maxRank }, (_, index) => {
            const rank = index + 1;
            return {
              label: this.getTileLabel({ suit, rank }),
              prefabKey: `tile.${suit}.${rank}`,
              count: tileCounts.get(`${suit}-${rank}`) ?? 0,
            };
          }),
        };
      }),
    };
  }

  private getPrefabKeyByTileKey(tileKey: string): string {
    const [suit, rank] = tileKey.split("-");
    return `tile.${suit}.${rank}`;
  }
}

function createEmptyComboCounts(): Record<HulebuComboType, number> {
  return BOSS_PROGRESS_COMBO_TYPES.reduce((counts, combo) => {
    counts[combo] = 0;
    return counts;
  }, {} as Record<HulebuComboType, number>);
}

function createEmptySuitCounts(): Record<HulebuTileSuit, number> {
  return BOSS_PROGRESS_SUITS.reduce((counts, suit) => {
    counts[suit] = 0;
    return counts;
  }, {} as Record<HulebuTileSuit, number>);
}
