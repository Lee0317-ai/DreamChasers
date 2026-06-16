# T180：胡了卜无尽和每日深度化

- 任务编号：T180
- 领取人：Lee
- 领取时间：2026-06-16
- 状态：待验收
- 预计完成：2026-06-16
- 允许修改文件：`apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`, `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T180-hulebu-endless-daily-depth.md`, `docs/tasks/claims/T180-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/superpowers/specs/2026-06-16-hulebu-endless-daily-depth-design.md`, `docs/superpowers/plans/2026-06-16-hulebu-endless-daily-depth.md`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-16-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/levels.json`, `apps/game/mahjong-roguelike/config/rewards.json`, `apps/web/prisma/**`, `apps/web/src/app/account/**`, `apps/web/src/lib/ai/**`, `apps/web/src/modules/tools/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w apps/web -- hulebu`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `perl -0ne 'print $1 if /<script>([\\s\\S]*?)<\\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-inline.js && node --check /tmp/hulebu-config-playable-inline.js`; `perl -0ne 'print $1 if /<script>([\\s\\S]*?)<\\/script>/' apps/web/public/games/hulebu-demo/index.html > /tmp/hulebu-static-inline.js && node --check /tmp/hulebu-static-inline.js`; `npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T180-hulebu-endless-daily-depth.md docs/tasks/claims/T180-lee.md docs/superpowers/specs/2026-06-16-hulebu-endless-daily-depth-design.md docs/superpowers/plans/2026-06-16-hulebu-endless-daily-depth.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-16-lee.md docs/completion/2026-06-16-task-180-hulebu-endless-daily-depth.md`; `git diff --check`; 浏览器桌面端和 390px 移动端检查 `/games/hulebu`
- 当前阻塞：无
- 完成摘要：已完成无尽章节和每日深度第二版；原型新增章节 / 词缀 / 奖励 / 连续参与 payload，`/games/hulebu` 外层新增对应局外摘要和结算展示。
- 备注：本轮继续停留在 Web 完整版内容层，不并入路线奖励深化、局外能力深化或数值冻结。
