# T074：胡了卜无边框麻将牌面资源

- 领取人：Codex / 开发 B
- 领取时间：2026-05-27
- 状态：待验收
- 预计完成：2026-05-27
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `apps/game/mahjong-roguelike/cocos/scene-binding.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T074-hulebu-borderless-mahjong-assets.md`, `docs/tasks/claims/T074-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T068, T073
- 验证命令：`node` + `sharp` 检查无边框 PNG 数量、尺寸、透明通道和边缘 alpha；`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 完成内容：已从 T068 原始带框麻将图派生 27 张数牌和 7 张字牌透明无边框 PNG，目录为 `assets/resources/ui/mahjong-tiles/tiles/borderless/`；已更新 `manifest.json`、资源 README、Cocos 绑定清单和 `HulebuTileSpriteCatalog`，让牌山优先加载无边框 SpriteFrame。
- 验证结果：已通过无边框资源检查，确认 27 张数牌、7 张字牌均为 1024x1024 透明 PNG，边缘 alpha 为 0，Cocos 映射包含 34 条 `tiles/borderless/**/spriteFrame` 路径；已清理 `西` 右侧、`北` 左侧、`发` 左侧窄侧边阴影；已通过 `npm run test -w packages/shared -- mahjong-cocos-project`、Cocos `tsc`、`npm run docs:sync` 和 `git diff --check`。
- 下一步：等待用户验收；后续建议继续调牌体底板、符号缩放比例、槽位图片和最终 Tile prefab。
