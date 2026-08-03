# T193：胡了卜 Cocos 丢弃工具和牌河交互

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 来源：IDEA-20260628-05

## 背景

T192 已把 Cocos 的有限牌河状态和渲染接起来，但还缺 Web 版本中“打牌到牌河”的操作闭环。本任务先接右侧工具按钮和主槽点击，形成最小可操作链路。

## 目标

1. `SlotLayerBinder` 支持主槽点击回调。
2. `GameSceneController` 支持丢弃选择态。
3. 右侧 `ToolButton_Hint` 进入丢弃选择态。
4. 选择态下点击主槽牌会调用 `discardSlotTile()` 并刷新牌河。

## 不做

- 不实现完整洗牌/撤回历史栈。
- 不追 Boss、事件、无尽、每日、高阶和账号局外成长。
- 不改 Web 玩法或原型逻辑。

## 允许修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/SlotLayerBinder.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-28-lee.md`

## 禁止修改文件

- `apps/web/**`
- `apps/game/mahjong-roguelike/prototypes/**`
- `apps/web/prisma/**`
- PDF、AI 修图、TimePick、部署相关文件

## 验证命令

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
npm run docs:sync
git diff --check
```

## 完成记录

- 完成时间：2026-06-28
- 完成内容：Cocos 右侧 `打牌` 工具进入丢弃选择态，点击主槽牌会调用 `discardSlotTile()` 打入牌河。
- 验证结果：全部验证命令通过。
