# T079：胡了卜 Graph-based 牌山生成器地基设计

- 领取人：Codex / 开发 B
- 领取时间：2026-05-28
- 状态：待验收
- 预计完成：2026-05-28
- 允许修改文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T079-hulebu-graph-generator-foundation.md`, `docs/tasks/claims/T079-codex.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-05-28-hulebu-mountain-generator-foundation-design.md`, `docs/superpowers/plans/2026-05-28-hulebu-mountain-generator-foundation.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/web/**`, `apps/web/prisma/**`, `packages/shared/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T050, T059, T077, T078
- 验证命令：`npm run docs:sync`; 文档自审；`rg -n "TBD|TODO|待补" docs/superpowers/specs/2026-05-28-hulebu-mountain-generator-foundation-design.md docs/superpowers/plans/2026-05-28-hulebu-mountain-generator-foundation.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check`
- 当前阻塞：无
- 完成时间：2026-05-28
- 完成结果：已完成胡了卜底层牌山生成器的 Graph-based 地基设计和实施计划，明确下一步不从 Cocos 表现层调参，而是先在共享逻辑层建立牌山骨架图、解法路径、牌面发牌和难度评估器。
- 验证结果：`npm run docs:sync` 通过，已同步 46 个任务分片和 45 个领取分片；占位符扫描无匹配；`git diff --check` 通过。
- 下一步：请先评审设计稿和实施计划；确认后另起实现任务，把生成器地基落到 `packages/shared`。
