# T083：胡了卜模板注册表和 8 个核心模板共享实现

- 优先级：P1
- 默认负责人：Lee
- 状态：待验收
- 背景：T080 已完成 Graph-based 牌山生成器第一版，T081 已确认地图模板语法系统，T082 已完成模板注册表和参数系统实施计划。当前生成器仍只支持 `center-tower` 和 `two-wings` 两个模板分支，后续需要把模板能力落到共享层，避免继续堆临时 `if templateId === ...` 分支。
- 目标：在 `packages/shared` 中实现模板 definition、模板注册表、参数默认值、参数边界、参数归一化、通用校验器和 ExperienceReport 模板字段；保留现有 `center-tower` / `two-wings` 行为，并落地第一期 8 个核心模板：`center-tower`、`two-wings`、`cross`、`ring`、`long-wall`、`islands`、`canyon`、`staircase`。
- 不做：不修改 Cocos 工程、不替换当前 Cocos 默认关卡、不做 Web 接入、不做调参面板、不生成新美术、不做奖励效果、Boss 目标 UI、动画音效或发布包。
- 依赖：T079, T080, T081, T082
- 主要文件范围：`packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `packages/shared/src/index.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T083-hulebu-template-registry-core-templates.md`, `docs/tasks/claims/T083-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/config/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run test -w packages/shared -- mahjong-mountain-generator`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T083-hulebu-template-registry-core-templates.md docs/tasks/claims/T083-lee.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check`
- 进展：
  - 2026-05-28：新增任务并领取；实现范围锁定为共享层生成器、测试和模块文档，不改 Cocos/Web。
  - 2026-05-28：已完成模板注册表、参数归一化、参数边界、8 个核心模板、通用校验器和 ExperienceReport 扩展；保留现有理论解法、发牌、5% 遮挡图和 `levelTiles` 输出。

- 验证结果：
  - `npm run test -w packages/shared -- mahjong-mountain-generator`：通过，1 个测试文件、15 个测试。
  - `npm run typecheck -w packages/shared`：通过。
  - `npm run docs:sync`：通过，已同步 50 个任务分片和 49 个领取分片。
  - `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T083-hulebu-template-registry-core-templates.md docs/tasks/claims/T083-lee.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`：无匹配。
  - `git diff --check`：通过。

- 遗留问题：Cocos 默认关卡尚未消费 Graph-based 生成器输出，后续需要另起接入任务。
