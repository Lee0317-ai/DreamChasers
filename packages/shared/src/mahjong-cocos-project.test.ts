import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const workspaceRoot = path.resolve(__dirname, "../../..");
const cocosRoot = path.join(
  workspaceRoot,
  "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8",
);

function readJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(cocosRoot, relativePath), "utf8")) as T;
}

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(cocosRoot, relativePath), "utf8");
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
    expect(gameSceneController).toContain("drawToolButton");

    expect(boardLayerBinder).toContain("TILE_SIDE_COLOR");
    expect(boardLayerBinder).toContain("drawTileFace");
    expect(slotLayerBinder).toContain("WOOD_SLOT_FILL");
  });
});
