# T049：胡了卜配置驱动试玩原型

- 领取人：Codex / 开发 B
- 领取时间：2026-05-23
- 状态：已完成
- 预计完成：2026-05-23
- 允许修改文件：`apps/game/mahjong-roguelike/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T049-hulebu-config-playable-prototype.md`, `docs/tasks/claims/T049-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `packages/shared/**`, `apps/web/src/components/portal-data.ts`, `package.json`, `package-lock.json`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`
- 依赖任务：T048
- 验证命令：`npm run test -w packages/shared -- mahjong`; `npm run docs:sync`; 浏览器桌面端检查；浏览器移动端检查；`git diff --check`
- 当前风险：静态原型用于表现层手感验证，不代表最终 Cocos/GDevelop 工程结构；原型内会复刻轻量规则函数，正式工程仍应回到共享规则模型口径。
- 备注：已完成配置驱动试玩页；本步未修改 `apps/web/**`，未接站内路由。当前原型用于配置和表现层联调，不代表最终密集牌山。
