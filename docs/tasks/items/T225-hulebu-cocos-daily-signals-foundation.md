### T225：胡了卜 Cocos 每日牌局第二版信号基础

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 依赖：T180, T199, T212, T217, T224
- 目标：为 Cocos 每日牌局补齐 `今日词缀 / 今日奖励 / 连续参与` 三个本地长期信号，让每日入口和生涯总览更接近 Web 完整版。
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/tasks/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-29-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/game/mahjong-roguelike/prototypes/**`, `apps/web/public/games/hulebu-demo/**`, `apps/web/prisma/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`
- 风险：每日信号如果和 active run 或账号进度混在一起，后续同步会难拆；本任务只先做 Cocos 本地 metaProgress 口径。
- 下一步：后续如需接账号同步或每日奖励仓库，可继续复用 `daily mutator / streak` 口径扩字段。

## 完成情况

- Cocos 配置层新增 `HulebuDailyMutatorProfile`、`HULEBU_DAILY_MUTATORS` 和 `getHulebuDailyMutatorProfile()`。
- 每日 run 的奖励三选一和事件池现在会按当天 seed 对应的每日词缀稳定偏置。
- `metaProgress` 新增 `dailyStreak / lastDailySeed`，每日启动时会记录连续参与。
- 大厅每日按钮和生涯总览现在会展示今日词缀、今日奖励、今日最佳和连续参与状态。

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
