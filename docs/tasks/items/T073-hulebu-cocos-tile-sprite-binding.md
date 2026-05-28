# T073：胡了卜 Cocos 牌面 SpriteFrame 绑定第一版

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：T072 已让 Cocos Web Preview 默认加载真实第 1 关并跑通点击、入槽、遮挡解锁和基础组合消除，但牌山仍使用程序化占位牌面；T068 已把青瓷风麻将图片整理到 `assets/resources/ui/mahjong-tiles/` 并生成 `manifest.json`。
- 目标：让 Cocos 牌山节点优先按 `prefabKey` / `tileKey` 加载 `assets/resources/ui/mahjong-tiles/` 中的 SpriteFrame，首关的 `9筒` 和 `2万` 能显示真实图片；当图片缺失或加载失败时继续显示当前程序化占位牌和文字，不阻断玩法验证。
- 不做：不做完整 Tile prefab 池，不做图集打包，不做槽位图片替换，不做动画、音效、奖励三选一、Boss 目标、20 关关卡流、Web 站点接入或发布包。
- 依赖：T068, T072
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T073-hulebu-cocos-tile-sprite-binding.md`, `docs/tasks/claims/T073-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`, `docs/superpowers/plans/2026-05-27-hulebu-cocos-tile-sprite-binding.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`; Cocos Web Preview 手机视口手动检查首关牌面图片和点击链路。
- 进展：
  - 2026-05-27：新增任务，目标是把 Cocos 牌山从程序化占位牌推进到优先使用已归档青瓷麻将图片。
  - 2026-05-27：新增 `HulebuTileSpriteCatalog`，固化 27 张数牌和 7 张字牌的 `tileKey -> resources.load SpriteFrame` 映射，并提供缓存和并发回调合并。
  - 2026-05-27：`BoardLayerBinder` 已新增 `TileArt` 子节点，优先用 `model.prefabKey` 异步加载真实牌面图片；加载成功后隐藏文字标签，加载失败时保留程序化占位牌和文字。
  - 2026-05-27：已在 Cocos Web Preview 手机视口验证：真实第 1 关上层 `9筒` 和下层 `2万` 显示图片牌面；三张 `9筒` 仍可点击入槽，`碰 1` 激活后可消除，消除后下层 `2万` 图片牌面保留并可继续点击。
  - 2026-05-27：当前图片源为 1024x1024 带背景的生成图，第一版接入后牌面可见但偏小；后续需要做正式 Tile prefab/裁切/图集/槽位图片替换。
