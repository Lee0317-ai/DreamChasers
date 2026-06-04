# T131 TimePick 首页每日抽签弹窗 API 切换完成记录

- 完成时间：2026-06-04
- 负责人：Lee
- 任务编号：T131
- 任务名称：TimePick 首页每日抽签弹窗 API 切换

## 修改文件

- `apps/web/src/lib/timepick/timepick-api-rules.ts`
- `apps/web/src/lib/timepick/timepick-api.ts`
- `apps/web/src/lib/timepick/__tests__/timepick-api.test.ts`
- `apps/web/src/app/api/timepick/fortune/draw/route.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/components/FortuneDrawDialog.tsx`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T131-timepick-fortune-draw-api-cutover.md`
- `docs/tasks/claims/T131-lee.md`
- `docs/progress/2026-06-04-lee.md`

## 实现内容

- DreamChasers 新增每日抽签字段映射和 `drawDate` 归一规则。
- DreamChasers 新增 `POST /api/timepick/fortune/draw`，未设置出生日期返回 409，已设置出生日期时按当天缓存读取或创建 `TimePickFortuneDraw`。
- 新抽签使用无模型每日签文和内联 SVG 签图，避免在本任务中引入 AI 模型、图片生成或 Storage。
- TimePick `FortuneDrawDialog` 移除 Supabase profile 读写和 `draw-fortune` Edge Function 调用，改用 DreamChasers profile/fortune API。

## 验证命令

- 红灯：`npm run test -w apps/web -- timepick-api.test.ts`，新增规则函数缺失时失败。
- 绿灯：`npm run test -w apps/web -- timepick-api.test.ts`
- 静态红绿检查 `FortuneDrawDialog.tsx` 不再包含 Supabase profile / `draw-fortune` 调用。
- `npm run test -w apps/web -- timepick account`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- `npx eslint src/lib/timepick-api.ts src/components/FortuneDrawDialog.tsx`（TimePick）
- `npm run build`（TimePick）
- 浏览器/API 联调：未设置生日提示、保存生日、首次抽签、同日缓存。
- `npm run docs:sync`
- `git diff --check`（DreamChasers 和 TimePick）

## 验证结果

- DreamChasers 定向测试通过：5 个测试文件、46 个测试。
- DreamChasers typecheck 和 build 通过，build 输出包含 `/api/timepick/fortune/draw`。
- TimePick 定向 ESLint 和 build 通过。
- 联调确认未设置生日抽签返回 409，保存临时生日返回 200，首次抽签返回 201 且 `cached: false`，第二次抽签返回 200 且 `cached: true`，两次 draw id 一致。
- 测试后已删除临时 session 和今日抽签记录，并把 `lee@example.com` 的 `TimePickProfile.birthDate` 恢复为 `NULL`。

## 遗留问题

- `/fortune` 运势聊天页仍直接调用 Supabase Edge Function `fortune-agent`，需后续单独迁移或重做为平台 AI 能力。
- 上传/Storage、自动识别和模块树仍待后续单独迁移。
