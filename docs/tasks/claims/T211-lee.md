# T211 领取记录

- 任务编号：T211
- 任务名称：胡了卜 Cocos 事件元信息基础
- 负责人：Lee
- 领取时间：2026-06-29
- 状态：已完成

## 完成记录

- 完成时间：2026-06-29
- 结果：Cocos 事件配置已补 `rarity / tags / dangerLevel`，事件选择弹层会展示稀有度、风险和标签。

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
