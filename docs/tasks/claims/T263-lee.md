# T263：胡了卜 Cocos 牌背点击穿透修复

- 任务编号：T263
- 任务名称：胡了卜 Cocos 牌背点击穿透修复
- 领取人：Lee
- 状态：进行中
- 领取时间：2026-08-11
- 允许修改文件：`BoardLayerBinder.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T263 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档
- 禁止修改文件：牌山生成、关卡配置、HUD、存档协议、Web Demo、横屏、微信小游戏 SDK、其他模块
- 验证命令：共享 Cocos 测试；Cocos TypeScript；精确提交 production build；verify-only；Chrome `390×844` 牌背点击；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`
- 当前阻塞：无
- 下一步：重排 `selectTileAtUiPoint()` 的命中顺序，让锁牌先消费点击并阻断穿透。
