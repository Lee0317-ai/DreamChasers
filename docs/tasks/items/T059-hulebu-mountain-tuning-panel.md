# T059：胡了卜随机牌山调参面板

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：T058 已完成 20 关骨架和第二 Boss，但密集牌山生成器的牌量、随机种子、同列堆叠、`胡` 包和字牌比例仍偏写死。用户确认这些配置可以后续真正在正式游戏构建时继续调整，因此当前原型需要先提供一个调参入口。
- 目标：在 `config-playable` 原型中加入开发用密集牌山调参面板，并让生成器读取 URL / 面板参数，支持快速调整随机种子、牌量、同列堆叠深度、`胡` 包数量和字牌权重。
- 不做：不做正式玩家设置页，不做完整关卡编辑器，不做最终平衡，不新增 Cocos/GDevelop 工程，不接 Web 站点路由。
- 依赖：T058
- 主要文件范围：`packages/shared/src/mahjong-config.test.ts`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/docs/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T059-hulebu-mountain-tuning-panel.md`, `docs/tasks/claims/T059-codex.md`
- 验证方式：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /private/tmp/hulebu-config-playable-script.js`; 浏览器桌面端检查调参面板和第 20 关密集牌山；浏览器 390px 移动端检查；`npm run docs:sync`; `git diff --check`
- 进展：
  - 2026-05-25：开始任务，先用共享配置测试锁定 URL 调参参数能驱动密集牌山生成，再实现原型面板。
  - 2026-05-25：已新增密集牌山开发用调参面板，支持随机种子、牌量、同列堆叠深度、`胡` 包数量和字牌权重。
  - 2026-05-25：已支持 `seed`、`tiles`、`stack`、`hu`、`honor` URL 参数，并补充共享配置回归测试覆盖第 20 关调参生成。
  - 2026-05-25：已通过共享测试、类型检查、原型脚本语法检查、桌面和窄屏浏览器检查，进入待验收。
