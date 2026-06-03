import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const prototypeRoot = path.join(repoRoot, "apps/game/mahjong-roguelike/prototypes/config-playable");

describe("胡了卜配置试玩原型页面边界", () => {
  const playHtml = readFileSync(path.join(prototypeRoot, "index.html"), "utf8");

  it("默认入口是玩家试玩页，并把调牌器放到独立新窗口", () => {
    expect(playHtml).toContain('<body class="play-view" data-prototype-view="play">');
    expect(playHtml).toContain('id="tunerLink"');
    expect(playHtml).toContain('href="./tuner.html"');
    expect(playHtml).toContain('target="_blank"');
    expect(playHtml).toContain('rel="noopener"');
    expect(playHtml).toContain('body.play-view .tuning-panel');
    expect(playHtml).toContain('body.play-view .top-controls');
  });

  it("调牌器入口通过独立页面进入 tuner 视图", () => {
    const tunerHtml = readFileSync(path.join(prototypeRoot, "tuner.html"), "utf8");

    expect(tunerHtml).toContain("<title>胡了卜调牌器</title>");
    expect(tunerHtml).toContain('target.searchParams.set("view", "tuner")');
    expect(tunerHtml).toContain("./index.html");
  });

  it("脚本区分 play 和 tuner，并只在调牌器视图显示调参面板", () => {
    expect(playHtml).toContain('const PROTOTYPE_VIEW_MODES = new Set(["play", "tuner"]);');
    expect(playHtml).toContain('prototypeView: "play"');
    expect(playHtml).toContain('model.prototypeView === "tuner"');
    expect(playHtml).toContain("view.mountainTuningPanel.hidden = !shouldShowTuning");
  });

  it("密集牌山默认使用数百张小牌压力版参数", () => {
    expect(playHtml).toContain("const MOUNTAIN_DEFAULT_TILE_COUNT = 240;");
    expect(playHtml).toContain("const MOUNTAIN_TILE_COUNT_RANGE = { min: 120, max: 420 };");
    expect(playHtml).toContain("const MOUNTAIN_COORDINATE_SYSTEM = { baseWidth: 560, baseHeight: 640 };");
    expect(playHtml).toContain("const MOUNTAIN_RULE_TILE_SIZE = { width: 52, height: 70 };");
    expect(playHtml).toContain("const MOUNTAIN_INITIAL_AVAILABLE_TARGET = 8;");
    expect(playHtml).toContain("const MOUNTAIN_STACK_PREVIEW_DEPTH = 4;");
    expect(playHtml).toContain("const MOUNTAIN_MERGED_STACK_COUNT = 2;");
    expect(playHtml).toContain("const MOUNTAIN_ACTIVE_STACK_COUNT = 10;");
    expect(playHtml).toContain("const MOUNTAIN_STACK_OVERLAP_RANGE = { min: 0.05, max: 1 };");
    expect(playHtml).toContain("const BLOCKED_COVER_RATIO = 0.08;");
    expect(playHtml).toContain("const MOUNTAIN_PRIMARY_STACK_COUNT = 4;");
    expect(playHtml).toContain("const MOUNTAIN_PRIMARY_STACK_WEIGHT_MULTIPLIER = 2.45;");
    expect(playHtml).toContain("const MOUNTAIN_STACK_CLUSTER_PULL = 0.78;");
    expect(playHtml).toContain("const MOUNTAIN_TEMPLATE_IDS = [");
    expect(playHtml).toContain('"center-tower"');
    expect(playHtml).toContain('"two-wings"');
    expect(playHtml).toContain('"cross"');
    expect(playHtml).toContain('"ring"');
    expect(playHtml).toContain('"long-wall"');
    expect(playHtml).toContain('"islands"');
    expect(playHtml).toContain('"canyon"');
    expect(playHtml).toContain('"staircase"');
    expect(playHtml).toContain('"suspended-waist"');
    expect(playHtml).toContain('"suspended-waist": "悬台窄腰"');
    expect(playHtml).toContain("templateRegion");
    expect(playHtml).toContain("function getSuspendedWaistTemplateAnchors");
    expect(playHtml).toContain('"top-platform"');
    expect(playHtml).toContain('"waist"');
    expect(playHtml).toContain('"support-column"');
    expect(playHtml).toContain('"side-scatter"');
    expect(playHtml).toContain("const MOUNTAIN_AUTO_TEMPLATE_IDS = [");
    expect(playHtml).toContain("function getAutoMountainTemplateIds()");
    expect(playHtml).toContain("function getMountainTemplateGenerationCandidates");
    expect(playHtml).toContain("function shouldRetryAutoMountainTemplate");
    expect(playHtml).toContain("function getGeneratedInitialAvailableCount");
    expect(playHtml).toContain('templateId: "auto"');
    expect(playHtml).toContain("tileCount: MOUNTAIN_DEFAULT_TILE_COUNT");
    expect(playHtml).toContain("stackDepth: 6");
    expect(playHtml).toContain("normalizeOptionalInteger(raw.tileCount, MOUNTAIN_TILE_COUNT_RANGE.min, MOUNTAIN_TILE_COUNT_RANGE.max)");
    expect(playHtml).toContain("normalizeMountainTemplateId(raw.templateId");
    expect(playHtml).toContain("function getFriendDemoGangTileKeys");
    expect(playHtml).toContain("orphanBudget");
    expect(playHtml).toContain("function assertFriendDemoOrphanRiskBudget");
    expect(playHtml).toContain("function getFriendDemoOrphanRiskSummary");
    expect(playHtml).toContain("function getFriendDemoOrphanRiskBudget");
    expect(playHtml).toContain("function buildRequiredTileIdentityQueue(tuning, reservedTileKeys = new Set())");
    expect(playHtml).toContain("function buildMountainFillerPatterns(level, random, tuning = null, reservedTileKeys = new Set())");
    expect(playHtml).toContain("function doesPatternUseReservedTile");
    expect(playHtml).toContain("function makeSuitCoveragePattern(suit, levelOrder, groupIndex)");
    expect(playHtml).toContain("function buildMixedWindowSolutionGroups");
    expect(playHtml).toContain("function canUseMixedWindowDistribution");
    expect(playHtml).toContain("mixedWindowRole");
    expect(playHtml).toContain("button.dataset.stackDepth");
    expect(playHtml).toContain("button.dataset.stackPreviewDepth");
    expect(playHtml).toContain("button.dataset.stackOverlapRatio");
    expect(playHtml).toContain("button.dataset.bridgeUnlocks");
    expect(playHtml).toContain("button.dataset.mixedWindowRole");
    expect(playHtml).toContain("content: attr(data-stack-depth);");
    expect(playHtml).toContain("content: attr(data-bridge-unlocks);");
    expect(playHtml).toContain("function createMountainBridgeGroups");
    expect(playHtml).toContain("function getMountainActiveTemplateAnchors");
    expect(playHtml).toContain("function refreshAutoMountainTemplateSeed");
    expect(playHtml).toContain("function getAutoMountainTemplateSeedText");
    expect(playHtml).toContain("function addMountainBridgePositions");
    expect(playHtml).toContain("function attachMountainBridgeBlockers");
    expect(playHtml).toContain("function createMountainStackOverlapProfile");
    expect(playHtml).toContain("function getStackVisiblePreviewDepth(tile)");
    expect(playHtml).toContain("function isVisibleStackDisplayTile(tile)");
    expect(playHtml).toContain("function getStackPreviewDepth(tile)");
    expect(playHtml).toContain("stack-preview");
    expect(playHtml).toContain("stack-bridge");
    expect(playHtml).toContain("return MOUNTAIN_RULE_TILE_SIZE;");
    expect(playHtml).toContain(".board[data-mode=\"mountain\"] .tile");
    expect(playHtml).toContain("body.play-view .app");
    expect(playHtml).toContain("grid-template-columns: minmax(0, 480px) 72px;");
    expect(playHtml).toContain("body.play-view .app {");
    expect(playHtml).toContain("grid-template-columns: minmax(0, 1fr) 56px;");
    expect(playHtml).toContain("align-items: start;");
    expect(playHtml).toContain("align-content: start;");
    expect(playHtml).toContain("max-height: calc(100vh - 24px);");
    expect(playHtml).toContain("body.play-view .board[data-mode=\"mountain\"]");
    expect(playHtml).toContain("grid-template-rows: auto auto auto auto auto;");
    expect(playHtml).toContain("width: min(100%, 330px);");
    expect(playHtml).toContain("width: min(100%, 350px);");
    expect(playHtml).toContain("width: 11.4285714286%;");
    expect(playHtml).toContain("aspect-ratio: 52 / 70;");
    expect(playHtml).toContain("aspect-ratio: 560 / 640;");
    expect(playHtml).toContain("min-height: 60px;");
    expect(playHtml).toContain("body.play-view .slot-cell");
    expect(playHtml).toContain("min-height: 44px;");
    expect(playHtml).toContain("justify-content: center;");
  });

  it("玩家页使用正式一屏 HUD，右侧只保留道具栏", () => {
    expect(playHtml).toContain('<section class="play-hud" aria-label="局内状态">');
    expect(playHtml).toContain('id="hudLevel"');
    expect(playHtml).toContain('id="hudGoal"');
    expect(playHtml).toContain('id="hudRemaining"');
    expect(playHtml).toContain('id="hudScore"');
    expect(playHtml).toContain('id="hudCoins"');
    expect(playHtml).toContain('<section class="section tools-section">');
    expect(playHtml).toContain("body.play-view .side > :not(.tools-section)");
    expect(playHtml).toContain("grid-template-columns: minmax(0, 480px) 72px;");
    expect(playHtml).toContain("body.play-view .tool-actions");
    expect(playHtml).toContain("grid-template-columns: minmax(0, 1fr) 56px;");
    expect(playHtml).toContain("grid-template-columns: repeat(var(--slot-count), minmax(26px, 1fr));");
    expect(playHtml).toContain('<div class="action-strip">');
    expect(playHtml).toContain("grid-template-columns: repeat(5, minmax(48px, 64px));");
    expect(playHtml).toContain("body.play-view .slot-area {");
    expect(playHtml).toContain("margin-bottom: 76px;");
    expect(playHtml).toContain("function renderPlayHud()");
    expect(playHtml).toContain("function getHudGoalText()");
    expect(playHtml).toContain("view.hudRemaining.textContent");
  });

  it("朋友试玩 Demo 编排为 10 关小 run 和右侧三道具", () => {
    expect(playHtml).toContain("const FRIEND_DEMO_LEVEL_COUNT = 10;");
    expect(playHtml).toContain("const FRIEND_DEMO_TUTORIAL_SLOT_LIMIT = 6;");
    expect(playHtml).toContain("const FRIEND_DEMO_FULL_SLOT_LIMIT = 8;");
    expect(playHtml).toContain('const FRIEND_DEMO_FIRST_REWARD_ID = "demo_slot_plus_2";');
    expect(playHtml).toContain("const FRIEND_DEMO_TUTORIAL_COMBOS = [\"peng\", \"chi\", \"gang\", \"hu\"];");
    expect(playHtml).toContain("const FRIEND_DEMO_DIFFICULTY_PROFILES = [");
    expect(playHtml).toContain('label: "正式入门"');
    expect(playHtml).toContain("tileCount: 72");
    expect(playHtml).toContain("tileCount: 240");
    expect(playHtml).toContain("function createFriendDemoTutorialTiles");
    expect(playHtml).toContain("function getFriendDemoSlotLimit");
    expect(playHtml).toContain("function getFriendDemoLevelMode");
    expect(playHtml).toContain("function getFriendDemoDifficultyProfile");
    expect(playHtml).toContain("function getEffectiveMountainTuningForLevel");
    expect(playHtml).toContain("function getFriendDemoTutorialRequiredCombo");
    expect(playHtml).toContain("function hasCompletedFriendDemoTutorialCombo");
    expect(playHtml).toContain("function canClearCurrentLevel");
    expect(playHtml).toContain("function getFriendDemoRewardPool");
    expect(playHtml).toContain("function createFriendDemoFixedReward");
    expect(playHtml).toContain("function useDiscardTool");
    expect(playHtml).toContain('id="discardButton"');
    expect(playHtml).toContain('id="discardCount"');
    expect(playHtml).toContain("<strong>洗牌</strong>");
    expect(playHtml).toContain("<strong>撤回</strong>");
    expect(playHtml).toContain("<strong>丢弃</strong>");
    expect(playHtml).toContain("view.discardButton");
    expect(playHtml).toContain("model.state.river");
    expect(playHtml).toContain("model.state.riverLimit");
  });

  it("玩家页显示记牌器，供玩家查看剩余花色和数量", () => {
    expect(playHtml).toContain('<section class="section counter-section" aria-label="记牌器">');
    expect(playHtml).toContain("<h2>记牌器</h2>");
    expect(playHtml).toContain("body.play-view .counter-section");
    expect(playHtml).toContain("body.play-view .counts");
    expect(playHtml).toContain('id="huHint"');
    expect(playHtml).toContain(".hu-hint");
    expect(playHtml).toContain("rank-dot has hu-wait");
    expect(playHtml).toContain(".rank-face");
    expect(playHtml).toContain(".rank-count");
    expect(playHtml).toContain('face.className = "rank-face";');
    expect(playHtml).toContain('countLabel.className = "rank-count";');
    expect(playHtml).toContain("countLabel.textContent = String(count);");
    expect(playHtml).toContain("function renderCounts()");
    expect(playHtml).toContain("function renderHuHint()");
    expect(playHtml).toContain("function getHuWaitHint()");
    expect(playHtml).toContain("function getHuWaitTargetKeys()");
    expect(playHtml).toContain("function getRemainingTileCounts()");
    expect(playHtml).toContain('if (tile.location !== "board") continue;');
    expect(playHtml).toContain("counts[tile.suit].total += 1;");
    expect(playHtml).toContain("counts[tile.suit].ranks[tile.rank] += 1;");
  });

  it("试玩 Demo 暴露有限牌河、明牌区和补杠行为入口", () => {
    expect(playHtml).toContain('<section class="section meld-section" aria-label="明牌区">');
    expect(playHtml).toContain('<section class="section river-section" aria-label="牌河">');
    expect(playHtml).toContain('id="openMelds"');
    expect(playHtml).toContain('id="river"');
    expect(playHtml).toContain("riverLimit");
    expect(playHtml).toContain("openMelds");
    expect(playHtml).toContain("discardSelecting");
    expect(playHtml).toContain("function startDiscardSelection()");
    expect(playHtml).toContain("function discardSlotTile");
    expect(playHtml).toContain("function renderRiver()");
    expect(playHtml).toContain("function renderOpenMelds()");
    expect(playHtml).toContain("function getSupplementalGangCandidates");
    expect(playHtml).toContain("function openMountainByAction");
    expect(playHtml).toContain("const KONG_SHAKE_LOOSE_COUNT = 1;");
    expect(playHtml).toContain("const HU_SHAKE_LOOSE_COUNT = 3;");
    expect(playHtml).toContain("openMountainByAction(HU_SHAKE_LOOSE_COUNT)");
    expect(playHtml).toContain("openMountainByAction(KONG_SHAKE_LOOSE_COUNT)");
    expect(playHtml).toContain("looseMountainTile");
    expect(playHtml).toContain("function shakeLooseMountainTile");
    expect(playHtml).toContain("function getLooseMountainPosition");
    expect(playHtml).toContain("bugang");
    expect(playHtml).toContain("补杠");
    expect(playHtml).toContain("胡后清河");
  });

  it("默认玩家页压缩 HUD，保证操作区优先留在一屏", () => {
    expect(playHtml).toContain("body.play-view .topbar {");
    expect(playHtml).toContain("display: none;");
    expect(playHtml).toContain("body.play-view .play-hud {");
    expect(playHtml).toContain("grid-template-columns: repeat(5, minmax(0, 1fr));");
    expect(playHtml).toContain("body.play-view .brand span {\n        display: none;");
    expect(playHtml).toContain("grid-template-columns: repeat(4, minmax(0, 1fr));");
    expect(playHtml).toContain("@media (max-width: 640px)");
    expect(playHtml).toContain("body.play-view .counts {\n          grid-template-columns: 1fr;");
    expect(playHtml).toContain("body.play-view .board[data-mode=\"mountain\"]");
    expect(playHtml).toContain("width: min(100%, 330px);");
    expect(playHtml).toContain("body.play-view .tool-button {");
    expect(playHtml).toContain("min-height: 36px;");
    expect(playHtml).toContain("body.play-view .slot-area {");
    expect(playHtml).toContain("margin-bottom: 76px;");
  });

  it("失败状态使用显眼弹层并提供重开本关入口", () => {
    expect(playHtml).toContain("function failLevel(reason)");
    expect(playHtml).toContain("function showLevelFailed(reason)");
    expect(playHtml).toContain('view.rewardTitle.textContent = "本关失败";');
    expect(playHtml).toContain('restart.textContent = "重开本关";');
    expect(playHtml).toContain("主槽已满，且当前没有可发动的组合或可用救场。");
  });

  it("失败和奖励弹层层级高于密集牌山所有牌", () => {
    expect(playHtml).toContain("const TILE_Z_INDEX_BASE = 10;");
    expect(playHtml).toContain("const OVERLAY_Z_INDEX = 1000000;");
    expect(playHtml).toContain('document.documentElement?.style?.setProperty("--overlay-z", String(OVERLAY_Z_INDEX));');
    expect(playHtml).toContain("z-index: var(--overlay-z);");
    expect(playHtml).toContain("button.style.zIndex = String(TILE_Z_INDEX_BASE + visual.order);");
  });
});
