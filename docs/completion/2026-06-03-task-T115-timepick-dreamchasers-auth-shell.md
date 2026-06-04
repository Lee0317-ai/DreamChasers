# T115 TimePick 前端同账号登录壳完成记录

- 完成时间：2026-06-03
- 负责人：Lee
- 任务编号：T115
- 任务名称：TimePick 前端同账号登录壳

## 修改文件

- `/Users/lee/Desktop/Lee/TimePick/src/lib/dreamchasers-auth.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/contexts/AuthContext.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/components/AuthGuard.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/pages/Login.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/pages/Register.tsx`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T115-timepick-dreamchasers-auth-shell.md`
- `docs/tasks/claims/T115-lee.md`
- `docs/tasks/NEXT_ID.md`
- `docs/progress/2026-06-03-lee.md`
- `docs/completion/2026-06-03-task-T115-timepick-dreamchasers-auth-shell.md`

## 实现内容

- 新增 TimePick DreamChasers auth client，默认平台地址为 `http://localhost:3000`，可通过 `VITE_DREAMCHASERS_BASE_URL` 覆盖。
- TimePick `AuthContext` 改为调用 DreamChasers `/api/timepick/bootstrap`，用平台 `User.id` 构造兼容现有 `user.id` 的用户对象。
- 登录弹窗、登录页和注册页不再展示旧的拾光账号密码表单，改为引导用户使用 DreamChasers 统一账号中心。
- 保留旧 Supabase client 和业务数据查询，避免在同一任务中扩大到资源、文件夹、待办、抽签等全量数据替换。

## 验证命令

- `npx eslint src/lib/dreamchasers-auth.ts src/contexts/AuthContext.tsx src/components/AuthGuard.tsx src/pages/Login.tsx src/pages/Register.tsx`
- `npm run build`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- TimePick 触碰文件定向 ESLint 退出码为 0；`AuthContext` 仍有既有 Fast Refresh warning。
- TimePick `npm run build` 通过。
- DreamChasers 文档同步通过。
- DreamChasers `git diff --check` 通过。

## 遗留问题

- TimePick 全量 `npm run lint` 仍失败，失败点在多个既有未触碰文件的解析错误和 `no-explicit-any`，本任务未修复。
- TimePick 资源、文件夹、待办、灵感、抽签等业务数据仍在调用 Supabase client；后续 T116 需要逐屏替换到 DreamChasers API。
- DreamChasers 登录页当前只接受站内 `returnUrl`，独立域名 TimePick 登录后自动回跳需要后续通过产品启动页、同源托管或受控回跳策略解决。
