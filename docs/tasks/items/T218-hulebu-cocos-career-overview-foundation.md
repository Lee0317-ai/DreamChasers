# T218 胡了卜 Cocos 局外生涯总览基础

- 任务编号：T218
- 负责人：Lee
- 状态：已完成
- 优先级：P1
- 创建日期：2026-06-29

## 背景

T215-T217 已让 Cocos 大厅具备继续本轮、最近一轮摘要和本地长期进度，但局外层仍缺一个集中查看累计状态的入口。Cocos 继续追 Web 完整版时，需要先补一个最小“生涯”总览面板。

## 目标

1. 大厅新增 `生涯` 入口。
2. 新增 Cocos 局外生涯总览弹层。
3. 展示局外铜钱、六轴成长等级、最近一轮摘要。
4. 展示主线最近进度、无尽最高层、今日每日最佳和高阶最高风场。
5. 补共享静态测试和回归验证。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-218-hulebu-cocos-career-overview-foundation.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或静态 Demo。
- 不接账号同步、完整成就系统或完整图鉴分类卡面。
- 不改变现有 run mode、奖励、事件和 Boss 规则口径。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- 大厅新增 `生涯` 入口。
- `GameSceneController` 有局外生涯总览弹层。
- 弹层能展示局外铜钱、六轴成长等级、最近一轮摘要和长期进度。
- 共享测试、Cocos TypeScript 编译、文档同步和 diff 空白检查通过。

## 完成记录

- `GameSceneController` 新增 `collection` phase、`showCollectionOverlay()` 和 `drawCollectionSummary()`，大厅现在可打开 `生涯总览`。
- 生涯总览会集中展示当前本轮、最近一轮、局外铜钱、六轴成长等级、主线最近进度、无尽最高层、今日每日最佳和高阶最高风场。
- 共享静态测试已补对 `collection` phase、生涯按钮、总览 helper 和展示文案的回归断言。

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`npm run docs:sync`
- 通过：`git diff --check`
