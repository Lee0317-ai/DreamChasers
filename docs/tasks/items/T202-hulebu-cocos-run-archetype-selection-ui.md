# T202：胡了卜 Cocos 开局流派选择 UI

- 任务编号：T202
- 负责人：Lee
- 状态：已完成
- 创建日期：2026-06-28
- 模块：`docs/modules/mahjong-roguelike/`

## 背景

T201 已把本局流派状态接入 Cocos runtime 和 Controller，但还没有开局前选择 UI。当前迁移目标要求 Cocos 正式工程逐步承接 Web 完整版结构，“局外成长 + 本局流派选择”需要先在 Cocos 内形成可玩的开局流程。

## 范围

允许修改：

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/modules/mahjong-roguelike/**`
- `docs/tasks/**`
- `docs/progress/2026-06-28-lee.md`
- `docs/completion/2026-06-28-task-202-hulebu-cocos-run-archetype-selection-ui.md`

禁止修改：

- Web 试玩页、站内静态 Demo、Prisma、账号进度相关文件。
- 非胡了卜 Cocos 模块。

## 实现内容

- Cocos 新 run 启动前已显示本局流派选择弹层。
- 弹层展示六个流派选项，点击后调用 `selectRunArchetype()` 并进入对应模式首关。
- 已保持奖励、事件和通关 overlay 使用同一套 flow overlay 流程。
- 回归测试已覆盖 Controller 开局弹层流程和六个流派按钮入口。

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
