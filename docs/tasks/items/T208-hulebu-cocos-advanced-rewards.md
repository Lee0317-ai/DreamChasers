# T208 胡了卜 Cocos 高阶专属奖励基础

- 任务编号：T208
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T205 已把 Cocos 高阶入口和四档 profile 接入，T207 已让四档风场在每关形成真实压力。但当前奖励节点仍只读取普通关卡 `rewardPool`，高阶 run 缺少和风场压力匹配的专属收益承接。

## 目标

1. 在 Cocos 配置层新增第一版高阶专属奖励。
2. 高阶奖励能复用现有 runtime 奖励状态，影响工具、备用槽、护符、铜钱或组合分数。
3. 高阶 run 的奖励节点优先展示当前风场对应奖励，并用普通奖励补足 3 个选项。
4. 补充静态和 runtime 测试，锁定高阶奖励配置、选择逻辑和实际效果。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-208-hulebu-cocos-advanced-rewards.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或静态 Demo。
- 不接账号同步、云存档或高阶解锁。
- 不做完整高阶能力槽装备系统。
- 不替换 Cocos 美术资源。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- Cocos 配置层存在高阶专属奖励配置和风场奖励池。
- 高阶奖励节点会优先展示对应风场奖励，并补足 3 个选项。
- 至少一个高阶奖励能在 runtime 中实际改变 HUD 或组合得分。
- 回归测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成记录

- 完成时间：2026-06-29
- 实现内容：新增 Cocos 高阶专属奖励池、风场奖励选择 helper，并让奖励弹层在高阶 run 中优先展示对应风场奖励。
- 奖励效果：第一版高阶奖励复用现有 run reward 状态，覆盖工具补偿、护符、备用槽、开局铜钱和组合分数加成。
- 验证结果：专项测试和 Cocos TypeScript 编译已通过，文档同步与 diff 检查在收尾命令执行。
