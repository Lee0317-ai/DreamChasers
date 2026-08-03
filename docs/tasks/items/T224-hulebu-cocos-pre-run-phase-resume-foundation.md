### T224：胡了卜 Cocos 开局前 flow 恢复基础

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 依赖：T203, T205, T209, T215, T222, T223
- 目标：为 Cocos active run 补齐 `advancedAbility / archetype` 两类开局前节点恢复；继续本轮时可回到对应选择 flow，而不是退回大厅或直接跳过。
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/tasks/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-29-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/game/mahjong-roguelike/prototypes/**`, `apps/web/public/games/hulebu-demo/**`, `apps/web/prisma/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`
- 风险：开局前 flow 比关中局和关间节点更依赖 controller 暂存字段，如果快照口径不完整，容易恢复到错误 profile 或跳过能力/流派选择。
- 下一步：后续如需账号同步或跨设备恢复，可继续复用 `HulebuActiveRunSnapshot` 的 phase / pending profile 口径。

## 完成情况

- `HulebuResumableRunPhase` 已扩展到 `advancedAbility / archetype`。
- `HulebuActiveRunSnapshot` 新增 `pendingRunProfile`，可保存高阶风场、每日 seed、无尽等待启动 profile。
- `showAdvancedAbilityOverlay()` 和 `showRunArchetypeOverlay()` 进入时会写回 active run；继续本轮可恢复到高阶能力选择或本局流派选择。
- 共享 Cocos 工程静态测试已补开局前 phase、pending profile 和 resume 分支断言。

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`npm run docs:sync`
- 通过：`git diff --check`
