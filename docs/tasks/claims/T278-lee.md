# T278：胡了卜 Cocos 震落牌区空内容修复

- 任务编号：T278
- 任务名称：胡了卜 Cocos 震落牌区空内容修复
- 领取人：Lee
- 状态：已完成
- 领取时间：2026-08-12
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/MeldRiverLayerBinder.ts`、`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`、`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`、`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/contracts/HulebuSceneModel.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T278 任务/领取分片、完成记录及 docs:sync 主文档
- 禁止修改文件：震落数量、组合规则、点击判定、计分、关卡、存档协议、正式原图、Web Demo、横屏、微信小游戏 SDK 和其他模块
- 验证命令：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`；`npm exec -w packages/shared vitest -- run mahjong-cocos-project`；exact-commit `npm run game:hulebu:build`；`npm run game:hulebu:verify-build`；`390×844` 浏览器截图检查；`npm run docs:sync`；`git diff --check`
- 完成时间：2026-08-12
- 当前阻塞：无
- 完成摘要：已把震落牌拆入独立 `LooseTilePool` 并修正过高的 UI 渲染深度；production 页面实测杠后牌面与数量一致，点击震落牌可正常进入主槽。
