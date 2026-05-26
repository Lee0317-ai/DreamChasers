# T068：胡了卜麻将 UI 图片资源归档和切图

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：已完成
- 背景：`output/imagegen/` 中已经生成多张胡了卜青瓷风麻将图片。当前图片仍散落在输出目录中，不便于后续 Cocos UI 导入、prefab 绑定和美术复核；字牌参考图还是横向总图，需要切成单张。
- 目标：将现有图片按 `牌面 / 字牌 / 参考图 / 中间稿` 分类复制到胡了卜 Cocos UI 资源目录，并切出字牌单图，补充资源清单。
- 不做：不生成新图片，不接入运行时代码，不替换现有占位节点，不做最终 sprite atlas，不改玩法、关卡、奖励、共享规则或 Web 站点。
- 依赖：T051, T062, T066
- 主要文件范围：`output/imagegen/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/**`, `apps/game/mahjong-roguelike/cocos/scene-binding.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T068-hulebu-ui-image-assets.md`, `docs/tasks/claims/T068-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/progress/2026-05-26.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `packages/shared/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run docs:sync`; 图片尺寸和清单检查；`git diff --check`
- 进展：
  - 2026-05-26：新增任务，目标是把现有生成图片整理进胡了卜 Cocos UI 资源目录，并切出字牌单图。
  - 2026-05-26：已新增 `assets/resources/ui/mahjong-tiles/` 分类目录和 Cocos 目录 `.meta`。
  - 2026-05-26：已复制 27 张数牌单图，按 `wan / tiao / tong` 分类，并使用 `tileKey` 记录映射。
  - 2026-05-26：已从 `hulebu-honor-tiles-celadon-reference-v1.png` 切出 7 张字牌单图：东、南、西、北、中、发、白。
  - 2026-05-26：已归档 2 张参考图和 7 张中间稿。
  - 2026-05-26：已新增 `README.md` 和 `manifest.json`，记录来源、分类、尺寸和后续 Cocos 绑定口径。
- 完成摘要：已完成胡了卜麻将 UI 图片资源归档和字牌切图，Cocos 工程可直接从 `assets/resources/ui/mahjong-tiles/manifest.json` 查询牌面资源。
