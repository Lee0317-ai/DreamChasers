# T201 完成记录：胡了卜 Cocos 本局流派基础接入

- 任务编号：T201
- 负责人：Lee
- 完成日期：2026-06-28

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T201-hulebu-cocos-run-archetype-foundation.md`
- `docs/tasks/claims/T201-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-28-lee.md`

## 实现内容

- 新增 Cocos 本局流派配置：顺吃流、碰开流、开杠流、追胡流、道具流和信息流。
- 新增 `HulebuRunArchetypeState` 与 `createHulebuRunArchetypeState()`，让 runtime 可在开局时接收本局流派。
- runtime 已把流派效果合入工具次数、开局铜钱和组合得分，并在 HUD 中显示当前流派。
- `GameSceneController` 新增 `selectRunArchetype()`，后续 Cocos 选择 UI 可直接调用。
- 共享测试覆盖流派配置、bootstrap 参数、Controller API、道具流、信息流和开杠流得分。

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

- Cocos 尚未制作开局流派选择 UI。
- 本局流派尚未接账号存档或局外入口传参。
