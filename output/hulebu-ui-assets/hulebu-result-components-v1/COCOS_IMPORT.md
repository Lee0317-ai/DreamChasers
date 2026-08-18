# 胡了卜胜负结算组件 Cocos 导入说明

## 导入目标

建议复制到正式游戏工程的以下目录，再由 Cocos 生成对应 SpriteFrame：

```text
assets/resources/ui/formal-v1/meta-flow/result/
```

本任务只交付资源，不修改 Cocos 工程、Scene、Prefab、结算协议或脚本。

## 组件映射

| SpriteFrame key | 文件 | 模式 | 运行时状态 |
| --- | --- | --- | --- |
| `meta.result.seal.victory` | `components/result/seal-victory.png` | Simple | victory |
| `meta.result.seal.failure` | `components/result/seal-failure.png` | Simple | failure |
| `meta.result.titlePlaque.victory` | `components/result/title-plaque-victory.png` | Sliced | victory |
| `meta.result.titlePlaque.failure` | `components/result/title-plaque-failure.png` | Sliced | failure |
| `meta.result.statPlaque` | `components/result/stat-plaque.png` | Simple | 默认 |
| `meta.result.suggestionPanel` | `components/result/suggestion-panel.png` | Sliced | 默认 |
| `meta.result.unlockRibbon` | `components/result/unlock-ribbon.png` | Sliced | default / claimable |
| `meta.result.primaryButton` | `components/result/button-primary.png` | Sliced | normal / pressed / disabled |
| `meta.result.secondaryButton` | `components/result/button-secondary.png` | Sliced | normal / pressed |

## 导入检查

1. 所有 SpriteFrame 的锚点使用 `(0.5, 0.5)`。
2. `Sliced` 边距严格读取 `manifest.json` 的 `nineSlice`，不要把冠饰、卷轴端部或按钮角花拉伸。
3. 关闭图片自动裁边，保留成品 PNG 已提供的透明安全边距。
4. 胜败印章保持正方形节点并等比缩放；不要使用同一印章染色模拟另一种结果。
5. 统计牌匾使用固定三列 Label，每列内部采用标题/数值两级排版。
6. 失败建议面板左侧圆槽放建议图标，右侧使用两行以内的运行时文案。
7. 解锁横幅 claimable 态使用 Overlay 或角标，不把领取文字烘焙进基础 Sprite。
8. 主按钮按下态建议缩放到 `0.97`；禁用态只降低饱和度和透明度，并保持文字对比可读。
9. 在 `390 × 844`、长解锁名称、三位以上统计值和失败说明换行条件下检查无溢出。
