# T083：胡了卜模板注册表和 8 个核心模板共享实现

- 领取人：Lee
- 领取时间：2026-05-28
- 状态：待验收
- 预计完成：2026-05-28 起分阶段推进
- 允许修改文件：`packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `packages/shared/src/index.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T083-hulebu-template-registry-core-templates.md`, `docs/tasks/claims/T083-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/config/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T079, T080, T081, T082
- 验证命令：`npm run test -w packages/shared -- mahjong-mountain-generator`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T083-hulebu-template-registry-core-templates.md docs/tasks/claims/T083-lee.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check`
- 当前阻塞：无
- 完成时间：2026-05-28
- 完成结果：已完成共享层模板注册表、参数归一化、参数边界、8 个核心模板、通用校验器和 ExperienceReport 扩展；未修改 Cocos/Web。
- 验证结果：`npm run test -w packages/shared -- mahjong-mountain-generator` 通过，1 个测试文件、15 个测试；`npm run typecheck -w packages/shared` 通过；`npm run docs:sync` 通过，已同步 50 个任务分片和 49 个领取分片；占位符扫描无匹配；`git diff --check` 通过。
- 下一步：另起接入任务，将 Graph-based `levelTiles` 转成现有 Cocos 关卡配置并做手机视口目检。
