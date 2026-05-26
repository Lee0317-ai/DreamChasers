# T047：胡了卜 MVP 10 关和 10 奖励配置草案

- 领取人：Codex / 开发 B
- 领取时间：2026-05-23
- 状态：已完成
- 预计完成：2026-05-23
- 允许修改文件：`apps/game/mahjong-roguelike/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T047-hulebu-mvp-content-configs.md`, `docs/tasks/claims/T047-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `packages/shared/**`, `apps/web/src/components/portal-data.ts`, `package.json`, `package-lock.json`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`
- 依赖任务：T046
- 验证命令：`node --input-type=module -e "import fs from 'node:fs'; const levels=JSON.parse(fs.readFileSync('apps/game/mahjong-roguelike/config/levels.json','utf8')); const rewards=JSON.parse(fs.readFileSync('apps/game/mahjong-roguelike/config/rewards.json','utf8')); if (levels.levels.length !== 10) throw new Error('expected 10 levels'); if (rewards.rewards.length !== 10) throw new Error('expected 10 rewards'); const rewardIds=new Set(rewards.rewards.map(r=>r.id)); for (const level of levels.levels) { const tileIds=new Set(level.tiles.map(t=>t.id)); for (const id of level.initialSlotOrder) if (!tileIds.has(id)) throw new Error(level.id+' missing initial slot tile '+id); for (const tile of level.tiles) for (const blocker of tile.blockedBy) if (!tileIds.has(blocker)) throw new Error(level.id+' missing blocker '+blocker); for (const id of level.rewardPool) if (!rewardIds.has(id)) throw new Error(level.id+' missing reward '+id); } console.log('mvp configs ok')"`; `npm run docs:sync`; `git diff --check`
- 当前风险：10 关仍是 MVP 草案，不代表最终难度曲线；后续需要通过表现层试玩继续调参。
- 备注：已扩展 T046 配置到 10 关和 10 个奖励，未进入表现层实现。
