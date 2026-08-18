# T271 胡了卜完整局外流程正式视觉母稿完成记录

- 完成时间：2026-08-11
- 负责人：Lee
- 任务编号：T271
- 状态：已完成

## 修改文件

- `output/hulebu-ui-assets/hulebu-lobby-flow-formal-v1/**`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T271-hulebu-lobby-flow-formal-visuals.md`
- `docs/tasks/claims/T271-lee.md`
- `docs/progress/2026-08-11-lee.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- docs:sync 生成的主文档

## 实现内容

- 使用 PPTOKEN `gpt-image-2` 兼容接口生成六张胡了卜竖屏正式视觉母稿。
- 页面覆盖登录/标题、局外大厅、五模式、主线地图、胜利和失败。
- 生成一张六宫格总览，便于统一检查材质、色彩、密度与页面层级。
- 编写资源 manifest、生成说明和 Cocos SpriteFrame key 清单。
- 明确教程、提示、暂停、设置和奖励继续复用 formal-v1 既有资源，不重复生成。

## 验证命令与结果

- `file output/hulebu-ui-assets/hulebu-lobby-flow-formal-v1/masters/*.png ...`：通过，六张母稿和总览均为有效 RGB PNG。
- `sips -g pixelWidth -g pixelHeight ...`：通过，实测尺寸已写入 manifest。
- Node manifest 解析与六文件完整性检查：通过，`manifest: 6 masters ok`。
- 人工视觉检查：通过，六张母稿属于同一青玉/旧金/象牙纸/深木/朱砂视觉系统。
- API Key 检查：通过，资源包、任务分片和说明文档未写入 key。
- `npm run docs:sync`：通过。
- UTF-8 无 BOM：通过。
- `git diff --check`：通过。

## 遗留问题

- 当前母稿不是透明 SpriteFrame 成品，不能整张直接接入 Cocos。
- 下一任务应先拆 `common/title/lobby` 组件，并分别校验透明边缘、锚点、九宫格和三态按钮。
- 模式、地图和结算组件应在第一批通过后分批拆分，避免同时修改所有 Scene 和 Prefab。
