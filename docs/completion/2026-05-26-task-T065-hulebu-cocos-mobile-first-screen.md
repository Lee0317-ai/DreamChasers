# T065 胡了卜 Cocos 手机竖屏首屏适配完成记录

- 任务编号：T065
- 任务名称：胡了卜 Cocos 手机竖屏首屏适配
- 完成时间：2026-05-26
- 负责人：Codex / 开发 B

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/settings/v2/packages/project.json`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuSampleSceneModel.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/SlotLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/ComboBarBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/HudBinder.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/modules/mahjong-roguelike/**`
- `docs/tasks/**`
- `docs/progress/2026-05-26.md`

## 实现内容

- 项目设计分辨率设置为 390x844。
- 测试首屏占位牌山改为手机竖屏布局。
- 占位牌尺寸调整为 52x70，便于手机竖屏可读。
- 8 格主槽、组合按钮和 HUD 按手机操作区域重排。

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
- `npm run docs:sync` 通过，同步 31 个任务分片和 31 个领取分片。
- `git diff --check` 通过。

## 遗留问题

- 本任务只完成首屏占位 UI 的手机竖屏适配。
- 真实密集牌山、点击热区、奖励弹层、Boss 目标和真机触控仍需后续任务继续适配。
