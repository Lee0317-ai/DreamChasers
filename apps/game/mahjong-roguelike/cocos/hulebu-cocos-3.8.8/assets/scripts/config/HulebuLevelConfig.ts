import {
  generateHulebuMountain,
  type HulebuGeneratedLevelTile,
  type HulebuMountainTemplateId,
} from "../../../../../../../../packages/shared/src/mahjong-mountain-generator";

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

interface HulebuGraphMountainLevelOptions {
  id: string;
  order: number;
  name: string;
  subtitle: string;
  rewardPool: string[];
  seed: string;
  targetTileCount: number;
  maxStackDepth: number;
  honorWeight: number;
  templateId?: HulebuMountainTemplateId;
}

export const HULEBU_REWARD_LEVEL_ORDERS = new Set([3, 6, 9, 13, 16, 19]);
export const HULEBU_BOSS_LEVEL_ORDERS = new Set([10, 20]);
export const HULEBU_COCOS_STACK_OVERLAP_THRESHOLD = 0.05;
const HULEBU_GRAPH_COCOS_X_SCALE = 1.12;
const HULEBU_GRAPH_COCOS_Y_SCALE = 1.08;
export const HULEBU_GRAPH_TEMPLATE_ROTATION: HulebuMountainTemplateId[] = [
  "center-tower",
  "two-wings",
  "cross",
  "ring",
  "long-wall",
  "islands",
  "canyon",
  "staircase",
];

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

const HULEBU_GRAPH_LEVELS: HulebuGraphMountainLevelOptions[] = [
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
  },
];

export const HULEBU_LEVEL_ONE_CONFIG: HulebuRuntimeLevelConfig = createHulebuGraphMountainLevelConfig(HULEBU_GRAPH_LEVELS[0]);

export const HULEBU_LEVEL_CONFIGS: HulebuRuntimeLevelConfig[] = [
  HULEBU_LEVEL_ONE_CONFIG,
  ...HULEBU_GRAPH_LEVELS.slice(1).map((level) => createHulebuGraphMountainLevelConfig(level)),
];

export function getHulebuLevelConfigByIndex(levelIndex: number): HulebuRuntimeLevelConfig {
  const normalizedIndex = Math.min(Math.max(0, levelIndex), HULEBU_LEVEL_CONFIGS.length - 1);
  return HULEBU_LEVEL_CONFIGS[normalizedIndex];
}

export function getHulebuLevelIndexByOrder(order: number): number {
  return Math.max(0, HULEBU_LEVEL_CONFIGS.findIndex((level) => level.order === order));
}

export function createHulebuGraphMountainLevelConfig(options: HulebuGraphMountainLevelOptions): HulebuRuntimeLevelConfig {
  const templateId = options.templateId ?? resolveGraphTemplateId(options.order);
  const generated = generateHulebuMountain({
    templateId,
    seed: options.seed,
    tileCount: options.targetTileCount,
    maxLayer: options.maxStackDepth,
    initialFreeRange: { min: 7, max: 14 },
    randomness: 0.32 + Math.min(0.26, options.order * 0.01),
    decoyRate: Math.min(0.22, 0.06 + options.honorWeight * 0.3),
    comboOrder: ["peng", "chi", "gang", "hu"],
    targetDifficulty: options.order >= 17 ? "hard" : options.order >= 8 ? "normal" : "easy",
    templateParameters: {
      entranceCount: Math.min(14, 7 + Math.floor(options.order / 3)),
      releaseDensity: options.order >= 10 ? 0.46 : 0.58,
    },
  });
  const tiles = generated.levelTiles.map((tile) => mapGraphTileToCocosTile(tile, templateId));

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

function resolveGraphTemplateId(order: number): HulebuMountainTemplateId {
  return HULEBU_GRAPH_TEMPLATE_ROTATION[(order - 1) % HULEBU_GRAPH_TEMPLATE_ROTATION.length];
}

function mapGraphTileToCocosTile(
  tile: HulebuGeneratedLevelTile,
  templateId: HulebuMountainTemplateId,
): HulebuLevelTileConfig {
  return {
    id: `graph_${templateId}_${tile.id}`,
    suit: tile.suit,
    rank: normalizeGraphRank(tile),
    x: Math.round(tile.x * HULEBU_GRAPH_COCOS_X_SCALE + 310),
    y: Math.round(tile.y * HULEBU_GRAPH_COCOS_Y_SCALE + 180),
    layer: tile.layer,
    blockedBy: tile.blockedBy.map((blockerId) => `graph_${templateId}_${blockerId}`).sort(),
    location: "board",
  };
}

function normalizeGraphRank(tile: HulebuGeneratedLevelTile): number {
  if (tile.suit === "honor") {
    return Math.max(1, Math.min(7, tile.rank));
  }

  return Math.max(1, Math.min(9, tile.rank));
}
