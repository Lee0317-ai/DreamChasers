# T038：麻将 Roguelike 永久固化能力和卡槽系统规划

- 优先级：P1
- 负责人：Codex / 开发 B
- 状态：已完成
- 背景：当前已经确认手动吃碰杠、牌谱记牌器、局内 Roguelike 能力池和高阶卡槽压缩，但玩家还需要明确永久成长、局内构筑、手牌槽位和能力卡槽的边界。
- 目标：在麻将 Roguelike 模块中新增永久能力与能力卡槽规划，明确 `基础成长`、`固化能力`、`起局能力`、`道具强化` 四层结构，以及手牌槽位和能力卡槽的区别、基础槽数、压缩规则和首批可做内容。
- 不做：不实现代码，不做最终数值平衡，不生成 UI，不改游戏逻辑。
- 依赖：T030, T032, T035
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 执行记录：
  - 已新增变更卡 `IDEA-20260522-09`。
  - 已领取任务并开始整理永久能力四层结构。
  - 已明确手牌槽位、能力卡槽和透视的边界。
  - 已在 `GAMEPLAY_PLAN.md` 新增永久固化能力和能力卡槽规划。
  - 已在 `DECISIONS.md` 新增 D011 和 D012。
- 完成摘要：永久能力分为基础成长、固化能力、起局能力、道具强化四层；手牌槽位负责底部容量，能力卡槽负责装备永久能力；透视归入信息/道具强化，不等于扩槽；普通闯关/东风场基线为 3 / 1 / 1，高阶周目逐步压缩能力卡槽。
