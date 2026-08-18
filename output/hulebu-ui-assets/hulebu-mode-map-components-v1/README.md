# 胡了卜模式与主线地图透明组件资源包 v1

本资源包是 T271 局外流程视觉母稿的第二批可落地拆件，覆盖模式选择和主线地图，共 17 个透明 PNG。成品用于后续 Cocos Creator 导入与节点组合，不包含运行时文案、关卡编号或进度数值。

## 目录

```text
hulebu-mode-map-components-v1/
  components/
    modes/        模式长卡、状态牌、五枚模式徽章
    map/          章节牌匾、星级牌匾、章节切换、路径、节点和星形
  master-sources/ 四张品红键控源表，仅供追溯和重建
  preview/        透明棋盘联系表
  manifest.json   Cocos key、尺寸、锚点、九宫格、状态和 alpha 统计
  build_component_pack.py
```

## 使用规则

- 运行时只使用 `components/**/*.png`，不要直接导入 `master-sources/*.png`。
- 模式名称、说明、状态、章节名、星级数量和关卡编号均由 Cocos `Label` 或独立图标节点渲染。
- 模式长卡与模式状态牌、章节牌匾按 manifest 的 `nineSlice` 导入；内部含固定插槽的星级牌匾和章节切换底栏使用 `Simple`，避免插槽被拉伸。
- 所有模式徽章、关卡节点和星形保持等宽等高节点，不允许非等比缩放。
- 地图路径段使用 `Simple`，可通过旋转、镜像和多个节点组合路径；不能对路径本体做九宫格拉伸。
- 当前节点的呼吸效果、锁定遮罩、完成星级和可领取角标均由运行时 Overlay 节点实现。

## 重建

脚本依赖 Pillow，执行后会覆盖 `components/`、`manifest.json` 和联系表中的同名成品：

```bash
python3 build_component_pack.py
```

源表裁切框已经固定记录在脚本中。若更换源表，必须重新检查裁切框、透明边缘、正方形画布和九宫格边距。

## 验收入口

- 联系表：`preview/contact-sheet-v1.png`
- 机器清单：`manifest.json`
- Cocos 导入说明：`COCOS_IMPORT.md`
