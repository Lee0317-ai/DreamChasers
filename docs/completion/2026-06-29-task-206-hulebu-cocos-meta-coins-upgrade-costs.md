# T206 完成记录：胡了卜 Cocos 局外铜钱和升级成本闭环

- 任务编号：T206
- 负责人：Lee
- 完成日期：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T206-hulebu-cocos-meta-coins-upgrade-costs.md`
- `docs/tasks/claims/T206-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- Cocos Controller 新增本地局外铜钱状态。
- 新增六轴局外成长价格表和等级上限表。
- 通关回大厅前会发放局外铜钱。
- 局外成长面板显示当前铜钱、等级和下一档价格。
- 点击升级会校验价格、扣除铜钱并更新成长等级；满级后不可继续升级。
- 补充 `mahjong-cocos-project` 测试断言，锁定钱包、价格、扣费、满级和通关发铜钱关键代码。

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

- 局外铜钱仍是 Cocos 本地运行态钱包，尚未接账号同步、真实持久化、正式经济曲线或最终成长面板美术。
