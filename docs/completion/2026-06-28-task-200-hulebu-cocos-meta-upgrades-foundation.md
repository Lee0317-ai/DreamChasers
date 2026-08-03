# T200 胡了卜 Cocos 局外成长基础接入完成记录

- 完成时间：2026-06-28
- 负责人：Lee
- 修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/tasks/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-28-lee.md`
- 实现内容：新增 Cocos `HulebuMetaUpgradeState` 和默认状态；runtime 将备用槽、护符、初始工具、河道扩容、开局铜钱和看山预置合入本局；Controller 新增 `applyMetaUpgrades()` 并在创建 runtime 时传入局外成长。
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`
- 验证结果：全部通过。
- 遗留问题：Cocos 局外升级 UI、账号同步、存档序列化、高阶携带能力和完整局外首页仍后置。
