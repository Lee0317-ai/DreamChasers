# T054：胡了卜 Boss 目标反馈和通关提示优化

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：T052 和 T053 已让第 10 关 Boss 支持组合次数、三门齐和积分目标，但目标栏目前只是纯文本，玩家不容易判断哪些目标已完成、刚刚推进了什么，以及清空牌山但目标未达成时为什么不能通关。
- 目标：优化配置试玩页的 Boss 目标反馈：完成项有明确状态，刚推进的目标短暂高亮，清空牌山但目标未完成时给出明确提示。
- 不做：不扩展第 11-20 关，不新增 Boss 目标类型，不做最终 UI 美术，不创建 Cocos/GDevelop 正式工程，不接 Web 站点路由。
- 依赖：T053
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T054-hulebu-boss-goal-feedback.md`, `docs/tasks/claims/T054-codex.md`
- 验证方式：`node --check /tmp/hulebu-prototype-script.js`; 原型 VM 检查第 10 关 Boss 目标 DOM 状态；`npm run docs:sync`; `git diff --check`
- 进展：
  - 2026-05-24：开始任务，准备优化 Boss 目标栏完成态、推进高亮和目标未完成提示。
  - 2026-05-24：Boss 目标栏已从纯文本改为目标标签，支持未完成、完成和刚推进三种状态。
  - 2026-05-24：执行组合后会短暂高亮对应组合目标、花色目标和积分目标。
  - 2026-05-24：清空牌山但 Boss 目标未完成时，提示改为 `牌山已清空，但 Boss 目标未完成`，避免被误认为普通失败或 bug。
- 完成摘要：已完成 Boss 目标反馈闭环第一版；第 10 关目标现在能显示完成态、推进高亮和未完成原因。
