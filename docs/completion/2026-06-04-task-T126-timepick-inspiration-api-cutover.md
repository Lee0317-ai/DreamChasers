# T126 TimePick 灵感抽屉 API 切换完成记录

- 完成时间：2026-06-04
- 负责人：Lee
- 任务编号：T126
- 任务名称：TimePick 灵感抽屉 API 切换

## 修改文件

- `apps/web/src/lib/timepick/timepick-api-rules.ts`
- `apps/web/src/lib/timepick/timepick-api.ts`
- `apps/web/src/lib/timepick/__tests__/timepick-api.test.ts`
- `apps/web/src/app/api/timepick/inspirations/route.ts`
- `apps/web/src/app/api/timepick/inspirations/[inspirationId]/route.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/components/InspirationDrawer.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/components/RecentInspirations.tsx`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T126-timepick-inspiration-api-cutover.md`
- `docs/tasks/claims/T126-lee.md`
- `docs/progress/2026-06-04-lee.md`

## 实现内容

- 新增 TimePick 灵感规则：灵感字段映射、输入规范化和 owner 写权限校验。
- 新增 DreamChasers TimePick 灵感 API：
  - `GET /api/timepick/inspirations`
  - `POST /api/timepick/inspirations`
  - `PATCH /api/timepick/inspirations/[inspirationId]`
  - `DELETE /api/timepick/inspirations/[inspirationId]`
- 灵感列表仅返回当前用户数据，支持 `status` 和 `limit` 参数。
- 灵感新增和更新会 trim 内容与位置，并拒绝空内容。
- 灵感编辑、状态更新和删除只允许当前用户自己的记录。
- TimePick `InspirationDrawer` 和 `RecentInspirations` 已改用 DreamChasers API client，不再直接调用 Supabase `inspirations`。

## 验证命令

- `npm run test -w apps/web -- timepick-api`：通过
- `npm run test -w apps/web -- timepick account`：通过
- `npm run typecheck -w apps/web`：通过
- `npm run build -w apps/web`：通过
- `node -e "const fs=require('fs'); for (const f of ['src/components/InspirationDrawer.tsx','src/components/RecentInspirations.tsx']) { const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/'+f,'utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('inspirations'\\)/.test(s)) process.exit(1); }"`：通过
- `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/InspirationDrawer.tsx src/components/RecentInspirations.tsx`（TimePick）：通过
- `npm run build`（TimePick）：通过
- Kimi WebBridge 真实浏览器联调：通过

## 验证结果

- 灵感抽屉打开后请求 `GET /api/timepick/inspirations` 返回 200。
- 浏览器 fetch 创建临时灵感 `T126 灵感临时内容`，`POST /api/timepick/inspirations` 返回 201，ID `cmpyuw4cy000442i8hlez6oso`。
- DOM 文本确认 UI 渲染 `我的灵感 (1)` 和临时灵感。
- 编辑内容和位置触发 `PATCH /api/timepick/inspirations/cmpyuw4cy000442i8hlez6oso` 返回 200。
- 标记 `converted` 触发 `PATCH /api/timepick/inspirations/cmpyuw4cy000442i8hlez6oso` 返回 200。
- 删除临时灵感触发 `DELETE /api/timepick/inspirations/cmpyuw4cy000442i8hlez6oso` 返回 200。
- 最终 `GET /api/timepick/inspirations` 返回 `inspirations: []`，临时数据已清理。

## 遗留问题

- 本任务不迁移待办、抽签、Profile、上传/Storage、自动识别、角色选择、模块树或其他 Supabase 链路。
- TimePick `Home.tsx` 当前挂载了两个 `InspirationDrawer` 实例，Kimi 无障碍快照会混入重复抽屉文本；本任务未改该结构，只验证了真实 API 和 DOM 渲染。
