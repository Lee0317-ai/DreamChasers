# T276：胡了卜 Cocos 新手引导正式接入

- 任务编号：T276
- 负责人：Lee
- 状态：已完成
- 优先级：P0
- 依赖任务：T239、T240、T268、T272
- 来源：Lee 在正式局内 UI 验收时指出当前只能看到普通关卡牌山，看不到此前设计的新手关卡与引导。
- 目标：把前五关的新手教学正式接入 Cocos 运行时，保持引导不遮挡牌山和动作按钮，并提供可重复进入的入口。
- 教学范围：`1-1` 可点击牌与碰、`1-2` 吃、`1-3` 杠、`1-4` 多组合选择、`1-5` 满槽救场。
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T276 任务/领取分片、`docs/tasks/CHANGE_INTAKE.md`、`docs/tasks/NEXT_ID.md`、`docs/progress/2026-08-11-lee.md`、`docs/modules/mahjong-roguelike/PROGRESS.md`、`docs/modules/mahjong-roguelike/HANDOFF.md`、后续完成记录及 docs:sync 主文档。
- 禁止修改文件：牌山生成规则、关卡数值、组合判定、计分、存档协议、formal-v1 原图、Web Demo、横屏、微信小游戏 SDK、其他模块和 T268/T271/T273-T275 资源包。
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`；`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`；精确提交 Cocos production build 与 verify-only；本地 `390×844` 首关和大厅重玩入口检查；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`。
- 验收标准：无有效存档时从 `1-1` 开始；前五关显示对应教学目标且不阻断牌山、槽位、动作栏；教学文字会随当前槽位和可执行组合更新；大厅存在“重玩新手”入口且不会误覆盖已有存档；第五关之后不显示教学层。

## 进展

- 2026-08-11：任务登记并由 Lee 领取；确认 T273-T275 只生产资源，与本任务 Cocos 运行时文件无冲突。
- 2026-08-11：前五关已接入动态教学条；文案会按槽位数量和 `碰 / 吃 / 杠` 可用状态更新，展开记牌器或打开流程弹层时自动隐藏，不阻断牌山输入。
- 2026-08-11：大厅新增“新手教学”入口；教学重玩不写 active run，第五关完成或中途退出后会恢复原进行中存档。
- 2026-08-11：共享测试 40/40、Cocos TypeScript、精确提交 production build、verify-only、`390×844` 浏览器首关/动态文案/大厅入口检查全部通过；build ID `dec5351f0057-20260811T144015Z`，任务完成。
