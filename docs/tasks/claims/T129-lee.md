# T129：TimePick 任务清单主链路 API 切换

- 领取人：Lee
- 领取时间：2026-06-04
- 状态：待验收
- 预计完成：2026-06-04
- 允许修改文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/todos/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoPage.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/AddTodoDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/CompleteTodoDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoSimple.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoPageSimple.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/BatchImportDialog.tsx`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T114, T115, T120, T128
- 验证命令：静态红绿检查 `node -e "const fs=require('fs'); for (const f of ['src/components/TodoPage.tsx','src/components/AddTodoDialog.tsx','src/components/CompleteTodoDialog.tsx']) { const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/'+f,'utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('try_queue_links'\\)/.test(s)) process.exit(1); }"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/timepick-api.ts src/components/TodoPage.tsx src/components/AddTodoDialog.tsx src/components/CompleteTodoDialog.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查任务新增、开始、完成和删除；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待验收；后续继续按独立任务迁移抽签、Profile、上传/Storage、自动识别、模块树、批量导入和批量优先级 Edge Function 等剩余 Supabase 链路。
- 完成备注：任务清单主链路列表、新增、开始/继续、完成/暂缓/放弃和删除已切到 DreamChasers API；Kimi WebBridge 真实浏览器联调确认创建、列表读取、开始、无评分完成 400、带评分完成和删除清理可用。
