# T264：胡了卜 Cocos 通关弹层视觉优化

- 任务编号：T264
- 任务名称：胡了卜 Cocos 通关弹层视觉优化
- 领取人：Lee
- 状态：进行中
- 领取时间：2026-08-11
- 允许修改文件：`GameSceneController.ts`、`HulebuFormalUiCatalog.ts`（仅必要映射）、`packages/shared/src/mahjong-cocos-project.test.ts`、T264 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档
- 禁止修改文件：通关判定、奖励选择、关卡推进、计分规则、牌山生成、存档协议、Web Demo、横屏、微信小游戏 SDK、其他模块
- 验证命令：共享 Cocos 测试；Cocos TypeScript；精确提交 production build；verify-only；Chrome `390×844` 通关弹层目检与继续按钮验证；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`
- 当前阻塞：无
- 下一步：实现独立通关底板、信息排版和流程遮罩层级修复。
