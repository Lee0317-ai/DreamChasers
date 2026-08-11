# T262：胡了卜 Cocos 分数、记牌器与锁牌牌背精修

- 任务编号：T262
- 任务名称：胡了卜 Cocos 分数、记牌器与锁牌牌背精修
- 领取人：Lee
- 状态：已完成
- 领取时间：2026-08-11
- 允许修改文件：`GameSceneController.ts`、`BoardLayerBinder.ts`、必要的正式资源目录映射、`packages/shared/src/mahjong-cocos-project.test.ts`、T262 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档
- 禁止修改文件：玩法规则、关卡配置、点击判定、存档协议、Web 试玩版、横屏、微信小游戏 SDK、其他模块
- 验证命令：Cocos `390×844` 场景检查；共享 Cocos 测试；Cocos TypeScript；精确提交 production build；verify-only；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`
- 当前阻塞：无
- 完成时间：2026-08-11
- 完成摘要：分数附加底块已移除；记牌器纯中文入口和 34 牌详情已完成并通过 production 交互验证；锁牌已切换为正式牌背。
