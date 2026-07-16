# T166：AI 修图剩余 AI 功能补全

- 领取人：Lee
- 领取时间：2026-06-29
- 状态：待验收
- 预计完成：2026-06-29
- 允许修改文件：`apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**`, `apps/web/src/app/api/tools/photo/**`, `docs/modules/photo-editor/**`, `docs/tasks/items/T166-ai-photo-remaining-ai-tools.md`, `docs/tasks/claims/T166-lee.md`, `docs/progress/2026-06-29-lee.md`, `docs/completion/2026-06-29-task-T166-ai-photo-remaining-ai-tools.md`
- 禁止修改文件：`apps/web/prisma/**`, `apps/game/**`, `deploy/**`, PDF 工具箱、TimePick、账号中心和胡了卜业务代码
- 依赖任务：T155, T165
- 验证命令：`npm run test -w apps/web -- photo-edit repair enhance prompt-edit openai-compatible`; `npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `git diff --check`; 浏览器冒烟 `http://localhost:3029/tools/ai-photo-editor`
- 备注：已完成剩余 AI 工具接线，等待验收；typecheck 受既有依赖缺失和认证类型问题阻塞。
