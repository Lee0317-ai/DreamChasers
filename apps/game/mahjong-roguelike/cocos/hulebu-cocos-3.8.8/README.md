# 胡了卜 Cocos Creator 工程壳

**编辑器版本**：Cocos Creator 3.8.8  
**本机编辑器路径**：`/Applications/Cocos/Creator/3.8.8/CocosCreator.app`  
**工程定位**：正式小游戏工程壳，基于 Creator 自带 `empty-2d` 模板结构补齐胡了卜的脚本边界和首屏占位渲染。

## 打开方式

1. 打开 Cocos Dashboard。
2. 进入 `项目`。
3. 选择 `添加` 或 `打开其他项目`。
4. 指向本目录：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8`。
5. 使用 Cocos Creator 3.8.8 打开。

## 当前包含

- Creator `empty-2d` 风格项目壳：`package.json`、`tsconfig.json`、`.creator/`、`settings/`。
- 首场景脚本入口：`assets/scripts/GameSceneController.ts`。
- 场景分层绑定脚本：`BoardLayerBinder`、`SlotLayerBinder`、`ComboBarBinder`、`HudBinder`。
- 测试首屏数据：`assets/scripts/bootstrap/HulebuSampleSceneModel.ts`。
- Cocos 本地 DTO：`assets/scripts/contracts/HulebuSceneModel.ts`。
- 场景占位说明：`assets/scenes/README.md`。
- 配置导入说明：`assets/resources/config/README.md`。

## 首屏验证

在 Creator 里创建并保存 `assets/scenes/HulebuGameScene.scene`，节点树按上级目录的 `scene-binding.md` 建：

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
    RewardOverlay
```

先把 `assets/scripts/GameSceneController.ts` 挂到 `Canvas`，再把四个 Binder 挂到对应根节点。运行时如果 `autoLoadSampleScene` 为开启状态，`GameSceneController` 会自动加载测试 scene model，并让四个 Binder 生成占位牌、8 格槽、组合按钮和 HUD。

## 下一步

首屏能显示后，下一步接真实关卡配置和共享规则状态，让点击牌面进入槽位，并通过 `createMahjongCocosSceneModel` 刷新真实 scene model。
