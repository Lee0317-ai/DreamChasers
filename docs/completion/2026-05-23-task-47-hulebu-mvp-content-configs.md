# T047 完成记录：胡了卜 MVP 10 关和 10 奖励配置草案

- 任务编号：T047
- 任务名称：胡了卜 MVP 10 关和 10 奖励配置草案
- 负责人：Codex / 开发 B
- 完成时间：2026-05-23

## 修改文件

- `apps/game/mahjong-roguelike/config/levels.json`
- `apps/game/mahjong-roguelike/config/rewards.json`
- `apps/game/mahjong-roguelike/README.md`
- `apps/game/mahjong-roguelike/docs/rules.md`
- `apps/game/mahjong-roguelike/docs/content-plan.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/DECISIONS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T047-hulebu-mvp-content-configs.md`
- `docs/tasks/claims/T047-codex.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/2026-05-23.md`

## 实现内容

- 将胡了卜关卡配置从 5 个验证关扩展到 10 个 MVP 草案关卡。
- 追加 5 个主线关卡草案：三门初会、留杠一手、连吃试手、看余牌、小胡收官。
- 将局内奖励从 8 个扩展到 10 个，新增 `peng_score_plus_10` 和 `shuffle_plus_1`。
- 新增内容曲线说明，明确 10 关和 10 奖励只是 MVP 草案，后续仍需表现层试玩调参。

## 验证命令

- `node --input-type=module -e "import fs from 'node:fs'; const levels=JSON.parse(fs.readFileSync('apps/game/mahjong-roguelike/config/levels.json','utf8')); const rewards=JSON.parse(fs.readFileSync('apps/game/mahjong-roguelike/config/rewards.json','utf8')); if (levels.levels.length !== 10) throw new Error('expected 10 levels'); if (rewards.rewards.length !== 10) throw new Error('expected 10 rewards'); const rewardIds=new Set(rewards.rewards.map(r=>r.id)); for (const level of levels.levels) { const tileIds=new Set(level.tiles.map(t=>t.id)); for (const id of level.initialSlotOrder) if (!tileIds.has(id)) throw new Error(level.id+' missing initial slot tile '+id); for (const id of level.initialReserveOrder) if (!tileIds.has(id)) throw new Error(level.id+' missing reserve tile '+id); for (const tile of level.tiles) for (const blocker of tile.blockedBy) if (!tileIds.has(blocker)) throw new Error(level.id+' missing blocker '+blocker); for (const id of level.rewardPool) if (!rewardIds.has(id)) throw new Error(level.id+' missing reward '+id); } console.log('mvp configs ok')"`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- MVP 配置数量和引用检查：通过。
- `npm run docs:sync`：通过。
- `git diff --check`：通过。

## 遗留问题

- 10 关仍是 MVP 草案，不代表最终难度曲线。
- 尚未实现 Cocos/GDevelop 表现层配置加载。
- 尚未接 Web 站内试玩入口。
