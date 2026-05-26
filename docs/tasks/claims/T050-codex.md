# T050：胡了卜牌山生成器和密集堆叠布局

- 领取人：Codex / 开发 B
- 领取时间：2026-05-23
- 状态：已完成
- 预计完成：2026-05-23
- 允许修改文件：`apps/game/mahjong-roguelike/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T050-hulebu-tile-mountain-generator.md`, `docs/tasks/claims/T050-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `packages/shared/**`, `apps/web/src/components/portal-data.ts`, `package.json`, `package-lock.json`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`
- 依赖任务：T049
- 验证命令：`npm run test -w packages/shared -- mahjong`; `npm run docs:sync`; 浏览器桌面端检查；浏览器移动端检查；`git diff --check`
- 当前风险：密集牌山仍是 HTML 原型层生成器，用于验证牌量、遮挡和解锁手感；正式工程后续仍需要在 Cocos/GDevelop 中重建渲染和动画。
- 备注：已完成；本任务未修改 `apps/web/**`，避免与 T015 PDF 工具箱当前工作范围冲突。
