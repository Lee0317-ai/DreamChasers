# T081：胡了卜地图模板语法系统设计完成记录

- 任务编号：T081
- 负责人：Codex / 开发 B
- 修改文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T081-hulebu-map-template-grammar-design.md`, `docs/tasks/claims/T081-codex.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-05-28-hulebu-map-template-grammar-design.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 实现内容：完成胡了卜地图模板语法系统设计稿，确认第一期采用 8 个核心模板：中心塔、双翼、十字、环形、长墙、岛屿、峡谷、阶梯；第二批 backlog 预留花瓣、堡垒、棋盘、迷雾外圈。设计同时定义模板参数、体验标签、校验器、模板注册表和后续 T082-T085 拆分。
- 验证命令：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T081-hulebu-map-template-grammar-design.md docs/tasks/claims/T081-codex.md docs/superpowers/specs/2026-05-28-hulebu-map-template-grammar-design.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check`
- 验证结果：`npm run docs:sync` 通过，已同步 48 个任务分片和 47 个领取分片；占位符扫描无匹配；`git diff --check` 通过。
- 遗留问题：尚未实现模板注册表和 8 个核心模板；后续需要 T082/T083 继续落到 `packages/shared`，再由 T084 接入 Cocos。
