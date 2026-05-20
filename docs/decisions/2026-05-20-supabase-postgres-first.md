# 决策：第一阶段数据库先使用 Supabase 托管 PostgreSQL

**日期**：2026-05-20

## 背景

项目第一阶段需要尽快把内容、标签、统计和种子数据跑起来，但后续又希望能迁回自有服务器，避免早期架构把自己锁死。

## 决策

第一阶段数据库先使用 Supabase 托管 PostgreSQL。

业务代码只通过 Prisma 和标准 PostgreSQL 连接访问数据库，不把 Supabase Auth、Storage、RLS 或 Edge Functions 作为必选基础能力。

## 理由

- 可以快速获得稳定可用的 PostgreSQL。
- 迁移成本低，后面换成自有 PostgreSQL 时改动小。
- 业务层保持通用，避免过早绑定云厂商专有能力。

## 后续影响

- `T004` 按 Supabase PostgreSQL 方案实现。
- `.env.example` 和数据库文档保留可替换连接串写法。
- Prisma schema 和查询层继续保持标准 PostgreSQL 兼容。

## 回滚

如果后续发现 Supabase 不适合当前节奏，可以切换到自建 PostgreSQL，只要保留 Prisma 迁移和标准 SQL 即可。
