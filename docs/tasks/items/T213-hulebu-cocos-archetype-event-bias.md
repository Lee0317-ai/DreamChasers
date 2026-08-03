# T213 胡了卜 Cocos 本局流派事件偏置

- 任务编号：T213
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T201/T202 已让 Cocos 支持开局选择本局流派；T198/T210-T212 已补 Cocos 事件流程、高阶事件、事件元信息和无尽/每日事件变体。但事件选择目前只看 run mode，不看本局流派，距离 Web 完整版“本局流派主导奖励/事件/Boss 口径”的结构仍差一层。

## 目标

1. Cocos 配置层新增第一版本局流派事件池。
2. `getHulebuSpecialEventChoices()` 支持接收可选本局流派 id。
3. 事件节点在已有 run mode 事件池之前优先展示一张本局流派相关事件。
4. 主线/无尽/每日/高阶的模式事件池继续生效并补足 3 个选项。
5. 事件效果继续复用现有 `coin / tool / forbid_tool`，不新增 runtime effect 类型。
6. 补充静态和 runtime 回归测试。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-213-hulebu-cocos-archetype-event-bias.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或静态 Demo。
- 不接账号同步、云存档或真实构筑识别复盘。
- 不做完整事件权重算法、随机抽卡权重或最终事件卡美术。
- 不新增 runtime effect 类型。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- 配置层存在本局流派事件池。
- 事件选择 helper 可在传入流派 id 后优先返回对应事件。
- 主线不传流派时仍保持普通事件选择顺序。
- 无尽/每日/高阶传入流派时，流派事件优先，其后继续由模式事件池补足。
- 至少一个流派事件能通过现有 runtime modifier 生效。
- 回归测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成记录

- 完成时间：2026-06-29
- 实现内容：新增 Cocos 本局流派事件池，覆盖 `吃 / 碰 / 杠 / 胡 / 道具 / 信息` 六类流派；事件选择 helper 现在支持传入流派 id。
- 选择顺序：事件节点会按 `本局流派事件 -> run mode 事件 -> 普通事件` 的顺序补足 3 个选项。
- 事件效果：第一版复用现有 `coin / tool / forbid_tool`，不新增 runtime effect 类型。
- 验证结果：专项测试、Cocos TypeScript 编译、文档同步与 diff 检查已通过。
