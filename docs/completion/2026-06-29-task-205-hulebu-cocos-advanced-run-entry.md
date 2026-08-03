# T205 完成记录：胡了卜 Cocos 高阶周目入口基础

- 任务编号：T205
- 负责人：Lee
- 完成日期：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T205-hulebu-cocos-advanced-run-entry.md`
- `docs/tasks/claims/T205-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- Cocos 配置层新增 `advanced` run mode。
- 新增 `HulebuAdvancedRunTier`、`HULEBU_ADVANCED_RUN_PROFILES` 和 `createHulebuAdvancedRunProfile()`。
- 四档高阶 profile 覆盖东风场、南风场、西风场、北风场，并复用主线后半段关卡压力。
- Cocos 大厅新增 `高阶` 入口。
- 高阶面板展示四档风场，选择后进入本局流派选择，再启动对应高阶 run。
- 补充 `mahjong-cocos-project` 测试断言，锁定高阶 profile、入口按钮、四档选择和启动链路。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`npm run docs:sync`
- 通过：`git diff --check`

## 遗留问题

- 高阶当前只接入口和四档 profile，尚未接高阶词缀、能力槽压缩、账号解锁、专属奖励、最终美术和成就联动。
