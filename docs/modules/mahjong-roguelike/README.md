# 麻将 Roguelike 消除

**模块 slug**：`mahjong-roguelike`  
**当前状态**：框架规划、玩法评审稿、MVP 验证计划、后续构建拆分和最小可玩验证原型已完成，待团队试玩评审  
**对应任务**：T017, T020, T029-T044

## 1. 模块定位

这是游戏站第一阶段核心小游戏，用“羊了个羊”式堆叠消除作为基础交互，用麻将的 `碰 / 吃 / 杠 / 清一色 / 胡牌目标` 提供规则记忆点，再用 Roguelike 奖励提高复玩价值。

核心目标：

- 提升游戏站停留时长和回访。
- 做出比普通三消更有辨识度的麻将消除体验。
- 第一版验证玩法节奏、关卡难度和奖励构筑，不追求完整麻将规则。

## 2. 第一版范围

包含：

- `万 / 条 / 筒` 三类基础牌。
- 点击可选牌进入槽位。
- 系统检测 `碰 / 吃 / 杠` 候选，玩家手动点击按钮后消除。
- 槽位满失败，清空牌面过关。
- 每过一关从 3 个随机奖励里选择 1 个。
- 20 个关卡配置。
- 20 个 Roguelike 奖励配置。
- Web 站内试玩入口占位或原型嵌入。
- 正式小游戏工程规则文档。

不包含：

- 完整麻将听牌算法。
- 复杂番型结算。
- 多人游戏。
- 排行榜。
- 复杂养成。
- 真钱激励。

## 3. 技术路线

推荐路线：

1. 先把规则、关卡、奖励抽成共享配置和 TypeScript 规则模型。
2. 用 GDevelop 或轻量 Web 原型快速验证“堆叠点击 + 槽位消除 + 奖励选择”的手感。
3. 用 Cocos Creator 做正式小游戏工程主线，面向微信小游戏和抖音小游戏发布。
4. Next.js 游戏站只负责详情页、站内试玩 iframe、埋点和入口，不承载核心游戏逻辑。

详细方案见 `FRAMEWORK_PLAN.md`。

## 4. 文档索引

- `FRAMEWORK_PLAN.md`：框架调研和技术规划。
- `GAMEPLAY_PLAN.md`：手动组合、槽位成长、货币、奖励和道具体系。
- `GAMEPLAY_REVIEW_PLAN.md`：团队评审用玩法方案 Markdown 版。
- `GAMEPLAY_REVIEW.html`：团队评审用可视化 HTML 版。
- `MVP_VALIDATION_PLAN.md`：MVP 玩法验证计划 Markdown 版。
- `MVP_VALIDATION_PLAN.html`：MVP 玩法验证计划可视化 HTML 版。
- `MVP_BUILD_PLAN.md`：最小可玩闭环和 MVP 开发拆分计划 Markdown 版。
- `MVP_BUILD_PLAN.html`：最小可玩闭环和 MVP 开发拆分计划可视化 HTML 版。
- `PLAYABLE_VALIDATION_PROTOTYPE.html`：最小可玩验证原型，可直接通过本地 HTTP 服务打开试玩。
- `IMPLEMENTATION_PLAN.md`：后续实现阶段计划。
- `PROGRESS.md`：模块进展。
- `DECISIONS.md`：模块决策。
- `HANDOFF.md`：交接说明。

## 5. 下一步重点

- 组织团队试玩 `PLAYABLE_VALIDATION_PROTOTYPE.html`，记录手动 `吃 / 碰 / 杠`、槽位压力、余牌价值、局内奖励和失败救场的反馈。
- 根据试玩反馈决定是否调整候选区、槽位压力、奖励路线或失败提示。
- 团队确认玩法方向后再回到 T017，进入规则模型、关卡配置和 Cocos 核心场景开发计划。
- 验证不通过时，先回到最弱假设局部修正，不直接扩大功能。
