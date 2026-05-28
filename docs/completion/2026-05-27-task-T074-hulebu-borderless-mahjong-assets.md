# T074 胡了卜无边框麻将牌面资源完成记录

- 完成时间：2026-05-27
- 负责人：Codex / 开发 B
- 任务编号：T074
- 任务名称：胡了卜无边框麻将牌面资源

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
- `docs/tasks/items/T074-hulebu-borderless-mahjong-assets.md`
- `docs/tasks/claims/T074-codex.md`
- `docs/progress/2026-05-27.md`

## 实现内容

- 从 T068 已归档的带框青瓷麻将图中派生 34 张透明无边框 PNG。
- 新增 `tiles/borderless/numbered/`，包含万、条、筒各 1-9。
- 新增 `tiles/borderless/honors/`，包含东、南、西、北、中、发、白。
- 保持 1024x1024 SpriteFrame 尺寸，边缘透明，只保留牌面符号，便于叠在 Cocos 自绘牌体上。
- 更新 `manifest.json`，新增 `borderlessNumberedTiles` 和 `borderlessHonorTiles`。
- 更新 `HulebuTileSpriteCatalog`，让 34 个 `tileKey` 优先加载无边框 SpriteFrame。
- 保留原带框 `numberedTiles` 和 `honorTiles` 作为回退和美术复核。

## 验证命令

- `node --input-type=module ...`：检查无边框资源数量、尺寸、透明通道、边缘 alpha 和内容像素。
- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 无边框资源检查通过：27 张数牌、7 张字牌均为 1024x1024 透明 PNG，边缘 alpha 为 0，内容像素非空。
- Cocos 映射检查通过：`HulebuTileSpriteCatalog` 包含 34 条 `tiles/borderless/**/spriteFrame` 路径，不再指向带框牌面目录。
- `npm run test -w packages/shared -- mahjong-cocos-project` 通过，1 个测试文件、7 个测试通过。
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json` 通过。
- `npm run docs:sync` 通过，已同步 41 个任务分片和 40 个领取分片。
- `git diff --check` 通过。

## 遗留问题

- 无边框图为自动提取派生资源，后续最终美术仍可人工重绘。
- 本任务不处理槽位图片、图集打包、最终 Tile prefab、动画和完整关卡流程。
