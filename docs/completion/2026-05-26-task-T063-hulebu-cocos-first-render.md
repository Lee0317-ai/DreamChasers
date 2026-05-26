# T063 胡了卜 Cocos 首屏自动渲染完成记录

- 任务编号：T063
- 任务名称：胡了卜 Cocos 首屏自动渲染
- 完成时间：2026-05-26
- 负责人：Codex / 开发 B

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/SlotLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/ComboBarBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/HudBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuSampleSceneModel.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `apps/game/mahjong-roguelike/cocos/**` 文档
- `docs/modules/mahjong-roguelike/**`
- `docs/tasks/**`
- `docs/progress/2026-05-26.md`

## 实现内容

- 新增 Creator 播放验证用的本地测试 scene model。
- `GameSceneController` 默认加载测试 scene model，并自动补 `Canvas` / `UITransform`。
- `BoardLayerBinder` 支持自动创建占位牌节点、绘制牌面、可点态和暗化态。
- `SlotLayerBinder` 支持自动绘制 8 格主槽。
- `ComboBarBinder` 支持自动生成 `胡 / 杠 / 碰 / 吃` 占位按钮。
- `HudBinder` 支持按节点名自动查找或创建 HUD Label。
- 补充 Cocos 工程脚本检查配置。
- 根据 Creator 预览截图修正首屏坐标偏移，测试首屏改为 1280x720 左下角原点可见布局。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run test -w packages/shared -- mahjong`
- `npm run typecheck -w packages/shared`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- `npm run test -w packages/shared -- mahjong-cocos-project` 通过，1 个测试文件、4 个测试通过。
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json` 通过。
- `npm run test -w packages/shared -- mahjong` 通过，5 个测试文件、35 个测试通过。
- `npm run typecheck -w packages/shared` 通过。
- `npm run docs:sync` 通过，同步 30 个任务分片和 30 个领取分片。
- `git diff --check` 通过。

## 遗留问题

- 本任务只做占位首屏渲染，不接真实关卡状态。
- 还未实现点击牌面进入槽位、组合结算、奖励选择、最终牌面资源、动画和音效。
