# T220 完成记录

- 任务编号：T220
- 任务名称：胡了卜 Cocos 主线独立长期进度基础
- 负责人：Lee
- 完成日期：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T220-hulebu-cocos-mainline-meta-progress-foundation.md`
- `docs/tasks/claims/T220-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- `HulebuMetaProgressSnapshot` 新增 `bestMainlineLevel`。
- 主线 run 完成后会刷新主线最高已到关序。
- 大厅主线按钮和生涯面板现在优先展示主线长期进度，不再只依赖最近一轮摘要。
- 共享静态测试补充对主线独立进度字段、长期文案和默认快照字段的回归断言。

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

- 当前主线长期进度只记录最高已到关序，不含星级、章节章印或更细的主线生涯统计。
- 本任务不含账号同步，主线独立长期进度仍只保存在本地。
