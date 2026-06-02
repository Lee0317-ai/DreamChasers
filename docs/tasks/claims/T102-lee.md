# T102：胡了卜 Demo 站内网页小游戏发布接入

- 领取人：Lee
- 领取时间：2026-06-02
- 状态：待验收
- 预计完成：2026-06-02
- 允许修改文件：`apps/web/src/app/games/hulebu/page.tsx`, `apps/web/src/modules/games/hulebu/**`, `apps/web/public/games/hulebu-demo/**`, `apps/web/src/components/portal-data.ts`, `apps/web/src/components/AppHeader.tsx`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T102-hulebu-web-game-publish.md`, `docs/tasks/claims/T102-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `apps/web/src/app/tools/**`, `apps/web/src/modules/tools/**`, `apps/web/src/components/tools/**`, `apps/web/src/lib/ai/**`, `apps/web/src/lib/analytics/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T025, T093, T101
- 验证命令：`npm run test -w apps/web -- hulebu`; `npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开 `/games/hulebu` 检查桌面和移动端 iframe 可玩、无横向溢出；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T102-hulebu-web-game-publish.md docs/tasks/claims/T102-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`; `git diff --check`
- 当前阻塞：无。
- 下一步：等待 Lee 打开 `/games/hulebu` 做发布前试玩确认；若手感通过，可进入站点正式发布/部署流程。
