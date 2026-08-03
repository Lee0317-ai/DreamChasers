# T213 胡了卜 Cocos 本局流派事件偏置完成记录

- 任务编号：T213
- 负责人：Lee
- 完成时间：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T213-hulebu-cocos-archetype-event-bias.md`
- `docs/tasks/claims/T213-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 新增 `HULEBU_ARCHETYPE_SPECIAL_EVENT_POOLS`，覆盖 `吃 / 碰 / 杠 / 胡 / 道具 / 信息` 六类本局流派事件。
- 新增 `getHulebuArchetypeSpecialEventPool()`。
- `getHulebuSpecialEventChoices()` 新增可选 `archetypeId` 参数。
- `GameSceneController` 在绘制关前事件时传入当前本局流派。
- 事件选择顺序调整为 `本局流派事件 -> run mode 事件 -> 普通事件`。
- 回归测试覆盖主线不传流派保持旧顺序、高阶/无尽/每日叠加流派事件，以及流派事件 runtime effect。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- `npm run test -w packages/shared -- mahjong-cocos-project`：已通过，27 个测试通过。
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`：已通过。
- `npm run docs:sync`：已通过，同步 188 个任务分片和 180 个领取分片。
- `git diff --check`：已通过。

## 遗留问题

- 完整事件权重算法、构筑识别复盘、事件卡美术和更深的流派事件池仍在后续任务中处理。
