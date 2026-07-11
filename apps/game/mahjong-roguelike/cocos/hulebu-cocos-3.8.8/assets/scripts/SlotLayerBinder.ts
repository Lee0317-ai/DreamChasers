import { _decorator, Button, Color, Component, Graphics, Label, Node, resources, Sprite, SpriteFrame, UITransform, Vec3 } from "cc";
import {
  centerLayoutX,
  centerLayoutY,
  resolveHulebuRuntimeLayout,
  scaleLayoutValue,
} from "./bootstrap/HulebuSampleSceneModel";
import type { HulebuCellNodeModel } from "./contracts/HulebuSceneModel";
import { HulebuTileSpriteCatalog } from "./assets/HulebuTileSpriteCatalog";
import { safeApplySpriteFrame } from "./utils/HulebuSpriteSafety";

const { ccclass, property } = _decorator;
const CELL_WIDTH = 40;
const CELL_HEIGHT = 54;
const CELL_GAP = 5;
const WOOD_SLOT_FILL = new Color(67, 42, 29, 255);
const WOOD_SLOT_STROKE = new Color(154, 97, 57, 255);
const OCCUPIED_SLOT_FILL = new Color(255, 249, 236, 255);
const HAND_SLOTS_SPRITE_PATH = "ui/v6/slots/hand_slots_8/spriteFrame";

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

  private slotClickHandler: ((slotIndex: number) => void) | null = null;
  private readonly slotTouchHandlers = new WeakMap<Node, () => void>();
  private readonly tileSpriteCatalog = new HulebuTileSpriteCatalog();
  private readonly pendingSpriteKeys = new WeakMap<Node, string>();

  setSlotClickHandler(handler: ((slotIndex: number) => void) | null): void {
    this.slotClickHandler = handler;
  }

  applySlotNodes(slotModels: HulebuCellNodeModel[], reserveModels: HulebuCellNodeModel[]): void {
    const layout = this.getVisibleLayout();
    this.hideSlotTrayArt();
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

  private applySlotTrayArt(layout: SlotLayout): void {
    const trayNode = this.ensureSlotTrayArtNode(layout);
    const sprite = trayNode.getComponent(Sprite) ?? trayNode.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    resources.load(HAND_SLOTS_SPRITE_PATH, SpriteFrame, (error, spriteFrame) => {
      if (error || !spriteFrame) {
        trayNode.active = false;
        return;
      }

      if (!safeApplySpriteFrame(trayNode, sprite, spriteFrame)) {
        return;
      }
      trayNode.active = true;
    });
  }

  private hideSlotTrayArt(): void {
    const trayNode = this.node.getChildByName("SlotTrayArt");
    if (trayNode) {
      trayNode.active = false;
    }
  }

  private ensureSlotTrayArtNode(layout: SlotLayout): Node {
    let trayNode = this.node.getChildByName("SlotTrayArt");
    if (!trayNode) {
      trayNode = new Node("SlotTrayArt");
      trayNode.layer = this.node.layer;
      this.node.addChild(trayNode);
    }

    const uiTransform = trayNode.getComponent(UITransform) ?? trayNode.addComponent(UITransform);
    uiTransform.setContentSize(scaleLayoutValue(574, layout.scale), scaleLayoutValue(138, layout.scale));
    trayNode.setPosition(new Vec3(centerLayoutX(layout.centerX, layout), centerLayoutY(layout.slotY, layout), -2));
    trayNode.setSiblingIndex(0);
    return trayNode;
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
      this.bindCellClick(node, model, prefix);
      const label = this.ensureCellLabel(node, scale);
      this.configureLabel(label, scale);
      label.node.active = model.occupied;
      label.node.setSiblingIndex(node.children.length - 1);
      label.string = model.label ?? "";
      this.applyCellSprite(node, model, scale, label);
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
    node.addComponent(Button);

    const labelNode = new Node("Label");
    labelNode.layer = root.layer;
    node.addChild(labelNode);
    labelNode.addComponent(UITransform).setContentSize(scaleLayoutValue(CELL_WIDTH, scale), scaleLayoutValue(CELL_HEIGHT, scale));
    const label = labelNode.addComponent(Label);
    this.configureLabel(label, scale);

    return node;
  }

  private bindCellClick(node: Node, model: HulebuCellNodeModel, prefix: "Slot" | "Reserve"): void {
    const existing = this.slotTouchHandlers.get(node);
    if (existing) {
      node.off(Node.EventType.TOUCH_END, existing, this);
      node.off(Button.EventType.CLICK, existing, this);
    }

    const button = node.getComponent(Button) ?? node.addComponent(Button);
    button.interactable = prefix === "Slot" && model.occupied;
    const handler = (): void => {
      if (prefix !== "Slot" || !model.occupied) {
        return;
      }

      this.slotClickHandler?.(model.index);
    };

    node.on(Node.EventType.TOUCH_END, handler, this);
    node.on(Button.EventType.CLICK, handler, this);
    this.slotTouchHandlers.set(node, handler);
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

  private applyCellSprite(node: Node, model: HulebuCellNodeModel, scale: number, label: Label): void {
    const artNode = this.ensureCellArtNode(node, scale);
    const sprite = artNode.getComponent(Sprite) ?? artNode.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    sprite.spriteFrame = null;
    artNode.active = false;
    label.node.active = model.occupied;

    const tileKey = model.prefabKey;
    if (!model.occupied || !tileKey) {
      return;
    }

    this.pendingSpriteKeys.set(node, tileKey);
    this.tileSpriteCatalog.loadTileSpriteFrame(tileKey, (spriteFrame: SpriteFrame | null) => {
      if (this.pendingSpriteKeys.get(node) !== tileKey || !spriteFrame) {
        return;
      }

      if (!safeApplySpriteFrame(artNode, sprite, spriteFrame)) {
        return;
      }
      artNode.active = true;
      label.node.active = false;
    });
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

  private ensureCellArtNode(parent: Node, scale: number): Node {
    let artNode = parent.getChildByName("TileArt");
    if (!artNode) {
      artNode = new Node("TileArt");
      artNode.layer = parent.layer;
      parent.addChild(artNode);
    }

    const uiTransform = artNode.getComponent(UITransform) ?? artNode.addComponent(UITransform);
    uiTransform.setContentSize(scaleLayoutValue(CELL_WIDTH, scale), scaleLayoutValue(CELL_HEIGHT, scale));
    artNode.setSiblingIndex(parent.children.length - 1);
    return artNode;
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
      slotY: scaleLayoutValue(Math.max(64, visibleSize.cssHeight * 0.07), visibleSize.scale),
      reserveY: scaleLayoutValue(Math.max(132, visibleSize.cssHeight * 0.155), visibleSize.scale),
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
