# T221 胡了卜 Cocos 局外档案本地持久化基础

- 任务编号：T221
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T204/T206 已让 Cocos 有局外铜钱和六轴成长闭环，但当前 `metaCoins` 和 `metaUpgrades` 仍只保存在运行时内存里。为了让 Cocos 局外档案真正成立，需要补独立本地持久化。

## 目标

1. 新增独立局外档案本地存储 key 和快照结构。
2. 启动和回到大厅时恢复局外铜钱与六轴成长。
3. 局外铜钱和六轴成长发生变化时写回本地。
4. 补共享静态测试和回归验证。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-221-hulebu-cocos-meta-profile-persistence-foundation.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或静态 Demo。
- 不接账号同步。
- 不扩展更多局外字段 beyond 铜钱和六轴成长。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- 新增独立局外档案存储 key 和读写 helper。
- `metaCoins`、`metaUpgrades` 会在局外变更时写本地。
- 启动和回大厅会恢复局外铜钱与六轴成长。
- 共享测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成情况

- 已新增 `hulebu-cocos-meta-profile` 本地存储 key 和独立快照结构。
- 大厅启动与回大厅时会恢复局外铜钱和六轴成长。
- 铜钱发放、局外升级变化时会同步写回独立局外档案。
- 已补共享静态测试覆盖局外档案读写 helper 和默认快照。

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`npm run docs:sync`
- 通过：`git diff --check`
