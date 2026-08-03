# T210 胡了卜 Cocos 高阶事件池基础完成记录

- 任务编号：T210
- 负责人：Lee
- 完成日期：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T210-hulebu-cocos-advanced-events.md`
- `docs/tasks/claims/T210-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 新增 `HULEBU_ADVANCED_SPECIAL_EVENT_POOLS`，为东/南/西/北风场定义第一版高阶事件。
- `getHulebuSpecialEventConfig()` 支持查找普通事件和高阶事件。
- `getHulebuSpecialEventChoices()` 新增 profile 参数，普通 run 保持旧池，高阶 run 优先展示风场事件并补足 3 个选项。
- `GameSceneController` 事件弹层传入当前 `runProfile`，让高阶事件节点展示专属事件。
- 补充共享测试，覆盖普通事件不变、高阶事件优先选择和 runtime HUD 生效。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- `npm run test -w packages/shared -- mahjong-cocos-project`：通过，1 个测试文件、27 个测试通过。
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`：通过。
- `npm run docs:sync`：已通过，同步 185 个任务分片和 177 个领取分片。
- `git diff --check`：已通过。

## 遗留问题

- 高阶事件仍是第一版风场优先池，不包含完整事件稀有度、构筑权重、每日/无尽事件变体或最终事件卡美术。
