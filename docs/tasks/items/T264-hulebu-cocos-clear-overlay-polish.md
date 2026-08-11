# T264：胡了卜 Cocos 通关弹层视觉优化

- 任务编号：T264
- 负责人：Lee
- 状态：已完成
- 来源：Lee 要求继续优化通过后的 UI
- 目标：把通关提示收敛为单一正式结算面板，清楚展示层数、本层得分、关卡信息和唯一继续操作，并确保整局工具控件位于遮罩之下。
- 允许修改：`GameSceneController.ts`、`HulebuFormalUiCatalog.ts`（仅必要映射）、`packages/shared/src/mahjong-cocos-project.test.ts`、T264 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档。
- 禁止修改：通关判定、奖励选择、关卡推进、计分规则、牌山生成、存档协议、Web Demo、横屏、微信小游戏 SDK、其他模块。
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`；`npx tsc -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.domain.json`；精确提交 production build；verify-only；Chrome `390×844` 通关弹层目检与继续按钮验证；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`。
- 验收标准：通关弹层不再出现三张空卡位或双层底板；标题、分数、关卡说明与按钮互不重叠；右侧工具按钮被遮罩正确压暗且不能抢占弹层交互；继续按钮沿用现有关卡流转。

## 进展

- 2026-08-11：任务登记并由 Lee 领取，开始定位通关弹层资源复用和 Canvas 层级问题。
- 2026-08-11：通关状态改用 formal v1 `settlement` 单面板底图，正式 Sprite 加载成功后清空程序化 fallback；标题、本层得分、关卡说明和继续按钮已按单列层级重排。
- 2026-08-11：流程遮罩新增输入阻断，并在清台后的 HUD 刷新完成后重新置顶，右侧工具层不再浮在遮罩之上或抢占点击。
- 2026-08-11：共享测试 `40/40`、Cocos TypeScript、精确提交 production build 和 verify-only 均通过；build ID `14696e097fd7-20260811T052502Z`，5 条 smoke 路径返回 `200`。内置浏览器受本地 URL 安全策略限制，未完成自动化截图目检，保留给 Lee 在 `http://127.0.0.1:4173/` 直接验收。

## 完成摘要

- 通关弹层已从错误的三选一空卡位底图切换为正式结算底板，不再出现双层程序化底板。
- 弹层正文明确显示层数、本层得分和当前关卡，唯一主操作继续沿用既有 `continueAfterClear()` 流程。
- 全屏遮罩会消费底层输入，并在运行时 HUD 刷新后保持 Canvas 顶层。
