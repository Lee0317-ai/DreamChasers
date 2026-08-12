import type {
  HulebuCocosSceneModel,
  HulebuComboControlModel,
  HulebuComboType,
  HulebuTileCounterModel,
} from "../contracts/HulebuSceneModel";
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
import { resolveHulebuPortraitZones } from "../bootstrap/HulebuPortraitLayout";

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

export interface HulebuLayoutSize {
  width: number;
  height: number;
  cssWidth?: number;
  cssHeight?: number;
  scale?: number;
}

interface HulebuRuntimeOpenMeld {
  type: "peng" | "gang" | "bugang";
  tileKey: string;
  label: string;
  tileIds: string[];
  count: number;
}

export interface HulebuRuntimeCoreSnapshot {
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

export interface HulebuRuntimeSnapshot extends HulebuRuntimeCoreSnapshot {
  history: HulebuRuntimeCoreSnapshot[];
}

export interface HulebuRuntimeLegacySnapshot extends HulebuRuntimeCoreSnapshot {
  history?: never;
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
const DEFAULT_RIVER_LIMIT = 2;
const KONG_SHAKE_LOOSE_COUNT = 2;
const HU_SHAKE_LOOSE_COUNT = 3;
const LOOSE_TILE_START_X = 210;
const LOOSE_TILE_START_Y = 64;
const LOOSE_TILE_GAP_X = 58;
const LOOSE_TILE_GAP_Y = 76;
const MAX_HISTORY_LENGTH = 12;

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
  private history: HulebuRuntimeCoreSnapshot[] = [];
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
    this.riverLimit = Math.min(2, DEFAULT_RIVER_LIMIT + this.metaUpgrades.riverBonus);
    this.tools = this.createEffectiveTools();
    this.coins = this.runRewards.startingCoins
      + this.levelModifiers.coinBonus
      + this.metaUpgrades.startingCoins
      + this.runArchetype.startingCoins;
  }

  static fromSnapshot(
    level: HulebuRuntimeLevelConfig,
    snapshot: HulebuRuntimeSnapshot | HulebuRuntimeLegacySnapshot,
    runRewards: HulebuRunRewardState = createHulebuRunRewardState(),
    levelModifiers: HulebuLevelModifierState = createHulebuLevelModifierState(),
    metaUpgrades: HulebuMetaUpgradeState = createHulebuMetaUpgradeState(),
    runArchetype: HulebuRunArchetypeState = createHulebuRunArchetypeState(),
  ): HulebuRuntimeState {
    const runtimeState = new HulebuRuntimeState(level, runRewards, levelModifiers, metaUpgrades, runArchetype);
    runtimeState.restoreSnapshot(snapshot);
    if (Array.isArray(snapshot.history)) {
      runtimeState.history = snapshot.history
        .slice(-MAX_HISTORY_LENGTH)
        .map((historySnapshot) => cloneRuntimeCoreSnapshot(historySnapshot));
    } else {
      runtimeState.history = [];
      runtimeState.tools.undo = 0;
    }
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
    if (!this.canUseRiverDiscard()) {
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

  canUseDiscardTool(): boolean {
    return this.canUseRiverDiscard();
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

    const remainingUndo = this.tools.undo - 1;
    const snapshot = this.history.pop();
    if (!snapshot) {
      return false;
    }

    this.restoreSnapshot(snapshot);
    this.tools.undo = remainingUndo;
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
      ...this.createCoreSnapshot(),
      history: this.history.map((historySnapshot) => cloneRuntimeCoreSnapshot(historySnapshot)),
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
    const boardTiles = this.tiles.filter((tile) => tile.location === "board");
    const configuredTilesById = new Map(this.level.tiles.map((tile) => [tile.id, tile]));
    const isLooseTile = (tile: HulebuRuntimeTile): boolean => {
      const configuredTile = configuredTilesById.get(tile.id);
      return Boolean(configuredTile)
        && (tile.x !== configuredTile!.x || tile.y !== configuredTile!.y || tile.layer !== configuredTile!.layer);
    };
    const mountainTiles = boardTiles.filter((tile) => !isLooseTile(tile));
    const looseTiles = boardTiles
      .filter(isLooseTile)
      .sort((left, right) => left.y - right.y || left.x - right.x || left.id.localeCompare(right.id));
    const looseIndexById = new Map(looseTiles.map((tile, index) => [tile.id, index]));
    const boardXs = mountainTiles.length > 0 ? mountainTiles.map((tile) => tile.x) : [configCenterX];
    const boardYs = mountainTiles.length > 0 ? mountainTiles.map((tile) => tile.y) : [configCenterY];
    const configWidth = Math.max(1, Math.max(...boardXs) - Math.min(...boardXs));
    const configHeight = Math.max(1, Math.max(...boardYs) - Math.min(...boardYs));
    const fittedBoardScale = Math.min(
      (screenWidth - 92) / (configWidth + 52),
      (screenHeight * 0.38) / (configHeight + 70),
    );
    const densityScaleFloor = boardTiles.length <= 48 ? 0.92 : boardTiles.length <= 96 ? 0.78 : 0.62;
    const boardScale = Math.min(1.05, Math.max(densityScaleFloor, fittedBoardScale)) * layoutScale;
    const boardVisualScale = Math.min(1.45, Math.max(1, boardScale / (0.62 * layoutScale)));
    const portraitZones = resolveHulebuPortraitZones({
      width: layout.width,
      height: layout.height,
      cssHeight: layout.cssHeight ?? screenHeight,
      scale: layoutScale,
    });
    const looseStartX = scaleLayoutValue(screenWidth - 210, layoutScale);
    const looseStartY = portraitZones.meldY - scaleLayoutValue(8, layoutScale);

    return {
      boardNodes: boardTiles
        .sort((a, b) => Number(isLooseTile(a)) - Number(isLooseTile(b)) || a.layer - b.layer || a.id.localeCompare(b.id))
        .map((tile) => {
          const looseIndex = looseIndexById.get(tile.id);
          const isLoose = looseIndex !== undefined;
          const blocked = isLoose ? false : this.isTileBlocked(tile.id);
          const looseColumn = isLoose ? looseIndex % 5 : 0;
          const looseRow = isLoose ? Math.floor(looseIndex / 5) : 0;
          return {
            name: `Tile_${tile.id}`,
            tileId: tile.id,
            label: this.getTileLabel(tile),
            position: {
              x: isLoose
                ? looseStartX + scaleLayoutValue(looseColumn * 40, layoutScale)
                : Math.round(boardCenterX + (tile.x - configCenterX) * boardScale),
              y: isLoose
                ? looseStartY + scaleLayoutValue(looseRow * 48, layoutScale)
                : Math.round(boardCenterY - (tile.y - configCenterY) * boardScale),
            },
            zIndex: isLoose ? 1000 + looseIndex : tile.layer * 100,
            interactable: !blocked,
            dimmed: blocked,
            prefabKey: `tile.${tile.suit}.${tile.rank}`,
            sourcePackage: this.level.id,
            stackDepth: isLoose ? 1 : tile.layer + 1,
            visualScale: isLoose ? 1 : boardVisualScale,
            displayZone: isLoose ? "loose" : "mountain",
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
      return this.canUseRiverDiscard() ? "槽位已满：点击河牌救场" : "槽位已满：请先消除组合";
    }
    return `槽位 ${this.slot.length}/${this.level.defaults.slotLimit}`;
  }

  private canUseRiverDiscard(): boolean {
    return !this.isBoardCleared()
      && this.tools.discard > 0
      && this.river.length < this.riverLimit
      && this.slot.some((tileId) => this.findTile(tileId)?.location === "slot");
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
    this.history.push(this.createCoreSnapshot());

    if (this.history.length > MAX_HISTORY_LENGTH) {
      this.history.shift();
    }
  }

  private createCoreSnapshot(): HulebuRuntimeCoreSnapshot {
    return cloneRuntimeCoreSnapshot({
      tiles: this.tiles,
      slot: this.slot,
      reserve: this.reserve,
      river: this.river,
      openMelds: this.openMelds,
      comboCounts: this.comboCounts,
      suitComboCounts: this.suitComboCounts,
      looseMountainDropIndex: this.looseMountainDropIndex,
      score: this.score,
      coins: this.coins,
      tools: this.tools,
    });
  }

  private restoreSnapshot(snapshot: HulebuRuntimeCoreSnapshot): void {
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
    return getRuntimeTileLabel(tile);
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

export function assertValidHulebuRuntimeSnapshot(
  level: HulebuRuntimeLevelConfig,
  snapshot: unknown,
  runRewards: HulebuRunRewardState = createHulebuRunRewardState(),
  metaUpgrades: HulebuMetaUpgradeState = createHulebuMetaUpgradeState(),
): asserts snapshot is HulebuRuntimeSnapshot | HulebuRuntimeLegacySnapshot {
  const limits = {
    slot: level.defaults.slotLimit,
    reserve: level.defaults.reserveLimit + runRewards.reserveBonus + metaUpgrades.reserveBonus,
    river: DEFAULT_RIVER_LIMIT + metaUpgrades.riverBonus,
  };
  Object.entries(limits).forEach(([zone, limit]) => {
    requireNonNegativeInteger(limit, `runtime ${zone} limit`);
  });
  validateRuntimeCoreSnapshot(level, snapshot, "runtime", limits);
  const history = (snapshot as { history?: unknown }).history;
  if (history === undefined) {
    return;
  }
  if (!Array.isArray(history) || history.length > MAX_HISTORY_LENGTH) {
    throw new Error("Runtime history must be an array within the retained limit.");
  }
  history.forEach((entry, index) => {
    validateRuntimeCoreSnapshot(level, entry, `history[${index}]`, limits);
  });
}

export function normalizeHulebuRuntimeSnapshot(
  level: HulebuRuntimeLevelConfig,
  snapshot: HulebuRuntimeSnapshot | HulebuRuntimeLegacySnapshot,
  runRewards: HulebuRunRewardState = createHulebuRunRewardState(),
  levelModifiers: HulebuLevelModifierState = createHulebuLevelModifierState(),
  metaUpgrades: HulebuMetaUpgradeState = createHulebuMetaUpgradeState(),
  runArchetype: HulebuRunArchetypeState = createHulebuRunArchetypeState(),
): HulebuRuntimeSnapshot {
  assertValidHulebuRuntimeSnapshot(level, snapshot, runRewards, metaUpgrades);
  return HulebuRuntimeState.fromSnapshot(
    level,
    snapshot,
    runRewards,
    levelModifiers,
    metaUpgrades,
    runArchetype,
  ).exportSnapshot();
}

function validateRuntimeCoreSnapshot(
  level: HulebuRuntimeLevelConfig,
  value: unknown,
  path: string,
  limits: Readonly<Record<"slot" | "reserve" | "river", number>>,
): asserts value is HulebuRuntimeCoreSnapshot {
  if (!value || typeof value !== "object") {
    throw new Error(`${path} must be an object.`);
  }
  const snapshot = value as Partial<HulebuRuntimeCoreSnapshot>;
  if (!Array.isArray(snapshot.tiles)) {
    throw new Error(`${path} tiles must be an array.`);
  }

  requireNonNegativeInteger(snapshot.looseMountainDropIndex, `${path} looseMountainDropIndex`);
  const looseMountainDropIndex = snapshot.looseMountainDropIndex as number;
  if (looseMountainDropIndex > level.tiles.length) {
    throw new Error(`${path} looseMountainDropIndex exceeds the configured tile count.`);
  }

  const configuredTilesById = new Map(level.tiles.map((tile) => [tile.id, tile]));
  const expectedTileIds = new Set(configuredTilesById.keys());
  const initialBlockerIds = new Set(level.tiles.flatMap((tile) => tile.blockedBy));
  const availableLoosePositions = new Map<string, number>();
  for (let index = 0; index < looseMountainDropIndex; index += 1) {
    availableLoosePositions.set(getLooseMountainPositionKey(index), index);
  }
  const tilesById = new Map<string, HulebuRuntimeTile>();
  const looseTileIds = new Set<string>();
  const occupiedLoosePositions = new Set<number>();
  for (const [index, tileValue] of snapshot.tiles.entries()) {
    if (!tileValue || typeof tileValue !== "object") {
      throw new Error(`${path} tile ${index} must be an object.`);
    }
    const tile = tileValue as Partial<HulebuRuntimeTile>;
    if (typeof tile.id !== "string" || !expectedTileIds.has(tile.id)) {
      throw new Error(`${path} tile ${index} has unknown id ${String(tile.id)}.`);
    }
    if (tilesById.has(tile.id)) {
      throw new Error(`${path} has duplicate tile ${tile.id}.`);
    }
    const configuredTile = configuredTilesById.get(tile.id);
    if (!configuredTile || !isRuntimeTileLocation(tile.location) || !isRuntimeTileSuit(tile.suit)) {
      throw new Error(`${path} tile ${tile.id} has invalid fields.`);
    }
    if (!Number.isInteger(tile.rank) || !isSuitRankInRange(tile.suit, tile.rank as number)) {
      throw new Error(`${path} tile ${tile.id} has invalid rank.`);
    }
    if (!Number.isFinite(tile.x)
      || !Number.isFinite(tile.y)
      || !Number.isInteger(tile.layer)
      || (tile.layer as number) < 0
      || !Array.isArray(tile.blockedBy)) {
      throw new Error(`${path} tile ${tile.id} has invalid fields.`);
    }
    const blockerIds = new Set<string>();
    for (const blockerId of tile.blockedBy) {
      if (typeof blockerId !== "string" || !expectedTileIds.has(blockerId) || blockerId === tile.id) {
        throw new Error(`${path} tile ${tile.id} has invalid blocker ${String(blockerId)}.`);
      }
      if (blockerIds.has(blockerId)) {
        throw new Error(`${path} tile ${tile.id} has duplicate blocker ${blockerId}.`);
      }
      blockerIds.add(blockerId);
    }

    const keepsConfiguredGeometry = tile.x === configuredTile.x
      && tile.y === configuredTile.y
      && tile.layer === configuredTile.layer;
    if (!keepsConfiguredGeometry) {
      const loosePosition = availableLoosePositions.get(
        getRuntimePositionKey(tile.x as number, tile.y as number, tile.layer as number),
      );
      if (loosePosition === undefined
        || occupiedLoosePositions.has(loosePosition)
        || !initialBlockerIds.has(tile.id)
        || tile.blockedBy.length > 0) {
        throw new Error(`${path} tile ${tile.id} has invalid loose-mountain geometry.`);
      }
      occupiedLoosePositions.add(loosePosition);
      looseTileIds.add(tile.id);
    }
    tilesById.set(tile.id, tile as HulebuRuntimeTile);
  }
  if (tilesById.size !== expectedTileIds.size) {
    throw new Error(`${path} tiles do not match the configured level.`);
  }
  if (!countMapsEqual(
    countTileFaces(level.tiles),
    countTileFaces(Array.from(tilesById.values())),
  )) {
    throw new Error(`${path} tile face multiset does not match the configured level.`);
  }
  if (looseTileIds.size !== looseMountainDropIndex) {
    throw new Error(`${path} loose-mountain geometry does not match its drop index.`);
  }
  for (const tile of tilesById.values()) {
    const configuredBlockers = looseTileIds.has(tile.id)
      ? []
      : configuredTilesById.get(tile.id)!.blockedBy
        .filter((blockerId) => !looseTileIds.has(blockerId));
    if (!stringArraysEqual(tile.blockedBy, configuredBlockers)) {
      throw new Error(`${path} tile ${tile.id} has invalid blocker topology.`);
    }
  }

  const zoneByTile = new Map<string, string>();
  validateRuntimeZone(snapshot.slot, "slot", "slot", path, tilesById, zoneByTile);
  validateRuntimeZone(snapshot.reserve, "reserve", "reserve", path, tilesById, zoneByTile);
  validateRuntimeZone(snapshot.river, "river", "river", path, tilesById, zoneByTile);
  for (const [zone, limit] of Object.entries(limits) as Array<[keyof typeof limits, number]>) {
    if ((snapshot[zone] as string[]).length > limit) {
      throw new Error(`${path} ${zone} exceeds its limit of ${limit}.`);
    }
  }
  for (const tile of tilesById.values()) {
    if ((tile.location === "slot" || tile.location === "reserve" || tile.location === "river")
      && zoneByTile.get(tile.id) !== tile.location) {
      throw new Error(`${path} ${tile.location} is missing tile ${tile.id}.`);
    }
  }

  if (!Array.isArray(snapshot.openMelds)) {
    throw new Error(`${path} open melds must be an array.`);
  }
  const meldTileIds = new Set<string>();
  snapshot.openMelds.forEach((meldValue, index) => {
    if (!meldValue || typeof meldValue !== "object") {
      throw new Error(`${path} open meld ${index} must be an object.`);
    }
    const meld = meldValue as Partial<HulebuRuntimeOpenMeld>;
    if ((meld.type !== "peng" && meld.type !== "gang" && meld.type !== "bugang")
      || typeof meld.tileKey !== "string"
      || typeof meld.label !== "string"
      || !Array.isArray(meld.tileIds)
      || !Number.isInteger(meld.count)
      || meld.count !== meld.tileIds.length
      || meld.count !== (meld.type === "peng" ? 3 : 4)) {
      throw new Error(`${path} open meld ${index} has invalid fields.`);
    }
    const meldTiles: HulebuRuntimeTile[] = [];
    for (const tileId of meld.tileIds) {
      const tile = typeof tileId === "string" ? tilesById.get(tileId) : undefined;
      if (!tile || tile.location !== "removed" || meldTileIds.has(tileId)) {
        throw new Error(`${path} open meld ${index} has invalid tile ${String(tileId)}.`);
      }
      meldTileIds.add(tileId);
      meldTiles.push(tile);
    }
    const meldFaceKey = getRuntimeTileFaceKey(meldTiles[0]);
    if (meld.tileKey !== meldFaceKey
      || meldTiles.some((tile) => getRuntimeTileFaceKey(tile) !== meldFaceKey)) {
      throw new Error(`${path} open meld ${index} has inconsistent tile faces.`);
    }
    if (meld.label !== getRuntimeTileLabel(meldTiles[0])) {
      throw new Error(`${path} open meld ${index} has an inconsistent label.`);
    }
  });

  validateCountRecord(snapshot.comboCounts, BOSS_PROGRESS_COMBO_TYPES, `${path} comboCounts`);
  validateCountRecord(snapshot.suitComboCounts, BOSS_PROGRESS_SUITS, `${path} suitComboCounts`);
  requireNonNegativeInteger(snapshot.score, `${path} score`);
  requireNonNegativeInteger(snapshot.coins, `${path} coins`);
  validateRuntimeTools(snapshot.tools, `${path} tools`);
}

function validateRuntimeZone(
  value: unknown,
  zoneName: "slot" | "reserve" | "river",
  expectedLocation: HulebuRuntimeTile["location"],
  path: string,
  tilesById: ReadonlyMap<string, HulebuRuntimeTile>,
  zoneByTile: Map<string, string>,
): void {
  if (!Array.isArray(value)) {
    throw new Error(`${path} ${zoneName} must be an array.`);
  }
  for (const tileId of value) {
    const tile = typeof tileId === "string" ? tilesById.get(tileId) : undefined;
    if (!tile) {
      throw new Error(`${path} ${zoneName} references unknown tile ${String(tileId)}.`);
    }
    if (zoneByTile.has(tileId)) {
      throw new Error(`${path} tile ${tileId} appears in multiple zones.`);
    }
    if (tile.location !== expectedLocation) {
      throw new Error(`${path} ${zoneName} tile ${tileId} has location ${tile.location}.`);
    }
    zoneByTile.set(tileId, zoneName);
  }
}

function validateCountRecord<T extends string>(
  value: unknown,
  keys: readonly T[],
  path: string,
): void {
  if (!value || typeof value !== "object") {
    throw new Error(`${path} must be an object.`);
  }
  for (const key of keys) {
    requireNonNegativeInteger((value as Partial<Record<T, unknown>>)[key], `${path}.${key}`);
  }
}

function validateRuntimeTools(value: unknown, path: string): void {
  if (!value || typeof value !== "object") {
    throw new Error(`${path} must be an object.`);
  }
  const tools = value as Partial<Record<HulebuToolType, unknown>>;
  for (const tool of ["shuffle", "undo", "discard", "vision"] as const) {
    requireNonNegativeInteger(tools[tool], `${path}.${tool}`);
  }
}

function requireNonNegativeInteger(value: unknown, path: string): void {
  if (!Number.isInteger(value) || (value as number) < 0) {
    throw new Error(`${path} must be a non-negative integer.`);
  }
}

function isRuntimeTileLocation(value: unknown): value is HulebuRuntimeTile["location"] {
  return value === "board" || value === "slot" || value === "reserve" || value === "river" || value === "removed";
}

function isRuntimeTileSuit(value: unknown): value is HulebuTileSuit {
  return value === "wan" || value === "tiao" || value === "tong" || value === "honor";
}

function isSuitRankInRange(suit: HulebuTileSuit, rank: number): boolean {
  return rank >= 1 && rank <= (suit === "honor" ? 7 : 9);
}

function countTileFaces(
  tiles: readonly Pick<HulebuRuntimeTile, "suit" | "rank">[],
): Map<string, number> {
  const counts = new Map<string, number>();
  tiles.forEach((tile) => {
    const key = getRuntimeTileFaceKey(tile);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return counts;
}

function countMapsEqual(left: ReadonlyMap<string, number>, right: ReadonlyMap<string, number>): boolean {
  return left.size === right.size
    && Array.from(left.entries()).every(([key, count]) => right.get(key) === count);
}

function getRuntimeTileFaceKey(tile: Pick<HulebuRuntimeTile, "suit" | "rank">): string {
  return `${tile.suit}-${tile.rank}`;
}

function getRuntimeTileLabel(tile: Pick<HulebuRuntimeTile, "suit" | "rank">): string {
  return tile.suit === "honor"
    ? HONOR_LABELS[tile.rank] ?? `字${tile.rank}`
    : `${tile.rank}${SUIT_LABELS[tile.suit]}`;
}

function getLooseMountainPositionKey(index: number): string {
  const column = index % 4;
  const row = Math.floor(index / 4);
  return getRuntimePositionKey(
    LOOSE_TILE_START_X + column * LOOSE_TILE_GAP_X,
    LOOSE_TILE_START_Y + row * LOOSE_TILE_GAP_Y,
    0,
  );
}

function getRuntimePositionKey(x: number, y: number, layer: number): string {
  return `${x}:${y}:${layer}`;
}

function stringArraysEqual(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
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

function cloneRuntimeCoreSnapshot(snapshot: HulebuRuntimeCoreSnapshot): HulebuRuntimeCoreSnapshot {
  return {
    tiles: snapshot.tiles.map((tile) => ({ ...tile, blockedBy: [...tile.blockedBy] })),
    slot: [...snapshot.slot],
    reserve: [...snapshot.reserve],
    river: [...snapshot.river],
    openMelds: snapshot.openMelds.map((meld) => ({ ...meld, tileIds: [...meld.tileIds] })),
    comboCounts: { ...snapshot.comboCounts },
    suitComboCounts: { ...snapshot.suitComboCounts },
    looseMountainDropIndex: snapshot.looseMountainDropIndex,
    score: snapshot.score,
    coins: snapshot.coins,
    tools: { ...snapshot.tools },
  };
}
