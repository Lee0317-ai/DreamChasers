# 麻将 Roguelike 消除实施计划

**状态**：待最小可玩验证原型通过后执行  
**关联任务**：T017, T020, T043

## 1. 前置条件

- 已完成 T029 框架规划。
- 已确认第一版玩法参数。
- 已完成 `MVP_VALIDATION_PLAN.md` 和 `MVP_BUILD_PLAN.md`。
- 已通过最小可玩验证原型确认手动 `吃 / 碰 / 杠`、槽位压力、余牌和奖励选择成立。
- 已确认原型优先路线：GDevelop 原型或 Cocos 直做。
- 已确认 Cocos Creator 版本。

如果验证原型尚未完成，不建议直接执行本实施计划。先按 `MVP_BUILD_PLAN.md` 拆 `T044：麻将 Roguelike 最小可玩验证原型`。

## 2. 阶段 1：规则模型和测试

目标：

- 在 `packages/shared` 中建立引擎无关规则模型。

范围：

- `mahjong-game.ts`
- `mahjong-game.test.ts`

至少覆盖：

- 三张相同牌可以 `碰`。
- 同花色连续三张可以 `吃`。
- 四张相同牌可以 `杠`。
- 非法组合不能消除。
- Roguelike 奖励能修改槽位或倍率。

验证：

```bash
npm run test -w packages/shared -- mahjong
```

## 3. 阶段 2：配置文件

目标：

- 建立关卡、奖励、牌定义 JSON。

范围：

- `apps/game/mahjong-roguelike/config/tiles.json`
- `apps/game/mahjong-roguelike/config/levels.json`
- `apps/game/mahjong-roguelike/config/relics.json`

第一批：

- 3 个教学关卡。
- 20 个正式关卡草案。
- 20 个奖励草案。

## 4. 阶段 3：原型验证

二选一：

- GDevelop：快速做 HTML5 原型，用于手感和关卡节奏验证。
- Cocos：直接进入正式工程，但需要更多工程投入。

建议：

- 若重点是快速讨论玩法，先 GDevelop。
- 若玩法已经定得很清楚，直接 Cocos。

## 5. 阶段 4：Cocos 正式工程

目标：

- 实现可发布的小游戏工程主线。

核心模块：

- 牌堆渲染。
- 可点击牌判断。
- 槽位系统。
- 组合消除。
- 奖励选择。
- run 状态。
- 关卡加载。
- Web 导出。

## 6. 阶段 5：Web 游戏站接入

目标：

- 在游戏站可以访问、试玩、记录基础事件。

范围：

- `apps/web/src/modules/games/mahjong-roguelike/**`
- `apps/web/src/app/games/mahjong-roguelike/**`
- 内容索引或种子数据。

验证：

```bash
npm run build -w apps/web
```

还需要桌面端和移动端检查。

## 7. 暂不实施

- 多人。
- 排行榜。
- 账号成长。
- 支付系统。
- 复杂番型。
- 完整麻将算法。
