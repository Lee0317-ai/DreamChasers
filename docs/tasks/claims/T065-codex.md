# T065：胡了卜 Cocos 手机竖屏首屏适配

- 领取人：Codex / 开发 B
- 领取时间：2026-05-26
- 状态：已完成
- 预计完成：2026-05-26
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T065-hulebu-cocos-mobile-first-screen.md`, `docs/tasks/claims/T065-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-26.md`, `docs/completion/2026-05-26-task-T065-hulebu-cocos-mobile-first-screen.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T063
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 当前风险：本任务只适配首屏占位布局，真实关卡牌量更大时仍需要后续做移动牌山缩放、相机/Canvas 适配和真机测试。
- 完成说明：项目设计分辨率已改为 390x844；首屏测试牌山、8 格主槽、组合按钮和 HUD 已按手机竖屏基准重排。
- 下一步：在 Creator 中停止并重新启动预览，选择 iPhone 机型检查首屏；后续再接真实关卡牌山缩放和点击入槽链路。
