# T217 完成记录

- 任务编号：T217
- 任务名称：胡了卜 Cocos 本地长期进度基础
- 负责人：Lee
- 完成日期：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T217-hulebu-cocos-meta-progress-foundation.md`
- `docs/tasks/claims/T217-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 新增 `HulebuMetaProgressSnapshot`、`HULEBU_META_PROGRESS_STORAGE_KEY` 和本地读写 helper。
- run 完成时按模式更新本地长期进度：无尽记录最高层、每日记录当日 seed 最佳关序、高阶记录最高已完成风场。
- 大厅模式入口补充长期进度副文案，直接展示无尽最高层、今日最佳和高阶最高风场。
- 共享静态测试补充对长期进度 helper、存储 key 和大厅长期进度文案 helper 的回归断言。

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

- 当前主线长期进度仍只通过最近一轮摘要体现，尚未形成独立主线生涯字段。
- 本任务只做本地存储，不含账号同步、完整局外生涯页和成就联动。
