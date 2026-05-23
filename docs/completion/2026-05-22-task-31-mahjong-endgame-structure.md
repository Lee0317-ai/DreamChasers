# T031 完成记录：麻将 Roguelike 最终模式结构定稿

- 任务编号：T031
- 任务名称：麻将 Roguelike 最终模式结构定稿
- 负责人：Codex / 开发 B
- 完成时间：2026-05-22

## 修改文件

- `docs/modules/mahjong-roguelike/GAMEPLAY_PLAN.md`
- `docs/modules/mahjong-roguelike/DECISIONS.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/2026-05-22.md`

## 实现内容

- 记录用户确认采用推荐的最终结构。
- 将最终模式结构写入玩法文档：`闯关模式`、`无尽牌山`、`高阶周目`、`每日牌局`、`成就图鉴`。
- 明确 20 关是首次完整通关，不是游戏终点。
- 明确 20 关后进入无尽牌山，继续冲层数。
- 明确高阶周目用于通关后的难度轮回。
- 明确每日牌局用于固定种子挑战和后续回访。
- 明确成就图鉴用于记录特殊打法、最高层数和长期收集。

## 验证命令

- 文档自审
- UTF-8 无 BOM 检查

## 验证结果

- 文档自审：通过。
- UTF-8 无 BOM 检查：通过。

## 遗留问题

- 无尽牌山层数增长公式待设计。
- 高阶周目命名和词缀组合待定。
- 每日牌局是否接排行榜后续再定。
