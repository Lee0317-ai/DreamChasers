# T203 完成记录：胡了卜 Cocos 局外入口和模式选择

- 任务编号：T203
- 负责人：Lee
- 完成日期：2026-06-28

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T203-hulebu-cocos-lobby-mode-entry.md`
- `docs/tasks/claims/T203-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-28-lee.md`

## 实现内容

- `GameSceneController` 新增 `lobby` phase，Cocos 默认启动时先显示局外入口。
- 新增 `showLobbyOverlay()` 和 `drawLobbyModeChoices()`，提供主线、无尽、每日三个模式按钮。
- 模式按钮复用 `startMainlineRun()`、`startEndlessRun()` 和 `startDailyRun()`，进入 T202 的本局流派选择后再开局。
- 通关后的按钮改为回到局外入口。
- 共享测试覆盖 lobby phase、默认入口、三种模式按钮和局外入口文案。

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

## 遗留问题

- 局外入口仍是程序化按钮，尚未接最终首页美术、账号进度、成就图鉴或高阶周目。
