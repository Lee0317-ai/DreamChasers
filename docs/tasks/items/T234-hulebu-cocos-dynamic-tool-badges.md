# T234 胡了卜 Cocos 右侧工具角标动态同步

- 状态：已完成
- 负责人：Lee
- 认领时间：2026-06-30
- 完成时间：2026-06-30

## 目标

让 Cocos 首屏右侧工具按钮的角标不再固定显示 `3`，而是跟随 runtime HUD 中的洗牌、撤回和打牌工具次数同步。

## 允许修改范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- 本任务相关文档分片

## 禁止修改范围

- Web 试玩页、站内静态 Demo、账号同步和 Prisma
- 玩法规则、工具消耗逻辑、关卡和奖励配置
- Cocos 场景文件和 PNG 资源

## 实现说明

1. `applyShellHud()` 在更新顶部牌匾后同步调用 `updateShellToolBadges()`。
2. 新增 `parseToolCounts()` 从 `hud.toolText` 中解析 `洗 / 撤 / 打` 的剩余次数。
3. 将解析出的次数写回 `ToolButton_Wash / ToolButton_Undo / ToolButton_Hint` 的 `BadgeBack` 文本。
4. 共享静态测试锁定动态角标更新路径，防止回退到固定数字。

## 验证

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `git diff --check -- apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts packages/shared/src/mahjong-cocos-project.test.ts docs/tasks/items/T234-hulebu-cocos-dynamic-tool-badges.md docs/tasks/claims/T234-lee.md docs/completion/2026-06-30-task-234-hulebu-cocos-dynamic-tool-badges.md docs/progress/2026-06-29-lee.md docs/modules/mahjong-roguelike/PROGRESS.md docs/tasks/NEXT_ID.md`

## 验证结果

- 通过。共享测试 29 项通过。
- 通过。Cocos TypeScript 编译无报错。
- 通过。相关 diff 未发现空白问题。

## 遗留

- 尚未在 Cocos Web Preview 中点击洗牌、撤回和打牌按钮做真实角标变化截图。
