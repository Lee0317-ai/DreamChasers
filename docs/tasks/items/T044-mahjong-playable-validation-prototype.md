# T044：麻将 Roguelike 最小可玩验证原型

- 优先级：P1
- 负责人：Codex / 开发 B
- 状态：已完成
- 背景：T043 已明确后续需要先做最小可玩验证原型，再决定是否回到 T017 正式开发。
- 目标：新增一个可直接打开试玩的轻量 HTML 原型，验证点击、入槽、手动 `吃 / 碰 / 杠`、候选选择、余牌、奖励选择和满槽救场是否成立。
- 不做：不创建正式 Cocos/GDevelop 工程，不修改 `apps/**` 或 `packages/**`，不接站内路由，不做最终 UI，不做 20 关、无尽、每日、高阶、排行榜。
- 依赖：T043
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `package.json`, `package-lock.json`, `deploy/**`
- 验证命令：`npm run docs:sync`; 浏览器桌面端检查；浏览器移动端检查；UTF-8 无 BOM 检查；`git diff --check`
- 执行记录：
  - 已新增变更卡 `IDEA-20260523-03`。
  - 已新增 `docs/modules/mahjong-roguelike/PLAYABLE_VALIDATION_PROTOTYPE.html`。
  - 已完成桌面端浏览器检查，验证单场手动 `碰`、奖励三选一、多组合候选和满槽备用槽救场。
  - 已完成移动端浏览器检查，并调整牌山坐标缩放，避免窄屏牌面溢出。
- 完成摘要：已完成轻量 HTML 最小可玩验证原型，覆盖 5 个验证场景、手动 `吃 / 碰 / 杠`、候选选择、余牌、局内积分、奖励选择、道具和失败前救场。
