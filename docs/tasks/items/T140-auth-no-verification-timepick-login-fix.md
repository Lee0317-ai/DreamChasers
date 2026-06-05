# T140：取消账号邮箱验证门槛并修复 TimePick 登录跳转

- 状态：已完成
- 负责人：Lee
- 创建日期：2026-06-04
- 优先级：P0
- 来源：Lee 反馈注册应直接邮箱密码进入；点击 TimePick 登录后页面消失

## 背景

当前账号体系要求注册后先通过邮件验证，再用邮箱和密码登录。Lee 明确要求先去掉发送邮箱验证和邮箱验证门槛，注册时填写邮箱和密码后即可进入。

同时 TimePick 登录壳默认跳转到 `http://localhost:3000/login`，但当前 DreamChasers 本地服务常用 `3100`，导致用户从 TimePick 点击登录时可能跳到未运行端口或错误页面。

## 文件范围

允许修改：

- `apps/web/src/lib/auth/**`
- `apps/web/src/app/login/**`
- `apps/web/src/app/register/**`
- `apps/web/src/app/account/security/page.tsx`
- `apps/web/src/app/tools/timepick/**`
- `/Users/lee/Desktop/Lee/TimePick/src/lib/dreamchasers-auth.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/pages/Login.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/pages/Register.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/components/AuthGuard.tsx`
- T140 相关文档

禁止修改：

- PDF 工具箱、AI 修图、游戏业务代码
- TimePick 非登录壳和 API client 迁移链路
- Prisma schema 和 migration
- 付费、AI Gateway、模型配置和用户原始 provider key 保存逻辑

## 验证方式

- `npm run test -w apps/web -- auth account timepick`
- `npm run typecheck -w apps/web`
- `npm run lint -w apps/web`
- `npm run build -w apps/web`
- `npx eslint src/lib/dreamchasers-auth.ts src/pages/Login.tsx src/pages/Register.tsx src/components/AuthGuard.tsx`（TimePick）
- `npm run build`（TimePick）
- HTTP 或浏览器检查 `/register`、`/login`、`/tools/timepick` 和 TimePick 登录按钮跳转
- `npm run docs:sync`
- `git diff --check`

## 当前计划

1. 补充认证规则和 TimePick 登录 URL 的失败测试。
2. 注册时创建账号后直接登录，不再发送验证邮件。
3. 登录时只校验邮箱和密码，不再拦截 `emailVerified`。
4. 移除或弱化重发验证邮件入口和旧提示文案。
5. 修复 TimePick 默认 DreamChasers 地址与 returnUrl，保证登录后回到 TimePick。

## 实现内容

- 新增 `auth-rules`，密码登录只依赖密码匹配，不再要求 `emailVerified`。
- 注册 action 不再调用 `nodemailer` 登录 provider 发送验证邮件；创建账号后直接走 credentials 登录。
- 已有密码账号不能通过注册覆盖密码；无密码旧账号可补密码。
- 登录页、注册页、错误页、安全页和限流文案去掉注册邮箱验证门槛表达与重发验证邮件主入口。
- TimePick 统一账号登录默认 DreamChasers 地址修正为 `http://localhost:3100`，并通过 `/login?returnUrl=/tools/timepick` 登录后回到站内 TimePick 跳转页，再回到 `http://localhost:8080/home`。

## 验证结果

- `npm run test -w apps/web -- auth-rules`：通过。
- `npm run test -w apps/web -- login-rate-limit`：红绿验证通过。
- `npm run test -w apps/web -- auth account timepick`：通过，13 files / 72 tests。
- `npm run typecheck -w apps/web`：通过。
- `npm run lint -w apps/web`：通过，保留既有 generated Prisma unused eslint-disable warnings。
- `npm run build -w apps/web`：通过。
- `npx eslint src/lib/dreamchasers-auth.ts src/pages/Login.tsx src/pages/Register.tsx src/components/AuthGuard.tsx`（TimePick）：通过。
- `npm run build`（TimePick）：通过，保留既有 Vite chunk size warning。
- HTTP 检查 `/tools/timepick` 返回 307，`location: http://localhost:8080/home`。
- 静态检查 TimePick 登录 URL 为 `http://localhost:3100/login?returnUrl=%2Ftools%2Ftimepick`。
- Kimi WebBridge 工具本轮未暴露，Playwright 也未安装；真实点击浏览器自动化未执行。
- Lee 已完成手动测试并确认验收通过。
