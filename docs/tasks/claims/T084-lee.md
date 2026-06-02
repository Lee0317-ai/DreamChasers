# T084：胡了卜 Graph-based 牌山生成器 Cocos 接入

- 领取人：Lee
- 领取时间：2026-05-29
- 状态：待验收
- 预计完成：2026-05-29 起分阶段推进
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/tasks/items/T084-hulebu-cocos-graph-generator-integration.md`, `docs/tasks/claims/T084-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/progress/2026-05-29.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/config/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 依赖任务：T079, T080, T081, T082, T083
- 验证命令：`npm run test -w packages/shared -- mahjong-mountain-generator`; `npm run test -w packages/shared -- mahjong-cocos-project`; `npm run typecheck -w packages/shared`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T084-hulebu-cocos-graph-generator-integration.md docs/tasks/claims/T084-lee.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check`
- 当前阻塞：无
- 完成时间：2026-05-29
- 完成结果：已把共享 `levelTiles` 转为 Cocos 关卡配置，替换旧随机柱式默认牌山；新增结构测试保护模板轮换、遮挡、可点击窗口和 Cocos runtime 解锁链路。
- 验证结果：`npm run test -w packages/shared -- mahjong-mountain-generator` 通过，1 个测试文件、15 个测试；`npm run test -w packages/shared -- mahjong-cocos-project` 通过，1 个测试文件、13 个测试；`npm run typecheck -w packages/shared` 通过；`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json` 通过。
- 下一步：用 Cocos Web Preview 手机视口目检第 1/2/3/4 关模板读牌压力，再进入奖励效果、Boss 目标进度和槽位同款图片。
