# T233 胡了卜 Cocos 奖励三选一大卡化

- 状态：已完成
- 负责人：Lee
- 认领时间：2026-06-30
- 完成时间：2026-06-30

## 目标

继续对齐目标概念图，把 Cocos 奖励三选一从小按钮弹窗调成更像底部三张奖励卡的呈现，减少当前界面的调试感。

## 允许修改范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- 本任务相关文档分片

## 禁止修改范围

- Web 试玩页、站内静态 Demo、账号同步和 Prisma
- 玩法规则、奖励效果和奖励池配置
- Cocos 场景文件和已有 PNG 资源

## 实现说明

1. 奖励弹层从 `318x252` 扩到 `368x328`，标题和副标题上移，为卡牌留出空间。
2. 奖励选项从 `84x92` 小按钮改为 `106x120` 大卡，间距改为 `112`。
3. 继续复用 `reward_combo_strength / reward_score_bonus / reward_slot_expand` 静态奖励卡 Sprite，加载失败时保留文字 fallback。
4. 共享静态测试锁定大卡尺寸常量，避免后续回退成小按钮。

## 验证

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `git diff --check -- apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts packages/shared/src/mahjong-cocos-project.test.ts docs/tasks/items/T233-hulebu-cocos-reward-choice-large-cards.md docs/tasks/claims/T233-lee.md docs/completion/2026-06-30-task-233-hulebu-cocos-reward-choice-large-cards.md docs/progress/2026-06-29-lee.md docs/modules/mahjong-roguelike/PROGRESS.md docs/tasks/NEXT_ID.md`

## 验证结果

- 通过。共享测试 29 项通过。
- 通过。Cocos TypeScript 编译无报错。
- 通过。相关 diff 未发现空白问题。

## 遗留

- 尚未在 Cocos Creator Web Preview 中截图核对大卡与底部槽位、背景木托盘的实际重叠关系。
