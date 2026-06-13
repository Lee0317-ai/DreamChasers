# T162：胡了卜残局收官和悬台窄腰高压池

- 任务编号：T162
- 领取人：Lee
- 领取时间：2026-06-12
- 状态：已完成
- 预计完成：2026-06-13
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config.test.ts`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T162-hulebu-endgame-settlement-demo.md`, `docs/tasks/claims/T162-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-13-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `apps/web/src/app/account/**`, `apps/web/src/lib/ai/**`, `apps/web/src/modules/tools/**`, `apps/web/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; HTML 内联脚本 `node --check`; `npm run test -w apps/web -- hulebu`; `/games/hulebu` 桌面端浏览器检查；`/games/hulebu` 390px 移动端浏览器检查；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：待 Lee 试玩验收残局牌引节奏；高阶词缀、随机事件和 Boss 试炼另开任务规划。
