# T207 领取记录

- 任务编号：T207
- 任务名称：胡了卜 Cocos 高阶风场压力基础
- 负责人：Lee
- 领取时间：2026-06-29
- 状态：已完成

## 完成记录

- 完成时间：2026-06-29
- 结果：Cocos 高阶风场已从入口 profile 扩展为每关实际 runtime 压力，四档会影响工具数量或禁用工具。

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-207-hulebu-cocos-advanced-wind-pressure.md`

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`
