# 任务完成记录：T230 胡了卜 Cocos 移动端布局缩放修正

- 任务编号：T230
- 负责人：Lee
- 完成日期：2026-06-30

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuSampleSceneModel.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T230-hulebu-cocos-mobile-layout-scale-fix.md`
- `docs/tasks/claims/T230-lee.md`
- `docs/tasks/NEXT_ID.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 修正 Cocos runtime 布局缩放口径，移除把 `devicePixelRatio` 当成放大因子的行为。
- 允许 `layoutScale` 在小屏视口下收缩，并加下限避免过度缩小。
- 为共享测试补充缩放口径静态约束，防止后续回归到“整屏过大”。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `git diff --check`

## 验证结果

- 全部通过。

## 遗留问题

- 尚未做新一轮 Cocos Web Preview 手机视口目检；如果仍觉得偏大，下一步应单独调牌山 spacing 与工具区纵向占比，而不是再把 DPR 纳入缩放。
