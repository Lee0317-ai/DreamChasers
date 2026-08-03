# T216 胡了卜 Cocos 最近一轮结算摘要基础

- 任务编号：T216
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T215 已让 Cocos 大厅可以继续当前 run，但局外层仍缺“上一轮打成什么样”的最小沉淀。Web 完整版已有 `lastSettlement` 基础，Cocos 也需要先补本地最近一轮摘要。

## 目标

1. Controller 增加本地 `lastSettlement` 结构和读写 helper。
2. run 通关回大厅时记录最近一轮的模式、关序、铜钱、奖励数和摘要。
3. 大厅在无 active run 时展示最近一轮状态文案。
4. 保持与 T215 的 active run 恢复口径兼容。
5. 补共享静态测试和回归验证。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-216-hulebu-cocos-last-settlement-summary.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或静态 Demo。
- 不接账号同步、完整结算页、Boss/事件复盘或云存档。
- 不改变现有 run mode、奖励、事件和 Boss 规则口径。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- Controller 有本地 `lastSettlement` snapshot 和读写 helper。
- 通关回大厅会记录最近一轮摘要。
- 大厅在无 active run 时会显示最近一轮文案。
- 共享测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成记录

- 完成时间：2026-06-29
- 实现内容：
  - `GameSceneController` 新增 `HulebuSettlementSnapshot`、本地存取 helper 和独立的 `lastSettlement` 存储 key。
  - run 通关弹层出现时会记录最近一轮的模式、关序、铜钱奖励、奖励数和摘要。
  - 大厅副标题现在按 `继续本轮 > 最近一轮 > 默认文案` 的顺序展示状态。
  - 补充共享静态测试，锁定本地结算摘要结构、存储 key 和大厅摘要文案。
- 验证结果：
  - 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
  - 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
  - 通过：`npm run docs:sync`
  - 通过：`git diff --check`
