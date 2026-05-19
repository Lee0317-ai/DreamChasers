# CLAUDE.md

这是 `D:\DreamChasers` 项目的 Claude / Claude Code 入口说明。开始任何任务前先读本文件。

## 必须先读

按顺序读取：

1. `docs/PROJECT_CONTEXT.md`
2. `docs/status/CURRENT_STATUS.md`
3. `docs/tasks/TASK_BOARD.md`
4. `docs/tasks/CLAIMS.md`
5. `docs/tasks/CHANGE_INTAKE.md`
6. `docs/workflow/dual-dev-ai-workflow.md`
7. `docs/plans/2026-05-19-tool-game-ai-platform-implementation.md`
8. `docs/superpowers/specs/2026-05-19-tool-game-ai-platform-design.md`

然后复述：

- 本次任务编号。
- 本次任务目标。
- 负责人。
- 允许修改文件。
- 禁止修改文件。
- 验证命令。
- 完成后要更新的文档。

信息不完整时，先补文档或询问，不要直接写代码。

领取任务前必须在 `docs/tasks/CLAIMS.md` 新增领取记录。没有领取记录，不要改代码。

如果用户提出新想法、新功能、需求变更，或要求 AI “先规划再实现”，必须先写入 `docs/tasks/CHANGE_INTAKE.md`，再进入 `docs/tasks/TASK_BOARD.md`。没有任务编号、文件范围和领取记录，不要实施。

## 必须后更新

每次开发或文档修改完成后，更新：

1. `docs/status/CURRENT_STATUS.md`
2. `docs/tasks/TASK_BOARD.md`
3. `docs/tasks/CLAIMS.md`
4. 如有新想法或需求变更，更新 `docs/tasks/CHANGE_INTAKE.md`
5. `docs/progress/YYYY-MM-DD.md`
6. 已完成任务的 `docs/completion/YYYY-MM-DD-task-<number>-<short-name>.md`

## 项目当前范围

第一阶段只做：

- PDF 工具箱。
- AI 修图工具。
- 麻将 Roguelike 消除小游戏。

工具和游戏平级。AI 只做辅助搜索和后续能力预留。

## 编码规范

- 所有新增和修改文件必须是 UTF-8 无 BOM。
- 不提交乱码。
- 不使用 GBK/ANSI。

## 协作规则

- 按 `docs/workflow/dual-dev-ai-workflow.md` 执行。
- 不修改其他负责人范围内的文件。
- 修改共享文件前先更新 `docs/status/CURRENT_STATUS.md`。
- 不覆盖其他开发者或 AI 的改动。

## 技术方向

- Web：Next.js + TypeScript。
- 数据库：PostgreSQL。
- ORM：Prisma。
- 缓存：Redis。
- 游戏：Cocos Creator。
- 部署：Ubuntu 24.04 + Docker Compose + Nginx。
