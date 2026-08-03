# T220 领取记录

- 任务编号：T220
- 任务名称：胡了卜 Cocos 主线独立长期进度基础
- 负责人：Lee
- 领取时间：2026-06-29
- 状态：已完成

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-220-hulebu-cocos-mainline-meta-progress-foundation.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或静态 Demo。
- 不接主线星级系统或账号同步。
- 不改变现有 run mode、奖励、事件和 Boss 规则口径。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 完成结果

- 已完成 Cocos 主线独立长期进度基础：`metaProgress` 现已记录主线最高已到关序，大厅和生涯面板会优先读取主线长期进度。
- 共享静态测试与 Cocos TypeScript 编译已通过。
