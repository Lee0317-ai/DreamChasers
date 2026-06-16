# T176：胡了卜高阶周目完整版

- 任务编号：T176
- 领取人：Lee
- 领取时间：2026-06-16
- 状态：待验收
- 预计完成：2026-06-16
- 允许修改文件：`apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`, `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T176-hulebu-full-ascension.md`, `docs/tasks/claims/T176-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/superpowers/specs/2026-06-16-hulebu-full-ascension-design.md`, `docs/superpowers/plans/2026-06-16-hulebu-full-ascension.md`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-16-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/levels.json`, `apps/game/mahjong-roguelike/config/rewards.json`, `apps/web/prisma/**`, `apps/web/src/app/account/**`, `apps/web/src/lib/ai/**`, `apps/web/src/modules/tools/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w apps/web -- hulebu`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `perl -0ne 'print $1 if /<script>([\\s\\S]*?)<\\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-inline.js && node --check /tmp/hulebu-config-playable-inline.js`; `perl -0ne 'print $1 if /<script>([\\s\\S]*?)<\\/script>/' apps/web/public/games/hulebu-demo/index.html > /tmp/hulebu-static-inline.js && node --check /tmp/hulebu-static-inline.js`; `npm run docs:sync`; `git diff --check`; 浏览器桌面端和 390px 移动端检查 `/games/hulebu`
- 当前阻塞：无
- 完成摘要：已完成 Web 高阶周目完整版第一大块，包含四档高阶入口、局外高阶配置、内层高阶能力、专属奖励/档位事件、构筑识别、失败复盘、结算复盘、静态 Demo 同步和测试覆盖。
- 备注：本轮聚焦 Web 高阶周目完整版，不并入 Boss 第二版、事件池第二版或 Cocos 追平。
