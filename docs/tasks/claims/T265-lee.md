# T265：胡了卜 Cocos 顶部 HUD、记牌器与已碰牌池优化

- 任务编号：T265
- 任务名称：胡了卜 Cocos 顶部 HUD、记牌器与已碰牌池优化
- 领取人：Lee
- 状态：进行中
- 领取时间：2026-08-11
- 允许修改文件：`GameSceneController.ts`、`MeldRiverLayerBinder.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T265 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档
- 禁止修改文件：副露/补杠规则、计分规则、关卡配置、牌山生成、存档协议、正式原图、Web Demo、横屏、微信小游戏 SDK、其他模块
- 验证命令：共享 Cocos 测试；Cocos TypeScript；精确提交 production build；verify-only；竖屏 production HUD/记牌器/已碰牌池目检；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`
- 当前阻塞：无
- 下一步：修正顶部 HUD 动态内容层、记牌器固定位置、退出入口和已碰牌池表现。
