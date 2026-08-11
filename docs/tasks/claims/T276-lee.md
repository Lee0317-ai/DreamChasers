# T276：胡了卜 Cocos 新手引导正式接入

- 任务编号：T276
- 任务名称：胡了卜 Cocos 新手引导正式接入
- 领取人：Lee
- 状态：已完成
- 领取时间：2026-08-11
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T276 任务/领取分片、`docs/tasks/CHANGE_INTAKE.md`、`docs/tasks/NEXT_ID.md`、`docs/progress/2026-08-11-lee.md`、`docs/modules/mahjong-roguelike/PROGRESS.md`、`docs/modules/mahjong-roguelike/HANDOFF.md`、后续完成记录及 docs:sync 主文档
- 禁止修改文件：牌山生成规则、关卡数值、组合判定、计分、存档协议、formal-v1 原图、Web Demo、横屏、微信小游戏 SDK、其他模块和 T268/T271/T273-T275 资源包
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`；`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`；精确提交 Cocos production build 与 verify-only；本地 `390×844` 首关和大厅重玩入口检查；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`
- 当前阻塞：无
- 完成时间：2026-08-11
- 完成摘要：前五关动态教学条、大厅“新手教学”入口和不覆盖原 active run 的临时重玩流程已接入；production build 与浏览器验收通过。
- 下一步：由 Lee 继续目视体验五关教学节奏；后续如要增加箭头动画或分步遮罩，应另开表现层任务，不修改本次存档保护口径。
