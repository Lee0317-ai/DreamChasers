# T214 领取记录

- 任务编号：T214
- 任务名称：胡了卜 Cocos Boss 变体基础
- 负责人：Lee
- 领取时间：2026-06-29
- 状态：已完成

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-214-hulebu-cocos-boss-variants.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或静态 Demo。
- 不接账号同步、云存档或 Boss 结算复盘。
- 不做完整 Boss 阶段动画、Boss 卡面美术或失败分析页。
- 不改变非 Boss 关通关逻辑。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 完成记录

- 完成时间：2026-06-29
- 状态：已完成
- 结果：Cocos Boss 变体基础已接入，主线、高阶、无尽、每日 Boss 可按 run profile 获得对应变体名称和轻量目标补丁。
