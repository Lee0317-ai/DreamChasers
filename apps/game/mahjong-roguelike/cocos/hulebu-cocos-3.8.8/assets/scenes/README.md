# 场景占位

请在 Cocos Creator 3.8.8 中创建 `HulebuGameScene.scene`。

建议首个节点树：

```text
HulebuGameScene
  Canvas
    BoardRoot
      TilePool
    SlotRoot
      Slot_0 ... Slot_7
    ReserveRoot
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

脚本挂载：

- `GameSceneController` 挂到场景根节点或 `Canvas`。
- `BoardLayerBinder` 挂到 `BoardRoot`。
- `SlotLayerBinder` 挂到 `SlotRoot`。
- `ComboBarBinder` 挂到 `ComboRoot`。
- `HudBinder` 挂到 `HudRoot`。

`.scene` 文件建议由 Cocos Creator 生成和维护，不在代码侧手写复杂资源格式。

运行验证：

- `GameSceneController.autoLoadSampleScene` 默认开启。
- 点击 Creator 顶部播放按钮后，应能看到一版占位测试牌山、8 个空槽、`胡 / 杠 / 碰 / 吃` 按钮和 HUD 文案。
- 这版只验证表现层显示，不代表最终美术或完整点击入槽玩法。
