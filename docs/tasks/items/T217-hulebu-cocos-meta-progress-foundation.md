# T217 胡了卜 Cocos 本地长期进度基础

- 任务编号：T217
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T215/T216 已让 Cocos 大厅记住当前 run 和最近一轮摘要，但局外层还没有长期进度信号。Web 完整版当前至少会读出无尽最高层、每日最佳和高阶解锁进度，Cocos 也需要先补这层本地长期状态。

## 目标

1. Controller 增加本地 `metaProgress` 结构和读写 helper。
2. 无尽 run 完成时更新 `bestEndlessLayer`。
3. 每日 run 完成时更新对应 seed 的最佳关序。
4. 高阶 run 完成时更新最高已完成风场。
5. 大厅模式按钮或摘要展示这些长期进度。
6. 补共享静态测试和回归验证。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-217-hulebu-cocos-meta-progress-foundation.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或静态 Demo。
- 不接账号同步、成就系统、完整结算页或云存档。
- 不改变现有 run mode、奖励、事件和 Boss 规则口径。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- Controller 有本地长期进度结构和读写 helper。
- 无尽、每日、高阶 run 完成时会更新对应本地进度。
- 大厅模式按钮或摘要能展示长期进度文案。
- 共享测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成记录

- `GameSceneController` 新增 `HulebuMetaProgressSnapshot`、`HULEBU_META_PROGRESS_STORAGE_KEY` 和本地读写 helper，持久化无尽最高层、每日 seed 最佳关序和高阶最高风场。
- run 完成时会在最近一轮结算写入后同步刷新本地长期进度；大厅 `主线 / 无尽 / 每日 / 高阶` 入口补充长期进度副文案。
- 共享静态测试已补对长期进度 helper、存储 key 和大厅长期进度文案 helper 的回归断言。

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`npm run docs:sync`
- 通过：`git diff --check`
