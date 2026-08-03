# T222 领取记录

- 任务编号：T222
- 任务名称：胡了卜 Cocos 当前关中局恢复基础
- 负责人：Lee
- 领取时间：2026-06-29
- 状态：已完成

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-222-hulebu-cocos-in-level-resume-foundation.md`

## 禁止范围

- 不接账号同步。
- 不改 Web `/games/hulebu` 试玩页或站内静态 Demo。
- 不恢复奖励/事件三选一弹层，只覆盖当前关运行态。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 完成结果

- 已完成当前关中局恢复基础；active run 现在可携带当前关 runtime 快照并恢复到中局牌桌。
