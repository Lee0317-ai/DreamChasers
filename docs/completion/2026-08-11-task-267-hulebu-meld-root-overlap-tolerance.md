# T267 胡了卜 Cocos 已碰牌池挂载与轻遮挡容差完成记录

- 任务编号：T267
- 负责人：Lee
- 完成日期：2026-08-11
- 修改文件：`GameSceneController.ts`、`BoardLayerBinder.ts`、`HulebuLevelConfig.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T267 任务/领取分片、麻将模块进展与交接文档、当天进展及完成记录。
- 实现内容：动态创建缺失的 `MeldRiverRoot` 并挂载 binder；生成层与点击层覆盖阈值从 `0.001` 统一为 `0.08`；升级 board revision 使旧 blocker 快照失效。
- 验证命令：共享 Cocos 测试；Cocos TypeScript；`npm run game:hulebu:build`；`npm run game:hulebu:build -- --verify-only`；`npm run docs:sync`；`git diff --check`。
- 验证结果：共享测试 `40/40`、Cocos TypeScript、精确提交 production build、verify-only 和 5 条 smoke 均通过；build ID `3ba7aabd81a4-20260811T075426Z`，精确提交 `3ba7aabd81a40624cf807171505467ec9dc5bc1e`。
- 遗留问题：等待 Lee 刷新 production 页面直接验收视觉与点击手感。
