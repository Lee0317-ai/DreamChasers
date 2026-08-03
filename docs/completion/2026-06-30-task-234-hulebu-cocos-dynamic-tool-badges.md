# T234 胡了卜 Cocos 右侧工具角标动态同步完成记录

- 完成时间：2026-06-30
- 负责人：Lee

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T234-hulebu-cocos-dynamic-tool-badges.md`
- `docs/tasks/claims/T234-lee.md`
- `docs/tasks/NEXT_ID.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- `applyShellHud()` 现在会根据 runtime `hud.toolText` 同步右侧工具按钮角标。
- 新增 `parseToolCounts()` / `parseToolCount()` 解析 `洗 / 撤 / 打` 数量。
- `ToolButton_Wash / ToolButton_Undo / ToolButton_Hint` 的 `BadgeBack` 文本会跟随工具次数更新。
- 共享测试新增动态角标更新路径约束。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `git diff --check -- apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts packages/shared/src/mahjong-cocos-project.test.ts docs/tasks/items/T234-hulebu-cocos-dynamic-tool-badges.md docs/tasks/claims/T234-lee.md docs/completion/2026-06-30-task-234-hulebu-cocos-dynamic-tool-badges.md docs/progress/2026-06-29-lee.md docs/modules/mahjong-roguelike/PROGRESS.md docs/tasks/NEXT_ID.md`
- `npm run docs:sync`

## 验证结果

- 通过。共享测试 29 项通过。
- 通过。Cocos TypeScript 编译无报错。
- 通过。相关 diff 未发现空白问题。

## 遗留问题

- 尚未进行 Cocos Web Preview 交互截图核对。
