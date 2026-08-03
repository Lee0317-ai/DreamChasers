# 2026-06-29 Task 226 胡了卜 Cocos 账号进度桥接基础

- 任务编号：T226
- 负责人：Lee

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T226-hulebu-cocos-account-progress-bridge-foundation.md`
- `docs/tasks/claims/T226-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 为 Cocos `GameSceneController` 新增账号进度同步 helper，复用现有 `/api/games/hulebu/progress`。
- 将 Cocos 本地 `metaCoins / metaUpgrades / metaProgress / achievements / activeRun` 映射到现有账号进度口径。
- 大厅启动和回到局外时会尝试拉取并合并账号进度；本地关键状态变化时会做防抖推送。
- 未登录、接口失败或不可用时会保留本地档，不阻断继续本轮、局外成长和每日信号。
- 生涯总览补充账号同步状态文案。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 待执行：`npm run docs:sync`
- 待执行：`git diff --check`

## 遗留问题

- 当前服务端 `HulebuProgress` 仍未承接 `lastSettlement / bestMainlineLevel`，这些字段继续保留在 Cocos 本地。
- 当前只做最小账号桥接，未处理完整跨设备中局冲突解决。
