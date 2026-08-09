# T252 完成记录：胡了卜正式 UI 资源 Batch C

- 任务编号：T252
- 负责人：Lee
- 完成日期：2026-08-09

## 修改文件

- `output/hulebu-ui-assets/hulebu-formal-ui-v1/cards/**`
- `output/hulebu-ui-assets/hulebu-formal-ui-v1/modals/**`
- `output/hulebu-ui-assets/hulebu-formal-ui-v1/tiles/mahjong/**`
- `output/hulebu-ui-assets/hulebu-formal-ui-v1/master-sources/cards-modals-sheet-v1.png`
- `output/hulebu-ui-assets/hulebu-formal-ui-v1/previews/formal-ui-batch-c-*.png`
- 正式包 `manifest.json`、`validation-report.json`
- `output/hulebu-ui-assets/scripts/build_formal_ui_batch_c.py`
- T248/T252 分片、模块进展/交接、当天进展和本完成记录

## 实现内容

- 生成并抠出 4 张无文字卡片和 5 个无文字弹窗。
- 标准化输出 34 张麻将正面和 1 张背面。
- 重做八条为 2×4 标准竹节排列。
- 将 formal v1 manifest 扩展到 80 项并生成两张 Batch C 预览。

## 验证命令与结果

- 运行 `build_formal_ui_batch_c.py`：新增 44 项，正式包合计 80 项。
- manifest 校验：80 个 key 唯一，Batch A+B 36 项完整保留。
- PNG 校验：全部 RGBA、路径存在、透明角合格。
- 画布校验：卡片 `236×501`、弹窗 `478×309`、麻将牌 `272×384`。
- `validation-report.json`：`passed`，无错误。
- 两张透明预览人工目检：通过。

## 遗留问题

- 尚未导入 Cocos 或建立 SpriteFrame/Prefab 映射。
- 卡片和弹窗的标题、正文、数值与按钮文字需要在 Cocos 运行时渲染。
