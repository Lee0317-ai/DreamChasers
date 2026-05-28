export type HulebuTileSuit = "wan" | "tiao" | "tong" | "honor";
export type HulebuComboType = "hu" | "gang" | "peng" | "chi";

export interface HulebuLevelTileConfig {
  id: string;
  suit: HulebuTileSuit;
  rank: number;
  x: number;
  y: number;
  layer: number;
  blockedBy: string[];
  location: "board" | "slot" | "reserve" | "removed";
}

export interface HulebuLevelDefaults {
  slotLimit: number;
  reserveLimit: number;
  shields: number;
  firstProtect: boolean;
  tools: {
    shuffle: number;
    undo: number;
    vision: number;
  };
}

export interface HulebuRuntimeLevelConfig {
  id: string;
  order: number;
  name: string;
  subtitle: string;
  rewardPool: string[];
  defaults: HulebuLevelDefaults;
  initialSlotOrder: string[];
  initialReserveOrder: string[];
  tiles: HulebuLevelTileConfig[];
}

const HULEBU_BASE_DEFAULTS: HulebuLevelDefaults = {
  slotLimit: 8,
  reserveLimit: 1,
  shields: 1,
  firstProtect: true,
  tools: {
    shuffle: 1,
    undo: 1,
    vision: 1,
  },
};

interface HulebuTileFace {
  suit: HulebuTileSuit;
  rank: number;
}

interface HulebuRandomMountainLevelOptions {
  id: string;
  order: number;
  name: string;
  subtitle: string;
  rewardPool: string[];
  seed: string;
  targetTileCount: number;
  maxStackDepth: number;
  honorWeight: number;
  featuredTiles: HulebuTileFace[];
}

interface HulebuStackColumn {
  index: number;
  x: number;
  y: number;
  depth: number;
}

interface HulebuTilePlacement {
  column: HulebuStackColumn;
  layer: number;
}

export const HULEBU_REWARD_LEVEL_ORDERS = new Set([3, 6, 9, 13, 16, 19]);
export const HULEBU_BOSS_LEVEL_ORDERS = new Set([10, 20]);
export const HULEBU_COCOS_STACK_OVERLAP_THRESHOLD = 0.05;

export const HULEBU_REWARD_LABELS: Record<string, string> = {
  first_protect_shield: "留一手",
  reserve_plus_1: "暗格",
  shield_plus_1: "满槽护符",
  undo_plus_1: "回手",
  vision_plus_1: "看山",
  gang_score_plus_25: "开杠见喜",
  chi_score_plus_8: "顺风吃",
  coin_plus_20: "压岁钱",
  peng_score_plus_10: "碰上开花",
  shuffle_plus_1: "洗山",
};

const HULEBU_RANDOM_LEVELS: HulebuRandomMountainLevelOptions[] = [
  {
    id: "validation_intro_peng",
    order: 1,
    name: "入门场",
    subtitle: "单一碰",
    rewardPool: ["first_protect_shield", "shield_plus_1", "vision_plus_1"],
    seed: "hulebu-cocos-001-intro-peng",
    targetTileCount: 42,
    maxStackDepth: 4,
    honorWeight: 0.18,
    featuredTiles: [
      { suit: "tong", rank: 9 },
      { suit: "wan", rank: 2 },
    ],
  },
  {
    id: "validation_chi_line",
    order: 2,
    name: "顺子场",
    subtitle: "吃的识别",
    rewardPool: ["reserve_plus_1", "chi_score_plus_8", "coin_plus_20"],
    seed: "hulebu-cocos-002-chi-line",
    targetTileCount: 42,
    maxStackDepth: 4,
    honorWeight: 0.16,
    featuredTiles: [
      { suit: "tiao", rank: 2 },
      { suit: "wan", rank: 6 },
    ],
  },
  {
    id: "validation_gang_conflict",
    order: 3,
    name: "杠冲突场",
    subtitle: "碰还是杠",
    rewardPool: ["shield_plus_1", "undo_plus_1", "gang_score_plus_25"],
    seed: "hulebu-cocos-003-gang-conflict",
    targetTileCount: 45,
    maxStackDepth: 5,
    honorWeight: 0.26,
    featuredTiles: [
      { suit: "tong", rank: 5 },
      { suit: "honor", rank: 5 },
    ],
  },
  {
    id: "validation_multi_choice",
    order: 4,
    name: "多组合场",
    subtitle: "吃碰同现",
    rewardPool: ["first_protect_shield", "chi_score_plus_8", "gang_score_plus_25"],
    seed: "hulebu-cocos-004-multi-choice",
    targetTileCount: 45,
    maxStackDepth: 5,
    honorWeight: 0.18,
    featuredTiles: [
      { suit: "wan", rank: 3 },
      { suit: "tiao", rank: 4 },
    ],
  },
  {
    id: "validation_danger",
    order: 5,
    name: "危局场",
    subtitle: "满槽救场",
    rewardPool: ["reserve_plus_1", "shield_plus_1", "undo_plus_1"],
    seed: "hulebu-cocos-005-danger",
    targetTileCount: 48,
    maxStackDepth: 5,
    honorWeight: 0.28,
    featuredTiles: [
      { suit: "honor", rank: 6 },
      { suit: "tong", rank: 8 },
    ],
  },
  {
    id: "mvp_006_three_suits",
    order: 6,
    name: "三门初会",
    subtitle: "胡牌试手",
    rewardPool: ["peng_score_plus_10", "chi_score_plus_8", "vision_plus_1"],
    seed: "hulebu-cocos-006-three-suits",
    targetTileCount: 48,
    maxStackDepth: 5,
    honorWeight: 0.2,
    featuredTiles: [
      { suit: "wan", rank: 6 },
      { suit: "tong", rank: 2 },
    ],
  },
  {
    id: "mvp_007_keep_gang",
    order: 7,
    name: "留杠一手",
    subtitle: "别急着碰",
    rewardPool: ["gang_score_plus_25", "undo_plus_1", "shield_plus_1"],
    seed: "hulebu-cocos-007-keep-gang",
    targetTileCount: 48,
    maxStackDepth: 5,
    honorWeight: 0.2,
    featuredTiles: [
      { suit: "tong", rank: 7 },
      { suit: "tiao", rank: 1 },
    ],
  },
  {
    id: "mvp_008_chain_chi",
    order: 8,
    name: "连吃试手",
    subtitle: "顺子压力",
    rewardPool: ["chi_score_plus_8", "shuffle_plus_1", "coin_plus_20"],
    seed: "hulebu-cocos-008-chain-chi",
    targetTileCount: 51,
    maxStackDepth: 5,
    honorWeight: 0.18,
    featuredTiles: [
      { suit: "tiao", rank: 8 },
      { suit: "wan", rank: 4 },
    ],
  },
  {
    id: "mvp_009_counter_reading",
    order: 9,
    name: "看余牌",
    subtitle: "判断孤张",
    rewardPool: ["vision_plus_1", "first_protect_shield", "peng_score_plus_10"],
    seed: "hulebu-cocos-009-counter-reading",
    targetTileCount: 51,
    maxStackDepth: 5,
    honorWeight: 0.32,
    featuredTiles: [
      { suit: "honor", rank: 1 },
      { suit: "tong", rank: 6 },
    ],
  },
  {
    id: "mvp_010_final_mix",
    order: 10,
    name: "胡了卜",
    subtitle: "第一段 Boss",
    rewardPool: ["shield_plus_1", "gang_score_plus_25", "shuffle_plus_1"],
    seed: "hulebu-cocos-010-boss-one",
    targetTileCount: 54,
    maxStackDepth: 6,
    honorWeight: 0.3,
    featuredTiles: [
      { suit: "wan", rank: 9 },
      { suit: "honor", rank: 7 },
    ],
  },
  {
    id: "mvp_011_honor_pressure",
    order: 11,
    name: "字牌压阵",
    subtitle: "东南西北",
    rewardPool: ["peng_score_plus_10", "vision_plus_1", "reserve_plus_1"],
    seed: "hulebu-cocos-011-honor-pressure",
    targetTileCount: 51,
    maxStackDepth: 5,
    honorWeight: 0.36,
    featuredTiles: [
      { suit: "honor", rank: 2 },
      { suit: "wan", rank: 5 },
    ],
  },
  {
    id: "mvp_012_pair_wait",
    order: 12,
    name: "对子等风",
    subtitle: "碰牌压力",
    rewardPool: ["shield_plus_1", "undo_plus_1", "coin_plus_20"],
    seed: "hulebu-cocos-012-pair-wait",
    targetTileCount: 51,
    maxStackDepth: 5,
    honorWeight: 0.26,
    featuredTiles: [
      { suit: "tong", rank: 3 },
      { suit: "honor", rank: 3 },
    ],
  },
  {
    id: "mvp_013_reward_checkpoint",
    order: 13,
    name: "十三小歇",
    subtitle: "奖励节点",
    rewardPool: ["reserve_plus_1", "shuffle_plus_1", "chi_score_plus_8"],
    seed: "hulebu-cocos-013-reward",
    targetTileCount: 54,
    maxStackDepth: 6,
    honorWeight: 0.22,
    featuredTiles: [
      { suit: "tiao", rank: 5 },
      { suit: "tong", rank: 1 },
    ],
  },
  {
    id: "mvp_014_cross_suit_chains",
    order: 14,
    name: "双线顺子",
    subtitle: "交错吃牌",
    rewardPool: ["chi_score_plus_8", "vision_plus_1", "undo_plus_1"],
    seed: "hulebu-cocos-014-cross-suit",
    targetTileCount: 54,
    maxStackDepth: 6,
    honorWeight: 0.2,
    featuredTiles: [
      { suit: "wan", rank: 1 },
      { suit: "tiao", rank: 9 },
    ],
  },
  {
    id: "mvp_015_honor_triplets",
    order: 15,
    name: "三元试炼",
    subtitle: "中字发财",
    rewardPool: ["peng_score_plus_10", "shield_plus_1", "gang_score_plus_25"],
    seed: "hulebu-cocos-015-honor-triplets",
    targetTileCount: 54,
    maxStackDepth: 6,
    honorWeight: 0.38,
    featuredTiles: [
      { suit: "honor", rank: 5 },
      { suit: "wan", rank: 7 },
    ],
  },
  {
    id: "mvp_016_reward_checkpoint",
    order: 16,
    name: "十六回补",
    subtitle: "奖励节点",
    rewardPool: ["first_protect_shield", "coin_plus_20", "shuffle_plus_1"],
    seed: "hulebu-cocos-016-reward",
    targetTileCount: 57,
    maxStackDepth: 6,
    honorWeight: 0.28,
    featuredTiles: [
      { suit: "tong", rank: 4 },
      { suit: "honor", rank: 4 },
    ],
  },
  {
    id: "mvp_017_gang_tax",
    order: 17,
    name: "杠上加压",
    subtitle: "四张诱惑",
    rewardPool: ["gang_score_plus_25", "undo_plus_1", "reserve_plus_1"],
    seed: "hulebu-cocos-017-gang-tax",
    targetTileCount: 57,
    maxStackDepth: 6,
    honorWeight: 0.22,
    featuredTiles: [
      { suit: "wan", rank: 8 },
      { suit: "tiao", rank: 3 },
    ],
  },
  {
    id: "mvp_018_counter_mix",
    order: 18,
    name: "余牌混战",
    subtitle: "读牌选择",
    rewardPool: ["vision_plus_1", "chi_score_plus_8", "peng_score_plus_10"],
    seed: "hulebu-cocos-018-counter-mix",
    targetTileCount: 57,
    maxStackDepth: 6,
    honorWeight: 0.24,
    featuredTiles: [
      { suit: "tiao", rank: 7 },
      { suit: "tong", rank: 9 },
    ],
  },
  {
    id: "mvp_019_final_reward",
    order: 19,
    name: "终章前夜",
    subtitle: "最后奖励",
    rewardPool: ["shield_plus_1", "shuffle_plus_1", "coin_plus_20"],
    seed: "hulebu-cocos-019-final-reward",
    targetTileCount: 60,
    maxStackDepth: 6,
    honorWeight: 0.34,
    featuredTiles: [
      { suit: "honor", rank: 7 },
      { suit: "wan", rank: 2 },
    ],
  },
  {
    id: "mvp_020_boss_hulebu",
    order: 20,
    name: "终局胡了卜",
    subtitle: "第二段 Boss",
    rewardPool: ["gang_score_plus_25", "peng_score_plus_10", "vision_plus_1"],
    seed: "hulebu-cocos-020-final-boss",
    targetTileCount: 60,
    maxStackDepth: 6,
    honorWeight: 0.36,
    featuredTiles: [
      { suit: "tong", rank: 2 },
      { suit: "honor", rank: 6 },
    ],
  },
];

export const HULEBU_LEVEL_ONE_CONFIG: HulebuRuntimeLevelConfig = createHulebuRandomMountainLevelConfig(HULEBU_RANDOM_LEVELS[0]);

export const HULEBU_LEVEL_CONFIGS: HulebuRuntimeLevelConfig[] = [
  HULEBU_LEVEL_ONE_CONFIG,
  ...HULEBU_RANDOM_LEVELS.slice(1).map((level) => createHulebuRandomMountainLevelConfig(level)),
];

export function getHulebuLevelConfigByIndex(levelIndex: number): HulebuRuntimeLevelConfig {
  const normalizedIndex = Math.min(Math.max(0, levelIndex), HULEBU_LEVEL_CONFIGS.length - 1);
  return HULEBU_LEVEL_CONFIGS[normalizedIndex];
}

export function getHulebuLevelIndexByOrder(order: number): number {
  return Math.max(0, HULEBU_LEVEL_CONFIGS.findIndex((level) => level.order === order));
}

export function createHulebuRandomMountainLevelConfig(options: HulebuRandomMountainLevelOptions): HulebuRuntimeLevelConfig {
  const random = createSeededRandom(options.seed);
  const targetTileCount = normalizeTileCount(options.targetTileCount);
  const columns = createStackColumns(options, random, targetTileCount);
  const placements = createTopFirstPlacements(columns);
  const faces = createTileFaces(options, random, targetTileCount / 3);
  const tiles = placements.map((placement, index) => {
    const face = faces[Math.floor(index / 3)];
    return createTile(
      `${options.id}_c${placement.column.index}_l${placement.layer}`,
      face.suit,
      face.rank,
      placement.column.x,
      placement.column.y,
      placement.layer,
      [],
    );
  });

  applyStackBlockers(tiles);

  return {
    id: options.id,
    order: options.order,
    name: options.name,
    subtitle: options.subtitle,
    rewardPool: options.rewardPool,
    defaults: HULEBU_BASE_DEFAULTS,
    initialSlotOrder: [],
    initialReserveOrder: [],
    tiles,
  };
}

export function createSeededRandom(seed: string): () => number {
  let state = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    state ^= seed.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }

  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function normalizeTileCount(tileCount: number): number {
  const normalized = Math.max(30, Math.round(tileCount / 3) * 3);
  return normalized % 3 === 0 ? normalized : normalized + (3 - (normalized % 3));
}

function createStackColumns(
  options: HulebuRandomMountainLevelOptions,
  random: () => number,
  targetTileCount: number,
): HulebuStackColumn[] {
  const maxStackDepth = Math.max(3, Math.min(7, options.maxStackDepth));
  const columnCount = Math.max(9, Math.min(16, Math.round(targetTileCount / Math.max(3, maxStackDepth - 1))));
  const depths = Array.from({ length: columnCount }, () => 1);
  let totalDepth = columnCount;

  while (totalDepth < targetTileCount) {
    const candidates = depths
      .map((depth, index) => ({ depth, index }))
      .filter((item) => item.depth < maxStackDepth);
    if (candidates.length === 0) {
      break;
    }

    const picked = candidates[Math.floor(random() * candidates.length)];
    depths[picked.index] += 1;
    totalDepth += 1;
  }

  const clusterCount = Math.max(4, Math.min(6, Math.ceil(columnCount / 3)));
  const clusterColumns = Math.ceil(Math.sqrt(clusterCount * 1.5));
  const clusterRows = Math.ceil(clusterCount / clusterColumns);
  const clusterSpacingX = 144;
  const clusterSpacingY = 152;
  const localOffsets = [
    { x: 0, y: 0 },
    { x: 18, y: 10 },
    { x: -18, y: 12 },
    { x: 9, y: -14 },
    { x: -12, y: -10 },
  ];
  const positions: HulebuStackColumn[] = [];

  for (let clusterIndex = 0; clusterIndex < clusterCount; clusterIndex += 1) {
    const row = Math.floor(clusterIndex / clusterColumns);
    const col = clusterIndex % clusterColumns;
    const rowOffset = row % 2 === 0 ? 0 : 0.18;
    const clusterX = 310 + (col - (clusterColumns - 1) / 2 + rowOffset) * clusterSpacingX;
    const clusterY = 225 + (row - (clusterRows - 1) / 2) * clusterSpacingY;
    const firstColumnIndex = Math.floor((clusterIndex * columnCount) / clusterCount);
    const nextColumnIndex = Math.floor(((clusterIndex + 1) * columnCount) / clusterCount);

    for (let index = firstColumnIndex; index < nextColumnIndex; index += 1) {
      const localIndex = index - firstColumnIndex;
      const offset = localOffsets[localIndex % localOffsets.length];
      const xJitter = Math.round((random() - 0.5) * 8);
      const yJitter = Math.round((random() - 0.5) * 8);
      positions.push({
        index,
        x: Math.round(clusterX + offset.x + xJitter),
        y: Math.round(clusterY + offset.y + yJitter),
        depth: depths[index],
      });
    }
  }

  return shuffle(positions, random).map((position, index) => ({
    ...position,
    index,
  }));
}

function createTopFirstPlacements(columns: HulebuStackColumn[]): HulebuTilePlacement[] {
  const maxDepth = Math.max(...columns.map((column) => column.depth));
  const placements: HulebuTilePlacement[] = [];

  for (let depthFromTop = 0; depthFromTop < maxDepth; depthFromTop += 1) {
    columns
      .filter((column) => column.depth > depthFromTop)
      .sort((a, b) => a.y - b.y || a.x - b.x)
      .forEach((column) => {
        placements.push({
          column,
          layer: column.depth - depthFromTop - 1,
        });
      });
  }

  return placements;
}

function createTileFaces(
  options: HulebuRandomMountainLevelOptions,
  random: () => number,
  groupCount: number,
): HulebuTileFace[] {
  const faces: HulebuTileFace[] = [];
  const forceHonorGroupIndex = Math.min(2, Math.max(0, groupCount - 1));

  for (let groupIndex = 0; groupIndex < groupCount; groupIndex += 1) {
    const featured = options.featuredTiles[groupIndex % Math.max(1, options.featuredTiles.length)];
    if (groupIndex < options.featuredTiles.length) {
      faces.push(featured);
      continue;
    }

    if (groupIndex === forceHonorGroupIndex || random() < options.honorWeight) {
      faces.push({
        suit: "honor",
        rank: 1 + Math.floor(random() * 7),
      });
      continue;
    }

    const suits: HulebuTileSuit[] = ["wan", "tiao", "tong"];
    faces.push({
      suit: suits[Math.floor(random() * suits.length)],
      rank: 1 + Math.floor(random() * 9),
    });
  }

  return faces;
}

function applyStackBlockers(tiles: HulebuLevelTileConfig[]): void {
  tiles.forEach((tile) => {
    const blockers = new Set<string>();
    tiles.forEach((candidate) => {
      if (candidate.id === tile.id || candidate.layer <= tile.layer) {
        return;
      }

      const sameColumn = candidate.x === tile.x && candidate.y === tile.y;
      if (sameColumn) {
        blockers.add(candidate.id);
        return;
      }

      if (
        !sameColumn
        && getTileOverlapRatio(tile, candidate) > HULEBU_COCOS_STACK_OVERLAP_THRESHOLD
      ) {
        blockers.add(candidate.id);
      }
    });
    tile.blockedBy = [...blockers].sort();
  });
}

function getTileOverlapRatio(tile: HulebuLevelTileConfig, blocker: HulebuLevelTileConfig): number {
  const tileWidth = 52;
  const tileHeight = 70;
  const left = Math.max(tile.x - tileWidth / 2, blocker.x - tileWidth / 2);
  const right = Math.min(tile.x + tileWidth / 2, blocker.x + tileWidth / 2);
  const top = Math.max(tile.y - tileHeight / 2, blocker.y - tileHeight / 2);
  const bottom = Math.min(tile.y + tileHeight / 2, blocker.y + tileHeight / 2);
  const overlapWidth = Math.max(0, right - left);
  const overlapHeight = Math.max(0, bottom - top);
  return (overlapWidth * overlapHeight) / (tileWidth * tileHeight);
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function createTile(
  id: string,
  suit: HulebuTileSuit,
  rank: number,
  x: number,
  y: number,
  layer: number,
  blockedBy: string[],
): HulebuLevelTileConfig {
  return {
    id,
    suit,
    rank,
    x,
    y,
    layer,
    blockedBy,
    location: "board",
  };
}
