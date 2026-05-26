# T052：胡了卜 Boss 目标配置化

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：配置试玩页已支持第 10 关 Boss 标识和单一示例目标，但用户反馈 Boss 目标不能只是“杠几次”，需要更复杂的阶段目标，并且奖励节奏已确定为 3 / 6 / 9 关奖励、10 关 Boss。
- 目标：把 Boss 关目标改为配置驱动，支持组合次数和积分目标；第 10 关使用多目标试炼；密集牌山模式生成目标包时保证目标组合可完成。
- 不做：不实现完整麻将胡牌算法，不新增第 11-20 关，不创建 Cocos/GDevelop 正式工程，不接 Web 站点路由，不做最终数值平衡。
- 依赖：T050
- 主要文件范围：`apps/game/mahjong-roguelike/config/levels.json`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T052-hulebu-boss-goal-config.md`, `docs/tasks/claims/T052-codex.md`
- 验证方式：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /tmp/hulebu-prototype-script.js`; 浏览器桌面端检查；`npm run docs:sync`; `git diff --check`
- 进展：
  - 2026-05-24：开始任务，准备补 Boss 目标配置契约和试玩页多目标实现。
  - 2026-05-24：已给第 10 关新增 `bossGoals`，目标为 `吃 1 / 碰 1 / 杠 1 / 积分 80`。
  - 2026-05-24：已将试玩页 Boss 目标从单一 `bossGoal` 改为配置化 `bossGoals` 数组，支持组合次数和积分目标，并在清空牌山时校验全部目标。
  - 2026-05-24：密集牌山生成器已根据 Boss 组合目标优先插入目标包，并在生成后校验解法路径的组合次数和积分目标。
  - 2026-05-24：已补充配置加载测试，要求 Boss 关必须配置至少 2 个目标且目标类型合法。
- 完成摘要：已完成胡了卜 Boss 目标配置化第一版；第 10 关现在是多目标 Boss 试炼，后续第 20 关可沿用同一 `bossGoals` 配置结构继续扩展。
