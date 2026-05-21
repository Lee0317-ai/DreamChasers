# CLAUDE.md

这是 `D:\DreamChasers` 项目的 Claude / Claude Code 入口说明。开始任何任务前先读本文件。

## 文档输出格式

根据内容类型选择输出格式，不要默认用 Markdown：

| 场景 | 格式 | 原因 |
|------|------|------|
| README、API 文档、PR 描述、需长期维护的规范 | **Markdown** | 手写友好，Git diff 清晰 |
| 需人类频繁手动编辑的文件 | **Markdown** | 纯文本易于修改 |
| AI 生成的规划/方案对比/调研报告 | **HTML** | 信息密度高，可读性强 |
| 需交互元素（滑块、拖拽、实时预览） | **HTML** | 天然支持交互 |
| 对外展示/汇报材料 | **HTML** | 开箱即读，视觉体验好 |
| 一次性协作工具（如看板、编辑器） | **HTML** | 用完即扔，无版本控制负担 |

**快速决策**：需要人类手写编辑或版本控制 diff 的 → Markdown；需要信息可视化、交互或一次性阅读的 → HTML。

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

如果只做某个小工具或游戏，还必须读取对应模块目录：

- PDF 工具箱：`docs/modules/pdf-toolbox/`
- AI 修图工具：`docs/modules/photo-editor/`
- 麻将 Roguelike 消除：`docs/modules/mahjong-roguelike/`

每个小工具或游戏都必须有独立模块文档文件夹：`docs/modules/<module-slug>/`。模块目录至少包含 `README.md`、`IMPLEMENTATION_PLAN.md`、`PROGRESS.md`、`DECISIONS.md`、`HANDOFF.md`。

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
- 每个工具或游戏的代码必须放在独立模块目录。Web 工具使用 `apps/web/src/modules/tools/<module-slug>/`，Web 游戏接入使用 `apps/web/src/modules/games/<module-slug>/`，正式游戏工程使用 `apps/game/<module-slug>/`。`apps/web/src/app/**` 下的路由只做入口。

## 技术方向

- Web：Next.js + TypeScript。
- 数据库：PostgreSQL。
- ORM：Prisma。
- 缓存：Redis。
- 游戏：Cocos Creator。
- 部署：Ubuntu 24.04 + Docker Compose + Nginx。
- superbase
