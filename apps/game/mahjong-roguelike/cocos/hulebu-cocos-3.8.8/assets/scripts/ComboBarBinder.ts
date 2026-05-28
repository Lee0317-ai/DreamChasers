import { _decorator, Button, Color, Component, Graphics, Label, Node, UITransform, Vec3 } from "cc";
import {
  centerLayoutX,
  centerLayoutY,
  resolveHulebuRuntimeLayout,
  scaleLayoutValue,
} from "./bootstrap/HulebuSampleSceneModel";
import type { HulebuComboControlModel } from "./contracts/HulebuSceneModel";

const { ccclass, property } = _decorator;
const COMBO_WIDTH = 78;
const COMBO_HEIGHT = 38;
const COMBO_GAP = 8;
const COMBO_LABELS: Record<string, string> = {
  hu: "胡",
  gang: "杠",
  peng: "碰",
  chi: "吃",
};

@ccclass("ComboBarBinder")
export class ComboBarBinder extends Component {
  @property([Node])
  comboButtons: Node[] = [];

  private comboClickHandler: ((combo: HulebuComboControlModel["combo"]) => void) | null = null;
  private readonly comboTouchHandlers = new WeakMap<Node, () => void>();

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
    const stepX = scaleLayoutValue(COMBO_WIDTH + COMBO_GAP, visibleSize.scale);
    const totalWidth = COMBO_WIDTH * 4 + COMBO_GAP * 3;
    return {
      startX: Math.round(visibleSize.width / 2 - scaleLayoutValue(totalWidth, visibleSize.scale) / 2 + scaleLayoutValue(COMBO_WIDTH / 2, visibleSize.scale)),
      stepX,
      comboY: scaleLayoutValue(Math.max(140, visibleSize.cssHeight * 0.28), visibleSize.scale),
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
