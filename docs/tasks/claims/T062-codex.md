# T062：胡了卜 Cocos Creator 3.8.8 工程接入

- 领取人：Codex / 开发 B
- 领取时间：2026-05-25
- 状态：已完成
- 预计完成：2026-05-25
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/docs/**`, `apps/game/mahjong-roguelike/README.md`, `packages/shared/src/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T062-hulebu-cocos-creator-project.md`, `docs/tasks/claims/T062-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-25.md`, `docs/completion/2026-05-25-task-T062-hulebu-cocos-creator-project.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T061
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 当前风险：Cocos Creator 的完整 `.scene` 资源最好由编辑器生成和维护；本任务先创建工程壳和脚本边界，不承诺编辑器内已完成真实节点绑定。
- 完成说明：已创建 Cocos Creator 3.8.8 工程壳、首场景脚本边界、配置导入占位和工程结构测试；真实场景节点绑定留到下一任务在编辑器中完成。
- 下一步：在 Cocos Dashboard 中打开 `hulebu-cocos-3.8.8`，创建 `HulebuGameScene.scene` 并绑定 `GameSceneController` 和四个 Binder。
