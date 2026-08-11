import { _decorator, BlockInputEvents, Button, Color, Component, EventMouse, EventTouch, game, Graphics, Label, Node, Rect, Sprite, SpriteFrame, UIOpacity, UITransform, Vec2, Vec3 } from "cc";
import {
  centerLayoutX,
  centerLayoutY,
  resolveHulebuRuntimeLayout,
  scaleLayoutValue,
} from "./bootstrap/HulebuSampleSceneModel";
import type { HulebuBoardNodeModel } from "./contracts/HulebuSceneModel";
import { HulebuTileSpriteCatalog } from "./assets/HulebuTileSpriteCatalog";
import { safeApplySpriteFrame } from "./utils/HulebuSpriteSafety";

const { ccclass, property } = _decorator;
const TILE_WIDTH = 32;
const TILE_HEIGHT = 43;
const TILE_FACE_COLOR = new Color(255, 249, 236, 255);
const TILE_SIDE_COLOR = new Color(32, 118, 84, 255);
const TILE_LOCKED_FACE_COLOR = new Color(122, 132, 124, 255);
const TILE_STROKE_COLOR = new Color(191, 133, 67, 255);
const TILE_STACK_HINT_COLOR = new Color(36, 112, 80, 210);
const TILE_STACK_HINT_STROKE = new Color(245, 221, 174, 230);
const TILE_TOP_LAYER_THRESHOLD = 2;
const TILE_TOP_SCALE_BOOST = 1.04;
const TILE_TOP_STROKE_GLOW = new Color(244, 192, 74, 255);
const TILE_TOP_SIDE_COLOR = new Color(10, 79, 64, 255);
const TILE_TOP_FACE_COLOR = new Color(255, 252, 242, 255);
const TILE_ACTIVE_SPRITE_COLOR = new Color(255, 255, 255, 255);
const TILE_LOW_LAYER_OPACITY = 210;
const TILE_LOCK_OVERLAP_THRESHOLD = 0.08;
type BoardPointerEvent = EventTouch | EventMouse;
type CanvasPointerEvent = MouseEvent | PointerEvent | TouchEvent;

@ccclass("BoardLayerBinder")
export class BoardLayerBinder extends Component {
  @property(Node)
  tilePool: Node | null = null;

  private tileClickHandler: ((tileId: string) => void) | null = null;
  private readonly tileSpriteCatalog = new HulebuTileSpriteCatalog();
  private readonly pendingSpriteKeys = new WeakMap<Node, string>();
  private readonly currentTiles: Array<{ node: Node; model: HulebuBoardNodeModel }> = [];
  private readonly canvasPointerEndHandler = (event: Event): void => this.handleCanvasPointerEnd(event as CanvasPointerEvent);
  private lastAcceptedPointerAt = 0;

  onLoad(): void {
    this.ensureBoardHitArea();
    this.node.on(Node.EventType.TOUCH_END, this.handleBoardPointerEnd, this);
    this.node.on(Node.EventType.MOUSE_UP, this.handleBoardPointerEnd, this);
    this.bindCanvasPointerEvents();
  }

  onDestroy(): void {
    this.node.off(Node.EventType.TOUCH_END, this.handleBoardPointerEnd, this);
    this.node.off(Node.EventType.MOUSE_UP, this.handleBoardPointerEnd, this);
    this.unbindCanvasPointerEvents();
  }

  setTileClickHandler(handler: ((tileId: string) => void) | null): void {
    this.tileClickHandler = handler;
  }

  applyBoardNodes(nodes: HulebuBoardNodeModel[]): void {
    const layout = resolveHulebuRuntimeLayout();
    const root = this.ensureTilePool();
    this.ensureBoardHitArea();
    root.active = true;
    this.drawLooseTileZone(nodes, layout, root);
    this.currentTiles.length = 0;
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
      this.currentTiles.push({ node: child, model });
    });

    this.currentTiles.forEach(({ node, model }) => {
      const selectable = model.interactable && !model.dimmed && !this.isTileCoveredByHigherTile(node, model);
      this.applyTileVisual(node, model, layout.scale * (model.visualScale ?? 1), selectable);
      this.bindTileClick(node);
    });
  }

  private ensureTilePool(): Node {
    const existing = this.tilePool ?? this.node.getChildByName("TilePool");
    if (existing) {
      this.tilePool = existing;
      return existing;
    }
    const root = new Node("TilePool");
    root.layer = this.node.layer;
    this.node.addChild(root);
    this.tilePool = root;
    return root;
  }

  private drawLooseTileZone(
    nodes: HulebuBoardNodeModel[],
    layout: ReturnType<typeof resolveHulebuRuntimeLayout>,
    tileRoot: Node,
  ): void {
    const looseNodes = nodes.filter((node) => node.displayZone === "loose");
    const panel = this.node.getChildByName("ShakeLoosePoolBackdrop") ?? new Node("ShakeLoosePoolBackdrop");
    panel.layer = this.node.layer;
    if (!panel.parent) {
      this.node.addChild(panel);
    }
    panel.active = looseNodes.length > 0;
    if (looseNodes.length === 0) {
      return;
    }

    const tileWidth = scaleLayoutValue(TILE_WIDTH, layout.scale);
    const tileHeight = scaleLayoutValue(TILE_HEIGHT, layout.scale);
    const xs = looseNodes.map((node) => node.position.x);
    const ys = looseNodes.map((node) => node.position.y);
    const width = Math.max(
      scaleLayoutValue(72, layout.scale),
      Math.max(...xs) - Math.min(...xs) + tileWidth + scaleLayoutValue(18, layout.scale),
    );
    const height = Math.max(
      scaleLayoutValue(78, layout.scale),
      Math.max(...ys) - Math.min(...ys) + tileHeight + scaleLayoutValue(30, layout.scale),
    );
    const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
    const centerY = (Math.min(...ys) + Math.max(...ys)) / 2 + scaleLayoutValue(6, layout.scale);
    panel.setPosition(new Vec3(centerLayoutX(centerX, layout), centerLayoutY(centerY, layout), -10));
    const transform = panel.getComponent(UITransform) ?? panel.addComponent(UITransform);
    transform.setContentSize(width, height);
    const graphics = panel.getComponent(Graphics) ?? panel.addComponent(Graphics);
    graphics.clear();
    graphics.fillColor = new Color(7, 64, 50, 205);
    graphics.strokeColor = TILE_STROKE_COLOR;
    graphics.lineWidth = scaleLayoutValue(2, layout.scale);
    graphics.roundRect(-width / 2, -height / 2, width, height, scaleLayoutValue(8, layout.scale));
    graphics.fill();
    graphics.stroke();

    const labelNode = panel.getChildByName("Title") ?? new Node("Title");
    labelNode.layer = panel.layer;
    if (!labelNode.parent) {
      panel.addChild(labelNode);
    }
    labelNode.setPosition(new Vec3(0, height / 2 - scaleLayoutValue(11, layout.scale), 1));
    const labelTransform = labelNode.getComponent(UITransform) ?? labelNode.addComponent(UITransform);
    labelTransform.setContentSize(width, scaleLayoutValue(18, layout.scale));
    const label = labelNode.getComponent(Label) ?? labelNode.addComponent(Label);
    label.string = `震落牌区 ${looseNodes.length}`;
    label.fontSize = scaleLayoutValue(11, layout.scale);
    label.lineHeight = scaleLayoutValue(14, layout.scale);
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    label.color = new Color(250, 226, 171, 255);
    panel.setSiblingIndex(Math.max(0, tileRoot.getSiblingIndex()));
  }

  private createTileNode(parent: Node, scale = 1): Node {
    const tile = new Node("Tile");
    tile.layer = parent.layer;
    parent.addChild(tile);
    tile.addComponent(UITransform).setContentSize(scaleLayoutValue(TILE_WIDTH, scale), scaleLayoutValue(TILE_HEIGHT, scale));
    tile.addComponent(Graphics);

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

  private applyTileVisual(node: Node, model: HulebuBoardNodeModel, scale: number, selectable: boolean): void {
    const isTopLayer = selectable && model.zIndex >= TILE_TOP_LAYER_THRESHOLD;
    const isLowLayer = model.zIndex === 0 && model.stackDepth && model.stackDepth > 1;
    const layerScale = isTopLayer ? scale * TILE_TOP_SCALE_BOOST : scale;
    const width = scaleLayoutValue(TILE_WIDTH, layerScale);
    const height = scaleLayoutValue(TILE_HEIGHT, layerScale);
    let uiTransform = node.getComponent(UITransform);
    if (!uiTransform) {
      uiTransform = node.addComponent(UITransform);
    }
    uiTransform.setContentSize(width, height);

    const graphics = node.getComponent(Graphics) ?? node.addComponent(Graphics);
    this.drawTileFace(graphics, width, height, selectable, scale, isTopLayer);

    const label = node.getComponentInChildren(Label) ?? this.createTileLabel(node, scale);
    label.string = "";
    label.node.active = false;

    this.applyTileSprite(node, model, layerScale, label, selectable);

    const existingBtn = node.getComponent(Button);
    if (existingBtn) {
      node.removeComponent(existingBtn);
    }
    this.configureTileInputBlocker(node);

    if (selectable) {
      this.setOpacity(node, 255);
    } else {
      this.setOpacity(node, TILE_LOW_LAYER_OPACITY);
    }
  }

  private applyTileSprite(node: Node, model: HulebuBoardNodeModel, scale: number, label: Label, selectable: boolean): void {
    const artNode = this.ensureTileArtNode(node, scale);
    const sprite = artNode.getComponent(Sprite) ?? artNode.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    sprite.spriteFrame = null;
    sprite.color = TILE_ACTIVE_SPRITE_COLOR;
    artNode.active = false;
    label.node.active = true;

    const tileKey = selectable ? model.prefabKey : "tile.back";
    const spriteRequestKey = `${model.prefabKey}:${selectable ? "face" : "back"}`;
    this.pendingSpriteKeys.set(node, spriteRequestKey);
    this.tileSpriteCatalog.loadTileSpriteFrame(tileKey, (spriteFrame: SpriteFrame | null) => {
      if (this.pendingSpriteKeys.get(node) !== spriteRequestKey || !spriteFrame) {
        return;
      }

      if (!safeApplySpriteFrame(artNode, sprite, spriteFrame)) {
        return;
      }
      this.clearProgrammaticTileFace(node);
      sprite.color = TILE_ACTIVE_SPRITE_COLOR;
      artNode.active = true;
      label.node.active = false;
    });
  }

  private clearProgrammaticTileFace(node: Node): void {
    node.getComponent(Graphics)?.clear();
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
    const hiddenLayers = Math.max(0, stackDepth - 1);
    graphics.clear();

    if (hiddenLayers <= 0) {
      hintNode.active = false;
      return;
    }

    hintNode.active = true;
    const badgeSize = scaleLayoutValue(16, scale);
    const badgeX = scaleLayoutValue(TILE_WIDTH, scale) / 2 - scaleLayoutValue(2, scale);
    const badgeY = scaleLayoutValue(TILE_HEIGHT, scale) / 2 - scaleLayoutValue(2, scale);

    graphics.fillColor = new Color(244, 192, 74, 255);
    graphics.strokeColor = new Color(120, 72, 29, 255);
    graphics.lineWidth = scaleLayoutValue(1, scale);
    graphics.circle(badgeX - badgeSize / 2, badgeY - badgeSize / 2, badgeSize / 2);
    graphics.fill();
    graphics.stroke();

    const labelNode = hintNode.getChildByName("StackDepthLabel");
    if (labelNode) {
      const label = labelNode.getComponent(Label);
      if (label) {
        label.string = String(hiddenLayers);
      }
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

      const labelNode = new Node("StackDepthLabel");
      labelNode.layer = parent.layer;
      hintNode.addChild(labelNode);
      const labelTransform = labelNode.addComponent(UITransform);
      labelTransform.setContentSize(width, height);
      const label = labelNode.addComponent(Label);
      label.fontSize = scaleLayoutValue(10, scale);
      label.lineHeight = scaleLayoutValue(12, scale);
      label.horizontalAlign = Label.HorizontalAlign.CENTER;
      label.verticalAlign = Label.VerticalAlign.CENTER;
      label.color = new Color(42, 32, 24, 255);
    }

    let uiTransform = hintNode.getComponent(UITransform);
    if (!uiTransform) {
      uiTransform = hintNode.addComponent(UITransform);
    }
    uiTransform.setContentSize(width, height);
    const badgeSize = scaleLayoutValue(16, scale);
    const labelNode = hintNode.getChildByName("StackDepthLabel");
    if (labelNode) {
      labelNode.setPosition(
        new Vec3(width / 2 - scaleLayoutValue(2, scale) - badgeSize / 2, height / 2 - scaleLayoutValue(2, scale) - badgeSize / 2, 0),
      );
      const label = labelNode.getComponent(Label);
      if (label) {
        label.fontSize = scaleLayoutValue(10, scale);
        label.lineHeight = scaleLayoutValue(12, scale);
      }
    }
    return hintNode;
  }

  private bindTileClick(node: Node): void {
    node.targetOff(this);
  }

  private isTileCurrentlySelectable(node: Node, model: HulebuBoardNodeModel, uiPoint: Vec2): boolean {
    if (!model.interactable || model.dimmed || !node.activeInHierarchy) {
      return false;
    }

    const tileRect = this.getTileEventRect(model);
    if (!tileRect || !tileRect.contains(uiPoint)) {
      return false;
    }

    return !this.isTileCoveredByHigherTile(node, model);
  }

  private isTileCoveredByHigherTile(node: Node, model: HulebuBoardNodeModel): boolean {
    const tileRect = this.getTileEventRect(model);
    return this.currentTiles.some(({ node: candidateNode, model: candidateModel }) => {
      if (candidateNode === node || !candidateNode.activeInHierarchy || candidateModel.zIndex <= model.zIndex) {
        return false;
      }
      const candidateRect = this.getTileEventRect(candidateModel);
      return Boolean(candidateRect && this.getOverlapRatio(tileRect, candidateRect) >= TILE_LOCK_OVERLAP_THRESHOLD);
    });
  }

  private handleBoardPointerEnd(event: BoardPointerEvent): void {
    const uiPoint = this.getBoardPointerUiLocation(event);
    if (!this.selectTileAtUiPoint(uiPoint)) {
      return;
    }

    event.propagationStopped = true;
  }

  private handleCanvasPointerEnd(event: CanvasPointerEvent): void {
    const uiPoint = this.getCanvasPointerLayoutLocation(event);
    if (!uiPoint || !this.selectTileAtUiPoint(uiPoint)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }

  private selectTileAtUiPoint(uiPoint: Vec2): boolean {
    const hitTile = this.currentTiles
      .filter(({ node, model }) => node.activeInHierarchy && this.getTileEventRect(model).contains(uiPoint))
      .sort((left, right) => {
        const siblingDelta = right.node.getSiblingIndex() - left.node.getSiblingIndex();
        return siblingDelta !== 0 ? siblingDelta : right.model.zIndex - left.model.zIndex;
      })[0];

    if (!hitTile) {
      return false;
    }

    if (!this.isTileCurrentlySelectable(hitTile.node, hitTile.model, uiPoint)) {
      return true;
    }

    if (!this.acceptPointerSelection()) {
      return true;
    }

    this.tileClickHandler?.(hitTile.model.tileId);
    return true;
  }

  private getBoardPointerUiLocation(event: BoardPointerEvent): Vec2 {
    const pointerEvent = event as BoardPointerEvent & {
      getUILocation?: () => Vec2;
      getLocation?: () => Vec2;
    };
    return pointerEvent.getUILocation?.() ?? pointerEvent.getLocation?.() ?? new Vec2();
  }

  private bindCanvasPointerEvents(): void {
    game.canvas?.addEventListener("pointerup", this.canvasPointerEndHandler);
    game.canvas?.addEventListener("mouseup", this.canvasPointerEndHandler);
    game.canvas?.addEventListener("touchend", this.canvasPointerEndHandler);
  }

  private unbindCanvasPointerEvents(): void {
    game.canvas?.removeEventListener("pointerup", this.canvasPointerEndHandler);
    game.canvas?.removeEventListener("mouseup", this.canvasPointerEndHandler);
    game.canvas?.removeEventListener("touchend", this.canvasPointerEndHandler);
  }

  private getCanvasPointerLayoutLocation(event: CanvasPointerEvent): Vec2 | null {
    const canvas = game.canvas;
    if (!canvas) {
      return null;
    }

    const pointer = this.getCanvasPointerClientPosition(event);
    if (!pointer) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();
    const layout = resolveHulebuRuntimeLayout();
    const scale = rect.width / layout.width;
    if (!Number.isFinite(scale) || scale <= 0) {
      return null;
    }

    return new Vec2(
      (pointer.x - rect.left - rect.width / 2) / scale + layout.width / 2,
      (pointer.y - rect.top - rect.height / 2) / scale + layout.height / 2,
    );
  }

  private getCanvasPointerClientPosition(event: CanvasPointerEvent): Vec2 | null {
    if ("changedTouches" in event && event.changedTouches.length > 0) {
      const touch = event.changedTouches[0];
      return new Vec2(touch.clientX, touch.clientY);
    }

    if ("clientX" in event && "clientY" in event) {
      return new Vec2(event.clientX, event.clientY);
    }

    return null;
  }

  private acceptPointerSelection(): boolean {
    const now = Date.now();
    if (now - this.lastAcceptedPointerAt < 80) {
      return false;
    }

    this.lastAcceptedPointerAt = now;
    return true;
  }

  private ensureBoardHitArea(): void {
    const layout = resolveHulebuRuntimeLayout();
    const transform = this.node.getComponent(UITransform) ?? this.node.addComponent(UITransform);
    transform.setContentSize(layout.width, layout.height);
  }

  private getTileEventRect(model: HulebuBoardNodeModel): Rect {
    const layout = resolveHulebuRuntimeLayout();
    const isTopLayer = model.interactable && model.zIndex >= TILE_TOP_LAYER_THRESHOLD;
    const baseScale = layout.scale * (model.visualScale ?? 1);
    const layerScale = isTopLayer ? baseScale * TILE_TOP_SCALE_BOOST : baseScale;
    const width = scaleLayoutValue(TILE_WIDTH, layerScale);
    const height = scaleLayoutValue(TILE_HEIGHT, layerScale);
    const centerX = model.position.x;
    const centerY = layout.height - model.position.y;
    return new Rect(centerX - width / 2, centerY - height / 2, width, height);
  }

  private getOverlapRatio(target: Rect, blocker: Rect): number {
    const left = Math.max(target.xMin, blocker.xMin);
    const right = Math.min(target.xMax, blocker.xMax);
    const bottom = Math.max(target.yMin, blocker.yMin);
    const top = Math.min(target.yMax, blocker.yMax);
    const width = Math.max(0, right - left);
    const height = Math.max(0, top - bottom);
    const targetArea = Math.max(1, target.width * target.height);
    return (width * height) / targetArea;
  }

  private configureTileInputBlocker(node: Node): void {
    const blocker = node.getComponent(BlockInputEvents) ?? node.addComponent(BlockInputEvents);
    blocker.enabled = false;
  }

  private drawTileFace(graphics: Graphics, width: number, height: number, interactable: boolean, scale: number, isTopLayer = false): void {
    const sideOffset = scaleLayoutValue(6, scale);
    const radius = scaleLayoutValue(8, scale);
    graphics.clear();
    graphics.fillColor = isTopLayer ? TILE_TOP_SIDE_COLOR : TILE_SIDE_COLOR;
    graphics.strokeColor = new Color(19, 82, 61, 255);
    graphics.lineWidth = scaleLayoutValue(2, scale);
    graphics.roundRect(-width / 2, -height / 2 - sideOffset, width, height, radius);
    graphics.fill();
    graphics.stroke();

    graphics.fillColor = interactable
      ? (isTopLayer ? TILE_TOP_FACE_COLOR : TILE_FACE_COLOR)
      : TILE_LOCKED_FACE_COLOR;
    graphics.strokeColor = isTopLayer
      ? TILE_TOP_STROKE_GLOW
      : (interactable ? TILE_STROKE_COLOR : new Color(114, 122, 112, 255));
    graphics.lineWidth = scaleLayoutValue(isTopLayer ? 5 : 4, scale);
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
