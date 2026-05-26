# T053：胡了卜 Boss 牌型目标第一版

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：T052 已把 Boss 目标改成配置化多目标，但目标仍主要是组合次数和积分阈值。用户反馈 Boss 关应该更复杂，需要比“杠几次”更像试炼的目标。
- 目标：新增第一种牌型型 Boss 目标 `suit_set`，要求指定花色都各完成至少一定次数的组合；第 10 关加入“三门齐”目标，要求 `万 / 筒 / 条` 都至少完成 1 次组合。
- 不做：不实现完整胡牌算法，不新增第 11-20 关，不做最终 Boss 数值平衡，不创建 Cocos/GDevelop 正式工程，不接 Web 站点路由。
- 依赖：T052
- 主要文件范围：`apps/game/mahjong-roguelike/config/levels.json`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T053-hulebu-boss-pattern-goals.md`, `docs/tasks/claims/T053-codex.md`
- 验证方式：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /tmp/hulebu-prototype-script.js`; 原型 VM 检查第 10 关 Boss 目标；`npm run docs:sync`; `git diff --check`
- 进展：
  - 2026-05-24：开始任务，准备新增 `suit_set` Boss 目标配置、测试和试玩页进度统计。
  - 2026-05-24：已新增 `suit_set` Boss 目标类型，第 10 关加入 `万 / 筒 / 条` 各 1 次组合的“三门齐”目标。
  - 2026-05-24：试玩页已统计组合花色并展示 `三门齐 万 0/1 · 筒 0/1 · 条 0/1` 进度。
  - 2026-05-24：密集牌山生成器已为 Boss 组合目标分配花色队列，保证第 10 关目标包覆盖 `wan / tong / tiao`。
  - 2026-05-24：共享配置测试新增 `suit_set` 结构校验和第 10 关三门齐目标校验。
- 完成摘要：已完成 Boss 牌型目标第一版；第 10 关现在包含组合次数、三门齐和积分三类目标，后续可继续扩展最后一手、指定顺子包或简化胡牌包。
