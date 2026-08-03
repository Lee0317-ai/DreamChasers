# T221 完成记录

- 任务编号：T221
- 任务名称：胡了卜 Cocos 局外档案本地持久化基础
- 负责人：Lee
- 完成日期：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T221-hulebu-cocos-meta-profile-persistence-foundation.md`
- `docs/tasks/claims/T221-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 新增独立 `hulebu-cocos-meta-profile` 本地存储 key。
- 新增 `HulebuMetaProfileSnapshot`、默认快照、读写 helper。
- 启动大厅与回大厅时恢复局外铜钱和六轴成长。
- 局外升级和通关发钱后会同步写回独立局外档案。
- 共享静态测试补充对局外档案 key、快照、默认值和读写路径的回归断言。

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

- 当前局外档案仍只保存在本地，不含账号同步或跨设备合并。
- 本任务只覆盖局外铜钱和六轴成长，未扩展更多生涯字段。
