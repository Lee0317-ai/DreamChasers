# T040：麻将 Roguelike 完整牌局规则、经济体力和失败救场规划

- 优先级：P1
- 负责人：Codex / 开发 B
- 状态：已完成
- 背景：当前已经确认手动 `吃 / 碰 / 杠`、牌谱记牌器、局内能力、永久能力和卡槽系统，但完整牌局中的输入锁定、撤销、组合选择、经济分层、体力和失败救场顺序还需要统一。
- 目标：在麻将 Roguelike 模块中补齐完整牌局规则，明确可点击牌、入槽动画锁定、撤回规则、多组合选择、孤张内部判定、局内积分与铜钱分层、体力系统、失败前救场顺序和新手引导口径。
- 不做：不实现代码，不做最终数值平衡，不生成 UI，不改应用页面。
- 依赖：T030, T033, T034, T035, T038
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 验证命令：`npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查
- 执行记录：
  - 已新增变更卡 `IDEA-20260522-10`。
  - 已领取任务并开始整理完整牌局规则。
  - 已在 `GAMEPLAY_PLAN.md` 补齐输入锁定、组合候选、双层经济、体力、失败前救场和新手引导。
  - 已在 `DECISIONS.md` 新增 D013-D017。
- 完成摘要：已确认完整牌局状态机、组合候选自由选择、局内积分和铜钱双层收益、体力系统、孤张内部判定、失败前救场顺序和新手引导口径。
