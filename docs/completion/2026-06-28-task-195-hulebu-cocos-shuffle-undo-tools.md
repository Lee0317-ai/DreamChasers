# T195 完成记录：胡了卜 Cocos 洗牌和撤回真实交互

- 任务编号：T195
- 负责人：Lee
- 完成时间：2026-06-28

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-28-lee.md`

## 实现内容

- Runtime 新增历史快照栈，记录 tiles、slot、reserve、river、openMelds、分数、铜钱和震落序号。
- 入槽、打牌、组合和洗牌前记录快照。
- `useShuffleTool()` 会重排 board 牌面并消耗洗牌次数。
- `useUndoTool()` 会恢复最近快照并消耗撤回次数。
- Controller 右侧 `洗牌 / 撤回` 按钮已调用对应 runtime 方法并刷新场景。
- 共享 Cocos 工程测试覆盖洗牌、撤回和工具按钮接入。

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

- 洗牌当前为确定性轮转，后续可在保留 seed 的前提下替换成更接近 Web 的随机洗牌。
- Boss、事件、无尽、每日、高阶和局外成长仍待后续 Cocos 追平任务。
