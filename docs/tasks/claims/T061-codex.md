# T061：胡了卜 Cocos 场景骨架第一版

- 领取人：Codex / 开发 B
- 领取时间：2026-05-25
- 状态：待验收
- 预计完成：2026-05-25
- 允许修改文件：`packages/shared/src/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/docs/**`, `apps/game/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T061-hulebu-cocos-scene-skeleton.md`, `docs/tasks/claims/T061-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-25.md`, `docs/completion/2026-05-25-task-T061-hulebu-cocos-scene-skeleton.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T060
- 验证命令：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 当前风险：本任务只建立 Cocos 场景骨架和可测试视图模型，不代表已经完成 Cocos Creator 可运行工程。
- 完成说明：已新增 Cocos 场景视图模型、场景节点结构、脚本边界和绑定清单，后续 Cocos Creator 工程应按该清单创建真实场景资源。
- 下一步：在 Cocos Creator 中创建 `HulebuGameScene`、Tile prefab 和 HUD 节点，把 `createMahjongCocosSceneModel` 输出绑定到真实节点。
