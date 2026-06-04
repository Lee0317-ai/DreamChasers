# T128 TimePick 学习重点 API 切换完成记录

- 完成时间：2026-06-04
- 负责人：Lee
- 任务编号：T128
- 任务名称：TimePick 学习重点 API 切换

## 修改文件

- `apps/web/src/lib/timepick/timepick-api-rules.ts`
- `apps/web/src/lib/timepick/timepick-api.ts`
- `apps/web/src/lib/timepick/__tests__/timepick-api.test.ts`
- `apps/web/src/app/api/timepick/learning-focus/route.ts`
- `apps/web/src/app/api/timepick/learning-focus/[focusId]/route.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/components/LearningFocusDialog.tsx`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T128-timepick-learning-focus-api-cutover.md`
- `docs/tasks/claims/T128-lee.md`
- `docs/progress/2026-06-04-lee.md`

## 实现内容

- 新增 TimePick 学习重点规则：字段映射、输入规范化和 owner 写权限校验。
- 新增 DreamChasers TimePick 学习重点 API：
  - `GET /api/timepick/learning-focus`
  - `POST /api/timepick/learning-focus`
  - `PATCH /api/timepick/learning-focus/[focusId]`
  - `DELETE /api/timepick/learning-focus/[focusId]`
- 学习重点列表仅返回当前用户数据。
- 学习重点新增和更新会 trim 名称，并拒绝空名称。
- 同义词会 trim、去空和去重。
- 学习重点编辑和删除只允许当前用户自己的记录。
- TimePick `LearningFocusDialog` 已改用 DreamChasers API client，不再直接调用 Supabase `learning_focus`。

## 验证命令

- `npm run test -w apps/web -- timepick-api`：通过
- `npm run test -w apps/web -- timepick account`：通过
- `npm run typecheck -w apps/web`：通过
- `npm run build -w apps/web`：通过
- `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/components/LearningFocusDialog.tsx','utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('learning_focus'\\)/.test(s)) process.exit(1);"`：通过
- `npx eslint src/lib/timepick-api.ts src/components/LearningFocusDialog.tsx`（TimePick）：通过
- `npm run build`（TimePick）：通过
- Kimi WebBridge 真实浏览器联调：通过

## 验证结果

- 打开 `http://localhost:8080/home` 后页面标题为 `首页 - 拾光`，未跳转登录页。
- 同页真实 fetch 首次 `GET /api/timepick/learning-focus` 返回 200，列表为空。
- 创建临时学习重点 `T128 学习重点临时`，`POST /api/timepick/learning-focus` 返回 201，ID `cmpyxfb4300048qi8gls5h7ue`。
- 创建响应中名称被 trim，同义词从 `api, api, 迁移` 规范化为 `api, 迁移`。
- `PATCH /api/timepick/learning-focus/cmpyxfb4300048qi8gls5h7ue` 更新同义词返回 200，同义词规范化为 `react, hooks`。
- 空名称 `POST /api/timepick/learning-focus` 返回 400，响应 `学习重点名称不能为空。`。
- 删除临时学习重点触发 `DELETE /api/timepick/learning-focus/cmpyxfb4300048qi8gls5h7ue` 返回 200。
- 最终列表不再包含临时学习重点，临时数据已清理。

## 遗留问题

- 本任务不迁移待办、抽签、Profile、上传/Storage、自动识别、模块树或批量优先级 Edge Function。
- `LearningFocusDialog` 当前没有挂到可点击页面入口，本次真实联调用已登录 TimePick 页面上下文 fetch 验证 API、cookie 和 CORS 链路。
