# T255 胡了卜正式字牌与背面单层底座统一完成记录

- 任务编号：T255
- 负责人：Lee
- 完成日期：2026-08-09

## 修改文件

- Batch C 构建脚本。
- formal v1 的东南西北、中发白、背面共 8 张牌图与牌面预览。
- formal v1 validation report。
- T248/T255 任务分片、麻将模块文档和当天进展记录。

## 实现内容

- 删除 T254 新增的底部绿色渐变重绘，消除第二层绿色底座。
- 从 `y=288` 起复制标准空白牌体，确保 8 张目标牌的下半部与数字牌使用同一套像素结构。
- 把颜色比例校验替换为标准下半部逐像素一致校验。

## 验证命令与结果

- `python3 output/hulebu-ui-assets/scripts/build_formal_ui_batch_c.py`：通过，Batch C 44 项，formal v1 总计 80 项。
- 8 张目标牌与 `wan-01` 的 `y=288..383` 区域逐像素比较：全部一致。
- validation report：`passed`；标准 alpha、透明 RGB、标准单层底座、35 张牌和 80 key 检查全部通过。
- 深色棋盘预览：人工检查通过，目标牌均为单层绿色底座。
- `npm run docs:sync`：通过。
- UTF-8 无 BOM 与 `git diff --check`：通过。

## 遗留问题

- 尚未接入 Cocos；下一步为 Batch D SpriteFrame/Prefab 接入和 `390×844` production 验收。
