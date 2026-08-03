# T212 胡了卜 Cocos 无尽/每日事件变体完成记录

- 任务编号：T212
- 负责人：Lee
- 完成时间：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T212-hulebu-cocos-endless-daily-events.md`
- `docs/tasks/claims/T212-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 新增 `HULEBU_ENDLESS_SPECIAL_EVENTS` 和 `HULEBU_DAILY_SPECIAL_EVENTS`。
- 新增 `getHulebuModeSpecialEventPool()`，按 run profile 返回高阶、无尽或每日事件池。
- `getHulebuSpecialEventChoices()` 现在会优先展示模式专属事件，再用普通事件补足 3 个选项。
- 无尽事件第一版覆盖洗牌补给和尾盘撤回。
- 每日事件第一版覆盖铜钱补给和禁看山词缀压力。
- 回归测试覆盖主线不变、无尽/每日事件选择顺序和新事件 runtime effect。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- `npm run test -w packages/shared -- mahjong-cocos-project`：已通过，27 个测试通过。
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`：已通过。
- `npm run docs:sync`：已通过，同步 187 个任务分片和 179 个领取分片。
- `git diff --check`：已通过。

## 遗留问题

- 真实每日日期权重、构筑联动抽取、无尽章节事件权重和最终事件卡美术仍在后续任务中处理。
