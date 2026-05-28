# T073：胡了卜 Cocos 牌面 SpriteFrame 绑定第一版

- 领取人：Codex / 开发 B
- 领取时间：2026-05-27
- 状态：待验收
- 预计完成：2026-05-27
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T073-hulebu-cocos-tile-sprite-binding.md`, `docs/tasks/claims/T073-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`, `docs/superpowers/plans/2026-05-27-hulebu-cocos-tile-sprite-binding.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T068, T072
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 完成内容：Cocos 工程已新增 `HulebuTileSpriteCatalog`，把 T068 归档的 27 张数牌和 7 张字牌映射为 `resources.load` 可读取的 SpriteFrame 路径；`BoardLayerBinder` 已增加 `TileArt` 图片层，优先按 `model.prefabKey` 加载真实牌面，加载失败时继续保留程序化占位牌和文字。
- 验证结果：`npm run test -w packages/shared -- mahjong-cocos-project`、Cocos `tsc`、`npm run test -w packages/shared -- mahjong`、`npm run typecheck -w packages/shared` 均已通过；Cocos Web Preview 手机视口已手动确认真实首关的 `9筒 / 2万` 显示图片且点击、入槽、`碰` 消除链路不回退。
- 下一步：等待用户验收；后续建议做正式 Tile prefab/裁切图集和槽位图片替换，或继续扩关卡流、奖励三选一和 Boss 目标进度。
