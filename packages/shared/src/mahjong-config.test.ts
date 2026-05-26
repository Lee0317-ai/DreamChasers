import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createContext, runInContext } from "node:vm";
import { describe, expect, it } from "vitest";
import {
  applyReward,
  createMahjongState,
  getAvailableBoardTiles,
  getComboCandidates,
  getRemainingTileCounts,
  getSlotStatus,
  type MahjongGameState,
  type MahjongRank,
  type MahjongReward,
  type MahjongRewardEffect,
  type MahjongSuit,
  type MahjongTile,
  type MahjongTileLocation,
  type MahjongToolType,
} from "./mahjong-game";

interface CoordinateSystemConfig {
  baseWidth: number;
  baseHeight: number;
  tileWidth: number;
  tileHeight: number;
  origin: "top_left";
}

interface MahjongDefaultsConfig {
  slotLimit: number;
  reserveLimit: number;
  shields: number;
  firstProtect: boolean;
  tools: Record<MahjongToolType, number>;
  clearGoal: string;
}

interface MahjongLevelTileConfig extends MahjongTile {
  x: number;
  y: number;
  layer: number;
  blockedBy: string[];
  location: MahjongTileLocation;
}

type MahjongBossGoalConfig =
  | {
      type: "combo_count";
      combo: "chi" | "peng" | "gang" | "hu";
      target: number;
    }
  | {
      type: "suit_set";
      suits: MahjongSuit[];
      eachTarget: number;
    }
  | {
      type: "score_target";
      target: number;
    };

interface MahjongLevelConfig {
  id: string;
  order: number;
  name: string;
  subtitle: string;
  type: "validation" | "campaign";
  validationFocus?: string[];
  designGoal?: string;
  featuredCombos?: Array<"chi" | "peng" | "gang" | "hu">;
  bossGoals?: MahjongBossGoalConfig[];
  rewardPool: string[];
  initialSlotOrder: string[];
  initialReserveOrder: string[];
  tiles: MahjongLevelTileConfig[];
}

interface MahjongLevelsConfig {
  schemaVersion: number;
  moduleSlug: string;
  displayName: string;
  levelSet: string;
  coordinateSystem: CoordinateSystemConfig;
  defaults: MahjongDefaultsConfig;
  levels: MahjongLevelConfig[];
}

interface MahjongRewardConfig extends MahjongReward {
  rarity: "common" | "uncommon" | "rare";
  category: string;
  scope: "instant" | "run";
  description: string;
  effects: MahjongRewardEffect[];
}

interface MahjongRewardsConfig {
  schemaVersion: number;
  moduleSlug: string;
  displayName: string;
  rewardSet: string;
  rewards: MahjongRewardConfig[];
}

interface MahjongTilesConfig {
  schemaVersion: number;
  moduleSlug: string;
  displayName: string;
  suits: Array<{
    id: MahjongSuit;
    label: string;
    name: string;
    colorRole: string;
  }>;
  tileSet: Array<{
    id: string;
    suit: MahjongSuit;
    rank: MahjongRank;
    label: string;
  }>;
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const configRoot = path.join(repoRoot, "apps/game/mahjong-roguelike/config");
const prototypeHtmlPath = path.join(
  repoRoot,
  "apps/game/mahjong-roguelike/prototypes/config-playable/index.html",
);

const tilesConfig = readJson<MahjongTilesConfig>("tiles.json");
const levelsConfig = readJson<MahjongLevelsConfig>("levels.json");
const rewardsConfig = readJson<MahjongRewardsConfig>("rewards.json");

describe("胡了卜配置加载验证", () => {
  it("MVP 关卡和奖励配置保持基础契约", () => {
    expect(levelsConfig.moduleSlug).toBe("mahjong-roguelike");
    expect(tilesConfig.moduleSlug).toBe("mahjong-roguelike");
    expect(levelsConfig.displayName).toBe("胡了卜");
    expect(tilesConfig.displayName).toBe("胡了卜");
    expect(levelsConfig.levelSet).toBe("mvp_v1");
    expect(levelsConfig.levels).toHaveLength(20);
    expect(rewardsConfig.moduleSlug).toBe("mahjong-roguelike");
    expect(rewardsConfig.displayName).toBe("胡了卜");
    expect(rewardsConfig.rewardSet).toBe("mvp_v1");
    expect(rewardsConfig.rewards).toHaveLength(10);
    expect(uniqueIds(levelsConfig.levels)).toHaveLength(levelsConfig.levels.length);
    expect(uniqueIds(tilesConfig.tileSet)).toHaveLength(tilesConfig.tileSet.length);
    expect(uniqueIds(rewardsConfig.rewards)).toHaveLength(rewardsConfig.rewards.length);
  });

  it("基础牌库包含东南西北中发白字牌", () => {
    const honorSuit = tilesConfig.suits.find((suit) => suit.id === "honor");
    const honorLabels = tilesConfig.tileSet
      .filter((tile) => tile.suit === "honor")
      .sort((a, b) => a.rank - b.rank)
      .map((tile) => tile.label);

    expect(honorSuit?.name).toBe("字牌");
    expect(honorLabels).toEqual(["东", "南", "西", "北", "中", "发", "白"]);
  });

  it("主槽固定为 8 格，扩容类奖励不再提高主槽上限", () => {
    expect(levelsConfig.defaults.slotLimit).toBe(8);

    const slotLimitRewards = rewardsConfig.rewards.filter((reward) => (
      reward.effects.some((effect) => effect.type === "slot_limit_delta" && effect.value > 0)
    ));

    expect(slotLimitRewards).toEqual([]);
  });

  it("每个关卡的引用都指向存在的牌和奖励", () => {
    const rewardIds = new Set(rewardsConfig.rewards.map((reward) => reward.id));

    for (const level of levelsConfig.levels) {
      const tileIds = new Set(level.tiles.map((tile) => tile.id));

      expect(level.rewardPool.length, `${level.id} should offer 3 reward choices`).toBe(3);
      expect(uniqueIds(level.tiles), `${level.id} should not duplicate tile ids`).toHaveLength(level.tiles.length);

      for (const rewardId of level.rewardPool) {
        expect(rewardIds.has(rewardId), `${level.id} references missing reward ${rewardId}`).toBe(true);
      }

      for (const tileId of [...level.initialSlotOrder, ...level.initialReserveOrder]) {
        expect(tileIds.has(tileId), `${level.id} references missing initial tile ${tileId}`).toBe(true);
      }

      for (const tile of level.tiles) {
        expect(tileIds.has(tile.id), `${level.id} includes duplicate or missing tile ${tile.id}`).toBe(true);

        for (const blockerId of tile.blockedBy) {
          expect(tileIds.has(blockerId), `${level.id} references missing blocker ${blockerId}`).toBe(true);
          expect(blockerId, `${level.id} tile ${tile.id} cannot block itself`).not.toBe(tile.id);
        }
      }
    }
  });

  it("Boss 关使用配置化多目标试炼", () => {
    const bossLevels = levelsConfig.levels.filter((level) => level.order % 10 === 0);

    expect(bossLevels.map((level) => level.order), "MVP content should include chapter bosses").toEqual([10, 20]);

    for (const level of bossLevels) {
      expect(level.bossGoals?.length, `${level.id} should define at least two boss goals`).toBeGreaterThanOrEqual(2);

      for (const goal of level.bossGoals ?? []) {
        if (goal.type === "combo_count") {
          expect(goal.target, `${level.id} boss combo target should be positive`).toBeGreaterThan(0);
          expect(["chi", "peng", "gang", "hu"]).toContain(goal.combo);
        } else if (goal.type === "suit_set") {
          expect(goal.eachTarget, `${level.id} boss suit target should be positive`).toBeGreaterThan(0);
          expect(goal.suits.length, `${level.id} boss suit set should include at least two suits`).toBeGreaterThanOrEqual(2);
          expect(new Set(goal.suits).size, `${level.id} boss suit set should not duplicate suits`).toBe(goal.suits.length);
          for (const suit of goal.suits) {
            expect(["wan", "tiao", "tong", "honor"]).toContain(suit);
          }
        } else {
          expect(goal.target, `${level.id} boss score target should be positive`).toBeGreaterThan(0);
          expect(goal.type, `${level.id} boss goal type should be supported`).toBe("score_target");
        }
      }
    }
  });

  it("20 关主线骨架保留奖励节点和 Boss 节点", () => {
    expect(levelsConfig.levels.map((level) => level.order)).toEqual(Array.from({ length: 20 }, (_, index) => index + 1));

    const rewardCheckpointOrders = levelsConfig.levels
      .filter((level) => level.designGoal?.includes("reward_checkpoint"))
      .map((level) => level.order);
    const bossOrders = levelsConfig.levels
      .filter((level) => level.bossGoals && level.bossGoals.length > 0)
      .map((level) => level.order);

    expect(rewardCheckpointOrders).toEqual([3, 6, 9, 13, 16, 19]);
    expect(bossOrders).toEqual([10, 20]);
  });

  it("第 10 关 Boss 包含三门齐牌型目标", () => {
    const level10 = levelsConfig.levels.find((level) => level.order === 10);
    const suitSetGoal = level10?.bossGoals?.find((goal): goal is Extract<MahjongBossGoalConfig, { type: "suit_set" }> => (
      goal.type === "suit_set"
    ));

    expect(suitSetGoal, "level 10 should include a suit_set boss goal").toBeDefined();
    expect(new Set(suitSetGoal?.suits)).toEqual(new Set(["wan", "tong", "tiao"]));
    expect(suitSetGoal?.eachTarget).toBe(1);
  });

  it("第 20 关 Boss 包含胡牌和字牌复合压力", () => {
    const level20 = levelsConfig.levels.find((level) => level.order === 20);
    const suitSetGoal = level20?.bossGoals?.find((goal): goal is Extract<MahjongBossGoalConfig, { type: "suit_set" }> => (
      goal.type === "suit_set"
    ));
    const scoreGoal = level20?.bossGoals?.find((goal): goal is Extract<MahjongBossGoalConfig, { type: "score_target" }> => (
      goal.type === "score_target"
    ));
    const comboGoals = level20?.bossGoals?.filter((goal): goal is Extract<MahjongBossGoalConfig, { type: "combo_count" }> => (
      goal.type === "combo_count"
    )) ?? [];

    expect(level20?.featuredCombos, "level 20 should highlight hu").toContain("hu");
    expect(new Set(suitSetGoal?.suits), "level 20 should require number suits and honor tiles").toEqual(new Set(["wan", "tong", "tiao", "honor"]));
    expect(suitSetGoal?.eachTarget).toBe(1);
    expect(scoreGoal?.target, "level 20 score target should be stronger than level 10").toBeGreaterThanOrEqual(160);
    expect(comboGoals.map((goal) => goal.combo).sort()).toEqual(["chi", "gang", "hu", "peng"]);
    expect(comboGoals.reduce((sum, goal) => sum + goal.target, 0), "level 20 should require at least five combo actions").toBeGreaterThanOrEqual(5);
  });

  it("第 20 关密集牌山生成器能承接胡牌 Boss 目标", () => {
    const summary = readPrototypeMountainSummary(20);

    expect(summary.count).toBeGreaterThan(40);
    expect(summary.blocked).toBeGreaterThan(0);
    expect(summary.solutionStepCount).toBeGreaterThan(8);
    expect(summary.hasHuSourcePackage).toBe(true);
  });

  it("密集牌山调参参数能从 URL 进入生成器", () => {
    const summary = readPrototypeMountainSummary(
      20,
      "?level=20&mode=mountain&seed=calibrate&tiles=58&stack=6&hu=2&honor=90",
    );

    expect(summary.tuning).toEqual({
      seed: "calibrate",
      tileCount: 58,
      stackDepth: 6,
      huPacks: 2,
      honorWeight: 90,
    });
    expect(summary.count).toBe(58);
    expect(summary.stackColumnTiles).toBeGreaterThanOrEqual(12);
    expect(summary.huSourcePackageCount).toBeGreaterThanOrEqual(2);
    expect(summary.honorCount).toBeGreaterThanOrEqual(9);
  });

  it("胡牌节奏关卡会显式标记重点组合", () => {
    const levelsWithHu = levelsConfig.levels.filter((level) => level.featuredCombos?.includes("hu"));

    expect(levelsWithHu.map((level) => level.order)).toEqual(expect.arrayContaining([6, 10]));

    for (const level of levelsConfig.levels) {
      for (const combo of level.featuredCombos ?? []) {
        expect(["chi", "peng", "gang", "hu"], `${level.id} featured combo should be supported`).toContain(combo);
      }
    }
  });

  it("每个关卡都能创建初始规则状态并提供可点击牌", () => {
    for (const level of levelsConfig.levels) {
      const state = createStateFromLevel(level);
      const boardTiles = state.tiles.filter((tile) => tile.location === "board");

      expect(state.slotLimit, `${level.id} slot limit should come from defaults`).toBe(levelsConfig.defaults.slotLimit);
      expect(state.reserveLimit, `${level.id} reserve limit should come from defaults`).toBe(
        levelsConfig.defaults.reserveLimit,
      );
      expect(state.slot, `${level.id} initial slot order should be preserved`).toEqual(level.initialSlotOrder);
      expect(state.reserve, `${level.id} initial reserve order should be preserved`).toEqual(level.initialReserveOrder);
      expect(getSlotStatus(state).status, `${level.id} should not fail on load`).not.toBe("failed");

      if (boardTiles.length > 0) {
        expect(getAvailableBoardTiles(state).length, `${level.id} should expose at least one clickable board tile`).toBeGreaterThan(0);
      }

      const counts = getRemainingTileCounts(state);
      expect(counts.wan.total + counts.tiao.total + counts.tong.total + counts.honor.total).toBe(level.tiles.length);
    }
  });

  it("每个关卡牌组至少能形成一个基础吃碰杠候选样本", () => {
    for (const level of levelsConfig.levels) {
      const allTilesInSlot = createMahjongState({
        ...createStateFromLevel(level),
        tiles: level.tiles.map((tile) => ({
          id: tile.id,
          suit: tile.suit,
          rank: tile.rank,
          layer: tile.layer,
          blockedBy: tile.blockedBy,
          location: "slot",
        })),
        slot: level.tiles.map((tile) => tile.id),
        reserve: [],
        slotLimit: Math.max(levelsConfig.defaults.slotLimit, level.tiles.length),
      });

      expect(getComboCandidates(allTilesInSlot).length, `${level.id} should include at least one combo package`).toBeGreaterThan(0);
    }
  });

  it("所有奖励 effect 都能应用到规则状态", () => {
    const baseState = createStateFromLevel(levelsConfig.levels[0]);

    for (const reward of rewardsConfig.rewards) {
      const next = applyReward(baseState, {
        id: reward.id,
        name: reward.name,
        effects: reward.effects,
      });

      expect(next.slotLimit, `${reward.id} should keep slot limit valid`).toBeGreaterThanOrEqual(1);
      expect(next.slotLimit, `${reward.id} should not exceed fixed main slot limit`).toBeLessThanOrEqual(8);
      expect(next.reserveLimit, `${reward.id} should keep reserve limit valid`).toBeGreaterThanOrEqual(0);
      expect(next.shields, `${reward.id} should keep shield count valid`).toBeGreaterThanOrEqual(0);
      expect(next.coins, `${reward.id} should keep coin count valid`).toBeGreaterThanOrEqual(0);
      expect(next.tools.shuffle, `${reward.id} should keep shuffle count valid`).toBeGreaterThanOrEqual(0);
      expect(next.tools.undo, `${reward.id} should keep undo count valid`).toBeGreaterThanOrEqual(0);
      expect(next.tools.vision, `${reward.id} should keep vision count valid`).toBeGreaterThanOrEqual(0);
    }
  });
});

function readJson<T>(fileName: string): T {
  return JSON.parse(readFileSync(path.join(configRoot, fileName), "utf8")) as T;
}

function uniqueIds(items: Array<{ id: string }>): string[] {
  return [...new Set(items.map((item) => item.id))];
}

function createStateFromLevel(level: MahjongLevelConfig): MahjongGameState {
  return createMahjongState({
    tiles: level.tiles.map(toMahjongTile),
    slot: level.initialSlotOrder,
    reserve: level.initialReserveOrder,
    slotLimit: levelsConfig.defaults.slotLimit,
    reserveLimit: levelsConfig.defaults.reserveLimit,
    shields: levelsConfig.defaults.shields,
    firstProtect: levelsConfig.defaults.firstProtect,
    tools: levelsConfig.defaults.tools,
  });
}

function toMahjongTile(tile: MahjongLevelTileConfig): MahjongTile {
  return {
    id: tile.id,
    suit: tile.suit as MahjongSuit,
    rank: tile.rank as MahjongRank,
    layer: tile.layer,
    blockedBy: tile.blockedBy,
    location: tile.location,
  };
}

interface PrototypeMountainSummary {
  count: number;
  blocked: number;
  solutionStepCount: number;
  hasHuSourcePackage: boolean;
  tuning: {
    seed: string;
    tileCount: number | null;
    stackDepth: number;
    huPacks: number | null;
    honorWeight: number;
  };
  stackColumnTiles: number;
  huSourcePackageCount: number;
  honorCount: number;
}

interface PrototypeDummyElement {
  classList: {
    add(...tokens: string[]): void;
    remove(...tokens: string[]): void;
    toggle(token: string, force?: boolean): boolean;
  };
  style: {
    setProperty(name: string, value: string): void;
  };
  dataset: Record<string, string>;
  innerHTML: string;
  textContent: string;
  disabled: boolean;
  append(...nodes: unknown[]): void;
  appendChild(node: unknown): unknown;
  setAttribute(name: string, value: string): void;
  addEventListener(type: string, listener: unknown): void;
  querySelector(selector: string): PrototypeDummyElement;
  querySelectorAll(selector: string): PrototypeDummyElement[];
  removeAttribute(name: string): void;
}

function readPrototypeMountainSummary(levelOrder: number, routeSearch = ""): PrototypeMountainSummary {
  const script = readPrototypeScriptForVm();
  const dummyElement = createPrototypeDummyElement();
  const context = {
    console,
    Math,
    Date,
    setTimeout,
    clearTimeout,
    URLSearchParams,
    fetch(): never {
      throw new Error("fetch is skipped in prototype VM tests");
    },
    document: {
      body: dummyElement,
      createElement(): PrototypeDummyElement {
        return createPrototypeDummyElement();
      },
      querySelector(): PrototypeDummyElement {
        return dummyElement;
      },
      querySelectorAll(): PrototypeDummyElement[] {
        return [];
      },
    },
    window: {
      location: { search: routeSearch },
      scrollX: 0,
      scrollY: 0,
      innerWidth: 472,
      innerHeight: 779,
    },
    __levelsConfig: levelsConfig,
    __levelIndex: levelOrder - 1,
  };

  createContext(context);

  return runInContext(`
    ${script}
    model.levelsConfig = __levelsConfig;
    model.rewardsConfig = { rewards: [] };
    model.levelIndex = __levelIndex;
    applyInitialRouteState();
    const generatedTiles = generateMountainTiles(model.levelsConfig.levels[__levelIndex]);
    ({
      count: generatedTiles.length,
      blocked: generatedTiles.filter((tile) => tile.blockedBy.length > 0).length,
      solutionStepCount: new Set(generatedTiles.map((tile) => tile.solutionStep)).size,
      hasHuSourcePackage: generatedTiles.some((tile) => String(tile.sourcePackage).includes("-hu")),
      tuning: model.mountainTuning,
      stackColumnTiles: generatedTiles.filter((tile) => tile.stackColumn).length,
      huSourcePackageCount: new Set(
        generatedTiles
          .filter((tile) => String(tile.sourcePackage).includes("-hu"))
          .map((tile) => tile.sourcePackage)
      ).size,
      honorCount: generatedTiles.filter((tile) => tile.suit === "honor").length,
    });
  `, context) as PrototypeMountainSummary;
}

function readPrototypeScriptForVm(): string {
  const html = readFileSync(prototypeHtmlPath, "utf8");
  const match = html.match(/<script>([\s\S]*?)<\/script>/);

  if (!match) {
    throw new Error("config playable prototype should contain one inline script");
  }

  return match[1].replace(
    /\n\s*init\(\)\.catch\(\(error\) => \{[\s\S]*?\n\s*\}\);\n/,
    "\n      // init skipped in prototype VM tests\n",
  );
}

function createPrototypeDummyElement(): PrototypeDummyElement {
  const element = {} as PrototypeDummyElement;

  element.classList = {
    add(): void {},
    remove(): void {},
    toggle(): boolean {
      return false;
    },
  };
  element.style = {
    setProperty(): void {},
  };
  element.dataset = {};
  element.innerHTML = "";
  element.textContent = "";
  element.disabled = false;
  element.append = (): void => {};
  element.appendChild = (node: unknown): unknown => node;
  element.setAttribute = (): void => {};
  element.addEventListener = (): void => {};
  element.querySelector = (): PrototypeDummyElement => element;
  element.querySelectorAll = (): PrototypeDummyElement[] => [];
  element.removeAttribute = (): void => {};

  return element;
}
