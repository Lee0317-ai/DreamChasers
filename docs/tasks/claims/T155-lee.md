# T155：AI 修图 AI 美颜迁移到平台 AI Gateway

- 任务编号：T155
- 领取人：Lee
- 领取时间：2026-06-11
- 状态：已完成
- 预计完成：2026-06-11
- 允许修改文件：`apps/web/src/app/api/tools/photo/**`, `apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**`, `apps/web/src/lib/ai/**`, `apps/web/src/app/account/ai/**`, `docs/modules/photo-editor/**`, `docs/tasks/items/T155-ai-photo-beauty-ai-gateway-migration.md`, `docs/tasks/claims/T155-lee.md`, `docs/progress/2026-06-11-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w apps/web -- ai-gateway photo account-ai-overview`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：后续如需继续推进图片 AI，优先拆智能擦除或换背景，但要先确认异步资产链路范围。
