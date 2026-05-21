# T026 完成记录：工具/游戏独立模块归档规范

- 任务编号：T026
- 任务名称：建立工具/游戏独立模块归档规范
- 完成时间：2026-05-21
- 负责人：Codex / 两人协作

## 修改文件

- `docs/modules/README.md`
- `docs/modules/pdf-toolbox/README.md`
- `docs/modules/pdf-toolbox/IMPLEMENTATION_PLAN.md`
- `docs/modules/pdf-toolbox/PROGRESS.md`
- `docs/modules/pdf-toolbox/DECISIONS.md`
- `docs/modules/pdf-toolbox/HANDOFF.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/2026-05-21.md`

## 实现内容

- 建立“每个小工具或游戏一个独立文档文件夹”的模块归档规范。
- 明确每个模块目录至少包含 `README.md`、`IMPLEMENTATION_PLAN.md`、`PROGRESS.md`、`DECISIONS.md`、`HANDOFF.md`。
- 明确代码也必须按模块独立：Web 工具放 `apps/web/src/modules/tools/<module-slug>/`，Web 游戏接入放 `apps/web/src/modules/games/<module-slug>/`，正式游戏工程放 `apps/game/<module-slug>/`。
- 将 PDF 工具箱文档迁移到 `docs/modules/pdf-toolbox/`。
- 将 T015 的计划代码范围调整为 `apps/web/src/modules/tools/pdf-toolbox/**`。

## 验证命令

- 文档自审
- `git diff --check`
- `file -I ...`

## 验证结果

- 文档结构已更新。
- 未修改业务代码。
- 未新增依赖。

## 遗留问题

- 后续每个新工具和游戏任务都必须先建立模块目录后再实现。
