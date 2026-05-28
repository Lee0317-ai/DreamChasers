# T077：胡了卜 Cocos 随机堆叠牌山恢复

- 领取人：Codex / 开发 B
- 领取时间：2026-05-27
- 状态：待验收
- 预计完成：2026-05-27
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T077-hulebu-cocos-random-stacked-mountain.md`, `docs/tasks/claims/T077-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T050, T059, T076
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`; Cocos Web Preview 手机视口目检随机牌山密度和堆叠提示
- 当前阻塞：无
- 完成时间：2026-05-27 12:45 CST
- 结果：已恢复 Cocos 默认随机堆叠牌山，首关 42 张起步并保留最小通关闭环；已加入堆叠横条提示和回归测试，避免默认关再次退化为 6 张流程关。
- 验证结果：已通过 `npm run test -w packages/shared -- mahjong-cocos-project`、`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json` 和 Cocos Web Preview 手机视口目检。
- 下一步：继续补奖励效果真正落地、Boss 目标进度、槽位同款图片和最终 Tile prefab。
