# T045：胡了卜命名落档和规则模型第一版

- 领取人：Codex / 开发 B
- 领取时间：2026-05-23
- 状态：已完成
- 预计完成：2026-05-23
- 允许修改文件：`packages/shared/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T045-hulebu-rules-model.md`, `docs/tasks/claims/T045-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/src/components/portal-data.ts`, `apps/web/src/app/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`
- 依赖任务：T044
- 验证命令：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 当前风险：T017 和 T020 仍未正式领取，本任务只做引擎无关规则模型，不进入 Cocos/GDevelop 或站内路由实现。
- 备注：已完成 `胡了卜` 命名落档和纯 TypeScript 规则模型，下一步建议沉淀关卡/奖励配置。
