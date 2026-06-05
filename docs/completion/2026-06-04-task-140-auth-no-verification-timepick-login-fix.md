# T140 取消账号邮箱验证门槛并修复 TimePick 登录跳转完成记录

- 完成时间：2026-06-04
- 负责人：Lee
- 状态：已完成

## 修改文件

- `apps/web/src/lib/auth/auth-rules.ts`
- `apps/web/src/lib/auth/__tests__/auth-rules.test.ts`
- `apps/web/src/lib/auth/actions.ts`
- `apps/web/src/lib/auth/auth.ts`
- `apps/web/src/lib/auth/login-rate-limit-rules.ts`
- `apps/web/src/lib/auth/__tests__/login-rate-limit.test.ts`
- `apps/web/src/app/login/page.tsx`
- `apps/web/src/app/login/error/page.tsx`
- `apps/web/src/app/login/check-email/page.tsx`
- `apps/web/src/app/register/page.tsx`
- `apps/web/src/app/account/security/page.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/lib/dreamchasers-auth.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/pages/Login.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/pages/Register.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/components/AuthGuard.tsx`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T140-auth-no-verification-timepick-login-fix.md`
- `docs/tasks/claims/T140-lee.md`
- `docs/progress/2026-06-04-lee.md`

## 实现内容

- 注册流程不再发送邮箱验证邮件，账号创建或补密码后直接使用 credentials 登录。
- 密码登录不再要求 `emailVerified`，只校验邮箱和密码。
- 注册不能覆盖已有密码账号，避免未登录重置他人密码。
- 登录、注册、错误页、账号安全页和限流文案移除邮箱验证门槛和重发验证入口。
- TimePick 登录默认指向本地 DreamChasers `http://localhost:3100`，并通过 `/tools/timepick` 站内回跳回到 TimePick。

## 验证命令

- `npm run test -w apps/web -- auth-rules`
- `npm run test -w apps/web -- login-rate-limit`
- `npm run test -w apps/web -- auth account timepick`
- `npm run typecheck -w apps/web`
- `npm run lint -w apps/web`
- `npm run build -w apps/web`
- `npx eslint src/lib/dreamchasers-auth.ts src/pages/Login.tsx src/pages/Register.tsx src/components/AuthGuard.tsx`（TimePick）
- `npm run build`（TimePick）
- HTTP 检查 `/tools/timepick`
- TimePick 登录 URL 静态检查

## 验证结果

- DreamChasers 定向测试通过，13 files / 72 tests。
- DreamChasers typecheck、lint、build 通过；lint 仅保留既有 generated Prisma warning。
- TimePick 定向 ESLint 和 build 通过；build 仅保留既有 chunk size warning。
- `/tools/timepick` 返回 307，`location: http://localhost:8080/home`。
- TimePick 登录 URL 构造为 `http://localhost:3100/login?returnUrl=%2Ftools%2Ftimepick`。
- Lee 已完成手动测试并确认验收通过。

## 遗留问题

- 本轮 Kimi WebBridge 工具未暴露，Playwright 未安装，因此未做真实浏览器点击自动化；已用本地端口、HTTP 和静态 URL 检查替代。
- `emailVerified` 字段和 Auth.js Nodemailer provider 仍保留，用于兼容既有数据和后续可能恢复邮箱验证；当前注册主链路不再发送验证邮件。
