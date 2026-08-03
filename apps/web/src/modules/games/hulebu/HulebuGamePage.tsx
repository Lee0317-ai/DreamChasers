"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Coins,
  Flame,
  LayoutDashboard,
  Lock,
  Play,
  RotateCcw,
  ScrollText,
  Swords,
} from "lucide-react";
import styles from "./HulebuGamePage.module.css";

const FRAME_BASE = "/games/hulebu-demo/index.html";
const STORAGE_KEY = "dreamchasers:hulebu-shell:v1";
const ENDLESS_START_LAYER = 21;
const DEFAULT_ASCENSION_LEVEL = 1;
type LobbyPanel = "mainline" | "upgrades" | "collection" | "endless" | "daily" | "ascension";
type Screen = "lobby" | "playing" | "settlement";
type SettlementResult = "completed";
type RunMode = "mainline" | "endless" | "daily";
type RunArchetypeId = "chi" | "peng" | "gang" | "hu" | "tool" | "vision";
type AscensionLevel = 1 | 2 | 3 | 4;
type AscensionPerkId =
  | "steady-hand"
  | "reserve-flow"
  | "storm-guard"
  | "lucky-route"
  | "river-sense"
  | "kong-engine"
  | "trial-sight"
  | "deadwall-cache"
  | "seal-table"
  | "late-flare";
type BossReview = {
  result?: SettlementResult;
  bossVariant?: string;
};
type SpecialEventReview = {
  summary?: string;
  detail?: string;
};
type AchievementGroup =
  | "mainline"
  | "endless"
  | "daily"
  | "upgrades"
  | "boss"
  | "events"
  | "ascension"
  | "builds";
type AchievementId =
  | "mainline-first-clear"
  | "mainline-master"
  | "boss-hulebu-king"
  | "boss-ascension-warden"
  | "endless-first-step"
  | "endless-layer-25"
  | "endless-layer-40"
  | "daily-first-checkin"
  | "daily-clear"
  | "daily-streak-7"
  | "upgrade-first-buy"
  | "upgrade-all-basic"
  | "upgrade-all-six"
  | "ascension-west-clear"
  | "ascension-north-clear"
  | "event-rare-encounter"
  | "event-ascension-encounter"
  | "build-reward-streak"
  | "route-focus-mastered";

type ActiveRun = {
  sessionKey: string;
  runMode: RunMode;
  runArchetype: RunArchetypeId;
  ascensionLevel: AscensionLevel | null;
  ascensionName: string | null;
  ascensionPerks: AscensionPerkId[];
  dailySeed: string | null;
  iframeSrc: string;
  latestCoins: number;
  latestScore: number;
  latestLevelOrder: number;
  latestEndlessLayer: number;
  latestSummary: string;
  pickedRewards: number;
};

type ActiveRunResumeState = Omit<ActiveRun, "iframeSrc"> & {
  updatedAt: string;
};

type SettlementState = {
  sessionKey: string;
  runMode: RunMode;
  runArchetype: RunArchetypeId;
  ascensionLevel: AscensionLevel | null;
  ascensionName: string | null;
  ascensionPerks: AscensionPerkId[];
  routeDirection: string | null;
  dailySeed: string | null;
  result: SettlementResult;
  coinsEarned: number;
  bankedCoins: number;
  reachedLevelOrder: number;
  reachedEndlessLayer: number;
  bestEndlessLayer: number;
  bestDailyLevelOrder: number;
  pickedRewards: number;
  summary: string;
  endlessChapterLabel: string | null;
  endlessChapterBoss: string | null;
  dailyMutatorLabel: string | null;
  dailyRewardLabel: string | null;
  dailyStreak: number;
  bossReview: BossReview | null;
  specialEventReview: SpecialEventReview | null;
};

type UpgradeId = "reserve" | "shield" | "tools" | "river" | "coins" | "vision";

type UpgradeState = Record<UpgradeId, number>;

type RouteFocusId = "auto" | "hu" | "info" | "river" | "tools" | "survive";

type PersistedShellState = {
  bankedCoins: number;
  bestEndlessLayer: number;
  bestAscensionLevel: AscensionLevel;
  dailyBestLevels: Record<string, number>;
  dailyStreak: number;
  lastDailySeed: string | null;
  achievements: Record<string, string>;
  lastSettlement: SettlementState | null;
  activeRun: ActiveRunResumeState | null;
  upgrades: UpgradeState;
  selectedRouteFocus: RouteFocusId;
  equippedAscensionLoadout: AscensionPerkId[];
  unlockedAscensionPerks: Partial<Record<AscensionPerkId, boolean>>;
};

type LegacySettlementState = Omit<SettlementState, "result" | "bossReview" | "specialEventReview"> & {
  result?: SettlementResult;
  bossReview?: BossReview | null;
  specialEventReview?: SpecialEventReview | null;
};

type AccountProgressState = {
  isSignedIn: boolean;
  syncReady: boolean;
  syncError: string | null;
};

type RemoteProgressState = Pick<
  PersistedShellState,
  "achievements" | "activeRun" | "bankedCoins" | "bestAscensionLevel" | "bestEndlessLayer" | "dailyBestLevels"
>;

type HulebuShellPayload = {
  sessionKey?: string;
  runMode?: RunMode;
  ascensionLevel?: AscensionLevel | null;
  ascensionName?: string | null;
  dailySeed?: string | null;
  coins?: number;
  score?: number;
  levelOrder?: number;
  endlessLayer?: number;
  endlessChapterLabel?: string | null;
  endlessChapterBoss?: string | null;
  dailyMutatorLabel?: string | null;
  dailyRewardLabel?: string | null;
  dailyStreak?: number | null;
  pickedRewards?: number;
  summary?: string;
  routeDirection?: string | null;
  bossReview?: BossReview | null;
  specialEventSummary?: string;
  specialEventMessage?: string;
};

type HulebuShellMessage = {
  source?: string;
  type?: "hulebu:run-progress" | "hulebu:run-complete" | "hulebu:run-failed";
  payload?: HulebuShellPayload;
};

type PanelContent = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  status: string;
};

type RunArchetypeConfig = {
  id: RunArchetypeId;
  label: string;
  summary: string;
  startBonus: string;
  rewardBias: string;
  routeLabel: string;
};

type RunArchetypeUnlock = {
  id: RunArchetypeId;
  unlockAtMainline: number;
  recommendedUntilMainline: number;
};

type UpgradeConfig = {
  id: UpgradeId;
  label: string;
  description: string;
  costs: number[];
  effectText: string[];
  param: "reserveBonus" | "shieldBonus" | "toolBonus" | "riverBonus" | "coinBonus" | "visionBonus";
};

type RouteFocusConfig = {
  id: RouteFocusId;
  label: string;
  route: string;
  description: string;
  longTail: string;
};

type RouteGrowthStatus = {
  currentEffect: string;
  nextTarget: string;
};

type RouteFocusPlaybook = {
  rewardFocus: string;
  eventFocus: string;
  recommendedMode: string;
  lateGamePlan: string;
};

type EndlessChapterPreview = {
  label: string;
  bossTitle: string;
  theme: string;
  detail: string;
  routeHint: string;
  rewardFocus: string;
  bossPressure: string;
};

type DailyMutatorPreview = {
  key: string;
  label: string;
  detail: string;
  rewardLabel: string;
  routeHint: string;
  rewardFocus: string;
  paceNote: string;
};

type AchievementConfig = {
  id: AchievementId;
  title: string;
  description: string;
  hint: string;
  group: AchievementGroup;
  hidden?: boolean;
  hiddenTitle?: string;
  hiddenHint?: string;
};

type AscensionConfig = {
  level: AscensionLevel;
  name: string;
  description: string;
  modifiers: string[];
  perkSlots: number;
  identity: string;
  buildAngle: string;
  contentFocus: string;
};

type AscensionPerkConfig = {
  id: AscensionPerkId;
  label: string;
  description: string;
  unlockLevel: AscensionLevel;
};

const DEFAULT_UPGRADES: UpgradeState = {
  reserve: 0,
  shield: 0,
  tools: 0,
  river: 0,
  coins: 0,
  vision: 0,
};

const UPGRADES: UpgradeConfig[] = [
  {
    id: "reserve",
    label: "备用槽",
    description: "给主线 run 增加额外备用位，失误时更能兜一口气。",
    costs: [80, 240],
    effectText: ["+1 备用槽", "+2 备用槽"],
    param: "reserveBonus",
  },
  {
    id: "shield",
    label: "满槽护符",
    description: "卡槽顶满时先吃掉护符，再判定失败，能多撑一个回合。",
    costs: [160, 480],
    effectText: ["+1 次护符", "+2 次护符"],
    param: "shieldBonus",
  },
  {
    id: "tools",
    label: "初始道具",
    description: "每轮开局额外补一组洗牌 / 撤回 / 丢弃次数。",
    costs: [120, 360],
    effectText: ["三种道具各 +1", "三种道具各 +2"],
    param: "toolBonus",
  },
  {
    id: "river",
    label: "河道扩容",
    description: "把牌河容量继续撑大，让弃牌、补杠和河控节奏更稳。",
    costs: [140, 420],
    effectText: ["牌河容量 +1", "牌河容量 +2"],
    param: "riverBonus",
  },
  {
    id: "coins",
    label: "开局铜钱",
    description: "每轮起手先带一笔铜钱，早点把局内节奏和道具滚起来。",
    costs: [100, 300],
    effectText: ["开局 +20 铜钱", "开局 +40 铜钱"],
    param: "coinBonus",
  },
  {
    id: "vision",
    label: "看山预置",
    description: "每轮开局额外补看山次数，让信息流和 Boss 读牌更早成型。",
    costs: [120, 360],
    effectText: ["看山 +1", "看山 +2"],
    param: "visionBonus",
  },
];

const ROUTE_FOCUS_CONFIGS: RouteFocusConfig[] = [
  {
    id: "auto",
    label: "自动偏好",
    route: "",
    description: "按当前长期成长最深的一轴给这一局补一点轻协同，适合先摸手感。",
    longTail: "还没决定主路线时先用它。",
  },
  {
    id: "hu",
    label: "胡流偏好",
    route: "胡流",
    description: "让局外铜钱成长在这局轻补胡牌收口，但不抢本局主轴。",
    longTail: "偏爆发，偏快节奏。",
  },
  {
    id: "info",
    label: "信息流偏好",
    route: "信息流",
    description: "让看山成长在这局轻补读牌和试锋，但不替代本局流派。",
    longTail: "偏读牌，偏规划。",
  },
  {
    id: "river",
    label: "河控偏好",
    route: "河控流",
    description: "让河道成长在这局轻补牌河和杠路，帮中后段更稳一点。",
    longTail: "偏控场，偏后段。",
  },
  {
    id: "tools",
    label: "道具偏好",
    route: "道具流",
    description: "让初始道具成长在这局轻补整理能力，坏手更容易接回来。",
    longTail: "偏修线，偏调整。",
  },
  {
    id: "survive",
    label: "救场偏好",
    route: "救场流",
    description: "让备用槽和护符成长在这局轻补容错，先把下限垫住。",
    longTail: "偏容错，偏长线。",
  },
];

const RUN_ARCHETYPES: RunArchetypeConfig[] = [
  {
    id: "chi",
    label: "吃流",
    summary: "顺手接顺子，靠节奏把卡槽转快。",
    startBonus: "更偏顺子与整手，适合前中段找节奏。",
    rewardBias: "更容易接顺路、吃牌和整手奖励。",
    routeLabel: "吃流",
  },
  {
    id: "peng",
    label: "碰流",
    summary: "对子更值钱，靠稳定推进压住中段。",
    startBonus: "更偏对子成型和稳手推进，适合中段压线。",
    rewardBias: "更容易接碰分、稳手和抗压奖励。",
    routeLabel: "碰流",
  },
  {
    id: "gang",
    label: "杠流",
    summary: "爆发更高，敢接高热度就能更快翻盘。",
    startBonus: "更偏杠路启动和牌河转压，适合高压局搏收益。",
    rewardBias: "更容易接杠分、河控和爆发奖励。",
    routeLabel: "杠流",
  },
  {
    id: "hu",
    label: "胡流",
    summary: "终局收口更强，适合把最后一刀做成主轴。",
    startBonus: "更偏胡牌分和终局兑现，适合后段收口。",
    rewardBias: "更容易接胡分、胡钱和封尾奖励。",
    routeLabel: "胡流",
  },
  {
    id: "tool",
    label: "道具流",
    summary: "修手和救线更稳，坏手也更容易补回来。",
    startBonus: "更偏洗牌、撤回和丢弃，适合整手和转线。",
    rewardBias: "更容易接整理工具和节奏修复奖励。",
    routeLabel: "道具流",
  },
  {
    id: "vision",
    label: "信息流",
    summary: "先读山再落刀，把看见的线尽快兑现。",
    startBonus: "更偏看山和试锋，适合读牌后做决策。",
    rewardBias: "更容易接看山、试锋和读口奖励。",
    routeLabel: "信息流",
  },
];

const RUN_ARCHETYPE_UNLOCKS: RunArchetypeUnlock[] = [
  { id: "chi", unlockAtMainline: 1, recommendedUntilMainline: 4 },
  { id: "peng", unlockAtMainline: 1, recommendedUntilMainline: 6 },
  { id: "gang", unlockAtMainline: 3, recommendedUntilMainline: 10 },
  { id: "hu", unlockAtMainline: 6, recommendedUntilMainline: 20 },
  { id: "tool", unlockAtMainline: 9, recommendedUntilMainline: 20 },
  { id: "vision", unlockAtMainline: 13, recommendedUntilMainline: 20 },
];

const ENDLESS_CHAPTER_THEMES: EndlessChapterPreview[] = [
  { label: "护河起章", bossTitle: "章节 Boss · 河灯守门人", theme: "护河起章", detail: "先考弃牌、河控和前段稳手，别让开局就被牌河反噬。", routeHint: "更适合先走河控流或救场流，把前段空间站稳。", rewardFocus: "优先追河道扩容、丢弃工具和稳手类奖励。", bossPressure: "章节 Boss 先查牌河和弃牌节奏，顶不住的话会很早漏口。" },
  { label: "封盘中继", bossTitle: "章节 Boss · 封盘押局者", theme: "封盘中继", detail: "开始强调中段锁口和工具分配，路线开始要成线。", routeHint: "更适合道具流或信息流，把中段整理和读口接到一起。", rewardFocus: "优先追洗牌、撤回、看山和中段整手奖励。", bossPressure: "章节 Boss 会看你有没有把中段路线接成线，而不是一直零碎补洞。" },
  { label: "高压试锋", bossTitle: "章节 Boss · 险招翻倍客", theme: "高压试锋", detail: "收益会变肥，但 Boss 也更逼你把风险兑现成真正推进。", routeHint: "更适合信息流或胡流，敢拿高奖就要敢把爆发收出来。", rewardFocus: "优先追高分胡、看山和试锋类事件奖励。", bossPressure: "章节 Boss 会逼你把高风险奖励变成真实推进，不接受只拿不收。" },
  { label: "牌尾收束", bossTitle: "章节 Boss · 断幺巡山将", theme: "牌尾收束", detail: "后段开始考牌尾、收线和最后一口，不再只靠中段堆分。", routeHint: "更适合胡流或道具流，把后半程的收口件尽量扣满。", rewardFocus: "优先追胡钱、胡分、丢弃和尾巡整理奖励。", bossPressure: "章节 Boss 会看你能不能把后段残手收掉，拖进残局就会被放大。" },
  { label: "听口死斗", bossTitle: "章节 Boss · 听牌封潮手", theme: "听口死斗", detail: "开始要求把听口、收胡和后段容错并到同一步里。", routeHint: "更适合信息流或救场流，把读口和容错捏成同一步。", rewardFocus: "优先追看山、护符、尾口和试锋类奖励。", bossPressure: "章节 Boss 会同时查读口和容错，少一边都会在后段掉节奏。" },
  { label: "杠潮终局", bossTitle: "章节 Boss · 杠火压尾官", theme: "杠潮终局", detail: "杠流和压尾会一起抬高，后段要能把热度收成结果。", routeHint: "更适合河控流或胡流，把杠路爆发和终局收口绑在一起。", rewardFocus: "优先追杠分、胡分、河控和后段收束奖励。", bossPressure: "章节 Boss 会逼你把高热度杠路收成结果，不然越打越烫手。" },
  { label: "续押回账", bossTitle: "章节 Boss · 回灯归账人", theme: "续押回账", detail: "资源线要开始回流，不能只会花奖励，不会把收益追回当前缺口。", routeHint: "更适合道具流或河控流，把资源线先回正，再补爆发。", rewardFocus: "优先追胡钱、工具回袋、河控和整手类奖励。", bossPressure: "章节 Boss 会查你有没有把前面吃到的收益真正追回来，不然会越打越空。" },
  { label: "封缺收官", bossTitle: "章节 Boss · 封缺落锁者", theme: "封缺收官", detail: "章节后段会更像最终盘，考的是把成型路线真正落成锁口结果。", routeHint: "更适合已经成型的主路线，别再分心转第二条轴。", rewardFocus: "优先追终局收口、看山、胡分和封尾类奖励。", bossPressure: "章节 Boss 更像长 run 的小终章，会直接查你这条路线到底能不能真正结账。" },
];

const DAILY_MUTATOR_PREVIEWS: DailyMutatorPreview[] = [
  { key: "river-pressure", label: "今日词缀：牌河压顶", detail: "前中段更容易遇到弃牌与河控压力，适合走稳手或河控路线。", rewardLabel: "今日奖励：河灯筹码", routeHint: "今日更适合河控流或救场流，先把空间顶住。", rewardFocus: "优先追河道扩容、丢弃工具和稳压奖励。", paceNote: "今天前中段会更紧，先稳空间，再谈后段爆发。" },
  { key: "late-sprint", label: "今日词缀：牌尾追击", detail: "残局节奏更紧，牌尾流和胡流更容易打出完整收官。", rewardLabel: "今日奖励：尾巡印记", routeHint: "今日更适合胡流或道具流，把后半程收口做厚。", rewardFocus: "优先追胡分、胡钱、丢弃和尾巡整理奖励。", paceNote: "今天后半程更凶，别把收口件拖到最后才补。" },
  { key: "kong-engine", label: "今日词缀：杠响回巡", detail: "杠相关机会更密集，适合拿路线奖励去追爆发。", rewardLabel: "今日奖励：杠响铜契", routeHint: "今日更适合河控流或胡流，把杠路热度转成爆发。", rewardFocus: "优先追杠分、河控、胡分和收口奖励。", paceNote: "今天越往后越要会收热度，不然杠路会把牌桌烧穿。" },
  { key: "vision-weave", label: "今日词缀：看山织线", detail: "信息流和试路更容易连成一线，适合走东风试路或西风照听的前后段接线。", rewardLabel: "今日奖励：织线签", routeHint: "今日更适合信息流，把看山和试锋一路扣紧。", rewardFocus: "优先追看山、洗牌、试锋和读口类奖励。", paceNote: "今天更像读牌局，看到线以后要尽快兑现，不要只停在观察。" },
  { key: "rescue-cache", label: "今日词缀：余槽救场", detail: "中段容错和救场收益更吃香，适合把余槽、护符和翻袋续命一路滚起来。", rewardLabel: "今日奖励：回袋符", routeHint: "今日更适合救场流，先把容错墙垫厚，再尽快补整手和回账件。", rewardFocus: "优先追整手、胡钱、丢弃和补位转收口奖励。", paceNote: "今天中段容错值钱，但拿到厚度以后要尽快把它换成收口件。" },
  { key: "wall-bulwark", label: "今日词缀：挡墙续押", detail: "续墙、挡墙和封尾路线更稳，适合把南风续押和北风压台拖成整套厚墙。", rewardLabel: "今日奖励：墙脉铜牌", routeHint: "今日更适合救场流或信息流，把厚墙和读口接起来，再顺手回账。", rewardFocus: "优先追看山、续墙、整手和封尾转收口奖励。", paceNote: "今天会更像耐压局，先把墙立住，但中后段要开始把稳台换成真正推进。" },
  { key: "odds-burn", label: "今日词缀：押线点火", detail: "更容易摸到试锋、压注和收账线，适合把西风后段一路烧到终局。", rewardLabel: "今日奖励：点火铜签", routeHint: "今日更适合信息流或胡流，把试锋收益直接烧到终章。", rewardFocus: "优先追看山、胡钱、高压试锋和收账类奖励。", paceNote: "今天节奏是先试锋再收账，越晚越要敢把线点燃。" },
  { key: "lock-tail", label: "今日词缀：封尾落锁", detail: "残局更容易转成封尾与死锁手感，适合把北风收官和救场墙扣到一起。", rewardLabel: "今日奖励：尾锁牌印", routeHint: "今日更适合救场流或道具流，把残局封口做成整套，再把最后一口补成结果。", rewardFocus: "优先追丢弃、胡钱、封尾和终局锁口奖励。", paceNote: "今天的关键在后半程封尾，前段别把容错浪费在无意义的小修补上。" },
];

const ACHIEVEMENTS: AchievementConfig[] = [
  {
    id: "mainline-first-clear",
    title: "主线首通",
    description: "完成一轮主线通关。",
    hint: "把 20 关主线打穿一次。",
    group: "mainline",
  },
  {
    id: "mainline-master",
    title: "主线熟手",
    description: "主线结算时拿到至少 5 个奖励节点。",
    hint: "把整轮主线尽量完整地滚到后半段。",
    group: "mainline",
  },
  {
    id: "boss-hulebu-king",
    title: "胡了卜王",
    description: "击破第 20 关终章 Boss。",
    hint: "在主线终章拿下胡了卜王。",
    group: "boss",
  },
  {
    id: "boss-ascension-warden",
    title: "高阶镇台",
    description: "完成一轮高阶 Boss 通关。",
    hint: "去高阶周目完成一轮通关。",
    group: "boss",
    hidden: true,
    hiddenTitle: "未揭示目标",
    hiddenHint: "继续推进 Boss 纪录和高阶试炼。",
  },
  {
    id: "endless-first-step",
    title: "无尽起步",
    description: "首次进入无尽牌山。",
    hint: "把无尽面板点开并打到第 21 层起步。",
    group: "endless",
  },
  {
    id: "endless-layer-25",
    title: "冲到 25 层",
    description: "无尽最高层达到第 25 层。",
    hint: "继续往后冲到第 25 层。",
    group: "endless",
  },
  {
    id: "endless-layer-40",
    title: "冲到 40 层",
    description: "无尽最高层达到第 40 层。",
    hint: "继续把长 run 推进到第 40 层，看看后段章节能不能稳住。",
    group: "endless",
  },
  {
    id: "daily-first-checkin",
    title: "每日打卡",
    description: "第一次挑战每日牌局。",
    hint: "今天先开一局每日。",
    group: "daily",
  },
  {
    id: "daily-clear",
    title: "每日完成",
    description: "任意一天完成过每日牌局。",
    hint: "把当天的每日打穿一次。",
    group: "daily",
  },
  {
    id: "daily-streak-7",
    title: "连到 7 天",
    description: "每日连续参与达到 7 天。",
    hint: "连续来 7 天，把每日牌局真正养成回访节奏。",
    group: "daily",
  },
  {
    id: "upgrade-first-buy",
    title: "第一次升级",
    description: "买下任意一项局外升级。",
    hint: "先花一次铜钱。",
    group: "upgrades",
  },
  {
    id: "upgrade-all-basic",
    title: "三项全开",
    description: "三项基础升级都至少买过 1 级。",
    hint: "把备用槽、护符和初始道具都点到 1 级。",
    group: "upgrades",
  },
  {
    id: "upgrade-all-six",
    title: "六轴全开",
    description: "六条局外成长轴都至少买过 1 级。",
    hint: "把备用槽、护符、初始道具、河道扩容、开局铜钱和看山预置都点亮。",
    group: "upgrades",
  },
  {
    id: "ascension-west-clear",
    title: "西风立住",
    description: "把高阶推进到西风场并完成过结算。",
    hint: "先把高阶周目推进到第三档。",
    group: "ascension",
  },
  {
    id: "ascension-north-clear",
    title: "北风入局",
    description: "解锁北风场，摸到完整高阶轮回门槛。",
    hint: "继续往北风场推进，完整高阶才刚开始。",
    group: "ascension",
    hidden: true,
    hiddenTitle: "未揭示目标",
    hiddenHint: "继续推进高阶征途。",
  },
  {
    id: "event-rare-encounter",
    title: "稀有事件",
    description: "经历过一次带稀有事件标记的结算。",
    hint: "在主线或长 run 中继续碰稀有事件。",
    group: "events",
  },
  {
    id: "event-ascension-encounter",
    title: "高阶事件",
    description: "在高阶 run 中带着事件摘要结算。",
    hint: "去高阶周目再看看事件池会给你什么。",
    group: "events",
    hidden: true,
    hiddenTitle: "未揭示目标",
    hiddenHint: "继续推进事件见闻。",
  },
  {
    id: "build-reward-streak",
    title: "路线收束",
    description: "单轮结算时拿到至少 4 个奖励节点，开始像一套完整 build。",
    hint: "把奖励一路吃到后半程，让构筑真正成型。",
    group: "builds",
  },
  {
    id: "route-focus-mastered",
    title: "路线挂满",
    description: "把任意一条路线挂到满档。",
    hint: "把胡流、信息流、河控流、道具流或救场流里的任意一条真正点满。",
    group: "builds",
  },
];

const ACHIEVEMENT_GROUPS: Array<{
  id: AchievementGroup;
  label: string;
  description: string;
}> = [
  {
    id: "mainline",
    label: "主线碑记",
    description: "记录通关和完整主线推进。",
  },
  {
    id: "boss",
    label: "Boss 纪录",
    description: "记录终章与高阶 Boss 的试炼结果。",
  },
  {
    id: "endless",
    label: "无尽牌山",
    description: "记录冲层和长线推进。",
  },
  {
    id: "daily",
    label: "每日留痕",
    description: "记录今天是否来过，以及是否打穿。",
  },
  {
    id: "upgrades",
    label: "局外积累",
    description: "记录铜钱是否开始变成长期成长。",
  },
  {
    id: "ascension",
    label: "高阶征途",
    description: "记录周目推进到第几档。",
  },
  {
    id: "events",
    label: "事件见闻",
    description: "记录你是否已经摸到更深层事件池。",
  },
  {
    id: "builds",
    label: "路线收束",
    description: "记录单轮构筑是否已经像一套完整 build。",
  },
];

const ASCENSION_CONFIGS: AscensionConfig[] = [
  {
    level: 1,
    name: "东风场",
    description: "通关后的第一档高阶轮回，先把主线打熟，再开始加压。",
    modifiers: ["奖励铜钱略减", "Boss 目标更紧", "牌山更密一点"],
    perkSlots: 1,
    identity: "先学会在轻压下读 Boss 目标和事件风向。",
    buildAngle: "稳手、顺路、起手顺风",
    contentFocus: "东风更像试手档，重点是把 build 起手和目标线接顺。",
  },
  {
    level: 2,
    name: "南风场",
    description: "在第一档之上再加一点限制，开始出现更明显的高阶味道。",
    modifiers: ["禁洗牌", "起始道具 -1", "高压模板更常见"],
    perkSlots: 1,
    identity: "开始逼你靠容错和偏门奖励活过中段。",
    buildAngle: "稳压、封盘、偏门换气",
    contentFocus: "南风更像续押档，重点是容错墙和贪收益路线能不能一起成立。",
  },
  {
    level: 3,
    name: "西风场",
    description: "高阶配置开始真正成型，外层可装备能力会开始影响整轮手感。",
    modifiers: ["奖励池更偏能力", "连胜压力更明显", "高压关卡更密"],
    perkSlots: 2,
    identity: "开始要求你主动围绕 build 选事件、选奖励、对齐 Boss 缺口。",
    buildAngle: "试锋、收官、信息压线",
    contentFocus: "西风更像成型档，重点是 build identity 和目标彩排能不能提前对齐。",
  },
  {
    level: 4,
    name: "北风场",
    description: "完整高阶轮回，外层能力和内层奖励都会一起压到位。",
    modifiers: ["外层能力槽上限提升", "高阶奖励池全开", "Boss 压力最大"],
    perkSlots: 3,
    identity: "完整死斗档，要把能力、事件、奖励和终局爆发接成整套线。",
    buildAngle: "封终、迟火、河杠、牌尾死斗",
    contentFocus: "北风更像完整 build 档，重点是专属奖励链和终局收刀手感。",
  },
];

const ASCENSION_PERKS: AscensionPerkConfig[] = [
  {
    id: "steady-hand",
    label: "稳手",
    description: "开局额外补 1 次撤回，适合稳住高阶开局。",
    unlockLevel: 1,
  },
  {
    id: "reserve-flow",
    label: "余槽",
    description: "起始备用位 +1，让高阶周目的容错更厚一点。",
    unlockLevel: 2,
  },
  {
    id: "storm-guard",
    label: "风盾",
    description: "高阶牌局里多送 1 次护符，更容易顶住终局压力。",
    unlockLevel: 3,
  },
  {
    id: "lucky-route",
    label: "顺路",
    description: "高阶奖励更容易拿到路线型收益，适合追 build。",
    unlockLevel: 4,
  },
  {
    id: "river-sense",
    label: "河眼",
    description: "更擅长处理牌河与弃牌节奏，适合稳压和救场流。",
    unlockLevel: 3,
  },
  {
    id: "kong-engine",
    label: "杠擎",
    description: "高阶杠流更容易成型，适合把后半程拉成爆发节奏。",
    unlockLevel: 4,
  },
  {
    id: "trial-sight",
    label: "试锋",
    description: "开局补 1 次看山，更容易提早接上试炼目标和信息流。",
    unlockLevel: 3,
  },
  {
    id: "deadwall-cache",
    label: "牌尾",
    description: "开局补 1 次丢弃，更擅长处理残局和收官节奏。",
    unlockLevel: 4,
  },
  {
    id: "seal-table",
    label: "封盘",
    description: "北风场额外补 1 次护符，开局更能顶住封台压力。",
    unlockLevel: 4,
  },
  {
    id: "late-flare",
    label: "迟火",
    description: "北风场把胡流再抬一档，更容易在终局翻成爆发。",
    unlockLevel: 4,
  },
];

const ASCENSION_PERK_LABELS = Object.fromEntries(
  ASCENSION_PERKS.map((perk) => [perk.id, perk.label] as const),
) as Record<AscensionPerkId, string>;

function sanitizeUpgrades(upgrades?: Partial<UpgradeState> | null): UpgradeState {
  return {
    reserve: Math.max(0, Math.min(2, Number(upgrades?.reserve) || 0)),
    shield: Math.max(0, Math.min(2, Number(upgrades?.shield) || 0)),
    tools: Math.max(0, Math.min(2, Number(upgrades?.tools) || 0)),
    river: Math.max(0, Math.min(2, Number(upgrades?.river) || 0)),
    coins: Math.max(0, Math.min(2, Number(upgrades?.coins) || 0)),
    vision: Math.max(0, Math.min(2, Number(upgrades?.vision) || 0)),
  };
}

function getRouteFocusMasteryLevel(focusId: RouteFocusId, upgrades: UpgradeState) {
  if (focusId === "hu") return Math.max(0, Math.min(2, upgrades.coins));
  if (focusId === "info") return Math.max(0, Math.min(2, upgrades.vision));
  if (focusId === "river") return Math.max(0, Math.min(2, upgrades.river));
  if (focusId === "tools") return Math.max(0, Math.min(2, upgrades.tools));
  if (focusId === "survive") {
    if (upgrades.reserve >= 2 || upgrades.shield >= 2 || upgrades.reserve + upgrades.shield >= 3) return 2;
    if (upgrades.reserve > 0 || upgrades.shield > 0) return 1;
  }
  return 0;
}

function getPreferredRouteProgress(upgrades: UpgradeState, selectedRouteFocus: RouteFocusId) {
  if (selectedRouteFocus !== "auto") {
    const selectedConfig = ROUTE_FOCUS_CONFIGS.find((item) => item.id === selectedRouteFocus) ?? ROUTE_FOCUS_CONFIGS[0];
    return {
      focusId: selectedConfig.id,
      focusLabel: selectedConfig.label,
      preferredRoute: selectedConfig.route,
      routeMasteryLevel: getRouteFocusMasteryLevel(selectedConfig.id, upgrades),
    };
  }
  const routeCandidates = [
    {
      focusId: "survive" as const,
      focusLabel: "自动偏好 · 救场流",
      route: "救场流",
      score: upgrades.reserve + upgrades.shield,
      mastery:
        upgrades.reserve > 0 && upgrades.shield > 0
          ? 1 + Number(upgrades.reserve >= 2 || upgrades.shield >= 2)
          : Math.max(upgrades.reserve, upgrades.shield) > 0
            ? 1
            : 0,
    },
    { focusId: "tools" as const, focusLabel: "自动偏好 · 道具流", route: "道具流", score: upgrades.tools, mastery: upgrades.tools },
    { focusId: "river" as const, focusLabel: "自动偏好 · 河控流", route: "河控流", score: upgrades.river, mastery: upgrades.river },
    { focusId: "hu" as const, focusLabel: "自动偏好 · 胡流", route: "胡流", score: upgrades.coins, mastery: upgrades.coins },
    { focusId: "info" as const, focusLabel: "自动偏好 · 信息流", route: "信息流", score: upgrades.vision, mastery: upgrades.vision },
  ] as const;
  const strongest = routeCandidates.reduce((best, current) => (current.score > best.score ? current : best));
  if (strongest.score <= 0 || strongest.mastery <= 0) {
    return { focusId: "auto" as const, focusLabel: "自动偏好", preferredRoute: "", routeMasteryLevel: 0 };
  }
  return {
    focusId: strongest.focusId,
    focusLabel: strongest.focusLabel,
    preferredRoute: strongest.route,
    routeMasteryLevel: Math.max(0, Math.min(2, strongest.mastery)),
  };
}

function getRouteGrowthStatus(
  focusId: RouteFocusId,
  upgrades: UpgradeState,
  routeProgress: ReturnType<typeof getPreferredRouteProgress>,
): RouteGrowthStatus {
  const resolvedFocusId = focusId === "auto" ? routeProgress.focusId : focusId;
  const resolvedMastery =
    focusId === "auto" ? routeProgress.routeMasteryLevel : getRouteFocusMasteryLevel(resolvedFocusId, upgrades);

  if (resolvedFocusId === "auto" || resolvedMastery <= 0) {
    return {
      currentEffect: "还没挂出固定路线，先把任意一条长期成长轴点到 1 级。",
      nextTarget: "优先补一条想长期走的线，让开局偏置、奖励池和事件口味真正开始成形。",
    };
  }

  if (resolvedFocusId === "hu") {
    return {
      currentEffect: `胡流会轻补 ${resolvedMastery >= 2 ? 5 : 0} 铜钱，并把胡牌收口再推 ${resolvedMastery} 档。`,
      nextTarget:
        upgrades.coins >= 2
          ? "这一线已经满档，接下来更适合让本局流派去吃终局奖励和爆发节点。"
          : "再补 1 级开局铜钱，让这条线继续只做轻协同，不去抢本局主轴。",
    };
  }
  if (resolvedFocusId === "info") {
    return {
      currentEffect: `信息流会轻补 1 次看山，让试锋和 Boss 目标更早看清。`,
      nextTarget:
        upgrades.vision >= 2
          ? "这一线已经满档，接下来更适合用本局流派把读到的线兑现出来。"
          : "再补 1 级看山预置，让局外信息线保持轻协同，不抢本局身份。",
    };
  }
  if (resolvedFocusId === "river") {
    return {
      currentEffect: `河控流会轻补 ${resolvedMastery >= 2 ? 1 : 0} 档牌河，并把杠路再垫 ${resolvedMastery} 档。`,
      nextTarget:
        upgrades.river >= 2
          ? "这一线已经满档，接下来更适合把本局流派和河控收益接成一局。"
          : "再补 1 级河道扩容，让局外河控只做轻补，不替代本局打法。",
    };
  }
  if (resolvedFocusId === "tools") {
    return {
      currentEffect: `道具流会轻补 1 次丢弃，满档后再多补 1 次撤回。`,
      nextTarget:
        upgrades.tools >= 2
          ? "这一线已经满档，接下来更适合让本局流派吃掉整理后的顺手窗口。"
          : "再补 1 级初始道具，让这条线继续做整理协同，不去定义整局身份。",
    };
  }
  return {
    currentEffect: `救场流会轻补 1 次护符，满档后再多补 1 格备用槽。`,
    nextTarget:
      upgrades.reserve >= 2 || upgrades.shield >= 2 || upgrades.reserve + upgrades.shield >= 3
        ? "这一线已经满档，接下来更适合让本局流派去把厚出来的空间转成推进。"
        : "继续补备用槽或满槽护符，让这条线维持长期兜底，不去抢本局主轴。",
  };
}

function getRouteFocusPlaybook(
  focusId: RouteFocusId,
  routeProgress: ReturnType<typeof getPreferredRouteProgress>,
): RouteFocusPlaybook {
  const resolvedFocusId = focusId === "auto" ? routeProgress.focusId : focusId;

  if (resolvedFocusId === "hu") {
    return {
      rewardFocus: "优先追胡分、胡钱、看山和终局收口包，让最后一口真的能结账。",
      eventFocus: "更适合接顺路追胡、尾巡定局、北风封尾这类会把终局爆发抬起来的事件。",
      recommendedMode: "先打主线或每日，更容易在固定终章前把胡流滚成完整爆发。",
      lateGamePlan: "中后段别把奖励拆去第二条线，优先把胡流推进到能稳定斩尾的强度。",
    };
  }
  if (resolvedFocusId === "info") {
    return {
      rewardFocus: "优先追看山、洗牌、信息牌和照听类奖励，把读牌优势滚成稳定路线。",
      eventFocus: "更适合接灯下探牌、西风定口、试锋读口这类会提前暴露解法的事件。",
      recommendedMode: "先打每日或高阶，词缀和 Boss 目标更能放大信息流的价值。",
      lateGamePlan: "后半段把信息优势换成收口效率，别只会看牌，不会把读口兑现成推进。",
    };
  }
  if (resolvedFocusId === "river") {
    return {
      rewardFocus: "优先追杠分、河道扩容、丢弃工具和控河奖励，把弃牌节奏越滚越稳。",
      eventFocus: "更适合接河灯旧约、护河续押、杠河双响这类会把牌河压力转成收益的事件。",
      recommendedMode: "先打无尽或高阶，长 run 里河控流更容易把章节压力转成自己的节奏。",
      lateGamePlan: "后段核心不是保命，是把河道空间拿来换收束速度，尽量让每次弃牌都服务下一口。",
    };
  }
  if (resolvedFocusId === "tools") {
    return {
      rewardFocus: "优先追丢弃、撤回、洗牌和整理类奖励，让坏手修线能力先站稳。",
      eventFocus: "更适合接封盘押后、险招翻倍、整理回袋这类会逼你重排节奏的事件。",
      recommendedMode: "先打主线后半程或每日，比较容易看出道具流到底是在救火还是已经开始赚钱。",
      lateGamePlan: "中后段要把工具从纯救场转成主动整手，别一直把道具花在补漏洞上。",
    };
  }
  if (resolvedFocusId === "survive") {
    return {
      rewardFocus: "优先追备用槽、护符、残局缓冲和补位类奖励，把容错厚度先垫满。",
      eventFocus: "更适合接南风续墙、北风封火、稳压续命这类会持续顶压的事件。",
      recommendedMode: "先打无尽或高阶，高压模式里最容易看出救场流能不能真的把 run 扛长。",
      lateGamePlan: "后段别只继续叠盾，容错厚度够了以后要开始补收官件，不然很容易拖到最后也收不掉。",
    };
  }
  return {
    rewardFocus: "先把任意一条长期成长轴点到 1 级，系统才会开始稳定偏向那条路线的奖励。",
    eventFocus: "还在自动偏好阶段，事件会先按当前最深成长轴轻量偏置，不会强行锁死。",
    recommendedMode: "先打一轮主线或每日，把第一条长期线点亮，再来看哪条 build 真正顺手。",
    lateGamePlan: "自动偏好更适合探路，真想把内容滚深，还是尽快选一条长期线去持续追。",
  };
}

function getRunArchetypeConfig(archetypeId: RunArchetypeId) {
  return RUN_ARCHETYPES.find((item) => item.id === archetypeId) ?? RUN_ARCHETYPES[0];
}

function getRunArchetypeAvailability(
  archetypeId: RunArchetypeId,
  panel: LobbyPanel,
  highestMainlineOrder: number,
) {
  const unlock = RUN_ARCHETYPE_UNLOCKS.find((item) => item.id === archetypeId);
  const unlockAt = unlock?.unlockAtMainline ?? 1;
  const recommendedUntil = unlock?.recommendedUntilMainline ?? 20;
  if (panel !== "mainline" || highestMainlineOrder >= 20) {
    return {
      disabled: false,
      label: "20 关后自由选择",
      detail: "20 关后自由选择，也会用于无尽、每日和高阶开局。",
    };
  }
  if (highestMainlineOrder + 1 < unlockAt) {
    return {
      disabled: true,
      label: `第 ${unlockAt} 关引导解锁`,
      detail: `前 20 关会逐步开放流派，这条先在第 ${unlockAt} 关教学后再放开。`,
    };
  }
  return {
    disabled: false,
    label: highestMainlineOrder + 1 <= recommendedUntil ? "前 20 关推荐" : "前 20 关可选",
    detail: "前 20 关推荐按教学节奏逐步试流派，通关后再完全自由。",
  };
}

function hashDailySeed(seed: string) {
  let hash = 0;
  for (const char of String(seed)) hash = (hash * 33 + char.charCodeAt(0)) % 2147483647;
  return hash;
}

function getDailyMutatorPreview(seed: string) {
  return DAILY_MUTATOR_PREVIEWS[hashDailySeed(seed) % DAILY_MUTATOR_PREVIEWS.length];
}

function getEndlessChapterPreview(layer: number) {
  const chapter = Math.max(1, Math.floor((Math.max(layer, ENDLESS_START_LAYER) - ENDLESS_START_LAYER) / 5) + 1);
  return ENDLESS_CHAPTER_THEMES[(chapter - 1) % ENDLESS_CHAPTER_THEMES.length];
}

function buildRunFrameSrc(
  sessionKey: string,
  upgrades: UpgradeState,
  selectedRouteFocus: RouteFocusId,
  runArchetype: RunArchetypeId,
  resumeLevelOrder?: number,
) {
  const routeProgress = getPreferredRouteProgress(upgrades, selectedRouteFocus);
  const params = new URLSearchParams({
    embed: "shell",
    session: sessionKey,
    runArchetype,
    reserveBonus: String(upgrades.reserve),
    shieldBonus: String(upgrades.shield),
    toolBonus: String(upgrades.tools),
    riverBonus: String(upgrades.river),
    coinBonus: String(upgrades.coins * 20),
    visionBonus: String(upgrades.vision),
    preferredRoute: routeProgress.preferredRoute,
    routeMasteryLevel: String(routeProgress.routeMasteryLevel),
  });
  if (resumeLevelOrder && resumeLevelOrder > 1) params.set("level", String(resumeLevelOrder));
  return `${FRAME_BASE}?${params.toString()}`;
}

function buildEndlessFrameSrc(
  sessionKey: string,
  upgrades: UpgradeState,
  selectedRouteFocus: RouteFocusId,
  runArchetype: RunArchetypeId,
  resumeEndlessLayer?: number,
) {
  const routeProgress = getPreferredRouteProgress(upgrades, selectedRouteFocus);
  const params = new URLSearchParams({
    embed: "shell",
    session: sessionKey,
    mode: "endless",
    startLayer: String(resumeEndlessLayer ?? ENDLESS_START_LAYER),
    runArchetype,
    reserveBonus: String(upgrades.reserve),
    shieldBonus: String(upgrades.shield),
    toolBonus: String(upgrades.tools),
    riverBonus: String(upgrades.river),
    coinBonus: String(upgrades.coins * 20),
    visionBonus: String(upgrades.vision),
    preferredRoute: routeProgress.preferredRoute,
    routeMasteryLevel: String(routeProgress.routeMasteryLevel),
  });
  return `${FRAME_BASE}?${params.toString()}`;
}

function buildDailyFrameSrc(
  sessionKey: string,
  upgrades: UpgradeState,
  selectedRouteFocus: RouteFocusId,
  dailySeed: string,
  runArchetype: RunArchetypeId,
  resumeLevelOrder?: number,
) {
  const routeProgress = getPreferredRouteProgress(upgrades, selectedRouteFocus);
  const params = new URLSearchParams({
    embed: "shell",
    session: sessionKey,
    mode: "daily",
    dailySeed,
    runArchetype,
    reserveBonus: String(upgrades.reserve),
    shieldBonus: String(upgrades.shield),
    toolBonus: String(upgrades.tools),
    riverBonus: String(upgrades.river),
    coinBonus: String(upgrades.coins * 20),
    visionBonus: String(upgrades.vision),
    preferredRoute: routeProgress.preferredRoute,
    routeMasteryLevel: String(routeProgress.routeMasteryLevel),
  });
  if (resumeLevelOrder && resumeLevelOrder > 1) params.set("level", String(resumeLevelOrder));
  return `${FRAME_BASE}?${params.toString()}`;
}

function createSessionKey() {
  return `run-${Date.now()}`;
}

function getTodayDailySeed() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sanitizeDailyBestLevels(levels?: Record<string, unknown> | null) {
  const entries = Object.entries(levels ?? {}).flatMap(([seed, value]) => {
    const numericValue = Number(value);
    if (!seed || !Number.isFinite(numericValue)) return [];
    return [[seed, Math.max(0, numericValue)] as const];
  });
  return Object.fromEntries(entries);
}

function sanitizeAchievements(achievements?: Record<string, unknown> | null) {
  return Object.fromEntries(
    Object.entries(achievements ?? {}).flatMap(([id, value]) => {
      if (!id || typeof value !== "string" || !value) return [];
      return [[id, value] as const];
    }),
  );
}

function sanitizeAscensionLevel(value?: unknown) {
  const numeric = Number(value);
  if (numeric >= 4) return 4;
  if (numeric >= 3) return 3;
  if (numeric >= 2) return 2;
  if (numeric >= 1) return 1;
  return DEFAULT_ASCENSION_LEVEL;
}

function sanitizeAscensionLoadout(loadout?: unknown) {
  if (!Array.isArray(loadout)) return [];
  const allowed = new Set(ASCENSION_PERKS.map((perk) => perk.id));
  return loadout.flatMap((item) => (typeof item === "string" && allowed.has(item as AscensionPerkId) ? [item as AscensionPerkId] : []));
}

function sanitizeUnlockedAscensionPerks(perks?: Record<string, unknown> | null) {
  const allowed = new Set(ASCENSION_PERKS.map((perk) => perk.id));
  return Object.fromEntries(
    Object.entries(perks ?? {}).flatMap(([perkId, value]) =>
      allowed.has(perkId as AscensionPerkId) && Boolean(value) ? [[perkId as AscensionPerkId, true] as const] : [],
    ),
  ) as Partial<Record<AscensionPerkId, boolean>>;
}

function sanitizeActiveRunResume(input: unknown): ActiveRunResumeState | null {
  if (!input || typeof input !== "object") return null;
  const resume = input as Partial<ActiveRunResumeState>;
  if (typeof resume.sessionKey !== "string" || !resume.sessionKey) return null;
  if (typeof resume.updatedAt !== "string" || Number.isNaN(Date.parse(resume.updatedAt))) return null;
  return {
    sessionKey: resume.sessionKey,
    runMode: sanitizeRunMode(resume.runMode),
    runArchetype: sanitizeRunArchetype(resume.runArchetype),
    ascensionLevel: resume.ascensionLevel ? sanitizeAscensionLevel(resume.ascensionLevel) : null,
    ascensionName: typeof resume.ascensionName === "string" && resume.ascensionName ? resume.ascensionName : null,
    ascensionPerks: sanitizeAscensionLoadout(resume.ascensionPerks),
    dailySeed: typeof resume.dailySeed === "string" && resume.dailySeed ? resume.dailySeed : null,
    latestCoins: Math.max(0, Number.isFinite(resume.latestCoins) ? Number(resume.latestCoins) : 0),
    latestScore: Math.max(0, Number.isFinite(resume.latestScore) ? Number(resume.latestScore) : 0),
    latestLevelOrder: Math.max(1, Number.isFinite(resume.latestLevelOrder) ? Number(resume.latestLevelOrder) : 1),
    latestEndlessLayer: Math.max(
      ENDLESS_START_LAYER,
      Number.isFinite(resume.latestEndlessLayer) ? Number(resume.latestEndlessLayer) : ENDLESS_START_LAYER,
    ),
    latestSummary: typeof resume.latestSummary === "string" ? resume.latestSummary : "",
    pickedRewards: Math.max(0, Number.isFinite(resume.pickedRewards) ? Number(resume.pickedRewards) : 0),
    updatedAt: resume.updatedAt,
  };
}

function chooseLatestActiveRunResume(
  localActiveRun: ActiveRunResumeState | null,
  remoteActiveRun: ActiveRunResumeState | null,
) {
  if (!localActiveRun) return remoteActiveRun;
  if (!remoteActiveRun) return localActiveRun;
  return Date.parse(localActiveRun.updatedAt) >= Date.parse(remoteActiveRun.updatedAt) ? localActiveRun : remoteActiveRun;
}

function sanitizeRunMode(value?: unknown): RunMode {
  return value === "endless" || value === "daily" || value === "mainline" ? value : "mainline";
}

function sanitizeRunArchetype(value?: unknown): RunArchetypeId {
  return RUN_ARCHETYPES.some((archetype) => archetype.id === value) ? (value as RunArchetypeId) : "chi";
}

function toActiveRunResumeState(activeRun: ActiveRun): ActiveRunResumeState {
  return {
    sessionKey: activeRun.sessionKey,
    runMode: activeRun.runMode,
    runArchetype: activeRun.runArchetype,
    ascensionLevel: activeRun.ascensionLevel,
    ascensionName: activeRun.ascensionName,
    ascensionPerks: activeRun.ascensionPerks,
    dailySeed: activeRun.dailySeed,
    latestCoins: activeRun.latestCoins,
    latestScore: activeRun.latestScore,
    latestLevelOrder: activeRun.latestLevelOrder,
    latestEndlessLayer: activeRun.latestEndlessLayer,
    latestSummary: activeRun.latestSummary,
    pickedRewards: activeRun.pickedRewards,
    updatedAt: new Date().toISOString(),
  };
}

function restoreActiveRunFromPersistedState(
  persisted: PersistedShellState,
  upgrades: UpgradeState,
  selectedRouteFocus: RouteFocusId,
): ActiveRun | null {
  const resume = persisted.activeRun;
  if (!resume?.sessionKey) return null;
  const runMode = sanitizeRunMode(resume.runMode);
  const runArchetype = sanitizeRunArchetype(resume.runArchetype);
  const latestLevelOrder = Math.max(1, Number.isFinite(resume.latestLevelOrder) ? Number(resume.latestLevelOrder) : 1);
  const latestEndlessLayer = Math.max(
    ENDLESS_START_LAYER,
    Number.isFinite(resume.latestEndlessLayer) ? Number(resume.latestEndlessLayer) : ENDLESS_START_LAYER,
  );
  const latestCoins = Math.max(0, Number.isFinite(resume.latestCoins) ? Number(resume.latestCoins) : 0);
  const latestScore = Math.max(0, Number.isFinite(resume.latestScore) ? Number(resume.latestScore) : 0);
  const pickedRewards = Math.max(0, Number.isFinite(resume.pickedRewards) ? Number(resume.pickedRewards) : 0);
  const ascensionLevel = resume.ascensionLevel ? sanitizeAscensionLevel(resume.ascensionLevel) : null;
  const ascensionName =
    ascensionLevel
      ? resume.ascensionName ?? ASCENSION_CONFIGS.find((item) => item.level === ascensionLevel)?.name ?? null
      : null;
  const ascensionPerks = sanitizeAscensionLoadout(resume.ascensionPerks).slice(0, ascensionLevel ? getAscensionPerkSlots(ascensionLevel) : 0);
  const dailySeed = runMode === "daily" ? resume.dailySeed || getTodayDailySeed() : null;
  const iframeSrc = ascensionLevel
    ? buildAscensionFrameSrc(resume.sessionKey, upgrades, selectedRouteFocus, runArchetype, ascensionLevel, ascensionPerks, latestLevelOrder)
    : runMode === "endless"
      ? buildEndlessFrameSrc(resume.sessionKey, upgrades, selectedRouteFocus, runArchetype, latestEndlessLayer)
      : runMode === "daily"
        ? buildDailyFrameSrc(resume.sessionKey, upgrades, selectedRouteFocus, dailySeed ?? getTodayDailySeed(), runArchetype, latestLevelOrder)
        : buildRunFrameSrc(resume.sessionKey, upgrades, selectedRouteFocus, runArchetype, latestLevelOrder);

  return {
    sessionKey: resume.sessionKey,
    runMode,
    runArchetype,
    ascensionLevel,
    ascensionName,
    ascensionPerks,
    dailySeed,
    iframeSrc,
    latestCoins,
    latestScore,
    latestLevelOrder,
    latestEndlessLayer,
    latestSummary:
      typeof resume.latestSummary === "string" && resume.latestSummary
        ? resume.latestSummary
        : runMode === "endless"
          ? `无尽第 ${latestEndlessLayer} 层`
          : ascensionName
            ? `${ascensionName} 第 ${latestLevelOrder} 关`
            : runMode === "daily"
              ? `每日 ${dailySeed ?? getTodayDailySeed()} · 第 ${latestLevelOrder} 关`
              : `第 ${latestLevelOrder} 关`,
    pickedRewards,
  };
}

function getAscensionPerkSlots(level: AscensionLevel) {
  return ASCENSION_CONFIGS.find((item) => item.level === level)?.perkSlots ?? 1;
}

function summarizeAscensionBuild(perks: AscensionPerkId[]) {
  const perkIds = [...perks].sort().join("+");
  if (perkIds === "late-flare+seal-table") return "封终流";
  if (perkIds === "deadwall-cache+seal-table") return "封尾流";
  if (perkIds === "late-flare+trial-sight") return "试火流";
  if (perkIds === "deadwall-cache+late-flare") return "迟尾流";
  if (perkIds === "deadwall-cache+trial-sight") return "收官流";
  if (perkIds === "lucky-route+steady-hand") return "顺手胡流";
  if (perkIds === "reserve-flow+storm-guard") return "救场流";
  if (perkIds === "kong-engine+river-sense") return "河杠流";
  if (perks.includes("seal-table")) return "封盘流";
  if (perks.includes("late-flare")) return "迟火流";
  if (perks.includes("trial-sight")) return "试炼流";
  if (perks.includes("deadwall-cache")) return "牌尾流";
  if (perks.includes("kong-engine")) return "杠流";
  if (perks.includes("river-sense")) return "河控流";
  if (perks.includes("lucky-route")) return "路线流";
  if (perks.includes("storm-guard") || perks.includes("reserve-flow")) return "稳压流";
  if (perks.includes("steady-hand")) return "稳手流";
  return perks.length > 0 ? "混合流" : "未成型";
}

function describeAscensionBuildFocus(perks: AscensionPerkId[]) {
  const build = summarizeAscensionBuild(perks);
  if (build === "顺手胡流") {
    return {
      build,
      keyGain: "更容易把高阶奖励滚成顺手胡节奏。",
      nextTip: "继续追胡流和路线奖励，让后半程更顺。",
    };
  }
  if (build === "救场流") {
    return {
      build,
      keyGain: "容错和护符更厚，适合先撑住高压局。",
      nextTip: "下一轮优先补奖励效率，别只堆容错。",
    };
  }
  if (build === "收官流") {
    return {
      build,
      keyGain: "残局整理和试炼接目标都更顺，后半段很像独立套路。",
      nextTip: "继续追牌尾和试炼奖励链，把北风场拉成完整收官 build。",
    };
  }
  if (build === "封终流") {
    return {
      build,
      keyGain: "封盘护符和迟火胡流接在一起，北风场会更像最终档。",
      nextTip: "继续追封终迟火奖励，把护符缓冲换成终局爆发。",
    };
  }
  if (build === "封尾流") {
    return {
      build,
      keyGain: "封盘护符和牌尾整理连在一起，失败前会多一层残局缓冲。",
      nextTip: "继续追封尾闭门奖励，把护符保命转成牌尾收官。",
    };
  }
  if (build === "试火流") {
    return {
      build,
      keyGain: "试锋信息和迟火胡流叠在一起，更容易把 Boss 缺口提前看清。",
      nextTip: "继续追试火开锋奖励，让目标预判直接变成胡流爆发。",
    };
  }
  if (build === "迟尾流") {
    return {
      build,
      keyGain: "牌尾整理会把迟火爆发拖到最后一口，北风场更有翻盘感。",
      nextTip: "继续追迟尾燃尽奖励，把残局丢弃和终局胡流接起来。",
    };
  }
  if (build === "封盘流") {
    return {
      build,
      keyGain: "开局封盘和终局护符更厚，北风场的压力更像死斗。",
      nextTip: "继续补牌尾或迟火，把封盘转成终结 build。",
    };
  }
  if (build === "迟火流") {
    return {
      build,
      keyGain: "胡流会在后半程继续加温，更适合北风场的终局收刀。",
      nextTip: "继续补试锋或牌尾，让爆发和收官一起到位。",
    };
  }
  if (build === "河杠流") {
    return {
      build,
      keyGain: "牌河控制和杠爆发开始形成联动。",
      nextTip: "继续追事件和奖励链，把河杠连锁拉满。",
    };
  }
  if (build === "试炼流") {
    return {
      build,
      keyGain: "更容易提早看清 Boss 压力，并把目标接进本轮节奏。",
      nextTip: "下一轮继续补胡流或碰流收益，让试炼线别只剩信息。",
    };
  }
  if (build === "牌尾流") {
    return {
      build,
      keyGain: "残局整理更主动，牌尾和弃牌手感更清楚。",
      nextTip: "可以继续补试锋，把牌尾节奏接成收官 build。",
    };
  }
  if (build === "杠流") {
    return {
      build,
      keyGain: "杠相关奖励更容易接成爆发段。",
      nextTip: "下一轮尽量补河眼或容错，避免只靠爆发硬顶。",
    };
  }
  if (build === "河控流") {
    return {
      build,
      keyGain: "牌河和弃牌节奏更稳，残局更好收。",
      nextTip: "可以继续补杠擎，把河控转成更强联动。",
    };
  }
  if (build === "路线流") {
    return {
      build,
      keyGain: "路线奖励更集中，build 分流更清楚。",
      nextTip: "下一轮补稳手或胡流奖励，让路线别空转。",
    };
  }
  if (build === "稳压流") {
    return {
      build,
      keyGain: "高压关的顶压能力更强，容错不容易断。",
      nextTip: "可以继续补输出向奖励，别让节奏只剩拖住。",
    };
  }
  if (build === "稳手流") {
    return {
      build,
      keyGain: "开局更稳，前几关更容易铺出安全节奏。",
      nextTip: "下一轮补顺路或河眼，把中后段拉开。",
    };
  }
  return {
    build,
    keyGain: "这一轮还在搭高阶骨架，构筑感刚起步。",
    nextTip: "先把能力槽装满，再看哪条路线更顺手。",
  };
}

function countUnlockedUpgrades(upgrades: UpgradeState) {
  return upgrades.reserve + upgrades.shield + upgrades.tools + upgrades.river + upgrades.coins + upgrades.vision;
}

function buildAchievementUnlocks(state: {
  lastSettlement: SettlementState | null;
  bestEndlessLayer: number;
  bestAscensionLevel: AscensionLevel;
  dailyBestLevels: Record<string, number>;
  dailyStreak: number;
  upgrades: UpgradeState;
}) {
  const unlocks: Partial<Record<AchievementId, string>> = {};
  const now = new Date().toISOString();
  const hasAnyDaily = Object.keys(state.dailyBestLevels).length > 0;
  const hasAnyUpgrade = countUnlockedUpgrades(state.upgrades) > 0;
  const hasAllUpgrades = state.upgrades.reserve > 0 && state.upgrades.shield > 0 && state.upgrades.tools > 0;
  const hasAllSixUpgrades =
    state.upgrades.reserve > 0 &&
    state.upgrades.shield > 0 &&
    state.upgrades.tools > 0 &&
    state.upgrades.river > 0 &&
    state.upgrades.coins > 0 &&
    state.upgrades.vision > 0;
  const hasMasteredRoute =
    getRouteFocusMasteryLevel("hu", state.upgrades) >= 2 ||
    getRouteFocusMasteryLevel("info", state.upgrades) >= 2 ||
    getRouteFocusMasteryLevel("river", state.upgrades) >= 2 ||
    getRouteFocusMasteryLevel("tools", state.upgrades) >= 2 ||
    getRouteFocusMasteryLevel("survive", state.upgrades) >= 2;

  if (state.lastSettlement?.runMode === "mainline" && state.lastSettlement.result === "completed") {
    unlocks["mainline-first-clear"] = state.lastSettlement.summary ? now : now;
    if ((state.lastSettlement.reachedLevelOrder ?? 0) >= 20) {
      unlocks["boss-hulebu-king"] = now;
    }
    if ((state.lastSettlement.pickedRewards ?? 0) >= 5) {
      unlocks["mainline-master"] = now;
    }
  }

  if (state.bestEndlessLayer >= 21) {
    unlocks["endless-first-step"] = now;
  }
  if (state.bestEndlessLayer >= 25) {
    unlocks["endless-layer-25"] = now;
  }
  if (state.bestEndlessLayer >= 40) {
    unlocks["endless-layer-40"] = now;
  }

  if (hasAnyDaily) {
    unlocks["daily-first-checkin"] = now;
  }
  if (Object.values(state.dailyBestLevels).some((level) => level > 0)) {
    unlocks["daily-clear"] = now;
  }
  if (state.dailyStreak >= 7) {
    unlocks["daily-streak-7"] = now;
  }

  if (hasAnyUpgrade) {
    unlocks["upgrade-first-buy"] = now;
  }
  if (hasAllUpgrades) {
    unlocks["upgrade-all-basic"] = now;
  }
  if (hasAllSixUpgrades) {
    unlocks["upgrade-all-six"] = now;
  }
  if (state.bestAscensionLevel >= 3) {
    unlocks["ascension-west-clear"] = now;
  }
  if (state.bestAscensionLevel >= 4) {
    unlocks["ascension-north-clear"] = now;
  }
  if ((state.lastSettlement?.pickedRewards ?? 0) >= 4) {
    unlocks["build-reward-streak"] = now;
  }
  if (hasMasteredRoute) {
    unlocks["route-focus-mastered"] = now;
  }
  if (state.lastSettlement?.bossReview?.bossVariant === "ascension-warden") {
    unlocks["boss-ascension-warden"] = now;
  }
  if (state.lastSettlement?.specialEventReview?.summary?.includes("稀有事件")) {
    unlocks["event-rare-encounter"] = now;
  }
  if (
    state.lastSettlement?.specialEventReview &&
    ((state.lastSettlement.ascensionLevel ?? 0) > 0 ||
      state.lastSettlement.specialEventReview.summary?.includes("高阶事件"))
  ) {
    unlocks["event-ascension-encounter"] = now;
  }

  return unlocks;
}

function buildAscensionFrameSrc(
  sessionKey: string,
  upgrades: UpgradeState,
  selectedRouteFocus: RouteFocusId,
  runArchetype: RunArchetypeId,
  ascensionLevel: AscensionLevel,
  equippedAscensionLoadout: AscensionPerkId[],
  resumeLevelOrder?: number,
) {
  const routeProgress = getPreferredRouteProgress(upgrades, selectedRouteFocus);
  const ascension = ASCENSION_CONFIGS.find((item) => item.level === ascensionLevel) ?? ASCENSION_CONFIGS[0];
  const params = new URLSearchParams({
    embed: "shell",
    session: sessionKey,
    mode: "ascension",
    runArchetype,
    ascensionLevel: String(ascension.level),
    ascensionName: ascension.name,
    reserveBonus: String(upgrades.reserve),
    shieldBonus: String(upgrades.shield),
    toolBonus: String(upgrades.tools),
    riverBonus: String(upgrades.river),
    coinBonus: String(upgrades.coins * 20),
    visionBonus: String(upgrades.vision),
    preferredRoute: routeProgress.preferredRoute,
    routeMasteryLevel: String(routeProgress.routeMasteryLevel),
    ascensionPerkSlots: String(ascension.perkSlots),
    ascensionPerks: equippedAscensionLoadout.join(","),
  });
  if (resumeLevelOrder && resumeLevelOrder > 1) params.set("level", String(resumeLevelOrder));
  return `${FRAME_BASE}?${params.toString()}`;
}

function mergeAchievementMap(
  current: Record<string, string>,
  unlocks: Partial<Record<AchievementId, string>>,
) {
  const next = { ...current };
  for (const [id, unlockedAt] of Object.entries(unlocks)) {
    if (unlockedAt && !next[id]) next[id] = unlockedAt;
  }
  return next;
}

function readPersistedShellState(): PersistedShellState {
  if (typeof window === "undefined") {
    return {
      bankedCoins: 0,
      bestEndlessLayer: 0,
      bestAscensionLevel: DEFAULT_ASCENSION_LEVEL,
      dailyBestLevels: {},
      dailyStreak: 0,
      lastDailySeed: null,
      achievements: {},
      lastSettlement: null,
      activeRun: null,
      upgrades: DEFAULT_UPGRADES,
      selectedRouteFocus: "auto",
      equippedAscensionLoadout: [],
      unlockedAscensionPerks: {},
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        bankedCoins: 0,
        bestEndlessLayer: 0,
        bestAscensionLevel: DEFAULT_ASCENSION_LEVEL,
        dailyBestLevels: {},
        dailyStreak: 0,
        lastDailySeed: null,
        achievements: {},
        lastSettlement: null,
        activeRun: null,
        upgrades: DEFAULT_UPGRADES,
        selectedRouteFocus: "auto",
        equippedAscensionLoadout: [],
        unlockedAscensionPerks: {},
      };
    }
    const parsed = JSON.parse(raw) as PersistedShellState & { lastSettlement?: LegacySettlementState | null };
    const persistedSettlement = normalizeCompletedSettlement(parsed.lastSettlement);
    const persistedActiveRun = sanitizeActiveRunResume((parsed as PersistedShellState & { activeRun?: unknown }).activeRun);
    return {
      bankedCoins: Number.isFinite(parsed.bankedCoins) ? parsed.bankedCoins : 0,
      bestEndlessLayer: Number.isFinite(parsed.bestEndlessLayer) ? Math.max(0, parsed.bestEndlessLayer) : 0,
      bestAscensionLevel: sanitizeAscensionLevel((parsed as PersistedShellState & { bestAscensionLevel?: unknown }).bestAscensionLevel),
      dailyBestLevels: sanitizeDailyBestLevels((parsed as PersistedShellState & { dailyBestScores?: Record<string, unknown> }).dailyBestLevels ?? (parsed as PersistedShellState & { dailyBestScores?: Record<string, unknown> }).dailyBestScores),
      dailyStreak: Number.isFinite((parsed as PersistedShellState & { dailyStreak?: unknown }).dailyStreak)
        ? Math.max(0, Number((parsed as PersistedShellState & { dailyStreak?: unknown }).dailyStreak))
        : 0,
      lastDailySeed: typeof (parsed as PersistedShellState & { lastDailySeed?: unknown }).lastDailySeed === "string"
        ? (parsed as PersistedShellState & { lastDailySeed?: string }).lastDailySeed ?? null
        : null,
      achievements: sanitizeAchievements((parsed as PersistedShellState & { achievements?: Record<string, unknown> }).achievements),
      lastSettlement: persistedSettlement,
      activeRun: persistedActiveRun,
      upgrades: sanitizeUpgrades(parsed.upgrades),
      selectedRouteFocus: ((parsed as PersistedShellState & { selectedRouteFocus?: RouteFocusId }).selectedRouteFocus ?? "auto"),
      equippedAscensionLoadout: sanitizeAscensionLoadout((parsed as PersistedShellState & { equippedAscensionLoadout?: unknown }).equippedAscensionLoadout),
      unlockedAscensionPerks: sanitizeUnlockedAscensionPerks((parsed as PersistedShellState & { unlockedAscensionPerks?: Record<string, unknown> }).unlockedAscensionPerks),
    };
  } catch {
    return {
      bankedCoins: 0,
      bestEndlessLayer: 0,
      bestAscensionLevel: DEFAULT_ASCENSION_LEVEL,
      dailyBestLevels: {},
      dailyStreak: 0,
      lastDailySeed: null,
      achievements: {},
      lastSettlement: null,
      activeRun: null,
      upgrades: DEFAULT_UPGRADES,
      selectedRouteFocus: "auto",
      equippedAscensionLoadout: [],
      unlockedAscensionPerks: {},
    };
  }
}

function normalizeCompletedSettlement(settlement?: LegacySettlementState | null): SettlementState | null {
  if (!settlement) return null;
  if (settlement.result && settlement.result !== "completed") return null;
  return {
    ...settlement,
    result: "completed",
    bossReview: settlement.bossReview ?? null,
    specialEventReview: settlement.specialEventReview ?? null,
  };
}

function writePersistedShellState(state: PersistedShellState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function fetchAccountProgress() {
  const response = await fetch("/api/games/hulebu/progress", {
    cache: "no-store",
    credentials: "same-origin",
  });

  if (response.status === 401) {
    return { signedIn: false as const, data: null };
  }
  if (!response.ok) {
    throw new Error("账号进度读取失败。");
  }

  const payload = (await response.json()) as Partial<PersistedShellState>;
  return {
    signedIn: true as const,
    data: {
      achievements: sanitizeAchievements(payload.achievements),
      activeRun: sanitizeActiveRunResume(payload.activeRun),
      bankedCoins: Number.isFinite(payload.bankedCoins) ? Number(payload.bankedCoins) : 0,
      bestAscensionLevel: sanitizeAscensionLevel(payload.bestAscensionLevel),
      bestEndlessLayer: Number.isFinite(payload.bestEndlessLayer) ? Math.max(0, Number(payload.bestEndlessLayer)) : 0,
      dailyBestLevels: sanitizeDailyBestLevels(payload.dailyBestLevels),
    } satisfies RemoteProgressState,
  };
}

async function pushAccountProgress(state: PersistedShellState) {
  const response = await fetch("/api/games/hulebu/progress", {
    body: JSON.stringify({
      achievements: state.achievements,
      activeRun: state.activeRun,
      bankedCoins: state.bankedCoins,
      bestAscensionLevel: state.bestAscensionLevel,
      bestEndlessLayer: state.bestEndlessLayer,
      dailyBestLevels: state.dailyBestLevels,
    }),
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (response.status === 401) {
    return false;
  }
  if (!response.ok) {
    throw new Error("账号进度保存失败。");
  }
  return true;
}

export function HulebuGamePage() {
  const [screen, setScreen] = useState<Screen>("lobby");
  const [panel, setPanel] = useState<LobbyPanel>("mainline");
  const [hydrated, setHydrated] = useState(false);
  const [bankedCoins, setBankedCoins] = useState(0);
  const [bestEndlessLayer, setBestEndlessLayer] = useState(0);
  const [bestAscensionLevel, setBestAscensionLevel] = useState<AscensionLevel>(DEFAULT_ASCENSION_LEVEL);
  const [dailyBestLevels, setDailyBestLevels] = useState<Record<string, number>>({});
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastDailySeed, setLastDailySeed] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<Record<string, string>>({});
  const [activeRun, setActiveRun] = useState<ActiveRun | null>(null);
  const [lastSettlement, setLastSettlement] = useState<SettlementState | null>(null);
  const [upgrades, setUpgrades] = useState<UpgradeState>(DEFAULT_UPGRADES);
  const [selectedRouteFocus, setSelectedRouteFocus] = useState<RouteFocusId>("auto");
  const [selectedRunArchetype, setSelectedRunArchetype] = useState<RunArchetypeId>("chi");
  const [equippedAscensionLoadout, setEquippedAscensionLoadout] = useState<AscensionPerkId[]>([]);
  const [selectedAscensionLevel, setSelectedAscensionLevel] = useState<AscensionLevel>(DEFAULT_ASCENSION_LEVEL);
  const [unlockedAscensionPerks, setUnlockedAscensionPerks] = useState<Partial<Record<AscensionPerkId, boolean>>>({
    "steady-hand": true,
  });
  const [accountProgress, setAccountProgress] = useState<AccountProgressState>({
    isSignedIn: false,
    syncError: null,
    syncReady: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const debugQueryKey = ["debug", "Settlement"].join("");
    const url = new URL(window.location.href);
    const debugQueryValue = url.searchParams.get(debugQueryKey);
    if (!debugQueryValue) return;
    url.searchParams.delete(debugQueryKey);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    if (/fail/i.test(debugQueryValue)) {
      setLastSettlement(null);
      setActiveRun(null);
      setScreen("lobby");
    }
  }, []);

  const todayDailySeed = useMemo(() => getTodayDailySeed(), []);
  const todayBestDailyLevel = dailyBestLevels[todayDailySeed] ?? 0;
  const unlockedAchievementCount = Object.keys(achievements).length;
  const nextLockedAchievement = ACHIEVEMENTS.find((achievement) => !achievements[achievement.id]) ?? null;
  const achievementCards = useMemo(
    () =>
      ACHIEVEMENTS.map((achievement) => {
        const unlockedAt = achievements[achievement.id] ?? null;
        const isUnlocked = Boolean(unlockedAt);
        return {
          ...achievement,
          unlockedAt,
          isUnlocked,
          displayTitle: !isUnlocked && achievement.hidden ? achievement.hiddenTitle ?? "未揭示目标" : achievement.title,
          displayDescription:
            !isUnlocked && achievement.hidden
              ? achievement.hiddenHint ?? "继续推进后续内容。"
              : achievement.description,
          displayMetaLabel: isUnlocked ? "解锁时间" : achievement.hidden ? "隐藏提示" : "达成提示",
          displayMetaValue:
            isUnlocked
              ? unlockedAt?.slice(0, 10)
              : achievement.hidden
                ? achievement.hiddenHint ?? achievement.hint
                : achievement.hint,
        };
      }),
    [achievements],
  );
  const achievementGroups = useMemo(
    () =>
      ACHIEVEMENT_GROUPS.map((group) => {
        const items = achievementCards.filter((achievement) => achievement.group === group.id);
        const unlocked = items.filter((achievement) => achievement.isUnlocked).length;
        return {
          ...group,
          items,
          unlocked,
          total: items.length,
        };
      }).filter((group) => group.total > 0),
    [achievementCards],
  );
  const highestUnlockedAscension = bestAscensionLevel;
  const currentAscensionConfig = ASCENSION_CONFIGS.find((item) => item.level === highestUnlockedAscension) ?? ASCENSION_CONFIGS[0];
  const selectedAscensionConfig = ASCENSION_CONFIGS.find((item) => item.level === selectedAscensionLevel) ?? ASCENSION_CONFIGS[0];
  const nextAscensionUnlock = highestUnlockedAscension >= 4 ? 4 : ((highestUnlockedAscension + 1) as AscensionLevel);
  const ascensionPerkSlots = getAscensionPerkSlots(highestUnlockedAscension);
  const selectedAscensionPerkSlots = getAscensionPerkSlots(selectedAscensionLevel);
  const ascensionPerks = ASCENSION_PERKS.map((perk) => ({
    ...perk,
    isUnlocked: perk.unlockLevel <= highestUnlockedAscension || Boolean(unlockedAscensionPerks[perk.id]),
    isEquipped: equippedAscensionLoadout.includes(perk.id),
  }));
  const equippedAscensionLabels = useMemo(
    () => equippedAscensionLoadout.map((perkId) => ASCENSION_PERK_LABELS[perkId] ?? perkId),
    [equippedAscensionLoadout],
  );

  useEffect(() => {
    const persisted = readPersistedShellState();
    const persistedSettlement = normalizeCompletedSettlement(persisted.lastSettlement);
    const restoredActiveRun = restoreActiveRunFromPersistedState(persisted, persisted.upgrades, persisted.selectedRouteFocus);
    setBankedCoins(persisted.bankedCoins);
    setBestEndlessLayer(persisted.bestEndlessLayer);
    setBestAscensionLevel(persisted.bestAscensionLevel);
    setDailyBestLevels(persisted.dailyBestLevels);
    setDailyStreak(persisted.dailyStreak);
    setLastDailySeed(persisted.lastDailySeed);
    setAchievements(
      mergeAchievementMap(
        persisted.achievements,
        buildAchievementUnlocks({
          lastSettlement: persistedSettlement,
          bestEndlessLayer: persisted.bestEndlessLayer,
          bestAscensionLevel: persisted.bestAscensionLevel,
          dailyBestLevels: persisted.dailyBestLevels,
          dailyStreak: persisted.dailyStreak,
          upgrades: persisted.upgrades,
        }),
      ),
    );
    setLastSettlement(persistedSettlement);
    setActiveRun(restoredActiveRun);
    if (restoredActiveRun) setScreen("playing");
    setUpgrades(persisted.upgrades);
    setSelectedRouteFocus(persisted.selectedRouteFocus ?? "auto");
    setEquippedAscensionLoadout(persisted.equippedAscensionLoadout.slice(0, getAscensionPerkSlots(persisted.bestAscensionLevel)));
    setSelectedAscensionLevel(persisted.bestAscensionLevel);
    setUnlockedAscensionPerks({
      ...persisted.unlockedAscensionPerks,
      ...Object.fromEntries(
        ASCENSION_PERKS.filter((perk) => perk.unlockLevel <= persisted.bestAscensionLevel).map((perk) => [perk.id, true] as const),
      ),
    });
    setHydrated(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function syncInitialAccountProgress() {
      try {
        const result = await fetchAccountProgress();
        if (cancelled) return;

        if (!result.signedIn || !result.data) {
          setAccountProgress({
            isSignedIn: false,
            syncError: null,
            syncReady: true,
          });
          return;
        }

        const local = readPersistedShellState();
        const mergedBestEndless = Math.max(local.bestEndlessLayer, result.data.bestEndlessLayer);
        const mergedBestAscension = sanitizeAscensionLevel(
          local.bestAscensionLevel >= result.data.bestAscensionLevel
            ? local.bestAscensionLevel
            : result.data.bestAscensionLevel,
        );
        const mergedDailyBestLevels = {
          ...result.data.dailyBestLevels,
          ...Object.fromEntries(
            Object.entries(local.dailyBestLevels).map(([key, value]) => [
              key,
              Math.max(value, result.data.dailyBestLevels[key] ?? 0),
            ]),
          ),
        };
        const mergedAchievements = {
          ...result.data.achievements,
          ...local.achievements,
        };
        const mergedBankedCoins = Math.max(local.bankedCoins, result.data.bankedCoins);
        const mergedActiveRun = chooseLatestActiveRunResume(local.activeRun, result.data.activeRun);
        const restoredRemoteActiveRun = restoreActiveRunFromPersistedState(
          {
            ...local,
            activeRun: mergedActiveRun,
          },
          local.upgrades,
          local.selectedRouteFocus,
        );

        setBankedCoins(mergedBankedCoins);
        setBestEndlessLayer(mergedBestEndless);
        setBestAscensionLevel(mergedBestAscension);
        setSelectedAscensionLevel(mergedBestAscension);
        setDailyBestLevels(mergedDailyBestLevels);
        setAchievements((current) => mergeAchievementMap(mergedAchievements, current));
        setActiveRun(restoredRemoteActiveRun);
        if (restoredRemoteActiveRun) setScreen("playing");
        setUnlockedAscensionPerks((current) => ({
          ...current,
          ...Object.fromEntries(
            ASCENSION_PERKS.filter((perk) => perk.unlockLevel <= mergedBestAscension).map((perk) => [perk.id, true] as const),
          ),
        }));
        setAccountProgress({
          isSignedIn: true,
          syncError: null,
          syncReady: true,
        });
      } catch {
        if (cancelled) return;
        setAccountProgress({
          isSignedIn: true,
          syncError: "账号进度同步失败，暂时继续使用本地记录。",
          syncReady: true,
        });
      }
    }

    void syncInitialAccountProgress();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state = {
      bankedCoins,
      bestEndlessLayer,
      bestAscensionLevel,
      dailyBestLevels,
      dailyStreak,
      lastDailySeed,
      achievements,
      lastSettlement,
      activeRun: activeRun ? toActiveRunResumeState(activeRun) : null,
      upgrades,
      selectedRouteFocus,
      equippedAscensionLoadout,
      unlockedAscensionPerks,
    };
    writePersistedShellState(state);

    if (!accountProgress.syncReady || !accountProgress.isSignedIn) return;
    void pushAccountProgress(state).catch(() => {
      setAccountProgress((current) =>
        current.syncError
          ? current
          : {
              ...current,
              syncError: "账号进度保存失败，当前先保存在本地。",
            },
      );
    });
  }, [
    accountProgress.isSignedIn,
    accountProgress.syncReady,
    achievements,
    bankedCoins,
    bestAscensionLevel,
    bestEndlessLayer,
    dailyBestLevels,
    dailyStreak,
    lastDailySeed,
    hydrated,
    lastSettlement,
    activeRun,
    upgrades,
    selectedRouteFocus,
    equippedAscensionLoadout,
    unlockedAscensionPerks,
  ]);

  function startRunWithArchetype(runMode: RunMode, archetypeId: RunArchetypeId, ascensionLevel?: AscensionLevel) {
    const sessionKey = createSessionKey();
    if (ascensionLevel) {
      const ascension = ASCENSION_CONFIGS.find((item) => item.level === ascensionLevel) ?? ASCENSION_CONFIGS[0];
      const allowedLoadout = equippedAscensionLoadout.slice(0, getAscensionPerkSlots(ascensionLevel));
      setActiveRun({
        sessionKey,
        runMode: "mainline",
        runArchetype: archetypeId,
        ascensionLevel,
        ascensionName: ascension.name,
        ascensionPerks: allowedLoadout,
        dailySeed: null,
        iframeSrc: buildAscensionFrameSrc(sessionKey, upgrades, selectedRouteFocus, archetypeId, ascensionLevel, allowedLoadout),
        latestCoins: 0,
        latestScore: 0,
        latestLevelOrder: 1,
        latestEndlessLayer: 0,
        latestSummary: `${ascension.name} 第 1 关`,
        pickedRewards: 0,
      });
      setPanel("ascension");
      setScreen("playing");
      return;
    }

    if (runMode === "endless") {
      setActiveRun({
        sessionKey,
        runMode: "endless",
        runArchetype: archetypeId,
        ascensionLevel: null,
        ascensionName: null,
        ascensionPerks: [],
        dailySeed: null,
        iframeSrc: buildEndlessFrameSrc(sessionKey, upgrades, selectedRouteFocus, archetypeId),
        latestCoins: 0,
        latestScore: 0,
        latestLevelOrder: ENDLESS_START_LAYER,
        latestEndlessLayer: ENDLESS_START_LAYER,
        latestSummary: `无尽第 ${ENDLESS_START_LAYER} 层`,
        pickedRewards: 0,
      });
      setPanel("endless");
      setScreen("playing");
      return;
    }

    if (runMode === "daily") {
      setActiveRun({
        sessionKey,
        runMode: "daily",
        runArchetype: archetypeId,
        ascensionLevel: null,
        ascensionName: null,
        ascensionPerks: [],
        dailySeed: todayDailySeed,
        iframeSrc: buildDailyFrameSrc(sessionKey, upgrades, selectedRouteFocus, todayDailySeed, archetypeId),
        latestCoins: 0,
        latestScore: 0,
        latestLevelOrder: 1,
        latestEndlessLayer: 0,
        latestSummary: `每日 ${todayDailySeed}`,
        pickedRewards: 0,
      });
      setPanel("daily");
      setScreen("playing");
      return;
    }

    setActiveRun({
      sessionKey,
      runMode: "mainline",
      runArchetype: archetypeId,
      ascensionLevel: null,
      ascensionName: null,
      ascensionPerks: [],
      dailySeed: null,
      iframeSrc: buildRunFrameSrc(sessionKey, upgrades, selectedRouteFocus, archetypeId),
      latestCoins: 0,
      latestScore: 0,
      latestLevelOrder: 1,
      latestEndlessLayer: 0,
      latestSummary: "第 1 关",
      pickedRewards: 0,
    });
    setPanel("mainline");
    setScreen("playing");
  }

  const startRun = useCallback(() => {
    startRunWithArchetype("mainline", selectedRunArchetype);
  }, [selectedRunArchetype, selectedRouteFocus, todayDailySeed, upgrades, equippedAscensionLoadout]);

  const startEndlessRun = useCallback(() => {
    startRunWithArchetype("endless", selectedRunArchetype);
  }, [selectedRunArchetype, selectedRouteFocus, todayDailySeed, upgrades, equippedAscensionLoadout]);

  const startDailyRun = useCallback(() => {
    startRunWithArchetype("daily", selectedRunArchetype);
  }, [selectedRunArchetype, selectedRouteFocus, todayDailySeed, upgrades, equippedAscensionLoadout]);

  const startAscensionRun = useCallback(
    (ascensionLevel: AscensionLevel) => {
      startRunWithArchetype("mainline", selectedRunArchetype, ascensionLevel);
    },
    [selectedRunArchetype, selectedRouteFocus, todayDailySeed, upgrades, equippedAscensionLoadout],
  );

  const toggleAscensionPerk = useCallback(
    (perkId: AscensionPerkId) => {
      setEquippedAscensionLoadout((current) => {
        if (current.includes(perkId)) {
          return current.filter((id) => id !== perkId);
        }
        if ((unlockedAscensionPerks[perkId] ?? false) === false) return current;
        if (current.length >= ascensionPerkSlots) return current;
        return [...current, perkId];
      });
    },
    [ascensionPerkSlots, unlockedAscensionPerks],
  );

  const restartRun = useCallback(() => {
    const archetypeId = activeRun?.runArchetype ?? lastSettlement?.runArchetype ?? selectedRunArchetype;
    if ((activeRun?.runMode ?? lastSettlement?.runMode) === "endless") {
      startRunWithArchetype("endless", archetypeId);
      return;
    }
    if ((activeRun?.runMode ?? lastSettlement?.runMode) === "daily") {
      startRunWithArchetype("daily", archetypeId);
      return;
    }
    if (activeRun?.ascensionLevel ?? lastSettlement?.ascensionLevel) {
      startRunWithArchetype("mainline", archetypeId, (activeRun?.ascensionLevel ?? lastSettlement?.ascensionLevel)!);
      return;
    }
    startRunWithArchetype("mainline", archetypeId);
  }, [activeRun?.ascensionLevel, activeRun?.runArchetype, activeRun?.runMode, lastSettlement?.ascensionLevel, lastSettlement?.runArchetype, lastSettlement?.runMode, selectedRunArchetype]);

  const continueRun = useCallback(() => {
    if (!activeRun) return;
    setScreen("playing");
  }, [activeRun]);

  const purchaseUpgrade = useCallback(
    (upgradeId: UpgradeId) => {
      const config = UPGRADES.find((item) => item.id === upgradeId);
      if (!config) return;

      setUpgrades((current) => {
        const level = current[upgradeId];
        if (level >= config.costs.length) return current;
        const nextCost = config.costs[level];
        if (bankedCoins < nextCost) return current;
        setBankedCoins((coins) => coins - nextCost);
        const nextUpgrades = {
          ...current,
          [upgradeId]: level + 1,
        };
        setAchievements((existing) =>
          mergeAchievementMap(
            existing,
            buildAchievementUnlocks({
              lastSettlement,
              bestEndlessLayer,
              bestAscensionLevel,
              dailyBestLevels,
              dailyStreak,
              upgrades: nextUpgrades,
            }),
          ),
        );
        return nextUpgrades;
      });
    },
    [bankedCoins, bestAscensionLevel, bestEndlessLayer, dailyBestLevels, lastSettlement],
  );

  useEffect(() => {
    function handleShellMessage(event: MessageEvent<HulebuShellMessage>) {
      if (typeof window === "undefined" || event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || data.source !== "hulebu-demo-shell" || !data.type || !data.payload) return;
      const payload = data.payload;
      if (!activeRun || data.payload.sessionKey !== activeRun.sessionKey) return;

      if (data.type === "hulebu:run-progress") {
        setActiveRun((current) => {
          if (!current || current.sessionKey !== payload.sessionKey) return current;
          return {
            ...current,
            latestCoins: payload.coins ?? current.latestCoins,
            latestScore: current.latestScore,
            latestLevelOrder: payload.levelOrder ?? current.latestLevelOrder,
            latestEndlessLayer: payload.endlessLayer ?? current.latestEndlessLayer,
            latestSummary: payload.summary ?? current.latestSummary,
            pickedRewards: payload.pickedRewards ?? current.pickedRewards,
          };
        });
        return;
      }

      if (data.type === "hulebu:run-failed") {
        setActiveRun(null);
        setLastSettlement(null);
        setScreen("playing");
        return;
      }

      if (lastSettlement?.sessionKey === payload.sessionKey) return;

      const coinsEarned = Math.max(0, payload.coins ?? 0);
      const updatedBank = bankedCoins + coinsEarned;
      const runMode = payload.runMode ?? activeRun.runMode;
      const ascensionLevel = payload.ascensionLevel ?? activeRun.ascensionLevel;
      const ascensionName = payload.ascensionName ?? activeRun.ascensionName;
      const dailySeed = payload.dailySeed ?? activeRun.dailySeed;
      const reachedEndlessLayer =
        runMode === "endless" ? payload.endlessLayer ?? activeRun.latestEndlessLayer : 0;
      const updatedBestEndlessLayer =
        runMode === "endless" ? Math.max(bestEndlessLayer, reachedEndlessLayer) : bestEndlessLayer;
      const dailyLevelOrder = runMode === "daily" ? Math.max(1, payload.levelOrder ?? activeRun.latestLevelOrder) : 0;
      const updatedBestDailyLevelOrder =
        runMode === "daily" && dailySeed
          ? Math.max(dailyBestLevels[dailySeed] ?? 0, dailyLevelOrder)
          : 0;
      const updatedDailyStreak =
        runMode === "daily" && dailySeed
          ? payload.dailyStreak ?? (dailySeed === lastDailySeed ? Math.max(1, dailyStreak) : Math.max(1, dailyStreak + 1))
          : dailyStreak;
      setBankedCoins(updatedBank);
      setBestEndlessLayer(updatedBestEndlessLayer);
      if (runMode === "mainline" && ascensionLevel && data.type === "hulebu:run-complete") {
        setBestAscensionLevel((current) => (current >= nextAscensionUnlock ? current : nextAscensionUnlock));
        setSelectedAscensionLevel((current) => (current >= nextAscensionUnlock ? current : nextAscensionUnlock));
      }
      if (runMode === "daily" && dailySeed) {
        setDailyBestLevels((current) => ({
          ...current,
          [dailySeed]: updatedBestDailyLevelOrder,
        }));
        setDailyStreak(updatedDailyStreak);
        setLastDailySeed(dailySeed);
      }
      setAchievements((current) =>
        mergeAchievementMap(
          current,
          buildAchievementUnlocks({
            lastSettlement: settlement,
            bestEndlessLayer: updatedBestEndlessLayer,
            bestAscensionLevel:
              runMode === "mainline" && ascensionLevel && data.type === "hulebu:run-complete"
                ? nextAscensionUnlock
                : bestAscensionLevel,
            dailyBestLevels:
              runMode === "daily" && dailySeed
                ? {
                    ...dailyBestLevels,
                    [dailySeed]: updatedBestDailyLevelOrder,
                  }
                : dailyBestLevels,
            dailyStreak: updatedDailyStreak,
            upgrades,
          }),
        ),
      );
      const settlement: SettlementState = {
        sessionKey: payload.sessionKey ?? activeRun.sessionKey,
        runMode,
        runArchetype: activeRun.runArchetype,
        ascensionLevel,
        ascensionName,
        ascensionPerks: activeRun.ascensionPerks,
        routeDirection: payload.routeDirection ?? null,
        dailySeed,
        result: "completed",
        coinsEarned,
        bankedCoins: updatedBank,
        reachedLevelOrder: payload.levelOrder ?? activeRun.latestLevelOrder,
        reachedEndlessLayer,
        bestEndlessLayer: updatedBestEndlessLayer,
        bestDailyLevelOrder: updatedBestDailyLevelOrder,
        pickedRewards: payload.pickedRewards ?? activeRun.pickedRewards,
        summary: payload.summary ?? activeRun.latestSummary,
        endlessChapterLabel: payload.endlessChapterLabel ?? null,
        endlessChapterBoss: payload.endlessChapterBoss ?? null,
        dailyMutatorLabel: payload.dailyMutatorLabel ?? null,
        dailyRewardLabel: payload.dailyRewardLabel ?? null,
        dailyStreak: updatedDailyStreak,
        bossReview: payload.bossReview ?? null,
        specialEventReview:
          payload.specialEventSummary || payload.specialEventMessage
            ? {
                summary: payload.specialEventSummary ?? "",
                detail: payload.specialEventMessage ?? "",
              }
            : null,
      };
      setLastSettlement(settlement);
      setActiveRun(null);
      setScreen("settlement");
    }

    window.addEventListener("message", handleShellMessage);
    return () => window.removeEventListener("message", handleShellMessage);
  }, [activeRun, bankedCoins, bestAscensionLevel, bestEndlessLayer, dailyBestLevels, dailyStreak, lastDailySeed, lastSettlement, nextAscensionUnlock, upgrades]);

  const panelContent = useMemo<Record<LobbyPanel, PanelContent>>(
    () => ({
      mainline: {
        eyebrow: "主线 20 关",
        title: "胡了卜正在往完整体验版走",
        description: "20 关主线已开放，第 10 关有终局试炼，第 20 关有胡了卜王 Boss。",
        bullets: [
          "第 1-4 关教学碰 / 吃 / 杠 / 胡",
          "第 5-19 关逐步加压",
          "第 20 关终章 Boss",
        ],
        status: activeRun ? `当前可继续到第 ${activeRun.latestLevelOrder} 关` : "适合直接开一轮完整网页试玩",
      },
      upgrades: {
        eyebrow: "局外升级",
        title: "局外升级",
        description: "把铜钱换成下一轮的固定起手优势。",
        bullets: [
          "备用槽：给主线 run 增加一档容错",
          "满槽护符：在临界失败前提供一次缓冲",
          "初始道具：提高洗牌 / 撤回 / 丢弃的开局次数",
          "河道扩容 / 开局铜钱 / 看山预置：开始把长期成长真正带进开局节奏",
        ],
        status: "当前已开放 6 条成长轴，并会带进下一轮牌山",
      },
      collection: {
        eyebrow: "成就图鉴",
        title: "成就图鉴",
        description: "记录主线、无尽、每日、高阶和事件进度。",
        bullets: [
          "主线首通、Boss 试炼和高阶征途会分开记下",
          "无尽、每日、事件和升级会沉淀成分类进度",
          "部分目标会先以未揭示状态存在，解锁后再展开",
        ],
        status: `${unlockedAchievementCount}/${ACHIEVEMENTS.length} 项已解锁`,
      },
      endless: {
        eyebrow: "无尽模式",
        title: "第 21 层之后开始按章节往深处推",
        description: "从第 21 层开始冲层，每 5 层一个章节 Boss。",
        bullets: [
          "章节主题会随层数切换",
          "章节中段会插入事件",
          "本地保存无尽最高层",
        ],
        status: bestEndlessLayer > 0 ? `无尽最高第 ${bestEndlessLayer} 层` : "已开放本地冲层",
      },
      daily: {
        eyebrow: "每日牌局",
        title: "每日牌局",
        description: "每天固定 seed，并带一条今日词缀和奖励偏置。",
        bullets: [
          `固定日 seed：${todayDailySeed}`,
          "会显示今日词缀",
          "会显示今日奖励",
          "记录连续参与",
        ],
        status: todayBestDailyLevel > 0 ? `今日最佳第 ${todayBestDailyLevel} 关` : "今日尚未挑战",
      },
      ascension: {
        eyebrow: "高阶周目",
        title: "高阶周目",
        description: "选择周目和能力后再进入高阶 run。",
        bullets: [
          `当前已解锁：${currentAscensionConfig.name}`,
          `当前准备进入：${selectedAscensionConfig.name}`,
          "东风场 / 南风场 / 西风场 / 北风场依次解锁",
          "高阶能力会先在局外装备，再随本轮进入高阶奖励池",
          "第一版继续复用现有 20 关主线，但会接入独立高阶奖励",
        ],
        status: `已解锁到 ${currentAscensionConfig.name} · 当前选择 ${selectedAscensionConfig.name}`,
      },
    }),
    [activeRun, bestEndlessLayer, currentAscensionConfig.name, selectedAscensionConfig.name, todayBestDailyLevel, todayDailySeed, unlockedAchievementCount],
  );

  const endlessSummary = activeRun?.runMode === "endless"
    ? `第 ${activeRun.latestEndlessLayer} 层 · 最高第 ${bestEndlessLayer} 层`
    : bestEndlessLayer > 0
      ? `最高第 ${bestEndlessLayer} 层`
      : "尚未挑战";
  const currentEndlessChapter = Math.max(1, Math.floor((Math.max(bestEndlessLayer, ENDLESS_START_LAYER) - ENDLESS_START_LAYER) / 5) + 1);
  const currentEndlessChapterLabel = `第 ${currentEndlessChapter} 章`;
  const currentEndlessChapterPreview = getEndlessChapterPreview(bestEndlessLayer > 0 ? bestEndlessLayer : ENDLESS_START_LAYER);
  const currentEndlessChapterBoss = currentEndlessChapterPreview.bossTitle;
  const todayDailyPreview = getDailyMutatorPreview(todayDailySeed);
  const currentDailyMutatorLabel = todayDailyPreview.label;
  const currentDailyRewardLabel = todayDailyPreview.rewardLabel;
  const visibleSettlement = lastSettlement;
  const selectedRunArchetypeConfig = getRunArchetypeConfig(selectedRunArchetype);
  const highestMainlineOrder = Math.max(
    activeRun?.runMode === "mainline" ? activeRun.latestLevelOrder : 0,
    lastSettlement?.runMode === "mainline" ? lastSettlement.reachedLevelOrder : 0,
    achievements["mainline-first-clear"] ? 20 : 0,
  );
  const settlementTitle = visibleSettlement?.runMode === "endless"
    ? "无尽结算"
    : visibleSettlement?.runMode === "daily"
      ? "每日结算"
      : "主线通关";
  const upgradeCards = UPGRADES.map((upgrade) => {
    const level = upgrades[upgrade.id];
    const nextCost = upgrade.costs[level] ?? null;
    return {
      ...upgrade,
      level,
      nextCost,
      isMaxed: nextCost === null,
      canPurchase: nextCost !== null && bankedCoins >= nextCost,
      currentEffect: level > 0 ? upgrade.effectText[level - 1] : "未解锁",
      nextEffect: nextCost !== null ? upgrade.effectText[level] : "已满级",
    };
  });
  const routeProgress = getPreferredRouteProgress(upgrades, selectedRouteFocus);
  const routeGrowthStatus = getRouteGrowthStatus(selectedRouteFocus, upgrades, routeProgress);
  const routeFocusCards = ROUTE_FOCUS_CONFIGS.map((focus) => {
    const masteryLevel = focus.id === "auto" ? routeProgress.routeMasteryLevel : getRouteFocusMasteryLevel(focus.id, upgrades);
    return {
      ...focus,
      masteryLevel,
      isActive: focus.id === selectedRouteFocus,
      resolvedLabel:
        focus.id === "auto"
          ? routeProgress.preferredRoute
            ? `${routeProgress.focusLabel} · ${routeProgress.routeMasteryLevel} 档`
            : "自动偏好 · 尚未成线"
          : `${focus.route} · ${masteryLevel} 档`,
    };
  });
  return (
    <main className={styles.shell} aria-label="胡了卜网页试玩">
      {screen !== "playing" ? (
        <section className={styles.surface}>
          <header className={styles.topbar}>
            <div className={styles.brandBlock}>
              <span className={styles.eyebrow}>DreamChasers 游戏馆</span>
              <div className={styles.titleRow}>
                <strong className={styles.title}>胡了卜</strong>
                <span className={styles.versionTag}>主线 20 关</span>
              </div>
              <p className={styles.subtitle}>直接开局，只看必要状态。</p>
            </div>
            <div className={styles.topbarActions}>
              <Link className={styles.backLink} href="/games">
                返回游戏馆
              </Link>
              <a className={styles.tunerLink} href="/games/hulebu-demo/tuner.html" rel="noreferrer" target="_blank">
                调牌器
              </a>
            </div>
          </header>

          {screen === "settlement" && visibleSettlement ? (
            <section
              className={styles.settlementPanel}
              aria-label="本轮结算"
            >
              <div className={styles.resultHeader}>
                <div className={styles.resultBadge}>
                  <Coins size={16} strokeWidth={2.2} />
                  <span>结算</span>
                </div>
                <strong className={styles.resultTitle}>{settlementTitle}</strong>
              </div>
              <div className={styles.metricsGrid}>
                <article className={styles.metric}>
                  <span>
                    {visibleSettlement.runMode === "endless"
                      ? "到达层数"
                      : visibleSettlement.runMode === "daily"
                        ? "每日种子"
                        : "到达关卡"}
                  </span>
                  <strong>
                    {visibleSettlement.runMode === "daily"
                      ? visibleSettlement.dailySeed ?? todayDailySeed
                      : `第 ${visibleSettlement.runMode === "endless"
                        ? visibleSettlement.reachedEndlessLayer
                        : visibleSettlement.reachedLevelOrder} ${visibleSettlement.runMode === "endless" ? "层" : "关"}`}
                  </strong>
                </article>
                <article className={styles.metric}>
                  <span>本轮铜钱</span>
                  <strong>+{visibleSettlement.coinsEarned}</strong>
                </article>
                <article className={styles.metric}>
                  <span>累计铜钱</span>
                  <strong>{visibleSettlement.bankedCoins}</strong>
                </article>
                <article className={styles.metric}>
                  <span>
                    {visibleSettlement.runMode === "endless"
                      ? "当前章节"
                      : visibleSettlement.runMode === "daily"
                        ? "连续参与"
                        : "已选奖励"}
                  </span>
                  <strong>
                    {visibleSettlement.runMode === "endless"
                      ? visibleSettlement.endlessChapterLabel ?? currentEndlessChapterLabel
                      : visibleSettlement.runMode === "daily"
                        ? `${visibleSettlement.dailyStreak} 天`
                        : visibleSettlement.pickedRewards}
                  </strong>
                </article>
              </div>
              <div className={styles.primaryActions}>
                <button className={styles.primaryButton} type="button" onClick={restartRun}>
                  <RotateCcw size={16} strokeWidth={2.2} />
                  <span>再来一轮</span>
                </button>
                <button className={styles.secondaryButton} type="button" onClick={() => setScreen("lobby")}>
                  <LayoutDashboard size={16} strokeWidth={2.2} />
                  <span>返回局外</span>
                </button>
              </div>
            </section>
          ) : (
            <section className={styles.lobbyLayout} aria-label="胡了卜局外首页">
              <section className={styles.mainPanel}>
                <div className={styles.heroMeta}>
                  <span className={styles.heroTag}>{panelContent[panel].eyebrow}</span>
                  <div className={styles.coinPill}>
                    <Coins size={16} strokeWidth={2.2} />
                    <span>局外铜钱 {bankedCoins}</span>
                  </div>
                </div>
                <strong className={styles.heroTitle}>{panelContent[panel].title}</strong>
                <p className={styles.heroDescription}>{panelContent[panel].description}</p>
                <div className={styles.statusRow}>
                  <article className={styles.statusCard}>
                    <span>当前主线</span>
                    <strong>20 关开放</strong>
                    <p>第 10 关终局试炼，第 20 关胡了卜王 Boss。</p>
                  </article>
                  <article className={styles.statusCard}>
                    <span>无尽最高</span>
                    <strong>{endlessSummary}</strong>
                    <p>无尽牌山从第 21 层开始，本地保存最高层记录。</p>
                  </article>
                  <article className={styles.statusCard}>
                    <span>今日牌局</span>
                    <strong>{todayBestDailyLevel > 0 ? `第 ${todayBestDailyLevel} 关` : "等待开局"}</strong>
                    <p>固定日 seed：{todayDailySeed}。今天所有本地试玩都走同一局骨架。</p>
                  </article>
                  <article className={styles.statusCard}>
                    <span>本页状态</span>
                    <strong>{panelContent[panel].status}</strong>
                    <p>{activeRun ? activeRun.latestSummary : "准备开局"}</p>
                  </article>
                </div>
                <div className={styles.primaryActions}>
                  {activeRun ? (
                    <>
                      <button className={styles.primaryButton} type="button" onClick={continueRun}>
                        <RotateCcw size={16} strokeWidth={2.2} />
                        <span>继续本轮</span>
                      </button>
                      <button className={styles.secondaryButton} type="button" onClick={startRun}>
                        <Play size={16} strokeWidth={2.2} />
                        <span>新开一轮</span>
                      </button>
                    </>
                  ) : (
                    <button className={styles.primaryButton} type="button" onClick={startRun}>
                      <Play size={16} strokeWidth={2.2} />
                      <span>开始挑战</span>
                    </button>
                  )}
                  {panel === "endless" ? (
                    <button className={styles.primaryButton} type="button" onClick={startEndlessRun}>
                      <Swords size={16} strokeWidth={2.2} />
                      <span>开始无尽</span>
                    </button>
                  ) : panel === "daily" ? (
                    <button className={styles.primaryButton} type="button" onClick={startDailyRun}>
                      <ScrollText size={16} strokeWidth={2.2} />
                      <span>开始今日牌局</span>
                    </button>
                  ) : panel === "ascension" ? (
                    <>
                      <button
                        className={styles.primaryButton}
                        type="button"
                        onClick={() => startAscensionRun(selectedAscensionLevel)}
                      >
                        <Lock size={16} strokeWidth={2.2} />
                        <span>开始高阶周目</span>
                      </button>
                      <button
                        className={styles.secondaryButton}
                        type="button"
                        onClick={() => startAscensionRun(nextAscensionUnlock)}
                        disabled={nextAscensionUnlock > highestUnlockedAscension + 1 && highestUnlockedAscension < 4}
                      >
                        <Lock size={16} strokeWidth={2.2} />
                        <span>预览下一档</span>
                      </button>
                    </>
                  ) : null}
                  {!activeRun ? (
                    <button
                      className={styles.secondaryButton}
                      type="button"
                      disabled
                      onClick={continueRun}
                    >
                      <RotateCcw size={16} strokeWidth={2.2} />
                      <span>继续本轮</span>
                    </button>
                  ) : null}
                </div>
                {panel === "mainline" || panel === "endless" || panel === "daily" || panel === "ascension" ? (
                  <section className={styles.runArchetypePanel} aria-label="局内流派">
                    <div className={styles.routeFocusHeader}>
                      <strong>局内流派</strong>
                      <span>长期强度靠局外，这一局真正怎么打，在开局前这里定。局外偏好只轻补一刀。</span>
                    </div>
                    <div className={styles.runArchetypeStatusGrid}>
                      <article className={styles.routeFocusStatusCard}>
                        <span>本局主轴</span>
                        <strong>{selectedRunArchetypeConfig.label}</strong>
                        <p>{selectedRunArchetypeConfig.summary}</p>
                      </article>
                      <article className={styles.routeFocusStatusCard}>
                        <span>起手加成</span>
                        <strong>{selectedRunArchetypeConfig.startBonus}</strong>
                        <p>会随 `runArchetype` 一起传进内层牌桌，优先主导本局起手、奖励、事件和 Boss 偏置。</p>
                      </article>
                    </div>
                    <div className={styles.runArchetypeGrid}>
                      {RUN_ARCHETYPES.map((archetype) => {
                        const availability = getRunArchetypeAvailability(archetype.id, panel, highestMainlineOrder);
                        return (
                          <article
                            key={archetype.id}
                            className={`${styles.runArchetypeCard} ${selectedRunArchetype === archetype.id ? styles.runArchetypeCardActive : ""}`}
                          >
                            <div className={styles.routeFocusHead}>
                              <span>{archetype.label}</span>
                              <strong>{archetype.summary}</strong>
                            </div>
                            <div className={styles.runArchetypeMeta}>
                              <span>起手加成</span>
                              <strong>{archetype.startBonus}</strong>
                            </div>
                            <div className={styles.runArchetypeMeta}>
                              <span>奖励偏置</span>
                              <strong>{archetype.rewardBias}</strong>
                            </div>
                            <div className={styles.runArchetypeMeta}>
                              <span>{availability.label}</span>
                              <strong>{availability.detail}</strong>
                            </div>
                            <button
                              className={styles.secondaryButton}
                              type="button"
                              disabled={availability.disabled}
                              onClick={() => setSelectedRunArchetype(archetype.id)}
                            >
                              <Swords size={16} strokeWidth={2.2} />
                              <span>{selectedRunArchetype === archetype.id ? "本局已选" : availability.disabled ? "暂未引导" : "选这局打法"}</span>
                            </button>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ) : null}
                {panel === "mainline" || panel === "endless" || panel === "daily" ? null : (
                  <ul className={styles.bulletList}>
                    {panelContent[panel].bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {panel === "upgrades" ? (
                  <>
                    <section className={styles.upgradeGrid} aria-label="局外升级">
                      {upgradeCards.map((upgrade) => (
                        <article key={upgrade.id} className={styles.upgradeCard}>
                          <div className={styles.upgradeHead}>
                            <div className={styles.upgradeTitleBlock}>
                              <span className={styles.upgradeLabel}>{upgrade.label}</span>
                              <strong className={styles.upgradeLevel}>Lv.{upgrade.level}</strong>
                            </div>
                            <span className={styles.upgradeEffect}>{upgrade.currentEffect}</span>
                          </div>
                          <p className={styles.upgradeDescription}>{upgrade.description}</p>
                          <div className={styles.upgradeMeta}>
                            <span>下一档</span>
                            <strong>{upgrade.nextEffect}</strong>
                          </div>
                          <div className={styles.upgradeActions}>
                            <span className={styles.upgradeCost}>
                              {upgrade.nextCost === null ? "已满级" : `花费 ${upgrade.nextCost} 铜钱`}
                            </span>
                            <button
                              className={styles.secondaryButton}
                              type="button"
                              disabled={!upgrade.canPurchase}
                              onClick={() => purchaseUpgrade(upgrade.id)}
                            >
                              <Coins size={16} strokeWidth={2.2} />
                              <span>{upgrade.isMaxed ? "已满级" : "购买"}</span>
                            </button>
                          </div>
                        </article>
                      ))}
                    </section>
                    <section className={styles.routeFocusPanel} aria-label="局外偏好">
                      <div className={styles.routeFocusHeader}>
                        <strong>局外偏好</strong>
                        <span>这里只保留长期倾向和轻协同，不再定义这一局的身份，也不再和局内流派抢主轴。</span>
                      </div>
                      <div className={styles.routeFocusStatusGrid}>
                        <article className={styles.routeFocusStatusCard}>
                          <span>当前偏好</span>
                          <strong>{routeProgress.preferredRoute ? `${routeProgress.focusLabel} · ${routeProgress.routeMasteryLevel} 档` : "自动偏好 · 尚未成线"}</strong>
                          <p>{routeGrowthStatus.currentEffect}</p>
                        </article>
                        <article className={styles.routeFocusStatusCard}>
                          <span>下一步</span>
                          <strong>{routeProgress.preferredRoute ? "继续补这条长期线" : "先点亮一条长期线"}</strong>
                          <p>{routeGrowthStatus.nextTarget}</p>
                        </article>
                      </div>
                      <div className={styles.routeFocusGrid}>
                        {routeFocusCards.map((focus) => (
                          <article
                            key={focus.id}
                            className={`${styles.routeFocusCard} ${focus.isActive ? styles.routeFocusCardActive : ""}`}
                          >
                            <div className={styles.routeFocusHead}>
                              <span>{focus.label}</span>
                              <strong>{focus.resolvedLabel}</strong>
                            </div>
                            <p className={styles.routeFocusDescription}>{focus.description}</p>
                            <div className={styles.routeFocusMeta}>
                              <span>长期读法</span>
                              <strong>{focus.longTail}</strong>
                            </div>
                            <button
                              className={styles.secondaryButton}
                              type="button"
                              onClick={() => setSelectedRouteFocus(focus.id)}
                            >
                              <Flame size={16} strokeWidth={2.2} />
                              <span>{focus.isActive ? "当前偏好" : "设为长期偏好"}</span>
                            </button>
                          </article>
                        ))}
                      </div>
                    </section>
                  </>
                ) : null}
                {panel === "collection" ? (
                  <section className={styles.codexPanel} aria-label="胡了卜成就图鉴">
                    <div className={styles.codexSummary}>
                      <article className={styles.codexCard}>
                        <span>图鉴总览</span>
                        <strong>
                          {unlockedAchievementCount}/{ACHIEVEMENTS.length}
                        </strong>
                        <p>当前已解锁进度。</p>
                      </article>
                      <article className={styles.codexCard}>
                        <span>下一步</span>
                        <strong>{nextLockedAchievement?.title ?? "图鉴首批已齐"}</strong>
                        <p>{nextLockedAchievement?.hint ?? "当前批次已完成。"}</p>
                      </article>
                      <article className={styles.codexCard}>
                        <span>分类进度</span>
                        <strong>{achievementGroups.length} 组已开放</strong>
                        <p>按分类查看当前完成度。</p>
                      </article>
                    </div>
                    <div className={styles.codexGroupGrid}>
                      {achievementGroups.map((group) => (
                        <article key={group.id} className={styles.codexCard}>
                          <span>{group.label}</span>
                          <strong>
                            {group.unlocked}/{group.total}
                          </strong>
                          <p>{group.description}</p>
                        </article>
                      ))}
                    </div>
                    {achievementGroups.map((group) => (
                      <section key={group.id} className={styles.codexSection} aria-label={group.label}>
                        <div className={styles.codexSectionHead}>
                          <strong>{group.label}</strong>
                          <span>
                            {group.unlocked}/{group.total}
                          </span>
                        </div>
                        <div className={styles.codexGrid}>
                          {group.items.map((achievement) => (
                            <article
                              key={achievement.id}
                              className={`${styles.achievementCard} ${achievement.isUnlocked ? styles.achievementUnlocked : styles.achievementLocked} ${!achievement.isUnlocked && achievement.hidden ? styles.achievementHidden : ""}`}
                            >
                              <div className={styles.achievementHead}>
                                <span>{achievement.isUnlocked ? "已达成" : achievement.hidden ? "隐藏目标" : "未解锁"}</span>
                                <strong>{achievement.displayTitle}</strong>
                              </div>
                              <p className={styles.achievementDescription}>{achievement.displayDescription}</p>
                              <div className={styles.achievementMeta}>
                                <span>{achievement.displayMetaLabel}</span>
                                <strong>{achievement.displayMetaValue}</strong>
                              </div>
                            </article>
                          ))}
                        </div>
                      </section>
                    ))}
                  </section>
                ) : null}
                {panel === "ascension" ? (
                  <section className={styles.ascensionPanel} aria-label="高阶配置">
                    <div className={styles.ascensionSummary}>
                      <article className={styles.codexCard}>
                        <span>高阶配置</span>
                        <strong>{selectedAscensionConfig.name}</strong>
                        <p>
                          已开放 {highestUnlockedAscension}/4 档，当前选择这一档可装备 {selectedAscensionPerkSlots} 个高阶能力。
                        </p>
                      </article>
                      <article className={styles.codexCard}>
                        <span>当前装配</span>
                        <strong>{equippedAscensionLabels.length > 0 ? equippedAscensionLabels.join(" / ") : "未装备"}</strong>
                        <p>进入高阶 run 时直接生效。</p>
                      </article>
                      <article className={styles.codexCard}>
                        <span>能力图鉴</span>
                        <strong>{ascensionPerks.filter((perk) => perk.isUnlocked).length}/{ascensionPerks.length}</strong>
                        <p>随周目推进逐步解锁。</p>
                      </article>
                    </div>
                    <div className={styles.ascensionConfigGrid}>
                      {ASCENSION_CONFIGS.map((config) => (
                        <article key={config.level} className={styles.achievementCard}>
                          <div className={styles.achievementHead}>
                            <span>A{config.level}</span>
                            <strong>{config.name}</strong>
                          </div>
                          <p className={styles.achievementDescription}>{config.description}</p>
                          <p className={styles.achievementDescription}>{config.identity}</p>
                          <div className={styles.achievementMeta}>
                            <span>能力槽</span>
                            <strong>{config.perkSlots}</strong>
                          </div>
                          <div className={styles.achievementMeta}>
                            <span>这一档更偏</span>
                            <strong>{config.buildAngle}</strong>
                          </div>
                          <button
                            className={styles.secondaryButton}
                            type="button"
                            disabled={config.level > highestUnlockedAscension}
                            onClick={() => setSelectedAscensionLevel(config.level)}
                          >
                            <Lock size={16} strokeWidth={2.2} />
                            <span>{selectedAscensionLevel === config.level ? "当前周目" : config.level > highestUnlockedAscension ? "未解锁" : "选择周目"}</span>
                          </button>
                        </article>
                      ))}
                    </div>
                    <div className={styles.ascensionPerkHeader}>
                      <strong>高阶能力</strong>
                      <span>ascensionPerks</span>
                    </div>
                    <div className={styles.ascensionConfigGrid}>
                      {ascensionPerks.map((perk) => (
                        <article key={perk.id} className={styles.upgradeCard}>
                          <div className={styles.upgradeHead}>
                            <div className={styles.upgradeTitleBlock}>
                              <span className={styles.upgradeLabel}>{perk.label}</span>
                              <strong className={styles.upgradeLevel}>A{perk.unlockLevel}</strong>
                            </div>
                            <span className={styles.upgradeEffect}>
                              {perk.isUnlocked ? (perk.isEquipped ? "已装备" : "可装备") : "未解锁"}
                            </span>
                          </div>
                          <p className={styles.upgradeDescription}>{perk.description}</p>
                          <div className={styles.upgradeActions}>
                            <span className={styles.upgradeCost}>
                              {perk.isUnlocked ? "高阶能力" : `解锁于 ${ASCENSION_CONFIGS[perk.unlockLevel - 1]?.name ?? "更高周目"}`}
                            </span>
                            <button
                              className={styles.secondaryButton}
                              type="button"
                              disabled={!perk.isUnlocked || (!perk.isEquipped && equippedAscensionLoadout.length >= selectedAscensionPerkSlots)}
                              onClick={() => toggleAscensionPerk(perk.id)}
                            >
                              <Lock size={16} strokeWidth={2.2} />
                              <span>{perk.isEquipped ? "卸下" : "装备"}</span>
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : null}
                {visibleSettlement ? (
                  <div className={styles.lastRun}>
                    <span>最近一轮</span>
                    <strong>
                      {visibleSettlement.runMode === "endless"
                        ? `无尽第 ${visibleSettlement.reachedEndlessLayer} 层`
                        : visibleSettlement.runMode === "daily"
                          ? `每日 ${visibleSettlement.dailySeed ?? todayDailySeed}`
                          : "主线通关"}
                    </strong>
                  </div>
                ) : null}
              </section>

              <section className={styles.sidePanel}>
                <div className={styles.modeGrid}>
                  <button className={styles.modeButton} type="button" onClick={() => setPanel("mainline")}>
                    <Swords size={16} strokeWidth={2.2} />
                    <span>主线</span>
                  </button>
                  <button className={styles.modeButton} type="button" onClick={() => setPanel("upgrades")}>
                    <Flame size={16} strokeWidth={2.2} />
                    <span>升级</span>
                  </button>
                  <button className={styles.modeButton} type="button" onClick={() => setPanel("collection")}>
                    <BookOpen size={16} strokeWidth={2.2} />
                    <span>图鉴</span>
                  </button>
                  <button className={styles.modeButton} type="button" onClick={() => setPanel("endless")}>
                    <Lock size={16} strokeWidth={2.2} />
                    <span>无尽</span>
                  </button>
                  <button className={styles.modeButton} type="button" onClick={() => setPanel("daily")}>
                    <ScrollText size={16} strokeWidth={2.2} />
                    <span>每日</span>
                  </button>
                  <button className={styles.modeButton} type="button" onClick={() => setPanel("ascension")}>
                    <Lock size={16} strokeWidth={2.2} />
                    <span>高阶</span>
                  </button>
                </div>
                <section className={styles.previewPanel}>
                  <header className={styles.previewHeader}>
                    <span>{panelContent[panel].eyebrow}</span>
                    <strong>{panelContent[panel].status}</strong>
                  </header>
                  <p className={styles.previewDescription}>{panelContent[panel].description}</p>
                  {panel === "upgrades" ? (
                    <div className={styles.previewUpgradeList}>
                      {upgradeCards.map((upgrade) => (
                        <div key={upgrade.id} className={styles.previewUpgradeRow}>
                          <span>{upgrade.label}</span>
                          <strong>{upgrade.currentEffect}</strong>
                        </div>
                      ))}
                      <div className={styles.previewUpgradeRow}>
                        <span>局外偏好</span>
                        <strong>
                          {routeProgress.preferredRoute
                            ? `${routeProgress.focusLabel} · ${routeProgress.routeMasteryLevel} 档`
                            : "自动偏好 · 尚未成线"}
                        </strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>偏好当前收益</span>
                        <strong>{routeGrowthStatus.currentEffect}</strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>偏好下一步</span>
                        <strong>{routeGrowthStatus.nextTarget}</strong>
                      </div>
                    </div>
                  ) : panel === "mainline" ? (
                    <div className={styles.previewUpgradeList}>
                      <div className={styles.previewUpgradeRow}>
                        <span>主线长度</span>
                        <strong>20 关</strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>试炼关</span>
                        <strong>第 10 关</strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>终章 Boss</span>
                        <strong>第 20 关</strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>继续进度</span>
                        <strong>{activeRun ? `第 ${activeRun.latestLevelOrder} 关` : "尚未开局"}</strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>局内流派</span>
                        <strong>{selectedRunArchetypeConfig.label}</strong>
                      </div>
                    </div>
                  ) : null}
                  {panel === "endless" ? (
                    <div className={styles.previewUpgradeList}>
                      <div className={styles.previewUpgradeRow}>
                        <span>起始层</span>
                        <strong>第 {ENDLESS_START_LAYER} 层</strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>当前章节</span>
                        <strong>{currentEndlessChapterLabel}</strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>章节 Boss</span>
                        <strong>{currentEndlessChapterBoss}</strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>章节主题</span>
                        <strong>{currentEndlessChapterPreview.theme}</strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>无尽最高</span>
                        <strong>{bestEndlessLayer > 0 ? `第 ${bestEndlessLayer} 层` : "尚未挑战"}</strong>
                      </div>
                    </div>
                  ) : panel === "daily" ? (
                    <div className={styles.previewUpgradeList}>
                      <div className={styles.previewUpgradeRow}>
                        <span>今日 seed</span>
                        <strong>{todayDailySeed}</strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>今日词缀</span>
                        <strong>{currentDailyMutatorLabel}</strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>今日奖励</span>
                        <strong>{currentDailyRewardLabel}</strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>连续参与</span>
                        <strong>{dailyStreak > 0 ? `${dailyStreak} 天` : "今天是第一天"}</strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>今日最佳</span>
                        <strong>{todayBestDailyLevel > 0 ? `第 ${todayBestDailyLevel} 关` : "尚未挑战"}</strong>
                      </div>
                    </div>
                  ) : panel === "collection" ? (
                    <div className={styles.previewUpgradeList}>
                      <div className={styles.previewUpgradeRow}>
                        <span>当前进度</span>
                        <strong>
                          {unlockedAchievementCount}/{ACHIEVEMENTS.length}
                        </strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>最近目标</span>
                        <strong>{nextLockedAchievement?.title ?? "首批图鉴已齐"}</strong>
                      </div>
                    </div>
                  ) : panel === "ascension" ? (
                    <div className={styles.previewUpgradeList}>
                      <div className={styles.previewUpgradeRow}>
                        <span>当前周目</span>
                        <strong>{selectedAscensionConfig.name}</strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>下一档</span>
                        <strong>{highestUnlockedAscension >= 4 ? "已解锁上限" : ASCENSION_CONFIGS[nextAscensionUnlock - 1]?.name ?? "进行中"}</strong>
                      </div>
                      <div className={styles.previewUpgradeRow}>
                        <span>高阶能力</span>
                        <strong>{equippedAscensionLoadout.length}/{selectedAscensionPerkSlots}</strong>
                      </div>
                    </div>
                  ) : null}
                </section>
              </section>
            </section>
          )}
        </section>
      ) : null}

      {activeRun ? (
        <section
          className={`${styles.playStage} ${screen === "playing" ? styles.playStageVisible : styles.playStageHidden}`}
          aria-label="胡了卜牌桌"
        >
          <header className={styles.playShellBar}>
            <button className={styles.secondaryButton} type="button" onClick={() => setScreen("lobby")}>
              <LayoutDashboard size={16} strokeWidth={2.2} />
              <span>返回局外</span>
            </button>
            <div className={styles.playRunSummary}>
              <strong>
                {activeRun.ascensionLevel
                  ? `${activeRun.ascensionName ?? "高阶周目"} 进行中`
                  : activeRun.runMode === "endless"
                    ? "无尽进行中"
                    : activeRun.runMode === "daily"
                      ? "每日进行中"
                      : "主线进行中"}
              </strong>
              <span>
                {activeRun.ascensionLevel
                  ? `${activeRun.ascensionName ?? "高阶周目"} · 第 ${activeRun.latestLevelOrder} 关 · 铜钱 ${activeRun.latestCoins}`
                  : activeRun.runMode === "daily"
                    ? `${activeRun.dailySeed ?? todayDailySeed} · 第 ${activeRun.latestLevelOrder} 关 · 铜钱 ${activeRun.latestCoins}`
                    : `第 ${activeRun.runMode === "endless" ? activeRun.latestEndlessLayer : activeRun.latestLevelOrder} ${activeRun.runMode === "endless" ? "层" : "关"} · 铜钱 ${activeRun.latestCoins} · 奖励 ${activeRun.pickedRewards}`}
              </span>
            </div>
            <button className={styles.secondaryButton} type="button" onClick={restartRun}>
              <RotateCcw size={16} strokeWidth={2.2} />
              <span>重开本轮</span>
            </button>
          </header>
          <iframe className={styles.frame} src={activeRun.iframeSrc} title="胡了卜试玩 Demo" />
        </section>
      ) : null}
    </main>
  );
}
