# T038：麻将 Roguelike 永久固化能力和卡槽系统规划

- 领取人：Codex / 开发 B
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-38-mahjong-permanent-abilities.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：T030, T032, T035
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：后续实现能力配置时，需要继续保持 `手牌槽位`、`能力卡槽`、`局内奖励` 和 `道具` 的字段边界。
- 备注：已完成永久能力分层、基础成长、固化能力、起局能力和道具强化的最终结构。
