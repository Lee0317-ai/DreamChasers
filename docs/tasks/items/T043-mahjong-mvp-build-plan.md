# T043：麻将 Roguelike 最小可玩闭环和 MVP 开发拆分计划

- 优先级：P1
- 负责人：Codex / 开发 B
- 状态：已完成
- 背景：T042 已完成玩法验证计划，但还缺少后续承接：最小可玩闭环具体做什么、如何验证、验证通过后正式 MVP 按什么顺序拆开发任务。
- 目标：新增构建计划，区分 `验证闭环` 与 `正式 MVP`，明确验证原型功能边界、随机牌局生成口径、观察指标、正式 MVP 开发顺序、决策门槛和后置内容。
- 不做：不实现代码，不创建 Cocos/GDevelop 工程，不改 `apps/**` 或 `packages/**`，不做最终数值平衡，不扩展长期模式。
- 依赖：T042
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `package.json`, `package-lock.json`, `apps/web/**`, `deploy/**`
- 验证命令：`npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查；`git diff --check`
- 执行记录：
  - 已新增变更卡 `IDEA-20260523-02`。
  - 已领取任务并补齐后续构建规划。
  - 已新增 `docs/modules/mahjong-roguelike/MVP_BUILD_PLAN.md`。
  - 已新增 `docs/modules/mahjong-roguelike/MVP_BUILD_PLAN.html`。
  - 已更新麻将模块索引、进展和交接说明。
- 完成摘要：已产出最小可玩闭环与 MVP 开发拆分计划，明确验证原型、随机生成、观察埋点、正式 MVP 实施顺序、决策门槛和团队下一步讨论点。
