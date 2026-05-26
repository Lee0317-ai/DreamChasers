# T055：胡了卜加入字牌基础支持

- 领取人：Codex / 开发 B
- 领取时间：2026-05-24
- 状态：待验收
- 预计完成：2026-05-24
- 允许修改文件：`packages/shared/**`, `apps/game/mahjong-roguelike/config/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T055-hulebu-honor-tiles.md`, `docs/tasks/claims/T055-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T054
- 验证命令：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /tmp/hulebu-prototype-script.js`; 原型 VM 检查字牌渲染和候选；`npm run docs:sync`; `git diff --check`
- 当前风险：字牌已进入基础牌池和密集牌山原型，但本次不做完整 20 关重平衡；后续需要单独调整字牌出现比例、Boss 目标和奖励流派。
- 备注：用户称为“花牌”，实现口径按麻将常用分类处理为字牌：风牌 `东南西北` 和箭牌 `中发白`。
