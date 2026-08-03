# T234 领取记录

- 任务编号：T234
- 任务名称：胡了卜 Cocos 右侧工具角标动态同步
- 负责人：Lee
- 领取时间：2026-06-30
- 状态：已完成
- 完成时间：2026-06-30
- 文件范围：
  - `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
  - `packages/shared/src/mahjong-cocos-project.test.ts`
  - 本任务相关文档分片
- 验证命令：
  - `npm run test -w packages/shared -- mahjong-cocos-project`
  - `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
  - `git diff --check -- apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts packages/shared/src/mahjong-cocos-project.test.ts docs/tasks/items/T234-hulebu-cocos-dynamic-tool-badges.md docs/tasks/claims/T234-lee.md docs/completion/2026-06-30-task-234-hulebu-cocos-dynamic-tool-badges.md docs/progress/2026-06-29-lee.md docs/modules/mahjong-roguelike/PROGRESS.md docs/tasks/NEXT_ID.md`
- 当前阻塞：无
- 下一步：用 Cocos Web Preview 核对工具使用后角标是否随画面刷新。
