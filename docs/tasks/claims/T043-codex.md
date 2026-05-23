# T043：麻将 Roguelike 最小可玩闭环和 MVP 开发拆分计划

- 领取人：Codex / 开发 B
- 领取时间：2026-05-23
- 状态：已完成
- 预计完成：2026-05-23
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/2026-05-23-task-43-mahjong-mvp-build-plan.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `package.json`, `package-lock.json`, `apps/web/**`, `deploy/**`
- 依赖任务：T042
- 验证命令：`npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查；`git diff --check`
- 当前风险：如果团队跳过验证闭环直接进入正式 MVP，容易把长期模式、完整数值和发布工程同时压到第一版，导致开发周期失控。
- 备注：已完成后续构建计划，明确先做最小可玩闭环，再按验证结果拆正式 MVP。
