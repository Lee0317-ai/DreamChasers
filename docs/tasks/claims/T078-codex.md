# T078：胡了卜 Cocos 牌山铺开和遮挡点击一致性

- 领取人：Codex / 开发 B
- 领取时间：2026-05-27
- 状态：待验收
- 预计完成：2026-05-27
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T078-hulebu-cocos-spread-locking.md`, `docs/tasks/claims/T078-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T050, T059, T077
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`; Cocos Web Preview 手机视口目检牌山铺开和遮挡不可点
- 当前阻塞：无
- 完成时间：2026-05-28
- 完成结果：已扩大 Cocos 随机牌山生成跨度，补回跨列遮挡，并给同列多层牌加入轻微视觉错位；被上层牌盖住的下层牌不能入槽，移走 blocker 后恢复可选。
- 验证结果：`npm run test -w packages/shared -- mahjong-cocos-project` 通过，1 个测试文件、12 个测试；`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json` 通过；`npm run docs:sync` 通过。
- 返工记录：2026-05-27，验收反馈指出当前牌山接近平铺、难度不足；已重新打开 T078，补充跨列遮挡和初始可点数量约束。
- 返工记录：2026-05-28，继续根据反馈补足多牌堆叠视觉；新增同列上下层渲染错位测试，并在 runtime 输出阶段加层偏移。
- 下一步：请在 Cocos Web Preview 刷新后目检多层牌山是否有足够压住感；若仍偏平，再继续调层偏移和簇内密度。
