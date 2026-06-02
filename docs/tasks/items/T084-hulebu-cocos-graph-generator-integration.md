# T084：胡了卜 Graph-based 牌山生成器 Cocos 接入

- 优先级：P1
- 默认负责人：Lee
- 状态：待验收
- 背景：T083 已在共享层完成 Graph-based 牌山生成器、模板注册表、参数归一化和 8 个核心模板，但 Cocos 当前仍使用本地 `createHulebuRandomMountainLevelConfig` 随机柱式生成器。用户已经确认继续推进正式底层方案，需要把共享生成结果接回 Cocos，避免继续调旧随机柱方案。
- 目标：将 `generateHulebuMountain(...).levelTiles` 转换为 Cocos 当前 `HulebuLevelTileConfig`，让 Cocos 默认 20 关优先消费 Graph-based 牌山输出；保留现有 Cocos 渲染、点击、8 格槽、`胡 / 杠 / 碰 / 吃`、通关提示和奖励节点流转。
- 不做：不重做最终 UI 美术、不做奖励效果真实生效、不做 Boss 目标 UI 完整落地、不接 Web 站内 iframe、不做发布包、不做完整 20 关数值平衡、不改 Cocos 编辑器场景节点结构。
- 依赖：T079, T080, T081, T082, T083
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/tasks/items/T084-hulebu-cocos-graph-generator-integration.md`, `docs/tasks/claims/T084-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/progress/2026-05-29.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/config/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 验证方式：`npm run test -w packages/shared -- mahjong-mountain-generator`; `npm run test -w packages/shared -- mahjong-cocos-project`; `npm run typecheck -w packages/shared`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T084-hulebu-cocos-graph-generator-integration.md docs/tasks/claims/T084-lee.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check`
- 进展：
  - 2026-05-29：新增任务并领取；范围锁定为 Cocos 关卡生成适配、共享结构测试和模块文档。
  - 2026-05-29：已将 Cocos 默认 20 关接入共享 Graph-based 生成器，8 个核心模板按关卡轮换，并保留现有 Cocos runtime 流程。

- 验证结果：
  - `npm run test -w packages/shared -- mahjong-mountain-generator`：通过，1 个测试文件、15 个测试。
  - `npm run test -w packages/shared -- mahjong-cocos-project`：通过，1 个测试文件、13 个测试。
  - `npm run typecheck -w packages/shared`：通过。
  - `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`：通过。

- 遗留问题：仍需用 Cocos Web Preview 手机视口目检不同模板的读牌压力；奖励效果真实生效、Boss 目标进度、槽位同款图片和最终动效继续后置。
