# T174：胡了卜账号进度续层

- 任务编号：T174
- 领取人：Lee
- 领取时间：2026-06-15
- 状态：待验收
- 预计完成：2026-06-15
- 允许修改文件：`apps/web/prisma/schema.prisma`, `apps/web/src/lib/account/**`, `apps/web/src/lib/auth/**`, `apps/web/src/app/api/games/hulebu/**`, `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T174-hulebu-account-progress-sync.md`, `docs/tasks/claims/T174-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-15-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `apps/web/src/modules/tools/**`, `apps/web/src/lib/ai/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w apps/web -- hulebu`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`; 浏览器桌面端和 390px 移动端检查 `/games/hulebu`
- 当前阻塞：无
- 备注：本轮只做登录账号下的长期进度续层，优先同步无尽最高层、高阶解锁、每日最佳和成就；未登录用户继续走本地存档。
