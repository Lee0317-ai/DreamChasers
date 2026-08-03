# T210 胡了卜 Cocos 高阶事件池基础

- 任务编号：T210
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T198 已让 Cocos 支持关前特殊事件；T205-T209 已让 Cocos 高阶拥有入口、风场压力、专属奖励和能力槽。但事件节点仍只用普通事件池，无法体现 Web 完整版里高阶事件更贴风场、构筑和终局压力的特点。

## 目标

1. Cocos 配置层新增第一版高阶事件配置。
2. 高阶 run 的事件节点优先展示当前风场相关事件，再用普通事件补足 3 个选项。
3. 高阶事件复用现有事件 effect，能通过 runtime 本关修饰器真实生效。
4. 普通 run 继续使用普通事件池。
5. 补充静态和 runtime 测试。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-210-hulebu-cocos-advanced-events.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或静态 Demo。
- 不接账号同步、云存档或高阶解锁。
- 不做完整事件稀有度、构筑权重或事件卡美术。
- 不替换 Cocos 视觉资源。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- 配置层存在高阶事件配置和选择 helper。
- 高阶 run 事件节点优先给出风场相关事件，并补足 3 个选项。
- 至少一个高阶事件能通过 runtime modifier 改变本关 HUD。
- 普通 run 仍使用普通事件池。
- 回归测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成记录

- 完成时间：2026-06-29
- 实现内容：新增 Cocos 高阶特殊事件池和 profile-aware 事件选择 helper；高阶事件节点会优先展示当前风场事件，再用普通事件补足 3 个选项。
- 事件效果：第一版复用现有 `coin / tool / forbid_tool` 事件效果，并通过本关 modifier 进入 runtime。
- 验证结果：专项测试、Cocos TypeScript 编译、文档同步与 diff 检查已通过。
