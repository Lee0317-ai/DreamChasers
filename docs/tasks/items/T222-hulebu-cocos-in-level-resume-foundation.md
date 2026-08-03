# T222 胡了卜 Cocos 当前关中局恢复基础

- 任务编号：T222
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T215 已让 Cocos 具备“继续本轮”入口，但恢复口径仍只到当前关开局，不会恢复牌桌、卡槽、牌河、明牌区、震落牌与当前分数。为了让现有 Web 体验更真实地搬进 Cocos，需要先补当前关中局恢复基础。

## 目标

1. 为 `HulebuRuntimeState` 提供运行态快照导出和恢复能力。
2. 让 `HulebuActiveRunSnapshot` 包含当前关 runtime 快照。
3. `继续本轮` 时优先恢复当前关中局牌桌，而不是重新从该关开局。
4. 补共享静态测试和回归验证。

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

## 验收标准

- `HulebuRuntimeState` 提供运行态快照导出/恢复接口。
- `HulebuActiveRunSnapshot` 包含当前关 runtime 快照。
- `继续本轮` 存在当前关 runtime 快照时可恢复中局牌桌，否则回退到当前关开局。
- 共享测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成情况

- 已为 `HulebuRuntimeState` 新增运行态快照导出与静态恢复接口。
- `HulebuActiveRunSnapshot` 已纳入当前关 runtime 快照。
- `继续本轮` 现在会优先恢复当前关中局牌桌，缺快照时才回退到当前关开局。
- 已补共享静态测试覆盖 runtime 快照导出/恢复与 active run 中局恢复链路。

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`npm run docs:sync`
- 通过：`git diff --check`
