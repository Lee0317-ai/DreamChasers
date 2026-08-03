# T215 胡了卜 Cocos 当前本轮继续基础完成记录

- 任务编号：T215
- 负责人：Lee
- 完成日期：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T215-hulebu-cocos-active-run-resume.md`
- `docs/tasks/claims/T215-lee.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 新增 Cocos 本地 active run 快照结构和 `sys.localStorage` 存取 helper。
- 进入关卡时持久化当前 run mode、当前关序、本局流派、本轮奖励、局外成长、局外铜钱和高阶能力。
- 大厅在存在快照时显示“继续本轮”和运行中摘要。
- 点击“继续本轮”会恢复到当前关开局。
- run 通关回大厅时会清空 active run。
- 补充共享静态测试，锁定存储 key、恢复入口和大厅按钮文案。

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

- 当前恢复口径只到当前关开局，不恢复中局牌桌、卡槽、牌河、震落位置或撤回历史栈。
