# T074：胡了卜无边框麻将牌面资源

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：T073 已把已归档的青瓷麻将图片接入 Cocos 牌山，但当前图片包含完整牌体、边框和留白，放进现有 Cocos 牌节点后观感偏小且边框叠边明显。用户明确要求“完全没有边框”的麻将图片。
- 目标：基于 T068 已归档的 27 张数牌和 7 张字牌，派生一套透明背景、只保留牌面符号的无边框 PNG，并让 Cocos 牌面 SpriteFrame 映射优先使用该套资源；保留原带框图片作为回退和美术来源。
- 不做：不重新生成 AI 图片，不删除或覆盖原带框资源，不改玩法、关卡、奖励、槽位图片、动画、音效、图集打包、Web 站点接入或发布包。
- 依赖：T068, T073
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `apps/game/mahjong-roguelike/cocos/scene-binding.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T074-hulebu-borderless-mahjong-assets.md`, `docs/tasks/claims/T074-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`node` + `sharp` 检查无边框 PNG 数量、尺寸、透明通道和边缘 alpha；`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`
- 进展：
  - 2026-05-27：新增任务，目标是给 Cocos 牌山改用透明无边框牌面资源，解决当前带框图片叠到牌体上后观感偏丑的问题。
  - 2026-05-27：已生成 34 张透明无边框 PNG，目录为 `tiles/borderless/numbered/` 和 `tiles/borderless/honors/`。
  - 2026-05-27：已升级 `manifest.json`，新增 `borderlessNumberedTiles` 和 `borderlessHonorTiles`，记录透明通道、提取方式和内容边界。
  - 2026-05-27：已更新 `HulebuTileSpriteCatalog`，34 个 `tileKey` 现在优先加载 `tiles/borderless/**/spriteFrame`。
  - 2026-05-27：已更新资源 README、Cocos 绑定清单、模块进展和交接说明。
  - 2026-05-27：根据验收反馈，已清理无边框字牌 `西` 右侧、`北` 左侧、`发` 左侧残留的窄侧边阴影，并重跑资源检查。
- 完成摘要：已完成胡了卜透明无边框牌面资源派生和 Cocos SpriteFrame 映射切换，原带框资源保留为回退和美术复核。
