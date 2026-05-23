# T033 完成记录：麻将 Roguelike 组合提示和牌堆生成规则

- 任务编号：T033
- 任务名称：麻将 Roguelike 组合提示和牌堆生成规则
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

- 确认 `吃 / 碰 / 杠` 出现合法组合即提示。
- 确认可用按钮需要展示将要消除的内容。
- 确认多个组合时玩家可以选择具体组合。
- 补充后续高阶挑战中的手动选牌出牌规则。
- 明确 `碰`、`吃`、`杠` 之间的冲突是策略来源。
- 明确牌堆采用组合包受控随机生成，不要求完整麻将牌组。
- 补充杠包被碰后产生孤张的消化机制。

## 验证命令

- 文档自审
- UTF-8 无 BOM 检查

## 验证结果

- 文档自审：通过。
- UTF-8 无 BOM 检查：通过。

## 遗留问题

- 组合选择 UI 交互形式待定。
- 孤张处理能力需要进入局内奖励和道具清单。
- 可解性校验算法后续实现时需要单独设计。
