# T179：胡了卜成就图鉴扩容

- 任务编号：T179
- 领取人：Lee
- 领取时间：2026-06-16
- 状态：待验收
- 预计完成：2026-06-16
- 允许修改文件：`apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`, `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T179-hulebu-achievement-codex-expansion.md`, `docs/tasks/claims/T179-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/superpowers/specs/2026-06-16-hulebu-achievement-codex-expansion-design.md`, `docs/superpowers/plans/2026-06-16-hulebu-achievement-codex-expansion.md`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-16-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/**`, `apps/web/public/games/hulebu-demo/**`, `packages/shared/**`, `apps/web/prisma/**`, `apps/web/src/app/account/**`, `apps/web/src/lib/ai/**`, `apps/web/src/modules/tools/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w apps/web -- hulebu`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T179-hulebu-achievement-codex-expansion.md docs/tasks/claims/T179-lee.md docs/superpowers/specs/2026-06-16-hulebu-achievement-codex-expansion-design.md docs/superpowers/plans/2026-06-16-hulebu-achievement-codex-expansion.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-16-lee.md docs/completion/2026-06-16-task-179-hulebu-achievement-codex-expansion.md`; `git diff --check`; 浏览器桌面端和 390px 移动端检查 `/games/hulebu`
- 当前阻塞：无
- 完成摘要：已完成图鉴第二版第一轮扩容，补上分类摘要、隐藏目标和 Boss/事件/高阶/路线成就，等待最终验收。
- 备注：本轮只改 `/games/hulebu` web 壳层及对应文档测试，不并入玩法规则、原型、Cocos 或数值冻结。
