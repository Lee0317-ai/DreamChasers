# T209 胡了卜 Cocos 高阶能力槽基础

- 任务编号：T209
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T205 已接入 Cocos 高阶入口，T207 已接入四档风场压力，T208 已接入高阶专属奖励。Web 完整版高阶还包含开局能力选择，用于让高阶不只是加压，而是在加压前给玩家选择一条承压方式。Cocos 需要补一个最小能力槽基础。

## 目标

1. Cocos 配置层新增第一版高阶能力配置。
2. 高阶 run 选择风场后先进入高阶能力选择，再进入本局流派选择。
3. 高阶能力能影响后续关卡 runtime，第一版复用本关 modifier 和本轮 reward state。
4. 普通主线、无尽、每日不显示高阶能力选择。
5. 补充静态和 runtime 测试。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-209-hulebu-cocos-advanced-ability-slot.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或静态 Demo。
- 不接账号同步、云存档或高阶解锁。
- 不做完整多槽装备、升级或替换系统。
- 不替换 Cocos 美术资源。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- 配置层存在高阶能力配置和选择 helper。
- 高阶 run 会先进入能力选择，再进入本局流派选择。
- 选择能力后，后续关卡 HUD 或分数能体现能力效果。
- 普通 run 不进入高阶能力选择。
- 回归测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成记录

- 完成时间：2026-06-29
- 实现内容：新增 Cocos 高阶能力配置、能力选择弹层和高阶 run 流程分支。高阶风场选择后会先选择能力，再进入本局流派选择。
- 能力效果：第一版能力会通过本轮 reward state 和每关 level modifier 生效，可影响护符、工具、铜钱等已有 runtime 状态。
- 验证结果：专项测试和 Cocos TypeScript 编译已通过，文档同步与 diff 检查在收尾命令执行。
