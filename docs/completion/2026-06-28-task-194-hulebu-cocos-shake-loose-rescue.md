# T194 完成记录：胡了卜 Cocos 杠胡震落和满槽救场

- 任务编号：T194
- 负责人：Lee
- 完成时间：2026-06-28

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-28-lee.md`

## 实现内容

- `杠 / 补杠` 后震落最多 2 张压顶牌。
- `胡` 后震落最多 3 张压顶牌，并沿用清牌河行为。
- 被震落的牌清除 blocker、回到可点 board 状态，并移动到松散牌区域。
- 主槽满且牌河仍可用时，HUD 状态提示 `可打牌入河`。
- 共享 Cocos 工程测试覆盖震落、blocker 释放和满槽救场提示。

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

- 震落当前是 runtime 位置和可点状态变化，尚未接动画。
- 洗牌和撤回仍未接完整交互。
- Boss、事件、无尽、每日、高阶和局外成长仍待后续任务。
