# T069：胡了卜 Cocos 首条点击可玩链路

- 领取人：Codex / 开发 B
- 领取时间：2026-05-26
- 状态：待验收
- 预计完成：2026-05-26
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T069-hulebu-cocos-playable-click-chain.md`, `docs/tasks/claims/T069-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-26.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T067
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 完成说明：已跑通 Cocos 测试首屏的点击链路：可点击牌进入 8 格主槽，HUD 与组合按钮刷新，满足 `吃` 候选后可点击按钮消除。
- 下一步：接真实配置和共享规则状态，让 Cocos 场景不再只依赖本地测试 scene model。
