# T068：胡了卜麻将 UI 图片资源归档和切图

- 领取人：Codex / 开发 B
- 领取时间：2026-05-26
- 状态：已完成
- 预计完成：2026-05-26
- 允许修改文件：`output/imagegen/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/**`, `apps/game/mahjong-roguelike/cocos/scene-binding.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T068-hulebu-ui-image-assets.md`, `docs/tasks/claims/T068-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-26.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `packages/shared/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T051, T062, T066
- 验证命令：`npm run docs:sync`; 图片尺寸和清单检查；`git diff --check`
- 当前阻塞：无
- 完成说明：已建立 `assets/resources/ui/mahjong-tiles/` 分类目录，完成 27 张数牌、7 张字牌、2 张参考图和 7 张中间稿归档，并生成 `README.md` 与 `manifest.json`。
- 下一步：后续接 Cocos Tile prefab 时，按 `manifest.json` 建立 `tileKey -> SpriteFrame` 映射；`drafts/` 需人工确认后再替换正式牌面。
