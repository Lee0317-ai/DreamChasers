import {
  HULEBU_LEVEL_CONFIGS,
  HULEBU_REWARD_LABELS,
  createHulebuRuntimeLevelForRun,
  type HulebuRunProfile,
  type HulebuRuntimeLevelConfig,
} from "../config/HulebuLevelConfig";

export interface ContentManifest {
  readonly contentVersion: string;
  readonly saveSchemaVersion: number;
  readonly levelIds: readonly string[];
  readonly rewardIds: readonly string[];
}

export interface ContentSource {
  readonly manifest: ContentManifest;
  readonly levels: readonly HulebuRuntimeLevelConfig[];
  readonly rewardIds: readonly string[];
  resolveRuntimeLevel(
    index: number,
    profile: HulebuRunProfile,
    displayOrder?: number,
  ): HulebuRuntimeLevelConfig;
}

type RuntimeLevelResolver = ContentSource["resolveRuntimeLevel"];

function cloneValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item)) as T;
  }
  if (value !== null && typeof value === "object") {
    const clone: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      clone[key] = cloneValue(item);
    }
    return clone as T;
  }
  return value;
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) {
      deepFreeze(child);
    }
    Object.freeze(value);
  }
  return value;
}

function requireNonEmptyId(id: string, label: string): void {
  if (id.trim().length === 0) {
    throw new Error(`${label} must not be empty.`);
  }
}

function requireUniqueIds(ids: readonly string[], label: string): Set<string> {
  const uniqueIds = new Set<string>();
  for (const id of ids) {
    requireNonEmptyId(id, label);
    if (uniqueIds.has(id)) {
      throw new Error(`Duplicate ${label.toLowerCase()}: ${id}.`);
    }
    uniqueIds.add(id);
  }
  return uniqueIds;
}

function validateInitialOrder(
  levelId: string,
  field: "initialSlotOrder" | "initialReserveOrder",
  order: readonly string[],
  tileIds: ReadonlySet<string>,
): Set<string> {
  const referencedIds = new Set<string>();
  for (const tileId of order) {
    if (!tileIds.has(tileId)) {
      throw new Error(`Level ${levelId} ${field} references missing tile ${tileId}.`);
    }
    if (referencedIds.has(tileId)) {
      throw new Error(`Level ${levelId} ${field} contains duplicate tile ${tileId}.`);
    }
    referencedIds.add(tileId);
  }
  return referencedIds;
}

function validateContent(
  manifest: ContentManifest,
  levels: readonly HulebuRuntimeLevelConfig[],
  rewardIds: readonly string[],
  supportedSaveSchemaVersion: number,
  supportedContentVersions: readonly string[],
): Map<string, number> {
  if (manifest.contentVersion.trim().length === 0) {
    throw new Error("contentVersion must not be empty.");
  }
  if (!supportedContentVersions.includes(manifest.contentVersion)) {
    throw new Error(`Unsupported contentVersion: ${manifest.contentVersion}.`);
  }
  if (!Number.isInteger(manifest.saveSchemaVersion) || manifest.saveSchemaVersion < 1) {
    throw new Error(`Invalid saveSchemaVersion: ${manifest.saveSchemaVersion}.`);
  }
  if (manifest.saveSchemaVersion > supportedSaveSchemaVersion) {
    throw new Error(
      `saveSchemaVersion ${manifest.saveSchemaVersion} is higher than supported version ${supportedSaveSchemaVersion}.`,
    );
  }

  const loadedRewardIds = requireUniqueIds(rewardIds, "Reward id");
  const manifestRewardIds = requireUniqueIds(manifest.rewardIds, "Manifest reward id");
  for (const rewardId of manifestRewardIds) {
    if (!loadedRewardIds.has(rewardId)) {
      throw new Error(`Manifest reward id ${rewardId} is not loaded.`);
    }
  }
  for (const rewardId of loadedRewardIds) {
    if (!manifestRewardIds.has(rewardId)) {
      throw new Error(`Loaded reward id ${rewardId} is absent from the manifest.`);
    }
  }

  const levelIndexes = new Map<string, number>();
  const levelOrders = new Set<number>();
  for (const [index, level] of levels.entries()) {
    requireNonEmptyId(level.id, "Level id");
    if (levelIndexes.has(level.id)) {
      throw new Error(`Duplicate level id: ${level.id}.`);
    }
    if (!Number.isInteger(level.order) || level.order < 1) {
      throw new Error(`Level ${level.id} order must be a positive integer.`);
    }
    if (levelOrders.has(level.order)) {
      throw new Error(`Duplicate level order: ${level.order}.`);
    }
    levelIndexes.set(level.id, index);
    levelOrders.add(level.order);

    const tileIds = new Set<string>();
    for (const tile of level.tiles) {
      requireNonEmptyId(tile.id, `Level ${level.id} tile id`);
      if (tileIds.has(tile.id)) {
        throw new Error(`Level ${level.id} has duplicate tile id: ${tile.id}.`);
      }
      tileIds.add(tile.id);
    }

    for (const tile of level.tiles) {
      for (const blockerId of tile.blockedBy) {
        if (blockerId === tile.id) {
          throw new Error(`Level ${level.id} tile ${tile.id} blockedBy references itself.`);
        }
        if (!tileIds.has(blockerId)) {
          throw new Error(`Level ${level.id} tile ${tile.id} blockedBy references missing tile ${blockerId}.`);
        }
      }
    }

    const slotIds = validateInitialOrder(level.id, "initialSlotOrder", level.initialSlotOrder, tileIds);
    const reserveIds = validateInitialOrder(level.id, "initialReserveOrder", level.initialReserveOrder, tileIds);
    for (const tileId of slotIds) {
      if (reserveIds.has(tileId)) {
        throw new Error(`Level ${level.id} initial tile ${tileId} appears in both slot and reserve.`);
      }
    }

    for (const rewardId of level.rewardPool) {
      if (!manifestRewardIds.has(rewardId)) {
        throw new Error(`Level ${level.id} rewardPool references unknown reward id ${rewardId}.`);
      }
    }
  }

  const manifestLevelIds = requireUniqueIds(manifest.levelIds, "Manifest level id");
  for (const levelId of manifestLevelIds) {
    if (!levelIndexes.has(levelId)) {
      throw new Error(`Manifest references missing level ${levelId}.`);
    }
  }
  for (const levelId of levelIndexes.keys()) {
    if (!manifestLevelIds.has(levelId)) {
      throw new Error(`Loaded level ${levelId} is absent from the manifest.`);
    }
  }
  for (const [index, level] of levels.entries()) {
    if (manifest.levelIds[index] !== level.id) {
      throw new Error(
        `Manifest level id ${manifest.levelIds[index]} at index ${index} does not match loaded level ${level.id}.`,
      );
    }
  }
  return levelIndexes;
}

const LEGACY_REWARD_IDS = Object.freeze(Object.keys(HULEBU_REWARD_LABELS));

export const HULEBU_LEGACY_CONTENT_SOURCE: ContentSource = {
  manifest: {
    contentVersion: "cocos-hardcoded-v1",
    saveSchemaVersion: 1,
    levelIds: HULEBU_LEVEL_CONFIGS.map((level) => level.id),
    rewardIds: LEGACY_REWARD_IDS,
  },
  levels: HULEBU_LEVEL_CONFIGS,
  rewardIds: LEGACY_REWARD_IDS,
  resolveRuntimeLevel: (index, profile, displayOrder) => (
    createHulebuRuntimeLevelForRun(index, profile, displayOrder)
  ),
};

export class ContentRepository {
  private readonly manifestSnapshot: ContentManifest;
  private readonly levelSnapshots: readonly HulebuRuntimeLevelConfig[];
  private readonly levelIndexes: ReadonlyMap<string, number>;
  private readonly resolveRuntimeLevel: RuntimeLevelResolver;

  constructor(
    source: ContentSource,
    supportedSaveSchemaVersion: number,
    supportedContentVersions: readonly string[],
  ) {
    const manifest = cloneValue(source.manifest);
    const levels = cloneValue(source.levels);
    const rewardIds = cloneValue(source.rewardIds);
    this.levelIndexes = validateContent(
      manifest,
      levels,
      rewardIds,
      supportedSaveSchemaVersion,
      supportedContentVersions,
    );
    this.manifestSnapshot = deepFreeze(manifest);
    this.levelSnapshots = deepFreeze(levels);
    this.resolveRuntimeLevel = source.resolveRuntimeLevel.bind(source);
  }

  get manifest(): ContentManifest {
    return cloneValue(this.manifestSnapshot);
  }

  getLevelCount(): number {
    return this.levelIndexes.size;
  }

  getLevelByIndex(index: number): HulebuRuntimeLevelConfig {
    this.requireLevelIndex(index);
    return cloneValue(this.levelSnapshots[index]);
  }

  createRuntimeLevel(
    index: number,
    profile: HulebuRunProfile,
    displayOrder?: number,
  ): HulebuRuntimeLevelConfig {
    this.requireLevelIndex(index);
    return cloneValue(this.resolveRuntimeLevel(index, profile, displayOrder));
  }

  private requireLevelIndex(index: number): void {
    if (!Number.isInteger(index) || index < 0 || index >= this.levelSnapshots.length) {
      throw new RangeError(
        `Level index ${index} is out of range 0..${Math.max(0, this.levelSnapshots.length - 1)}.`,
      );
    }
  }
}
