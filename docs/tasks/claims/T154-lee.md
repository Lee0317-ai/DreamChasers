# T154：AI 修图工具 AI Gateway 接线规划

- 任务编号：T154
- 领取人：Lee
- 领取时间：2026-06-11
- 状态：已完成
- 预计完成：2026-06-11
- 允许修改文件：`docs/tasks/items/T154-ai-photo-editor-ai-gateway-integration-plan.md`, `docs/tasks/claims/T154-lee.md`, `docs/modules/photo-editor/**`, `docs/superpowers/plans/**`, `docs/progress/2026-06-11-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run docs:sync`; `rg -n "T\\[B\\]D|T\\[O\\]DO|待\\[补\\]" docs/tasks/items/T154-ai-photo-editor-ai-gateway-integration-plan.md docs/modules/photo-editor docs/superpowers/plans/2026-06-11-ai-photo-editor-ai-gateway-integration.md docs/progress/2026-06-11-lee.md docs/completion/2026-06-11-task-154-ai-photo-editor-ai-gateway-integration-plan.md`; `git diff --check`
- 当前阻塞：无
- 下一步：后续优先把现有 `AI 美颜` 从工具内直连 provider 迁到平台 AI Gateway，再决定智能擦除和换背景的资产链路。

## 备注

本任务只做规划与模块文档，不改 AI 修图运行时代码，不新增第二套图片模型配置栈。
