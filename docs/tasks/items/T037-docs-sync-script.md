# T037：新增 docs:sync 自动汇总脚本

- 优先级：P0
- 负责人：Codex / 两人协作
- 状态：已完成
- 背景：T036 已建立任务分片和领取分片规则，但主文档摘要仍需要人工汇总，后续仍可能产生重复劳动和冲突。
- 目标：新增 `npm run docs:sync`，从 `docs/tasks/items/` 和 `docs/tasks/claims/` 自动生成主文档摘要区。
- 不做：不重写历史任务表，不删除已有手工记录，不修改业务代码，不实现复杂任务数据库。
- 依赖：T036
- 允许修改文件：`package.json`, `scripts/docs-sync.mjs`, `docs/workflow/doc-sync-policy.md`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-37-docs-sync-script.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package-lock.json`
- 验证命令：`npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查
- 执行记录：新增 Node.js 同步脚本，生成 `TASK_BOARD.md`、`CLAIMS.md` 和 `CURRENT_STATUS.md` 中的自动摘要区。
- 完成摘要：主文档中的自动摘要区由脚本维护，后续修改任务或领取细节时优先改分片并运行 `npm run docs:sync`。
