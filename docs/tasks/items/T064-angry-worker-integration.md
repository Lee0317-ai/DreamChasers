# T064：打工人弹射解压模块文档落档

- 优先级：P1
- 负责人：Codex / 开发 B
- 状态：已完成
- 背景：用户已完成面向打工人的 Roguelike 物理弹射解压游戏完整方案设计（6 阶段），包含随机关卡生成、武器差异化、Buff 系统、Boss 战、吐槽系统、本地图片替换、排行榜和局外成长。需要将完整方案落档为项目正式模块文档。
- 目标：创建 `docs/modules/angry-worker/` 独立模块文档目录，写入 README、IMPLEMENTATION_PLAN、PROGRESS、DECISIONS、HANDOFF；同步更新任务池和当前状态。
- 不做：本次不创建微信小程序工程代码，不接入 Matter.js，不修改现有麻将 Roguelike、PDF 工具箱、AI 修图工具的任务和代码。
- 依赖：IDEA-20260525-08（已入任务池）
- 允许修改文件：`docs/modules/angry-worker/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T064-angry-worker-integration.md`, `docs/tasks/claims/T064-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-25.md`, `docs/completion/**`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`, `apps/web/**`, `apps/game/**`
- 验证命令：`npm run docs:sync`; 文档自审; UTF-8 无 BOM 检查; `git diff --check`
- 执行记录：
  - 已基于 CHANGE_INTAKE 变更卡 IDEA-20260525-08 创建任务分片。
  - 已创建 `docs/modules/angry-worker/` 目录和 5 个模块文档。
  - 已同步更新 TASK_BOARD.md 和 CLAIMS.md。
- 完成摘要：已完成打工人弹射解压游戏模块的完整文档落档，包含产品定位、实施计划、关键决策和团队交接信息。
