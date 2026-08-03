# T222 完成记录

- 任务编号：T222
- 任务名称：胡了卜 Cocos 当前关中局恢复基础
- 负责人：Lee
- 完成日期：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T222-hulebu-cocos-in-level-resume-foundation.md`
- `docs/tasks/claims/T222-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 为 `HulebuRuntimeState` 新增 `exportSnapshot()` 和 `fromSnapshot()`。
- 运行态快照现在覆盖牌桌、卡槽、备用槽、牌河、明牌区、Boss 进度、震落位移、分数、铜钱和工具次数。
- `HulebuActiveRunSnapshot` 新增 `runtimeSnapshot` 字段。
- `resumeActiveRun()` 现在存在 runtime 快照时优先恢复当前关中局；缺快照时仍保留原来的当前关开局回退。
- 共享静态测试补充 runtime 快照导出/恢复与中局恢复断言。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`npm run docs:sync`
- 通过：`git diff --check`

## 遗留问题

- 当前只恢复当前关运行态，不恢复奖励/事件三选一等关间弹层。
- 当前不含账号同步和跨设备恢复；后续若接账号，需要继续复用 `HulebuActiveRunSnapshot` / `HulebuRuntimeSnapshot`。
