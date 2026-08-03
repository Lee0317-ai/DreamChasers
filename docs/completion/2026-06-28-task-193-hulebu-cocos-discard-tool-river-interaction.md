# T193 完成记录：胡了卜 Cocos 丢弃工具和牌河交互

- 任务编号：T193
- 负责人：Lee
- 完成时间：2026-06-28

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/SlotLayerBinder.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-28-lee.md`

## 实现内容

- `SlotLayerBinder` 新增 `setSlotClickHandler()` 和主槽点击绑定。
- `GameSceneController` 新增丢弃选择态。
- 右侧 `打牌` 工具进入丢弃选择态。
- 选择态下点击主槽牌会调用 runtime `discardSlotTile()`，打入牌河并刷新场景。
- 共享 Cocos 工程测试锁定交互入口和脚本引用。

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

- 洗牌和撤回仍未接完整交互。
- `杠 / 胡` 震落牌、满槽救场、Boss、事件、无尽、每日和高阶仍待后续任务。
