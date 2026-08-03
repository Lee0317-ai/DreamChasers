# T214 胡了卜 Cocos Boss 变体基础完成记录

- 任务编号：T214
- 负责人：Lee
- 完成日期：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T214-hulebu-cocos-boss-variants.md`
- `docs/tasks/claims/T214-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 新增 Cocos Boss 变体配置，覆盖 `中段试炼 / 胡了卜王 / 高阶 Boss 变体 / 章节 Boss / 今日 Boss 变体`。
- 新增按 run profile 和显示关卡序号选择 Boss 变体的 helper。
- 新增 runtime level 工厂，把 Boss 变体目标补丁合入 Cocos 本关配置。
- Cocos 启动关卡时传入 run profile 和 display order，让高阶、无尽、每日 Boss 可获得正确变体。
- Boss HUD 摘要显示当前 Boss 变体名称。
- 补充共享回归测试，覆盖配置、选择、目标补丁和 HUD 文案。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`npm run docs:sync`
- 通过：`git diff --check`

## 遗留问题

- 本轮只接 Boss 变体数据和 HUD 摘要，未做 Boss 阶段动画、Boss 卡面美术、结算复盘或失败分析页。
