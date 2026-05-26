import { _decorator, Color, Component, Label, Node, UITransform, Vec3 } from "cc";
import {
  centerLayoutX,
  centerLayoutY,
  resolveHulebuRuntimeLayout,
  scaleLayoutValue,
} from "./bootstrap/HulebuSampleSceneModel";
import type { HulebuHudModel } from "./contracts/HulebuSceneModel";

const { ccclass, property } = _decorator;
const HUD_LABEL_NAMES = [
  "BoardRemainingLabel",
  "SlotStatusLabel",
  "ScoreLabel",
  "CoinsLabel",
  "ToolLabel",
] as const;
const HUD_START_X = 18;
const HUD_LABEL_WIDTHS = [72, 62, 46, 58, 118] as const;
const HUD_LABEL_HEIGHT = 26;

@ccclass("HudBinder")
export class HudBinder extends Component {
  @property(Label)
  boardRemainingLabel: Label | null = null;

  @property(Label)
  slotStatusLabel: Label | null = null;

  @property(Label)
  scoreLabel: Label | null = null;

  @property(Label)
  coinsLabel: Label | null = null;

  @property(Label)
  toolLabel: Label | null = null;

  applyHud(hud: HulebuHudModel): void {
    this.boardRemainingLabel = this.boardRemainingLabel ?? this.resolveLabel("BoardRemainingLabel", 0);
    this.slotStatusLabel = this.slotStatusLabel ?? this.resolveLabel("SlotStatusLabel", 1);
    this.scoreLabel = this.scoreLabel ?? this.resolveLabel("ScoreLabel", 2);
    this.coinsLabel = this.coinsLabel ?? this.resolveLabel("CoinsLabel", 3);
    this.toolLabel = this.toolLabel ?? this.resolveLabel("ToolLabel", 4);

    this.positionLabel(this.boardRemainingLabel, 0);
    this.positionLabel(this.slotStatusLabel, 1);
    this.positionLabel(this.scoreLabel, 2);
    this.positionLabel(this.coinsLabel, 3);
    this.positionLabel(this.toolLabel, 4);

    this.setLabel(this.boardRemainingLabel, hud.boardRemainingText);
    this.setLabel(this.slotStatusLabel, hud.slotStatusText);
    this.setLabel(this.scoreLabel, hud.scoreText);
    this.setLabel(this.coinsLabel, hud.coinsText);
    this.setLabel(this.toolLabel, hud.toolText);
  }

  private setLabel(label: Label | null, value: string): void {
    if (label) {
      label.string = value;
    }
  }

  private positionLabel(label: Label | null, index: number): void {
    if (label) {
      this.configureLabel(label);
      this.positionLabelNode(label.node, index);
    }
  }

  private resolveLabel(nodeName: typeof HUD_LABEL_NAMES[number], index: number): Label {
    return this.findLabel(nodeName) ?? this.ensureLabel(nodeName, index);
  }

  private findLabel(nodeName: string): Label | null {
    return this.node.getChildByName(nodeName)?.getComponent(Label) ?? null;
  }

  private ensureLabel(nodeName: string, index: number): Label {
    const node = this.node.getChildByName(nodeName) ?? this.createLabelNode(nodeName, index);
    this.positionLabelNode(node, index);
    const label = node.getComponent(Label) ?? node.addComponent(Label);
    this.configureLabel(label);
    return label;
  }

  private configureLabel(label: Label): void {
    const layout = this.getVisibleLayout();
    label.fontSize = scaleLayoutValue(12, layout.scale);
    label.lineHeight = scaleLayoutValue(16, layout.scale);
    label.horizontalAlign = Label.HorizontalAlign.LEFT;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    label.color = new Color(255, 249, 236, 255);
  }

  private createLabelNode(nodeName: string, index: number): Node {
    const node = new Node(nodeName);
    node.layer = this.node.layer;
    this.node.addChild(node);
    this.positionLabelNode(node, index);
    node.addComponent(UITransform).setContentSize(this.getLabelWidth(index), this.getLabelHeight());
    return node;
  }

  private positionLabelNode(node: Node, index: number): void {
    const layout = this.getVisibleLayout();
    node.setPosition(new Vec3(centerLayoutX(layout.labelCenters[index], layout), centerLayoutY(layout.y, layout), 0));
    const uiTransform = node.getComponent(UITransform);
    uiTransform?.setContentSize(this.getLabelWidth(index), this.getLabelHeight());
  }

  private getVisibleLayout(): { width: number; height: number; labelCenters: number[]; y: number; scale: number } {
    const visibleSize = getVisibleLayoutSize();
    const gapX = scaleLayoutValue(4, visibleSize.scale);
    let cursor = scaleLayoutValue(HUD_START_X, visibleSize.scale);
    const labelCenters = HUD_LABEL_WIDTHS.map((width) => {
      const scaledWidth = scaleLayoutValue(width, visibleSize.scale);
      const center = cursor + scaledWidth / 2;
      cursor += scaledWidth + gapX;
      return Math.round(center);
    });

    return {
      labelCenters,
      y: visibleSize.height - scaleLayoutValue(40, visibleSize.scale),
      scale: visibleSize.scale,
      width: visibleSize.width,
      height: visibleSize.height,
    };
  }

  private getLabelWidth(index: number): number {
    const layout = this.getVisibleLayout();
    return scaleLayoutValue(HUD_LABEL_WIDTHS[index], layout.scale);
  }

  private getLabelHeight(): number {
    const layout = this.getVisibleLayout();
    return scaleLayoutValue(HUD_LABEL_HEIGHT, layout.scale);
  }
}

function getVisibleLayoutSize(): { width: number; height: number; scale: number } {
  const visibleSize = resolveHulebuRuntimeLayout();
  return {
    width: visibleSize.width,
    height: visibleSize.height,
    scale: visibleSize.scale,
  };
}
