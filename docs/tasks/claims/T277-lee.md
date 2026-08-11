# T277：胡了卜 Cocos 完整局外 UI 接入

- 任务编号：T277
- 任务名称：胡了卜 Cocos 完整局外 UI 接入
- 领取人：Lee
- 状态：已完成
- 领取时间：2026-08-11
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/formal-v1/meta-flow/**`、`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/**`、`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T277 任务/领取分片、`docs/tasks/CHANGE_INTAKE.md`、`docs/tasks/NEXT_ID.md`、`docs/progress/2026-08-11-lee.md`、`docs/modules/mahjong-roguelike/PROGRESS.md`、`docs/modules/mahjong-roguelike/HANDOFF.md`、后续完成记录及 docs:sync 主文档
- 禁止修改文件：牌山生成规则、关卡数值、组合判定、计分、存档协议、既有 `formal-v1` 局内原图、Web Demo、横屏、微信小游戏 SDK、其他模块和 T268/T273-T276 原始交付物
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`；`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`；精确提交 Cocos production build 与 verify-only；本地 `390×844` 启动页/大厅/模式/地图/结算逐屏检查；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`
- 完成时间：2026-08-12
- 当前阻塞：无
- 完成摘要：已导入 40 个正式透明组件，完成标题页、大厅、模式选择、主线地图、成功结算及现有局外入口接线；修复竖屏坐标与单一触摸命中路由，并通过 `390×844` 浏览器逐屏交互验收、41 项专项测试、Cocos TypeScript 检查和 exact-commit 构建验证。
