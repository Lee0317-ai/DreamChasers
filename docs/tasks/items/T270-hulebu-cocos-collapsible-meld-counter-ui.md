# T270：胡了卜 Cocos 已碰牌池、记牌器与组合候选精修

- 任务编号：T270
- 负责人：Lee
- 状态：进行中
- 来源：Lee 指出已碰牌池应在左下角通过按钮展开，记牌器浅色内容看不清，组合候选最多 3 个。
- 目标：收敛竖屏局内两个信息浮层和组合候选数量。
- 允许修改：`MeldRiverLayerBinder.ts`、`GameSceneController.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T270 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档。
- 禁止修改：副露/补杠数据、组合判定、计分、关卡、牌山、存档协议、正式原图、Web Demo、横屏、微信小游戏 SDK、其他模块。
- 验证命令：共享 Cocos 测试；Cocos TypeScript；精确提交 production build；verify-only；竖屏 production 展开/收起验收；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`。
- 验收标准：已碰牌池入口位于左下角且默认收起，点击后向上展开；记牌器为深色高对比面板；组合候选最多显示 3 个且继续锚定对应按钮上方。

## 进展

- 2026-08-11：任务登记并由 Lee 领取，完成现状定位。
- 2026-08-11：已碰牌池改为左下角入口按钮，默认收起并向上展开；展开只激活当前实际副露节点。
- 2026-08-11：记牌器展开面板改为深绿高对比配色；组合候选限制为最多 3 个。
- 2026-08-11：共享 Cocos 结构测试 40 项、Cocos TypeScript 和 `git diff --check` 通过；待精确提交 production build。
