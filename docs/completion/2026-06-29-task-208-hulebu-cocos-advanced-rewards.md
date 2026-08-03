# T208 胡了卜 Cocos 高阶专属奖励基础完成记录

- 任务编号：T208
- 负责人：Lee
- 完成日期：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T208-hulebu-cocos-advanced-rewards.md`
- `docs/tasks/claims/T208-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 新增 `HULEBU_ADVANCED_REWARD_POOLS`，为东风、南风、西风、北风定义第一版高阶专属奖励。
- 新增 `getHulebuRewardChoicesForRun()`，普通 run 保持关卡奖励池，高阶 run 优先展示风场奖励并补足 3 个选项。
- `GameSceneController` 奖励弹层改为按当前 run profile 获取奖励选择。
- `applyHulebuRewardToRunState()` 支持 8 个高阶奖励效果，覆盖工具补偿、护符、备用槽、开局铜钱和组合得分。
- 补充共享测试，覆盖奖励池配置、选择顺序和 runtime 实际效果。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- `npm run test -w packages/shared -- mahjong-cocos-project`：通过，1 个测试文件、26 个测试通过。
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`：通过。
- `npm run docs:sync`：收尾执行。
- `git diff --check`：收尾执行。

## 遗留问题

- 高阶能力槽、账号解锁、专属事件权重、最终奖励卡美术和专属结算仍需后续任务继续接入。
