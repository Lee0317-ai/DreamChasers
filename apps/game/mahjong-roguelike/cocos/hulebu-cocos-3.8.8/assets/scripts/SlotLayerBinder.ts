import { _decorator, Color, Component, Graphics, Label, Node, UITransform, Vec3 } from "cc";
import {
  centerLayoutX,
  centerLayoutY,
  resolveHulebuRuntimeLayout,
  scaleLayoutValue,
} from "./bootstrap/HulebuSampleSceneModel";
import type { HulebuCellNodeModel } from "./contracts/HulebuSceneModel";

const { ccclass, property } = _decorator;
const CELL_WIDTH = 40;
const CELL_HEIGHT = 54;
const CELL_GAP = 5;
const WOOD_SLOT_FILL = new Color(67, 42, 29, 255);
const WOOD_SLOT_STROKE = new Color(154, 97, 57, 255);
const OCCUPIED_SLOT_FILL = new Color(255, 249, 236, 255);

interface SlotLayout {
  width: number;
  height: number;
  centerX: number;
  slotY: number;
  reserveY: number;
  scale: number;
}

@ccclass("SlotLayerBinder")
export class SlotLayerBinder extends Component {
  @property([Node])
  slotNodes: Node[] = [];

  @property([Node])
  reserveNodes: Node[] = [];

  applySlotNodes(slotModels: HulebuCellNodeModel[], reserveModels: HulebuCellNodeModel[]): void {
    const layout = this.getVisibleLayout();
    this.applyCells("Slot", this.node, this.slotNodes, slotModels, layout.slotY, layout);
    this.applyCells(
      "Reserve",
      this.node.getChildByName("ReserveRoot") ?? this.node,
      this.reserveNodes,
      reserveModels,
      layout.reserveY,
      layout,
    );
  }

  private applyCells(
    prefix: "Slot" | "Reserve",
    root: Node,
    nodes: Node[],
    models: HulebuCellNodeModel[],
    y: number,
    layout: SlotLayout,
  ): void {
    const scale = layout.scale;
    const cellWidth = scaleLayoutValue(CELL_WIDTH, scale);
    const cellGap = scaleLayoutValue(CELL_GAP, scale);
    const width = models.length * cellWidth + Math.max(0, models.length - 1) * cellGap;

    models.forEach((model, index) => {
      const node = nodes[index] ?? this.ensureCellNode(root, prefix, index, scale);
      nodes[index] = node;

      node.name = model.name;
      node.active = true;
      const cellX = layout.centerX + index * (cellWidth + cellGap) - width / 2 + cellWidth / 2;
      node.setPosition(new Vec3(centerLayoutX(cellX, layout), centerLayoutY(y, layout), 0));
      this.applyCellVisual(node, model, scale);
      const label = this.ensureCellLabel(node, scale);
      this.configureLabel(label, scale);
      label.node.active = model.occupied;
      label.node.setSiblingIndex(node.children.length - 1);
      label.string = model.label ?? "";
    });
  }

  private ensureCellNode(root: Node, prefix: "Slot" | "Reserve", index: number, scale: number): Node {
    const existing = root.getChildByName(`${prefix}_${index}`);
    if (existing) {
      return existing;
    }

    const node = new Node(`${prefix}_${index}`);
    node.layer = root.layer;
    root.addChild(node);
    node.addComponent(UITransform).setContentSize(scaleLayoutValue(CELL_WIDTH, scale), scaleLayoutValue(CELL_HEIGHT, scale));
    node.addComponent(Graphics);

    const labelNode = new Node("Label");
    labelNode.layer = root.layer;
    node.addChild(labelNode);
    labelNode.addComponent(UITransform).setContentSize(scaleLayoutValue(CELL_WIDTH, scale), scaleLayoutValue(CELL_HEIGHT, scale));
    const label = labelNode.addComponent(Label);
    this.configureLabel(label, scale);

    return node;
  }

  private applyCellVisual(node: Node, model: HulebuCellNodeModel, scale: number): void {
    const cellWidth = scaleLayoutValue(CELL_WIDTH, scale);
    const cellHeight = scaleLayoutValue(CELL_HEIGHT, scale);
    const uiTransform = node.getComponent(UITransform) ?? node.addComponent(UITransform);
    uiTransform.setContentSize(cellWidth, cellHeight);

    const graphics = node.getComponent(Graphics) ?? node.addComponent(Graphics);
    graphics.clear();
    graphics.fillColor = model.occupied ? OCCUPIED_SLOT_FILL : WOOD_SLOT_FILL;
    graphics.strokeColor = model.occupied ? new Color(191, 133, 67, 255) : WOOD_SLOT_STROKE;
    graphics.lineWidth = scaleLayoutValue(3, scale);
    graphics.roundRect(-cellWidth / 2, -cellHeight / 2, cellWidth, cellHeight, scaleLayoutValue(6, scale));
    graphics.fill();
    graphics.stroke();
  }

  private ensureCellLabel(node: Node, scale: number): Label {
    const labelNode = node.getChildByName("Label") ?? new Node("Label");
    labelNode.layer = node.layer;
    if (!labelNode.parent) {
      node.addChild(labelNode);
    }
    labelNode.active = true;
    const labelTransform = labelNode.getComponent(UITransform) ?? labelNode.addComponent(UITransform);
    labelTransform.setContentSize(scaleLayoutValue(CELL_WIDTH, scale), scaleLayoutValue(CELL_HEIGHT, scale));
    return labelNode.getComponent(Label) ?? labelNode.addComponent(Label);
  }

  private configureLabel(label: Label, scale: number): void {
    const width = scaleLayoutValue(CELL_WIDTH, scale);
    const height = scaleLayoutValue(CELL_HEIGHT, scale);
    label.node.setPosition(new Vec3(0, 0, 1));
    label.node.getComponent(UITransform)?.setContentSize(width, height);
    label.fontSize = scaleLayoutValue(16, scale);
    label.lineHeight = scaleLayoutValue(20, scale);
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    label.color = new Color(56, 42, 32, 255);
  }

  private getVisibleLayout(): SlotLayout {
    const visibleSize = getVisibleLayoutSize();
    return {
      width: visibleSize.width,
      height: visibleSize.height,
      centerX: Math.round(visibleSize.width / 2),
      slotY: scaleLayoutValue(Math.max(92, visibleSize.cssHeight * 0.15), visibleSize.scale),
      reserveY: scaleLayoutValue(Math.max(168, visibleSize.cssHeight * 0.24), visibleSize.scale),
      scale: visibleSize.scale,
    };
  }
}

function getVisibleLayoutSize(): { width: number; height: number; cssHeight: number; scale: number } {
  const visibleSize = resolveHulebuRuntimeLayout();
  return {
    width: visibleSize.width,
    height: visibleSize.height,
    cssHeight: visibleSize.cssHeight,
    scale: visibleSize.scale,
  };
}
