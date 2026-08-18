# 胡了卜模式与主线地图组件 Cocos 导入说明

## 导入目标

建议复制到正式游戏工程的以下目录，再由 Cocos 生成对应 SpriteFrame：

```text
assets/resources/ui/formal-v1/meta-flow/
  modes/
  map/
```

本任务只交付资源，不修改 Cocos 工程、Scene、Prefab、关卡配置或脚本。

## 模式选择映射

| SpriteFrame key | 文件 | 模式 | 运行时状态 |
| --- | --- | --- | --- |
| `meta.mode.entryPanel` | `components/modes/mode-entry-panel.png` | Sliced | normal / active / locked |
| `meta.mode.stateTag` | `components/modes/mode-state-tag.png` | Sliced | normal / active / locked / claimable |
| `meta.mode.mainIcon` | `components/modes/icon-main.png` | Simple | normal / active |
| `meta.mode.endlessIcon` | `components/modes/icon-endless.png` | Simple | normal / active |
| `meta.mode.dailyIcon` | `components/modes/icon-daily.png` | Simple | normal / claimable |
| `meta.mode.advancedIcon` | `components/modes/icon-advanced.png` | Simple | locked / unlocked |
| `meta.mode.collectionIcon` | `components/modes/icon-collection.png` | Simple | normal / claimable |

## 主线地图映射

| SpriteFrame key | 文件 | 模式 | 运行时状态 |
| --- | --- | --- | --- |
| `meta.map.chapterPlaque` | `components/map/chapter-plaque.png` | Sliced | 默认 |
| `meta.map.starProgress` | `components/map/star-progress-plaque.png` | Simple | 默认 |
| `meta.map.chapterSwitch` | `components/map/chapter-switch-frame.png` | Simple | 默认 |
| `meta.map.pathSegment` | `components/map/path-segment-curved.png` | Simple | 默认 |
| `meta.map.node.normal` | `components/map/node-normal.png` | Simple | available / completed |
| `meta.map.node.current` | `components/map/node-current.png` | Simple | active |
| `meta.map.node.locked` | `components/map/node-locked.png` | Simple | locked |
| `meta.map.node.boss` | `components/map/node-boss.png` | Simple | locked / available / completed |
| `meta.map.star.empty` | `components/map/star-empty.png` | Simple | empty |
| `meta.map.star.filled` | `components/map/star-filled.png` | Simple | filled |

## 导入检查

1. 所有 SpriteFrame 的锚点使用 `(0.5, 0.5)`。
2. `Sliced` 边距严格读取 `manifest.json` 的 `nineSlice`；模式长卡左侧图标槽和右侧状态槽必须落在不可拉伸区。
3. 关闭图片自动裁边，保留成品 PNG 已提供的透明安全边距。
4. 模式徽章、关卡节点和星形保持正方形节点并等比缩放。
5. 普通节点的完成态使用 `meta.map.star.filled` 叠加；未完成态使用 `meta.map.star.empty` 或不显示星形。
6. 当前节点动画只改变 Overlay 的透明度/缩放，不对基础 Sprite 反复改色。
7. 路径段可旋转、镜像和复用；拼接时让透明画布边缘重叠，避免石路端点出现缝隙。
8. 所有模式和关卡文案由 Label 渲染，并在 `390 × 844`、长标题和锁定说明条件下检查不溢出。
