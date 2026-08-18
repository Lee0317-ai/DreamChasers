# 胡了卜局外流程组件 Cocos 导入说明

## 导入目标

建议复制到正式游戏工程的以下目录，再由 Cocos 生成对应 SpriteFrame：

```text
assets/resources/ui/formal-v1/meta-flow/
  common/
  title/
  lobby/
```

本任务只交付资源，不修改 Cocos 工程、Scene、Prefab 或脚本。

## 组件映射

| SpriteFrame key | 文件 | 模式 | 运行时状态 |
| --- | --- | --- | --- |
| `meta.title.brandPlaque` | `components/title/title-brand-plaque.png` | Sliced | 默认 |
| `meta.title.jadeSeal` | `components/title/title-jade-seal.png` | Simple | 默认 |
| `meta.title.primaryButton` | `components/common/button-primary-blank.png` | Sliced | normal / pressed / disabled |
| `meta.title.secondaryButton` | `components/common/button-secondary-blank.png` | Sliced | normal / pressed / disabled |
| `meta.title.saveNotePanel` | `components/common/note-panel-blank.png` | Sliced | 默认 |
| `meta.lobby.avatarFrame` | `components/lobby/avatar-frame.png` | Simple | 默认 |
| `meta.lobby.currencyPlaque` | `components/lobby/currency-plaque.png` | Sliced | 默认 |
| `meta.lobby.continuePanel` | `components/lobby/continue-panel.png` | Sliced | default / active |
| `meta.lobby.progressTrack` | `components/lobby/progress-track.png` | Sliced | 默认 |
| `meta.lobby.entry.main` | `components/lobby/entry-main-journey.png` | Simple | normal / notice |
| `meta.lobby.entry.modes` | `components/lobby/entry-modes.png` | Simple | normal / notice |
| `meta.lobby.entry.collection` | `components/lobby/entry-collection.png` | Simple | normal / claimable |
| `meta.lobby.entry.growth` | `components/lobby/entry-growth.png` | Simple | normal / affordable |
| `meta.lobby.bottomNav` | `components/lobby/bottom-nav-frame.png` | Sliced | 默认 |

## 导入检查

1. 所有 SpriteFrame 的锚点使用 `(0.5, 0.5)`。
2. `Sliced` 边距严格读取 `manifest.json` 的 `nineSlice`，不要凭肉眼重设。
3. 关闭图片自动裁边，保留成品 PNG 已提供的透明安全边距。
4. 入口徽章和头像框保持等宽等高节点，避免非等比缩放。
5. 主按钮按下态建议缩放到 `0.97`；禁用态只降低饱和度和透明度，不替换文字颜色逻辑。
6. 继续面板激活态、入口提醒态使用独立 Overlay/Badge 节点，基础 SpriteFrame 保持不变。
7. 文案必须由 Label 渲染，并在 `390 × 844`、窄屏安全区和长文案条件下检查不溢出。

## 九宫格约束

`nineSlice.left/right/top/bottom` 是不可拉伸边缘，中央区域才可伸缩。导入后至少用以下三种尺寸做检查：原始尺寸、设计稿目标尺寸、目标尺寸的 1.25 倍。若角花或描边发生形变，应先核对 SpriteFrame 边距，不要直接修改 PNG。
