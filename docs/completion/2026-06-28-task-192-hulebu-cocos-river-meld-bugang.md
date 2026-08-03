# T192 完成记录：胡了卜 Cocos 有限牌河、明牌组和补杠基础迁移

- 任务编号：T192
- 负责人：Lee
- 完成时间：2026-06-28

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/contracts/HulebuSceneModel.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuSampleSceneModel.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/ComboBarBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/MeldRiverLayerBinder.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-28-lee.md`

## 实现内容

- `HulebuCocosSceneModel` 新增 `openMeldNodes / riverNodes`。
- Cocos combo 类型新增 `bugang`。
- `HulebuRuntimeState` 新增 `river / riverLimit / openMelds`，并支持 `discardSlotTile()`。
- 执行 `碰 / 杠` 会写入明牌区；执行 `补杠` 会把已有碰组升级为补杠；执行 `胡` 会清掉一张牌河。
- 新增 `MeldRiverLayerBinder` 渲染明牌区和牌河。
- `GameSceneController` 自动接入 `MeldRiverRoot`。
- 共享 Cocos 工程测试覆盖字段、脚本和基础 runtime 行为。

## 验证命令

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
npm run docs:sync
git diff --check
```

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`npm run docs:sync`
- 通过：`git diff --check`

## 遗留问题

- 工具按钮真实交互尚未接入，Cocos 已有 `discardSlotTile()` 但还没有按钮选择态。
- `杠 / 胡` 震落牌、满槽救场、Boss、事件、无尽、每日和高阶仍待后续任务。
