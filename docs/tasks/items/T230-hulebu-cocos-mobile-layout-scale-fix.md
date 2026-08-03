# T230 胡了卜 Cocos 移动端布局缩放修正

- 状态：已完成
- 负责人：Lee
- 认领时间：2026-06-30
- 完成时间：2026-06-30
- 对应 intake：`CHANGE_INTAKE.md` 2026-06-30 T230 条目

## 目标

修正胡了卜 Cocos 在移动端/高 DPR 设备下整体画面过大的问题，让运行时布局按可视视口缩小，而不是被像素密度继续放大。

## 允许修改范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuSampleSceneModel.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- 本任务相关文档分片

## 禁止修改范围

- Web 试玩页与站点路由
- 牌面资源与 UI 图片资源
- 关卡生成、奖励、事件、Boss 与账号同步逻辑

## 实现说明

1. `resolveHulebuRuntimeLayout()` 改为按 `visibleSize / cssSize` 计算缩放，并限制最大值为 `1`，不再把 `devicePixelRatio` 作为额外放大因子。
2. `createHulebuSampleSceneModelForLayout()` 与 `HulebuRuntimeState.toSceneModel()` 的 `layoutScale` 改为允许在小屏下收缩，并用下限保护避免过度缩小。
3. 共享测试新增对缩放口径的静态约束，防止再次回到“高 DPR 放大 + 小屏不允许缩小”的旧逻辑。

## 验证

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `git diff --check`

## 验证结果

- 通过。共享测试 29 项通过。
- 通过。Cocos TypeScript 编译无报错。
- 通过。未引入 diff 格式问题。

## 遗留

- 这次只修正运行时缩放口径，尚未做新一轮移动端目检与更细的按钮/牌山密度微调；若仍显拥挤，可在后续任务继续单独收布局常量。
