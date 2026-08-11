# T278：胡了卜 Cocos 震落牌区空内容修复

- 任务编号：T278
- 负责人：Lee
- 状态：已完成
- 优先级：P0
- 依赖任务：T272、T277
- 来源：Lee 提供 production 截图，指出“震落牌区 4”只有数量和空面板，没有显示对应的 4 张震落麻将牌。
- 目标：修复震落牌数据到独立区域的显示链路，让面板数量与真实牌面一致，数量增加时仍不覆盖原牌山。
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/MeldRiverLayerBinder.ts`、`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`、`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`、`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/contracts/HulebuSceneModel.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T278 任务/领取分片、完成记录及 docs:sync 主文档。
- 禁止修改文件：震落数量、组合规则、点击判定、计分、关卡、存档协议、正式原图、Web Demo、横屏、微信小游戏 SDK 和其他模块。
- 验证命令：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`；`npm exec -w packages/shared vitest -- run mahjong-cocos-project`；exact-commit `npm run game:hulebu:build`；`npm run game:hulebu:verify-build`；`390×844` 浏览器截图检查；`npm run docs:sync`；`git diff --check`。
- 验收标准：震落牌区数量大于 0 时显示同数量的真实麻将牌；4 张及更多牌在独立区域内清晰排布，不覆盖原牌山；震落牌仍按既有规则保持可点击；其他牌区与局内玩法不回归。

## 进展

- 2026-08-12：任务登记并由 Lee 领取，开始检查运行时场景模型与 `MeldRiverLayerBinder` 的震落牌数据/渲染链路。
- 2026-08-12：确认运行时模型已提供正确数量、牌面、坐标与可点击状态；问题位于 `BoardLayerBinder` 的震落牌复用池和 `1000+` 渲染深度。
- 2026-08-12：新增独立 `LooseTilePool`，将震落牌本地渲染深度收束到可见 UI 范围，同时保留模型高 `zIndex` 用于点击排序。
- 2026-08-12：在 `4173` 当前教学局真实触发杠，验证“震落牌区 2”显示两张真实牌；点击后面板变为 1、余牌减少且牌进入主槽。41 项专项测试、Cocos TypeScript、exact-commit build 和 verify-only 通过；构建 ID：`9409ee1cc5ff-20260811T204619Z`。
