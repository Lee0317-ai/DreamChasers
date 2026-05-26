# T053：胡了卜 Boss 牌型目标第一版

- 领取人：Codex / 开发 B
- 领取时间：2026-05-24
- 状态：待验收
- 预计完成：2026-05-24
- 允许修改文件：`apps/game/mahjong-roguelike/config/levels.json`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T053-hulebu-boss-pattern-goals.md`, `docs/tasks/claims/T053-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T052
- 验证命令：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /tmp/hulebu-prototype-script.js`; 原型 VM 检查第 10 关 Boss 目标；`npm run docs:sync`; `git diff --check`
- 当前风险：牌型目标如果直接做完整胡牌会扩大范围，本次只实现轻量花色集合目标，用来验证 Boss 目标系统的表达能力。
- 备注：已完成 `suit_set` 目标，第 10 关现在要求 `万 / 筒 / 条` 都至少完成 1 次组合。
