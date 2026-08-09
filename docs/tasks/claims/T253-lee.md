# T253：胡了卜正式字牌与背面透明底修正

- 任务编号：T253
- 任务名称：胡了卜正式字牌与背面透明底修正
- 领取人：Lee
- 状态：已完成
- 领取时间：2026-08-09
- 允许修改文件：Batch C 构建脚本、formal v1 的 7 张字牌与 1 张背面、牌面预览、manifest/validation、T248/T253 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档
- 禁止修改：其他 27 张数字牌、卡片/弹窗、Batch A+B、Cocos 工程、玩法规则、Web 试玩版、横屏、微信小游戏 SDK 和其他模块
- 验证命令：目标 alpha/RGB 检查；35 张牌与 80 key 校验；预览人工审阅；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`
- 当前阻塞：无
- 下一步：进入 Batch D Cocos 正式 UI 接入，在 Creator 导入设置中继续启用正确 alpha/trim 口径并做深色背景真机检查。
