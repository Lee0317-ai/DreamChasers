# T102：胡了卜 Demo 站内网页小游戏发布接入

- 优先级：P1
- 负责人：Lee
- 默认负责人：Lee
- 状态：待验收
- 依赖：T025, T093, T101
- 提出来源：IDEA-20260602-05
- 涉及模块：胡了卜 / Web 游戏接入 / Next.js 游戏站 / 静态试玩发布
- 主要文件范围：`apps/web/src/app/games/hulebu/page.tsx`, `apps/web/src/modules/games/hulebu/**`, `apps/web/public/games/hulebu-demo/**`, `apps/web/src/components/portal-data.ts`, `apps/web/src/components/AppHeader.tsx`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T102-hulebu-web-game-publish.md`, `docs/tasks/claims/T102-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `apps/web/src/app/tools/**`, `apps/web/src/modules/tools/**`, `apps/web/src/components/tools/**`, `apps/web/src/lib/ai/**`, `apps/web/src/lib/analytics/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：`npm run test -w apps/web -- hulebu`; `npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开 `/games/hulebu` 检查桌面和移动端 iframe 可玩、无横向溢出；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T102-hulebu-web-game-publish.md docs/tasks/claims/T102-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`; `git diff --check`

## 背景

T101 默认玩家 Demo 已可以发布和试玩。当前目标不是替换正式 Cocos 主线，而是先把已有 HTML demo 放进游戏站，让朋友能通过 `/games/hulebu` 直接体验。

## 目标

- 新增 `/games/hulebu` 站内游戏页，打开即能试玩胡了卜。
- 将当前 HTML demo 复制到 `apps/web/public/games/hulebu-demo/`，作为静态发布资源。
- `/games` 麻将卡片和搜索入口指向 `/games/hulebu`。
- 游戏页隐藏全站导航或使用极简容器，避免挤压 iframe 试玩区域。
- 保留 demo 内部 `调牌器` 链接可用，便于后续内部调参。

## 不做

- 不把 HTML demo 重写成 React 组件。
- 不修改 Cocos 正式工程。
- 不接排行榜、账号、支付、广告、埋点或线上 Nginx 配置。
- 不扩大到 PDF 工具箱、AI 修图、AI 搜索或部署基础设施。

## 验收标准

- `/games/hulebu` 可访问，首屏为实际可玩的胡了卜 demo，不是纯介绍页。
- 站内静态资源 `/games/hulebu-demo/index.html` 可访问，`tuner.html` 链接可用。
- `/games` 的麻将卡片和搜索入口均指向 `/games/hulebu`。
- 桌面端 iframe 可见且能加载 demo。
- 390px 移动端无横向溢出，iframe 不被全站导航压缩。
- `apps/web` 测试、lint、typecheck、build、浏览器检查、文档同步、占位符扫描和 diff 检查通过。

## 进展

- 2026-06-02：已创建任务并领取，准备按 TDD 接入站内静态游戏页。
- 2026-06-02：已新增 `/games/hulebu` Next.js 路由和 `apps/web/src/modules/games/hulebu/` 游戏页组件，用 iframe 加载 `/games/hulebu-demo/index.html`，并在该路由隐藏全站导航以释放游戏视口。
- 2026-06-02：已把当前 HTML Demo、调牌器和配置复制到 `apps/web/public/games/hulebu-demo/`；静态副本的关卡/奖励 fetch 改为 `/games/hulebu-demo/config/*.json` 绝对路径，保证站内直接访问可加载配置。
- 2026-06-02：已更新 `/games` 麻将卡片和搜索入口到 `/games/hulebu`，保留调牌器链接 `/games/hulebu-demo/tuner.html`。
- 2026-06-02：T102 静态发布副本已同步 T101 最新反馈：`杠` 震落 1 张、`胡` 震落 3 张，默认玩家页隐藏内部标题栏、保留可读牌面，并把记牌器改成每格上方牌面、下方余牌数量。
- 2026-06-02：验证通过 `npm run test -w apps/web -- hulebu`、`npm run lint -w apps/web`、`npm run typecheck -w apps/web`、`npm run build -w apps/web`。Kimi WebBridge 桌面检查 `/games/hulebu` iframe 可加载，动作栏、卡槽和道具在首屏内；390px Playwright 检查无横向溢出，动作栏、卡槽和底部道具互不遮盖，截图保存到 `/tmp/hulebu-t102-mobile-counter-split-final.png`。
