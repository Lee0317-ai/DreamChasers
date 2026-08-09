# T256 胡了卜正式字牌标准白色牌体统一完成记录

- 任务编号：T256
- 负责人：Lee
- 完成日期：2026-08-09

## 修改文件

- Batch C 构建脚本。
- formal v1 的东南西北、中发白共 7 张字牌与牌面预览。
- formal v1 validation report。
- T248/T256 任务分片、麻将模块文档和当天进展记录。

## 实现内容

- 以标准空白牌体作为 7 张字牌的完整底板。
- 从旧字牌中按颜色特征提取字形和白板边框内容层，避免把旧白色牌体一起合成。
- 对中、发、白使用更严格的内容 alpha 下限，移除内容区域内的低透明度旧背景。
- 新增内容区之外必须与标准牌体逐像素一致的自动校验。

## 验证命令与结果

- `python3 output/hulebu-ui-assets/scripts/build_formal_ui_batch_c.py`：通过，Batch C 44 项，formal v1 总计 80 项。
- 7 张字牌内容区之外与标准牌体逐像素比较：全部一致。
- validation report：`passed`；标准 alpha、透明 RGB、标准单层底座、标准白色牌体、35 张牌和 80 key 检查全部通过。
- 深色棋盘预览：人工检查通过，7 张字牌无双层白色边框或整图贴图感。
- `npm run docs:sync`：通过。
- UTF-8 无 BOM 与 `git diff --check`：通过。

## 遗留问题

- 尚未接入 Cocos；下一步为 Batch D SpriteFrame/Prefab 接入和 `390×844` production 验收。
