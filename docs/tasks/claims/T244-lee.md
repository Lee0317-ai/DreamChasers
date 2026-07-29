# T244：胡了卜 Cocos v1 M1 核心边界与状态机

- 任务编号：T244
- 任务名称：胡了卜 Cocos v1 M1 核心边界与状态机
- 领取人：Lee
- 状态：待验收
- 领取时间：2026-07-15
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/domain/**`、`assets/scripts/application/**`、`assets/scripts/content/**`、`assets/scripts/persistence/**`、`assets/scripts/GameSceneController.ts` 的最小 Coordinator 接线、必要的 `assets/scripts/runtime/HulebuRuntimeState.ts` 适配、`tsconfig.domain.json`、对应 `.meta`、`packages/shared/src/hulebu-cocos-domain.test.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、`docs/superpowers/plans/2026-07-15-hulebu-cocos-v1-m1-core-architecture.md`、本任务/领取分片和对应进展/完成/模块交接文档
- 禁止修改：Cocos Binder、`assets/resources/**`、`HulebuMountainGenerator.ts`、Web/demo/prototype、正式内容数值、UI、音效、账号/数据库、production release 配置与构建脚本、Cocos 本机状态/缓存和其他模块
- 验证命令：`npm run test -w packages/shared -- hulebu-cocos-domain mahjong-cocos-project`; `npx tsc -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.domain.json`; 干净 worktree `npm run game:hulebu:build`; `npm run game:hulebu:verify-build`; production 包 `390×844` 竖屏完整交互 smoke；`git diff --check`
- 当前阻塞：无。Lee 已确认正式发布方向按微信小程序常见竖屏验收，横屏不属于当前目标。
- 并发说明：T239/T240 的 Cocos 结果已由 T243 checkpoint 纳入正式基线；T244 不修改其牌山生成器和 Binder 范围，只在当前已提交 Controller 基线上做架构接线。若工作区出现新的同文件改动，先对比并保留，再继续迁移。
- 下一步：在可访问本地 production 包的浏览器会话中补完 `390×844` 组合、多候选 exact choice 与一次清关 smoke；继续不修改 Binder/UI/资源。
