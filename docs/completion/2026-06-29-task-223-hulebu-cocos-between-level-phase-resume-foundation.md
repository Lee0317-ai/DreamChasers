# T223 完成记录

- 任务编号：T223
- 任务名称：胡了卜 Cocos 关间 phase 恢复基础
- 负责人：Lee
- 完成日期：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T223-hulebu-cocos-between-level-phase-resume-foundation.md`
- `docs/tasks/claims/T223-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 为 `HulebuActiveRunSnapshot` 新增 `resumablePhase`。
- `showClearOverlay()`、`showRewardOverlay()`、`showEventOverlay()` 进入时会写回 active run。
- `resumeActiveRun()` 现在可恢复 `cleared / reward / event` 三类关间节点。
- 继续本轮已不再只覆盖 `playing` 运行态，而开始承接长局关间 flow。
- 共享静态测试补充 phase 恢复字段和分支断言。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`npm run docs:sync`
- 通过：`git diff --check`

## 遗留问题

- 当前未恢复 `advancedAbility / archetype` 这类开局前选择 flow。
- 当前不含账号同步和跨设备恢复；后续建议继续复用 active run phase 状态扩展。
