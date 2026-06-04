# T114：TimePick 同账号 PostgreSQL 迁移基座

- 领取人：Lee
- 领取时间：2026-06-03
- 状态：待验收
- 预计完成：2026-06-03
- 允许修改文件：`apps/web/prisma/**`, `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/**`, `apps/web/src/generated/prisma/**`, `docs/tasks/**`, `docs/superpowers/plans/**`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `/Users/lee/Desktop/Lee/TimePick/**`（本任务不直接改 TimePick 前端）
- 依赖任务：T108, T110, T112, T113
- 验证命令：`npm exec prisma validate -w apps/web`; `npm run test -w apps/web -- timepick account`; `npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待 Lee 验收迁移基座；后续拆分 TimePick 前端数据访问替换和 Supabase 历史数据导入任务。
