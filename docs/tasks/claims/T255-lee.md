# T255：胡了卜正式字牌与背面单层底座统一

- 任务编号：T255
- 任务名称：胡了卜正式字牌与背面单层底座统一
- 领取人：Lee
- 状态：已完成
- 领取时间：2026-08-09
- 允许修改文件：Batch C 构建脚本、formal v1 的 7 张字牌与 1 张背面、牌面预览、manifest/validation、T248/T255 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档
- 禁止修改：其他 27 张数字牌、卡片/弹窗、Batch A+B、Cocos 工程、玩法规则、Web 试玩版、横屏、微信小游戏 SDK 和其他模块
- 验证命令：目标 8 张与 `wan-01` 标准下半部逐像素比较；T253 alpha/RGB 回归；35 张牌与 80 key 校验；预览人工审阅；`npm run docs:sync`；`git diff --check`
- 当前阻塞：无
- 完成结果：8 张目标牌从 `y=288` 起与 `wan-01` 标准下半部逐像素一致，双层绿色底座已消除，全部资源门禁通过。
- 下一步：按 T248 进入 Batch D，接入 Cocos SpriteFrame/Prefab 并做 `390×844` production 验收。
