# T028 完成记录：独立模块归档规则写入整体架构

- 任务编号：T028
- 任务名称：将独立模块归档规则写入整体架构
- 完成时间：2026-05-21
- 负责人：Codex / 两人协作

## 修改文件

- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `docs/PROJECT_CONTEXT.md`
- `docs/superpowers/specs/2026-05-19-tool-game-ai-platform-design.md`
- `docs/plans/2026-05-19-tool-game-ai-platform-implementation.md`
- `docs/workflow/dual-dev-ai-workflow.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/2026-05-21.md`

## 实现内容

- 将“每个小工具或游戏必须有独立文档文件夹”的规则写入 AI 入口、项目上下文、整体设计稿、总实施计划和协作规范。
- 明确模块文档目录为 `docs/modules/<module-slug>/`。
- 明确每个模块目录至少包含 `README.md`、`IMPLEMENTATION_PLAN.md`、`PROGRESS.md`、`DECISIONS.md`、`HANDOFF.md`。
- 明确 Web 工具代码目录为 `apps/web/src/modules/tools/<module-slug>/`。
- 明确 Web 游戏接入目录为 `apps/web/src/modules/games/<module-slug>/`。
- 明确正式游戏工程目录为 `apps/game/<module-slug>/`。
- 明确 `apps/web/src/app/**` 路由层只做入口、元数据和模块挂载。

## 验证命令

- 文档自审
- 旧路径扫描
- `git diff --check`
- `file -I ...`

## 验证结果

- 入口文档和整体架构文档已同步模块规则。
- 未修改业务代码。
- 未新增依赖。

## 遗留问题

- 现有待领取任务中，AI 修图和麻将模块的文件范围后续领取前还应按新规则细化到独立模块目录。
