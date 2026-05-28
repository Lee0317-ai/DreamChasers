# T082：胡了卜模板注册表和参数系统实施计划

- 优先级：P1
- 默认负责人：Lee
- 状态：待验收
- 背景：T081 已完成地图模板语法系统设计，并明确后续不能继续在生成器里追加临时 `if templateId === ...` 分支。T080 当前共享生成器已有 `center-tower` 和 `two-wings` 两个模板、理论解法、发牌和体验报告，但还没有模板注册表、参数边界和模板体验标签的实现计划。
- 目标：只写实施计划，不改生成器代码。计划需指导后续任务把 T080 生成器重构为模板注册表和参数系统，保留现有两模板行为，定义 schema、参数默认值、边界校验、体验标签、验证器、ExperienceReport 扩展策略，并给 T083 的 8 个核心模板实现留出接口。
- 不做：不修改 `packages/shared/**`、不修改 Cocos 工程、不替换当前 Cocos 默认关卡、不做 Web 接入、不做调参面板、不生成新美术、不做奖励效果、Boss 目标 UI、动画音效或发布包。
- 依赖：T079, T080, T081
- 主要文件范围：`AGENTS.md`, `docs/tasks/LOCAL_OWNER.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T082-hulebu-template-registry-plan.md`, `docs/tasks/claims/T082-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-05-28-hulebu-template-registry-parameter-system.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`packages/shared/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T082-hulebu-template-registry-plan.md docs/tasks/claims/T082-lee.md docs/superpowers/plans/2026-05-28-hulebu-template-registry-parameter-system.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check`
- 进展：
  - 2026-05-28：新增任务并领取；范围锁定为实施计划和模块文档，不改共享生成器代码。
  - 2026-05-28：已完成模板注册表和参数系统实施计划，明确后续代码任务按注册表类型、参数归一化、现有模板迁移、ExperienceReport 扩展、文档同步五段推进；T083 再实现 8 个核心模板。

- 验证结果：
  - `npm run docs:sync`：通过，已同步 49 个任务分片和 48 个领取分片。
  - `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T082-hulebu-template-registry-plan.md docs/tasks/claims/T082-lee.md docs/superpowers/plans/2026-05-28-hulebu-template-registry-parameter-system.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`：无匹配。
  - `git diff --check`：通过。

- 遗留问题：尚未修改 `packages/shared` 生成器代码；后续需要另起实现任务，按本计划落地模板注册表和参数系统。
