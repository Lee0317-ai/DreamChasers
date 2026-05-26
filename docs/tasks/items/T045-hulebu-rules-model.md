# T045：胡了卜命名落档和规则模型第一版

- 优先级：P1
- 负责人：Codex / 开发 B
- 状态：已完成
- 背景：`胡了卜` 已作为麻将小游戏正式命名，T044 已完成 HTML demo；进入正式 MVP 前需要先把核心规则从 demo 中抽成可测试模型。
- 目标：完成模块命名落档，建立 `packages/shared` 包壳，新增 `mahjong-game` 规则模型和测试，覆盖基础吃碰杠、槽位、余牌和奖励状态修改。
- 不做：不创建 Cocos/GDevelop 正式工程，不接站内游戏路由，不修改当前 T015 覆盖的 `apps/web/src/components/portal-data.ts`，不做完整关卡内容和最终美术。
- 依赖：T044
- 允许修改文件：`packages/shared/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T045-hulebu-rules-model.md`, `docs/tasks/claims/T045-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/src/components/portal-data.ts`, `apps/web/src/app/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`
- 验证命令：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 执行记录：
  - 已新增变更卡 `IDEA-20260523-04`。
  - 已新增领取分片 `docs/tasks/claims/T045-codex.md`。
  - 已新增 `packages/shared` 包壳、TypeScript 配置、入口文件和 `mahjong-game` 规则模型。
  - 已新增 `packages/shared/src/mahjong-game.test.ts`，覆盖吃、碰、杠、非法组合、满槽前组合检测、执行组合、余牌统计、遮挡点击和基础奖励。
  - 已更新麻将模块 README、实施计划、进展、决策、交接和验证原型标题，确认显示名为 `胡了卜`。
- 完成摘要：已完成 `胡了卜` 命名落档和引擎无关规则模型第一版，后续可在此基础上继续做关卡/奖励配置和正式工程接入。
