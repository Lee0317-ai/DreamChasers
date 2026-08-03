# T220 胡了卜 Cocos 主线独立长期进度基础

- 任务编号：T220
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T217 已让 Cocos 有无尽、每日和高阶的本地长期进度，但主线仍只借最近一轮摘要展示。为了让局外长期口径完整，主线也需要独立进 `metaProgress`。

## 目标

1. `metaProgress` 新增主线独立进度字段。
2. 主线 run 结算后刷新主线最高已到关序。
3. 大厅主线按钮和生涯面板优先展示主线长期进度。
4. 补共享静态测试和回归验证。

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

## 验收标准

- `metaProgress` 新增主线独立进度字段。
- 主线 run 完成后会刷新该字段。
- 大厅主线按钮和生涯面板优先展示主线长期进度。
- 共享测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成记录

- `HulebuMetaProgressSnapshot` 新增 `bestMainlineLevel`，主线 run 完成后会写回主线最高已到关序。
- 大厅主线按钮和生涯面板现在优先展示 `最高第 X 关` 的主线长期进度，不再只依赖最近一轮摘要。
- 共享静态测试已补对主线独立进度字段、主线长期进度文案和默认快照字段的回归断言。

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`npm run docs:sync`
- 通过：`git diff --check`
