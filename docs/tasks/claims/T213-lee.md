# T213 领取记录

- 任务编号：T213
- 任务名称：胡了卜 Cocos 本局流派事件偏置
- 负责人：Lee
- 领取时间：2026-06-29
- 状态：已完成

## 完成记录

- 完成时间：2026-06-29
- 结果：Cocos 事件节点已能根据本局流派优先展示对应事件，并继续保留主线、无尽、每日和高阶的模式事件补足逻辑。

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
