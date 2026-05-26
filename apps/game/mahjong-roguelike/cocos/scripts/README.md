# Cocos 脚本边界

本目录当前只放脚本边界说明，不放依赖 `cc` 运行时的 TypeScript 实现。这样可以先在 monorepo 中用 Vitest 验证共享数据流，等 Cocos Creator 工程创建后再把这些边界转成真实组件脚本。

## GameSceneController

职责：

- 加载 `levels.json`、`rewards.json` 和当前 run 状态。
- 创建并持有 `MahjongGameState`。
- 调用 `moveTileToSlot`、`executeCombo`、`applyReward` 等共享规则动作。
- 调用 `createMahjongPresentationSnapshot` 和 `createMahjongCocosSceneModel`。
- 把结果分发给 `BoardLayerBinder`、`SlotLayerBinder`、`ComboBarBinder` 和 `HudBinder`。

禁止：

- 不直接判断牌是否能吃碰杠胡。
- 不在 Cocos 节点上保存规则源状态。

## BoardLayerBinder

职责：

- 根据 `sceneModel.boardNodes` 创建或复用 Tile prefab。
- 使用 `position`、`zIndex`、`prefabKey`、`interactable`、`dimmed` 刷新表现。
- 点击 Tile 时把 `tileId` 回传给 `GameSceneController`。

## SlotLayerBinder

职责：

- 固定绑定 8 个主槽节点。
- 按 `sceneModel.slotNodes` 刷新牌面或空态。
- 按 `sceneModel.reserveNodes` 刷新备用槽。

## ComboBarBinder

职责：

- 固定绑定 `Combo_Hu / Combo_Gang / Combo_Peng / Combo_Chi`。
- 按 `interactable` 控制按钮。
- 按 `badgeText` 显示候选数量。
- 点击时把 `candidateKey` 回传给 `GameSceneController`。

## HudBinder

职责：

- 显示 `boardRemainingText`、`slotStatusText`、`scoreText`、`coinsText` 和 `toolText`。
- 只展示数据，不修改规则状态。
