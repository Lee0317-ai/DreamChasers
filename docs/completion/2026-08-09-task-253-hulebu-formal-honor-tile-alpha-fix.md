# T253 完成记录：胡了卜正式字牌与背面透明底修正

- 任务编号：T253
- 负责人：Lee
- 完成日期：2026-08-09

## 修改文件

- `output/hulebu-ui-assets/scripts/build_formal_ui_batch_c.py`
- formal v1 的 `honor-east/south/west/north/red/green/white.png`
- formal v1 的 `back-default.png`
- `previews/formal-ui-batch-c-tiles.png`
- `manifest.json`、`validation-report.json`
- T248/T253 分片、模块进展/交接、当天进展和本完成记录

## 实现内容

- 为 7 张字牌和 1 张背面套用标准牌体 alpha。
- 清零完全透明像素中的隐藏 RGB。
- 在 Batch C 构建脚本中固化规则并新增两项校验门禁。

## 验证结果

- 8 张目标牌 alpha bbox 全部为 `(27, 23, 246, 354)`。
- 8 张目标牌不存在 alpha=0 但 RGB 非零的像素。
- formal v1 仍为 80 个唯一 key、35 张 `272×384` 麻将牌。
- 深色透明棋盘预览中不再出现白色底边。
- `validation-report.json` 状态为 `passed`。

## 遗留问题

- 尚未在 Cocos import/production 包中验证纹理采样；留给 Batch D。
