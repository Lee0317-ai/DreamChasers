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
type SettlementResult = "completed" | "failed";
type RunMode = "mainline" | "endless" | "daily";
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
type AscensionReview = {
  build?: string;
  buildDetail?: string;
  keyGain?: string;
  keyMiss?: string;
  nextAdvice?: string;
  failureType?: string;
  detail?: string;
  mismatch?: string;
};
type AchievementId =
  | "mainline-first-clear"
  | "boss-hulebu-king"
  | "endless-first-step"
  | "endless-layer-25"
  | "daily-first-checkin"
  | "daily-clear"
  | "upgrade-first-buy"
  | "upgrade-all-basic";

type ActiveRun = {
  sessionKey: string;
  runMode: RunMode;
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

type SettlementState = {
  sessionKey: string;
  runMode: RunMode;
  ascensionLevel: AscensionLevel | null;
  ascensionName: string | null;
  ascensionPerks: AscensionPerkId[];
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
  ascensionReview: AscensionReview | null;
};

type UpgradeId = "reserve" | "shield" | "tools";

type UpgradeState = Record<UpgradeId, number>;

type PersistedShellState = {
  bankedCoins: number;
  bestEndlessLayer: number;
  bestAscensionLevel: AscensionLevel;
  dailyBestLevels: Record<string, number>;
  achievements: Record<string, string>;
  lastSettlement: SettlementState | null;
  upgrades: UpgradeState;
  equippedAscensionLoadout: AscensionPerkId[];
  unlockedAscensionPerks: Partial<Record<AscensionPerkId, boolean>>;
};

type AccountProgressState = {
  isSignedIn: boolean;
  syncReady: boolean;
  syncError: string | null;
};

type RemoteProgressState = Pick<
  PersistedShellState,
  "achievements" | "bankedCoins" | "bestAscensionLevel" | "bestEndlessLayer" | "dailyBestLevels"
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
  pickedRewards?: number;
  summary?: string;
  ascensionReview?: AscensionReview | null;
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

type UpgradeConfig = {
  id: UpgradeId;
  label: string;
  description: string;
  costs: number[];
  effectText: string[];
  param: "reserveBonus" | "shieldBonus" | "toolBonus";
};

type AchievementConfig = {
  id: AchievementId;
  title: string;
  description: string;
  hint: string;
};

type AscensionConfig = {
  level: AscensionLevel;
  name: string;
  description: string;
  modifiers: string[];
  perkSlots: number;
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
];

const ACHIEVEMENTS: AchievementConfig[] = [
  {
    id: "mainline-first-clear",
    title: "主线首通",
    description: "完成一轮主线通关。",
    hint: "把 20 关主线打穿一次。",
  },
  {
    id: "boss-hulebu-king",
    title: "胡了卜王",
    description: "击破第 20 关终章 Boss。",
    hint: "在主线终章拿下胡了卜王。",
  },
  {
    id: "endless-first-step",
    title: "无尽起步",
    description: "首次进入无尽牌山。",
    hint: "把无尽面板点开并打到第 21 层起步。",
  },
  {
    id: "endless-layer-25",
    title: "冲到 25 层",
    description: "无尽最高层达到第 25 层。",
    hint: "继续往后冲到第 25 层。",
  },
  {
    id: "daily-first-checkin",
    title: "每日打卡",
    description: "第一次挑战每日牌局。",
    hint: "今天先开一局每日。",
  },
  {
    id: "daily-clear",
    title: "每日完成",
    description: "任意一天完成过每日牌局。",
    hint: "把当天的每日打穿一次。",
  },
  {
    id: "upgrade-first-buy",
    title: "第一次升级",
    description: "买下任意一项局外升级。",
    hint: "先花一次铜钱。",
  },
  {
    id: "upgrade-all-basic",
    title: "三项全开",
    description: "三项基础升级都至少买过 1 级。",
    hint: "把备用槽、护符和初始道具都点到 1 级。",
  },
];

const ASCENSION_CONFIGS: AscensionConfig[] = [
  {
    level: 1,
    name: "东风场",
    description: "通关后的第一档高阶轮回，先把主线打熟，再开始加压。",
    modifiers: ["奖励铜钱略减", "Boss 目标更紧", "牌山更密一点"],
    perkSlots: 1,
  },
  {
    level: 2,
    name: "南风场",
    description: "在第一档之上再加一点限制，开始出现更明显的高阶味道。",
    modifiers: ["禁洗牌", "起始道具 -1", "高压模板更常见"],
    perkSlots: 1,
  },
  {
    level: 3,
    name: "西风场",
    description: "高阶配置开始真正成型，外层可装备能力会开始影响整轮手感。",
    modifiers: ["奖励池更偏能力", "连胜压力更明显", "高压关卡更密"],
    perkSlots: 2,
  },
  {
    level: 4,
    name: "北风场",
    description: "完整高阶轮回，外层能力和内层奖励都会一起压到位。",
    modifiers: ["外层能力槽上限提升", "高阶奖励池全开", "Boss 压力最大"],
    perkSlots: 3,
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

function sanitizeUpgrades(upgrades?: Partial<UpgradeState> | null): UpgradeState {
  return {
    reserve: Math.max(0, Math.min(2, Number(upgrades?.reserve) || 0)),
    shield: Math.max(0, Math.min(2, Number(upgrades?.shield) || 0)),
    tools: Math.max(0, Math.min(2, Number(upgrades?.tools) || 0)),
  };
}

function buildRunFrameSrc(sessionKey: string, upgrades: UpgradeState) {
  const params = new URLSearchParams({
    embed: "shell",
    session: sessionKey,
    reserveBonus: String(upgrades.reserve),
    shieldBonus: String(upgrades.shield),
    toolBonus: String(upgrades.tools),
  });
  return `${FRAME_BASE}?${params.toString()}`;
}

function buildEndlessFrameSrc(sessionKey: string, upgrades: UpgradeState) {
  const params = new URLSearchParams({
    embed: "shell",
    session: sessionKey,
    mode: "endless",
    startLayer: "21",
    reserveBonus: String(upgrades.reserve),
    shieldBonus: String(upgrades.shield),
    toolBonus: String(upgrades.tools),
  });
  return `${FRAME_BASE}?${params.toString()}`;
}

function buildDailyFrameSrc(sessionKey: string, upgrades: UpgradeState, dailySeed: string) {
  const params = new URLSearchParams({
    embed: "shell",
    session: sessionKey,
    mode: "daily",
    dailySeed,
    reserveBonus: String(upgrades.reserve),
    shieldBonus: String(upgrades.shield),
    toolBonus: String(upgrades.tools),
  });
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
  return upgrades.reserve + upgrades.shield + upgrades.tools;
}

function buildAchievementUnlocks(state: {
  lastSettlement: SettlementState | null;
  bestEndlessLayer: number;
  bestAscensionLevel: AscensionLevel;
  dailyBestLevels: Record<string, number>;
  upgrades: UpgradeState;
}) {
  const unlocks: Partial<Record<AchievementId, string>> = {};
  const now = new Date().toISOString();
  const hasAnyDaily = Object.keys(state.dailyBestLevels).length > 0;
  const hasAnyUpgrade = countUnlockedUpgrades(state.upgrades) > 0;
  const hasAllUpgrades = state.upgrades.reserve > 0 && state.upgrades.shield > 0 && state.upgrades.tools > 0;

  if (state.lastSettlement?.runMode === "mainline" && state.lastSettlement.result === "completed") {
    unlocks["mainline-first-clear"] = state.lastSettlement.summary ? now : now;
    if ((state.lastSettlement.reachedLevelOrder ?? 0) >= 20) {
      unlocks["boss-hulebu-king"] = now;
    }
  }

  if (state.bestEndlessLayer >= 21) {
    unlocks["endless-first-step"] = now;
  }
  if (state.bestEndlessLayer >= 25) {
    unlocks["endless-layer-25"] = now;
  }

  if (hasAnyDaily) {
    unlocks["daily-first-checkin"] = now;
  }
  if (Object.values(state.dailyBestLevels).some((level) => level > 0)) {
    unlocks["daily-clear"] = now;
  }

  if (hasAnyUpgrade) {
    unlocks["upgrade-first-buy"] = now;
  }
  if (hasAllUpgrades) {
    unlocks["upgrade-all-basic"] = now;
  }

  return unlocks;
}

function buildAscensionFrameSrc(
  sessionKey: string,
  upgrades: UpgradeState,
  ascensionLevel: AscensionLevel,
  equippedAscensionLoadout: AscensionPerkId[],
) {
  const ascension = ASCENSION_CONFIGS.find((item) => item.level === ascensionLevel) ?? ASCENSION_CONFIGS[0];
  const params = new URLSearchParams({
    embed: "shell",
    session: sessionKey,
    mode: "ascension",
    ascensionLevel: String(ascension.level),
    ascensionName: ascension.name,
    reserveBonus: String(upgrades.reserve),
    shieldBonus: String(upgrades.shield),
    toolBonus: String(upgrades.tools),
    ascensionPerkSlots: String(ascension.perkSlots),
    ascensionPerks: equippedAscensionLoadout.join(","),
  });
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
      achievements: {},
      lastSettlement: null,
      upgrades: DEFAULT_UPGRADES,
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
        achievements: {},
        lastSettlement: null,
        upgrades: DEFAULT_UPGRADES,
        equippedAscensionLoadout: [],
        unlockedAscensionPerks: {},
      };
    }
    const parsed = JSON.parse(raw) as PersistedShellState;
    const persistedSettlement = parsed.lastSettlement
      ? {
          ...parsed.lastSettlement,
          ascensionReview: parsed.lastSettlement.ascensionReview ?? null,
        }
      : null;
    return {
      bankedCoins: Number.isFinite(parsed.bankedCoins) ? parsed.bankedCoins : 0,
      bestEndlessLayer: Number.isFinite(parsed.bestEndlessLayer) ? Math.max(0, parsed.bestEndlessLayer) : 0,
      bestAscensionLevel: sanitizeAscensionLevel((parsed as PersistedShellState & { bestAscensionLevel?: unknown }).bestAscensionLevel),
      dailyBestLevels: sanitizeDailyBestLevels((parsed as PersistedShellState & { dailyBestScores?: Record<string, unknown> }).dailyBestLevels ?? (parsed as PersistedShellState & { dailyBestScores?: Record<string, unknown> }).dailyBestScores),
      achievements: sanitizeAchievements((parsed as PersistedShellState & { achievements?: Record<string, unknown> }).achievements),
      lastSettlement: persistedSettlement,
      upgrades: sanitizeUpgrades(parsed.upgrades),
      equippedAscensionLoadout: sanitizeAscensionLoadout((parsed as PersistedShellState & { equippedAscensionLoadout?: unknown }).equippedAscensionLoadout),
      unlockedAscensionPerks: sanitizeUnlockedAscensionPerks((parsed as PersistedShellState & { unlockedAscensionPerks?: Record<string, unknown> }).unlockedAscensionPerks),
    };
  } catch {
    return {
      bankedCoins: 0,
      bestEndlessLayer: 0,
      bestAscensionLevel: DEFAULT_ASCENSION_LEVEL,
      dailyBestLevels: {},
      achievements: {},
      lastSettlement: null,
      upgrades: DEFAULT_UPGRADES,
      equippedAscensionLoadout: [],
      unlockedAscensionPerks: {},
    };
  }
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
  const [achievements, setAchievements] = useState<Record<string, string>>({});
  const [activeRun, setActiveRun] = useState<ActiveRun | null>(null);
  const [lastSettlement, setLastSettlement] = useState<SettlementState | null>(null);
  const [upgrades, setUpgrades] = useState<UpgradeState>(DEFAULT_UPGRADES);
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
  const todayDailySeed = useMemo(() => getTodayDailySeed(), []);
  const todayBestDailyLevel = dailyBestLevels[todayDailySeed] ?? 0;
  const unlockedAchievementCount = Object.keys(achievements).length;
  const nextLockedAchievement = ACHIEVEMENTS.find((achievement) => !achievements[achievement.id]) ?? null;
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
  const ascensionBuildSummary = useMemo(
    () => summarizeAscensionBuild(equippedAscensionLoadout),
    [equippedAscensionLoadout],
  );
  const ascensionBuildFocus = useMemo(
    () => describeAscensionBuildFocus(equippedAscensionLoadout),
    [equippedAscensionLoadout],
  );

  useEffect(() => {
    const persisted = readPersistedShellState();
    setBankedCoins(persisted.bankedCoins);
    setBestEndlessLayer(persisted.bestEndlessLayer);
    setBestAscensionLevel(persisted.bestAscensionLevel);
    setDailyBestLevels(persisted.dailyBestLevels);
    setAchievements(
      mergeAchievementMap(
        persisted.achievements,
        buildAchievementUnlocks({
          lastSettlement: persisted.lastSettlement,
          bestEndlessLayer: persisted.bestEndlessLayer,
          bestAscensionLevel: persisted.bestAscensionLevel,
          dailyBestLevels: persisted.dailyBestLevels,
          upgrades: persisted.upgrades,
        }),
      ),
    );
    setLastSettlement(persisted.lastSettlement);
    setUpgrades(persisted.upgrades);
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

        setBankedCoins(mergedBankedCoins);
        setBestEndlessLayer(mergedBestEndless);
        setBestAscensionLevel(mergedBestAscension);
        setSelectedAscensionLevel(mergedBestAscension);
        setDailyBestLevels(mergedDailyBestLevels);
        setAchievements((current) => mergeAchievementMap(mergedAchievements, current));
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
      achievements,
      lastSettlement,
      upgrades,
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
    hydrated,
    lastSettlement,
    upgrades,
    equippedAscensionLoadout,
    unlockedAscensionPerks,
  ]);

  const startRun = useCallback(() => {
    const sessionKey = createSessionKey();
      setActiveRun({
        sessionKey,
        runMode: "mainline",
        ascensionLevel: null,
        ascensionName: null,
        ascensionPerks: [],
        dailySeed: null,
        iframeSrc: buildRunFrameSrc(sessionKey, upgrades),
      latestCoins: 0,
      latestScore: 0,
      latestLevelOrder: 1,
      latestEndlessLayer: 0,
      latestSummary: "第 1 关准备开始",
      pickedRewards: 0,
    });
    setPanel("mainline");
    setScreen("playing");
  }, [upgrades]);

  const startEndlessRun = useCallback(() => {
    const sessionKey = createSessionKey();
      setActiveRun({
        sessionKey,
        runMode: "endless",
        ascensionLevel: null,
        ascensionName: null,
        ascensionPerks: [],
        dailySeed: null,
        iframeSrc: buildEndlessFrameSrc(sessionKey, upgrades),
      latestCoins: 0,
      latestScore: 0,
      latestLevelOrder: ENDLESS_START_LAYER,
      latestEndlessLayer: ENDLESS_START_LAYER,
      latestSummary: `无尽第 ${ENDLESS_START_LAYER} 层准备开始`,
      pickedRewards: 0,
    });
    setPanel("endless");
    setScreen("playing");
  }, [upgrades]);

  const startDailyRun = useCallback(() => {
    const sessionKey = createSessionKey();
      setActiveRun({
        sessionKey,
        runMode: "daily",
        ascensionLevel: null,
        ascensionName: null,
        ascensionPerks: [],
        dailySeed: todayDailySeed,
        iframeSrc: buildDailyFrameSrc(sessionKey, upgrades, todayDailySeed),
      latestCoins: 0,
      latestScore: 0,
      latestLevelOrder: 1,
      latestEndlessLayer: 0,
      latestSummary: `每日牌局 ${todayDailySeed} 准备开始`,
      pickedRewards: 0,
    });
    setPanel("daily");
    setScreen("playing");
  }, [todayDailySeed, upgrades]);

  const startAscensionRun = useCallback(
    (ascensionLevel: AscensionLevel) => {
      const sessionKey = createSessionKey();
      const ascension = ASCENSION_CONFIGS.find((item) => item.level === ascensionLevel) ?? ASCENSION_CONFIGS[0];
      const allowedLoadout = equippedAscensionLoadout.slice(0, getAscensionPerkSlots(ascensionLevel));
      setActiveRun({
        sessionKey,
        runMode: "mainline",
        ascensionLevel,
        ascensionName: ascension.name,
        ascensionPerks: allowedLoadout,
        dailySeed: null,
        iframeSrc: buildAscensionFrameSrc(sessionKey, upgrades, ascensionLevel, allowedLoadout),
        latestCoins: 0,
        latestScore: 0,
        latestLevelOrder: 1,
        latestEndlessLayer: 0,
        latestSummary: `${ascension.name} 第 1 关准备开始`,
        pickedRewards: 0,
      });
      setPanel("ascension");
      setScreen("playing");
    },
    [equippedAscensionLoadout, upgrades],
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
    if ((activeRun?.runMode ?? lastSettlement?.runMode) === "endless") {
      startEndlessRun();
      return;
    }
    if ((activeRun?.runMode ?? lastSettlement?.runMode) === "daily") {
      startDailyRun();
      return;
    }
    if (activeRun?.ascensionLevel ?? lastSettlement?.ascensionLevel) {
      startAscensionRun((activeRun?.ascensionLevel ?? lastSettlement?.ascensionLevel)!);
      return;
    }
    startRun();
  }, [activeRun?.ascensionLevel, activeRun?.runMode, lastSettlement?.ascensionLevel, lastSettlement?.runMode, startAscensionRun, startDailyRun, startEndlessRun, startRun]);

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
      if (!activeRun || data.payload.sessionKey !== activeRun.sessionKey) return;

      if (data.type === "hulebu:run-progress") {
        setActiveRun((current) => {
          if (!current || current.sessionKey !== data.payload?.sessionKey) return current;
          return {
            ...current,
            latestCoins: data.payload.coins ?? current.latestCoins,
            latestScore: data.payload.score ?? current.latestScore,
            latestLevelOrder: data.payload.levelOrder ?? current.latestLevelOrder,
            latestEndlessLayer: data.payload.endlessLayer ?? current.latestEndlessLayer,
            latestSummary: data.payload.summary ?? current.latestSummary,
            pickedRewards: data.payload.pickedRewards ?? current.pickedRewards,
          };
        });
        return;
      }

      if (lastSettlement?.sessionKey === data.payload.sessionKey) return;

      const coinsEarned = Math.max(0, data.payload.coins ?? 0);
      const updatedBank = bankedCoins + coinsEarned;
      const runMode = data.payload.runMode ?? activeRun.runMode;
      const ascensionLevel = data.payload.ascensionLevel ?? activeRun.ascensionLevel;
      const ascensionName = data.payload.ascensionName ?? activeRun.ascensionName;
      const dailySeed = data.payload.dailySeed ?? activeRun.dailySeed;
      const reachedEndlessLayer =
        runMode === "endless" ? data.payload.endlessLayer ?? activeRun.latestEndlessLayer : 0;
      const updatedBestEndlessLayer =
        runMode === "endless" ? Math.max(bestEndlessLayer, reachedEndlessLayer) : bestEndlessLayer;
      const dailyLevelOrder = runMode === "daily" ? Math.max(1, data.payload.levelOrder ?? activeRun.latestLevelOrder) : 0;
      const updatedBestDailyLevelOrder =
        runMode === "daily" && dailySeed
          ? Math.max(dailyBestLevels[dailySeed] ?? 0, dailyLevelOrder)
          : 0;
      const settlement: SettlementState = {
        sessionKey: data.payload.sessionKey ?? activeRun.sessionKey,
        runMode,
        ascensionLevel,
        ascensionName,
        ascensionPerks: activeRun.ascensionPerks,
        dailySeed,
        result: data.type === "hulebu:run-complete" ? "completed" : "failed",
        coinsEarned,
        bankedCoins: updatedBank,
        reachedLevelOrder: data.payload.levelOrder ?? activeRun.latestLevelOrder,
        reachedEndlessLayer,
        bestEndlessLayer: updatedBestEndlessLayer,
        bestDailyLevelOrder: updatedBestDailyLevelOrder,
        pickedRewards: data.payload.pickedRewards ?? activeRun.pickedRewards,
        summary: data.payload.summary ?? activeRun.latestSummary,
        ascensionReview: data.payload.ascensionReview ?? null,
      };

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
            upgrades,
          }),
        ),
      );
      setLastSettlement(settlement);
      setActiveRun(null);
      setScreen("settlement");
    }

    window.addEventListener("message", handleShellMessage);
    return () => window.removeEventListener("message", handleShellMessage);
  }, [activeRun, bankedCoins, bestAscensionLevel, bestEndlessLayer, dailyBestLevels, lastSettlement, nextAscensionUnlock, upgrades]);

  const panelContent = useMemo<Record<LobbyPanel, PanelContent>>(
    () => ({
      mainline: {
        eyebrow: "主线 20 关",
        title: "胡了卜正在往完整体验版走",
        description: "当前主线已经开放到第 20 关，并保留特殊事件、残局收官、第 10 关终局试炼和第 20 关胡了卜王 Boss。",
        bullets: [
          "第 1-4 关教学碰 / 吃 / 杠 / 胡",
          "第 5-19 关逐步提高牌山压力和事件干扰",
          "第 20 关以胡了卜王六项目标作为终章",
        ],
        status: activeRun
          ? `当前可继续到第 ${activeRun.latestLevelOrder} 关`
          : "适合直接开一轮完整网页试玩",
      },
      upgrades: {
        eyebrow: "局外升级",
        title: "铜钱现在能真正花出去了",
        description: "只有带回局外的铜钱才会记录在升级里。牌已经进卡槽后，就不再算记牌器，也不会拿来做局外资产。",
        bullets: [
          "备用槽：给主线 run 增加一档容错",
          "满槽护符：在临界失败前提供一次缓冲",
          "初始道具：提高洗牌 / 撤回 / 丢弃的开局次数",
        ],
        status: "当前已开放购买，并会带进下一轮牌山",
      },
      collection: {
        eyebrow: "成就图鉴",
        title: "长期进度现在开始往图鉴里沉淀了",
        description: "第一版先把主线、无尽、每日和局外升级这几条长期信号收进本地图鉴。先让你看见进度，再逐步补事件词条、Boss 记录和路线收藏。",
        bullets: [
          "主线首通和胡了卜王会留下已达成标记",
          "无尽层数、每日打卡和今日破关会进长期记录",
          "三项局外升级也会变成可见的成长里程碑",
        ],
        status: `${unlockedAchievementCount}/${ACHIEVEMENTS.length} 项已解锁`,
      },
      endless: {
        eyebrow: "无尽模式",
        title: "第 21 层之后就是无尽牌山",
        description: "无尽第一版复用当前密集牌山、特殊压力和路线型奖励池，从第 21 层开始向后冲层，本地记录最高层。",
        bullets: [
          "第 21 层起步，每层都会重新生成牌山",
          "每 5 层出现 Boss 压力，奖励继续承接路线 build",
          "本地保存无尽最高层，后续再连接成就和高阶周目",
        ],
        status: bestEndlessLayer > 0 ? `无尽最高第 ${bestEndlessLayer} 层` : "已开放本地冲层",
      },
      daily: {
        eyebrow: "每日牌局",
        title: "今天这局已经可以真打了",
        description: "每日第一版使用固定日 seed，把当天牌山锁成同一局。先做本地最佳成绩和每日回访入口，后续再补成就、词缀和排行榜。",
        bullets: [
          `固定日 seed：${todayDailySeed}`,
          "局外页和结算面板都会显示今日最佳关数",
          "每天换一局，先承接回访，再逐步补长期系统",
        ],
        status: todayBestDailyLevel > 0 ? `今日最佳第 ${todayBestDailyLevel} 关` : "今日尚未挑战",
      },
      ascension: {
        eyebrow: "高阶周目",
        title: "通关之后，可以开始打更紧的轮回了",
        description: "高阶配置现在会先在局外页装备好，再带进试玩页。完整版先把四档周目、能力槽和高阶奖励骨架立起来。",
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

  const settlementTitle =
    lastSettlement?.runMode === "endless"
      ? "无尽结算"
      : lastSettlement?.runMode === "daily"
        ? "每日结算"
      : lastSettlement?.result === "completed"
        ? "主线通关"
        : "本轮失利";
  const settlementNote =
    lastSettlement?.runMode === "endless"
      ? "无尽牌山先记下这次层数，回局外整顿后继续冲。"
      : lastSettlement?.runMode === "daily"
        ? `今日牌局 ${lastSettlement.dailySeed ?? todayDailySeed} 已结算，最好进度已经记下，明天再换一局。`
      : lastSettlement?.result === "completed"
      ? "胡了卜王这轮已经被你打穿了。"
      : "这轮先收下已结算铜钱，回局外整顿再来。";
  const settlementAscensionNote =
    lastSettlement?.ascensionLevel
      ? `${lastSettlement.ascensionName ?? "高阶周目"} · ${lastSettlement.ascensionPerks.length > 0 ? lastSettlement.ascensionPerks.join(", ") : "未装备高阶能力"}`
      : "";
  const settlementAscensionFocus = lastSettlement?.ascensionLevel
    ? describeAscensionBuildFocus(lastSettlement.ascensionPerks)
    : null;
  const settlementAscensionReview = lastSettlement?.ascensionReview ?? null;
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
  const achievementCards = ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlockedAt: achievements[achievement.id] ?? null,
    isUnlocked: Boolean(achievements[achievement.id]),
  }));

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
              <p className={styles.subtitle}>先在局外页落脚，再进入牌桌，这一版终于开始像完整游戏了。</p>
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

          {screen === "settlement" && lastSettlement ? (
            <section className={styles.settlementPanel} aria-label="本轮结算">
              <div className={styles.resultHeader}>
                <div className={styles.resultBadge}>
                  <Coins size={16} strokeWidth={2.2} />
                  <span>结算</span>
                </div>
                <strong className={styles.resultTitle}>{settlementTitle}</strong>
                <p className={styles.resultDescription}>{settlementNote}</p>
              </div>
              <div className={styles.metricsGrid}>
                <article className={styles.metric}>
                  <span>
                    {lastSettlement.runMode === "endless"
                      ? "到达层数"
                      : lastSettlement.runMode === "daily"
                        ? "每日种子"
                        : "到达关卡"}
                  </span>
                  <strong>
                    {lastSettlement.runMode === "daily"
                      ? lastSettlement.dailySeed ?? todayDailySeed
                      : `第 ${lastSettlement.runMode === "endless"
                        ? lastSettlement.reachedEndlessLayer
                        : lastSettlement.reachedLevelOrder} ${lastSettlement.runMode === "endless" ? "层" : "关"}`}
                  </strong>
                </article>
                <article className={styles.metric}>
                  <span>本轮铜钱</span>
                  <strong>+{lastSettlement.coinsEarned}</strong>
                </article>
                <article className={styles.metric}>
                  <span>累计铜钱</span>
                  <strong>{lastSettlement.bankedCoins}</strong>
                </article>
                <article className={styles.metric}>
                  <span>
                    {lastSettlement.runMode === "endless"
                      ? "无尽最高"
                      : lastSettlement.runMode === "daily"
                        ? "今日最佳"
                        : "已选奖励"}
                  </span>
                  <strong>
                    {lastSettlement.runMode === "endless"
                      ? `第 ${lastSettlement.bestEndlessLayer} 层`
                      : lastSettlement.runMode === "daily"
                        ? `第 ${lastSettlement.bestDailyLevelOrder} 关`
                        : lastSettlement.pickedRewards}
                  </strong>
                </article>
              </div>
              <p className={styles.resultSummary}>{lastSettlement.summary}</p>
              {settlementAscensionNote ? <p className={styles.resultSummary}>{settlementAscensionNote}</p> : null}
              {settlementAscensionFocus ? (
                <section className={styles.settlementReview} aria-label="高阶复盘">
                  <div className={styles.settlementReviewGrid}>
                    <article className={styles.settlementReviewCard}>
                      <span>当前构筑</span>
                      <strong>{settlementAscensionReview?.build ?? settlementAscensionFocus.build}</strong>
                      <p>{settlementAscensionReview?.buildDetail ?? settlementAscensionFocus.keyGain}</p>
                    </article>
                    <article className={styles.settlementReviewCard}>
                      <span>{lastSettlement.result === "failed" ? "失败归因" : "本轮高阶能力"}</span>
                      <strong>
                        {lastSettlement.result === "failed"
                          ? settlementAscensionReview?.failureType ?? "构筑失配"
                          : lastSettlement.ascensionPerks.length > 0
                            ? lastSettlement.ascensionPerks.join(", ")
                            : "未装备"}
                      </strong>
                      <p>
                        {lastSettlement.result === "failed"
                          ? settlementAscensionReview?.detail ?? "Boss 目标不匹配、容错耗尽或节奏断档会在这里拆开。"
                          : "这套能力已经跟着本轮结算一起记下来了。"}
                      </p>
                    </article>
                    <article className={styles.settlementReviewCard}>
                      <span>关键收益</span>
                      <strong>{settlementAscensionReview?.keyGain ?? (lastSettlement.pickedRewards > 0 ? `拿到 ${lastSettlement.pickedRewards} 个奖励` : "奖励段偏少")}</strong>
                      <p>{lastSettlement.runMode === "endless" ? "无尽层数推进已经记下。" : lastSettlement.runMode === "daily" ? "今日牌局进度已经记下。" : "主线推进和高阶压力都已经结算。"}</p>
                    </article>
                    <article className={styles.settlementReviewCard}>
                      <span>关键失误</span>
                      <strong>{settlementAscensionReview?.keyMiss ?? (lastSettlement.result === "failed" ? "Boss 目标不匹配" : "仍可继续压构筑")}</strong>
                      <p>{settlementAscensionReview?.mismatch ?? "构筑、目标完成度、容错和节奏都会在高阶失败后拆开看。"}</p>
                    </article>
                    <article className={styles.settlementReviewCard}>
                      <span>下一轮建议</span>
                      <strong>{settlementAscensionReview?.nextAdvice ?? settlementAscensionFocus.nextTip}</strong>
                      <p>{lastSettlement.result === "failed" ? "这一轮更适合先补短板，再追强度。" : "这一轮已经成型，可以继续往更高压打。"}</p>
                    </article>
                  </div>
                </section>
              ) : null}
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
                    <p>{activeRun ? activeRun.latestSummary : "先在局外页整顿，再决定这轮怎么开。"}</p>
                  </article>
                </div>
                <div className={styles.primaryActions}>
                  <button className={styles.primaryButton} type="button" onClick={startRun}>
                    <Play size={16} strokeWidth={2.2} />
                    <span>开始挑战</span>
                  </button>
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
                  <button
                    className={styles.secondaryButton}
                    type="button"
                    disabled={!activeRun}
                    onClick={continueRun}
                  >
                    <RotateCcw size={16} strokeWidth={2.2} />
                    <span>继续本轮</span>
                  </button>
                </div>
                <ul className={styles.bulletList}>
                  {panelContent[panel].bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {panel === "upgrades" ? (
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
                ) : null}
                {panel === "collection" ? (
                  <section className={styles.codexPanel} aria-label="胡了卜成就图鉴">
                    <div className={styles.codexSummary}>
                      <article className={styles.codexCard}>
                        <span>已解锁</span>
                        <strong>
                          {unlockedAchievementCount}/{ACHIEVEMENTS.length}
                        </strong>
                        <p>先用本地图鉴收住这几条长期进度。</p>
                      </article>
                      <article className={styles.codexCard}>
                        <span>下一步</span>
                        <strong>{nextLockedAchievement?.title ?? "图鉴首批已齐"}</strong>
                        <p>{nextLockedAchievement?.hint ?? "后续可以继续补事件词条和 Boss 记录。"}</p>
                      </article>
                    </div>
                    <div className={styles.codexGrid}>
                      {achievementCards.map((achievement) => (
                        <article
                          key={achievement.id}
                          className={`${styles.achievementCard} ${achievement.isUnlocked ? styles.achievementUnlocked : styles.achievementLocked}`}
                        >
                          <div className={styles.achievementHead}>
                            <span>{achievement.isUnlocked ? "已达成" : "未解锁"}</span>
                            <strong>{achievement.title}</strong>
                          </div>
                          <p className={styles.achievementDescription}>{achievement.description}</p>
                          <div className={styles.achievementMeta}>
                            <span>{achievement.isUnlocked ? "解锁时间" : "达成提示"}</span>
                            <strong>{achievement.isUnlocked ? achievement.unlockedAt?.slice(0, 10) : achievement.hint}</strong>
                          </div>
                        </article>
                      ))}
                    </div>
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
                        <span>equippedAscensionLoadout</span>
                        <strong>{equippedAscensionLoadout.length > 0 ? equippedAscensionLoadout.join(", ") : "未装备"}</strong>
                        <p>当前这套会在开始高阶 run 时直接写进 iframe 参数。当前构筑：{ascensionBuildSummary}。{ascensionBuildFocus.keyGain}</p>
                      </article>
                      <article className={styles.codexCard}>
                        <span>unlockedAscensionPerks</span>
                        <strong>{ascensionPerks.filter((perk) => perk.isUnlocked).length}/{ascensionPerks.length}</strong>
                        <p>随着周目推进，更多高阶能力会加入可装备列表。</p>
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
                          <div className={styles.achievementMeta}>
                            <span>能力槽</span>
                            <strong>{config.perkSlots}</strong>
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
                {lastSettlement ? (
                  <div className={styles.lastRun}>
                    <span>最近一轮</span>
                    <strong>
                      {lastSettlement.runMode === "endless"
                        ? `无尽第 ${lastSettlement.reachedEndlessLayer} 层`
                        : lastSettlement.runMode === "daily"
                          ? `每日 ${lastSettlement.dailySeed ?? todayDailySeed}`
                        : lastSettlement.result === "completed"
                          ? "主线通关"
                          : "本轮失利"}
                    </strong>
                    <p>
                      {lastSettlement.runMode === "endless"
                        ? `到达第 ${lastSettlement.reachedEndlessLayer} 层，历史最高第 ${lastSettlement.bestEndlessLayer} 层`
                        : lastSettlement.runMode === "daily"
                          ? `今日到达第 ${lastSettlement.reachedLevelOrder} 关，最佳第 ${lastSettlement.bestDailyLevelOrder} 关`
                        : `到达第 ${lastSettlement.reachedLevelOrder} 关`}
                      ，结算 +{lastSettlement.coinsEarned} 铜钱，局外累计 {lastSettlement.bankedCoins}。
                    </p>
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
                    </div>
                  ) : null}
                  {panel === "endless" ? (
                    <div className={styles.previewUpgradeList}>
                      <div className={styles.previewUpgradeRow}>
                        <span>起始层</span>
                        <strong>第 {ENDLESS_START_LAYER} 层</strong>
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
