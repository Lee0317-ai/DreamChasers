# T080：胡了卜 Graph-based 牌山生成器共享实现

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：T079 已完成方案评估，确认当前 Cocos 随机柱式牌山不适合作为长期地基。用户已确认可以进入下一步，但要求先不改 Cocos，先把底层生成器地基搭建好，并将体验优化纳入第一版评估输出。
- 目标：在 `packages/shared` 中新增引擎无关的 Graph-based 牌山生成器第一版，支持牌山骨架图、5% 遮挡关系、理论解法路径、组合牌面分配、难度评分和体验报告，并输出后续 Cocos 可消费的 `levelTiles` 数据。
- 不做：不修改 Cocos 工程、不替换当前 Cocos 默认关卡、不做 Web 接入、不做调参面板、不生成新美术、不做奖励效果、Boss 目标 UI、动画音效或发布包。
- 依赖：T050, T059, T077, T078, T079
- 主要文件范围：`packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `packages/shared/src/index.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T080-hulebu-graph-generator-shared-implementation.md`, `docs/tasks/claims/T080-codex.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run test -w packages/shared -- mahjong-mountain-generator`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T080-hulebu-graph-generator-shared-implementation.md docs/tasks/claims/T080-codex.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check`
- 进展：
  - 2026-05-28：新增任务并领取；实现范围锁定为共享层生成器和体验报告，不改 Cocos 表现层。
  - 2026-05-28：已在 `packages/shared` 新增 Graph-based 牌山生成器第一版，包含 5% 遮挡图、模板骨架、理论解法、组合发牌、干扰节点和体验报告；已从共享入口导出，后续 Cocos 可消费 `levelTiles`。

- 验证结果：
  - `npm run test -w packages/shared -- mahjong-mountain-generator`：通过，1 个测试文件、4 个测试。
  - `npm run typecheck -w packages/shared`：通过。
  - `npm run docs:sync`：通过，已同步 47 个任务分片和 46 个领取分片。
  - `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T080-hulebu-graph-generator-shared-implementation.md docs/tasks/claims/T080-codex.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`：无匹配。
  - `git diff --check`：通过。

- 遗留问题：后续仍需另起任务把共享生成结果接回 Cocos 默认关卡，并基于真实游玩调参。
