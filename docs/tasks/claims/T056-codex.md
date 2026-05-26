# T056：胡了卜固定 8 格主槽和胡牌基础支持

- 领取人：Codex / 开发 B
- 领取时间：2026-05-24
- 状态：待验收
- 预计完成：2026-05-24
- 允许修改文件：`packages/shared/**`, `apps/game/mahjong-roguelike/config/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T056-hulebu-fixed-eight-slot-hu.md`, `docs/tasks/claims/T056-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T055
- 验证命令：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /private/tmp/hulebu-config-playable-script.js`; 浏览器桌面端和 390px 移动端检查；`npm run docs:sync`; `git diff --check`
- 当前风险：主槽固定 8 会影响现有扩槽奖励和满槽救场节奏，本次先改主规则和原型，不做完整数值重平衡。
- 备注：备用槽继续定位为救场，不参与 `胡` 的 `3 + 3 + 2` 判定；当前实现已进入待验收，后续需要人工试玩确认 8 格压力是否合适。
