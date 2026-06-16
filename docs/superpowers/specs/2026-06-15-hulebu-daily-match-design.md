# 胡了卜每日牌局第一版设计稿

## 1. 背景

T170 已补完无尽牌山第一版，`/games/hulebu` 现在已经有主线、局外首页、结算、局外铜钱、升级和无尽入口，但 `每日` 面板仍是占位。T171 的目标是把这个入口升级成真正可玩的每日回访点。

## 2. 范围

本任务只做每日牌局第一版：

- 局外页 `每日` 面板从占位改成可开始。
- iframe 使用 `mode=daily&dailySeed=YYYY-MM-DD` 进入每日牌局。
- 当天所有玩家使用同一个日 seed，看到同一局每日骨架。
- 外层壳持久化本地当日最佳关数。
- 结算面板、局外摘要和进行中摘要显示今日 seed 与当日最佳。

不做成就图鉴、高阶周目、词缀扩展、云存档、排行榜、付费、广告、登录同步或 Cocos 正式工程追平，也不改 `levels.json`、`rewards.json`、局外升级价格和主线结构。

## 3. 交互

局外页保留 `开始挑战` 和 `开始无尽`，并在 `每日` 面板新增 `开始每日`。进入每日后，外层顶部摘要显示 `每日进行中`、当日 seed 和当前关数。失败、通关或重开后，结算面板会显示：

- 今日 seed
- 本次到达关数
- 今日最佳关数

第一版每日不加专属榜单和额外奖励层，只先承接固定回访。

## 4. 内层原型

HTML 原型新增第三种 `runMode`：

- `mainline`
- `endless`
- `daily`

每日继续复用现有 20 关主线和路线型奖励池，但牌山生成 seed 绑定到 `dailySeed`，不再使用每次重开的波动 seed。这样同一天的每日牌局能稳定复现。

第一版每日继续沿用现有主线推进逻辑和奖励节点，不新增独立配置文件。HUD、标题、shell 消息和结算文案需要能区分 `daily`。

## 5. 数据

外层本地存档 `dreamchasers:hulebu-shell:v1` 新增：

- `dailyBestLevels: Record<string, number>`

key 为 `YYYY-MM-DD`，value 为当天本地最好关数。

shell 消息 payload 新增：

- `runMode: "mainline" | "endless" | "daily"`
- `dailySeed: string | null`

旧存档没有 `dailyBestLevels` 时按空对象处理。

## 6. 测试

- Web 测试锁定 `开始今日牌局`、`dailyBestLevels`、`runMode=daily`、`mode=daily` 和 `dailySeed`。
- 原型测试锁定 `requestedMode === "daily"`、`isDailyMode`、`getDailyLevelIndex`、`getDailyDifficultyProfile`、daily seed 生成与标题文案。
- 两份 HTML 内联脚本都必须通过 `node --check`。
- `/games/hulebu` 桌面端和 390px 移动端都要能看到每日入口并进入带 `dailySeed` 的牌桌。
