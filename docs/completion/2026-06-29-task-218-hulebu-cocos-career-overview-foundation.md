# T218 完成记录

- 任务编号：T218
- 任务名称：胡了卜 Cocos 局外生涯总览基础
- 负责人：Lee
- 完成日期：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T218-hulebu-cocos-career-overview-foundation.md`
- `docs/tasks/claims/T218-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 大厅新增 `生涯` 入口，并新增 `collection` phase。
- `GameSceneController` 新增局外生涯总览弹层，集中展示当前本轮、最近一轮、局外铜钱、六轴成长等级，以及主线、无尽、每日和高阶的本地累计状态。
- 共享静态测试补充对 `collection` phase、生涯入口、总览 helper 和展示文案的回归断言。

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

- 当前生涯面板仍是最小摘要，不含完整成就分类、图鉴卡面和账号同步。
- 主线长期进度仍沿用最近一轮摘要口径，尚未独立拆出生涯字段。
