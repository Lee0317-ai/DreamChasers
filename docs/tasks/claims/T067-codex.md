# T067：胡了卜 Cocos 首屏目标图视觉壳

- 领取人：Codex / 开发 B
- 领取时间：2026-05-26
- 状态：待验收
- 预计完成：2026-05-26
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T067-hulebu-cocos-visual-shell.md`, `docs/tasks/claims/T067-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-26.md`, `docs/completion/2026-05-26-task-T067-hulebu-cocos-visual-shell.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T066
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 进展：已完成首屏目标图方向的运行时视觉壳，并修复 Cocos Web Preview 只显示默认启动图的问题；`GameSceneController` 会自动创建并绑定 `RuntimeCamera`。
- 下一步：等待用户验收首屏比例和视觉方向，再决定是否接入真实麻将牌图片资源或继续做点击入槽交互。
