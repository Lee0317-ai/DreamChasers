# T136 完成记录：账号注册登录数据库同步和真实链路联调

- 任务编号：T136
- 负责人：Lee
- 完成日期：2026-06-04

## 修改文件

- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T136-account-auth-db-integration.md`
- `docs/tasks/claims/T136-lee.md`
- `docs/progress/2026-06-04.md`
- `docs/completion/2026-06-04-task-T136-account-auth-db-integration.md`

## 实现内容

- 将下一任务编号推进到 T137。
- 登记并领取 T136。
- 对 `.env` 指向的 PostgreSQL 执行 Prisma schema 同步，补齐 `User.passwordHash`。
- 用真实浏览器完成注册、验证邮件链接、未验证登录拦截、邮箱密码登录和测试用户清理。

## 验证命令

- `npx prisma db push`
- `SELECT` 查询 `information_schema.columns`
- Kimi WebBridge 浏览器联调 `/register`, `/login`, `/login/check-email`, `/login/error`, `/account`

## 验证结果

- 数据库 schema 同步成功。
- `public."User"."passwordHash"` 存在，nullable text。
- 注册后测试用户存在，`emailVerified=false`，`passwordHash` 为 `scrypt`，不包含明文密码。
- 未验证邮箱密码登录重定向到 `/login/error?reason=email-not-verified`。
- 验证邮箱后进入 `/account`。
- 退出后邮箱密码登录成功进入 `/account`。
- 测试用户已清理，清理后不存在。

## 遗留问题

- 当前没有 SMTP 配置，开发环境验证链接由 dev server 打印；生产需要配置 SMTP。
- 切换到 JWT session 后，旧 database session cookie 会失效，用户需要重新登录。
