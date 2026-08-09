# T251 完成记录：胡了卜正式 UI 资源 Batch A+B

- 任务编号：T251
- 负责人：Lee
- 完成日期：2026-08-09

## 修改文件

- `output/hulebu-ui-assets/hulebu-formal-ui-v1/{background,hud,board,actions,tools,master-sources,previews}/**`
- `output/hulebu-ui-assets/hulebu-formal-ui-v1/manifest.json`
- `output/hulebu-ui-assets/hulebu-formal-ui-v1/validation-report.json`
- `output/hulebu-ui-assets/scripts/build_formal_ui_batch_ab.py`
- T248/T249/T251 任务分片、模块进展/交接、当天进展和本完成记录

## 实现内容

- 通过 PPTOKEN 新站生成干净主场景背景母版，裁切为固定 `390×844` 设计视口的 2x 资源。
- 输出关卡牌匾、分数牌匾、余牌计数器、牌河底板、8 格手槽。
- 输出吃、碰、杠、补杠、胡和洗牌、撤回、提示、Buff、记牌器各三态。
- 生成 36 项 manifest、validation report、主场景组合预览和透明棋盘三态预览。

## 验证命令与结果

- 运行 `build_formal_ui_batch_ab.py`：成功构建 36 个资源。
- PNG/manifest 校验：36 个 key 唯一、文件存在、全部 RGBA、设计视口正确。
- 同组三态尺寸校验：通过。
- 两张预览人工目检：通过。
- `validation-report.json`：`passed`，无错误。

## 遗留问题

- 尚未生成卡片、弹窗和正式麻将牌面。
- 尚未导入 Cocos 或建立 SpriteFrame/Prefab 映射。
