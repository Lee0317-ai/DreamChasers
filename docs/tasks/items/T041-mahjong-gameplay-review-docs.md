# T041：麻将 Roguelike 团队评审版玩法方案

- 优先级：P1
- 负责人：Codex / 开发 B
- 状态：已完成
- 背景：麻将 Roguelike 的核心玩法、规则、经济、体力、失败救场、长期模式和程序化随机生成方向已经多轮讨论，需要整理成一份团队可评审、可补充的完整玩法方案，并提供更易浏览的 HTML 可视化版本。
- 目标：新增 Markdown 玩法方案和 HTML 团队评审稿，归纳游戏定位、核心循环、吃碰杠规则、槽位与失败、经济体力、Roguelike、永久成长、模式结构、牌局生成和待评审问题。
- 不做：不实现游戏代码，不做最终 UI 视觉稿，不定最终数值，不进入开发计划。
- 依赖：T030, T031, T032, T033, T034, T035, T038, T040
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 验证命令：`npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查
- 执行记录：
  - 已新增变更卡 `IDEA-20260522-11`。
  - 已领取任务并开始整理团队评审版玩法方案。
  - 已新增 `docs/modules/mahjong-roguelike/GAMEPLAY_REVIEW_PLAN.md`。
  - 已新增 `docs/modules/mahjong-roguelike/GAMEPLAY_REVIEW.html`。
  - 已更新麻将模块索引、进展和交接说明。
- 完成摘要：已产出团队评审用玩法方案 Markdown 版和可视化 HTML 版，覆盖核心玩法、规则、经济、体力、Roguelike、永久成长、模式结构、牌局生成、MVP 范围和评审问题。
