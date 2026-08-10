import { _decorator, Button, Color, Component, Graphics, Label, Node, resources, Sprite, SpriteFrame, UITransform, Vec3 } from "cc";
import {
  centerLayoutX,
  centerLayoutY,
  resolveHulebuRuntimeLayout,
  scaleLayoutValue,
} from "./bootstrap/HulebuSampleSceneModel";
import type { HulebuComboControlModel } from "./contracts/HulebuSceneModel";
import { safeApplySpriteFrame } from "./utils/HulebuSpriteSafety";
import { HULEBU_FORMAL_UI_SPRITES } from "./assets/HulebuFormalUiCatalog";
import { resolveHulebuPortraitZones } from "./bootstrap/HulebuPortraitLayout";

const { ccclass, property } = _decorator;
const COMBO_WIDTH = 66;
const COMBO_HEIGHT = 50;
const COMBO_GAP = 5;
const COMBO_LABELS: Record<string, string> = {
  hu: "胡",
  gang: "杠",
  peng: "碰",
  chi: "吃",
  bugang: "补杠",
};
const COMBO_BUTTON_SPRITES: Record<string, { active: string; inactive: string }> = {
  hu: {
    active: HULEBU_FORMAL_UI_SPRITES.actions.hu.active,
    inactive: HULEBU_FORMAL_UI_SPRITES.actions.hu.normal,
  },
  gang: {
    active: HULEBU_FORMAL_UI_SPRITES.actions.gang.active,
    inactive: HULEBU_FORMAL_UI_SPRITES.actions.gang.normal,
  },
  peng: {
    active: HULEBU_FORMAL_UI_SPRITES.actions.peng.active,
    inactive: HULEBU_FORMAL_UI_SPRITES.actions.peng.normal,
  },
  chi: {
    active: HULEBU_FORMAL_UI_SPRITES.actions.chi.active,
    inactive: HULEBU_FORMAL_UI_SPRITES.actions.chi.normal,
  },
  bugang: {
    active: HULEBU_FORMAL_UI_SPRITES.actions.bugang.active,
    inactive: HULEBU_FORMAL_UI_SPRITES.actions.bugang.normal,
  },
};

@ccclass("ComboBarBinder")
export class ComboBarBinder extends Component {
  @property([Node])
  comboButtons: Node[] = [];

  private comboClickHandler: ((combo: HulebuComboControlModel["combo"]) => void) | null = null;
  private readonly comboTouchHandlers = new WeakMap<Node, () => void>();
  private readonly pendingSpritePaths = new WeakMap<Node, string>();

  setComboClickHandler(handler: ((combo: HulebuComboControlModel["combo"]) => void) | null): void {
    this.comboClickHandler = handler;
  }

  applyComboControls(controls: HulebuComboControlModel[]): void {
    const layout = this.getVisibleLayout();
    controls.forEach((control, index) => {
      const node = this.comboButtons.find((item) => item.name === control.name) ?? this.ensureComboButton(control, index);
      this.prepareComboButton(node, layout.scale, index);
      node.setPosition(
        new Vec3(centerLayoutX(layout.startX + index * layout.stepX, layout), centerLayoutY(layout.comboY, layout), 0),
      );
      const button = node.getComponent(Button);
      button!.interactable = control.interactable;

      const label = node.getComponentInChildren(Label);
      if (label) {
        label.string = `${COMBO_LABELS[control.combo]} ${control.badgeText}`;
      }

      this.drawButton(node, control.interactable, layout.scale);
      this.applyComboSprite(node, control, layout.scale);
      this.bindComboClick(node, control);
    });
  }

  private ensureComboButton(control: HulebuComboControlModel, index: number): Node {
    const existing = this.node.getChildByName(control.name);
    const node = existing ?? new Node(control.name);
    node.layer = this.node.layer;
    if (!existing) {
      this.node.addChild(node);
    }
    const uiTransform = node.getComponent(UITransform) ?? node.addComponent(UITransform);
    uiTransform.setContentSize(COMBO_WIDTH, COMBO_HEIGHT);
    node.getComponent(Graphics) ?? node.addComponent(Graphics);
    node.getComponent(Button) ?? node.addComponent(Button);

    let label = node.getComponentInChildren(Label);
    if (!label) {
      const labelNode = new Node("Label");
      labelNode.layer = this.node.layer;
      node.addChild(labelNode);
      labelNode.addComponent(UITransform).setContentSize(COMBO_WIDTH, COMBO_HEIGHT);
      label = labelNode.addComponent(Label);
      label.fontSize = 16;
      label.lineHeight = 20;
      label.horizontalAlign = Label.HorizontalAlign.CENTER;
      label.verticalAlign = Label.VerticalAlign.CENTER;
    }
    label.color = new Color(255, 249, 236, 255);

    this.comboButtons[index] = node;
    return node;
  }

  private prepareComboButton(node: Node, scale: number, index: number): void {
    node.layer = this.node.layer;
    const uiTransform = node.getComponent(UITransform) ?? node.addComponent(UITransform);
    uiTransform.setContentSize(scaleLayoutValue(COMBO_WIDTH, scale), scaleLayoutValue(COMBO_HEIGHT, scale));
    node.getComponent(Graphics) ?? node.addComponent(Graphics);
    node.getComponent(Button) ?? node.addComponent(Button);

    let label = node.getComponentInChildren(Label);
    if (!label) {
      const labelNode = new Node("Label");
      labelNode.layer = this.node.layer;
      node.addChild(labelNode);
      labelNode.addComponent(UITransform).setContentSize(COMBO_WIDTH, COMBO_HEIGHT);
      label = labelNode.addComponent(Label);
    }

    label.node.setPosition(new Vec3(0, 0, 0));
    const labelTransform = label.node.getComponent(UITransform) ?? label.node.addComponent(UITransform);
    labelTransform.setContentSize(scaleLayoutValue(COMBO_WIDTH, scale), scaleLayoutValue(COMBO_HEIGHT, scale));
    label.fontSize = scaleLayoutValue(16, scale);
    label.lineHeight = scaleLayoutValue(20, scale);
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    label.color = new Color(255, 249, 236, 255);
    this.comboButtons[index] = node;
  }

  private drawButton(node: Node, interactable: boolean, scale: number): void {
    const width = scaleLayoutValue(COMBO_WIDTH, scale);
    const height = scaleLayoutValue(COMBO_HEIGHT, scale);
    const graphics = node.getComponent(Graphics) ?? node.addComponent(Graphics);
    graphics.clear();
    graphics.fillColor = interactable ? new Color(31, 139, 107, 255) : new Color(98, 88, 78, 255);
    graphics.strokeColor = interactable ? new Color(244, 197, 96, 255) : new Color(130, 118, 104, 255);
    graphics.lineWidth = scaleLayoutValue(3, scale);
    graphics.roundRect(-width / 2, -height / 2, width, height, scaleLayoutValue(6, scale));
    graphics.fill();
    graphics.stroke();
  }

  private applyComboSprite(node: Node, control: HulebuComboControlModel, scale: number): void {
    const artNode = this.ensureComboArtNode(node, scale);
    const sprite = artNode.getComponent(Sprite) ?? artNode.addComponent(Sprite);
    const spritePaths = COMBO_BUTTON_SPRITES[control.combo];
    const spritePath = control.interactable ? spritePaths.active : spritePaths.inactive;
    const label = node.getComponentInChildren(Label);

    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    sprite.spriteFrame = null;
    artNode.active = false;
    if (label) {
      label.node.active = true;
    }

    this.pendingSpritePaths.set(node, spritePath);
    resources.load(spritePath, SpriteFrame, (error, spriteFrame) => {
      if (this.pendingSpritePaths.get(node) !== spritePath || error || !spriteFrame) {
        return;
      }

      if (!safeApplySpriteFrame(artNode, sprite, spriteFrame)) {
        return;
      }
      artNode.active = true;
      if (label) {
        label.node.active = false;
      }
    });
  }

  private ensureComboArtNode(parent: Node, scale: number): Node {
    let artNode = parent.getChildByName("ComboArt");
    if (!artNode) {
      artNode = new Node("ComboArt");
      artNode.layer = parent.layer;
      parent.addChild(artNode);
    }

    const uiTransform = artNode.getComponent(UITransform) ?? artNode.addComponent(UITransform);
    uiTransform.setContentSize(scaleLayoutValue(COMBO_WIDTH, scale), scaleLayoutValue(COMBO_HEIGHT, scale));
    artNode.setSiblingIndex(parent.children.length - 1);
    return artNode;
  }

  private bindComboClick(node: Node, control: HulebuComboControlModel): void {
    const existing = this.comboTouchHandlers.get(node);
    if (existing) {
      node.off(Node.EventType.TOUCH_END, existing, this);
      node.off(Button.EventType.CLICK, existing, this);
    }

    const handler = (): void => {
      if (!control.interactable) {
        return;
      }

      this.comboClickHandler?.(control.combo);
    };

    node.on(Node.EventType.TOUCH_END, handler, this);
    node.on(Button.EventType.CLICK, handler, this);
    this.comboTouchHandlers.set(node, handler);
  }

  private getVisibleLayout(): { width: number; height: number; startX: number; stepX: number; comboY: number; scale: number } {
    const visibleSize = getVisibleLayoutSize();
    const zones = resolveHulebuPortraitZones(visibleSize);
    const stepX = scaleLayoutValue(COMBO_WIDTH + COMBO_GAP, visibleSize.scale);
    const totalWidth = COMBO_WIDTH * 5 + COMBO_GAP * 4;
    return {
      startX: Math.round(visibleSize.width / 2 - scaleLayoutValue(totalWidth, visibleSize.scale) / 2 + scaleLayoutValue(COMBO_WIDTH / 2, visibleSize.scale)),
      stepX,
      comboY: zones.comboY,
      scale: visibleSize.scale,
      width: visibleSize.width,
      height: visibleSize.height,
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
