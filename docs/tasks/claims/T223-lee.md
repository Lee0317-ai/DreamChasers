# T223 领取记录

- 任务编号：T223
- 任务名称：胡了卜 Cocos 关间 phase 恢复基础
- 负责人：Lee
- 领取时间：2026-06-29
- 状态：已完成

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

## 完成结果

- 已完成 `cleared / reward / event` 三类关间 phase 恢复基础。
