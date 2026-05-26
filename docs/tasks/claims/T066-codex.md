# T066：胡了卜 Cocos 真实可见尺寸自适应

- 领取人：Codex / 开发 B
- 领取时间：2026-05-26
- 状态：已完成
- 预计完成：2026-05-26
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T066-hulebu-cocos-visible-size-layout.md`, `docs/tasks/claims/T066-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-26.md`, `docs/completion/2026-05-26-task-T066-hulebu-cocos-visible-size-layout.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T065
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 完成时间：2026-05-26
- 完成结果：Cocos 首屏已改为按运行时可见尺寸自适应，iPhone 预览中 HUD、牌山、组合按钮和 8 格主槽已回到手机首屏可读位置；已处理 Cocos 资产缓存导致的 `Missing class` 预览问题。
- 下一步：新开任务做正式目标图 UI 壳，接绿色牌桌、顶部牌匾、右侧工具和木质 8 格槽，随后接真实配置和点击入槽链路。
