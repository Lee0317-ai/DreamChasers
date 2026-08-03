# T196：胡了卜 Cocos Boss 目标基础接入

- 优先级：P1
- 默认负责人：Lee
- 负责人：Lee
- 状态：已完成
- 依赖：T190, T191, T192, T193, T194, T195
- 背景：Cocos 已接入 v6 视觉资源、牌河明牌、打牌救场、震落、洗牌和撤回，但第 10/20 关仍缺 Boss 多目标通关门槛。
- 目标：在 Cocos 配置、runtime、HUD 和通关判断中接入 Boss 基础目标。第 10/20 关支持组合次数、花色集合和积分目标；组合成功后记录进度；牌山清空且 Boss 目标完成才通关。
- 不做：不做 Boss 专属动画、不做失败结算弹层、不补完整事件、无尽、每日、高阶、账号局外成长；不改 Web 玩法。
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/contracts/HulebuSceneModel.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/HudBinder.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/tasks/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-28-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/src/modules/tools/**`, `apps/web/src/lib/ai/**`, `apps/web/src/app/account/**`, `apps/web/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 完成摘要：已在 Cocos 配置中接入 `bossGoals`，第 10/20 关带 Boss 目标；runtime 会记录组合次数、花色集合和积分目标进度；HUD 会显示 Boss 目标摘要；Controller 改为 `isLevelCleared()`，牌山清空且 Boss 目标完成才通关。
- 验证结果：已通过 `npm run test -w packages/shared -- mahjong-cocos-project`；已通过 `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`；待完成文档同步和空白检查。
