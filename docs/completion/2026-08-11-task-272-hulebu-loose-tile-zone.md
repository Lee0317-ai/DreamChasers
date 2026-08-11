# T272 完成记录：胡了卜 Cocos 震落牌独立区域与静态圆点清理

- 任务编号：T272
- 负责人：Lee
- 完成日期：2026-08-11
- 修改文件：`GameSceneController.ts`、`HulebuRuntimeState.ts`、`HulebuSceneModel.ts`、`BoardLayerBinder.ts`、`HulebuPortraitLayout.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T272 任务/领取分片、麻将模块进展与交接文档。
- 实现内容：删除余牌下方四个无功能静态圆点；把杠、补杠、胡震落牌标记为独立展示区，以 5 列网格放入“震落牌区”托盘；震落牌继续保持可点击，普通牌山缩放不再受其坐标影响。
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`；`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`；`npm run game:hulebu:build`；`npm run game:hulebu:verify-build`；`git diff --check`。
- 验证结果：共享测试 40/40、Cocos TypeScript、精确提交 production build、verify-only 和 5 条 HTTP smoke 全部通过；build ID `fd6d1e39c26f-20260811T105137Z`，提交 `fd6d1e39c26fa6281d01b74a30de9fc2c9514ac8`。
- 遗留问题：需 Lee 在现有本地 4173 页面触发一次杠、补杠或胡，完成最终目视确认。
