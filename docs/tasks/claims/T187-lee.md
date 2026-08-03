# T187：胡了卜刷新后继续当前本轮

- 任务编号：T187
- 领取人：Lee
- 领取时间：2026-06-26
- 状态：待验收
- 预计完成：2026-06-26
- 允许修改文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T187-hulebu-resume-active-run.md`, `docs/tasks/claims/T187-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/superpowers/specs/2026-06-26-hulebu-resume-active-run-design.md`, `docs/superpowers/plans/2026-06-26-hulebu-resume-active-run.md`, `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-26-lee.md`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/app/api/games/hulebu/**`, `apps/web/src/lib/account/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/web/src/lib/ai/**`, `apps/web/src/modules/tools/**`, `deploy/**`
- 验证命令：`npm run test -w apps/web -- hulebu`; `npm run test -w packages/shared -- mahjong-config-playable-prototype`; 源原型与站内静态副本内联脚本 `node --check`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T187-hulebu-resume-active-run.md docs/tasks/claims/T187-lee.md docs/superpowers/specs/2026-06-26-hulebu-resume-active-run-design.md docs/superpowers/plans/2026-06-26-hulebu-resume-active-run.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-26-lee.md`; `git diff --check`
- 当前阻塞：无
- 完成摘要：已实现刷新后继续当前本轮。外层会把未完成 `activeRun` 写入本地 shell 状态，刷新后重建 iframe 地址；主线、每日、高阶恢复到当前关开局，无尽恢复到当前层开局。第一版不恢复中局牌桌、卡槽、牌河或事件弹窗。
