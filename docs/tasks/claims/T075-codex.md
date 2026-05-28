# T075：胡了卜新牌面 UI 重新应用

- 领取人：Codex / 开发 B
- 领取时间：2026-05-27
- 状态：待验收
- 预计完成：2026-05-27
- 允许修改文件：`output/imagegen/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `apps/game/mahjong-roguelike/cocos/scene-binding.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T075-hulebu-refresh-tile-ui-assets.md`, `docs/tasks/claims/T075-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T068, T073, T074
- 验证命令：资源清单和图片尺寸检查；`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`; Cocos Web Preview 手机视口目检
- 当前阻塞：无
- 完成内容：已从 T074 透明无边框资源派生 34 张运行时留白版牌面，目录为 `assets/resources/ui/mahjong-tiles/tiles/refreshed/`；`manifest.json` 记录 `assetSetVersion: cocos-refreshed-ui-v2-whitespace-2026-05-27` 和 `runtimeTileSet: refreshed`；`HulebuTileSpriteCatalog` 已切到 `tiles/refreshed/**/spriteFrame`；资源 README、场景绑定清单和模块文档已同步。
- 验证结果：已通过资源清单和图片内容边界检查，确认 27 张数牌、7 张字牌均为 1024x1024 透明 PNG，运行时有效内容高度约 61%-62%，保留牌面留白；已通过 `npm run test -w packages/shared -- mahjong-cocos-project`，1 个测试文件、8 个测试通过；已通过 Cocos `tsc`、`npm run docs:sync` 和 `git diff --check`；已通过 Cocos Web Preview 手机视口目检，`9筒 / 2万` 显示留白版新牌面。
- 下一步：建议领取 T076，补清空牌山后的通关提示、下一关流转和奖励节点入口。
