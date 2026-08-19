import { _decorator, Color, Component, Graphics, Label, Node, resources, Sprite, SpriteFrame, tween, UITransform, Vec3 } from "cc";
import { HULEBU_V3_UI_SPRITES } from "./assets/HulebuV3UiCatalog";
import { centerLayoutX, centerLayoutY, resolveHulebuRuntimeLayout, scaleLayoutValue } from "./bootstrap/HulebuSampleSceneModel";

const { ccclass } = _decorator;

export type HulebuMascotState = "idle" | "guide" | "think" | "happy" | "failed";

const MASCOT_SPRITES: Record<HulebuMascotState, string> = {
  idle: HULEBU_V3_UI_SPRITES.mascot.idle,
  guide: HULEBU_V3_UI_SPRITES.mascot.guide,
  think: HULEBU_V3_UI_SPRITES.mascot.think,
  happy: HULEBU_V3_UI_SPRITES.mascot.happy,
  failed: HULEBU_V3_UI_SPRITES.mascot.failed,
};

@ccclass("HulebuMascotGuide")
export class HulebuMascotGuide extends Component {
  private artNode: Node | null = null;
  private bubbleNode: Node | null = null;
  private bubbleLabel: Label | null = null;
  private bubbleArt: Node | null = null;
  private state: HulebuMascotState = "idle";
  private hintText = "";
  private bobTween: { stop: () => void } | null = null;

  showHint(text: string, state: HulebuMascotState = "guide", durationMs = 3200): void {
    const layout = resolveHulebuRuntimeLayout();
    this.node.active = true;
    this.state = state;
    this.hintText = text;
    this.node.setPosition(
      new Vec3(
        centerLayoutX(layout.width - scaleLayoutValue(62, layout.scale), layout),
        centerLayoutY(layout.height - scaleLayoutValue(176, layout.scale), layout),
        4,
      ),
    );
    this.ensureArt(layout.scale);
    this.ensureBubble(layout.scale);
    this.applyStateSprite(state, layout.scale);
    this.updateBubble(text, layout.scale);
    this.scheduleOnce(() => {
      if (this.hintText === text) {
        this.hide();
      }
    }, durationMs / 1000);
  }

  hide(): void {
    this.unscheduleAllCallbacks();
    this.hintText = "";
    this.node.active = false;
    this.bobTween?.stop();
    this.bobTween = null;
  }

  private ensureArt(scale: number): Node {
    if (!this.artNode) {
      this.artNode = new Node("MascotArt");
      this.artNode.layer = this.node.layer;
      this.node.addChild(this.artNode);
    }
    const transform = this.artNode.getComponent(UITransform) ?? this.artNode.addComponent(UITransform);
    transform.setContentSize(scaleLayoutValue(68, scale), scaleLayoutValue(84, scale));
    this.artNode.setPosition(new Vec3(0, 0, 1));
    const sprite = this.artNode.getComponent(Sprite) ?? this.artNode.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    this.bobTween?.stop();
    this.bobTween = tween(this.artNode)
      .to(0.8, { position: new Vec3(0, scaleLayoutValue(3, scale), 1) })
      .to(0.8, { position: new Vec3(0, 0, 1) })
      .repeatForever()
      .start();
    return this.artNode;
  }

  private ensureBubble(scale: number): Node {
    if (!this.bubbleNode) {
      this.bubbleNode = new Node("MascotBubble");
      this.bubbleNode.layer = this.node.layer;
      this.node.addChild(this.bubbleNode);
    }
    const transform = this.bubbleNode.getComponent(UITransform) ?? this.bubbleNode.addComponent(UITransform);
    transform.setContentSize(scaleLayoutValue(176, scale), scaleLayoutValue(54, scale));
    this.bubbleNode.setPosition(new Vec3(-scaleLayoutValue(54, scale), scaleLayoutValue(49, scale), 2));
    const labelNode = this.bubbleNode.getChildByName("Label") ?? new Node("Label");
    labelNode.layer = this.node.layer;
    if (!labelNode.parent) this.bubbleNode.addChild(labelNode);
    const labelTransform = labelNode.getComponent(UITransform) ?? labelNode.addComponent(UITransform);
    labelTransform.setContentSize(scaleLayoutValue(152, scale), scaleLayoutValue(38, scale));
    labelNode.setPosition(new Vec3(0, 0, 2));
    this.bubbleLabel = labelNode.getComponent(Label) ?? labelNode.addComponent(Label);
    this.bubbleLabel.fontSize = scaleLayoutValue(10, scale);
    this.bubbleLabel.lineHeight = scaleLayoutValue(13, scale);
    this.bubbleLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
    this.bubbleLabel.verticalAlign = Label.VerticalAlign.CENTER;
    this.bubbleLabel.enableWrapText = true;
    this.bubbleLabel.overflow = Label.Overflow.SHRINK;
    this.bubbleLabel.color = new Color(92, 58, 40, 255);
    const graphics = this.bubbleNode.getComponent(Graphics) ?? this.bubbleNode.addComponent(Graphics);
    graphics.clear();
    graphics.fillColor = new Color(255, 247, 236, 245);
    graphics.strokeColor = new Color(245, 127, 126, 255);
    graphics.lineWidth = scaleLayoutValue(2, scale);
    graphics.roundRect(-transform.width / 2, -transform.height / 2, transform.width, transform.height, scaleLayoutValue(12, scale));
    graphics.fill();
    graphics.stroke();
    if (!this.bubbleArt) {
      this.bubbleArt = new Node("BubbleArt");
      this.bubbleArt.layer = this.node.layer;
      this.bubbleNode.addChild(this.bubbleArt);
    }
    const artTransform = this.bubbleArt.getComponent(UITransform) ?? this.bubbleArt.addComponent(UITransform);
    artTransform.setContentSize(transform.width, transform.height);
    this.bubbleArt.setPosition(new Vec3(0, 0, 0));
    this.bubbleArt.setSiblingIndex(0);
    const bubbleSprite = this.bubbleArt.getComponent(Sprite) ?? this.bubbleArt.addComponent(Sprite);
    bubbleSprite.sizeMode = Sprite.SizeMode.CUSTOM;
    resources.load(HULEBU_V3_UI_SPRITES.t291.bubbleTop, SpriteFrame, (error, spriteFrame) => {
      if (error || !spriteFrame || !this.bubbleArt?.isValid) return;
      bubbleSprite.spriteFrame = spriteFrame;
      this.bubbleArt.active = true;
      graphics.clear();
    });
    return this.bubbleNode;
  }

  private updateBubble(text: string, scale: number): void {
    if (!this.bubbleLabel || !this.bubbleNode) return;
    this.bubbleLabel.string = text;
    this.bubbleLabel.node.getComponent(UITransform)?.setContentSize(scaleLayoutValue(152, scale), scaleLayoutValue(38, scale));
    this.bubbleNode.active = text.length > 0;
  }

  private applyStateSprite(state: HulebuMascotState, scale: number): void {
    if (!this.artNode) return;
    const sprite = this.artNode.getComponent(Sprite) ?? this.artNode.addComponent(Sprite);
    this.artNode.active = false;
    resources.load(MASCOT_SPRITES[state], SpriteFrame, (error, spriteFrame) => {
      if (error || !spriteFrame || !this.artNode?.isValid) return;
      sprite.sizeMode = Sprite.SizeMode.CUSTOM;
      sprite.color = Color.WHITE;
      sprite.spriteFrame = spriteFrame;
      this.artNode.getComponent(UITransform)?.setContentSize(scaleLayoutValue(68, scale), scaleLayoutValue(84, scale));
      this.artNode.active = true;
    });
  }
}
