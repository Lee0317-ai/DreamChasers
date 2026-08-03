# T201：胡了卜 Cocos 本局流派基础接入

- 任务编号：T201
- 负责人：Lee
- 状态：已完成
- 创建日期：2026-06-28
- 模块：`docs/modules/mahjong-roguelike/`

## 背景

T200 已把局外长期成长接入 Cocos runtime。Web 版当前结构已收束为“局外长期成长 + 每局开局前选择本局打法流派”，Cocos 还缺本局流派状态和效果入口。

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
- `docs/completion/2026-06-28-task-201-hulebu-cocos-run-archetype-foundation.md`

禁止修改：

- Web 试玩页、站内静态 Demo、Prisma、账号进度相关文件。
- 非胡了卜 Cocos 模块。

## 实现内容

- 已新增 Cocos 本局流派配置和默认状态，第一版包含 `顺吃流 / 碰开流 / 开杠流 / 追胡流 / 道具流 / 信息流`。
- runtime 已接收本局流派，并把效果合入工具、铜钱和组合得分。
- Controller 已提供 `selectRunArchetype()` 开局前选择流派 API，并在启动关卡时传入 runtime。
- 回归测试已覆盖流派配置、Controller 接口和 runtime 工具、铜钱、杠分效果。

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
