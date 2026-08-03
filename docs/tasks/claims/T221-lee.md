# T221 领取记录

- 任务编号：T221
- 任务名称：胡了卜 Cocos 局外档案本地持久化基础
- 负责人：Lee
- 领取时间：2026-06-29
- 状态：已完成

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

## 完成结果

- 已完成独立局外档案本地持久化基础，局外铜钱和六轴成长不再只依赖 active run 快照。
