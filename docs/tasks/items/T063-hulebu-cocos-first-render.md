# T063：胡了卜 Cocos 首屏自动渲染

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：已完成
- 背景：用户已在 Cocos Creator 3.8.8 中创建 `HulebuGameScene.scene` 并搭好节点结构，也已开始绑定脚本和引用。当前工程脚本只定义边界，不会在运行时自动生成测试牌山、槽位、按钮和 HUD。
- 目标：让 Cocos 场景在脚本绑定完成后，点击播放即可显示一版占位首屏：测试牌山、8 格主槽、`胡 / 杠 / 碰 / 吃` 按钮和基础 HUD。
- 不做：不导入最终牌面美术，不实现完整点击入槽/组合结算，不做动画、音效、资源加载器、发布包，不修改 Web 原型或 Next.js 站点。
- 依赖：T062
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T063-hulebu-cocos-first-render.md`, `docs/tasks/claims/T063-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/progress/2026-05-26.md`, `docs/completion/2026-05-26-task-T063-hulebu-cocos-first-render.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 进展：
  - 2026-05-25：开始任务，用户已确认场景骨架和脚本配置完成，下一步由代码侧补首屏自动渲染。
  - 2026-05-26：已完成首屏自动渲染占位实现：`GameSceneController` 自动加载测试 scene model，Board/Slot/Combo/HUD Binder 可自动创建最小可视 UI；工程结构测试、Cocos 脚本检查、共享回归、类型检查、文档同步和 diff 检查通过。
  - 2026-05-26：根据 Creator 预览截图修正占位 UI 坐标系，测试首屏改为 1280x720 左下角原点可见布局，避免牌山和按钮被挤到左下角外侧。
