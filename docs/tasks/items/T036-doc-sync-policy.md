# T036：降低多人协作文档冲突的分片同步规范

- 优先级：P0
- 负责人：Codex / 两人协作
- 状态：已完成
- 背景：多人开发时，`TASK_BOARD.md`、`CLAIMS.md`、`CURRENT_STATUS.md` 等主文档需要频繁更新，导致每次提交都容易冲突。
- 目标：建立“分步写分片，完整任务完成后再汇总主文档”的协作规则，并同步到 AI 入口和协作流程。
- 不做：不实现自动生成脚本，不调整业务代码，不重写已有历史任务。
- 依赖：无
- 允许修改文件：`AGENTS.md`, `CLAUDE.md`, `docs/PROJECT_CONTEXT.md`, `docs/workflow/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-36-doc-sync-policy.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 执行记录：新增分片目录说明和文档同步策略；更新 AI 入口、协作流程、任务池、领取记录和当前状态。
- 完成摘要：后续分步操作优先更新任务分片、领取分片、模块进展或当天进展；只有任务完整完成、阻塞、冲突、交接或范围变化时才更新主文档。
