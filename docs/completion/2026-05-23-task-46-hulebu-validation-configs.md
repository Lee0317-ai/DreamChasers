# T046 完成记录：胡了卜验证场景配置草案

- 任务编号：T046
- 任务名称：胡了卜验证场景配置草案
- 负责人：Codex / 开发 B
- 完成时间：2026-05-23

## 修改文件

- `apps/game/mahjong-roguelike/README.md`
- `apps/game/mahjong-roguelike/docs/rules.md`
- `apps/game/mahjong-roguelike/config/tiles.json`
- `apps/game/mahjong-roguelike/config/levels.json`
- `apps/game/mahjong-roguelike/config/rewards.json`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/DECISIONS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T046-hulebu-validation-configs.md`
- `docs/tasks/claims/T046-codex.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/2026-05-23.md`

## 实现内容

- 新增胡了卜正式游戏目录的配置草案。
- 新增基础牌、花色、点数和组合类型定义。
- 将 T044 HTML demo 的 5 个验证场景转为 `levels.json`。
- 新增 8 个局内奖励配置，effect 类型与 `packages/shared/src/mahjong-game.ts` 对齐。
- 新增配置规则说明，明确后续表现层应读取配置并调用共享规则模型，不在表现层写死关卡逻辑。

## 验证命令

- `node -e "const fs=require('fs'); for (const f of ['apps/game/mahjong-roguelike/config/tiles.json','apps/game/mahjong-roguelike/config/levels.json','apps/game/mahjong-roguelike/config/rewards.json']) JSON.parse(fs.readFileSync(f, 'utf8')); console.log('configs ok')"`
- `node --input-type=module -e "import fs from 'node:fs'; const levels=JSON.parse(fs.readFileSync('apps/game/mahjong-roguelike/config/levels.json','utf8')); const rewards=JSON.parse(fs.readFileSync('apps/game/mahjong-roguelike/config/rewards.json','utf8')); const rewardIds=new Set(rewards.rewards.map(r=>r.id)); for (const level of levels.levels) { const tileIds=new Set(level.tiles.map(t=>t.id)); for (const id of level.initialSlotOrder) if (!tileIds.has(id)) throw new Error(level.id+' missing initial slot tile '+id); for (const id of level.initialReserveOrder) if (!tileIds.has(id)) throw new Error(level.id+' missing reserve tile '+id); for (const tile of level.tiles) for (const blocker of tile.blockedBy) if (!tileIds.has(blocker)) throw new Error(level.id+' missing blocker '+blocker); for (const id of level.rewardPool) if (!rewardIds.has(id)) throw new Error(level.id+' missing reward '+id); } console.log('references ok')"`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- JSON 解析检查：通过。
- 配置引用检查：通过。
- `npm run docs:sync`：通过。
- `git diff --check`：通过。

## 遗留问题

- 配置草案只覆盖 5 个验证场景，不等于最终 20 关。
- 尚未创建 Cocos/GDevelop 表现层，也尚未接 Web 站内试玩入口。
- 下一步建议扩展 MVP 主线 10 关和 10 个奖励草案，或先做配置加载验证。
