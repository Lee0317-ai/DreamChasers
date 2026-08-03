# T233 胡了卜 Cocos 奖励三选一大卡化完成记录

- 完成时间：2026-06-30
- 负责人：Lee

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T233-hulebu-cocos-reward-choice-large-cards.md`
- `docs/tasks/claims/T233-lee.md`
- `docs/tasks/NEXT_ID.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 奖励弹层扩大为 `368x328`，标题和副标题上移。
- 奖励选项改为 `106x120` 大卡，并使用 `112` 间距横向排列。
- 继续复用现有奖励卡 Sprite，失败时保留文字 fallback。
- 共享测试新增大卡尺寸常量检查。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `git diff --check -- apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts packages/shared/src/mahjong-cocos-project.test.ts docs/tasks/items/T233-hulebu-cocos-reward-choice-large-cards.md docs/tasks/claims/T233-lee.md docs/completion/2026-06-30-task-233-hulebu-cocos-reward-choice-large-cards.md docs/progress/2026-06-29-lee.md docs/modules/mahjong-roguelike/PROGRESS.md docs/tasks/NEXT_ID.md`
- `npm run docs:sync`

## 验证结果

- 通过。共享测试 29 项通过。
- 通过。Cocos TypeScript 编译无报错。
- 通过。相关 diff 未发现空白问题。

## 遗留问题

- 还需要 Cocos Web Preview 截图检查三张奖励卡与整屏背景、底部槽位是否协调。
