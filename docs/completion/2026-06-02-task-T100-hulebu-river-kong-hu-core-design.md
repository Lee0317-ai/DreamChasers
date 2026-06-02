# T100 胡了卜有限牌河、补杠和胡牌奖励核心玩法设计完成记录

- 任务编号：T100
- 负责人：Lee
- 完成日期：2026-06-02
- 修改文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T100-hulebu-river-kong-hu-core-design.md`, `docs/tasks/claims/T100-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-02-hulebu-river-kong-hu-core-design.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`

## 实现内容

- 新增 T100 任务分片和领取分片，范围限定为玩法设计文档。
- 新增核心玩法规格，确认胡了卜后续采用 `有限牌河 + 明碰区 + 补杠孤张出口 + 明杠开山 + 胡牌强奖励 + 听牌提示 + 孤张预算生成器`。
- 明确补杠只做低收益孤张出口，不触发震山；明杠才触发震山开牌；胡牌作为最强局内奖励，清槽、强开山并处理牌河。
- 明确牌数规则采用副数上限加组合配方，不机械固定每张 4 张；生成器需要增加孤张预算和恢复路线校验。
- 同步模块决策、进展、README、HANDOFF 和当天进展。

## 验证命令

- `npm run docs:sync`
- `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T100-hulebu-river-kong-hu-core-design.md docs/tasks/claims/T100-lee.md docs/superpowers/specs/2026-06-02-hulebu-river-kong-hu-core-design.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/DECISIONS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`
- `git diff --check`

## 验证结果

- `npm run docs:sync` 通过，已同步 67 个任务分片和 66 个领取分片。
- 占位符扫描无命中。
- `git diff --check` 通过。

## 遗留问题

- T100 只完成玩法设计，不修改 HTML Demo。
- 后续建议拆 `有限牌河和丢弃选择 Demo 实现`、`补杠/明杠开山/胡牌奖励 Demo 实现` 两个实现任务。
