# Supabase 数据库交接手册

**日期**：2026-05-20
**用途**：给朋友或后续开发者直接连接和维护数据库使用。

## 1. 项目标识

- Supabase 项目 ref：`tgrxbwyfwtlrmrjmvihf`
- Supabase URL：`https://tgrxbwyfwtlrmrjmvihf.supabase.co`

## 2. 连接参数

本项目当前使用的是 Supabase 托管 PostgreSQL，业务层只通过 Prisma 访问。

建议环境变量：

- `DATABASE_URL`
- `DIRECT_DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

当前约定：

```bash
DATABASE_URL=postgresql://postgres:<database_password>@db.tgrxbwyfwtlrmrjmvihf.supabase.co:5432/postgres?sslmode=require
DIRECT_DATABASE_URL=postgresql://postgres:<database_password>@db.tgrxbwyfwtlrmrjmvihf.supabase.co:5432/postgres?sslmode=require
NEXT_PUBLIC_SUPABASE_URL=https://tgrxbwyfwtlrmrjmvihf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
```

## 3. 当前已知值

- `anon key`：请在 Supabase 控制台的 API 页面确认并填入本地环境。
- `database password`：请在 Supabase 控制台确认或重设，然后填入本地 `.env`。

如果要让朋友在自己的电脑上连接，最稳妥的做法是：

1. 让朋友登录 Supabase 项目。
2. 在 Supabase 控制台重设或确认数据库密码。
3. 把新的 `DATABASE_URL` 和 `DIRECT_DATABASE_URL` 写入朋友自己的 `.env`。

## 4. Prisma 使用方式

本项目使用 Prisma 7。

- `apps/web/prisma/schema.prisma`：只保留 PostgreSQL schema。
- `apps/web/prisma.config.ts`：读取 `DATABASE_URL`。
- `apps/web/src/lib/db.ts`：业务代码里复用 PrismaClient。

常用命令：

```bash
npm exec prisma validate -w apps/web
```

后续如果要执行迁移，可在 `apps/web` 工作区继续用 Prisma 命令。

## 5. 朋友接手时怎么改内容

1. 先在本地配置好 `.env`。
2. 用 Prisma 读取 schema 和数据库连接。
3. 修改 seed、查询层或后台数据写入逻辑。
4. 不要直接把 Supabase 当成业务依赖去写 SDK 逻辑。

## 6. 注意事项

- 只把 Supabase 当托管 PostgreSQL 使用。
- 不要依赖 Supabase Auth / Storage / RLS / Edge Functions 作为第一阶段必需能力。
- 如果后面迁移到自有服务器，只需要替换数据库连接串和重新执行 Prisma 迁移。
