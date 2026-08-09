# T254 胡了卜正式字牌与背面底唇绿色化完成记录

- 任务编号：T254
- 负责人：Lee
- 完成日期：2026-08-09

## 修改文件

- Batch C 构建脚本。
- formal v1 的东南西北、中发白、背面共 8 张牌图与牌面预览。
- formal v1 validation report。
- T248/T254 任务分片、麻将模块文档和当天进展记录。

## 实现内容

- 扩大底座浅色残留检查区至 `y=312`，只替换白色、米色和棕色像素，保留原始绿色纹理。
- 最下方统一生成连续的深绿色过渡，消除字牌两角和牌背底部的浅色托底。
- 固化 `honorBackGreenLowerLip` 校验，防止重新构建时回归。

## 验证命令与结果

- `python3 output/hulebu-ui-assets/scripts/build_formal_ui_batch_c.py`：通过，Batch C 44 项，formal v1 总计 80 项。
- validation report：`passed`；标准 alpha、透明 RGB、绿色底唇、35 张牌和 80 key 检查全部通过。
- 深色棋盘预览：人工检查通过，8 张目标牌底部无白色或米色托底。
- `npm run docs:sync`：通过。
- UTF-8 无 BOM 与 `git diff --check`：通过。

## 遗留问题

- 尚未接入 Cocos；下一步为 Batch D SpriteFrame/Prefab 接入和 `390×844` production 验收。
