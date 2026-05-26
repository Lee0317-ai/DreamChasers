# 胡了卜正式表现层桥接

**状态**：T060 第一版
**目标**：让 Cocos Creator 正式工程和 GDevelop 原型通道消费同一份规则状态快照，而不是各自复制 HTML 原型逻辑。

## 1. 当前承接方式

正式表现层先以 `packages/shared/src/mahjong-presentation.ts` 作为桥接层。

核心入口：

```ts
createMahjongPresentationSnapshot(state, {
  layoutByTileId: {
    "tile-id": {
      x: 120,
      y: 160,
      sourcePackage: "boss-hu-pack",
      stackDepth: 2,
    },
  },
});
```

输入是共享规则状态 `MahjongGameState`，输出是引擎无关的 `MahjongPresentationSnapshot`。

快照包含：

- `board`：牌山渲染项，包含 `id`、牌面 `label`、花色、点数、层级、坐标提示、遮挡状态、可点击状态和遮挡来源。
- `slot`：8 格主槽，按固定格子输出，空格为 `tileId: null`。
- `reserve`：备用槽，按容量输出，空格为 `tileId: null`。
- `comboButtons`：`胡 / 杠 / 碰 / 吃` 四个按钮的可用态、候选数量和首个候选 key。
- `remaining`：余牌统计，沿用共享规则模型的花色和点数计数。
- `hud`：牌山剩余数、槽位状态、积分、铜钱、护符、首败保护和道具数量。

## 2. Cocos Creator 映射

建议场景结构：

- `GameScene`：加载关卡配置，持有 `MahjongGameState`，每次状态变化后生成 snapshot。
- `BoardLayer`：消费 `snapshot.board`，按 `id` 复用或创建 `TileNode`，根据 `available` 决定点击态，根据 `blocked` 决定暗化。
- `TileNode`：只保存表现字段和 tile id，不保存规则判断；点击后把 `select_tile` 意图交回 `GameScene`。
- `SlotLayer`：消费 `snapshot.slot.cells`，固定渲染 8 个格子，后续胡牌高亮只读 candidate。
- `ReserveLayer`：消费 `snapshot.reserve.cells`，只作为救场展示，不参与 `胡`。
- `HudLayer`：消费 `snapshot.hud` 和 `snapshot.remaining`，渲染余牌、积分、铜钱、道具。
- `ComboBar`：消费 `snapshot.comboButtons`，按钮顺序固定为 `胡 / 杠 / 碰 / 吃`。
- `RewardOverlay`：继续读取 `rewards.json` 的 3 选 1，不把奖励效果写进节点脚本。

Cocos 的输入流应保持：

1. 玩家点击 `TileNode`。
2. `GameScene` 调用共享规则动作，例如 `moveTileToSlot`。
3. 规则状态更新。
4. 重新生成 `MahjongPresentationSnapshot`。
5. 各 Layer diff 快照并播放移动、消除或解锁动画。

## 3. GDevelop 映射

GDevelop 继续定位为 Web H5 原型和非开发协作通道。建议把 snapshot 映射为对象变量：

- `Tile.id`
- `Tile.label`
- `Tile.suit`
- `Tile.rank`
- `Tile.layer`
- `Tile.available`
- `Tile.blocked`
- `Tile.sourcePackage`
- `Tile.stackDepth`

事件表只做表现层分发：

- 点击 `Tile` 且 `available = true`：触发选择牌动作。
- 点击 `ComboButton` 且 `enabled = true`：触发对应候选动作。
- 每次动作后重新导入或刷新 snapshot 数据。
- 槽位和备用槽使用固定对象池，按 `slot.cells` / `reserve.cells` 写入牌面和空态。

GDevelop 不应重新实现 `吃 / 碰 / 杠 / 胡` 判定；这些判定继续来自共享规则模型或由导出的 snapshot 数据驱动。

## 4. 资源和坐标边界

`layoutByTileId` 是正式表现层的坐标提示入口。当前 HTML 密集牌山生成器可以继续产出 `x / y / sourcePackage / stackDepth`，Cocos 和 GDevelop 负责把这些值映射到自己的坐标系。

第一版约定：

- 坐标仍以当前配置/原型坐标为逻辑坐标，不强绑定屏幕像素。
- Cocos 可在 `BoardLayer` 做整体缩放和居中。
- GDevelop 可用事件表或外部 JSON 把逻辑坐标映射到场景对象坐标。
- 同列堆叠只显示上方牌；下层深度用 `stackDepth` 或资源偏移表现，不把完全覆盖的下层牌暴露为可点对象。

## 5. 本任务不解决

- 不创建完整 Cocos Creator 工程。
- 不创建 GDevelop `.json` 工程成品。
- 不接入最终青瓷麻将牌面资源。
- 不实现正式动画、音效、粒子、震动、结算页或发布包。
- 不把 HTML 原型的 DOM 代码迁移到正式工程。

下一步如果继续正式工程，应先建立 Cocos 场景骨架，让 `GameScene` 能读取配置并用 snapshot 渲染一关，再接动画和美术资源。

## 6. T061 场景骨架承接

T061 已将 Cocos 第一层承接推进到 `packages/shared/src/mahjong-cocos-scene.ts`：

- 输入 `MahjongPresentationSnapshot`。
- 输出 `boardNodes`、`slotNodes`、`reserveNodes`、`comboControls` 和 `hud`。
- `boardNodes` 会给出 Cocos 坐标、`zIndex`、可点态、暗化态和 `prefabKey`。
- Cocos 目录骨架见 `apps/game/mahjong-roguelike/cocos/`。

后续真实 Cocos Creator 工程应把 `createMahjongCocosSceneModel` 作为 `GameSceneController` 的刷新入口。

## 7. T062 Cocos Creator 工程壳

T062 已确认本机 Cocos Creator 3.8.8 安装路径：

```text
/Applications/Cocos/Creator/3.8.8/CocosCreator.app
```

并在 `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/` 创建了工程壳：

- 项目结构参考 Creator 3.8.8 自带 `empty-2d` 模板。
- `assets/scripts/GameSceneController.ts` 是首个场景控制器入口。
- `assets/scripts/*Binder.ts` 承接 `boardNodes`、`slotNodes`、`comboControls` 和 `hud`。
- `assets/scripts/contracts/HulebuSceneModel.ts` 是 Cocos 本地 DTO，占位对齐共享包中的 `MahjongCocosSceneModel`。

`.scene` 文件仍建议由 Cocos Creator 生成和维护。下一步应在编辑器内创建 `HulebuGameScene.scene`，按 `cocos/scene-binding.md` 绑定节点和脚本，再做第一条点击入槽链路。
