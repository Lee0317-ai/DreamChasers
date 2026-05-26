# T065：胡了卜 Cocos 手机竖屏首屏适配

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：已完成
- 背景：T063 已让 Cocos 首屏能显示，但用户切到 iPhone 预览后发现牌山过小且靠下，说明当前占位布局仍按桌面横屏/大画布坐标设计，不适合手机游玩。
- 目标：把 Cocos 首屏占位布局改为手机竖屏优先，采用 390x844 设计基准；牌山居中偏上，8 格主槽底部居中，组合按钮在底部安全区，HUD 压缩到顶部。
- 不做：不导入最终美术，不实现完整点击入槽和组合结算，不做动画、音效、发布包，不修改 Web 原型或 Next.js 站点。
- 依赖：T063
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T065-hulebu-cocos-mobile-first-screen.md`, `docs/tasks/claims/T065-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/progress/2026-05-26.md`, `docs/completion/2026-05-26-task-T065-hulebu-cocos-mobile-first-screen.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 进展：
  - 2026-05-26：开始任务，已确认首屏显示问题来自桌面横屏坐标和手机竖屏预览不匹配。
  - 2026-05-26：已完成 390x844 手机竖屏首屏基准；项目设置加入移动设计分辨率，测试牌山、槽位、按钮和 HUD 已按手机竖屏重排。
