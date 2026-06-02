# T102 胡了卜 Demo 站内网页小游戏发布接入完成记录

- 任务编号：T102
- 负责人：Lee
- 完成日期：2026-06-02
- 状态：待验收

## 修改文件

- `apps/web/src/app/games/hulebu/page.tsx`
- `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`
- `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`
- `apps/web/public/games/hulebu-demo/index.html`
- `apps/web/public/games/hulebu-demo/tuner.html`
- `apps/web/public/games/hulebu-demo/config/levels.json`
- `apps/web/public/games/hulebu-demo/config/rewards.json`
- `apps/web/src/components/portal-data.ts`
- `apps/web/src/components/AppHeader.tsx`
- `docs/tasks/items/T102-hulebu-web-game-publish.md`
- `docs/tasks/claims/T102-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-02-lee.md`
- `docs/completion/2026-06-02-task-T102-hulebu-web-game-publish.md`

## 实现内容

- 新增 `/games/hulebu` Next.js 页面，使用独立游戏页组件嵌入静态 HTML Demo。
- 游戏页使用极简顶部栏，iframe 首屏加载 `/games/hulebu-demo/index.html`，避免全站导航压缩游戏视口。
- 将当前 `config-playable` Demo、调牌器和配置复制为 `apps/web/public/games/hulebu-demo/` 静态资源。
- 静态 Demo 的配置加载路径改为 `/games/hulebu-demo/config/*.json`，保证站内直接访问可加载关卡和奖励。
- 更新游戏站麻将卡片和搜索入口，指向 `/games/hulebu`。
- T102 静态副本已同步 T101 最新玩法：`杠` 震落 1 张、`胡` 震落 3 张；记牌器按上方牌面、下方数量显示。

## 验证命令

- `npm run test -w apps/web -- hulebu`
- `npm run lint -w apps/web`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- Kimi WebBridge 桌面检查 `/games/hulebu`
- 390px Playwright 移动端检查 `/games/hulebu`
- `npm run docs:sync`
- `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T102-hulebu-web-game-publish.md docs/tasks/claims/T102-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`
- `git diff --check`

## 验证结果

- `npm run test -w apps/web -- hulebu`：3 tests passed。
- `npm run lint -w apps/web`：0 errors；17 warnings，均来自既有 Prisma generated 文件的 unused eslint-disable。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过，产物包含静态路由 `/games/hulebu`。
- Kimi WebBridge 桌面检查：`/games/hulebu` 可打开，iframe 加载 `/games/hulebu-demo/index.html`，动作栏、卡槽和道具位于 iframe 首屏内，无横向溢出。
- 390px Playwright 检查：无横向溢出；动作栏、卡槽和底部道具互不遮盖；牌面约 `40x54`；记牌器每格上方牌面、下方余牌数量。截图保存到 `/tmp/hulebu-t102-mobile-counter-split-final.png`。

## 遗留问题

- 本任务只做站内网页试玩接入，不包含线上部署、域名、Nginx 或缓存配置。
- 未接排行榜、账号、广告、埋点或支付。
- 静态副本需要在 T101 Demo 继续调整后手动同步，后续可再拆自动同步脚本或构建流程。
