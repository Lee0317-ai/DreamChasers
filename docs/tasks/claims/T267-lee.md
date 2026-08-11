# T267：胡了卜 Cocos 已碰牌池挂载与轻遮挡容差

- 任务编号：T267
- 任务名称：胡了卜 Cocos 已碰牌池挂载与轻遮挡容差
- 领取人：Lee
- 状态：进行中
- 领取时间：2026-08-11
- 允许修改文件：`GameSceneController.ts`、`BoardLayerBinder.ts`、`HulebuLevelConfig.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T267 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档
- 禁止修改文件：副露/补杠数据、组合规则、关卡内容、其他 HUD、存档协议、正式原图、Web Demo、横屏、微信小游戏 SDK、其他模块
- 验证命令：共享 Cocos 测试；Cocos TypeScript；精确提交 production build；verify-only；竖屏 production 已碰牌池与轻遮挡点击验收；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`
- 当前阻塞：无
- 下一步：动态挂载副露层，并统一两处 8% 覆盖阈值。
