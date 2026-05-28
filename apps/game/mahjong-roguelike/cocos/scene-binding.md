# HulebuGameScene 绑定清单

## Prefab Key

`createMahjongCocosSceneModel` 会输出类似 `tile.wan.9`、`tile.honor.5` 的 `prefabKey`。

第一版资源映射建议：

| prefabKey | 资源用途 |
| --- | --- |
| `tile.wan.1` - `tile.wan.9` | 万子牌 |
| `tile.tong.1` - `tile.tong.9` | 筒子牌 |
| `tile.tiao.1` - `tile.tiao.9` | 条子牌 |
| `tile.honor.1` - `tile.honor.7` | 东、南、西、北、中、发、白 |

T068 已把当前可用图片整理到 Cocos 资源目录，T074 已追加透明无边框派生图：

- 资源根目录：`assets/resources/ui/mahjong-tiles/`
- 运行时优先数牌：`tiles/refreshed/numbered/wan/`、`tiles/refreshed/numbered/tiao/`、`tiles/refreshed/numbered/tong/`
- 运行时优先字牌：`tiles/refreshed/honors/honor-east.png`、`honor-south.png`、`honor-west.png`、`honor-north.png`、`honor-red.png`、`honor-green.png`、`honor-white.png`
- 原始带框数牌：`tiles/numbered/wan/wan-01.png` 到 `wan-09.png`、`tiles/numbered/tiao/tiao-01.png` 到 `tiao-09.png`、`tiles/numbered/tong/tong-01.png` 到 `tong-09.png`
- 原始带框字牌：`tiles/honors/`
- 参考图和中间稿：`references/`、`drafts/`
- 资源索引：`manifest.json`

后续接 Tile prefab 时，优先读取 `manifest.json` 中的 `refreshedNumberedTiles` / `refreshedHonorTiles` 映射，并让 Cocos 自绘或 prefab 自带牌体底板；`borderlessNumberedTiles` / `borderlessHonorTiles` 只作为透明来源图；带框 `numberedTiles` / `honorTiles` 只作为回退和美术复核；`drafts/` 只作为人工复核和替换候选。

## BoardRoot

- 读取 `boardNodes[].position` 设置节点坐标。
- 读取 `boardNodes[].zIndex` 设置同层排序。
- `interactable = false` 的牌不响应点击。
- `dimmed = true` 的牌可以半透明或降低亮度。
- 当前 `BoardLayerBinder` 可自动创建占位牌节点；最终接资源后再替换为 Tile prefab 池。

## SlotRoot

- 固定 8 个主槽节点。
- `occupied = false` 显示空槽底。
- 主槽不扩到 9 格。
- 当前 `SlotLayerBinder` 可自动绘制 8 个占位槽，避免手工配置时空节点不可见。

## ReserveRoot

- 备用槽只展示救场状态。
- 备用槽不参与 `胡` 的 `3 + 3 + 2` 判定。

## ComboRoot

按钮顺序固定：

1. `Combo_Hu`
2. `Combo_Gang`
3. `Combo_Peng`
4. `Combo_Chi`

`interactable = false` 使用灰态；`badgeText` 显示当前候选数量。

当前 `ComboBarBinder` 会自动创建按钮底和文字；正式美术接入后再替换按钮皮肤、动效和点击音效。

## HudRoot

绑定：

- `BoardRemainingLabel` <- `hud.boardRemainingText`
- `SlotStatusLabel` <- `hud.slotStatusText`
- `ScoreLabel` <- `hud.scoreText`
- `CoinsLabel` <- `hud.coinsText`
- `ToolLabel` <- `hud.toolText`

当前 `HudBinder` 会按这些节点名自动查找或创建 Label，减少首屏验证时的手工拖拽成本。
