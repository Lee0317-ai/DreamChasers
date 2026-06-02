import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, test } from "vitest";

const workspaceRoot = path.resolve(__dirname, "../../..");
const cocosRoot = path.join(
  workspaceRoot,
  "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8",
);

function readJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(cocosRoot, relativePath), "utf8")) as T;
}

function readWorkspaceJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(workspaceRoot, relativePath), "utf8")) as T;
}

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(cocosRoot, relativePath), "utf8");
}

function readPngInfo(filePath: string): { width: number; height: number; colorType: number } {
  const buffer = fs.readFileSync(filePath);
  expect(buffer.toString("ascii", 1, 4)).toBe("PNG");

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    colorType: buffer[25],
  };
}

function getTileOverlapRatio(
  tile: { x: number; y: number },
  blocker: { x: number; y: number },
): number {
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

describe("hulebu Cocos Creator 3.8.8 project scaffold", () => {
  test("uses a Creator empty-2d compatible project shell", () => {
    expect(fs.existsSync(cocosRoot)).toBe(true);

    const packageJson = readJson<{ name: string; displayName: string; creator: { version: string } }>(
      "package.json",
    );

    expect(packageJson).toMatchObject({
      name: "hulebu-cocos-3.8.8",
      displayName: "胡了卜",
      creator: {
        version: "3.8.8",
      },
    });

    expect(fs.existsSync(path.join(cocosRoot, ".creator/default-meta.json"))).toBe(true);
    expect(fs.existsSync(path.join(cocosRoot, "settings/v2/packages/engine.json"))).toBe(true);
    expect(fs.existsSync(path.join(cocosRoot, "profiles/v2/packages/scene.json"))).toBe(true);

    const tsconfig = readJson<{ extends: string; compilerOptions: { strict: boolean } }>("tsconfig.json");
    expect(tsconfig.extends).toBe("./temp/tsconfig.cocos.json");
    expect(tsconfig.compilerOptions.strict).toBe(false);

    const projectSettings = readJson<{
      general?: { designResolution?: { width: number; height: number } };
    }>("settings/v2/packages/project.json");
    expect(projectSettings.general?.designResolution).toEqual({
      width: 390,
      height: 844,
    });
  });

  test("contains Cocos entry scripts and scene placeholder docs", () => {
    const scriptFiles = [
      "assets/scripts/GameSceneController.ts",
      "assets/scripts/BoardLayerBinder.ts",
      "assets/scripts/SlotLayerBinder.ts",
      "assets/scripts/ComboBarBinder.ts",
      "assets/scripts/HudBinder.ts",
      "assets/scripts/bootstrap/HulebuSampleSceneModel.ts",
      "assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts",
      "assets/scripts/config/HulebuLevelConfig.ts",
      "assets/scripts/runtime/HulebuRuntimeState.ts",
      "assets/scripts/contracts/HulebuSceneModel.ts",
    ];

    for (const file of scriptFiles) {
      expect(fs.existsSync(path.join(cocosRoot, file)), file).toBe(true);
    }

    expect(readText("assets/scripts/GameSceneController.ts")).toContain(
      "class GameSceneController extends Component",
    );
    expect(readText("assets/scripts/GameSceneController.ts")).toContain(
      "createHulebuSampleSceneModel",
    );
    expect(readText("assets/scripts/contracts/HulebuSceneModel.ts")).toContain(
      "export interface HulebuCocosSceneModel",
    );
    expect(readText("assets/scenes/README.md")).toContain("HulebuGameScene");
    expect(readText("assets/resources/config/README.md")).toContain("levels.json");
  });

  test("documents how to open the project in Cocos Dashboard", () => {
    const readme = readText("README.md");

    expect(readme).toContain("/Applications/Cocos/Creator/3.8.8/CocosCreator.app");
    expect(readme).toContain("Cocos Dashboard");
    expect(readme).toContain("assets/scripts/GameSceneController.ts");
  });

  test("can bootstrap a visible first screen without hand placing every tile", () => {
    const sampleSceneModel = readText("assets/scripts/bootstrap/HulebuSampleSceneModel.ts");
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");
    const boardLayerBinder = readText("assets/scripts/BoardLayerBinder.ts");
    const slotLayerBinder = readText("assets/scripts/SlotLayerBinder.ts");
    const comboBarBinder = readText("assets/scripts/ComboBarBinder.ts");
    const hudBinder = readText("assets/scripts/HudBinder.ts");

    expect(sampleSceneModel).toContain("export function createHulebuSampleSceneModel");
    expect(sampleSceneModel).toContain("createHulebuSampleSceneModelForLayout");
    expect(sampleSceneModel).toContain("HulebuLayoutSize");
    expect(sampleSceneModel).toContain("SCREEN_WIDTH = 390");
    expect(sampleSceneModel).toContain("SCREEN_HEIGHT = 844");
    expect(sampleSceneModel).toContain("layout.width");
    expect(sampleSceneModel).toContain("layout.height");
    expect(sampleSceneModel).toContain("layout.scale");
    expect(sampleSceneModel).toContain("layout.cssWidth");
    expect(sampleSceneModel).toContain("screenHeight * 0.58");
    expect(sampleSceneModel).toContain("resolveHulebuRuntimeLayout");
    expect(sampleSceneModel).toContain("game.canvas");
    expect(sampleSceneModel).toContain("view.getVisibleSize");
    expect(sampleSceneModel).toContain("boardNodes");
    expect(sampleSceneModel).toContain("Slot_7");
    expect(sampleSceneModel).toContain("Combo_Hu");
    expect(sampleSceneModel).toContain("余牌");

    expect(sampleSceneModel).toContain("export function scaleLayoutValue");
    expect(sampleSceneModel).toContain("export function centerLayoutX");
    expect(sampleSceneModel).toContain("export function centerLayoutY");

    expect(gameSceneController).toContain("resolveHulebuRuntimeLayout");
    expect(gameSceneController).toContain("createHulebuSampleSceneModelForLayout");
    expect(gameSceneController).toContain("createHulebuConfiguredSceneModelForLayout");
    expect(gameSceneController).toContain("loadConfiguredLevelOnStart");
    expect(gameSceneController).toContain("this.runtimeState");
    expect(gameSceneController).toContain("moveTileToSlot");
    expect(gameSceneController).toContain("executeComboByKey");
    expect(gameSceneController).toContain("uiTransform.setContentSize(width, height)");
    expect(gameSceneController).toContain("ensureRuntimeCamera");
    expect(gameSceneController).toContain("canvas.cameraComponent");
    expect(gameSceneController).toContain("RuntimeCamera");
    expect(gameSceneController).toContain("Camera.ProjectionType.ORTHO");
    expect(gameSceneController).toContain("Camera.ClearFlag.SOLID_COLOR");
    expect(gameSceneController).toContain("private readonly selectedSlots");
    expect(gameSceneController).toContain("handleTileClick");
    expect(gameSceneController).toContain("handleComboClick");
    expect(gameSceneController).toContain("findComboCandidate");
    expect(gameSceneController).toContain("removeSelectedSlots");
    expect(gameSceneController).toContain("refreshBoardInteractivity");
    expect(gameSceneController).toContain("isTileBlockedByRemainingTile");
    expect(gameSceneController).toContain("HULEBU_UNLOCK_OVERLAP_THRESHOLD = 0.05");
    expect(gameSceneController).toContain("centerLayoutX");
    expect(gameSceneController).toContain("centerLayoutY");

    expect(boardLayerBinder).toContain("createTileNode");
    expect(boardLayerBinder).toContain("setTileClickHandler");
    expect(boardLayerBinder).toContain("node.on(Node.EventType.TOUCH_END");
    expect(boardLayerBinder).toContain("node.on(Button.EventType.CLICK");
    expect(boardLayerBinder).toContain("this.tileClickHandler?.(model.tileId)");
    expect(boardLayerBinder).toContain("centerLayoutX");
    expect(boardLayerBinder).toContain("centerLayoutY");
    expect(boardLayerBinder).toContain("TILE_WIDTH = 52");
    expect(boardLayerBinder).toContain("UITransform");
    expect(boardLayerBinder).toContain("Button");
    expect(boardLayerBinder).toContain("Graphics");

    expect(slotLayerBinder).toContain("ensureCellNode");
    expect(slotLayerBinder).toContain("ensureCellLabel");
    expect(slotLayerBinder).toContain("label.string = model.label ?? \"\"");
    expect(slotLayerBinder).toContain("resolveHulebuRuntimeLayout");
    expect(slotLayerBinder).toContain("visibleSize.cssHeight * 0.15");
    expect(slotLayerBinder).toContain("scaleLayoutValue");
    expect(slotLayerBinder).toContain("centerLayoutX");
    expect(slotLayerBinder).toContain("centerLayoutY");
    expect(slotLayerBinder).toContain("UITransform");
    expect(slotLayerBinder).toContain("Graphics");

    expect(comboBarBinder).toContain("ensureComboButton");
    expect(comboBarBinder).toContain("setComboClickHandler");
    expect(comboBarBinder).toContain("node.on(Node.EventType.TOUCH_END");
    expect(comboBarBinder).toContain("node.on(Button.EventType.CLICK");
    expect(comboBarBinder).toContain("this.comboClickHandler?.(control.combo)");
    expect(comboBarBinder).toContain("resolveHulebuRuntimeLayout");
    expect(comboBarBinder).toContain("visibleSize.cssHeight * 0.28");
    expect(comboBarBinder).toContain("scaleLayoutValue");
    expect(comboBarBinder).toContain("Button");
    expect(comboBarBinder).toContain("Label");

    expect(hudBinder).toContain("findLabel");
    expect(hudBinder).toContain("ensureLabel");
    expect(hudBinder).toContain("resolveHulebuRuntimeLayout");
    expect(hudBinder).toContain("visibleSize.height - scaleLayoutValue(40");
    expect(hudBinder).toContain("HUD_LABEL_WIDTHS");
  });

  test("contains a target-concept visual shell for the Cocos first screen", () => {
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");
    const boardLayerBinder = readText("assets/scripts/BoardLayerBinder.ts");
    const slotLayerBinder = readText("assets/scripts/SlotLayerBinder.ts");

    expect(gameSceneController).toContain("VisualShellRoot");
    expect(gameSceneController).toContain("GreenTableFelt");
    expect(gameSceneController).toContain("LevelPlaque");
    expect(gameSceneController).toContain("ScorePlaque");
    expect(gameSceneController).toContain("ProgressPlaque");
    expect(gameSceneController).toContain("ToolButton_Wash");
    expect(gameSceneController).toContain("ToolButton_Undo");
    expect(gameSceneController).toContain("ToolButton_Hint");
    expect(gameSceneController).toContain("SlotTray");
    expect(gameSceneController).toContain("drawTopPlaque");
    expect(gameSceneController).toContain("formatLevelLabel");
    expect(gameSceneController).toContain("drawToolButton");

    expect(boardLayerBinder).toContain("TILE_SIDE_COLOR");
    expect(boardLayerBinder).toContain("drawTileFace");
    expect(slotLayerBinder).toContain("WOOD_SLOT_FILL");
  });

  test("keeps the real first level metadata for Cocos preview bootstrap", () => {
    const levelsConfig = readWorkspaceJson<{
      defaults: { slotLimit: number; reserveLimit: number };
      levels: Array<{
        id: string;
        order: number;
        name: string;
        subtitle: string;
        tiles: Array<{
          id: string;
          suit: string;
          rank: number;
          x: number;
          y: number;
          layer: number;
          blockedBy: string[];
        }>;
      }>;
    }>("apps/game/mahjong-roguelike/config/levels.json");
    const firstLevel = levelsConfig.levels[0];
    const levelConfig = readText("assets/scripts/config/HulebuLevelConfig.ts");
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");

    expect(levelConfig).toContain(`id: "${firstLevel.id}"`);
    expect(levelConfig).toContain(`order: ${firstLevel.order}`);
    expect(levelConfig).toContain(`name: "${firstLevel.name}"`);
    expect(levelConfig).toContain(`subtitle: "${firstLevel.subtitle}"`);
    expect(levelConfig).toContain(`slotLimit: ${levelsConfig.defaults.slotLimit}`);
    expect(levelConfig).toContain(`reserveLimit: ${levelsConfig.defaults.reserveLimit}`);

    expect(gameSceneController).toContain("loadConfiguredLevelOnStart = true");
  });

  test("supports a minimum Cocos level-clear and reward flow", () => {
    const levelsConfig = readWorkspaceJson<{
      levels: Array<{
        order: number;
        id: string;
        rewardPool?: string[];
      }>;
    }>("apps/game/mahjong-roguelike/config/levels.json");
    const firstThree = levelsConfig.levels.slice(0, 3);
    const levelConfig = readText("assets/scripts/config/HulebuLevelConfig.ts");
    const runtimeState = readText("assets/scripts/runtime/HulebuRuntimeState.ts");
    const configuredBootstrap = readText("assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts");
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");

    expect(levelConfig).toContain("export const HULEBU_LEVEL_CONFIGS");
    expect(levelConfig).toContain("export const HULEBU_REWARD_LEVEL_ORDERS");
    expect(levelConfig).toContain("new Set([3, 6, 9, 13, 16, 19])");
    expect(levelConfig).toContain("export function getHulebuLevelConfigByIndex");
    expect(levelConfig).toContain("export function getHulebuLevelIndexByOrder");

    for (const level of firstThree) {
      expect(levelConfig).toContain(`id: "${level.id}"`);
      expect(levelConfig).toContain(`order: ${level.order}`);
      for (const rewardId of level.rewardPool ?? []) {
        expect(levelConfig).toContain(`"${rewardId}"`);
      }
    }

    expect(runtimeState).toContain("isBoardCleared()");
    expect(runtimeState).toContain("getLevelConfig()");
    expect(runtimeState).toContain("getRewardChoices()");
    expect(runtimeState).toContain("getLevelOrder()");

    expect(configuredBootstrap).toContain("createHulebuConfiguredSceneModelForLayout");
    expect(configuredBootstrap).toContain("levelIndex = 0");
    expect(configuredBootstrap).toContain("getHulebuLevelConfigByIndex(levelIndex)");

    expect(gameSceneController).toContain("type HulebuGamePhase");
    expect(gameSceneController).toContain("\"playing\" | \"cleared\" | \"reward\"");
    expect(gameSceneController).toContain("private currentLevelIndex = 0");
    expect(gameSceneController).toContain("private gamePhase: HulebuGamePhase = \"playing\"");
    expect(gameSceneController).toContain("private pendingRewardLevelIndex");
    expect(gameSceneController).toContain("private refreshRuntimeScene");
    expect(gameSceneController).toContain("this.runtimeState.isBoardCleared()");
    expect(gameSceneController).toContain("this.showClearOverlay()");
    expect(gameSceneController).toContain("continueAfterClear");
    expect(gameSceneController).toContain("startNextLevel");
    expect(gameSceneController).toContain("this.ensureVisualShell(layout, this.runtimeState.getLevelOrder())");
    expect(gameSceneController).toContain("showRewardOverlay");
    expect(gameSceneController).toContain("drawRewardChoices");
    expect(gameSceneController).toContain("RewardChoice_");
    expect(gameSceneController).toContain("pickReward(rewardId: string)");
    expect(gameSceneController).toContain("node.on(Button.EventType.CLICK, handler, this)");
    expect(gameSceneController).toContain("HULEBU_REWARD_LEVEL_ORDERS.has");
  });

  test("uses generated stacked Cocos mountains instead of six-card flow levels", async () => {
    const levelConfigPath = "assets/scripts/config/HulebuLevelConfig.ts";
    const levelConfig = readText(levelConfigPath);
    const boardLayerBinder = readText("assets/scripts/BoardLayerBinder.ts");
    const moduleUrl = pathToFileURL(path.join(cocosRoot, levelConfigPath)).href;
    const levelModule = await import(moduleUrl) as {
      HULEBU_LEVEL_CONFIGS: Array<{
        id: string;
        tiles: Array<{
          id: string;
          suit: string;
          rank: number;
          x: number;
          y: number;
          layer: number;
          blockedBy: string[];
        }>;
      }>;
    };

    expect(levelConfig).toContain("createHulebuGraphMountainLevelConfig");
    expect(levelConfig).toContain("generateHulebuMountain");
    expect(levelConfig).toContain("targetTileCount");
    expect(levelConfig).toContain("maxStackDepth");
    expect(levelConfig).toContain("honorWeight");
    expect(levelConfig).toContain("HULEBU_COCOS_STACK_OVERLAP_THRESHOLD = 0.05");
    expect(levelConfig).toContain("export const HULEBU_LEVEL_ONE_CONFIG");
    expect(levelConfig).not.toContain("createSixTilePengMountain");
    expect(levelConfig).not.toContain("p1a");

    const levels = levelModule.HULEBU_LEVEL_CONFIGS;
    expect(levels).toHaveLength(20);
    expect(levels[0]?.tiles.length).toBeGreaterThanOrEqual(36);
    expect(Math.min(...levels.map((level) => level.tiles.length))).toBeGreaterThanOrEqual(30);

    const firstLevel = levels[0];
    const xValues = firstLevel.tiles.map((tile) => tile.x);
    const yValues = firstLevel.tiles.map((tile) => tile.y);
    const xSpan = Math.max(...xValues) - Math.min(...xValues);
    const ySpan = Math.max(...yValues) - Math.min(...yValues);
    const initiallyFreeTiles = firstLevel.tiles.filter((tile) => tile.blockedBy.length === 0);
    const crossColumnBlockers = firstLevel.tiles.flatMap((tile) => (
      tile.blockedBy.filter((blockerId) => {
        const blocker = firstLevel.tiles.find((candidate) => candidate.id === blockerId);
        return Boolean(blocker && (blocker.x !== tile.x || blocker.y !== tile.y));
      })
    ));
    const crossColumnLockedTiles = firstLevel.tiles.filter((tile) => (
      tile.blockedBy.some((blockerId) => {
        const blocker = firstLevel.tiles.find((candidate) => candidate.id === blockerId);
        return Boolean(blocker && (blocker.x !== tile.x || blocker.y !== tile.y));
      })
    ));
    const maxLayer = Math.max(...firstLevel.tiles.map((tile) => tile.layer));
    const blockedTiles = firstLevel.tiles.filter((tile) => tile.blockedBy.length > 0);
    const missingHigherLayerBlockers = levels.flatMap((level) => (
      level.tiles.flatMap((tile) => (
        level.tiles
          .filter((candidate) => (
            candidate.id !== tile.id
            && candidate.layer > tile.layer
            && getTileOverlapRatio(tile, candidate) > 0.05
            && !tile.blockedBy.includes(candidate.id)
          ))
          .map((candidate) => `${level.id}:${tile.id}->${candidate.id}`)
      ))
    ));
    expect(xSpan).toBeGreaterThanOrEqual(270);
    expect(ySpan).toBeGreaterThanOrEqual(170);
    expect(maxLayer).toBeGreaterThanOrEqual(3);
    expect(blockedTiles.length).toBeGreaterThanOrEqual(20);
    expect(initiallyFreeTiles.length).toBeGreaterThan(6);
    expect(initiallyFreeTiles.length).toBeLessThanOrEqual(16);
    expect(crossColumnBlockers.length).toBeGreaterThanOrEqual(12);
    expect(crossColumnLockedTiles.length).toBeGreaterThanOrEqual(6);
    expect(missingHigherLayerBlockers).toHaveLength(0);
    expect(firstLevel.tiles.some((tile) => tile.suit === "honor")).toBe(true);
    expect(firstLevel.tiles.some((tile) => tile.blockedBy.length > 0)).toBe(true);

    expect(boardLayerBinder).toContain("drawStackDepthHint");
    expect(boardLayerBinder).toContain("StackDepthHint");
  });

  test("feeds Cocos levels from the shared Graph-based mountain generator", async () => {
    const levelConfigPath = "assets/scripts/config/HulebuLevelConfig.ts";
    const levelConfig = readText(levelConfigPath);
    const moduleUrl = pathToFileURL(path.join(cocosRoot, levelConfigPath)).href;
    const levelModule = await import(moduleUrl) as {
      HULEBU_LEVEL_CONFIGS: Array<{
        id: string;
        tiles: Array<{
          id: string;
          suit: string;
          rank: number;
          x: number;
          y: number;
          layer: number;
          blockedBy: string[];
        }>;
      }>;
    };

    expect(levelConfig).toContain("generateHulebuMountain");
    expect(levelConfig).toContain("HULEBU_GRAPH_TEMPLATE_ROTATION");
    expect(levelConfig).toContain("createHulebuGraphMountainLevelConfig");
    expect(levelConfig).toContain("mapGraphTileToCocosTile");
    expect(levelConfig).not.toContain("createStackColumns(");
    expect(levelConfig).not.toContain("createTopFirstPlacements");

    const levels = levelModule.HULEBU_LEVEL_CONFIGS;
    expect(levels).toHaveLength(20);
    expect(levels[0]?.tiles[0]?.id).toContain("center-tower");
    expect(levels[1]?.tiles[0]?.id).toContain("two-wings");
    expect(levels[2]?.tiles[0]?.id).toContain("cross");
    expect(levels[3]?.tiles[0]?.id).toContain("ring");

    const allLevelIds = levels.flatMap((level) => level.tiles.map((tile) => tile.id));
    expect(allLevelIds.some((id) => id.includes("long-wall"))).toBe(true);
    expect(allLevelIds.some((id) => id.includes("islands"))).toBe(true);
    expect(allLevelIds.some((id) => id.includes("canyon"))).toBe(true);
    expect(allLevelIds.some((id) => id.includes("staircase"))).toBe(true);
    expect(Math.min(...levels.map((level) => level.tiles.length))).toBeGreaterThanOrEqual(42);
    expect(Math.max(...levels.map((level) => Math.max(...level.tiles.map((tile) => tile.layer))))).toBeGreaterThanOrEqual(4);
  });

  test("keeps covered Cocos mountain tiles locked until their blockers leave the board", async () => {
    const levelConfigPath = "assets/scripts/config/HulebuLevelConfig.ts";
    const runtimeStatePath = "assets/scripts/runtime/HulebuRuntimeState.ts";
    const levelModule = await import(pathToFileURL(path.join(cocosRoot, levelConfigPath)).href) as {
      HULEBU_LEVEL_CONFIGS: Array<{
        tiles: Array<{
          id: string;
          x: number;
          y: number;
          layer: number;
          blockedBy: string[];
        }>;
      }>;
    };
    const runtimeModule = await import(pathToFileURL(path.join(cocosRoot, runtimeStatePath)).href) as {
      HulebuRuntimeState: new (level: unknown) => {
        moveTileToSlot: (tileId: string) => boolean;
        toSceneModel: (layout: { width: number; height: number; cssWidth: number; cssHeight: number; scale: number }) => {
          boardNodes: Array<{ tileId: string; interactable: boolean; position: { x: number; y: number } }>;
          slotNodes: Array<{ tileId: string | null }>;
        };
      };
    };

    const testPair = levelModule.HULEBU_LEVEL_CONFIGS
      .flatMap((level) => level.tiles.map((tile) => ({ level, tile })))
      .find(({ level, tile }) => {
        if (tile.blockedBy.length !== 1) {
          return false;
        }

        const blocker = level.tiles.find((candidate) => candidate.id === tile.blockedBy[0]);
        return Boolean(
          blocker
          && blocker.blockedBy.length === 0
          && blocker.layer > tile.layer
          && getTileOverlapRatio(tile, blocker) > 0.05,
        );
      });

    expect(testPair).toBeTruthy();
    const runtimeState = new runtimeModule.HulebuRuntimeState(testPair!.level);
    const layout = { width: 390, height: 844, cssWidth: 390, cssHeight: 844, scale: 1 };
    const blockedTileId = testPair!.tile.id;
    const blockerTileId = testPair!.tile.blockedBy[0];

    const beforeClick = runtimeState.toSceneModel(layout);
    expect(beforeClick.boardNodes.find((node) => node.tileId === blockedTileId)?.interactable).toBe(false);
    expect(beforeClick.boardNodes.find((node) => node.tileId === blockerTileId)?.interactable).toBe(true);
    expect(runtimeState.moveTileToSlot(blockedTileId)).toBe(false);
    expect(runtimeState.toSceneModel(layout).slotNodes.filter((slot) => slot.tileId).length).toBe(0);

    expect(runtimeState.moveTileToSlot(blockerTileId)).toBe(true);
    expect(runtimeState.toSceneModel(layout).boardNodes.find((node) => node.tileId === blockedTileId)?.interactable).toBe(true);
    expect(runtimeState.moveTileToSlot(blockedTileId)).toBe(true);
  });

  test("renders stacked Cocos mountain layers with visible per-layer offsets", async () => {
    const levelConfigPath = "assets/scripts/config/HulebuLevelConfig.ts";
    const runtimeStatePath = "assets/scripts/runtime/HulebuRuntimeState.ts";
    const levelModule = await import(pathToFileURL(path.join(cocosRoot, levelConfigPath)).href) as {
      HULEBU_LEVEL_CONFIGS: Array<{
        tiles: Array<{
          id: string;
          x: number;
          y: number;
          layer: number;
          blockedBy: string[];
        }>;
      }>;
    };
    const runtimeModule = await import(pathToFileURL(path.join(cocosRoot, runtimeStatePath)).href) as {
      HulebuRuntimeState: new (level: unknown) => {
        toSceneModel: (layout: { width: number; height: number; cssWidth: number; cssHeight: number; scale: number }) => {
          boardNodes: Array<{ tileId: string; position: { x: number; y: number } }>;
        };
      };
    };

    const stackedPair = levelModule.HULEBU_LEVEL_CONFIGS
      .flatMap((level) => level.tiles.map((tile) => ({ level, tile })))
      .find(({ level, tile }) => {
        if (tile.blockedBy.length < 1) {
          return false;
        }

        const blocker = level.tiles.find((candidate) => candidate.id === tile.blockedBy[0]);
        return Boolean(
          blocker
          && blocker.layer > tile.layer,
        );
      });

    expect(stackedPair).toBeTruthy();
    const runtimeState = new runtimeModule.HulebuRuntimeState(stackedPair!.level);
    const layout = { width: 390, height: 844, cssWidth: 390, cssHeight: 844, scale: 1 };
    const sceneModel = runtimeState.toSceneModel(layout);
    const blockedNode = sceneModel.boardNodes.find((node) => node.tileId === stackedPair!.tile.id);
    const blockerNode = sceneModel.boardNodes.find((node) => node.tileId === stackedPair!.tile.blockedBy[0]);

    expect(blockedNode).toBeTruthy();
    expect(blockerNode).toBeTruthy();
    expect(blockerNode!.position.x).not.toBe(blockedNode!.position.x);
    expect(blockerNode!.position.y).not.toBe(blockedNode!.position.y);
  });

  test("binds board tiles to archived Mahjong SpriteFrame resources with fallback", () => {
    const catalogPath = "assets/scripts/assets/HulebuTileSpriteCatalog.ts";
    expect(fs.existsSync(path.join(cocosRoot, catalogPath)), catalogPath).toBe(true);

    const catalog = readText(catalogPath);
    const boardLayerBinder = readText("assets/scripts/BoardLayerBinder.ts");

    expect(catalog).toContain("HULEBU_TILE_SPRITE_FRAME_PATHS");
    expect(catalog).toContain("loadTileSpriteFrame");
    expect(catalog).toContain("resources.load");
    expect(catalog).toContain("SpriteFrame");
    expect(catalog).toContain("pendingCallbacks");
    expect(catalog).toContain("\"tile.tong.9\"");
    expect(catalog).toContain("\"ui/mahjong-tiles/tiles/refreshed/numbered/tong/tong-09/spriteFrame\"");
    expect(catalog).toContain("\"tile.wan.2\"");
    expect(catalog).toContain("\"ui/mahjong-tiles/tiles/refreshed/numbered/wan/wan-02/spriteFrame\"");
    expect(catalog).toContain("\"tile.tiao.8\"");
    expect(catalog).toContain("\"ui/mahjong-tiles/tiles/refreshed/numbered/tiao/tiao-08/spriteFrame\"");
    expect(catalog).toContain("\"tile.honor.1\"");
    expect(catalog).toContain("\"ui/mahjong-tiles/tiles/refreshed/honors/honor-east/spriteFrame\"");
    expect(catalog).toContain("\"tile.honor.7\"");
    expect(catalog).toContain("\"ui/mahjong-tiles/tiles/refreshed/honors/honor-white/spriteFrame\"");

    expect(boardLayerBinder).toContain("HulebuTileSpriteCatalog");
    expect(boardLayerBinder).toContain("TileArt");
    expect(boardLayerBinder).toContain("Sprite");
    expect(boardLayerBinder).toContain("SpriteFrame");
    expect(boardLayerBinder).toContain("applyTileSprite");
    expect(boardLayerBinder).toContain("this.pendingSpriteKeys");
    expect(boardLayerBinder).toContain("model.prefabKey");
    expect(boardLayerBinder).toContain("label.node.active = true");
    expect(boardLayerBinder).toContain("label.node.active = false");
    expect(boardLayerBinder).toContain("sprite.spriteFrame = null");
    expect(boardLayerBinder).toContain("sprite.spriteFrame = spriteFrame");
  });

  test("uses refreshed runtime tile UI assets for every Mahjong tile key", () => {
    const manifest = readJson<{
      assetSetVersion?: string;
      runtimeTileSet?: string;
      refreshedNumberedTiles?: Array<{
        tileKey: string;
        target: string;
        status: string;
        contentBounds: { widthRatio: number; heightRatio: number; alphaCoverage: number };
      }>;
      refreshedHonorTiles?: Array<{
        tileKey: string;
        target: string;
        status: string;
        contentBounds: { widthRatio: number; heightRatio: number; alphaCoverage: number };
      }>;
    }>("assets/resources/ui/mahjong-tiles/manifest.json");
    const catalog = readText("assets/scripts/assets/HulebuTileSpriteCatalog.ts");
    const refreshedNumberedTiles = manifest.refreshedNumberedTiles ?? [];
    const refreshedHonorTiles = manifest.refreshedHonorTiles ?? [];
    const refreshedTiles = [...refreshedNumberedTiles, ...refreshedHonorTiles];

    expect(manifest.assetSetVersion).toBe("cocos-refreshed-ui-v2-whitespace-2026-05-27");
    expect(manifest.runtimeTileSet).toBe("refreshed");
    expect(refreshedNumberedTiles).toHaveLength(27);
    expect(refreshedHonorTiles).toHaveLength(7);
    expect(new Set(refreshedTiles.map((tile) => tile.tileKey)).size).toBe(34);

    for (const tile of refreshedTiles) {
      const assetPath = path.join(cocosRoot, "assets/resources/ui/mahjong-tiles", tile.target);
      const spriteFramePath = `ui/mahjong-tiles/${tile.target.replace(/\.png$/, "/spriteFrame")}`;

      expect(fs.existsSync(assetPath), tile.target).toBe(true);
      expect(fs.existsSync(`${assetPath}.meta`), `${tile.target}.meta`).toBe(true);
      expect(readPngInfo(assetPath), tile.target).toMatchObject({
        width: 1024,
        height: 1024,
        colorType: 6,
      });
      expect(tile.status).toBe("runtime");
      expect(tile.contentBounds.heightRatio).toBeGreaterThan(0.56);
      expect(tile.contentBounds.heightRatio).toBeLessThan(0.66);
      expect(tile.contentBounds.alphaCoverage).toBeGreaterThan(0.01);
      expect(catalog).toContain(`"${tile.tileKey}"`);
      expect(catalog).toContain(`"${spriteFramePath}"`);
    }

    expect(catalog).toContain("\"tile.tong.9\"");
    expect(catalog).toContain("\"ui/mahjong-tiles/tiles/refreshed/numbered/tong/tong-09/spriteFrame\"");
    expect(catalog).toContain("\"tile.wan.2\"");
    expect(catalog).toContain("\"ui/mahjong-tiles/tiles/refreshed/numbered/wan/wan-02/spriteFrame\"");
    expect(catalog).toContain("\"tile.honor.1\"");
    expect(catalog).toContain("\"ui/mahjong-tiles/tiles/refreshed/honors/honor-east/spriteFrame\"");
  });
});
