# T004：添加数据库和 Prisma 模型（Supabase PostgreSQL）完成记录

- 任务编号：T004
- 负责人：Codex / 开发 A
- 完成时间：2026-05-20
- 修改文件：`.env.example`, `apps/web/.env`, `apps/web/prisma/schema.prisma`, `apps/web/prisma.config.ts`, `apps/web/src/lib/db.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`
- 实现内容：将数据库底座改为 Supabase 托管 PostgreSQL，按 Prisma 7 新配置方式拆分 `prisma.config.ts` 与 schema，补齐内容、分类、标签、点击、更新、配额和 API 凭据模型，并完成本地环境连接配置。
- 验证命令：`npm exec prisma validate -w apps/web`
- 验证结果：通过。
- 遗留问题：`apps/web/.env` 仅用于本地验证，后续需要在 Supabase 仪表盘和部署环境中配置同样的连接变量；仍未执行迁移和种子写入。
