# T130 TimePick Profile 页面 API 切换完成记录

- 完成时间：2026-06-04
- 负责人：Lee
- 任务编号：T130
- 任务名称：TimePick Profile 页面 API 切换

## 修改文件

- `apps/web/src/lib/timepick/timepick-api-rules.ts`
- `apps/web/src/lib/timepick/timepick-api.ts`
- `apps/web/src/lib/timepick/__tests__/timepick-api.test.ts`
- `apps/web/src/app/api/timepick/profile/route.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/pages/Profile.tsx`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T130-timepick-profile-api-cutover.md`
- `docs/tasks/claims/T130-lee.md`
- `docs/progress/2026-06-04-lee.md`

## 实现内容

- DreamChasers 新增 TimePick profile 字段映射、出生日期规范化和 owner 写权限规则。
- DreamChasers 新增 `GET/PATCH /api/timepick/profile`，读取当前用户 profile、资源统计和存储统计，PATCH 只允许更新出生日期。
- TimePick API client 新增 profile 读取和出生日期更新方法。
- TimePick `Profile` 页面移除 Supabase `profiles`、`resources` 和 Supabase Auth 修改密码直连，改用 DreamChasers API；账号安全入口跳转到 DreamChasers `/account/security`。

## 验证命令

- 静态红绿检查 `Profile.tsx` 不再包含 Supabase profile/resources/Auth 直连。
- `npm run test -w apps/web -- timepick account`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- `npx eslint src/lib/timepick-api.ts src/pages/Profile.tsx`（TimePick）
- `npm run build`（TimePick）
- 浏览器联调：Profile 读取、生日更新、未来日期拒绝、账号安全页跳转。
- `npm run docs:sync`
- `git diff --check`（DreamChasers 和 TimePick）

## 验证结果

- DreamChasers profile API 读取返回 200，临时生日 PATCH 返回 200，未来日期 PATCH 返回 400。
- 联调测试后已把 `lee@example.com` 的 `TimePickProfile.birthDate` 恢复为 `NULL`，页面显示出生日期 `未设置`。
- 浏览器检查确认点击账号安全设置后 `location.href` 为 `http://localhost:3000/account/security`，页面显示 DreamChasers `安全设置`。

## 遗留问题

- 旧 Supabase 修改密码体系不接入 T130；后续统一使用 DreamChasers 账号安全页演进。
- TimePick 抽签、模块树、上传/Storage、自动识别和批量导入仍待后续单独迁移。
