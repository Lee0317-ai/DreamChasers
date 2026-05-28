# T081：胡了卜地图模板语法系统设计

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：T080 已完成共享层 Graph-based 牌山生成器第一版，但当前模板只覆盖 `center-tower` 和 `two-wings`。用户确认胡了卜要按完整游戏推进，地图模板不能只做 MVP，需要建立可长期生产关卡的模板语法系统。
- 目标：完成胡了卜地图模板语法系统设计稿，明确第一期 8 个核心模板家族、第二批 backlog、模板参数层、体验标签、校验指标、与 T080 生成器的接口边界，以及后续实现任务拆分。
- 不做：不修改 `packages/shared/**`、不修改 Cocos 工程、不替换当前 Cocos 默认关卡、不做 Web 接入、不做调参面板、不生成新美术、不做奖励效果、Boss 目标 UI、动画音效或发布包。
- 依赖：T079, T080
- 主要文件范围：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T081-hulebu-map-template-grammar-design.md`, `docs/tasks/claims/T081-codex.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-05-28-hulebu-map-template-grammar-design.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`packages/shared/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T081-hulebu-map-template-grammar-design.md docs/tasks/claims/T081-codex.md docs/superpowers/specs/2026-05-28-hulebu-map-template-grammar-design.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check`
- 进展：
  - 2026-05-28：新增任务并领取；用户已确认采用“模板语法系统”路线，并选择“8 个核心模板 + 第二批 backlog 预留”作为第一期落地方向。
  - 2026-05-28：已完成正式设计稿，明确模板语法系统、8 个核心模板、第二批 backlog、模板参数层、体验标签、校验器、模板注册表和后续 T082-T085 拆分。

- 验证结果：
  - `npm run docs:sync`：通过，已同步 48 个任务分片和 47 个领取分片。
  - `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T081-hulebu-map-template-grammar-design.md docs/tasks/claims/T081-codex.md docs/superpowers/specs/2026-05-28-hulebu-map-template-grammar-design.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`：无匹配。
  - `git diff --check`：通过。

- 遗留问题：后续需要另起实现任务，把设计落到 `packages/shared` 的模板注册表和测试中。
