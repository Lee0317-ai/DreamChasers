# T075：胡了卜新牌面 UI 重新应用

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：用户重新生成了一批胡了卜麻将牌面 UI，希望替换当前 Cocos 牌山显示的无边框派生牌面。Cocos 当前已能加载真实第 1 关并跑通点击、遮挡解锁和基础组合消除，但牌面资源需要继续对齐最新美术。
- 目标：定位最新生成的牌面 UI 资源，确认牌键映射完整后，重新应用到 Cocos `mahjong-tiles` 资源目录、manifest 和 `HulebuTileSpriteCatalog`；保留缺图 fallback，不破坏当前点击链路。
- 不做：不改通关弹窗、下一关流转、奖励三选一、Boss 目标进度、槽位图片、动画、音效、图集打包、Web 站点接入或发布包。通关提示和下一关流转另拆后续任务。
- 依赖：T068, T073, T074
- 主要文件范围：`output/imagegen/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `apps/game/mahjong-roguelike/cocos/scene-binding.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T075-hulebu-refresh-tile-ui-assets.md`, `docs/tasks/claims/T075-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：资源清单和图片尺寸检查；`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`; Cocos Web Preview 手机视口目检
- 进展：
  - 2026-05-27：新增并领取任务，先处理新牌面 UI 资源重新应用；通关提示和下一关流转作为后续任务继续补。
  - 2026-05-27：扫描 `output/imagegen/` 和 Cocos 资源库后，未发现比 T074 更新且命名完整的一整套单牌源图；运行时先以 T074 透明无边框图作为来源，派生 `tiles/refreshed/`。
  - 2026-05-27：已生成 34 张 `tiles/refreshed/` 运行时牌面，并把 `HulebuTileSpriteCatalog` 从 `tiles/borderless/**` 切到 `tiles/refreshed/**`。
  - 2026-05-27：根据用户对目标图的反馈，v2 版 `refreshed` 图将符号内容高度控制在约 61%-62% 画布，保留牌体四周留白，不再把符号顶满牌面。
  - 2026-05-27：已更新资源 README、`scene-binding.md`、模块文档和测试保护。
  - 2026-05-27：已通过资源清单检查、`npm run test -w packages/shared -- mahjong-cocos-project`、Cocos `tsc`、`npm run docs:sync` 和 `git diff --check`。
- 完成摘要：已完成胡了卜 Cocos 新牌面 UI 重新应用，当前运行时优先加载 `tiles/refreshed/` 留白版 v2；`tiles/borderless/` 保留为透明来源图，带框原图保留为回退和美术复核。
