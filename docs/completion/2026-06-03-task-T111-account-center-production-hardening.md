# T111 账号中心生产化配置和登录安全补强完成记录

- 完成时间：2026-06-03
- 负责人：Lee
- 任务编号：T111
- 任务名称：账号中心生产化配置和登录安全补强

## 修改文件

- `.env.example`
- `.env.production.example`
- `apps/web/prisma/schema.prisma`
- `apps/web/src/generated/prisma/**`
- `apps/web/src/lib/auth/**`
- `apps/web/src/app/login/error/page.tsx`
- `docs/tasks/**`
- `docs/progress/2026-06-03-lee.md`
- `docs/completion/2026-06-03-task-T111-account-center-production-hardening.md`

## 实现内容

- 补充本地和生产环境 Auth/SMTP 配置示例。
- 新增 `EmailLoginRequest` Prisma 模型，用于记录邮箱登录邮件请求冷却。
- 新增邮箱登录冷却规则和服务，默认同一邮箱 60 秒内只能请求一次登录邮件。
- 登录重复请求过快时跳转到可恢复错误页，并显示剩余等待秒数。
- 保留本地无 SMTP 时服务端终端打印登录链接的开发兜底。
- 将新增表同步到自托管 PostgreSQL。

## 验证命令

- `npm exec prisma validate -w apps/web`
- `npm exec prisma db push -w apps/web`
- `npm run test -w apps/web -- email-login account login-rate-limit`
- `npm run typecheck -w apps/web`
- `npm run lint -w apps/web`
- `npm run build -w apps/web`
- Kimi WebBridge 打开 `/login`，连续提交同一邮箱，检查第二次进入 rate-limited 错误页
- `git diff --check`

## 验证结果

- Prisma schema 校验通过。
- 数据库 schema 已同步到目标 PostgreSQL。
- 账号相关测试通过：3 个测试文件，12 个测试用例。
- TypeScript 类型检查通过。
- ESLint 通过；Prisma 生成文件仍有 unused eslint-disable 警告，退出码为 0。
- 生产构建通过。
- 浏览器检查通过：重复请求同一邮箱会显示“登录邮件发送过于频繁，请 N 秒后再试”。
- `git diff --check` 通过；构建后已再次清理 Prisma 生成文件尾随空格。

## 遗留问题

- 生产环境仍需要实际填写 `AUTH_SECRET`、`NEXTAUTH_URL` 和 SMTP 凭据。
- 当前冷却只按邮箱维度限制，未接 IP 维度或 Redis 分布式限流；后续上线前可继续拆风控任务。
