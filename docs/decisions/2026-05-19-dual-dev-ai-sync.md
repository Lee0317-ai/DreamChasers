# 决策：双人开发和 AI 同步方式

**日期**：2026-05-19

## 背景

项目由两名开发者并行推进，并且双方都会使用各自的 AI。需要避免 AI 不知道上下文、重复劳动、覆盖对方改动。

## 选项

1. 只靠口头同步。
2. 用一个统一状态文档同步。
3. 用总入口文档 + 状态文档 + 任务池 + 领取记录 + 变更入口 + 计划文档 + 协作规范同步。

## 决策

选择第 3 个方案。

## 理由

- AI 每次会话都需要明确上下文。
- 双人开发必须明确文件所有权。
- 状态、计划、完成记录分开，后续更容易追踪。

## 后续影响

每个 AI 会话开始前必须先读：

1. `docs/PROJECT_CONTEXT.md`
2. `docs/status/CURRENT_STATUS.md`
3. `docs/tasks/TASK_BOARD.md`
4. `docs/tasks/CLAIMS.md`
5. `docs/tasks/CHANGE_INTAKE.md`
6. `docs/plans/2026-05-19-tool-game-ai-platform-implementation.md`
7. `docs/workflow/dual-dev-ai-workflow.md`

完成任务后必须更新：

- `docs/status/CURRENT_STATUS.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- 如果有新想法或需求变更，更新 `docs/tasks/CHANGE_INTAKE.md`
- `docs/progress/YYYY-MM-DD.md`
- `docs/completion/<task-name>.md`
