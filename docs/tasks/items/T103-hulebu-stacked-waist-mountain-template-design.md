# T103：胡了卜立体窄腰牌山模板设计

- 优先级：P1
- 负责人：Lee
- 默认负责人：Lee
- 状态：已完成
- 依赖：T095, T096, T101, T102
- 提出来源：IDEA-20260602-07
- 涉及模块：胡了卜 / 密集牌山模板 / 默认玩家 Demo / 调牌器 / 后续 Cocos 牌山生成器
- 主要文件范围：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T103-hulebu-stacked-waist-mountain-template-design.md`, `docs/tasks/claims/T103-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-02-hulebu-stacked-waist-mountain-template-design.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`
- 禁止修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/web/**`, `packages/shared/**`, `deploy/**`, PDF 工具箱、AI 修图、AI 搜索、埋点和平台部署相关文件
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T103-hulebu-stacked-waist-mountain-template-design.md docs/tasks/claims/T103-lee.md docs/superpowers/specs/2026-06-02-hulebu-stacked-waist-mountain-template-design.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`; `git diff --check`

## 背景

Lee 提供了一张“羊了个羊”式高堆叠参考图。该图的可借鉴点不是美术、牌面或具体关卡，而是结构：上层大平台制造压迫感，中段窄腰形成释放瓶颈，底部支撑柱提供后期解锁目标，侧向散牌制造干扰和恢复入口。

当前胡了卜已有中心塔、双翼、十字、环形、长墙、群岛、峡谷、阶梯等模板，但默认朋友 Demo 仍偏平面模板组合。T103 先把新的立体窄腰模板设计清楚，再决定后续是否落到调牌器和默认高压关。

## 目标

- 抽象参考图中可借鉴的堆叠结构，形成胡了卜自己的模板方向。
- 明确不可照搬范围：不复制原图美术、颜色、牌面符号、文案和具体布局。
- 设计一个可实现的 `悬台窄腰` 模板规格。
- 明确模板参数：上层平台宽度、窄腰宽度、支撑柱数量、侧向散牌比例、入口数量、层深和遮挡压力。
- 明确玩法用途：适合第 8-10 关、Boss 关或调牌器压测，不直接替换第 5 关正式入门。
- 明确后续实现边界：先做调牌器可选模板，再做默认高压关随机池，最后再考虑沉淀到 Cocos 共享生成器。

## 不做

- 不直接修改 HTML Demo 或 `/games/hulebu` 静态发布副本。
- 不修改 Cocos 正式工程或共享生成器代码。
- 不重做最终美术、动画、音效或牌面资源。
- 不调整 T101 当前 `杠 / 胡 / 记牌器 / 动作栏` 玩法。
- 不扩大到 PDF 工具箱、AI 修图、AI 搜索、埋点或部署文件。

## 验收标准

- 设计规格说明参考图可借鉴结构点和必须规避的照搬点。
- 规格给出 2-3 个模板方案并明确推荐方案。
- 推荐方案包含结构层级、参数范围、难度用途、首轮入口目标、读牌可见性约束和失败风险。
- 规格说明后续实现文件范围、测试方式、调牌器验收方式和是否同步发布副本的判断条件。
- 模块 README、PROGRESS、HANDOFF 和当天进展同步 T103 状态。
- `docs:sync`、占位符扫描和 `git diff --check` 通过。

## 进展

- 2026-06-02：已登记 Lee 的参考图反馈并创建 T103，先做牌山模板设计规格，不直接改当前发布版 Demo。
- 2026-06-02：已产出设计确认稿 `docs/superpowers/specs/2026-06-02-hulebu-stacked-waist-mountain-template-design.md`，推荐先做 `悬台窄腰 / suspended-waist` 模板，落地顺序为调牌器验证、再进第 8-10 关随机池、最后再评估是否同步发布副本和 Cocos 共享生成器。Lee 已确认设计方向，T103 关闭；后续实现由 T104 承接。
