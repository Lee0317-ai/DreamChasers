# T150：账号中心 AI 治理面升级

- 任务编号：T150
- 领取人：Lee
- 领取时间：2026-06-09
- 状态：已完成
- 预计完成：2026-06-09
- 允许修改文件：`apps/web/src/app/account/ai/**`, `apps/web/src/lib/account/**`, `apps/web/src/lib/ai/**`, `docs/tasks/items/T150-account-ai-governance-surface-upgrade.md`, `docs/tasks/claims/T150-lee.md`, `docs/progress/2026-06-09-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/app/tools/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w apps/web -- account-ai-overview model-catalog ai-gateway account-ai-config`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：后续按 T149 继续进入 `T151` provider readiness 与环境变量治理。

## 备注

本任务已完成账号中心治理展示升级，不实现真实 provider readiness 或新的产品接线。
