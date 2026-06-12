# T158：全站 Naturecore 视觉统一规划与落地

- 任务编号：T158
- 领取人：Lee
- 领取时间：2026-06-12
- 状态：已完成
- 预计完成：2026-06-12
- 允许修改文件：`apps/web/src/app/**`, `apps/web/src/components/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/web/src/modules/games/hulebu/**`, `apps/web/src/app/globals.css`, `docs/tasks/items/T158-sitewide-naturecore-ui-planning.md`, `docs/tasks/claims/T158-lee.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/progress/2026-06-12-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/lib/ai/**`, `apps/web/src/lib/account/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `apps/game/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w apps/web -- account-ai-overview model-catalog ai-gateway account-ai-config pdf hulebu`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：后续如需继续精修，建议单独拆 PDF 工具箱工作台深度视觉任务和 AI 修图工作台深度视觉任务。
