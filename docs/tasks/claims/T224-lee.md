### 当前任务

- 任务编号：T224
- 任务名称：胡了卜 Cocos 开局前 flow 恢复基础
- 负责人：Lee
- 状态：已完成
- 开始时间：2026-06-29
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/tasks/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-29-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/game/mahjong-roguelike/prototypes/**`, `apps/web/public/games/hulebu-demo/**`, `apps/web/prisma/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：已完成 `advancedAbility / archetype` 两类开局前 phase 恢复基础；后续可继续做账号同步或跨设备恢复。
