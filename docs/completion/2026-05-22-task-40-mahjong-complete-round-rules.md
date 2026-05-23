# T040 完成记录：麻将 Roguelike 完整牌局规则、经济体力和失败救场规划

- 任务编号：T040
- 任务名称：麻将 Roguelike 完整牌局规则、经济体力和失败救场规划
- 负责人：Codex / 开发 B
- 完成时间：2026-05-22

## 修改文件

- `docs/modules/mahjong-roguelike/GAMEPLAY_PLAN.md`
- `docs/modules/mahjong-roguelike/DECISIONS.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T040-mahjong-complete-round-rules.md`
- `docs/tasks/claims/T040-codex.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/2026-05-22.md`

## 实现内容

- 补齐完整牌局输入规则：只允许点击未被上层牌覆盖的牌，入槽动画期间锁定输入。
- 明确入槽后不能手动撤销，只能通过 `撤回` 道具处理。
- 明确多个 `吃 / 碰 / 杠` 候选由玩家自由选择，点击发动后不做二次确认。
- 明确主槽满时先锁定继续选牌，再按组合和救场资源判定，不提前失败。
- 将收益拆为 `局内积分` 和 `铜钱` 两层：局内积分用于本轮购买道具，铜钱用于永久成长。
- 新增体力系统口径：每局消耗 5 点体力，体力上限 100 点，按时间恢复，可用铜钱或付费购买。
- 明确孤张只做内部判定，不直接在牌面标记给玩家。
- 明确失败前救场顺序：组合检测、备用槽自动救场、满槽护符、救场道具窗口、首败保护、失败结算。
- 将教学口径调整为 `新手引导`，不是独立关卡类型。

## 验证命令

- `npm run docs:sync`
- 文档自审
- UTF-8 无 BOM 检查

## 验证结果

- 文档自审：通过。
- `npm run docs:sync`：通过。
- UTF-8 无 BOM 检查：通过。

## 遗留问题

- 牌堆生成约束需要单独展开，包括每关总牌数、组合包比例、干扰包上限、死孤张容忍数量和可解路径校验。
- 局内积分商店的出现时机仍需确认：关间购买，还是危局中也允许购买救场资源。
- `弃牌符` 是否进入 MVP 待定。
- 组合候选区的最终 UI 位置待定。
