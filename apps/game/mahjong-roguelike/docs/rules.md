# 胡了卜配置规则说明

## 1. 配置目标

当前配置服务于验证阶段和正式 MVP 前期。配置应保持引擎无关，不能写入 Cocos 节点名、GDevelop 对象名或 Web DOM 选择器。

规则真相来源：

- `packages/shared/src/mahjong-game.ts`

表现层职责：

- 读取 JSON。
- 渲染牌山、槽位、候选区和奖励选择。
- 把玩家输入转换成规则模型能理解的状态变化。

## 2. 关卡字段

- `id`：关卡唯一标识。
- `order`：验证或主线顺序。
- `type`：当前使用 `validation`，后续可扩展 `tutorial`、`campaign`、`daily`。
- `validationFocus`：本关要观察的体验问题，只用于内部测试和调参。
- `featuredCombos`：本关重点组合提示，可选 `chi`、`peng`、`gang`、`hu`；当前用于试玩页提示和密集牌山生成器插入重点组合包。
- `bossGoals`：Boss 关多目标配置，当前支持 `combo_count`、`suit_set` 和 `score_target`。`combo_count` 可统计 `chi`、`peng`、`gang`、`hu`。
- `rewardPool`：通关后可出现的奖励 ID。
- `initialSlotOrder`：开局已在主槽中的牌 ID。
- `initialReserveOrder`：开局已在备用槽中的牌 ID。
- `tiles`：牌列表。

每张牌包含：

- `id`
- `suit`
- `rank`
- `x`
- `y`
- `layer`
- `blockedBy`
- `location`

`blockedBy` 表示当前牌被哪些上层牌覆盖。只要这些上层牌仍在 `board`，当前牌不可点击。密集牌山生成器当前按“被上层牌遮挡超过 5%”写入 `blockedBy`，和试玩页点击禁用阈值保持一致。

## 3. 奖励字段

奖励的 `effects` 必须优先复用共享规则模型已有类型：

- `slot_limit_delta`
- `reserve_limit_delta`
- `shield_delta`
- `coin_delta`
- `tool_delta`
- `combo_score_bonus`

如果后续要新增补牌、换牌、弃牌、花色倍率等能力，应先扩展 `packages/shared/src/mahjong-game.ts` 和测试，再扩展配置。

## 4. 后续扩展顺序

建议顺序：

1. 用这 20 个 MVP 骨架关卡验证配置加载。
2. 通过表现层试玩继续调整可读性和可解性。
3. 视验证结果扩展到 20 关。
4. 再进入 Cocos/GDevelop 正式表现层接入。
