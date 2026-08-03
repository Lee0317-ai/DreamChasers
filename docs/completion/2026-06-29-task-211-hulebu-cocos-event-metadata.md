# T211 胡了卜 Cocos 事件元信息基础完成记录

- 任务编号：T211
- 负责人：Lee
- 完成时间：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T211-hulebu-cocos-event-metadata.md`
- `docs/tasks/claims/T211-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- `HulebuSpecialEventConfig` 新增 `rarity / tags / dangerLevel` 元信息字段。
- 普通事件和东/南/西/北高阶事件都补齐稀有度、标签和风险等级。
- 新增事件稀有度和风险等级展示文案。
- Cocos 关前事件弹层会在事件名下展示稀有度、风险和事件标签。
- 回归测试覆盖事件元信息、标签文案和 Controller 展示调用。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- `npm run test -w packages/shared -- mahjong-cocos-project`：已通过，27 个测试通过。
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`：已通过。
- `npm run docs:sync`：已通过，同步 186 个任务分片和 178 个领取分片。
- `git diff --check`：已通过。

## 遗留问题

- 事件抽取权重、构筑联动、每日/无尽事件变体和最终事件卡美术仍在后续任务中处理。
