# T042：麻将 Roguelike MVP 玩法验证计划

- 优先级：P1
- 负责人：Codex / 开发 B
- 状态：已完成
- 背景：麻将 Roguelike 的玩法评审稿已经完成，但在进入正式实现前，还需要一份更聚焦的验证计划，明确先验证哪些核心假设、用什么最小闭环观察体验是否成立，以及哪些内容必须冻结到 MVP。
- 目标：新增玩法验证计划，聚焦 `点击 - 入槽 - 手动吃碰杠 - 奖励 - 失败` 的最小闭环，定义验证样本、观察指标、通过/失败标准和 MVP 冻结口径。
- 不做：不实现代码，不做最终数值平衡，不扩展长线模式，不进入正式开发拆分。
- 依赖：T041
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 验证命令：`npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查
- 执行记录：
  - 已新增变更卡 `IDEA-20260523-01`。
  - 已领取任务并整理玩法验证计划。
  - 已新增 `docs/modules/mahjong-roguelike/MVP_VALIDATION_PLAN.md`。
  - 已新增 `docs/modules/mahjong-roguelike/MVP_VALIDATION_PLAN.html`。
  - 已更新麻将模块索引、进展和交接说明。
- 完成摘要：已产出 MVP 玩法验证计划 Markdown 版和 HTML 可视化版，明确核心假设、最小验证闭环、测试样本、验证场景、通过标准、不通过调整方向和 MVP 冻结线。
