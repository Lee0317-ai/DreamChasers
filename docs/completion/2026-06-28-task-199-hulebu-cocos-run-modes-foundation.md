# T199 胡了卜 Cocos 长期模式入口基础完成记录

- 完成时间：2026-06-28
- 负责人：Lee
- 修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/tasks/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-28-lee.md`
- 实现内容：新增 Cocos `mainline / endless / daily` run profile、关卡映射 helper 和完成判断；Controller 新增主线、无尽、每日启动入口，并将展示层数与实际配置索引分离。主线仍 20 关结束，无尽从第 21 层循环第 11-20 关配置，每日按 seed 稳定轮换配置。
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`
- 验证结果：全部通过。
- 遗留问题：无尽/每日专属奖励、Boss、结算、局外入口参数、账号存档和高阶模式仍后置。
