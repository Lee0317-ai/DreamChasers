# T211 胡了卜 Cocos 事件元信息基础

- 任务编号：T211
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T198 已让 Cocos 支持关前特殊事件，T210 已让高阶 run 能优先抽到当前风场专属事件。但 Cocos 事件配置目前只有名称、说明和效果，缺少 Web 完整版中已经形成的 `稀有度 / 标签 / 风险提示` 信息，后续事件卡美术、构筑权重和高阶事件扩容都缺少稳定字段承接。

## 目标

1. Cocos 事件配置新增第一版 `rarity / tags / dangerLevel` 元信息。
2. 普通事件和高阶事件都带有可展示的元信息。
3. 事件选择弹层展示事件稀有度、标签和风险提示，让玩家能读出事件强弱与代价。
4. 事件选择逻辑和 runtime effect 保持 T198/T210 现有行为，不引入新的随机权重。
5. 补充静态回归测试，保护事件元信息和 Cocos UI 调用。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-211-hulebu-cocos-event-metadata.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或静态 Demo。
- 不接账号同步、云存档或高阶解锁。
- 不做完整事件权重算法、构筑联动抽取或最终事件卡美术。
- 不替换 Cocos 视觉资源。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- 事件配置类型包含 `rarity / tags / dangerLevel`。
- 普通事件和高阶事件至少各有一组明确元信息。
- Cocos 事件选择弹层会展示元信息，而不是只展示事件名和效果说明。
- 事件 effect 和普通/高阶事件选择顺序不发生回退。
- 回归测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成记录

- 完成时间：2026-06-29
- 实现内容：Cocos 普通/高阶事件配置已新增 `rarity / tags / dangerLevel` 元信息，并提供稀有度和风险等级展示文案。
- UI 表现：关前事件弹层会在事件名下显示 `稀有度 · 风险` 和前两个标签，先用现有程序化按钮承接，后续可替换为正式事件卡美术。
- 验证结果：专项测试、Cocos TypeScript 编译、文档同步与 diff 检查已通过。
