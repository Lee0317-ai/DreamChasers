---
name: T071 Lee 领取
description: Lee 领取 T071 任务，负责写入任务 ID 和每日进度去冲突规范。
type: project
---

### 当前任务

- 任务编号：T071
- 任务名称：建立任务 ID 与每日进度去冲突规范
- 负责人：Lee
- 状态：进行中
- 开始时间：2026-05-26
- 预计完成：2026-05-26
- 允许修改文件：`docs/tasks/NEXT_ID.md`, `docs/workflow/dual-dev-ai-workflow.md`, `docs/workflow/doc-sync-policy.md`, `AGENTS.md`, `CLAUDE.md`, `docs/tasks/items/T071-avoid-id-progress-conflict.md`, `docs/tasks/claims/T071-lee.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：无
- 验证命令：文档自审；UTF-8 无 BOM 检查；`git diff --check`
- 当前风险：无
- 备注：规范写入完成后，需更新 `docs/tasks/CLAIMS.md` 和 `docs/tasks/TASK_BOARD.md` 的自动摘要区。
