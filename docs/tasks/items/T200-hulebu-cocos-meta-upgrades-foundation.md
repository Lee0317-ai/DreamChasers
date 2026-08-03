# T200：胡了卜 Cocos 局外成长基础接入

- 任务编号：T200
- 负责人：Lee
- 状态：已完成
- 创建日期：2026-06-28
- 模块：`docs/modules/mahjong-roguelike/`

## 背景

胡了卜 Web 版已有六轴局外长期成长：备用槽、满槽护符、初始道具、河道扩容、开局铜钱和看山预置。Cocos 已完成主线、奖励、事件、Boss、无尽/每日入口基础，但还不能承接局外成长信号。

## 范围

允许修改：

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/modules/mahjong-roguelike/**`
- `docs/tasks/**`
- `docs/progress/2026-06-28-lee.md`
- `docs/completion/2026-06-28-task-200-hulebu-cocos-meta-upgrades-foundation.md`

禁止修改：

- Web 试玩页、站内静态 Demo、Prisma、账号进度相关文件。
- 非胡了卜 Cocos 模块。

## 实现内容

- 已新增 Cocos 局外成长状态和默认配置。
- runtime 已合并局外成长到备用槽、护符、工具、牌河容量、开局铜钱和看山次数。
- Controller 已持有局外成长状态，并在启动 run 时带入 runtime。
- 回归测试已覆盖六轴局外成长对 HUD 和容量的影响。

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
