import { _decorator, Camera, Canvas, Color, Component, Graphics, Label, Layers, Node, UITransform, Vec3 } from "cc";
import { BoardLayerBinder } from "./BoardLayerBinder";
import { ComboBarBinder } from "./ComboBarBinder";
import { HudBinder } from "./HudBinder";
import { SlotLayerBinder } from "./SlotLayerBinder";
import {
  centerLayoutX,
  centerLayoutY,
  createHulebuSampleSceneModelForLayout,
  resolveHulebuRuntimeLayout,
  scaleLayoutValue,
} from "./bootstrap/HulebuSampleSceneModel";
import type { HulebuLayoutSize } from "./bootstrap/HulebuSampleSceneModel";
import type {
  HulebuBoardNodeModel,
  HulebuCellNodeModel,
  HulebuCocosSceneModel,
  HulebuComboControlModel,
  HulebuComboType,
} from "./contracts/HulebuSceneModel";

const { ccclass, property } = _decorator;
type RuntimeLayout = Required<HulebuLayoutSize>;

const RUNTIME_CAMERA_NAME = "RuntimeCamera";
const SHELL_ROOT_NAME = "VisualShellRoot";
const CAMERA_Z = 1000;
const TABLE_FELT_FILL = new Color(33, 88, 69, 255);
const TABLE_FELT_SHADOW = new Color(16, 49, 41, 255);
const TABLE_RIM_FILL = new Color(92, 57, 36, 255);
const PLAQUE_FILL = new Color(248, 229, 191, 255);
const PLAQUE_STROKE = new Color(176, 126, 67, 255);
const PLAQUE_TEXT = new Color(70, 42, 24, 255);
const JADE_FILL = new Color(42, 134, 103, 255);
const WOOD_FILL = new Color(99, 59, 35, 255);
const WOOD_STROKE = new Color(177, 116, 65, 255);
const TOOL_FILL = new Color(49, 116, 87, 255);
const HULEBU_TILE_WIDTH = 52;
const HULEBU_TILE_HEIGHT = 70;
const HULEBU_UNLOCK_OVERLAP_THRESHOLD = 0.05;

@ccclass("GameSceneController")
export class GameSceneController extends Component {
  @property(BoardLayerBinder)
  boardLayer: BoardLayerBinder | null = null;

  @property(SlotLayerBinder)
  slotLayer: SlotLayerBinder | null = null;

  @property(ComboBarBinder)
  comboBar: ComboBarBinder | null = null;

  @property(HudBinder)
  hud: HudBinder | null = null;

  @property(Node)
  rewardOverlay: Node | null = null;

  @property
  autoLoadSampleScene = true;

  private latestSceneModel: HulebuCocosSceneModel | null = null;
  private readonly selectedSlots: HulebuBoardNodeModel[] = [];
  private score = 0;

  start(): void {
    const visibleSize = this.ensureCanvasHost();
    this.ensureVisualShell(visibleSize);
    this.ensureLayerReferences();
    this.rewardOverlay?.setPosition(0, 0, 0);
    if (this.rewardOverlay) {
      this.rewardOverlay.active = false;
    }

    if (this.latestSceneModel) {
      this.applySceneModel(this.latestSceneModel);
      return;
    }

    if (this.autoLoadSampleScene) {
      this.applySceneModel(createHulebuSampleSceneModelForLayout(visibleSize));
    }
  }

  applySceneModel(sceneModel: HulebuCocosSceneModel): void {
    this.ensureLayerReferences();
    this.bindInputHandlers();
    this.latestSceneModel = sceneModel;
    this.boardLayer?.applyBoardNodes(sceneModel.boardNodes);
    this.slotLayer?.applySlotNodes(sceneModel.slotNodes, sceneModel.reserveNodes);
    this.comboBar?.applyComboControls(sceneModel.comboControls);
    this.hud?.applyHud(sceneModel.hud);
  }

  selectTile(tileId: string): void {
    this.handleTileClick(tileId);
    console.log(`[Hulebu] select tile: ${tileId}`);
  }

  executeCombo(candidateKey: string | null): void {
    if (!candidateKey) {
      return;
    }

    const combo = candidateKey.split(":")[0] as HulebuComboType;
    this.handleComboClick(combo);
    console.log(`[Hulebu] execute combo: ${candidateKey}`);
  }

  pickReward(rewardId: string): void {
    console.log(`[Hulebu] pick reward: ${rewardId}`);
  }

  private ensureLayerReferences(): void {
    this.boardLayer = this.boardLayer ?? this.findComponent("BoardRoot", BoardLayerBinder);
    this.slotLayer = this.slotLayer ?? this.findComponent("SlotRoot", SlotLayerBinder);
    this.comboBar = this.comboBar ?? this.findComponent("ComboRoot", ComboBarBinder);
    this.hud = this.hud ?? this.findComponent("HudRoot", HudBinder);
    this.rewardOverlay = this.rewardOverlay ?? this.node.getChildByName("RewardOverlay");
  }

  private bindInputHandlers(): void {
    this.boardLayer?.setTileClickHandler((tileId) => this.handleTileClick(tileId));
    this.comboBar?.setComboClickHandler((combo) => this.handleComboClick(combo));
  }

  private handleTileClick(tileId: string): void {
    const sceneModel = this.latestSceneModel;
    if (!sceneModel || this.selectedSlots.length >= 8) {
      return;
    }

    const tile = sceneModel.boardNodes.find((item) => item.tileId === tileId);
    if (!tile?.interactable) {
      return;
    }

    this.selectedSlots.push(tile);
    sceneModel.boardNodes = sceneModel.boardNodes.filter((item) => item.tileId !== tileId);
    this.refreshPlayableScene();
  }

  private handleComboClick(combo: HulebuComboType): void {
    const selectedIndexes = this.findComboCandidate(combo);
    if (!selectedIndexes) {
      return;
    }

    this.removeSelectedSlots(selectedIndexes);
    this.score += this.getComboScore(combo);
    this.refreshPlayableScene();
  }

  private refreshPlayableScene(): void {
    const sceneModel = this.latestSceneModel;
    if (!sceneModel) {
      return;
    }

    this.refreshBoardInteractivity(sceneModel.boardNodes);
    sceneModel.slotNodes = this.createSlotModels();
    sceneModel.comboControls = this.createComboControls();
    sceneModel.hud = {
      boardRemainingText: `余牌 ${sceneModel.boardNodes.length}`,
      slotStatusText: this.getSlotStatusText(sceneModel),
      scoreText: `分 ${this.score}`,
      coinsText: sceneModel.hud.coinsText,
      toolText: sceneModel.hud.toolText,
    };
    this.applySceneModel(sceneModel);
  }

  private createSlotModels(): HulebuCellNodeModel[] {
    return Array.from({ length: 8 }, (_, index) => {
      const tile = this.selectedSlots[index] ?? null;
      return {
        name: `Slot_${index}`,
        index,
        tileId: tile?.tileId ?? null,
        label: tile?.label ?? null,
        occupied: Boolean(tile),
        prefabKey: tile?.prefabKey ?? null,
      };
    });
  }

  private createComboControls(): HulebuComboControlModel[] {
    const combos: HulebuComboType[] = ["hu", "gang", "peng", "chi"];
    return combos.map((combo) => {
      const candidate = this.findComboCandidate(combo);
      return {
        name: `Combo_${combo[0].toUpperCase()}${combo.slice(1)}`,
        combo,
        interactable: Boolean(candidate),
        badgeText: candidate ? "1" : "0",
        candidateKey: candidate ? `${combo}:${candidate.join(",")}` : null,
      };
    });
  }

  private getSlotStatusText(sceneModel: HulebuCocosSceneModel): string {
    if (sceneModel.boardNodes.length === 0) {
      return "牌山已清空";
    }

    if (this.selectedSlots.length >= 8) {
      return this.createComboControls().some((control) => control.interactable) ? "可发动组合" : "槽位已满";
    }

    return `槽位 ${this.selectedSlots.length}/8`;
  }

  private findComboCandidate(combo: HulebuComboType): number[] | null {
    if (combo === "hu") {
      return this.findHuCandidate();
    }

    if (combo === "peng" || combo === "gang") {
      const requiredCount = combo === "gang" ? 4 : 3;
      const groups = this.groupSlotIndexesByLabel();
      for (const indexes of groups.values()) {
        if (indexes.length >= requiredCount) {
          return indexes.slice(0, requiredCount);
        }
      }
      return null;
    }

    return this.findChiCandidate();
  }

  private findHuCandidate(): number[] | null {
    if (this.selectedSlots.length !== 8) {
      return null;
    }

    return this.canHuLabels(this.selectedSlots.map((slot) => slot.label)) ? this.selectedSlots.map((_, index) => index) : null;
  }

  private findChiCandidate(): number[] | null {
    const numberedTiles = this.selectedSlots
      .map((tile, index) => ({ ...this.parseNumberedLabel(tile.label), index }))
      .filter((tile): tile is { suit: string; rank: number; index: number } => Boolean(tile.suit));

    for (const suit of ["万", "筒", "条"]) {
      for (let rank = 1; rank <= 7; rank += 1) {
        const first = numberedTiles.find((tile) => tile.suit === suit && tile.rank === rank);
        const second = numberedTiles.find((tile) => tile.suit === suit && tile.rank === rank + 1);
        const third = numberedTiles.find((tile) => tile.suit === suit && tile.rank === rank + 2);
        if (first && second && third) {
          return [first.index, second.index, third.index];
        }
      }
    }

    return null;
  }

  private removeSelectedSlots(indexes: number[]): void {
    [...indexes].sort((a, b) => b - a).forEach((index) => {
      this.selectedSlots.splice(index, 1);
    });
  }

  private groupSlotIndexesByLabel(): Map<string, number[]> {
    const groups = new Map<string, number[]>();
    this.selectedSlots.forEach((tile, index) => {
      const indexes = groups.get(tile.label) ?? [];
      indexes.push(index);
      groups.set(tile.label, indexes);
    });
    return groups;
  }

  private canHuLabels(labels: string[]): boolean {
    const counts = new Map<string, number>();
    labels.forEach((label) => counts.set(label, (counts.get(label) ?? 0) + 1));

    for (const [label, count] of counts) {
      if (count < 2) {
        continue;
      }

      const nextCounts = new Map(counts);
      nextCounts.set(label, count - 2);
      if (this.canMakeMelds(nextCounts, 2)) {
        return true;
      }
    }

    return false;
  }

  private canMakeMelds(counts: Map<string, number>, meldsRemaining: number): boolean {
    if (meldsRemaining === 0) {
      return [...counts.values()].every((count) => count === 0);
    }

    const label = [...counts.keys()].find((key) => (counts.get(key) ?? 0) > 0);
    if (!label) {
      return false;
    }

    const count = counts.get(label) ?? 0;
    if (count >= 3) {
      const nextCounts = new Map(counts);
      nextCounts.set(label, count - 3);
      if (this.canMakeMelds(nextCounts, meldsRemaining - 1)) {
        return true;
      }
    }

    const numbered = this.parseNumberedLabel(label);
    if (numbered.suit && numbered.rank <= 7) {
      const next = `${numbered.rank + 1}${numbered.suit}`;
      const third = `${numbered.rank + 2}${numbered.suit}`;
      if ((counts.get(next) ?? 0) > 0 && (counts.get(third) ?? 0) > 0) {
        const nextCounts = new Map(counts);
        nextCounts.set(label, count - 1);
        nextCounts.set(next, (nextCounts.get(next) ?? 0) - 1);
        nextCounts.set(third, (nextCounts.get(third) ?? 0) - 1);
        if (this.canMakeMelds(nextCounts, meldsRemaining - 1)) {
          return true;
        }
      }
    }

    return false;
  }

  private parseNumberedLabel(label: string): { suit: string; rank: number } {
    const match = /^([1-9])([万筒条])$/.exec(label);
    return {
      suit: match?.[2] ?? "",
      rank: match ? Number(match[1]) : 0,
    };
  }

  private getComboScore(combo: HulebuComboType): number {
    if (combo === "hu") {
      return 80;
    }
    if (combo === "gang") {
      return 40;
    }
    return combo === "peng" ? 30 : 20;
  }

  private refreshBoardInteractivity(boardNodes: HulebuBoardNodeModel[]): void {
    boardNodes.forEach((tile) => {
      const isBlocked = boardNodes.some((candidate) => this.isTileBlockedByRemainingTile(tile, candidate));
      tile.interactable = !isBlocked;
      tile.dimmed = isBlocked;
    });
  }

  private isTileBlockedByRemainingTile(tile: HulebuBoardNodeModel, candidate: HulebuBoardNodeModel): boolean {
    if (tile.tileId === candidate.tileId || candidate.zIndex <= tile.zIndex) {
      return false;
    }

    const layout = resolveHulebuRuntimeLayout();
    const tileWidth = scaleLayoutValue(HULEBU_TILE_WIDTH, layout.scale);
    const tileHeight = scaleLayoutValue(HULEBU_TILE_HEIGHT, layout.scale);
    const overlapWidth = Math.max(
      0,
      Math.min(tile.position.x + tileWidth / 2, candidate.position.x + tileWidth / 2) -
        Math.max(tile.position.x - tileWidth / 2, candidate.position.x - tileWidth / 2),
    );
    const overlapHeight = Math.max(
      0,
      Math.min(tile.position.y + tileHeight / 2, candidate.position.y + tileHeight / 2) -
        Math.max(tile.position.y - tileHeight / 2, candidate.position.y - tileHeight / 2),
    );
    const overlapRatio = (overlapWidth * overlapHeight) / (tileWidth * tileHeight);
    return overlapRatio > HULEBU_UNLOCK_OVERLAP_THRESHOLD;
  }

  private ensureCanvasHost(): RuntimeLayout {
    const visibleSize = resolveHulebuRuntimeLayout();
    const width = visibleSize.width;
    const height = visibleSize.height;
    const uiTransform = this.node.getComponent(UITransform) ?? this.node.addComponent(UITransform);
    uiTransform.setContentSize(width, height);
    const canvas = this.node.getComponent(Canvas) ?? this.node.addComponent(Canvas);
    canvas.alignCanvasWithScreen = true;
    canvas.cameraComponent = this.ensureRuntimeCamera(visibleSize);
    return visibleSize;
  }

  private ensureRuntimeCamera(layout: RuntimeLayout): Camera {
    const cameraNode = this.ensureChild(this.node, RUNTIME_CAMERA_NAME);
    cameraNode.layer = this.node.layer;
    cameraNode.setPosition(new Vec3(0, 0, CAMERA_Z));

    const camera = cameraNode.getComponent(Camera) ?? cameraNode.addComponent(Camera);
    camera.projection = Camera.ProjectionType.ORTHO;
    camera.orthoHeight = layout.height / 2;
    camera.near = 1;
    camera.far = CAMERA_Z * 2;
    camera.clearFlags = Camera.ClearFlag.SOLID_COLOR;
    camera.clearColor = new Color(7, 18, 16, 255);
    camera.visibility = Layers.BitMask.ALL;
    return camera;
  }

  private findComponent<T extends Component>(nodeName: string, componentType: new () => T): T | null {
    const target = this.node.getChildByName(nodeName);
    if (!target) {
      return null;
    }

    return target.getComponent(componentType) ?? target.addComponent(componentType);
  }

  private ensureVisualShell(layout: RuntimeLayout): void {
    const shellRoot = this.ensureChild(this.node, SHELL_ROOT_NAME);
    shellRoot.active = true;
    shellRoot.layer = this.node.layer;
    shellRoot.setSiblingIndex(0);

    this.drawGreenTableFelt(shellRoot, layout);
    this.drawTopPlaques(shellRoot, layout);
    this.drawRightToolButtons(shellRoot, layout);
    this.drawSlotTray(shellRoot, layout);
  }

  private drawGreenTableFelt(root: Node, layout: RuntimeLayout): void {
    this.drawRoundedPanel(
      root,
      "GreenTableFelt",
      layout.width / 2,
      layout.height / 2,
      layout.width,
      layout.height,
      0,
      TABLE_FELT_FILL,
      TABLE_FELT_FILL,
      0,
      layout,
    );

    this.drawRoundedPanel(
      root,
      "TableRim",
      layout.width / 2,
      scaleLayoutValue(layout.cssHeight * 0.49, layout.scale),
      scaleLayoutValue(Math.min(360, layout.cssWidth - 18), layout.scale),
      scaleLayoutValue(layout.cssHeight * 0.76, layout.scale),
      scaleLayoutValue(34, layout.scale),
      new Color(45, 107, 83, 255),
      TABLE_RIM_FILL,
      scaleLayoutValue(8, layout.scale),
      layout,
    );

    this.drawRoundedPanel(
      root,
      "TableLowerShade",
      layout.width / 2,
      scaleLayoutValue(170, layout.scale),
      layout.width,
      scaleLayoutValue(260, layout.scale),
      0,
      TABLE_FELT_SHADOW,
      TABLE_FELT_SHADOW,
      0,
      layout,
    );
  }

  private drawTopPlaques(root: Node, layout: RuntimeLayout): void {
    const y = layout.height - scaleLayoutValue(44, layout.scale);
    this.drawTopPlaque(root, "LevelPlaque", scaleLayoutValue(70, layout.scale), y, 112, 56, "关卡\n1-1", layout);
    this.drawTopPlaque(root, "ScorePlaque", scaleLayoutValue(195, layout.scale), y, 100, 52, "分数\n0", layout);
    this.drawTopPlaque(root, "ProgressPlaque", scaleLayoutValue(304, layout.scale), y, 162, 52, "本局进度", layout);

    this.drawProgressDots(root, layout);
  }

  private drawTopPlaque(
    root: Node,
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    layout: RuntimeLayout,
  ): void {
    this.drawRoundedPanel(
      root,
      name,
      x,
      y,
      scaleLayoutValue(width, layout.scale),
      scaleLayoutValue(height, layout.scale),
      scaleLayoutValue(12, layout.scale),
      PLAQUE_FILL,
      PLAQUE_STROKE,
      scaleLayoutValue(3, layout.scale),
      layout,
    );
    this.writeShellLabel(root.getChildByName(name)!, "Label", text, scaleLayoutValue(15, layout.scale), PLAQUE_TEXT);
  }

  private drawProgressDots(root: Node, layout: RuntimeLayout): void {
    const y = layout.height - scaleLayoutValue(44, layout.scale);
    const startX = scaleLayoutValue(272, layout.scale);
    const gap = scaleLayoutValue(24, layout.scale);
    for (let index = 0; index < 4; index += 1) {
      const dot = this.drawRoundedPanel(
        root,
        `ProgressDot_${index}`,
        startX + index * gap,
        y - scaleLayoutValue(18, layout.scale),
        scaleLayoutValue(13, layout.scale),
        scaleLayoutValue(13, layout.scale),
        scaleLayoutValue(7, layout.scale),
        index === 0 ? JADE_FILL : new Color(218, 187, 137, 255),
        PLAQUE_STROKE,
        scaleLayoutValue(2, layout.scale),
        layout,
      );
      dot.setSiblingIndex(root.children.length - 1);
    }
  }

  private drawRightToolButtons(root: Node, layout: RuntimeLayout): void {
    const x = scaleLayoutValue(Math.min(layout.cssWidth - 34, 352), layout.scale);
    const tools = [
      { name: "ToolButton_Wash", label: "洗牌", count: "3", yRatio: 0.57 },
      { name: "ToolButton_Undo", label: "撤回", count: "3", yRatio: 0.45 },
      { name: "ToolButton_Hint", label: "提示", count: "3", yRatio: 0.33 },
    ];

    tools.forEach((tool) => {
      this.drawToolButton(
        root,
        tool.name,
        x,
        scaleLayoutValue(layout.cssHeight * tool.yRatio, layout.scale),
        tool.label,
        tool.count,
        layout,
      );
    });
  }

  private drawToolButton(
    root: Node,
    name: string,
    x: number,
    y: number,
    label: string,
    count: string,
    layout: RuntimeLayout,
  ): void {
    const node = this.drawRoundedPanel(
      root,
      name,
      x,
      y,
      scaleLayoutValue(54, layout.scale),
      scaleLayoutValue(64, layout.scale),
      scaleLayoutValue(18, layout.scale),
      TOOL_FILL,
      PLAQUE_STROKE,
      scaleLayoutValue(3, layout.scale),
      layout,
    );
    this.writeShellLabel(node, "Label", label, scaleLayoutValue(13, layout.scale), new Color(255, 246, 216, 255), -8);
    const badge = this.ensureChild(node, "Badge");
    badge.setPosition(new Vec3(scaleLayoutValue(20, layout.scale), -scaleLayoutValue(21, layout.scale), 0));
    this.drawRoundedPanel(
      node,
      "BadgeBack",
      badge.position.x,
      badge.position.y,
      scaleLayoutValue(18, layout.scale),
      scaleLayoutValue(18, layout.scale),
      scaleLayoutValue(9, layout.scale),
      new Color(174, 50, 44, 255),
      PLAQUE_FILL,
      scaleLayoutValue(2, layout.scale),
    );
    this.writeShellLabel(node.getChildByName("BadgeBack")!, "Label", count, scaleLayoutValue(11, layout.scale), new Color(255, 248, 225, 255));
  }

  private drawSlotTray(root: Node, layout: RuntimeLayout): void {
    this.drawRoundedPanel(
      root,
      "SlotTray",
      layout.width / 2,
      scaleLayoutValue(Math.max(92, layout.cssHeight * 0.15), layout.scale),
      scaleLayoutValue(Math.min(362, layout.cssWidth - 28), layout.scale),
      scaleLayoutValue(86, layout.scale),
      scaleLayoutValue(18, layout.scale),
      WOOD_FILL,
      WOOD_STROKE,
      scaleLayoutValue(5, layout.scale),
      layout,
    );
  }

  private drawRoundedPanel(
    root: Node,
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillColor: Color,
    strokeColor: Color,
    lineWidth: number,
    layout?: RuntimeLayout,
  ): Node {
    const node = this.ensureChild(root, name);
    node.layer = root.layer;
    node.setPosition(new Vec3(layout ? centerLayoutX(x, layout) : Math.round(x), layout ? centerLayoutY(y, layout) : Math.round(y), 0));
    const uiTransform = node.getComponent(UITransform) ?? node.addComponent(UITransform);
    uiTransform.setContentSize(width, height);
    const graphics = node.getComponent(Graphics) ?? node.addComponent(Graphics);
    graphics.clear();
    graphics.fillColor = fillColor;
    graphics.strokeColor = strokeColor;
    graphics.lineWidth = lineWidth;
    graphics.roundRect(-width / 2, -height / 2, width, height, radius);
    graphics.fill();
    if (lineWidth > 0) {
      graphics.stroke();
    }
    return node;
  }

  private writeShellLabel(node: Node, name: string, text: string, fontSize: number, color: Color, yOffset = 0): Label {
    const labelNode = this.ensureChild(node, name);
    labelNode.layer = node.layer;
    labelNode.setPosition(new Vec3(0, yOffset, 0));
    const parentTransform = node.getComponent(UITransform);
    const labelTransform = labelNode.getComponent(UITransform) ?? labelNode.addComponent(UITransform);
    labelTransform.setContentSize(parentTransform?.width ?? 80, parentTransform?.height ?? 30);
    const label = labelNode.getComponent(Label) ?? labelNode.addComponent(Label);
    label.string = text;
    label.fontSize = fontSize;
    label.lineHeight = Math.round(fontSize * 1.18);
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    label.color = color;
    return label;
  }

  private ensureChild(parent: Node, name: string): Node {
    const existing = parent.getChildByName(name);
    if (existing) {
      return existing;
    }

    const node = new Node(name);
    node.layer = parent.layer;
    parent.addChild(node);
    return node;
  }
}
