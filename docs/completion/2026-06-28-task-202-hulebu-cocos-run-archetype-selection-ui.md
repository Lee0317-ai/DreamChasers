# T202 完成记录：胡了卜 Cocos 开局流派选择 UI

- 任务编号：T202
- 负责人：Lee
- 完成日期：2026-06-28

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T202-hulebu-cocos-run-archetype-selection-ui.md`
- `docs/tasks/claims/T202-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-28-lee.md`

## 实现内容

- `GameSceneController` 新增 `archetype` phase，新 run 启动时先进入本局流派选择。
- 新增 `showRunArchetypeOverlay()` 和 `drawRunArchetypeChoices()`，使用现有 flow overlay 展示六个流派选项。
- 新增 `pickRunArchetype()` 和 `completeRunArchetypeSelection()`，点击流派后选择对应 `HulebuRunArchetypeId` 并进入对应模式首关。
- 共享测试覆盖开局流派选择 UI 入口、pending run profile 和六个流派按钮节点命名。

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

- 流派选择弹层仍是程序化按钮，尚未制作最终卡面美术和动画。
- Cocos 尚未接局外首页、账号存档或 Web 外层传参。
