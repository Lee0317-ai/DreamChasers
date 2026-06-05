# T140 领取记录：取消账号邮箱验证门槛并修复 TimePick 登录跳转

- 任务编号：T140
- 负责人：Lee
- 领取时间：2026-06-04
- 当前状态：已完成

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

## 验证命令

- `npm run test -w apps/web -- auth account timepick`
- `npm run typecheck -w apps/web`
- `npm run lint -w apps/web`
- `npm run build -w apps/web`
- `npx eslint src/lib/dreamchasers-auth.ts src/pages/Login.tsx src/pages/Register.tsx src/components/AuthGuard.tsx`（TimePick）
- `npm run build`（TimePick）
- HTTP 或浏览器检查 `/register`、`/login`、`/tools/timepick` 和 TimePick 登录按钮跳转
- `npm run docs:sync`
- `git diff --check`

## 当前说明

- 本任务处理 Lee 的两个 P0 反馈：注册登录去掉邮箱验证门槛；修复 TimePick 登录跳转到错误 DreamChasers 端口导致页面消失。
- 已完成实现和验证，Lee 已手动测试并确认验收通过。
