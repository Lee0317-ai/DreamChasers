# T156：AI Gateway 图片能力契约与输入校验收口

- 任务编号：T156
- 领取人：Lee
- 领取时间：2026-06-11
- 状态：已完成
- 预计完成：2026-06-11
- 允许修改文件：`apps/web/src/lib/ai/**`, `apps/web/src/app/api/ai/**`, `docs/tasks/items/T156-ai-gateway-image-capability-contract-hardening.md`, `docs/tasks/claims/T156-lee.md`, `docs/progress/2026-06-11-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**`, `apps/web/src/app/tools/ai-photo-editor/**`, `apps/web/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w apps/web -- ai-gateway error-display model-catalog`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：后续如需继续推进平台图片 AI，优先补通用结果类型、资产生命周期和更细的 provider 契约。
