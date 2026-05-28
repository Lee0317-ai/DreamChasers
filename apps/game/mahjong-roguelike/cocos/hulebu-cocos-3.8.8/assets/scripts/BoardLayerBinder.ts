import { _decorator, Button, Color, Component, Graphics, Label, Node, Sprite, SpriteFrame, UIOpacity, UITransform, Vec3 } from "cc";
import {
  centerLayoutX,
  centerLayoutY,
  resolveHulebuRuntimeLayout,
  scaleLayoutValue,
} from "./bootstrap/HulebuSampleSceneModel";
import type { HulebuBoardNodeModel } from "./contracts/HulebuSceneModel";
import { HulebuTileSpriteCatalog } from "./assets/HulebuTileSpriteCatalog";

const { ccclass, property } = _decorator;
const TILE_WIDTH = 52;
const TILE_HEIGHT = 70;
const TILE_FACE_COLOR = new Color(255, 249, 236, 255);
const TILE_SIDE_COLOR = new Color(32, 118, 84, 255);
const TILE_LOCKED_FACE_COLOR = new Color(208, 214, 204, 255);
const TILE_STROKE_COLOR = new Color(191, 133, 67, 255);
const TILE_STACK_HINT_COLOR = new Color(36, 112, 80, 210);
const TILE_STACK_HINT_STROKE = new Color(245, 221, 174, 230);

@ccclass("BoardLayerBinder")
export class BoardLayerBinder extends Component {
  @property(Node)
  tilePool: Node | null = null;

  private tileClickHandler: ((tileId: string) => void) | null = null;
  private readonly tileSpriteCatalog = new HulebuTileSpriteCatalog();
  private readonly pendingSpriteKeys = new WeakMap<Node, string>();
  private readonly tileTouchHandlers = new WeakMap<Node, () => void>();

  setTileClickHandler(handler: ((tileId: string) => void) | null): void {
    this.tileClickHandler = handler;
  }

  applyBoardNodes(nodes: HulebuBoardNodeModel[]): void {
    const layout = resolveHulebuRuntimeLayout();
    const root = this.tilePool ?? this.node.getChildByName("TilePool") ?? this.node;
    root.active = true;
    root.children.forEach((child) => {
      child.active = false;
    });

    nodes.forEach((model, index) => {
      const child = root.children[index] ?? this.createTileNode(root, layout.scale);
      child.name = model.name;
      child.active = true;
      child.setPosition(
        new Vec3(centerLayoutX(model.position.x, layout), centerLayoutY(model.position.y, layout), model.zIndex),
      );
      child.setSiblingIndex(index);
      this.applyTileVisual(child, model, layout.scale);
      this.bindTileClick(child, model);
      this.setOpacity(child, model.dimmed ? 110 : 255);
    });
  }

  private createTileNode(parent: Node, scale = 1): Node {
    const tile = new Node("Tile");
    tile.layer = parent.layer;
    parent.addChild(tile);
    tile.addComponent(UITransform).setContentSize(scaleLayoutValue(TILE_WIDTH, scale), scaleLayoutValue(TILE_HEIGHT, scale));
    tile.addComponent(Graphics);
    tile.addComponent(Button);

    const labelNode = new Node("Label");
    labelNode.layer = parent.layer;
    tile.addChild(labelNode);
    labelNode.addComponent(UITransform).setContentSize(scaleLayoutValue(TILE_WIDTH, scale), scaleLayoutValue(TILE_HEIGHT, scale));
    const label = labelNode.addComponent(Label);
    label.fontSize = scaleLayoutValue(18, scale);
    label.lineHeight = scaleLayoutValue(22, scale);
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    label.color = new Color(42, 32, 24, 255);

    return tile;
  }

  private applyTileVisual(node: Node, model: HulebuBoardNodeModel, scale: number): void {
    const width = scaleLayoutValue(TILE_WIDTH, scale);
    const height = scaleLayoutValue(TILE_HEIGHT, scale);
    let uiTransform = node.getComponent(UITransform);
    if (!uiTransform) {
      uiTransform = node.addComponent(UITransform);
    }
    uiTransform.setContentSize(width, height);

    const graphics = node.getComponent(Graphics) ?? node.addComponent(Graphics);
    this.drawTileFace(graphics, width, height, model.interactable, scale);

    const label = node.getComponentInChildren(Label) ?? this.createTileLabel(node, scale);
    label.string = model.label;
    label.node.getComponent(UITransform)?.setContentSize(width, height);
    label.fontSize = scaleLayoutValue(18, scale);
    label.lineHeight = scaleLayoutValue(22, scale);
    label.color = model.interactable ? new Color(42, 32, 24, 255) : new Color(88, 88, 82, 255);
    label.node.active = true;

    this.applyTileSprite(node, model, scale, label);
    this.drawStackDepthHint(node, model.stackDepth ?? 1, scale);

    const button = node.getComponent(Button) ?? node.addComponent(Button);
    button.interactable = model.interactable;
  }

  private applyTileSprite(node: Node, model: HulebuBoardNodeModel, scale: number, label: Label): void {
    const artNode = this.ensureTileArtNode(node, scale);
    const sprite = artNode.getComponent(Sprite) ?? artNode.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    sprite.spriteFrame = null;
    artNode.active = false;
    label.node.active = true;

    const tileKey = model.prefabKey;
    this.pendingSpriteKeys.set(node, tileKey);
    this.tileSpriteCatalog.loadTileSpriteFrame(tileKey, (spriteFrame: SpriteFrame | null) => {
      if (this.pendingSpriteKeys.get(node) !== tileKey || !spriteFrame) {
        return;
      }

      sprite.spriteFrame = spriteFrame;
      artNode.active = true;
      label.node.active = false;
    });
  }

  private ensureTileArtNode(parent: Node, scale: number): Node {
    const width = scaleLayoutValue(TILE_WIDTH, scale);
    const height = scaleLayoutValue(TILE_HEIGHT, scale);
    let artNode = parent.getChildByName("TileArt");
    if (!artNode) {
      artNode = new Node("TileArt");
      artNode.layer = parent.layer;
      parent.addChild(artNode);
    }

    let uiTransform = artNode.getComponent(UITransform);
    if (!uiTransform) {
      uiTransform = artNode.addComponent(UITransform);
    }
    uiTransform.setContentSize(width, height);
    return artNode;
  }

  private drawStackDepthHint(parent: Node, stackDepth: number, scale: number): void {
    const hintNode = this.ensureStackDepthHintNode(parent, scale);
    const graphics = hintNode.getComponent(Graphics) ?? hintNode.addComponent(Graphics);
    const width = scaleLayoutValue(TILE_WIDTH, scale);
    const height = scaleLayoutValue(TILE_HEIGHT, scale);
    const hiddenLayers = Math.max(0, Math.min(4, stackDepth - 1));
    graphics.clear();
    hintNode.active = hiddenLayers > 0;

    if (hiddenLayers <= 0) {
      return;
    }

    const stripWidth = width * 0.72;
    const stripHeight = scaleLayoutValue(3, scale);
    const startY = height / 2 - scaleLayoutValue(8, scale);
    graphics.fillColor = TILE_STACK_HINT_COLOR;
    graphics.strokeColor = TILE_STACK_HINT_STROKE;
    graphics.lineWidth = scaleLayoutValue(1, scale);

    for (let index = 0; index < hiddenLayers; index += 1) {
      const y = startY - index * scaleLayoutValue(6, scale);
      graphics.roundRect(-stripWidth / 2, y, stripWidth, stripHeight, scaleLayoutValue(2, scale));
      graphics.fill();
      graphics.stroke();
    }
  }

  private ensureStackDepthHintNode(parent: Node, scale: number): Node {
    const width = scaleLayoutValue(TILE_WIDTH, scale);
    const height = scaleLayoutValue(TILE_HEIGHT, scale);
    let hintNode = parent.getChildByName("StackDepthHint");
    if (!hintNode) {
      hintNode = new Node("StackDepthHint");
      hintNode.layer = parent.layer;
      parent.addChild(hintNode);
      hintNode.addComponent(Graphics);
    }

    let uiTransform = hintNode.getComponent(UITransform);
    if (!uiTransform) {
      uiTransform = hintNode.addComponent(UITransform);
    }
    uiTransform.setContentSize(width, height);
    hintNode.setSiblingIndex(parent.children.length - 1);
    return hintNode;
  }

  private bindTileClick(node: Node, model: HulebuBoardNodeModel): void {
    const existing = this.tileTouchHandlers.get(node);
    if (existing) {
      node.off(Node.EventType.TOUCH_END, existing, this);
      node.off(Button.EventType.CLICK, existing, this);
    }

    const handler = (): void => {
      if (!model.interactable) {
        return;
      }

      this.tileClickHandler?.(model.tileId);
    };

    node.on(Node.EventType.TOUCH_END, handler, this);
    node.on(Button.EventType.CLICK, handler, this);
    this.tileTouchHandlers.set(node, handler);
  }

  private drawTileFace(graphics: Graphics, width: number, height: number, interactable: boolean, scale: number): void {
    const sideOffset = scaleLayoutValue(6, scale);
    const radius = scaleLayoutValue(8, scale);
    graphics.clear();
    graphics.fillColor = TILE_SIDE_COLOR;
    graphics.strokeColor = new Color(19, 82, 61, 255);
    graphics.lineWidth = scaleLayoutValue(2, scale);
    graphics.roundRect(-width / 2, -height / 2 - sideOffset, width, height, radius);
    graphics.fill();
    graphics.stroke();

    graphics.fillColor = interactable ? TILE_FACE_COLOR : TILE_LOCKED_FACE_COLOR;
    graphics.strokeColor = interactable ? TILE_STROKE_COLOR : new Color(114, 122, 112, 255);
    graphics.lineWidth = scaleLayoutValue(4, scale);
    graphics.roundRect(-width / 2, -height / 2, width, height, radius);
    graphics.fill();
    graphics.stroke();
  }

  private createTileLabel(parent: Node, scale: number): Label {
    const labelNode = new Node("Label");
    labelNode.layer = parent.layer;
    parent.addChild(labelNode);
    labelNode.addComponent(UITransform).setContentSize(scaleLayoutValue(TILE_WIDTH, scale), scaleLayoutValue(TILE_HEIGHT, scale));
    const label = labelNode.addComponent(Label);
    label.fontSize = scaleLayoutValue(18, scale);
    label.lineHeight = scaleLayoutValue(22, scale);
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    return label;
  }

  private setOpacity(node: Node, opacity: number): void {
    let uiOpacity = node.getComponent(UIOpacity);
    if (!uiOpacity) {
      uiOpacity = node.addComponent(UIOpacity);
    }

    uiOpacity.opacity = opacity;
  }
}
