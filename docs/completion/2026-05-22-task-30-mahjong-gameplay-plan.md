# T030 完成记录：麻将 Roguelike 手动组合和成长系统规划

- 任务编号：T030
- 任务名称：麻将 Roguelike 手动组合和成长系统规划
- 负责人：Codex / 开发 B
- 完成时间：2026-05-22

## 修改文件

- `docs/modules/mahjong-roguelike/GAMEPLAY_PLAN.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/DECISIONS.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/2026-05-22.md`

## 实现内容

- 记录用户对玩法核心的调整：消除不自动触发，玩家手动点击 `吃 / 碰 / 杠` 按钮发动。
- 规划 `吃 / 碰 / 杠` 按钮状态：默认灰色，满足条件后金红冒火。
- 明确槽位满但仍有可发动组合时不失败，只有满槽且无可发动组合才失败。
- 将槽位设计为局外成长核心，规划槽位容量、备用槽、槽位净化等属性。
- 规划单一软货币 `铜钱`，用于槽位成长。
- 重新拆分局内 Roguelike 奖励、局外成长和主动道具。

## 验证命令

- 文档自审
- UTF-8 无 BOM 检查

## 验证结果

- 文档自审：通过。
- UTF-8 无 BOM 检查：通过。

## 遗留问题

- 多组合选择交互仍需定稿。
- 槽位成长数值只是占位，需要后续关卡测试。
- `胡牌目标` 是否进入 MVP 仍需讨论。
