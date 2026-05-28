# T072：胡了卜 Cocos 真实配置首关接入

- 领取人：Codex / 开发 B
- 领取时间：2026-05-27
- 状态：待验收
- 预计完成：2026-05-27
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T072-hulebu-cocos-real-config-level.md`, `docs/tasks/claims/T072-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`, `docs/superpowers/plans/2026-05-27-hulebu-cocos-real-config-level.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T070
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 完成内容：Cocos 工程已新增真实首关配置适配器、最小 runtime state 和 configured scene bootstrap；`GameSceneController` 默认加载真实第 1 关，并把点击入槽和组合消除路由到 runtime state；保留本地 sample scene fallback。
- 验证结果：`npm run test -w packages/shared -- mahjong-cocos-project` 已通过，当前 1 个测试文件、6 个测试通过；Cocos Web Preview 手机视口已手动验证真实第 1 关 `9筒 -> 碰 -> 2万解锁/可入槽` 链路。
- 下一步：等待用户验收；后续建议优先接最终牌面 SpriteFrame prefab，或继续把真实 20 关配置/关卡流接入 Cocos runtime。
