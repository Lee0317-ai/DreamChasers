import { _decorator, Color, Component, Graphics, Label, Node, Sprite, SpriteFrame, UITransform, Vec3 } from "cc";
import {
  centerLayoutX,
  centerLayoutY,
  resolveHulebuRuntimeLayout,
  scaleLayoutValue,
} from "./bootstrap/HulebuSampleSceneModel";
import type { HulebuOpenMeldNodeModel, HulebuRiverNodeModel } from "./contracts/HulebuSceneModel";
import { HulebuTileSpriteCatalog } from "./assets/HulebuTileSpriteCatalog";
import { safeApplySpriteFrame } from "./utils/HulebuSpriteSafety";
import { resolveHulebuPortraitZones } from "./bootstrap/HulebuPortraitLayout";

const { ccclass, property } = _decorator;
const MELD_WIDTH = 82;
const MELD_HEIGHT = 56;
const RIVER_CELL_WIDTH = 46;
const RIVER_CELL_HEIGHT = 62;
const GAP = 7;
const MELD_TILE_WIDTH = 19;
const MELD_TILE_HEIGHT = 27;
const RIVER_TILE_WIDTH = 36;
const RIVER_TILE_HEIGHT = 48;
const PANEL_FILL = new Color(248, 238, 220, 242);
const PANEL_STROKE = new Color(188, 146, 86, 235);
const PANEL_EMPTY_FILL = new Color(110, 88, 66, 165);
const BADGE_FILL = new Color(43, 117, 89, 240);
const BADGE_TEXT = new Color(255, 248, 236, 255);
const LABEL_TEXT = new Color(56, 42, 30, 255);

@ccclass("MeldRiverLayerBinder")
export class MeldRiverLayerBinder extends Component {
  @property([Node])
  meldNodes: Node[] = [];

  @property([Node])
  riverNodes: Node[] = [];

  private readonly tileSpriteCatalog = new HulebuTileSpriteCatalog();
  private readonly pendingSpriteKeys = new WeakMap<Node, string>();

  applyMeldRiverNodes(openMelds: HulebuOpenMeldNodeModel[], riverNodes: HulebuRiverNodeModel[]): void {
    const layout = resolveHulebuRuntimeLayout();
    this.applyOpenMelds(openMelds, layout);
    this.applyRiver(riverNodes, layout);
  }

  private applyOpenMelds(openMelds: HulebuOpenMeldNodeModel[], layout: ReturnType<typeof resolveHulebuRuntimeLayout>): void {
    const y = resolveHulebuPortraitZones(layout).meldY;
    const visibleMelds = openMelds.slice(0, 4);
    const totalWidth = visibleMelds.length * MELD_WIDTH + Math.max(0, visibleMelds.length - 1) * GAP;
    const poolWidth = Math.max(150, Math.min(366, totalWidth + 20));
    this.drawOpenMeldPool(y, poolWidth, visibleMelds.length, layout);
    const startX = Math.round(layout.width / 2 - scaleLayoutValue(totalWidth / 2 - MELD_WIDTH / 2, layout.scale));
    this.meldNodes.forEach((node) => {
      node.active = false;
    });

    visibleMelds.forEach((meld, index) => {
      const node = this.meldNodes[index] ?? this.ensureNode("OpenMeld", index, MELD_WIDTH, MELD_HEIGHT, layout.scale);
      this.meldNodes[index] = node;
      node.name = meld.name;
      node.active = true;
      node.setPosition(new Vec3(
        centerLayoutX(startX + index * scaleLayoutValue(MELD_WIDTH + GAP, layout.scale), layout),
        centerLayoutY(y - scaleLayoutValue(8, layout.scale), layout),
        0,
      ));
      this.drawMeld(node, meld, layout.scale);
    });
  }

  private drawOpenMeldPool(
    y: number,
    width: number,
    meldCount: number,
    layout: ReturnType<typeof resolveHulebuRuntimeLayout>,
  ): void {
    const panel = this.node.getChildByName("OpenMeldPoolBackdrop") ?? new Node("OpenMeldPoolBackdrop");
    panel.layer = this.node.layer;
    if (!panel.parent) {
      this.node.addChild(panel);
    }
    panel.active = true;
    panel.setPosition(new Vec3(0, centerLayoutY(y, layout), -1));
    panel.setSiblingIndex(0);
    const transform = panel.getComponent(UITransform) ?? panel.addComponent(UITransform);
    transform.setContentSize(scaleLayoutValue(width, layout.scale), scaleLayoutValue(82, layout.scale));
    const graphics = panel.getComponent(Graphics) ?? panel.addComponent(Graphics);
    graphics.clear();
    graphics.fillColor = new Color(7, 64, 50, 224);
    graphics.strokeColor = PANEL_STROKE;
    graphics.lineWidth = scaleLayoutValue(2, layout.scale);
    graphics.roundRect(-transform.width / 2, -transform.height / 2, transform.width, transform.height, scaleLayoutValue(8, layout.scale));
    graphics.fill();
    graphics.stroke();

    const title = this.ensureLabel(panel, "Title");
    title.string = meldCount > 0 ? "已碰牌池" : "已碰牌池 · 暂无";
    title.fontSize = scaleLayoutValue(11, layout.scale);
    title.lineHeight = scaleLayoutValue(14, layout.scale);
    title.color = new Color(250, 226, 171, 255);
    title.node.setPosition(new Vec3(0, scaleLayoutValue(31, layout.scale), 2));
    title.node.getComponent(UITransform)?.setContentSize(transform.width, scaleLayoutValue(18, layout.scale));
  }

  private applyRiver(riverNodes: HulebuRiverNodeModel[], layout: ReturnType<typeof resolveHulebuRuntimeLayout>): void {
    const y = resolveHulebuPortraitZones(layout).riverY;
    const totalWidth = riverNodes.length * RIVER_CELL_WIDTH + Math.max(0, riverNodes.length - 1) * GAP;
    const startX = Math.round(layout.width / 2 - scaleLayoutValue(totalWidth / 2 - RIVER_CELL_WIDTH / 2, layout.scale));
    this.riverNodes.forEach((node) => {
      node.active = false;
    });

    riverNodes.forEach((river, index) => {
      const node = this.riverNodes[index] ?? this.ensureNode("River", index, RIVER_CELL_WIDTH, RIVER_CELL_HEIGHT, layout.scale);
      this.riverNodes[index] = node;
      node.name = river.name;
      node.active = river.occupied;
      node.setPosition(new Vec3(centerLayoutX(startX + index * scaleLayoutValue(RIVER_CELL_WIDTH + GAP, layout.scale), layout), centerLayoutY(y, layout), 0));
      this.drawRiverCell(node, river, layout.scale);
    });
  }

  private ensureNode(prefix: string, index: number, width: number, height: number, scale: number): Node {
    const existing = this.node.getChildByName(`${prefix}_${index}`);
    const node = existing ?? new Node(`${prefix}_${index}`);
    node.layer = this.node.layer;
    if (!existing) {
      this.node.addChild(node);
    }
    const uiTransform = node.getComponent(UITransform) ?? node.addComponent(UITransform);
    uiTransform.setContentSize(scaleLayoutValue(width, scale), scaleLayoutValue(height, scale));
    node.getComponent(Graphics) ?? node.addComponent(Graphics);
    this.ensureLabel(node, "FallbackLabel");
    return node;
  }

  private drawMeld(node: Node, meld: HulebuOpenMeldNodeModel, scale: number): void {
    const uiTransform = node.getComponent(UITransform);
    const graphics = node.getComponent(Graphics) ?? node.addComponent(Graphics);
    const width = uiTransform?.width ?? scaleLayoutValue(MELD_WIDTH, scale);
    const height = uiTransform?.height ?? scaleLayoutValue(MELD_HEIGHT, scale);
    graphics.clear();
    graphics.fillColor = PANEL_FILL;
    graphics.strokeColor = PANEL_STROKE;
    graphics.lineWidth = scaleLayoutValue(2, scale);
    graphics.roundRect(-width / 2, -height / 2, width, height, scaleLayoutValue(5, scale));
    graphics.fill();
    graphics.stroke();

    const badgeLabel = this.ensureLabel(node, "BadgeLabel");
    badgeLabel.string = this.getComboLabel(meld.type);
    badgeLabel.fontSize = scaleLayoutValue(12, scale);
    badgeLabel.lineHeight = scaleLayoutValue(15, scale);
    badgeLabel.color = BADGE_TEXT;
    badgeLabel.node.setPosition(new Vec3(0, scaleLayoutValue(15, scale), 2));
    badgeLabel.node.getComponent(UITransform)?.setContentSize(scaleLayoutValue(44, scale), scaleLayoutValue(16, scale));
    this.drawBadge(node, badgeLabel.node, scale);

    const fallbackLabel = this.ensureLabel(node, "FallbackLabel");
    fallbackLabel.string = `${meld.label} x${meld.count}`;
    fallbackLabel.fontSize = scaleLayoutValue(11, scale);
    fallbackLabel.lineHeight = scaleLayoutValue(14, scale);
    fallbackLabel.color = LABEL_TEXT;
    fallbackLabel.node.setPosition(new Vec3(0, scaleLayoutValue(-16, scale), 3));
    fallbackLabel.node.getComponent(UITransform)?.setContentSize(scaleLayoutValue(72, scale), scaleLayoutValue(16, scale));

    const occupiedTiles = Math.max(0, Math.min(4, meld.count));
    for (let index = 0; index < 4; index += 1) {
      const tileNode = this.ensureTileArtNode(node, "MeldTile", index, MELD_TILE_WIDTH, MELD_TILE_HEIGHT, scale);
      tileNode.active = index < occupiedTiles;
      tileNode.setPosition(new Vec3(scaleLayoutValue((index - (occupiedTiles - 1) / 2) * 18, scale), scaleLayoutValue(-6, scale), 1));
      if (index < occupiedTiles) {
        this.applyTileSprite(tileNode, meld.prefabKey, meld.label, scale, fallbackLabel);
      }
    }
  }

  private drawRiverCell(node: Node, river: HulebuRiverNodeModel, scale: number): void {
    const uiTransform = node.getComponent(UITransform);
    const graphics = node.getComponent(Graphics) ?? node.addComponent(Graphics);
    const width = uiTransform?.width ?? scaleLayoutValue(RIVER_CELL_WIDTH, scale);
    const height = uiTransform?.height ?? scaleLayoutValue(RIVER_CELL_HEIGHT, scale);
    graphics.clear();
    graphics.fillColor = river.occupied ? PANEL_FILL : PANEL_EMPTY_FILL;
    graphics.strokeColor = PANEL_STROKE;
    graphics.lineWidth = scaleLayoutValue(2, scale);
    graphics.roundRect(-width / 2, -height / 2, width, height, scaleLayoutValue(5, scale));
    graphics.fill();
    graphics.stroke();

    const fallbackLabel = this.ensureLabel(node, "FallbackLabel");
    fallbackLabel.fontSize = scaleLayoutValue(11, scale);
    fallbackLabel.lineHeight = scaleLayoutValue(14, scale);
    fallbackLabel.color = river.occupied ? LABEL_TEXT : BADGE_TEXT;
    fallbackLabel.string = river.occupied ? (river.label ?? "") : "空";
    fallbackLabel.node.setPosition(new Vec3(0, river.occupied ? scaleLayoutValue(-20, scale) : 0, 3));
    fallbackLabel.node.getComponent(UITransform)?.setContentSize(scaleLayoutValue(width, 1), scaleLayoutValue(16, scale));

    const tileNode = this.ensureTileArtNode(node, "RiverTile", 0, RIVER_TILE_WIDTH, RIVER_TILE_HEIGHT, scale);
    tileNode.active = river.occupied;
    tileNode.setPosition(new Vec3(0, scaleLayoutValue(4, scale), 1));
    if (river.occupied) {
      this.applyTileSprite(tileNode, river.prefabKey, river.label ?? "", scale, fallbackLabel);
    }
  }

  private drawBadge(parent: Node, badgeNode: Node, scale: number): void {
    let graphics = badgeNode.getComponent(Graphics);
    if (!graphics) {
      graphics = badgeNode.addComponent(Graphics);
    }
    const width = scaleLayoutValue(44, scale);
    const height = scaleLayoutValue(16, scale);
    graphics.clear();
    graphics.fillColor = BADGE_FILL;
    graphics.strokeColor = PANEL_STROKE;
    graphics.lineWidth = scaleLayoutValue(1.5, scale);
    graphics.roundRect(-width / 2, -height / 2, width, height, scaleLayoutValue(6, scale));
    graphics.fill();
    graphics.stroke();
  }

  private ensureLabel(node: Node, childName: string): Label {
    const labelNode = node.getChildByName(childName) ?? new Node(childName);
    labelNode.layer = node.layer;
    if (!labelNode.parent) {
      node.addChild(labelNode);
    }
    const nodeTransform = node.getComponent(UITransform);
    const labelTransform = labelNode.getComponent(UITransform) ?? labelNode.addComponent(UITransform);
    labelTransform.setContentSize(nodeTransform?.width ?? 64, nodeTransform?.height ?? 28);
    const label = labelNode.getComponent(Label) ?? labelNode.addComponent(Label);
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    return label;
  }

  private ensureTileArtNode(parent: Node, prefix: string, index: number, width: number, height: number, scale: number): Node {
    const childName = `${prefix}_${index}`;
    let artNode = parent.getChildByName(childName);
    if (!artNode) {
      artNode = new Node(childName);
      artNode.layer = parent.layer;
      parent.addChild(artNode);
    }

    const uiTransform = artNode.getComponent(UITransform) ?? artNode.addComponent(UITransform);
    uiTransform.setContentSize(scaleLayoutValue(width, scale), scaleLayoutValue(height, scale));
    const sprite = artNode.getComponent(Sprite) ?? artNode.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    return artNode;
  }

  private applyTileSprite(tileNode: Node, prefabKey: string | null, fallbackText: string, scale: number, fallbackLabel: Label): void {
    const sprite = tileNode.getComponent(Sprite) ?? tileNode.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    sprite.spriteFrame = null;

    if (!prefabKey) {
      tileNode.active = false;
      fallbackLabel.string = fallbackText;
      fallbackLabel.node.active = true;
      return;
    }

    this.pendingSpriteKeys.set(tileNode, prefabKey);
    this.tileSpriteCatalog.loadTileSpriteFrame(prefabKey, (spriteFrame: SpriteFrame | null) => {
      if (this.pendingSpriteKeys.get(tileNode) !== prefabKey) {
        return;
      }

      if (!spriteFrame) {
        tileNode.active = false;
        fallbackLabel.string = fallbackText;
        fallbackLabel.node.active = true;
        return;
      }

      if (!safeApplySpriteFrame(tileNode, sprite, spriteFrame)) {
        return;
      }
      tileNode.active = true;
      fallbackLabel.node.active = false;
    });
  }

  private getComboLabel(type: HulebuOpenMeldNodeModel["type"]): string {
    if (type === "bugang") {
      return "补杠";
    }
    return type === "gang" ? "杠" : "碰";
  }
}
