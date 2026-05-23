# 任务分片目录

**用途**：每个任务一份独立详情文件，减少多人同时修改 `docs/tasks/TASK_BOARD.md` 的冲突。

## 命名规则

`TXXX-<short-slug>.md`

示例：

- `T036-doc-sync-policy.md`
- `T015-pdf-toolbox-mvp.md`

## 推荐内容

```md
# TXXX：任务名称

- 优先级：
- 负责人：
- 状态：
- 背景：
- 目标：
- 不做：
- 依赖：
- 允许修改文件：
- 禁止修改文件：
- 验证命令：
- 执行记录：
- 完成摘要：
```

主任务池 `docs/tasks/TASK_BOARD.md` 只保留任务列表和状态摘要。任务过程细节优先写在本目录的任务分片中。

运行 `npm run docs:sync` 可以把本目录中的任务分片汇总到主文档的自动生成摘要区。
