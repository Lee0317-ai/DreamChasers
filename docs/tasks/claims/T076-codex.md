# T076：胡了卜 Cocos 通关提示和下一关流转

- 领取人：Codex / 开发 B
- 领取时间：2026-05-27
- 状态：待验收
- 预计完成：2026-05-27
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T076-hulebu-cocos-clear-level-flow.md`, `docs/tasks/claims/T076-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T072, T075
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`; Cocos Web Preview 手机视口手动检查清空牌山、通关提示和下一关入口
- 当前阻塞：无
- 完成时间：2026-05-27
- 完成内容：已补 Cocos 最小通关闭环和输入绑定：牌山清空后弹出通关 overlay，继续按钮进入下一关；奖励节点在继续时显示 3 个奖励选项，选择后进入下一关；20 关后显示本轮通关；牌、组合按钮和 overlay 按钮均绑定 Cocos `TOUCH_END` 与 `Button.EventType.CLICK`。
- 验证结果：已通过 `npm run test -w packages/shared -- mahjong-cocos-project`；已通过 `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`；Cocos Web Preview 手机视口已目检到第 1 关清空后出现“第 1 关通关”弹窗。
- 下一步：继续补奖励效果真正落地、Boss 目标进度、关卡 HUD 动态进度和槽位同款图片。
