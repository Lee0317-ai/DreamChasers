# T177：胡了卜 Boss 试炼第二版

- 任务编号：T177
- 领取人：Lee
- 领取时间：2026-06-16
- 状态：待验收
- 预计完成：2026-06-16
- 允许修改文件：`apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`, `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T177-hulebu-boss-trial-second-pass.md`, `docs/tasks/claims/T177-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/superpowers/specs/2026-06-16-hulebu-boss-trial-second-pass-design.md`, `docs/superpowers/plans/2026-06-16-hulebu-boss-trial-second-pass.md`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-16-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/levels.json`, `apps/game/mahjong-roguelike/config/rewards.json`, `apps/web/prisma/**`, `apps/web/src/app/account/**`, `apps/web/src/lib/ai/**`, `apps/web/src/modules/tools/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w apps/web -- hulebu`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `perl -0ne 'print $1 if /<script>([\\s\\S]*?)<\\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-inline.js && node --check /tmp/hulebu-config-playable-inline.js`; `perl -0ne 'print $1 if /<script>([\\s\\S]*?)<\\/script>/' apps/web/public/games/hulebu-demo/index.html > /tmp/hulebu-static-inline.js && node --check /tmp/hulebu-static-inline.js`; `npm run docs:sync`; `git diff --check`; 浏览器桌面端和 390px 移动端检查 `/games/hulebu`
- 当前阻塞：无
- 完成摘要：已完成 Web Boss 试炼第二版，包含 Boss 阶段目标池、普通/终局/高阶/无尽 Boss 变体、Boss 奖励品质、`bossReview` 结算 payload、外层 Boss 复盘卡片、静态 Demo 同步和测试覆盖。
- 备注：本轮聚焦 Web Boss 试炼第二版，不并入特殊事件池第二版、成就扩容、无尽/每日深度化、路线奖励/局外能力深化、Web 数值冻结或 Cocos 追平。
