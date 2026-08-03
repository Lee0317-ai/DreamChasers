# T215 胡了卜 Cocos 当前本轮继续基础

- 任务编号：T215
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T203-T214 已让 Cocos 承接局外大厅、模式入口、本局流派、高阶、奖励、事件、局外成长和 Boss 变体，但当前回到大厅后仍只能重新开一轮。Web 完整版已具备“继续本轮”基础，Cocos 也需要先补一个最小 active run 恢复壳。

## 目标

1. Controller 增加本地 `activeRun` 快照结构。
2. 进入关卡、奖励/事件节点和回到大厅前维护当前 run 快照。
3. 大厅存在“继续本轮”按钮和当前 run 状态文案。
4. 点击“继续本轮”会按保存的 mode、display order、本局流派、奖励、成长和高阶能力恢复到当前关开局。
5. 通关回大厅后清空 active run。
6. 补共享静态测试和回归验证。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-215-hulebu-cocos-active-run-resume.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或静态 Demo。
- 不接账号同步、云存档或完整中局牌桌存档。
- 不做结算复盘、失败分析页或完整存档 UI。
- 不改变现有 run mode、奖励、事件和 Boss 规则口径。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- Controller 有本地 active run snapshot 和读写 helper。
- 大厅存在“继续本轮”按钮和运行中摘要。
- 恢复会回到当前关开局，并保留 run profile、本局流派、奖励、成长和高阶能力。
- 通关回大厅后会清空 active run。
- 共享测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成记录

- 完成时间：2026-06-29
- 实现内容：
  - `GameSceneController` 新增 `HulebuActiveRunSnapshot`、本地存取 helper 和 `sys.localStorage` 持久化 key。
  - 进入关卡时会持久化当前 run 的 mode、当前关序、本局流派、本轮奖励、局外成长、局外铜钱、高阶能力和已触发事件节点。
  - 大厅在存在快照时会显示“继续本轮”按钮和运行中摘要，点击后恢复到当前关开局。
  - run 通关回大厅时会清空 active run，避免已结束 run 继续留在大厅。
  - 补充共享静态测试，锁定 active run 存储、恢复入口和大厅按钮文案。
- 验证结果：
  - 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
  - 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
  - 通过：`npm run docs:sync`
  - 通过：`git diff --check`
