# T197：胡了卜 Cocos 奖励效果基础接入

- 优先级：P1
- 默认负责人：Lee
- 负责人：Lee
- 状态：已完成
- 依赖：T190, T191, T192, T193, T194, T195, T196
- 背景：Cocos 已接入视觉、牌河明牌、补杠、震落、打牌、洗牌/撤回和 Boss 目标，但奖励节点的三选一还只是流程推进。
- 目标：让 Cocos 奖励节点的三选一真正影响后续关卡。第一版接入基础奖励效果：备用槽 +1、护符 +1、工具次数 +1、开局铜钱、吃/碰/杠分数加成和首败保护标记；Controller 在选择奖励后保存 run rewards，并在下一关创建 runtime 时传入。
- 不做：不做完整奖励卡美术、不做复杂被动状态机、不做奖励随机权重、不接账号局外成长、不接事件、无尽、每日或高阶；不改 Web 玩法。
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/tasks/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-28-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/src/modules/tools/**`, `apps/web/src/lib/ai/**`, `apps/web/src/app/account/**`, `apps/web/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 完成摘要：已新增 Cocos 本轮奖励状态 `HulebuRunRewardState`，支持备用槽、护符、首败保护标记、开局铜钱、工具次数和吃/碰/杠分数加成；Controller 选择奖励后会更新 `runRewards` 并传入下一关 runtime。
- 验证结果：已通过 `npm run test -w packages/shared -- mahjong-cocos-project`；已通过 `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`；待完成文档同步和空白检查。
