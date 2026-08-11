# T272：胡了卜 Cocos 震落牌独立区域与静态圆点清理

- 任务编号：T272
- 负责人：Lee
- 状态：进行中
- 来源：Lee 确认删除余牌下方四个静态点，并要求为杠、补杠、胡震落的牌提供专门区域。
- 目标：消除无意义进度暗示，并让震落牌不再覆盖原牌山。
- 允许修改：`GameSceneController.ts`、`HulebuRuntimeState.ts`、`HulebuSceneModel.ts`、`BoardLayerBinder.ts`、`HulebuPortraitLayout.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T272 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档。
- 禁止修改：震落数量、组合规则、点击规则、计分、关卡、存档协议、正式原图、Web Demo、横屏、微信小游戏 SDK、其他模块。
- 验证命令：共享 Cocos 测试；Cocos TypeScript；精确提交 production build；verify-only；竖屏 production 震落区域验收；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`。
- 验收标准：顶部不再出现四个静态圆点；震落牌带独立场景标记，集中排列在专用托盘中且保持可点击；普通牌山缩放不再受震落牌坐标影响。

## 进展

- 2026-08-11：任务登记并由 Lee 领取，确认震落牌目前仍混在 `boardNodes` 中。
- 2026-08-11：已移除余牌下方四个静态圆点；震落牌带 `displayZone: "loose"` 并排入独立托盘，普通牌山不再计算震落坐标。
- 2026-08-11：共享 Cocos 测试 40 项、Cocos TypeScript 和 `git diff --check` 通过；待精确提交 production build。
