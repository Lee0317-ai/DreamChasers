# T257 胡了卜中发白背景噪点与牌背重设计完成记录

- 任务编号：T257
- 负责人：Lee
- 完成日期：2026-08-09

## 修改文件

- Batch C 构建脚本。
- formal v1 的中、发、白和牌背共 4 张牌图、新牌背母版与牌面预览。
- formal v1 validation report。
- T248/T257 任务分片、麻将模块文档和当天进展记录。

## 实现内容

- 对中发白严格内容 mask 增加四连通域过滤，删除离散背景纹理和触碰提取边界的旧牌体残留。
- 通过 PPTOKEN 纯文字生成新的完整牌背，不上传本地参考图；去除洋红背景后保存透明母版。
- 新牌背使用连续青绿玉石面板加一层约 9% 高度的深绿底座，废弃旧牌背局部拼接方案。
- 新增牌背底座不得出现白色/米白像素的自动门禁。

## 验证命令与结果

- `python3 output/hulebu-ui-assets/scripts/build_formal_ui_batch_c.py`：通过，Batch C 44 项，formal v1 总计 80 项。
- 中发白内容 mask bbox 收敛到真实内容附近；底部旧边缘连通块已删除。
- 牌背标准 alpha bbox：`(27, 23, 246, 354)`；底座 `y=312..353` 白色/米白可见像素计数：0。
- validation report：`passed`；标准 alpha、透明 RGB、标准字牌底座、标准白色牌体、牌背无浅色底座、35 张牌和 80 key 检查全部通过。
- 深色棋盘预览：人工检查通过，牌背为连续面板加单层底座。
- `npm run docs:sync`：通过。
- UTF-8 无 BOM 与 `git diff --check`：通过。

## 遗留问题

- 尚未接入 Cocos；下一步为 Batch D SpriteFrame/Prefab 接入和 `390×844` production 验收。
