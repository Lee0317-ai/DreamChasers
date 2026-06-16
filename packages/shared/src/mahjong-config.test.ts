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
    expect(rewardsConfig.rewards.length).toBeGreaterThanOrEqual(16);
    expect(uniqueIds(levelsConfig.levels)).toHaveLength(levelsConfig.levels.length);
    expect(uniqueIds(tilesConfig.tileSet)).toHaveLength(tilesConfig.tileSet.length);
    expect(uniqueIds(rewardsConfig.rewards)).toHaveLength(rewardsConfig.rewards.length);
  });

  it("奖励池已扩展为路线型奖励，覆盖吃碰杠胡道具和信息流", () => {
    const categories = new Set(rewardsConfig.rewards.map((reward) => reward.category));

    expect(categories.has("chi")).toBe(true);
    expect(categories.has("peng")).toBe(true);
    expect(categories.has("gang")).toBe(true);
    expect(categories.has("hu")).toBe(true);
    expect(categories.has("tool")).toBe(true);
    expect(categories.has("info")).toBe(true);
    expect(rewardsConfig.rewards.length).toBeGreaterThanOrEqual(16);
    expect(rewardsConfig.rewards.some((reward) => reward.category === "hu")).toBe(true);
    expect(rewardsConfig.rewards.some((reward) => reward.category === "info")).toBe(true);
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

  it("默认密集牌山首轮开放 3-8 张并覆盖四类牌", () => {
    const summary = readPrototypeMountainSummary(1, "?level=1&mode=mountain");

    expect(summary.count).toBe(240);
    expect(summary.initialAvailable).toBeGreaterThanOrEqual(3);
    expect(summary.initialAvailable).toBeLessThanOrEqual(8);
    expect(summary.initialMaxSolutionGroupAvailable).toBeLessThanOrEqual(2);
    expect(summary.initialCompleteSolutionGroups).toEqual([]);
    expect(summary.splitSolutionGroupCount).toBeGreaterThan(0);
    expect(summary.mixedWindowTiles).toBeGreaterThan(0);
    expect(summary.ruleTileSize).toEqual({ width: 52, height: 70 });
    expect(summary.coordinateSystem).toEqual({ baseWidth: 560, baseHeight: 640 });
    expect(["center-tower", "two-wings", "cross", "ring", "long-wall", "islands", "canyon", "staircase"]).toContain(summary.templateId);
    expect(summary.templateLabel.length).toBeGreaterThan(0);
    expect(summary.stackDepthLabels.length).toBeGreaterThan(0);
    expect(summary.stackDepthLabels.every((depth) => depth >= 1)).toBe(true);
    expect(summary.visibleStackTiles).toBeGreaterThan(summary.visibleStackTopTiles);
    expect(summary.stackPreviewTiles).toBeGreaterThanOrEqual(summary.visibleStackTopTiles * 2);
    expect(summary.blockedStackPreviewTiles).toBe(summary.stackPreviewTiles);
    expect(summary.blockedTopTilesWithoutVisualOverlap).toBe(0);
    expect(summary.bridgeTiles).toBeGreaterThanOrEqual(1);
    expect(summary.blockedBridgeTiles).toBe(0);
    expect(summary.bridgeUnlockTargetCounts.every((count) => count >= 1)).toBe(true);
    expect(summary.bridgeActualUnlockCounts.every((count) => count >= 1)).toBe(true);
    expect(summary.firstBridgeUnlockedChoices).toBeGreaterThanOrEqual(1);
    expect(summary.stackOverlapRatios.some((ratio) => ratio <= 0.1)).toBe(true);
    expect(summary.stackOverlapRatios.some((ratio) => ratio > 0.1 && ratio < 1)).toBe(true);
    expect(summary.stackOverlapRatios.some((ratio) => ratio >= 1)).toBe(true);
    expect(new Set(summary.stackCoverModes)).toEqual(new Set(["full", "partial", "loose"]));
    expect(summary.primaryStackTileShare).toBeGreaterThanOrEqual(0.6);
    expect(summary.primaryStackTileShare).toBeLessThanOrEqual(0.78);
    expect(summary.largestStackTileShare).toBeLessThanOrEqual(0.28);
    expect(summary.suitTotals.wan).toBeGreaterThanOrEqual(12);
    expect(summary.suitTotals.tiao).toBeGreaterThanOrEqual(12);
    expect(summary.suitTotals.tong).toBeGreaterThanOrEqual(12);
    expect(summary.suitTotals.honor).toBeGreaterThanOrEqual(12);
    expect(summary.missingTileIdentities).toEqual([]);
  });

  it("密集牌山允许 8% 以下轻微遮挡点击，达到阈值才阻塞", () => {
    const summary = readPrototypeMountainTopRuleSummary();

    expect(summary.lowerTileBlocked).toBe(false);
    expect(summary.lowerTileAvailable).toBe(true);
    expect(summary.upperOverlapRatio).toBeGreaterThan(0);
    expect(summary.upperOverlapRatio).toBeLessThan(0.08);
    expect(summary.meaningfulTileBlocked).toBe(true);
    expect(summary.meaningfulTileAvailable).toBe(false);
    expect(summary.meaningfulOverlapRatio).toBeGreaterThanOrEqual(0.08);
  });

  it("槽位满且没有可发动组合时显示失败弹层", () => {
    const summary = readPrototypeFailureSummary();

    expect(summary.phase).toBe("failed");
    expect(summary.statusText).toContain("本关失败");
    expect(summary.overlayShown).toBe(true);
    expect(summary.rewardTitleText).toBe("本关失败");
    expect(summary.failureSummaryText).toContain("主槽已满");
    expect(summary.actionTexts).toContain("重开本关");
  });

  it("试玩 Demo 支持有限牌河、补杠、明杠开山和胡后清河", () => {
    const summary = readPrototypeRiverKongHuSummary();

    expect(summary.river.limit).toBe(3);
    expect(summary.river.selectingAfterTool).toBe(true);
    expect(summary.river.beforeSlot).toEqual(["river-a", "river-b"]);
    expect(summary.river.afterSlot).toEqual(["river-b"]);
    expect(summary.river.riverIds).toEqual(["river-a"]);
    expect(summary.river.discardedLocation).toBe("river");
    expect(summary.river.discardCount).toBe(1);
    expect(summary.river.statusText).toContain("牌河");

    expect(summary.fullSlotWithRiver.phase).toBe("playing");
    expect(summary.fullSlotWithRiver.statusText).toContain("打牌");

    expect(summary.peng.openMelds).toEqual([
      { type: "peng", tileKey: "wan-5", count: 3, source: "slot" },
    ]);
    expect(summary.bugang.candidates).toContain("bugang");
    expect(summary.bugang.slotAfter).toEqual([]);
    expect(summary.bugang.openMelds).toEqual([
      { type: "gang", tileKey: "wan-5", count: 4, source: "supplemental" },
    ]);
    expect(summary.bugang.removedDelta).toBe(0);

    expect(summary.gang.openMelds).toEqual([
      { type: "gang", tileKey: "tong-7", count: 4, source: "direct" },
    ]);
    expect(summary.gang.slotAfter).toEqual([]);
    expect(summary.gang.removedDelta).toBe(4);
    expect(summary.gang.looseTiles).toHaveLength(2);
    expect(summary.gang.looseTiles.every((tile) => tile.location === "board")).toBe(true);
    expect(summary.gang.looseTiles.every((tile) => tile.available)).toBe(true);
    expect(summary.gang.looseTiles.filter((tile) => tile.loose)).toHaveLength(1);
    expect(summary.gang.releasedBlockedBy.filter((blockers) => blockers.length === 0)).toHaveLength(1);
    expect(summary.gang.releasedBlockedBy.filter((blockers) => blockers.length > 0)).toHaveLength(1);
    expect(summary.gang.statusText).toContain("震落");
    expect(summary.gang.statusText).toContain("1 张");

    expect(summary.hu.slotAfter).toEqual([]);
    expect(summary.hu.riverAfter).toEqual(["river-keep"]);
    expect(summary.hu.removedDelta).toBe(9);
    expect(summary.hu.looseCount).toBe(3);
    expect(summary.hu.statusText).toContain("胡后清河");
    expect(summary.hu.statusText).toContain("震落");
    expect(summary.hu.statusText).toContain("3 张");

    expect(summary.looseLayout.overlapPairs).toBe(0);
    expect(summary.looseLayout.looseTiles.every((tile) => tile.loose)).toBe(true);
    expect(summary.looseLayout.looseTiles.every((tile) => tile.available)).toBe(true);
    expect(summary.looseLayout.coveredByLooseBlocked).toBe(true);
    expect(summary.looseLayout.coverLooseAvailable).toBe(true);
  });

  it("试玩 Demo 在距离胡牌 1-2 张时显示听牌提示和记牌器高亮", () => {
    const summary = readPrototypeHuHintSummary();

    expect(summary.readyHint.text).toContain("听：9筒");
    expect(summary.readyHint.distance).toBe("1");
    expect(summary.readyHint.waitKeys).toEqual(["tong-9"]);
    expect(summary.readyHint.highlightedDots).toEqual(["9:1"]);

    expect(summary.twoAwayHint.text).toContain("差：2条 / 9筒 可胡");
    expect(summary.twoAwayHint.distance).toBe("2");
    expect(summary.twoAwayHint.waitKeys).toEqual(["tiao-2", "tong-9"]);
    expect(summary.twoAwayHint.highlightedDots).toEqual(["2:1", "9:1"]);

    expect(summary.exhaustedHint.text).toContain("牌山暂无");
    expect(summary.exhaustedHint.waitKeys).toEqual([]);
    expect(summary.exhaustedHint.highlightedDots).toEqual([]);
  });

  it("朋友试玩 Demo 编排为前 4 关教学和 20 关完整主线", { timeout: 60_000 }, () => {
    const summary = readPrototypeFriendDemoSummary();

    expect(summary.demoLevels).toBe(20);
    expect(summary.slotLimits.slice(0, 4)).toEqual([6, 6, 6, 8]);
    expect(summary.slotLimits.slice(3)).toEqual(Array.from({ length: 17 }, () => 8));
    expect(summary.featuredCombos.slice(0, 4)).toEqual([["peng"], ["chi"], ["gang"], ["hu"]]);
    expect(summary.featuredCombos[19]).toContain("hu");
    expect(summary.levelModes.slice(0, 4)).toEqual(["tutorial", "tutorial", "tutorial", "tutorial"]);
    expect(summary.levelModes.slice(4, 20)).toEqual(Array.from({ length: 16 }, () => "mountain"));
    expect(summary.rewardCheckpointOrders).toEqual([3, 6, 9, 13, 16, 19]);
    expect(summary.bossLevelOrders).toEqual([10, 20]);
    expect(summary.finalBoss.levelOrder).toBe(20);
    expect(summary.finalBoss.levelNameText).toContain("胡了卜王");
    expect(summary.finalBoss.levelMetaText).toContain("20 关");
    expect(summary.finalBoss.hudGoalText).toBe("Boss 0/6");
    expect(summary.finalBoss.goalTitleText).toBe("胡了卜王");
    expect(summary.finalBoss.goalTexts.join(" ")).toContain("胡 0/1");
    expect(summary.finalBoss.goalTexts.join(" ")).toContain("积分 0/180");
    expect(summary.finalBoss.bossGoals).toEqual([
      { type: "combo_count", combo: "chi", target: 1 },
      { type: "combo_count", combo: "peng", target: 2 },
      { type: "combo_count", combo: "gang", target: 1 },
      { type: "combo_count", combo: "hu", target: 1 },
      { type: "suit_set", suits: ["wan", "tong", "tiao", "honor"], eachTarget: 1 },
      { type: "score_target", target: 180 },
    ]);
    expect(summary.tutorialRequiredCombos).toEqual(["peng", "chi", "gang", "hu"]);
    expect(summary.tutorialCandidateTypes).toEqual([["peng"], ["chi"], ["gang"], ["hu"]]);
    for (const result of summary.tutorialClearResults) {
      expect(result.beforeActionPhase, `level ${result.levelOrder} should stay playing before ${result.requiredCombo}`).toBe("playing");
      expect(result.beforeActionOverlayShown, `level ${result.levelOrder} should not show clear overlay before ${result.requiredCombo}`).toBe(false);
      expect(result.beforeActionStatusText, `level ${result.levelOrder} should explain required action`).toContain("点击");
      expect(result.afterActionPhase, `level ${result.levelOrder} should clear after ${result.requiredCombo}`).toBe("won");
      expect(result.afterActionOverlayShown, `level ${result.levelOrder} should show clear overlay after ${result.requiredCombo}`).toBe(true);
      expect(result.afterActionTitleText).toContain(`第 ${result.levelOrder} 关通关`);
    }
    expect(summary.tileCounts[0]).toBeLessThanOrEqual(12);
    expect(summary.tileCounts[1]).toBeLessThanOrEqual(12);
    expect(summary.tileCounts[2]).toBeLessThanOrEqual(12);
    expect(summary.tileCounts[3]).toBe(8);
    expect(summary.tileCounts.slice(4, 10)).toEqual([72, 96, 132, 168, 210, 240]);
    expect(summary.tileCounts.slice(10, 20)).toEqual([252, 258, 276, 288, 300, 312, 324, 336, 348, 360]);
    expect(summary.mountainLevels).toHaveLength(16);
    expect(summary.mountainLevels.map((level) => level.label).slice(0, 6)).toEqual([
      "正式入门",
      "轻压练习",
      "混合窗口",
      "多堆判断",
      "高压预备",
      "综合高压",
    ]);
    expect(summary.mountainLevels.map((level) => level.label).slice(6)).toEqual([
      "后半入局",
      "双线压迫",
      "奖励岔口",
      "窄腰再临",
      "字牌暗涌",
      "三门缠斗",
      "高压长局",
      "终章门前",
      "决战预备",
      "胡了卜王",
    ]);
    expect(summary.mountainLevels.map((level) => level.stackDepth).slice(0, 6)).toEqual([3, 3, 4, 5, 6, 6]);
    expect(summary.mountainLevels.slice(6).every((level) => level.stackDepth === 6)).toBe(true);
    expect(summary.mountainLevels.map((level) => level.huPacks).slice(0, 6)).toEqual([0, 0, 1, 1, 1, 0]);
    expect(summary.mountainLevels.map((level) => level.huPacks).slice(6)).toEqual([1, 1, 1, 1, 2, 2, 2, 2, 2, 3]);
    expect(summary.mountainLevels.map((level) => level.honorWeight).slice(0, 6)).toEqual([0, 0, 0, 12, 24, 40]);
    expect(summary.mountainLevels.map((level) => level.honorWeight).slice(6)).toEqual([42, 44, 46, 50, 54, 58, 62, 68, 74, 82]);
    expect(summary.mountainLevels.map((level) => level.naturalGangGroups).slice(0, 6)).toEqual([2, 2, 2, 2, 2, 3]);
    expect(summary.mountainLevels.map((level) => level.orphanBudget).slice(0, 6)).toEqual([1, 2, 3, 3, 4, 4]);
    for (const level of summary.mountainLevels) {
      expect(level.orphanRisk, `level ${level.levelOrder} orphan risk should stay within budget`).toBeLessThanOrEqual(level.orphanBudget);
      expect(level.unresolvedSolutionGroups.length, `level ${level.levelOrder} risk groups should match the reported risk`).toBe(level.orphanRisk);
    }
    const fullNumberRanks = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect(summary.mountainLevels[0].suitRanks).toEqual({ wan: fullNumberRanks, tiao: [], tong: [], honor: [] });
    expect(summary.mountainLevels[1].suitRanks).toEqual({ wan: fullNumberRanks, tiao: fullNumberRanks, tong: [], honor: [] });
    expect(summary.mountainLevels[2].suitRanks).toEqual({ wan: fullNumberRanks, tiao: fullNumberRanks, tong: fullNumberRanks, honor: [] });
    expect(summary.mountainLevels[3].suitRanks).toEqual({ wan: fullNumberRanks, tiao: fullNumberRanks, tong: fullNumberRanks, honor: [1, 5] });
    expect(summary.mountainLevels[4].suitRanks).toEqual({ wan: fullNumberRanks, tiao: fullNumberRanks, tong: fullNumberRanks, honor: [1, 3, 5, 7] });
    expect(summary.mountainLevels[5].suitRanks).toEqual({ wan: fullNumberRanks, tiao: fullNumberRanks, tong: fullNumberRanks, honor: [1, 2, 3, 4, 5, 6, 7] });
    expect(summary.mountainLevels[15].suitRanks).toEqual({ wan: fullNumberRanks, tiao: fullNumberRanks, tong: fullNumberRanks, honor: [1, 2, 3, 4, 5, 6, 7] });
    for (const level of summary.mountainLevels) {
      expect(new Set(level.naturalGangTileIdentities).size, `level ${level.levelOrder} should offer distinct kong targets`).toBe(level.naturalGangTileIdentities.length);
    }
    for (const level of summary.mountainLevels) {
      expect(level.initialAvailable, `level ${level.levelOrder} should start with a small choice window`).toBeGreaterThanOrEqual(3);
      expect(level.initialAvailable, `level ${level.levelOrder} should not expose too many starting choices`).toBeLessThanOrEqual(8);
      expect(level.initialMaxSolutionGroupAvailable, `level ${level.levelOrder} should not reveal a full answer immediately`).toBeLessThanOrEqual(2);
      expect(level.initialCompleteSolutionGroups, `level ${level.levelOrder} should not expose complete groups`).toEqual([]);
    }
    expect(summary.firstReward).toEqual({ id: "demo_slot_plus_2", slotDelta: 2 });
    expect(summary.toolLabels).toEqual(["洗牌", "撤回", "丢弃"]);
    expect(summary.toolKeys).toEqual(["shuffle", "undo", "discard"]);
    expect(summary.level5.mode).toBe("mountain");
    expect(summary.level5.label).toBe("正式入门");
    expect(summary.level5.tileCount).toBe(72);
    expect(summary.level5.naturalGangGroups).toBe(2);
    expect(summary.level5.naturalGangTileIdentities.length).toBe(2);
    expect(summary.level5.naturalGangRoutes).toHaveLength(2);
    for (const route of summary.level5.naturalGangRoutes) {
      expect(route.sameTileNonGangGroups, `level 5 ${route.tileKey} kong target should not be diluted by unrelated 3-card groups`).toEqual([]);
    }
    expect(Math.min(...summary.level5.naturalGangRoutes.map((route) => route.lastRouteStep))).toBeLessThanOrEqual(4);
    expect(summary.level5.initialAvailable).toBeGreaterThanOrEqual(3);
    expect(summary.level5.initialAvailable).toBeLessThanOrEqual(8);
    expect(summary.level5.initialMaxSolutionGroupAvailable).toBeLessThanOrEqual(2);
    expect(summary.level5.initialCompleteSolutionGroups).toEqual([]);
    expect(summary.fullSlotResult.slotLength).toBe(8);
    expect(summary.fullSlotResult.reserveLength).toBe(0);
    expect(summary.fullSlotResult.lastTileLocation).toBe("slot");
    expect(summary.fullSlotResult.phase).toBe("playing");
    expect(summary.fullSlotResult.overlayShown).toBe(false);
    expect(summary.fullSlotResult.statusText).toContain("主槽已满");
    expect(summary.discardResult.beforeSlot).toBe(2);
    expect(summary.discardResult.selectingAfterTool).toBe(true);
    expect(summary.discardResult.afterSlot).toBe(1);
    expect(summary.discardResult.discardedLocation).toBe("river");
    expect(summary.discardResult.riverIds).toEqual(["slot-a"]);
    expect(summary.discardResult.discardCount).toBe(1);
    expect(summary.discardResult.statusText).toContain("牌河");
    expect(summary.counterResult.beforeSuitLabels).toContain("万 1");
    expect(summary.counterResult.beforeWanDots).toContain("1:1");
    expect(summary.counterResult.afterSuitLabels).toContain("万 0");
    expect(summary.counterResult.afterWanDots).toContain("1:0");
    expect(summary.counterResult.afterWanDots).not.toContain("1:1");
  }, 15000);

  it("默认玩家页 auto 密集牌山在高压终局会按种子随机选择模板", () => {
    const summaries = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta"].map((seed) => (
      readPrototypeMountainSummary(10, `?level=10&mode=mountain&seed=${seed}`)
    ));

    expect(new Set(summaries.map((summary) => summary.templateId)).size).toBeGreaterThan(1);

    for (const summary of summaries) {
      expect(summary.count).toBe(240);
      expect(summary.initialAvailable).toBeGreaterThanOrEqual(3);
      expect(summary.initialAvailable).toBeLessThanOrEqual(8);
      expect(summary.missingTileIdentities).toEqual([]);
    }
  });

  it("调牌器可以指定悬台窄腰模板，且高压关 auto 池包含它", () => {
    const summary = readPrototypeMountainSummary(
      10,
      "?view=tuner&mode=mountain&level=10&template=suspended-waist&seed=waist-check",
    );
    const level7Summary = readPrototypeMountainSummary(7, "?level=7&mode=mountain&seed=stable-base");
    const level8Summary = readPrototypeMountainSummary(8, "?level=8&mode=mountain&seed=high-pressure");
    const level9Summary = readPrototypeMountainSummary(9, "?level=9&mode=mountain&seed=high-pressure");
    const level10Summary = readPrototypeMountainSummary(10, "?level=10&mode=mountain&seed=high-pressure");

    expect(summary.tuning.templateId).toBe("suspended-waist");
    expect(summary.templateId).toBe("suspended-waist");
    expect(summary.templateLabel).toBe("悬台窄腰");
    expect(summary.count).toBe(240);
    expect(summary.initialAvailable).toBeGreaterThanOrEqual(3);
    expect(summary.initialAvailable).toBeLessThanOrEqual(8);
    expect(summary.initialMaxSolutionGroupAvailable).toBeLessThanOrEqual(2);
    expect(summary.initialCompleteSolutionGroups).toEqual([]);
    expect(summary.templateRegions).toEqual(["side-scatter", "support-column", "top-platform", "waist"]);
    expect(summary.autoTemplateIds).not.toContain("suspended-waist");
    expect(level7Summary.effectiveAutoTemplateIds).not.toContain("suspended-waist");
    expect(level8Summary.effectiveAutoTemplateIds).toContain("suspended-waist");
    expect(level9Summary.effectiveAutoTemplateIds).toContain("suspended-waist");
    expect(level10Summary.effectiveAutoTemplateIds).toContain("suspended-waist");
  });

  it("普通关牌桌清空但槽内有残张时进入残局收官", () => {
    const summary = readPrototypeEndgameSettlementSummary();

    expect(summary.enter.phase).toBe("endgame");
    expect(summary.enter.overlayShown).toBe(true);
    expect(summary.enter.titleText).toBe("残局收官");
    expect(summary.enter.summaryText).toContain("主槽还有 2 张残张");
    expect(summary.enter.actionTexts).toEqual(["弃牌通关", "选作牌引"]);
    expect(summary.enter.slotLength).toBe(2);
    expect(summary.enter.settlementIds).toEqual(["settle-a", "settle-b"]);

    expect(summary.discard.phase).toBe("won");
    expect(summary.discard.overlayShown).toBe(true);
    expect(summary.discard.slotLength).toBe(0);
    expect(summary.discard.removedIds).toEqual(["discard-a", "discard-b"]);
    expect(summary.discard.titleText).toContain("第 5 关通关");

    expect(summary.primer.selectingBeforePick).toBe(true);
    expect(summary.primer.phaseAfterPick).toBe("won");
    expect(summary.primer.pendingGuideTile).toEqual({ suit: "tong", rank: 6, label: "6筒" });
    expect(summary.primer.slotAfterPick).toEqual([]);
    expect(summary.primer.removedIdsAfterPick).toEqual(["primer-a", "primer-b"]);
    expect(summary.primer.nextLevelSlotLabels).toEqual(["6筒"]);
    expect(summary.primer.pendingGuideAfterLoad).toBeNull();
    expect(summary.primer.statusText).toContain("牌引");
  });

  it("朋友试玩 Demo 在关键关前触发特殊事件选择并应用效果", () => {
    const summary = readPrototypeSpecialEventsSummary();

    expect(summary.triggers.level6.titleText).toBe("路遇老雀");
    expect(summary.triggers.level6.phase).toBe("event");
    expect(summary.triggers.level6.actionTexts).toEqual([
      "收下 80 铜钱",
      "补 1 次丢弃",
      "下一关高压，通关 +120 铜钱",
    ]);
    expect(summary.triggers.level8.titleText).toBe("旧牌匣");
    expect(summary.triggers.level10.titleText).toBe("加注一局");

    expect(summary.coins.before).toBe(0);
    expect(summary.coins.after).toBe(80);
    expect(summary.coins.phaseAfterChoice).toBe("playing");
    expect(summary.coins.statusText).toContain("路遇老雀");

    expect(summary.tool.beforeDiscard).toBe(1);
    expect(summary.tool.afterDiscard).toBe(2);
    expect(summary.tool.statusText).toContain("丢弃");

    expect(summary.disableShuffle.pendingModifier).toEqual({
      type: "disableTool",
      tool: "shuffle",
      rewardCoins: 120,
      label: "禁洗牌",
    });
    expect(summary.disableShuffle.activeModifier).toEqual({
      type: "disableTool",
      tool: "shuffle",
      rewardCoins: 120,
      label: "禁洗牌",
    });
    expect(summary.disableShuffle.shuffleDisabled).toBe(true);
    expect(summary.disableShuffle.statusText).toContain("禁洗牌");

    expect(summary.highPressure.pendingModifier?.type).toBe("highPressure");
    expect(summary.highPressure.activeModifier?.type).toBe("highPressure");
    expect(summary.highPressure.tileCount).toBeGreaterThan(summary.highPressure.baseTileCount);
    expect(summary.highPressure.hudGoalText).toContain("高压牌山");
    expect(summary.highPressure.nextLevelModifier).toBeNull();
  });

  it("朋友试玩 Demo 第 10 关启用终局试炼目标和一次性奖励", () => {
    const summary = readPrototypeBossTrialSummary();

    expect(summary.initial.levelOrder).toBe(10);
    expect(summary.initial.phase).toBe("playing");
    expect(summary.initial.bossGoals).toEqual([
      { type: "combo_count", combo: "gang", target: 1 },
      { type: "combo_count", combo: "hu", target: 1 },
      { type: "score_target", target: 180 },
    ]);
    expect(summary.initial.hudGoalText).toBe("试炼 0/3");
    expect(summary.initial.goalTitleText).toBe("终局试炼");
    expect(summary.initial.goalTexts.join(" ")).toContain("杠 0/1");
    expect(summary.initial.goalTexts.join(" ")).toContain("胡 0/1");
    expect(summary.initial.goalTexts.join(" ")).toContain("积分 0/180");

    expect(summary.failedClear.phase).toBe("failed");
    expect(summary.failedClear.overlayShown).toBe(true);
    expect(summary.failedClear.statusText).toContain("目标未完成");
    expect(summary.failedClear.summaryText).toContain("杠 0/1");
    expect(summary.failedClear.summaryText).toContain("胡 0/1");
    expect(summary.failedClear.summaryText).toContain("积分 0/180");

    expect(summary.rewardClear.phase).toBe("won");
    expect(summary.rewardClear.coinDelta).toBe(180);
    expect(summary.rewardClear.overlayShown).toBe(true);
    expect(summary.rewardClear.statusText).toContain("试炼奖励 +180 铜钱");
    expect(summary.rewardClear.summaryText).toContain("终局试炼");

    expect(summary.duplicateReward.coinDelta).toBe(0);
  });

  it("调牌器固定模板只作用当前调试关，切关后恢复自动模板", () => {
    const summary = readPrototypeMountainTransitionSummary(
      4,
      5,
      "?view=tuner&mode=mountain&level=4&template=ring",
    );

    expect(summary.beforeTemplateId).toBe("ring");
    expect(summary.beforeTuningTemplateId).toBe("ring");
    expect(summary.afterTuningTemplateId).toBe("auto");
    expect(summary.afterTemplateId).toBe("islands");
  });

  it("密集牌山调参参数能从 URL 进入生成器", () => {
    const summary = readPrototypeMountainSummary(
      20,
      "?level=20&mode=mountain&seed=calibrate&tiles=360&stack=6&hu=2&honor=90&template=canyon",
    );

    expect(summary.tuning).toEqual({
      seed: "calibrate",
      tileCount: 360,
      stackDepth: 6,
      huPacks: 2,
      honorWeight: 90,
      templateId: "canyon",
    });
    expect(summary.templateId).toBe("canyon");
    expect(summary.count).toBe(360);
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
  initialAvailable: number;
  initialMaxSolutionGroupAvailable: number;
  initialCompleteSolutionGroups: string[];
  splitSolutionGroupCount: number;
  mixedWindowTiles: number;
  ruleTileSize: {
    width: number;
    height: number;
  };
  coordinateSystem: {
    baseWidth: number;
    baseHeight: number;
  };
  templateId: string;
  templateLabel: string;
  missingTileIdentities: string[];
  stackDepthLabels: number[];
  visibleStackTiles: number;
  visibleStackTopTiles: number;
  stackPreviewTiles: number;
  blockedStackPreviewTiles: number;
  blockedTopTilesWithoutVisualOverlap: number;
  bridgeTiles: number;
  blockedBridgeTiles: number;
  bridgeUnlockTargetCounts: number[];
  bridgeActualUnlockCounts: number[];
  firstBridgeUnlockedChoices: number;
  stackOverlapRatios: number[];
  stackCoverModes: string[];
  templateRegions: string[];
  autoTemplateIds: string[];
  effectiveAutoTemplateIds: string[];
  primaryStackTileShare: number;
  largestStackTileShare: number;
  solutionStepCount: number;
  hasHuSourcePackage: boolean;
  tuning: {
    seed: string;
    tileCount: number | null;
    stackDepth: number;
    huPacks: number | null;
    honorWeight: number;
    templateId: string;
  };
  stackColumnTiles: number;
  huSourcePackageCount: number;
  honorCount: number;
  suitTotals: Record<MahjongSuit, number>;
}

interface PrototypeMountainTransitionSummary {
  beforeTemplateId: string;
  beforeTuningTemplateId: string;
  afterTemplateId: string;
  afterTuningTemplateId: string;
}

interface PrototypeMountainTopRuleSummary {
  lowerTileBlocked: boolean;
  lowerTileAvailable: boolean;
  upperOverlapRatio: number;
  meaningfulTileBlocked: boolean;
  meaningfulTileAvailable: boolean;
  meaningfulOverlapRatio: number;
}

interface PrototypeFailureSummary {
  phase: string;
  statusText: string;
  overlayShown: boolean;
  rewardTitleText: string;
  failureSummaryText: string;
  actionTexts: string[];
}

interface PrototypeRiverKongHuSummary {
  river: {
    limit: number;
    selectingAfterTool: boolean;
    beforeSlot: string[];
    afterSlot: string[];
    riverIds: string[];
    discardedLocation: string;
    discardCount: number;
    statusText: string;
  };
  fullSlotWithRiver: {
    phase: string;
    statusText: string;
  };
  peng: {
    openMelds: Array<{
      type: string;
      tileKey: string;
      count: number;
      source: string;
    }>;
  };
  bugang: {
    candidates: string[];
    slotAfter: string[];
    openMelds: Array<{
      type: string;
      tileKey: string;
      count: number;
      source: string;
    }>;
    removedDelta: number;
  };
  gang: {
    slotAfter: string[];
    openMelds: Array<{
      type: string;
      tileKey: string;
      count: number;
      source: string;
    }>;
    removedDelta: number;
    looseTiles: Array<{
      id: string;
      location: string;
      loose: boolean;
      available: boolean;
    }>;
    releasedBlockedBy: string[][];
    statusText: string;
  };
  hu: {
    slotAfter: string[];
    riverAfter: string[];
    removedDelta: number;
    looseCount: number;
    statusText: string;
  };
  looseLayout: {
    overlapPairs: number;
    looseTiles: Array<{
      id: string;
      x: number;
      y: number;
      stackOrder: number;
      loose: boolean;
      available: boolean;
    }>;
    coveredByLooseBlocked: boolean;
    coverLooseAvailable: boolean;
  };
}

interface PrototypeEndgameSettlementSummary {
  enter: {
    phase: string;
    overlayShown: boolean;
    titleText: string;
    summaryText: string;
    actionTexts: string[];
    slotLength: number;
    settlementIds: string[];
  };
  discard: {
    phase: string;
    overlayShown: boolean;
    slotLength: number;
    removedIds: string[];
    titleText: string;
  };
  primer: {
    selectingBeforePick: boolean;
    phaseAfterPick: string;
    pendingGuideTile: {
      suit: string;
      rank: number;
      label: string;
    } | null;
    slotAfterPick: string[];
    removedIdsAfterPick: string[];
    nextLevelSlotLabels: string[];
    pendingGuideAfterLoad: unknown;
    statusText: string;
  };
}

interface PrototypeSpecialEventsSummary {
  triggers: {
    level6: PrototypeSpecialEventTriggerSnapshot;
    level8: PrototypeSpecialEventTriggerSnapshot;
    level10: PrototypeSpecialEventTriggerSnapshot;
  };
  coins: {
    before: number;
    after: number;
    phaseAfterChoice: string;
    statusText: string;
  };
  tool: {
    beforeDiscard: number;
    afterDiscard: number;
    statusText: string;
  };
  disableShuffle: {
    pendingModifier: unknown;
    activeModifier: unknown;
    shuffleDisabled: boolean;
    statusText: string;
  };
  highPressure: {
    pendingModifier: { type?: string } | null;
    activeModifier: { type?: string } | null;
    baseTileCount: number;
    tileCount: number;
    hudGoalText: string;
    nextLevelModifier: unknown;
  };
}

interface PrototypeBossTrialSummary {
  initial: {
    levelOrder: number;
    phase: string;
    bossGoals: Array<{
      type: string;
      combo?: string;
      target: number;
    }>;
    hudGoalText: string;
    goalTitleText: string;
    goalTexts: string[];
  };
  failedClear: {
    phase: string;
    statusText: string;
    overlayShown: boolean;
    summaryText: string;
  };
  rewardClear: {
    phase: string;
    coinDelta: number;
    statusText: string;
    overlayShown: boolean;
    summaryText: string;
  };
  duplicateReward: {
    coinDelta: number;
  };
}

interface PrototypeSpecialEventTriggerSnapshot {
  phase: string;
  titleText: string;
  summaryText: string;
  actionTexts: string[];
}

interface PrototypeHuHintSummary {
  readyHint: PrototypeHuHintSnapshot;
  twoAwayHint: PrototypeHuHintSnapshot;
  exhaustedHint: PrototypeHuHintSnapshot;
}

interface PrototypeHuHintSnapshot {
  text: string;
  distance: string;
  waitKeys: string[];
  highlightedDots: string[];
}

interface PrototypeFriendDemoSummary {
  demoLevels: number;
  slotLimits: number[];
  featuredCombos: string[][];
  levelModes: string[];
  tileCounts: number[];
  rewardCheckpointOrders: number[];
  bossLevelOrders: number[];
  finalBoss: {
    levelOrder: number;
    levelNameText: string;
    levelMetaText: string;
    hudGoalText: string;
    goalTitleText: string;
    goalTexts: string[];
    bossGoals: Array<{
      type: string;
      combo?: string;
      target?: number;
      suits?: string[];
      eachTarget?: number;
    }>;
  };
  tutorialRequiredCombos: string[];
  tutorialCandidateTypes: string[][];
  tutorialClearResults: Array<{
    levelOrder: number;
    requiredCombo: string;
    beforeActionPhase: string;
    beforeActionOverlayShown: boolean;
    beforeActionStatusText: string;
    afterActionPhase: string;
    afterActionOverlayShown: boolean;
    afterActionTitleText: string;
  }>;
  firstReward: {
    id: string;
    slotDelta: number;
  };
  toolLabels: string[];
  toolKeys: string[];
  mountainLevels: Array<{
    levelOrder: number;
    label: string;
    tileCount: number;
    stackDepth: number;
    huPacks: number | null;
    honorWeight: number;
    naturalGangGroups: number;
    naturalGangTileIdentities: string[];
    naturalGangRoutes: Array<{
      tileKey: string;
      steps: number[];
      lastRouteStep: number;
      initiallyVisible: number;
      sameTileNonGangGroups: string[];
    }>;
    orphanBudget: number;
    orphanRisk: number;
    unresolvedSolutionGroups: string[];
    suitRanks: Record<MahjongSuit, number[]>;
    initialAvailable: number;
    initialMaxSolutionGroupAvailable: number;
    initialCompleteSolutionGroups: string[];
  }>;
  level5: {
    mode: string;
    label: string;
    tileCount: number;
    naturalGangGroups: number;
    naturalGangTileIdentities: string[];
    naturalGangRoutes: Array<{
      tileKey: string;
      steps: number[];
      lastRouteStep: number;
      initiallyVisible: number;
      sameTileNonGangGroups: string[];
    }>;
    orphanBudget: number;
    orphanRisk: number;
    unresolvedSolutionGroups: string[];
    suitRanks: Record<MahjongSuit, number[]>;
    initialAvailable: number;
    initialMaxSolutionGroupAvailable: number;
    initialCompleteSolutionGroups: string[];
  };
  fullSlotResult: {
    slotLength: number;
    reserveLength: number;
    lastTileLocation: string;
    phase: string;
    overlayShown: boolean;
    statusText: string;
  };
  discardResult: {
    beforeSlot: number;
    selectingAfterTool: boolean;
    afterSlot: number;
    discardedLocation: string;
    riverIds: string[];
    discardCount: number;
    statusText: string;
  };
  counterResult: {
    beforeSuitLabels: string[];
    beforeWanDots: string[];
    afterSuitLabels: string[];
    afterWanDots: string[];
  };
}

interface PrototypeDummyElement {
  classList: {
    add(...tokens: string[]): void;
    remove(...tokens: string[]): void;
    toggle(token: string, force?: boolean): boolean;
    contains(token: string): boolean;
  };
  style: {
    setProperty(name: string, value: string): void;
    display?: string;
  };
  dataset: Record<string, string>;
  children: PrototypeDummyElement[];
  className: string;
  type: string;
  value: string | number;
  href: string;
  hidden: boolean;
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
    const bridgeTiles = generatedTiles.filter((tile) => tile.stackBridge);
    const stackColumnCounts = [...generatedTiles.reduce((counts, tile) => {
      if (tile.stackColumnId) counts.set(tile.stackColumnId, (counts.get(tile.stackColumnId) ?? 0) + 1);
      return counts;
    }, new Map()).values()].sort((a, b) => b - a);
    const firstBridge = bridgeTiles[0];
    const firstBridgeTargets = firstBridge
      ? generatedTiles.filter((tile) => (tile.blockedBy ?? []).includes(firstBridge.id))
      : [];
    const afterFirstBridgeTiles = firstBridge
      ? generatedTiles.map((tile) => tile.id === firstBridge.id ? { ...tile, location: "slot" } : tile)
      : generatedTiles;
    setMountainRuntimeTiles(generatedTiles);
    const initialAvailableTiles = generatedTiles.filter((tile) => !isTileBlocked(tile.id));
    const initialSolutionGroupCounts = initialAvailableTiles.reduce((counts, tile) => {
      const key = tile.solutionGroup ?? tile.sourcePackage ?? tile.id;
      counts.set(key, (counts.get(key) ?? 0) + 1);
      return counts;
    }, new Map());
    const solutionGroupStepSets = generatedTiles.reduce((groups, tile) => {
      const key = tile.solutionGroup ?? tile.sourcePackage;
      if (!key) return groups;
      const steps = groups.get(key) ?? new Set();
      steps.add(tile.solutionStep);
      groups.set(key, steps);
      return groups;
    }, new Map());
    ({
      count: generatedTiles.length,
      blocked: generatedTiles.filter((tile) => tile.blockedBy.length > 0).length,
      initialAvailable: initialAvailableTiles.length,
      initialMaxSolutionGroupAvailable: Math.max(0, ...initialSolutionGroupCounts.values()),
      initialCompleteSolutionGroups: [...initialSolutionGroupCounts.entries()]
        .filter(([, count]) => count >= 3)
        .map(([group]) => group),
      splitSolutionGroupCount: [...solutionGroupStepSets.values()].filter((steps) => steps.size > 1).length,
      mixedWindowTiles: generatedTiles.filter((tile) => tile.mixedWindowRole).length,
      ruleTileSize: getMountainRuleTileSize(),
      coordinateSystem: getActiveCoordinateSystem(),
      templateId: model.activeMountainTemplate.id,
      templateLabel: model.activeMountainTemplate.label,
      missingTileIdentities: getAllTileIdentities()
        .filter((identity) => !generatedTiles.some((tile) => tile.suit === identity.suit && tile.rank === identity.rank))
        .map((identity) => identity.key),
      stackDepthLabels: generatedTiles
        .filter((tile) => tile.stackColumn && isVisibleGeneratedStackTop(tile, generatedTiles))
        .map((tile) => getGeneratedHiddenStackDepth(tile, generatedTiles)),
      visibleStackTiles: generatedTiles
        .filter((tile) => tile.stackColumn && isVisibleGeneratedStackDisplayTile(tile, generatedTiles))
        .length,
      visibleStackTopTiles: generatedTiles
        .filter((tile) => tile.stackColumn && isVisibleGeneratedStackTop(tile, generatedTiles))
        .length,
      stackPreviewTiles: generatedTiles
        .filter((tile) => (
          tile.stackColumn
          && isVisibleGeneratedStackDisplayTile(tile, generatedTiles)
          && !isVisibleGeneratedStackTop(tile, generatedTiles)
        ))
        .length,
      blockedStackPreviewTiles: generatedTiles
        .filter((tile) => (
          tile.stackColumn
          && isVisibleGeneratedStackDisplayTile(tile, generatedTiles)
          && !isVisibleGeneratedStackTop(tile, generatedTiles)
          && isGeneratedTileBlocked(tile, generatedTiles)
        ))
        .length,
      blockedTopTilesWithoutVisualOverlap: generatedTiles
        .filter((tile) => (
          isTileBlocked(tile.id)
          && (
            tile.stackBridge
            || (tile.stackColumn && isVisibleGeneratedStackTop(tile, generatedTiles))
          )
          && !hasHigherVisualOverlap(tile, generatedTiles)
        ))
        .length,
      bridgeTiles: bridgeTiles.length,
      blockedBridgeTiles: bridgeTiles.filter((tile) => isTileBlocked(tile.id)).length,
      bridgeUnlockTargetCounts: bridgeTiles.map((tile) => (
        generatedTiles.filter((candidate) => (candidate.blockedBy ?? []).includes(tile.id)).length
      )),
      bridgeActualUnlockCounts: bridgeTiles.map((tile) => getBridgeUnlockCount(tile)),
      firstBridgeUnlockedChoices: firstBridgeTargets.filter((tile) => (
        !isRuntimeTileBlockedAfterUpdate(tile, afterFirstBridgeTiles)
      )).length,
      stackOverlapRatios: [...new Set(generatedTiles
        .filter((tile) => tile.stackColumn && isVisibleGeneratedStackTop(tile, generatedTiles))
        .map((tile) => Number(tile.stackOverlapRatio?.toFixed(2) ?? 1))
      )],
      stackCoverModes: [...new Set(generatedTiles
        .filter((tile) => tile.stackColumn && isVisibleGeneratedStackTop(tile, generatedTiles))
        .map((tile) => tile.stackCoverMode)
      )],
      templateRegions: Array.from(new Set(generatedTiles
        .map((tile) => String(tile.templateRegion ?? ""))
        .filter(Boolean)
      )).sort(),
      autoTemplateIds: MOUNTAIN_AUTO_TEMPLATE_IDS,
      effectiveAutoTemplateIds: getAutoMountainTemplateIds(),
      primaryStackTileShare: stackColumnCounts.slice(0, 4).reduce((sum, count) => sum + count, 0) / generatedTiles.length,
      largestStackTileShare: (stackColumnCounts[0] ?? 0) / generatedTiles.length,
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
      suitTotals: generatedTiles.reduce((totals, tile) => {
        totals[tile.suit] += 1;
        return totals;
      }, createEmptySuitTotals()),
    });

    function setMountainRuntimeTiles(tiles) {
      model.state = {
        tiles,
        slot: [],
        reserve: [],
        slotLimit: 8,
        reserveLimit: 1,
        shields: 0,
        firstProtect: false,
        score: 0,
        coins: 0,
        comboCounts: { chi: 0, peng: 0, gang: 0, hu: 0 },
        suitComboCounts: createEmptySuitTotals(),
        bossGoals: [],
        tools: { shuffle: 0, undo: 0, vision: 0 },
        bonuses: {},
        history: [],
        visionActive: false,
        phase: "playing",
        recentBossProgress: [],
      };
    }

    function isRuntimeTileBlockedAfterUpdate(tile, tiles) {
      setMountainRuntimeTiles(tiles);
      const result = isTileBlocked(tile.id);
      setMountainRuntimeTiles(generatedTiles);
      return result;
    }

    function hasHigherVisualOverlap(tile, tiles) {
      const tileIndex = tiles.findIndex((item) => item.id === tile.id);
      const tileOrder = getTileStackOrder(tile, tileIndex);
      const rect = getVisualTileRect(tile, tiles);
      return tiles.some((other, otherIndex) => {
        if (other.id === tile.id || other.location !== "board") return false;
        if (getTileStackOrder(other, otherIndex) <= tileOrder) return false;
        const otherRect = getVisualTileRect(other, tiles);
        return !(
          otherRect.right <= rect.left
          || otherRect.left >= rect.right
          || otherRect.bottom <= rect.top
          || otherRect.top >= rect.bottom
        );
      });
    }

    function getVisualTileRect(tile, tiles) {
      const coordinateSystem = getActiveCoordinateSystem();
      const visual = getVisualPosition(tile, coordinateSystem, tiles);
      const size = getMountainRuleTileSize();
      const left = (visual.left / 100) * coordinateSystem.baseWidth;
      const top = (visual.top / 100) * coordinateSystem.baseHeight;
      return { left, top, right: left + size.width, bottom: top + size.height };
    }
  `, context) as PrototypeMountainSummary;
}

function readPrototypeMountainTopRuleSummary(): PrototypeMountainTopRuleSummary {
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
      location: { search: "?level=1&mode=mountain" },
      scrollX: 0,
      scrollY: 0,
      innerWidth: 472,
      innerHeight: 779,
    },
    __levelsConfig: levelsConfig,
  };

  createContext(context);

  return runInContext(`
    ${script}
    model.levelsConfig = __levelsConfig;
    model.rewardsConfig = { rewards: [] };
    applyInitialRouteState();
    model.mode = "mountain";
    const lower = {
      id: "lower",
      suit: "wan",
      rank: 1,
      x: 100,
      y: 100,
      layer: 0,
      location: "board",
      blockedBy: [],
    };
    const upper = {
      id: "upper",
      suit: "wan",
      rank: 2,
      x: 142,
      y: 166,
      layer: 1,
      location: "board",
      blockedBy: [],
    };
    const meaningfulUpper = {
      id: "meaningful-upper",
      suit: "wan",
      rank: 3,
      x: 130,
      y: 145,
      layer: 1,
      stackOrder: 2000,
      location: "board",
      blockedBy: [],
    };
    const lightTiles = [lower, upper];
    const meaningfulTiles = [lower, meaningfulUpper];
    const tiles = [lower, upper, meaningfulUpper];
    model.state = {
      tiles,
      slot: [],
      reserve: [],
      slotLimit: 8,
      reserveLimit: 1,
      shields: 0,
      firstProtect: false,
      score: 0,
      coins: 0,
      comboCounts: { chi: 0, peng: 0, gang: 0, hu: 0 },
      suitComboCounts: createEmptySuitTotals(),
      bossGoals: [],
      tools: { shuffle: 0, undo: 0, vision: 0 },
      bonuses: {},
      history: [],
      visionActive: false,
      phase: "playing",
      recentBossProgress: [],
    };
    const size = getMountainRuleTileSize();
    const overlapRatio = getOverlapRatio(lower, upper, size.width, size.height);
    const meaningfulOverlapRatio = getOverlapRatio(lower, meaningfulUpper, size.width, size.height);
    model.state.tiles = lightTiles;
    const lowerGeneratedBlocked = isGeneratedTileBlocked(lower, lightTiles);
    const lowerRuntimeBlocked = isTileBlocked("lower");
    model.state.tiles = meaningfulTiles;
    const meaningfulGeneratedBlocked = isGeneratedTileBlocked(lower, meaningfulTiles);
    const meaningfulRuntimeBlocked = isTileBlocked("lower");
    model.state.tiles = tiles;
    ({
      lowerTileBlocked: lowerGeneratedBlocked && lowerRuntimeBlocked,
      lowerTileAvailable: !lowerGeneratedBlocked && !lowerRuntimeBlocked,
      upperOverlapRatio: overlapRatio,
      meaningfulTileBlocked: meaningfulGeneratedBlocked && meaningfulRuntimeBlocked,
      meaningfulTileAvailable: !meaningfulGeneratedBlocked && !meaningfulRuntimeBlocked,
      meaningfulOverlapRatio,
    });
  `, context) as PrototypeMountainTopRuleSummary;
}

function readPrototypeMountainTransitionSummary(
  levelOrder: number,
  nextLevelOrder: number,
  routeSearch: string,
): PrototypeMountainTransitionSummary {
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
    __nextLevelIndex: nextLevelOrder - 1,
  };

  createContext(context);

  return runInContext(`
    ${script}
    model.levelsConfig = __levelsConfig;
    model.rewardsConfig = { rewards: [] };
    model.levelIndex = __levelIndex;
    applyInitialRouteState();
    generateMountainTiles(model.levelsConfig.levels[__levelIndex]);
    const beforeTemplateId = model.activeMountainTemplate.id;
    const beforeTuningTemplateId = model.mountainTuning.templateId;
    resetMountainTemplateForLevelTransition(__nextLevelIndex, { resetFixedMountainTemplate: true });
    model.levelIndex = __nextLevelIndex;
    generateMountainTiles(model.levelsConfig.levels[__nextLevelIndex]);
    ({
      beforeTemplateId,
      beforeTuningTemplateId,
      afterTemplateId: model.activeMountainTemplate.id,
      afterTuningTemplateId: model.mountainTuning.templateId,
    });
  `, context) as PrototypeMountainTransitionSummary;
}

function readPrototypeFailureSummary(): PrototypeFailureSummary {
  const script = readPrototypeScriptForVm();
  const elements = new Map<string, PrototypeDummyElement>();
  const getElement = (selector: string): PrototypeDummyElement => {
    const element = elements.get(selector) ?? createPrototypeDummyElement();
    elements.set(selector, element);
    return element;
  };
  const body = getElement("body");
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
      title: "",
      body,
      createElement(): PrototypeDummyElement {
        return createPrototypeDummyElement();
      },
      querySelector(selector: string): PrototypeDummyElement {
        return getElement(selector);
      },
      querySelectorAll(): PrototypeDummyElement[] {
        return [];
      },
    },
    window: {
      location: { search: "?level=1&mode=config" },
      scrollX: 0,
      scrollY: 0,
      innerWidth: 472,
      innerHeight: 779,
    },
    __levelsConfig: levelsConfig,
  };

  createContext(context);

  return runInContext(`
    ${script}
    model.levelsConfig = __levelsConfig;
    model.rewardsConfig = { rewards: [] };
    model.mode = "config";
    model.levelIndex = 0;
    const tiles = [
      { id: "slot-1", suit: "honor", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "slot-2", suit: "honor", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "slot-3", suit: "honor", rank: 3, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "slot-4", suit: "honor", rank: 4, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "slot-5", suit: "honor", rank: 5, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "slot-6", suit: "honor", rank: 6, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "slot-7", suit: "honor", rank: 7, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "last-tile", suit: "wan", rank: 9, x: 10, y: 10, layer: 0, blockedBy: [], location: "board" },
      { id: "river-1", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "river" },
      { id: "river-2", suit: "tiao", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "river" },
      { id: "river-3", suit: "tong", rank: 3, x: 0, y: 0, layer: 0, blockedBy: [], location: "river" },
    ];
    model.state = {
      tiles,
      slot: tiles.slice(0, 7).map((tile) => tile.id),
      reserve: [],
      river: ["river-1", "river-2", "river-3"],
      slotLimit: 8,
      reserveLimit: 0,
      riverLimit: 3,
      shields: 0,
      firstProtect: false,
      score: 0,
      coins: 0,
      comboCounts: { chi: 0, peng: 0, gang: 0, bugang: 0, hu: 0 },
      suitComboCounts: createEmptySuitTotals(),
      bossGoals: [],
      tools: { shuffle: 0, undo: 0, vision: 0 },
      bonuses: { chi: 0, peng: 0, gang: 0, hu: 0 },
      history: [],
      openMelds: [],
      discardSelecting: false,
      visionActive: false,
      phase: "playing",
      recentBossProgress: [],
    };
    moveTileToSlot("last-tile");
    ({
      phase: model.state.phase,
      statusText: view.status.textContent,
      overlayShown: view.rewardOverlay.classList.contains("show"),
      rewardTitleText: view.rewardTitle.textContent,
      failureSummaryText: view.runComplete.children.map((child) => child.textContent).join(" "),
      actionTexts: view.runComplete.children.map((child) => child.textContent),
    });
  `, context) as PrototypeFailureSummary;
}

function readPrototypeRiverKongHuSummary(): PrototypeRiverKongHuSummary {
  const script = readPrototypeScriptForVm();
  const elements = new Map<string, PrototypeDummyElement>();
  const getElement = (selector: string): PrototypeDummyElement => {
    const element = elements.get(selector) ?? createPrototypeDummyElement();
    elements.set(selector, element);
    return element;
  };
  const body = getElement("body");
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
      title: "",
      body,
      documentElement: createPrototypeDummyElement(),
      createElement(): PrototypeDummyElement {
        return createPrototypeDummyElement();
      },
      querySelector(selector: string): PrototypeDummyElement {
        return getElement(selector);
      },
      querySelectorAll(): PrototypeDummyElement[] {
        return [];
      },
    },
    window: {
      location: { search: "" },
      scrollX: 0,
      scrollY: 0,
      innerWidth: 472,
      innerHeight: 779,
    },
    __levelsConfig: levelsConfig,
    __rewardsConfig: rewardsConfig,
  };

  createContext(context);

  return runInContext(`
    ${script}
    model.levelsConfig = __levelsConfig;
    model.rewardsConfig = __rewardsConfig;
    applyInitialRouteState();
    model.mode = "config";
    model.levelIndex = 4;

    const riverTiles = [
      { id: "river-a", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "river-b", suit: "tiao", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
    ];
    model.state = createPrototypeState(riverTiles, ["river-a", "river-b"], {
      slotLimit: 8,
      riverLimit: 3,
      tools: { shuffle: 0, undo: 0, discard: 1 },
    });
    const beforeRiverSlot = [...model.state.slot];
    useDiscardTool();
    const selectingAfterTool = model.state.discardSelecting;
    discardSlotTile(0);
    const riverResult = {
      limit: model.state.riverLimit,
      selectingAfterTool,
      beforeSlot: beforeRiverSlot,
      afterSlot: [...model.state.slot],
      riverIds: [...model.state.river],
      discardedLocation: findTile("river-a").location,
      discardCount: model.state.tools.discard,
      statusText: view.status.textContent,
    };

    const fullSlotTiles = [
      { id: "full-1", suit: "honor", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "full-2", suit: "honor", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "full-3", suit: "honor", rank: 3, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "full-4", suit: "honor", rank: 4, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "full-5", suit: "honor", rank: 5, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "full-6", suit: "honor", rank: 6, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "full-7", suit: "honor", rank: 7, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "full-8", suit: "wan", rank: 9, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
    ];
    model.state = createPrototypeState(fullSlotTiles, fullSlotTiles.map((tile) => tile.id), {
      slotLimit: 8,
      riverLimit: 3,
      tools: { shuffle: 0, undo: 0, discard: 0 },
    });
    view.status.textContent = "";
    const fullSlotDanger = checkDanger();
    const fullSlotWithRiver = {
      phase: model.state.phase,
      statusText: fullSlotDanger ?? view.status.textContent,
    };

    const pengTiles = [
      { id: "peng-a", suit: "wan", rank: 5, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "peng-b", suit: "wan", rank: 5, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "peng-c", suit: "wan", rank: 5, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "peng-d", suit: "wan", rank: 5, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "block-a", suit: "tiao", rank: 1, x: 80, y: 80, layer: 0, blockedBy: ["block-top"], location: "board" },
      { id: "block-top", suit: "tiao", rank: 2, x: 80, y: 80, layer: 1, blockedBy: [], location: "board" },
    ];
    model.state = createPrototypeState(pengTiles, ["peng-a", "peng-b", "peng-c"], {
      slotLimit: 8,
      riverLimit: 3,
      tools: { shuffle: 0, undo: 0, discard: 0 },
    });
    executeCombo(getComboCandidates().find((candidate) => candidate.type === "peng"));
    const pengResult = { openMelds: cloneMelds(model.state.openMelds) };
    findTile("peng-d").location = "slot";
    model.state.slot = ["peng-d"];
    const bugangCandidates = getComboCandidates().map((candidate) => candidate.type);
    const beforeBugangRemoved = removedCount();
    executeCombo(getComboCandidates().find((candidate) => candidate.type === "bugang"));
    const bugangResult = {
      candidates: bugangCandidates,
      slotAfter: [...model.state.slot],
      openMelds: cloneMelds(model.state.openMelds),
      removedDelta: removedCount() - beforeBugangRemoved,
    };

    const gangTiles = [
      { id: "gang-a", suit: "tong", rank: 7, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "gang-b", suit: "tong", rank: 7, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "gang-c", suit: "tong", rank: 7, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "gang-d", suit: "tong", rank: 7, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "gang-block-1", suit: "wan", rank: 1, x: 10, y: 10, layer: 0, blockedBy: ["gang-top-1"], location: "board" },
      { id: "gang-block-2", suit: "wan", rank: 2, x: 20, y: 20, layer: 0, blockedBy: ["gang-top-2"], location: "board" },
      { id: "gang-top-1", suit: "wan", rank: 3, x: 10, y: 10, layer: 1, blockedBy: [], location: "board" },
      { id: "gang-top-2", suit: "wan", rank: 4, x: 20, y: 20, layer: 1, blockedBy: [], location: "board" },
    ];
    model.state = createPrototypeState(gangTiles, ["gang-a", "gang-b", "gang-c", "gang-d"], {
      slotLimit: 8,
      riverLimit: 3,
    });
    const beforeGangRemoved = removedCount();
    executeCombo(getComboCandidates().find((candidate) => candidate.type === "gang"));
    const gangResult = {
      slotAfter: [...model.state.slot],
      openMelds: cloneMelds(model.state.openMelds),
      removedDelta: removedCount() - beforeGangRemoved,
      looseTiles: ["gang-top-1", "gang-top-2"].map((tileId) => {
        const tile = findTile(tileId);
        return {
          id: tile.id,
          location: tile.location,
          loose: Boolean(tile.looseMountainTile),
          available: !isTileBlocked(tile.id),
        };
      }),
      releasedBlockedBy: ["gang-block-1", "gang-block-2"].map((tileId) => [...findTile(tileId).blockedBy]),
      statusText: view.status.textContent,
    };

    const huTiles = [
      { id: "hu-a1", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "hu-a2", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "hu-a3", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "hu-b1", suit: "tiao", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "hu-b2", suit: "tiao", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "hu-b3", suit: "tiao", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "hu-p1", suit: "tong", rank: 9, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "hu-p2", suit: "tong", rank: 9, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "river-clear", suit: "honor", rank: 5, x: 0, y: 0, layer: 0, blockedBy: [], location: "river" },
      { id: "river-keep", suit: "honor", rank: 6, x: 0, y: 0, layer: 0, blockedBy: [], location: "river" },
      { id: "hu-block-1", suit: "wan", rank: 4, x: 10, y: 10, layer: 0, blockedBy: ["hu-top-1"], location: "board" },
      { id: "hu-block-2", suit: "wan", rank: 5, x: 20, y: 20, layer: 0, blockedBy: ["hu-top-2"], location: "board" },
      { id: "hu-block-3", suit: "wan", rank: 6, x: 30, y: 30, layer: 0, blockedBy: ["hu-top-3"], location: "board" },
      { id: "hu-block-4", suit: "wan", rank: 7, x: 40, y: 40, layer: 0, blockedBy: ["hu-top-4"], location: "board" },
      { id: "hu-top-1", suit: "tong", rank: 1, x: 10, y: 10, layer: 1, blockedBy: [], location: "board" },
      { id: "hu-top-2", suit: "tong", rank: 2, x: 20, y: 20, layer: 1, blockedBy: [], location: "board" },
      { id: "hu-top-3", suit: "tong", rank: 3, x: 30, y: 30, layer: 1, blockedBy: [], location: "board" },
      { id: "hu-top-4", suit: "tong", rank: 4, x: 40, y: 40, layer: 1, blockedBy: [], location: "board" },
    ];
    model.state = createPrototypeState(huTiles, huTiles.slice(0, 8).map((tile) => tile.id), {
      slotLimit: 8,
      river: ["river-clear", "river-keep"],
      riverLimit: 3,
    });
    const beforeHuRemoved = removedCount();
    executeCombo(getComboCandidates().find((candidate) => candidate.type === "hu"));
    const huResult = {
      slotAfter: [...model.state.slot],
      riverAfter: [...model.state.river],
      removedDelta: removedCount() - beforeHuRemoved,
      looseCount: model.state.tiles.filter((tile) => tile.looseMountainTile && tile.location === "board").length,
      statusText: view.status.textContent,
    };

    const repeatedLooseTiles = [
      { id: "loose-a", suit: "wan", rank: 1, x: 80, y: 80, layer: 2, blockedBy: [], location: "board", stackColumn: true, stackColumnId: "old-a", stackBridge: true, stackBridgeId: "old-bridge-a" },
      { id: "loose-b", suit: "wan", rank: 2, x: 90, y: 90, layer: 2, blockedBy: [], location: "board", stackColumn: true, stackColumnId: "old-b", stackBridge: true, stackBridgeId: "old-bridge-b" },
      { id: "loose-c", suit: "wan", rank: 3, x: 100, y: 100, layer: 2, blockedBy: [], location: "board", stackColumn: true, stackColumnId: "old-c", stackBridge: true, stackBridgeId: "old-bridge-c" },
      { id: "loose-d", suit: "tong", rank: 1, x: 110, y: 110, layer: 2, blockedBy: [], location: "board", stackColumn: true, stackColumnId: "old-d", stackBridge: true, stackBridgeId: "old-bridge-d" },
      { id: "loose-e", suit: "tong", rank: 2, x: 120, y: 120, layer: 2, blockedBy: [], location: "board", stackColumn: true, stackColumnId: "old-e", stackBridge: true, stackBridgeId: "old-bridge-e" },
      { id: "loose-f", suit: "tong", rank: 3, x: 130, y: 130, layer: 2, blockedBy: [], location: "board", stackColumn: true, stackColumnId: "old-f", stackBridge: true, stackBridgeId: "old-bridge-f" },
    ];
    model.state = createPrototypeState(repeatedLooseTiles, [], { slotLimit: 8, riverLimit: 3 });
    repeatedLooseTiles.slice(0, 3).forEach((tile, index) => shakeLooseMountainTile(tile, index, 3));
    repeatedLooseTiles.slice(3, 6).forEach((tile, index) => shakeLooseMountainTile(tile, index, 3));
    const looseTileSnapshots = repeatedLooseTiles.map((tile) => ({
      id: tile.id,
      x: tile.x,
      y: tile.y,
      stackOrder: tile.stackOrder,
      loose: Boolean(tile.looseMountainTile && !tile.stackColumn && !tile.stackBridge),
      available: !isTileBlocked(tile.id),
    }));
    const overlapPairs = countLooseOverlapPairs(repeatedLooseTiles);

    const coverUnder = { id: "cover-under", suit: "wan", rank: 8, x: 220, y: 180, layer: 0, blockedBy: [], location: "board" };
    const coverLoose = { id: "cover-loose", suit: "wan", rank: 9, x: 220, y: 180, layer: 0, blockedBy: [], location: "board" };
    model.state = createPrototypeState([coverUnder, coverLoose], [], { slotLimit: 8, riverLimit: 3 });
    shakeLooseMountainTile(coverLoose, 0, 1);
    coverLoose.x = coverUnder.x;
    coverLoose.y = coverUnder.y;
    const looseLayoutResult = {
      overlapPairs,
      looseTiles: looseTileSnapshots,
      coveredByLooseBlocked: isTileBlocked("cover-under"),
      coverLooseAvailable: !isTileBlocked("cover-loose"),
    };

    ({
      river: riverResult,
      fullSlotWithRiver,
      peng: pengResult,
      bugang: bugangResult,
      gang: gangResult,
      hu: huResult,
      looseLayout: looseLayoutResult,
    });

    function createPrototypeState(tiles, slot = [], options = {}) {
      return {
        tiles,
        slot,
        reserve: options.reserve ?? [],
        river: options.river ?? [],
        riverLimit: options.riverLimit ?? 3,
        discardSelecting: false,
        openMelds: options.openMelds ?? [],
        slotLimit: options.slotLimit ?? 8,
        reserveLimit: options.reserveLimit ?? 0,
        shields: options.shields ?? 0,
        firstProtect: false,
        score: 0,
        coins: 0,
        comboCounts: { chi: 0, peng: 0, gang: 0, hu: 0, bugang: 0 },
        suitComboCounts: createEmptySuitTotals(),
        bossGoals: [],
        tools: options.tools ?? { shuffle: 0, undo: 0, discard: 0 },
        bonuses: { chi: 0, peng: 0, gang: 0, hu: 0, bugang: 0 },
        history: [],
        visionActive: false,
        phase: "playing",
        recentBossProgress: [],
      };
    }

    function removedCount() {
      return model.state.tiles.filter((tile) => tile.location === "removed").length;
    }

    function cloneMelds(melds) {
      return melds.map((meld) => ({
        type: meld.type,
        tileKey: meld.tileKey,
        count: meld.count,
        source: meld.source,
      }));
    }

    function countLooseOverlapPairs(tiles) {
      let pairs = 0;
      for (let leftIndex = 0; leftIndex < tiles.length; leftIndex += 1) {
        for (let rightIndex = leftIndex + 1; rightIndex < tiles.length; rightIndex += 1) {
          if (getMountainVisualOverlapRatio(tiles[leftIndex], tiles[rightIndex], tiles) >= BLOCKED_COVER_RATIO) {
            pairs += 1;
          }
        }
      }
      return pairs;
    }
  `, context) as PrototypeRiverKongHuSummary;
}

function readPrototypeSpecialEventsSummary(): PrototypeSpecialEventsSummary {
  const script = readPrototypeScriptForVm();
  const elements = new Map<string, PrototypeDummyElement>();
  const getElement = (selector: string): PrototypeDummyElement => {
    const element = elements.get(selector) ?? createPrototypeDummyElement();
    elements.set(selector, element);
    return element;
  };
  const body = getElement("body");
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
      title: "",
      body,
      documentElement: createPrototypeDummyElement(),
      createElement(): PrototypeDummyElement {
        return createPrototypeDummyElement();
      },
      querySelector(selector: string): PrototypeDummyElement {
        return getElement(selector);
      },
      querySelectorAll(): PrototypeDummyElement[] {
        return [];
      },
    },
    window: {
      location: { search: "" },
      scrollX: 0,
      scrollY: 0,
      innerWidth: 472,
      innerHeight: 779,
    },
    __levelsConfig: levelsConfig,
    __rewardsConfig: rewardsConfig,
  };

  createContext(context);

  return runInContext(`
    ${script}
    model.levelsConfig = __levelsConfig;
    model.rewardsConfig = __rewardsConfig;
    applyInitialRouteState();
    model.mode = "mountain";
    model.prototypeView = "play";

    function snapshotTrigger(levelIndex) {
      restartRun();
      view.rewardOverlay.classList.remove("show");
      loadLevel(levelIndex);
      return {
        phase: model.state.phase,
        titleText: view.rewardTitle.textContent,
        summaryText: view.runComplete.children[0]?.textContent ?? "",
        actionTexts: view.rewardGrid.children.map((child) => child.children[0]?.textContent ?? child.textContent),
      };
    }

    const level6 = snapshotTrigger(5);
    const level8 = snapshotTrigger(7);
    const level10 = snapshotTrigger(9);

    restartRun();
    loadLevel(5);
    const coinBefore = model.run.coins;
    chooseSpecialEventOption("old-sparrow", "coins");
    const coins = {
      before: coinBefore,
      after: model.run.coins,
      phaseAfterChoice: model.state.phase,
      statusText: view.status.textContent,
    };

    restartRun();
    loadLevel(5);
    const beforeDiscard = model.run.tools.discard + FRIEND_DEMO_DEFAULT_TOOLS.discard;
    chooseSpecialEventOption("old-sparrow", "discard");
    const tool = {
      beforeDiscard,
      afterDiscard: model.state.tools.discard,
      statusText: view.status.textContent,
    };

    restartRun();
    loadLevel(5);
    const expectedDisable = SPECIAL_EVENT_POOL
      .find((event) => event.id === "dark-table")
      .options.find((option) => option.id === "disable-shuffle")
      .effect.modifier;
    chooseSpecialEventOption("dark-table", "disable-shuffle");
    useShuffleTool();
    const disableShuffle = {
      pendingModifier: expectedDisable,
      activeModifier: model.state.activeLevelModifier ? { ...model.state.activeLevelModifier } : null,
      shuffleDisabled: view.shuffleButton.disabled,
      statusText: view.status.textContent,
    };

    restartRun();
    loadLevel(5);
    const expectedHighPressure = SPECIAL_EVENT_POOL
      .find((event) => event.id === "raise-stakes")
      .options.find((option) => option.id === "high-pressure")
      .effect.modifier;
    const baseTileCount = getFriendDemoDifficultyProfile(5).tileCount;
    chooseSpecialEventOption("raise-stakes", "high-pressure");
    const highPressure = {
      pendingModifier: expectedHighPressure,
      activeModifier: model.state.activeLevelModifier ? { ...model.state.activeLevelModifier } : null,
      baseTileCount,
      tileCount: model.state.tiles.length,
      hudGoalText: view.hudGoal.textContent,
      nextLevelModifier: null,
    };
    loadLevel(6, { resetFixedMountainTemplate: true });
    highPressure.nextLevelModifier = model.state.activeLevelModifier;

    ({
      triggers: { level6, level8, level10 },
      coins,
      tool,
      disableShuffle,
      highPressure,
    });
  `, context) as PrototypeSpecialEventsSummary;
}

function readPrototypeBossTrialSummary(): PrototypeBossTrialSummary {
  const script = readPrototypeScriptForVm();
  const elements = new Map<string, PrototypeDummyElement>();
  const getElement = (selector: string): PrototypeDummyElement => {
    const element = elements.get(selector) ?? createPrototypeDummyElement();
    elements.set(selector, element);
    return element;
  };
  const body = getElement("body");
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
      title: "",
      body,
      documentElement: createPrototypeDummyElement(),
      createElement(): PrototypeDummyElement {
        return createPrototypeDummyElement();
      },
      querySelector(selector: string): PrototypeDummyElement {
        return getElement(selector);
      },
      querySelectorAll(): PrototypeDummyElement[] {
        return [];
      },
    },
    window: {
      location: { search: "" },
      scrollX: 0,
      scrollY: 0,
      innerWidth: 472,
      innerHeight: 779,
    },
    __levelsConfig: levelsConfig,
    __rewardsConfig: rewardsConfig,
  };

  createContext(context);

  return runInContext(`
    ${script}
    model.levelsConfig = __levelsConfig;
    model.rewardsConfig = __rewardsConfig;
    applyInitialRouteState();
    model.mode = "mountain";
    model.prototypeView = "play";

    function enterTrialLevel() {
      restartRun();
      model.run.specialEventsSeen.push(9);
      loadLevel(9, { resetFixedMountainTemplate: true });
    }

    function getRunCompleteSummaryText() {
      return view.runComplete.children.map((child) => child.textContent).join(" ");
    }

    function clearBoardForResolution() {
      model.state.tiles.forEach((tile) => {
        tile.location = "removed";
      });
      model.state.slot = [];
    }

    enterTrialLevel();
    const initial = {
      levelOrder: model.levelIndex + 1,
      phase: model.state.phase,
      bossGoals: model.state.bossGoals.map((goal) => ({ ...goal })),
      hudGoalText: view.hudGoal.textContent,
      goalTitleText: view.bossGoal.children[0]?.textContent ?? "",
      goalTexts: (view.bossGoal.children[1]?.children ?? []).map((child) => child.textContent),
    };

    clearBoardForResolution();
    resolveLevelClear("测试试炼未达标");
    const failedClear = {
      phase: model.state.phase,
      statusText: view.status.textContent,
      overlayShown: view.rewardOverlay.classList.contains("show"),
      summaryText: getRunCompleteSummaryText(),
    };

    enterTrialLevel();
    const coinsBeforeReward = model.run.coins;
    model.state.comboCounts.gang = 1;
    model.state.comboCounts.hu = 1;
    model.state.score = 180;
    clearBoardForResolution();
    resolveLevelClear("测试试炼通关");
    const coinsAfterReward = model.run.coins;
    const rewardClear = {
      phase: model.state.phase,
      coinDelta: coinsAfterReward - coinsBeforeReward,
      statusText: view.status.textContent,
      overlayShown: view.rewardOverlay.classList.contains("show"),
      summaryText: getRunCompleteSummaryText(),
    };

    completeCurrentLevel("重复结算测试");
    const duplicateReward = {
      coinDelta: model.run.coins - coinsAfterReward,
    };

    ({
      initial,
      failedClear,
      rewardClear,
      duplicateReward,
    });
  `, context) as PrototypeBossTrialSummary;
}

function readPrototypeHuHintSummary(): PrototypeHuHintSummary {
  const script = readPrototypeScriptForVm();
  const elements = new Map<string, PrototypeDummyElement>();
  const getElement = (selector: string): PrototypeDummyElement => {
    const element = elements.get(selector) ?? createPrototypeDummyElement();
    elements.set(selector, element);
    return element;
  };
  const body = getElement("body");
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
      title: "",
      body,
      documentElement: createPrototypeDummyElement(),
      createElement(): PrototypeDummyElement {
        return createPrototypeDummyElement();
      },
      querySelector(selector: string): PrototypeDummyElement {
        return getElement(selector);
      },
      querySelectorAll(): PrototypeDummyElement[] {
        return [];
      },
    },
    window: {
      location: { search: "" },
      scrollX: 0,
      scrollY: 0,
      innerWidth: 472,
      innerHeight: 779,
    },
    __levelsConfig: levelsConfig,
    __rewardsConfig: rewardsConfig,
  };

  createContext(context);

  return runInContext(`
    ${script}
    model.levelsConfig = __levelsConfig;
    model.rewardsConfig = __rewardsConfig;
    applyInitialRouteState();
    model.mode = "config";
    model.levelIndex = 4;

    model.state = createPrototypeState([
      { id: "ready-a1", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "ready-a2", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "ready-a3", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "ready-b1", suit: "tiao", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "ready-b2", suit: "tiao", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "ready-b3", suit: "tiao", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "ready-p1", suit: "tong", rank: 9, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "ready-p2", suit: "tong", rank: 9, x: 0, y: 0, layer: 0, blockedBy: [], location: "board" },
    ], ["ready-a1", "ready-a2", "ready-a3", "ready-b1", "ready-b2", "ready-b3", "ready-p1"]);
    const readyHint = readHintSnapshot();

    model.state = createPrototypeState([
      { id: "two-a1", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "two-a2", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "two-a3", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "two-b1", suit: "tiao", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "two-b2", suit: "tiao", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "two-p1", suit: "tong", rank: 9, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "two-b3", suit: "tiao", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "board" },
      { id: "two-p2", suit: "tong", rank: 9, x: 0, y: 0, layer: 0, blockedBy: [], location: "board" },
    ], ["two-a1", "two-a2", "two-a3", "two-b1", "two-b2", "two-p1"]);
    const twoAwayHint = readHintSnapshot();

    model.state = createPrototypeState([
      { id: "empty-a1", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "empty-a2", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "empty-a3", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "empty-b1", suit: "tiao", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "empty-b2", suit: "tiao", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "empty-b3", suit: "tiao", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "empty-p1", suit: "tong", rank: 9, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
    ], ["empty-a1", "empty-a2", "empty-a3", "empty-b1", "empty-b2", "empty-b3", "empty-p1"]);
    const exhaustedHint = readHintSnapshot();

    ({ readyHint, twoAwayHint, exhaustedHint });

    function createPrototypeState(tiles, slot = []) {
      return {
        tiles,
        slot,
        reserve: [],
        river: [],
        riverLimit: 3,
        discardSelecting: false,
        openMelds: [],
        slotLimit: 8,
        reserveLimit: 0,
        shields: 0,
        firstProtect: false,
        score: 0,
        coins: 0,
        comboCounts: { chi: 0, peng: 0, gang: 0, hu: 0, bugang: 0 },
        suitComboCounts: createEmptySuitTotals(),
        bossGoals: [],
        tools: { shuffle: 0, undo: 0, discard: 0 },
        bonuses: { chi: 0, peng: 0, gang: 0, hu: 0, bugang: 0 },
        history: [],
        visionActive: false,
        phase: "playing",
        recentBossProgress: [],
      };
    }

    function readHintSnapshot() {
      const waitKeys = getHuWaitTargetKeys();
      view.counts.children = [];
      renderAll("听牌检查");
      return {
        text: view.huHint.textContent,
        distance: view.huHint.dataset.distance ?? "",
        waitKeys,
        highlightedDots: readHighlightedDots(),
      };
    }

    function readHighlightedDots() {
      return view.counts.children.flatMap((row) => (
        row.children[1]?.children
          .filter((dot) => dot.className.includes("hu-wait"))
          .map((dot) => getCounterDotText(dot)) ?? []
      ));
    }

    function getCounterDotText(dot) {
      const face = dot.children?.find((child) => child.className === "rank-face")?.textContent ?? dot.textContent;
      const count = dot.children?.find((child) => child.className === "rank-count")?.textContent ?? "";
      return count ? face + ":" + count : face;
    }
  `, context) as PrototypeHuHintSummary;
}

function readPrototypeFriendDemoSummary(): PrototypeFriendDemoSummary {
  const script = readPrototypeScriptForVm();
  const elements = new Map<string, PrototypeDummyElement>();
  const getElement = (selector: string): PrototypeDummyElement => {
    const element = elements.get(selector) ?? createPrototypeDummyElement();
    elements.set(selector, element);
    return element;
  };
  const body = getElement("body");
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
      title: "",
      body,
      documentElement: createPrototypeDummyElement(),
      createElement(): PrototypeDummyElement {
        return createPrototypeDummyElement();
      },
      querySelector(selector: string): PrototypeDummyElement {
        return getElement(selector);
      },
      querySelectorAll(): PrototypeDummyElement[] {
        return [];
      },
    },
    window: {
      location: { search: "" },
      scrollX: 0,
      scrollY: 0,
      innerWidth: 472,
      innerHeight: 779,
    },
    __levelsConfig: levelsConfig,
    __rewardsConfig: rewardsConfig,
  };

  createContext(context);

  return runInContext(`
    ${script}
    model.levelsConfig = __levelsConfig;
    model.rewardsConfig = __rewardsConfig;
    applyInitialRouteState();
    const demoLevelIndexes = Array.from({ length: FRIEND_DEMO_LEVEL_COUNT }, (_, index) => index);
    const slotLimits = demoLevelIndexes.map((index) => getFriendDemoSlotLimit(index));
    const featuredCombos = demoLevelIndexes.map((index) => getFriendDemoFeaturedCombos(index));
    const levelModes = demoLevelIndexes.map((index) => getFriendDemoLevelMode(index));
    const rewardCheckpointOrders = demoLevelIndexes
      .filter((index) => shouldOfferRewardAfterLevel(index))
      .map((index) => model.levelsConfig.levels[index].order);
    const bossLevelOrders = demoLevelIndexes
      .filter((index) => getActiveBossGoals(index).length > 0)
      .map((index) => model.levelsConfig.levels[index].order);
    const tutorialTileCounts = [0, 1, 2, 3].map((index) => (
      createFriendDemoTutorialTiles(model.levelsConfig.levels[index]).length
    ));
    const tutorialRequiredCombos = [0, 1, 2, 3].map((index) => getFriendDemoTutorialRequiredCombo(index));
    const tutorialCandidateTypes = [0, 1, 2, 3].map((index) => {
      const tiles = createFriendDemoTutorialTiles(model.levelsConfig.levels[index]);
      model.levelIndex = index;
      model.state = {
        tiles: tiles.map((tile) => ({ ...tile, location: "slot" })),
        slot: tiles.map((tile) => tile.id),
        reserve: [],
        slotLimit: getFriendDemoSlotLimit(index),
        reserveLimit: 0,
        shields: 0,
        firstProtect: false,
        score: 0,
        coins: 0,
        comboCounts: { chi: 0, peng: 0, gang: 0, hu: 0 },
        suitComboCounts: createEmptySuitTotals(),
        bossGoals: [],
        tools: { shuffle: 0, undo: 0, discard: 0 },
        bonuses: { chi: 0, peng: 0, gang: 0, hu: 0 },
        history: [],
        visionActive: false,
        phase: "playing",
        recentBossProgress: [],
      };
      return [...new Set(getComboCandidates().map((candidate) => candidate.type))];
    });
    const tutorialClearResults = [0, 1, 2, 3].map((index) => {
      const tiles = createFriendDemoTutorialTiles(model.levelsConfig.levels[index]);
      model.levelIndex = index;
      model.state = {
        tiles: tiles.map((tile) => ({ ...tile, location: "board" })),
        slot: [],
        reserve: [],
        slotLimit: getFriendDemoSlotLimit(index),
        reserveLimit: 0,
        shields: 0,
        firstProtect: false,
        score: 0,
        coins: 0,
        comboCounts: { chi: 0, peng: 0, gang: 0, hu: 0 },
        suitComboCounts: createEmptySuitTotals(),
        bossGoals: [],
        tools: { shuffle: 0, undo: 0, discard: 0 },
        bonuses: { chi: 0, peng: 0, gang: 0, hu: 0 },
        history: [],
        visionActive: false,
        phase: "playing",
        recentBossProgress: [],
      };
      view.rewardOverlay.classList.remove("show");
      view.rewardTitle.textContent = "";
      view.status.textContent = "";
      for (const tile of tiles) moveTileToSlot(tile.id);
      const beforeActionPhase = model.state.phase;
      const beforeActionOverlayShown = view.rewardOverlay.classList.contains("show");
      const beforeActionStatusText = view.status.textContent;
      const requiredCombo = getFriendDemoTutorialRequiredCombo(index);
      const candidate = getComboCandidates().find((item) => item.type === requiredCombo);
      executeCombo(candidate);
      return {
        levelOrder: index + 1,
        requiredCombo,
        beforeActionPhase,
        beforeActionOverlayShown,
        beforeActionStatusText,
        afterActionPhase: model.state.phase,
        afterActionOverlayShown: view.rewardOverlay.classList.contains("show"),
        afterActionTitleText: view.rewardTitle.textContent,
      };
    });
    const fixedReward = createFriendDemoFixedReward();
    const firstReward = {
      id: fixedReward.id,
      slotDelta: fixedReward.effects.find((effect) => effect.type === "slot_limit_delta").value,
    };
    const mountainLevelIndexes = demoLevelIndexes.filter((index) => getFriendDemoLevelMode(index) === "mountain");
    const mountainLevels = mountainLevelIndexes.map((index) => {
      model.levelIndex = index;
      const level = model.levelsConfig.levels[index];
      const profile = getFriendDemoDifficultyProfile(index);
      const tuning = getEffectiveMountainTuningForLevel(level, index);
      const tiles = generateMountainTiles(level);
      model.state = createPrototypeState(tiles, [], {
        slotLimit: getFriendDemoSlotLimit(index),
        reserveLimit: 0,
        tools: { shuffle: 0, undo: 0, discard: 0 },
      });
      const initialAvailableTiles = tiles.filter((tile) => !isTileBlocked(tile.id));
      const initialSolutionGroupCounts = initialAvailableTiles.reduce((counts, tile) => {
        const key = tile.solutionGroup ?? tile.sourcePackage ?? tile.id;
        counts.set(key, (counts.get(key) ?? 0) + 1);
        return counts;
      }, new Map());
      const solutionGroups = tiles.reduce((groups, tile) => {
        const key = tile.solutionGroup ?? tile.sourcePackage ?? tile.id;
        const group = groups.get(key) ?? [];
        group.push(tile);
        groups.set(key, group);
        return groups;
      }, new Map());
      const solutionGroupEntries = [...solutionGroups.entries()];
      const naturalGangGroups = solutionGroupEntries.filter(([, group]) => getComboTypeForSolutionGroup(group) === "gang");
      const naturalGangRoutes = naturalGangGroups.map(([groupKey, group]) => {
        const tileKey = getTileKey(group[0]);
        const steps = [...new Set(group.map((tile) => tile.solutionStep ?? 0))].sort((a, b) => a - b);
        return {
          tileKey,
          steps,
          lastRouteStep: Math.max(...steps),
          initiallyVisible: group.filter((tile) => initialAvailableTiles.some((available) => available.id === tile.id)).length,
          sameTileNonGangGroups: solutionGroupEntries
            .filter(([otherKey, otherGroup]) => otherKey !== groupKey && otherGroup.some((tile) => getTileKey(tile) === tileKey))
            .map(([otherKey]) => otherKey),
        };
      });
      const orphanRiskSummary = getFriendDemoOrphanRiskSummary(tiles, index);
      const suitRanks = ALL_SUITS.reduce((ranks, suit) => {
        ranks[suit] = [...new Set(tiles.filter((tile) => tile.suit === suit).map((tile) => tile.rank))].sort((a, b) => a - b);
        return ranks;
      }, {});
      return {
        levelOrder: index + 1,
        label: profile.label,
        tileCount: tiles.length,
        stackDepth: tuning.stackDepth,
        huPacks: tuning.huPacks,
        honorWeight: tuning.honorWeight,
        naturalGangGroups: naturalGangGroups.length,
        naturalGangTileIdentities: naturalGangGroups.map(([, group]) => getTileKey(group[0])),
        naturalGangRoutes,
        orphanBudget: orphanRiskSummary.budget,
        orphanRisk: orphanRiskSummary.risk,
        unresolvedSolutionGroups: orphanRiskSummary.unresolvedGroups,
        suitRanks,
        initialAvailable: initialAvailableTiles.length,
        initialMaxSolutionGroupAvailable: Math.max(0, ...initialSolutionGroupCounts.values()),
        initialCompleteSolutionGroups: [...initialSolutionGroupCounts.entries()]
          .filter(([, count]) => count >= 3)
          .map(([group]) => group),
      };
    });
    const fullSlotTiles = [
      { id: "slot-1", suit: "honor", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "slot-2", suit: "honor", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "slot-3", suit: "honor", rank: 3, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "slot-4", suit: "honor", rank: 4, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "slot-5", suit: "honor", rank: 5, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "slot-6", suit: "honor", rank: 6, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "slot-7", suit: "honor", rank: 7, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "last-tile", suit: "wan", rank: 9, x: 10, y: 10, layer: 0, blockedBy: [], location: "board" },
      { id: "extra-board", suit: "tiao", rank: 1, x: 60, y: 10, layer: 0, blockedBy: [], location: "board" },
    ];
    model.levelIndex = 4;
    loadLevel(4);
    model.state.tiles = fullSlotTiles;
    model.state.slot = fullSlotTiles.slice(0, 7).map((tile) => tile.id);
    model.state.reserve = [];
    model.state.slotLimit = 8;
    model.state.shields = 0;
    model.state.tools = { shuffle: 0, undo: 0, discard: 1 };
    model.state.history = [];
    model.state.phase = "playing";
    view.rewardOverlay.classList.remove("show");
    view.status.textContent = "";
    moveTileToSlot("last-tile");
    const fullSlotResult = {
      slotLength: model.state.slot.length,
      reserveLength: model.state.reserve.length,
      lastTileLocation: findTile("last-tile").location,
      phase: model.state.phase,
      overlayShown: view.rewardOverlay.classList.contains("show"),
      statusText: view.status.textContent,
    };
    const counterTiles = [
      { id: "counter-a", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "board" },
      { id: "counter-b", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "counter-c", suit: "tong", rank: 9, x: 0, y: 0, layer: 0, blockedBy: [], location: "board" },
    ];
    model.state = createPrototypeState(counterTiles, ["counter-b"], { slotLimit: 8 });
    view.counts.children = [];
    renderCounts();
    const beforeCounter = readCounterSnapshot();
    findTile("counter-a").location = "removed";
    view.counts.children = [];
    renderCounts();
    const afterCounter = readCounterSnapshot();
    const discardTiles = [
      { id: "slot-a", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "slot-b", suit: "wan", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
    ];
    model.state = createPrototypeState(discardTiles, ["slot-a", "slot-b"], {
      slotLimit: 6,
      tools: { shuffle: 0, undo: 0, discard: 1 },
    });
    const beforeSlot = model.state.slot.length;
    useDiscardTool();
    const selectingAfterTool = model.state.discardSelecting;
    discardSlotTile(0);
    const discardResult = {
      beforeSlot,
      selectingAfterTool,
      afterSlot: model.state.slot.length,
      discardedLocation: findTile("slot-a").location,
      riverIds: [...model.state.river],
      discardCount: model.state.tools.discard,
      statusText: view.status.textContent,
    };
    model.run.specialEventsSeen.push(19);
    loadLevel(19, { resetFixedMountainTemplate: true });
    const finalBoss = {
      levelOrder: model.levelIndex + 1,
      levelNameText: view.levelName.textContent,
      levelMetaText: view.levelMeta.textContent,
      hudGoalText: view.hudGoal.textContent,
      goalTitleText: view.bossGoal.children[0]?.textContent ?? "",
      goalTexts: (view.bossGoal.children[1]?.children ?? []).map((child) => child.textContent),
      bossGoals: model.state.bossGoals.map((goal) => ({ ...goal })),
    };
    ({
      demoLevels: FRIEND_DEMO_LEVEL_COUNT,
      slotLimits,
      featuredCombos,
      levelModes,
      tileCounts: [...tutorialTileCounts, ...mountainLevels.map((level) => level.tileCount)],
      rewardCheckpointOrders,
      bossLevelOrders,
      finalBoss,
      tutorialRequiredCombos,
      tutorialCandidateTypes,
      tutorialClearResults,
      firstReward,
      toolLabels: FRIEND_DEMO_TOOLS.map((tool) => tool.label),
      toolKeys: FRIEND_DEMO_TOOLS.map((tool) => tool.key),
      mountainLevels,
      level5: {
        mode: getFriendDemoLevelMode(4),
        ...mountainLevels[0],
      },
      fullSlotResult,
      discardResult,
      counterResult: {
        beforeSuitLabels: beforeCounter.suitLabels,
        beforeWanDots: beforeCounter.wanDots,
        afterSuitLabels: afterCounter.suitLabels,
        afterWanDots: afterCounter.wanDots,
      },
    });

    function createPrototypeState(tiles, slot = [], options = {}) {
      return {
        tiles,
        slot,
        reserve: options.reserve ?? [],
        slotLimit: options.slotLimit ?? 8,
        reserveLimit: options.reserveLimit ?? 0,
        shields: options.shields ?? 0,
        firstProtect: false,
        score: 0,
        coins: 0,
        comboCounts: { chi: 0, peng: 0, gang: 0, hu: 0 },
        suitComboCounts: createEmptySuitTotals(),
        bossGoals: [],
        tools: options.tools ?? { shuffle: 0, undo: 0, discard: 0 },
        bonuses: { chi: 0, peng: 0, gang: 0, hu: 0 },
        history: [],
        visionActive: false,
        phase: "playing",
        recentBossProgress: [],
      };
    }

    function readCounterSnapshot() {
      const rows = view.counts.children.map((row) => ({
        label: row.children[0]?.textContent ?? "",
        dots: row.children[1]?.children.map((dot) => getCounterDotText(dot)) ?? [],
      }));
      return {
        suitLabels: rows.map((row) => row.label),
        wanDots: rows.find((row) => row.label.startsWith("万 "))?.dots ?? [],
      };
    }

    function getCounterDotText(dot) {
      const face = dot.children?.find((child) => child.className === "rank-face")?.textContent ?? dot.textContent;
      const count = dot.children?.find((child) => child.className === "rank-count")?.textContent ?? "";
      return count ? face + ":" + count : face;
    }
  `, context) as PrototypeFriendDemoSummary;
}

function readPrototypeEndgameSettlementSummary(): PrototypeEndgameSettlementSummary {
  const script = readPrototypeScriptForVm();
  const elements = new Map<string, PrototypeDummyElement>();
  const getElement = (selector: string): PrototypeDummyElement => {
    const element = elements.get(selector) ?? createPrototypeDummyElement();
    elements.set(selector, element);
    return element;
  };
  const body = getElement("body");
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
      title: "",
      body,
      documentElement: createPrototypeDummyElement(),
      createElement(): PrototypeDummyElement {
        return createPrototypeDummyElement();
      },
      querySelector(selector: string): PrototypeDummyElement {
        return getElement(selector);
      },
      querySelectorAll(): PrototypeDummyElement[] {
        return [];
      },
    },
    window: {
      location: { search: "" },
      scrollX: 0,
      scrollY: 0,
      innerWidth: 472,
      innerHeight: 779,
    },
    __levelsConfig: levelsConfig,
    __rewardsConfig: rewardsConfig,
  };

  createContext(context);

  return runInContext(`
    ${script}
    model.levelsConfig = __levelsConfig;
    model.rewardsConfig = __rewardsConfig;
    applyInitialRouteState();
    model.mode = "config";
    model.levelIndex = 4;

    model.state = createPrototypeState([
      { id: "settle-a", suit: "wan", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "settle-b", suit: "tiao", rank: 3, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
    ], ["settle-a", "settle-b"]);
    finishComboAction("测试清桌");
    const enter = {
      phase: model.state.phase,
      overlayShown: view.rewardOverlay.classList.contains("show"),
      titleText: view.rewardTitle.textContent,
      summaryText: view.runComplete.children.map((child) => child.textContent).join(" "),
      actionTexts: view.runComplete.children
        .filter((child) => child.type === "button")
        .map((child) => child.textContent),
      slotLength: model.state.slot.length,
      settlementIds: [...(model.state.endgameSettlement?.residualTileIds ?? [])],
    };

    model.state = createPrototypeState([
      { id: "discard-a", suit: "wan", rank: 4, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "discard-b", suit: "tiao", rank: 5, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
    ], ["discard-a", "discard-b"]);
    finishComboAction("测试弃牌");
    completeEndgameByDiscard();
    const discard = {
      phase: model.state.phase,
      overlayShown: view.rewardOverlay.classList.contains("show"),
      slotLength: model.state.slot.length,
      removedIds: model.state.tiles.filter((tile) => tile.location === "removed").map((tile) => tile.id).sort(),
      titleText: view.rewardTitle.textContent,
    };

    model.state = createPrototypeState([
      { id: "primer-a", suit: "tong", rank: 6, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      { id: "primer-b", suit: "honor", rank: 5, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
    ], ["primer-a", "primer-b"]);
    finishComboAction("测试牌引");
    startEndgamePrimerSelection();
    const selectingBeforePick = model.state.endgamePrimerSelecting;
    pickEndgamePrimerTile(0);
    const pendingGuideTile = model.run.pendingGuideTile ? { ...model.run.pendingGuideTile } : null;
    const phaseAfterPick = model.state.phase;
    const slotAfterPick = [...model.state.slot];
    const removedIdsAfterPick = model.state.tiles.filter((tile) => tile.location === "removed").map((tile) => tile.id).sort();
    loadLevel(5, { resetFixedMountainTemplate: true });
    if (model.state.phase === "event") chooseSpecialEventOption("old-sparrow", "coins");
    const nextLevelSlotLabels = model.state.slot.map((tileId) => tileLabel(findTile(tileId)));
    const primer = {
      selectingBeforePick,
      phaseAfterPick,
      pendingGuideTile,
      slotAfterPick,
      removedIdsAfterPick,
      nextLevelSlotLabels,
      pendingGuideAfterLoad: model.run.pendingGuideTile ?? null,
      statusText: view.status.textContent,
    };

    ({ enter, discard, primer });

    function createPrototypeState(tiles, slot = []) {
      return {
        tiles,
        slot,
        reserve: [],
        river: [],
        riverLimit: 3,
        discardSelecting: false,
        endgameSettlement: null,
        endgamePrimerSelecting: false,
        openMelds: [],
        slotLimit: 8,
        reserveLimit: 0,
        shields: 0,
        firstProtect: false,
        score: 0,
        coins: 0,
        comboCounts: { chi: 0, peng: 0, gang: 0, hu: 0, bugang: 0 },
        suitComboCounts: createEmptySuitTotals(),
        bossGoals: [],
        tools: { shuffle: 0, undo: 0, discard: 0 },
        bonuses: { chi: 0, peng: 0, gang: 0, hu: 0, bugang: 0 },
        history: [],
        visionActive: false,
        phase: "playing",
        recentBossProgress: [],
      };
    }
  `, context) as PrototypeEndgameSettlementSummary;
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
  const classTokens = new Set<string>();

  element.classList = {
    add(...tokens: string[]): void {
      tokens.forEach((token) => classTokens.add(token));
    },
    remove(...tokens: string[]): void {
      tokens.forEach((token) => classTokens.delete(token));
    },
    toggle(token: string, force?: boolean): boolean {
      if (force === true) {
        classTokens.add(token);
        return true;
      }
      if (force === false) {
        classTokens.delete(token);
        return false;
      }
      if (classTokens.has(token)) {
        classTokens.delete(token);
        return false;
      }
      classTokens.add(token);
      return true;
    },
    contains(token: string): boolean {
      return classTokens.has(token);
    },
  };
  element.style = {
    setProperty(): void {},
  };
  element.dataset = {};
  element.children = [];
  element.className = "";
  element.type = "";
  element.value = "";
  element.href = "";
  element.hidden = false;
  element.innerHTML = "";
  element.textContent = "";
  element.disabled = false;
  element.append = (...nodes: unknown[]): void => {
    element.children.push(...nodes.filter(isPrototypeDummyElement));
  };
  element.appendChild = (node: unknown): unknown => {
    if (isPrototypeDummyElement(node)) element.children.push(node);
    return node;
  };
  element.setAttribute = (): void => {};
  element.addEventListener = (): void => {};
  element.querySelector = (): PrototypeDummyElement => element;
  element.querySelectorAll = (): PrototypeDummyElement[] => [];
  element.removeAttribute = (): void => {};

  return element;
}

function isPrototypeDummyElement(node: unknown): node is PrototypeDummyElement {
  return Boolean(node && typeof node === "object" && "textContent" in node);
}
