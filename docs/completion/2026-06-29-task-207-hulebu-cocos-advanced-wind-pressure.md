# T207 胡了卜 Cocos 高阶风场压力基础完成记录

- 任务编号：T207
- 负责人：Lee
- 完成日期：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T207-hulebu-cocos-advanced-wind-pressure.md`
- `docs/tasks/claims/T207-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 新增 `HULEBU_ADVANCED_RUN_PRESSURES`，为东风、南风、西风、北风定义每关压力配置。
- 新增 `getHulebuAdvancedRunPressureConfig()`，按当前 run profile 读取高阶压力。
- 新增 `mergeHulebuLevelModifierStates()`，让风场压力与关前特殊事件可以合并生效。
- Cocos 关卡启动时自动生成当前高阶风场修饰器，并传入 runtime。
- runtime 对负数工具补正为 0，避免高阶扣减后 HUD 出现负数。
- 补充共享测试，覆盖四档配置、控制器接入和实际 HUD 工具数变化。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- `npm run test -w packages/shared -- mahjong-cocos-project`：通过，1 个测试文件、25 个测试通过。
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`：通过。
- `npm run docs:sync`：收尾执行。
- `git diff --check`：收尾执行。

## 遗留问题

- 高阶专属奖励、能力槽、账号解锁、最终结算和正式 UI 美术仍需后续任务继续接入。
