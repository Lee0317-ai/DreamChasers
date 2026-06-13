# T164：胡了卜 Boss 试炼 Demo 第一版

- 任务编号：T164
- 领取人：Lee
- 领取时间：2026-06-13
- 状态：已完成
- 预计完成：2026-06-13
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config.test.ts`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T164-hulebu-boss-trial-demo.md`, `docs/tasks/claims/T164-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/superpowers/specs/2026-06-13-hulebu-boss-trial-demo-design.md`, `docs/superpowers/plans/2026-06-13-hulebu-boss-trial-demo.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-13-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `apps/web/src/app/account/**`, `apps/web/src/lib/ai/**`, `apps/web/src/modules/tools/**`, `apps/web/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; HTML 内联脚本语法检查；`npm run test -w apps/web -- hulebu`; `/games/hulebu` 桌面端浏览器检查；`/games/hulebu` 390px 移动端浏览器检查；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 完成时间：2026-06-13
- 完成说明：已完成朋友试玩 Demo 第 10 关 `终局试炼` 第一版，包含 `杠 1 / 胡 1 / 积分 180` 目标、试炼 HUD、玩家页紧凑目标条、未达标失败提示、一次性 180 铜钱奖励、站内静态 Demo 同步和桌面/390px 移动端验证。
