# T072：胡了卜 Cocos 真实配置首关接入完成记录

- 任务编号：T072
- 负责人：Codex / 开发 B
- 完成时间：2026-05-27
- 状态：待验收

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts.meta`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config.meta`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts.meta`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime.meta`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts.meta`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T072-hulebu-cocos-real-config-level.md`
- `docs/tasks/claims/T072-codex.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/progress/2026-05-27.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/superpowers/plans/2026-05-27-hulebu-cocos-real-config-level.md`

## 实现内容

- 新增 Cocos 本地真实首关配置 `HulebuLevelConfig`，嵌入 `levels.json` 第 1 关 `validation_intro_peng` 的关键配置和默认槽位/工具参数。
- 新增 `HulebuRuntimeState`，支持按配置初始化牌山、判断 `blockedBy` 可点击状态、点击可用牌进入 8 格主槽、生成 HUD/组合按钮模型，并执行基础 `胡 / 杠 / 碰 / 吃` 消除。
- 新增 `HulebuConfiguredSceneModel`，把真实配置 runtime state 转换为现有 Cocos scene model。
- `GameSceneController` 新增 `loadConfiguredLevelOnStart`，启动时默认加载真实配置；点击牌和组合按钮会优先路由到 runtime state，旧测试 scene model 作为 fallback 保留。
- `mahjong-cocos-project` 测试新增真实首关配置对齐检查，避免 Cocos 内嵌配置悄悄偏离 `levels.json` 第 1 关。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run test -w packages/shared -- mahjong`
- `npm run typecheck -w packages/shared`
- `npm run docs:sync`
- `git diff --check`
- Cocos Web Preview 手机视口手动点击检查

## 验证结果

- `mahjong-cocos-project` 测试通过，1 个测试文件、6 个测试通过。
- Cocos 工程脚本类型检查通过。
- `mahjong` 共享回归测试通过，5 个测试文件、37 个测试通过。
- `packages/shared` 类型检查通过。
- `docs:sync` 通过，同步 39 个任务分片和 38 个领取分片。
- `git diff --check` 通过。
- 已通过 Cocos Web Preview 手机视口手动检查：首屏显示 3 张上层 `9筒` 和 3 张下层 `2万`；下层 `2万` 初始受遮挡不可点；点击三张 `9筒` 后 `碰 1` 激活；执行 `碰` 后卡槽清空，下层 `2万` 保留并可继续入槽。

## 遗留问题

- 当前仍使用程序化绘制占位牌，尚未绑定最终青瓷麻将 SpriteFrame prefab。
- 当前只接入真实第 1 关配置，尚未支持 1-20 关关卡流、奖励三选一和 Boss 目标进度。
- 当前配置在 Cocos 侧以内嵌 TS 常量存在，后续需要继续决定是构建期同步 JSON，还是运行时读取资源配置。
