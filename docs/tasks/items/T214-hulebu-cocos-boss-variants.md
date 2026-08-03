# T214 胡了卜 Cocos Boss 变体基础

- 任务编号：T214
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T196 已让 Cocos 支持第 10/20 关 Boss 目标基础；Web 完整版已具备普通、终局、高阶、无尽和每日 Boss 变体口径。Cocos 当前 Boss 仍只显示基础目标摘要，无法体现不同 run mode 下 Boss 压力差异。

## 目标

1. Cocos 配置层新增第一版 Boss 变体配置。
2. 根据 run profile 和关卡序号选择普通、终局、高阶、无尽或每日 Boss 变体。
3. Boss 变体可为本关追加轻量目标补丁。
4. Cocos HUD 摘要显示 Boss 变体名称，便于玩家识别当前 Boss 类型。
5. 不改完整 Boss 阶段动画、结算复盘或最终 Boss 卡面。
6. 补充静态和 runtime 回归测试。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-214-hulebu-cocos-boss-variants.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或静态 Demo。
- 不接账号同步、云存档或 Boss 结算复盘。
- 不做完整 Boss 阶段动画、Boss 卡面美术或失败分析页。
- 不改变非 Boss 关通关逻辑。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- 配置层存在 Boss 变体配置和选择 helper。
- 主线第 10/20 关能区分中段试炼和终局 Boss。
- 高阶、无尽、每日 run 能获得对应 Boss 变体。
- Boss 变体名称进入 Cocos HUD 摘要。
- 至少一个变体目标补丁能影响 runtime 的 Boss 完成判断。
- 回归测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成记录

- 完成时间：2026-06-29
- 实现内容：
  - 新增 `HulebuBossVariantConfig` 和 `HULEBU_BOSS_VARIANTS`，覆盖主线中段、终局、高阶、无尽和每日 Boss 变体。
  - 新增 `getHulebuBossVariantForRun()` 与 `createHulebuRuntimeLevelForRun()`，根据 run profile 和显示关卡序号选择 Boss 变体，并把变体轻量目标补丁合入 runtime level。
  - Cocos 关卡启动链路改为传入 run profile 与 display order，确保高阶、无尽、每日 Boss 可获得正确变体。
  - Boss HUD 摘要由固定 `Boss` 改为显示当前变体名称，例如 `章节 Boss 0/3`。
  - 补充共享回归测试，覆盖变体配置、选择 helper、目标补丁和 HUD 文案。
- 验证结果：
  - 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
  - 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
  - 通过：`npm run docs:sync`
  - 通过：`git diff --check`
