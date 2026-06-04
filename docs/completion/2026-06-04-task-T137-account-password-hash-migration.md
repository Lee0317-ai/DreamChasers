# T137 完成记录：账号密码登录 Prisma migration 落档

- 任务编号：T137
- 负责人：Lee
- 完成日期：2026-06-04

## 修改文件

- `apps/web/prisma/migrations/20260604194500_add_user_password_hash/migration.sql`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T137-account-password-hash-migration.md`
- `docs/tasks/claims/T137-lee.md`
- `docs/progress/2026-06-04-lee.md`
- `docs/completion/2026-06-04-task-T137-account-password-hash-migration.md`

## 实现内容

- 新增 Prisma migration SQL，为 `User.passwordHash` 增加 nullable `TEXT` 字段。
- 迁移使用 `ADD COLUMN IF NOT EXISTS`，可在 T136 已经 `db push` 的数据库上重复执行。
- 记录项目仍缺完整初始 Prisma migration 的后续 baseline 风险。

## 验证命令

- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npm exec prisma validate`（在 `apps/web` 目录执行）
- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npx prisma db execute --file prisma/migrations/20260604194500_add_user_password_hash/migration.sql`（在 `apps/web` 目录执行）
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npm exec prisma validate`：通过，schema 有效。
- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npx prisma db execute --file prisma/migrations/20260604194500_add_user_password_hash/migration.sql`：通过，脚本执行成功。

## 遗留问题

- 当前只补 `passwordHash` 字段 migration；完整数据库 baseline migration 仍建议后续单独处理。
