# T264：胡了卜 Cocos 通关弹层视觉优化

- 任务编号：T264
- 负责人：Lee
- 状态：进行中
- 来源：Lee 要求继续优化通过后的 UI
- 目标：把通关提示收敛为单一正式结算面板，清楚展示层数、本层得分、关卡信息和唯一继续操作，并确保整局工具控件位于遮罩之下。
- 允许修改：`GameSceneController.ts`、`HulebuFormalUiCatalog.ts`（仅必要映射）、`packages/shared/src/mahjong-cocos-project.test.ts`、T264 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档。
- 禁止修改：通关判定、奖励选择、关卡推进、计分规则、牌山生成、存档协议、Web Demo、横屏、微信小游戏 SDK、其他模块。
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`；`npx tsc -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.domain.json`；精确提交 production build；verify-only；Chrome `390×844` 通关弹层目检与继续按钮验证；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`。
- 验收标准：通关弹层不再出现三张空卡位或双层底板；标题、分数、关卡说明与按钮互不重叠；右侧工具按钮被遮罩正确压暗且不能抢占弹层交互；继续按钮沿用现有关卡流转。

## 进展

- 2026-08-11：任务登记并由 Lee 领取，开始定位通关弹层资源复用和 Canvas 层级问题。
