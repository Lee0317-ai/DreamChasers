# T072：胡了卜 Cocos 真实配置首关接入

- 优先级：P1
- 默认负责人：Codex / 开发 B
- 状态：待验收
- 背景：T070 已修复 Cocos 测试首屏的点击后遮挡解锁和槽位牌名显示，但当前 `GameSceneController` 仍默认加载本地手写测试牌山，无法验证真实 `levels.json` 配置与 Cocos 表现层的接入链路。
- 目标：让 Cocos Web Preview 默认从真实第 1 关配置创建首屏 scene model，并继续支持点击可用牌进入 8 格主槽、刷新 HUD 和执行基础 `碰 / 吃 / 杠 / 胡` 消除。
- 不做：不做 20 关选择器，不做奖励三选一，不做 Boss 目标进度，不接最终 SpriteFrame prefab，不做动画、音效、发布包、Web 站点接入或完整可解路径搜索。
- 依赖：T070
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T072-hulebu-cocos-real-config-level.md`, `docs/tasks/claims/T072-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`, `docs/superpowers/plans/2026-05-27-hulebu-cocos-real-config-level.md`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证方式：`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`; Cocos Web Preview 手机视口手动点击检查。
- 进展：
  - 2026-05-27：新增任务，目标是把 Cocos 当前测试首屏切到真实第 1 关配置和最小规则状态。
  - 2026-05-27：新增 `HulebuLevelConfig`、`HulebuRuntimeState` 和 `HulebuConfiguredSceneModel`，Cocos Web Preview 默认加载真实第 1 关 `validation_intro_peng`。
  - 2026-05-27：`GameSceneController` 已新增 `loadConfiguredLevelOnStart`，启动时优先加载真实配置；点击和 `胡 / 杠 / 碰 / 吃` 按钮通过 runtime state 刷新 scene model，旧 sample scene 作为 fallback 保留。
  - 2026-05-27：`mahjong-cocos-project` 测试已补充真实首关配置对齐检查，锁定 Cocos 内嵌首关与 `apps/game/mahjong-roguelike/config/levels.json` 第 1 关关键字段一致。
  - 2026-05-27：已在 Cocos Web Preview 手机视口验证：首屏显示 3 张上层 `9筒` 压住 3 张下层 `2万`；点击三张 `9筒` 后下层 `2万` 恢复可点，`碰 1` 激活；执行 `碰` 后三张 `9筒` 从槽位清除，下层 `2万` 保留并可继续入槽。
  - 2026-05-27：当前仍使用程序化占位牌面和首关内嵌配置，后续需要继续接最终 SpriteFrame prefab、关卡流、奖励三选一和 Boss 目标进度。
