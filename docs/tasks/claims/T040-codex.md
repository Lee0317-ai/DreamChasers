# T040：麻将 Roguelike 完整牌局规则、经济体力和失败救场规划

- 领取人：Codex / 开发 B
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-40-mahjong-complete-round-rules.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：T030, T033, T034, T035, T038
- 验证命令：`npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查
- 当前风险：双层经济和失败前救场后续必须在同一个规则模型中实现，避免 UI、能力、道具各自判定导致状态冲突。
- 备注：已完成完整牌局状态机、局内积分/铜钱分层、体力、孤张内部判定和满槽救场顺序规划。
