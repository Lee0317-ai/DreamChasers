# T175：胡了卜网页版完整版路线重排和缺口拆分

- 任务编号：T175
- 领取人：Lee
- 领取时间：2026-06-16
- 状态：待验收
- 预计完成：2026-06-16
- 允许修改文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T175-hulebu-web-full-version-roadmap.md`, `docs/tasks/claims/T175-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/superpowers/specs/2026-06-16-hulebu-web-full-version-roadmap-design.md`, `docs/superpowers/plans/2026-06-16-hulebu-web-full-version-roadmap.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/progress/2026-06-16-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/**`, `packages/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `apps/web/src/modules/games/hulebu/**`, `apps/web/prisma/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T175-hulebu-web-full-version-roadmap.md docs/tasks/claims/T175-lee.md docs/superpowers/specs/2026-06-16-hulebu-web-full-version-roadmap-design.md docs/superpowers/plans/2026-06-16-hulebu-web-full-version-roadmap.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md docs/modules/mahjong-roguelike/DECISIONS.md docs/progress/2026-06-16-lee.md docs/completion/2026-06-16-task-175-hulebu-web-full-version-roadmap.md`; `git diff --check`
- 当前阻塞：无
- 备注：本轮只做路线重排和缺口拆分，不改 Web Demo、Cocos 工程、共享包、账号数据库或音画资源。
