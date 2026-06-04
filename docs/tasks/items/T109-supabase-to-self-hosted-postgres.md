# T109：Supabase PostgreSQL 切换到自托管 PostgreSQL

- 优先级：P0
- 负责人：Lee
- 状态：已完成
- 依赖：T004, T023
- 背景：Lee 提供自托管 PostgreSQL 服务器，要求将当前 Supabase 托管 PostgreSQL 切换到该服务器。
- 目标：确认 Supabase 源库数据状态，初始化目标 PostgreSQL 的 Prisma 业务 schema，并把本地环境变量切到目标库。
- 不做：不迁移 Supabase Auth、Storage、Realtime 等平台运行时能力；不提交本地 `.env` 明文密码；不修改业务代码。
- 主要文件范围：`.env`, `apps/web/.env`, `docs/tasks/items/T109-supabase-to-self-hosted-postgres.md`, `docs/tasks/claims/T109-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-06-03-lee.md`
- 验证方式：源库和目标库连接检查；源库 `public` 表检查；目标库 `public` 表和行数检查；`npm exec prisma db push -w apps/web`

## 执行记录

- Supabase 源库连接成功，版本为 PostgreSQL 17.6。
- Supabase 源库 `public` schema 无业务表。
- Supabase Auth / Storage 等平台表无实际用户或文件数据，只有 Supabase 自带迁移记录。
- 目标库 `47.90.180.92:5432/postgres` 连接成功，版本为 PostgreSQL 16.14。
- 已执行 Prisma schema 同步，把当前项目业务表创建到目标库。
- 已将本地 `.env` 和 `apps/web/.env` 的 `DATABASE_URL` / `DIRECT_DATABASE_URL` 切换到目标库。

## 验证结果

- 源库 `public`：无表。
- 目标库 `public`：已创建 `ContentItem`, `Category`, `Tag`, `ContentTag`, `ClickEvent`, `UpdateLog`, `AiRequestLog`, `UsageQuota`, `ApiCredential`, `_CategoryToContentItem`。
- 目标业务表当前均为 0 行。

## 遗留问题

- 当前聊天和本地环境中已出现数据库密码，迁移完成后建议轮换目标 PostgreSQL 密码。
- `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 暂未移除；当前项目文档约定第一阶段不依赖 Supabase Auth / Storage / RLS，如后续彻底下线 Supabase，需要另开任务清理公开 Supabase 配置。
