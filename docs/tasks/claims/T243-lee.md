# T243：胡了卜 Cocos 正式源码基线与构建溯源门禁

- 任务编号：T243
- 任务名称：胡了卜 Cocos 正式源码基线与构建溯源门禁
- 领取人：Lee
- 状态：已完成
- 领取时间：2026-07-12
- 完成时间：2026-07-15
- 允许修改文件：Cocos `assets/scripts/**` 中当前正式运行时增量、`assets/resources/ui/v6.meta`、`assets/resources/ui/v6/**`、`apps/game/mahjong-roguelike/release/hulebu-v1.release.json`、`apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs`、`apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs`、`packages/shared/src/hulebu-cocos-release.test.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、`docs/superpowers/plans/2026-07-12-hulebu-cocos-source-baseline.md`、`docs/tasks/items/T243-hulebu-cocos-source-baseline.md`、本领取分片及对应进展/完成/模块交接文档
- 禁止修改：Cocos `settings/v2/packages/information.json`、`profiles/**`、`temp/**`、`library/**`、`build/**`，Web 版与 `hulebu-demo`、prototype、数据库、账号、共享山体生成器、非 Cocos 配置测试及其他模块
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; 根工作区 `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run game:hulebu:build`（精确 Creator 快照内建 Cocos TypeScript 检查）；干净 worktree运行 build 与 verify-only；`git diff --check`
- 备注：T242 的产物清单只记录 `HEAD`，未阻止脏 Cocos 输入。本任务先把已经能独立构建的正式 Cocos 增量收口，并补构建输入门禁；`information.json` 不在本任务提交范围内，但因 Creator 可能读取，门禁仍会要求它 clean。GameSession 顺延为 T244。
- 完成说明：已提交正式 Cocos 源码 checkpoint 和构建溯源门禁；production build 只读取受保护的精确提交快照，manifest 绑定源码摘要、完整 Creator app bundle、内建 TypeScript 和产物证据，并通过 journal、原子 owner marker、可重试 tombstone 与锁处理同步失败及进程崩溃恢复。
- 验证结果：干净 worktree 发布测试 `189/189`、Cocos 工程测试 `32/32`、真实 Creator 3.8.8 build、verify-only、5 条 HTTP smoke 和 `git diff --check` 均通过；最终 manifest 对应源码提交 `f2f69913b8aa749590461bb3a11f815491ec83e3`。
