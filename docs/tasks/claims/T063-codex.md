# T063：胡了卜 Cocos 首屏自动渲染

- 领取人：Codex / 开发 B
- 领取时间：2026-05-25
- 状态：已完成
- 预计完成：2026-05-25
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T063-hulebu-cocos-first-render.md`, `docs/tasks/claims/T063-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-26.md`, `docs/completion/2026-05-26-task-T063-hulebu-cocos-first-render.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T062
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 当前风险：本任务只做占位首屏渲染，尚未接真实关卡状态、最终美术、点击入槽和组合结算。
- 完成说明：已新增本地测试 scene model；`GameSceneController` 运行时自动应用测试数据并补 Canvas 组件；Board/Slot/Combo/HUD Binder 可自动创建最小可视节点和文案；已根据 Creator 预览修正首屏坐标偏移。
- 下一步：在 Cocos Creator 中点击播放验证首屏显示，再开任务接真实配置/共享状态的第一条点击入槽链路。
