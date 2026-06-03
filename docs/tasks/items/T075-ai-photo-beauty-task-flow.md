# T075：AI 美颜任务化生成

- 优先级：P1
- 负责人：Codex / 开发 B
- 状态：待验收
- 依赖：T074
- 背景：AI 美颜图片编辑接口可能需要几十秒到数分钟，长请求会让前端按钮长期处于生成中，Network 也不易判断当前状态。
- 目标：将 `AI 美颜` 改为任务化生成，提交后立即返回 `taskId`，前端轮询状态，成功后再拉取结果图并替换画布。
- 不做：不接 Redis/数据库/对象存储，不做用户体系、额度扣减、任务历史、取消任务或多实例任务共享。
- 主要文件范围：`apps/web/src/app/api/tools/photo/**`, `apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**`, `docs/tasks/items/T075-ai-photo-beauty-task-flow.md`, `docs/tasks/claims/T075-codex.md`, `docs/progress/2026-05-27.md`
- 验证方式：`npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npx next build`; `git diff --check`
- 当前风险：第一版任务状态保存在当前 Node 进程内存中，开发服务重启或多实例部署会丢任务；正式上线前需要迁移到 Redis/数据库和对象存储。
- 执行记录：
  - 新增内存任务 store，提交后异步调用 AI 图片编辑模型。
  - `POST /api/tools/photo/beauty` 改为立即返回 `taskId` 和任务状态。
  - 新增 `GET /api/tools/photo/beauty/tasks/:taskId` 查询任务状态。
  - 新增 `GET /api/tools/photo/beauty/tasks/:taskId/result` 拉取生成结果图。
  - 前端改为提交任务后每 2 秒轮询，成功后自动拉取结果图并替换当前画布。
- 验证结果：`npm run typecheck -w apps/web` 通过；`npm run lint -w apps/web` 通过但保留既有 Prisma generated 警告；`npx next build` 通过；`git diff --check` 通过。
- 下一步：等待验收；正式上线前需要将内存任务迁移到 Redis/数据库和对象存储。
