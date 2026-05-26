# T057：胡了卜胡牌节奏配置和密集牌山胡牌包

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：T056 已完成固定 8 格主槽和 `胡` 牌型基础支持，但当前 `胡` 的出现主要依赖关卡牌面自然凑成。下一步需要让内容配置和密集牌山生成器能有意识地安排 `胡` 的出现频率，方便试玩时判断 8 格压力、胡牌爽点和救场价值。
- 目标：在关卡配置中加入轻量的重点组合标记，让部分关卡明确承担 `胡` 教学或压力验证；配置试玩页展示该关重点，并在密集牌山模式优先生成可胡的 `3 + 3 + 2` 组合包。
- 不做：不做完整听牌算法，不做番型结算，不做全 20 关重平衡，不新增奖励类型，不创建 Cocos/GDevelop 正式工程，不接 Web 站点路由。
- 依赖：T056
- 主要文件范围：`packages/shared/**`, `apps/game/mahjong-roguelike/config/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/docs/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T057-hulebu-hu-rhythm-config.md`, `docs/tasks/claims/T057-codex.md`
- 验证方式：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /private/tmp/hulebu-config-playable-script.js`; 浏览器桌面端检查第 6 关配置模式和密集牌山模式；浏览器 390px 移动端检查；`npm run docs:sync`; `git diff --check`
- 进展：
  - 2026-05-25：开始任务，准备先用配置测试锁定 `featuredCombos` 契约，再实现配置和试玩原型支持。
  - 2026-05-25：已新增 `featuredCombos` 关卡重点组合字段，第 6 关和第 10 关标记为 `胡` 重点关卡。
  - 2026-05-25：配置试玩页已展示“本关重点”，密集牌山模式会优先生成一个 `3 + 3 + 2` 的 8 张胡牌包。
  - 2026-05-25：已修正密集牌山生成器遮挡自检口径，超过 5% 遮挡才写入 `blockedBy`，与点击规则保持一致。
  - 2026-05-25：已通过共享配置测试、脚本语法检查、桌面端第 6 关胡牌包试玩和 390px 移动端检查，待最终验收。
