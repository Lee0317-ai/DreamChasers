# T212 胡了卜 Cocos 无尽/每日事件变体

- 任务编号：T212
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T198 已让 Cocos 支持关前特殊事件，T210/T211 已补高阶事件池和事件元信息。但 Cocos 的无尽、每日模式仍主要复用普通事件池，无法体现 Web 完整版里无尽章节压力和每日词缀事件的差异。

## 目标

1. Cocos 配置层新增第一版无尽事件和每日事件配置。
2. `getHulebuSpecialEventChoices()` 根据 run profile 区分主线、无尽、每日和高阶事件优先池。
3. 无尽事件偏向章节续航、工具补给和长线压力。
4. 每日事件偏向今日词缀、奖励和轻风险选择。
5. 事件效果继续复用现有 `coin / tool / forbid_tool`，不新增 runtime effect 类型。
6. 补充静态和 runtime 回归测试。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-212-hulebu-cocos-endless-daily-events.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或静态 Demo。
- 不接账号同步、云存档或真实每日日期计算。
- 不做完整事件权重算法、构筑联动抽取或最终事件卡美术。
- 不新增 runtime effect 类型。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- 配置层存在无尽和每日事件池。
- 主线事件选择保持原普通事件池。
- 无尽 run 事件节点优先展示无尽事件，再用普通事件补足。
- 每日 run 事件节点优先展示每日事件，再用普通事件补足。
- 事件 effect 能通过现有 runtime modifier 生效。
- 回归测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成记录

- 完成时间：2026-06-29
- 实现内容：新增 Cocos 无尽事件池和每日事件池，并通过 `getHulebuModeSpecialEventPool()` 让事件选择按 run profile 优先展示模式专属事件。
- 事件效果：无尽事件覆盖洗牌补给和尾盘撤回；每日事件覆盖铜钱补给和禁看山词缀压力，均复用现有事件 effect。
- 验证结果：专项测试、Cocos TypeScript 编译、文档同步与 diff 检查已通过。
