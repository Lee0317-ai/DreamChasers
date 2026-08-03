# 胡了卜刷新后继续当前本轮设计

## 目标

刷新 `/games/hulebu` 后，玩家不再被迫从第 1 关重新开始。外层 shell 会保存未完成 run 的恢复快照，并在页面重新加载后恢复 `继续本轮` 和 iframe 入口。

## 范围

- 主线、每日和高阶：恢复到当前关开局。
- 无尽：恢复到当前层开局。
- 恢复数据只保存在本地 `localStorage` 的胡了卜 shell 状态中。
- 失败和通关后清除恢复快照。

## 不做

- 不恢复当前牌桌、卡槽、牌河、事件弹窗或奖励选择弹窗。
- 不新增账号云存档字段。
- 不改内层规则状态机。

## 数据结构

在 `PersistedShellState` 中增加 `activeRun: ActiveRun | null`。写入本地状态时带上当前 `activeRun`；读取时校验基础字段，使用当前升级、局外偏好、流派、关卡/层数重新构造 `iframeSrc`。

## 恢复规则

- `mainline`：iframe URL 增加 `level=<latestLevelOrder>`。
- `daily`：iframe URL 增加 `mode=daily&dailySeed=<seed>&level=<latestLevelOrder>`。
- `ascension`：iframe URL 增加 `mode=ascension&ascensionLevel=<level>&level=<latestLevelOrder>`。
- `endless`：iframe URL 使用 `mode=endless&startLayer=<latestEndlessLayer>`。

## 清理规则

- 收到 `hulebu:run-failed` 时清空 `activeRun` 并写回本地。
- 收到 `hulebu:run-complete` 时清空 `activeRun`，保留结算和长期进度。

## 测试

- Web shell 测试锁定 `PersistedShellState` 包含 `activeRun`。
- Web shell 测试锁定恢复函数会重建 `iframeSrc` 并带 `level` 或 `startLayer`。
- HTML 原型测试锁定 `level` 参数仍按关卡 order 生效，`startLayer` 参数仍按无尽层数生效。
