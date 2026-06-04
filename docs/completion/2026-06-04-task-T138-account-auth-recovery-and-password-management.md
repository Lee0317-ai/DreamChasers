# T138 完成记录：账号找回密码、修改密码和重发验证邮件

- 任务编号：T138
- 负责人：Lee
- 完成日期：2026-06-04

## 修改文件

- `apps/web/src/lib/auth/recovery.ts`
- `apps/web/src/lib/auth/__tests__/recovery.test.ts`
- `apps/web/src/lib/auth/email-login.ts`
- `apps/web/src/lib/auth/__tests__/email-login.test.ts`
- `apps/web/src/lib/auth/actions.ts`
- `apps/web/src/app/forgot-password/page.tsx`
- `apps/web/src/app/reset-password/page.tsx`
- `apps/web/src/app/login/page.tsx`
- `apps/web/src/app/login/check-email/page.tsx`
- `apps/web/src/app/login/error/page.tsx`
- `apps/web/src/app/account/security/page.tsx`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T138-account-auth-recovery-and-password-management.md`
- `docs/tasks/claims/T138-lee.md`
- `docs/superpowers/specs/2026-06-04-account-auth-recovery-design.md`
- `docs/superpowers/plans/2026-06-04-account-auth-recovery.md`
- `docs/progress/2026-06-04-lee.md`
- `docs/completion/2026-06-04-task-T138-account-auth-recovery-and-password-management.md`

## 实现内容

- 新增密码找回 helper：邮箱规范化、密码重置 token identifier、token 哈希、1 小时过期时间和密码确认校验。
- 新增重置密码邮件文案，并复用 SMTP/开发终端打印能力。
- 新增 server actions：
  - `requestPasswordReset`
  - `completePasswordReset`
  - `changeCurrentPassword`
  - `resendVerificationEmail`
- 新增 `/forgot-password` 和 `/reset-password` 页面。
- 登录页增加忘记密码入口。
- 登录错误页在未验证邮箱场景提供重发验证邮件表单。
- 安全页增加修改密码表单，并在账号未验证时显示重发验证邮件入口。

## 验证命令

- `npm run test -w apps/web -- recovery`
- `npm run test -w apps/web -- email-login`
- `npm run test -w apps/web -- auth`
- `npm run test -w apps/web -- auth account`
- `npm run typecheck`
- `npm run lint`
- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npm run build`
- 页面 HTTP 烟测：`/forgot-password`, `/reset-password`, `/login/error?reason=email-not-verified`, `/login/check-email?mode=password-reset`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- `recovery`：1 个测试文件、4 个测试通过。
- `email-login`：1 个测试文件、4 个测试通过。
- `auth`：4 个测试文件、14 个测试通过。
- `auth account`：9 个测试文件、32 个测试通过。
- `typecheck`：通过。
- `lint`：通过，保留 Prisma generated 既有 unused eslint-disable warning。
- `build`：通过，Next.js 构建新增 `/forgot-password` 和 `/reset-password` 路由。
- 页面 HTTP 烟测：4 个目标入口均返回 200 并包含预期文案。

## 遗留问题

- 当前环境没有可用 Kimi WebBridge 工具，也没有 Playwright 依赖；本次用 dev server HTTP 烟测替代真实浏览器截图检查。
- 生产环境仍需要配置 SMTP，否则邮件链接只会打印在服务端终端。
