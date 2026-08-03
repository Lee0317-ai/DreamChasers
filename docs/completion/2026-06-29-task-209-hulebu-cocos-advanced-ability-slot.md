# T209 胡了卜 Cocos 高阶能力槽基础完成记录

- 任务编号：T209
- 负责人：Lee
- 完成日期：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T209-hulebu-cocos-advanced-ability-slot.md`
- `docs/tasks/claims/T209-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 新增 `HULEBU_ADVANCED_ABILITIES`，第一版包含 `封盘护河 / 迟火 / 牌尾缓冲`。
- 新增 `getHulebuAdvancedAbilityChoices()`，普通 run 返回空，高阶 run 按风场返回可选能力。
- `GameSceneController` 新增 `advancedAbility` phase 和能力选择弹层。
- 高阶启动流程改为 `风场选择 -> 高阶能力选择 -> 本局流派选择 -> 开局`。
- 选择能力后会把能力绑定的奖励写入本轮 reward state，并把能力的每关修饰器合入 runtime。
- 补充共享测试，覆盖配置、UI 流程接入和 HUD 可见效果。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- `npm run test -w packages/shared -- mahjong-cocos-project`：通过，1 个测试文件、27 个测试通过。
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`：通过。
- `npm run docs:sync`：收尾执行。
- `git diff --check`：收尾执行。

## 遗留问题

- 高阶能力仍是第一版 3 选 1，不包含账号解锁、多槽装备、能力升级、最终卡面美术或云存档。
