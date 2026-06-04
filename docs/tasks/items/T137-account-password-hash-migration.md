# T137：账号密码登录 Prisma migration 落档

- 状态：已完成
- 负责人：Lee
- 创建日期：2026-06-04
- 优先级：P0
- 来源：T135/T136 收尾

## 背景

T135 已把账号认证修正为邮箱注册验证 + 邮箱密码登录，T136 已通过 `prisma db push` 将 `User.passwordHash` 同步到当前 PostgreSQL 并完成真实链路联调。为避免代码库只依赖 `db push`，需要补交正式 Prisma migration 文件，记录 `passwordHash` 字段变更。

## 文件范围

允许修改：

- `apps/web/prisma/migrations/**`
- T137 相关文档：`docs/tasks/**`, `docs/progress/**`, `docs/completion/**`

禁止修改：

- PDF 工具箱、AI 修图、游戏和 TimePick 业务代码
- 账号中心页面和认证业务代码
- 支付、部署、AI Gateway 运行时代码

## 验证命令

- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npm exec prisma validate`（在 `apps/web` 目录执行）
- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npx prisma db execute --file prisma/migrations/20260604194500_add_user_password_hash/migration.sql`（在 `apps/web` 目录执行）
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- 仓库中存在可审查的 Prisma migration SQL，明确为 `User.passwordHash` 增加 nullable text 字段。
- 迁移在已通过 `db push` 的当前数据库上可重复执行，不因字段已存在失败。
- Prisma schema 校验通过。
- 文档同步和 diff 检查通过。

## 验证结果

- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npm exec prisma validate`：通过，schema 有效。
- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npx prisma db execute --file prisma/migrations/20260604194500_add_user_password_hash/migration.sql`：通过，脚本执行成功。

## 遗留问题

- 当前项目历史上没有完整初始 Prisma migration，本任务只补 T135/T136 的 `passwordHash` 字段迁移；后续如要完全切换到 `prisma migrate deploy`，仍建议单独做数据库 baseline 任务。
