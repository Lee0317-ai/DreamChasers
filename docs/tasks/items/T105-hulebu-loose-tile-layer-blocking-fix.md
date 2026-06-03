# T105：胡了卜震落牌平铺和遮挡点击修复

- 优先级：P0
- 负责人：Lee
- 默认负责人：Lee
- 状态：待验收
- 依赖：T101, T102, T104
- 提出来源：IDEA-20260603-01
- 涉及模块：胡了卜 / 默认玩家 Demo / 开山震落牌 / 遮挡点击判定 / Web 静态发布副本
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T105-hulebu-loose-tile-layer-blocking-fix.md`, `docs/tasks/claims/T105-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `apps/web/src/app/tools/**`, `apps/web/src/modules/tools/**`, `apps/web/src/components/tools/**`, `apps/web/src/lib/ai/**`, `apps/web/src/lib/analytics/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; `npm run test -w apps/web -- hulebu`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开 `/games/hulebu` 检查连续 `杠 / 胡` 后震落牌不互相叠起、被盖住的下层牌不可点；390px 移动端截图检查牌面、记牌器、动作栏、卡槽和底部道具不遮挡；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T105-hulebu-loose-tile-layer-blocking-fix.md docs/tasks/claims/T105-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-03-lee.md`; `git diff --check`

## 背景

Lee 试玩站内发布版时反馈两个直接影响可玩可信度的问题：

- 重复几次 `胡` 和 `杠` 后，震落到桌面的牌会自己叠起来。
- 视觉上下面的牌已经被盖住，但仍然可以点击。

这两个问题都落在开山震落牌的落点、层级和运行态遮挡判定上，需要作为独立 Bugfix 处理。

## 目标

- 震落牌进入桌面平铺层，连续多次开山也不能互相堆叠。
- 震落牌清理旧堆叠列、桥接和 blocker 元数据，不再参与原牌山压顶结构。
- 震落牌自身仍可点击入槽。
- 被普通牌或震落牌明显盖住的下层普通牌不可点击。
- 默认 HTML 原型和 `/games/hulebu-demo/index.html` 静态副本保持同步。

## 不做

- 不修改 Cocos 正式工程。
- 不修改共享 Graph-based 生成器。
- 不调整 `杠` 震落 1 张、`胡` 震落 3 张的数量。
- 不改变牌河、补杠、胡牌或记牌器玩法口径。
- 不新增正式动画、音效或美术。

## 验收标准

- 回归测试能复现并锁定多次震落牌不重叠。
- 回归测试能锁定被震落牌覆盖的下层普通牌不可点击。
- 回归测试能锁定震落牌自身仍可点击。
- 静态发布副本与原型行为同步。
- 桌面和 390px 移动端浏览器检查无明显布局回退。
- 测试、脚本语法、文档同步、占位符扫描和 diff 检查通过。

## 进展

- 2026-06-03：已创建任务并领取，准备先补失败用例复现震落牌堆叠和下层牌误点击。
- 2026-06-03：已按 TDD 修复。震落牌使用全局递增平铺序号，连续多次 `杠 / 胡` 不再复用同一组落点；震落牌会清理旧堆叠列、桥接和 blocker 元数据。
- 2026-06-03：运行态遮挡判定已恢复“震落牌可以盖住普通牌”的规则；震落牌自身仍保持可点击入槽。站内静态副本已同步并保留 `/games/hulebu-demo/config/*.json` 绝对路径。
- 2026-06-03：验证通过：共享测试、Web 接入测试、HTML 脚本语法检查、Kimi WebBridge 行为检查、390px Chrome 截图和 DOM 布局检查。
