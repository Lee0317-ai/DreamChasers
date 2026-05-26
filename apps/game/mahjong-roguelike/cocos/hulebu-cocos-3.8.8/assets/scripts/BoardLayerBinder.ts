import { _decorator, Button, Color, Component, Graphics, Label, Node, UIOpacity, UITransform, Vec3 } from "cc";
import {
  centerLayoutX,
  centerLayoutY,
  resolveHulebuRuntimeLayout,
  scaleLayoutValue,
} from "./bootstrap/HulebuSampleSceneModel";
import type { HulebuBoardNodeModel } from "./contracts/HulebuSceneModel";

const { ccclass, property } = _decorator;
const TILE_WIDTH = 52;
const TILE_HEIGHT = 70;
const TILE_FACE_COLOR = new Color(255, 249, 236, 255);
const TILE_SIDE_COLOR = new Color(32, 118, 84, 255);
const TILE_LOCKED_FACE_COLOR = new Color(208, 214, 204, 255);
const TILE_STROKE_COLOR = new Color(191, 133, 67, 255);

@ccclass("BoardLayerBinder")
export class BoardLayerBinder extends Component {
  @property(Node)
  tilePool: Node | null = null;

  private tileClickHandler: ((tileId: string) => void) | null = null;
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

    const button = node.getComponent(Button) ?? node.addComponent(Button);
    button.interactable = model.interactable;
  }

  private bindTileClick(node: Node, model: HulebuBoardNodeModel): void {
    const existing = this.tileTouchHandlers.get(node);
    if (existing) {
      node.off(Node.EventType.TOUCH_END, existing, this);
    }

    const handler = (): void => {
      if (!model.interactable) {
        return;
      }

      this.tileClickHandler?.(model.tileId);
    };

    node.on(Node.EventType.TOUCH_END, handler, this);
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
