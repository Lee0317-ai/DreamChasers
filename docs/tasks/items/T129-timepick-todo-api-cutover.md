# T129：TimePick 任务清单主链路 API 切换

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T114, T115, T120, T128
- 提出来源：IDEA-20260604-13
- 背景：T115 已让 TimePick 使用 DreamChasers 登录态，T116-T128 已逐步迁移文件夹、资源、标签、搜索、灵感、角色和学习重点链路。`TodoPage`、`AddTodoDialog` 和 `CompleteTodoDialog` 仍直接读写 Supabase `try_queue_links`。
- 目标：让 TimePick `/todo` 主页面的任务清单列表、新增、开始/继续、完成/暂缓/放弃和删除走 DreamChasers API，并复用 DreamChasers `TimePickTryQueueLink` 模型。
- 不做：不迁移未挂路由的 `TodoSimple` / `TodoPageSimple`；不迁移 `BatchImportDialog` 和批量优先级 Edge Function；不迁移模块树、抽签、Profile、上传/Storage、自动识别或批量学习重点优先级；不修改 Prisma schema；不导入历史数据；不重做任务清单 UI。
- 主要文件范围：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/todos/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoPage.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/AddTodoDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/CompleteTodoDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoSimple.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoPageSimple.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/BatchImportDialog.tsx`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：静态红绿检查 `node -e "const fs=require('fs'); for (const f of ['src/components/TodoPage.tsx','src/components/AddTodoDialog.tsx','src/components/CompleteTodoDialog.tsx']) { const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/'+f,'utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('try_queue_links'\\)/.test(s)) process.exit(1); }"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/timepick-api.ts src/components/TodoPage.tsx src/components/AddTodoDialog.tsx src/components/CompleteTodoDialog.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查任务新增、开始、完成和删除；`npm run docs:sync`; `git diff --check`

## 实施范围

- DreamChasers 增加 TimePick 任务清单规则、服务函数和 API route。
- TimePick API client 增加任务清单读取、新增、更新和删除方法。
- TimePick `TodoPage`、`AddTodoDialog`、`CompleteTodoDialog` 移除 Supabase `try_queue_links` 直连，改用 DreamChasers API client。
- `CompleteTodoDialog` 的转换资源能力复用既有 DreamChasers folders/resources API，不新增资源模型能力。

## 当前记录

- 开始时间：2026-06-04
- 完成时间：2026-06-04
- 实现内容：DreamChasers 新增 TimePick 任务清单规则、服务函数和 `GET/POST /api/timepick/todos`、`PATCH/DELETE /api/timepick/todos/[todoId]`；TimePick API client 新增任务清单读取、新增、更新和删除方法；`TodoPage`、`AddTodoDialog`、`CompleteTodoDialog` 已改用 DreamChasers API，不再直连 Supabase `try_queue_links`；转换资源复用既有 DreamChasers folders/resources API。
- 浏览器联调：Kimi WebBridge 打开 `http://localhost:8080/todo`，确认页面在登录后的任务清单且初始为空；同页真实 fetch 创建临时任务 `T129 临时任务` 返回 201，URL/title trim、tags 去空去重；列表读取返回 200 且包含临时任务；PATCH `trying` 返回 200 并写入 `start_time`；无评分完成返回 400 `完成任务需要评分。`；带评分完成返回 200 并写入 rating/notes/complete_time；DELETE 临时任务返回 200；最终列表不再包含临时任务。
- 验证结果：TDD 红绿测试、静态红绿检查、DreamChasers 定向测试、DreamChasers typecheck/build、TimePick 定向 ESLint/build 和真实浏览器联调已通过；文档同步和 diff 检查收尾执行。
