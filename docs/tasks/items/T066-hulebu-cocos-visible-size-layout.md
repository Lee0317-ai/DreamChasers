# T066：胡了卜 Cocos 真实可见尺寸自适应

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：已完成
- 背景：Cocos Creator 预览器切到 iPhone 机型后，实际可见画布大约是 `375 x 741`，与项目写死的 `390 x 844` 仍不一致，导致首屏内容继续偏小、偏下。
- 目标：把 Cocos 首屏布局改成按运行时可见尺寸自适应，不再依赖固定手机常量。让测试牌山、8 格主槽、组合按钮和 HUD 都按当前预览器或真机可见尺寸自动重排。
- 不做：不改真实关卡配置，不接最终美术，不实现完整点击入槽和组合结算，不做动画、音效、发布包，不修改 Web 原型或 Next.js 站点。
- 依赖：T065
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T066-hulebu-cocos-visible-size-layout.md`, `docs/tasks/claims/T066-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/progress/2026-05-26.md`, `docs/completion/2026-05-26-task-T066-hulebu-cocos-visible-size-layout.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 进展：
  - 2026-05-26：新增任务，目标是把首屏布局从固定竖屏常量改成按运行时可见尺寸计算。
  - 2026-05-26：完成 Cocos 首屏运行时可见尺寸自适应。`GameSceneController` 会读取 `game.canvas.clientWidth/clientHeight`、`view.getVisibleSize()` 和 DPR，输出统一运行时布局；Board/Slot/Combo/HUD Binder 统一按该布局缩放和定位。
  - 2026-05-26：修复 Cocos 预览中因新建 `utils` 目录触发资产缓存/导入残留而导致的 `Missing class` 问题；最终把运行时布局工具收回既有 `HulebuSampleSceneModel.ts`，避免新增脚本目录造成编辑器资源库不一致。
  - 2026-05-26：已在 Cocos Web Preview iPhone 机型中复核：HUD 位于顶部，牌山居中，组合按钮和 8 格主槽位于底部，浏览器日志未再出现新的 `Missing class`。
  - 2026-05-26：已通过 `npm run test -w packages/shared -- mahjong-cocos-project` 和 `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`。
