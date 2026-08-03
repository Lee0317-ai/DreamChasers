# T198：胡了卜 Cocos 特殊事件基础接入

- 任务编号：T198
- 负责人：Lee
- 状态：已完成
- 创建日期：2026-06-28
- 模块：`docs/modules/mahjong-roguelike/`

## 背景

胡了卜 Web 版已经完成特殊事件第二版，当前 Cocos 迁移已接入 v6 资源、牌河、补杠、震落、工具、Boss 和奖励效果。下一步需要把关前特殊事件的基础流程接入 Cocos，保证正式工程不只是线性闯关。

## 范围

允许修改：

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/modules/mahjong-roguelike/**`
- `docs/tasks/**`
- `docs/progress/2026-06-28-lee.md`
- `docs/completion/2026-06-28-task-198-hulebu-cocos-special-events.md`

禁止修改：

- Web 试玩页、站内静态 Demo、Prisma、账号进度相关文件。
- 非胡了卜 Cocos 模块。

## 实现内容

- 已新增 Cocos 特殊事件池与事件关卡节点，当前第 `6 / 8 / 10 / 14 / 18` 关前会触发事件选择。
- Cocos runtime 已新增本关事件修饰器，支持本关铜钱、工具补给、禁用工具。
- Controller 已在指定关卡前弹出事件选择，选择后进入对应关卡，事件效果只作用当前关。
- 回归测试已覆盖配置、runtime 修饰器和 controller 流程钩子。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 已通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 已通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 已通过：`npm run docs:sync`
- 已通过：`git diff --check`
