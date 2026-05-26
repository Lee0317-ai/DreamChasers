# T047：胡了卜 MVP 10 关和 10 奖励配置草案

- 优先级：P1
- 负责人：Codex / 开发 B
- 状态：已完成
- 背景：T046 已完成 5 个验证场景和 8 个奖励，下一步需要扩展到 MVP 冻结线中的 10 关和 10 个奖励。
- 目标：扩展胡了卜关卡和奖励配置，形成可供后续 Cocos/GDevelop/Web 表现层接入的 10 关 MVP 内容草案。
- 不做：不创建 Cocos/GDevelop 工程，不修改 `packages/shared/**`，不接站内游戏路由，不做最终 20 关、无尽、每日、排行榜和完整数值平衡。
- 依赖：T046
- 允许修改文件：`apps/game/mahjong-roguelike/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T047-hulebu-mvp-content-configs.md`, `docs/tasks/claims/T047-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `packages/shared/**`, `apps/web/src/components/portal-data.ts`, `package.json`, `package-lock.json`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`
- 验证命令：`node --input-type=module -e "import fs from 'node:fs'; const levels=JSON.parse(fs.readFileSync('apps/game/mahjong-roguelike/config/levels.json','utf8')); const rewards=JSON.parse(fs.readFileSync('apps/game/mahjong-roguelike/config/rewards.json','utf8')); if (levels.levels.length !== 10) throw new Error('expected 10 levels'); if (rewards.rewards.length !== 10) throw new Error('expected 10 rewards'); const rewardIds=new Set(rewards.rewards.map(r=>r.id)); for (const level of levels.levels) { const tileIds=new Set(level.tiles.map(t=>t.id)); for (const id of level.initialSlotOrder) if (!tileIds.has(id)) throw new Error(level.id+' missing initial slot tile '+id); for (const tile of level.tiles) for (const blocker of tile.blockedBy) if (!tileIds.has(blocker)) throw new Error(level.id+' missing blocker '+blocker); for (const id of level.rewardPool) if (!rewardIds.has(id)) throw new Error(level.id+' missing reward '+id); } console.log('mvp configs ok')"`; `npm run docs:sync`; `git diff --check`
- 执行记录：
  - 已新增变更卡 `IDEA-20260523-06`。
  - 已新增领取分片 `docs/tasks/claims/T047-codex.md`。
  - 已将 `levels.json` 扩展到 10 个关卡。
  - 已将 `rewards.json` 扩展到 10 个局内奖励。
  - 已新增 `apps/game/mahjong-roguelike/docs/content-plan.md`。
  - 已更新模块 README、实施计划、进展、决策和交接说明。
- 完成摘要：已完成胡了卜 MVP 10 关和 10 奖励配置草案，后续可做配置加载验证或表现层原型。
