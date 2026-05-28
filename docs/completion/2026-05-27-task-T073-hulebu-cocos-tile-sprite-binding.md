# T073：胡了卜 Cocos 牌面 SpriteFrame 绑定第一版完成记录

- 任务编号：T073
- 负责人：Codex / 开发 B
- 完成时间：2026-05-27
- 状态：待验收

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets.meta`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts.meta`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T073-hulebu-cocos-tile-sprite-binding.md`
- `docs/tasks/claims/T073-codex.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/progress/2026-05-27.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/superpowers/plans/2026-05-27-hulebu-cocos-tile-sprite-binding.md`

## 实现内容

- 新增 `HulebuTileSpriteCatalog`，固化 27 张数牌和 7 张字牌的 `tileKey -> SpriteFrame resources path` 映射。
- Catalog 使用 `resources.load(path, SpriteFrame, callback)` 加载图片，并缓存结果、合并同一 tileKey 的 pending callbacks。
- `BoardLayerBinder` 新增 `TileArt` 子节点和 `Sprite` 组件，优先按 `model.prefabKey` 加载真实青瓷麻将牌面。
- 图片加载成功后隐藏原文字标签；图片缺失或加载失败时保留原程序化占位牌和文字 fallback。
- 使用 `pendingSpriteKeys` 避免复用节点时旧异步加载结果覆盖新牌面。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run test -w packages/shared -- mahjong`
- `npm run typecheck -w packages/shared`
- `npm run docs:sync`
- `git diff --check`
- Cocos Web Preview 手机视口手动检查

## 验证结果

- `mahjong-cocos-project` 测试通过，1 个测试文件、7 个测试通过。
- Cocos 工程脚本类型检查通过。
- `mahjong` 共享回归测试通过，5 个测试文件、38 个测试通过。
- `packages/shared` 类型检查通过。
- `docs:sync` 通过，同步 40 个任务分片和 39 个领取分片。
- `git diff --check` 通过。
- 已通过 Cocos Web Preview 手机视口手动检查：真实首关的上层 `9筒` 和下层 `2万` 显示图片牌面；三张 `9筒` 仍可点击入槽；`碰 1` 激活后可消除；消除后下层 `2万` 保持图片牌面并可继续点击。

## 遗留问题

- 当前图片源为 1024x1024 生成图，牌体四周还有背景留白，正式体验需要进一步裁切或制作 Tile prefab。
- 当前只替换牌山牌面，8 格主槽里仍显示文字 fallback。
- 尚未接奖励三选一、Boss 目标进度、完整 1-20 关关卡流、动画、音效和发布包。
