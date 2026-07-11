import {
  generateHulebuMountain,
  type HulebuGeneratedLevelTile,
  type HulebuMountainTemplateId,
} from "./HulebuMountainGenerator";

export type HulebuTileSuit = "wan" | "tiao" | "tong" | "honor";
export type HulebuComboType = "hu" | "gang" | "peng" | "chi" | "bugang";
export type HulebuToolType = "shuffle" | "undo" | "discard" | "vision";
export type HulebuRunMode = "mainline" | "endless" | "daily" | "advanced";
export type HulebuAdvancedRunTier = "east" | "south" | "west" | "north";
export type HulebuRunArchetypeId = "chi" | "peng" | "gang" | "hu" | "tool" | "vision";
export type HulebuSpecialEventRarity = "common" | "rare" | "advanced";
export type HulebuBossVariantId = "main_trial" | "final_king" | "advanced_variant" | "endless_chapter" | "daily_mutator";

export interface HulebuRunProfile {
  mode: HulebuRunMode;
  displayName: string;
  startOrder: number;
  dailySeed?: string;
  advancedTier?: HulebuAdvancedRunTier;
}

export interface HulebuLevelTileConfig {
  id: string;
  suit: HulebuTileSuit;
  rank: number;
  x: number;
  y: number;
  layer: number;
  blockedBy: string[];
  location: "board" | "slot" | "reserve" | "river" | "removed";
}

export interface HulebuLevelDefaults {
  slotLimit: number;
  reserveLimit: number;
  shields: number;
  firstProtect: boolean;
  tools: {
    shuffle: number;
    undo: number;
    discard: number;
    vision: number;
  };
}

export type HulebuBossGoalConfig =
  | { type: "combo_count"; combo: HulebuComboType; target: number }
  | { type: "suit_set"; suits: HulebuTileSuit[]; eachTarget: number }
  | { type: "score_target"; target: number };

export type HulebuSpecialEventEffect =
  | { type: "coin"; amount: number }
  | { type: "tool"; tool: HulebuToolType; amount: number }
  | { type: "forbid_tool"; tool: HulebuToolType };

export interface HulebuSpecialEventConfig {
  id: string;
  name: string;
  subtitle: string;
  rarity: HulebuSpecialEventRarity;
  tags: string[];
  dangerLevel: 0 | 1 | 2 | 3;
  effect: HulebuSpecialEventEffect;
}

export interface HulebuRunArchetypeEffect {
  startingCoins?: number;
  toolBonus?: Partial<Record<HulebuToolType, number>>;
  scoreBonus?: Partial<Record<HulebuComboType, number>>;
}

export interface HulebuRunArchetypeConfig {
  id: HulebuRunArchetypeId;
  name: string;
  subtitle: string;
  effect: HulebuRunArchetypeEffect;
}

export interface HulebuAdvancedRunPressureConfig {
  tier: HulebuAdvancedRunTier;
  name: string;
  subtitle: string;
  coinBonus: number;
  toolBonus: Partial<Record<HulebuToolType, number>>;
  toolLocks: Partial<Record<HulebuToolType, boolean>>;
}

export interface HulebuAdvancedAbilityConfig {
  id: string;
  name: string;
  subtitle: string;
  tiers: HulebuAdvancedRunTier[];
  rewardIds: string[];
  coinBonus: number;
  toolBonus: Partial<Record<HulebuToolType, number>>;
  toolLocks: Partial<Record<HulebuToolType, boolean>>;
}

export interface HulebuRuntimeLevelConfig {
  id: string;
  order: number;
  name: string;
  subtitle: string;
  bossVariant?: HulebuBossVariantConfig;
  rewardPool: string[];
  bossGoals: HulebuBossGoalConfig[];
  defaults: HulebuLevelDefaults;
  initialSlotOrder: string[];
  initialReserveOrder: string[];
  tiles: HulebuLevelTileConfig[];
}

export interface HulebuBossVariantConfig {
  id: HulebuBossVariantId;
  name: string;
  subtitle: string;
  extraGoals: HulebuBossGoalConfig[];
}

export interface HulebuDailyMutatorProfile {
  key: string;
  label: string;
  detail: string;
  rewardLabel: string;
  rewardBias: string[];
  eventBias: string[];
  featuredCombos: HulebuComboType[];
}

const HULEBU_BASE_DEFAULTS: HulebuLevelDefaults = {
  slotLimit: 8,
  reserveLimit: 1,
  shields: 1,
  firstProtect: true,
  tools: {
    shuffle: 1,
    undo: 1,
    discard: 1,
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
  bossGoals?: HulebuBossGoalConfig[];
}

export const HULEBU_REWARD_LEVEL_ORDERS = new Set([3, 6, 9, 13, 16, 19]);
export const HULEBU_EVENT_LEVEL_ORDERS = new Set([6, 8, 10, 14, 18]);
export const HULEBU_BOSS_LEVEL_ORDERS = new Set([10, 20]);
export const HULEBU_ENDLESS_START_ORDER = 21;
export const HULEBU_ADVANCED_START_ORDER = 31;
export const HULEBU_COCOS_STACK_OVERLAP_THRESHOLD = 0.001;
const HULEBU_GRAPH_COCOS_CENTER = { x: 310, y: 180 };
const HULEBU_GRAPH_COCOS_MAX_SPAN = { x: 320, y: 360 };
const HULEBU_COCOS_TILE_SIZE = { width: 32, height: 43 };
const HULEBU_GRAPH_COCOS_LAYER_OFFSET = 8;
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
  advanced_east_probe: "东风探手",
  advanced_east_flow: "顺手摸牌",
  advanced_south_river_guard: "护河留手",
  advanced_south_stable_table: "稳河控口",
  advanced_west_trial_audit: "试炼审计",
  advanced_west_tail_gate: "牌尾留门",
  advanced_north_kong_tide: "杠潮压顶",
  advanced_north_stable_life: "稳压续命",
};

export const HULEBU_ADVANCED_REWARD_POOLS: Record<HulebuAdvancedRunTier, string[]> = {
  east: ["advanced_east_probe", "advanced_east_flow"],
  south: ["advanced_south_river_guard", "advanced_south_stable_table"],
  west: ["advanced_west_trial_audit", "advanced_west_tail_gate"],
  north: ["advanced_north_kong_tide", "advanced_north_stable_life"],
};

export const HULEBU_ADVANCED_ABILITIES: HulebuAdvancedAbilityConfig[] = [
  {
    id: "sealed_wall_guard",
    name: "封盘护河",
    subtitle: "开局获得护河留手，每关打牌 +1",
    tiers: ["south", "west", "north"],
    rewardIds: ["advanced_south_river_guard"],
    coinBonus: 0,
    toolBonus: { discard: 1 },
    toolLocks: {},
  },
  {
    id: "late_fire",
    name: "迟火",
    subtitle: "开局获得顺手摸牌，每关铜钱 +10",
    tiers: ["east", "west", "north"],
    rewardIds: ["advanced_east_flow"],
    coinBonus: 10,
    toolBonus: {},
    toolLocks: {},
  },
  {
    id: "tail_buffer",
    name: "牌尾缓冲",
    subtitle: "开局获得牌尾留门，每关撤回 +1",
    tiers: ["west", "north"],
    rewardIds: ["advanced_west_tail_gate"],
    coinBonus: 0,
    toolBonus: { undo: 1 },
    toolLocks: {},
  },
];

export const HULEBU_SPECIAL_EVENTS: HulebuSpecialEventConfig[] = [
  {
    id: "old_player",
    name: "路遇老雀",
    subtitle: "本关开局铜钱 +20",
    rarity: "common",
    tags: ["补钱", "稳开"],
    dangerLevel: 0,
    effect: { type: "coin", amount: 20 },
  },
  {
    id: "old_tile_box",
    name: "旧牌匣",
    subtitle: "本关撤回 +1",
    rarity: "common",
    tags: ["容错", "工具"],
    dangerLevel: 0,
    effect: { type: "tool", tool: "undo", amount: 1 },
  },
  {
    id: "dark_table",
    name: "暗灯牌局",
    subtitle: "本关禁用看山，换取节奏压力",
    rarity: "rare",
    tags: ["压信息", "风险"],
    dangerLevel: 2,
    effect: { type: "forbid_tool", tool: "vision" },
  },
  {
    id: "sealed_wall",
    name: "封盘押后",
    subtitle: "本关禁用洗牌，保留原牌势",
    rarity: "rare",
    tags: ["压工具", "封盘"],
    dangerLevel: 2,
    effect: { type: "forbid_tool", tool: "shuffle" },
  },
];

export const HULEBU_ADVANCED_SPECIAL_EVENT_POOLS: Record<HulebuAdvancedRunTier, HulebuSpecialEventConfig[]> = {
  east: [
    {
      id: "advanced_east_trial",
      name: "东风试胆",
      subtitle: "本关撤回 +1，试探牌势",
      rarity: "advanced",
      tags: ["高阶", "试探", "容错"],
      dangerLevel: 1,
      effect: { type: "tool", tool: "undo", amount: 1 },
    },
  ],
  south: [
    {
      id: "advanced_south_stake",
      name: "南桌续押",
      subtitle: "本关铜钱 +20，保留续压空间",
      rarity: "advanced",
      tags: ["高阶", "续压", "补钱"],
      dangerLevel: 1,
      effect: { type: "coin", amount: 20 },
    },
  ],
  west: [
    {
      id: "advanced_west_watch",
      name: "西风照听",
      subtitle: "本关看山 +1，审牌尾留门",
      rarity: "advanced",
      tags: ["高阶", "信息", "审牌"],
      dangerLevel: 1,
      effect: { type: "tool", tool: "vision", amount: 1 },
    },
  ],
  north: [
    {
      id: "advanced_north_tail",
      name: "北风断尾",
      subtitle: "本关撤回 +1，保留尾门容错",
      rarity: "advanced",
      tags: ["高阶", "尾门", "容错"],
      dangerLevel: 2,
      effect: { type: "tool", tool: "undo", amount: 1 },
    },
  ],
};

export const HULEBU_ENDLESS_SPECIAL_EVENTS: HulebuSpecialEventConfig[] = [
  {
    id: "endless_long_supply",
    name: "长山补给",
    subtitle: "本关洗牌 +1，撑住章节长线",
    rarity: "rare",
    tags: ["无尽", "续航", "工具"],
    dangerLevel: 1,
    effect: { type: "tool", tool: "shuffle", amount: 1 },
  },
  {
    id: "endless_deep_tail",
    name: "深山留尾",
    subtitle: "本关撤回 +1，应对尾盘卡口",
    rarity: "rare",
    tags: ["无尽", "尾盘", "容错"],
    dangerLevel: 1,
    effect: { type: "tool", tool: "undo", amount: 1 },
  },
];

export const HULEBU_DAILY_SPECIAL_EVENTS: HulebuSpecialEventConfig[] = [
  {
    id: "daily_lucky_draw",
    name: "今日手气",
    subtitle: "本关铜钱 +20，记录今日开局",
    rarity: "rare",
    tags: ["每日", "补钱", "轻压"],
    dangerLevel: 0,
    effect: { type: "coin", amount: 20 },
  },
  {
    id: "daily_rule_twist",
    name: "今日变招",
    subtitle: "本关禁用看山，换取每日词缀压力",
    rarity: "rare",
    tags: ["每日", "词缀", "压信息"],
    dangerLevel: 2,
    effect: { type: "forbid_tool", tool: "vision" },
  },
];

export const HULEBU_DAILY_MUTATORS: HulebuDailyMutatorProfile[] = [
  {
    key: "river-pressure",
    label: "今日词缀：牌河压顶",
    detail: "前中段更容易遇到弃牌与河控压力。",
    rewardLabel: "今日奖励：河灯筹码",
    rewardBias: ["advanced_south_river_guard", "shield_plus_1", "undo_plus_1"],
    eventBias: ["daily_rule_twist", "archetype_tool_pack"],
    featuredCombos: ["peng", "gang"],
  },
  {
    key: "late-sprint",
    label: "今日词缀：牌尾追击",
    detail: "残局节奏更紧，胡流更容易打出收官。",
    rewardLabel: "今日奖励：尾巡印记",
    rewardBias: ["advanced_west_tail_gate", "gang_score_plus_25", "undo_plus_1"],
    eventBias: ["daily_lucky_draw", "archetype_hu_tail_gate"],
    featuredCombos: ["hu"],
  },
  {
    key: "kong-engine",
    label: "今日词缀：杠响回巡",
    detail: "杠相关机会更密集，适合追爆发。",
    rewardLabel: "今日奖励：杠响铜契",
    rewardBias: ["advanced_north_kong_tide", "gang_score_plus_25", "shuffle_plus_1"],
    eventBias: ["archetype_gang_wall_push", "daily_lucky_draw"],
    featuredCombos: ["gang", "bugang"],
  },
  {
    key: "vision-weave",
    label: "今日词缀：看山织线",
    detail: "信息流和试路更容易连成一线。",
    rewardLabel: "今日奖励：织线签",
    rewardBias: ["vision_plus_1", "shuffle_plus_1", "advanced_east_probe"],
    eventBias: ["archetype_vision_dark_bargain", "daily_lucky_draw"],
    featuredCombos: ["chi"],
  },
  {
    key: "rescue-cache",
    label: "今日词缀：余槽救场",
    detail: "中段容错和救场收益更吃香。",
    rewardLabel: "今日奖励：回袋符",
    rewardBias: ["reserve_plus_1", "first_protect_shield", "shield_plus_1"],
    eventBias: ["daily_lucky_draw", "archetype_tool_pack"],
    featuredCombos: ["hu"],
  },
  {
    key: "wall-bulwark",
    label: "今日词缀：挡墙续押",
    detail: "续墙、挡墙和封尾路线更稳。",
    rewardLabel: "今日奖励：墙脉铜牌",
    rewardBias: ["advanced_south_stable_table", "shield_plus_1", "vision_plus_1"],
    eventBias: ["daily_rule_twist", "advanced_south_stake"],
    featuredCombos: ["peng"],
  },
  {
    key: "odds-burn",
    label: "今日词缀：押线点火",
    detail: "更容易摸到试锋、压注和收账线。",
    rewardLabel: "今日奖励：点火铜签",
    rewardBias: ["coin_plus_20", "advanced_east_flow", "gang_score_plus_25"],
    eventBias: ["daily_lucky_draw", "advanced_east_trial"],
    featuredCombos: ["chi", "hu"],
  },
  {
    key: "lock-tail",
    label: "今日词缀：封尾落锁",
    detail: "残局更容易转成封尾与死锁手感。",
    rewardLabel: "今日奖励：尾锁牌印",
    rewardBias: ["advanced_west_tail_gate", "undo_plus_1", "first_protect_shield"],
    eventBias: ["daily_rule_twist", "advanced_north_tail"],
    featuredCombos: ["hu", "gang"],
  },
];

export const HULEBU_ARCHETYPE_SPECIAL_EVENT_POOLS: Record<HulebuRunArchetypeId, HulebuSpecialEventConfig[]> = {
  chi: [
    {
      id: "archetype_chi_smooth_line",
      name: "顺手开线",
      subtitle: "本关铜钱 +20，顺吃流先铺节奏",
      rarity: "rare",
      tags: ["吃流", "开线", "补钱"],
      dangerLevel: 0,
      effect: { type: "coin", amount: 20 },
    },
  ],
  peng: [
    {
      id: "archetype_peng_keep_hand",
      name: "碰口留手",
      subtitle: "本关撤回 +1，保留碰牌容错",
      rarity: "rare",
      tags: ["碰流", "容错", "手牌"],
      dangerLevel: 0,
      effect: { type: "tool", tool: "undo", amount: 1 },
    },
  ],
  gang: [
    {
      id: "archetype_gang_wall_push",
      name: "杠墙推山",
      subtitle: "本关洗牌 +1，为开杠找入口",
      rarity: "rare",
      tags: ["杠流", "开山", "工具"],
      dangerLevel: 1,
      effect: { type: "tool", tool: "shuffle", amount: 1 },
    },
  ],
  hu: [
    {
      id: "archetype_hu_tail_gate",
      name: "胡门留尾",
      subtitle: "本关看山 +1，提前审 3+3+2",
      rarity: "rare",
      tags: ["胡流", "信息", "收口"],
      dangerLevel: 1,
      effect: { type: "tool", tool: "vision", amount: 1 },
    },
  ],
  tool: [
    {
      id: "archetype_tool_pack",
      name: "工具补包",
      subtitle: "本关打牌 +1，给道具流留河口",
      rarity: "rare",
      tags: ["道具", "牌河", "补给"],
      dangerLevel: 0,
      effect: { type: "tool", tool: "discard", amount: 1 },
    },
  ],
  vision: [
    {
      id: "archetype_vision_dark_bargain",
      name: "明暗换眼",
      subtitle: "本关禁用洗牌，换取信息流压力判断",
      rarity: "rare",
      tags: ["信息", "压工具", "判断"],
      dangerLevel: 2,
      effect: { type: "forbid_tool", tool: "shuffle" },
    },
  ],
};

const HULEBU_ALL_SPECIAL_EVENTS = [
  ...HULEBU_SPECIAL_EVENTS,
  ...Object.values(HULEBU_ADVANCED_SPECIAL_EVENT_POOLS).flat(),
  ...HULEBU_ENDLESS_SPECIAL_EVENTS,
  ...HULEBU_DAILY_SPECIAL_EVENTS,
  ...Object.values(HULEBU_ARCHETYPE_SPECIAL_EVENT_POOLS).flat(),
];

export const HULEBU_SPECIAL_EVENT_LABELS: Record<string, string> = HULEBU_ALL_SPECIAL_EVENTS.reduce(
  (labels, event) => ({
    ...labels,
    [event.id]: event.name,
  }),
  {} as Record<string, string>,
);

export const HULEBU_SPECIAL_EVENT_RARITY_LABELS: Record<HulebuSpecialEventRarity, string> = {
  common: "普通",
  rare: "稀有",
  advanced: "高阶",
};

export const HULEBU_SPECIAL_EVENT_DANGER_LABELS: Record<HulebuSpecialEventConfig["dangerLevel"], string> = {
  0: "无压",
  1: "轻压",
  2: "高压",
  3: "险局",
};

export const HULEBU_RUN_ARCHETYPES: HulebuRunArchetypeConfig[] = [
  {
    id: "chi",
    name: "顺吃流",
    subtitle: "本局吃牌得分 +6",
    effect: { scoreBonus: { chi: 6 } },
  },
  {
    id: "peng",
    name: "碰开流",
    subtitle: "本局碰牌得分 +8",
    effect: { scoreBonus: { peng: 8 } },
  },
  {
    id: "gang",
    name: "开杠流",
    subtitle: "本局杠和补杠得分 +15",
    effect: { scoreBonus: { gang: 15, bugang: 15 } },
  },
  {
    id: "hu",
    name: "追胡流",
    subtitle: "本局胡牌得分 +30",
    effect: { scoreBonus: { hu: 30 } },
  },
  {
    id: "tool",
    name: "道具流",
    subtitle: "本局洗牌、撤回、打牌各 +1",
    effect: { toolBonus: { shuffle: 1, undo: 1, discard: 1 } },
  },
  {
    id: "vision",
    name: "信息流",
    subtitle: "本局看山 +2，开局铜钱 +10",
    effect: { startingCoins: 10, toolBonus: { vision: 2 } },
  },
];

export const HULEBU_RUN_ARCHETYPE_LABELS: Record<HulebuRunArchetypeId, string> = HULEBU_RUN_ARCHETYPES.reduce(
  (labels, archetype) => ({
    ...labels,
    [archetype.id]: archetype.name,
  }),
  {} as Record<HulebuRunArchetypeId, string>,
);

export function getHulebuRunArchetypeConfig(archetypeId: HulebuRunArchetypeId): HulebuRunArchetypeConfig {
  return HULEBU_RUN_ARCHETYPES.find((archetype) => archetype.id === archetypeId) ?? HULEBU_RUN_ARCHETYPES[0];
}

export function getHulebuSpecialEventConfig(eventId: string): HulebuSpecialEventConfig | null {
  return HULEBU_ALL_SPECIAL_EVENTS.find((event) => event.id === eventId) ?? null;
}

export function getHulebuSpecialEventChoices(
  levelOrder: number,
  profile: HulebuRunProfile = HULEBU_MAINLINE_RUN_PROFILE,
  archetypeId?: HulebuRunArchetypeId | null,
): HulebuSpecialEventConfig[] {
  const startIndex = Math.max(0, levelOrder - 1) % HULEBU_SPECIAL_EVENTS.length;
  const baseChoices = Array.from({ length: 3 }, (_, index) => (
    HULEBU_SPECIAL_EVENTS[(startIndex + index) % HULEBU_SPECIAL_EVENTS.length]
  ));
  const modeChoices = getHulebuModeSpecialEventPool(profile);
  const archetypeChoices = getHulebuArchetypeSpecialEventPool(archetypeId);
  if (modeChoices.length === 0 && archetypeChoices.length === 0) {
    return baseChoices;
  }

  return [...archetypeChoices, ...modeChoices, ...baseChoices].filter((event, index, events) => (
    events.findIndex((candidate) => candidate.id === event.id) === index
  )).slice(0, 3);
}

export function getHulebuArchetypeSpecialEventPool(
  archetypeId?: HulebuRunArchetypeId | null,
): HulebuSpecialEventConfig[] {
  if (!archetypeId) {
    return [];
  }

  return HULEBU_ARCHETYPE_SPECIAL_EVENT_POOLS[archetypeId] ?? [];
}

export function getHulebuModeSpecialEventPool(profile: HulebuRunProfile): HulebuSpecialEventConfig[] {
  if (profile.mode === "advanced" && profile.advancedTier) {
    return HULEBU_ADVANCED_SPECIAL_EVENT_POOLS[profile.advancedTier] ?? [];
  }

  if (profile.mode === "endless") {
    return HULEBU_ENDLESS_SPECIAL_EVENTS;
  }

  if (profile.mode === "daily") {
    const dailyMutator = getHulebuDailyMutatorProfile(profile.dailySeed ?? "");
    return [
      ...getHulebuSpecialEventsByIds(dailyMutator.eventBias),
      ...HULEBU_DAILY_SPECIAL_EVENTS,
    ].filter((event, index, events) => (
      events.findIndex((candidate) => candidate.id === event.id) === index
    ));
  }

  return [];
}

const HULEBU_GRAPH_LEVELS: HulebuGraphMountainLevelOptions[] = [
  {
    id: "validation_intro_peng",
    order: 1,
    name: "入门场",
    subtitle: "单一碰",
    rewardPool: ["first_protect_shield", "shield_plus_1", "vision_plus_1"],
    seed: "hulebu-cocos-001-intro-peng",
    templateId: "long-wall",
    targetTileCount: 15,
    maxStackDepth: 5,
    honorWeight: 0.18,
  },
  {
    id: "validation_chi_line",
    order: 2,
    name: "顺子场",
    subtitle: "吃的识别",
    rewardPool: ["reserve_plus_1", "chi_score_plus_8", "coin_plus_20"],
    seed: "hulebu-cocos-002-chi-line",
    targetTileCount: 36,
    maxStackDepth: 5,
    honorWeight: 0.16,
  },
  {
    id: "validation_gang_conflict",
    order: 3,
    name: "杠冲突场",
    subtitle: "碰还是杠",
    rewardPool: ["shield_plus_1", "undo_plus_1", "gang_score_plus_25"],
    seed: "hulebu-cocos-003-gang-conflict",
    targetTileCount: 42,
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
    targetTileCount: 48,
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
    targetTileCount: 54,
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
    targetTileCount: 60,
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
    targetTileCount: 66,
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
    targetTileCount: 72,
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
    targetTileCount: 78,
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
    targetTileCount: 84,
    maxStackDepth: 5,
    honorWeight: 0.3,
    bossGoals: [
      { type: "combo_count", combo: "chi", target: 1 },
      { type: "combo_count", combo: "peng", target: 1 },
      { type: "combo_count", combo: "gang", target: 1 },
      { type: "suit_set", suits: ["wan", "tiao", "tong"], eachTarget: 1 },
      { type: "score_target", target: 80 },
    ],
  },
  {
    id: "mvp_011_honor_pressure",
    order: 11,
    name: "字牌压阵",
    subtitle: "东南西北",
    rewardPool: ["peng_score_plus_10", "vision_plus_1", "reserve_plus_1"],
    seed: "hulebu-cocos-011-honor-pressure",
    targetTileCount: 90,
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
    targetTileCount: 102,
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
    targetTileCount: 96,
    maxStackDepth: 5,
    honorWeight: 0.22,
  },
  {
    id: "mvp_014_cross_suit_chains",
    order: 14,
    name: "双线顺子",
    subtitle: "交错吃牌",
    rewardPool: ["chi_score_plus_8", "vision_plus_1", "undo_plus_1"],
    seed: "hulebu-cocos-014-cross-suit",
    targetTileCount: 102,
    maxStackDepth: 5,
    honorWeight: 0.2,
  },
  {
    id: "mvp_015_honor_triplets",
    order: 15,
    name: "三元试炼",
    subtitle: "中字发财",
    rewardPool: ["peng_score_plus_10", "shield_plus_1", "gang_score_plus_25"],
    seed: "hulebu-cocos-015-honor-triplets",
    targetTileCount: 108,
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
    targetTileCount: 114,
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
    targetTileCount: 120,
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
    targetTileCount: 126,
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
    targetTileCount: 132,
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
    targetTileCount: 138,
    maxStackDepth: 6,
    honorWeight: 0.36,
    bossGoals: [
      { type: "combo_count", combo: "chi", target: 1 },
      { type: "combo_count", combo: "peng", target: 2 },
      { type: "combo_count", combo: "gang", target: 1 },
      { type: "combo_count", combo: "hu", target: 1 },
      { type: "suit_set", suits: ["wan", "tong", "tiao", "honor"], eachTarget: 1 },
      { type: "score_target", target: 180 },
    ],
  },
];

export const HULEBU_LEVEL_ONE_CONFIG: HulebuRuntimeLevelConfig = createHulebuGraphMountainLevelConfig(HULEBU_GRAPH_LEVELS[0]);

export const HULEBU_LEVEL_CONFIGS: HulebuRuntimeLevelConfig[] = [
  HULEBU_LEVEL_ONE_CONFIG,
  ...HULEBU_GRAPH_LEVELS.slice(1).map((level) => createHulebuGraphMountainLevelConfig(level)),
];

export const HULEBU_BOSS_VARIANTS: Record<HulebuBossVariantId, HulebuBossVariantConfig> = {
  main_trial: {
    id: "main_trial",
    name: "中段试炼",
    subtitle: "检查吃碰杠与三门齐",
    extraGoals: [],
  },
  final_king: {
    id: "final_king",
    name: "胡了卜王",
    subtitle: "终局 Boss，要求胡牌收口",
    extraGoals: [],
  },
  advanced_variant: {
    id: "advanced_variant",
    name: "高阶 Boss 变体",
    subtitle: "额外要求胡牌或终局收口",
    extraGoals: [{ type: "combo_count", combo: "hu", target: 1 }],
  },
  endless_chapter: {
    id: "endless_chapter",
    name: "章节 Boss",
    subtitle: "无尽章节尾部压力",
    extraGoals: [{ type: "score_target", target: 160 }],
  },
  daily_mutator: {
    id: "daily_mutator",
    name: "今日 Boss 变体",
    subtitle: "每日词缀附加题",
    extraGoals: [{ type: "combo_count", combo: "peng", target: 1 }],
  },
};

export const HULEBU_MAINLINE_RUN_PROFILE: HulebuRunProfile = {
  mode: "mainline",
  displayName: "主线",
  startOrder: 1,
};

export const HULEBU_ENDLESS_RUN_PROFILE: HulebuRunProfile = {
  mode: "endless",
  displayName: "无尽",
  startOrder: HULEBU_ENDLESS_START_ORDER,
};

export const HULEBU_ADVANCED_RUN_PROFILES: Record<HulebuAdvancedRunTier, HulebuRunProfile> = {
  east: {
    mode: "advanced",
    displayName: "东风场",
    startOrder: HULEBU_ADVANCED_START_ORDER,
    advancedTier: "east",
  },
  south: {
    mode: "advanced",
    displayName: "南风场",
    startOrder: HULEBU_ADVANCED_START_ORDER + 10,
    advancedTier: "south",
  },
  west: {
    mode: "advanced",
    displayName: "西风场",
    startOrder: HULEBU_ADVANCED_START_ORDER + 20,
    advancedTier: "west",
  },
  north: {
    mode: "advanced",
    displayName: "北风场",
    startOrder: HULEBU_ADVANCED_START_ORDER + 30,
    advancedTier: "north",
  },
};

export const HULEBU_ADVANCED_RUN_PRESSURES: Record<HulebuAdvancedRunTier, HulebuAdvancedRunPressureConfig> = {
  east: {
    tier: "east",
    name: "东风压场",
    subtitle: "开局看山 -1",
    coinBonus: 0,
    toolBonus: { vision: -1 },
    toolLocks: {},
  },
  south: {
    tier: "south",
    name: "南风封山",
    subtitle: "禁用洗牌，看山 -1",
    coinBonus: 0,
    toolBonus: { vision: -1 },
    toolLocks: { shuffle: true },
  },
  west: {
    tier: "west",
    name: "西风紧手",
    subtitle: "禁用洗牌，撤回 -1，看山 -1",
    coinBonus: 0,
    toolBonus: { undo: -1, vision: -1 },
    toolLocks: { shuffle: true },
  },
  north: {
    tier: "north",
    name: "北风死局",
    subtitle: "禁用洗牌和看山，撤回 -1，打牌 -1",
    coinBonus: 0,
    toolBonus: { undo: -1, discard: -1 },
    toolLocks: { shuffle: true, vision: true },
  },
};

export function createHulebuAdvancedRunProfile(tier: HulebuAdvancedRunTier): HulebuRunProfile {
  return HULEBU_ADVANCED_RUN_PROFILES[tier];
}

export function getHulebuAdvancedRunPressureConfig(
  profile: HulebuRunProfile,
): HulebuAdvancedRunPressureConfig | null {
  if (profile.mode !== "advanced" || !profile.advancedTier) {
    return null;
  }

  return HULEBU_ADVANCED_RUN_PRESSURES[profile.advancedTier] ?? null;
}

export function getHulebuRewardChoicesForRun(
  profile: HulebuRunProfile,
  level: HulebuRuntimeLevelConfig,
): string[] {
  if (profile.mode === "daily") {
    const dailyMutator = getHulebuDailyMutatorProfile(profile.dailySeed ?? "");
    return [...dailyMutator.rewardBias, ...level.rewardPool].filter((rewardId, index, rewards) => (
      rewards.indexOf(rewardId) === index
    )).slice(0, 3);
  }

  if (profile.mode !== "advanced" || !profile.advancedTier) {
    return level.rewardPool.slice(0, 3);
  }

  const advancedRewards = HULEBU_ADVANCED_REWARD_POOLS[profile.advancedTier] ?? [];
  return [...advancedRewards, ...level.rewardPool].filter((rewardId, index, rewards) => (
    rewards.indexOf(rewardId) === index
  )).slice(0, 3);
}

export function getHulebuAdvancedAbilityChoices(profile: HulebuRunProfile): HulebuAdvancedAbilityConfig[] {
  if (profile.mode !== "advanced" || !profile.advancedTier) {
    return [];
  }

  const tierChoices = HULEBU_ADVANCED_ABILITIES.filter((ability) => ability.tiers.indexOf(profile.advancedTier!) >= 0);
  return tierChoices.slice(0, 3);
}

export function createHulebuDailyRunProfile(dailySeed: string): HulebuRunProfile {
  return {
    mode: "daily",
    displayName: "每日",
    startOrder: 1,
    dailySeed,
  };
}

export function getHulebuDailyMutatorProfile(seed: string): HulebuDailyMutatorProfile {
  return HULEBU_DAILY_MUTATORS[hashDailySeed(seed || "today") % HULEBU_DAILY_MUTATORS.length];
}

export function getHulebuLevelConfigByIndex(levelIndex: number): HulebuRuntimeLevelConfig {
  const normalizedIndex = Math.min(Math.max(0, levelIndex), HULEBU_LEVEL_CONFIGS.length - 1);
  return HULEBU_LEVEL_CONFIGS[normalizedIndex];
}

export function createHulebuRuntimeLevelForRun(
  levelIndex: number,
  profile: HulebuRunProfile = HULEBU_MAINLINE_RUN_PROFILE,
  displayOrder?: number,
): HulebuRuntimeLevelConfig {
  const baseLevel = getHulebuLevelConfigByIndex(levelIndex);
  const bossVariant = getHulebuBossVariantForRun(profile, displayOrder ?? baseLevel.order);
  if (!bossVariant || baseLevel.bossGoals.length === 0) {
    return cloneHulebuRuntimeLevelConfig(baseLevel);
  }

  const existingGoalKeys = new Set(baseLevel.bossGoals.map((goal) => getBossGoalKey(goal)));
  const extraGoals = bossVariant.extraGoals.filter((goal) => !existingGoalKeys.has(getBossGoalKey(goal)));
  return {
    ...cloneHulebuRuntimeLevelConfig(baseLevel),
    bossVariant: cloneBossVariant(bossVariant),
    bossGoals: [
      ...copyBossGoals(baseLevel.bossGoals),
      ...copyBossGoals(extraGoals),
    ],
  };
}

export function getHulebuBossVariantForRun(
  profile: HulebuRunProfile,
  displayOrder: number,
): HulebuBossVariantConfig | null {
  if (!HULEBU_BOSS_LEVEL_ORDERS.has(getHulebuBossBaseOrder(displayOrder))) {
    return null;
  }

  if (profile.mode === "advanced") {
    return HULEBU_BOSS_VARIANTS.advanced_variant;
  }

  if (profile.mode === "endless") {
    return HULEBU_BOSS_VARIANTS.endless_chapter;
  }

  if (profile.mode === "daily") {
    return HULEBU_BOSS_VARIANTS.daily_mutator;
  }

  return getHulebuBossBaseOrder(displayOrder) >= 20
    ? HULEBU_BOSS_VARIANTS.final_king
    : HULEBU_BOSS_VARIANTS.main_trial;
}

export function getHulebuLevelIndexByOrder(order: number): number {
  return Math.max(0, HULEBU_LEVEL_CONFIGS.findIndex((level) => level.order === order));
}

export function getHulebuLevelIndexForRunOrder(profile: HulebuRunProfile, displayOrder: number): number {
  if (profile.mode === "endless") {
    const loopStartIndex = getHulebuLevelIndexByOrder(11);
    const loopLevels = HULEBU_LEVEL_CONFIGS.length - loopStartIndex;
    return loopStartIndex + positiveModulo(displayOrder - HULEBU_ENDLESS_START_ORDER, loopLevels);
  }

  if (profile.mode === "daily") {
    const seedOffset = hashDailySeed(profile.dailySeed ?? "") % HULEBU_LEVEL_CONFIGS.length;
    return positiveModulo(displayOrder - 1 + seedOffset, HULEBU_LEVEL_CONFIGS.length);
  }

  if (profile.mode === "advanced") {
    const tierOffset = profile.advancedTier === "south" ? 2 : profile.advancedTier === "west" ? 4 : profile.advancedTier === "north" ? 6 : 0;
    const loopStartIndex = getHulebuLevelIndexByOrder(11);
    const loopLevels = HULEBU_LEVEL_CONFIGS.length - loopStartIndex;
    return loopStartIndex + positiveModulo(displayOrder - profile.startOrder + tierOffset, loopLevels);
  }

  return getHulebuLevelIndexByOrder(displayOrder);
}

function getHulebuSpecialEventsByIds(eventIds: string[]): HulebuSpecialEventConfig[] {
  return eventIds.flatMap((eventId) => {
    const event = getHulebuSpecialEventConfig(eventId);
    return event ? [event] : [];
  });
}

export function shouldCompleteHulebuRunAtOrder(profile: HulebuRunProfile, displayOrder: number): boolean {
  return profile.mode === "mainline" && displayOrder > HULEBU_LEVEL_CONFIGS.length;
}

export function createHulebuGraphMountainLevelConfig(options: HulebuGraphMountainLevelOptions): HulebuRuntimeLevelConfig {
  const templateId = options.templateId ?? resolveGraphTemplateId(options.order);
  const openingFreeRange = resolveCocosOpeningFreeRange(options.order);
  const generated = generateHulebuMountain({
    templateId,
    seed: options.seed,
    tileCount: options.targetTileCount,
    maxLayer: options.maxStackDepth,
    initialFreeRange: openingFreeRange,
    randomness: 0.32 + Math.min(0.26, options.order * 0.01),
    decoyRate: Math.min(0.22, 0.06 + options.honorWeight * 0.3),
    honorWeight: options.honorWeight,
    comboOrder: ["peng", "chi", "gang", "hu"],
    targetDifficulty: options.order >= 17 ? "hard" : options.order >= 8 ? "normal" : "easy",
    templateParameters: {
      entranceCount: Math.min(14, 7 + Math.floor(options.order / 3)),
      releaseDensity: options.order >= 10 ? 0.46 : 0.58,
    },
  });
  const bounds = resolveGraphTileBounds(generated.levelTiles);
  const tiles = enforceCocosInitialFreeMaximum(
    enforceCocosInitialFreeMinimum(
      rebuildCocosBlockers(generated.levelTiles.map((tile) => mapGraphTileToCocosTile(tile, templateId, bounds))),
      openingFreeRange.min,
    ),
    openingFreeRange.max,
  );

  return {
    id: options.id,
    order: options.order,
    name: options.name,
    subtitle: options.subtitle,
    rewardPool: options.rewardPool,
    bossGoals: copyBossGoals(options.bossGoals),
    defaults: HULEBU_BASE_DEFAULTS,
    initialSlotOrder: [],
    initialReserveOrder: [],
    tiles,
  };
}

function resolveCocosOpeningFreeRange(order: number): { min: number; max: number } {
  if (order === 1) {
    return { min: 3, max: 3 };
  }

  return {
    min: Math.min(10, 5 + Math.floor(order / 4)),
    max: Math.min(18, 6 + Math.floor((order - 1) / 2)),
  };
}

function resolveGraphTemplateId(order: number): HulebuMountainTemplateId {
  return HULEBU_GRAPH_TEMPLATE_ROTATION[(order - 1) % HULEBU_GRAPH_TEMPLATE_ROTATION.length];
}

function mapGraphTileToCocosTile(
  tile: HulebuGeneratedLevelTile,
  templateId: HulebuMountainTemplateId,
  bounds: HulebuGraphTileBounds,
): HulebuLevelTileConfig {
  const layerOffsetX = -HULEBU_GRAPH_COCOS_LAYER_OFFSET * tile.layer;
  const layerOffsetY = HULEBU_GRAPH_COCOS_LAYER_OFFSET * tile.layer;
  return {
    id: `graph_${templateId}_${tile.id}`,
    suit: tile.suit,
    rank: normalizeGraphRank(tile),
    x: Math.round((tile.x - bounds.centerX) * bounds.scale + HULEBU_GRAPH_COCOS_CENTER.x + layerOffsetX),
    y: Math.round((tile.y - bounds.centerY) * bounds.scale + HULEBU_GRAPH_COCOS_CENTER.y + layerOffsetY),
    layer: tile.layer,
    blockedBy: [],
    location: "board",
  };
}

function rebuildCocosBlockers(tiles: HulebuLevelTileConfig[]): HulebuLevelTileConfig[] {
  return tiles.map((tile) => ({
    ...tile,
    blockedBy: tiles
      .filter((candidate) => (
        candidate.id !== tile.id
        && candidate.layer > tile.layer
        && getCocosTileOverlapRatio(tile, candidate) > HULEBU_COCOS_STACK_OVERLAP_THRESHOLD
      ))
      .map((candidate) => candidate.id)
      .sort(),
  }));
}

function getCocosTileOverlapRatio(tile: HulebuLevelTileConfig, blocker: HulebuLevelTileConfig): number {
  const left = Math.max(tile.x - HULEBU_COCOS_TILE_SIZE.width / 2, blocker.x - HULEBU_COCOS_TILE_SIZE.width / 2);
  const right = Math.min(tile.x + HULEBU_COCOS_TILE_SIZE.width / 2, blocker.x + HULEBU_COCOS_TILE_SIZE.width / 2);
  const top = Math.max(tile.y - HULEBU_COCOS_TILE_SIZE.height / 2, blocker.y - HULEBU_COCOS_TILE_SIZE.height / 2);
  const bottom = Math.min(tile.y + HULEBU_COCOS_TILE_SIZE.height / 2, blocker.y + HULEBU_COCOS_TILE_SIZE.height / 2);
  const overlapWidth = Math.max(0, right - left);
  const overlapHeight = Math.max(0, bottom - top);
  return (overlapWidth * overlapHeight) / (HULEBU_COCOS_TILE_SIZE.width * HULEBU_COCOS_TILE_SIZE.height);
}

function enforceCocosInitialFreeMinimum(tiles: HulebuLevelTileConfig[], minFreeCount: number): HulebuLevelTileConfig[] {
  let nextTiles = tiles.map((tile) => ({ ...tile, blockedBy: [...tile.blockedBy] }));
  const freeCount = () => nextTiles.filter((tile) => tile.blockedBy.length === 0).length;
  let releasedCount = 0;

  if (freeCount() >= minFreeCount) {
    return nextTiles;
  }

  const minY = Math.min(...nextTiles.map((tile) => tile.y));
  const maxLayer = Math.max(...nextTiles.map((tile) => tile.layer));
  const candidates = nextTiles
    .filter((tile) => tile.blockedBy.length > 0)
    .sort((left, right) => left.layer - right.layer || left.blockedBy.length - right.blockedBy.length);

  for (const tile of candidates) {
    if (freeCount() >= minFreeCount) {
      break;
    }

    tile.x = Math.round(HULEBU_GRAPH_COCOS_CENTER.x - 72 + (releasedCount % 4) * 48);
    tile.y = Math.round(minY - 54 - Math.floor(releasedCount / 4) * 14);
    tile.layer = maxLayer;
    tile.blockedBy = [];
    releasedCount += 1;
    nextTiles = rebuildCocosBlockers(nextTiles);
  }

  return nextTiles;
}

function enforceCocosInitialFreeMaximum(tiles: HulebuLevelTileConfig[], maxFreeCount: number): HulebuLevelTileConfig[] {
  let nextTiles = tiles.map((tile) => ({ ...tile, blockedBy: [...tile.blockedBy] }));

  const getFreeTiles = () => nextTiles
    .filter((tile) => tile.blockedBy.length === 0)
    .sort((a, b) => a.layer - b.layer || a.x - b.x);

  let freeTiles = getFreeTiles();
  let guard = 50;

  while (freeTiles.length > maxFreeCount && guard > 0) {
    guard--;
    const target = freeTiles[0];
    if (!target) {
      break;
    }
    const currentMaxLayer = Math.max(...nextTiles.map((tile) => tile.layer));
    if (target.layer >= currentMaxLayer) {
      break;
    }

    const blockerDependents = new Map<string, number>();
    nextTiles.forEach((tile) => {
      tile.blockedBy.forEach((blockerId) => {
        blockerDependents.set(blockerId, (blockerDependents.get(blockerId) ?? 0) + 1);
      });
    });
    const blocker = [...freeTiles]
      .reverse()
      .filter((tile) => tile.id !== target.id)
      .sort((a, b) => (blockerDependents.get(a.id) ?? 0) - (blockerDependents.get(b.id) ?? 0))[0];

    if (!blocker || (blockerDependents.get(blocker.id) ?? 0) > 0) {
      break;
    }

    blocker.x = target.x;
    blocker.y = target.y;
    blocker.layer = Math.min(currentMaxLayer, target.layer + 1);

    nextTiles = rebuildCocosBlockers(nextTiles);
    freeTiles = getFreeTiles();
  }

  return nextTiles;
}

interface HulebuGraphTileBounds {
  centerX: number;
  centerY: number;
  scale: number;
}

function resolveGraphTileBounds(tiles: HulebuGeneratedLevelTile[]): HulebuGraphTileBounds {
  const minX = Math.min(...tiles.map((tile) => tile.x));
  const maxX = Math.max(...tiles.map((tile) => tile.x));
  const minY = Math.min(...tiles.map((tile) => tile.y));
  const maxY = Math.max(...tiles.map((tile) => tile.y));
  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);
  return {
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
    scale: Math.min(HULEBU_GRAPH_COCOS_MAX_SPAN.x / spanX, HULEBU_GRAPH_COCOS_MAX_SPAN.y / spanY, 1),
  };
}

function normalizeGraphRank(tile: HulebuGeneratedLevelTile): number {
  if (tile.suit === "honor") {
    return Math.max(1, Math.min(7, tile.rank));
  }

  return Math.max(1, Math.min(9, tile.rank));
}

function copyBossGoals(goals: HulebuBossGoalConfig[] | undefined): HulebuBossGoalConfig[] {
  return (goals ?? []).map((goal) => {
    if (goal.type === "suit_set") {
      return { ...goal, suits: [...goal.suits] };
    }

    return { ...goal };
  });
}

function cloneHulebuRuntimeLevelConfig(level: HulebuRuntimeLevelConfig): HulebuRuntimeLevelConfig {
  return {
    ...level,
    bossVariant: level.bossVariant ? cloneBossVariant(level.bossVariant) : undefined,
    rewardPool: [...level.rewardPool],
    bossGoals: copyBossGoals(level.bossGoals),
    defaults: {
      ...level.defaults,
      tools: { ...level.defaults.tools },
    },
    initialSlotOrder: [...level.initialSlotOrder],
    initialReserveOrder: [...level.initialReserveOrder],
    tiles: level.tiles.map((tile) => ({
      ...tile,
      blockedBy: [...tile.blockedBy],
    })),
  };
}

function cloneBossVariant(variant: HulebuBossVariantConfig): HulebuBossVariantConfig {
  return {
    ...variant,
    extraGoals: copyBossGoals(variant.extraGoals),
  };
}

function getHulebuBossBaseOrder(displayOrder: number): number {
  if (displayOrder >= HULEBU_ADVANCED_START_ORDER) {
    return displayOrder % 10 === 0 ? 20 : 10;
  }
  if (displayOrder >= HULEBU_ENDLESS_START_ORDER) {
    return displayOrder % 5 === 0 ? 20 : 10;
  }

  return displayOrder;
}

function getBossGoalKey(goal: HulebuBossGoalConfig): string {
  if (goal.type === "score_target") {
    return `${goal.type}:${goal.target}`;
  }
  if (goal.type === "suit_set") {
    return `${goal.type}:${goal.suits.join(",")}:${goal.eachTarget}`;
  }

  return `${goal.type}:${goal.combo}:${goal.target}`;
}

function positiveModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function hashDailySeed(seed: string): number {
  return seed.split("").reduce((hash, char) => (
    (hash * 31 + char.charCodeAt(0)) >>> 0
  ), 0);
}
