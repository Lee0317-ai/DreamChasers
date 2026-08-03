# T191 完成记录：胡了卜 Cocos v6 HUD 槽位和工具按钮绑定

- 任务编号：T191
- 负责人：Lee
- 完成时间：2026-06-28

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/SlotLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/HudBinder.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-28-lee.md`

## 实现内容

- `SlotLayerBinder` 新增 `SlotTrayArt`，优先加载 `ui/v6/slots/hand_slots_8/spriteFrame`。
- `HudBinder` 新增 `HudBadgeArt`，优先加载 `tile_counter_wide / level_badge / score_badge`。
- `GameSceneController` 右侧 `洗牌 / 撤回 / 提示` 工具按钮优先加载 v6 工具按钮图片。
- 所有新 Sprite 绑定都保留原程序化 UI 作为 fallback。
- 共享 Cocos 工程测试锁定脚本引用和资源路径。

## 验证命令

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
npm run docs:sync
git diff --check
```

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`npm run docs:sync`
- 通过：`git diff --check`

## 遗留问题

- 本轮只做 HUD、槽位和工具按钮视觉绑定，工具按钮仍未接真实道具逻辑。
- Cocos 仍待追平有限牌河、明牌组、补杠、震落、满槽救场、Boss、事件、无尽、每日和高阶。
