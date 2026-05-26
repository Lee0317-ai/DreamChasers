# T060：胡了卜 Cocos/GDevelop 正式表现层桥接

- 领取人：Codex / 开发 B
- 领取时间：2026-05-25
- 状态：待验收
- 预计完成：2026-05-25
- 允许修改文件：`packages/shared/src/**`, `apps/game/mahjong-roguelike/docs/**`, `apps/game/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T060-hulebu-formal-presentation-bridge.md`, `docs/tasks/claims/T060-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-25.md`, `docs/completion/2026-05-25-task-T060-hulebu-formal-presentation-bridge.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T059
- 验证命令：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 当前风险：本任务是正式表现层承接的第一步，只建立桥接契约和文档，不代表已经完成 Cocos/GDevelop 可发布工程。
- 完成说明：已新增共享表现层快照契约和 Cocos/GDevelop 承接文档，后续正式工程应从 `createMahjongPresentationSnapshot` 接入。
- 下一步：创建 Cocos 场景骨架，让 `GameScene / BoardLayer / SlotLayer / HudLayer / ComboBar` 消费共享快照渲染一关。
