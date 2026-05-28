# T080：胡了卜 Graph-based 牌山生成器共享实现

- 领取人：Codex / 开发 B
- 领取时间：2026-05-28
- 状态：待验收
- 预计完成：2026-05-28
- 允许修改文件：`packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `packages/shared/src/index.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T080-hulebu-graph-generator-shared-implementation.md`, `docs/tasks/claims/T080-codex.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T050, T059, T077, T078, T079
- 验证命令：`npm run test -w packages/shared -- mahjong-mountain-generator`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T080-hulebu-graph-generator-shared-implementation.md docs/tasks/claims/T080-codex.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check`
- 当前阻塞：无
- 完成时间：2026-05-28
- 完成结果：已完成共享层 Graph-based 牌山生成器第一版，支持 seed 稳定模板骨架、5% 遮挡图、理论解法、碰吃杠胡牌面分配、干扰节点和体验报告；未修改 Cocos。
- 验证结果：`npm run test -w packages/shared -- mahjong-mountain-generator` 通过，1 个测试文件、4 个测试；`npm run typecheck -w packages/shared` 通过；`npm run docs:sync` 通过；占位符扫描无匹配；`git diff --check` 通过。
- 下一步：另起 Cocos 接入任务，将 `levelTiles` 转成现有 Cocos 关卡配置并用真机/预览调参。
