# T195：胡了卜 Cocos 洗牌和撤回真实交互

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 来源：IDEA-20260628-07

## 背景

T193/T194 已接 Cocos 打牌入河、震落开山和满槽救场。当前右侧 `洗牌 / 撤回` 仍只是视觉按钮，本任务把它们接成可用基础工具。

## 目标

1. Runtime 增加历史快照栈。
2. 入槽、打牌、组合、洗牌前记录快照。
3. `useShuffleTool()` 重排 board 牌面并消耗洗牌次数。
4. `useUndoTool()` 恢复最近快照并消耗撤回次数。
5. Controller 右侧 `洗牌 / 撤回` 按钮调用对应 runtime 方法。

## 不做

- 不实现完整 UI 禁用态。
- 不追 Boss、事件、无尽、每日、高阶和账号局外成长。
- 不改 Web 玩法或原型逻辑。

## 允许修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
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
- 完成内容：Cocos runtime 新增历史快照、洗牌和撤回；Controller 右侧洗牌/撤回按钮已接入真实方法。
- 验证结果：全部验证命令通过。
