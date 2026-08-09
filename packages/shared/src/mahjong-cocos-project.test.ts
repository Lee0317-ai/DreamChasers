import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

const workspaceRoot = path.resolve(__dirname, "../../..");
const cocosRoot = path.join(
  workspaceRoot,
  "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8",
);
const generatedCocosTsconfigPath = path.join(
  cocosRoot,
  "temp/tsconfig.cocos.json",
);
let createdFallbackCocosTsconfig = false;

beforeAll(() => {
  if (fs.existsSync(generatedCocosTsconfigPath)) return;
  fs.mkdirSync(path.dirname(generatedCocosTsconfigPath), { recursive: true });
  fs.writeFileSync(
    generatedCocosTsconfigPath,
    `${JSON.stringify({
      compilerOptions: {
        experimentalDecorators: true,
        module: "ESNext",
        moduleResolution: "Bundler",
        target: "ES2022",
      },
    })}\n`,
    "utf8",
  );
  createdFallbackCocosTsconfig = true;
});

afterAll(() => {
  if (!createdFallbackCocosTsconfig) return;
  fs.rmSync(generatedCocosTsconfigPath, { force: true });
});

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
  const tileWidth = 32;
  const tileHeight = 43;
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
    expect(readText(".gitignore").split(/\r?\n/)).toContain("/profiles/");
    expect(readText("README.md")).toContain(
      "`profiles/` 包含本地项目可用性所需的编辑器状态",
    );

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
      "assets/scripts/MeldRiverLayerBinder.ts",
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

  test("does not expose the mutable browser debug API in production builds", () => {
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");

    expect(gameSceneController).toContain('import { DEBUG } from "cc/env";');
    expect(gameSceneController).toContain(
      'if (!DEBUG || typeof window === "undefined")',
    );
  });

  test("routes migrated gameplay and active-run persistence through the M1 boundaries", () => {
    const controllerText = readText("assets/scripts/GameSceneController.ts");

    expect(controllerText).toContain("new GameCoordinator(");
    expect(controllerText).toContain("new ContentRepository(");
    expect(controllerText).toContain("new SaveService(");
    expect(controllerText).toContain('dispatch({ type: "tile.select"');
    expect(controllerText).toContain('dispatch({ type: "combo.execute"');
    expect(controllerText).toContain('dispatch({ type: "combo.choose"');
    expect(controllerText).toContain('dispatch({ type: "tool.use", tool: "discard" })');
    expect(controllerText).toContain('dispatch({ type: "tool.use", tool: "shuffle" })');
    expect(controllerText).toContain('dispatch({ type: "tool.use", tool: "undo" })');
    expect(controllerText).toContain('dispatch({ type: "slot.discard"');
    expect(controllerText).toContain("private applyCoordinatorResult(");
    expect(controllerText).toContain("private attachRuntimeState(");
    expect(controllerText).toContain("private detachRuntimeState(");
    expect(controllerText).toContain('event.type === "combo.choice.required"');
    expect(controllerText).toContain('event.type === "level.cleared"');
    expect(controllerText).toContain("result.changed && result.persistable");
    expect(controllerText).toContain('saveResult.status !== "committed"');
    expect(controllerText).toContain("this.activeRunSnapshot = snapshot");
    expect(controllerText).toContain("this.queueAccountProgressPush()");
    expect(controllerText).toContain(
      "eventSeenLevelOrders: Array.from(this.eventSeenLevelOrders)",
    );

    expect(controllerText).not.toContain("this.runtimeState.moveTileToSlot(");
    expect(controllerText).not.toContain("this.runtimeState.executeComboByKey(");
    expect(controllerText).not.toContain("this.runtimeState.discardSlotTile(");
    expect(controllerText).not.toContain("this.runtimeState.useShuffleTool(");
    expect(controllerText).not.toContain("this.runtimeState.useUndoTool(");
    expect(controllerText).not.toContain("private refreshPlayableScene(");
    expect(controllerText).not.toContain("private createSlotModels(");
    expect(controllerText).not.toContain("private createComboControls(");
    expect(controllerText).not.toContain("private findComboCandidate(");
    expect(controllerText).not.toContain("private findHuCandidate(");
    expect(controllerText).not.toContain("private canHuLabels(");
    expect(controllerText).not.toContain("private canMakeMelds(");
    expect(controllerText).not.toContain("private removeSelectedSlots(");
    expect(controllerText).not.toContain("private getSlotStatusText(");
    expect(controllerText).not.toContain("private getComboScore(");
    expect(controllerText).not.toContain("discardSelecting");
    expect(controllerText).not.toContain(
      "eventSeenLevelOrders: [...this.eventSeenLevelOrders]",
    );
    expect(controllerText).not.toMatch(/sys\.localStorage\.(?:getItem|setItem|removeItem)\(HULEBU_ACTIVE_RUN_STORAGE_KEY/);
  });

  test("detaches the cleared session before reward and event choice transitions", () => {
    const controllerText = readText("assets/scripts/GameSceneController.ts");
    const rewardFlow = controllerText.slice(
      controllerText.indexOf("private showRewardOverlay(): void"),
      controllerText.indexOf("private showEventOverlay(): void"),
    );
    const eventFlow = controllerText.slice(
      controllerText.indexOf("private showEventOverlay(): void"),
      controllerText.indexOf("private showComboChoiceOverlay("),
    );

    expect(rewardFlow.indexOf("this.detachRuntimeState();")).toBeGreaterThanOrEqual(0);
    expect(rewardFlow.indexOf("this.detachRuntimeState();")).toBeLessThan(rewardFlow.indexOf('this.requireRunTransition("rewardChoice")'));
    expect(eventFlow.indexOf("this.detachRuntimeState();")).toBeGreaterThanOrEqual(0);
    expect(eventFlow.indexOf("this.detachRuntimeState();")).toBeLessThan(eventFlow.indexOf('this.requireRunTransition("eventChoice")'));

    const rewardRendering = controllerText.slice(
      controllerText.indexOf("private drawRewardChoices(overlay: Node): void"),
      controllerText.indexOf("private getCurrentRewardChoices(): string[]"),
    );
    expect(rewardRendering).toContain("this.gameCoordinator.snapshot().context.rewardCandidateIds");
    expect(rewardRendering).not.toContain("this.getCurrentRewardChoices()");
  });

  test("blocks fresh-run writes when active-run storage cannot be read", () => {
    const controllerText = readText("assets/scripts/GameSceneController.ts");
    const tutorialFlow = controllerText.slice(
      controllerText.indexOf("private enterDefaultTutorialLevel(): void"),
      controllerText.indexOf("resumeActiveRun(): void"),
    );
    const persistFlow = controllerText.slice(
      controllerText.indexOf("private commitActiveRun(): boolean"),
      controllerText.indexOf("private getResumableRunPhase(): HulebuResumableRunPhase"),
    );

    expect(tutorialFlow).toContain("this.activeRunStorageBlocked");
    expect(tutorialFlow).toContain("this.showLobbyOverlay()");
    expect(persistFlow).toContain("this.activeRunStorageBlocked");
    expect(persistFlow).toContain("return false");
    expect(persistFlow).toContain('coordinatorSnapshot.phase === "bossIntro"');
  });

  test("deep-validates active runs and migrates reward or event context", () => {
    const controllerText = readText("assets/scripts/GameSceneController.ts");

    expect(controllerText).toContain("GameCoordinator.restore(snapshot.coordinatorSnapshot, session)");
    expect(controllerText).toContain("snapshot.eventSeenLevelOrders.some(");
    expect(controllerText).toContain("snapshot.coordinatorSnapshot.sessionSnapshot");
    expect(controllerText).toContain("isResumableCoordinatorPhase(snapshot.resumablePhase, snapshot.coordinatorSnapshot.phase)");
    expect(controllerText).toContain('(snapshot.resumablePhase === "reward" || snapshot.resumablePhase === "event")');
    expect(controllerText).toContain('snapshot.resumablePhase === "cleared"');
    expect(controllerText).toContain("Resumable flow requires a retained runtime snapshot.");
    expect(controllerText).toContain("rewardCandidateIds: rewardChoices");
    expect(controllerText).toContain("eventOptionIds: eventChoices");
    expect(controllerText).toContain("assertValidHulebuRuntimeSnapshot(");
    expect(controllerText).toContain("validateRunRewardState(snapshot.runRewards");
    expect(controllerText).toContain("validateMetaUpgradeState(snapshot.metaUpgrades)");
    expect(controllerText).toContain("validateCoordinatorChoiceContext(\n      snapshot.coordinatorSnapshot,\n      snapshot.runProfile,");
    expect(controllerText).toContain("const expectedTargetLevelOrder = currentDisplayLevelOrder + 1");
    expect(controllerText).toContain("HULEBU_REWARD_LEVEL_ORDERS.has(currentFlowLevelOrder)");
    expect(controllerText).toContain("getHulebuRewardChoicesForRun(profile, levelConfig)");
    expect(controllerText).toContain("HULEBU_EVENT_LEVEL_ORDERS.has(targetFlowLevelOrder)");
    expect(controllerText).toContain("getHulebuSpecialEventChoices(targetFlowLevelOrder, profile, runArchetypeId)");
    expect(controllerText).toContain("snapshot.context.targetLevelOrder !== expectedTargetLevelOrder");
    expect(controllerText).toContain("!stringArraysEqual(snapshot.context.rewardCandidateIds, expectedRewardIds)");
    expect(controllerText).toContain("!stringArraysEqual(snapshot.context.eventOptionIds, expectedEventIds)");
    expect(controllerText).toContain("normalizeHulebuRuntimeSnapshot(");
    expect(controllerText).toContain("runtime: runtimeSnapshot");
    expect(controllerText).toContain("const legacyTargetLevelOrder = currentDisplayLevelOrder + 1");
    expect(controllerText).toContain("getFlowLevelOrderForSnapshot(\n      legacy.runProfile,\n      legacyTargetLevelOrder,");
    expect(controllerText).not.toContain("context.pendingCombo === null || typeof context.pendingCombo === \"object\"");
  });

  test("renders exact saved combo, reward, and event choices without reinitializing context", () => {
    const controllerText = readText("assets/scripts/GameSceneController.ts");
    const runtimeResume = controllerText.slice(
      controllerText.indexOf("private resumeRuntimeSnapshot(snapshot: HulebuActiveRunSnapshot): void"),
      controllerText.indexOf("private resumeClearedPhase("),
    );
    const rewardResume = controllerText.slice(
      controllerText.indexOf("private resumeRewardPhase(snapshot: HulebuActiveRunSnapshot): void"),
      controllerText.indexOf("private resumeEventPhase("),
    );
    const eventResume = controllerText.slice(
      controllerText.indexOf("private resumeEventPhase(snapshot: HulebuActiveRunSnapshot): void"),
      controllerText.indexOf("private resumeAdvancedAbilityPhase("),
    );
    const eventRendering = controllerText.slice(
      controllerText.indexOf("private drawEventChoices(overlay: Node): void"),
      controllerText.indexOf("private formatSpecialEventMeta("),
    );
    const rewardPicking = controllerText.slice(
      controllerText.indexOf("pickReward(rewardId: string): void"),
      controllerText.indexOf("pickSpecialEvent(eventId: string): void"),
    );
    const eventPicking = controllerText.slice(
      controllerText.indexOf("pickSpecialEvent(eventId: string): void"),
      controllerText.indexOf("startMainlineRun(): void"),
    );

    expect(runtimeResume).toContain("restorePendingComboChoiceOverlay(snapshot.coordinatorSnapshot.context.pendingCombo)");
    expect(runtimeResume).not.toContain("this.hideFlowOverlay();");
    expect(rewardResume).toContain("snapshot.coordinatorSnapshot.context.targetLevelOrder");
    expect(rewardResume).toContain("this.renderRewardOverlay()");
    expect(rewardResume).not.toContain("this.showRewardOverlay()");
    expect(eventResume).toContain("snapshot.coordinatorSnapshot.context.targetLevelOrder");
    expect(eventResume).toContain("this.renderEventOverlay()");
    expect(eventResume).not.toContain("this.showEventOverlay()");
    expect(eventRendering).toContain("this.gameCoordinator.snapshot().context.eventOptionIds");
    expect(eventRendering).not.toContain("getHulebuSpecialEventChoices(");
    expect(rewardPicking).toContain("context.rewardCandidateIds.includes(rewardId)");
    expect(eventPicking).toContain("context.eventOptionIds.includes(eventId)");
  });

  test("returns a canceled combo choice to idle before hiding it", () => {
    const controllerText = readText("assets/scripts/GameSceneController.ts");
    const cancelFlow = controllerText.slice(
      controllerText.indexOf("private closeComboChoiceOverlay(): void"),
      controllerText.indexOf("private getComboDisplayName("),
    );

    expect(cancelFlow).toContain('this.requireRunTransition("playing.idle")');
    expect(cancelFlow).toContain("pendingCombo: null");
    expect(cancelFlow).toContain("this.persistActiveRun()");
  });

  test("records settlement before side effects and resumes it without awarding twice", () => {
    const controllerText = readText("assets/scripts/GameSceneController.ts");
    const settlementFlow = controllerText.slice(
      controllerText.indexOf("private showRunCompleteOverlay(): void"),
      controllerText.indexOf("private restartRun(): void"),
    );

    expect(controllerText).toContain('type HulebuResumableRunPhase = "playing" | "cleared" | "reward" | "event" | "advancedAbility" | "archetype" | "settlement"');
    expect(controllerText).toContain("private resumeSettlementPhase(snapshot: HulebuActiveRunSnapshot): void");
    expect(settlementFlow).toContain('this.requireRunTransition("settlement")');
    expect(settlementFlow).toContain("if (!this.commitActiveRun())");
    expect(settlementFlow).toContain("this.awardMetaCoinsForRun()");
    expect(settlementFlow.indexOf("if (!this.commitActiveRun())")).toBeLessThan(settlementFlow.indexOf("this.awardMetaCoinsForRun()"));
    expect(settlementFlow).toContain("if (!isNewSettlement)");
    expect(controllerText).toContain("this.createOverlayButton(overlay, \"ContinueButton\", \"回到局外\", 0, -54, () => this.returnToLobby())");
  });

  test("keeps Cocos runtime imports inside the Creator project", () => {
    const scriptsRoot = path.join(cocosRoot, "assets/scripts");
    const tsFiles: string[] = [];
    const collect = (directory: string): void => {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          collect(fullPath);
          continue;
        }
        if (entry.isFile() && entry.name.endsWith(".ts")) {
          tsFiles.push(fullPath);
        }
      }
    };

    collect(scriptsRoot);
    const offenders = tsFiles.flatMap((filePath) => {
      const text = fs.readFileSync(filePath, "utf8");
      return text.includes("packages/shared/src/")
        ? [path.relative(cocosRoot, filePath)]
        : [];
    });

    expect(offenders).toEqual([]);
    expect(readText("assets/scripts/config/HulebuLevelConfig.ts")).toContain("./HulebuMountainGenerator");
    expect(fs.existsSync(path.join(cocosRoot, "assets/scripts/config/HulebuMountainGenerator.ts"))).toBe(true);
    expect(readText("assets/scripts/config/HulebuMountainGenerator.ts")).toContain("| \"center-tower\"");
    expect(readText("assets/scripts/config/HulebuMountainGenerator.ts")).not.toContain("| \"pyramid\"");
    expect(readText("assets/scripts/config/HulebuMountainGenerator.ts")).toContain("createSolutionTrace");
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
    const formalUiCatalog = readText("assets/scripts/assets/HulebuFormalUiCatalog.ts");
    const meldRiverLayerBinder = readText("assets/scripts/MeldRiverLayerBinder.ts");

    expect(sampleSceneModel).toContain("export function createHulebuSampleSceneModel");
    expect(sampleSceneModel).toContain("createHulebuSampleSceneModelForLayout");
    expect(sampleSceneModel).toContain("HulebuLayoutSize");
    expect(sampleSceneModel).toContain("SCREEN_WIDTH = 390");
    expect(sampleSceneModel).toContain("SCREEN_HEIGHT = 844");
    expect(sampleSceneModel).toContain("layout.width");
    expect(sampleSceneModel).toContain("layout.height");
    expect(sampleSceneModel).toContain("layout.scale");
    expect(sampleSceneModel).toContain("cssWidth: Math.round(cssWidth)");
    expect(sampleSceneModel).toContain("width = Math.max(320, Math.round(visibleSize.width))");
    expect(sampleSceneModel).toContain("height = Math.max(568, Math.round(visibleSize.height))");
    expect(sampleSceneModel).toContain("layout.width / layoutScale");
    expect(sampleSceneModel).toContain("screenHeight * 0.58");
    expect(sampleSceneModel).toContain("resolveHulebuRuntimeLayout");
    expect(sampleSceneModel).toContain("Math.min(1, width / 390, height / 844)");
    expect(sampleSceneModel).toContain("frameSize.width / screen.devicePixelRatio");
    expect(sampleSceneModel).not.toContain("layout.cssWidth ?? layout.width / layoutScale");
    expect(sampleSceneModel).not.toContain("Math.max(1, screen.devicePixelRatio");
    expect(sampleSceneModel).not.toContain("Math.max(1, layout.scale ?? 1)");
    expect(sampleSceneModel).toContain("game.canvas");
    expect(sampleSceneModel).toContain("view.getVisibleSize");
    expect(sampleSceneModel).toContain("boardNodes");
    expect(sampleSceneModel).toContain("Slot_7");
    expect(sampleSceneModel).toContain("Combo_Hu");
    expect(sampleSceneModel).toContain("Combo_Bugang");
    expect(sampleSceneModel).toContain("openMeldNodes");
    expect(sampleSceneModel).toContain("riverNodes");
    expect(sampleSceneModel).toContain("余牌");

    expect(sampleSceneModel).toContain("export function scaleLayoutValue");
    expect(sampleSceneModel).toContain("export function centerLayoutX");
    expect(sampleSceneModel).toContain("export function centerLayoutY");

    expect(gameSceneController).toContain("resolveHulebuRuntimeLayout");
    expect(gameSceneController).toContain("createHulebuSampleSceneModelForLayout");
    expect(gameSceneController).toContain("new ContentRepository(");
    expect(gameSceneController).toContain("new GameCoordinator(");
    expect(gameSceneController).toContain("new SaveService(");
    expect(gameSceneController).toContain("MeldRiverLayerBinder");
    expect(gameSceneController).toContain("MeldRiverRoot");
    expect(gameSceneController).toContain("applyMeldRiverNodes");
    expect(gameSceneController).toContain("loadConfiguredLevelOnStart");
    expect(gameSceneController).toContain("this.runtimeState");
    expect(gameSceneController).toContain('dispatch({ type: "tile.select"');
    expect(gameSceneController).toContain('dispatch({ type: "combo.execute"');
    expect(gameSceneController).toContain("uiTransform.setContentSize(width, height)");
    expect(gameSceneController).toContain("ensureRuntimeCamera");
    expect(gameSceneController).toContain("canvas.cameraComponent");
    expect(gameSceneController).toContain("RuntimeCamera");
    expect(gameSceneController).toContain("Camera.ProjectionType.ORTHO");
    expect(gameSceneController).toContain("Camera.ClearFlag.SOLID_COLOR");
    expect(gameSceneController).not.toContain("private readonly selectedSlots");
    expect(gameSceneController).toContain("handleTileClick");
    expect(gameSceneController).toContain("handleSlotClick");
    expect(gameSceneController).toContain("startDiscardSelection");
    expect(gameSceneController).toContain("useShuffleTool");
    expect(gameSceneController).toContain("useUndoTool");
    expect(gameSceneController).not.toContain("discardSelecting");
    expect(gameSceneController).toContain('dispatch({ type: "slot.discard"');
    expect(gameSceneController).toContain("ToolButton_Hint");
    expect(gameSceneController).toContain("ToolButton_Wash");
    expect(gameSceneController).toContain("ToolButton_Undo");
    expect(gameSceneController).toContain("TOP_PLAQUE_SPRITES");
    expect(gameSceneController).toContain("applyTopPlaqueSprite");
    expect(gameSceneController).toContain("HULEBU_SCENE_BACKGROUND_SPRITE");
    expect(formalUiCatalog).toContain("ui/formal-v1/background/scene-emerald-v1/spriteFrame");
    expect(gameSceneController).toContain("applySceneBackgroundSprite");
    expect(gameSceneController).toContain("SceneBackgroundArt");
    expect(gameSceneController).toContain("artNode.setPosition(new Vec3(0, 0, 0))");
    expect(gameSceneController).toContain("this.applyShellHud(sceneModel.hud)");
    expect(gameSceneController).toContain("TOOL_OVERLAY_ROOT_NAME");
    expect(gameSceneController).toContain("this.drawRightToolButtons(this.ensureToolOverlayRoot(), layout, tableRect)");
    expect(gameSceneController).toContain("this.updateShellToolBadges(this.node.getChildByName(TOOL_OVERLAY_ROOT_NAME) ?? shellRoot, hud.toolText)");
    expect(gameSceneController).toContain("parseToolCounts(toolText)");
    expect(gameSceneController).toContain("ToolButton_Wash\", counts.wash");
    expect(gameSceneController).toContain("ToolButton_Undo\", counts.undo");
    expect(gameSceneController).toContain("ToolButton_Hint\", counts.discard");
    expect(formalUiCatalog).toContain("reward-combo");
    expect(formalUiCatalog).toContain("reward-score");
    expect(formalUiCatalog).toContain("reward-slot");
    expect(gameSceneController).toContain("REWARD_CHOICE_CARD_WIDTH = 106");
    expect(gameSceneController).toContain("REWARD_CHOICE_CARD_HEIGHT = 120");
    expect(gameSceneController).toContain("REWARD_CHOICE_CARD_GAP = 112");
    expect(formalUiCatalog).toContain("modals/combo-choice/spriteFrame");
    expect(gameSceneController).toContain("打牌");
    expect(gameSceneController).toContain("handleComboClick");
    expect(gameSceneController).not.toContain("findComboCandidate");
    expect(gameSceneController).not.toContain("removeSelectedSlots");
    expect(gameSceneController).not.toContain("refreshBoardInteractivity");
    expect(gameSceneController).not.toContain("isTileBlockedByRemainingTile");
    expect(gameSceneController).not.toContain("isLatestSceneTileBlocked");
    expect(gameSceneController).not.toContain("HULEBU_UNLOCK_OVERLAP_THRESHOLD = 0.001");
    expect(gameSceneController).toContain("centerLayoutX");
    expect(readText("assets/scripts/runtime/HulebuRuntimeState.ts")).not.toContain("Math.max(1, layout.scale ?? 1)");
    expect(gameSceneController).toContain("centerLayoutY");

    expect(boardLayerBinder).toContain("createTileNode");
    expect(boardLayerBinder).toContain("setTileClickHandler");
    expect(boardLayerBinder).toContain("this.node.on(Node.EventType.TOUCH_END, this.handleBoardPointerEnd, this)");
    expect(boardLayerBinder).toContain("this.node.on(Node.EventType.MOUSE_UP, this.handleBoardPointerEnd, this)");
    expect(boardLayerBinder).toContain("this.node.off(Node.EventType.MOUSE_UP, this.handleBoardPointerEnd, this)");
    expect(boardLayerBinder).toContain("bindCanvasPointerEvents");
    expect(boardLayerBinder).toContain("game.canvas?.addEventListener(\"pointerup\"");
    expect(boardLayerBinder).toContain("game.canvas?.removeEventListener(\"pointerup\"");
    expect(boardLayerBinder).toContain("getCanvasPointerLayoutLocation");
    expect(boardLayerBinder).toContain("rect.width / layout.width");
    expect(boardLayerBinder).toContain("(pointer.y - rect.top - rect.height / 2) / scale + layout.height / 2");
    expect(boardLayerBinder).toContain("selectTileAtUiPoint");
    expect(boardLayerBinder).toContain("type BoardPointerEvent = EventTouch | EventMouse");
    expect(boardLayerBinder).toContain("handleBoardPointerEnd");
    expect(boardLayerBinder).toContain("this.tileClickHandler?.(");
    expect(boardLayerBinder).toContain("bindTileClick");
    expect(boardLayerBinder).toContain("TILE_LOCK_OVERLAP_THRESHOLD = 0.001");
    expect(boardLayerBinder).toContain("TILE_LOCKED_SPRITE_COLOR");
    expect(boardLayerBinder).toContain("sprite.color = model.interactable ? TILE_ACTIVE_SPRITE_COLOR : TILE_LOCKED_SPRITE_COLOR");
    expect(boardLayerBinder).toContain("isTileCurrentlySelectable");
    expect(boardLayerBinder).toContain("getBoardPointerUiLocation");
    expect(boardLayerBinder).toContain("getTileEventRect");
    expect(boardLayerBinder).toContain("layout.height - model.position.y");
    expect(boardLayerBinder).toContain("getOverlapRatio");
    expect(boardLayerBinder).toContain("centerLayoutX");
    expect(boardLayerBinder).toContain("centerLayoutY");
    expect(boardLayerBinder).toContain("TILE_WIDTH = 32");
    expect(boardLayerBinder).toContain("TILE_HEIGHT = 43");
    expect(boardLayerBinder).toContain("TILE_TOP_SCALE_BOOST = 1.04");
    expect(boardLayerBinder).toContain("UITransform");
    expect(boardLayerBinder).toContain("Button");
    expect(boardLayerBinder).toContain("BlockInputEvents");
    expect(boardLayerBinder).toContain("configureTileInputBlocker");
    expect(boardLayerBinder).toContain("node.targetOff(this)");
    expect(boardLayerBinder).toContain("blocker.enabled = false");
    expect(boardLayerBinder).toContain("if (!model.interactable || model.dimmed || !node.activeInHierarchy)");
    expect(boardLayerBinder).toContain("Graphics");

    expect(slotLayerBinder).toContain("ensureCellNode");
    expect(slotLayerBinder).toContain("setSlotClickHandler");
    expect(slotLayerBinder).toContain("bindCellClick");
    expect(slotLayerBinder).toContain("Button.EventType.CLICK");
    expect(slotLayerBinder).toContain("ensureCellLabel");
    expect(slotLayerBinder).toContain("label.string = model.label ?? \"\"");
    expect(slotLayerBinder).toContain("resolveHulebuRuntimeLayout");
    expect(slotLayerBinder).toContain("visibleSize.cssHeight * 0.07");
    expect(slotLayerBinder).toContain("scaleLayoutValue");
    expect(slotLayerBinder).toContain("centerLayoutX");
    expect(slotLayerBinder).toContain("centerLayoutY");
    expect(slotLayerBinder).toContain("UITransform");
    expect(slotLayerBinder).toContain("Graphics");

    expect(comboBarBinder).toContain("ensureComboButton");
    expect(comboBarBinder).toContain("COMBO_BUTTON_SPRITES");
    expect(formalUiCatalog).toContain("ui/formal-v1/actions/hu-active/spriteFrame");
    expect(formalUiCatalog).toContain("ui/formal-v1/actions/gang-normal/spriteFrame");
    expect(comboBarBinder).toContain("applyComboSprite");
    expect(comboBarBinder).toContain("ComboArt");
    expect(comboBarBinder).toContain("resources.load");
    expect(comboBarBinder).toContain("setComboClickHandler");
    expect(comboBarBinder).toContain("node.on(Node.EventType.TOUCH_END");
    expect(comboBarBinder).toContain("node.on(Button.EventType.CLICK");
    expect(comboBarBinder).toContain("this.comboClickHandler?.(control.combo)");
    expect(comboBarBinder).toContain("resolveHulebuRuntimeLayout");
    expect(comboBarBinder).toContain("const slotY = scaleLayoutValue(Math.max(64, visibleSize.cssHeight * 0.07)");
    expect(comboBarBinder).toContain("COMBO_WIDTH = 64");
    expect(comboBarBinder).toContain("COMBO_HEIGHT = 34");
    expect(comboBarBinder).toContain("comboY: slotY + scaleLayoutValue(78, visibleSize.scale)");
    expect(comboBarBinder).toContain("scaleLayoutValue");
    expect(comboBarBinder).toContain("Button");
    expect(comboBarBinder).toContain("Label");
    expect(comboBarBinder).toContain("actions.bugang.active");
    expect(comboBarBinder).toContain("actions.bugang.normal");

    expect(hudBinder).toContain("findLabel");
    expect(hudBinder).toContain("ensureLabel");
    expect(hudBinder).toContain("resolveHulebuRuntimeLayout");
    expect(hudBinder).toContain("visibleSize.height - scaleLayoutValue(40");
    expect(hudBinder).toContain("HUD_LABEL_WIDTHS");
    expect(meldRiverLayerBinder).toContain("class MeldRiverLayerBinder extends Component");
    expect(meldRiverLayerBinder).toContain("applyMeldRiverNodes");
    expect(meldRiverLayerBinder).toContain("OpenMeld");
    expect(meldRiverLayerBinder).toContain("River");
    expect(meldRiverLayerBinder).toContain("补杠");
  });

  test("contains a target-concept visual shell for the Cocos first screen", () => {
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");
    const boardLayerBinder = readText("assets/scripts/BoardLayerBinder.ts");
    const slotLayerBinder = readText("assets/scripts/SlotLayerBinder.ts");
    const hudBinder = readText("assets/scripts/HudBinder.ts");
    const formalUiCatalog = readText("assets/scripts/assets/HulebuFormalUiCatalog.ts");

    expect(gameSceneController).toContain("VisualShellRoot");
    expect(gameSceneController).toContain("GreenTableFelt");
    expect(gameSceneController).toContain("SceneBackgroundArt");
    expect(gameSceneController).toContain("LevelPlaque");
    expect(gameSceneController).toContain("ScorePlaque");
    expect(gameSceneController).toContain("CounterPlaque");
    expect(gameSceneController).toContain("counterExpanded");
    expect(gameSceneController).toContain("formatCounterPlaqueText");
    expect(gameSceneController).toContain("drawTileCounterOverlay");
    expect(gameSceneController).toContain("CounterExpandedPanel");
    expect(gameSceneController).toContain("BlockInputEvents");
    expect(gameSceneController).toContain("toggleTileCounterOverlay");
    expect(gameSceneController).toContain("ProgressPlaque");
    expect(gameSceneController).toContain("tableRect.centerY + tableRect.height / 2 - scaleLayoutValue(30, layout.scale)");
    expect(gameSceneController).toContain("scaleLayoutValue(318, layout.scale)");
    expect(gameSceneController).toContain("hud.bossText ? hud.bossText : hud.boardRemainingText");
    expect(gameSceneController).toContain("ToolButton_Wash");
    expect(gameSceneController).toContain("ToolButton_Undo");
    expect(gameSceneController).toContain("ToolButton_Hint");
    expect(gameSceneController).not.toContain("this.drawSlotTray(shellRoot, layout)");
    expect(gameSceneController).toContain("drawTopPlaque");
    expect(gameSceneController).toContain("formatLevelLabel");
    expect(gameSceneController).toContain("drawToolButton");
    expect(gameSceneController).toContain("TOOL_BUTTON_SPRITES");
    expect(formalUiCatalog).toContain("ui/formal-v1/tools/shuffle-normal/spriteFrame");
    expect(formalUiCatalog).toContain("ui/formal-v1/tools/undo-normal/spriteFrame");
    expect(formalUiCatalog).toContain("ui/formal-v1/tools/hint-normal/spriteFrame");
    expect(gameSceneController).toContain("applyToolButtonSprite");
    expect(gameSceneController).toContain("ToolArt");
    expect(gameSceneController).not.toContain("if (this.isLatestSceneTileBlocked(tileId))");
    expect(gameSceneController).not.toContain("private isLatestSceneTileBlocked(tileId: string): boolean");

    expect(boardLayerBinder).toContain("TILE_SIDE_COLOR");
    expect(boardLayerBinder).toContain("drawTileFace");
    expect(boardLayerBinder).toContain("TILE_LOW_LAYER_OPACITY");
    expect(boardLayerBinder).toContain("TILE_LOCKED_FACE_COLOR");
    expect(boardLayerBinder).toContain("handleBoardPointerEnd");
    expect(boardLayerBinder).toContain("blocker.enabled = false");
    expect(slotLayerBinder).toContain("WOOD_SLOT_FILL");
    expect(slotLayerBinder).toContain("HAND_SLOTS_SPRITE_PATH");
    expect(formalUiCatalog).toContain("ui/formal-v1/board/hand-slots/spriteFrame");
    expect(slotLayerBinder).toContain("SlotTrayArt");
    expect(slotLayerBinder).toContain("hideSlotTrayArt()");
    expect(slotLayerBinder).not.toContain("this.applySlotTrayArt(layout);");
    expect(slotLayerBinder).toContain("resources.load");
    expect(hudBinder).toContain("HUD_BADGE_SPRITES");
    expect(formalUiCatalog).toContain("ui/formal-v1/hud/tile-counter/spriteFrame");
    expect(formalUiCatalog).toContain("ui/formal-v1/hud/level-badge/spriteFrame");
    expect(formalUiCatalog).toContain("ui/formal-v1/hud/score-badge/spriteFrame");
    expect(hudBinder).toContain("HudBadgeArt");
    expect(hudBinder).toContain("resources.load");
  });

  test("guards async Cocos sprite callbacks after nodes are recycled", () => {
    const spriteHelpers = readText("assets/scripts/utils/HulebuSpriteSafety.ts");
    const asyncSpriteFiles = [
      "assets/scripts/BoardLayerBinder.ts",
      "assets/scripts/ComboBarBinder.ts",
      "assets/scripts/GameSceneController.ts",
      "assets/scripts/HudBinder.ts",
      "assets/scripts/MeldRiverLayerBinder.ts",
      "assets/scripts/SlotLayerBinder.ts",
    ];

    expect(spriteHelpers).toContain("export function safeApplySpriteFrame");
    expect(spriteHelpers).toContain("if (!node.isValid || !sprite.isValid)");
    asyncSpriteFiles.forEach((relativePath) => {
      const source = readText(relativePath);
      expect(source).toContain("safeApplySpriteFrame");
      expect(source).not.toMatch(/sprite\.spriteFrame\s*=\s*spriteFrame/);
    });
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
    expect(runtimeState).toContain("isLevelCleared()");
    expect(runtimeState).toContain("getLevelConfig()");
    expect(runtimeState).toContain("getRewardChoices()");
    expect(runtimeState).toContain("getLevelOrder()");
    expect(runtimeState).toContain("createHulebuRunRewardState");
    expect(runtimeState).toContain("applyHulebuRewardToRunState");

    expect(configuredBootstrap).toContain("createHulebuConfiguredSceneModelForLayout");
    expect(configuredBootstrap).toContain("levelIndex = 0");
    expect(configuredBootstrap).toContain("runRewards?: HulebuRunRewardState");
    expect(configuredBootstrap).toContain("levelModifiers?: HulebuLevelModifierState");
    expect(configuredBootstrap).toContain("createHulebuRuntimeLevelForRun(levelIndex, runProfile, displayOrder)");

    expect(gameSceneController).toContain("type HulebuGamePhase");
    expect(gameSceneController).toContain("\"playing\" | \"cleared\" | \"reward\" | \"event\"");
    expect(gameSceneController).toContain("private currentLevelIndex = 0");
    expect(gameSceneController).toContain("private gamePhase: HulebuGamePhase = \"playing\"");
    expect(gameSceneController).toContain("private pendingRewardLevelIndex");
    expect(gameSceneController).toContain("private refreshRuntimeScene");
    expect(gameSceneController).toContain('event.type === "level.cleared"');
    expect(gameSceneController).toContain("this.showClearOverlay()");
    expect(gameSceneController).toContain("continueAfterClear");
    expect(gameSceneController).toContain("startNextLevel");
    expect(gameSceneController).toContain("this.ensureVisualShell(layout, this.runtimeState.getLevelOrder())");
    expect(gameSceneController).toContain("showRewardOverlay");
    expect(gameSceneController).toContain("drawRewardChoices");
    expect(gameSceneController).toContain("RewardChoice_");
    expect(gameSceneController).toContain("pickReward(rewardId: string)");
    expect(gameSceneController).toContain("applyHulebuRewardToRunState");
    expect(gameSceneController).toContain("this.runRewards = applyHulebuRewardToRunState");
    expect(gameSceneController).toContain("node.on(Button.EventType.CLICK, handler, this)");
    expect(gameSceneController).toContain("HULEBU_REWARD_LEVEL_ORDERS.has");
  });

  test("carries Cocos special events into the current level runtime", async () => {
    const levelConfigPath = "assets/scripts/config/HulebuLevelConfig.ts";
    const runtimeStatePath = "assets/scripts/runtime/HulebuRuntimeState.ts";
    const levelConfig = readText(levelConfigPath);
    const runtimeState = readText(runtimeStatePath);
    const configuredBootstrap = readText("assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts");
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");
    const levelModule = await import(pathToFileURL(path.join(cocosRoot, levelConfigPath)).href) as {
      HULEBU_LEVEL_CONFIGS: unknown[];
      HULEBU_EVENT_LEVEL_ORDERS: Set<number>;
      HULEBU_SPECIAL_EVENTS: Array<{ id: string; name: string; rarity: string; tags: string[]; dangerLevel: number }>;
      HULEBU_ADVANCED_SPECIAL_EVENT_POOLS: Record<string, Array<{ id: string; name: string; rarity: string; tags: string[]; dangerLevel: number }>>;
      HULEBU_ENDLESS_SPECIAL_EVENTS: Array<{ id: string; name: string; rarity: string; tags: string[]; dangerLevel: number }>;
      HULEBU_DAILY_SPECIAL_EVENTS: Array<{ id: string; name: string; rarity: string; tags: string[]; dangerLevel: number }>;
      HULEBU_DAILY_MUTATORS: Array<{ key: string; label: string; rewardLabel: string; rewardBias: string[]; eventBias: string[]; featuredCombos: string[] }>;
      HULEBU_ARCHETYPE_SPECIAL_EVENT_POOLS: Record<string, Array<{ id: string; name: string; rarity: string; tags: string[]; dangerLevel: number }>>;
      HULEBU_ENDLESS_RUN_PROFILE: unknown;
      HULEBU_SPECIAL_EVENT_RARITY_LABELS: Record<string, string>;
      HULEBU_SPECIAL_EVENT_DANGER_LABELS: Record<number, string>;
      createHulebuAdvancedRunProfile: (tier: string) => unknown;
      createHulebuDailyRunProfile: (dailySeed: string) => unknown;
      getHulebuDailyMutatorProfile: (dailySeed: string) => { key: string; label: string; rewardLabel: string; rewardBias: string[]; eventBias: string[]; featuredCombos: string[] };
      getHulebuModeSpecialEventPool: (profile: unknown) => Array<{ id: string }>;
      getHulebuArchetypeSpecialEventPool: (archetypeId?: string | null) => Array<{ id: string }>;
      getHulebuSpecialEventChoices: (levelOrder: number, profile?: unknown, archetypeId?: string | null) => Array<{ id: string; name: string; rarity: string; tags: string[]; dangerLevel: number }>;
    };
    const runtimeModule = await import(pathToFileURL(path.join(cocosRoot, runtimeStatePath)).href) as {
      HulebuRuntimeState: new (
        level: unknown,
        runRewards?: unknown,
        levelModifiers?: unknown,
      ) => {
        toSceneModel: (layout: { width: number; height: number; cssWidth: number; cssHeight: number; scale: number }) => {
          hud: { coinsText: string; toolText: string };
        };
        useShuffleTool: () => boolean;
      };
      createHulebuLevelModifierState: () => unknown;
      applyHulebuSpecialEventToLevelState: (state: unknown, eventId: string) => unknown;
    };

    expect(levelConfig).toContain("export const HULEBU_EVENT_LEVEL_ORDERS");
    expect(levelConfig).toContain("new Set([6, 8, 10, 14, 18])");
    expect(levelConfig).toContain("export const HULEBU_SPECIAL_EVENTS");
    expect(levelConfig).toContain("old_player");
    expect(levelConfig).toContain("sealed_wall");
    expect(levelConfig).toContain("HULEBU_ADVANCED_SPECIAL_EVENT_POOLS");
    expect(levelConfig).toContain("advanced_north_tail");
    expect(levelConfig).toContain("HULEBU_ENDLESS_SPECIAL_EVENTS");
    expect(levelConfig).toContain("HULEBU_DAILY_SPECIAL_EVENTS");
    expect(levelConfig).toContain("HULEBU_ARCHETYPE_SPECIAL_EVENT_POOLS");
    expect(levelConfig).toContain("getHulebuModeSpecialEventPool");
    expect(levelConfig).toContain("getHulebuArchetypeSpecialEventPool");
    expect(levelConfig).toContain("export type HulebuSpecialEventRarity");
    expect(levelConfig).toContain("HULEBU_SPECIAL_EVENT_RARITY_LABELS");
    expect(levelConfig).toContain("HULEBU_SPECIAL_EVENT_DANGER_LABELS");
    expect(levelConfig).toContain("export function getHulebuSpecialEventChoices");
    expect(levelConfig).toContain("HULEBU_DAILY_MUTATORS");
    expect(levelConfig).toContain("export interface HulebuDailyMutatorProfile");
    expect(levelConfig).toContain("export function getHulebuDailyMutatorProfile");

    expect(runtimeState).toContain("export interface HulebuLevelModifierState");
    expect(runtimeState).toContain("createHulebuLevelModifierState");
    expect(runtimeState).toContain("applyHulebuSpecialEventToLevelState");
    expect(runtimeState).toContain("toolLocks");
    expect(runtimeState).toContain("事 ${this.levelModifiers.activeEventIds.length}");

    expect(configuredBootstrap).toContain("type HulebuLevelModifierState");
    expect(configuredBootstrap).toContain("levelModifiers?: HulebuLevelModifierState");
    expect(gameSceneController).toContain("HULEBU_EVENT_LEVEL_ORDERS.has");
    expect(gameSceneController).toContain("pendingEventLevelIndex");
    expect(gameSceneController).toContain("showEventOverlay");
    expect(gameSceneController).toContain("drawEventChoices");
    expect(gameSceneController).toContain("formatSpecialEventMeta");
    expect(gameSceneController).toContain("eventConfig.rarity");
    expect(gameSceneController).toContain("eventConfig.dangerLevel");
    expect(gameSceneController).toContain("eventConfig.tags");
    expect(gameSceneController).toContain("pickSpecialEvent(eventId: string)");
    expect(gameSceneController).toContain("getHulebuSpecialEventChoices(");
    expect(gameSceneController).toContain("this.gameCoordinator.snapshot().context.eventOptionIds");

    expect(levelModule.HULEBU_EVENT_LEVEL_ORDERS.has(6)).toBe(true);
    expect(levelModule.HULEBU_SPECIAL_EVENTS.map((event) => event.id)).toEqual([
      "old_player",
      "old_tile_box",
      "dark_table",
      "sealed_wall",
    ]);
    expect(levelModule.getHulebuSpecialEventChoices(6).map((event) => event.id)).toEqual([
      "old_tile_box",
      "dark_table",
      "sealed_wall",
    ]);
    expect(levelModule.HULEBU_SPECIAL_EVENT_RARITY_LABELS.advanced).toBe("高阶");
    expect(levelModule.HULEBU_SPECIAL_EVENT_DANGER_LABELS[2]).toBe("高压");
    expect(levelModule.HULEBU_SPECIAL_EVENTS.find((event) => event.id === "dark_table")).toMatchObject({
      rarity: "rare",
      tags: ["压信息", "风险"],
      dangerLevel: 2,
    });
    expect(Object.keys(levelModule.HULEBU_ADVANCED_SPECIAL_EVENT_POOLS)).toEqual(["east", "south", "west", "north"]);
    expect(levelModule.HULEBU_ENDLESS_SPECIAL_EVENTS.map((event) => event.id)).toEqual([
      "endless_long_supply",
      "endless_deep_tail",
    ]);
    expect(levelModule.HULEBU_DAILY_SPECIAL_EVENTS.map((event) => event.id)).toEqual([
      "daily_lucky_draw",
      "daily_rule_twist",
    ]);
    expect(levelModule.HULEBU_DAILY_MUTATORS).toHaveLength(8);
    expect(Object.keys(levelModule.HULEBU_ARCHETYPE_SPECIAL_EVENT_POOLS)).toEqual([
      "chi",
      "peng",
      "gang",
      "hu",
      "tool",
      "vision",
    ]);
    expect(levelModule.getHulebuArchetypeSpecialEventPool("gang").map((event) => event.id)).toEqual([
      "archetype_gang_wall_push",
    ]);
    expect(levelModule.getHulebuSpecialEventChoices(
      6,
      levelModule.createHulebuAdvancedRunProfile("north"),
    ).map((event) => event.id)).toEqual([
      "advanced_north_tail",
      "old_tile_box",
      "dark_table",
    ]);
    expect(levelModule.getHulebuSpecialEventChoices(
      6,
      levelModule.createHulebuAdvancedRunProfile("north"),
      "hu",
    ).map((event) => event.id)).toEqual([
      "archetype_hu_tail_gate",
      "advanced_north_tail",
      "old_tile_box",
    ]);
    expect(levelModule.getHulebuSpecialEventChoices(
      6,
      levelModule.createHulebuAdvancedRunProfile("north"),
    )[0]).toMatchObject({
      rarity: "advanced",
      tags: ["高阶", "尾门", "容错"],
      dangerLevel: 2,
    });
    expect(levelModule.getHulebuModeSpecialEventPool(levelModule.HULEBU_ENDLESS_RUN_PROFILE).map((event) => event.id)).toEqual([
      "endless_long_supply",
      "endless_deep_tail",
    ]);
    expect(levelModule.getHulebuSpecialEventChoices(
      26,
      levelModule.HULEBU_ENDLESS_RUN_PROFILE,
    ).map((event) => event.id)).toEqual([
      "endless_long_supply",
      "endless_deep_tail",
      "old_tile_box",
    ]);
    expect(levelModule.getHulebuSpecialEventChoices(
      26,
      levelModule.HULEBU_ENDLESS_RUN_PROFILE,
      "gang",
    ).map((event) => event.id)).toEqual([
      "archetype_gang_wall_push",
      "endless_long_supply",
      "endless_deep_tail",
    ]);
    const dailyProfile = levelModule.createHulebuDailyRunProfile("2026-06-29");
    const dailyMutator = levelModule.getHulebuDailyMutatorProfile("2026-06-29");
    expect(dailyMutator.label.startsWith("今日词缀：")).toBe(true);
    expect(dailyMutator.rewardLabel.startsWith("今日奖励：")).toBe(true);
    expect(dailyMutator.rewardBias.length).toBeGreaterThanOrEqual(3);
    expect(dailyMutator.featuredCombos.length).toBeGreaterThanOrEqual(1);
    expect(levelModule.getHulebuSpecialEventChoices(
      8,
      dailyProfile,
    ).map((event) => event.id)).toEqual([
      ...dailyMutator.eventBias,
      "daily_rule_twist",
      "sealed_wall",
    ].slice(0, 3));
    expect(levelModule.getHulebuSpecialEventChoices(
      8,
      dailyProfile,
      "vision",
    ).map((event) => event.id)).toEqual([
      "archetype_vision_dark_bargain",
      "daily_lucky_draw",
      "daily_rule_twist",
    ]);

    const layout = { width: 390, height: 844, cssWidth: 390, cssHeight: 844, scale: 1 };
    const sealedModifiers = runtimeModule.applyHulebuSpecialEventToLevelState(
      runtimeModule.createHulebuLevelModifierState(),
      "sealed_wall",
    );
    const sealedRuntime = new runtimeModule.HulebuRuntimeState(levelModule.HULEBU_LEVEL_CONFIGS[5], undefined, sealedModifiers);
    expect(sealedRuntime.toSceneModel(layout).hud.toolText).toContain("洗 0");
    expect(sealedRuntime.toSceneModel(layout).hud.toolText).toContain("事 1");
    expect(sealedRuntime.useShuffleTool()).toBe(false);

    const coinModifiers = runtimeModule.applyHulebuSpecialEventToLevelState(
      runtimeModule.createHulebuLevelModifierState(),
      "old_player",
    );
    const coinRuntime = new runtimeModule.HulebuRuntimeState(levelModule.HULEBU_LEVEL_CONFIGS[5], undefined, coinModifiers);
    expect(coinRuntime.toSceneModel(layout).hud.coinsText).toContain("铜钱 20");

    const northModifiers = runtimeModule.applyHulebuSpecialEventToLevelState(
      runtimeModule.createHulebuLevelModifierState(),
      "advanced_north_tail",
    );
    const northRuntime = new runtimeModule.HulebuRuntimeState(levelModule.HULEBU_LEVEL_CONFIGS[5], undefined, northModifiers);
    expect(northRuntime.toSceneModel(layout).hud.toolText).toContain("撤 2");
    expect(northRuntime.toSceneModel(layout).hud.toolText).toContain("事 1");

    const endlessModifiers = runtimeModule.applyHulebuSpecialEventToLevelState(
      runtimeModule.createHulebuLevelModifierState(),
      "endless_long_supply",
    );
    const endlessRuntime = new runtimeModule.HulebuRuntimeState(levelModule.HULEBU_LEVEL_CONFIGS[5], undefined, endlessModifiers);
    expect(endlessRuntime.toSceneModel(layout).hud.toolText).toContain("洗 2");
    expect(endlessRuntime.toSceneModel(layout).hud.toolText).toContain("事 1");

    const dailyModifiers = runtimeModule.applyHulebuSpecialEventToLevelState(
      runtimeModule.createHulebuLevelModifierState(),
      "daily_rule_twist",
    );
    const dailyRuntime = new runtimeModule.HulebuRuntimeState(levelModule.HULEBU_LEVEL_CONFIGS[5], undefined, dailyModifiers);
    expect(dailyRuntime.toSceneModel(layout).hud.toolText).toContain("看 0");
    expect(dailyRuntime.toSceneModel(layout).hud.toolText).toContain("事 1");

    const archetypeModifiers = runtimeModule.applyHulebuSpecialEventToLevelState(
      runtimeModule.createHulebuLevelModifierState(),
      "archetype_tool_pack",
    );
    const archetypeRuntime = new runtimeModule.HulebuRuntimeState(levelModule.HULEBU_LEVEL_CONFIGS[5], undefined, archetypeModifiers);
    expect(archetypeRuntime.toSceneModel(layout).hud.toolText).toContain("打 2");
    expect(archetypeRuntime.toSceneModel(layout).hud.toolText).toContain("事 1");
  });

  test("applies Cocos meta upgrades before a run starts", async () => {
    const runtimeStatePath = "assets/scripts/runtime/HulebuRuntimeState.ts";
    const bootstrapPath = "assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts";
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");
    const runtimeText = readText(runtimeStatePath);
    const bootstrapText = readText(bootstrapPath);
    const runtimeModule = await import(pathToFileURL(path.join(cocosRoot, runtimeStatePath)).href) as {
      HulebuRuntimeState: new (
        level: unknown,
        runRewards?: unknown,
        levelModifiers?: unknown,
        metaUpgrades?: unknown,
      ) => {
        discardSlotTile: (slotIndex: number) => boolean;
        toSceneModel: (layout: { width: number; height: number; cssWidth: number; cssHeight: number; scale: number }) => {
          reserveNodes: Array<{ index: number }>;
          riverNodes: Array<{ index: number }>;
          hud: { coinsText: string; toolText: string };
        };
      };
      createHulebuMetaUpgradeState: () => {
        reserveBonus: number;
        shieldBonus: number;
        toolBonus: number;
        riverBonus: number;
        startingCoins: number;
        visionBonus: number;
      };
    };

    expect(runtimeText).toContain("export interface HulebuMetaUpgradeState");
    expect(runtimeText).toContain("createHulebuMetaUpgradeState");
    expect(runtimeText).toContain("this.metaUpgrades.riverBonus");
    expect(runtimeText).toContain("this.metaUpgrades.startingCoins");
    expect(runtimeText).toContain("this.metaUpgrades.visionBonus");
    expect(runtimeText).toContain("河 ${this.riverLimit}");
    expect(bootstrapText).toContain("metaUpgrades?: HulebuMetaUpgradeState");
    expect(bootstrapText).toContain("metaUpgrades,");
    expect(gameSceneController).toContain("private metaUpgrades: HulebuMetaUpgradeState = createHulebuMetaUpgradeState()");
    expect(gameSceneController).toContain("applyMetaUpgrades(upgrades: Partial<HulebuMetaUpgradeState>)");
    expect(gameSceneController).toContain("this.metaUpgrades,");
    expect(gameSceneController).toContain("type HulebuMetaUpgradeAxis = keyof HulebuMetaUpgradeState");
    expect(gameSceneController).toContain("HULEBU_META_UPGRADE_OPTIONS");
    expect(gameSceneController).toContain("HULEBU_META_INITIAL_COINS");
    expect(gameSceneController).toContain("HULEBU_RUN_COMPLETE_META_COIN_REWARD");
    expect(gameSceneController).toContain("HULEBU_META_UPGRADE_COSTS");
    expect(gameSceneController).toContain("HULEBU_META_UPGRADE_MAX_LEVELS");
    expect(gameSceneController).toContain("private metaCoins = HULEBU_META_INITIAL_COINS");
    expect(gameSceneController).toContain("LobbyMode_Upgrade");
    expect(gameSceneController).toContain("showMetaUpgradeOverlay()");
    expect(gameSceneController).toContain("drawMetaUpgradeChoices(overlay)");
    expect(gameSceneController).toContain("upgradeMetaAxis(axis: HulebuMetaUpgradeAxis)");
    expect(gameSceneController).toContain("getMetaUpgradeValue(axis: HulebuMetaUpgradeAxis)");
    expect(gameSceneController).toContain("getMetaUpgradeCost(axis: HulebuMetaUpgradeAxis)");
    expect(gameSceneController).toContain("private showRunCompleteOverlay(): void");
    expect(gameSceneController).toContain("awardMetaCoinsForRun()");
    expect(gameSceneController).toContain("this.metaCoins < cost");
    expect(gameSceneController).toContain("this.metaCoins -= cost");
    expect(gameSceneController).toContain("this.metaCoins += HULEBU_RUN_COMPLETE_META_COIN_REWARD");
    expect(gameSceneController).toContain("this.applyMetaUpgrades({ [axis]:");
    expect(gameSceneController).toContain("this.gamePhase = \"meta\"");
    expect(gameSceneController).toContain("铜钱 ${this.metaCoins} / 点击升级，下一局生效");
    expect(gameSceneController).toContain("获得铜钱 ${HULEBU_RUN_COMPLETE_META_COIN_REWARD}");
    expect(gameSceneController).toContain("满级");

    const layout = { width: 390, height: 844, cssWidth: 390, cssHeight: 844, scale: 1 };
    const metaUpgrades = {
      ...runtimeModule.createHulebuMetaUpgradeState(),
      reserveBonus: 2,
      shieldBonus: 1,
      toolBonus: 1,
      riverBonus: 2,
      startingCoins: 30,
      visionBonus: 2,
    };
    const level = {
      id: "meta-upgrade-test",
      order: 1,
      name: "meta",
      subtitle: "upgrades",
      rewardPool: [],
      bossGoals: [],
      defaults: {
        slotLimit: 8,
        reserveLimit: 1,
        shields: 1,
        firstProtect: true,
        tools: { shuffle: 1, undo: 1, discard: 1, vision: 1 },
      },
      initialSlotOrder: ["slot-a"],
      initialReserveOrder: [],
      tiles: [
        { id: "slot-a", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "board-a", suit: "tong", rank: 2, x: 310, y: 180, layer: 0, blockedBy: [], location: "board" },
      ],
    };
    const state = new runtimeModule.HulebuRuntimeState(level, undefined, undefined, metaUpgrades);
    let sceneModel = state.toSceneModel(layout);
    expect(sceneModel.reserveNodes).toHaveLength(3);
    expect(sceneModel.riverNodes).toHaveLength(5);
    expect(sceneModel.hud.coinsText).toContain("铜钱 30");
    expect(sceneModel.hud.coinsText).toContain("护 2");
    expect(sceneModel.hud.toolText).toContain("洗 2");
    expect(sceneModel.hud.toolText).toContain("撤 2");
    expect(sceneModel.hud.toolText).toContain("打 2");
    expect(sceneModel.hud.toolText).toContain("看 4");
    expect(sceneModel.hud.toolText).toContain("河 5");

    expect(state.discardSlotTile(0)).toBe(true);
    sceneModel = state.toSceneModel(layout);
    expect(sceneModel.hud.toolText).toContain("打 1");
  });

  test("applies Cocos run archetypes before a run starts", async () => {
    const levelConfigPath = "assets/scripts/config/HulebuLevelConfig.ts";
    const runtimeStatePath = "assets/scripts/runtime/HulebuRuntimeState.ts";
    const bootstrapPath = "assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts";
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");
    const levelConfigText = readText(levelConfigPath);
    const runtimeText = readText(runtimeStatePath);
    const bootstrapText = readText(bootstrapPath);
    const runtimeModule = await import(pathToFileURL(path.join(cocosRoot, runtimeStatePath)).href) as {
      createHulebuRunArchetypeState: (archetypeId?: string) => {
        archetypeId: string;
        label: string;
        startingCoins: number;
        toolBonus: { shuffle: number; undo: number; discard: number; vision: number };
        scoreBonus: { gang: number; bugang: number; chi: number; peng: number; hu: number };
      };
      HulebuRuntimeState: new (
        level: unknown,
        runRewards?: unknown,
        levelModifiers?: unknown,
        metaUpgrades?: unknown,
        runArchetype?: unknown,
      ) => {
        executeComboByKey: (candidateKey: string | null) => boolean;
        toSceneModel: (layout: { width: number; height: number; cssWidth: number; cssHeight: number; scale: number }) => {
          comboControls: Array<{ combo: string; candidateKey: string | null; interactable: boolean }>;
          hud: { coinsText: string; toolText: string; scoreText: string };
        };
      };
    };

    expect(levelConfigText).toContain("export type HulebuRunArchetypeId");
    expect(levelConfigText).toContain("HULEBU_RUN_ARCHETYPES");
    expect(levelConfigText).toContain("getHulebuRunArchetypeConfig");
    expect(levelConfigText).toContain("id: \"chi\"");
    expect(levelConfigText).toContain("id: \"peng\"");
    expect(levelConfigText).toContain("id: \"gang\"");
    expect(levelConfigText).toContain("id: \"hu\"");
    expect(levelConfigText).toContain("id: \"tool\"");
    expect(levelConfigText).toContain("id: \"vision\"");
    expect(runtimeText).toContain("export interface HulebuRunArchetypeState");
    expect(runtimeText).toContain("createHulebuRunArchetypeState");
    expect(runtimeText).toContain("export interface HulebuRuntimeSnapshot");
    expect(runtimeText).toContain("tools: HulebuRuntimeTools");
    expect(runtimeText).toContain("static fromSnapshot(");
    expect(runtimeText).toContain("exportSnapshot(): HulebuRuntimeSnapshot");
    expect(runtimeText).toContain("this.runArchetype.scoreBonus");
    expect(runtimeText).toContain("流 ${this.runArchetype.label}");
    expect(bootstrapText).toContain("runArchetype?: HulebuRunArchetypeState");
    expect(bootstrapText).toContain("runArchetype,");
    expect(gameSceneController).toContain("type HulebuGamePhase = \"lobby\" | \"meta\" | \"collection\" | \"advanced\" | \"advancedAbility\" | \"playing\" | \"cleared\" | \"reward\" | \"event\" | \"archetype\"");
    expect(gameSceneController).toContain("HULEBU_RUN_ARCHETYPES");
    expect(gameSceneController).toContain("private pendingRunProfile: HulebuRunProfile | null = null");
    expect(gameSceneController).toContain("private runArchetype: HulebuRunArchetypeState = createHulebuRunArchetypeState()");
    expect(gameSceneController).toContain("const HULEBU_ACTIVE_RUN_STORAGE_KEY = \"hulebu-cocos-active-run\"");
    expect(gameSceneController).toContain("const HULEBU_LAST_SETTLEMENT_STORAGE_KEY = \"hulebu-cocos-last-settlement\"");
    expect(gameSceneController).toContain("const HULEBU_META_PROGRESS_STORAGE_KEY = \"hulebu-cocos-meta-progress\"");
    expect(gameSceneController).toContain("const HULEBU_META_PROFILE_STORAGE_KEY = \"hulebu-cocos-meta-profile\"");
    expect(gameSceneController).toContain("const HULEBU_ACHIEVEMENTS_STORAGE_KEY = \"hulebu-cocos-achievements\"");
    expect(gameSceneController).toContain("const HULEBU_ACCOUNT_PROGRESS_ENDPOINT = \"/api/games/hulebu/progress\"");
    expect(gameSceneController).toContain("const HULEBU_BOARD_REVISION = \"tutorial-pointer-2026-07-08\"");
    expect(gameSceneController).toContain("const HULEBU_ACHIEVEMENTS");
    expect(gameSceneController).toContain("interface HulebuActiveRunSnapshot");
    expect(gameSceneController).toContain("boardRevision: string;");
    expect(gameSceneController).toContain("type HulebuResumableRunPhase = \"playing\" | \"cleared\" | \"reward\" | \"event\" | \"advancedAbility\" | \"archetype\"");
    expect(gameSceneController).toContain("type HulebuAccountSyncState = \"local\" | \"syncing\" | \"ready\" | \"guest\" | \"error\"");
    expect(gameSceneController).toContain("pendingRunProfile: HulebuRunProfile | null");
    expect(gameSceneController).toContain("resumablePhase: HulebuResumableRunPhase");
    expect(gameSceneController).toContain("updatedAt: string;");
    expect(gameSceneController).toContain("runtimeSnapshot: HulebuRuntimeSnapshot | null");
    expect(gameSceneController).toContain("interface HulebuSettlementSnapshot");
    expect(gameSceneController).toContain("interface HulebuMetaProgressSnapshot");
    expect(gameSceneController).toContain("interface HulebuMetaProfileSnapshot");
    expect(gameSceneController).toContain("interface HulebuAccountProgressRecord");
    expect(gameSceneController).toContain("bestMainlineLevel: number;");
    expect(gameSceneController).toContain("type HulebuAchievementSnapshot = Partial<Record<HulebuAchievementId, string>>");
    expect(gameSceneController).toContain("private activeRunSnapshot: HulebuActiveRunSnapshot | null = null");
    expect(gameSceneController).toContain("private lastSettlementSnapshot: HulebuSettlementSnapshot | null = null");
    expect(gameSceneController).toContain("private metaProgress: HulebuMetaProgressSnapshot = createDefaultMetaProgressSnapshot()");
    expect(gameSceneController).toContain("private achievements: HulebuAchievementSnapshot = {}");
    expect(gameSceneController).toContain("private accountSyncState: HulebuAccountSyncState = \"local\"");
    expect(gameSceneController).toContain("private accountSyncMessage = \"账号：当前使用本地档案\"");
    expect(gameSceneController).toContain("selectRunArchetype(archetypeId: HulebuRunArchetypeId)");
    expect(gameSceneController).toContain("pickRunArchetype(archetypeId: HulebuRunArchetypeId)");
    expect(gameSceneController).toContain("this.loadActiveRunSnapshot()");
    expect(gameSceneController).toContain("this.lastSettlementSnapshot = this.readLastSettlementSnapshot()");
    expect(gameSceneController).toContain("this.achievements = this.readAchievementSnapshot()");
    expect(gameSceneController).toContain("resumeActiveRun(): void");
    expect(gameSceneController).toContain("resumeRuntimeSnapshot(snapshot: HulebuActiveRunSnapshot): void");
    expect(gameSceneController).toContain("resumeClearedPhase(snapshot: HulebuActiveRunSnapshot): void");
    expect(gameSceneController).toContain("resumeRewardPhase(snapshot: HulebuActiveRunSnapshot): void");
    expect(gameSceneController).toContain("resumeEventPhase(snapshot: HulebuActiveRunSnapshot): void");
    expect(gameSceneController).toContain("resumeAdvancedAbilityPhase(snapshot: HulebuActiveRunSnapshot): void");
    expect(gameSceneController).toContain("resumeArchetypePhase(snapshot: HulebuActiveRunSnapshot): void");
    expect(gameSceneController).toContain("persistActiveRun(): void");
    expect(gameSceneController).toContain("clearActiveRun(): void");
    expect(gameSceneController).toContain("loadActiveRunSnapshot(): HulebuActiveRunSnapshot | null");
    expect(gameSceneController).toContain("persistLastSettlement(): void");
    expect(gameSceneController).toContain("readLastSettlementSnapshot(): HulebuSettlementSnapshot | null");
    expect(gameSceneController).toContain("persistMetaProgress(): void");
    expect(gameSceneController).toContain("persistMetaProfile(): void");
    expect(gameSceneController).toContain("readMetaProgressSnapshot(): HulebuMetaProgressSnapshot");
    expect(gameSceneController).toContain("readMetaProfileSnapshot(): HulebuMetaProfileSnapshot");
    expect(gameSceneController).toContain("persistAchievements(unlocks: HulebuAchievementSnapshot): void");
    expect(gameSceneController).toContain("readAchievementSnapshot(): HulebuAchievementSnapshot");
    expect(gameSceneController).toContain("syncAccountProgressOnLobbyEntry(): void");
    expect(gameSceneController).toContain("hydrateAccountProgress(): Promise<void>");
    expect(gameSceneController).toContain("pushAccountProgress(): Promise<void>");
    expect(gameSceneController).toContain("fetchAccountProgress(): Promise<HulebuAccountProgressRecord | \"guest\" | null>");
    expect(gameSceneController).toContain("createAccountProgressPayload(): HulebuAccountProgressRecord");
    expect(gameSceneController).toContain("mergeLocalAndAccountProgress(accountProgress: HulebuAccountProgressRecord): HulebuAccountProgressRecord");
    expect(gameSceneController).toContain("applyMergedAccountProgress(progress: HulebuAccountProgressRecord): void");
    expect(gameSceneController).not.toMatch(/sys\.localStorage\.(?:getItem|setItem|removeItem)\(HULEBU_ACTIVE_RUN_STORAGE_KEY/);
    expect(gameSceneController).toContain("this.activeRunSaveService.save(snapshot)");
    expect(gameSceneController).toContain("this.activeRunSaveService.clear()");
    expect(gameSceneController).toContain("switch (loadResult.status)");
    expect(gameSceneController).toContain('case "loaded"');
    expect(gameSceneController).toContain('case "empty"');
    expect(gameSceneController).toContain('case "quarantined"');
    expect(gameSceneController).toContain('case "error"');
    expect(gameSceneController).toContain("this.decodeAccountActiveRunSnapshot(progress.activeRun)");
    expect(gameSceneController).not.toContain("readCocosActiveRunSnapshotFromProgress(");
    expect(gameSceneController).toContain("boardRevision: HULEBU_BOARD_REVISION");
    expect(gameSceneController).toContain("snapshot.boardRevision !== HULEBU_BOARD_REVISION");
    expect(gameSceneController).toContain("sys.localStorage.setItem(HULEBU_LAST_SETTLEMENT_STORAGE_KEY, JSON.stringify(snapshot))");
    expect(gameSceneController).toContain("sys.localStorage.setItem(HULEBU_META_PROGRESS_STORAGE_KEY, JSON.stringify(nextProgress))");
    expect(gameSceneController).toContain("sys.localStorage.setItem(HULEBU_META_PROFILE_STORAGE_KEY, JSON.stringify(snapshot))");
    expect(gameSceneController).toContain("sys.localStorage.setItem(HULEBU_ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(next))");
    expect(gameSceneController).toContain("const metaProfile = this.readMetaProfileSnapshot()");
    expect(gameSceneController).toContain("runtimeSnapshot: this.runtimeState?.exportSnapshot()");
    expect(gameSceneController).toContain('coordinatorSnapshot.phase === "rewardChoice"');
    expect(gameSceneController).toContain("const pendingRunProfile = this.pendingRunProfile ? { ...this.pendingRunProfile } : null");
    expect(gameSceneController).toContain("pendingRunProfile,");
    expect(gameSceneController).toContain("resumablePhase: this.getResumableRunPhase()");
    expect(gameSceneController).toContain("if (snapshot.resumablePhase === \"advancedAbility\")");
    expect(gameSceneController).toContain("if (snapshot.resumablePhase === \"archetype\")");
    expect(gameSceneController).toContain("if (snapshot.resumablePhase === \"event\")");
    expect(gameSceneController).toContain("if (snapshot.resumablePhase === \"reward\")");
    expect(gameSceneController).toContain("if (snapshot.resumablePhase === \"cleared\")");
    expect(gameSceneController).toContain("this.showClearOverlay()");
    expect(gameSceneController).toContain("this.showRewardOverlay()");
    expect(gameSceneController).toContain("this.showEventOverlay()");
    expect(gameSceneController).toContain("this.showAdvancedAbilityOverlay()");
    expect(gameSceneController).toContain("this.showRunArchetypeOverlay()");
    expect(gameSceneController).toContain("assertValidHulebuRuntimeSnapshot(");
    expect(gameSceneController).toContain("if (snapshot.runtimeSnapshot)");
    expect(gameSceneController).toContain("this.resumeRuntimeSnapshot(snapshot)");
    expect(gameSceneController).toContain("const runtimeState = HulebuRuntimeState.fromSnapshot(");
    expect(gameSceneController).toContain("this.metaCoins = metaProfile.metaCoins");
    expect(gameSceneController).toContain("this.metaUpgrades = cloneMetaUpgradeState(metaProfile.metaUpgrades)");
    expect(gameSceneController).toContain("createDefaultMetaProfileSnapshot(): HulebuMetaProfileSnapshot");
    expect(gameSceneController).toContain("metaCoins: HULEBU_META_INITIAL_COINS");
    expect(gameSceneController).toContain("metaUpgrades: createHulebuMetaUpgradeState()");
    expect(gameSceneController).toContain("this.enterDefaultTutorialLevel()");
    expect(gameSceneController).toContain("private enterDefaultTutorialLevel(): void");
    expect(gameSceneController).toContain("this.startLevel(1);");
    expect(gameSceneController).toContain("this.syncAccountProgressOnLobbyEntry()");
    expect(gameSceneController).toContain("returnToLobby()");
    expect(gameSceneController).toContain("showLobbyOverlay()");
    expect(gameSceneController).toContain("showCollectionOverlay()");
    expect(gameSceneController).toContain("drawLobbyModeChoices(overlay)");
    expect(gameSceneController).toContain("LobbyMode_Resume");
    expect(gameSceneController).toContain("LobbyMode_Mainline");
    expect(gameSceneController).toContain("LobbyMode_Endless");
    expect(gameSceneController).toContain("LobbyMode_Daily");
    expect(gameSceneController).toContain("LobbyMode_Collection");
    expect(gameSceneController).toContain("drawCollectionSummary(overlay)");
    expect(gameSceneController).toContain("writeOverlaySummaryLine(");
    expect(gameSceneController).toContain("formatMetaUpgradeSummary(): string");
    expect(gameSceneController).toContain("getNextLockedAchievement(): typeof HULEBU_ACHIEVEMENTS[number] | null");
    expect(gameSceneController).toContain("formatAchievementListSummary(): string");
    expect(gameSceneController).toContain("buildAchievementUnlocks(): HulebuAchievementSnapshot");
    expect(gameSceneController).toContain("mergeAchievementSnapshot(");
    expect(gameSceneController).toContain("查看本地累计进度与最近战绩");
    expect(gameSceneController).toContain("当前无进行中本轮");
    expect(gameSceneController).toContain("最近一轮暂无记录");
    expect(gameSceneController).toContain("成长：");
    expect(gameSceneController).toContain("图鉴：");
    expect(gameSceneController).toContain("下一项：");
    expect(gameSceneController).toContain("首批图鉴：");
    expect(gameSceneController).toContain("Collection_AccountSync");
    expect(gameSceneController).toContain("getAccountSyncStatusText(): string");
    expect(gameSceneController).toContain("daily-first-checkin");
    expect(gameSceneController).toContain("upgrade-first-buy");
    expect(gameSceneController).toContain("ascension-west-clear");
    expect(gameSceneController).toContain("showRunArchetypeOverlay()");
    expect(gameSceneController).toContain("drawRunArchetypeChoices(overlay)");
    expect(gameSceneController).toContain("completeRunArchetypeSelection(archetypeId: HulebuRunArchetypeId)");
    expect(gameSceneController).toContain("RunArchetypeChoice_${archetype.id}");
    expect(gameSceneController).toContain("选择模式，或先升级局外成长");
    expect(gameSceneController).toContain("继续本轮");
    expect(gameSceneController).toContain("formatActiveRunSummary(snapshot: HulebuActiveRunSnapshot): string");
    expect(gameSceneController).toContain("formatLastSettlementSummary(snapshot: HulebuSettlementSnapshot): string");
    expect(gameSceneController).toContain("formatSettlementSummaryText(snapshot: HulebuSettlementSnapshot | null = null): string");
    expect(gameSceneController).toContain("getEndlessProgressText(): string");
    expect(gameSceneController).toContain("getDailyProgressText(): string");
    expect(gameSceneController).toContain("getDailyCollectionSummaryText(): string");
    expect(gameSceneController).toContain("getAdvancedProgressText(): string");
    expect(gameSceneController).toContain("createDefaultMetaProgressSnapshot()");
    expect(gameSceneController).toContain("bestMainlineLevel:");
    expect(gameSceneController).toContain("dailyStreak:");
    expect(gameSceneController).toContain("lastDailySeed:");
    expect(gameSceneController).toContain("persistDailyParticipation(dailySeed: string): void");
    expect(gameSceneController).toContain("queueAccountProgressPush();");
    expect(gameSceneController).toContain("getHulebuDailyMutatorProfile(todaySeed)");
    expect(gameSceneController).toContain("最高第");
    expect(gameSceneController).toContain("getHigherAdvancedTier(");
    expect(gameSceneController).toContain("最近到第");
    expect(gameSceneController).toContain("最高");
    expect(gameSceneController).toContain("rewardLabel");
    expect(gameSceneController).toContain("连 ");
    expect(gameSceneController).toContain("已到");
    expect(gameSceneController).toContain("this.gamePhase = \"archetype\"");
    expect(gameSceneController).toContain("this.gamePhase = \"lobby\"");
    expect(gameSceneController).toContain("this.pendingRunProfile = null");
    expect(gameSceneController).toContain("this.runArchetype,");
    expect(gameSceneController).toContain("sanitizeAccountProgressRecord(");
    expect(gameSceneController).toContain("createCocosAccountActiveRunPayload(");

    const layout = { width: 390, height: 844, cssWidth: 390, cssHeight: 844, scale: 1 };
    const level = {
      id: "run-archetype-test",
      order: 1,
      name: "archetype",
      subtitle: "test",
      rewardPool: [],
      bossGoals: [],
      defaults: {
        slotLimit: 8,
        reserveLimit: 1,
        shields: 0,
        firstProtect: false,
        tools: { shuffle: 1, undo: 1, discard: 1, vision: 0 },
      },
      initialSlotOrder: ["gang-a", "gang-b", "gang-c", "gang-d"],
      initialReserveOrder: [],
      tiles: [
        { id: "gang-a", suit: "wan", rank: 8, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "gang-b", suit: "wan", rank: 8, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "gang-c", suit: "wan", rank: 8, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "gang-d", suit: "wan", rank: 8, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "board-a", suit: "tong", rank: 1, x: 310, y: 180, layer: 0, blockedBy: [], location: "board" },
      ],
    };

    const toolState = new runtimeModule.HulebuRuntimeState(
      level,
      undefined,
      undefined,
      undefined,
      runtimeModule.createHulebuRunArchetypeState("tool"),
    );
    const toolScene = toolState.toSceneModel(layout);
    expect(toolScene.hud.toolText).toContain("洗 2");
    expect(toolScene.hud.toolText).toContain("撤 2");
    expect(toolScene.hud.toolText).toContain("打 2");
    expect(toolScene.hud.toolText).toContain("流 道具流");

    const visionState = new runtimeModule.HulebuRuntimeState(
      level,
      undefined,
      undefined,
      undefined,
      runtimeModule.createHulebuRunArchetypeState("vision"),
    );
    const visionScene = visionState.toSceneModel(layout);
    expect(visionScene.hud.coinsText).toContain("铜钱 10");
    expect(visionScene.hud.toolText).toContain("看 2");
    expect(visionScene.hud.toolText).toContain("流 信息流");

    const gangState = new runtimeModule.HulebuRuntimeState(
      level,
      undefined,
      undefined,
      undefined,
      runtimeModule.createHulebuRunArchetypeState("gang"),
    );
    let gangScene = gangState.toSceneModel(layout);
    const gang = gangScene.comboControls.find((control) => control.combo === "gang");
    expect(gang?.interactable).toBe(true);
    expect(gangState.executeComboByKey(gang?.candidateKey ?? null)).toBe(true);
    gangScene = gangState.toSceneModel(layout);
    expect(gangScene.hud.scoreText).toContain("分 65");
  });

  test("adds Cocos advanced run entry before archetype selection", async () => {
    const levelConfigPath = "assets/scripts/config/HulebuLevelConfig.ts";
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");
    const levelConfigText = readText(levelConfigPath);
    const levelConfigModule = await import(pathToFileURL(path.join(cocosRoot, levelConfigPath)).href) as {
      HULEBU_ADVANCED_RUN_PROFILES: Record<string, { mode: string; displayName: string; startOrder: number; advancedTier: string }>;
      createHulebuAdvancedRunProfile: (tier: string) => { mode: string; displayName: string; startOrder: number; advancedTier: string };
      getHulebuLevelIndexForRunOrder: (profile: unknown, displayOrder: number) => number;
    };

    expect(levelConfigText).toContain("export type HulebuAdvancedRunTier");
    expect(levelConfigText).toContain("export type HulebuRunMode = \"mainline\" | \"endless\" | \"daily\" | \"advanced\"");
    expect(levelConfigText).toContain("HULEBU_ADVANCED_RUN_PROFILES");
    expect(levelConfigText).toContain("createHulebuAdvancedRunProfile(tier: HulebuAdvancedRunTier)");
    expect(levelConfigText).toContain("advancedTier?: HulebuAdvancedRunTier");
    expect(levelConfigText).toContain("profile.mode === \"advanced\"");
    expect(levelConfigText).toContain("displayName: \"东风场\"");
    expect(levelConfigText).toContain("displayName: \"南风场\"");
    expect(levelConfigText).toContain("displayName: \"西风场\"");
    expect(levelConfigText).toContain("displayName: \"北风场\"");
    expect(gameSceneController).toContain("createHulebuAdvancedRunProfile");
    expect(gameSceneController).toContain("type HulebuGamePhase = \"lobby\" | \"meta\" | \"collection\" | \"advanced\" | \"advancedAbility\" | \"playing\" | \"cleared\" | \"reward\" | \"event\" | \"archetype\"");
    expect(gameSceneController).toContain("startAdvancedRun(tier: HulebuAdvancedRunTier)");
    expect(gameSceneController).toContain("showAdvancedRunOverlay()");
    expect(gameSceneController).toContain("drawAdvancedRunChoices(overlay)");
    expect(gameSceneController).toContain("LobbyMode_Advanced");
    expect(gameSceneController).toContain("AdvancedRun_East");
    expect(gameSceneController).toContain("AdvancedRun_South");
    expect(gameSceneController).toContain("AdvancedRun_West");
    expect(gameSceneController).toContain("AdvancedRun_North");
    expect(gameSceneController).toContain("选择风场后进入本局流派");
    expect(gameSceneController).toContain("this.gamePhase = \"advanced\"");
    expect(gameSceneController).toContain("this.startRunWithProfile(createHulebuAdvancedRunProfile(tier))");

    expect(Object.keys(levelConfigModule.HULEBU_ADVANCED_RUN_PROFILES)).toEqual(["east", "south", "west", "north"]);
    expect(levelConfigModule.createHulebuAdvancedRunProfile("east").displayName).toBe("东风场");
    expect(levelConfigModule.createHulebuAdvancedRunProfile("north").advancedTier).toBe("north");
    expect(levelConfigModule.getHulebuLevelIndexForRunOrder(levelConfigModule.createHulebuAdvancedRunProfile("east"), 31)).toBeGreaterThanOrEqual(10);
    expect(levelConfigModule.getHulebuLevelIndexForRunOrder(levelConfigModule.createHulebuAdvancedRunProfile("north"), 61)).toBeGreaterThanOrEqual(10);
  });

  test("applies Cocos advanced wind pressure to each runtime level", async () => {
    const levelConfigPath = "assets/scripts/config/HulebuLevelConfig.ts";
    const runtimeStatePath = "assets/scripts/runtime/HulebuRuntimeState.ts";
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");
    const levelConfigText = readText(levelConfigPath);
    const runtimeText = readText(runtimeStatePath);
    const levelConfigModule = await import(pathToFileURL(path.join(cocosRoot, levelConfigPath)).href) as {
      HULEBU_LEVEL_CONFIGS: unknown[];
      HULEBU_ADVANCED_RUN_PRESSURES: Record<string, {
        tier: string;
        name: string;
        toolBonus: Partial<Record<"shuffle" | "undo" | "discard" | "vision", number>>;
        toolLocks: Partial<Record<"shuffle" | "undo" | "discard" | "vision", boolean>>;
      }>;
      createHulebuAdvancedRunProfile: (tier: string) => { mode: string; advancedTier?: string };
      getHulebuAdvancedRunPressureConfig: (profile: unknown) => {
        tier: string;
        toolBonus: Partial<Record<"shuffle" | "undo" | "discard" | "vision", number>>;
        toolLocks: Partial<Record<"shuffle" | "undo" | "discard" | "vision", boolean>>;
      } | null;
    };
    const runtimeModule = await import(pathToFileURL(path.join(cocosRoot, runtimeStatePath)).href) as {
      createHulebuLevelModifierState: () => {
        activeEventIds: string[];
        coinBonus: number;
        toolBonus: { shuffle: number; undo: number; discard: number; vision: number };
        toolLocks: Partial<Record<"shuffle" | "undo" | "discard" | "vision", boolean>>;
      };
      mergeHulebuLevelModifierStates: (baseState: unknown, nextState: unknown) => unknown;
      HulebuRuntimeState: new (level: unknown, rewards?: unknown, modifiers?: unknown) => {
        toSceneModel: (layout: { width: number; height: number; cssWidth: number; cssHeight: number; scale: number }) => {
          hud: { toolText: string };
        };
      };
    };

    expect(levelConfigText).toContain("export interface HulebuAdvancedRunPressureConfig");
    expect(levelConfigText).toContain("HULEBU_ADVANCED_RUN_PRESSURES");
    expect(levelConfigText).toContain("getHulebuAdvancedRunPressureConfig");
    expect(runtimeText).toContain("mergeHulebuLevelModifierStates");
    expect(runtimeText).toContain("Math.max(0, tools.shuffle)");
    expect(gameSceneController).toContain("getHulebuAdvancedRunPressureConfig");
    expect(gameSceneController).toContain("createAdvancedRunLevelModifiers()");
    expect(gameSceneController).toContain("mergeHulebuLevelModifierStates(");
    expect(gameSceneController).toContain("advanced_${pressure.tier}");

    expect(Object.keys(levelConfigModule.HULEBU_ADVANCED_RUN_PRESSURES)).toEqual(["east", "south", "west", "north"]);
    expect(levelConfigModule.getHulebuAdvancedRunPressureConfig({ mode: "mainline" })).toBeNull();
    expect(levelConfigModule.getHulebuAdvancedRunPressureConfig(
      levelConfigModule.createHulebuAdvancedRunProfile("south"),
    )?.toolLocks.shuffle).toBe(true);
    expect(levelConfigModule.HULEBU_ADVANCED_RUN_PRESSURES.north.toolLocks.vision).toBe(true);
    expect(levelConfigModule.HULEBU_ADVANCED_RUN_PRESSURES.west.toolBonus.undo).toBe(-1);

    const layout = { width: 390, height: 844, cssWidth: 390, cssHeight: 844, scale: 1 };
    const southModifiers = runtimeModule.createHulebuLevelModifierState();
    southModifiers.activeEventIds.push("advanced_south");
    southModifiers.toolBonus.vision = -1;
    southModifiers.toolLocks.shuffle = true;
    const southState = new runtimeModule.HulebuRuntimeState(levelConfigModule.HULEBU_LEVEL_CONFIGS[0], undefined, southModifiers);
    const southScene = southState.toSceneModel(layout);
    expect(southScene.hud.toolText).toContain("洗 0");
    expect(southScene.hud.toolText).toContain("看 0");
    expect(southScene.hud.toolText).toContain("事 1");

    const northModifiers = runtimeModule.createHulebuLevelModifierState();
    northModifiers.activeEventIds.push("advanced_north");
    northModifiers.toolBonus.undo = -2;
    northModifiers.toolBonus.discard = -2;
    northModifiers.toolLocks.shuffle = true;
    northModifiers.toolLocks.vision = true;
    const northState = new runtimeModule.HulebuRuntimeState(levelConfigModule.HULEBU_LEVEL_CONFIGS[0], undefined, northModifiers);
    const northScene = northState.toSceneModel(layout);
    expect(northScene.hud.toolText).toContain("洗 0");
    expect(northScene.hud.toolText).toContain("撤 0");
    expect(northScene.hud.toolText).toContain("打 0");
    expect(northScene.hud.toolText).toContain("看 0");
  });

  test("adds Cocos advanced reward pools to reward nodes", async () => {
    const levelConfigPath = "assets/scripts/config/HulebuLevelConfig.ts";
    const runtimeStatePath = "assets/scripts/runtime/HulebuRuntimeState.ts";
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");
    const levelConfigText = readText(levelConfigPath);
    const runtimeText = readText(runtimeStatePath);
    const levelConfigModule = await import(pathToFileURL(path.join(cocosRoot, levelConfigPath)).href) as {
      HULEBU_LEVEL_CONFIGS: unknown[];
      HULEBU_REWARD_LABELS: Record<string, string>;
      HULEBU_ADVANCED_REWARD_POOLS: Record<string, string[]>;
      HULEBU_MAINLINE_RUN_PROFILE: unknown;
      createHulebuAdvancedRunProfile: (tier: string) => unknown;
      createHulebuDailyRunProfile: (date: string) => unknown;
      getHulebuDailyMutatorProfile: (date: string) => { rewardBias: string[] };
      getHulebuRewardChoicesForRun: (profile: unknown, level: unknown) => string[];
    };
    const runtimeModule = await import(pathToFileURL(path.join(cocosRoot, runtimeStatePath)).href) as {
      createHulebuRunRewardState: () => unknown;
      applyHulebuRewardToRunState: (state: unknown, rewardId: string) => unknown;
      HulebuRuntimeState: new (level: unknown, rewards?: unknown) => {
        executeComboByKey: (candidateKey: string | null) => boolean;
        toSceneModel: (layout: { width: number; height: number; cssWidth: number; cssHeight: number; scale: number }) => {
          reserveNodes: Array<{ index: number }>;
          comboControls: Array<{ combo: string; candidateKey: string | null; interactable: boolean }>;
          hud: { coinsText: string; toolText: string; scoreText: string };
        };
      };
    };

    expect(levelConfigText).toContain("HULEBU_ADVANCED_REWARD_POOLS");
    expect(levelConfigText).toContain("getHulebuRewardChoicesForRun");
    expect(levelConfigText).toContain("getHulebuDailyMutatorProfile");
    expect(levelConfigText).toContain("advanced_north_stable_life");
    expect(runtimeText).toContain("advanced_south_river_guard");
    expect(runtimeText).toContain("advanced_north_kong_tide");
    expect(gameSceneController).toContain("getHulebuRewardChoicesForRun");
    expect(gameSceneController).toContain("getCurrentRewardChoices()");

    expect(Object.keys(levelConfigModule.HULEBU_ADVANCED_REWARD_POOLS)).toEqual(["east", "south", "west", "north"]);
    expect(levelConfigModule.HULEBU_REWARD_LABELS.advanced_south_river_guard).toBe("护河留手");
    const level = levelConfigModule.HULEBU_LEVEL_CONFIGS[0];
    expect(levelConfigModule.getHulebuRewardChoicesForRun(
      levelConfigModule.HULEBU_MAINLINE_RUN_PROFILE,
      level,
    )).toEqual(["first_protect_shield", "shield_plus_1", "vision_plus_1"]);
    expect(levelConfigModule.getHulebuRewardChoicesForRun(
      levelConfigModule.createHulebuAdvancedRunProfile("north"),
      level,
    )).toEqual(["advanced_north_kong_tide", "advanced_north_stable_life", "first_protect_shield"]);
    expect(levelConfigModule.getHulebuRewardChoicesForRun(
      levelConfigModule.createHulebuDailyRunProfile("2026-06-29"),
      level,
    )).toEqual(levelConfigModule.getHulebuDailyMutatorProfile("2026-06-29").rewardBias.slice(0, 3));

    const layout = { width: 390, height: 844, cssWidth: 390, cssHeight: 844, scale: 1 };
    const southRewards = runtimeModule.applyHulebuRewardToRunState(
      runtimeModule.createHulebuRunRewardState(),
      "advanced_south_river_guard",
    );
    const southState = new runtimeModule.HulebuRuntimeState(level, southRewards);
    const southScene = southState.toSceneModel(layout);
    expect(southScene.hud.toolText).toContain("打 2");
    expect(southScene.hud.coinsText).toContain("护 2");

    const northRewards = runtimeModule.applyHulebuRewardToRunState(
      runtimeModule.createHulebuRunRewardState(),
      "advanced_north_kong_tide",
    );
    const gangLevel = {
      id: "advanced-reward-gang-score",
      order: 98,
      name: "高阶奖励验收",
      subtitle: "杠潮压顶",
      rewardPool: [],
      bossGoals: [],
      defaults: {
        slotLimit: 8,
        reserveLimit: 1,
        shields: 1,
        firstProtect: true,
        tools: { shuffle: 1, undo: 1, discard: 1, vision: 1 },
      },
      initialSlotOrder: ["a", "b", "c", "d"],
      initialReserveOrder: [],
      tiles: [
        { id: "a", suit: "wan", rank: 8, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "b", suit: "wan", rank: 8, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "c", suit: "wan", rank: 8, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "d", suit: "wan", rank: 8, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      ],
    };
    const northState = new runtimeModule.HulebuRuntimeState(gangLevel, northRewards);
    let northScene = northState.toSceneModel(layout);
    expect(northScene.hud.coinsText).toContain("铜钱 10");
    const gang = northScene.comboControls.find((control) => control.combo === "gang");
    expect(northState.executeComboByKey(gang?.candidateKey ?? null)).toBe(true);
    northScene = northState.toSceneModel(layout);
    expect(northScene.hud.scoreText).toContain("分 80");
  });

  test("adds Cocos advanced ability slot before archetype selection", async () => {
    const levelConfigPath = "assets/scripts/config/HulebuLevelConfig.ts";
    const runtimeStatePath = "assets/scripts/runtime/HulebuRuntimeState.ts";
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");
    const levelConfigText = readText(levelConfigPath);
    const runtimeText = readText(runtimeStatePath);
    const levelConfigModule = await import(pathToFileURL(path.join(cocosRoot, levelConfigPath)).href) as {
      HULEBU_LEVEL_CONFIGS: unknown[];
      HULEBU_ADVANCED_ABILITIES: Array<{
        id: string;
        name: string;
        tiers: string[];
        rewardIds: string[];
        coinBonus: number;
        toolBonus: Partial<Record<"shuffle" | "undo" | "discard" | "vision", number>>;
      }>;
      createHulebuAdvancedRunProfile: (tier: string) => unknown;
      getHulebuAdvancedAbilityChoices: (profile: unknown) => Array<{
        id: string;
        rewardIds: string[];
        toolBonus: Partial<Record<"shuffle" | "undo" | "discard" | "vision", number>>;
      }>;
    };
    const runtimeModule = await import(pathToFileURL(path.join(cocosRoot, runtimeStatePath)).href) as {
      createHulebuRunRewardState: () => unknown;
      createHulebuLevelModifierState: () => {
        activeEventIds: string[];
        coinBonus: number;
        toolBonus: { shuffle: number; undo: number; discard: number; vision: number };
        toolLocks: Partial<Record<"shuffle" | "undo" | "discard" | "vision", boolean>>;
      };
      applyHulebuRewardToRunState: (state: unknown, rewardId: string) => unknown;
      HulebuRuntimeState: new (level: unknown, rewards?: unknown, modifiers?: unknown) => {
        toSceneModel: (layout: { width: number; height: number; cssWidth: number; cssHeight: number; scale: number }) => {
          hud: { coinsText: string; toolText: string };
        };
      };
    };

    expect(levelConfigText).toContain("export interface HulebuAdvancedAbilityConfig");
    expect(levelConfigText).toContain("HULEBU_ADVANCED_ABILITIES");
    expect(levelConfigText).toContain("getHulebuAdvancedAbilityChoices");
    expect(runtimeText).toContain("advanced_west_tail_gate");
    expect(gameSceneController).toContain("advancedAbility");
    expect(gameSceneController).toContain("showAdvancedAbilityOverlay()");
    expect(gameSceneController).toContain("drawAdvancedAbilityChoices(overlay)");
    expect(gameSceneController).toContain("pickAdvancedAbility(abilityId: string)");
    expect(gameSceneController).toContain("applySelectedAdvancedAbilityRewards()");
    expect(gameSceneController).toContain("ability_${this.selectedAdvancedAbility.id}");

    expect(levelConfigModule.HULEBU_ADVANCED_ABILITIES.map((ability) => ability.id)).toEqual([
      "sealed_wall_guard",
      "late_fire",
      "tail_buffer",
    ]);
    expect(levelConfigModule.getHulebuAdvancedAbilityChoices({ mode: "mainline" })).toEqual([]);
    expect(levelConfigModule.getHulebuAdvancedAbilityChoices(
      levelConfigModule.createHulebuAdvancedRunProfile("north"),
    ).map((ability) => ability.id)).toEqual(["sealed_wall_guard", "late_fire", "tail_buffer"]);
    expect(levelConfigModule.getHulebuAdvancedAbilityChoices(
      levelConfigModule.createHulebuAdvancedRunProfile("south"),
    ).map((ability) => ability.id)).toEqual(["sealed_wall_guard"]);

    const tailBuffer = levelConfigModule.HULEBU_ADVANCED_ABILITIES.find((ability) => ability.id === "tail_buffer");
    expect(tailBuffer?.rewardIds).toEqual(["advanced_west_tail_gate"]);
    expect(tailBuffer?.toolBonus.undo).toBe(1);

    const layout = { width: 390, height: 844, cssWidth: 390, cssHeight: 844, scale: 1 };
    const rewards = (tailBuffer?.rewardIds ?? []).reduce(
      (state, rewardId) => runtimeModule.applyHulebuRewardToRunState(state, rewardId),
      runtimeModule.createHulebuRunRewardState(),
    );
    const modifiers = runtimeModule.createHulebuLevelModifierState();
    modifiers.activeEventIds.push("ability_tail_buffer");
    modifiers.toolBonus.undo = tailBuffer?.toolBonus.undo ?? 0;
    const scene = new runtimeModule.HulebuRuntimeState(
      levelConfigModule.HULEBU_LEVEL_CONFIGS[0],
      rewards,
      modifiers,
    ).toSceneModel(layout);
    expect(scene.hud.toolText).toContain("撤 2");
    expect(scene.hud.toolText).toContain("事 1");
    expect(scene.hud.coinsText).toContain("护 2");
  });

  test("adds Cocos run mode foundations for endless and daily flows", async () => {
    const levelConfigPath = "assets/scripts/config/HulebuLevelConfig.ts";
    const levelConfig = readText(levelConfigPath);
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");
    const moduleUrl = pathToFileURL(path.join(cocosRoot, levelConfigPath)).href;
    const levelModule = await import(moduleUrl) as {
      HULEBU_LEVEL_CONFIGS: Array<{ order: number; id: string }>;
      HULEBU_MAINLINE_RUN_PROFILE: { mode: string; startOrder: number };
      HULEBU_ENDLESS_RUN_PROFILE: { mode: string; startOrder: number };
      createHulebuDailyRunProfile: (dailySeed: string) => { mode: string; dailySeed?: string; startOrder: number };
      getHulebuLevelIndexForRunOrder: (profile: unknown, displayOrder: number) => number;
      shouldCompleteHulebuRunAtOrder: (profile: unknown, displayOrder: number) => boolean;
    };

    expect(levelConfig).toContain("export type HulebuRunMode = \"mainline\" | \"endless\" | \"daily\"");
    expect(levelConfig).toContain("export interface HulebuRunProfile");
    expect(levelConfig).toContain("export const HULEBU_ENDLESS_START_ORDER = 21");
    expect(levelConfig).toContain("export const HULEBU_MAINLINE_RUN_PROFILE");
    expect(levelConfig).toContain("export const HULEBU_ENDLESS_RUN_PROFILE");
    expect(levelConfig).toContain("createHulebuDailyRunProfile");
    expect(levelConfig).toContain("getHulebuLevelIndexForRunOrder");
    expect(levelConfig).toContain("shouldCompleteHulebuRunAtOrder");

    expect(gameSceneController).toContain("private currentDisplayLevelOrder = 1");
    expect(gameSceneController).toContain("private runProfile: HulebuRunProfile = HULEBU_MAINLINE_RUN_PROFILE");
    expect(gameSceneController).toContain("startMainlineRun()");
    expect(gameSceneController).toContain("startEndlessRun()");
    expect(gameSceneController).toContain("startDailyRun");
    expect(gameSceneController).toContain("getHulebuLevelIndexForRunOrder(this.runProfile, displayLevelOrder)");
    expect(gameSceneController).toContain("shouldCompleteHulebuRunAtOrder(this.runProfile, displayLevelOrder)");
    expect(gameSceneController).toContain("getDisplayLevelOrderForFlow");
    expect(gameSceneController).toContain("getRunModeLabel");

    expect(levelModule.HULEBU_MAINLINE_RUN_PROFILE).toMatchObject({
      mode: "mainline",
      startOrder: 1,
    });
    expect(levelModule.HULEBU_ENDLESS_RUN_PROFILE).toMatchObject({
      mode: "endless",
      startOrder: 21,
    });
    expect(levelModule.shouldCompleteHulebuRunAtOrder(levelModule.HULEBU_MAINLINE_RUN_PROFILE, 21)).toBe(true);
    expect(levelModule.shouldCompleteHulebuRunAtOrder(levelModule.HULEBU_ENDLESS_RUN_PROFILE, 61)).toBe(false);

    const endless21 = levelModule.getHulebuLevelIndexForRunOrder(levelModule.HULEBU_ENDLESS_RUN_PROFILE, 21);
    const endless30 = levelModule.getHulebuLevelIndexForRunOrder(levelModule.HULEBU_ENDLESS_RUN_PROFILE, 30);
    const endless31 = levelModule.getHulebuLevelIndexForRunOrder(levelModule.HULEBU_ENDLESS_RUN_PROFILE, 31);
    expect(levelModule.HULEBU_LEVEL_CONFIGS[endless21]?.order).toBe(11);
    expect(levelModule.HULEBU_LEVEL_CONFIGS[endless30]?.order).toBe(20);
    expect(levelModule.HULEBU_LEVEL_CONFIGS[endless31]?.order).toBe(11);

    const dailyProfile = levelModule.createHulebuDailyRunProfile("2026-06-28");
    expect(dailyProfile).toMatchObject({
      mode: "daily",
      dailySeed: "2026-06-28",
      startOrder: 1,
    });
    expect(levelModule.getHulebuLevelIndexForRunOrder(dailyProfile, 1)).toBe(
      levelModule.getHulebuLevelIndexForRunOrder(dailyProfile, 1),
    );
    expect(levelModule.getHulebuLevelIndexForRunOrder(dailyProfile, 21)).toBe(
      levelModule.getHulebuLevelIndexForRunOrder(dailyProfile, 1),
    );
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
    expect(levelConfig).toContain("HULEBU_COCOS_STACK_OVERLAP_THRESHOLD = 0.001");
    expect(levelConfig).toContain("export const HULEBU_LEVEL_ONE_CONFIG");
    expect(levelConfig).not.toContain("createSixTilePengMountain");
    expect(levelConfig).not.toContain("p1a");

    const levels = levelModule.HULEBU_LEVEL_CONFIGS;
    expect(levels).toHaveLength(20);
    expect(levels[0]?.tiles.length).toBe(15);
    expect(Math.min(...levels.map((level) => level.tiles.length))).toBeGreaterThanOrEqual(15);
    expect(Math.min(...levels.slice(1).map((level) => level.tiles.length))).toBeGreaterThanOrEqual(36);

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
            && getTileOverlapRatio(tile, candidate) > 0.001
            && !tile.blockedBy.includes(candidate.id)
          ))
          .map((candidate) => `${level.id}:${tile.id}->${candidate.id}`)
      ))
    ));
    expect(firstLevel.tiles).toHaveLength(15);
    expect(xSpan).toBeGreaterThanOrEqual(45);
    expect(xSpan).toBeLessThanOrEqual(140);
    expect(ySpan).toBeGreaterThanOrEqual(10);
    expect(ySpan).toBeLessThanOrEqual(50);
    expect(maxLayer).toBeGreaterThanOrEqual(2);
    expect(blockedTiles.length).toBeGreaterThanOrEqual(12);
    expect(initiallyFreeTiles).toHaveLength(3);
    expect(crossColumnBlockers.length).toBeGreaterThanOrEqual(6);
    expect(crossColumnLockedTiles.length).toBeGreaterThanOrEqual(3);
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
    expect(levelConfig).toContain("templateId: \"long-wall\"");
    expect(levelConfig).toContain("createHulebuGraphMountainLevelConfig");
    expect(levelConfig).toContain("mapGraphTileToCocosTile");
    expect(levelConfig).not.toContain("createStackColumns(");
    expect(levelConfig).not.toContain("createTopFirstPlacements");

    const levels = levelModule.HULEBU_LEVEL_CONFIGS;
    expect(levels[0]?.tiles[0]?.id).toContain("graph_long-wall_");
    expect(levels).toHaveLength(20);
    expect(levelConfig).not.toContain("options.order <= 5 ? \"pyramid\"");

    const allLevelIds = levels.flatMap((level) => level.tiles.map((tile) => tile.id));
    expect(allLevelIds.some((id) => id.includes("center-tower"))).toBe(true);
    expect(allLevelIds.some((id) => id.includes("two-wings"))).toBe(true);
    expect(allLevelIds.some((id) => id.includes("cross"))).toBe(true);
    expect(allLevelIds.some((id) => id.includes("ring"))).toBe(true);
    expect(allLevelIds.some((id) => id.includes("long-wall"))).toBe(true);
    expect(allLevelIds.some((id) => id.includes("islands"))).toBe(true);
    expect(allLevelIds.some((id) => id.includes("canyon"))).toBe(true);
    expect(allLevelIds.some((id) => id.includes("staircase"))).toBe(true);
    const tileCounts = levels.map((level) => level.tiles.length);
    const initialFreeCounts = levels.map((level) => level.tiles.filter((tile) => tile.blockedBy.length === 0).length);
    expect(tileCounts[0]).toBe(15);
    expect(Math.min(...tileCounts)).toBeGreaterThanOrEqual(15);
    expect(Math.min(...tileCounts.slice(1))).toBeGreaterThanOrEqual(36);
    expect(Math.max(...tileCounts)).toBeLessThanOrEqual(144);
    expect(initialFreeCounts[0]).toBe(3);
    expect(Math.min(...initialFreeCounts.slice(1))).toBeGreaterThanOrEqual(5);
    expect(Math.max(...initialFreeCounts)).toBeLessThanOrEqual(24);
    expect(Math.max(...levels.map((level) => Math.max(...level.tiles.map((tile) => tile.layer))))).toBeGreaterThanOrEqual(5);
  });

  test("caps Cocos opening free tiles by covering them in place", async () => {
    const levelConfigPath = "assets/scripts/config/HulebuLevelConfig.ts";
    const levelConfig = readText(levelConfigPath);
    const moduleUrl = pathToFileURL(path.join(cocosRoot, levelConfigPath)).href;
    const levelModule = await import(moduleUrl) as {
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

    expect(levelConfig).toContain("const blocker = [...freeTiles]");
    expect(levelConfig).toContain("blocker.x = target.x");
    expect(levelConfig).toContain("blocker.y = target.y");
    expect(levelConfig).toContain("const currentMaxLayer = Math.max(...nextTiles.map((tile) => tile.layer))");
    expect(levelConfig).toContain("if (target.layer >= currentMaxLayer)");
    expect(levelConfig).toContain("blocker.layer = Math.min(currentMaxLayer, target.layer + 1)");
    expect(levelConfig).not.toContain("target.layer += 1");
    expect(levelConfig).not.toContain("target.x -= HULEBU_GRAPH_COCOS_LAYER_OFFSET");

    const firstLevel = levelModule.HULEBU_LEVEL_CONFIGS[0];
    const initiallyFreeTiles = firstLevel.tiles.filter((tile) => tile.blockedBy.length === 0);
    expect(initiallyFreeTiles).toHaveLength(3);
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

  test("binds board tiles to v6 Mahjong SpriteFrame resources with fallback", () => {
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
    expect(catalog).toContain("\"ui/v6/tiles/mahjong/dot/tile_dot_09/spriteFrame\"");
    expect(catalog).toContain("\"tile.wan.2\"");
    expect(catalog).toContain("\"ui/v6/tiles/mahjong/wan/tile_wan_02/spriteFrame\"");
    expect(catalog).toContain("\"tile.tiao.8\"");
    expect(catalog).toContain("\"ui/v6/tiles/mahjong/bamboo/tile_bamboo_08/spriteFrame\"");
    expect(catalog).toContain("\"tile.tiao.6\"");
    expect(catalog).toContain("\"ui/v6/tiles/mahjong/bamboo/tile_bamboo_06/spriteFrame\"");
    expect(catalog).toContain("\"tile.honor.1\"");
    expect(catalog).toContain("\"ui/v6/tiles/mahjong/honor/tile_honor_east/spriteFrame\"");
    expect(catalog).toContain("\"tile.honor.7\"");
    expect(catalog).toContain("\"ui/v6/tiles/mahjong/honor/tile_honor_whiteboard/spriteFrame\"");

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
    expect(boardLayerBinder).toContain("safeApplySpriteFrame(artNode, sprite, spriteFrame)");
  });

  test("uses v6 runtime tile UI assets for every Mahjong tile key", () => {
    const catalog = readText("assets/scripts/assets/HulebuTileSpriteCatalog.ts");
    const numberedTiles = [
      ...Array.from({ length: 9 }, (_, index) => ({
        tileKey: `tile.tiao.${index + 1}`,
        target: `assets/resources/ui/v6/tiles/mahjong/bamboo/tile_bamboo_${String(index + 1).padStart(2, "0")}.png`,
      })),
      ...Array.from({ length: 9 }, (_, index) => ({
        tileKey: `tile.tong.${index + 1}`,
        target: `assets/resources/ui/v6/tiles/mahjong/dot/tile_dot_${String(index + 1).padStart(2, "0")}.png`,
      })),
      ...Array.from({ length: 9 }, (_, index) => ({
        tileKey: `tile.wan.${index + 1}`,
        target: `assets/resources/ui/v6/tiles/mahjong/wan/tile_wan_${String(index + 1).padStart(2, "0")}.png`,
      })),
    ];
    const honorTiles = [
      { tileKey: "tile.honor.1", target: "assets/resources/ui/v6/tiles/mahjong/honor/tile_honor_east.png" },
      { tileKey: "tile.honor.2", target: "assets/resources/ui/v6/tiles/mahjong/honor/tile_honor_south.png" },
      { tileKey: "tile.honor.3", target: "assets/resources/ui/v6/tiles/mahjong/honor/tile_honor_west.png" },
      { tileKey: "tile.honor.4", target: "assets/resources/ui/v6/tiles/mahjong/honor/tile_honor_north.png" },
      { tileKey: "tile.honor.5", target: "assets/resources/ui/v6/tiles/mahjong/honor/tile_honor_red.png" },
      { tileKey: "tile.honor.6", target: "assets/resources/ui/v6/tiles/mahjong/honor/tile_honor_green.png" },
      { tileKey: "tile.honor.7", target: "assets/resources/ui/v6/tiles/mahjong/honor/tile_honor_whiteboard.png" },
    ];
    const v6Tiles = [...numberedTiles, ...honorTiles];

    expect(numberedTiles).toHaveLength(27);
    expect(honorTiles).toHaveLength(7);
    expect(new Set(v6Tiles.map((tile) => tile.tileKey)).size).toBe(34);

    for (const tile of v6Tiles) {
      const assetPath = path.join(cocosRoot, tile.target);
      const spriteFramePath = tile.target
        .replace(/^assets\/resources\//, "")
        .replace(/\.png$/, "/spriteFrame");

      expect(fs.existsSync(assetPath), tile.target).toBe(true);
      expect(fs.existsSync(`${assetPath}.meta`), `${tile.target}.meta`).toBe(true);
      expect(readPngInfo(assetPath), tile.target).toMatchObject({
        width: 272,
        height: 384,
        colorType: 6,
      });
      expect(catalog).toContain(`"${tile.tileKey}"`);
      expect(catalog).toContain(`"${spriteFramePath}"`);
    }

    expect(catalog).toContain("\"tile.tong.9\"");
    expect(catalog).toContain("\"ui/v6/tiles/mahjong/dot/tile_dot_09/spriteFrame\"");
    expect(catalog).toContain("\"tile.wan.2\"");
    expect(catalog).toContain("\"ui/v6/tiles/mahjong/wan/tile_wan_02/spriteFrame\"");
    expect(catalog).toContain("\"tile.tiao.6\"");
    expect(catalog).toContain("\"ui/v6/tiles/mahjong/bamboo/tile_bamboo_06/spriteFrame\"");
    expect(catalog).toContain("\"tile.honor.1\"");
    expect(catalog).toContain("\"ui/v6/tiles/mahjong/honor/tile_honor_east/spriteFrame\"");
  });

  test("imports the complete formal v1 resource pack for Cocos runtime", () => {
    const manifest = readJson<{ assets: Array<{ key: string; path: string; width: number; height: number }> }>(
      "assets/resources/ui/formal-v1/manifest.json",
    );
    expect(manifest.assets).toHaveLength(80);
    expect(new Set(manifest.assets.map((asset) => asset.key)).size).toBe(80);

    for (const asset of manifest.assets) {
      const assetPath = path.join(cocosRoot, "assets/resources/ui/formal-v1", asset.path);
      expect(fs.existsSync(assetPath), asset.path).toBe(true);
      expect(readPngInfo(assetPath), asset.path).toMatchObject({
        width: asset.width,
        height: asset.height,
      });
    }

    for (const script of [
      "assets/scripts/GameSceneController.ts",
      "assets/scripts/ComboBarBinder.ts",
      "assets/scripts/HudBinder.ts",
      "assets/scripts/SlotLayerBinder.ts",
    ]) {
      expect(readText(script), script).not.toContain("ui/v6/");
    }
  });

  test("archives v6 non-tile UI resources for Cocos visual pass", () => {
    const uiAssets = [
      { path: "assets/resources/ui/v6/buttons/combo/action_hu_normal.png", width: 173, height: 134 },
      { path: "assets/resources/ui/v6/buttons/combo/action_bugang_normal.png", width: 183, height: 134 },
      { path: "assets/resources/ui/v6/buttons/tools/tool_shuffle.png", width: 222, height: 182 },
      { path: "assets/resources/ui/v6/buttons/tools/tool_undo.png", width: 222, height: 172 },
      { path: "assets/resources/ui/v6/buttons/tools/tool_hint.png", width: 222, height: 177 },
      { path: "assets/resources/ui/v6/slots/hand_slots_8.png", width: 574, height: 138 },
      { path: "assets/resources/ui/v6/slots/discard_slots.png", width: 330, height: 102 },
      { path: "assets/resources/ui/v6/hud/tile_counter_wide.png", width: 736, height: 182 },
      { path: "assets/resources/ui/v6/cards/reward_combo_strength.png", width: 190, height: 213 },
      { path: "assets/resources/ui/v6/cards/reward_score_bonus.png", width: 185, height: 213 },
      { path: "assets/resources/ui/v6/cards/reward_slot_expand.png", width: 186, height: 213 },
      { path: "assets/resources/ui/v6/combo-choice/panel_bg.png", width: 492, height: 96 },
      { path: "assets/resources/ui/v6/panels/buff_drawer_panel.png", width: 314, height: 466 },
    ];
    const sceneBackground = {
      path: "assets/resources/ui/v6/backgrounds/teahouse_table_background.png",
      width: 1024,
      height: 1536,
      colorType: 2,
    };

    for (const asset of uiAssets) {
      const assetPath = path.join(cocosRoot, asset.path);
      expect(fs.existsSync(assetPath), asset.path).toBe(true);
      expect(fs.existsSync(`${assetPath}.meta`), `${asset.path}.meta`).toBe(true);
      expect(readPngInfo(assetPath), asset.path).toMatchObject({
        width: asset.width,
        height: asset.height,
        colorType: 6,
      });
    }

    const sceneBackgroundPath = path.join(cocosRoot, sceneBackground.path);
    expect(fs.existsSync(sceneBackgroundPath), sceneBackground.path).toBe(true);
    expect(fs.existsSync(`${sceneBackgroundPath}.meta`), `${sceneBackground.path}.meta`).toBe(true);
    expect(readPngInfo(sceneBackgroundPath), sceneBackground.path).toMatchObject({
      width: sceneBackground.width,
      height: sceneBackground.height,
      colorType: sceneBackground.colorType,
    });
  });

  test("carries finite river, open melds and supplemental gang state in Cocos runtime", async () => {
    const runtimeStatePath = "assets/scripts/runtime/HulebuRuntimeState.ts";
    const runtimeText = readText(runtimeStatePath);

    expect(runtimeText).toContain("riverLimit");
    expect(runtimeText).toContain("openMelds");
    expect(runtimeText).toContain("discardSlotTile");
    expect(runtimeText).toContain("applySupplementalGang");
    expect(runtimeText).toContain("cleanRiverAfterHu");
    expect(runtimeText).toContain("bugang");

    const runtimeModule = await import(pathToFileURL(path.join(cocosRoot, runtimeStatePath)).href) as {
      HulebuRuntimeState: new (level: unknown) => {
        discardSlotTile: (slotIndex: number) => boolean;
        executeComboByKey: (candidateKey: string | null) => boolean;
        toSceneModel: (layout: { width: number; height: number; cssWidth: number; cssHeight: number; scale: number }) => {
          riverNodes: Array<{ tileId: string | null; occupied: boolean }>;
          openMeldNodes: Array<{ type: string; label: string; count: number }>;
          comboControls: Array<{ combo: string; candidateKey: string | null; interactable: boolean }>;
        };
      };
    };

    const level = {
      id: "river-meld-test",
      order: 1,
      name: "test",
      subtitle: "test",
      rewardPool: [],
      defaults: {
        slotLimit: 8,
        reserveLimit: 1,
        shields: 0,
        firstProtect: false,
        tools: { shuffle: 0, undo: 0, discard: 1, vision: 0 },
      },
      initialSlotOrder: ["slot-a", "slot-b", "slot-c", "slot-d"],
      initialReserveOrder: [],
      tiles: [
        { id: "slot-a", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "slot-b", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "slot-c", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "slot-d", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "board-a", suit: "tiao", rank: 2, x: 310, y: 180, layer: 0, blockedBy: [], location: "board" },
      ],
    };
    const runtimeState = new runtimeModule.HulebuRuntimeState(level);
    const layout = { width: 390, height: 844, cssWidth: 390, cssHeight: 844, scale: 1 };

    expect(runtimeState.discardSlotTile(3)).toBe(true);
    let sceneModel = runtimeState.toSceneModel(layout);
    expect(sceneModel.riverNodes.map((node) => node.tileId)).toEqual(["slot-d", null, null]);

    const peng = sceneModel.comboControls.find((control) => control.combo === "peng");
    expect(peng?.interactable).toBe(true);
    expect(runtimeState.executeComboByKey(peng?.candidateKey ?? null)).toBe(true);
    sceneModel = runtimeState.toSceneModel(layout);
    expect(sceneModel.openMeldNodes).toEqual([
      expect.objectContaining({ type: "peng", label: "1万", count: 3 }),
    ]);
    expect(sceneModel.comboControls.some((control) => control.combo === "bugang")).toBe(true);
  });

  test("shakes loose blocker tiles after kong and keeps full-slot river rescue available", async () => {
    const runtimeStatePath = "assets/scripts/runtime/HulebuRuntimeState.ts";
    const runtimeText = readText(runtimeStatePath);

    expect(runtimeText).toContain("KONG_SHAKE_LOOSE_COUNT");
    expect(runtimeText).toContain("HU_SHAKE_LOOSE_COUNT");
    expect(runtimeText).toContain("openMountainByAction");
    expect(runtimeText).toContain("shakeLooseMountainTile");
    expect(runtimeText).toContain("可打牌入河");

    const runtimeModule = await import(pathToFileURL(path.join(cocosRoot, runtimeStatePath)).href) as {
      HulebuRuntimeState: new (level: unknown) => {
        executeComboByKey: (candidateKey: string | null) => boolean;
        toSceneModel: (layout: { width: number; height: number; cssWidth: number; cssHeight: number; scale: number }) => {
          boardNodes: Array<{ tileId: string; interactable: boolean; dimmed: boolean; position: { x: number; y: number } }>;
          comboControls: Array<{ combo: string; candidateKey: string | null; interactable: boolean }>;
          hud: { slotStatusText: string };
        };
      };
    };
    const layout = { width: 390, height: 844, cssWidth: 390, cssHeight: 844, scale: 1 };
    const gangLevel = {
      id: "shake-loose-test",
      order: 1,
      name: "test",
      subtitle: "test",
      rewardPool: [],
      defaults: {
        slotLimit: 8,
        reserveLimit: 1,
        shields: 0,
        firstProtect: false,
        tools: { shuffle: 0, undo: 0, discard: 1, vision: 0 },
      },
      initialSlotOrder: ["gang-a", "gang-b", "gang-c", "gang-d"],
      initialReserveOrder: [],
      tiles: [
        { id: "gang-a", suit: "tong", rank: 7, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "gang-b", suit: "tong", rank: 7, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "gang-c", suit: "tong", rank: 7, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "gang-d", suit: "tong", rank: 7, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "lower-a", suit: "wan", rank: 1, x: 10, y: 10, layer: 0, blockedBy: ["top-a"], location: "board" },
        { id: "lower-b", suit: "wan", rank: 2, x: 20, y: 20, layer: 0, blockedBy: ["top-b"], location: "board" },
        { id: "top-a", suit: "wan", rank: 3, x: 10, y: 10, layer: 1, blockedBy: [], location: "board" },
        { id: "top-b", suit: "wan", rank: 4, x: 20, y: 20, layer: 1, blockedBy: [], location: "board" },
      ],
    };
    const gangState = new runtimeModule.HulebuRuntimeState(gangLevel);
    let sceneModel = gangState.toSceneModel(layout);
    expect(sceneModel.boardNodes.find((node) => node.tileId === "lower-a")?.interactable).toBe(false);
    const gang = sceneModel.comboControls.find((control) => control.combo === "gang");

    expect(gang?.interactable).toBe(true);
    expect(gangState.executeComboByKey(gang?.candidateKey ?? null)).toBe(true);
    sceneModel = gangState.toSceneModel(layout);
    expect(sceneModel.boardNodes.find((node) => node.tileId === "lower-a")?.interactable).toBe(true);
    expect(sceneModel.boardNodes.find((node) => node.tileId === "lower-b")?.interactable).toBe(true);
    expect(sceneModel.boardNodes.find((node) => node.tileId === "top-a")?.interactable).toBe(true);
    expect(sceneModel.boardNodes.find((node) => node.tileId === "top-a")?.position.y).toBeGreaterThan(0);

    const fullSlotLevel = {
      ...gangLevel,
      id: "full-slot-rescue-test",
      initialSlotOrder: ["a", "b", "c", "d", "e", "f", "g", "h"],
      tiles: [
        { id: "a", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "b", suit: "wan", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "c", suit: "wan", rank: 4, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "d", suit: "wan", rank: 6, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "e", suit: "tong", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "f", suit: "tong", rank: 3, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "g", suit: "tiao", rank: 5, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "h", suit: "honor", rank: 7, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "board-a", suit: "wan", rank: 9, x: 310, y: 180, layer: 0, blockedBy: [], location: "board" },
      ],
    };
    const fullSlotState = new runtimeModule.HulebuRuntimeState(fullSlotLevel);
    expect(fullSlotState.toSceneModel(layout).hud.slotStatusText).toContain("打牌入河");
  });

  test("supports Cocos shuffle and undo tool interactions", async () => {
    const runtimeStatePath = "assets/scripts/runtime/HulebuRuntimeState.ts";
    const runtimeText = readText(runtimeStatePath);

    expect(runtimeText).toContain("useShuffleTool");
    expect(runtimeText).toContain("useUndoTool");
    expect(runtimeText).toContain("pushHistory");
    expect(runtimeText).toContain("restoreSnapshot");

    const runtimeModule = await import(pathToFileURL(path.join(cocosRoot, runtimeStatePath)).href) as {
      HulebuRuntimeState: new (level: unknown) => {
        useShuffleTool: () => boolean;
        useUndoTool: () => boolean;
        moveTileToSlot: (tileId: string) => boolean;
        toSceneModel: (layout: { width: number; height: number; cssWidth: number; cssHeight: number; scale: number }) => {
          boardNodes: Array<{ tileId: string; label: string }>;
          slotNodes: Array<{ tileId: string | null }>;
          hud: { toolText: string };
        };
      };
    };
    const level = {
      id: "shuffle-undo-test",
      order: 1,
      name: "test",
      subtitle: "test",
      rewardPool: [],
      defaults: {
        slotLimit: 8,
        reserveLimit: 1,
        shields: 0,
        firstProtect: false,
        tools: { shuffle: 1, undo: 1, discard: 1, vision: 0 },
      },
      initialSlotOrder: [],
      initialReserveOrder: [],
      tiles: [
        { id: "board-a", suit: "wan", rank: 1, x: 300, y: 180, layer: 0, blockedBy: [], location: "board" },
        { id: "board-b", suit: "tiao", rank: 2, x: 320, y: 180, layer: 0, blockedBy: [], location: "board" },
        { id: "board-c", suit: "tong", rank: 3, x: 340, y: 180, layer: 0, blockedBy: [], location: "board" },
      ],
    };
    const state = new runtimeModule.HulebuRuntimeState(level);
    const layout = { width: 390, height: 844, cssWidth: 390, cssHeight: 844, scale: 1 };
    const labelsBeforeShuffle = state.toSceneModel(layout).boardNodes.map((node) => `${node.tileId}:${node.label}`);

    expect(state.useShuffleTool()).toBe(true);
    const shuffled = state.toSceneModel(layout);
    expect(shuffled.hud.toolText).toContain("洗 0");
    expect(shuffled.boardNodes.map((node) => `${node.tileId}:${node.label}`)).not.toEqual(labelsBeforeShuffle);

    expect(state.useUndoTool()).toBe(true);
    const undone = state.toSceneModel(layout);
    expect(undone.hud.toolText).toContain("撤 0");
    expect(undone.boardNodes.map((node) => `${node.tileId}:${node.label}`)).toEqual(labelsBeforeShuffle);

    expect(state.moveTileToSlot("board-a")).toBe(true);
    expect(state.useUndoTool()).toBe(false);
  });

  test("carries Boss goals into Cocos runtime HUD and clear gating", async () => {
    const levelConfigPath = "assets/scripts/config/HulebuLevelConfig.ts";
    const runtimeStatePath = "assets/scripts/runtime/HulebuRuntimeState.ts";
    const hudBinder = readText("assets/scripts/HudBinder.ts");
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");
    const levelConfig = readText(levelConfigPath);
    const runtimeText = readText(runtimeStatePath);

    expect(levelConfig).toContain("HulebuBossGoalConfig");
    expect(levelConfig).toContain("HulebuBossVariantConfig");
    expect(levelConfig).toContain("HULEBU_BOSS_VARIANTS");
    expect(levelConfig).toContain("createHulebuRuntimeLevelForRun");
    expect(levelConfig).toContain("getHulebuBossVariantForRun");
    expect(levelConfig).toContain("bossGoals");
    expect(levelConfig).toContain("combo_count");
    expect(levelConfig).toContain("suit_set");
    expect(levelConfig).toContain("score_target");
    expect(levelConfig).toContain("new Set([10, 20])");
    expect(levelConfig).toContain("mvp_010_final_mix");
    expect(levelConfig).toContain("mvp_020_boss_hulebu");
    expect(levelConfig).toContain("combo: \"hu\"");
    expect(levelConfig).toContain("suits: [\"wan\", \"tong\", \"tiao\", \"honor\"]");
    expect(levelConfig).toContain("target: 180");

    expect(runtimeText).toContain("comboCounts");
    expect(runtimeText).toContain("suitComboCounts");
    expect(runtimeText).toContain("recordBossProgress");
    expect(runtimeText).toContain("isBossGoalComplete");
    expect(runtimeText).toContain("getBossHudText");
    expect(runtimeText).toContain("this.level.bossVariant?.name");
    expect(runtimeText).toContain("Boss目标未完成");
    expect(runtimeText).toContain("bossText: this.getBossHudText()");
    expect(runtimeText).toContain("isLevelCleared()");
    expect(hudBinder).toContain("hud.bossText");
    expect(gameSceneController).toContain('event.type === "level.cleared"');

    const levelModule = await import(pathToFileURL(path.join(cocosRoot, levelConfigPath)).href) as {
      HULEBU_LEVEL_CONFIGS: Array<{
        order: number;
        bossVariant?: { id: string; name: string };
        bossGoals: Array<{ type: string; combo?: string; suits?: string[]; target?: number; eachTarget?: number }>;
      }>;
      HULEBU_MAINLINE_RUN_PROFILE: unknown;
      HULEBU_ENDLESS_RUN_PROFILE: unknown;
      createHulebuDailyRunProfile: (dailySeed: string) => unknown;
      createHulebuAdvancedRunProfile: (tier: string) => unknown;
      HULEBU_BOSS_VARIANTS: Record<string, { id: string; name: string; extraGoals: unknown[] }>;
      getHulebuBossVariantForRun: (profile: unknown, displayOrder: number) => { id: string; name: string } | null;
      createHulebuRuntimeLevelForRun: (
        levelIndex: number,
        profile?: unknown,
        displayOrder?: number,
      ) => {
        bossVariant?: { id: string; name: string };
        bossGoals: Array<{ type: string; combo?: string; target?: number }>;
      };
    };
    const runtimeModule = await import(pathToFileURL(path.join(cocosRoot, runtimeStatePath)).href) as {
      HulebuRuntimeState: new (level: unknown) => {
        executeComboByKey: (candidateKey: string | null) => boolean;
        isBoardCleared: () => boolean;
        isLevelCleared: () => boolean;
        toSceneModel: (layout: { width: number; height: number; cssWidth: number; cssHeight: number; scale: number }) => {
          comboControls: Array<{ combo: string; candidateKey: string | null; interactable: boolean }>;
          hud: { bossText?: string; slotStatusText: string; toolText: string };
        };
      };
    };

    const boss10 = levelModule.HULEBU_LEVEL_CONFIGS.find((level) => level.order === 10);
    const boss20 = levelModule.HULEBU_LEVEL_CONFIGS.find((level) => level.order === 20);
    expect(boss10?.bossGoals).toEqual([
      expect.objectContaining({ type: "combo_count", combo: "chi", target: 1 }),
      expect.objectContaining({ type: "combo_count", combo: "peng", target: 1 }),
      expect.objectContaining({ type: "combo_count", combo: "gang", target: 1 }),
      expect.objectContaining({ type: "suit_set", suits: ["wan", "tiao", "tong"], eachTarget: 1 }),
      expect.objectContaining({ type: "score_target", target: 80 }),
    ]);
    expect(boss20?.bossGoals).toEqual([
      expect.objectContaining({ type: "combo_count", combo: "chi", target: 1 }),
      expect.objectContaining({ type: "combo_count", combo: "peng", target: 2 }),
      expect.objectContaining({ type: "combo_count", combo: "gang", target: 1 }),
      expect.objectContaining({ type: "combo_count", combo: "hu", target: 1 }),
      expect.objectContaining({ type: "suit_set", suits: ["wan", "tong", "tiao", "honor"], eachTarget: 1 }),
      expect.objectContaining({ type: "score_target", target: 180 }),
    ]);
    expect(levelModule.HULEBU_BOSS_VARIANTS.advanced_variant.name).toBe("高阶 Boss 变体");
    expect(levelModule.getHulebuBossVariantForRun(levelModule.HULEBU_MAINLINE_RUN_PROFILE, 10)).toMatchObject({
      id: "main_trial",
      name: "中段试炼",
    });
    expect(levelModule.getHulebuBossVariantForRun(levelModule.HULEBU_MAINLINE_RUN_PROFILE, 20)).toMatchObject({
      id: "final_king",
      name: "胡了卜王",
    });
    expect(levelModule.getHulebuBossVariantForRun(levelModule.HULEBU_ENDLESS_RUN_PROFILE, 25)).toMatchObject({
      id: "endless_chapter",
      name: "章节 Boss",
    });
    expect(levelModule.getHulebuBossVariantForRun(levelModule.createHulebuDailyRunProfile("2026-06-29"), 10)).toMatchObject({
      id: "daily_mutator",
      name: "今日 Boss 变体",
    });
    expect(levelModule.getHulebuBossVariantForRun(levelModule.createHulebuAdvancedRunProfile("north"), 40)).toMatchObject({
      id: "advanced_variant",
      name: "高阶 Boss 变体",
    });
    expect(levelModule.createHulebuRuntimeLevelForRun(9, levelModule.HULEBU_MAINLINE_RUN_PROFILE, 10).bossVariant).toMatchObject({
      id: "main_trial",
    });
    expect(levelModule.createHulebuRuntimeLevelForRun(9, levelModule.createHulebuAdvancedRunProfile("north"), 40).bossGoals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "combo_count", combo: "hu", target: 1 }),
      ]),
    );
    expect(levelModule.createHulebuRuntimeLevelForRun(9, levelModule.HULEBU_ENDLESS_RUN_PROFILE, 25).bossGoals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "score_target", target: 160 }),
      ]),
    );
    expect(levelModule.createHulebuRuntimeLevelForRun(9, levelModule.createHulebuDailyRunProfile("2026-06-29"), 10).bossGoals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "combo_count", combo: "peng", target: 1 }),
      ]),
    );

    const layout = { width: 390, height: 844, cssWidth: 390, cssHeight: 844, scale: 1 };
    const bossLevel = {
      id: "boss-progress-test",
      order: 10,
      name: "test",
      subtitle: "boss",
      bossVariant: { id: "endless_chapter", name: "章节 Boss", subtitle: "test", extraGoals: [] },
      rewardPool: [],
      bossGoals: [
        { type: "combo_count", combo: "gang", target: 1 },
        { type: "score_target", target: 50 },
      ],
      defaults: {
        slotLimit: 8,
        reserveLimit: 1,
        shields: 0,
        firstProtect: false,
        tools: { shuffle: 0, undo: 0, discard: 0, vision: 0 },
      },
      initialSlotOrder: ["gang-a", "gang-b", "gang-c", "gang-d"],
      initialReserveOrder: [],
      tiles: [
        { id: "gang-a", suit: "tong", rank: 6, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "gang-b", suit: "tong", rank: 6, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "gang-c", suit: "tong", rank: 6, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "gang-d", suit: "tong", rank: 6, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      ],
    };
    const bossState = new runtimeModule.HulebuRuntimeState(bossLevel);
    let sceneModel = bossState.toSceneModel(layout);
    expect(sceneModel.hud.bossText).toContain("章节 Boss 0/2");
    expect(sceneModel.hud.bossText).toContain("杠 0/1");
    expect(bossState.isBoardCleared()).toBe(true);
    expect(bossState.isLevelCleared()).toBe(false);
    expect(sceneModel.hud.slotStatusText).toContain("Boss目标未完成");

    const gang = sceneModel.comboControls.find((control) => control.combo === "gang");
    expect(gang?.interactable).toBe(true);
    expect(bossState.executeComboByKey(gang?.candidateKey ?? null)).toBe(true);
    sceneModel = bossState.toSceneModel(layout);
    expect(sceneModel.hud.bossText).toContain("章节 Boss 2/2");
    expect(sceneModel.hud.bossText).toContain("杠 1/1");
    expect(sceneModel.hud.bossText).toContain("分 50/50");
    expect(bossState.isLevelCleared()).toBe(true);

    const noGoalState = new runtimeModule.HulebuRuntimeState({ ...bossLevel, id: "no-goal-clear-test", bossGoals: [] });
    expect(noGoalState.isLevelCleared()).toBe(true);
  });

  test("applies Cocos reward choices to the next runtime level", async () => {
    const runtimeStatePath = "assets/scripts/runtime/HulebuRuntimeState.ts";
    const bootstrapPath = "assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts";
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");
    const runtimeText = readText(runtimeStatePath);
    const bootstrapText = readText(bootstrapPath);

    expect(runtimeText).toContain("export interface HulebuRunRewardState");
    expect(runtimeText).toContain("createHulebuRunRewardState");
    expect(runtimeText).toContain("applyHulebuRewardToRunState");
    expect(runtimeText).toContain("reserve_plus_1");
    expect(runtimeText).toContain("gang_score_plus_25");
    expect(runtimeText).toContain("coin_plus_20");
    expect(runtimeText).toContain("getReserveLimit()");
    expect(runtimeText).toContain("createEffectiveTools()");
    expect(runtimeText).toContain("奖 ${this.runRewards.pickedRewards.length}");
    expect(bootstrapText).toContain("runRewards?: HulebuRunRewardState");
    expect(bootstrapText).toContain("new HulebuRuntimeState(");
    expect(bootstrapText).toContain("createHulebuRuntimeLevelForRun(levelIndex, runProfile, displayOrder)");
    expect(bootstrapText).toContain("levelModifiers,");
    expect(gameSceneController).toContain("private runRewards: HulebuRunRewardState = createHulebuRunRewardState()");
    expect(gameSceneController).toContain("this.runRewards = applyHulebuRewardToRunState(this.runRewards, rewardId)");
    expect(gameSceneController).toContain("this.runRewards,");
    expect(gameSceneController).toContain("private restartRun()");

    type RunRewardState = {
      reserveBonus: number;
      shieldBonus: number;
      startingCoins: number;
      toolBonus: { shuffle: number; undo: number; discard: number; vision: number };
      scoreBonus: { gang: number; bugang: number; chi: number; peng: number; hu: number };
      pickedRewards: string[];
    };
    const runtimeModule = await import(pathToFileURL(path.join(cocosRoot, runtimeStatePath)).href) as {
      createHulebuRunRewardState: () => RunRewardState;
      applyHulebuRewardToRunState: (state: RunRewardState, rewardId: string) => RunRewardState;
      HulebuRuntimeState: new (level: unknown, rewards?: unknown) => {
        executeComboByKey: (candidateKey: string | null) => boolean;
        toSceneModel: (layout: { width: number; height: number; cssWidth: number; cssHeight: number; scale: number }) => {
          reserveNodes: Array<{ index: number }>;
          comboControls: Array<{ combo: string; candidateKey: string | null; interactable: boolean }>;
          hud: { coinsText: string; toolText: string; scoreText: string };
        };
      };
    };
    const layout = { width: 390, height: 844, cssWidth: 390, cssHeight: 844, scale: 1 };
    const rewardState = [
      "reserve_plus_1",
      "undo_plus_1",
      "shuffle_plus_1",
      "vision_plus_1",
      "coin_plus_20",
      "gang_score_plus_25",
      "shield_plus_1",
      "first_protect_shield",
    ].reduce((state, rewardId) => runtimeModule.applyHulebuRewardToRunState(state, rewardId), runtimeModule.createHulebuRunRewardState());
    const level = {
      id: "reward-effects-test",
      order: 4,
      name: "test",
      subtitle: "reward",
      rewardPool: [],
      bossGoals: [],
      defaults: {
        slotLimit: 8,
        reserveLimit: 1,
        shields: 0,
        firstProtect: false,
        tools: { shuffle: 1, undo: 1, discard: 1, vision: 0 },
      },
      initialSlotOrder: ["gang-a", "gang-b", "gang-c", "gang-d"],
      initialReserveOrder: [],
      tiles: [
        { id: "gang-a", suit: "wan", rank: 8, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "gang-b", suit: "wan", rank: 8, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "gang-c", suit: "wan", rank: 8, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "gang-d", suit: "wan", rank: 8, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "board-a", suit: "tong", rank: 1, x: 310, y: 180, layer: 0, blockedBy: [], location: "board" },
      ],
    };
    const state = new runtimeModule.HulebuRuntimeState(level, rewardState);
    let sceneModel = state.toSceneModel(layout);
    expect(sceneModel.reserveNodes).toHaveLength(2);
    expect(sceneModel.hud.coinsText).toContain("铜钱 20");
    expect(sceneModel.hud.coinsText).toContain("护 2");
    expect(sceneModel.hud.toolText).toContain("洗 2");
    expect(sceneModel.hud.toolText).toContain("撤 2");
    expect(sceneModel.hud.toolText).toContain("奖 8");

    const gang = sceneModel.comboControls.find((control) => control.combo === "gang");
    expect(gang?.interactable).toBe(true);
    expect(state.executeComboByKey(gang?.candidateKey ?? null)).toBe(true);
    sceneModel = state.toSceneModel(layout);
    expect(sceneModel.hud.scoreText).toContain("分 75");
    expect(sceneModel.hud.coinsText).toContain("铜钱 26");
  });

  test("supports Cocos combo candidate choice overlay before resolving multi-option combos", async () => {
    const runtimeStatePath = "assets/scripts/runtime/HulebuRuntimeState.ts";
    const gameSceneController = readText("assets/scripts/GameSceneController.ts");
    const runtimeText = readText(runtimeStatePath);

    expect(runtimeText).toContain("export interface HulebuRuntimeComboCandidateOption");
    expect(runtimeText).toContain("getComboCandidateOptions(combo: HulebuComboType)");
    expect(gameSceneController).toContain("pendingComboChoice");
    expect(gameSceneController).toContain("showComboChoiceOverlay");
    expect(gameSceneController).toContain("drawComboChoiceOptions");
    expect(gameSceneController).toContain("executeComboCandidateOption");
    expect(gameSceneController).toContain('dispatch({ type: "combo.execute", combo })');
    expect(gameSceneController).toContain('dispatch({ type: "combo.choose", candidateId: option.key })');
    expect(gameSceneController).toContain("ComboChoice_Back");
    expect(gameSceneController).toContain("ComboChoiceTileArt");

    const runtimeModule = await import(pathToFileURL(path.join(cocosRoot, runtimeStatePath)).href) as {
      HulebuRuntimeState: new (level: unknown) => {
        getComboCandidateOptions: (combo: string) => Array<{ key: string; labels: string[]; prefabKeys: string[] }>;
        executeComboByKey: (candidateKey: string | null) => boolean;
        toSceneModel: (layout: { width: number; height: number; cssWidth: number; cssHeight: number; scale: number }) => {
          slotNodes: Array<{ tileId: string | null; label: string | null }>;
          comboControls: Array<{ combo: string; badgeText: string; candidateKey: string | null; interactable: boolean }>;
        };
      };
    };
    const level = {
      id: "combo-choice-options-test",
      order: 1,
      name: "test",
      subtitle: "combo choice",
      rewardPool: [],
      bossGoals: [],
      defaults: {
        slotLimit: 8,
        reserveLimit: 1,
        shields: 0,
        firstProtect: false,
        tools: { shuffle: 0, undo: 0, discard: 0, vision: 0 },
      },
      initialSlotOrder: ["wan-1", "wan-2", "wan-3", "wan-4"],
      initialReserveOrder: [],
      tiles: [
        { id: "wan-1", suit: "wan", rank: 1, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "wan-2", suit: "wan", rank: 2, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "wan-3", suit: "wan", rank: 3, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
        { id: "wan-4", suit: "wan", rank: 4, x: 0, y: 0, layer: 0, blockedBy: [], location: "slot" },
      ],
    };
    const state = new runtimeModule.HulebuRuntimeState(level);
    const layout = { width: 390, height: 844, cssWidth: 390, cssHeight: 844, scale: 1 };
    const chiOptions = state.getComboCandidateOptions("chi");

    expect(chiOptions).toHaveLength(2);
    expect(chiOptions.map((option) => option.labels.join(","))).toEqual(["1万,2万,3万", "2万,3万,4万"]);
    expect(chiOptions.every((option) => option.prefabKeys.length === 3)).toBe(true);
    expect(state.toSceneModel(layout).comboControls.find((control) => control.combo === "chi")).toMatchObject({
      interactable: true,
      badgeText: "2",
      candidateKey: chiOptions[0].key,
    });

    expect(state.executeComboByKey(chiOptions[1].key)).toBe(true);
    expect(state.toSceneModel(layout).slotNodes.map((node) => node.label).filter(Boolean)).toEqual(["1万"]);
  });
});
