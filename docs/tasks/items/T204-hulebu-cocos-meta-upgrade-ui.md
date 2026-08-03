# T204：胡了卜 Cocos 局外成长 UI

- 任务编号：T204
- 负责人：Lee
- 状态：已完成
- 创建日期：2026-06-28
- 模块：`docs/modules/mahjong-roguelike/`

## 背景

T200 已让 Cocos runtime 支持六轴局外成长，T203 已补局外入口和模式选择，但玩家还不能在 Cocos 内操作局外成长。迁移继续推进时，需要先把六轴成长做成局外入口里的可点击面板，让下一局能直接吃到成长数值。

## 范围

允许修改：

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/modules/mahjong-roguelike/**`
- `docs/tasks/**`
- `docs/progress/2026-06-28-lee.md`
- `docs/completion/2026-06-28-task-204-hulebu-cocos-meta-upgrade-ui.md`

禁止修改：

- Web 试玩页、站内静态 Demo、Prisma、账号进度相关文件。
- 非胡了卜 Cocos 模块。

## 实现内容

- Cocos 局外入口新增升级按钮。
- 升级面板展示六轴局外成长：备用槽、护符、初始工具、河道扩容、开局铜钱、看山预置。
- 点击每项升级会调用已有 `applyMetaUpgrades()` 并更新面板展示。
- 返回局外后启动下一局时，升级数值继续传入 runtime。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 完成记录

- Cocos 大厅新增 `升级` 入口，点击后进入 `局外成长` 面板。
- 面板已展示六轴成长：备用槽、护符、工具、牌河、铜钱、看山。
- 点击成长项会调用 `applyMetaUpgrades()` 更新 Cocos controller 持有的成长状态，并刷新面板等级。
- 下一局启动时沿用既有 `startLevel()` 参数链路，把成长状态传入 runtime。
- 已补 `mahjong-cocos-project` 测试断言，锁定 Cocos 局外成长 UI 入口与六轴配置。

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
