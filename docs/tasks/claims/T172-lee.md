# T172：胡了卜成就图鉴第一版

- 任务编号：T172
- 领取人：Lee
- 领取时间：2026-06-15
- 状态：待验收
- 预计完成：2026-06-15
- 允许修改文件：`apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`, `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T172-hulebu-achievement-codex.md`, `docs/tasks/claims/T172-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/superpowers/specs/2026-06-15-hulebu-achievement-codex-design.md`, `docs/superpowers/plans/2026-06-15-hulebu-achievement-codex.md`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-15-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/levels.json`, `apps/game/mahjong-roguelike/config/rewards.json`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `apps/web/src/app/account/**`, `apps/web/src/lib/ai/**`, `apps/web/src/modules/tools/**`, `apps/web/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w apps/web -- hulebu`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `rg -n "T[B]D\\|T[O]DO\\|待[补]" docs/tasks/items/T172-hulebu-achievement-codex.md docs/tasks/claims/T172-lee.md docs/superpowers/specs/2026-06-15-hulebu-achievement-codex-design.md docs/superpowers/plans/2026-06-15-hulebu-achievement-codex.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-15-lee.md docs/completion/2026-06-15-task-172-hulebu-achievement-codex.md`; `git diff --check`; 浏览器桌面端和 390px 移动端检查 `/games/hulebu`
- 当前阻塞：无
- 备注：已完成本地成就图鉴第一版；`图鉴` 面板已接入 8 项本地成就，承接主线、无尽、每日和升级四类已有进度，等待验收。
