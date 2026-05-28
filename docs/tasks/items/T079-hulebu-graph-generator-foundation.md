# T079：胡了卜 Graph-based 牌山生成器地基设计

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：T077-T078 已把 Cocos 默认关卡恢复为随机堆叠牌山，并修正铺开、跨列遮挡和 5% 遮挡不可点。但当前生成方式仍以“随机柱子 -> 顶层顺序发牌 -> 计算 blocker”为主，缺少解法路径意识，难度更多来自随机碰撞，不够像“羊了个羊式关卡设计”。
- 目标：先不改 Cocos 表现层，完成胡了卜底层牌山生成器的设计和实施计划，明确后续应以“牌山骨架图 + 可解路径生成 + 牌面发牌 + 难度评估器”为地基。
- 不做：不修改 Cocos 工程代码、不替换当前 Cocos 关卡配置、不生成新美术、不做奖励效果、Boss 目标 UI、动画音效、发布包、Web 站点接入或完整实现代码。
- 依赖：T050, T059, T077, T078
- 主要文件范围：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T079-hulebu-graph-generator-foundation.md`, `docs/tasks/claims/T079-codex.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-05-28-hulebu-mountain-generator-foundation-design.md`, `docs/superpowers/plans/2026-05-28-hulebu-mountain-generator-foundation.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/web/**`, `apps/web/prisma/**`, `packages/shared/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run docs:sync`; 文档自审；`rg -n "TBD|TODO|待补" docs/superpowers/specs/2026-05-28-hulebu-mountain-generator-foundation-design.md docs/superpowers/plans/2026-05-28-hulebu-mountain-generator-foundation.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check`
- 进展：
  - 2026-05-28：新增任务并领取；已确认原随机柱生成方式不是最优地基，后续应改为 Graph-based Generator：先生成阻挡关系图，再生成理论解法，再分配麻将牌面并评分。
  - 2026-05-28：已完成设计稿、模块地基说明和后续实施计划；本任务只锁定底层架构，不修改 Cocos 表现层。

- 验证结果：
  - `npm run docs:sync`：通过，已同步 46 个任务分片和 45 个领取分片。
  - `rg -n "TBD|TODO|待补" docs/superpowers/specs/2026-05-28-hulebu-mountain-generator-foundation-design.md docs/superpowers/plans/2026-05-28-hulebu-mountain-generator-foundation.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`：无匹配，目标文档没有占位符。
  - `git diff --check`：通过。

- 遗留问题：后续需要另起实现任务，把生成器落到 `packages/shared` 的引擎无关模块，并用 Vitest 校验骨架、解法、发牌和难度评分；Cocos 后续只消费生成结果。
