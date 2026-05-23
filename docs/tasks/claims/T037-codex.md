# T037：新增 docs:sync 自动汇总脚本

- 领取人：Codex / 两人协作
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`package.json`, `scripts/docs-sync.mjs`, `docs/workflow/doc-sync-policy.md`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-37-docs-sync-script.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package-lock.json`
- 依赖任务：T036
- 验证命令：`npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查
- 当前风险：自动摘要区必须使用固定标记，避免脚本误改历史手写内容。
- 备注：已新增 `npm run docs:sync`，从任务分片和领取分片生成主文档摘要区。
