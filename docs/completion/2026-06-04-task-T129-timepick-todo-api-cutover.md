# T129 TimePick 任务清单主链路 API 切换完成记录

- 完成时间：2026-06-04
- 负责人：Lee
- 修改文件：`apps/web/src/lib/timepick/timepick-api-rules.ts`, `apps/web/src/lib/timepick/timepick-api.ts`, `apps/web/src/app/api/timepick/todos/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoPage.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/AddTodoDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/CompleteTodoDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`
- 实现内容：DreamChasers 新增 TimePick 任务清单列表、新增、更新和删除 API；TimePick `/todo` 主链路改用 DreamChasers API client，不再直连 Supabase `try_queue_links`；完成任务时保留评分校验，转换资源复用既有 DreamChasers 资源 API。
- 验证命令：`npm run test -w apps/web -- timepick-api`；静态红绿检查 `TodoPage` / `AddTodoDialog` / `CompleteTodoDialog` 不含 Supabase `try_queue_links`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/timepick-api.ts src/components/TodoPage.tsx src/components/AddTodoDialog.tsx src/components/CompleteTodoDialog.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器联调；`npm run docs:sync`; `git diff --check`
- 验证结果：已通过。Kimi WebBridge 真实浏览器联调确认任务新增、列表读取、开始、无评分完成拒绝、带评分完成和删除清理可用。
- 遗留问题：未迁移未挂路由的 `TodoSimple` / `TodoPageSimple`，未迁移 `BatchImportDialog` 和批量优先级 Edge Function；抽签、Profile、上传/Storage、自动识别和模块树仍需后续独立任务处理。
