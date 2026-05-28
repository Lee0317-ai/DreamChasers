# T082：胡了卜模板注册表和参数系统实施计划

- 领取人：Lee
- 领取时间：2026-05-28
- 状态：待验收
- 预计完成：2026-05-28
- 允许修改文件：`AGENTS.md`, `docs/tasks/LOCAL_OWNER.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T082-hulebu-template-registry-plan.md`, `docs/tasks/claims/T082-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-05-28-hulebu-template-registry-parameter-system.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`packages/shared/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T079, T080, T081
- 验证命令：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T082-hulebu-template-registry-plan.md docs/tasks/claims/T082-lee.md docs/superpowers/plans/2026-05-28-hulebu-template-registry-parameter-system.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check`
- 当前阻塞：无
- 完成时间：2026-05-28
- 完成结果：已完成胡了卜模板注册表和参数系统实施计划；本任务未修改共享生成器代码、Cocos 工程或 Web 入口。
- 验证结果：`npm run docs:sync` 通过，已同步 49 个任务分片和 48 个领取分片；占位符扫描无匹配；`git diff --check` 通过。
- 下一步：进入后续实现任务，按计划重构 `packages/shared/src/mahjong-mountain-generator.ts` 的模板注册表和参数系统。
