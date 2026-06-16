# 胡了卜 Boss 试炼第二版设计稿

- 日期：2026-06-16
- 任务：T177
- 状态：待验收

## 1. 目标

把 Boss 从“普通关卡上的额外达成条件”升级为明确的试炼节点。T177 完成后，第 10 关、第 20 关和高阶 Boss 应该有不同变体、阶段目标、奖励品质和失败/通关复盘。

## 2. 范围

本任务只做 Boss 试炼第二版：

- 建立 `BOSS_TRIAL_PHASES`，描述 Boss 的阶段目标。
- 建立 `BOSS_TRIAL_VARIANTS`，区分中段 Boss、终局 Boss 和高阶 Boss 变体。
- 局内 Boss 面板显示阶段目标和 `Boss 奖励品质`。
- 失败和通关时生成 `bossReview`，并同步给 Web 壳层结算页。
- Web 壳层结算页显示 `Boss 复盘`，帮助玩家判断下一局构筑方向。

不做特殊事件池第二版、成就图鉴扩容、无尽/每日深度化、路线奖励和局外能力深化、Cocos 追平、音乐、美术、排行榜、付费或广告。

## 3. Boss 结构

Boss 第二版由三层组成：

- 变体层
  - `trial-gate`：第 10 关中段试炼，检查玩家是否理解基础组合和工具节奏。
  - `hulebu-king`：第 20 关终局 Boss，要求更完整的胡牌、杠牌和工具管理。
  - `ascension-warden`：高阶 Boss 变体，按当前高阶档位提高压力，并与高阶能力配置形成对抗。
- 阶段层
  - `起势`：开局建立节奏，要求玩家先完成关键组合或控制工具消耗。
  - `压桌`：中段压缩空间，要求玩家达成 Boss 专属目标。
  - `收官`：终局要求胡牌/杠牌/连击等关键目标收束。
- 复盘层
  - 记录当前 Boss 变体、阶段、关键目标、缺口、奖励品质和下一局建议。
  - 通关时强调奖励质量和构筑亮点；失败时强调缺口和建议。

## 4. 数据流

- HTML 原型负责：
  - 根据 `mode`、`levelIndex` 和 `ascensionTier` 判断当前 Boss 变体。
  - 根据变体生成 Boss 阶段目标池。
  - 在局内 HUD 中渲染阶段目标和奖励品质。
  - 在 `showRunComplete` / `showLevelFailed` 中附带 `bossReview` payload。
- Web 壳层负责：
  - 扩展 iframe message payload 类型。
  - 把 `bossReview` 存入 `lastSettlement`。
  - 在结算卡片里展示 Boss 复盘。

## 5. 高阶关系

高阶 Boss 不进入普通教程节奏。普通模式仍只在前几关出现教程目标，高阶 run 直接显示高阶目标和 Boss 变体。高阶 Boss 变体需要显示当前高阶档位，让玩家知道压力来自哪一档。

## 6. 测试

- `apps/web` 测试锁定：
  - `bossReview` payload 类型存在。
  - 外层结算页包含 `Boss 复盘`、`阶段目标`、`Boss 奖励品质` 和 `高阶 Boss 变体` 文案。
- `packages/shared` 文本测试锁定：
  - HTML 原型包含 `BOSS_TRIAL_PHASES`。
  - HTML 原型包含 `BOSS_TRIAL_VARIANTS`。
  - HTML 原型包含 `getBossTrialDeck`、`getBossReviewPayload` 和 `bossReview`。
  - HTML 原型包含阶段目标、奖励品质和高阶 Boss 变体文案。

## 7. 风险控制

- 不把 Boss 第二版抽进共享配置，先保持在 HTML 原型和 Web 壳层内，避免影响 Cocos 后续追平前的内容迭代。
- 不改变普通前几关教程规则，避免玩家第一次进入普通模式的引导节奏被 Boss 系统扰动。
- 不重做全部奖励经济，只先显示奖励品质并给 Boss 节点轻量奖励提示。
