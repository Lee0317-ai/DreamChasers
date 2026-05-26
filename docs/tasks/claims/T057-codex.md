# T057：胡了卜胡牌节奏配置和密集牌山胡牌包

- 领取人：Codex / 开发 B
- 领取时间：2026-05-25
- 状态：待验收
- 预计完成：2026-05-25
- 允许修改文件：`packages/shared/**`, `apps/game/mahjong-roguelike/config/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/docs/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T057-hulebu-hu-rhythm-config.md`, `docs/tasks/claims/T057-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-25.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T056
- 验证命令：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /private/tmp/hulebu-config-playable-script.js`; 浏览器桌面端检查第 6 关配置模式和密集牌山模式；浏览器 390px 移动端检查；`npm run docs:sync`; `git diff --check`
- 当前风险：胡牌包如果生成得太稳定，会让玩家只等 `胡` 而忽视吃碰杠；本任务只做可控出现率的第一版钩子，具体频率仍需人工试玩调参。
- 完成说明：已完成 `featuredCombos` 配置契约、第 6/10 关 `胡` 重点标记、试玩页重点展示、密集牌山 `3 + 3 + 2` 胡牌包和 5% 遮挡口径对齐。
- 备注：本任务不改变 T056 的 `3 + 3 + 2` 轻量胡牌定义，也不把备用槽纳入胡牌判定。
