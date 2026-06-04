# T127 TimePick 角色选择 API 切换完成记录

- 完成时间：2026-06-04
- 负责人：Lee
- 任务编号：T127
- 任务名称：TimePick 角色选择 API 切换

## 修改文件

- `apps/web/src/lib/timepick/timepick-api-rules.ts`
- `apps/web/src/lib/timepick/timepick-api.ts`
- `apps/web/src/lib/timepick/__tests__/timepick-api.test.ts`
- `apps/web/src/app/api/timepick/role/route.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/pages/RoleSelect.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/pages/Home.tsx`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T127-timepick-role-api-cutover.md`
- `docs/tasks/claims/T127-lee.md`
- `docs/progress/2026-06-04-lee.md`

## 实现内容

- 新增 TimePick 角色规则：角色字段映射和角色值规范化。
- 新增 DreamChasers TimePick 角色 API：
  - `GET /api/timepick/role`
  - `PATCH /api/timepick/role`
- 角色读取仅返回当前用户数据，无角色时返回 `null`。
- 角色写入只接受 `collector` 和 `searcher`，非法值返回 400。
- TimePick `RoleSelect` 和 `Home` 已改用 DreamChasers API client，不再直接调用 Supabase `user_roles`。

## 验证命令

- `npm run test -w apps/web -- timepick-api`：通过
- `npm run test -w apps/web -- timepick account`：通过
- `npm run typecheck -w apps/web`：通过
- `npm run build -w apps/web`：通过
- `node -e "const fs=require('fs'); for (const f of ['src/pages/RoleSelect.tsx','src/pages/Home.tsx']) { const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/'+f,'utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('user_roles'\\)/.test(s)) process.exit(1); }"`：通过
- `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/pages/RoleSelect.tsx src/pages/Home.tsx`（TimePick）：通过
- `npm run build`（TimePick）：通过
- Kimi WebBridge 真实浏览器联调：通过

## 验证结果

- 打开 `http://localhost:8080/home` 后页面标题为 `首页 - 拾光`，未跳转登录页。
- 同页真实 fetch 首次 `GET /api/timepick/role` 返回 200，响应 `role: null`。
- `PATCH /api/timepick/role` 写入 `searcher` 返回 200，再次读取返回 `searcher`。
- `PATCH /api/timepick/role` 写入 `invalid-role` 返回 400，响应 `角色类型无效。`。
- `PATCH /api/timepick/role` 写入 `collector` 返回 200，再次读取返回 `collector`。
- 刷新首页后 `localStorage.userRole` 为 `collector`。

## 遗留问题

- 本任务不迁移模块树、待办、抽签、Profile、上传/Storage、自动识别、学习焦点或其他 Supabase 链路。
