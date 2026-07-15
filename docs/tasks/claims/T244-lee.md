# T244：胡了卜 Cocos v1 M1 核心边界与状态机

- 任务编号：T244
- 任务名称：胡了卜 Cocos v1 M1 核心边界与状态机
- 领取人：Lee
- 状态：进行中
- 领取时间：2026-07-15
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain/**`、`assets/scripts/application/**`、`assets/scripts/content/**`、`assets/scripts/persistence/**`、`assets/scripts/GameSceneController.ts` 的最小 Coordinator 接线、必要的 `assets/scripts/runtime/HulebuRuntimeState.ts` 适配、对应 `.meta`、`packages/shared/src/hulebu-cocos-domain.test.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、`docs/superpowers/plans/2026-07-15-hulebu-cocos-v1-m1-core-architecture.md`、本任务/领取分片和对应进展/完成/模块交接文档
- 禁止修改：Cocos Binder、`assets/resources/**`、`HulebuMountainGenerator.ts`、Web/demo/prototype、正式内容数值、UI、音效、账号/数据库、production release 配置与构建脚本、Cocos 本机状态/缓存和其他模块
- 验证命令：`npm run test -w packages/shared -- hulebu-cocos-domain mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; 干净 worktree `npm run game:hulebu:build`; `npm run game:hulebu:verify-build`; `git diff --check`
- 当前阻塞：`git pull origin main` 已 fetch，但当前分支与 `main` 分叉且未配置 pull 策略；本任务不擅自 merge/rebase。根工作区还有其他任务的大量未提交改动，必须使用精确路径暂存并复核。
- 并发说明：T239/T240 的 Cocos 结果已由 T243 checkpoint 纳入正式基线；T244 不修改其牌山生成器和 Binder 范围，只在当前已提交 Controller 基线上做架构接线。若工作区出现新的同文件改动，先对比并保留，再继续迁移。
- 下一步：完成代码图审查和代码级计划，先写 GameSession/Coordinator 的失败测试，再实现最小唯一命令路径。
