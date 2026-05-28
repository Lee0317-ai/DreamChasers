# T080：胡了卜 Graph-based 牌山生成器共享实现完成记录

- 任务编号：T080
- 负责人：Codex / 开发 B
- 修改文件：`packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `packages/shared/src/index.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T080-hulebu-graph-generator-shared-implementation.md`, `docs/tasks/claims/T080-codex.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 实现内容：新增共享层 Graph-based 牌山生成器第一版，包含 seed 稳定模板骨架、5% 遮挡图、理论解法路径、`碰 / 吃 / 杠 / 胡` 牌面分配、干扰节点、体验报告和后续 Cocos 可消费的 `levelTiles` 输出。
- 验证命令：`npm run test -w packages/shared -- mahjong-mountain-generator`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T080-hulebu-graph-generator-shared-implementation.md docs/tasks/claims/T080-codex.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check`
- 验证结果：`npm run test -w packages/shared -- mahjong-mountain-generator` 通过，1 个测试文件、4 个测试；`npm run typecheck -w packages/shared` 通过；`npm run docs:sync` 通过；占位符扫描无匹配；`git diff --check` 通过。
- 遗留问题：尚未接入 Cocos 默认关卡；后续需要基于 Cocos Web Preview 和手机视口试玩调节模板、干扰率、槽位压力和首关节奏。
