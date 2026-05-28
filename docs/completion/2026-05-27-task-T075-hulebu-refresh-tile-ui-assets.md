# T075 胡了卜新牌面 UI 重新应用完成记录

- 完成时间：2026-05-27
- 负责人：Codex / 开发 B
- 任务编号：T075
- 任务名称：胡了卜新牌面 UI 重新应用

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/**`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `apps/game/mahjong-roguelike/cocos/scene-binding.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T075-hulebu-refresh-tile-ui-assets.md`
- `docs/tasks/claims/T075-codex.md`
- `docs/progress/2026-05-27.md`

## 实现内容

- 从 T074 透明无边框牌面派生 34 张运行时留白版 PNG。
- 新增 `tiles/refreshed/numbered/`，包含万、条、筒各 1-9。
- 新增 `tiles/refreshed/honors/`，包含东、南、西、北、中、发、白。
- 根据目标概念图反馈，将 v2 留白版符号有效内容高度控制在约 61%-62% 画布，避免符号贴边。
- 更新 `manifest.json`，记录 `assetSetVersion: cocos-refreshed-ui-v2-whitespace-2026-05-27`、`runtimeTileSet: refreshed`、`refreshedNumberedTiles` 和 `refreshedHonorTiles`。
- 更新 `HulebuTileSpriteCatalog`，让 34 个 `tileKey` 优先加载 `tiles/refreshed/**/spriteFrame`。
- 保留 `tiles/borderless/` 作为透明来源图，保留原带框资源作为回退和美术复核。

## 验证命令

- `node --input-type=module ...`：检查运行时资源数量、尺寸、透明通道、内容边界和 catalog 映射。
- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 运行时资源检查通过：27 张数牌、7 张字牌均为 1024x1024 透明 PNG，内容有效高度约 61%-62%，资源版本为 `cocos-refreshed-ui-v2-whitespace-2026-05-27`。
- Cocos 映射检查通过：`HulebuTileSpriteCatalog` 包含 34 条 `tiles/refreshed/**/spriteFrame` 路径。
- `npm run test -w packages/shared -- mahjong-cocos-project` 通过，1 个测试文件、8 个测试通过。
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json` 通过。
- `npm run docs:sync` 通过，已同步 43 个任务分片和 41 个领取分片。
- `git diff --check` 通过。
- Cocos Web Preview 手机视口目检通过：真实首关 `9筒 / 2万` 显示留白版新牌面。

## 遗留问题

- 本任务只替换牌山运行时牌面，不处理槽位图片、图集打包、最终 Tile prefab 或动画。
- 通关提示、下一关流转、奖励节点入口和 Boss 目标进度已拆到后续任务。
