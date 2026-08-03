# T188：胡了卜账号级当前本轮存档

- 任务编号：T188
- 领取人：Lee
- 领取时间：2026-06-27
- 状态：待验收
- 预计完成：2026-06-27
- 允许修改文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T188-hulebu-account-active-run-save.md`, `docs/tasks/claims/T188-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/superpowers/specs/2026-06-27-hulebu-account-active-run-save-design.md`, `docs/superpowers/plans/2026-06-27-hulebu-account-active-run-save.md`, `apps/web/prisma/schema.prisma`, `apps/web/prisma/migrations/**`, `apps/web/src/lib/account/hulebu-progress.ts`, `apps/web/src/app/api/games/hulebu/progress/route.ts`, `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-27-lee.md`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `apps/web/src/lib/ai/**`, `apps/web/src/modules/tools/**`, `deploy/**`
- 验证命令：`npm exec prisma validate -w apps/web`; `npm run test -w apps/web -- hulebu`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T188-hulebu-account-active-run-save.md docs/tasks/claims/T188-lee.md docs/superpowers/specs/2026-06-27-hulebu-account-active-run-save-design.md docs/superpowers/plans/2026-06-27-hulebu-account-active-run-save.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-27-lee.md`; `git diff --check`
- 当前阻塞：无
- 完成摘要：已把 T187 的本地 `activeRun` 恢复快照同步到账号进度。登录用户的账号进度会读写 `activeRun`，前端初始同步会在本地和账号快照之间选择 `updatedAt` 更新的一份，登录后可跨浏览器/设备继续当前本轮。
