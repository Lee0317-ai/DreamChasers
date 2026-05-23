# T035 完成记录：麻将 Roguelike 局内能力池规划

- 任务编号：T035
- 任务名称：麻将 Roguelike 局内能力池规划
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

- 新增局内 Roguelike 能力池规划。
- 按 8 类能力组织：孤张/补牌/换牌、杠流、吃流、碰流、花色流、槽位流、道具流、信息流。
- 规划 44 个局内能力。
- 明确直接移除牌、补牌、换牌为强能力，需要稀有度和出现数量限制。
- 明确记牌器参与 `留杠不碰`、`牌谱清明`、`看张听路`、`余牌推演` 等信息类能力。

## 验证命令

- 文档自审
- UTF-8 无 BOM 检查

## 验证结果

- 文档自审：通过。
- UTF-8 无 BOM 检查：通过。

## 遗留问题

- 首批实现能力需要从 44 个中筛出最小闭环。
- 传说能力出现频率和解锁条件待定。
- 能力配置字段后续需要跟实现任务一起设计。
