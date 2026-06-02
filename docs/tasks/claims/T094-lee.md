# T094：胡了卜残局收官与试玩反馈设计

- 领取人：Lee
- 领取时间：2026-06-01
- 状态：待验收
- 预计完成：2026-06-01
- 允许修改文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T094-hulebu-endgame-settlement-design.md`, `docs/tasks/claims/T094-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-01-hulebu-endgame-settlement-design.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 禁止修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/**`, `apps/web/**`, `deploy/**`, PDF 工具箱、AI 修图、AI 搜索、埋点和平台部署相关文件
- 依赖任务：T093
- 验证命令：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T094-hulebu-endgame-settlement-design.md docs/tasks/claims/T094-lee.md docs/superpowers/specs/2026-06-01-hulebu-endgame-settlement-design.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/DECISIONS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md`; `git diff --check`
- 当前阻塞：无。
- 完成内容：已完成胡了卜 `残局收官` 设计规格。设计确认普通关不默认强制清槽；牌桌清空但槽内有残张时进入 `残局收官`；收官方向为 `弃牌通关 / 选作牌引 / 收入牌河`。Demo 第一阶段建议先实现弃牌通关和牌引，牌河兑换后置。同时明确下一轮实现需修正 T093 反馈：教学关必须发动对应组合、牌面和点击热区放大、`丢弃` 改成选择槽位任意一张、玩家页补可见记牌器。
- 验证结果：已运行 `npm run docs:sync`，同步到主任务池、领取摘要、状态摘要和当天进展汇总；占位符扫描无结果；`git diff --check` 通过。
- 下一步：等待 Lee 评审 T094 设计规格。确认后另开实现任务，修改 HTML 试玩原型和共享回归测试。
