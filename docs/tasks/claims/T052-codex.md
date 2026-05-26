# T052：胡了卜 Boss 目标配置化

- 领取人：Codex / 开发 B
- 领取时间：2026-05-24
- 状态：待验收
- 预计完成：2026-05-24
- 允许修改文件：`apps/game/mahjong-roguelike/config/levels.json`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T052-hulebu-boss-goal-config.md`, `docs/tasks/claims/T052-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T050
- 验证命令：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /tmp/hulebu-prototype-script.js`; 浏览器桌面端检查；`npm run docs:sync`; `git diff --check`
- 当前风险：Boss 目标如果过强会让原型牌山变成硬性路线题，本次只做可配置和可完成性验证，不做最终数值平衡。
- 备注：已完成配置化多目标 Boss 第一版，第 10 关目标为 `吃 1 / 碰 1 / 杠 1 / 积分 80`；验证通过后可继续设计第 20 关 Boss 目标和词缀组合。
