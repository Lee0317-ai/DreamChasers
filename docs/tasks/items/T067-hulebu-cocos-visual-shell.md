# T067：胡了卜 Cocos 首屏目标图视觉壳

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：用户给出 `output/imagegen/mahjong-roguelike-ui-concept-v1.png` 作为最终目标图，当前 Cocos 预览已经能按手机尺寸显示占位牌山、HUD、组合按钮和 8 格主槽，但仍是黑底和简单占位块，视觉方向不够接近最终游戏。
- 目标：在 Cocos 首屏建立目标图方向的运行时视觉壳第一版：绿色牌桌背景、顶部信息牌、右侧三枚工具按钮、底部木质 8 格槽、组合按钮位置优化和更温润的占位配色。
- 不做：不接最终 AI 图片资源，不做完整牌面 prefab，不实现点击入槽、真实配置、奖励三选一交互、动画、音效、发布包，不修改 Web 原型或 Next.js 站点。
- 依赖：T066
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T067-hulebu-cocos-visual-shell.md`, `docs/tasks/claims/T067-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/progress/2026-05-26.md`, `docs/completion/2026-05-26-task-T067-hulebu-cocos-visual-shell.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 进展：
  - 2026-05-26：新增任务，目标是把 Cocos 首屏从黑底占位推进到目标概念图方向的视觉壳第一版。
  - 2026-05-26：已在 Cocos 运行时绘制绿色牌桌背景、顶部关卡/分数/进度牌、右侧洗牌/撤回/提示按钮、底部木质 8 格槽，并保留测试牌山、HUD 和组合按钮。
  - 2026-05-26：修复 Web Preview 只显示 Cocos 默认启动图的问题：`GameSceneController` 启动时会自动创建 `RuntimeCamera`，绑定到 `Canvas.cameraComponent`，并设置正交投影、清屏色和可见层。
  - 2026-05-26：已在 Chrome 的 Cocos Web Preview 手机视口中确认首屏显示胡了卜牌山、绿色桌面、右侧工具按钮和 8 格卡槽。
