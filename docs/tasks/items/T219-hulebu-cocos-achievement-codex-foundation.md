# T219 胡了卜 Cocos 成就图鉴最小版基础

- 任务编号：T219
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T218 已让 Cocos 大厅具备 `生涯总览`，但仍只有累计状态摘要。Web 完整版已有本地成就/图鉴口径，Cocos 继续迁移时需要先补一版本地成就快照和最小图鉴展示。

## 目标

1. 新增本地 `achievements` 快照和读写 helper。
2. 基于主线、无尽、每日、升级和高阶推进解锁首批成就。
3. `生涯` 面板展示成就总数、下一项目标和首批图鉴列表。
4. 补共享静态测试和回归验证。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-219-hulebu-cocos-achievement-codex-foundation.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或静态 Demo。
- 不接账号同步、完整隐藏目标体系或完整图鉴分类页。
- 不改变现有 run mode、奖励、事件和 Boss 规则口径。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- Cocos 有本地成就快照和读写 helper。
- 首批成就会在主线、无尽、每日、升级和高阶推进时解锁。
- `生涯` 面板能展示成就总数、下一项目标和首批图鉴列表。
- 共享测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成记录

- `GameSceneController` 新增 `HULEBU_ACHIEVEMENTS_STORAGE_KEY`、首批 8 项成就配置和本地成就读写 helper。
- 主线通关、无尽推进、每日参与、局外升级和高阶推进现在会更新本地成就快照。
- `生涯` 面板新增图鉴总览、下一项目标和首批图鉴摘要，让 Cocos 局外层开始具备最小成就/图鉴阅读能力。
- 共享静态测试已补对成就快照、helper、生涯图鉴摘要和文案口径的回归断言。

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`npm run docs:sync`
- 通过：`git diff --check`
