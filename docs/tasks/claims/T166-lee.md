# T166：胡了卜 20 关完整主线 Demo

- 任务编号：T166
- 领取人：Lee
- 领取时间：2026-06-13
- 状态：待验收
- 预计完成：2026-06-13
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config.test.ts`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T166-hulebu-20-level-mainline-demo.md`, `docs/tasks/claims/T166-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/superpowers/specs/2026-06-13-hulebu-20-level-mainline-demo-design.md`, `docs/superpowers/plans/2026-06-13-hulebu-20-level-mainline-demo.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-13-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `apps/web/src/app/account/**`, `apps/web/src/lib/ai/**`, `apps/web/src/modules/tools/**`, `apps/web/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `npm run test -w apps/web -- hulebu`; `node --check /tmp/hulebu-config-playable-inline.js`; `node --check /tmp/hulebu-static-inline.js`; `npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T166-hulebu-20-level-mainline-demo.md docs/tasks/claims/T166-lee.md docs/superpowers/specs/2026-06-13-hulebu-20-level-mainline-demo-design.md docs/superpowers/plans/2026-06-13-hulebu-20-level-mainline-demo.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-13-lee.md docs/completion/2026-06-14-task-166-hulebu-20-level-mainline-demo.md`; `git diff --check`; 浏览器桌面端和 390px 移动端检查 `/games/hulebu`
- 当前阻塞：无
- 完成时间：2026-06-14
- 完成说明：已完成默认站内 Demo 的 20 关主线开放、第 11-19 关后半段难度 profile、第 20 关 `胡了卜王` 终章 Boss、奖励节点扩展、静态 Demo 同步，以及 390px 移动端固定道具栏遮挡修复。
