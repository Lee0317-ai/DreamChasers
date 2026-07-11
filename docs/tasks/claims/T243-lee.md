# T243：胡了卜 Cocos 正式源码基线与构建溯源门禁

- 任务编号：T243
- 任务名称：胡了卜 Cocos 正式源码基线与构建溯源门禁
- 领取人：Lee
- 状态：进行中
- 领取时间：2026-07-12
- 允许修改文件：Cocos `assets/scripts/**` 中当前正式运行时增量、`assets/resources/ui/v6.meta`、`assets/resources/ui/v6/**`、`apps/game/mahjong-roguelike/release/hulebu-v1.release.json`、`apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs`、`apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs`、`packages/shared/src/hulebu-cocos-release.test.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、`docs/superpowers/plans/2026-07-12-hulebu-cocos-source-baseline.md`、`docs/tasks/items/T243-hulebu-cocos-source-baseline.md`、本领取分片及对应进展/完成/模块交接文档
- 禁止修改：Cocos `settings/v2/packages/information.json`、`profiles/**`、`temp/**`、`library/**`、`build/**`，Web 版与 `hulebu-demo`、prototype、数据库、账号、共享山体生成器、非 Cocos 配置测试及其他模块
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run game:hulebu:build`; 干净 worktree 同命令；`git diff --check`
- 备注：T242 的产物清单只记录 `HEAD`，未阻止脏 Cocos 输入。本任务先把已经能独立构建的正式 Cocos 增量收口，并补构建输入门禁；`information.json` 不在本任务提交范围内，但因 Creator 可能读取，门禁仍会要求它 clean。GameSession 顺延为 T244。
