# T198 胡了卜 Cocos 特殊事件基础接入完成记录

- 完成时间：2026-06-28
- 负责人：Lee
- 修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/tasks/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-28-lee.md`
- 实现内容：新增 Cocos 特殊事件池、事件关卡节点和 deterministic 三选一；新增本关事件修饰器，支持本关铜钱、工具补给和禁用工具；Controller 在事件关前弹出选择，选择后带事件效果进入当前关，下一关自动清空。
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`
- 验证结果：全部通过。
- 遗留问题：事件卡美术、事件稀有度、更多事件池、高压生成器词缀、无尽/每日/高阶事件分支和账号存档仍后置。
