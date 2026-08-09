# T253：胡了卜正式字牌与背面透明底修正

- 优先级：P0
- 负责人：Lee
- 状态：已完成
- 依赖：T252 formal v1 完整资源包
- 阻塞：无
- 允许修改文件：`output/hulebu-ui-assets/scripts/build_formal_ui_batch_c.py`、formal v1 的 7 张字牌与 1 张背面、牌面预览、manifest/validation report、T248/T253 分片、麻将模块文档、当天进展/完成记录及 `npm run docs:sync` 自动生成主文档
- 禁止修改范围：其他 27 张数字牌、卡片/弹窗、Batch A+B、Cocos 工程、玩法规则、Web 试玩版、横屏、微信小游戏 SDK 和其他模块
- 验证方式：8 张目标资源标准 alpha bbox/透明角/RGBA 检查；透明像素 RGB 清零检查；35 张牌统一画布和 manifest 80 key 检查；牌面预览人工审阅；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`

## 目标

修正 `东 / 南 / 西 / 北 / 中 / 发 / 白 / 背面` 在深色背景下出现的浅色底边和白色光晕。

## 实现方式

- 统一使用 formal 标准牌体 alpha 轮廓，不修改牌面内容和绿色底座。
- 对 alpha 为 0 的像素清零 RGB，避免 Cocos 双线性采样读取隐藏白色像素。
- 把规则写入 Batch C 构建脚本，保证后续重建不会恢复旧白底。

## 不做

- 不重画字形或牌背图案。
- 不修改万/筒/条数字牌。
- 不接入 Cocos。

## 完成结果

- `东 / 南 / 西 / 北 / 中 / 发 / 白 / 背面` 已统一使用标准牌体 alpha bbox `(27, 23, 246, 354)`。
- 8 张目标牌 alpha=0 像素的 RGB 已清零，消除 Cocos 双线性采样可能读取的隐藏白色底色。
- 牌面预览中浅色底边已消失，字形、绿色底座和背面图案保持不变。
- Batch C 构建脚本与 validation report 已新增标准 alpha 和透明 RGB 门禁。
- formal v1 仍为 80 个唯一 key、35 张统一 `272×384` 麻将牌，校验状态为 `passed`。
