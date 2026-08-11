# T266：胡了卜 Cocos 通关弹层标题避让

- 任务编号：T266
- 负责人：Lee
- 状态：进行中
- 来源：Lee 提供 production 截图，指出通关标题被顶部莲花装饰遮挡。
- 目标：让通关标题、得分、关卡说明和继续按钮全部位于结算底图的正文安全区，互不遮挡。
- 允许修改：`GameSceneController.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T266 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档。
- 禁止修改：通关流程、奖励、计分、其他 HUD、正式原图、玩法、存档、Web Demo、横屏、微信小游戏 SDK、其他模块。
- 验证命令：共享 Cocos 测试；Cocos TypeScript；精确提交 production build；verify-only；竖屏 production 通关弹层目检；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`。
- 验收标准：任意层数标题不与莲花、流苏或边框重叠；得分、说明和按钮间距清楚；继续按钮仍触发原 `continueAfterClear()`。

## 进展

- 2026-08-11：任务登记并由 Lee 领取，采用增加面板高度和整体下移正文的最小修正。
