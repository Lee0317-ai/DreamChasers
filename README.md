# DreamChasers

梦想启航

## 协作入口

新开发者 clone 仓库后，先阅读：

1. `AGENTS.md`
2. `docs/PROJECT_CONTEXT.md`
3. `docs/status/CURRENT_STATUS.md`
4. `docs/tasks/TASK_BOARD.md`
5. `docs/tasks/CLAIMS.md`

开始开发前先在 `docs/tasks/CLAIMS.md` 领取任务，完成后更新状态、进展和完成记录。

## 模块归档规则

每个小工具或游戏都必须独立归档：

- 文档目录：`docs/modules/<module-slug>/`
- Web 工具代码：`apps/web/src/modules/tools/<module-slug>/`
- Web 游戏接入代码：`apps/web/src/modules/games/<module-slug>/`
- 正式游戏工程：`apps/game/<module-slug>/`

模块文档目录至少包含 `README.md`、`IMPLEMENTATION_PLAN.md`、`PROGRESS.md`、`DECISIONS.md`、`HANDOFF.md`。路由目录 `apps/web/src/app/**` 只做入口，不承载大量业务逻辑。

建议分支：

- 开发 A：`feature/platform-foundation`
- 开发 B：`feature/ai-photo-game`
- 文档同步：`docs/planning-sync`
