### 当前任务

- 任务编号：T109
- 任务名称：Supabase PostgreSQL 切换到自托管 PostgreSQL
- 负责人：Lee
- 状态：已完成
- 开始时间：2026-06-03
- 允许修改文件：`.env`, `apps/web/.env`, `docs/tasks/items/T109-supabase-to-self-hosted-postgres.md`, `docs/tasks/claims/T109-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-06-03-lee.md`
- 禁止修改文件：`apps/web/src/**`, `packages/**`, `apps/game/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`
- 验证命令：源库和目标库连接检查；源库 `public` 表检查；目标库 `public` 表和行数检查；`npm exec prisma db push -w apps/web`
- 当前阻塞：无
- 下一步：如需要完全脱离 Supabase，另开任务清理 `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` 及相关文档。
