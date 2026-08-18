# 胡了卜胜负结算透明组件资源包 v1

本资源包是 T271 局外流程视觉母稿的第三批可落地拆件，覆盖胜利和失败结算，共 9 个透明 PNG。成品用于后续 Cocos Creator 导入与节点组合，不包含运行时标题、统计数值、失败原因或按钮文字。

## 目录

```text
hulebu-result-components-v1/
  components/result/  胜败印章、双标题牌、信息板、解锁横幅和按钮
  master-sources/     三张品红键控源表，仅供追溯和重建
  preview/            透明棋盘联系表
  manifest.json       Cocos key、尺寸、锚点、九宫格、状态和 alpha 统计
  build_component_pack.py
```

## 使用规则

- 运行时只使用 `components/result/*.png`，不要直接导入 `master-sources/*.png`。
- 胜利/失败文字、统计值、失败原因、建议内容、解锁名称和按钮字均由 Cocos `Label` 渲染。
- 两枚结果印章保持正方形节点并等比缩放；胜负态使用独立 SpriteFrame，不运行时染色互换。
- 双标题牌、建议面板、解锁横幅和按钮按 manifest 的 `nineSlice` 导入。
- 三格统计牌匾内部结构固定，使用 `Simple`，不要拉伸三个统计格的比例。
- 按钮按下/禁用态由运行时缩放与颜色变化派生；解锁横幅的可领取态由高亮与独立角标表达。

## 重建

脚本依赖 Pillow，执行后会覆盖 `components/`、`manifest.json` 和联系表中的同名成品：

```bash
python3 build_component_pack.py
```

源表裁切框已经固定记录在脚本中。若更换源表，必须重新检查裁切框、透明边缘、印章正方形画布和九宫格边距。

## 验收入口

- 联系表：`preview/contact-sheet-v1.png`
- 机器清单：`manifest.json`
- Cocos 导入说明：`COCOS_IMPORT.md`
