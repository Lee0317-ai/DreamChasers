# T204 完成记录：胡了卜 Cocos 局外成长 UI

- 任务编号：T204
- 负责人：Lee
- 完成日期：2026-06-28

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T204-hulebu-cocos-meta-upgrade-ui.md`
- `docs/tasks/claims/T204-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-28-lee.md`

## 实现内容

- 为 Cocos `GameSceneController` 新增 `meta` phase。
- 在大厅新增 `升级` 入口，进入局外成长面板。
- 面板展示并可点击升级六轴成长：备用槽、护符、工具、牌河、铜钱、看山。
- 点击升级项会调用已有 `applyMetaUpgrades()`，刷新面板显示，并让下一局通过既有 runtime 参数链路生效。
- 补充 `mahjong-cocos-project` 测试断言，锁定局外成长入口、六轴配置和面板行为关键代码。

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

- 局外成长面板仍是程序化临时 UI，尚未接最终美术、升级上限、铜钱消耗、账号同步或成就图鉴。
