# T281 胡了卜通关结算提示优化

- 任务编号：T281
- 负责人：Lee
- 修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T281 任务与领取分片、状态同步文档。
- 实现内容：通关时隐藏牌局节点；结算层铺满当前视口；增加统一深色金色边框底板；把分数、关卡和牌山状态拆为三列；增加胜字封印；修正继续按钮在 `cleared` 阶段的点击分发。
- 验证命令：`npm exec vitest run packages/shared/src/mahjong-cocos-project.test.ts`；`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`；`git diff --check`。
- 验证结果：43 个测试通过，TypeScript 检查通过，diff 检查通过。
- 遗留问题：exact-commit 构建需在本次提交后重新执行；当前浏览器没有可连接的本地游戏标签，未完成截图复核。
