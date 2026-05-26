# T069：胡了卜 Cocos 首条点击可玩链路

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：Cocos Web Preview 已能显示胡了卜首屏视觉壳，但当前牌和组合按钮只是可视占位，点击无反馈，尚未形成可玩的第一条互动链路。
- 目标：在 Cocos 测试首屏中跑通 `点击可用牌 -> 进入 8 格主槽 -> 刷新 HUD/组合按钮 -> 点击胡/杠/碰/吃执行基础消除` 的最小闭环。
- 不做：不接真实关卡配置，不导入最终 Sprite prefab，不做动画、音效、奖励三选一、Boss 目标、失败救场、下一关流转、Web 站点接入或发布包。
- 依赖：T067
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T069-hulebu-cocos-playable-click-chain.md`, `docs/tasks/claims/T069-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/progress/2026-05-26.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`; Cocos Web Preview 手机视口手动点击检查。
- 进展：
  - 2026-05-26：新增任务，目标是解决 Cocos 首屏“点什么都没反应”的问题，先实现测试牌山的基础点击闭环。
  - 2026-05-26：已为 `BoardLayerBinder` 增加牌面触摸回调，只有 `interactable` 的测试牌会响应点击。
  - 2026-05-26：已为 `ComboBarBinder` 增加组合按钮触摸回调，满足候选时可点击 `胡 / 杠 / 碰 / 吃`。
  - 2026-05-26：已在 `GameSceneController` 中加入 8 格主槽测试状态，支持点击牌进入槽位、刷新 HUD、刷新组合按钮，并执行基础消除。
  - 2026-05-26：已在 Cocos Web Preview 手机视口手动验证：点击 `1万` 后进入第 1 个卡槽；继续点击 `7条 / 8条 / 9条` 后 `吃 1` 亮起；点击 `吃` 后三张条子从卡槽消除。
  - 2026-05-26：已通过共享回归、Cocos 脚本检查、文档同步和 `git diff --check`。
- 完成摘要：Cocos 测试首屏已从纯展示推进到首条可玩互动链路；当前仍未接真实关卡配置、最终 Sprite prefab、动画、奖励和下一关流转。
