# T277：胡了卜 Cocos 完整局外 UI 接入

- 任务编号：T277
- 负责人：Lee
- 状态：已完成
- 优先级：P0
- 依赖任务：T268、T273、T274、T275、T276
- 来源：Lee 指定 Codex 任务 `019fefbb-39bb-71c0-a4f2-740c5e68b8b3`，要求把其中已经确认的完整局外 UI 接入当前 Cocos 游戏。
- 目标：将已交付的标题/大厅、模式选择、主线地图和胜负结算透明组件导入 Cocos，并把旧通用局外弹层替换为可操作的正式竖屏流程。
- 接入范围：启动登录/游客进入、正式大厅、模式选择、主线章节地图、胜利/失败结算；复用现有存档、模式入口、新手教学与局内牌局逻辑。
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/formal-v1/meta-flow/**`、`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/**`、`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T277 任务/领取分片、`docs/tasks/CHANGE_INTAKE.md`、`docs/tasks/NEXT_ID.md`、`docs/progress/2026-08-11-lee.md`、`docs/modules/mahjong-roguelike/PROGRESS.md`、`docs/modules/mahjong-roguelike/HANDOFF.md`、后续完成记录及 docs:sync 主文档。
- 禁止修改文件：牌山生成规则、关卡数值、组合判定、计分、存档协议、既有 `formal-v1` 局内原图、Web Demo、横屏、微信小游戏 SDK、其他模块和 T268/T273-T276 原始交付物。
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`；`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`；精确提交 Cocos production build 与 verify-only；本地 `390×844` 启动页/大厅/模式/地图/结算逐屏检查；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`。
- 验收标准：首次进入显示正式标题页；游客入口可进入大厅；大厅可继续存档并进入主线、模式、图鉴、成长和新手教学；主线先进入章节地图再开局；模式卡可进入现有无尽/每日/高阶流程；胜负结算使用新资源且按钮可用；所有页面在 `390×844` 无遮挡、无溢出，局内玩法行为保持不变。

## 进展

- 2026-08-11：任务登记并由 Lee 领取；确认 T273-T275 共 40 个透明组件与 Cocos 导入契约完整，当前旧局外流程仍由 `GameSceneController` 的通用弹层承载。
- 2026-08-12：完成 40 个透明组件的 Cocos 资源导入与 Creator 元数据生成；新增正式标题页、大厅、模式选择、主线地图和成功结算页面，保留并接通继续存档、无尽、每日、高阶、图鉴、成长和新手教学入口。
- 2026-08-12：修正竖屏坐标、模式卡文字对比度和局外流程触摸分发；在 `390×844` 浏览器中验证游客进入、空白区域不误触、模式页、主线地图、当前节点和有存档大厅入口。
- 2026-08-12：41 项 `mahjong-cocos-project` 测试、Cocos TypeScript 检查、exact-commit production build 和 verify-only 均通过；最终构建 ID：`577ca485e380-20260811T194230Z`。当前运行时没有可触发的失败结算事件，失败资源已导入目录与目录表，后续出现失败状态时可直接接线。
