# 弹珠机福利玩法交接

## 1. 当前结论

弹珠机玩法可以作为后续轻量留存小游戏和平台福利活动保留，但不要实现“用户消耗可购买 AI 积分，随机倍率返还更多 AI 积分”的结构。

推荐第一版方向：

```text
每日免费次数 / 平台任务 / 充值赠送
  -> 获得 playTickets
  -> 游玩弹珠机
  -> 奖励 gameCoins、装饰资产或低额 bonusCredits
  -> bonusCredits 只能用于 AI 能力，不能继续玩弹珠机
```

## 2. 下一位开发者先读

1. `docs/modules/marble-pachinko/README.md`
2. `docs/modules/marble-pachinko/DECISIONS.md`
3. `docs/modules/marble-pachinko/IMPLEMENTATION_PLAN.md`
4. `docs/superpowers/specs/2026-06-05-platform-capability-retention-workflow-design.md`
5. `docs/superpowers/plans/2026-06-05-ai-gateway-mvp-model-selection.md`

## 3. 关键风险

- 不要把 `paidCredits` 当成游戏筹码。
- 不要按随机倍率返还可再次游玩的同类积分。
- 不要承诺礼品卡、现金、提现、转售或回购。
- 不要在未做合规确认前上线直接购买游戏次数。
- 不要绕过账号资产层私自记录奖励。

## 4. 实现前必须确认

- 当前任务编号和领取分片。
- 是否只做无奖励物理原型，还是接入平台资产。
- `paidCredits`、`bonusCredits`、`playTickets`、`gameCoins` 的数据模型和服务端校验。
- 概率、每日上限、有效期、未成年人限制和活动规则。
- 验证命令和浏览器桌面/移动端检查方式。
