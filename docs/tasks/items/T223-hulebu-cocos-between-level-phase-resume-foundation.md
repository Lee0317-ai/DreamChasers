# T223 胡了卜 Cocos 关间 phase 恢复基础

- 任务编号：T223
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T222 已让 Cocos 恢复当前关中局牌桌，但 active run 仍只覆盖 `playing` 运行态。通关后的 `cleared`、奖励三选一的 `reward`、关前事件的 `event` 这些关间 phase 还不会恢复，继续本轮时仍有流程断点。

## 目标

1. 为 `HulebuActiveRunSnapshot` 增加可恢复的关间 phase 字段。
2. 持久化 `cleared / reward / event` 三类节点所需的 pending 信息。
3. `继续本轮` 时按 phase 恢复对应 overlay 和流程节点。
4. 补共享静态测试和回归验证。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-223-hulebu-cocos-between-level-phase-resume-foundation.md`

## 禁止范围

- 不接账号同步。
- 不恢复 `advancedAbility / archetype` 这类开局前选择 flow。
- 不改 Web `/games/hulebu` 试玩页或站内静态 Demo。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- `HulebuActiveRunSnapshot` 记录可恢复的关间 phase 和必要 pending 字段。
- `继续本轮` 可恢复 `cleared / reward / event` 节点。
- 共享测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成情况

- 已为 `HulebuActiveRunSnapshot` 增加 `resumablePhase` 字段。
- `showClearOverlay()`、`showRewardOverlay()`、`showEventOverlay()` 进入时会写回 active run。
- `继续本轮` 已可恢复 `cleared / reward / event` 三类关间节点。
- 已补共享静态测试覆盖 phase 恢复字段和分支。

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`npm run docs:sync`
- 通过：`git diff --check`
