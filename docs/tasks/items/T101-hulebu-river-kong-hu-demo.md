# T101：胡了卜有限牌河、补杠和胡牌奖励试玩 Demo

- 优先级：P1
- 负责人：Lee
- 默认负责人：Lee
- 状态：待验收
- 依赖：T093, T097, T098, T099, T100
- 提出来源：IDEA-20260602-03
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 有限牌河 / 补杠 / 胡牌奖励
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T101-hulebu-river-kong-hu-demo.md`, `docs/tasks/claims/T101-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-06-02-hulebu-river-kong-hu-demo.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查牌河、任选打牌、明牌区、补杠、明杠开山和胡后清河；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T101-hulebu-river-kong-hu-demo.md docs/tasks/claims/T101-lee.md docs/superpowers/plans/2026-06-02-hulebu-river-kong-hu-demo.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`; `git diff --check`

## 背景

T100 已确认新核心规则：`牌山探索 + 手牌管理 + 麻将组合 + 有限容错`。Lee 确认这套方向后，需要先在当前 HTML 试玩 Demo 中落地最小可玩版本，让朋友能直接体验有限牌河、明碰区、补杠、明杠开山、胡牌奖励和听牌目标感。

## 目标

- 增加有限牌河，玩家点击 `打牌/丢弃` 后可选择卡槽中的任意 1 张牌进入牌河。
- 增加明牌区，`碰` 后展示已碰组合，后续第 4 张同牌可触发 `补杠`。
- 区分 `补杠` 和 `明杠`：补杠只是孤张出口，明杠触发开山奖励。
- 控制开山强度：直接 `杠` 震落 1 张压顶牌；`胡` 震落 3 张压顶牌。
- 胡牌作为局内爆发奖励，清空手牌并清理牌河 1 张。
- 满槽失败判定纳入牌河容量：槽满但牌河未满时先提示打牌，槽满、无组合、牌河满且无救场时失败。
- 记牌器口径改为只统计牌山中的 `board` 牌；震落到桌面的牌仍计入，进入卡槽、牌河、明牌区或移除区后不再计入。
- `吃 / 碰 / 杠 / 补杠 / 胡` 按钮拆成独立动作栏，不再和 8 格卡槽挤在同一行。
- 默认玩家页隐藏内部标题栏，HUD 压成小状态条；牌面保持可读，记牌器改为每个牌面格上下两层显示，上方是牌面、下方是余下数量。
- 补充自动化测试和浏览器验证，保证 demo 可试玩。

## 不做

- 不修改 Cocos 正式工程。
- 不修改正式关卡 JSON 或共享 Graph-based 生成器。
- 不实现完整麻将胡牌算法、番型结算、真实摸打流程或最终美术动画。
- 不实现复杂 Roguelike 奖励池、广告、账号、排行榜或部署。
- 不扩大到 PDF 工具箱、AI 修图、AI 搜索、埋点、Web 站点或部署文件。

## 验收标准

- 默认玩家 Demo 可见牌河和明牌区。
- `丢弃/打牌` 不再自动丢末尾牌，而是进入选择模式，由玩家点选卡槽牌。
- `碰` 后明牌区出现对应组合；拿到第 4 张同牌时可 `补杠`。
- 直接 4 张同牌 `杠` 会触发开山推进，压顶牌会震落 1 张为桌面可选牌，补杠不会触发强开山。
- `胡` 清空手牌并清理牌河 1 张。
- `胡` 会震落 3 张可选牌，不继续沿用更高开山数量，避免连续胡导致难度过低。
- 槽内距离 `3 + 3 + 2` 只差 1-2 张时显示简化 `听/差` 提示，并在记牌器高亮牌山仍有的目标牌。
- 记牌器只统计牌山剩余牌，卡槽、牌河、明牌区和移除区不参与计数；入槽后对应点数立即从记牌器扣除。
- 组合动作按钮位于独立动作栏；卡槽行只保留 8 格卡槽，移动端底部道具栏不遮盖卡槽。
- 默认玩家页首屏优先展示动作栏、卡槽和道具栏；桌面和 390px 移动端都不需要滚动才能操作核心按钮，同时牌面和记牌器数字需要保持可读。
- 第 5-10 关生成器输出并检查孤张风险预算，实际风险不得超过对应关卡预算。
- 槽满但牌河未满时不会立即失败；槽满、无组合、牌河满且无救场时失败。
- 共享测试、HTML 脚本语法检查、浏览器验证、文档同步、占位符扫描和 diff 检查通过。

## 进展

- 2026-06-02：已创建任务并领取，准备按 TDD 改造 HTML 试玩 Demo。
- 2026-06-02：已完成默认玩家 Demo 的有限牌河、任选槽位打牌、明牌区、碰后补杠、直接明杠开山、胡后清河和满槽失败判定调整。
- 2026-06-02：已补充静态与 VM 回归测试，并通过 Kimi WebBridge 浏览器 smoke test。待 Lee 实际试玩验收手感和难度。
- 2026-06-02：根据 Lee 试玩第 5 关反馈修正正式关生成节奏：第 5-10 关自然明杠包提高到每关 2 个；生成器会把明杠目标牌面从普通填充组中保留出来，避免同一牌面被拆成多个 3 张组。Kimi WebBridge 验证第 5 关可在真实流程第 3 步出现 `杠` 候选。
- 2026-06-02：补齐 T100 第一阶段剩余项：默认玩家 Demo 已显示简化 `听/差` 胡牌提示，记牌器会高亮牌山仍有的目标牌；第 5-10 关生成器新增孤张风险预算检查。Kimi WebBridge 验证 `听：9筒`、`差：2条 / 9筒 可胡` 和第 5 关孤张风险 `1/1`。
- 2026-06-02：按 Lee 对 `杠开山` 的玩法理解修正反馈：明杠和胡牌开山不再把压顶牌直接移出局，而是把压顶牌震落到桌面平铺层，保留为可随时点击入槽的 `board` 牌，同时解除它们对下层牌的阻挡。Kimi WebBridge 验证 `杠` 后震落牌按钮可点，点击后进入卡槽。
- 2026-06-02：根据 Lee 试玩反馈修正记牌器和动作区：记牌器只统计牌山 `board` 牌，卡槽/牌河/明牌/移除牌不计入；`吃 / 碰 / 杠 / 补杠 / 胡` 拆到卡槽上方独立动作栏，卡槽行只保留 8 格槽。Kimi WebBridge 验证入槽前 `万 1`、入槽后 `万 0`；390px headless Chrome 验证无横向溢出、按钮文字不挤出、底部道具栏不遮盖卡槽。
- 2026-06-02：根据 Lee 发布前反馈继续调整开山强度和一屏布局：直接 `杠` 震落 1 张，`胡` 震落 3 张；默认玩家页隐藏内部标题栏，修正旧 grid 行强制撑高记牌器的问题，牌面放大到 390px 下约 `40x54`，记牌器每个牌面格改成上方牌面、下方剩余数量。Kimi WebBridge 桌面验证动作栏、卡槽、道具均在 iframe 首屏内；390px Playwright 截图验证动作栏、卡槽和底部道具栏互不遮盖，截图保存到 `/tmp/hulebu-t102-mobile-counter-split-final.png`。
