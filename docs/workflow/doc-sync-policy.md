# 文档同步与冲突规避规则

**最后更新**：2026-05-22
**用途**：降低多人开发时 `TASK_BOARD.md`、`CLAIMS.md`、`CURRENT_STATUS.md` 等主文档的 Git 冲突。

## 1. 核心原则

- 分步操作写分片文件。
- 完整任务完成后再汇总主文档。
- 主文档是汇总视图，不作为高频写入入口。
- 同一个任务过程内，不因为每个小步骤反复修改主文档。
- 涉及共享文件或负责人变更时，仍必须及时登记。

## 2. 分片文件

后续新增任务优先使用这些分片文件：

- 任务详情：`docs/tasks/items/TXXX-<slug>.md`
- 领取记录：`docs/tasks/claims/TXXX-<owner>.md`
- 模块进展：`docs/modules/<module-slug>/PROGRESS.md`
- 当天进展（个人分片）：`docs/progress/YYYY-MM-DD-lee.md`、`docs/progress/YYYY-MM-DD-jaspon.md`
- 完成记录：`docs/completion/YYYY-MM-DD-task-<number>-<short-name>.md`

`docs/tasks/TASK_BOARD.md`、`docs/tasks/CLAIMS.md`、`docs/status/CURRENT_STATUS.md` 只在任务领取、任务完成、阻塞、交接或冲突时更新。

## 3. 开工时更新

开始任务时必须完成：

1. 在 `docs/tasks/claims/` 新增领取分片。
2. 如任务不存在，在 `docs/tasks/items/` 新增任务分片。
3. 如果任务会影响共享主文档、共享代码或另一方范围，再更新 `docs/tasks/CLAIMS.md` 和 `docs/status/CURRENT_STATUS.md`。
4. `docs/tasks/TASK_BOARD.md` 只新增任务行或状态变化，不记录每个执行步骤。

## 4. 执行中更新

执行过程中只更新与当前任务直接相关的分片或模块文档：

- 代码任务：更新对应模块的 `PROGRESS.md` 或任务分片。
- 规划任务：更新对应模块计划、决策或任务分片。
- 新想法：先写 `docs/tasks/CHANGE_INTAKE.md`，再决定是否入池。

除非出现阻塞、冲突、交接、范围变化或验收状态变化，不要更新主文档。

## 5. 完整任务完成时汇总

任务完整完成后，AI 或负责人必须一次性汇总：

1. 更新 `docs/tasks/TASK_BOARD.md` 的状态、范围或下一步。
2. 更新 `docs/tasks/CLAIMS.md` 的领取状态和备注。
3. 更新 `docs/status/CURRENT_STATUS.md` 的快照摘要。
4. 更新个人当天进展分片 `docs/progress/YYYY-MM-DD-<owner>.md`（如 `2026-05-26-lee.md`）。
5. 新增 `docs/completion/YYYY-MM-DD-task-<number>-<short-name>.md`。

这一步是主文档同步点。分步开发、局部试验、临时修正文案时，不需要反复同步主文档。

## 6. 必须立即同步主文档的情况

以下情况不能等到任务完成：

- 新任务进入任务池。
- 任务负责人变化。
- 文件范围扩大到共享文件。
- 两个人或两个 AI 可能修改同一文件。
- 任务阻塞，需要别人决策。
- 任务从进行中转为待验收。
- 已经发现主文档信息会误导另一方开工。

## 7. 建议提交粒度

- 分片和模块文档可以随任务提交。
- 主文档汇总尽量放在任务收尾提交。
- 不要把多个无关任务的主文档汇总混在一个提交里。
- 如果多人同时完成任务，由集成负责人先拉取最新主分支，再做一次统一汇总。

## 8. 自动汇总脚本

运行：

```bash
npm run docs:sync
```

脚本会扫描：

- `docs/tasks/items/*.md`
- `docs/tasks/claims/*.md`
- `docs/progress/YYYY-MM-DD-*.md`

并更新这些主文档中的自动生成摘要区：

- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/YYYY-MM-DD.md`（汇总 lee / jaspon 个人分片）

脚本只改 `<!-- DOCS_SYNC_* -->` 标记包住的区域，不覆盖历史手写内容。需要调整任务细节时，优先修改分片文件，然后重新运行脚本。

**个人进度分片规则**：
- 各自只写自己的分片，命名固定为 `YYYY-MM-DD-lee.md` 或 `YYYY-MM-DD-jaspon.md`。
- 不动他人的分片。
- 主文件 `YYYY-MM-DD.md` 由 `docs:sync` 自动生成，不手写。
- 如果某天只有一人工作，只生成对应个人的分片，`docs:sync` 仍会正确生成主文件。
- 历史已有 `2026-05-19.md` 至 `2026-05-26.md` 保留不变，从 2026-05-27 起执行新规则。
