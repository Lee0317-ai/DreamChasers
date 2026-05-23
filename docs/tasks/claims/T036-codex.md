# T036：降低多人协作文档冲突的分片同步规范

- 领取人：Codex / 两人协作
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`AGENTS.md`, `CLAUDE.md`, `docs/PROJECT_CONTEXT.md`, `docs/workflow/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-36-doc-sync-policy.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：无
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：如果后续仍把主文档当作每一步的写入入口，冲突会继续出现；需要 AI 入口文件明确新规则。
- 备注：已建立分片同步规则，后续完整任务完成时再由 AI 汇总主文档。
