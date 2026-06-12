# T145：弹珠机福利玩法规划落档

- 优先级：P2
- 负责人：Lee
- 状态：待验收
- 依赖：T142, T143
- 创建日期：2026-06-08
- 来源：IDEA-20260608-01
- 涉及模块：弹珠机福利玩法 / 平台积分 / AI 积分 / 游戏留存 / 福利活动合规边界
- 主要文件范围：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T145-marble-pachinko-reward-planning.md`, `docs/tasks/claims/T145-lee.md`, `docs/modules/marble-pachinko/**`, `docs/progress/2026-06-08-lee.md`, `docs/completion/2026-06-08-task-145-marble-pachinko-reward-planning.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 禁止修改文件：`apps/**`, `packages/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `package.json`, `package-lock.json`
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T145-marble-pachinko-reward-planning.md docs/tasks/claims/T145-lee.md docs/modules/marble-pachinko docs/progress/2026-06-08-lee.md docs/completion/2026-06-08-task-145-marble-pachinko-reward-planning.md`; `git diff --check`

## 背景

Lee 在商场看到线下弹珠机后，提出希望把类似玩法迁移到网站中。线下基础规则为用户购买玻璃弹珠，每局投入若干弹珠，机器随机展示倍率，玩家拉杆弹射钢珠；钢珠落入亮灯轨道后按倍率返还弹珠，高倍率命中还可能获得积分券或礼品兑换资格。

讨论后确认，网站版不应直接采用“AI 积分下注，再按 2x-10x 随机返还 AI 积分”的结构。AI 积分虽然不能提现，但可用于网站 AI 能力，属于有服务价值的平台权益；如果与随机倍率返还绑定，容易被理解为平台积分博彩化或概率型有奖销售。

## 目标

- 记录弹珠机玩法作为后续候选轻量游戏和平台福利活动。
- 明确两类商业路径的边界：
  - 充值 AI 积分时附赠游戏次数。
  - 直接购买游戏次数并提供保底奖励。
- 建议第一阶段优先采用“充值赠送次数 + 免费任务次数 + 小额福利奖励”的低风险结构。
- 明确积分分层：`paidCredits`、`bonusCredits`、`playTickets`、`gameCoins`。
- 为后续是否实现提供模块文档和任务依据。

## 不做

- 不实现代码。
- 不上线真实概率返奖。
- 不把 `paidCredits` 作为随机游戏入场筹码。
- 不允许随机倍率直接返还可再次投入游戏的 AI 积分。
- 不设计现金、提现、转售、礼品卡或可变现奖品。
- 不替代 T142/T143 的平台积分和 AI Gateway 规划。

## 交付内容

- 新增模块目录：`docs/modules/marble-pachinko/`。
- 新增模块 README、实施计划、进展、决策和交接文档。
- 登记变更卡 `IDEA-20260608-01`。
- 新增任务分片和领取分片。

## 规划结论

推荐路线：

```text
充值 AI 积分或完成平台任务
  -> 获得 playTickets
  -> 免费/赠送次数游玩弹珠机
  -> 命中奖励 bonusCredits、gameCoins、皮肤、徽章或抽奖券
  -> bonusCredits 只能用于 AI 能力，不能用于再次游玩
```

谨慎或后置路线：

```text
用户直接购买游戏次数
  -> 必须有固定保底权益
  -> 随机奖励不得返还 paidCredits
  -> 奖励优先限定为 gameCoins、皮肤、称号、装饰、低额 bonusCredits
  -> 上线前必须做法务和合规确认
```

不建议路线：

```text
用户消耗 paidCredits
  -> 随机命中倍率
  -> 按 2x-10x 返还 paidCredits 或可再次下注的同类积分
```

## 后续建议

- 若进入实现，先作为 `Web 游戏接入模块` 做无真实返奖的物理原型。
- 福利奖励必须接入账号资产层和积分分层，不得绕过 T142/T143。
- 概率、每日上限、未成年人限制、活动规则和奖励有效期必须在实现前单独评审。

## 验证结果

- `npm run docs:sync`：通过。
- 占位符扫描：通过。
- `git diff --check`：通过。
