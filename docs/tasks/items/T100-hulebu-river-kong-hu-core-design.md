# T100：胡了卜有限牌河、补杠和胡牌奖励核心玩法设计

- 优先级：P1
- 负责人：Lee
- 默认负责人：Lee
- 状态：待验收
- 依赖：T094, T098, T099
- 提出来源：IDEA-20260602-02
- 涉及模块：胡了卜 / 朋友试玩 Demo / 核心规则重整 / 微信小游戏方向
- 主要文件范围：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T100-hulebu-river-kong-hu-core-design.md`, `docs/tasks/claims/T100-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-02-hulebu-river-kong-hu-core-design.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T100-hulebu-river-kong-hu-core-design.md docs/tasks/claims/T100-lee.md docs/superpowers/specs/2026-06-02-hulebu-river-kong-hu-core-design.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/DECISIONS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`; `git diff --check`

## 背景

朋友试玩反馈和后续讨论暴露出一个核心问题：如果 `吃 / 碰 / 杠 / 胡` 都要求把所有牌完美组合消除，玩家一步选错就容易制造大量孤张。严格按每种 4 张或几副麻将生成时，`碰` 后第 4 张、`吃` 后剩余对子、字牌无法吃等情况都会放大卡手。

Lee 确认新方向：保留麻将组合乐趣，但加入有限牌河、补杠、胡牌奖励、听牌提示、明杠开山和孤张预算，让系统给玩家 2-3 条恢复路线，而不是保证每一步都能赢。

## 目标

- 形成一份可执行玩法规格，明确单关如何开始、如何失败、如何通关。
- 明确有限牌河、明碰区、补杠、明杠、胡牌奖励、听牌提示和牌河回收的第一版规则。
- 明确牌数生成和孤张预算原则，避免顺子牌只给 3 张导致大量 `2 张残组`。
- 明确 10 关试玩 Demo 的后续验证路线。

## 不做

- 不修改 HTML 试玩页代码。
- 不修改 Cocos 正式工程。
- 不修改共享规则模型或测试。
- 不做完整麻将算法、听牌全枚举、番型结算或真实打牌摸牌流程。
- 不做最终 UI 美术、动画、广告、账号、排行榜或商业化。

## 验收标准

- 玩法规格覆盖有限牌河、明碰区、补杠、明杠开山、胡牌爆发、听牌提示、牌河回收、孤张预算、牌数规则、胜负条件和试玩关卡节奏。
- 模块决策记录写入新规则口径。
- 模块进展和交接文档写明下一步应按该规格拆实现任务。
- 文档同步、占位符扫描和 diff 检查通过。

## 进展

- 2026-06-02：已创建任务并领取，开始整理规则规格。
- 2026-06-02：已完成核心玩法规格，明确有限牌河、明碰区、补杠、明杠开山、胡牌奖励、听牌提示、牌河回收、牌数规则和孤张预算。
- 2026-06-02：已同步模块决策、进展和交接说明；后续应拆实现任务验证 HTML Demo。
