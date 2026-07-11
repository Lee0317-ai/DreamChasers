import { Node, Sprite, SpriteFrame } from "cc";

export function safeApplySpriteFrame(node: Node, sprite: Sprite, spriteFrame: SpriteFrame): boolean {
  if (!node.isValid || !sprite.isValid) {
    return false;
  }

  sprite.spriteFrame = spriteFrame;
  return true;
}
