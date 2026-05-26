# 胡了卜 Cocos 场景骨架

**状态**：T061 场景骨架 + T062 Creator 3.8.8 工程壳 + T063 首屏自动渲染
**定位**：正式 Cocos Creator 工程承接说明、脚本边界和可添加到 Cocos Dashboard 的工程壳入口。

## 1. 当前原则

- 规则状态仍由 `packages/shared/src/mahjong-game.ts` 负责。
- 表现层快照由 `packages/shared/src/mahjong-presentation.ts` 负责。
- Cocos 友好的节点模型由 `packages/shared/src/mahjong-cocos-scene.ts` 负责。
- Cocos 场景脚本只消费 `createMahjongCocosSceneModel` 的结果，不重新实现 `吃 / 碰 / 杠 / 胡` 判定。
- Cocos Creator 3.8.8 工程壳位于 `hulebu-cocos-3.8.8/`，可在 Cocos Dashboard 中添加/打开。
- `hulebu-cocos-3.8.8/` 已包含测试首屏 scene model 和运行时占位节点生成，方便先验证 Cocos 场景能显示。

## 2. 场景节点建议

建议首个 Cocos 场景命名为 `HulebuGameScene`。

节点结构：

```text
HulebuGameScene
  Camera2D
  BoardRoot
    TilePool
  SlotRoot
    Slot_0 ... Slot_7
  ReserveRoot
    Reserve_0 ... Reserve_N
  ComboRoot
    Combo_Hu
    Combo_Gang
    Combo_Peng
    Combo_Chi
  HudRoot
    BoardRemainingLabel
    SlotStatusLabel
    ScoreLabel
    CoinsLabel
    ToolLabel
  RewardOverlay
```

## 3. 脚本分工

- `GameSceneController`：持有关卡配置和 `MahjongGameState`，调用共享规则动作，刷新 scene model。
- `BoardLayerBinder`：消费 `sceneModel.boardNodes`，复用 Tile prefab，绑定坐标、zIndex、可点态和暗化态。
- `SlotLayerBinder`：消费 `sceneModel.slotNodes` 和 `sceneModel.reserveNodes`，刷新主槽和备用槽。
- `ComboBarBinder`：消费 `sceneModel.comboControls`，绑定按钮可点态、角标和候选 key。
- `HudBinder`：消费 `sceneModel.hud`，刷新余牌、槽位状态、分数、铜钱和工具。

## 4. 输入回传

Cocos 层只发意图，不做规则判断：

- `TileNode` 点击：`GameSceneController.selectTile(tileId)`。
- `ComboButton` 点击：`GameSceneController.executeCombo(candidateKey)`。
- `RewardCard` 点击：`GameSceneController.pickReward(rewardId)`。

每次输入后：

1. `GameSceneController` 调用共享规则函数更新状态。
2. 调用 `createMahjongPresentationSnapshot`。
3. 调用 `createMahjongCocosSceneModel`。
4. 将 scene model 分发给各 Binder。

## 5. 工程壳

T062 已新增 `hulebu-cocos-3.8.8/`：

- 基于 Creator 3.8.8 自带 `empty-2d` 模板的项目结构。
- `assets/scripts/` 下提供 `GameSceneController`、四个 Binder 和 scene model DTO。
- `assets/scenes/README.md` 说明 `HulebuGameScene` 节点树和脚本挂载方式。
- `assets/resources/config/README.md` 说明后续如何导入 `levels.json`、`rewards.json` 和 `tiles.json`。

当前仍不手写完整 `.scene`、`.prefab` 或最终资源。后续打开 Cocos Creator 时，应按本目录的节点清单创建场景，再把 binder 脚本挂到对应节点。

T063 已补充首屏自动渲染：

- `GameSceneController` 默认加载 `HulebuSampleSceneModel`。
- `BoardLayerBinder` 可在 `TilePool` 下自动生成占位牌节点。
- `SlotLayerBinder` 可自动绘制 8 格主槽。
- `ComboBarBinder` 可自动生成 `胡 / 杠 / 碰 / 吃` 占位按钮。
- `HudBinder` 可按节点名自动找到或创建 HUD Label。

这版只用于 Creator 运行验证，后续仍要接真实配置、规则状态、最终牌面资源和点击入槽链路。
