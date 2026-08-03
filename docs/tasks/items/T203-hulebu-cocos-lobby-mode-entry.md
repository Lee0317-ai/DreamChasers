# T203：胡了卜 Cocos 局外入口和模式选择

- 任务编号：T203
- 负责人：Lee
- 状态：已完成
- 创建日期：2026-06-28
- 模块：`docs/modules/mahjong-roguelike/`

## 背景

T202 已让 Cocos 新 run 在开局前选择本局流派，但 Cocos 启动后仍直接进入 run 流程。Web 完整版已有局外首页概念，Cocos 迁移需要先具备最小局外入口，让玩家选择主线、无尽或每日，再进入本局流派选择。

## 范围

允许修改：

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/modules/mahjong-roguelike/**`
- `docs/tasks/**`
- `docs/progress/2026-06-28-lee.md`
- `docs/completion/2026-06-28-task-203-hulebu-cocos-lobby-mode-entry.md`

禁止修改：

- Web 试玩页、站内静态 Demo、Prisma、账号进度相关文件。
- 非胡了卜 Cocos 模块。

## 实现内容

- Cocos 默认启动时已显示局外入口弹层。
- 局外入口提供主线、无尽、每日三种模式按钮。
- 点击模式按钮后进入 T202 的本局流派选择，再进入对应模式首关。
- 通关后按钮已回到局外入口，保持奖励、事件和流派选择流程可继续复用。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 已通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 已通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 已通过：`npm run docs:sync`
- 已通过：`git diff --check`
