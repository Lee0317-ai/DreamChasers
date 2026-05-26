# T056：胡了卜固定 8 格主槽和胡牌基础支持

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：用户确认主卡槽固定为 8 格，不再继续扩主槽；8 格刚好承载 `3 + 3 + 2` 的胡牌结构。备用卡槽继续作为救场，不应变成第 9 个主槽。
- 目标：将胡了卜规则和试玩原型调整为主槽固定 8 格；新增 `胡` 候选检测，槽内 8 张可拆为两个 3 张组合和一个对子时，可以一次消除 8 张。
- 不做：不做完整麻将听牌和番型算法，不做 9 格主槽，不做完整 20 关重平衡，不创建 Cocos/GDevelop 正式工程，不接 Web 站点路由。
- 依赖：T055
- 主要文件范围：`packages/shared/**`, `apps/game/mahjong-roguelike/config/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T056-hulebu-fixed-eight-slot-hu.md`, `docs/tasks/claims/T056-codex.md`
- 验证方式：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /private/tmp/hulebu-config-playable-script.js`; 浏览器桌面端和 390px 移动端检查；`npm run docs:sync`; `git diff --check`
- 进展：
  - 2026-05-24：开始任务，准备以测试先行方式实现 8 格主槽和 `3 + 3 + 2` 胡牌。
  - 2026-05-24：已完成共享规则、配置、试玩原型和模块文档更新。主槽默认固定 8 格；扩槽奖励不再提高主槽上限；新增 `胡` 候选，主槽 8 张可拆为两个 3 张组合和一个对子时一次消除 8 张；备用槽不参与 `胡` 判定。
  - 2026-05-24：已通过共享规则测试、类型检查、试玩页脚本语法检查、桌面端胡牌点击验证、390px 移动端布局检查、`npm run docs:sync` 和 `git diff --check`，当前交给人工试玩验收。
